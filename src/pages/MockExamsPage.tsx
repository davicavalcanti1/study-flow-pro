import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const mockExams = [
  { name: "Simulado ENEM 1", date: "02/02/2026", scores: { Linguagens: 680, Matemática: 720, Natureza: 650, Humanas: 700, Redação: 800 }},
  { name: "Simulado ENEM 2", date: "25/01/2026", scores: { Linguagens: 700, Matemática: 690, Natureza: 680, Humanas: 710, Redação: 760 }},
  { name: "Simulado Específica", date: "18/01/2026", scores: { Total: 45 }},
];

export default function MockExamsPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Simulados</h1>
      <div className="space-y-4">
        {mockExams.map((exam, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-accent" />
                {exam.name}
                <span className="text-xs text-muted-foreground font-normal ml-auto">{exam.date}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {Object.entries(exam.scores).map(([area, score]) => (
                  <div key={area} className="p-3 rounded-lg bg-muted/50 min-w-[100px]">
                    <p className="text-xs text-muted-foreground">{area}</p>
                    <p className="text-lg font-bold text-accent">{score}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
