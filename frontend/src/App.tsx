import { Test } from "@/components/Test";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Test />
      </QueryClientProvider>
    </>
  );
}

export default App;
