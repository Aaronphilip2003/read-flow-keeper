
export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string; // URL of the book cover
  totalPages: number;
  currentPage: number;
  startDate: string; // ISO date string
  targetDate?: string; // ISO date string for completion goal
  status: "reading" | "completed" | "on-hold" | "to-read";
  notes?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: string; // ISO date string
  startPage: number;
  endPage: number;
  duration: number; // in minutes
  notes?: string;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  page: number;
  date: string; // ISO date string
  notes?: string;
}

export interface ReadingGoal {
  id: string;
  type: "pages" | "books" | "time";
  target: number;
  period: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  startDate: string; // ISO date string
  endDate?: string; // ISO date string for custom period
  completed: boolean;
}

export interface ReadingStats {
  totalBooksRead: number;
  totalPagesRead: number;
  totalReadingTime: number; // in minutes
  averagePagesPerDay: number;
  averageReadingTimePerDay: number; // in minutes
  currentStreak: number; // consecutive days reading
  longestStreak: number; // longest consecutive days reading
}
