
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReadingProvider } from "@/context/ReadingContext";
import { AppLayout } from "@/components/Layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import BookDetails from "./pages/BookDetails";
import Sessions from "./pages/Sessions";
import AddSession from "./pages/AddSession";
import Quotes from "./pages/Quotes";
import AddQuote from "./pages/AddQuote";
import Notes from "./pages/Notes";
import AddNote from "./pages/AddNote";
import Goals from "./pages/Goals";
import AddGoal from "./pages/AddGoal";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ReadingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/add" element={<AddBook />} />
              <Route path="/books/edit/:id" element={<EditBook />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/sessions/add" element={<AddSession />} />
              <Route path="/sessions/add/:bookId" element={<AddSession />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/quotes/add" element={<AddQuote />} />
              <Route path="/quotes/add/:bookId" element={<AddQuote />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/add" element={<AddNote />} />
              <Route path="/notes/add/:bookId" element={<AddNote />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/add" element={<AddGoal />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ReadingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
