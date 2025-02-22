import { Test } from "@/components/Test";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthTest } from "@pages/AuthTest";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Test />} />
      </Routes>
      <Routes>
        <Route path="/auth" element={<AuthTest />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
