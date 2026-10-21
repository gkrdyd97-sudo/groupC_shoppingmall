export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    userType: string;
    phone: string;
    privateAgree: boolean;
    tradeAgree: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}
