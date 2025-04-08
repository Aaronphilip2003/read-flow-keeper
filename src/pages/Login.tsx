import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Logged in successfully",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to login",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                </Button>
            </form>
        </div>
    )
}
