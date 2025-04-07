
import { useState } from "react";
import { Link } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format, formatDistanceToNow } from "date-fns";
import { BookOpen, Calendar, Clock, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Sessions = () => {
  const { books, sessions } = useReading();
  const [search, setSearch] = useState("");
  const [bookFilter, setBookFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  // Apply filters
  const filteredSessions = sessions
    .filter(session => {
      // Book filter
      if (bookFilter !== "all" && session.bookId !== bookFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter !== "all") {
        const sessionDate = new Date(session.date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (dateFilter === "today" && 
            sessionDate.toDateString() !== today.toDateString()) {
          return false;
        }
        
        if (dateFilter === "yesterday" && 
            sessionDate.toDateString() !== yesterday.toDateString()) {
          return false;
        }
        
        if (dateFilter === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (sessionDate < weekAgo) {
            return false;
          }
        }
        
        if (dateFilter === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          if (sessionDate < monthAgo) {
            return false;
          }
        }
      }
      
      // Search filter - search by book title
      if (search) {
        const book = books.find(b => b.id === session.bookId);
        if (!book || !book.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-book-800">Reading Sessions</h1>
        <Button asChild>
          <Link to="/sessions/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by book title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        
        <Select value={bookFilter} onValueChange={setBookFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by book" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            {books.map(book => (
              <SelectItem key={book.id} value={book.id}>
                {book.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map(session => {
            const book = books.find(b => b.id === session.bookId);
            const pagesRead = session.endPage - session.startPage;
            
            return (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-book-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-book-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between gap-2">
                        <Link to={`/books/${book?.id}`} className="font-medium hover:underline text-book-800">
                          {book?.title || 'Unknown Book'}
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(session.date), "MMM d, yyyy")}
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-4 w-4 mr-2 text-book-500" />
                          <span>
                            Read {pagesRead} {pagesRead === 1 ? 'page' : 'pages'}
                            {' '}({session.startPage} – {session.endPage})
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-book-500" />
                          <span>{session.duration} minutes</span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                        </div>
                      </div>
                      
                      {session.notes && (
                        <p className="mt-2 text-sm text-muted-foreground border-t border-book-100 pt-2">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-3 font-medium text-lg">No reading sessions found</h3>
            {search || bookFilter !== "all" || dateFilter !== "all" ? (
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            ) : (
              <div className="mt-3">
                <Button asChild>
                  <Link to="/sessions/add">Log Your First Reading Session</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sessions;
