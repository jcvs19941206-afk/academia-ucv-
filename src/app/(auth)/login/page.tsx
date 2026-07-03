import { QuoteRotator } from "@/components/shared/quote-rotator";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Iniciar Sesión | AcademIA",
  description: "Accede a tu panel de control de maestría.",
};

export default function LoginPage() {
  return (
    <main id="main-content" role="main" className="min-h-screen grid md:grid-cols-2">
      {/* Lado visual - oculto en mobile */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary to-accent p-12 relative overflow-hidden">
        {/* Patrón geométrico superpuesto */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        
        {/* Glow effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        
        {/* Contenido visual */}
        <div className="relative z-10 max-w-md text-center text-white">
          {/* Frase motivacional rotativa */}
          <QuoteRotator />
        </div>
      </div>
      
      {/* Lado formulario */}
      <div className="flex items-center justify-center p-6 md:p-8 bg-background">
        <LoginForm />
      </div>
    </main>
  );
}
