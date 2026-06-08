/**
 * Stripe Integration Service for Payment Processing
 * Handles subscriptions, payments, and billing for DPO marketplace
 */

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  description?: string;
  created: number;
  default_source?: string;
  invoice_prefix?: string;
  metadata: Record<string, string>;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  created: number;
  current_period_start: number;
  current_period_end: number;
  trial_start?: number;
  trial_end?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
      quantity: number;
    }>;
  };
  metadata: Record<string, string>;
  default_payment_method?: string;
  collection_method: 'charge_automatically' | 'send_invoice';
}

export interface StripePrice {
  id: string;
  product: string;
  active: boolean;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    usage_type: 'licensed' | 'metered';
  };
  unit_amount?: number;
  unit_amount_decimal?: string;
  metadata: Record<string, string>;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created: number;
  updated: number;
  metadata: Record<string, string>;
  images: string[];
  package_dimensions?: any;
  shippable?: boolean;
  tax_code?: string;
  type: 'good' | 'service';
  unit_label?: string;
  url?: string;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  created: number;
  customer?: string;
  description?: string;
  metadata: Record<string, string>;
  payment_method?: string;
}

export interface StripeInvoice {
  id: string;
  customer: string;
  subscription?: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  created: number;
  currency: string;
  due_date?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  metadata: Record<string, string>;
  period_start: number;
  period_end: number;
}

