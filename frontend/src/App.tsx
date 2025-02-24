import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { queryClient } from "@lib/query";
import { Toaster } from "@components/ui/sonner";

/* Pages */
import { Test } from "@/components/Test";
import { AuthTest } from "@pages/AuthTest";
import  HomePage  from "@pages/HomePage";


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Routes>
        <Route path="/test" element={<Test />} />
      </Routes>
      <Routes>
        <Route path="/auth" element={<AuthTest />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
