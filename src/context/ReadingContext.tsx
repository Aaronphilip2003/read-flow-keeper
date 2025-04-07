
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Book, ReadingSession, Quote, ReadingGoal, ReadingStats } from "@/types";
import { toast } from "@/components/ui/sonner";

interface ReadingContextType {
  books: Book[];
  sessions: ReadingSession[];
  quotes: Quote[];
  goals: ReadingGoal[];
  stats: ReadingStats;
  addBook: (book: Omit<Book, "id">) => Book;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  addSession: (session: Omit<ReadingSession, "id">) => void;
  addQuote: (quote: Omit<Quote, "id">) => void;
  deleteQuote: (id: string) => void;
  addGoal: (goal: Omit<ReadingGoal, "id">) => void;
  updateGoal: (goal: ReadingGoal) => void;
  deleteGoal: (id: string) => void;
  calculateStats: () => ReadingStats;
}

const defaultStats: ReadingStats = {
  totalBooksRead: 0,
  totalPagesRead: 0,
  totalReadingTime: 0,
  averagePagesPerDay: 0,
  averageReadingTimePerDay: 0,
  currentStreak: 0,
  longestStreak: 0,
};

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const ReadingProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [stats, setStats] = useState<ReadingStats>(defaultStats);

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedBooks = localStorage.getItem("readingTracker_books");
    const loadedSessions = localStorage.getItem("readingTracker_sessions");
    const loadedQuotes = localStorage.getItem("readingTracker_quotes");
    const loadedGoals = localStorage.getItem("readingTracker_goals");

    if (loadedBooks) setBooks(JSON.parse(loadedBooks));
    if (loadedSessions) setSessions(JSON.parse(loadedSessions));
    if (loadedQuotes) setQuotes(JSON.parse(loadedQuotes));
    if (loadedGoals) setGoals(JSON.parse(loadedGoals));
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("readingTracker_books", JSON.stringify(books));
    localStorage.setItem("readingTracker_sessions", JSON.stringify(sessions));
    localStorage.setItem("readingTracker_quotes", JSON.stringify(quotes));
    localStorage.setItem("readingTracker_goals", JSON.stringify(goals));
    
    // Recalculate stats when data changes
    setStats(calculateStats());
  }, [books, sessions, quotes, goals]);

  const addBook = (bookData: Omit<Book, "id">) => {
    const newBook = {
      id: crypto.randomUUID(),
      ...bookData,
    };
    setBooks((prev) => [...prev, newBook]);
    toast("Book added successfully");
    return newBook;
  };

  const updateBook = (book: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
    toast("Book updated successfully");
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
    setSessions((prev) => prev.filter((session) => session.bookId !== id));
    setQuotes((prev) => prev.filter((quote) => quote.bookId !== id));
    toast("Book deleted successfully");
  };

  const addSession = (sessionData: Omit<ReadingSession, "id">) => {
    const newSession = {
      id: crypto.randomUUID(),
      ...sessionData,
    };

    setSessions((prev) => [...prev, newSession]);

    // Update the book's current page
    setBooks((prev) =>
      prev.map((book) =>
        book.id === sessionData.bookId
          ? {
              ...book,
              currentPage: Math.max(book.currentPage, sessionData.endPage),
              status: 
                sessionData.endPage >= book.totalPages 
                  ? "completed" 
                  : book.status === "to-read" ? "reading" : book.status
            }
          : book
      )
    );

    toast("Reading session logged successfully");
  };

  const addQuote = (quoteData: Omit<Quote, "id">) => {
    const newQuote = {
      id: crypto.randomUUID(),
      ...quoteData,
    };
    setQuotes((prev) => [...prev, newQuote]);
    toast("Quote saved successfully");
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id));
    toast("Quote deleted successfully");
  };

  const addGoal = (goalData: Omit<ReadingGoal, "id">) => {
    const newGoal = {
      id: crypto.randomUUID(),
      ...goalData,
    };
    setGoals((prev) => [...prev, newGoal]);
    toast("Reading goal added successfully");
  };

  const updateGoal = (goal: ReadingGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
    toast("Reading goal updated successfully");
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    toast("Reading goal deleted successfully");
  };

  const calculateStats = (): ReadingStats => {
    // Calculate total books read
    const completedBooks = books.filter((book) => book.status === "completed").length;

    // Calculate total pages read from sessions
    const pagesRead = sessions.reduce(
      (total, session) => total + (session.endPage - session.startPage),
      0
    );

    // Calculate total reading time
    const totalReadingTime = sessions.reduce(
      (total, session) => total + session.duration,
      0
    );

    // Calculate streaks
    const sessionDates = [...new Set(sessions.map((s) => s.date.split("T")[0]))].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (sessionDates.length > 0) {
      // Check if read today
      const today = new Date().toISOString().split("T")[0];
      const hasReadToday = sessionDates.includes(today);
      
      // Calculate current streak
      for (let i = sessionDates.length - 1; i >= 0; i--) {
        const currentDate = new Date(sessionDates[i]);
        
        if (i === sessionDates.length - 1) {
          // First day in the streak check
          const lastReadDate = new Date(sessionDates[i]);
          const daysSinceLastRead = Math.floor(
            (new Date().getTime() - lastReadDate.getTime()) / (1000 * 3600 * 24)
          );
          
          if (daysSinceLastRead > 1) {
            break; // Streak is broken
          }
          currentStreak = 1;
        } else {
          const prevDate = new Date(sessionDates[i + 1]);
          const dayDiff = Math.floor(
            (prevDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
          );
          
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            break; // Streak is broken
          }
        }
      }

      // Calculate longest streak
      for (let i = 0; i < sessionDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const currentDate = new Date(sessionDates[i]);
          const prevDate = new Date(sessionDates[i - 1]);
          const dayDiff = Math.floor(
            (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
          );
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            tempStreak = 1;
          }
        }
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    // Calculate averages
    const daysSinceFirstSession = sessionDates.length > 0
      ? Math.max(
          1,
          Math.ceil(
            (new Date().getTime() - new Date(sessionDates[0]).getTime()) /
              (1000 * 3600 * 24)
          )
        )
      : 1;

    const averagePagesPerDay = Math.round(pagesRead / daysSinceFirstSession);
    const averageReadingTimePerDay = Math.round(totalReadingTime / daysSinceFirstSession);

    return {
      totalBooksRead: completedBooks,
      totalPagesRead: pagesRead,
      totalReadingTime,
      averagePagesPerDay,
      averageReadingTimePerDay,
      currentStreak,
      longestStreak,
    };
  };

  const value = {
    books,
    sessions,
    quotes,
    goals,
    stats,
    addBook,
    updateBook,
    deleteBook,
    addSession,
    addQuote,
    deleteQuote,
    addGoal,
    updateGoal,
    deleteGoal,
    calculateStats,
  };

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>;
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error("useReading must be used within a ReadingProvider");
  }
  return context;
};
