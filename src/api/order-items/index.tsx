import { supabase } from "@/lib/supabase";
import { UseAuth } from "@/providers/AuthProvider";
import { InsertTables } from "@/types";
import { useMutation } from "@tanstack/react-query";


export const useInsertOrderItems = () => {

  return useMutation({
    async mutationFn(items: InsertTables<'order_items'>[]) {
      const { error ,data: newProduct} = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message); 
      }
      return newProduct;
    },
    
  }); 

};