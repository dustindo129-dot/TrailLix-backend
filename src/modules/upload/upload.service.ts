import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadDir = process.env.UPLOAD_DIR || './uploads';
  private readonly maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

  async uploadImage(file: any) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    return this.saveFile(file, 'images');
  }

  async uploadVideo(file: any) {
    const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only MP4, WebM, and OGG are allowed.');
    }

    if (file.size > this.maxFileSize * 10) { // 100MB for videos
      throw new BadRequestException(`File too large. Maximum size is ${(this.maxFileSize * 10) / (1024 * 1024)}MB`);
    }

    return this.saveFile(file, 'videos');
  }

  async uploadDocument(file: any) {
    const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF and Word documents are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    return this.saveFile(file, 'documents');
  }

  private async saveFile(file: any, subfolder: string) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const folderPath = join(this.uploadDir, subfolder);
    const filePath = join(folderPath, fileName);

    // Ensure upload directory exists
    await fs.mkdir(folderPath, { recursive: true });

    // Save file
    await fs.writeFile(filePath, file.buffer);

    return {
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `/${subfolder}/${fileName}`,
      url: `/uploads/${subfolder}/${fileName}`,
    };
  }
}
