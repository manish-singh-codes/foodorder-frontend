// src/app/(dashboard)/cart/page.tsx
'use client';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CREATE_ORDER, CHECKOUT_ORDER } from '@/graphql/orders';
import { GET_MY_PAYMENT_METHODS } from '@/graphql/payment';
import { RoleGuard } from '@/components/RoleGuard';
import { PaymentMethod, GetMyPaymentMethodsResponse, CreateOrderResponse, CheckoutOrderResponse } from '@/types';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, total, restaurantId } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: pmData } = useQuery<GetMyPaymentMethodsResponse>(GET_MY_PAYMENT_METHODS);
  const paymentMethods: PaymentMethod[] = pmData?.myPaymentMethods ?? [];

  const [createOrder, { loading: creating }] = useMutation<CreateOrderResponse>(CREATE_ORDER);
  const [checkoutOrder, { loading: checking }] = useMutation<CheckoutOrderResponse>(CHECKOUT_ORDER);

  const handlePlaceOrder = async () => {
    if (!restaurantId) return;
    setError('');
    try {
      const { data } = await createOrder({
        variables: {
          input: {
            restaurantId,
            items: cart.map((c) => ({ menuItemId: c.menuItem.id, quantity: c.quantity })),
          },
        },
      });

      if (!data?.createOrder?.id) throw new Error('Failed to create order');

      // If Admin/Manager and payment method selected → auto checkout
      if (['ADMIN', 'MANAGER'].includes(user?.role ?? '') && selectedPaymentId) {
        await checkoutOrder({
          variables: { input: { orderId: data.createOrder.id, paymentMethodId: selectedPaymentId } },
        });
        setSuccess('Order placed and paid successfully! 🎉');
      } else {
        setSuccess('Order placed successfully! 🎉');
      }

      clearCart();
      setTimeout(() => router.push('/orders'), 1500);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <span className="text-6xl block mb-4">🛒</span>
        <p className="text-lg font-medium">Your cart is empty</p>
        <a href="/restaurants" className="text-orange-500 mt-2 inline-block font-semibold hover:underline">
          Browse restaurants →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {/* Cart Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y mb-6">
        {cart.map(({ menuItem, quantity }) => (
          <div key={menuItem.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{menuItem.name}</p>
              <p className="text-sm text-orange-600">₹{menuItem.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(menuItem.id, quantity - 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-400">
                <Minus size={13} />
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button onClick={() => updateQuantity(menuItem.id, quantity + 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-400">
                <Plus size={13} />
              </button>
            </div>
            <p className="w-20 text-right font-semibold text-gray-800">₹{(menuItem.price * quantity).toFixed(2)}</p>
            <button onClick={() => removeFromCart(menuItem.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span className="text-orange-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selection (Admin & Manager only) */}
      <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Select Payment Method (optional — to checkout directly)</h3>
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-gray-400">No payment methods available.
              <RoleGuard allowedRoles={['ADMIN']}>
                {' '}<a href="/payment-methods" className="text-orange-500 underline">Add one →</a>
              </RoleGuard>
            </p>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <label key={pm.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={selectedPaymentId === pm.id}
                    onChange={(e) => setSelectedPaymentId(e.target.value)}
                    className="text-orange-500"
                  />
                  <span className="font-medium">{pm.type}</span>
                  <span className="text-gray-500 text-sm">{pm.details}</span>
                  {pm.isDefault && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Default</span>}
                </label>
              ))}
            </div>
          )}
        </div>
      </RoleGuard>

      <button
        onClick={handlePlaceOrder}
        disabled={creating || checking}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-lg transition-colors disabled:opacity-50"
      >
        {creating || checking ? 'Placing Order...' : 'Place Order'}
      </button>

      <RoleGuard allowedRoles={['MEMBER']}>
        <p className="text-xs text-center text-gray-400 mt-2">
          ℹ️ As a Member, your order will require a Manager or Admin to complete checkout.
        </p>
      </RoleGuard>
    </div>
  );
}
