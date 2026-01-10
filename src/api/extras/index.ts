// api/extras.ts
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProductExtras = (productId: number) => {
  return useQuery({
    queryKey: ["product-extras", productId],
    queryFn: async () => {
      // 1. Load allowed groups for this product
      const { data: groups, error: groupErr } = await supabase
        .from("product_extra_groups")
        .select("extra_groups(id,name)")
        .eq("product_id", productId);

      if (groupErr) throw new Error(groupErr.message);

      const groupIds = groups.map(g => g.extra_groups.id);

      if (groupIds.length === 0) return [];

      // 2. Load extras inside those groups
      const { data: extras, error: extraErr } = await supabase
        .from("extras")
        .select("id,name,price,group_id")
        .in("group_id", groupIds)
        .eq("in_stock", true);

      if (extraErr) throw new Error(extraErr.message);

      // 3. Group them
      return groups.map(g => ({
        id: g.extra_groups.id,
        name: g.extra_groups.name,
        options: extras.filter(e => e.group_id === g.extra_groups.id)
      }));
    },
  });
};
