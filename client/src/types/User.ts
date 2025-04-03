interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
    password: string;
  };
}

interface User {
  id: number;
  username: string;
  role: string;
  email: string;
}
