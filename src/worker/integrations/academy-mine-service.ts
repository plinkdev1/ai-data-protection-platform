// Academy of Mine Learning Management System Integration
// Provides comprehensive learning management for provider training and certifications
// Used for creating and delivering compliance training programs

export interface AcademyOfMineConfig {
  apiKey: string;
  apiUrl?: string;
  subdomain?: string;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  prerequisites?: string[];
  learning_objectives: string[];
  content_modules: CourseModule[];
  assessment_criteria: AssessmentCriteria;
  certification_available: boolean;
  instructor_id?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
}

export interface CourseModule {
  id?: string;
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'interactive' | 'quiz' | 'assignment';
  content_url?: string;
  content_html?: string;
  duration_minutes: number;
  order_position: number;
  required: boolean;
}

export interface AssessmentCriteria {
  passing_score: number;
  max_attempts: number;
  time_limit_minutes?: number;
  question_pool_size?: number;
  randomize_questions: boolean;
  immediate_feedback: boolean;
}

export interface LearningPath {
  id?: string;
  title: string;
  description: string;
  courses: string[]; // Course IDs in order
  estimated_completion_weeks: number;
  certificate_id?: string;
  target_audience: string[];
  prerequisites?: string[];
}

export interface Enrollment {
  id?: string;
  user_id: string;
  course_id: string;
  enrollment_date: string;
  completion_date?: string;
  progress_percentage: number;
  current_module_id?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  grade?: number;
  certificate_issued?: boolean;
  certificate_id?: string;
}

export interface Certificate {
  id?: string;
  user_id: string;
  course_id: string;
  learning_path_id?: string;
  template_id: string;
  issue_date: string;
  expiry_date?: string;
  verification_code: string;
  skills_validated: string[];
  credential_url: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface LearningAnalytics {
  user_id: string;
  total_courses_enrolled: number;
  courses_completed: number;
  total_learning_hours: number;
  certificates_earned: number;
  average_completion_rate: number;
  skill_areas: { [skill: string]: number }; // skill -> proficiency level
  recent_activity: LearningActivity[];
  recommendations: CourseRecommendation[];
}

export interface LearningActivity {
  date: string;
  activity_type: 'enrollment' | 'module_completion' | 'assessment' | 'certificate';
  course_title: string;
  description: string;
  score?: number;
}

export interface CourseRecommendation {
  course_id: string;
  course_title: string;
  relevance_score: number;
  reason: string;
  estimated_hours: number;
}

export interface ComplianceTrainingProgram {
  id?: string;
  name: string;
  description: string;
  target_roles: string[];
  mandatory: boolean;
  compliance_frameworks: string[]; // GDPR, ISO27001, etc.
  courses: string[];
  completion_deadline?: string;
  recertification_period_months?: number;
  tracking_enabled: boolean;
}

export interface TrainingComplianceReport {
  program_id: string;
  program_name: string;
  total_assigned_users: number;
  completed_users: number;
  in_progress_users: number;
  overdue_users: number;
  completion_rate: number;
  average_completion_time_days: number;
  user_details: Array<{
    user_id: string;
    name: string;
    role: string;
    status: 'completed' | 'in_progress' | 'not_started' | 'overdue';
    completion_date?: string;
    score?: number;
  }>;
}

export class AcademyOfMineService {
  private config: AcademyOfMineConfig;
  private baseUrl: string;

  constructor(config: AcademyOfMineConfig) {
    this.config = config;
    this.baseUrl = config.apiUrl || `https://${config.subdomain}.academyofmine.com/api/v1`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Academy of Mine API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Academy of Mine API request failed:', error);
      throw error;
    }
  }

