import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, User } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-indigo-600">DiKantri</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link 
              to="/orders" 
              className={`flex flex-col items-center ${
                location.pathname === '/orders' ? 'text-indigo-600' : 'text-gray-600'
              }`}
            >
              <Package className="h-6 w-6" />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link 
              to="/cart" 
              className={`flex flex-col items-center ${
                location.pathname === '/cart' ? 'text-indigo-600' : 'text-gray-600'
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs mt-1">Cart</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex flex-col items-center ${
                location.pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600'
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;