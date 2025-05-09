'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSync } from 'react-icons/fa';

import { Bill, BillItem } from '@/types';
import { generateBillNumber, formatDate } from '@/utils/billUtils';

import ItemEntryForm from '@/components/ItemEntryForm';
import BillDisplay from '@/components/BillDisplay';
import BillActions, { downloadPDF } from '@/components/BillActions';

export default function Home() {
  // State for current bill
  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState<BillItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerName, setCustomerName] = useState('');
  
  // State for UI control
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Initialize bill number on first load
  useEffect(() => {
    setBillNumber(generateBillNumber());
  }, []);

  // Calculate grand total whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setGrandTotal(total);
  }, [items]);

  // Add item to bill
  const addItem = (item: BillItem) => {
    setItems(prevItems => [...prevItems, item]);
  };

  // Remove item from bill
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Create new bill
  const createNewBill = () => {
    setItems([]);
    setDate(new Date());
    setBillNumber(generateBillNumber());
    setCustomerName('');
  };

  // PDF preview
  const openPDFPreview = () => {
    setShowPDFPreview(true);
  };

  // Close PDF preview
  const closePDFPreview = () => {
    setShowPDFPreview(false);
  };

  // Current bill object
  const currentBill: Bill = {
    billNumber,
    date,
    items,
    grandTotal,
    customerName: customerName.trim() || undefined
  };

  return (
    <main className="min-h-screen bg-gray-100 p-2 sm:p-6">
      <div className="max-w-xl mx-auto">
        <div className="space-y-4">
          {/* Bill Header Section */}
          <div className="bg-white p-4 rounded-lg shadow-md relative">
            <div className="absolute top-2 right-3 flex flex-col text-xs text-gray-400">
              <div className="flex items-center">
                <span className="font-medium mr-1">Bill#:</span>
                <span>{billNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">Date:</span>
                <span>{formatDate(date)}</span>
              </div>
              <div className="flex justify-end mt-1">
                <button 
                  onClick={createNewBill}
                  title="New Bill"
                  className="text-gray-400 hover:text-green-600 transition-colors"
                >
                  <FaSync size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center mb-2">
              <Image 
                src="/Logo.jpg" 
                alt="Malik Kirana Shop Logo" 
                width={80} 
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Malik Kirana Shop
              </h1>
              <p className="text-xs text-gray-600">
                Chichpada Naka, Vasai (E), 401208
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Mobile: +91 9834540990
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex items-center border-b border-gray-300 py-1 mb-2">
                  <label htmlFor="customerName" className="font-medium text-gray-700 mr-2 text-sm">
                    Customer:
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="flex-grow p-0 border-none focus:ring-0 focus:outline-none text-sm"
                    placeholder="Enter customer name..."
                    title="Customer Name"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Item Entry Form */}
          <ItemEntryForm addItem={addItem} />
          
          {/* Bill Display */}
          {items.length > 0 ? (
            <>
              <BillDisplay bill={currentBill} removeItem={removeItem} />
              <BillActions bill={currentBill} openPDFPreview={openPDFPreview} />
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No items added to bill yet. Use the form above to add items.
            </div>
          )}
        </div>

        {/* PDF Preview Modal */}
        {showPDFPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 z-50">
            <div className="bg-white rounded-lg w-full max-h-screen overflow-y-auto">
              <div className="p-3 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">PDF Preview</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      downloadPDF(currentBill);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Download
                  </button>
                  <button 
                    onClick={closePDFPreview}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-2">
                <BillDisplay bill={currentBill} isPreview={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
