import type { Tag } from "./tag.types";

export interface Snippet {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  language?: string;
  folderId?: {
    _id: string;
    name: string;
    snippetCount: number;
    userId: string;
  };
  userId: string;
  tagIds?: Tag[];
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface SnippetCountType {
  all: number;
  favorite: number;
  trash: number;
}
