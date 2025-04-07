
import { useState } from "react";
import { Link } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { BookOpen, Plus, Quote, Search, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Quotes = () => {
  const { books, quotes, deleteQuote } = useReading();
  const [search, setSearch] = useState("");
  const [bookFilter, setBookFilter] = useState("all");
  
  // Apply filters
  const filteredQuotes = quotes
    .filter(quote => {
      // Book filter
      if (bookFilter !== "all" && quote.bookId !== bookFilter) {
        return false;
      }
      
      // Search filter - search by quote text
      if (search && !quote.text.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-book-800">Favorite Quotes</h1>
        <Button asChild>
          <Link to="/quotes/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Quote
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search quotes..."
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
      </div>
      
      {filteredQuotes.length > 0 ? (
        <div className="space-y-4">
          {filteredQuotes.map(quote => {
            const book = books.find(b => b.id === quote.bookId);
            
            return (
              <Card key={quote.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Quote className="h-5 w-5 text-book-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/books/${book?.id}`} className="font-medium hover:underline text-book-800">
                            {book?.title || 'Unknown Book'}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Page {quote.page} · {format(new Date(quote.date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteQuote(quote.id)}
                            >
                              Delete Quote
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <blockquote className="mt-2 pl-3 border-l-2 border-book-200 italic">
                        {quote.text}
                      </blockquote>
                      
                      {quote.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {quote.notes}
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
            <Quote className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-3 font-medium text-lg">No quotes found</h3>
            {search || bookFilter !== "all" ? (
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            ) : (
              <div className="mt-3">
                <Button asChild>
                  <Link to="/quotes/add">Save Your First Quote</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quotes;
