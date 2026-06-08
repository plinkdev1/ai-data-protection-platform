import { useState } from 'react';
import { X, ChevronDown, FileText, Users, Shield, HelpCircle, Briefcase, Book } from 'lucide-react';
import { Link } from 'react-router';

interface MobileFooterMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFooterMenu({ isOpen, onClose }: MobileFooterMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const footerSections = [
    {
      title: "Platform",
      icon: <Shield className="w-5 h-5" />,
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "Security", href: "/security" },
        { label: "Integrations", href: "/integrations" },
        { label: "API Documentation", href: "/api-docs" }
      ]
    },
    {
      title: "Solutions",
      icon: <Briefcase className="w-5 h-5" />,
      links: [
        { label: "GDPR Compliance", href: "/solutions/gdpr" },
        { label: "CCPA Compliance", href: "/solutions/ccpa" },
        { label: "Healthcare (HIPAA)", href: "/solutions/hipaa" },
        { label: "Financial Services", href: "/solutions/financial" },
        { label: "E-commerce", href: "/solutions/ecommerce" },
        { label: "SaaS Companies", href: "/solutions/saas" }
      ]
    },
    {
      title: "Resources",
      icon: <Book className="w-5 h-5" />,
      links: [
        { label: "Learning Center", href: "/learning" },
        { label: "Policy Catalog", href: "/policy-catalog" },
        { label: "Blog", href: "/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Whitepapers", href: "/whitepapers" },
        { label: "Webinars", href: "/webinars" }
      ]
    },
    {
      title: "Support",
      icon: <HelpCircle className="w-5 h-5" />,
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Support", href: "/support" },
        { label: "FAQ", href: "/faq" },
        { label: "System Status", href: "/status" },
        { label: "Community Forum", href: "/community" },
        { label: "Training", href: "/training" }
      ]
    },
    {
      title: "Company",
      icon: <Users className="w-5 h-5" />,
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Partners", href: "/partners" },
        { label: "Investors", href: "/investors" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      icon: <FileText className="w-5 h-5" />,
      links: [
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Cookie Policy", href: "/legal/cookies" },
        { label: "DPA Agreement", href: "/legal/dpa" },
        { label: "Compliance", href: "/legal/compliance" },
        { label: "Data Processing", href: "/legal/processing" }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-2">
          {footerSections.map((section) => (
            <div key={section.title} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <span className="font-medium text-gray-900">{section.title}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedSection === section.title ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {expandedSection === section.title && (
                <div className="border-t border-gray-200 bg-white">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={onClose}
                      className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="sticky bottom-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 m-4 rounded-xl">
          <div className="text-center">
            <h3 className="text-white font-bold mb-2">Ready to get started?</h3>
            <p className="text-blue-100 text-sm mb-4">Join thousands of organizations managing compliance with DPOhub</p>
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/pricing"
                onClick={onClose}
                className="block w-full bg-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
