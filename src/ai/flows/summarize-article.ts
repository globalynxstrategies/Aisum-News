'use server';

/**
 * @fileOverview An AI agent for summarizing news articles related to AI.
 *
 * - summarizeArticle - A function that summarizes an article.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to be summarized.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `You are an AI news summarizer. Summarize the following article, focusing on the key points and main ideas.\n\nArticle: {{{articleContent}}}`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
