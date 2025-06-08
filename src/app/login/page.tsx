'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mountain } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Sessió iniciada', description: 'Benvingut de nou!' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error en iniciar sessió. Comprova les teves credencials.');
      toast({
        title: 'Error d\'inici de sessió',
        description: err.message || 'Comprova les teves credencials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <Mountain className="h-10 w-10 text-primary" />
            <h1 className="ml-2 text-3xl font-bold font-headline text-primary">HotelFlow</h1>
          </div>
          <CardTitle className="text-2xl font-headline">Inici de Sessió</CardTitle>
          <CardDescription>Accedeix al panell de gestió de manteniment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correu Electrònic</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@correu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contrasenya</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full text-base" disabled={loading}>
              {loading ? 'Iniciant sessió...' : 'Entra'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} HotelFlow. Tots els drets reservats.</p>
      </footer>
    </div>
  );
}
