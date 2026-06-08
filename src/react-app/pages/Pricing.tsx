import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Check, Zap, Crown, Shield, ArrowRight, Star, Users } from 'lucide-react';

interface ServiceTier {
  id: number;
  tier_key: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  credits_included: number;
  credits_additional: number;
  is_active: boolean;
}

interface UserSubscription {
  id: number;
  tier_id: number;
  status: string;
  credits_remaining: number;
  subscription_end: string;
  tier?: ServiceTier;
}

export default function PricingPage() {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<ServiceTier[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    fetchTiers();
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchTiers = async () => {
    try {
      // Mock data for demonstration
      const mockTiers: ServiceTier[] = [
        {
          id: 1,
          tier_key: 'ai_assistant',
          name: 'AI Assistant',
          price: 29,
          description: 'Self-service compliance with AI guidance',
          features: [
            'AI-powered policy generation',
            'GDPR compliance toolkit',
            'Basic DPIA templates',
            'Email support',
            'Policy template library',
            'Automated DSAR responses'
          ],
          credits_included: 0,
          credits_additional: 0,
          is_active: true
        },
        {
          id: 2,
          tier_key: 'dpo_hybrid',
          name: 'DPO Hybrid',
          price: 199,
          description: 'AI + Human expert review and guidance',
          features: [
            'Everything in AI Assistant',
            'Human expert review',
            'Priority support',
            'Advanced DPIA management',
            'Breach notification assistance',
            'Monthly compliance check-ins',
            'Custom policy development',
            'Audit preparation support'
          ],
          credits_included: 10,
          credits_additional: 25,
          is_active: true
        },
        {
          id: 3,
          tier_key: 'dpo_partner',
          name: 'DPO Partner',
          price: 599,
          description: 'Dedicated DPO with full legal backing',
          features: [
            'Everything in DPO Hybrid',
            'Dedicated DPO assignment',
            'Legal representation',
            'Regulatory authority liaison',
            '24/7 premium support',
            'Custom training programs',
            'Quarterly board reports',
            'Full audit representation',
            'Unlimited policy reviews'
          ],
          credits_included: 50,
          credits_additional: 15,
          is_active: true
        }
      ];
      
      setTiers(mockTiers);
    } catch (error) {
      console.error('Failed to fetch tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/user-subscription', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
    }
  };

  const handleUpgrade = async (tierId: number) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    setUpgrading(tierId.toString());
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tier_id: tierId }),
      });

      if (response.ok) {
        await fetchUserSubscription();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setUpgrading(null);
    }
  };

  const getTierIcon = (tierKey: string) => {
    switch (tierKey) {
      case 'ai_assistant':
        return <Zap className="w-8 h-8 text-blue-500" />;
      case 'dpo_hybrid':
        return <Users className="w-8 h-8 text-purple-500" />;
      case 'dpo_partner':
        return <Crown className="w-8 h-8 text-gold-500" />;
      default:
        return <Shield className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTierColor = (tierKey: string) => {
    switch (tierKey) {
      case 'ai_assistant':
        return 'border-blue-500 bg-blue-50';
      case 'dpo_hybrid':
        return 'border-purple-500 bg-purple-50';
      case 'dpo_partner':
        return 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const isCurrentTier = (tierId: number) => {
    return userSubscription?.tier_id === tierId && userSubscription?.status === 'active';
  };

  const getButtonText = (tierId: number, tierKey: string) => {
    if (isCurrentTier(tierId)) {
      return 'Current Plan';
    }
    return tierKey === 'ai_assistant' ? 'Get Started' : 'Upgrade Now';
  };

  const getButtonStyle = (tierId: number, tierKey: string) => {
    if (isCurrentTier(tierId)) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    
    switch (tierKey) {
      case 'ai_assistant':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
      case 'dpo_hybrid':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
      case 'dpo_partner':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading pricing plans...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Choose Your
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {' '}DPO Plan
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          From AI-powered self-service to dedicated expert support. 
          Scale your data protection compliance with human-in-the-loop assistance.
        </p>
        
        {userSubscription && (
          <div className="mt-8 inline-flex items-center px-6 py-3 bg-green-100 border border-green-300 rounded-xl">
            <Star className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Current Plan: {userSubscription.tier?.name} • {userSubscription.credits_remaining} credits remaining
            </span>
          </div>
        )}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                20% off
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const features = Array.isArray(tier.features) ? tier.features : JSON.parse(tier.features || '[]');
            const isPopular = tier.tier_key === 'dpo_hybrid';
            const isEnterprise = tier.tier_key === 'dpo_partner';
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:scale-105 ${
                  isCurrentTier(tier.id) ? getTierColor(tier.tier_key) : 'border border-gray-200'
                } ${isEnterprise ? 'transform scale-105' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                {isEnterprise && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Enterprise
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    {getTierIcon(tier.tier_key)}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${billingCycle === 'annual' ? Math.round(tier.price * 0.8) : tier.price}
                      </span>
                      <span className="text-gray-500 text-lg">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-center mt-2">
                        <span className="text-sm text-gray-500 line-through">
                          ${tier.price * 12}/year
                        </span>
                        <span className="text-sm text-green-600 font-medium ml-2">
                          Save ${tier.price * 12 - Math.round(tier.price * 0.8 * 12)}/year
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {tier.credits_included > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-blue-800">
                        <strong>{tier.credits_included}</strong> human-in-the-loop credits included
                      </p>
                      {tier.credits_additional > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Additional credits: ${tier.credits_additional} each
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {Array.isArray(features) ? features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  )) : null}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isCurrentTier(tier.id) || upgrading === tier.id.toString()}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${getButtonStyle(tier.id, tier.tier_key)}`}
                >
                  {upgrading === tier.id.toString() ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{getButtonText(tier.id, tier.tier_key)}</span>
                      {!isCurrentTier(tier.id) && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare Features Across All Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 pr-4 font-semibold text-gray-900">Features</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="py-4 px-4 text-center font-semibold text-gray-900">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 text-gray-700">AI-Powered Compliance Tools</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 text-gray-700">Human Expert Review</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 text-gray-700">Dedicated DPO</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 text-gray-700">Priority Support</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-gray-700">Legal Representation</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Data Protection Compliance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations who trust our human-in-the-loop DPO services
          </p>
          <button
            onClick={() => window.location.href = user ? '/dashboard' : '/login'}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>{user ? 'Go to Dashboard' : 'Get Started Today'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
