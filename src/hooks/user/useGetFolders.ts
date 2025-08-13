import { useQuery } from "@tanstack/react-query";

import { getFolders } from "@/services/user.services";

export const useGetFolders = () => {
  return useQuery({
    queryKey: ["getFolders"],
    queryFn: getFolders,
    select: (res) => res.data,
  });
};
