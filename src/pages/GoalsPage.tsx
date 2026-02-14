import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function GoalsPage() {
  const { currentUser } = useData();

  if (!currentUser || currentUser.role !== 'STUDENT') return null;

  const currentGoals = currentUser.goals;

  // Mock current progress logic (replace with real aggregations later)
  const goalsData = [
    { label: "Horas de estudo diárias", current: 4.25, target: currentGoals.dailyHours, unit: "h" },
    { label: "Questões diárias", current: 48, target: currentGoals.dailyQuestions, unit: "" },
    { label: "Simulados na semana", current: 1, target: currentGoals.weeklyMockExams, unit: "" },
    { label: "Disciplinas por dia", current: 3, target: currentGoals.dailySubjects, unit: "" },
    { label: "Horas semanais", current: 22.5, target: currentGoals.weeklyHours, unit: "h" },
  ];

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Metas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goalsData.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          const done = pct >= 100;
          return (
            <Card key={g.label} className="stat-card">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Target className="w-5 h-5 text-accent" />
                    )}
                    <span className="text-sm font-medium">{g.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2 mb-2" indicatorClassName={done ? "bg-success" : "bg-accent"} />
                <p className="text-sm text-muted-foreground">
                  {g.current}{g.unit} / {g.target}{g.unit}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
