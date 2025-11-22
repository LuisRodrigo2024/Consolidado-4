import React, { useState } from 'react';
import type { Maestro, Premio } from '../types';
import { GiftIcon, AddIcon, TrashIcon, CloseIcon, CheckIcon } from '../components/icons/iconsClientes';
import { AnadirPremioModal } from './AnadirPremioModal';

interface CanjeoViewProps {
  maestro: Maestro;
  onBack: () => void;
}

type SelectedPremio = Premio & { cantidad: number };

export const CanjeoView: React.FC<CanjeoViewProps> = ({ maestro, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPremios, setSelectedPremios] = useState<SelectedPremio[]>([
    { id: 'PR-006', nombre: 'Vales de compra', descripcion: '', costo: 20, categoria: '', cantidad: 1 },
    { id: 'PR-014', nombre: 'Pala', descripcion: '', costo: 35, categoria: '', cantidad: 2 },
    { id: 'PR-035', nombre: 'Televisor', descripcion: '', costo: 270, categoria: '', cantidad: 1 },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const headers = ['PREMIO', 'DESCRIPCIÓN', 'CANTIDAD', 'COSTO UNITARIO', 'MONTO', ''];
  const puntosDisponibles = 3800;
  const puntosGastados = selectedPremios.reduce((acc, p) => acc + (p.costo * p.cantidad), 0);
  const nuevoTotal = puntosDisponibles - puntosGastados;

  const handleRemovePremio = (id: string) => {
    setSelectedPremios(premios => premios.filter(p => p.id !== id));
  };
  
  const handleAddPremios = (nuevosPremios: SelectedPremio[]) => {
      const updatedPremios = [...selectedPremios];
      nuevosPremios.forEach(newPremio => {
          const existingIndex = updatedPremios.findIndex(p => p.id === newPremio.id);
          if (existingIndex > -1) {
              updatedPremios[existingIndex].cantidad += newPremio.cantidad;
          } else {
              updatedPremios.push(newPremio);
          }
      });
      setSelectedPremios(updatedPremios);
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg relative text-gray-900">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <GiftIcon className="w-12 h-12 text-blue-600" />
          <h2 className="text-4xl font-bold">Canjeo</h2>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>Fecha: 02/11/2025</p>
          <p>Hora: 12:31h</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border p-2 rounded-lg mb-6 text-sm">
        <p><span className="font-semibold">Operador(a):</span> Pablo, Torres</p>
        <p><span className="font-semibold">Maestro:</span> {maestro.nombre}, {maestro.apellidos}</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold">Nuevo Canje</h3>
        <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">C-009</span>
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-white">
            <tr>{headers.map(h => <th key={h} className="px-4 py-2 text-left font-bold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {selectedPremios.map(p => (
              <tr key={p.id} className="text-black">
                <td className="px-4 py-2 font-semibold">{p.id}</td>
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.cantidad}</td>
                <td className="px-4 py-2">{p.costo}</td>
                <td className="px-4 py-2">{p.costo * p.cantidad}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleRemovePremio(p.id)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-orange-400 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-500">
            <AddIcon className="w-5 h-5"/> AÑADIR PREMIO
          </button>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
            <span className="font-semibold text-right">Puntos Disponibles:</span>
            <div className="bg-slate-700 text-white text-center rounded px-2 py-1">{puntosDisponibles}</div>
            <span className="font-semibold text-right">Puntos Gastados:</span>
            <div className="bg-slate-700 text-white text-center rounded px-2 py-1">{puntosGastados}</div>
            <span className="font-semibold text-right">Nuevo Total:</span>
            <div className="bg-slate-700 text-white text-center rounded px-2 py-1">{nuevoTotal}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-slate-800 text-white font-bold text-2xl px-6 py-3 rounded-lg">
            Total: {puntosGastados}
          </div>
          <button onClick={() => setShowSuccess(true)} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center gap-2">
            Canjear <AddIcon className="w-5 h-5"/>
          </button>
          <button onClick={onBack} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 flex items-center justify-center gap-2">
            CANCELAR <CloseIcon className="w-4 h-4"/>
          </button>
        </div>
      </div>
      
      {showSuccess && (
        <div className="absolute inset-0 bg-emerald-400 bg-opacity-90 flex flex-col justify-center items-center rounded-lg">
          <div className="bg-emerald-800 p-6 rounded-full">
            <CheckIcon className="w-24 h-24 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-black mt-6">CANJE REGISTRADO</h2>
          <button onClick={onBack} className="mt-8 bg-emerald-800 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-emerald-900 text-lg">
            Volver al Perfil
          </button>
        </div>
      )}

      <AnadirPremioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPremios={handleAddPremios} />
    </div>
  );
};