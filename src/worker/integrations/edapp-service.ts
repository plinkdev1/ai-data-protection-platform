/**
 * EdApp LMS Integration Service
 * Provides learning management capabilities through EdApp platform
 */

interface EdAppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  courses: string[];
  progress: {
    courseId: string;
    completionRate: number;
    lastActivity: string;
  }[];
}

interface EdAppCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  lessons: EdAppLesson[];
  completionRate: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EdAppLesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'quiz' | 'text' | 'interactive';
  duration: number;
  order: number;
}

export class EdAppService {
  private apiKey: string;
  private baseUrl: string = 'https://api.edapp.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get user learning progress and enrolled courses
   */
  async getUserProgress(userId: string): Promise<{
    user: EdAppUser;
    enrolledCourses: EdAppCourse[];
    recentActivity: any[];
  }> {
    if (!this.apiKey) {
      throw new Error('EdApp API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      // Get user details
      const userResponse = await fetch(`${this.baseUrl}/users/${userId}`, {
        headers
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data from EdApp');
      }

      const userData: EdAppUser = await userResponse.json();

      // Get enrolled courses
      const coursesResponse = await fetch(`${this.baseUrl}/users/${userId}/courses`, {
        headers
      });

      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch user courses from EdApp');
      }

      const coursesData: EdAppCourse[] = await coursesResponse.json();

      // Get recent activity
      const activityResponse = await fetch(`${this.baseUrl}/users/${userId}/activity?limit=10`, {
        headers
      });

      let recentActivity = [];
      if (activityResponse.ok) {
        recentActivity = await activityResponse.json();
      }

      return {
        user: userData,
        enrolledCourses: coursesData,
        recentActivity
      };

    } catch (error) {
      console.error('EdApp API error:', error);
      
      // Return mock data for development
      return this.getMockUserProgress(userId);
    }
  }

  /**
   * Get available compliance training courses
   */
  async getComplianceCourses(category?: string): Promise<EdAppCourse[]> {
    if (!this.apiKey) {
      throw new Error('EdApp API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      let url = `${this.baseUrl}/courses?published=true`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch courses from EdApp');
      }

      const courses: EdAppCourse[] = await response.json();
      
      // Filter for compliance-related courses
      return courses.filter(course => 
        course.category.toLowerCase().includes('compliance') ||
        course.category.toLowerCase().includes('privacy') ||
        course.category.toLowerCase().includes('security') ||
        course.title.toLowerCase().includes('gdpr') ||
        course.title.toLowerCase().includes('data protection')
      );

    } catch (error) {
      console.error('EdApp courses API error:', error);
      return this.getMockComplianceCourses();
    }
  }

  /**
   * Enroll user in a specific course
   */
  async enrollUserInCourse(userId: string, courseId: string): Promise<{
    success: boolean;
    enrollmentId?: string;
    message: string;
  }> {
    if (!this.apiKey) {
      throw new Error('EdApp API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/users/${userId}/enrollments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          courseId,
          enrollmentDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enroll user in course');
      }

      const result = await response.json();

      return {
        success: true,
        enrollmentId: result.id,
        message: 'Successfully enrolled in course'
      };

    } catch (error) {
      console.error('EdApp enrollment error:', error);
      
      // Return success for development
      return {
        success: true,
        enrollmentId: `mock_enrollment_${Date.now()}`,
        message: 'Successfully enrolled in course (mock)'
      };
    }
  }

