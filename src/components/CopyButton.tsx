import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleCopy}
          className={`p-1 rounded cursor-pointer ${className}`}
          title="Copy to clipboard"
        >
          <span
            className={`inline-block transition-all duration-400 ease-out transform ${
              copied
                ? "scale-110 opacity-100 text-accent"
                : "scale-100 opacity-100 text-accent hover:text-accent/60"
            }`}
          >
            {copied ? (
              <Check className="w-6 h-6 transition-transform duration-400" />
            ) : (
              <Copy className="w-6 h-6 transition-transform duration-400" />
            )}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        Copy to clipboard
      </TooltipContent>
    </Tooltip>
  );
}
