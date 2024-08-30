export interface UserModel {
    user_id?: string;
    email: string;
    password: string;
    salt: string;
    phone: string;
    userType: 'Buyer' | 'Seller';
    first_name?: string;
    last_name?: string;
    profile_pic?: string;
    verification_code?: number;
    expiry?: string;
}