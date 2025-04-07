
import { useState } from "react";
import { Link } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  NotepadText,
  Plus,
  Search,
  Trash,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";

const Notes = () => {
  const { notes, books, deleteNote } = useReading();
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.text.toLowerCase().includes(search.toLowerCase()) ||
      books.find((b) => b.id === note.bookId)?.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : "Unknown Book";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Track important notes and thoughts from your reading
          </p>
        </div>
        <Button asChild>
          <Link to="/notes/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <NotepadText className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No notes found</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            {search
              ? "Try adjusting your search query"
              : "Start adding notes to your books to keep track of important information"}
          </p>
          {!search && (
            <Button className="mt-6" asChild>
              <Link to="/notes/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Note
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="p-4 md:p-5 flex-1">
                    <div className="flex items-start gap-3">
                      <NotepadText className="h-5 w-5 text-book-500 mt-1 flex-shrink-0" />
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/books/${note.bookId}`}
                              className="font-medium hover:underline"
                            >
                              {getBookTitle(note.bookId)}
                            </Link>
                            <span className="text-sm text-muted-foreground">
                              Page {note.page}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(note.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{note.text}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-border md:flex md:flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-12 rounded-none text-destructive hover:text-destructive"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this note?"
                          )
                        ) {
                          deleteNote(note.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-12 rounded-none"
                      asChild
                    >
                      <Link to={`/books/${note.bookId}`}>
                        <BookOpen className="h-4 w-4" />
                        <span className="sr-only">View Book</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
