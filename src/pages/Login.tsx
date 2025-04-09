import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if there's a hash in the URL (from email verification)
        const handleEmailVerification = async () => {
            if (location.hash) {
                setLoading(true)
                try {
                    const { error } = await supabase.auth.getSession()
                    if (error) throw error

                    toast({
                        title: "Success",
                        description: "Email verified successfully. You can now log in.",
                    })
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to verify email",
                    })
                } finally {
                    setLoading(false)
                }
            }
        }

        handleEmailVerification()
    }, [location.hash, toast])

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

            // Get the stored path or default to '/'
            const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/'
            // Clear the stored path
            sessionStorage.removeItem('redirectAfterLogin')
            // Redirect to the stored path
            navigate(redirectPath)

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
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Login to continue your reading journey
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary hover:underline">
                                Sign up here
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
