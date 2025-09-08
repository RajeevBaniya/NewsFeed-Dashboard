import React from 'react';
import Icon from './Icon';

/**
 * Test component to verify icons are working properly
 * This can be temporarily added to any page to test icon visibility
 */
export default function IconTest() {
  const testIcons = [
    'menu', 'sun', 'moon', 'search', 'heart', 'save', 'filter', 'grid', 'list'
  ];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Icon Test</h3>
      <div className="grid grid-cols-3 gap-4">
        {testIcons.map((iconName) => (
          <div key={iconName} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded">
            <Icon name={iconName} size="md" />
            <span className="text-sm">{iconName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
