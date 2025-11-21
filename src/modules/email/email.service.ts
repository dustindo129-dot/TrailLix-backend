import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const emailConfig = this.configService.get('email');
    
    // Support both config module and direct env variables for backward compatibility
    const host = emailConfig?.host || process.env.SMTP_HOST;
    const user = emailConfig?.user || process.env.SMTP_USER;
    const password = emailConfig?.pass || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    const port = emailConfig?.port || parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = emailConfig?.secure !== undefined 
      ? emailConfig.secure 
      : process.env.SMTP_SECURE === 'true' || port === 465;

    // Only create transporter if SMTP is configured
    if (host && user && password) {
      // Use Gmail service if host is Gmail (simplifies configuration)
      const isGmail = host.includes('gmail.com');
      
      this.transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: 'gmail',
              auth: {
                user,
                pass: password,
              },
            }
          : {
              host,
              port,
              secure, // true for 465, false for other ports
              auth: {
                user,
                pass: password,
              },
            }
      );
      
      this.logger.log(`SMTP transporter configured for ${isGmail ? 'Gmail' : host}:${isGmail ? '587' : port}`);
    } else {
      this.logger.warn('SMTP not configured. Email sending will be disabled.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.log(`[MOCK] Email would be sent to: ${options.to} with subject: ${options.subject}`);
      return true;
    }

    try {
      const emailConfig = this.configService.get('email');
      const fromEmail = emailConfig?.from || process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@traillix.com';
      
      const mailOptions = {
        from: fromEmail,
        ...options,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Chào mừng bạn đến với TrailLix! 🎉',
      html: `
        <h1>Chào mừng ${name}!</h1>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại TrailLix.</p>
        <p>Bạn có thể bắt đầu khám phá các khóa học AI tại <a href="https://traillix.com">đây</a>.</p>
        <p>Chúc bạn học tập hiệu quả!</p>
        <p><strong>TrailLix Team</strong></p>
      `,
    });
  }

  async sendEnrollmentConfirmation(email: string, name: string, courseName: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Xác nhận đăng ký khóa học: ${courseName}`,
      html: `
        <h1>Chúc mừng ${name}!</h1>
        <p>Bạn đã đăng ký thành công khóa học: <strong>${courseName}</strong></p>
        <p>Bạn có thể truy cập khóa học ngay bây giờ tại TrailLix.</p>
        <p>Chúc bạn học tập hiệu quả!</p>
        <p><strong>TrailLix Team</strong></p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Đặt lại mật khẩu TrailLix',
      html: `
        <h1>Đặt lại mật khẩu</h1>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản TrailLix của mình.</p>
        <p>Nhấp vào liên kết sau để đặt lại mật khẩu:</p>
        <a href="https://traillix.com/reset-password?token=${resetToken}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p><small>Liên kết này sẽ hết hạn sau 1 giờ.</small></p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p><strong>TrailLix Team</strong></p>
      `,
    });
  }
}
