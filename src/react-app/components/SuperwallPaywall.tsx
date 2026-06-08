import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';

interface SuperwallConfig {
  apiKey: string;
  userId?: string;
  userAttributes?: Record<string, any>;
}

// Since the React Native SDK doesn't exist, we'll create a web-compatible version
class SuperwallWeb {
  private apiKey: string;
  private userId?: string;
  private userAttributes: Record<string, any> = {};

  constructor(config: SuperwallConfig) {
    this.apiKey = config.apiKey;
    this.userId = config.userId;
    this.userAttributes = config.userAttributes || {};
    
    // Use apiKey for future API calls
    console.log('Superwall initialized with API key:', this.apiKey ? 'configured' : 'missing');
  }

  static shared: SuperwallWeb | null = null;

  static configure(config: SuperwallConfig) {
    SuperwallWeb.shared = new SuperwallWeb(config);
  }

  identify(userId: string, attributes?: Record<string, any>) {
    this.userId = userId;
    console.log('Superwall user identified:', this.userId);
    if (attributes) {
      this.userAttributes = { ...this.userAttributes, ...attributes };
    }
  }

  register(event: string, params?: Record<string, any>) {
    // Log the event for analytics
    console.log('Superwall Event:', event, params);
    
    // In a real implementation, this would trigger paywall logic
    // For now, we'll simulate basic paywall triggers
    return this.shouldShowPaywall(event);
  }

  private shouldShowPaywall(event: string): boolean {
    // Simple logic to determine if paywall should show
    const paywallEvents = [
      'subscription_upgrade',
      'feature_access_premium',
      'credits_exhausted',
      'trial_expired'
    ];

    return paywallEvents.includes(event);
  }

  getPurchaseController() {
    return {
      purchase: async (productId: string) => {
        // Mock purchase flow
        console.log('Mock purchase for product:', productId);
        return {
          success: true,
          productId,
          transactionId: `mock_${Date.now()}`
        };
      },
      restorePurchases: async () => {
        console.log('Mock restore purchases');
        return { success: true, restored: [] };
      }
    };
  }
}

interface SuperwallPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (productId: string) => void;
  event?: string;
  params?: Record<string, any>;
}

export default function SuperwallPaywall({ 
  isOpen, 
  onClose, 
  onPurchase, 
  event = 'paywall_shown',
  params = {} 
}: SuperwallPaywallProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Superwall when component mounts and log event/params
    console.log('Paywall triggered for event:', event, 'with params:', params);
    
    if (typeof window !== 'undefined') {
      const apiKey = import.meta.env.VITE_SUPERWALL_API_KEY;
      if (apiKey) {
        SuperwallWeb.configure({ 
          apiKey,
          userId: user?.id,
          userAttributes: {
            email: user?.email,
            subscription_status: 'free' // This would come from actual subscription data
          }
        });
      }
    }
  }, [user, event, params]);

  const handlePurchase = async (productId: string) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would trigger the actual purchase flow
      const purchaseController = SuperwallWeb.shared?.getPurchaseController();
      const result = await purchaseController?.purchase(productId);
      
      if (result?.success) {
        onPurchase(productId);
        onClose();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Your Experience</h2>
          <p className="text-gray-600">
            Unlock premium features and get expert DPO guidance for your compliance needs.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* DPO Hybrid Plan */}
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-purple-900">DPO Hybrid</h3>
              <span className="text-2xl font-bold text-purple-900">$199/mo</span>
            </div>
            <ul className="text-sm text-purple-800 space-y-1 mb-4">
              <li>✓ AI + Human expert review</li>
              <li>✓ Priority support</li>
              <li>✓ 10 expert review credits</li>
              <li>✓ Advanced DPIA management</li>
            </ul>
            <button
              onClick={() => handlePurchase('dpo_hybrid')}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Choose Hybrid'}
            </button>
          </div>

          {/* DPO Partner Plan */}
          <div className="border border-yellow-200 rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-yellow-900">DPO Partner</h3>
              <span className="text-2xl font-bold text-yellow-900">$599/mo</span>
            </div>
            <ul className="text-sm text-yellow-800 space-y-1 mb-4">
              <li>✓ Dedicated DPO assignment</li>
              <li>✓ Legal representation</li>
              <li>✓ 50 expert review credits</li>
              <li>✓ 24/7 premium support</li>
            </ul>
            <button
              onClick={() => handlePurchase('dpo_partner')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Choose Partner'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Maybe later
          </button>
          
          <button
            onClick={() => window.open('/pricing', '_blank')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all plans
          </button>
        </div>
      </div>
    </div>
  );
}

// Export utility functions for triggering paywalls
export const showPaywall = (event: string, params?: Record<string, any>) => {
  if (SuperwallWeb.shared) {
    return SuperwallWeb.shared.register(event, params);
  }
  return false;
};

export const identifyUser = (userId: string, attributes?: Record<string, any>) => {
  if (SuperwallWeb.shared) {
    SuperwallWeb.shared.identify(userId, attributes);
  }
};
