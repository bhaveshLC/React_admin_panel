import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/api';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const { data } = await authService.login(values.email, values.password);
      localStorage.setItem('token', data.token);
      toast.success('Login successful');
      navigate('/events');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Log in to continue to dashboard</p>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Email</span>
            <Input type="email" {...form.register('email')} />
            <p className="text-xs text-red-500">{form.formState.errors.email?.message}</p>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Password</span>
            <Input type="password" {...form.register('password')} />
            <p className="text-xs text-red-500">{form.formState.errors.password?.message}</p>
          </label>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
