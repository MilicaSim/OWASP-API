import { Request as BaseRequest } from "express";
import { User } from "src/entities/user.entity";

export interface Request<UserType = User> extends BaseRequest {
    user?: UserType
    sensitiveData?: Array<string>
}