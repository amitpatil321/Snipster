import { Loader2Icon } from "lucide-react";

interface LoadingType {
  size?: "small" | "large" | "xlarge";
  className?: string;
}

const Loading = ({ size = "large", className }: LoadingType) => {
  const sizeMap = {
    small: "h-4 w-4",
    large: "h-6 w-6",
    xlarge: "h-8 w-8",
  };
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 border">
      <Loader2Icon
        className={`animate-spin ${sizeMap[size]} ${className} dark:text-primary text-primary`}
      />
    </div>
  );
};

export default Loading;
