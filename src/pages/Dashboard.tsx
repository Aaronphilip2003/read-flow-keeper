
import { useReading } from "@/context/ReadingContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Target, 
  TrendingUp 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import ContinueReading from "@/components/Books/ContinueReading";

const Dashboard = () => {
  const { books, sessions, quotes, goals, stats } = useReading();

  const currentlyReading = books.filter(book => book.status === "reading");
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
    
  const activeGoals = goals.filter(goal => !goal.completed);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-book-800">Welcome to ReadFlow</h1>
        <Button asChild>
          <Link to="/books/add">Add New Book</Link>
        </Button>
      </div>
      
      {currentlyReading.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-book-700">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyReading.map(book => (
              <ContinueReading key={book.id} book={book} />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium text-lg">No books currently reading</h3>
              <p className="text-muted-foreground">Add a book to start tracking your reading progress</p>
              <Button asChild>
                <Link to="/books/add">Add Your First Book</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}</div>
            <p className="text-xs text-muted-foreground">Longest: {stats.longestStreak} days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPagesRead}</div>
            <p className="text-xs text-muted-foreground">~{stats.averagePagesPerDay} pages/day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reading Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.totalReadingTime / 60)} hrs {stats.totalReadingTime % 60} min</div>
            <p className="text-xs text-muted-foreground">~{Math.floor(stats.averageReadingTimePerDay / 60)}h {stats.averageReadingTimePerDay % 60}m/day</p>
          </CardContent>
        </Card>
      </div>
      
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-book-700">Reading Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.slice(0, 2).map(goal => {
              let progress = 0;
              let currentValue = 0;
              
              if (goal.type === "pages") {
                currentValue = stats.totalPagesRead;
                progress = Math.min(100, (currentValue / goal.target) * 100);
              } else if (goal.type === "books") {
                currentValue = stats.totalBooksRead;
                progress = Math.min(100, (currentValue / goal.target) * 100);
              } else if (goal.type === "time") {
                currentValue = stats.totalReadingTime;
                progress = Math.min(100, (currentValue / goal.target) * 100);
              }
              
              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {goal.type === "pages" && "Pages Goal"}
                        {goal.type === "books" && "Books Goal"}
                        {goal.type === "time" && "Reading Time Goal"}
                      </CardTitle>
                      <CardDescription>{goal.period}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-lg font-medium">
                      {currentValue} / {goal.target} {goal.type === "time" ? "minutes" : goal.type}
                    </div>
                    <Progress value={progress} />
                    <p className="text-xs text-muted-foreground">
                      {progress < 100 
                        ? `${Math.round(progress)}% complete`
                        : "Goal completed!"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {activeGoals.length > 2 && (
            <Button variant="link" asChild>
              <Link to="/goals">View all goals</Link>
            </Button>
          )}
        </div>
      )}
      
      {recentSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-book-700">Recent Reading Activity</h2>
          <div className="space-y-3">
            {recentSessions.map(session => {
              const book = books.find(b => b.id === session.bookId);
              const pagesRead = session.endPage - session.startPage;
              
              return (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-book-500" />
                      <div className="flex-1">
                        <h3 className="font-medium">
                          Read {pagesRead} {pagesRead === 1 ? 'page' : 'pages'} of{' '}
                          <Link to={`/books/${book?.id}`} className="text-primary hover:underline">
                            {book?.title || 'Unknown Book'}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                          {' · '}
                          {session.duration} minutes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Button variant="link" asChild>
            <Link to="/sessions">View all reading sessions</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
