'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <Header onMenuToggle={toggleSidebar} />
          
          {/* Main content */}
          <MainContent />
        </div>
      </div>
    </div>
  );
}
