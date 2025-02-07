import { API_BASE_URL } from './api';

export const API_ROUTES = {
    CART: `${API_BASE_URL}/api/cart`,
    CART_ITEM: (id: string) => `${API_BASE_URL}/api/cart/items/${id}`,
    ORDERS: `${API_BASE_URL}/api/orders`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
};
