import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import CredibilityCircle from "@/components/CredibilityCircle";

interface AnalysisData {
  text: string;
  credibilityScore: number;
  concerningTerms: string[];
  supportingTerms: string[];
  references: string[];
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
      navigate('/');
    }
  }, [navigate]);

  if (!analysisData) {
    return <Layout><div>Loading...</div></Layout>;
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
              <div className="mb-6">
                <CredibilityCircle percentage={analysisData.credibilityScore} />
              </div>
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

            {/* Key Terms Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Terms Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-destructive mb-2">Concerning Terms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.concerningTerms.map((term, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-success mb-2">Supporting Terms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.supportingTerms.map((term, index) => (
                      <Badge key={index} className="bg-success text-success-foreground text-xs">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fact-Check References */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fact-Check References</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisData.references.map((reference, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">
                      Reference {index + 1}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={reference} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;