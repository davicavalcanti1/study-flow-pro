import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import {
  Users, Clock, Target, BarChart3, TrendingUp,
  Calendar, AlertTriangle, Trophy, Settings2, Save, Eye, FileText,
  BookOpen
} from "lucide-react";
import { Student } from "@/types";
import { StudentPerformanceView } from "./PerformancePage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessorTopicManager } from "@/components/assessor/AssessorTopicManager";

// Mock Components for Read-Only Views (In real app, these would be the actual pages with read-only props)
const ReadOnlySimulations = ({ studentId }: { studentId: string }) => {
  const { simulations } = useData();
  const studentSims = simulations.filter(s => s.studentId === studentId);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Simulados Realizados</h3>
      {studentSims.length === 0 ? <p className="text-muted-foreground">Nenhum simulado registrado.</p> : (
        <div className="grid gap-3">
          {studentSims.map(sim => (
            <Card key={sim.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{sim.title}</p>
                  <p className="text-sm text-muted-foreground">{new Date(sim.date).toLocaleDateString()} - {sim.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{sim.score}/{sim.maxScore}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const ReadOnlyEssays = ({ studentId }: { studentId: string }) => {
  const { essays } = useData();
  const studentEssays = essays.filter(e => e.studentId === studentId);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Redações Enviadas</h3>
      {studentEssays.length === 0 ? <p className="text-muted-foreground">Nenhuma redação registrada.</p> : (
        <div className="grid gap-3">
          {studentEssays.map(essay => (
            <Card key={essay.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{essay.title}</p>
                  <p className="text-sm text-muted-foreground">{new Date(essay.date).toLocaleDateString()} - {essay.theme}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${essay.status === 'Corrigida' ? 'text-success' : 'text-warning'}`}>{essay.status}</p>
                  {essay.score && <p className="text-sm font-medium">Nota: {essay.score}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AssessorDashboard() {
  const { students, updateStudentGoals } = useData();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editGoals, setEditGoals] = useState<Student['goals'] | null>(null);

  const openGoalsEditor = (student: Student) => {
    setEditingStudent(student);
    setEditGoals({ ...student.goals });
  };

  const saveGoals = () => {
    if (!editingStudent || !editGoals) return;
    updateStudentGoals(editingStudent.id, editGoals);
    setEditingStudent(null);
  };

  // Helper to calculate student stats (mocked aggregation here)
  const getStudentStats = (student: Student) => {
    return {
      hours: 28, // Mock
      questions: 320, // Mock
      accuracy: 74, // Mock
      goalsPercent: 85 // Mock
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">Painel do Assessor</p>
        <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="stat-card">
          <CardContent className="p-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alunos Ativos</p>
              <p className="text-xl font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>
        {/* ... Other summary cards ... */}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Acompanhamento Individual</h2>
        <AssessorTopicManager />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => {
          return (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-center px-4">
                      <p className="text-xs text-muted-foreground">Metas</p>
                      <p className="font-bold text-sm truncate max-w-[150px]">
                        {student.goals.specificGoals ? "Definidas" : "Padrão"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setViewingStudent(student)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openGoalsEditor(student)}>
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Goals Editor Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Metas: {editingStudent?.name}</DialogTitle>
          </DialogHeader>
          {editGoals && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Questões Diárias</Label>
                  <Input
                    type="number"
                    value={editGoals.dailyQuestions}
                    onChange={e => setEditGoals({ ...editGoals, dailyQuestions: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Horas Semanais</Label>
                  <Input
                    type="number"
                    value={editGoals.weeklyHours}
                    onChange={e => setEditGoals({ ...editGoals, weeklyHours: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Simulados/Sem</Label>
                  <Input
                    type="number"
                    value={editGoals.weeklyMockExams}
                    onChange={e => setEditGoals({ ...editGoals, weeklyMockExams: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Metas Específicas / Observações</Label>
                <Textarea
                  placeholder="Descreva as metas detalhadas para este aluno..."
                  value={editGoals.specificGoals || ''}
                  onChange={e => setEditGoals({ ...editGoals, specificGoals: e.target.value })}
                  className="h-32"
                />
              </div>

              {/* In a real app, this would redirect to a schedule editor or open a modal */}
              <div className="pt-2 border-t">
                <Label className="mb-2 block">Ações do Assessor</Label>
                <Button variant="secondary" className="w-full justify-start" onClick={() => alert("Funcionalidade de edição de cronograma seria aberta aqui.")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Editar Cronograma do Aluno
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>Cancelar</Button>
            <Button onClick={saveGoals}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Detail Full View Modal */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visão do Aluno: {viewingStudent?.name}</DialogTitle>
          </DialogHeader>
          {viewingStudent && (
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="performance">Desempenho</TabsTrigger>
                <TabsTrigger value="simulations">Simulados</TabsTrigger>
                <TabsTrigger value="essays">Redações</TabsTrigger>
              </TabsList>
              <TabsContent value="performance" className="mt-4">
                <StudentPerformanceView studentId={viewingStudent.id} showLayout={false} />
              </TabsContent>
              <TabsContent value="simulations" className="mt-4">
                <ReadOnlySimulations studentId={viewingStudent.id} />
              </TabsContent>
              <TabsContent value="essays" className="mt-4">
                <ReadOnlyEssays studentId={viewingStudent.id} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
