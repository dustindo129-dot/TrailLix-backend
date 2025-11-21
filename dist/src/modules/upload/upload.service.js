"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
    }
    async uploadImage(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
        }
        return this.saveFile(file, 'images');
    }
    async uploadVideo(file) {
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only MP4, WebM, and OGG are allowed.');
        }
        if (file.size > this.maxFileSize * 10) {
            throw new common_1.BadRequestException(`File too large. Maximum size is ${(this.maxFileSize * 10) / (1024 * 1024)}MB`);
        }
        return this.saveFile(file, 'videos');
    }
    async uploadDocument(file) {
        const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only PDF and Word documents are allowed.');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
        }
        return this.saveFile(file, 'documents');
    }
    async saveFile(file, subfolder) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
        const folderPath = (0, path_1.join)(this.uploadDir, subfolder);
        const filePath = (0, path_1.join)(folderPath, fileName);
        await fs_1.promises.mkdir(folderPath, { recursive: true });
        await fs_1.promises.writeFile(filePath, file.buffer);
        return {
            fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: `/${subfolder}/${fileName}`,
            url: `/uploads/${subfolder}/${fileName}`,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map