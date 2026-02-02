import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

  export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

    export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

//export type Product = {
 // id: number;
  //image: string | null;
  //name: string;
  //price: number;
//};

export type ExtraItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type CartItem = {
  id: string;
  product: Tables<"products">;
  product_id: number;
  quantity: number;
  extras?: ExtraItem[];
};

export const OrderStatusList: OrderStatus[] = [
  'New',
  'Ready',
  'Delivering',
  'Collected',
  'Delivered',
];

export type OrderStatus = 'New' |'Ready' |'Delivering' |'Collected'|'Delivered';

export type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  products: Tables<'order_items'>;
  order_id: number;
  //size: PizzaSize;
  quantity: number;
};

export type Profile = {
  id: string;
  group: string;
};
