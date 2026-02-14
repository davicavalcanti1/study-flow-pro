import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Timer, Calendar, BookOpen, BarChart3, Target,
  PenTool, MessageCircle, ClipboardList, Menu, X, LogOut, Users,
  Crown, Briefcase,
} from "lucide-react";
import { useState } from "react";
import { useAuth, getRoleLabel, isStaff } from "@/contexts/AuthContext";

const studentNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/estudar", label: "Estudar", icon: Timer },
  { to: "/cronograma", label: "Cronograma", icon: Calendar },
  { to: "/disciplinas", label: "Disciplinas", icon: BookOpen },
  { to: "/desempenho", label: "Desempenho", icon: BarChart3 },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/simulados", label: "Simulados", icon: ClipboardList },
  { to: "/redacao", label: "Redação", icon: PenTool },
  { to: "/forum", label: "Fórum", icon: MessageCircle },
];

const assessorNav = [
  { to: "/assessor", label: "Dashboard", icon: Home },
  { to: "/disciplinas", label: "Conteúdos", icon: BookOpen },
  { to: "/forum", label: "Fórum", icon: MessageCircle },
];

const diretorNav = [
  { to: "/diretor", label: "Dashboard", icon: Home },
  { to: "/forum", label: "Fórum", icon: MessageCircle },
];

const managerNav = [
  { to: "/manager", label: "Instituições", icon: Briefcase },
  { to: "/forum", label: "Fórum", icon: MessageCircle },
];

function getNavItems(role?: string) {
  switch (role) {
    case "manager": return managerNav;
    case "diretor": return diretorNav;
    case "assessor": return assessorNav;
    default: return studentNav;
  }
}

function getRoleBadgeColor(role?: string) {
  switch (role) {
    case "manager": return "bg-warning/20 text-warning";
    case "diretor": return "bg-info/20 text-info";
    case "assessor": return "bg-accent/20 text-accent";
    default: return "";
  }
}

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = getNavItems(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-nav border-b border-nav/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-auto flex items-center justify-center">
              <img src="/logo.png" alt="Assessoria Motiva" className="h-full w-auto object-contain" />
            </div>
            {user && isStaff(user.role) && (
              <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium ml-1 ${getRoleBadgeColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/" || item.to === "/assessor"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "bg-accent/20 text-accent"
                    : "text-nav-foreground/70 hover:text-nav-foreground hover:bg-nav-foreground/5"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User area */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent text-sm font-semibold">{user?.name?.[0] || "?"}</span>
              </div>
              <span className="text-nav-foreground/80 text-sm">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="text-nav-foreground/60 hover:text-nav-foreground transition-colors" title="Sair">
              <LogOut className="w-5 h-5" />
            </button>
            <button className="lg:hidden text-nav-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-nav border-t border-nav-foreground/10">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/" || item.to === "/assessor"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "bg-accent/20 text-accent"
                    : "text-nav-foreground/70 hover:text-nav-foreground"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
