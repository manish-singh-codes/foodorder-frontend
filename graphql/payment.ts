// src/graphql/payments.ts
import { gql } from '@apollo/client';

export const GET_MY_PAYMENT_METHODS = gql`
  query GetMyPaymentMethods {
    myPaymentMethods {
      id type details isDefault country userId createdAt
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($input: CreatePaymentMethodInput!) {
    addPaymentMethod(input: $input) {
      id type details isDefault country
    }
  }
`;

export const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
    updatePaymentMethod(input: $input) {
      id type details isDefault
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: ID!) {
    deletePaymentMethod(id: $id) {
      id
    }
  }
`;
