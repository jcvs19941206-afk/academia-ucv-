import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata = {
  title: "Nueva Contraseña - AcademIA",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params.code;

  if (!code || typeof code !== "string") {
    // Si no hay código en la URL, no podemos recuperar la cuenta
    redirect("/login");
  }

  return (
    <main id="main-content" role="main" className="flex h-screen w-full items-center justify-center p-4">
      <ResetPasswordForm code={code} />
    </main>
  );
}
