import { Bill } from '@/types';
import { 
  FaWhatsapp, 
  FaDownload 
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/utils/billUtils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

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
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set document properties
    doc.setProperties({
      title: `Malik Kirana Shop - Invoice ${bill.billNumber}`,
      subject: 'Invoice',
      author: 'Malik Kirana Shop',
      creator: 'Billing System'
    });

    // Add page background
    doc.setFillColor(249, 250, 251); // Very light gray
    doc.rect(0, 0, 210, 297, 'F');

    // Add border
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287, 'S');

    try {
      // Load logo image
      const logo = new Image();
      logo.src = '/Logo.jpg';
      
      // Add header with logo
      doc.setFillColor(21, 128, 61); // Green-700
      doc.rect(5, 5, 200, 30, 'F');
      
      // Add logo
      doc.addImage(logo, 'JPEG', 15, 10, 20, 20);
      
      // Add shop name and info
      doc.setTextColor(255, 255, 255); // White text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Malik Kirana Shop', 105, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Chichpada Naka, Vasai (E), 401208', 105, 22, { align: 'center' });
      doc.text('Mobile: +91 9834540990', 105, 27, { align: 'center' });
      
      // Add bill title
      doc.setTextColor(0, 0, 0); // Black text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('INVOICE', 105, 40, { align: 'center' });
      
      // Add bill info box
      doc.setFillColor(243, 244, 246); // Gray-100
      doc.roundedRect(10, 45, 95, 25, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.text(`Bill No: ${bill.billNumber}`, 15, 53);
      doc.text(`Date: ${formatDate(bill.date)}`, 15, 60);
      
      // Add customer box
      doc.setFillColor(243, 244, 246); // Gray-100
      doc.roundedRect(110, 45, 95, 25, 3, 3, 'F');
      
      doc.text('Customer Details', 115, 53);
      doc.setFont('helvetica', 'normal');
      if (bill.customerName) {
        doc.text(`Name: ${bill.customerName}`, 115, 60);
      } else {
        doc.text('Walk-in Customer', 115, 60);
      }
      
      // Add table title
      doc.setFillColor(21, 128, 61); // Green-700
      doc.roundedRect(10, 75, 190, 8, 2, 2, 'F');
      
      doc.setTextColor(255, 255, 255); // White text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('ITEM DETAILS', 105, 80, { align: 'center' });
      
      // Prepare table data
      const tableColumn = ['#', 'Item', 'Price', 'Qty', 'Total'];
      const tableRows = bill.items.map((item, index) => [
        (index + 1).toString(),
        item.name,
        formatPDFCurrency(item.price),
        item.quantity.toString(),
        formatPDFCurrency(item.total)
      ]);
      
      // Add items table
      autoTable(doc, {
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [21, 128, 61], // Green header
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 }, // #
          1: { halign: 'left', cellWidth: 70 }, // Item - wider for item names
          2: { halign: 'center', cellWidth: 35 }, // Price - centered
          3: { halign: 'center', cellWidth: 15 }, // Qty
          4: { halign: 'center', cellWidth: 35 }  // Total - centered
        },
        alternateRowStyles: {
          fillColor: [243, 244, 246] // Gray-100
        },
        margin: { left: 10, right: 10 }
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
      doc.text('Grand Total:', 110, finalY + 18);
      const grandTotalText = formatPDFCurrency(bill.grandTotal);
      doc.text(grandTotalText, 190, finalY + 18, { align: 'right' });
      
      // Add QR code for payment
      // Create QR code value with UPI details
      const upiUrl = `upi://pay?pa=malik.shaikh15@axl&pn=Malik%20Kirana&am=${bill.totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment`;
      
      // Create QR code
      const qrCodeImage = document.createElement('canvas');
      const QRCode = require('qrcode');
      QRCode.toCanvas(qrCodeImage, upiUrl, { 
        width: 150,
        margin: 1,
        errorCorrectionLevel: 'H'
      });
      
      // Convert canvas to data URL
      const qrDataUrl = qrCodeImage.toDataURL('image/png');
      
      // Add QR code to PDF
      const qrWidth = 40; // mm
      const qrHeight = 40; // mm
      const qrX = 30; // Left position
      const qrY = finalY + 30; // Below grand total
      
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrWidth, qrHeight);
      
      // Add payment info text
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Scan to Pay', qrX + qrWidth/2, qrY - 5, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('UPI ID: malik.shaikh15@axl', qrX + qrWidth/2, qrY + qrHeight + 5, { align: 'center' });
      doc.text('Phone: +91 77983 50965', qrX + qrWidth/2, qrY + qrHeight + 10, { align: 'center' });
      doc.text(`Amount: ${formatPDFCurrency(bill.totalAmount)}`, qrX + qrWidth/2, qrY + qrHeight + 15, { align: 'center' });
      
      // Add thank you note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // Slate-500
      doc.text('Thank you for your business!', 105, 285, { align: 'center' });
      
      // Save the PDF
      doc.save(`Malik_Kirana_Bill_${bill.billNumber}.pdf`);
    } catch (logoError) {
      console.error('Error loading logo, using simplified design', logoError);
      
      // Use a simplified design without logo
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Malik Kirana Shop', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Chichpada Naka, Vasai (E), 401208', 105, 27, { align: 'center' });
      doc.text('Mobile: +91 9834540990', 105, 33, { align: 'center' });
      doc.text(`Bill No: ${bill.billNumber} | Date: ${formatDate(bill.date)}`, 105, 40, { align: 'center' });
      
      if (bill.customerName) {
        doc.text(`Customer: ${bill.customerName}`, 105, 47, { align: 'center' });
      }
      
      // Prepare table data
      const tableColumn = ['#', 'Item', 'Price', 'Qty', 'Total'];
      const tableRows = bill.items.map((item, index) => [
        (index + 1).toString(),
        item.name,
        formatPDFCurrency(item.price),
        item.quantity.toString(),
        formatPDFCurrency(item.total)
      ]);
      
      // Use autoTable plugin
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: bill.customerName ? 55 : 50,
        theme: 'grid',
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
      
      // Add QR code for payment
      try {
        // Create QR code value with UPI details
        const upiUrl = `upi://pay?pa=malik.shaikh15@axl&pn=Malik%20Kirana&am=${bill.totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment`;
        
        // Create QR code
        const qrCodeImage = document.createElement('canvas');
        const QRCode = require('qrcode');
        QRCode.toCanvas(qrCodeImage, upiUrl, { 
          width: 150,
          margin: 1,
          errorCorrectionLevel: 'H'
        });
        
        // Convert canvas to data URL
        const qrDataUrl = qrCodeImage.toDataURL('image/png');
        
        // Add QR code to PDF
        const qrWidth = 40; // mm
        const qrHeight = 40; // mm
        const qrX = 30; // Left position
        const qrY = finalY + 30; // Below grand total
        
        doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrWidth, qrHeight);
        
        // Add payment info text
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Scan to Pay', qrX + qrWidth/2, qrY - 5, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('UPI ID: malik.shaikh15@axl', qrX + qrWidth/2, qrY + qrHeight + 5, { align: 'center' });
        doc.text('Phone: +91 77983 50965', qrX + qrWidth/2, qrY + qrHeight + 10, { align: 'center' });
        doc.text(`Amount: ${formatPDFCurrency(bill.totalAmount)}`, qrX + qrWidth/2, qrY + qrHeight + 15, { align: 'center' });
      } catch (qrError) {
        console.error('Error generating QR code', qrError);
      }
      
      // Save the PDF
      doc.save(`Malik_Kirana_Bill_${bill.billNumber}.pdf`);
    }
  } catch (error) {
    console.error('Error generating PDF', error);
    alert('Could not generate PDF. Please try again.');
  }
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