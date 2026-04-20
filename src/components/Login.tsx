import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'lios') {
      onLogin(key);
    } else {
      setError('Invalid access key');
    }
  };

  return (
    <div className="flex-1 bg-zinc-50 flex flex-col items-center justify-center p-4 h-full">
      <Card className="w-full max-w-md shadow-lg border-zinc-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-zinc-100 p-3 rounded-full w-fit mb-2">
            <Lock className="w-6 h-6 text-zinc-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Secured</CardTitle>
          <CardDescription>
            Enter the access key to view your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Access Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full"
                autoFocus
              />
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Unlock Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
