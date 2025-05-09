import { useState } from 'react';
import { BillItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ItemEntryFormProps {
  addItem: (item: BillItem) => void;
}

export default function ItemEntryForm({ addItem }: ItemEntryFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter item name');
      return;
    }
    
    if (!price) {
      setError('Please enter price');
      return;
    }
    
    if (!quantity) {
      setError('Please enter quantity');
      return;
    }

    // Create new item
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    
    const newItem: BillItem = {
      id: uuidv4().slice(0, 8),
      name,
      price: numPrice,
      quantity: numQuantity,
      total: numPrice * numQuantity,
    };

    // Add to bill
    addItem(newItem);
    
    // Reset form
    setName('');
    setPrice('');
    setQuantity('');
    setError('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Add Item</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g., Rice, Sugar, etc."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Price per unit"
              inputMode="decimal"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? parseFloat(e.target.value) : '')}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Quantity"
              inputMode="decimal"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
} 