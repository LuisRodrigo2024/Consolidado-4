
import React from 'react';
import { Screen } from '../types';
import { SparklesIcon, ClientsIcon, FilePlusIcon, SearchIcon, MonitoringIcon, ClipboardListIcon } from '../components/icons/IconsAbastecimiento';

interface AIHubProps {
  onNavigate: (screen: Screen) => void;
}

interface AICardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    colorClass: string;
}

const AICard: React.FC<AICardProps> = ({ icon, title, description, onClick, colorClass }) => {
    return (
        <div 
            className={`flex flex-col items-start p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white`}
            onClick={onClick}
        >
            <div className={`p-3 rounded-lg mb-4 ${colorClass} text-white`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
};

const AIHub: React.FC<AIHubProps> = ({ onNavigate }) => {
  const tools = [
    { 
        id: 1, 
        title: 'Asistente de Compras', 
        description: 'Chatbot inteligente para resolver dudas sobre proveedores, procesos de compra y estado de pedidos.',
        icon: <ClientsIcon className="w-8 h-8" />, 
        screen: Screen.AIChat,
        colorClass: 'bg-blue-500'
    },
    { 
        id: 2, 
        title: 'Analizador de Guías', 
        description: 'Extrae información automáticamente de guías de remisión o facturas escaneadas mediante visión por computadora.',
        icon: <ClipboardListIcon className="w-8 h-8" />, 
        screen: Screen.AIVision,
        colorClass: 'bg-purple-500'
    },
    { 
        id: 3, 
        title: 'Redactor de Correos', 
        description: 'Genera borradores de correos electrónicos formales para negociaciones, reclamos o solicitudes a proveedores.',
        icon: <FilePlusIcon className="w-8 h-8" />, 
        screen: Screen.AIEmailGenerator,
        colorClass: 'bg-green-500'
    },
    { 
        id: 4, 
        title: 'Catalogador de Productos', 
        description: 'Crea descripciones de marketing atractivas y fichas técnicas basadas en datos básicos del producto.',
        icon: <SearchIcon className="w-8 h-8" />, 
        screen: Screen.AIProductCataloger,
        colorClass: 'bg-orange-500'
    },
    { 
        id: 5, 
        title: 'Estratega de Abastecimiento', 
        description: 'Analiza escenarios de mercado y sugiere estrategias de compra para optimizar costos y stock.',
        icon: <MonitoringIcon className="w-8 h-8" />, 
        screen: Screen.AIStrategy,
        colorClass: 'bg-red-500'
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
             <div className="w-16 h-16 mr-4 p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-10 h-10 text-white"/>
            </div>
            <div>
                <h1 className="text-4xl font-bold text-gray-800">Centro de Inteligencia Artificial</h1>
                <p className="text-lg text-gray-500 mt-1">Potencia tu gestión de abastecimiento con herramientas Generativas de Google Gemini.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
                <AICard
                    key={tool.id}
                    title={tool.title}
                    description={tool.description}
                    icon={tool.icon}
                    colorClass={tool.colorClass}
                    onClick={() => onNavigate(tool.screen)}
                />
            ))}
        </div>
    </div>
  );
};

export default AIHub;
