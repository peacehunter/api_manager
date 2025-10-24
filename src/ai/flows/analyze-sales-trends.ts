'use server';

/**
 * @fileOverview An AI agent for analyzing sales trends.
 *
 * - analyzeSalesTrends - A function that analyzes sales trends and provides insights.
 * - AnalyzeSalesTrendsInput - The input type for the analyzeSalesTrends function.
 * - AnalyzeSalesTrendsOutput - The return type for the analyzeSalesTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSalesTrendsInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'A string containing sales data, where each line represents a sale record with item name and quantity sold.  Example: ItemA:10, ItemB:5, ItemA:3'
    ),
});
export type AnalyzeSalesTrendsInput = z.infer<typeof AnalyzeSalesTrendsInputSchema>;

const AnalyzeSalesTrendsOutputSchema = z.object({
  trendsAnalysis: z
    .string()
    .describe('A detailed analysis of the sales trends, including popular items, sales patterns, and potential opportunities for promotions or restocking.'),
  suggestedActions: z
    .string()
    .describe('Specific actions the shopkeeper should consider based on the trends analysis, such as restocking recommendations or promotion ideas.'),
});
export type AnalyzeSalesTrendsOutput = z.infer<typeof AnalyzeSalesTrendsOutputSchema>;

export async function analyzeSalesTrends(input: AnalyzeSalesTrendsInput): Promise<AnalyzeSalesTrendsOutput> {
  return analyzeSalesTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSalesTrendsPrompt',
  input: {schema: AnalyzeSalesTrendsInputSchema},
  output: {schema: AnalyzeSalesTrendsOutputSchema},
  prompt: `You are an expert sales analyst for small shopkeepers.

  Analyze the following sales data to identify key trends and suggest actionable strategies for the shopkeeper.

  Sales Data:
  {{salesData}}

  Based on this data, provide a trends analysis and suggest specific actions regarding restocking, promotions, or other business strategies.

  Make sure to provide a detailed trendsAnalysis and specific suggestedActions for the shopkeeper.
  `,
});

const analyzeSalesTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeSalesTrendsFlow',
    inputSchema: AnalyzeSalesTrendsInputSchema,
    outputSchema: AnalyzeSalesTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
