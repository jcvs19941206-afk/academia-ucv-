"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updatePassword } from "@/app/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...</> : "Actualizar contraseña"}
    </Button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(updatePassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current_password">Contraseña actual</Label>
        <Input id="current_password" name="current_password" type="password" required />
        {state?.errors?.current_password && (
          <p className="text-[0.8rem] text-destructive">{state.errors.current_password[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="new_password">Nueva contraseña</Label>
        <Input id="new_password" name="new_password" type="password" required />
        {state?.errors?.new_password && (
          <p className="text-[0.8rem] text-destructive">{state.errors.new_password[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
        <Input id="confirm_password" name="confirm_password" type="password" required />
        {state?.errors?.confirm_password && (
          <p className="text-[0.8rem] text-destructive">{state.errors.confirm_password[0]}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
