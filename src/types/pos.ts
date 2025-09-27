export interface CartItem {
  id: string;
  name: string;
  nameUrdu: string;
  price: number;
  quantity: number;
  size?: 'small' | 'medium' | 'large';
  category: string;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  customerName?: string;
}

export interface POSState {
  cart: CartItem[];
  selectedCategory: string | null;
  isReceiptModalOpen: boolean;
  currentReceipt: Receipt | null;
}