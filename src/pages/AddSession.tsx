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

const AddSession = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId?: string }>();
  const { books, addSession } = useReading();

  const [selectedBookId, setSelectedBookId] = useState(bookId || "");
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Get currently reading books
  const readingBooks = books.filter(book => book.status === "reading" || book.status === "on-hold");

  // Set default startPage based on selected book
  useEffect(() => {
    if (selectedBookId) {
      const book = books.find(b => b.id === selectedBookId);
      if (book) {
        setStartPage(book.currentPage.toString());
      }
    }
  }, [selectedBookId, books]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!selectedBookId || !startPage || !endPage || !date || !duration) {
      alert("Please fill in all required fields");
      return;
    }

    const book = books.find(b => b.id === selectedBookId);
    if (!book) {
      alert("Please select a valid book");
      return;
    }

    const startPageNum = parseInt(startPage);
    const endPageNum = parseInt(endPage);

    if (startPageNum < 0 || startPageNum > book.totalPages) {
      alert("Starting page must be between 0 and the total pages");
      return;
    }

    if (endPageNum <= startPageNum) {
      alert("Ending page must be greater than starting page");
      return;
    }

    if (endPageNum > book.totalPages) {
      alert("Ending page cannot exceed total pages");
      return;
    }

    setLoading(true);

    try {
      await addSession({
        bookId: selectedBookId,
        date: new Date(date).toISOString(),
        startPage: startPageNum,
        endPage: endPageNum,
        duration: parseInt(duration),
        notes: notes || undefined,
      });

      navigate(book ? `/books/${book.id}` : "/sessions");
    } catch (error) {
      console.error('Error adding session:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-book-200">
        <CardHeader>
          <CardTitle className="text-2xl text-book-800">Log Reading Session</CardTitle>
          <CardDescription>
            Track your reading progress by logging a new reading session
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
                    {readingBooks.length > 0 ? (
                      <>
                        <SelectItem value="header-reading" disabled>Currently Reading</SelectItem>
                        {readingBooks.map(book => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title}
                          </SelectItem>
                        ))}

                        {books.filter(b => b.status !== "reading" && b.status !== "on-hold").length > 0 && (
                          <>
                            <SelectItem value="header-other" disabled className="mt-2">Other Books</SelectItem>
                            {books
                              .filter(b => b.status !== "reading" && b.status !== "on-hold")
                              .map(book => (
                                <SelectItem key={book.id} value={book.id}>
                                  {book.title}
                                </SelectItem>
                              ))
                            }
                          </>
                        )}
                      </>
                    ) : (
                      books.map(book => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title}
                        </SelectItem>
                      ))
                    )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startPage">Starting Page*</Label>
                <Input
                  id="startPage"
                  type="number"
                  min="0"
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value)}
                  placeholder="Enter starting page"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endPage">Ending Page*</Label>
                <Input
                  id="endPage"
                  type="number"
                  min="1"
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value)}
                  placeholder="Enter ending page"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time*</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)*</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration in minutes"
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
                placeholder="Add any notes about this reading session"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging Session..." : "Log Session"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddSession;
