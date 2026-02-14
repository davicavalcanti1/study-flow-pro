import { AppLayout } from "@/components/layout/AppLayout";
import { Clock, BookOpen, Target, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSubjectIcon } from "@/lib/subject-icons";

const recentStudies = [
  { subject: "Matemática", topic: "Funções", time: "01:30:00", method: "Videoaula", date: "09/02/2026" },
  { subject: "Português", topic: "Interpretação de Texto", time: "00:45:00", method: "Livro", date: "09/02/2026" },
  { subject: "Física", topic: "Cinemática", time: "02:00:00", method: "Aula", date: "08/02/2026" },
];

const subjectColors: Record<string, string> = {
  "Matemática": "bg-chart-1",
  "Português": "bg-chart-2",
  "Física": "bg-chart-3",
  "Química": "bg-chart-4",
  "Biologia": "bg-chart-5",
};

const Index = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <AppLayout>
      {/* Header greeting */}
      <div className="mb-8">
        <p className="text-muted-foreground text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-foreground">Aluno!</h1>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Horas hoje</p>
                <p className="text-xl font-bold text-foreground">04:15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Questões hoje</p>
                <p className="text-xl font-bold text-foreground">48 <span className="text-sm font-normal text-muted-foreground">/ 80</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aproveitamento</p>
                <p className="text-xl font-bold text-foreground">72%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Horas semana</p>
                <p className="text-xl font-bold text-foreground">22:40</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metas do dia */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Metas do dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Horas de estudo</span>
                <span className="font-medium">4h15 / 6h</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Questões</span>
                <span className="font-medium">48 / 80</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Disciplinas</span>
                <span className="font-medium">3 / 5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Cronograma de hoje */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Cronograma de hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { subject: "Matemática", topic: "Funções Exponenciais", done: true },
              { subject: "Português", topic: "Sintaxe", done: true },
              { subject: "Física", topic: "Termodinâmica", done: false },
              { subject: "Química", topic: "Estequiometria", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {(() => { const Icon = getSubjectIcon(item.subject); return <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />; })()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.topic}</p>
                </div>
                {item.done && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Últimos Estudos */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              Últimos estudos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentStudies.map((study, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {(() => { const Icon = getSubjectIcon(study.subject); return <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />; })()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{study.subject}</p>
                  <p className="text-xs text-muted-foreground">{study.topic}</p>
                  <p className="text-xs text-muted-foreground">{study.method} • {study.date}</p>
                </div>
                <span className="text-sm font-mono text-foreground">{study.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Simulados recentes */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            Simulados recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Simulado ENEM 1", date: "02/02/2026", score: "680", max: "1000" },
              { name: "Simulado ENEM 2", date: "25/01/2026", score: "720", max: "1000" },
              { name: "Simulado Específica", date: "18/01/2026", score: "45", max: "60" },
            ].map((sim, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm font-medium text-foreground">{sim.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{sim.date}</p>
                <p className="text-lg font-bold text-accent">{sim.score}<span className="text-sm font-normal text-muted-foreground"> / {sim.max}</span></p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Index;
