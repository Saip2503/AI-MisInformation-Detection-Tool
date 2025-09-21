import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";

// This interface defines the structure of each history item
interface HistoryItem {
  id: number;
  text: string;
  verdict: string;
  credibilityScore: number;
  evidence: any[];
  timestamp: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  // Load history from localStorage when the component mounts
  useEffect(() => {
    const savedHistory = localStorage.getItem('analysisHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Function to clear the entire history
  const clearHistory = () => {
    localStorage.removeItem('analysisHistory');
    setHistory([]);
  };

  // Function to handle clicking on a past analysis item
  const viewHistoryItem = (item: HistoryItem) => {
    // Set the selected item as the "current" analysis in session storage
    sessionStorage.setItem('currentAnalysis', JSON.stringify(item));
    // Navigate to the analysis page to view the details
    navigate('/analysis');
  };

  // Helper function to format the timestamp into a "time ago" string
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} d ago`;
  };

  // Helper function to determine the color of the credibility badge
  const getCredibilityColor = (score: number) => {
    if (score >= 70) return "bg-success";
    if (score >= 40) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analyser
            </Link>
          </Button>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Analysis History</h1>
            {history.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearHistory}
                className="ml-4"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {history.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No analysis history yet.</p>
                <Button asChild className="mt-4">
                  <Link to="/">Start Analyzing</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => viewHistoryItem(item)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-md transition-shadow hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-2">
                          {item.text.substring(0, 80) + (item.text.length > 80 ? '...' : '')}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <Badge 
                            className={`${getCredibilityColor(item.credibilityScore)} text-white`}
                          >
                            {item.credibilityScore}% credible
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTimeAgo(item.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;