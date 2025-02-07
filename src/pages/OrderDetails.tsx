import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  number: string;
  total: string;
  status: string;
  items: OrderItem[];
}

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrder(data.data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (provider: string) => {
    try {
      const response = await fetch(`/api/payments/orders/${id}/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payment_provider: provider })
      });
      const data = await response.json();
      
      // Redirect to payment URL if provided
      if (data.data.payment_url) {
        window.location.href = data.data.payment_url;
      }
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{order.number}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
          ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'}`}
        >
          {order.status}
        </span>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order Items
          </h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul className="-my-4 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.product}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>{order.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {order.status === 'pending' && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payment Methods
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <button
                onClick={() => initiatePayment('kkiapay')}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay with KkiaPay
              </button>
              <button
                onClick={() => initiatePayment('bank_transfer')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Package className="h-5 w-5 mr-2" />
                Bank Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;