import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { MessageSquare, Heart, Share2, Image as ImageIcon, Send } from "lucide-react";

export default function ForumPage() {
  const { posts, addPost, currentUser } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const handlePost = () => {
    if (!currentUser || !newPostContent.trim()) return;
    addPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: newPostContent,
    });
    setNewPostContent('');
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Fórum de Dúvidas</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 rounded-full px-6">
                Nova Dúvida
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publicar Dúvida</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Descreva sua dúvida ou compartilhe algo..."
                  className="min-h-[150px] resize-none"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="ghost" size="icon" title="Adicionar Imagem">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handlePost}>Publicar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {post.authorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{post.authorName}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Aluno</p>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <CardFooter className="pt-2 border-t border-border/50 flex justify-between">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                    <Heart className="w-4 h-4 mr-1.5" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    {post.comments.length}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
