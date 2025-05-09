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

// Helper function to format currency specifically for PDF
const formatPDFCurrency = (amount: number): string => {
  // Ensure we round to 2 decimal places and convert to fixed format
  const fixedAmount = amount.toFixed(2);
  // Format with thousands separators
  const formatted = parseFloat(fixedAmount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
  return `Rs. ${formatted}`;
};

// Export this function to be used elsewhere
export const downloadPDF = (bill: Bill) => {
  // Function to convert image to base64
  const getBase64Image = (imgPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = imgPath;
    });
  };

  // First get the logo as base64
  getBase64Image('/Logo.jpg')
    .then(logoBase64 => {
      // Create PDF document with better formatting options
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });
      
      // Add background color
      doc.setFillColor(248, 250, 252); // Light gray background
      doc.rect(0, 0, 210, 297, 'F');
      
      // Add border
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277, 'S');
      
      // Add header with background
      doc.setFillColor(21, 128, 61); // Green header
      doc.rect(10, 10, 190, 30, 'F');
      
      // Add logo
      doc.addImage(logoBase64, 'JPEG', 15, 15, 20, 20);
      
      // Add shop title
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(20);
      doc.text('Malik Kirana Shop', 105, 22, { align: 'center' });
      
      // Add shop details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Chichpada Naka, Vasai (E), 401208 | Phone: +91 9834540990', 105, 30, { align: 'center' });
      
      // Add INVOICE text
      doc.setFillColor(241, 245, 249); // Light blue-gray
      doc.roundedRect(10, 45, 190, 12, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42); // Dark text
      doc.setFontSize(12);
      doc.text('INVOICE', 105, 53, { align: 'center' });
      
      // Add bill details section
      const billDetailsY = 65;
      const colWidth = 90;
      const labelFont = 9;
      const valueFont = 10;
      
      // Left column - Bill details
      doc.setFillColor(241, 245, 249); // Light blue-gray
      doc.roundedRect(10, billDetailsY, colWidth, 20, 1, 1, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(labelFont);
      doc.setTextColor(71, 85, 105); // Slate-500
      doc.text('Bill Number:', 15, billDetailsY + 7);
      doc.text('Date:', 15, billDetailsY + 15);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(valueFont);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text(bill.billNumber, 40, billDetailsY + 7);
      doc.text(formatDate(bill.date), 40, billDetailsY + 15);
      
      // Right column - Customer details
      doc.setFillColor(241, 245, 249); // Light blue-gray
      doc.roundedRect(110, billDetailsY, colWidth, 20, 1, 1, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(labelFont);
      doc.setTextColor(71, 85, 105); // Slate-500
      doc.text('Customer:', 115, billDetailsY + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(valueFont);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text(bill.customerName || 'Walk-in Customer', 140, billDetailsY + 7);
      
      // Add items table with better styling
      const tableColumn = ["#", "Item", "Price", "Qty", "Total"];
      const tableRows = bill.items.map((item, index) => [
        index + 1,
        item.name,
        formatPDFCurrency(item.price),
        item.quantity,
        formatPDFCurrency(item.total)
      ]);
      
      // Table title
      doc.setFillColor(241, 245, 249); // Light blue-gray
      doc.roundedRect(10, 95, 190, 8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // Dark text
      doc.text('ITEM DETAILS', 20, 100);
      
      // Use autoTable plugin with better styling
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 105,
        theme: 'grid',
        headStyles: {
          fillColor: [21, 128, 61], // Green header
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          textColor: [15, 23, 42],
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Very light blue-gray for alternate rows
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 }, // #
          1: { halign: 'left', cellWidth: 70 }, // Item - wider for item names
          2: { halign: 'center', cellWidth: 35 }, // Price - wider for currency
          3: { halign: 'center', cellWidth: 15 }, // Qty
          4: { halign: 'center', cellWidth: 35 }  // Total - wider for currency
        },
        margin: { left: 10, right: 10 },
        tableWidth: 190
      });
      
      // Get the final Y position after the table
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      
      // Add grand total section with background
      doc.setFillColor(241, 245, 249); // Light blue-gray
      doc.roundedRect(100, finalY + 5, 100, 20, 2, 2, 'F');
      
      doc.setDrawColor(203, 213, 225); // Slate-300
      doc.setLineWidth(0.5);
      doc.roundedRect(100, finalY + 5, 100, 20, 2, 2, 'S');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 128, 61); // Green text
      doc.setFontSize(12);
      
      // Left-align "Grand Total:" text
      doc.text('Grand Total:', 110, finalY + 18);
      
      // Right-align the amount with some padding
      const grandTotalText = formatPDFCurrency(bill.grandTotal);
      doc.text(grandTotalText, 190, finalY + 18, { align: 'right' });
      
      // Add thank you note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // Slate-500
      doc.text('Thank you for your business!', 105, finalY + 40, { align: 'center' });
      
      // Add footer with date and page numbers
      const currentDate = new Date().toLocaleDateString();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // Slate-400
      doc.text(`Generated on: ${currentDate}`, 20, 287);
      doc.text('Page 1 of 1', 190, 287, { align: 'right' });
      
      // Save the PDF
      doc.save(`Invoice-${bill.billNumber}.pdf`);
    })
    .catch(error => {
      console.error('Error loading logo:', error);
      alert('Failed to load logo. Please try again.');
      
      // Simple fallback PDF without fancy styling
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
      if (bill.customerName) {
        doc.text(`Customer: ${bill.customerName}`, 14, 56);
      }
      
      // Add items table
      const tableColumn = ["#", "Item", "Price", "Qty", "Total"];
      const tableRows = bill.items.map((item, index) => [
        index + 1,
        item.name,
        formatPDFCurrency(item.price),
        item.quantity,
        formatPDFCurrency(item.total)
      ]);
      
      // Use autoTable plugin
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: bill.customerName ? 65 : 55,
        theme: 'striped',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { halign: 'center' }, // #
          1: { halign: 'left' },  // Item
          2: { halign: 'center' }, // Price
          3: { halign: 'center' }, // Qty
          4: { halign: 'center' }  // Total
        }
      });
      
      // Get the final Y position after the table
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      
      // Add grand total
      doc.setFillColor(241, 245, 249); // Light blue-gray
      doc.roundedRect(100, finalY + 5, 100, 20, 2, 2, 'F');
      
      doc.setDrawColor(203, 213, 225); // Slate-300
      doc.setLineWidth(0.5);
      doc.roundedRect(100, finalY + 5, 100, 20, 2, 2, 'S');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 128, 61); // Green text
      doc.setFontSize(12);
      doc.text('Grand Total:', 110, finalY + 18);
      const grandTotalText = formatPDFCurrency(bill.grandTotal);
      doc.text(grandTotalText, 190, finalY + 18, { align: 'right' });
      
      // Add thank you note
      doc.setFontSize(10);
      doc.text('Thank you for your business!', 105, finalY + 25, { align: 'center' });
      
      // Save the PDF
      doc.save(`Invoice-${bill.billNumber}.pdf`);
    });
};

