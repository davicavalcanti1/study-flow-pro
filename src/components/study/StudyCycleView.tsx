import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, RotateCw, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Subject } from "@/types";

// Mock Cycle Data
const cycleSubjects: { subject: Subject; hoursGoal: number; hoursDone: number }[] = [
    { subject: 'Matemática', hoursGoal: 5, hoursDone: 3.5 },
    { subject: 'Física', hoursGoal: 4, hoursDone: 1.2 },
    { subject: 'Química', hoursGoal: 4, hoursDone: 4 }, // Done
    { subject: 'Português', hoursGoal: 3, hoursDone: 0.5 },
    { subject: 'Biologia', hoursGoal: 3, hoursDone: 0 },
];

export function StudyCycleView() {
    const navigate = useNavigate();

    const handleStartStudy = (subject: string) => {
        navigate(`/study?subject=${encodeURIComponent(subject)}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">Ciclo de Estudos</h2>
                    <p className="text-sm text-muted-foreground">Estude no seu ritmo, completando as metas de cada bloco.</p>
                </div>
                <Button variant="outline">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Reiniciar Ciclo
                </Button>
            </div>

            <div className="grid grid-cols-1 md://grid-cols-2 lg:grid-cols-3 gap-4">
                {cycleSubjects.map((item) => {
                    const progress = Math.min(100, (item.hoursDone / item.hoursGoal) * 100);
                    const isComplete = progress >= 100;

                    return (
                        <Card key={item.subject} className={`relative overflow-hidden transition-all hover:shadow-md ${isComplete ? 'bg-muted/30 opacity-75' : 'border-accent/20'}`}>
                            {isComplete && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex justify-between">
                                    {item.subject}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Progresso</span>
                                        <span className="font-medium">{item.hoursDone}h / {item.hoursGoal}h</span>
                                    </div>
                                    <Progress
                                        value={progress}
                                        className="h-2"
                                        indicatorClassName={isComplete ? "bg-success" : "bg-accent"}
                                    />

                                    <Button
                                        className="w-full mt-2"
                                        variant={isComplete ? "outline" : "default"}
                                        onClick={() => handleStartStudy(item.subject)}
                                        disabled={isComplete}
                                    >
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        {isComplete ? "Concluído" : "Estudar Agora"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
