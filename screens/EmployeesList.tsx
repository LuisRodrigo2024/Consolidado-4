import React, { useState } from 'react';
import { SearchIcon } from '../components/icons/IconsTransporte';
import { UserGroupIcon } from '../components/icons/IconsTransporte';
import { PlusIcon } from '../components/icons/IconsTransporte';
import { PencilIcon } from '../components/icons/IconsTransporte';
import { Employee } from '../types';
import PageHeader from './PageHeader';
import EmployeeFormModal from './EmployeeFormModal';
import PromptModal from './PromptModal';
import StatusBadge from './StatusBadge';

interface EmployeesListProps {
  employees: Employee[];
  onBack: () => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (employee: Employee) => void;
  nextEmployeeCode: string;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ employees, onBack, onAddEmployee, onUpdateEmployee, nextEmployeeCode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditPromptOpen, setEditPromptOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const existingCodigos = employees.map(e => e.codigo);

  const handlePromptConfirm = (codigo: string) => {
    const employee = employees.find(e => e.codigo.toLowerCase() === codigo.toLowerCase());
    if (employee) {
        setEmployeeToEdit(employee);
    }
    setEditPromptOpen(false);
  };
  
  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'> | Employee) => {
    if ('id' in employeeData) {
      onUpdateEmployee(employeeData as Employee);
    } else {
      onAddEmployee(employeeData);
    }
    setAddModalOpen(false);
    setEmployeeToEdit(null);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.estado !== 'Inactivo' &&
    (employee.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.brevete.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title="Gestión de Empleados"
          icon={<UserGroupIcon className="h-8 w-8 text-violet-800" />}
          onBack={onBack}
        />

        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-200">
            <div className="relative">
              <label htmlFor="search-employees" className="sr-only">Buscar Empleados</label>
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                id="search-employees"
                type="search"
                className="border border-slate-300 bg-white h-11 px-4 pl-11 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 text-black"
                placeholder="Buscar por nombre, código o brevete..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setAddModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm">
                <PlusIcon className="h-5 w-5 mr-2" />
                Añadir Empleado
              </button>
              <button onClick={() => setEditPromptOpen(true)} className="flex items-center bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 border border-slate-300 shadow-sm">
                <PencilIcon className="h-5 w-5 mr-2 text-slate-600" />
                Editar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">Código</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Teléfono</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Brevete</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Fecha de Vencimiento</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-600">{employee.codigo}</td>
                      <td className="py-4 px-6">{employee.nombre}</td>
                      <td className="py-4 px-6">{employee.telefono}</td>
                      <td className="py-4 px-6">{employee.brevete}</td>
                      <td className="py-4 px-6">{formatDate(employee.fechaVencimiento)}</td>
                      <td className="py-4 px-6"><StatusBadge status={employee.estado} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-500 font-semibold">
                        No se encontraron empleados.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {(isAddModalOpen || employeeToEdit) && (
        <EmployeeFormModal 
          onClose={() => { setAddModalOpen(false); setEmployeeToEdit(null); }}
          onSave={handleSaveEmployee}
          initialData={employeeToEdit}
          existingCodigos={existingCodigos}
          nextEmployeeCode={nextEmployeeCode}
        />
      )}
      
      {isEditPromptOpen && (
        <PromptModal
          action="edit"
          itemType="Empleado"
          identifierName="código"
          placeholder="Ej: EMP001"
          onClose={() => setEditPromptOpen(false)}
          onConfirm={handlePromptConfirm}
          existingIdentifiers={existingCodigos}
        />
      )}
    </>
  );
};

export default EmployeesList;
