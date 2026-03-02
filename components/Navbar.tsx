// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const roleBadgeColor: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    MANAGER: 'bg-blue-100 text-blue-700',
    MEMBER: 'bg-green-100 text-green-700',
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-gray-900">FoodOrder</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/restaurants" className="text-gray-600 hover:text-gray-900 font-medium">
              Restaurants
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-gray-900 font-medium">
              My Orders
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleBadgeColor[user.role]}`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-400">{user.country}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
