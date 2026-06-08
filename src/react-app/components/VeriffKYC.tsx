import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';

interface VeriffKYCProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface KYCStatus {
  id: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  created_at: string;
  expires_at: string;
  verification_url?: string;
}

export default function VeriffKYC({ isOpen, onClose, onComplete }: VeriffKYCProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      checkKYCStatus();
    }
  }, [isOpen, user]);

  const checkKYCStatus = async () => {
    try {
      const response = await fetch('/api/kyc/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setKycStatus(data);
      }
    } catch (error) {
      console.error('Failed to check KYC status:', error);
    }
  };

  const initiateKYC = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/kyc/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to initiate KYC verification');
      }

      const data = await response.json();
      setKycStatus(data);

      if (data.verification_url) {
        // Open Veriff verification in a new window
        const veriffWindow = window.open(
          data.verification_url,
          'veriff-kyc',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );

        // Poll for completion
        const pollInterval = setInterval(() => {
          if (veriffWindow?.closed) {
            clearInterval(pollInterval);
            checkKYCStatus();
          }
        }, 1000);

        // Clean up after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          if (veriffWindow && !veriffWindow.closed) {
            veriffWindow.close();
          }
        }, 5 * 60 * 1000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'KYC initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 border-green-200';
      case 'declined': return 'text-red-600 bg-red-100 border-red-200';
      case 'expired': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'declined': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'expired': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <Shield className="w-5 h-5 text-yellow-600" />;
    }
  };

  const isExpired = () => {
    if (!kycStatus?.expires_at) return false;
    return new Date(kycStatus.expires_at) < new Date();
  };

  const needsVerification = () => {
    return !kycStatus || 
           kycStatus.status === 'declined' || 
           kycStatus.status === 'expired' || 
           isExpired();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
          <p className="text-gray-600">
            Weekly KYC verification is required to ensure platform security and compliance.
          </p>
        </div>

        {kycStatus && (
          <div className={`flex items-center space-x-3 p-4 rounded-xl border mb-6 ${getStatusColor(kycStatus.status)}`}>
            {getStatusIcon(kycStatus.status)}
            <div>
              <p className="font-medium">Current Status: {kycStatus.status}</p>
              <p className="text-sm opacity-80">
                {kycStatus.expires_at && (
                  <>Expires: {new Date(kycStatus.expires_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {needsVerification() ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What you'll need:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Government-issued photo ID</li>
                <li>• Good lighting and stable camera</li>
                <li>• 2-3 minutes to complete</li>
              </ul>
            </div>

            <button
              onClick={initiateKYC}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>Start Verification</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Verification is powered by Veriff and typically takes 1-2 minutes to complete.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Complete</h3>
            <p className="text-gray-600 mb-6">
              Your identity has been verified and is valid until{' '}
              {kycStatus?.expires_at && new Date(kycStatus.expires_at).toLocaleDateString()}.
            </p>
            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {needsVerification() ? 'Skip for now' : 'Close'}
          </button>
          
          {needsVerification() && (
            <button
              onClick={() => window.open('https://help.veriff.com/', '_blank')}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
            >
              Need help?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
