import { useState } from 'react';
import { SampleBill } from '@/types';
import { formatCurrency, formatDate } from '@/utils/billUtils';

interface BillSearchProps {
  sampleBills: SampleBill[];
  viewBill: (bill: SampleBill) => void;
}

export default function BillSearch({ sampleBills, viewBill }: BillSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SampleBill[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = sampleBills.filter(bill => 
      bill.billNumber.toLowerCase().includes(term) || 
      bill.customerName?.toLowerCase().includes(term) ||
      bill.customerPhone?.includes(term) ||
      formatDate(bill.date).includes(term)
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search Bills</h2>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter bill number, customer name, or date..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      
      {hasSearched && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Search Results ({searchResults.length})</h3>
          
          {searchResults.length === 0 ? (
            <p className="text-gray-600">No bills found matching your search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill No
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((bill) => (
                    <tr key={bill.billNumber}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {bill.billNumber}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bill.date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {bill.customerName || 'N/A'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(bill.grandTotal)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewBill(bill)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <p className="mt-4 text-xs text-gray-500">
            Note: This is a simulated search with sample data. In a real application, this would be connected to a database.
          </p>
        </div>
      )}
    </div>
  );
} 