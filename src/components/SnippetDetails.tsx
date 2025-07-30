import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Skeleton } from "components/ui/skeleton";
import hljs from "highlight.js";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "services/axios.service";

import "highlight.js/styles/github-dark.css";
import type { Snippet } from "types/snippet.types";

const SnippetDetails = () => {
  const { id } = useParams();
  const codeRef = useRef<HTMLElement>(null);
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codeRef.current && snippet?.content) {
      const el = codeRef.current;

      // Fully reset the code block before highlighting
      el.removeAttribute("data-highlighted");
      el.className = `language-${snippet.language?.toLowerCase() || "plaintext"}`;
      el.innerHTML = hljs.highlight(snippet.content, {
        language: snippet.language || "plaintext",
      }).value;
    }
  }, [snippet]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/snippet/details/${id}`);
        const data = res.data?.data?.[0];
        setSnippet(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch snippet details:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (snippet?.content) {
      hljs.highlightAll();
    }
  }, [snippet]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="mb-4 w-1/3 h-6" />
        <Skeleton className="mb-2 w-1/4 h-4" />
        <Skeleton className="w-full h-48" />
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="mt-10 text-red-500 text-center">Snippet not found</div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-2xl">
          {snippet.title}
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">{snippet.language}</Badge>
          {snippet.favorite && <Badge variant="secondary">★ Favorite</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {snippet.description && (
          <p className="text-muted-foreground">{snippet.description}</p>
        )}
        <pre className="max-h-[500px] overflow-auto break-words whitespace-pre-wrap">
          <code
            ref={codeRef}
            className={`language-${snippet?.language?.toLowerCase()}`}
          >
            {snippet?.content}
          </code>
        </pre>
        <p className="text-muted-foreground text-xs text-right">
          Created: {new Date(snippet.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default SnippetDetails;
