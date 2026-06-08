import { Shield, Menu, Bell, User, LogOut, Activity, FileCheck, AlertTriangle, FileText, Brain, BookOpen, MessageCircle, Settings, HelpCircle, ClipboardList, ChevronDown, Home, Briefcase } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationLinkProps {
  to: string;
  icon: string;
  children: React.ReactNode;
}

function NavigationLink({ to, icon, children }: NavigationLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const iconMap = {
    dashboard: <Home className="w-4 h-4" />,
    activity: <Activity className="w-4 h-4" />,
    fileCheck: <FileCheck className="w-4 h-4" />,
    user: <User className="w-4 h-4" />,
    alertTriangle: <AlertTriangle className="w-4 h-4" />,
    fileText: <FileText className="w-4 h-4" />,
    brain: <Brain className="w-4 h-4" />,
    bookOpen: <BookOpen className="w-4 h-4" />,
    messageCircle: <MessageCircle className="w-4 h-4" />,
    settings: <Settings className="w-4 h-4" />,
    helpCircle: <HelpCircle className="w-4 h-4" />,
    clipboardList: <ClipboardList className="w-4 h-4" />,
    briefcase: <Briefcase className="w-4 h-4" />
  };

  return (
    <Link
      to={to}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
        }
      `}
    >
      {iconMap[icon as keyof typeof iconMap] || <Home className="w-4 h-4" />}
      <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
        {children}
      </span>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [providerLoading, setProviderLoading] = useState(true);

  // Check if user is a provider
  useEffect(() => {
    if (user) {
      checkProviderStatus();
    } else {
      setProviderLoading(false);
    }
  }, [user]);

  const checkProviderStatus = async () => {
    try {
      const response = await fetch('/api/user/provider-status', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsProvider(data.isProvider);
      }
    } catch (error) {
      console.error('Failed to check provider status:', error);
    } finally {
      setProviderLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Set logout flag before clearing storage
      localStorage.setItem('dpohub_logging_out', 'true');
      
      // Clear all local storage and session storage
      const loggingOutFlag = localStorage.getItem('dpohub_logging_out');
      localStorage.clear();
      sessionStorage.clear();
      
      // Restore the logout flag
      if (loggingOutFlag) {
        localStorage.setItem('dpohub_logging_out', 'true');
      }
      
      // Call the logout function
      await logout();
      
      // Add a delay to ensure the logout completes and auth state clears
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force complete page reload to ensure clean state
      window.location.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // On error, still clear everything and force redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
      { to: '/processing-activities', icon: 'activity', label: 'Processing Activities' },
      { to: '/dpias', icon: 'fileCheck', label: 'DPIAs' },
      { to: '/data-requests', icon: 'user', label: 'Data Subject Requests' },
      { to: '/incidents', icon: 'alertTriangle', label: 'Data Breaches' },
      { to: '/policies', icon: 'fileText', label: 'Policies' },
      { to: '/audit-trail', icon: 'brain', label: 'AI Audit Trail' }
    ];

    const customerItems = [
      { to: '/my-providers', icon: 'clipboardList', label: 'My Providers / Services' }
    ];

    const providerItems = [
      { to: '/provider-dashboard', icon: 'settings', label: 'Provider Dashboard' }
    ];

    const learningItems = [
      { to: '/learning', icon: 'bookOpen', label: 'Learning Center' },
      { to: '/policy-catalog', icon: 'fileText', label: 'Policy Catalog' },
      { to: '/support', icon: 'helpCircle', label: 'Support' }
    ];

    return [
      ...baseItems,
      ...(isProvider ? providerItems : customerItems),
      ...learningItems
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            {/* Desktop menu button (original sidebar toggle) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Mobile sandwich menu button */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span className="text-sm font-medium">Menu</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile dropdown menu */}
              {isMobileMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                        <p className="text-xs text-gray-500">Data Protection Officer</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation items */}
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {navigationItems.map((item) => {
                      const iconMap = {
                        dashboard: <Home className="w-4 h-4" />,
                        activity: <Activity className="w-4 h-4" />,
                        fileCheck: <FileCheck className="w-4 h-4" />,
                        user: <User className="w-4 h-4" />,
                        alertTriangle: <AlertTriangle className="w-4 h-4" />,
                        fileText: <FileText className="w-4 h-4" />,
                        brain: <Brain className="w-4 h-4" />,
                        bookOpen: <BookOpen className="w-4 h-4" />,
                        messageCircle: <MessageCircle className="w-4 h-4" />,
                        settings: <Settings className="w-4 h-4" />,
                        helpCircle: <HelpCircle className="w-4 h-4" />,
                        clipboardList: <ClipboardList className="w-4 h-4" />,
                        briefcase: <Briefcase className="w-4 h-4" />
                      };
                      const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {IconComponent}
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DPOhub
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">DPO-as-a-Service Platform</p>
              </div>
            </div>
          </div>

          {/* Right side of header */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Desktop user info */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">Data Protection Officer</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`
          hidden lg:block fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md 
          border-r border-white/20 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 mt-4">
            <NavigationLink to="/dashboard" icon="dashboard">
              Dashboard
            </NavigationLink>
            <NavigationLink to="/processing-activities" icon="activity">
              Processing Activities
            </NavigationLink>
            <NavigationLink to="/dpias" icon="fileCheck">
              DPIAs
            </NavigationLink>
            <NavigationLink to="/data-requests" icon="user">
              Data Subject Requests
            </NavigationLink>
            <NavigationLink to="/incidents" icon="alertTriangle">
              Data Breaches
            </NavigationLink>
            <NavigationLink to="/policies" icon="fileText">
              Policies
            </NavigationLink>
            <NavigationLink to="/audit-trail" icon="brain">
              AI Audit Trail
            </NavigationLink>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {/* Role-specific navigation */}
            {!providerLoading && (
              <>
                {isProvider ? (
                  <NavigationLink to="/provider-dashboard" icon="settings">
                    Provider Dashboard
                  </NavigationLink>
                ) : (
                  <NavigationLink to="/my-providers" icon="clipboardList">
                    My Providers / Services
                  </NavigationLink>
                )}
              </>
            )}
            
            {/* Learning & Support Section */}
            <div className="border-t border-gray-200 my-4"></div>
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Learning & Support</p>
            </div>
            <NavigationLink to="/learning" icon="bookOpen">
              Learning Center
            </NavigationLink>
            <NavigationLink to="/policy-catalog" icon="fileText">
              Policy Catalog
            </NavigationLink>
            <NavigationLink to="/support" icon="helpCircle">
              Support
            </NavigationLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
