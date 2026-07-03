import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
      <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Página no encontrada</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        La página que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Ir al inicio
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tasks">
            <Search className="h-4 w-4 mr-2" />
            Ver tareas
          </Link>
        </Button>
      </div>
    </div>
  );
}
