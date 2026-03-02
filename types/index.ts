// src/types/index.ts
export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER';
export type Country = 'INDIA' | 'AMERICA';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
export type PaymentType = 'CARD' | 'UPI' | 'WALLET';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  country: Country;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  country: Country;
  imageUrl?: string;
  isActive: boolean;
  menuItems: MenuItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  menuItem: MenuItem;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  country: Country;
  userId: string;
  restaurantId: string;
  restaurant: Restaurant;
  orderItems: OrderItem[];
  paymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  details: string;
  isDefault: boolean;
  country: Country;
  userId: string;
  createdAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginMutationResponse {
  login: AuthResponse;
}

export interface RegisterMutationResponse {
  register: AuthResponse;
}

export interface GetRestaurantsResponse {
  restaurants: Restaurant[];
}

export interface GetRestaurantResponse {
  restaurant: Restaurant;
}

export interface GetMyOrdersResponse {
  myOrders: Order[];
}

export interface GetAllOrdersResponse {
  allOrders: Order[];
}

export interface GetMyPaymentMethodsResponse {
  myPaymentMethods: PaymentMethod[];
}

export interface CreateOrderResponse {
  createOrder: Order;
}

export interface CheckoutOrderResponse {
  checkoutOrder: Order;
}
