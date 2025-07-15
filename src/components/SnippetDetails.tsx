import { useParams } from "react-router";

import { mockSnippets } from "./SnippetList";

const SnippetDetails = () => {
  const { id } = useParams();
  const snippet = mockSnippets.find((s) => s.id === id);

  if (!snippet) {
    return <div>Snippet not found</div>;
  }

  return (
    <div>
      <h2 className="mb-2 font-bold text-lg">{snippet.title}</h2>
      <p>Category: {snippet.category}</p>
      <p>Tags: {snippet.tags.join(", ")}</p>
      <p>Created at: {new Date(snippet.createdAt).toLocaleString()}</p>
      <p>Code (placeholder): {snippet.code || "No code yet"}</p>
    </div>
  );
};

export default SnippetDetails;
