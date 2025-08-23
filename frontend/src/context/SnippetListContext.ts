import { createContext } from "react";

import type { SnippetListContextType } from "@/types/app.types";

export const SnippetListContext = createContext<SnippetListContextType>(
  {} as SnippetListContextType,
);
