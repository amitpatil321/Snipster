import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DetailsLoading = () => {
  return (
    <Card className="gap-2 shadow-none mt-2 border-none">
      <CardHeader className="-mt-4">
        <CardTitle className="flex flex-row justify-between items-center">
          <Skeleton className="rounded-md w-2/3 h-8" />
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="rounded-md w-20 h-8" />
            <Skeleton className="rounded-md w-20 h-8" />
            <Skeleton className="rounded-full w-5 h-5" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 -mt-2">
        <Skeleton className="w-3/4 h-1" />
        <Skeleton className="w-2/3 h-1" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="rounded-full w-20 h-4" />
          <Skeleton className="rounded-full w-24 h-4" />
        </div>
        <Skeleton className="rounded-lg w-full h-[400px]" />
      </CardContent>
    </Card>
  );
};

export default DetailsLoading;
