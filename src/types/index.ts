type Token = { id: string; username: string; email: string };

interface UserResponse {
  _id: string;
  username: string;
  email: string;
  password: string; // Consider using a more secure representation for password storage
  isVerified: boolean;
  isAdmin: boolean;
  __v: number; // Versioning field (optional)
  forgotPasswordToken?: string; // Optional field for handling forgot password functionality
  forgotPasswordTokenExpiry?: Date; // Optional field for handling forgot password functionality
}

export type { Token, UserResponse };
