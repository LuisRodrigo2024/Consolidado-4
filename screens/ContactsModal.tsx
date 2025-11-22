import React, { useState } from 'react';
import { CONTACTS_DATA } from '../constants';
import type { Contact } from '../types';
import { CloseIcon, SearchIcon, SortIcon, EditIcon, AddIcon, RefreshIcon } from '../components/icons/iconsClientes';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'list' | 'form';

export const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ModalView>('list');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  if (!isOpen) {
    return null;
  }
  
  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setView('form');
  };
  
  const handleAddNew = () => {
    setSelectedContact(null);
    setView('form');
  };

  const handleSave = () => {
    // In a real app, you'd save the data here
    setView('list');
  };

  const headers = ['TIPO_CONTACTO', 'VALOR_CONTACTO', 'EDITAR'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Contactos</h2>

        {view === 'list' && (
          <>
            <div className="relative w-full max-w-sm mx-auto my-4">
              <input 
                  type="text" 
                  className="border-2 border-gray-300 bg-white h-10 px-5 pr-12 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
                  placeholder="Buscar Contacto..."
              />
              <button type="button" onClick={() => {}} className="absolute right-0 top-0 mt-1 mr-1 p-2 bg-blue-600 rounded-md hover:bg-blue-700">
                  <SearchIcon className="text-white h-4 w-4" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-80 border rounded-lg">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-white uppercase bg-blue-600 sticky top-0">
                  <tr>
                    {headers.map(header => (
                      <th key={header} scope="col" className="px-6 py-3 font-bold">
                        <div className="flex items-center gap-2">
                          {header}
                          {header !== 'EDITAR' && <SortIcon className="w-4 h-4" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {CONTACTS_DATA.map((contact) => (
                    <tr key={contact.id} className="bg-white hover:bg-gray-50">
                      <td className="px-6 py-4">{contact.tipo}</td>
                      <td className="px-6 py-4">{contact.valor}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEdit(contact)} className="bg-slate-600 text-white p-2 rounded-md hover:bg-slate-700">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all shadow"
              >
                NUEVO CONTACTO
                <AddIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {view === 'form' && (
          <div className="mt-6 flex flex-col items-center">
             <h3 className="text-lg font-semibold mb-4">{selectedContact ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
             <div className="w-full max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Tipo de Contacto:</label>
                    <select
                        defaultValue={selectedContact?.tipo || 'Telefono Celular'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option>Telefono Celular</option>
                        <option>Whatsapp</option>
                        <option>Correo</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">*Valor del Contacto:</label>
                    <input
                        type="text"
                        defaultValue={selectedContact?.valor || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
             </div>
             <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-800 transition-all shadow mt-8"
              >
                GUARDAR CAMBIOS
                <RefreshIcon className="w-5 h-5" />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};
