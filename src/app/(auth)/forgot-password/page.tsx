import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata = {
  title: "Recuperar Contraseña - AcademIA",
};

export default function ForgotPasswordPage() {
  return (
    <main id="main-content" role="main" className="flex h-screen w-full items-center justify-center p-4">
      <ForgotPasswordForm />
    </main>
  );
}
