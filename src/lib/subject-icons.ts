import {
  Calculator,
  Languages,
  Atom,
  FlaskConical,
  Leaf,
  Landmark,
  Globe,
  BookOpen,
  Scale,
  Brain,
  PenTool,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const subjectIcons: Record<string, LucideIcon> = {
  "Matemática": Calculator,
  "Português": Languages,
  "Linguagens": PenTool,
  "Física": Atom,
  "Química": FlaskConical,
  "Biologia": Leaf,
  "História": Landmark,
  "Geografia": Globe,
  "Sociologia": Scale,
  "Filosofia": Brain,
};

export const getSubjectIcon = (name: string): LucideIcon => {
  return subjectIcons[name] || BookOpen;
};
