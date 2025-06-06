import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, updateBook } = useReading();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [cover, setCover] = useState("");
  const [status, setStatus] = useState<"reading" | "completed" | "on-hold" | "to-read">("to-read");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const book = books.find((b) => b.id === id);

    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setTotalPages(book.totalPages?.toString() || "");
      setCurrentPage(book.currentPage?.toString() || "");
      setCover(book.cover || "");
      setStatus(book.status);
      setNotes(book.notes || "");
      setStartDate(book.startDate || "");
    } else {
      navigate("/books");
    }
  }, [id, books, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !author || !totalPages) {
      alert("Please fill in all required fields");
      return;
    }

    if (!id) return;

    // If status is completed, set currentPage to totalPages
    const finalCurrentPage = status === "completed" ? parseInt(totalPages) : parseInt(currentPage || "0");

    await updateBook({
      id,
      title,
      author,
      totalPages: parseInt(totalPages),
      currentPage: finalCurrentPage,
      cover: cover || undefined,
      startDate,
      status,
      notes: notes || undefined,
    });

    navigate(`/books/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-book-200">
        <CardHeader>
          <CardTitle className="text-2xl text-book-800">Edit Book</CardTitle>
          <CardDescription>
            Update details for your book
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
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditBook;
