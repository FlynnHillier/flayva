import { ThreeDot } from "react-loading-indicators";

/**
 * A component that shows a loading view.
 */
export default function LoadingView() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-2">
      <h1 className="text-3xl font-bold text-muted-foreground">loading...</h1>
      <ThreeDot size={"medium"} color={"black"} />
    </div>
  );
}
