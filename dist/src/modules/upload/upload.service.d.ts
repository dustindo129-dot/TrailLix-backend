export declare class UploadService {
    private readonly uploadDir;
    private readonly maxFileSize;
    uploadImage(file: any): Promise<{
        fileName: string;
        originalName: any;
        mimeType: any;
        size: any;
        path: string;
        url: string;
    }>;
    uploadVideo(file: any): Promise<{
        fileName: string;
        originalName: any;
        mimeType: any;
        size: any;
        path: string;
        url: string;
    }>;
    uploadDocument(file: any): Promise<{
        fileName: string;
        originalName: any;
        mimeType: any;
        size: any;
        path: string;
        url: string;
    }>;
    private saveFile;
}