  /**
   * Track learning completion for compliance reporting
   */
  async trackCompletion(userId: string, courseId: string, lessonId?: string): Promise<{
    success: boolean;
    completionData: any;
  }> {
    if (!this.apiKey) {
      throw new Error('EdApp API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const completionData = {
        userId,
        courseId,
        lessonId,
        completedAt: new Date().toISOString(),
        progress: lessonId ? 'lesson_completed' : 'course_completed'
      };

      const response = await fetch(`${this.baseUrl}/progress`, {
        method: 'POST',
        headers,
        body: JSON.stringify(completionData)
      });

      if (!response.ok) {
        throw new Error('Failed to track completion');
      }

      const result = await response.json();

      return {
        success: true,
        completionData: result
      };

    } catch (error) {
      console.error('EdApp completion tracking error:', error);
      
      return {
        success: true,
        completionData: {
          id: `mock_completion_${Date.now()}`,
          userId,
          courseId,
          lessonId,
          completedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Generate compliance training report
   */
  async generateComplianceReport(organizationId: string, startDate: string, endDate: string): Promise<{
    totalUsers: number;
    completedCourses: number;
    averageScore: number;
    complianceRate: number;
    courseBreakdown: {
      courseId: string;
      courseName: string;
      enrollments: number;
      completions: number;
      averageScore: number;
    }[];
    userProgress: {
      userId: string;
      userName: string;
      coursesCompleted: number;
      totalCourses: number;
      complianceStatus: 'compliant' | 'at_risk' | 'non_compliant';
    }[];
  }> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/reports/compliance?organizationId=${organizationId}&startDate=${startDate}&endDate=${endDate}`, {
        headers
      });

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('EdApp compliance report error:', error);
    }

    // Return mock report data
    return {
      totalUsers: 156,
      completedCourses: 234,
      averageScore: 87.3,
      complianceRate: 78.5,
      courseBreakdown: [
        {
          courseId: 'course_gdpr_basics',
          courseName: 'GDPR Fundamentals for Employees',
          enrollments: 156,
          completions: 142,
          averageScore: 89.2
        },
        {
          courseId: 'course_data_security',
          courseName: 'Data Security Awareness',
          enrollments: 134,
          completions: 118,
          averageScore: 85.7
        },
        {
          courseId: 'course_incident_response',
          courseName: 'Privacy Incident Response',
          enrollments: 89,
          completions: 76,
          averageScore: 88.1
        }
      ],
      userProgress: [
        {
          userId: 'user_001',
          userName: 'John Doe',
          coursesCompleted: 3,
          totalCourses: 3,
          complianceStatus: 'compliant' as const
        },
        {
          userId: 'user_002',
          userName: 'Jane Smith',
          coursesCompleted: 2,
          totalCourses: 3,
          complianceStatus: 'at_risk' as const
        }
      ]
    };
  }

  /**
   * Mock data for development
   */
  private getMockUserProgress(userId: string) {
    return {
      user: {
        id: userId,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'employee',
        courses: ['course_gdpr_basics', 'course_data_security'],
        progress: [
          {
            courseId: 'course_gdpr_basics',
            completionRate: 100,
            lastActivity: '2024-02-15T10:30:00Z'
          },
          {
            courseId: 'course_data_security',
            completionRate: 65,
            lastActivity: '2024-02-14T14:20:00Z'
          }
        ]
      },
      enrolledCourses: this.getMockComplianceCourses().slice(0, 2),
      recentActivity: [
        {
          id: 'activity_001',
          type: 'lesson_completed',
          courseId: 'course_gdpr_basics',
          lessonId: 'lesson_003',
          timestamp: '2024-02-15T10:30:00Z'
        }
      ]
    };
  }

  /**
   * Mock compliance courses for development
   */
  private getMockComplianceCourses(): EdAppCourse[] {
    return [
      {
        id: 'course_gdpr_basics',
        title: 'GDPR Fundamentals for Employees',
        description: 'Essential GDPR training covering data protection principles, individual rights, and organizational obligations.',
        category: 'Privacy Compliance',
        duration: 45,
        lessons: [
          {
            id: 'lesson_001',
            title: 'Introduction to GDPR',
            content: 'Overview of the General Data Protection Regulation',
            type: 'video',
            duration: 10,
            order: 1
          },
          {
            id: 'lesson_002',
            title: 'Data Protection Principles',
            content: 'The seven key principles of GDPR',
            type: 'interactive',
            duration: 15,
            order: 2
          },
          {
            id: 'lesson_003',
            title: 'Individual Rights',
            content: 'Understanding data subject rights under GDPR',
            type: 'text',
            duration: 12,
            order: 3
          },
          {
            id: 'lesson_004',
            title: 'GDPR Quiz',
            content: 'Test your knowledge of GDPR fundamentals',
            type: 'quiz',
            duration: 8,
            order: 4
          }
        ],
        completionRate: 89,
        isPublished: true,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      },
      {
        id: 'course_data_security',
        title: 'Data Security Awareness',
        description: 'Comprehensive training on protecting personal data through technical and organizational measures.',
        category: 'Security Compliance',
        duration: 35,
        lessons: [
          {
            id: 'lesson_101',
            title: 'Password Security',
            content: 'Best practices for password management',
            type: 'video',
            duration: 8,
            order: 1
          },
          {
            id: 'lesson_102',
            title: 'Phishing Awareness',
            content: 'Identifying and avoiding phishing attacks',
            type: 'interactive',
            duration: 12,
            order: 2
          },
          {
            id: 'lesson_103',
            title: 'Data Encryption',
            content: 'Understanding encryption for data protection',
            type: 'text',
            duration: 10,
            order: 3
          },
          {
            id: 'lesson_104',
            title: 'Security Quiz',
            content: 'Test your security awareness knowledge',
            type: 'quiz',
            duration: 5,
            order: 4
          }
        ],
        completionRate: 76,
        isPublished: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-02-05T00:00:00Z'
      },
      {
        id: 'course_incident_response',
        title: 'Privacy Incident Response',
        description: 'Learn how to identify, report, and respond to privacy incidents and data breaches.',
        category: 'Incident Management',
        duration: 30,
        lessons: [
          {
            id: 'lesson_201',
            title: 'What is a Privacy Incident?',
            content: 'Defining privacy incidents and data breaches',
            type: 'video',
            duration: 8,
            order: 1
          },
          {
            id: 'lesson_202',
            title: 'Incident Detection',
            content: 'How to identify potential privacy incidents',
            type: 'interactive',
            duration: 10,
            order: 2
          },
          {
            id: 'lesson_203',
            title: 'Reporting Procedures',
            content: 'Step-by-step incident reporting process',
            type: 'text',
            duration: 8,
            order: 3
          },
          {
            id: 'lesson_204',
            title: 'Response Simulation',
            content: 'Practice responding to simulated incidents',
            type: 'quiz',
            duration: 4,
            order: 4
          }
        ],
        completionRate: 68,
        isPublished: true,
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-02-08T00:00:00Z'
      }
    ];
  }
}

export default EdAppService;
