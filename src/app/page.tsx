'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Bill, BillItem, SampleBill } from '@/types';
import { generateBillNumber, sampleBills } from '@/utils/billUtils';

import ItemEntryForm from '@/components/ItemEntryForm';
import BillDisplay from '@/components/BillDisplay';
import BillActions, { downloadPDF } from '@/components/BillActions';
import BillSearch from '@/components/BillSearch';

export default function Home() {
  // State for current bill
  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState<BillItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  
  // State for UI control
  const [activeTab, setActiveTab] = useState<'new' | 'search'>('new');
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [viewingBill, setViewingBill] = useState<SampleBill | null>(null);

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
    setActiveTab('new');
  };

  // View a past bill
  const viewBill = (bill: SampleBill) => {
    setViewingBill(bill);
  };

  // Close bill view
  const closeViewBill = () => {
    setViewingBill(null);
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
    grandTotal
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Malik Kirana Shop
          </h1>
          <p className="text-gray-600">
            Simple Billing Application
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'new' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('new')}
          >
            New Bill
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'search' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search Bills
          </button>
        </div>

        {/* New Bill Content */}
        {activeTab === 'new' && (
          <div className="space-y-6">
            {/* Bill Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Number
                </label>
                <input
                  type="text"
                  value={billNumber}
                  readOnly
                  className="block w-full p-2 bg-gray-50 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null) => date && setDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Select date"
                  title="Select date"
                />
              </div>
              
              <div className="sm:self-end">
                <button
                  onClick={createNewBill}
                  className="w-full sm:w-auto bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700"
                >
                  New Bill
                </button>
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
        )}

        {/* Search Bills Content */}
        {activeTab === 'search' && (
          <BillSearch 
            sampleBills={sampleBills} 
            viewBill={viewBill} 
          />
        )}

        {/* Bill View Modal */}
        {viewingBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Bill Details</h2>
                <button 
                  onClick={closeViewBill}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <BillDisplay bill={viewingBill} isPreview={true} />
              </div>
            </div>
          </div>
        )}

        {/* Print Preview Modal */}
        {showPDFPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">PDF Preview</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      downloadPDF(currentBill);
                    }}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Download PDF
                  </button>
                  <button 
                    onClick={closePDFPreview}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-4">
                <BillDisplay bill={currentBill} isPreview={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
