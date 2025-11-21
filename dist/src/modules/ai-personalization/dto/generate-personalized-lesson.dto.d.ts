declare class UserProfileDto {
    name: string;
    ageRange: string;
    role: string;
    aiExperience: string;
    skills: string[];
    achievement: string;
    fields: string[];
    motivations: string[];
}
export declare class GeneratePersonalizedLessonDto {
    lessonId: number;
    userProfile: UserProfileDto;
    locale: 'en' | 'vi';
}
export {};
