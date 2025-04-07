
import { Link } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { BookText, CheckCircle, Clock, MoreHorizontal, Plus, Target, Trash } from "lucide-react";
import { ReadingGoal } from "@/types";

const Goals = () => {
  const { goals, stats, updateGoal, deleteGoal } = useReading();
  
  // Sort goals: active first, then sort by type
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.type.localeCompare(b.type);
  });
  
  // Calculate progress for each goal
  const calculateProgress = (goal: ReadingGoal) => {
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
    
    return { progress, currentValue };
  };
  
  const getGoalDescription = (goal: ReadingGoal) => {
    let timeframe = "";
    
    switch (goal.period) {
      case "daily":
        timeframe = "day";
        break;
      case "weekly":
        timeframe = "week";
        break;
      case "monthly":
        timeframe = "month";
        break;
      case "yearly":
        timeframe = "year";
        break;
      case "custom":
        if (goal.endDate) {
          timeframe = `by ${format(new Date(goal.endDate), "MMM d, yyyy")}`;
        } else {
          timeframe = "custom period";
        }
        break;
    }
    
    let target = "";
    switch (goal.type) {
      case "pages":
        target = `${goal.target} pages`;
        break;
      case "books":
        target = `${goal.target} book${goal.target !== 1 ? 's' : ''}`;
        break;
      case "time":
        target = `${goal.target} minutes`;
        break;
    }
    
    return `Read ${target} per ${timeframe}`;
  };
  
  const markGoalComplete = (goal: ReadingGoal) => {
    updateGoal({
      ...goal,
      completed: true
    });
  };
  
  const markGoalIncomplete = (goal: ReadingGoal) => {
    updateGoal({
      ...goal,
      completed: false
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-book-800">Reading Goals</h1>
        <Button asChild>
          <Link to="/goals/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Link>
        </Button>
      </div>
      
      {sortedGoals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedGoals.map(goal => {
            const { progress, currentValue } = calculateProgress(goal);
            
            return (
              <Card key={goal.id} className={goal.completed ? "border-green-200 bg-green-50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center text-lg font-medium">
                      {goal.type === "pages" && <BookText className="h-5 w-5 mr-2 text-book-500" />}
                      {goal.type === "books" && <BookText className="h-5 w-5 mr-2 text-book-500" />}
                      {goal.type === "time" && <Clock className="h-5 w-5 mr-2 text-book-500" />}
                      {goal.type === "pages" && "Pages Goal"}
                      {goal.type === "books" && "Books Goal"}
                      {goal.type === "time" && "Reading Time Goal"}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {goal.completed ? (
                          <DropdownMenuItem onClick={() => markGoalIncomplete(goal)}>
                            Mark as Incomplete
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => markGoalComplete(goal)}>
                            Mark as Complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Goal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{getGoalDescription(goal)}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      {currentValue} / {goal.target} {goal.type === "time" ? "min" : goal.type}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
                
                <CardFooter className="pt-2 text-sm flex items-center">
                  {goal.completed ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Started {format(new Date(goal.startDate), "MMM d, yyyy")}
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-3 font-medium text-lg">No reading goals yet</h3>
            <p className="text-muted-foreground">
              Set reading goals to help track your progress
            </p>
            <Button className="mt-4" asChild>
              <Link to="/goals/add">Set Your First Goal</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Goals;
