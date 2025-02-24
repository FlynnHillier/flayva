import { Test } from "@/components/Test";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthTest } from "@pages/AuthTest";
import { queryClient } from "@lib/query";
import { Toaster } from "@components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Test />} />
      </Routes>
      <Routes>
        <Route path="/auth" element={<AuthTest />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
