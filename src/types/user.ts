export interface UserProfile {
  id: number;
  name: string;
  department: string;
  year: string;
  interests: string[];
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
}

export interface UserOut {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
