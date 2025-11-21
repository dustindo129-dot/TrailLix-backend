export declare class CreateAuditLogDto {
    actor_user_id: string;
    action: string;
    entity: string;
    entity_id: string;
    diff_json?: any;
    ip_address?: string;
    user_agent?: string;
}
