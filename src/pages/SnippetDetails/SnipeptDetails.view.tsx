import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useEffect, useRef } from "react";

import "highlight.js/styles/vs2015.min.css";
import type { Snippet } from "types/snippet.types";

interface Props {
  snippet: Snippet;
}

const SnippetDetailsView = ({ snippet }: Props) => {
  const codeRef = useRef<HTMLElement>(null);
  const { title, description, language, favorite, content } = snippet;

  useEffect(() => {
    const el = codeRef.current;
    if (!el || !snippet.content) return;

    const language = snippet.language ?? "plaintext";
    const content = snippet.content ?? "";

    const loadAndHighlight = async () => {
      const { default: hljs } = await import("utils/highlight");
      el.removeAttribute("data-highlighted");
      el.className = `language-${language}`;
      el.innerHTML = hljs.highlight(content, {
        language: snippet.language || "plaintext",
      }).value;
    };

    loadAndHighlight();
  }, [snippet]);

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="font-semibold text-2xl">{title}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">{language}</Badge>
          {favorite && <Badge variant="secondary">★ Favorite</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && <p className="text-muted-foreground">{description}</p>}
        <pre className="shadow-2xl p-2 rounded-lg max-h-[500px] overflow-auto break-words whitespace-pre-wrap hljs">
          <code ref={codeRef} className={`language-${language}`}>
            {content}
          </code>
        </pre>
      </CardContent>
    </Card>
  );
};

export default SnippetDetailsView;
