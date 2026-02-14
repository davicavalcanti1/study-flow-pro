import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { Plus, BarChart3, Calendar, CheckCircle2 } from "lucide-react";
import { Subject } from "@/types";

export default function SimulationsPage() {
    const { simulations, addSimulation, currentUser } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState<string>('');
    const [day, setDay] = useState<'day1' | 'day2' | 'complete' | ''>('');
    const [score, setScore] = useState(''); // TRI Score
    const [maxScore, setMaxScore] = useState('1000');

    // Area Hits
    const [hits, setHits] = useState<{ [key in Subject]?: number }>({});

    const handleSave = () => {
        if (!currentUser) return;

        // Construct breakdown
        const breakdown: any = {};
        Object.entries(hits).forEach(([subj, count]) => {
            if (count !== undefined && count !== null) {
                breakdown[subj] = { correct: Number(count), total: 45 }; // Assuming 45 per area for ENEM default
            }
        });

        addSimulation({
            studentId: currentUser.id,
            title,
            date: new Date().toISOString(),
            type: type as any,
            score: Number(score),
            maxScore: Number(maxScore),
            breakdown
        });

        // Reset
        setTitle('');
        setType('');
        setDay('');
        setScore('');
        setMaxScore('1000');
        setHits({});
        setIsDialogOpen(false);
    };

    const renderAreaInput = (area: Subject, label: string) => (
        <div>
            <Label>{label} (Acertos)</Label>
            <Input
                type="number"
                placeholder="0 - 45"
                value={hits[area] || ''}
                onChange={(e) => setHits({ ...hits, [area]: Number(e.target.value) })}
            />
        </div>
    );

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Simulados</h1>
                    <p className="text-sm text-muted-foreground">Registre e analise seus resultados em provas.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent hover:bg-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Simulado
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Registrar Simulado</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                            <div>
                                <Label>Título / Nome da Prova</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Simulado ENEM 1º Dia"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Tipo</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ENEM">ENEM</SelectItem>
                                            <SelectItem value="FUVEST">FUVEST</SelectItem>
                                            <SelectItem value="UNICAMP">UNICAMP</SelectItem>
                                            <SelectItem value="Outros">Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {type === 'ENEM' && (
                                    <div>
                                        <Label>Dia / Etapa</Label>
                                        <Select value={day} onValueChange={(v: any) => setDay(v)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="day1">1º Dia (Hum/Ling/Red)</SelectItem>
                                                <SelectItem value="day2">2º Dia (Nat/Mat)</SelectItem>
                                                <SelectItem value="complete">Completo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            {/* Conditional Inputs based on Date/Type */}
                            <div className="space-y-3 border-t pt-3">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Acertos por Área</h3>

                                {(day === 'day1' || day === 'complete') && (
                                    <>
                                        {renderAreaInput('Linguagens e Códigos', 'Linguagens')}
                                        {renderAreaInput('Ciências Humanas', 'Humanas')}
                                        {renderAreaInput('Redação', 'Nota Redação (0-1000)')}
                                    </>
                                )}

                                {(day === 'day2' || day === 'complete') && (
                                    <>
                                        {renderAreaInput('Ciências da Natureza', 'Naturezas')}
                                        {renderAreaInput('Matemática', 'Matemática')}
                                    </>
                                )}

                                {!day && type !== 'ENEM' && (
                                    <p className="text-xs text-muted-foreground italic">Selecione o tipo e dia para inserir acertos detalhados.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-3">
                                <div>
                                    <Label>Nota Geral (TRI/Final)</Label>
                                    <Input
                                        type="number"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                        placeholder="Ex: 720.5"
                                    />
                                </div>
                                <div>
                                    <Label>Nota Máxima Possível</Label>
                                    <Input
                                        type="number"
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSave}>Salvar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simulations.map((sim) => (
                    <Card key={sim.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex justify-between items-start">
                                <span className="truncate">{sim.title}</span>
                                <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full text-muted-foreground whitespace-nowrap">
                                    {sim.type}
                                </span>
                            </CardTitle>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(sim.date).toLocaleDateString('pt-BR')}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-3xl font-bold text-foreground">{sim.score}</span>
                                <span className="text-sm text-muted-foreground mb-1">/ {sim.maxScore}</span>
                            </div>

                            {/* Visual breakdown if available */}
                            {sim.breakdown && Object.keys(sim.breakdown).length > 0 && (
                                <div className="space-y-2 mt-4 pt-4 border-t">
                                    <p className="text-xs font-medium text-muted-foreground">Desempenho por Área (Acertos)</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(sim.breakdown).map(([subject, stats]: any) => (
                                            <div key={subject} className="bg-muted/30 p-2 rounded text-xs flex justify-between">
                                                <span className="truncate pr-2">{subject}</span>
                                                <span className="font-bold">{stats.correct}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!sim.breakdown || Object.keys(sim.breakdown).length === 0 && (
                                <div className="bg-accent h-2 mt-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full"
                                        style={{ width: `${(sim.score / sim.maxScore) * 100}%` }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {simulations.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhum simulado registrado.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
