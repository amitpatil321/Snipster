import { type Extension } from "@codemirror/state";

export const getExtensionsForLanguage = async (
  language: string | undefined,
): Promise<Extension[]> => {
  switch (language?.toLowerCase()) {
    case "javascript":
    case "js":
    case "typescript":
    case "ts":
      return [(await import("@codemirror/lang-javascript")).javascript()];
    case "python":
      return [(await import("@codemirror/lang-python")).python()];
    case "java":
      return [(await import("@codemirror/lang-java")).java()];
    case "html":
      return [(await import("@codemirror/lang-html")).html()];
    case "css":
      return [(await import("@codemirror/lang-css")).css()];
    case "json":
      return [(await import("@codemirror/lang-json")).json()];
    case "xml":
      return [(await import("@codemirror/lang-xml")).xml()];
    case "markdown":
    case "md":
      return [(await import("@codemirror/lang-markdown")).markdown()];
    case "php":
      return [(await import("@codemirror/lang-php")).php()];
    case "sql":
      return [(await import("@codemirror/lang-sql")).sql()];
    case "rust":
      return [(await import("@codemirror/lang-rust")).rust()];
    case "cpp":
    case "c++":
      return [(await import("@codemirror/lang-cpp")).cpp()];
    case "go":
      return [(await import("@codemirror/lang-go")).go()];
    case "yaml":
    case "yml":
      return [(await import("@codemirror/lang-yaml")).yaml()];
    default:
      return []; // fallback for unsupported languages
  }
};
