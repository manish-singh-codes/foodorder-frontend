// src/app/(dashboard)/restaurants/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { GetRestaurantResponse, MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { GET_RESTAURANT } from '@/graphql/restaurant';
import { useQuery } from '@apollo/client/react';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  console.log("id is ",id)
  const { data, loading, error } = useQuery<GetRestaurantResponse>(GET_RESTAURANT, {
    variables: { id },          // ← THIS was missing
    skip: !id,                  // ← safety: skip if id is undefined
  });

  const { cart, addToCart, updateQuantity, restaurantId, total } = useCart();

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const restaurant = data?.restaurant;
  if (!restaurant) return <p>Not found</p>;

  const getQty = (itemId: string) =>
    cart.find((c) => c.menuItem.id === itemId)?.quantity ?? 0;

  // Group by category
  const categories = [...new Set(restaurant.menuItems.map((m: MenuItem) => m.category))];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-amber-400 rounded-2xl p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="opacity-90 mt-1">{restaurant.cuisine} · {restaurant.address}</p>
      </div>

      {/* Cart bar */}
      {cart.length > 0 && restaurantId === id && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-700">
            <ShoppingCart size={18} />
            <span className="font-medium">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
            <span>·</span>
            <span className="font-semibold">₹{total.toFixed(2)}</span>
          </div>
          <Link
            href="/cart"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600"
          >
            View Cart →
          </Link>
        </div>
      )}

      {/* Menu */}
      {categories.map((cat) => (
        <div key={cat as string} className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">{cat as string}</h2>
          <div className="space-y-3">
            {restaurant.menuItems
              .filter((m: MenuItem) => m.category === cat)
              .map((item: MenuItem) => {
                const qty = getQty(item.id);
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                      )}
                      <p className="text-orange-600 font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item, id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, qty - 1)}
                          className="w-8 h-8 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 hover:bg-orange-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-semibold">{qty}</span>
                        <button
                          onClick={() => addToCart(item, id)}
                          className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
