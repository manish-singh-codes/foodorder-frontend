// src/graphql/restaurants.ts
import { gql } from '@apollo/client';

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id name cuisine address country imageUrl isActive
      menuItems { id name description price category isAvailable }
    }
  }
`;

export const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id name cuisine address country imageUrl isActive
      menuItems { id name description price category isAvailable }
    }
  }
`;
