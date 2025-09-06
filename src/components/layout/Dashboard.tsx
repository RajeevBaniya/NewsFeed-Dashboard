'use client';

import { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from './Header';
import MainContent from '../content/MainContent';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('feed');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Main content area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Main content */}
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
}
