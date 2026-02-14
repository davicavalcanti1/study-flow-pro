import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { BookOpen, CheckCircle2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getSubjectIcon } from "@/lib/subject-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { subjectsTopics } from "@/data/subjects";
import { toast } from "sonner";

export default function SubjectsPage() {
  const { user } = useAuth();
  const { currentUser } = useData();
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const isAssessor = user?.role === "assessor";

  const handleCheck = (subject: string, topic: string) => {
    if (isAssessor) return; // assessors don't check topics here
    const key = `${subject}-${topic}`;
    const newValue = !checkedTopics[key];
    setCheckedTopics(prev => ({ ...prev, [key]: newValue }));
    if (newValue) {
      toast.success(`"${topic}" marcado como concluído!`);
    }
  };

  const getProgress = (subject: string) => {
    const topics = subjectsTopics[subject] || [];
    if (topics.length === 0) return 0;
    const checkedCount = topics.filter(t => checkedTopics[`${subject}-${t}`]).length;
    return (checkedCount / topics.length) * 100;
  };

  const getCompletedCount = (subject: string) => {
    const topics = subjectsTopics[subject] || [];
    return topics.filter(t => checkedTopics[`${subject}-${t}`]).length;
  };

  // Filter subjects and topics by search
  const filteredSubjects = useMemo(() => {
    const entries = Object.entries(subjectsTopics);
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries
      .map(([subject, topics]) => {
        const filteredTopics = (topics || []).filter(
          t => t.toLowerCase().includes(q) || subject.toLowerCase().includes(q)
        );
        return [subject, filteredTopics] as [string, string[]];
      })
      .filter(([, topics]) => topics.length > 0);
  }, [searchQuery]);

  const totalTopics = Object.values(subjectsTopics).reduce((sum, t) => sum + (t?.length || 0), 0);
  const totalCompleted = Object.keys(checkedTopics).filter(k => checkedTopics[k]).length;
  const overallProgress = totalTopics > 0 ? (totalCompleted / totalTopics) * 100 : 0;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checklist de Conteúdos</h1>
          <p className="text-sm text-muted-foreground">
            {isAssessor
              ? "Visualize o currículo e gerencie os tópicos dos alunos."
              : "Acompanhe seu progresso marcando os conteúdos estudados."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Progresso Geral</p>
            <p className="text-lg font-bold text-accent">{Math.round(overallProgress)}%</p>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {totalCompleted} de {totalTopics} tópicos concluídos
            </span>
            <span className="text-sm font-bold text-accent">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tópico ou disciplina..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubjects.map(([subject, topics]) => {
          const progress = getProgress(subject);
          const completed = getCompletedCount(subject);
          const allTopics = subjectsTopics[subject as keyof typeof subjectsTopics] || [];
          const SubjectIcon = getSubjectIcon(subject);

          return (
            <Card key={subject} className="overflow-hidden">
              <CardHeader className="bg-muted/20 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <SubjectIcon className="w-5 h-5 text-accent" />
                    {subject}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {completed}/{allTopics.length}
                    </span>
                    <span className="text-xs font-bold text-accent">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="topics" className="border-b-0">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline hover:bg-muted/50 text-sm font-medium">
                      Ver Tópicos ({topics.length})
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-1 pt-2">
                        {topics.map((topic, idx) => {
                          const key = `${subject}-${topic}`;
                          const isChecked = checkedTopics[key] || false;
                          return (
                            <div
                              key={topic}
                              className={`flex items-center space-x-3 p-2.5 rounded-lg transition-colors ${
                                isChecked
                                  ? "bg-success/5"
                                  : "hover:bg-accent/5"
                              }`}
                            >
                              <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                                {idx + 1}.
                              </span>
                              <Checkbox
                                id={key}
                                checked={isChecked}
                                onCheckedChange={() => handleCheck(subject, topic)}
                                disabled={isAssessor}
                              />
                              <Label
                                htmlFor={key}
                                className={`text-sm cursor-pointer flex-1 leading-snug ${
                                  isChecked
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground"
                                }`}
                              >
                                {topic}
                              </Label>
                              {isChecked && (
                                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum tópico encontrado para "{searchQuery}"</p>
        </div>
      )}
    </AppLayout>
  );
}
