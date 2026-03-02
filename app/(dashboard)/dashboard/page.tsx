// src/app/(dashboard)/dashboard/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ShoppingBag, Store, CreditCard, Users } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    { title: 'Browse Restaurants', desc: 'Explore menus and place orders', href: '/restaurants', icon: Store, color: 'bg-orange-500', allowed: ['ADMIN','MANAGER','MEMBER'] },
    { title: 'My Orders', desc: 'Track and manage your orders', href: '/orders', icon: ShoppingBag, color: 'bg-blue-500', allowed: ['ADMIN','MANAGER','MEMBER'] },
    { title: 'Payment Methods', desc: 'Manage payment options', href: '/payment-methods', icon: CreditCard, color: 'bg-green-500', allowed: ['ADMIN'] },
    { title: 'All Orders', desc: 'View all orders in your country', href: '/orders/all', icon: Users, color: 'bg-purple-500', allowed: ['ADMIN'] },
  ].filter((c) => c.allowed.includes(user?.role ?? ''));

  const countryFlag = user?.country === 'INDIA' ? '🇮🇳' : '🇺🇸';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {countryFlag} {user?.country} · {user?.role} dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ title, desc, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
          >
            <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Role permission overview */}
      <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Your Permissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 pr-4">Feature</th>
                <th className="pb-2 px-4">Admin</th>
                <th className="pb-2 px-4">Manager</th>
                <th className="pb-2 px-4">Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ['View restaurants & menu', true, true, true],
                ['Create an order', true, true, true],
                ['Checkout & pay', true, true, false],
                ['Cancel an order', true, true, false],
                ['Add/modify payment methods', true, false, false],
              ].map(([feature, admin, manager, member]) => (
                <tr key={String(feature)}>
                  <td className="py-2.5 pr-4 text-gray-700">{String(feature)}</td>
                  {[admin, manager, member].map((v, i) => (
                    <td key={i} className="py-2.5 px-4 text-center">
                      <span className={v ? 'text-green-500' : 'text-gray-300'}>{v ? '✅' : '❌'}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
