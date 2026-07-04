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
        <div className="relative z-10 w-full max-w-lg text-center text-white">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Bienvenido a la UCV</h2>
            <p className="text-white/80">Comienza tu viaje académico con nosotros</p>
          </div>
          
          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10 relative">

            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/Nj221g6ObpE?autoplay=1&mute=1&loop=1&playlist=Nj221g6ObpE" 
              title="Bienvenida UCV" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full object-cover border-0"
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* Lado formulario */}
      <div className="flex items-center justify-center p-6 md:p-8 bg-background">
        <LoginForm />
      </div>
    </main>
  );
}
