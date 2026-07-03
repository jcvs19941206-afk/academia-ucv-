"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Guardar cambios"}
    </Button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileForm({ profile, email }: { profile: any; email: string }) {
  const [state, formAction] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" value={email} disabled />
        <p className="text-[0.8rem] text-muted-foreground">Tu correo asociado a la cuenta.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} required />
        {state?.errors?.full_name && (
          <p className="text-[0.8rem] text-destructive">{state.errors.full_name[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="timezone">Zona horaria</Label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={profile?.timezone ?? "America/Lima"}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="America/Lima">Lima, Bogotá, Quito (GMT-5)</option>
          <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
          <option value="America/Santiago">Santiago (GMT-4)</option>
          <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
          <option value="Europe/Madrid">Madrid (GMT+1)</option>
        </select>
        {state?.errors?.timezone && (
          <p className="text-[0.8rem] text-destructive">{state.errors.timezone[0]}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