  // Course Management
  async createCourse(courseData: Course): Promise<Course> {
    try {
      const response = await this.makeRequest('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw new Error(`Failed to create course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCourse(courseId: string): Promise<Course> {
    try {
      const response = await this.makeRequest(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get course:', error);
      throw new Error(`Failed to get course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
    try {
      const response = await this.makeRequest(`/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to update course:', error);
      throw new Error(`Failed to update course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/courses/${courseId}`, {
        method: 'DELETE',
      });

      return true;
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw new Error(`Failed to delete course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listCourses(filters?: {
    category?: string;
    difficulty?: string;
    published_only?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<{ courses: Course[]; total: number; page: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await this.makeRequest(`/courses?${queryParams}`);
      return {
        courses: response.data,
        total: response.meta.total,
        page: response.meta.page,
      };
    } catch (error) {
      console.error('Failed to list courses:', error);
      throw new Error(`Failed to list courses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Learning Path Management
  async createLearningPath(pathData: LearningPath): Promise<LearningPath> {
    try {
      const response = await this.makeRequest('/learning-paths', {
        method: 'POST',
        body: JSON.stringify(pathData),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create learning path:', error);
      throw new Error(`Failed to create learning path: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLearningPath(pathId: string): Promise<LearningPath> {
    try {
      const response = await this.makeRequest(`/learning-paths/${pathId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get learning path:', error);
      throw new Error(`Failed to get learning path: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Enrollment Management
  async enrollUser(userId: string, courseId: string): Promise<Enrollment> {
    try {
      const enrollmentData = {
        user_id: userId,
        course_id: courseId,
        enrollment_date: new Date().toISOString(),
        status: 'enrolled',
        progress_percentage: 0,
      };

      const response = await this.makeRequest('/enrollments', {
        method: 'POST',
        body: JSON.stringify(enrollmentData),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to enroll user:', error);
      throw new Error(`Failed to enroll user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getEnrollment(enrollmentId: string): Promise<Enrollment> {
    try {
      const response = await this.makeRequest(`/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get enrollment:', error);
      throw new Error(`Failed to get enrollment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateEnrollmentProgress(
    enrollmentId: string, 
    progressData: {
      progress_percentage?: number;
      current_module_id?: string;
      status?: Enrollment['status'];
      completion_date?: string;
      grade?: number;
    }
  ): Promise<Enrollment> {
    try {
      const response = await this.makeRequest(`/enrollments/${enrollmentId}`, {
        method: 'PUT',
        body: JSON.stringify(progressData),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to update enrollment progress:', error);
      throw new Error(`Failed to update enrollment progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserEnrollments(userId: string, status?: Enrollment['status']): Promise<Enrollment[]> {
    try {
      const queryParams = new URLSearchParams({ user_id: userId });
      if (status) queryParams.append('status', status);

      const response = await this.makeRequest(`/enrollments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user enrollments:', error);
      throw new Error(`Failed to get user enrollments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Certificate Management
  async issueCertificate(certificateData: Omit<Certificate, 'id' | 'verification_code' | 'credential_url'>): Promise<Certificate> {
    try {
      const certificateWithDefaults = {
        ...certificateData,
        verification_code: this.generateVerificationCode(),
        credential_url: '',
        status: 'active' as const,
      };

      const response = await this.makeRequest('/certificates', {
        method: 'POST',
        body: JSON.stringify(certificateWithDefaults),
      });

      const certificate = response.data;
      certificate.credential_url = `${this.baseUrl}/certificates/verify/${certificate.verification_code}`;

      return certificate;
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      throw new Error(`Failed to issue certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCertificate(certificateId: string): Promise<Certificate> {
    try {
      const response = await this.makeRequest(`/certificates/${certificateId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get certificate:', error);
      throw new Error(`Failed to get certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyCertificate(verificationCode: string): Promise<Certificate | null> {
    try {
      const response = await this.makeRequest(`/certificates/verify/${verificationCode}`);
      return response.data;
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      return null;
    }
  }

  async revokeCertificate(certificateId: string, reason: string): Promise<boolean> {
    try {
      await this.makeRequest(`/certificates/${certificateId}/revoke`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });

      return true;
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      throw new Error(`Failed to revoke certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Learning Analytics
  async getUserAnalytics(userId: string): Promise<LearningAnalytics> {
    try {
      const response = await this.makeRequest(`/analytics/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      throw new Error(`Failed to get user analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCourseAnalytics(courseId: string): Promise<{
    course_id: string;
    total_enrollments: number;
    active_enrollments: number;
    completion_rate: number;
    average_completion_time_days: number;
    average_score: number;
    engagement_metrics: {
      video_completion_rate: number;
      quiz_attempt_rate: number;
      discussion_participation: number;
    };
  }> {
    try {
      const response = await this.makeRequest(`/analytics/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get course analytics:', error);
      throw new Error(`Failed to get course analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Compliance Training Programs
  async createComplianceProgram(programData: ComplianceTrainingProgram): Promise<ComplianceTrainingProgram> {
    try {
      const response = await this.makeRequest('/compliance-programs', {
        method: 'POST',
        body: JSON.stringify(programData),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create compliance program:', error);
      throw new Error(`Failed to create compliance program: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async assignUsersToProgram(programId: string, userIds: string[]): Promise<boolean> {
    try {
      await this.makeRequest(`/compliance-programs/${programId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ user_ids: userIds }),
      });

      return true;
    } catch (error) {
      console.error('Failed to assign users to program:', error);
      throw new Error(`Failed to assign users to program: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getComplianceReport(programId: string): Promise<TrainingComplianceReport> {
    try {
      const response = await this.makeRequest(`/compliance-programs/${programId}/report`);
      return response.data;
    } catch (error) {
      console.error('Failed to get compliance report:', error);
      throw new Error(`Failed to get compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // High-level helper methods for PrivacyGuard integration
  async createGDPRTrainingProgram(): Promise<ComplianceTrainingProgram> {
    // Create comprehensive GDPR training program
    const gdprCourses = await this.createGDPRCourses();
    
    const program: ComplianceTrainingProgram = {
      name: 'GDPR Compliance Training Program',
      description: 'Comprehensive training program covering all aspects of GDPR compliance for privacy professionals',
      target_roles: ['DPO', 'Privacy Officer', 'Compliance Manager', 'Legal Counsel'],
      mandatory: true,
      compliance_frameworks: ['GDPR', 'ePrivacy'],
      courses: gdprCourses.map(c => c.id!),
      recertification_period_months: 12,
      tracking_enabled: true,
    };

    return await this.createComplianceProgram(program);
  }

  private async createGDPRCourses(): Promise<Course[]> {
    const courses: Course[] = [
      {
        title: 'GDPR Fundamentals',
        description: 'Introduction to GDPR principles, scope, and key concepts',
        category: 'Privacy Compliance',
        difficulty_level: 'beginner',
        duration_hours: 2,
        learning_objectives: [
          'Understand GDPR scope and territorial reach',
          'Identify key GDPR principles',
          'Recognize data subject rights',
          'Understand lawful bases for processing'
        ],
        content_modules: [
          {
            title: 'Introduction to GDPR',
            description: 'Overview of the regulation and its impact',
            content_type: 'video',
            duration_minutes: 30,
            order_position: 1,
            required: true,
          },
          {
            title: 'Data Protection Principles',
            description: 'The seven key principles of GDPR',
            content_type: 'interactive',
            duration_minutes: 45,
            order_position: 2,
            required: true,
          },
          {
            title: 'Knowledge Check',
            description: 'Quiz on GDPR fundamentals',
            content_type: 'quiz',
            duration_minutes: 15,
            order_position: 3,
            required: true,
          }
        ],
        assessment_criteria: {
          passing_score: 80,
          max_attempts: 3,
          time_limit_minutes: 30,
          randomize_questions: true,
          immediate_feedback: true,
        },
        certification_available: true,
        tags: ['GDPR', 'Privacy', 'Fundamentals'],
        status: 'published',
      },
      {
        title: 'Data Subject Rights Management',
        description: 'Comprehensive guide to handling data subject requests under GDPR',
        category: 'Privacy Compliance',
        difficulty_level: 'intermediate',
        duration_hours: 3,
        prerequisites: ['GDPR Fundamentals'],
        learning_objectives: [
          'Master all eight data subject rights',
          'Implement DSAR procedures',
          'Handle complex rights scenarios',
          'Understand exemptions and limitations'
        ],
        content_modules: [
          {
            title: 'Overview of Data Subject Rights',
            description: 'The eight rights under GDPR',
            content_type: 'video',
            duration_minutes: 40,
            order_position: 1,
            required: true,
          },
          {
            title: 'DSAR Processing Procedures',
            description: 'Step-by-step guide to handling requests',
            content_type: 'interactive',
            duration_minutes: 60,
            order_position: 2,
            required: true,
          },
          {
            title: 'Complex Scenarios Workshop',
            description: 'Case studies and practical exercises',
            content_type: 'assignment',
            duration_minutes: 90,
            order_position: 3,
            required: true,
          }
        ],
        assessment_criteria: {
          passing_score: 85,
          max_attempts: 3,
          time_limit_minutes: 45,
          randomize_questions: true,
          immediate_feedback: true,
        },
        certification_available: true,
        tags: ['GDPR', 'Data Subject Rights', 'DSAR'],
        status: 'published',
      }
    ];

    const createdCourses: Course[] = [];
    for (const course of courses) {
      try {
        const created = await this.createCourse(course);
        createdCourses.push(created);
      } catch (error) {
        console.error(`Failed to create course: ${course.title}`, error);
      }
    }

    return createdCourses;
  }

  async createProviderCertificationProgram(): Promise<LearningPath> {
    // Create certification program for PrivacyGuard providers
    const providerCourses = await this.createProviderCourses();

    const learningPath: LearningPath = {
      title: 'PrivacyGuard Certified DPO Program',
      description: 'Professional certification program for data protection officers and privacy professionals',
      courses: providerCourses.map(c => c.id!),
      estimated_completion_weeks: 8,
      target_audience: ['Privacy Professionals', 'Legal Practitioners', 'Compliance Officers'],
      prerequisites: ['Minimum 2 years privacy experience or relevant law degree'],
    };

    return await this.createLearningPath(learningPath);
  }

  private async createProviderCourses(): Promise<Course[]> {
    const courses: Course[] = [
      {
        title: 'Advanced GDPR Implementation',
        description: 'Deep dive into GDPR implementation for complex organizations',
        category: 'Advanced Privacy',
        difficulty_level: 'advanced',
        duration_hours: 6,
        learning_objectives: [
          'Design comprehensive privacy programs',
          'Handle complex cross-border scenarios',
          'Implement privacy by design',
          'Manage vendor and third-party risks'
        ],
        content_modules: [
          {
            title: 'Privacy Program Architecture',
            description: 'Building enterprise-grade privacy programs',
            content_type: 'video',
            duration_minutes: 90,
            order_position: 1,
            required: true,
          },
          {
            title: 'Cross-border Data Transfers',
            description: 'Mastering international transfer mechanisms',
            content_type: 'interactive',
            duration_minutes: 120,
            order_position: 2,
            required: true,
          },
          {
            title: 'Privacy by Design Implementation',
            description: 'Practical approaches to privacy engineering',
            content_type: 'assignment',
            duration_minutes: 150,
            order_position: 3,
            required: true,
          }
        ],
        assessment_criteria: {
          passing_score: 90,
          max_attempts: 2,
          time_limit_minutes: 90,
          randomize_questions: false,
          immediate_feedback: false,
        },
        certification_available: true,
        tags: ['Advanced GDPR', 'Privacy Engineering', 'Enterprise'],
        status: 'published',
      }
    ];

    const createdCourses: Course[] = [];
    for (const course of courses) {
      try {
        const created = await this.createCourse(course);
        createdCourses.push(created);
      } catch (error) {
        console.error(`Failed to create course: ${course.title}`, error);
      }
    }

    return createdCourses;
  }

  // Utility methods
  private generateVerificationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      await this.makeRequest('/health');
      return { status: 'healthy', message: 'Academy of Mine API connection successful' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: `Academy of Mine API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}
