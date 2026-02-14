import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "aluno" | "assessor" | "diretor" | "manager";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<string | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DB_ROLE_MAP: Record<string, UserRole> = {
  manager: "manager",
  diretor: "diretor",
  assessor: "assessor",
  student: "aluno",
};

const ROLE_TO_DB: Record<UserRole, string> = {
  manager: "manager",
  diretor: "diretor",
  assessor: "assessor",
  aluno: "student",
};

async function fetchAppUser(supaUser: User): Promise<AppUser | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("user_id", supaUser.id)
    .single();

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supaUser.id)
    .single();

  const dbRole = roleData?.role as string | undefined;
  const role: UserRole = DB_ROLE_MAP[dbRole || "student"] || "aluno";

  return {
    id: supaUser.id,
    name: profile?.name || supaUser.email?.split("@")[0] || "Usuário",
    email: supaUser.email || "",
    role,
    avatarUrl: profile?.avatar_url || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setTimeout(async () => {
            const appUser = await fetchAppUser(newSession.user);
            setUser(appUser);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        const appUser = await fetchAppUser(existingSession.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<string | null> => {
    const dbRole = ROLE_TO_DB[role];
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: dbRole },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return error.message;
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

// Helper: check if user is staff (non-student)
export function isStaff(role?: UserRole): boolean {
  return role === "manager" || role === "diretor" || role === "assessor";
}

// Helper: get the role label in Portuguese
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    manager: "Manager",
    diretor: "Diretor",
    assessor: "Assessor",
    aluno: "Aluno",
  };
  return labels[role] || role;
}
