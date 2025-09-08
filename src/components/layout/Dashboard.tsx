'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../sidebar/Sidebar';
import Header from './Header';
import MainContent from '../content/MainContent';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const routeSection = (pathname || '/feed').split('/')[1] || 'feed';
  const activeSection = routeSection === '' ? 'feed' : routeSection;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (_section: string) => { /* route-driven; no-op */ };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-visible">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Main content area */}
      <div className="lg:ml-56 flex flex-col min-h-screen overflow-visible">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Main content */}
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
}
