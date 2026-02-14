import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

export function ScheduleView() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Calendário</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            locale={ptBR}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Agenda do Dia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-8">
                            {date ? (
                                <p>Nenhuma atividade planejada para {date.toLocaleDateString()}.</p>
                            ) : (
                                <p>Selecione uma data para ver os detalhes.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
