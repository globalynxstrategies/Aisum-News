'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized daily AI news digest.
 *
 * - generateDailyDigest - A function that generates the daily digest.
 * - GenerateDailyDigestInput - The input type for the generateDailyDigest function.
 * - GenerateDailyDigestOutput - The return type for the generateDailyDigest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyDigestInputSchema = z.object({
  interests: z
    .array(z.string())
    .describe('A list of AI-related topics the user is interested in.'),
  articleCount: z
    .number()
    .default(5)
    .describe('The number of articles to include in the daily digest.'),
});
export type GenerateDailyDigestInput = z.infer<typeof GenerateDailyDigestInputSchema>;

const GenerateDailyDigestOutputSchema = z.object({
  summary: z.string().describe('A summary of the top AI news articles for the day, tailored to the user\'s interests.'),
  articles: z.array(z.string()).describe('A list of summarized article titles'),
});
export type GenerateDailyDigestOutput = z.infer<typeof GenerateDailyDigestOutputSchema>;

export async function generateDailyDigest(input: GenerateDailyDigestInput): Promise<GenerateDailyDigestOutput> {
  return generateDailyDigestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyDigestPrompt',
  input: {schema: GenerateDailyDigestInputSchema},
  output: {schema: GenerateDailyDigestOutputSchema},
  prompt: `You are an AI news aggregator that provides a daily digest of AI-related news articles.

  The user is interested in the following topics:
  {{#each interests}}
  - {{this}}
  {{/each}}

  Please provide a summary of the top {{articleCount}} articles, and a list of summarized article titles. Focus on delivering the most impactful and relevant information to the user.

  Summary: A concise overview of the main AI news stories, tailored to the user's interests.
  Articles: A bulleted list of the titles of the articles that were summarized.
  `,
});

const generateDailyDigestFlow = ai.defineFlow(
  {
    name: 'generateDailyDigestFlow',
    inputSchema: GenerateDailyDigestInputSchema,
    outputSchema: GenerateDailyDigestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
