export interface LessonAccessResponse {
  hasAccess: boolean;
  reason?: string;
  freeLessonsRemaining?: number;
  subscriptionStatus?: string;
  subscriptionEndDate?: Date;
}

