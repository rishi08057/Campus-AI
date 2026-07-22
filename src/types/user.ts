export interface UserProfile {
  id: number;
  email: string;
  name?: string | null;
  department?: string | null;
  year?: string | null;
  interests: string[];
  is_admin?: boolean;
}

export interface UserCreate {
  email: string;
  password: string;
  name?: string;
}

export interface UserOut {
  id: number;
  email: string;
  name?: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
