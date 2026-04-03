'use server';
/**
 * @fileOverview A Genkit flow to generate a comprehensive, natural language summary
 * of the past 30 days' electrical performance, including trends in THD,
 * total disturbances, and overall device health.
 *
 * - generateMonthlyPerformanceSummary - A function that handles the summary generation process.
 * - MonthlyPerformanceSummaryInput - The input type for the generateMonthlyPerformanceSummary function.
 * - MonthlyPerformanceSummaryOutput - The return type for the generateMonthlyPerformanceSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MonthlyPerformanceSummaryInputSchema = z.object({
  dailyThdValues: z.array(z.number().min(0).max(100)).describe('An array of daily average Total Harmonic Distortion (THD) values over the last 30 days, as percentages.'),
  totalDisturbances: z.number().int().min(0).describe('The total number of power quality disturbances recorded over the last 30 days.'),
  disturbanceDetails: z.string().describe('A detailed string describing the types and frequencies of power quality disturbances (e.g., "5 voltage sags, 2 voltage swells, 1 transient").'),
  dailyHealthIndexValues: z.array(z.number().min(0).max(100)).describe('An array of daily device health index values over the last 30 days, ranging from 0 (very low) to 100 (very high).'),
  voltageStabilityTrend: z.string().describe('A brief description of the trend in voltage stability (e.g., "stable", "slight fluctuations", "deteriorating").'),
  loadVariationTrend: z.string().describe('A brief description of the trend in load variations (e.g., "consistent", "increasing peaks", "sporadic").'),
});
export type MonthlyPerformanceSummaryInput = z.infer<typeof MonthlyPerformanceSummaryInputSchema>;

const MonthlyPerformanceSummaryOutputSchema = z.object({
  summary: z.string().describe('A comprehensive natural language summary of the past 30 days of electrical performance.'),
});
export type MonthlyPerformanceSummaryOutput = z.infer<typeof MonthlyPerformanceSummaryOutputSchema>;

export async function generateMonthlyPerformanceSummary(input: MonthlyPerformanceSummaryInput): Promise<MonthlyPerformanceSummaryOutput> {
  return monthlyPerformanceSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'monthlyPerformanceSummaryPrompt',
  input: { schema: MonthlyPerformanceSummaryInputSchema },
  output: { schema: MonthlyPerformanceSummaryOutputSchema },
  prompt: `You are an AI assistant specialized in analyzing electrical power system data. Your task is to generate a comprehensive, natural language summary of the past 30 days' electrical performance based on the provided data.

Focus on identifying trends, key statistics, and overall device health insights. The summary should be easy to understand for a system operator.

Here is the data for the last 30 days:

Daily Average THD Values (Percentages): {{{dailyThdValues}}}
Total Power Quality Disturbances: {{{totalDisturbances}}}
Details of Disturbances: {{{disturbanceDetails}}}
Daily Device Health Index Values (0-100): {{{dailyHealthIndexValues}}}
Voltage Stability Trend: {{{voltageStabilityTrend}}}
Load Variation Trend: {{{loadVariationTrend}}}

Generate a summary that covers:
1. Overall THD performance and any noticeable trends (e.g., increasing, decreasing, stable, spikes).
2. A breakdown of power quality disturbances, their frequency, and potential impact.
3. The trend and general status of the device health index, relating it to the other parameters.
4. Insights on voltage stability and load variations.
5. Any critical observations or recommendations based on the data.
`,
});

const monthlyPerformanceSummaryFlow = ai.defineFlow(
  {
    name: 'monthlyPerformanceSummaryFlow',
    inputSchema: MonthlyPerformanceSummaryInputSchema,
    outputSchema: MonthlyPerformanceSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
