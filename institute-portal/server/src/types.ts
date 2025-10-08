export type UserRole = 'student' | 'trainer' | 'admin';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
