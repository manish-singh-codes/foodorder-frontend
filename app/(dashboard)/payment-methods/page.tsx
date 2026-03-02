// src/app/(dashboard)/payment-methods/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GET_MY_PAYMENT_METHODS,
  ADD_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
} from '@/graphql/payment';
import { PaymentMethod, PaymentType, GetMyPaymentMethodsResponse } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Pencil, Trash2, CreditCard } from 'lucide-react';

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/dashboard');
  }, [user, router]);

  const { data, loading, refetch } = useQuery<GetMyPaymentMethodsResponse>(GET_MY_PAYMENT_METHODS);
  const [addPM] = useMutation(ADD_PAYMENT_METHOD, { onCompleted: () => { refetch(); setShowForm(false); } });
  const [updatePM] = useMutation(UPDATE_PAYMENT_METHOD, { onCompleted: () => { refetch(); setEditingId(null); } });
  const [deletePM] = useMutation(DELETE_PAYMENT_METHOD, { onCompleted: () => refetch() });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: 'CARD' as PaymentType, details: '', isDefault: false });

  const paymentMethods: PaymentMethod[] = data?.myPaymentMethods ?? [];

  const handleAdd = () => {
    addPM({ variables: { input: form } });
  };

  const handleUpdate = (id: string) => {
    updatePM({ variables: { input: { id, details: form.details, isDefault: form.isDefault } } });
  };

  const typeIcons: Record<PaymentType, string> = { CARD: '💳', UPI: '📱', WALLET: '👛' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-500 text-sm mt-1">Admin-only: manage payment options</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ type: 'CARD', details: '', isDefault: false }); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={16} /> Add Method
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">New Payment Method</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PaymentType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="CARD">💳 Card</option>
                <option value="UPI">📱 UPI</option>
                <option value="WALLET">👛 Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.type === 'CARD' ? 'Last 4 digits (e.g. ****4242)' : form.type === 'UPI' ? 'UPI ID (e.g. user@paytm)' : 'Wallet ID'}
              </label>
              <input
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder={form.type === 'CARD' ? '****4242' : form.type === 'UPI' ? 'user@paytm' : 'wallet-id'}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="text-orange-500"
              />
              <span className="text-sm text-gray-700">Set as default</span>
            </label>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">
                Add
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p>No payment methods yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              {editingId === pm.id ? (
                <div className="space-y-3">
                  <input
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    />
                    <span className="text-sm">Set as default</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(pm.id)} className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-sm border">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeIcons[pm.type]}</span>
                    <div>
                      <p className="font-medium text-gray-900">{pm.type}</p>
                      <p className="text-sm text-gray-500">{pm.details}</p>
                    </div>
                    {pm.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingId(pm.id); setForm({ type: pm.type, details: pm.details, isDefault: pm.isDefault }); }}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deletePM({ variables: { id: pm.id } })}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
