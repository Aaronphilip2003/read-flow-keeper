
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, NotepadText } from "lucide-react";

const noteSchema = z.object({
  bookId: z.string().min(1, "Please select a book"),
  text: z.string().min(1, "Note text is required"),
  page: z.coerce
    .number()
    .min(1, "Page number must be at least 1")
    .optional(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

const AddNote = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const { books, addNote } = useReading();
  const [selectedBook, setSelectedBook] = useState<string | undefined>(
    bookId || ""
  );

  // Filter to only include books that are reading or completed
  const availableBooks = books.filter(
    (book) => book.status === "reading" || book.status === "completed"
  );

  // Set up form with default values
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      bookId: bookId || "",
      text: "",
      page: undefined,
    },
  });

  // Update form when bookId param changes
  useEffect(() => {
    if (bookId) {
      form.setValue("bookId", bookId);
      setSelectedBook(bookId);
    }
  }, [bookId, form]);

  // Handle book selection change
  const handleBookChange = (value: string) => {
    setSelectedBook(value);
    form.setValue("bookId", value);
  };

  // Submit handler
  const onSubmit = (data: NoteFormValues) => {
    addNote({
      ...data,
      date: new Date().toISOString(),
      page: data.page || 1,
    });
    navigate("/notes");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add Note</h1>
        <p className="text-muted-foreground">
          Record important information from your reading
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotepadText className="h-5 w-5" />
            New Note
          </CardTitle>
          <CardDescription>
            Save key points and reflections from your book
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="note-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleBookChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableBooks.length === 0 ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            No books available. Add a book first.
                          </div>
                        ) : (
                          availableBooks.map((book) => (
                            <SelectItem key={book.id} value={book.id}>
                              {book.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter page number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your note..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/notes")}>
            Cancel
          </Button>
          <Button form="note-form" type="submit">
            Save Note
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddNote;
