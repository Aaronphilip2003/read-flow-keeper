
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Book } from "lucide-react";

const AddBook = () => {
  const navigate = useNavigate();
  const { addBook } = useReading();
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [cover, setCover] = useState("");
  const [status, setStatus] = useState<"reading" | "completed" | "on-hold" | "to-read">("to-read");
  const [notes, setNotes] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !author || !totalPages) {
      alert("Please fill in all required fields");
      return;
    }
    
    const newBook = addBook({
      title,
      author,
      totalPages: parseInt(totalPages),
      currentPage: status === "to-read" ? 0 : parseInt(currentPage || "0"),
      cover: cover || undefined,
      startDate: new Date().toISOString(),
      status,
      notes: notes || undefined,
    });
    
    navigate(`/books/${newBook.id}`);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-book-200">
        <CardHeader>
          <CardTitle className="text-2xl text-book-800">Add New Book</CardTitle>
          <CardDescription>
            Track your reading progress by adding a new book to your collection
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title*</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author*</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-md p-6">
                {cover ? (
                  <img 
                    src={cover} 
                    alt="Book cover preview" 
                    className="h-32 object-contain"
                    onError={() => setCover("")}
                  />
                ) : (
                  <div className="text-center">
                    <Book className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground mt-2">Cover image preview</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image URL (optional)</Label>
              <Input
                id="cover"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalPages">Total Pages*</Label>
                <Input
                  id="totalPages"
                  type="number"
                  min="1"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value)}
                  placeholder="Enter total pages"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Reading Status*</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-read">To Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {status !== "to-read" && (
              <div className="space-y-2">
                <Label htmlFor="currentPage">Current Page</Label>
                <Input
                  id="currentPage"
                  type="number"
                  min="0"
                  max={totalPages || "9999"}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  placeholder="Enter current page"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about the book"
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Add Book</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddBook;
