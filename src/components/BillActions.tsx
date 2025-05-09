import { useState } from 'react';
import { Bill } from '@/types';
import { 
  FaPrint, 
  FaWhatsapp, 
  FaSms, 
  FaDownload 
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/utils/billUtils';

interface BillActionsProps {
  bill: Bill;
  openPrintPreview: () => void;
}

export default function BillActions({ bill, openPrintPreview }: BillActionsProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const generateTextBill = (): string => {
    let text = `*Malik Kirana Shop*\n`;
    text += `Bill No: ${bill.billNumber}\n`;
    text += `Date: ${formatDate(bill.date)}\n\n`;
    text += `*Items:*\n`;
    
    bill.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} - ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.total)}\n`;
    });
    
    text += `\n*Grand Total: ${formatCurrency(bill.grandTotal)}*\n`;
    text += `\nThank you for your business!`;
    
    return text;
  };

  const handleShare = (type: 'whatsapp' | 'sms') => {
    const text = generateTextBill();
    setShareMessage(text);
    
    // In a real app, we would implement actual sharing
    // For now, we just show the message
    setShowShareOptions(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bill Actions</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button 
          onClick={openPrintPreview}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          <FaPrint /> Print
        </button>
        
        <button 
          onClick={() => {
            const textBill = generateTextBill();
            console.log('Downloading bill as text:');
            console.log(textBill);
            alert('In a real app, this would download the bill as PDF');
          }}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          <FaDownload /> Download
        </button>
        
        <button 
          onClick={() => handleShare('whatsapp')}
          className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          <FaWhatsapp /> WhatsApp
        </button>
        
        <button 
          onClick={() => handleShare('sms')}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          <FaSms /> SMS
        </button>
      </div>
      
      {showShareOptions && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Share Bill</h3>
            <button 
              onClick={() => setShowShareOptions(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            In a real app, this would open the respective sharing option. For this demo, here's the text content:
          </p>
          <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">
            {shareMessage}
          </pre>
        </div>
      )}
    </div>
  );
} 