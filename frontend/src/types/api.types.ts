import { User } from "./user.types";

export type ApiResponseType = "success" | "error";

export interface ApiResponse {
  message: string;
  type: ApiResponseType;
}

export interface AuthApiResponse {
  message: string;
  type: ApiResponseType;
  user: User;
}