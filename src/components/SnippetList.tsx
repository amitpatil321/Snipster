import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { Star } from "lucide-react";

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
    title: "Fetch data with React Query",
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

const SnippetList = () => {
  return (
    <div className="flex flex-col divide-y divide-border w-full">
      {mockSnippets.map((snippet) => (
        <div
          key={snippet.id}
          className={cn(
            "flex flex-col gap-1 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
          )}
          onClick={() => alert(`Open snippet: ${snippet.title}`)}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-base">{snippet.title}</h3>
            {snippet.favorite && (
              <Star className="fill-yellow-500 w-4 h-4 text-yellow-500" />
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <span className="text-muted-foreground text-xs">
            {new Date(snippet.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
