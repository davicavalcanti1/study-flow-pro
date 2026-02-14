import { AppLayout } from "@/components/layout/AppLayout";
import { ScheduleView } from "@/components/study/ScheduleView";
import { StudyCycleView } from "@/components/study/StudyCycleView";
import { useData } from "@/contexts/DataContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, RotateCw } from "lucide-react";

export default function SchedulePage() {
  const { currentUser, updateStudentProfileType } = useData();

  if (!currentUser || currentUser.role !== 'STUDENT') return null;

  const currentMode = currentUser.profileType;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">Planejamento</h1>

        <Tabs
          value={currentMode}
          onValueChange={(v) => updateStudentProfileType(currentUser.id, v as 'ROUTINE' | 'CYCLE')}
          className="w-[300px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ROUTINE" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="CYCLE" className="flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              Ciclo
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {currentMode === 'ROUTINE' ? <ScheduleView /> : <StudyCycleView />}
    </AppLayout>
  );
}
