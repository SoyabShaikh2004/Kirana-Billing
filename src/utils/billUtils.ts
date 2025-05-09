// Function to generate a unique bill number
export const generateBillNumber = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `MK-${timestamp.toString().slice(-6)}-${random}`;
};

// Format currency to Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Sample bills for demo purposes
export const sampleBills = [
  {
    billNumber: 'MK-123456-789',
    date: new Date('2023-10-15'),
    items: [
      { id: '1', name: 'Rice', price: 60, quantity: 5, total: 300 },
      { id: '2', name: 'Dal', price: 120, quantity: 2, total: 240 },
      { id: '3', name: 'Sugar', price: 45, quantity: 3, total: 135 }
    ],
    grandTotal: 675,
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210'
  },
  {
    billNumber: 'MK-789012-345',
    date: new Date('2023-10-16'),
    items: [
      { id: '1', name: 'Wheat Flour', price: 40, quantity: 10, total: 400 },
      { id: '2', name: 'Cooking Oil', price: 180, quantity: 2, total: 360 }
    ],
    grandTotal: 760,
    customerName: 'Priya Patel',
    customerPhone: '8765432109'
  }
]; 