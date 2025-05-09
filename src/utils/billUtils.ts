// Function to generate a unique bill number
export const generateBillNumber = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `MK-${timestamp.toString().slice(-6)}-${random}`;
};

// Format currency to Indian Rupees without superscript
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Remove superscript character and replace with regular Rs.
  return formatted.replace(/₹/g, 'Rs.');
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}; 