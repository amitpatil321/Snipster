export interface Snippet {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  language?: string;
  folderId?: {
    _id: string;
    name: string;
  };
  userId: string;
  tagIds?: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SnippetCountType {
  all: number;
  favorite: number;
  trash: number;
}
