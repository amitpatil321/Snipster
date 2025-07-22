export default interface Snippet {
  _id: string;
  title: string;
  code: string;
  content?: string;
  language?: string;
  folderId?: string;
  userId: string;
  tagIds?: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}
