import { Test } from "@/components/Test";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthTest } from "@pages/AuthTest";
import { queryClient } from "@lib/query";

function App() {
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
