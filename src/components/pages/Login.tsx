import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type React from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Login failed: ' + error.message);
      } else {
        alert('Login failed');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Signup successful! You can now log in.');
      setIsLogin(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes('auth/email-already-in-use')) {
            alert('Signup failed: This email is already in use. Please log in or use a different email.');
          } else {
            alert('Signup failed: ' + error.message);
          }
        } else {
          alert('Signup failed');
        }
      }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {isLogin ? (
        <form onSubmit={handleLogin}>
          <Card className="w-full max-w-sm p-6">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <p className="mt-4 text-center">
                Don't have an account?{' '}
                <button type="button" className="text-blue-600 underline" onClick={() => setIsLogin(false)}>
                  Sign up
                </button>
              </p>
            </CardContent>
          </Card>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <Card className="w-full max-w-sm p-6">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Sign Up</Button>
              <p className="mt-4 text-center">
                Already have an account?{' '}
                <button type="button" className="text-blue-600 underline" onClick={() => setIsLogin(true)}>
                  Log in
                </button>
              </p>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
