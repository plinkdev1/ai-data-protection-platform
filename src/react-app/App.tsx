import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@getmocha/users-service/react';
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import AuthCallbackPage from "./pages/AuthCallback";
import DashboardPage from "./pages/Dashboard";
import ProcessingActivitiesPage from "./pages/ProcessingActivities";
import DPIAsPage from "./pages/DPIAs";
import DataRequestsPage from "./pages/DataRequests";
import IncidentsPage from "./pages/Incidents";
import PoliciesPage from "./pages/Policies";
import AuditTrailPage from "./pages/AuditTrail";
import OnboardingPage from "./pages/Onboarding";
import PricingPage from "./pages/Pricing";
import MarketplacePage from "./pages/Marketplace";
import ProviderSignupPage from "./pages/ProviderSignup";
import FAQPage from "./pages/FAQ";
import LegalDocumentsPage from "./pages/LegalDocuments";
import ProviderDashboardPage from "./pages/ProviderDashboard";
import RequestManagementPage from "./pages/RequestManagement";
import LearningPage from "./pages/Learning";
import SupportPage from "./pages/Support";
import PolicyCatalogPage from "./pages/PolicyCatalog";
import PolicyCatalogCompletePage from "./pages/PolicyCatalogComplete";
import MyProvidersPage from "./pages/MyProviders";
import AboutPage from "./pages/About";
import CareersPage from "./pages/Careers";
import PressPage from "./pages/Press";
import ContactPage from "./pages/Contact";
import DocumentationPage from "./pages/Documentation";
import APIReferencePage from "./pages/APIReference";
import CaseStudiesPage from "./pages/CaseStudies";
import BlogPage from "./pages/Blog";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import WelcomeVideoModal from "./components/WelcomeVideoModal";

import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);

  React.useEffect(() => {
    if (user && !localStorage.getItem(`welcome_shown_${user.id}`)) {
      setShowWelcomeModal(true);
    }
  }, [user]);

  const handleCloseWelcome = () => {
    if (user) {
      localStorage.setItem(`welcome_shown_${user.id}`, 'true');
    }
    setShowWelcomeModal(false);
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Layout>{children}</Layout>
      <WelcomeVideoModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcome}
        userEmail={user.email}
      />
    </>
  );
}



function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/legal" element={<LegalDocumentsPage />} />
      <Route path="/provider-signup" element={<ProviderSignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Protected routes */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/processing-activities" element={
        <ProtectedRoute>
          <ProcessingActivitiesPage />
        </ProtectedRoute>
      } />
      <Route path="/dpias" element={
        <ProtectedRoute>
          <DPIAsPage />
        </ProtectedRoute>
      } />
      <Route path="/data-requests" element={
        <ProtectedRoute>
          <DataRequestsPage />
        </ProtectedRoute>
      } />
      <Route path="/incidents" element={
        <ProtectedRoute>
          <IncidentsPage />
        </ProtectedRoute>
      } />
      <Route path="/policies" element={
        <ProtectedRoute>
          <PoliciesPage />
        </ProtectedRoute>
      } />
      <Route path="/audit-trail" element={
        <ProtectedRoute>
          <AuditTrailPage />
        </ProtectedRoute>
      } />
      <Route path="/provider-dashboard" element={
        <ProtectedRoute>
          <ProviderDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/my-requests" element={
        <ProtectedRoute>
          <RequestManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/my-providers" element={
        <ProtectedRoute>
          <MyProvidersPage />
        </ProtectedRoute>
      } />
      <Route path="/learning" element={
        <ProtectedRoute>
          <LearningPage />
        </ProtectedRoute>
      } />
      <Route path="/support" element={
        <ProtectedRoute>
          <SupportPage />
        </ProtectedRoute>
      } />
      <Route path="/policy-catalog" element={
        <ProtectedRoute>
          <PolicyCatalogCompletePage />
        </ProtectedRoute>
      } />
      <Route path="/policy-catalog-legacy" element={
        <ProtectedRoute>
          <PolicyCatalogPage />
        </ProtectedRoute>
      } />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/api" element={<APIReferencePage />} />
      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/blog" element={<BlogPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
