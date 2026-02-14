import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square, Save } from "lucide-react";
import { getSubjectIcon } from "@/lib/subject-icons";

const subjects = [
  { name: "Matemática", topics: ["Funções", "Geometria", "Álgebra", "Probabilidade"] },
  { name: "Português", topics: ["Interpretação", "Gramática", "Sintaxe", "Redação"] },
  { name: "Física", topics: ["Cinemática", "Termodinâmica", "Óptica", "Eletricidade"] },
  { name: "Química", topics: ["Estequiometria", "Orgânica", "Inorgânica", "Físico-Química"] },
  { name: "Biologia", topics: ["Genética", "Ecologia", "Citologia", "Fisiologia"] },
  { name: "História", topics: ["Brasil Colônia", "República", "Idade Média", "Contemporânea"] },
  { name: "Geografia", topics: ["Clima", "Urbanização", "Geopolítica", "Cartografia"] },
];

const methods = ["Videoaula", "Aula presencial", "Livro", "Exercícios", "Revisão"];
const shifts = ["Manhã", "Tarde", "Noite"];

export default function StudyPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [questionsTotal, setQuestionsTotal] = useState("");
  const [questionsCorrect, setQuestionsCorrect] = useState("");

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const availableTopics = subjects.find((s) => s.name === selectedSubject)?.topics || [];

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSave = () => {
    // TODO: save study record
    alert("Estudo registrado com sucesso!");
    handleReset();
    setSelectedSubject("");
    setSelectedTopic("");
    setSelectedMethod("");
    setQuestionsTotal("");
    setQuestionsCorrect("");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Estudar</h1>

        {/* Subject & Topic Selection */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Matéria e conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Disciplina</Label>
              <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedTopic(""); }}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Assunto</Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedSubject}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {availableTopics.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Timer */}
        <Card className="mb-6">
          <CardContent className="py-10 flex flex-col items-center">
            <div className={`text-6xl font-mono font-bold tracking-wider mb-8 ${isRunning ? "text-accent animate-pulse-slow" : "text-foreground"}`}>
              {formatTime(seconds)}
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
                className={isRunning ? "bg-warning hover:bg-warning/90" : "bg-accent hover:bg-accent/90"}
              >
                {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isRunning ? "Pausar" : "Iniciar"}
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset} disabled={seconds === 0}>
                <Square className="w-5 h-5 mr-2" />
                Zerar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Study details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Registrar estudo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Método</Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger><SelectValue placeholder="Método" /></SelectTrigger>
                  <SelectContent>
                    {methods.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Turno</Label>
                <Select value={selectedShift} onValueChange={setSelectedShift}>
                  <SelectTrigger><SelectValue placeholder="Turno" /></SelectTrigger>
                  <SelectContent>
                    {shifts.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Questões (total)</Label>
                <Input type="number" value={questionsTotal} onChange={(e) => setQuestionsTotal(e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Acertos</Label>
                <Input type="number" value={questionsCorrect} onChange={(e) => setQuestionsCorrect(e.target.value)} placeholder="0" />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90" disabled={!selectedSubject || seconds === 0}>
              <Save className="w-4 h-4 mr-2" />
              Registrar estudo
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
