
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReading } from "@/context/ReadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BookText, Clock, Target } from "lucide-react";

const AddGoal = () => {
  const navigate = useNavigate();
  const { addGoal } = useReading();
  
  const [type, setType] = useState<"pages" | "books" | "time">("pages");
  const [target, setTarget] = useState("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("monthly");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!type || !target || !period || !startDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (parseInt(target) <= 0) {
      alert("Target must be greater than 0");
      return;
    }
    
    if (period === "custom" && !endDate) {
      alert("Please select an end date for your custom period");
      return;
    }
    
    addGoal({
      type,
      target: parseInt(target),
      period,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      completed: false,
    });
    
    navigate("/goals");
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-book-200">
        <CardHeader>
          <CardTitle className="text-2xl text-book-800">Set Reading Goal</CardTitle>
          <CardDescription>
            Set a reading goal to help track your progress
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Goal Type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant={type === "pages" ? "default" : "outline"}
                  className="justify-start gap-2 h-auto py-3"
                  onClick={() => setType("pages")}
                >
                  <BookText className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium block">Pages</span>
                    <span className="text-xs opacity-80">Number of pages read</span>
                  </div>
                </Button>
                
                <Button
                  type="button"
                  variant={type === "books" ? "default" : "outline"}
                  className="justify-start gap-2 h-auto py-3"
                  onClick={() => setType("books")}
                >
                  <BookText className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium block">Books</span>
                    <span className="text-xs opacity-80">Number of books completed</span>
                  </div>
                </Button>
                
                <Button
                  type="button"
                  variant={type === "time" ? "default" : "outline"}
                  className="justify-start gap-2 h-auto py-3"
                  onClick={() => setType("time")}
                >
                  <Clock className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium block">Reading Time</span>
                    <span className="text-xs opacity-80">Minutes spent reading</span>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target {type === "pages" ? "Pages" : type === "books" ? "Books" : "Minutes"}*</Label>
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-book-500" />
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={`Enter target ${type}`}
                  required
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {type === "pages" && "Number of pages you want to read"}
                {type === "books" && "Number of books you want to complete"}
                {type === "time" && "Number of minutes you want to spend reading"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Time Period*</Label>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often do you want to achieve this goal?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date*</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              {period === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date*</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    required={period === "custom"}
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Set Goal</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddGoal;
