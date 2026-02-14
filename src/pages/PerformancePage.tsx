import { useState, useRef, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/contexts/DataContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Download, Clock, Target, BookOpen, Calendar as CalendarIcon, FilterX } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays, isWithinInterval, startOfDay, endOfDay, getHours } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
const SHIFT_COLORS = { Manhã: '#f59e0b', Tarde: '#3b82f6', Noite: '#8b5cf6', Madrugada: '#64748b' };

interface StudentPerformanceViewProps {
  studentId: string;
  showLayout?: boolean;
}

export function StudentPerformanceView({ studentId, showLayout = true }: StudentPerformanceViewProps) {
  const { sessions, students } = useData();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const pdfRef = useRef<HTMLDivElement>(null);

  const student = students.find(s => s.id === studentId);

  // Filter sessions based on student and date range
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (s.studentId !== studentId) return false;
      if (!dateRange?.from) return true;

      const sessionDate = new Date(s.date);
      const start = startOfDay(dateRange.from);
      const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

      return isWithinInterval(sessionDate, { start, end });
    });
  }, [sessions, studentId, dateRange]);

  // --- Metrics Calculation ---

  // 1. Hours per Subject (Horizontal Bar Chart)
  const subjectHours = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredSessions.forEach(s => {
      counts[s.subject] = (counts[s.subject] || 0) + (s.durationSeconds / 3600);
    });
    return Object.entries(counts)
      .map(([name, hours]) => ({ name, hours: Number(hours.toFixed(1)) }))
      .sort((a, b) => b.hours - a.hours);
  }, [filteredSessions]);

  // 2. Questions Correct vs Incorrect (Donut Chart)
  const questionsData = useMemo(() => {
    const correct = filteredSessions.reduce((acc, s) => acc + (s.questionsCorrect || 0), 0);
    const total = filteredSessions.reduce((acc, s) => acc + (s.questionsTotal || 0), 0);
    const incorrect = total - correct;

    // Avoid division by zero in charts
    if (total === 0) return [];

    return [
      { name: 'Acertos', value: correct, color: '#10b981' }, // emerald-500
      { name: 'Erros', value: incorrect, color: '#ef4444' }, // red-500
    ];
  }, [filteredSessions]);

  // 3. Methods Distribution (Progress Bars)
  const methodData = useMemo(() => {
    const counts: Record<string, number> = {};
    const total = filteredSessions.length;
    filteredSessions.forEach(s => {
      counts[s.method] = (counts[s.method] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredSessions]);

  // 4. Detailed Stats Table & Efficiency
  const detailedStats = useMemo(() => {
    const stats: Record<string, { duration: number, correct: number, total: number, methods: Set<string> }> = {};

    filteredSessions.forEach(s => {
      if (!stats[s.subject]) {
        stats[s.subject] = { duration: 0, correct: 0, total: 0, methods: new Set() };
      }
      stats[s.subject].duration += s.durationSeconds;
      if (s.questionsTotal) {
        stats[s.subject].total += s.questionsTotal;
        stats[s.subject].correct += s.questionsCorrect || 0;
      }
      stats[s.subject].methods.add(s.method);
    });

    return Object.entries(stats).map(([subject, data]) => ({
      subject,
      hours: (data.duration / 3600).toFixed(1),
      questions: data.total,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      methods: Array.from(data.methods).join(', ')
    })).sort((a, b) => Number(b.hours) - Number(a.hours));
  }, [filteredSessions]);

  // 5. Productive Shift (Donut)
  const shiftData = useMemo(() => {
    const shifts = { Manhã: 0, Tarde: 0, Noite: 0, Madrugada: 0 };
    filteredSessions.forEach(s => {
      const hour = getHours(new Date(s.date));
      let shift = 'Madrugada';
      if (hour >= 6 && hour < 12) shift = 'Manhã';
      else if (hour >= 12 && hour < 18) shift = 'Tarde';
      else if (hour >= 18 && hour <= 23) shift = 'Noite';

      shifts[shift as keyof typeof shifts] += 1; // Counting sessions, could ideally count hours but session count is simpler proxy for now
    });

    return Object.entries(shifts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value, color: SHIFT_COLORS[name as keyof typeof SHIFT_COLORS] }));
  }, [filteredSessions]);

  const mostProductiveShift = shiftData.length > 0
    ? shiftData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
    : 'N/A';

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`relatorio-${student?.name || 'desempenho'}.pdf`);
  };

  const Content = (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {showLayout ? 'Desempenho' : `Relatório: ${student?.name}`}
          </h1>
          <p className="text-muted-foreground text-sm">
            {dateRange?.from ? (
              <>Período: <strong>{dateRange.from.toLocaleDateString()}</strong> até <strong>{dateRange.to?.toLocaleDateString() || '...'}</strong></>
            ) : "Selecione um período"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full md:w-auto" />
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setDateRange(undefined)} title="Limpar Filtro">
              <FilterX className="w-4 h-4" />
            </Button>
            <Button variant="default" onClick={generatePDF} className="gap-2">
              <Download className="w-4 h-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </div>

      <div ref={pdfRef} className="space-y-8 bg-background p-2">

        {/* 1. Hours per Subject Chart (Full Width) */}
        <Card className="border-none shadow-none md:border md:shadow-sm">
          <CardHeader>
            <CardTitle>Horas por Disciplina</CardTitle>
            <CardDescription>Distribuição do tempo de estudo no período selecionado</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {subjectHours.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectHours} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Horas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">Sem dados neste período</div>
            )}
          </CardContent>
        </Card>

        {/* Row: Questions (Donut) & Methods (Progress) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 2. Questions Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Questões Respondidas</span>
                <span className="text-sm font-normal text-muted-foreground">Total: {questionsData.reduce((a, b) => a + b.value, 0)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[250px] w-full">
                {questionsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={questionsData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {questionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">Sem questões resolvidas</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3. Study Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Estudo Utilizados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {methodData.map((m, i) => (
                <div key={m.name}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{m.name}</span>
                    <span className="font-bold">{m.percentage}%</span>
                  </div>
                  <Progress value={m.percentage} className="h-2" />
                </div>
              ))}
              {methodData.length === 0 && <div className="text-center text-muted-foreground py-10">Sem dados de registro.</div>}
            </CardContent>
          </Card>
        </div>

        {/* 4. Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Disciplina</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Questões</TableHead>
                  <TableHead>Aproveitamento</TableHead>
                  <TableHead className="hidden md:table-cell">Métodos Principais</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedStats.map((row) => (
                  <TableRow key={row.subject}>
                    <TableCell className="font-medium">{row.subject}</TableCell>
                    <TableCell>{row.hours}h</TableCell>
                    <TableCell>{row.questions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${row.accuracy >= 70 ? 'bg-green-500' : row.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        {row.accuracy}%
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs truncate max-w-[200px]">
                      {row.methods}
                    </TableCell>
                  </TableRow>
                ))}
                {detailedStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Nenhum registro encontrado para este período.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 5. Distribution Bars & Shift (Bottom Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simple Distribution Bars */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição Geral (% Horas)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectHours.slice(0, 5).map((s, i) => {
                const totalH = subjectHours.reduce((a, b) => a + b.hours, 0);
                const percent = totalH > 0 ? Math.round((s.hours / totalH) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                      <span>{s.name}</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-1.5" indicatorClassName="bg-primary/80" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Productive Shift */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Turno Mais Produtivo
                <span className="text-sm font-normal text-primary px-2 py-1 bg-primary/10 rounded-full">{mostProductiveShift}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              {shiftData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shiftData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {shiftData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Dados insuficientes</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return showLayout ? <AppLayout>{Content}</AppLayout> : Content;
}

export default function PerformancePage() {
  const { currentUser } = useData();
  if (!currentUser) return null;
  return <StudentPerformanceView studentId={currentUser.id} />;
}
