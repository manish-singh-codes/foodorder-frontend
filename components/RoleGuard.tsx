// src/components/RoleGuard.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

interface Props {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: Props) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}
