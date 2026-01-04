import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/lib/store";
import Layout from "@/components/layout";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Diet from "@/pages/diet";
import Exercise from "@/pages/exercise";
import Hydration from "@/pages/hydration";
import Weight from "@/pages/weight";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  const { profile } = useApp();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!profile && location !== "/onboarding") {
      setLocation("/onboarding");
    }
  }, [profile, location, setLocation]);

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/diet" component={Diet} />
        <Route path="/exercise" component={Exercise} />
        <Route path="/hydration" component={Hydration} />
        <Route path="/weight" component={Weight} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
