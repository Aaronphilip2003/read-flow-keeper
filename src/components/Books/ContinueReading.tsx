
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, PlayCircle } from "lucide-react";

interface ContinueReadingProps {
  book: Book;
}

const ContinueReading = ({ book }: ContinueReadingProps) => {
  const progress = Math.round((book.currentPage / book.totalPages) * 100);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
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
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button 
                asChild 
                size="sm" 
                variant="secondary" 
                className="gap-1 text-white bg-black/50 hover:bg-black/70"
              >
                <Link to={`/sessions/add/${book.id}`}>
                  <PlayCircle className="h-4 w-4" />
                  Start Reading
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-medium line-clamp-1">{book.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
            
            <div className="mt-3 mb-1 flex justify-between text-xs">
              <span>Page {book.currentPage} of {book.totalPages}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
            
            <Button 
              asChild 
              variant="ghost" 
              className="mt-auto justify-between text-primary text-sm h-8 px-2"
            >
              <Link to={`/books/${book.id}`}>
                <span>Book details</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContinueReading;
