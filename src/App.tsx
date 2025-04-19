import { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ReadingProvider } from "@/context/ReadingContext";
import { AppLayout } from "@/components/Layout/AppLayout";
import { initializeSupabase } from './lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Books from "@/pages/Books";
import AddBook from "@/pages/AddBook";
import EditBook from "@/pages/EditBook";
import BookDetails from "@/pages/BookDetails";
import Sessions from "@/pages/Sessions";
import AddSession from "@/pages/AddSession";
import Quotes from "@/pages/Quotes";
import AddQuote from "@/pages/AddQuote";
import Notes from "@/pages/Notes";
import AddNote from "@/pages/AddNote";
import Goals from "@/pages/Goals";
import AddGoal from "@/pages/AddGoal";
import Statistics from "@/pages/Statistics";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const queryClient = new QueryClient();

function AppContent() {
  const { toast } = useToast()

  useEffect(() => {
    initializeSupabase().catch(error => {
      console.error('Failed to initialize Supabase:', error)
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to the database. Please check your connection and try again.",
      })
    })
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout><Outlet /></AppLayout>}>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="books" element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        } />
        <Route path="books/add" element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        } />
        <Route path="books/edit/:id" element={<EditBook />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="sessions" element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        } />
        <Route path="sessions/add" element={<AddSession />} />
        <Route path="sessions/add/:bookId" element={<AddSession />} />
        <Route path="quotes" element={
          <ProtectedRoute>
            <Quotes />
          </ProtectedRoute>
        } />
        <Route path="quotes/add" element={<AddQuote />} />
        <Route path="quotes/add/:bookId" element={<AddQuote />} />
        <Route path="notes" element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } />
        <Route path="notes/add" element={<AddNote />} />
        <Route path="notes/add/:bookId" element={<AddNote />} />
        <Route path="goals" element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        } />
        <Route path="goals/add" element={<AddGoal />} />
        <Route path="statistics" element={
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReadingProvider>
          <BrowserRouter>
            <AppContent />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </ReadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
