import { Shield } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl animate-pulse"></div>
            <Shield className="w-8 h-8 text-white relative z-10" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full animate-pulse"></div>
            <div className="h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full animate-pulse delay-75"></div>
            <div className="h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading PrivacyGuard</h2>
        <p className="text-sm text-gray-500 mt-2">Securing your data protection workflow...</p>
      </div>
    </div>
  );
}
