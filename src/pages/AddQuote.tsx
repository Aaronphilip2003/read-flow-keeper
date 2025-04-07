
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { format } from "date-fns";

const AddQuote = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId?: string }>();
  const { books, addQuote } = useReading();
  
  const [selectedBookId, setSelectedBookId] = useState(bookId || "");
  const [text, setText] = useState("");
  const [page, setPage] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  
  // Set max page based on selected book
  const selectedBook = books.find(b => b.id === selectedBookId);
  const maxPage = selectedBook ? selectedBook.totalPages : 9999;
  
  useEffect(() => {
    if (selectedBookId) {
      const book = books.find(b => b.id === selectedBookId);
      if (book) {
        setPage(book.currentPage.toString());
      }
    }
  }, [selectedBookId, books]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!selectedBookId || !text || !page || !date) {
      alert("Please fill in all required fields");
      return;
    }
    
    const pageNum = parseInt(page);
    if (pageNum <= 0 || pageNum > maxPage) {
      alert(`Page number must be between 1 and ${maxPage}`);
      return;
    }
    
    addQuote({
      bookId: selectedBookId,
      text,
      page: pageNum,
      date: new Date(date).toISOString(),
      notes: notes || undefined,
    });
    
    navigate(selectedBook ? `/books/${selectedBook.id}` : "/quotes");
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-book-200">
        <CardHeader>
          <CardTitle className="text-2xl text-book-800">Save Quote</CardTitle>
          <CardDescription>
            Save a memorable quote from your book
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="book">Book*</Label>
              {books.length > 0 ? (
                <Select 
                  value={selectedBookId} 
                  onValueChange={setSelectedBookId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map(book => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">No books available</p>
                  <Button className="mt-2" asChild size="sm">
                    <a href="/books/add">Add a Book First</a>
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text">Quote*</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the quote text"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page">Page Number*</Label>
                <Input
                  id="page"
                  type="number"
                  min="1"
                  max={maxPage}
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  placeholder="Enter page number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any thoughts or context about this quote"
                rows={2}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Save Quote</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddQuote;
