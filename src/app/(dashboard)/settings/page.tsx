import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">Administra tu cuenta y perfil</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
            <div><CardTitle>Perfil</CardTitle><CardDescription>Tu información personal</CardDescription></div>
          </div>
        </CardHeader>
        <CardContent><ProfileForm profile={profile} email={user.email!} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10"><Shield className="h-5 w-5 text-destructive" /></div>
            <div><CardTitle>Seguridad</CardTitle><CardDescription>Cambia tu contraseña</CardDescription></div>
          </div>
        </CardHeader>
        <CardContent><PasswordForm /></CardContent>
      </Card>
    </div>
  );
}
