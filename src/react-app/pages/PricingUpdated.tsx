import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Check, Zap, Crown, ArrowRight, Star, Users, Sparkles } from 'lucide-react';

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

export default function PricingUpdatedPage() {
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
      // Mock tiers data for Goldilocks pricing design
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
        body: JSON.stringify({ tier_id: tierId, billing_cycle: billingCycle }),
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

  const isCurrentTier = (tierId: number) => {
    return userSubscription?.tier_id === tierId && userSubscription?.status === 'active';
  };

  const getPrice = (tier: ServiceTier) => {
    const price = billingCycle === 'annual' ? Math.round(tier.price * 0.8) : tier.price;
    return price;
  };

  const getSavings = (tier: ServiceTier) => {
    return tier.price * 12 - Math.round(tier.price * 0.8 * 12);
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
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Simple,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Transparent
            </span>
            {' '}Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Choose the perfect DPO solution for your organization. 
            From AI-powered self-service to dedicated expert support.
          </p>
          
          {userSubscription && (
            <div className="inline-flex items-center px-6 py-3 bg-green-100 border border-green-300 rounded-xl mb-8">
              <Star className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Current Plan: {userSubscription.tier?.name} • {userSubscription.credits_remaining} credits remaining
              </span>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex justify-center mb-16">
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
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    20% off
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goldilocks Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {tiers.map((tier) => {
            const isPopular = tier.tier_key === 'dpo_hybrid';
            const isEnterprise = tier.tier_key === 'dpo_partner';
            const price = getPrice(tier);
            
            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl transition-all duration-300 ${
                  isPopular 
                    ? 'transform scale-110 z-10 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-2xl border-2 border-yellow-400' 
                    : isEnterprise
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-xl border border-gray-700'
                    : 'bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200'
                } hover:scale-105`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Most Popular</span>
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Enterprise Badge */}
                {isEnterprise && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Enterprise
                    </div>
                  </div>
                )}

                <div className={`p-8 ${isPopular ? 'text-white' : isEnterprise ? 'text-white' : 'text-gray-900'}`}>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    {tier.tier_key === 'ai_assistant' && (
                      <div className={`p-4 rounded-2xl ${isPopular ? 'bg-white/20' : 'bg-blue-100'}`}>
                        <Zap className={`w-8 h-8 ${isPopular ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                    )}
                    {tier.tier_key === 'dpo_hybrid' && (
                      <div className="p-4 rounded-2xl bg-yellow-400/30 ring-2 ring-yellow-400">
                        <Users className="w-8 h-8 text-yellow-400" />
                      </div>
                    )}
                    {tier.tier_key === 'dpo_partner' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500">
                        <Crown className="w-8 h-8 text-black" />
                      </div>
                    )}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-2 text-center">{tier.name}</h3>
                  <p className={`text-center mb-6 ${isPopular ? 'text-blue-100' : isEnterprise ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-5xl font-bold">${price}</span>
                      <span className={`text-lg ${isPopular ? 'text-blue-200' : isEnterprise ? 'text-gray-400' : 'text-gray-500'}`}>
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="mt-2">
                        <span className={`text-sm line-through ${isPopular ? 'text-blue-200' : isEnterprise ? 'text-gray-400' : 'text-gray-500'}`}>
                          ${tier.price * 12}/year
                        </span>
                        <span className={`text-sm font-medium ml-2 ${isPopular ? 'text-yellow-300' : 'text-green-600'}`}>
                          Save ${getSavings(tier)}/year
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Credits Info */}
                  {tier.credits_included > 0 && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      isPopular ? 'bg-white/10 border border-white/20' : 
                      isEnterprise ? 'bg-gray-700 border border-gray-600' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <p className={`text-sm text-center ${
                        isPopular ? 'text-white' : isEnterprise ? 'text-white' : 'text-blue-800'
                      }`}>
                        <strong>{tier.credits_included}</strong> expert review credits included
                      </p>
                      {tier.credits_additional > 0 && (
                        <p className={`text-xs text-center mt-1 ${
                          isPopular ? 'text-blue-200' : isEnterprise ? 'text-gray-300' : 'text-blue-600'
                        }`}>
                          Additional credits: ${tier.credits_additional} each
                        </p>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isPopular ? 'text-yellow-400' : isEnterprise ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        <span className={`text-sm ${isPopular ? 'text-white' : isEnterprise ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrentTier(tier.id) || upgrading === tier.id.toString()}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isCurrentTier(tier.id)
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : isPopular
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 shadow-lg hover:shadow-xl'
                        : isEnterprise
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black hover:from-yellow-400 hover:to-orange-500 shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {upgrading === tier.id.toString() ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>
                          {isCurrentTier(tier.id) 
                            ? 'Current Plan' 
                            : tier.tier_key === 'ai_assistant' 
                            ? 'Get Started' 
                            : 'Upgrade Now'
                          }
                        </span>
                        {!isCurrentTier(tier.id) && <ArrowRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>

                  {/* Money Back Guarantee */}
                  {!isCurrentTier(tier.id) && (
                    <p className={`text-center text-xs mt-3 ${
                      isPopular ? 'text-blue-200' : isEnterprise ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      30-day money-back guarantee
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare All Features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 pr-4 text-left font-semibold text-gray-900">Features</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="py-4 px-4 text-center font-semibold text-gray-900">
                      <div className="flex flex-col items-center">
                        <span>{tier.name}</span>
                        <span className="text-sm font-normal text-gray-500 mt-1">
                          ${getPrice(tier)}/{billingCycle === 'annual' ? 'year' : 'month'}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  'AI-Powered Policy Generation',
                  'GDPR Compliance Tools',
                  'Basic Templates',
                  'Email Support',
                  'Human Expert Review',
                  'Priority Support',
                  'Custom Policy Development',
                  'Dedicated DPO',
                  'Legal Representation',
                  '24/7 Premium Support'
                ].map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 pr-4 text-gray-700">{feature}</td>
                    {tiers.map((tier) => {
                      const hasFeature = tier.features.some(f => 
                        f.toLowerCase().includes(feature.toLowerCase().split(' ')[0]) ||
                        (feature === 'Human Expert Review' && tier.tier_key !== 'ai_assistant') ||
                        (feature === 'Dedicated DPO' && tier.tier_key === 'dpo_partner') ||
                        (feature === 'Legal Representation' && tier.tier_key === 'dpo_partner') ||
                        (feature === '24/7 Premium Support' && tier.tier_key === 'dpo_partner')
                      );
                      
                      return (
                        <td key={tier.id} className="py-4 px-4 text-center">
                          {hasFeature ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Compliance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations who trust DPOhub for their data protection needs
          </p>
          <button
            onClick={() => window.location.href = user ? '/dashboard' : '/login'}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>{user ? 'Go to Dashboard' : 'Start Free Trial'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
