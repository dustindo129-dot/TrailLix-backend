export declare class CreateLessonDto {
    course_id: string;
    title: string;
    order_index: number;
    duration_s?: number;
    video_asset_id?: string;
    video_url?: string;
    content?: string;
    is_free_preview?: boolean;
}
