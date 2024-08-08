"use client";
import React, { useEffect, useState } from 'react';

interface Item {
  type: 'Paragraph' | 'Button';
  content: string;
  alertMessage?: string;
}

const ViewItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('droppedItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  return (
    <div className="p-12">
      <div className='flex flex-col items-center'>
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            {item.type === 'Paragraph' ? (
              <p className="p-4">{item.content}</p>
            ) : (
              <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={() => alert(item.alertMessage)}>
                {item.content}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewItems;
