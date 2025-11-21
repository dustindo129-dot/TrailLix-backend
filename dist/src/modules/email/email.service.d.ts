export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    private createTransporter;
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    sendEnrollmentConfirmation(email: string, name: string, courseName: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
}
