import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/app/(auth)/login/login-form";

// Mocks request to not trigger actual navigation or toast issues
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

describe("LoginForm", () => {
  it("shows validation error on empty submit", async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    
    // Expect error messages to appear since email and password are empty
    expect(await screen.findByText(/correo es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/contraseña es obligatoria/i)).toBeInTheDocument();
  });

  it("shows error on invalid email", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/correo/i), "invalido");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    
    expect(await screen.findByText(/correo válido/i)).toBeInTheDocument();
  });
});
