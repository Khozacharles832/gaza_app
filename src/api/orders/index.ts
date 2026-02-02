import { supabase } from "@/lib/supabase";
import { UseAuth } from "@/providers/AuthProvider";
import { InsertTables, UpdateTables } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAdminOrderList = ({ archived = false}) => {
    const statuses = archived ? ['Delivered', 'Collected'] : ['New','Ready', 'Delivering'];

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const {data, error} = await supabase
      .from('orders')
      .select('*')
      .in('status', statuses)
      .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useAMyOrderList = () => {
    const { session } = UseAuth();
    const id = session?.user.id;

  return useQuery({
    queryKey: ['orders', { user_id: id}],
    queryFn: async () => {
      if (!id) return null;

      const {data, error} = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const {data, error} = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', id)
      .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

};
export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = UseAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { error, data: newProduct } = await supabase
        .from('orders')
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedField,
    }: {
      id: number;
      updatedField: UpdateTables<'orders'>;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedField)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};
