import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SBNHome from "./pages/SBNHome.tsx";
import Conversations from "./pages/Conversations.tsx";
import Spaces from "./pages/Spaces.tsx";
import SpaceDetail from "./pages/SpaceDetail.tsx";
import WaveDetail from "./pages/WaveDetail.tsx";
import Jobs from "./pages/Jobs.tsx";
import Develop from "./pages/Develop.tsx";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import ProfileInsights from "./pages/ProfileInsights.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ReloadRedirect = () => {
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload" && location.pathname !== "/") {
      setShouldRedirect(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (shouldRedirect) return <Navigate to="/" replace />;
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ReloadRedirect />
        <Routes>
          <Route path="/" element={<SBNHome />} />
          <Route path="/joule" element={<Index />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/vendor-onboarding" element={<SpaceDetail />} />
          <Route path="/spaces/vendor-onboarding/waves/:waveId" element={<WaveDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/develop" element={<Develop />} />
          <Route path="/spaces/complete-profile" element={<CompleteProfile />} />
          <Route path="/spaces/profile-insights" element={<ProfileInsights />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
