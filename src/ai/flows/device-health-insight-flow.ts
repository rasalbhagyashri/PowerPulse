'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating natural language insights
 *               regarding a device's health index, explaining contributing factors, and offering advice.
 *
 * - generateDeviceHealthInsight - A function that triggers the AI to generate the health insight.
 * - DeviceHealthInsightInput - The input type for the generateDeviceHealthInsight function.
 * - DeviceHealthInsightOutput - The return type for the generateDeviceHealthInsight function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DeviceHealthInsightInputSchema = z.object({
  healthIndexValue: z.number().min(0).max(100).describe('The current device health index value (0-100). Lower values indicate better health, higher values indicate worse health.'),
  voltageThd: z.number().min(0).describe('The average Voltage Total Harmonic Distortion (THD) level in percentage.'),
  currentThd: z.number().min(0).describe('The average Current Total Harmonic Distortion (THD) level in percentage.'),
  voltageStabilityDescription: z.string().describe('A descriptive summary of the voltage stability over the monitoring period (e.g., "very stable, minimal fluctuations", "occasional minor sags/swells", "frequent and significant voltage deviations").'),
  faultFrequencyDescription: z.string().describe('A descriptive summary of the fault frequency over the monitoring period (e.g., "no faults detected", "rare minor faults", "frequent transient events", "critical fault occurrences").'),
  loadVariationsDescription: z.string().describe('A descriptive summary of the load variations over the monitoring period (e.g., "consistent and stable load", "moderate and predictable fluctuations", "significant and rapid changes in load demand").')
});

export type DeviceHealthInsightInput = z.infer<typeof DeviceHealthInsightInputSchema>;

const DeviceHealthInsightOutputSchema = z.object({
  insight: z.string().describe('A natural language insight explaining the current device health, its primary contributing factors, and general advice for maintenance or improvement. The insight should be comprehensive and easy to understand.')
});

export type DeviceHealthInsightOutput = z.infer<typeof DeviceHealthInsightOutputSchema>;

const deviceHealthInsightPrompt = ai.definePrompt({
  name: 'deviceHealthInsightPrompt',
  input: { schema: DeviceHealthInsightInputSchema },
  output: { schema: DeviceHealthInsightOutputSchema },
  prompt: `You are an expert power system analyst. Your task is to provide a comprehensive, natural language insight into the current health of an electrical device based on provided parameters.

Based on the Device Health Index and its contributing factors, generate an interpretative natural language insight explaining the current Device Health, detailing the primary factors contributing to its level, and offering general advice for maintaining or improving device health.

Here is the data:
- Device Health Index Value: {{{healthIndexValue}}}
- Average Voltage THD: {{{voltageThd}}}%
- Average Current THD: {{{currentThd}}}%
- Voltage Stability: {{{voltageStabilityDescription}}}
- Fault Frequency: {{{faultFrequencyDescription}}}
- Load Variations: {{{loadVariationsDescription}}}

Interpret the Health Index Value as follows:
- 0-20: Very Low Risk (Excellent Health)
- 21-40: Low Risk (Good Health)
- 41-60: Medium Risk (Moderate Health, watch for trends)
- 61-80: High Risk (Poor Health, requires attention)
- 81-100: Very High Risk (Critical Health, immediate intervention needed)

Structure your response to clearly state the health status, explain the primary reasons for this status by referencing the provided factors, and conclude with actionable general advice. Ensure the language is professional and informative.`
});

const deviceHealthInsightFlow = ai.defineFlow(
  {
    name: 'deviceHealthInsightFlow',
    inputSchema: DeviceHealthInsightInputSchema,
    outputSchema: DeviceHealthInsightOutputSchema
  },
  async (input) => {
    const { output } = await deviceHealthInsightPrompt(input);
    return output!;
  }
);

export async function generateDeviceHealthInsight(input: DeviceHealthInsightInput): Promise<DeviceHealthInsightOutput> {
  return deviceHealthInsightFlow(input);
}
