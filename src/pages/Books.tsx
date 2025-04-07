
import { useState } from "react";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, ClockIcon, Edit, MoreHorizontal, PlayCircle, Plus, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Book as BookType } from "@/types";
import { formatDistanceToNow } from "date-fns";

const Books = () => {
  const { books, deleteBook } = useReading();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(search.toLowerCase()) || 
      book.author.toLowerCase().includes(search.toLowerCase())
    )
    .filter(book => {
      if (filter === "all") return true;
      return book.status === filter;
    })
    .sort((a, b) => {
      // Sort by status (reading first, then to-read, then on-hold, then completed)
      const statusOrder = { "reading": 0, "to-read": 1, "on-hold": 2, "completed": 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
    
  const handleDeleteBook = (book: BookType) => {
    if (confirm(`Are you sure you want to delete "${book.title}"? This will also delete all reading sessions and quotes associated with this book.`)) {
      deleteBook(book.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-book-800">My Books</h1>
        <Button asChild>
          <Link to="/books/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Book className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="reading">Currently Reading</SelectItem>
            <SelectItem value="to-read">To Read</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map(book => {
            const progress = Math.round((book.currentPage / book.totalPages) * 100);
            const startDate = new Date(book.startDate);
            
            return (
              <Card key={book.id} className="overflow-hidden">
                <div className="relative h-40 bg-book-100">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-book-200 to-book-300">
                      <span className="font-medium text-book-700">{book.title}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/30 text-white hover:bg-black/50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/books/${book.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/books/edit/${book.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Book
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/sessions/add/${book.id}`)}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Reading
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteBook(book)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Book
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <div className={`
                      px-2 py-1 text-xs rounded-full
                      ${book.status === 'reading' ? 'bg-green-100 text-green-800' : ''}
                      ${book.status === 'to-read' ? 'bg-blue-100 text-blue-800' : ''}
                      ${book.status === 'on-hold' ? 'bg-amber-100 text-amber-800' : ''}
                      ${book.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
                    `}>
                      {book.status === 'reading' && 'Reading'}
                      {book.status === 'to-read' && 'To Read'}
                      {book.status === 'on-hold' && 'On Hold'}
                      {book.status === 'completed' && 'Completed'}
                    </div>
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg font-medium line-clamp-1">{book.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 pb-0">
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  
                  {book.status !== 'to-read' && (
                    <>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>Page {book.currentPage} of {book.totalPages}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>
                      {book.status === 'to-read' 
                        ? 'Added ' 
                        : 'Started '} 
                      {formatDistanceToNow(startDate, { addSuffix: true })}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <Book className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-3 font-medium text-lg">No books found</h3>
            {search || filter !== "all" ? (
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            ) : (
              <div className="mt-3">
                <Button asChild>
                  <Link to="/books/add">Add Your First Book</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Books;
