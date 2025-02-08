import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Plus, Minus, X, DollarSign, Loader2,CreditCard  } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
}

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
  });

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.data?.items) {
        setItems(data.data.items);
      } else {
        setItems([]);
        setError('Invalid response format from server');
        toast.error('Failed to load cart data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to load cart: ${errorMessage}`);
      toast.error('Failed to load cart data');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      setItems(currentItems =>
        currentItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Quantity updated');
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/items/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      setItems(currentItems => currentItems.filter(item => item.id !== id));
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const createOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: items }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      setItems([]);
      toast.success('Order created successfully');
    } catch (err) {
      toast.error('Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  const addItemToCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      setIsOpen(false);
      await fetchCart();
      setNewProduct({
        name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
      });
      toast.success('Item added to cart');
    } catch (err) {
      toast.error('Failed to add item to cart');
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <X className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-lg text-gray-800 mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Your Cart</h2>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </button>
          </div>

          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-gray-500">Start adding some items to your cart</p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold text-indigo-600">
                            ${(item.quantity * item.unit_price).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      <div className="flex items-center mt-3">
                        <div className="flex items-center space-x-3 bg-white rounded-lg border p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-100 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-gray-700">Total Amount</span>
                <span className="text-2xl font-bold text-indigo-600">${totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={createOrder}
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Item</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter item description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newProduct.quantity}
                    onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.unit_price}
                    onChange={e => setNewProduct({ ...newProduct, unit_price: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
              <button
                onClick={addItemToCart}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 mt-6"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;