export default function BillActions({ bill, openPDFPreview }: BillActionsProps) {
  const generateTextBill = (): string => {
    let text = `*Malik Kirana Shop*\n`;
    text += `Bill No: ${bill.billNumber}\n`;
    text += `Date: ${formatDate(bill.date)}\n`;
    if (bill.customerName) {
      text += `Customer: ${bill.customerName}\n`;
    }
    text += `\n*Items:*\n`;
    
    bill.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} - ${item.quantity} x ${formatPDFCurrency(item.price)} = ${formatPDFCurrency(item.total)}\n`;
    });
    
    text += `\n*Grand Total: ${formatPDFCurrency(bill.grandTotal)}*\n`;
    text += `\nThank you for your business!`;
    
    return text;
  };

  const handleShare = () => {
    const text = generateTextBill();
    
    // Ask for phone number (optional)
    let phoneNumber = prompt("Enter WhatsApp number (with country code, e.g., 919834540990) or leave empty to share without a recipient:", "91");
    
    // Create a WhatsApp URL with the encoded text
    const encodedText = encodeURIComponent(text);
    let whatsappUrl;
    
    if (phoneNumber && phoneNumber.trim() !== "") {
      // Remove any spaces, dashes, or other non-numeric characters
      phoneNumber = phoneNumber.replace(/\D/g, '');
      whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    } else {
      whatsappUrl = `https://wa.me/?text=${encodedText}`;
    }
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Bill Actions</h2>
      
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => downloadPDF(bill)}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 text-sm"
        >
          <FaDownload size={14} /> Download PDF
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600 text-sm"
        >
          <FaWhatsapp size={14} /> WhatsApp
        </button>
      </div>
    </div>
  );
} 