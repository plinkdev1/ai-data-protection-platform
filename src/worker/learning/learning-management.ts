export interface LearningEnv {
  ACADEMY_OF_MINE_API_KEY: string;
  EDAPP_API_KEY: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'gdpr_basics' | 'data_handling' | 'incident_response' | 'dpo_certification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  modules: CourseModule[];
  completionCriteria: {
    passingScore: number;
    requiredModules: string[];
  };
}

export interface CourseModule {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'simulation';
  content: string;
  duration: number;
  resources: Array<{
    type: 'pdf' | 'link' | 'video';
    title: string;
    url: string;
  }>;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetRole: 'dpo' | 'admin' | 'staff' | 'all';
  courses: string[];
  estimatedDuration: number;
  prerequisites: string[];
}

export interface UserProgress {
  userId: string;
  courseId: string;
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
  currentModule: string;
  score?: number;
  certificateId?: string;
}

export class LearningManagement {
  constructor(private env: LearningEnv) {}

  // Academy of Mine integration for comprehensive compliance training
  async createAcademyOfMineCourse(course: {
    title: string;
    description: string;
    category: string;
    content: Array<{
      type: 'lesson' | 'quiz' | 'assignment';
      title: string;
      content: string;
      duration?: number;
    }>;
  }): Promise<string> {
    try {
      const response = await fetch('https://api.academyofmine.com/v1/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.ACADEMY_OF_MINE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: {
            title: course.title,
            description: course.description,
            category: course.category,
            lessons: course.content.map((item, index) => ({
              id: `lesson_${index}`,
              title: item.title,
              content: item.content,
              type: item.type,
              duration: item.duration || 30,
            })),
          },
        }),
      });

      const data = await response.json();
      return data.course?.id;
    } catch (error) {
      console.error('Academy of Mine course creation failed:', error);
      throw error;
    }
  }

  async enrollUserInAcademyCourse(userId: string, courseId: string): Promise<void> {
    try {
      await fetch(`https://api.academyofmine.com/v1/courses/${courseId}/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.ACADEMY_OF_MINE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          enrollment_date: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Academy of Mine enrollment failed:', error);
      throw error;
    }
  }

  async getAcademyProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    try {
      const response = await fetch(
        `https://api.academyofmine.com/v1/courses/${courseId}/users/${userId}/progress`,
        {
          headers: {
            'Authorization': `Bearer ${this.env.ACADEMY_OF_MINE_API_KEY}`,
          },
        }
      );

      const data = await response.json();
      
      return {
        userId,
        courseId,
        progress: data.completion_percentage || 0,
        startedAt: new Date(data.started_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        currentModule: data.current_lesson_id || '',
        score: data.final_score,
        certificateId: data.certificate_id,
      };
    } catch (error) {
      console.error('Academy of Mine progress fetch failed:', error);
      return null;
    }
  }

  // EdApp integration for microlearning and gamification
  async createEdAppLearningPath(learningPath: {
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      type: 'quiz' | 'flashcard' | 'drag_drop' | 'video';
      content: any;
      points: number;
    }>;
  }): Promise<string> {
    try {
      const response = await fetch('https://api.edapp.com/v1/learning-paths', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.EDAPP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: learningPath.title,
          description: learningPath.description,
          lessons: learningPath.lessons.map((lesson, index) => ({
            id: `lesson_${index}`,
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            gamification: {
              points: lesson.points,
              badges: this.generateBadges(lesson.title),
            },
          })),
        }),
      });

      const data = await response.json();
      return data.learning_path?.id;
    } catch (error) {
      console.error('EdApp learning path creation failed:', error);
      throw error;
    }
  }

  private generateBadges(lessonTitle: string): Array<{ name: string; icon: string }> {
    const badges = [];
    
    if (lessonTitle.toLowerCase().includes('gdpr')) {
      badges.push({ name: 'GDPR Expert', icon: 'shield' });
    }
    if (lessonTitle.toLowerCase().includes('data')) {
      badges.push({ name: 'Data Guardian', icon: 'database' });
    }
    if (lessonTitle.toLowerCase().includes('security')) {
      badges.push({ name: 'Security Champion', icon: 'lock' });
    }
    
    return badges;
  }

  async assignEdAppCourse(userId: string, learningPathId: string): Promise<void> {
    try {
      await fetch(`https://api.edapp.com/v1/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.EDAPP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          learning_path_id: learningPathId,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        }),
      });
    } catch (error) {
      console.error('EdApp assignment failed:', error);
      throw error;
    }
  }

  // AI-powered content generation using OpenAI and Anthropic
  async generateCourseContent(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<Course> {
    try {
      const prompt = `Create a comprehensive ${difficulty}-level training course about ${topic} for data protection compliance. Include:
      1. Course title and description
      2. 5-7 learning modules with detailed content
      3. Quiz questions for each module
      4. Practical exercises
      5. Real-world scenarios`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'You are an expert in data protection law and compliance training. Generate structured, accurate, and engaging course content.',
          }, {
            role: 'user',
            content: prompt,
          }],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return this.parseCourseContent(content, topic, difficulty);
    } catch (error) {
      console.error('AI content generation failed:', error);
      return this.getDefaultCourse(topic, difficulty);
    }
  }

  private parseCourseContent(content: string, topic: string, difficulty: string): Course {
    // Parse the AI-generated content into structured course format
    const lines = content.split('\n');
    let currentSection = '';
    const modules: CourseModule[] = [];
    let currentModule: Partial<CourseModule> = {};

    for (const line of lines) {
      if (line.includes('Module') || line.includes('Chapter')) {
        if (currentModule.title) {
          modules.push(currentModule as CourseModule);
        }
        currentModule = {
          id: crypto.randomUUID(),
          title: line.trim(),
          type: 'text',
          content: '',
          duration: 15,
          resources: [],
        };
      } else if (currentModule.title && line.trim()) {
        currentModule.content += line + '\n';
      }
    }

    if (currentModule.title) {
      modules.push(currentModule as CourseModule);
    }

    return {
      id: crypto.randomUUID(),
      title: `${topic} Training - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      description: `Comprehensive ${difficulty}-level training on ${topic}`,
      category: this.mapTopicToCategory(topic),
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      duration: modules.length * 15,
      modules,
      completionCriteria: {
        passingScore: 80,
        requiredModules: modules.map(m => m.id),
      },
    };
  }

  private mapTopicToCategory(topic: string): 'gdpr_basics' | 'data_handling' | 'incident_response' | 'dpo_certification' {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('gdpr') || topicLower.includes('regulation')) {
      return 'gdpr_basics';
    }
    if (topicLower.includes('incident') || topicLower.includes('breach')) {
      return 'incident_response';
    }
    if (topicLower.includes('dpo') || topicLower.includes('officer')) {
      return 'dpo_certification';
    }
    
    return 'data_handling';
  }

  private getDefaultCourse(topic: string, difficulty: string): Course {
    return {
      id: crypto.randomUUID(),
      title: `${topic} Training`,
      description: `${difficulty} level training on ${topic}`,
      category: 'gdpr_basics',
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      duration: 60,
      modules: [{
        id: crypto.randomUUID(),
        title: 'Introduction',
        type: 'text',
        content: `Welcome to ${topic} training.`,
        duration: 15,
        resources: [],
      }],
      completionCriteria: {
        passingScore: 80,
        requiredModules: [],
      },
    };
  }

  // Enhanced content analysis with Anthropic Claude
  async analyzeComplianceDocument(document: string): Promise<{
    summary: string;
    keyPoints: string[];
    complianceGaps: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Analyze this compliance document for GDPR and data protection issues:

${document}

Please provide:
1. Executive summary
2. Key compliance points
3. Identified gaps or issues
4. Recommendations for improvement
5. Overall risk assessment

Format your response as JSON with the fields: summary, keyPoints, complianceGaps, recommendations, riskLevel.`,
          }],
        }),
      });

      const data = await response.json();
      const analysis = JSON.parse(data.content[0]?.text || '{}');

      return {
        summary: analysis.summary || 'No summary available',
        keyPoints: analysis.keyPoints || [],
        complianceGaps: analysis.complianceGaps || [],
        recommendations: analysis.recommendations || [],
        riskLevel: analysis.riskLevel || 'medium',
      };
    } catch (error) {
      console.error('Document analysis failed:', error);
      return {
        summary: 'Analysis failed',
        keyPoints: [],
        complianceGaps: [],
        recommendations: [],
        riskLevel: 'medium',
      };
    }
  }

  // Learning analytics and progress tracking
  async generateLearningReport(organizationId: string): Promise<{
    overallProgress: number;
    completionRates: Record<string, number>;
    topPerformers: Array<{ userId: string; score: number }>;
    strugglingUsers: Array<{ userId: string; progress: number }>;
    recommendations: string[];
  }> {
    try {
      // This would query your actual learning data
      const mockData = {
        overallProgress: 78,
        completionRates: {
          'gdpr_basics': 85,
          'data_handling': 72,
          'incident_response': 65,
          'dpo_certification': 45,
        },
        topPerformers: [
          { userId: 'user1', score: 95 },
          { userId: 'user2', score: 92 },
          { userId: 'user3', score: 90 },
        ],
        strugglingUsers: [
          { userId: 'user4', progress: 25 },
          { userId: 'user5', progress: 15 },
        ],
        recommendations: [
          'Focus on incident response training completion',
          'Provide additional support for struggling learners',
          'Consider gamification for DPO certification course',
        ],
      };

      return mockData;
    } catch (error) {
      console.error('Learning report generation failed:', error);
      throw error;
    }
  }

  // Automated learning path recommendations
  async recommendLearningPath(userProfile: {
    role: string;
    experience: 'novice' | 'intermediate' | 'expert';
    completedCourses: string[];
    learningGoals: string[];
  }): Promise<LearningPath[]> {
    const allPaths: LearningPath[] = [
      {
        id: 'gdpr-fundamentals',
        name: 'GDPR Fundamentals',
        description: 'Essential GDPR knowledge for all staff',
        targetRole: 'all',
        courses: ['gdpr-basics', 'data-rights', 'legal-basis'],
        estimatedDuration: 180,
        prerequisites: [],
      },
      {
        id: 'dpo-certification',
        name: 'Data Protection Officer Certification',
        description: 'Comprehensive DPO training and certification',
        targetRole: 'dpo',
        courses: ['gdpr-advanced', 'risk-assessment', 'incident-management', 'auditing'],
        estimatedDuration: 720,
        prerequisites: ['gdpr-fundamentals'],
      },
      {
        id: 'incident-response',
        name: 'Data Breach Response',
        description: 'Training for handling data security incidents',
        targetRole: 'admin',
        courses: ['breach-detection', 'notification-procedures', 'crisis-management'],
        estimatedDuration: 240,
        prerequisites: ['gdpr-fundamentals'],
      },
    ];

    // Filter based on user profile
    return allPaths.filter(path => {
      // Check role compatibility
      if (path.targetRole !== 'all' && path.targetRole !== userProfile.role) {
        return false;
      }

      // Check prerequisites
      const hasPrerequisites = path.prerequisites.every(prereq => 
        userProfile.completedCourses.includes(prereq)
      );

      if (!hasPrerequisites) {
        return false;
      }

      // Check if already completed
      const alreadyCompleted = path.courses.every(course => 
        userProfile.completedCourses.includes(course)
      );

      return !alreadyCompleted;
    });
  }

  // Health check for learning management services
  async healthCheck(): Promise<{
    academyOfMine: boolean;
    edapp: boolean;
    openai: boolean;
    anthropic: boolean;
  }> {
    const health = {
      academyOfMine: false,
      edapp: false,
      openai: false,
      anthropic: false,
    };

    try {
      const response = await fetch('https://api.academyofmine.com/v1/health', {
        headers: {
          'Authorization': `Bearer ${this.env.ACADEMY_OF_MINE_API_KEY}`,
        },
      });
      health.academyOfMine = response.ok;
    } catch {
      // Academy of Mine not available
    }

    try {
      const response = await fetch('https://api.edapp.com/v1/health', {
        headers: {
          'Authorization': `Bearer ${this.env.EDAPP_API_KEY}`,
        },
      });
      health.edapp = response.ok;
    } catch {
      // EdApp not available
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`,
        },
      });
      health.openai = response.ok;
    } catch {
      // OpenAI not available
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });
      health.anthropic = response.ok;
    } catch {
      // Anthropic not available
    }

    return health;
  }
}
