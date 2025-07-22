import { Badge } from "components/ui/badge";
// import { cn } from "lib/utils";
import { ROUTES } from "config/routes.config";
import useGetSnippets from "hooks/snippets/useGetSnippets";
import { formatRelativeTime } from "lib/utils";
import { Star } from "lucide-react";
import { Link, useLocation } from "react-router";

import { Alert } from "./Alert";
import Loading from "./Loading";
import SnippetDetails from "./SnippetDetails";

export const mockSnippets = [
  {
    id: "1",
    title: "Center a div using Flexbox",
    tags: ["css", "flexbox", "layout"],
    category: "CSS",
    createdAt: "2024-07-01T10:15:00Z",
    updatedAt: "2024-07-05T09:00:00Z",
    favorite: true,
    code: "",
  },
  {
    id: "2",
    title:
      "Fetch data with React Query, Copy and paste the following code into your project.",
    tags: ["react", "data-fetching", "hooks"],
    category: "React",
    createdAt: "2024-06-28T14:30:00Z",
    favorite: false,
    code: "",
  },
  {
    id: "3",
    title: "Debounce input change handler",
    tags: ["javascript", "performance", "utilities"],
    category: "JavaScript",
    createdAt: "2024-07-10T08:45:00Z",
    code: "",
  },
  {
    id: "4",
    title: "Styled Button with Tailwind",
    tags: ["tailwind", "ui", "button"],
    category: "CSS",
    createdAt: "2024-07-11T11:20:00Z",
    favorite: true,
    code: "",
  },
  {
    id: "5",
    title: "Custom hook for localStorage",
    tags: ["react", "hooks", "localStorage"],
    category: "React",
    createdAt: "2024-06-15T16:10:00Z",
    updatedAt: "2024-07-01T12:00:00Z",
    favorite: false,
    code: "",
  },
  {
    id: "6",
    title: "Animate list items on mount",
    tags: ["framer-motion", "animation", "ui"],
    category: "React",
    createdAt: "2024-07-08T09:50:00Z",
    code: "",
  },
  {
    id: "7",
    title: "Simple Express server setup",
    tags: ["node", "express", "backend"],
    category: "Node.js",
    createdAt: "2024-06-22T13:00:00Z",
    favorite: true,
    code: "",
  },
  {
    id: "8",
    title: "Validate form with Zod",
    tags: ["typescript", "validation", "forms"],
    category: "TypeScript",
    createdAt: "2024-07-12T15:30:00Z",
    code: "",
  },
  {
    id: "9",
    title: "Configure Husky pre-commit hook",
    tags: ["git", "husky", "tooling"],
    category: "DevOps",
    createdAt: "2024-06-18T18:40:00Z",
    code: "",
  },
  {
    id: "10",
    title: "Dark mode toggle with Tailwind",
    tags: ["tailwind", "theme", "ui"],
    category: "CSS",
    createdAt: "2024-07-13T12:00:00Z",
    code: "",
  },
];

// const SnippetList = ({ type }: { type?: string }) => {
const SnippetList = () => {
  // const { id } = useParams();
  const location = useLocation();
  const { isLoading, data: snippets = [], isError = true } = useGetSnippets();

  const basePath = location.pathname.split("/")[1];
  const showDetails = location.pathname.includes(ROUTES.DETAILS);

  if (isLoading) return <Loading className="" />;
  if (isError)
    return (
      <Alert type="error" title="Something went wrong! Please try again" />
    );

  return (
    <>
      <div className="bg-card border rounded-xl w-1/3 overflow-auto text-card-foreground">
        {(snippets?.length ?? 0) <= 0 ? (
          <div className="p-2">
            <Alert
              type="info"
              title="It's so lonely here...even the semicolons left."
              description="Lets add a snippet and break the ice like a true coder"
            />
          </div>
        ) : (
          snippets?.map(({ _id, title, favorite, tags, createdAt }) => (
            <Link
              key={_id}
              className="flex flex-col gap-1 hover:bg-accent/50 px-4 py-3 transition-colors"
              to={`/${basePath}/details/${_id}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-base truncate">{title}</h3>
                {favorite && (
                  <Star className="fill-yellow-500 w-4 h-4 text-yellow-500" />
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <span className="text-muted-foreground text-xs">
                {formatRelativeTime(createdAt)}
              </span>
            </Link>
          ))
        )}
      </div>

      <div className="flex-1 bg-card p-4 border rounded-lg overflow-auto text-card-foreground">
        {showDetails && <SnippetDetails />}
      </div>
    </>
  );
};

export default SnippetList;
