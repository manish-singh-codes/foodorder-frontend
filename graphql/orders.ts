// src/graphql/orders.ts
import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id status totalAmount country restaurantId
      orderItems { id quantity unitPrice menuItem { id name price } }
    }
  }
`;

export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($input: CheckoutOrderInput!) {
    checkoutOrder(input: $input) {
      id status totalAmount paymentMethodId
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      id status
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id status totalAmount country createdAt
      restaurant { id name cuisine }
      orderItems {
        id quantity unitPrice
        menuItem { id name }
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    allOrders {
      id status totalAmount country createdAt
      restaurant { id name }
      user { id name email }
      orderItems { id quantity unitPrice menuItem { id name } }
    }
  }
`;
