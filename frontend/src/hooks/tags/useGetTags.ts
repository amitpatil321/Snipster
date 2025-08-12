import { useQuery } from "@tanstack/react-query";
import { getTags } from "services/tags.services";

import type { Tag } from "types/tag.types";

export const useGetTags = () => {
  return useQuery({
    queryKey: ["getTags"],
    queryFn: getTags,
    select: (res) => {
      return res?.data?.map((each: Tag) => {
        return {
          label: each.name,
          value: each._id,
        };
      });
    },
  });
};
