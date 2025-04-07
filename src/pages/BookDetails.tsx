
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { Book, BookText, ClockIcon, Edit, ListPlus, NotepadText, PlayCircle, Plus, Quote, Trash } from "lucide-react";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, sessions, quotes, notes, deleteBook } = useReading();
  const [book, setBook] = useState(books.find((b) => b.id === id));
  
  // Find reading sessions, quotes, and notes for this book
  const bookSessions = sessions.filter((session) => session.bookId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const bookQuotes = quotes.filter((quote) => quote.bookId === id)
    .sort((a, b) => b.page - a.page);
    
  const bookNotes = notes.filter((note) => note.bookId === id)
    .sort((a, b) => b.page - a.page);
  
  // Calculate reading stats for this book
  const totalPagesRead = bookSessions.reduce(
    (sum, session) => sum + (session.endPage - session.startPage),
    0
  );
  
  const totalReadingTime = bookSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  
  const averageReadingSpeed = totalReadingTime > 0
    ? Math.round((totalPagesRead / totalReadingTime) * 60)
    : 0;
  
  useEffect(() => {
    // Update book when books array changes
    setBook(books.find((b) => b.id === id));
  }, [id, books]);
  
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookText className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Book Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The book you're looking for doesn't exist or has been deleted.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/books">Back to Books</Link>
        </Button>
      </div>
    );
  }
  
  const progress = Math.round((book.currentPage / book.totalPages) * 100);
  
  const handleDeleteBook = () => {
    if (confirm(`Are you sure you want to delete "${book.title}"? This will also delete all reading sessions and quotes associated with this book.`)) {
      deleteBook(book.id);
      navigate("/books");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="md:w-1/3 lg:w-1/4">
          <div className="book-cover aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-book-200 to-book-300 rounded-md">
                <Book className="h-12 w-12 text-book-700" />
              </div>
            )}
            <div className="book-spine"></div>
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link to={`/sessions/add/${book.id}`}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Reading Session
              </Link>
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/quotes/add/${book.id}`}>
                  <Quote className="mr-2 h-4 w-4" />
                  Add Quote
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/notes/add/${book.id}`}>
                  <NotepadText className="mr-2 h-4 w-4" />
                  Add Note
                </Link>
              </Button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="icon" className="flex-1" asChild>
                <Link to={`/books/edit/${book.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="flex-1 text-destructive hover:text-destructive" onClick={handleDeleteBook}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-1">
            <div className={`
              inline-block px-2 py-1 text-xs rounded-full
              ${book.status === 'reading' ? 'bg-green-100 text-green-800' : ''}
              ${book.status === 'to-read' ? 'bg-blue-100 text-blue-800' : ''}
              ${book.status === 'on-hold' ? 'bg-amber-100 text-amber-800' : ''}
              ${book.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
            `}>
              {book.status === 'reading' && 'Currently Reading'}
              {book.status === 'to-read' && 'To Read'}
              {book.status === 'on-hold' && 'On Hold'}
              {book.status === 'completed' && 'Completed'}
            </div>
            <h1 className="text-3xl font-bold text-book-800">{book.title}</h1>
            <p className="text-xl text-muted-foreground">{book.author}</p>
          </div>
          
          {book.status !== 'to-read' && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Page {book.currentPage} of {book.totalPages}</span>
                <span>{progress}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{book.totalPages}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">
                  {Math.floor(totalReadingTime / 60)}h {totalReadingTime % 60}m
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Reading Speed</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">
                  {averageReadingSpeed > 0 ? `${averageReadingSpeed} pgs/hr` : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {book.notes && (
            <Card className="mt-4">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="whitespace-pre-line">{book.notes}</p>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6">
            <Tabs defaultValue="sessions">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sessions">Reading Sessions</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sessions" className="mt-4">
                {bookSessions.length > 0 ? (
                  <div className="space-y-4">
                    {bookSessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <ClockIcon className="h-5 w-5 text-book-500 mt-1" />
                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between gap-2">
                                <h3 className="font-medium">
                                  Read {session.endPage - session.startPage} pages
                                </h3>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(session.date), "MMM d, yyyy")}
                                </span>
                              </div>
                              <p className="text-sm">
                                Pages {session.startPage} – {session.endPage} · {session.duration} minutes
                              </p>
                              {session.notes && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {session.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <ClockIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                      <h3 className="mt-3 font-medium">No reading sessions yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track your reading progress by adding a reading session
                      </p>
                      <Button className="mt-4" asChild>
                        <Link to={`/sessions/add/${book.id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Reading Session
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="quotes" className="mt-4">
                {bookQuotes.length > 0 ? (
                  <div className="space-y-4">
                    {bookQuotes.map((quote) => (
                      <Card key={quote.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Quote className="h-5 w-5 text-book-500 mt-1 flex-shrink-0" />
                            <div>
                              <div className="flex flex-wrap justify-between gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Page {quote.page}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(quote.date), "MMM d, yyyy")}
                                </span>
                              </div>
                              <p className="mt-2 italic">{quote.text}</p>
                              {quote.notes && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {quote.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Quote className="h-10 w-10 text-muted-foreground mx-auto" />
                      <h3 className="mt-3 font-medium">No quotes saved yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Save memorable quotes as you read
                      </p>
                      <Button className="mt-4" asChild>
                        <Link to={`/quotes/add/${book.id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Quote
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                {bookNotes.length > 0 ? (
                  <div className="space-y-4">
                    {bookNotes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <NotepadText className="h-5 w-5 text-book-500 mt-1 flex-shrink-0" />
                            <div>
                              <div className="flex flex-wrap justify-between gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Page {note.page}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(note.date), "MMM d, yyyy")}
                                </span>
                              </div>
                              <p className="mt-2">{note.text}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <NotepadText className="h-10 w-10 text-muted-foreground mx-auto" />
                      <h3 className="mt-3 font-medium">No notes saved yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Save important information as you read
                      </p>
                      <Button className="mt-4" asChild>
                        <Link to={`/notes/add/${book.id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Note
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
