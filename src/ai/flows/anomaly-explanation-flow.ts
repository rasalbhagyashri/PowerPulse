'use server';
/**
 * @fileOverview A Genkit flow for generating natural language explanations, potential causes, and recommended actions
 * for power quality anomalies.
 *
 * - anomalyExplanation - A function that handles the anomaly explanation process.
 * - AnomalyExplanationInput - The input type for the anomalyExplanation function.
 * - AnomalyExplanationOutput - The return type for the anomalyExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnomalyExplanationInputSchema = z.object({
  anomalyType: z
    .string()
    .describe('The type of power quality anomaly detected (e.g., "harmonic distortion", "voltage sag").'),
  severity: z
    .string()
    .describe('The severity level of the anomaly (e.g., "low", "medium", "high", "critical").'),
  timestamp: z.string().describe('The timestamp when the anomaly was detected.'),
  details: z
    .string()
    .describe('Specific details about the anomaly (e.g., "Voltage THD reached 15%", "Voltage dropped to 80% of nominal").'),
});
export type AnomalyExplanationInput = z.infer<typeof AnomalyExplanationInputSchema>;

const AnomalyExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear, natural language explanation of the detected power quality anomaly.'),
  potentialCauses: z
    .array(z.string())
    .describe('A list of potential causes for the detected anomaly.'),
  recommendedActions: z
    .array(z.string())
    .describe('A list of recommended actions to address the anomaly.'),
});
export type AnomalyExplanationOutput = z.infer<typeof AnomalyExplanationOutputSchema>;

export async function anomalyExplanation(input: AnomalyExplanationInput): Promise<AnomalyExplanationOutput> {
  return anomalyExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anomalyExplanationPrompt',
  input: {schema: AnomalyExplanationInputSchema},
  output: {schema: AnomalyExplanationOutputSchema},
  prompt: `You are an expert power systems engineer. Your task is to explain power quality anomalies in natural language, 
  identify potential causes, and suggest recommended actions for system operators.

  Anomaly Type: {{{anomalyType}}}
  Severity: {{{severity}}}
  Timestamp: {{{timestamp}}}
  Details: {{{details}}}

  Based on the provided anomaly information, generate:
  1. A concise explanation of the event.
  2. A list of possible causes.
  3. A list of actionable recommendations.
  `,
});

const anomalyExplanationFlow = ai.defineFlow(
  {
    name: 'anomalyExplanationFlow',
    inputSchema: AnomalyExplanationInputSchema,
    outputSchema: AnomalyExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
