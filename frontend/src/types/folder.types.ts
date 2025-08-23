export interface Folder {
  _id: string;
  name: string;
  userId: string;
  snippetCount: number;
  optimistic?: boolean;
}
