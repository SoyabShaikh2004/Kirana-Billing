import { useState } from 'react';
import { Bill } from '@/types';
import { 
  FaWhatsapp, 
  FaDownload 
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/utils/billUtils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BillActionsProps {
  bill: Bill;
  openPDFPreview: () => void;
}

// Export this function to be used elsewhere
export const downloadPDF = (bill: Bill) => {
  // Create PDF document
  const doc = new jsPDF();
  
  // Add shop title
  doc.setFontSize(18);
  doc.text('Malik Kirana Shop', 105, 15, { align: 'center' });
  
  // Add shop details
  doc.setFontSize(10);
  doc.text('Chichpada Naka, Vasai (E), 401208', 105, 22, { align: 'center' });
  doc.text('Phone: +91 9834540990', 105, 27, { align: 'center' });
  
  // Add bill details
  doc.setFontSize(12);
  doc.text(`Bill No: ${bill.billNumber}`, 14, 40);
  doc.text(`Date: ${formatDate(bill.date)}`, 14, 48);
  
  // Add items table
  const tableColumn = ["#", "Item", "Price", "Qty", "Total"];
  const tableRows = bill.items.map((item, index) => [
    index + 1,
    item.name,
    formatCurrency(item.price),
    item.quantity,
    formatCurrency(item.total)
  ]);
  
  // Use autoTable plugin
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'striped',
    styles: { fontSize: 10 }
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  // Add grand total
  doc.text(`Grand Total: ${formatCurrency(bill.grandTotal)}`, 140, finalY + 10, { align: 'right' });
  
  // Add thank you note
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 105, finalY + 25, { align: 'center' });
  
  // Save the PDF
  doc.save(`Bill-${bill.billNumber}.pdf`);
};

export default function BillActions({ bill, openPDFPreview }: BillActionsProps) {
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

  const handleShare = () => {
    const text = generateTextBill();
    setShareMessage(text);
    
    // In a real app, we would implement actual sharing
    // For now, we just show the message
    setShowShareOptions(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bill Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => downloadPDF(bill)}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          <FaDownload /> Download PDF
        </button>
        
        <button 
          onClick={() => handleShare()}
          className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          <FaWhatsapp /> WhatsApp
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
            In a real app, this would open the respective sharing option. For this demo, here&apos;s the text content:
          </p>
          <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">
            {shareMessage}
          </pre>
        </div>
      )}
    </div>
  );
} 