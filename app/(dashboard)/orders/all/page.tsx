// src/app/(dashboard)/orders/all/page.tsx
'use client';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GET_ALL_ORDERS } from '@/graphql/orders';
import { Order, GetAllOrdersResponse } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function AllOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, loading } = useQuery<GetAllOrdersResponse>(GET_ALL_ORDERS);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/dashboard');
  }, [user, router]);

  if (loading) return <LoadingSpinner />;

  const orders: Order[] = data?.allOrders ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        All Orders — {user?.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'}
      </h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Restaurant</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{(order as any).user?.name}</td>
                <td className="px-5 py-3">{order.restaurant?.name}</td>
                <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-3 text-right font-semibold text-orange-600">₹{order.totalAmount.toFixed(2)}</td>
                <td className="px-5 py-3 text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-10 text-gray-400">No orders found.</p>}
      </div>
    </div>
  );
}
