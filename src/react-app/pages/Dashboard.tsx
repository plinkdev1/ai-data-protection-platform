import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@getmocha/users-service/react';
import { Activity, AlertTriangle, FileCheck, Users, TrendingUp, Clock, Brain } from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import ComplianceChart from '../components/ComplianceChart';

import { CreateProcessingActivityModal, CreateDPIAModal, CreatePolicyModal, CreateDataBreachModal, CreateDSARModal } from '../components/CreateModals';
import CreateOrganizationModal from '../components/CreateOrganizationModal';

interface DashboardMetrics {
  totalProcessingActivities: number;
  activeDPIAs: number;
  pendingDSARs: number;
  openBreaches: number;
  complianceScore: number;
  riskTrends: Array<{
    date: string;
    high: number;
    medium: number;
    low: number;
  }>;
  dsarTrends: Array<{
    date: string;
    received: number;
    completed: number;
  }>;
}

interface Organization {
  id: number;
  name: string;
  domain?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Fetch organizations
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await fetch('/api/organizations', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch organizations');
      return response.json() as Promise<Organization[]>;
    },
  });

  // Set default organization
  useEffect(() => {
    if (organizations && organizations.length > 0 && !selectedOrgId) {
      setSelectedOrgId(organizations[0].id);
    }
  }, [organizations, selectedOrgId]);

  // Fetch metrics for selected organization
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics', selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) return null;
      const response = await fetch(`/api/organizations/${selectedOrgId}/metrics`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json() as Promise<DashboardMetrics>;
    },
    enabled: !!selectedOrgId,
  });

  if (!organizations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (metricsLoading && organizations.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Retrieving your compliance data...</span>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Organizations Found</h2>
          <p className="text-gray-600 mb-6">Get started by creating your first organization to begin managing data protection compliance.</p>
          <button 
            onClick={() => setActiveModal('organization')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  const selectedOrg = organizations.find(org => org.id === selectedOrgId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>
        
        {organizations.length > 1 && (
          <select
            value={selectedOrgId || ''}
            onChange={(e) => setSelectedOrgId(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Current Organization Info */}
      {selectedOrg && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedOrg.name}</h2>
              <p className="text-sm text-gray-600">{selectedOrg.domain || 'No domain specified'}</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Processing Activities"
              value={metrics.totalProcessingActivities}
              subtitle="Total registered"
              icon={Activity}
              gradient="from-blue-500 to-cyan-500"
            />
            <MetricsCard
              title="Active DPIAs"
              value={metrics.activeDPIAs}
              subtitle="In progress"
              icon={FileCheck}
              gradient="from-green-500 to-emerald-500"
              trend={{ value: 12, isPositive: false }}
            />
            <MetricsCard
              title="Pending DSARs"
              value={metrics.pendingDSARs}
              subtitle="Require action"
              icon={Clock}
              gradient="from-yellow-500 to-orange-500"
            />
            <MetricsCard
              title="Open Breaches"
              value={metrics.openBreaches}
              subtitle="Critical incidents"
              icon={AlertTriangle}
              gradient="from-red-500 to-pink-500"
            />
          </div>

          {/* Compliance Score Overview */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">{metrics.complianceScore.toFixed(1)}%</span>
                <span className="text-sm text-gray-500">Overall Score</span>
              </div>
            </div>
            
            <ComplianceChart
              riskTrends={metrics.riskTrends}
              dsarTrends={metrics.dsarTrends}
              complianceScore={metrics.complianceScore}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <button 
                onClick={() => setActiveModal('activity')}
                className="p-4 text-left bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">New Processing Activity</h4>
                    <p className="text-sm text-gray-600">Register data processing</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveModal('dpia')}
                className="p-4 text-left bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Conduct DPIA</h4>
                    <p className="text-sm text-gray-600">Impact assessment</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveModal('policy')}
                className="p-4 text-left bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Generate Policy</h4>
                    <p className="text-sm text-gray-600">AI-assisted drafting</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveModal('breach')}
                className="p-4 text-left bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Report Data Breach</h4>
                    <p className="text-sm text-gray-600">Incident reporting</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveModal('dsar')}
                className="p-4 text-left bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Data Subject Request</h4>
                    <p className="text-sm text-gray-600">DSAR management</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Modals */}
      <CreateProcessingActivityModal
        isOpen={activeModal === 'activity'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          try {
            const response = await fetch(`/api/organizations/${selectedOrgId}/processing-activities`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(data)
            });
            if (response.ok) {
              // Refresh metrics
              window.location.reload();
            }
          } catch (error) {
            console.error('Failed to create processing activity:', error);
          }
        }}
      />

      <CreateDPIAModal
        isOpen={activeModal === 'dpia'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          try {
            const response = await fetch(`/api/organizations/${selectedOrgId}/dpias`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(data)
            });
            if (response.ok) {
              window.location.reload();
            }
          } catch (error) {
            console.error('Failed to create DPIA:', error);
          }
        }}
      />

      <CreatePolicyModal
        isOpen={activeModal === 'policy'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          try {
            if (data.generateWithAI) {
              // Use AI generation endpoint
              const response = await fetch('/api/ai/generate-policy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  organizationId: selectedOrgId,
                  policyType: data.policyType,
                  context: data.context
                })
              });
              const result = await response.json();
              if (response.ok) {
                console.log('AI-generated policy:', result);
                // You could show a preview modal here
                window.location.reload();
              }
            } else {
              // Create manual policy
              const response = await fetch(`/api/organizations/${selectedOrgId}/policies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
              });
              if (response.ok) {
                window.location.reload();
              }
            }
          } catch (error) {
            console.error('Failed to create policy:', error);
          }
        }}
      />

      <CreateDataBreachModal
        isOpen={activeModal === 'breach'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          try {
            const response = await fetch(`/api/organizations/${selectedOrgId}/data-breaches`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(data)
            });
            if (response.ok) {
              window.location.reload();
            }
          } catch (error) {
            console.error('Failed to create breach report:', error);
          }
        }}
      />

      <CreateDSARModal
        isOpen={activeModal === 'dsar'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          try {
            const response = await fetch(`/api/organizations/${selectedOrgId}/data-subject-requests`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(data)
            });
            if (response.ok) {
              window.location.reload();
            }
          } catch (error) {
            console.error('Failed to create DSAR:', error);
          }
        }}
      />

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={activeModal === 'organization'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          try {
            const response = await fetch('/api/organizations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(data)
            });
            if (response.ok) {
              window.location.reload();
            }
          } catch (error) {
            console.error('Failed to create organization:', error);
          }
        }}
      />
    </div>
  );
}
