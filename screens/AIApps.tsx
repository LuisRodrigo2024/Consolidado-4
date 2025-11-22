
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon, SparklesIcon, CloseIcon, SaveIcon, PaperclipIcon } from '../components/icons/IconsAbastecimiento';

// --- API HELPER ---
// NOTE: In a real production app, calls should be proxied through a backend to protect the API Key.
// For this prototype, we use the env variable directly as requested.
const getAIClient = () => {
    if (!process.env.API_KEY) {
        console.error("API_KEY no configurada");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- COMMON COMPONENTS ---
const AIHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="flex items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-4">
            <BackIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
    </div>
);

const ResponseBox: React.FC<{ content: string; isLoading: boolean }> = ({ content, isLoading }) => (
    <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-xl min-h-[150px]">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Respuesta de Gemini</h3>
        {isLoading ? (
            <div className="flex items-center space-x-2 text-blue-600 animate-pulse">
                <SparklesIcon className="w-5 h-5" />
                <span>Generando respuesta...</span>
            </div>
        ) : (
            <div className="prose text-gray-800 whitespace-pre-wrap">{content || "Los resultados aparecerán aquí..."}</div>
        )}
    </div>
);


// --- APP 1: CHAT ASSISTANT ---
export const AIChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = getAIClient();
            if (ai) {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: userMsg,
                    config: {
                        systemInstruction: "Eres un asistente experto en logística y abastecimiento. Responde de forma concisa y profesional."
                    }
                });
                setMessages(prev => [...prev, { role: 'model', text: response.text || "Error generando respuesta." }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "API Key no encontrada." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Ocurrió un error al contactar a la IA." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
            <AIHeader title="Asistente de Compras (Chat)" onBack={onBack} />
            <div className="flex-1 overflow-y-auto bg-white border rounded-xl p-4 shadow-inner mb-4 space-y-4 max-h-[60vh]">
                {messages.length === 0 && <p className="text-center text-gray-400 mt-10">Comienza una conversación con tu asistente de abastecimiento.</p>}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-900 rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-gray-400 text-sm animate-pulse ml-2">Escribiendo...</div>}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escribe tu consulta aquí..."
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">Enviar</button>
            </div>
        </div>
    );
};


// --- APP 2: VISION DOCUMENT ANALYSIS ---
export const AIVisionScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [image, setImage] = useState<string | null>(null);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setIsLoading(true);
        try {
            const ai = getAIClient();
            if (ai) {
                // Simulating base64 extraction for the example. 
                // In real integration, ensure proper base64 formatting (strip data:image/...;base64,)
                const base64Data = image.split(',')[1]; 
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                            { text: "Analiza esta imagen. Si es una factura o guía de remisión, extrae: Proveedor, Fecha, Número de Documento y Lista de Items con cantidades. Devuélvelo en formato Markdown." }
                        ]
                    }
                });
                setResult(response.text || "No se pudo extraer texto.");
            }
        } catch (error) {
            setResult("Error al analizar la imagen. Asegúrese de que la API Key sea válida.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <AIHeader title="Analizador de Documentos (Visión)" onBack={onBack} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {image ? (
                            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                        ) : (
                            <div className="text-gray-500">
                                <PaperclipIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>Haz clic o arrastra una imagen aquí</p>
                                <p className="text-xs mt-1">(Facturas, Guías, Recibos)</p>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleAnalyze} 
                        disabled={!image || isLoading} 
                        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Analizando...' : 'Analizar Documento'}
                    </button>
                </div>
                <div>
                    <ResponseBox content={result} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};


// --- APP 3: EMAIL GENERATOR ---
export const AIEmailGeneratorScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [topic, setTopic] = useState('');
    const [recipient, setRecipient] = useState('');
    const [tone, setTone] = useState('Formal');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const ai = getAIClient();
            if (ai) {
                const prompt = `Escribe un correo electrónico para el proveedor "${recipient}".
                Motivo: ${topic}.
                Tono: ${tone}.
                Incluye asunto sugerido y cuerpo del correo.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setResult(response.text || "");
            }
        } catch (error) {
            setResult("Error al generar el correo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <AIHeader title="Redactor de Correos" onBack={onBack} />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proveedor</label>
                    <input type="text" className="w-full rounded-lg border-gray-300" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Ej: Aceros Arequipa" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del Correo</label>
                    <textarea className="w-full rounded-lg border-gray-300" rows={3} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ej: Solicitar descuento por volumen en la próxima compra de cemento..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tono</label>
                    <select className="w-full rounded-lg border-gray-300" value={tone} onChange={e => setTone(e.target.value)}>
                        <option>Formal</option>
                        <option>Urgente</option>
                        <option>Amable</option>
                        <option>Negociador</option>
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={isLoading || !topic} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Generar Borrador
                </button>
            </div>
            <ResponseBox content={result} isLoading={isLoading} />
        </div>
    );
};


// --- APP 4: PRODUCT CATALOGER ---
export const AIProductCatalogerScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [productName, setProductName] = useState('');
    const [features, setFeatures] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const ai = getAIClient();
            if (ai) {
                const prompt = `Actúa como un experto en marketing B2B. Crea una descripción de producto atractiva y una lista de beneficios clave para:
                Producto: ${productName}
                Características técnicas: ${features}.
                El público objetivo son constructoras y ferreterías.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setResult(response.text || "");
            }
        } catch (error) {
            setResult("Error al generar descripción.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <AIHeader title="Catalogador de Productos" onBack={onBack} />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                    <input type="text" className="w-full rounded-lg border-gray-300" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Ej: Taladro Percutor Industrial 800W" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Características Técnicas (Keywords)</label>
                    <textarea className="w-full rounded-lg border-gray-300" rows={2} value={features} onChange={e => setFeatures(e.target.value)} placeholder="Ej: 800W, velocidad variable, reversible, mandril metálico..." />
                </div>
                <button onClick={handleGenerate} disabled={isLoading || !productName} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors">
                    Crear Ficha Comercial
                </button>
            </div>
            <ResponseBox content={result} isLoading={isLoading} />
        </div>
    );
};


// --- APP 5: STRATEGY REASONING ---
export const AIStrategyScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [scenario, setScenario] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            const ai = getAIClient();
            if (ai) {
                const prompt = `Utiliza tu capacidad de razonamiento para analizar el siguiente escenario de abastecimiento:
                "${scenario}"
                
                Proporciona:
                1. Análisis de Riesgos.
                2. Estrategia de Compra recomendada (Corto vs Largo plazo).
                3. Sugerencias de negociación.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                         thinkingConfig: { thinkingBudget: 1024 } // Using thinking budget for reasoning
                    }
                });
                setResult(response.text || "");
            }
        } catch (error) {
            setResult("Error en el análisis estratégico.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <AIHeader title="Estratega de Abastecimiento" onBack={onBack} />
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <p className="text-sm text-gray-600">Describe un escenario complejo o un cambio en el mercado para recibir asesoramiento estratégico.</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escenario / Problema</label>
                    <textarea className="w-full rounded-lg border-gray-300" rows={4} value={scenario} onChange={e => setScenario(e.target.value)} placeholder="Ej: Se prevé un aumento del 15% en el precio del acero el próximo mes debido a escasez internacional. Tenemos stock para 2 semanas. ¿Deberíamos comprar por adelantado?" />
                </div>
                <button onClick={handleAnalyze} disabled={isLoading || !scenario} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                    Analizar Estrategia
                </button>
            </div>
            <ResponseBox content={result} isLoading={isLoading} />
        </div>
    );
};
