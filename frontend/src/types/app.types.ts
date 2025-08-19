import type { Snippet } from "./snippet.types";

export type ThemeMode = "light" | "dark" | "system";

export interface SnippetListContextType {
  snippets: Snippet[];
  selectedSnippets: string[];
  setSelectedSnippets: React.Dispatch<React.SetStateAction<string[]>>;
  handleBulkFav: () => void;
  handleBulkDelete: () => void;
  handleSelect: (snippetId: string | null | undefined) => void;
  currentPage: {
    label: string;
    path?: string;
    type: string;
  } | null;
  selected: string | undefined | null;
  setSelected: (snippet: string | null | undefined) => void;
  handleCheckboxClick: (event: React.MouseEvent, id: string) => void;
  deleteSnippet: (snippet: Snippet, event: React.MouseEvent) => void;
  favoriteSnippet: (snippet: Snippet, event: React.MouseEvent) => void;
}
