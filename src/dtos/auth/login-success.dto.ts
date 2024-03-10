export interface LoginSuccessDto {
    accessToken: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    permissions: string;
}