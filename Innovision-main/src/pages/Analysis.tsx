import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Twitter } from "lucide-react";
import Layout from "@/components/Layout";
import CredibilityCircle from "@/components/CredibilityCircle";

// New interface for individual evidence items
interface EvidenceItem {
  type: string;
  source: string | null;
  title: string | null;
  url: string | null;
  text: string;
  sim: number;
}

// Updated interface to match the data structure from Home.tsx
interface AnalysisData {
  text: string;
  verdict: string;
  credibilityScore: number;
  evidence: EvidenceItem[];
  timestamp: string;
}

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('currentAnalysis');
    if (data) {
      setAnalysisData(JSON.parse(data));
    } else {
      // If no data, redirect to the home page to start a new analysis
      navigate('/');
    }
  }, [navigate]);

  if (!analysisData) {
    return <Layout><div>Loading analysis...</div></Layout>;
  }

  const getCredibilityDescription = (score: number) => {
    if (score >= 70) return "This content has high credibility with strong verification and reliable sources.";
    if (score >= 40) return "This content has moderate credibility but may lack some verification or contain subjective elements.";
    return "This content has low credibility and may contain misinformation or unverified claims.";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Analyse New Text
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Credibility Assessment */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Credibility Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <CredibilityCircle percentage={analysisData.credibilityScore} />
              </div>
              {/* Display the API's verdict */}
              <h3 className="text-2xl font-bold mb-4">{analysisData.verdict}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getCredibilityDescription(analysisData.credibilityScore)}
              </p>
            </CardContent>
          </Card>

          {/* Main Analysis Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analyzed Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyzed Text</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{analysisData.text}</p>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisData.evidence.length > 0 ? (
                  analysisData.evidence.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {item.type === 'tweet' && <Twitter className="w-4 h-4 text-sky-500" />}
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.type || 'Source'}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          Similarity: {Math.round(item.sim * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-3">{item.text}</p>
                      {item.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs">
                            View Source <ExternalLink className="w-3 h-3 ml-2" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No evidence was found for this analysis.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;