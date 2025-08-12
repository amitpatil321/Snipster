import {
  Alert as AlertBox,
  AlertDescription,
  AlertTitle,
} from "components/ui/alert";
import {
  CircleFadingArrowUpIcon,
  OctagonAlert,
  ShieldAlert,
  InfoIcon,
} from "lucide-react";
import React from "react";

interface AlertBoxProps {
  type: "info" | "success" | "warning" | "error";
  title: React.ReactNode | string;
  className?: string;
  description?: React.ReactNode | string;
}

const iconMap = {
  info: <InfoIcon className="w-4 h-4 text-blue-500" />,
  success: <CircleFadingArrowUpIcon className="w-4 h-4 text-emerald-500" />,
  warning: <ShieldAlert className="w-4 h-4 text-amber-500" />,
  error: <OctagonAlert className="w-4 h-4 text-red-500" />,
};

const bgMap = {
  info: "bg-blue-500/10 dark:bg-blue-600/30",
  success: "bg-emerald-500/10 dark:bg-emerald-600/30",
  warning: "bg-amber-500/10 dark:bg-amber-600/30",
  error: "bg-destructive/10 dark:bg-destructive/20",
};

export const Alert = ({
  type,
  title,
  description,
  className,
}: AlertBoxProps) => {
  return (
    <AlertBox className={`${bgMap[type]} border-none ${className}`}>
      {iconMap[type]}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </AlertBox>
  );
};
