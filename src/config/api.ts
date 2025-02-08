// Remove the API_BASE_URL since we're using relative paths with the proxy
export const API_BASE_URL = '';

// Mock data for development
export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    number: 'ORD-001',
    total: '5600 FCFA',
    status: 'pending',
    created_at: '2025-01-17T10:00:00.000000Z',
    items: [
      {
        id: 1,
        product: 'Product 1',
        quantity: 2,
        price: '2800 FCFA'
      }
    ]
  },
  {
    id: 2,
    number: 'ORD-002',
    total: '7800 FCFA',
    status: 'completed',
    created_at: '2025-01-18T15:30:00.000000Z',
    items: [
      {
        id: 2,
        product: 'Product 2',
        quantity: 3,
        price: '2600 FCFA'
      }
    ]
  }
];

export const MOCK_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token'
};