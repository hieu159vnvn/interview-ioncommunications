
"use client";
import React, { useState,useEffect, DragEvent } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

type ItemType = 'Paragraph' | 'Button';

interface Item {
  type: ItemType;
  content: string;
  alertMessage?: string;
}
interface Props {
  mouse: {
    x: number;
    y: number;
  };
}

const DraggableComponent: React.FC<Props> = (props) => {
  const { mouse } = props;
  const [items, setItems] = useState<Item[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newText, setNewText] = useState<string>('');
  const [newAlert, setNewAlert] = useState<string>('');
  const [history, setHistory] = useState<Item[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [draggingItemType, setDraggingItemType] = useState<ItemType | null>(null); 

  const router = useRouter(); 

  useEffect(() => {
    // Load items from localStorage when the component mounts
    const savedItems = localStorage.getItem('droppedItems');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems);
      setHistory([parsedItems]); // Initialize history with the loaded items
      setHistoryIndex(0);
    }
  }, []);
  const handleDragStart = (e: DragEvent<HTMLDivElement>, itemType: ItemType) => {
    e.dataTransfer.setData('text', itemType);
    setDraggingItemType(itemType); // Update the dragging item type
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingItemType(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('text') as ItemType;
    const newItem: Item = {
      type: itemType,
      content: itemType === 'Paragraph' ? 'New paragraph' : 'New button',
      alertMessage: itemType === 'Button' ? 'Alert message' : undefined,
    };
    // Update history before adding new item
    const newItems = [...items, newItem];
    updateHistory(newItems);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setNewText(items[index].content);
    if (items[index].type === 'Button' && items[index].alertMessage) {
      setNewAlert(items[index].alertMessage);
    }
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedItems = items.slice();
      updatedItems[editIndex] = {
        ...updatedItems[editIndex],
        content: newText,
        alertMessage: newAlert || undefined,
      };
      updateHistory(updatedItems);
      setEditIndex(null);
      setNewText('');
      setNewAlert('');
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setNewText('');
    setNewAlert('');
  };

  const updateHistory = (newItems: Item[]) => {
    // Save the current state before making changes
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setItems(newItems);
  };
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevItems = history[historyIndex - 1];
      setItems(prevItems);
      setHistoryIndex(historyIndex - 1);
    }
    console.log(history);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextItems = history[historyIndex + 1];
      setItems(nextItems);
      setHistoryIndex(historyIndex + 1);
    }
  };
  const handleView = () => {
    router.push('/consumer');
  };
  // Calculate the counts of Paragraphs and Buttons
  const paragraphCount = items.filter(item => item.type === 'Paragraph').length;
  const buttonCount = items.filter(item => item.type === 'Button').length;
  // Save items to localStorage
  const handleSaveItems = () => {
    localStorage.setItem('droppedItems', JSON.stringify(items));
    alert('Items saved!');
  };
  const handleClearItems = () => {
    localStorage.removeItem('droppedItems');
    setItems([]);
    confirm('This will clear all items!');
  };

  return (
    <>
      <div className="flex justify-center pt-4 w-full gap-5">
        <button
          onClick={handleSaveItems}
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={handleClearItems}
          className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear
        </button>
        <button
          onClick={handleUndo}
          className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Redo
        </button>
        <button
        onClick={handleView}
        className="py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        View
        </button>
      </div>
      <div className="p-12 flex gap-10">
        <div className="mb-8 basis-1/4 flex">
          <div className="basis-1/3 flex flex-col items-center justify-start gap-5">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'Paragraph')}
              className="p-4 border-2 border-gray-500 rounded cursor-move w-fit"
            >
              <p className="text-lg text-gray-800 w-20">Paragraph</p>
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'Button')}
              className="p-4 border-2 border-gray-500 rounded cursor-move w-fit"
            >
              <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 w-20">
                Button
              </button>
            </div>
          </div>
          <div className=" basis-2/3">
            <p className="text-gray-600">Mouse: ({mouse.x}, {mouse.y})</p>
            <p className="text-gray-800">Dragging: {draggingItemType}</p>
            <p className="text-gray-800">Instances: {paragraphCount + buttonCount}</p>
          </div>
        </div>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-gray-400 p-8 rounded min-h-[200px] basis-3/4"
        >
          <p className="text-center text-gray-600">Drop items here</p>
          <div className="mt-4">
            {items.map((item, index) => (
              <div key={index} className="mb-2">
                {editIndex === index ? (
                  <div className="relative">
                    <p>Text</p>
                    <input
                      type="text"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="p-2 border rounded mb-2 w-full"
                      autoFocus
                    />
                    {item.type === 'Button' && (
                      <>
                        <p>Alert Message</p>
                        <input
                          type="text"
                          value={newAlert}
                          onChange={(e) => setNewAlert(e.target.value)}
                          placeholder="Alert message"
                          className="p-2 border rounded mb-2 w-full"
                        />
                      </>
                    )}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : item.type === 'Paragraph' ? (
                  <p
                    className="p-4 border border-gray-300 rounded cursor-pointer"
                    onClick={() => handleEdit(index)}
                  >
                    {item.content}
                  </p>
                ) : (
                  <button
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    onClick={() => handleEdit(index)}
                  >
                    {item.content}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DraggableComponent;
