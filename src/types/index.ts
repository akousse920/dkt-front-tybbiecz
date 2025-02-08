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
  avatar: string | null;
  roles: string[];
  created_at: string;
  updated_at: string;
}