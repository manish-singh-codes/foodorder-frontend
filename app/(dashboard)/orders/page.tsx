// src/app/(dashboard)/orders/page.tsx
'use client';
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_MY_ORDERS, CANCEL_ORDER, CHECKOUT_ORDER } from '@/graphql/orders';
// import { GET_MY_PAYMENT_METHODS } from '@/graphql/payments';
import { Order, PaymentMethod, GetMyOrdersResponse, GetMyPaymentMethodsResponse } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { RoleGuard } from '@/components/RoleGuard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useState } from 'react';
import { GET_MY_PAYMENT_METHODS } from '@/graphql/payment';

export default function OrdersPage() {
  const { data, loading, refetch } = useQuery<GetMyOrdersResponse>(GET_MY_ORDERS);
  const { data: pmData } = useQuery<GetMyPaymentMethodsResponse>(GET_MY_PAYMENT_METHODS);
  const [cancelOrder] = useMutation(CANCEL_ORDER, { onCompleted: () => refetch() });
  const [checkoutOrder] = useMutation(CHECKOUT_ORDER, { onCompleted: () => refetch() });
  const [selectedPM, setSelectedPM] = useState<Record<string, string>>({});

  const orders: Order[] = data?.myOrders ?? [];
  const paymentMethods: PaymentMethod[] = pmData?.myPaymentMethods ?? [];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <span className="text-6xl block mb-4">📦</span>
          <p>No orders yet.</p>
          <a href="/restaurants" className="text-orange-500 mt-2 inline-block font-semibold">Browse restaurants →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{order.restaurant.name}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
                <span className="font-bold text-orange-600 text-lg">₹{order.totalAmount.toFixed(2)}</span>
              </div>

              <div className="mt-3 space-y-1">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.menuItem.name} × {item.quantity}</span>
                    <span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Actions: Admin & Manager only */}
              <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
                {order.status === 'PENDING' && (
                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    {paymentMethods.length > 0 && (
                      <select
                        value={selectedPM[order.id] ?? ''}
                        onChange={(e) => setSelectedPM((p) => ({ ...p, [order.id]: e.target.value }))}
                        className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="">Select payment method</option>
                        {paymentMethods.map((pm) => (
                          <option key={pm.id} value={pm.id}>{pm.type} — {pm.details}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() =>
                        checkoutOrder({ variables: { input: { orderId: order.id, paymentMethodId: selectedPM[order.id] } } })
                      }
                      disabled={!selectedPM[order.id]}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={() => cancelOrder({ variables: { orderId: order.id } })}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </RoleGuard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
