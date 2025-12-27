import React, { useState } from 'react';
import { supabase } from '../supabase';
import { BCard, BButton, BInput } from './ui/BrutalistComponents';
import { Activity } from 'lucide-react';

export const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { name }
                    }
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
            }
        } catch (error: any) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-block bg-black text-lime-400 p-4 border-4 border-black mb-4">
                        <Activity size={48} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">GeoKracht</h1>
                    <p className="font-bold uppercase text-gray-500">Cloud Sync & Progress Tracking</p>
                </div>

                <BCard color="white">
                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="text-xs font-black uppercase mb-1 block">Full Name</label>
                                <BInput
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-black uppercase mb-1 block">Email</label>
                            <BInput
                                type="email"
                                placeholder="athlete@geokracht.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase mb-1 block">Password</label>
                            <BInput
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <BButton
                            type="submit"
                            variant="primary"
                            className="w-full mt-6"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </BButton>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs font-black uppercase text-gray-500 hover:text-black transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </BCard>
            </div>
        </div>
    );
};
