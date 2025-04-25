import { ThreeDot } from "react-loading-indicators";
import { Button } from "../ui/button";
import { ReactNode } from "react";

/**
 * A component that shows a loading view.
 */
export function LoadingView() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-2">
      <h1 className="text-3xl font-bold text-muted-foreground">loading...</h1>
      <ThreeDot size={"medium"} color={"black"} />
    </div>
  );
}

export function OnLoadingErrorView({
  message,
  onRetry,
}: {
  message: ReactNode;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
      <h1 className="text-3xl font-bold ">Error</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
      <Button variant={"outline"} onClick={() => onRetry()}>
        Retry
      </Button>
    </div>
  );
}
