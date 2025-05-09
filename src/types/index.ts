export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Bill {
  billNumber: string;
  date: Date;
  items: BillItem[];
  grandTotal: number;
}

export interface SampleBill extends Bill {
  customerName?: string;
  customerPhone?: string;
} 