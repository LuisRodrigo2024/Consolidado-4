
import React from 'react';
import Sidebar from './Sidebar';
import { Screen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate?: (screen: Screen) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="flex h-screen font-sans">
      <Sidebar onNavigate={onNavigate} />
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;