export class StripeService {
  private apiKey: string;
  private apiUrl = 'https://api.stripe.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`;
    const body = data ? this.encodeFormData(data) : undefined;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2023-10-16',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Stripe API error: ${response.status} - ${error.error?.message || 'Request failed'}`);
    }

    return response.json();
  }

  private encodeFormData(data: any): string {
    const params = new URLSearchParams();
    
    const flatten = (obj: any, prefix = '') => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const newKey = prefix ? `${prefix}[${key}]` : key;
          
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            flatten(value, newKey);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'object') {
                flatten(item, `${newKey}[${index}]`);
              } else {
                params.append(`${newKey}[${index}]`, String(item));
              }
            });
          } else if (value !== undefined && value !== null) {
            params.append(newKey, String(value));
          }
        }
      }
    };

    flatten(data);
    return params.toString();
  }

  /**
   * Create customer
   */
  async createCustomer(customerData: {
    email: string;
    name?: string;
    description?: string;
    phone?: string;
    metadata?: Record<string, string>;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  }): Promise<StripeCustomer> {
    return this.makeRequest('POST', '/customers', customerData);
  }

  /**
   * Get customer
   */
  async getCustomer(customerId: string): Promise<StripeCustomer> {
    return this.makeRequest('GET', `/customers/${customerId}`);
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId: string, customerData: Partial<{
    email: string;
    name: string;
    description: string;
    phone: string;
    metadata: Record<string, string>;
  }>): Promise<StripeCustomer> {
    return this.makeRequest('POST', `/customers/${customerId}`, customerData);
  }

  /**
   * List customers
   */
  async listCustomers(options?: {
    email?: string;
    limit?: number;
    starting_after?: string;
    ending_before?: string;
  }): Promise<{ data: StripeCustomer[]; has_more: boolean }> {
    return this.makeRequest('GET', '/customers', options);
  }

  /**
   * Create product
   */
  async createProduct(productData: {
    name: string;
    description?: string;
    metadata?: Record<string, string>;
    type?: 'good' | 'service';
    active?: boolean;
  }): Promise<StripeProduct> {
    return this.makeRequest('POST', '/products', {
      type: 'service',
      active: true,
      ...productData
    });
  }

  /**
   * Create price
   */
  async createPrice(priceData: {
    product: string;
    unit_amount: number;
    currency: string;
    recurring?: {
      interval: 'day' | 'week' | 'month' | 'year';
      interval_count?: number;
    };
    metadata?: Record<string, string>;
  }): Promise<StripePrice> {
    return this.makeRequest('POST', '/prices', priceData);
  }

  /**
   * List prices
   */
  async listPrices(options?: {
    product?: string;
    active?: boolean;
    limit?: number;
  }): Promise<{ data: StripePrice[] }> {
    return this.makeRequest('GET', '/prices', options);
  }

  /**
   * Create subscription
   */
  async createSubscription(subscriptionData: {
    customer: string;
    items: Array<{
      price: string;
      quantity?: number;
    }>;
    metadata?: Record<string, string>;
    trial_period_days?: number;
    default_payment_method?: string;
    collection_method?: 'charge_automatically' | 'send_invoice';
    payment_behavior?: 'default_incomplete' | 'error_if_incomplete' | 'allow_incomplete';
  }): Promise<StripeSubscription> {
    return this.makeRequest('POST', '/subscriptions', {
      payment_behavior: 'default_incomplete',
      collection_method: 'charge_automatically',
      expand: ['latest_invoice.payment_intent'],
      ...subscriptionData
    });
  }

  /**
   * Get subscription
   */
  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    return this.makeRequest('GET', `/subscriptions/${subscriptionId}`);
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, subscriptionData: {
    items?: Array<{
      id?: string;
      price?: string;
      quantity?: number;
      deleted?: boolean;
    }>;
    metadata?: Record<string, string>;
    default_payment_method?: string;
    cancel_at_period_end?: boolean;
    proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
  }): Promise<StripeSubscription> {
    return this.makeRequest('POST', `/subscriptions/${subscriptionId}`, subscriptionData);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, options?: {
    at_period_end?: boolean;
    invoice_now?: boolean;
    prorate?: boolean;
  }): Promise<StripeSubscription> {
    if (options?.at_period_end) {
      return this.updateSubscription(subscriptionId, { cancel_at_period_end: true });
    } else {
      return this.makeRequest('DELETE', `/subscriptions/${subscriptionId}`, options);
    }
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(paymentData: {
    amount: number;
    currency: string;
    customer?: string;
    description?: string;
    metadata?: Record<string, string>;
    payment_method?: string;
    confirm?: boolean;
    return_url?: string;
  }): Promise<StripePaymentIntent> {
    return this.makeRequest('POST', '/payment_intents', paymentData);
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string, data?: {
    payment_method?: string;
    return_url?: string;
  }): Promise<StripePaymentIntent> {
    return this.makeRequest('POST', `/payment_intents/${paymentIntentId}/confirm`, data);
  }

  /**
   * Create invoice
   */
  async createInvoice(invoiceData: {
    customer: string;
    subscription?: string;
    description?: string;
    metadata?: Record<string, string>;
    auto_advance?: boolean;
  }): Promise<StripeInvoice> {
    return this.makeRequest('POST', '/invoices', invoiceData);
  }

  /**
   * Finalize invoice
   */
  async finalizeInvoice(invoiceId: string): Promise<StripeInvoice> {
    return this.makeRequest('POST', `/invoices/${invoiceId}/finalize`);
  }

  /**
   * Pay invoice
   */
  async payInvoice(invoiceId: string, options?: {
    payment_method?: string;
    source?: string;
  }): Promise<StripeInvoice> {
    return this.makeRequest('POST', `/invoices/${invoiceId}/pay`, options);
  }

  /**
   * List invoices
   */
  async listInvoices(options?: {
    customer?: string;
    subscription?: string;
    status?: string;
    limit?: number;
  }): Promise<{ data: StripeInvoice[] }> {
    return this.makeRequest('GET', '/invoices', options);
  }

  /**
   * Create billing portal session
   */
  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<{
    id: string;
    url: string;
    created: number;
    customer: string;
    return_url: string;
  }> {
    return this.makeRequest('POST', '/billing_portal/sessions', {
      customer: customerId,
      return_url: returnUrl
    });
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(sessionData: {
    customer?: string;
    customer_email?: string;
    line_items: Array<{
      price: string;
      quantity: number;
    }>;
    mode: 'payment' | 'setup' | 'subscription';
    success_url: string;
    cancel_url: string;
    metadata?: Record<string, string>;
    subscription_data?: {
      metadata?: Record<string, string>;
      trial_period_days?: number;
    };
  }): Promise<{
    id: string;
    url: string;
    customer?: string;
    payment_intent?: string;
    subscription?: string;
  }> {
    return this.makeRequest('POST', '/checkout/sessions', sessionData);
  }

  /**
   * Get checkout session
   */
  async getCheckoutSession(sessionId: string): Promise<any> {
    return this.makeRequest('GET', `/checkout/sessions/${sessionId}`);
  }

  /**
   * Retrieve upcoming invoice
   */
  async getUpcomingInvoice(customerId: string, subscriptionId?: string): Promise<StripeInvoice> {
    const params: any = { customer: customerId };
    if (subscriptionId) {
      params.subscription = subscriptionId;
    }
    return this.makeRequest('GET', '/invoices/upcoming', params);
  }

  /**
   * List payment methods
   */
  async listPaymentMethods(customerId: string, type = 'card'): Promise<{ data: any[] }> {
    return this.makeRequest('GET', '/payment_methods', {
      customer: customerId,
      type
    });
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<any> {
    return this.makeRequest('POST', `/payment_methods/${paymentMethodId}/attach`, {
      customer: customerId
    });
  }

  /**
   * Create usage record (for metered billing)
   */
  async createUsageRecord(subscriptionItemId: string, data: {
    quantity: number;
    timestamp?: number;
    action?: 'increment' | 'set';
  }): Promise<any> {
    return this.makeRequest('POST', `/subscription_items/${subscriptionItemId}/usage_records`, {
      timestamp: Math.floor(Date.now() / 1000),
      action: 'increment',
      ...data
    });
  }

  /**
   * Sync with PrivacyGuard billing
   */
  async syncWithPrivacyGuard(data: {
    user_id: string;
    organization_id: string;
    email: string;
    subscription_tier: string;
    credits_used: number;
  }): Promise<{
    customer_id: string;
    subscription_id?: string;
    invoice_id?: string;
    next_billing_date?: string;
  }> {
    // Find or create customer
    const existingCustomers = await this.listCustomers({ email: data.email, limit: 1 });
    
    let customer: StripeCustomer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await this.createCustomer({
        email: data.email,
        metadata: {
          privacy_guard_user_id: data.user_id,
          privacy_guard_org_id: data.organization_id
        }
      });
    }

    // Handle subscription based on tier
    if (data.subscription_tier !== 'ai_assistant') {
      // Create or update subscription for paid tiers
      const prices = await this.listPrices({ active: true });
      const tierPrice = prices.data.find(price => 
        price.metadata.privacy_guard_tier === data.subscription_tier
      );

      if (tierPrice) {
        const subscription = await this.createSubscription({
          customer: customer.id,
          items: [{ price: tierPrice.id, quantity: 1 }],
          metadata: {
            privacy_guard_tier: data.subscription_tier,
            privacy_guard_org_id: data.organization_id
          }
        });

        return {
          customer_id: customer.id,
          subscription_id: subscription.id,
          next_billing_date: new Date(subscription.current_period_end * 1000).toISOString()
        };
      }
    }

    // Handle credits-based billing for usage
    if (data.credits_used > 0) {
      const paymentIntent = await this.createPaymentIntent({
        amount: data.credits_used * 100, // Assuming $1 per credit
        currency: 'usd',
        customer: customer.id,
        description: `PrivacyGuard credits usage: ${data.credits_used} credits`,
        metadata: {
          privacy_guard_org_id: data.organization_id,
          credits_used: String(data.credits_used)
        }
      });

      return {
        customer_id: customer.id,
        invoice_id: paymentIntent.id
      };
    }

    return {
      customer_id: customer.id
    };
  }
}
