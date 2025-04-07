
import { useReading } from "@/context/ReadingContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BookOpen, Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";

const Statistics = () => {
  const { books, sessions, stats } = useReading();
  
  // Calculate reading stats for the past 30 days
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 29);
  
  const last30DaysData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const dateString = format(date, "yyyy-MM-dd");
    
    // Get all sessions for this day
    const daySessions = sessions.filter(s => 
      s.date.split("T")[0] === dateString
    );
    
    // Calculate total pages and minutes for the day
    const pagesRead = daySessions.reduce(
      (sum, session) => sum + (session.endPage - session.startPage), 
      0
    );
    
    const minutesRead = daySessions.reduce(
      (sum, session) => sum + session.duration, 
      0
    );
    
    return {
      date: format(date, "MMM d"),
      fullDate: dateString,
      pagesRead,
      minutesRead,
      hasActivity: pagesRead > 0,
    };
  });
  
  // Calculate monthly stats
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const monthlyReadingDays = daysInMonth.filter(day => {
    const dateString = format(day, "yyyy-MM-dd");
    return sessions.some(s => s.date.split("T")[0] === dateString);
  }).length;
  
  const monthlyReadingRate = Math.round((monthlyReadingDays / daysInMonth.length) * 100);
  
  // Count books by status
  const booksStatusCount = books.reduce(
    (counts, book) => {
      counts[book.status] = (counts[book.status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );
  
  // Reading speed over time
  const weeklyReadingData = [];
  const readingSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  if (readingSessions.length > 0) {
    // Group by week
    const sessionsByWeek: Record<string, { totalPages: number, totalMinutes: number }> = {};
    
    readingSessions.forEach(session => {
      const date = new Date(session.date);
      const weekStart = format(date, "yyyy-'W'ww");
      const pagesRead = session.endPage - session.startPage;
      
      if (!sessionsByWeek[weekStart]) {
        sessionsByWeek[weekStart] = { totalPages: 0, totalMinutes: 0 };
      }
      
      sessionsByWeek[weekStart].totalPages += pagesRead;
      sessionsByWeek[weekStart].totalMinutes += session.duration;
    });
    
    Object.entries(sessionsByWeek).forEach(([week, data]) => {
      const pagesPerHour = data.totalMinutes > 0 
        ? Math.round((data.totalPages / data.totalMinutes) * 60) 
        : 0;
        
      weeklyReadingData.push({
        week,
        pagesPerHour,
      });
    });
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          {payload[0].name === "pagesRead" && (
            <p className="text-book-600">
              Pages: {payload[0].value}
            </p>
          )}
          {payload[0].name === "pagesPerHour" && (
            <p className="text-book-600">
              Speed: {payload[0].value} pages/hour
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-book-800">Reading Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <div className="text-xs text-muted-foreground space-y-1 mt-1">
              <div className="flex justify-between">
                <span>Reading:</span>
                <span>{booksStatusCount.reading || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>{booksStatusCount.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>To Read:</span>
                <span>{booksStatusCount["to-read"] || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>On Hold:</span>
                <span>{booksStatusCount["on-hold"] || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reading Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            <div className="text-xs text-muted-foreground space-y-1 mt-1">
              <div className="flex justify-between">
                <span>Longest Streak:</span>
                <span>{stats.longestStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Rate This Month:</span>
                <span>{monthlyReadingRate}%</span>
              </div>
            </div>
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
            <div className="text-2xl font-bold">
              {Math.floor(stats.totalReadingTime / 60)} hrs {stats.totalReadingTime % 60} min
            </div>
            <div className="text-xs text-muted-foreground space-y-1 mt-1">
              <div className="flex justify-between">
                <span>Avg. Daily Reading:</span>
                <span>
                  {Math.floor(stats.averageReadingTimePerDay / 60)}h {stats.averageReadingTimePerDay % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Sessions:</span>
                <span>{sessions.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Reading Activity (Last 30 Days)</CardTitle>
            <CardDescription>Pages read per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last30DaysData}>
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="pagesRead" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Reading Speed Trend</CardTitle>
            <CardDescription>Pages per hour over time</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyReadingData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyReadingData}>
                    <XAxis 
                      dataKey="week" 
                      tickLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tickLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="pagesPerHour" 
                      name="pagesPerHour"
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-10 w-10 mx-auto" />
                  <p className="mt-2">Not enough data to show trend</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Reading Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Total Pages Read</h3>
                <p className="text-2xl font-bold">{stats.totalPagesRead}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Books Completed</h3>
                <p className="text-2xl font-bold">{stats.totalBooksRead}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">Avg. Reading Speed</h3>
                <p className="text-2xl font-bold">
                  {stats.totalReadingTime > 0 
                    ? `${Math.round((stats.totalPagesRead / stats.totalReadingTime) * 60)} pgs/hr` 
                    : "N/A"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Avg. Session Length</h3>
                <p className="text-2xl font-bold">
                  {sessions.length > 0 
                    ? `${Math.round(stats.totalReadingTime / sessions.length)} min` 
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
