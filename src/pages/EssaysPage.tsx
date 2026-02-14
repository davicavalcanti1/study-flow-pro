import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { FileText, Plus, Upload, CheckCircle, Clock } from "lucide-react";
import { Essay } from "@/types";

export default function EssaysPage() {
  const { essays, addEssay, currentUser } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEssay, setNewEssay] = useState({ title: '', theme: '' });

  const handleSave = () => {
    if (!currentUser) return;
    addEssay({
      studentId: currentUser.id,
      title: newEssay.title || 'Sem título',
      theme: newEssay.theme,
      date: new Date().toISOString(),
      status: 'Pendente',
    });
    setNewEssay({ title: '', theme: '' });
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Redações</h1>
          <p className="text-sm text-muted-foreground">Envie e acompanhe as correções das suas redações.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Redação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Nova Redação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Título (Opcional)</Label>
                <Input
                  value={newEssay.title}
                  onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                  placeholder="Ex: Redação Semana 1"
                />
              </div>
              <div>
                <Label>Tema da Redação</Label>
                <Input
                  value={newEssay.theme}
                  onChange={(e) => setNewEssay({ ...newEssay, theme: e.target.value })}
                  placeholder="Ex: A persistência da violência contra a mulher"
                />
              </div>
              <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Clique para fazer upload do arquivo</p>
                <p className="text-xs text-muted-foreground">PDF ou Imagem (Máx 5MB)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Enviar para Correção</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {essays.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma redação enviada ainda.</p>
          </div>
        )}

        {essays.map((essay) => (
          <Card key={essay.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">{essay.theme}</CardTitle>
                {essay.status === 'Corrigida' ? (
                  <span className="flex items-center text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" /> Nota: {essay.score}
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" /> Pendente
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                Enviada em {new Date(essay.date).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {essay.feedback || "Aguardando correção..."}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
