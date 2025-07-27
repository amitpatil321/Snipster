import { Alert, AlertTitle } from "components/ui/alert";
import {
  CircleFadingArrowUpIcon,
  OctagonAlert,
  ShieldAlert,
} from "lucide-react";

export default function AlertCalloutDemo() {
  return (
    <div className="space-y-4 w-full">
      <Alert className="bg-emerald-500/10 dark:bg-emerald-600/30 border-none">
        <CircleFadingArrowUpIcon className="w-4 h-4 !text-emerald-500" />
        <AlertTitle>Your action has been completed successfully.</AlertTitle>
      </Alert>
      <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-none">
        <CircleFadingArrowUpIcon className="w-4 h-4 !text-blue-500" />
        <AlertTitle>A new version of the app is now available.</AlertTitle>
      </Alert>
      <Alert className="bg-amber-500/10 dark:bg-amber-600/30 border-none">
        <ShieldAlert className="w-4 h-4 !text-amber-500" />
        <AlertTitle>Changes will overwrite existing data.</AlertTitle>
      </Alert>
      <Alert className="bg-destructive/10 dark:bg-destructive/20 border-none">
        <OctagonAlert className="w-4 h-4 !text-destructive" />
        <AlertTitle>
          Unable to process your request. Please try again later.
        </AlertTitle>
      </Alert>
    </div>
  );
}
