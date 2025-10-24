'use client';

import { useState } from 'react';
import { BrainCircuit, Lightbulb, Package, Wand2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTrendsAnalysisAction } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyzeSalesTrendsOutput } from '@/ai/flows/analyze-sales-trends';

type AnalysisState = AnalyzeSalesTrendsOutput | { error: string } | null;

function AnalysisSkeleton() {
    return (
        <div className="space-y-6">
            <div className='space-y-2'>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className='space-y-2'>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    )
}

export function TrendsAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisState>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    const result = await generateTrendsAnalysisAction();
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            AI-Powered Trends Analysis
        </CardTitle>
        <CardDescription>
          Use AI to analyze your sales data and get actionable insights for your business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && !isLoading && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Ready for some magic?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Click the button to let our AI analyze your sales trends.
            </p>
            <Button onClick={handleAnalysis} className="mt-6">Generate Analysis</Button>
          </div>
        )}
        
        {isLoading && <AnalysisSkeleton />}
        
        {analysis && 'trendsAnalysis' in analysis && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-accent" />
                        Trends Analysis
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{analysis.trendsAnalysis}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-accent" />
                        Suggested Actions
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{analysis.suggestedActions}</p>
                </div>
                <Button onClick={handleAnalysis} variant="outline" className="mt-4">
                    Re-generate Analysis
                </Button>
            </div>
        )}

        {analysis && 'error' in analysis && (
            <div className="text-center py-10 text-destructive">
                <p>{analysis.error}</p>
                <Button onClick={handleAnalysis} variant="secondary" className="mt-4">Try Again</Button>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
