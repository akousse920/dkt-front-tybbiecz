export interface Order {
  id: number;
  number: string;
  total: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}