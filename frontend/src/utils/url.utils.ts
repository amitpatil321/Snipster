import { ROUTES } from "config/routes.config";

export const getSnippetDetailUrl = ({
  base,
  id,
  paramFolderId,
}: {
  base: string;
  id: string;
  paramFolderId?: string;
}) => {
  if (base === ROUTES.FOLDER.split("/")?.[1] && paramFolderId) {
    return `${ROUTES.FOLDER}/${paramFolderId}/${ROUTES.DETAILS}/${id}`;
  }
  return `/${base}/${ROUTES.DETAILS}/${id}`;
};
