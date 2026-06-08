import { useState } from 'react';
import { CreditCard, Shield, AlertCircle, Lock, DollarSign } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface PaymentProcessorProps {
  amount: number;
  currency: string;
  description: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Visa, Mastercard, American Express'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>,
    description: 'Pay with your PayPal account'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Direct bank transfer (ACH)'
  }
];

export default function PaymentProcessor({ amount, currency, description, onPaymentSuccess, onPaymentError }: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    zipCode: ''
  });
  
  const [savedMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]);

  const [useSavedMethod, setUseSavedMethod] = useState(true);

  const formatCardNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').match(/.{1,4}/g)?.join(' ') || '';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardDetails(prev => ({ ...prev, number: formatted }));
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success/failure
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        const paymentId = `pay_${Date.now()}`;
        onPaymentSuccess(paymentId);
      } else {
        onPaymentError('Payment failed. Please try again.');
      }
    } catch (error) {
      onPaymentError('An error occurred while processing payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardBrandIcon = (number: string) => {
    const firstDigit = number.charAt(0);
    const firstTwo = number.substring(0, 2);
    
    if (firstDigit === '4') return '💳'; // Visa
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return '💳'; // Mastercard
    if (['34', '37'].includes(firstTwo)) return '💳'; // Amex
    return '💳';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your payment securely</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{description}</span>
              <span className="font-medium">{currency} {amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium">{currency} {(amount * 0.029).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-gray-900">
                  {currency} {(amount * 1.029).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border-2 rounded-xl transition-all text-left ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">{method.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Saved Payment Methods */}
          {selectedMethod === 'card' && savedMethods.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => setUseSavedMethod(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    useSavedMethod ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    useSavedMethod ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {useSavedMethod && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span>Use saved card</span>
                </button>
                <button
                  onClick={() => setUseSavedMethod(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    !useSavedMethod ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    !useSavedMethod ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {!useSavedMethod && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span>Use new card</span>
                </button>
              </div>

              {useSavedMethod && (
                <div className="space-y-3">
                  {savedMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">**** **** **** {method.last4}</p>
                          <p className="text-sm text-gray-600">
                            {method.brand?.toUpperCase()} • Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* New Card Form */}
          {selectedMethod === 'card' && !useSavedMethod && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl">
                    {getCardBrandIcon(cardDetails.number)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    value={cardDetails.expiryMonth}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiryMonth: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={cardDetails.expiryYear}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiryYear: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={2024 + i}>
                        {2024 + i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={cardDetails.zipCode}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345"
                />
              </div>
            </div>
          )}

          {/* PayPal */}
          {selectedMethod === 'paypal' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">PP</span>
              </div>
              <p className="text-gray-600 mb-4">You'll be redirected to PayPal to complete your payment</p>
            </div>
          )}

          {/* Bank Transfer */}
          {selectedMethod === 'bank' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Bank Transfer Processing</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    Bank transfers typically take 3-5 business days to process. You'll receive bank details after confirming your order.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Secure Payment</h4>
              <p className="text-sm text-green-800">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handleProcessPayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay {currency} {(amount * 1.029).toFixed(2)}</span>
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By completing this payment, you agree to our Terms of Service and Privacy Policy.
          Your payment will be processed securely by our payment partner.
        </p>
      </div>
    </div>
  );
}
