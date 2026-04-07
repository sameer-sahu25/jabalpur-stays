import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Jabalpur Stays for exclusive offers"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
