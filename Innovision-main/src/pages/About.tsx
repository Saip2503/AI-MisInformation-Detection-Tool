import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Users, Target } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              About INNOVISION
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fighting misinformation with cutting-edge AI technology to promote 
              truth and transparency in digital information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower individuals and organizations with AI-driven tools 
                  that detect misinformation, verify content credibility, and 
                  promote informed decision-making in our digital age.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our advanced AI models analyze text using natural language processing,
                  cross-reference multiple sources, and provide credibility scores 
                  with detailed explanations and supporting evidence.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built on transformer models, ensemble learning, and explainable AI 
                  techniques to ensure accurate, fast, and transparent misinformation 
                  detection with detailed reasoning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Who We Serve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Journalists, researchers, educators, fact-checkers, and curious 
                  individuals who want to verify information credibility before 
                  sharing or making decisions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-bold text-center mb-6">
              The Misinformation Challenge
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">73%</div>
                <p className="text-sm text-muted-foreground">
                  of Americans encounter misinformation weekly
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">6x</div>
                <p className="text-sm text-muted-foreground">
                  faster spread of false news vs. true stories
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">2.3B</div>
                <p className="text-sm text-muted-foreground">
                  people affected by misinformation globally
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;