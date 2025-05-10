import { QRCodeSVG } from 'qrcode.react';

interface PaymentQRCodeProps {
  amount: number;
  upiId: string;
  phoneNumber: string;
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ amount, upiId, phoneNumber }) => {
  // Format the UPI payment URL with the amount
  const upiUrl = `upi://pay?pa=${upiId}&pn=Malik%20Kirana&am=${amount}&cu=INR&tn=Bill%20Payment`;

  return (
    <div className="flex flex-col items-center mt-4 p-2 border border-gray-300 rounded-md bg-white">
      <QRCodeSVG
        value={upiUrl}
        size={150}
        level="H"
        includeMargin={true}
        imageSettings={{
          src: "/logo.png",
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold">Scan to Pay</p>
        <p className="text-xs text-gray-600">UPI ID: {upiId}</p>
        <p className="text-xs text-gray-600">Phone: {phoneNumber}</p>
        <p className="text-xs font-bold">Amount: ₹{amount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PaymentQRCode; 