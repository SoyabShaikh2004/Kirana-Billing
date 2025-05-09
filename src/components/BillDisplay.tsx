import { Bill } from '@/types';
import { formatCurrency, formatDate } from '@/utils/billUtils';

interface BillDisplayProps {
  bill: Bill;
  removeItem?: (id: string) => void;
  isPreview?: boolean;
}

export default function BillDisplay({ bill, removeItem, isPreview = false }: BillDisplayProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${isPreview ? 'p-8' : 'p-6'}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Malik Kirana Shop</h1>
        <p className="text-sm text-gray-600">Chichpada Naka, Vasai (E), 401208</p>
        <p className="text-sm text-gray-600">Phone: +91 9834540990</p>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm"><span className="font-semibold">Bill No:</span> {bill.billNumber}</p>
        </div>
        <div>
          <p className="text-sm"><span className="font-semibold">Date:</span> {formatDate(bill.date)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              {!isPreview && (
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bill.items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                  {formatCurrency(item.total)}
                </td>
                {!isPreview && removeItem && (
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={isPreview ? 4 : 5} className="px-4 py-3 text-right text-sm font-bold">
                Grand Total:
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold">
                {formatCurrency(bill.grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {isPreview && (
        <div className="mt-8 border-t pt-4">
          <p className="text-center text-sm text-gray-600">Thank you for your business!</p>
        </div>
      )}
    </div>
  );
} 