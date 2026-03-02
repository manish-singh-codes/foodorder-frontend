// src/app/(dashboard)/restaurants/page.tsx
'use client';
import { useQuery } from '@apollo/client/react';
// import { GET_RESTAURANTS } from '@/graphql/restaurants';
import { Restaurant, GetRestaurantsResponse } from '@/types';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapPin, ChefHat } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GET_RESTAURANTS } from '@/graphql/restaurant';

export default function RestaurantsPage() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery<GetRestaurantsResponse>(GET_RESTAURANTS);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const restaurants: Restaurant[] = data?.restaurants ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <p className="text-gray-500 text-sm mt-1">
          Showing restaurants in {user?.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'}
        </p>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ChefHat size={48} className="mx-auto mb-3 opacity-40" />
          <p>No restaurants available in your region.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="bg-linear-to-br from-orange-100 to-amber-100 h-36 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {r.cuisine.includes('Indian') || r.cuisine.includes('Street') ? '🍛' :
                 r.cuisine.includes('American') ? '🍔' :
                 r.cuisine.includes('Italian') ? '🍕' : '🍽️'}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg">{r.name}</h3>
                <p className="text-orange-500 text-sm font-medium">{r.cuisine}</p>
                <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm">
                  <MapPin size={13} />
                  <span>{r.address}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{r.menuItems?.length ?? 0} items</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Open</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
