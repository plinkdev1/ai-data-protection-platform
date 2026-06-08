import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  Star,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  Brain,
  Shield,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface LearningModule {
  id: number;
  module_key: string;
  title: string;
  category: string;
  difficulty_level: string;
  description: string;
  content?: string;
  video_url?: string;
  infographic_url?: string;
  duration_minutes: number;
  points_reward: number;
  prerequisites?: number[];
  is_active: boolean;
  sort_order: number;
}

interface UserProgress {
  id: number;
  user_id: string;
  module_id: number;
  status: string;
  progress_percentage: number;
  score: number;
  completion_date?: string;
}

export default function LearningPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLearningData();
    }
  }, [user]);

  const fetchLearningData = async () => {
    try {
      // In a real implementation, these would be separate API calls
      const mockModules: LearningModule[] = [
        {
          id: 1,
          module_key: 'gdpr_fundamentals',
          title: 'GDPR Fundamentals',
          category: 'privacy_law',
          difficulty_level: 'beginner',
          description: 'Master the basics of GDPR compliance including key principles, rights, and obligations.',
          duration_minutes: 45,
          points_reward: 50,
          is_active: true,
          sort_order: 1,
          video_url: 'https://example.com/gdpr-basics'
        },
        {
          id: 2,
          module_key: 'data_mapping',
          title: 'Data Mapping & Classification',
          category: 'data_governance',
          difficulty_level: 'intermediate',
          description: 'Learn how to map data flows and classify data according to sensitivity and risk levels.',
          duration_minutes: 60,
          points_reward: 75,
          is_active: true,
          sort_order: 2,
          prerequisites: [1]
        },
        {
          id: 3,
          module_key: 'incident_response',
          title: 'Data Breach Response',
          category: 'incident_management',
          difficulty_level: 'advanced',
          description: 'Comprehensive guide to handling data breaches including detection, containment, and notification.',
          duration_minutes: 90,
          points_reward: 100,
          is_active: true,
          sort_order: 3,
          prerequisites: [1, 2]
        },
        {
          id: 4,
          module_key: 'dpo_certification',
          title: 'DPO Certification Prep',
          category: 'certification',
          difficulty_level: 'advanced',
          description: 'Prepare for professional DPO certification with comprehensive training and practice exams.',
          duration_minutes: 180,
          points_reward: 200,
          is_active: true,
          sort_order: 4,
          prerequisites: [1, 2, 3]
        },
        {
          id: 5,
          module_key: 'privacy_by_design',
          title: 'Privacy by Design',
          category: 'design_principles',
          difficulty_level: 'intermediate',
          description: 'Implement privacy-first design principles in systems and processes.',
          duration_minutes: 75,
          points_reward: 85,
          is_active: true,
          sort_order: 5,
          prerequisites: [1]
        },
        {
          id: 6,
          module_key: 'vendor_management',
          title: 'Third-Party Risk Management',
          category: 'risk_management',
          difficulty_level: 'intermediate',
          description: 'Manage privacy and security risks in vendor relationships and data processing agreements.',
          duration_minutes: 55,
          points_reward: 65,
          is_active: true,
          sort_order: 6
        }
      ];

      const mockProgress: UserProgress[] = [
        {
          id: 1,
          user_id: user?.id || '',
          module_id: 1,
          status: 'completed',
          progress_percentage: 100,
          score: 85,
          completion_date: '2024-01-15'
        },
        {
          id: 2,
          user_id: user?.id || '',
          module_id: 2,
          status: 'in_progress',
          progress_percentage: 60,
          score: 0
        }
      ];

      setModules(mockModules);
      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Failed to fetch learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleProgress = (moduleId: number) => {
    return userProgress.find(p => p.module_id === moduleId);
  };

  const canAccessModule = (module: LearningModule) => {
    if (!module.prerequisites?.length) return true;
    
    return module.prerequisites.every(prereqId => {
      const progress = getModuleProgress(prereqId);
      return progress?.status === 'completed';
    });
  };

  const getTotalPoints = () => {
    return userProgress
      .filter(p => p.status === 'completed')
      .reduce((total, p) => {
        const module = modules.find(m => m.id === p.module_id);
        return total + (module?.points_reward || 0);
      }, 0);
  };

  const getCompletedModulesCount = () => {
    return userProgress.filter(p => p.status === 'completed').length;
  };

  const categories = [
    { key: 'all', label: 'All Categories', icon: BookOpen },
    { key: 'privacy_law', label: 'Privacy Law', icon: Shield },
    { key: 'data_governance', label: 'Data Governance', icon: FileText },
    { key: 'incident_management', label: 'Incident Management', icon: AlertTriangle },
    { key: 'certification', label: 'Certification', icon: Award },
    { key: 'design_principles', label: 'Design Principles', icon: Brain },
    { key: 'risk_management', label: 'Risk Management', icon: Target }
  ];

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading learning center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Center</h1>
              <p className="text-gray-600 mt-1">
                Master data protection and privacy compliance through interactive learning
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{getTotalPoints()}</span>
                </div>
                <p className="text-sm text-gray-500">Total Points</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">{getCompletedModulesCount()}</span>
                </div>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round((getCompletedModulesCount() / modules.length) * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Learning Hours</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userProgress
                    .filter(p => p.status === 'completed')
                    .reduce((total, p) => {
                      const module = modules.find(m => m.id === p.module_id);
                      return total + (module?.duration_minutes || 0);
                    }, 0) / 60}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userProgress.filter(p => p.status === 'completed').length > 0 
                    ? Math.round(
                        userProgress
                          .filter(p => p.status === 'completed')
                          .reduce((sum, p) => sum + p.score, 0) / 
                        userProgress.filter(p => p.status === 'completed').length
                      )
                    : 0}%
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rank</p>
                <p className="text-3xl font-bold text-gray-900">Gold</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const progress = getModuleProgress(module.id);
            const canAccess = canAccessModule(module);
            
            return (
              <div 
                key={module.id} 
                className={`bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 transition-all hover:bg-white/80 ${
                  canAccess ? 'cursor-pointer hover:shadow-lg' : 'opacity-60'
                }`}
                onClick={() => {
                  if (canAccess) {
                    setSelectedModule(module);
                    setShowModuleModal(true);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  </div>
                  
                  {progress && (
                    <div className={`ml-4 ${getStatusColor(progress.status)}`}>
                      {progress.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : progress.status === 'in_progress' ? (
                        <Play className="w-6 h-6" />
                      ) : (
                        <BookOpen className="w-6 h-6" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(module.difficulty_level)}`}>
                    {module.difficulty_level}
                  </span>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration_minutes}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{module.points_reward}pts</span>
                    </div>
                  </div>
                </div>

                {progress && progress.status === 'in_progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {!canAccess && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      Complete prerequisite modules to unlock
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {module.video_url && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Video</span>
                    )}
                    {module.infographic_url && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Interactive</span>
                    )}
                  </div>
                  
                  {canAccess && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Detail Modal */}
      {showModuleModal && selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(selectedModule.difficulty_level)}`}>
                    {selectedModule.difficulty_level}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{selectedModule.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Award className="w-4 h-4" />
                    <span>{selectedModule.points_reward} points</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModuleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedModule.description}</p>
                </div>

                {selectedModule.prerequisites && selectedModule.prerequisites.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
                    <div className="space-y-2">
                      {selectedModule.prerequisites.map(prereqId => {
                        const prereqModule = modules.find(m => m.id === prereqId);
                        const prereqProgress = getModuleProgress(prereqId);
                        return (
                          <div key={prereqId} className="flex items-center space-x-2">
                            {prereqProgress?.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <span className={prereqProgress?.status === 'completed' ? 'text-gray-900' : 'text-gray-500'}>
                              {prereqModule?.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What You'll Learn</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Core principles and requirements</li>
                    <li>Practical implementation strategies</li>
                    <li>Common challenges and solutions</li>
                    <li>Real-world case studies</li>
                    <li>Best practices and compliance tips</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModuleModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
              
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
