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
