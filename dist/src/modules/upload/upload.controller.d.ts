import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
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
}
