'use server';

/**
 * @fileOverview An AI agent for extracting the main content of a news article from a URL.
 *
 * - getArticleContent - A function that extracts article content from a URL.
 * - GetArticleContentInput - The input type for the getArticleContent function.
 * - GetArticleContentOutput - The return type for the getArticleContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetArticleContentInputSchema = z.object({
  url: z.string().url().describe('The URL of the article to fetch.'),
});
export type GetArticleContentInput = z.infer<
  typeof GetArticleContentInputSchema
>;

const GetArticleContentOutputSchema = z.object({
  articleContent: z.string().describe('The main content of the article.'),
});
export type GetArticleContentOutput = z.infer<
  typeof GetArticleContentOutputSchema
>;

export async function getArticleContent(
  input: GetArticleContentInput
): Promise<GetArticleContentOutput> {
  return getArticleContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getArticleContentPrompt',
  input: {schema: z.object({articleHtml: z.string()})},
  output: {schema: GetArticleContentOutputSchema},
  prompt: `You are an expert at extracting the main article content from a web page's HTML.
  Extract the main text content from the following HTML, removing all boilerplate like headers, footers, ads, and navigation.

  HTML:
  {{{articleHtml}}}`,
});

const getArticleContentFlow = ai.defineFlow(
  {
    name: 'getArticleContentFlow',
    inputSchema: GetArticleContentInputSchema,
    outputSchema: GetArticleContentOutputSchema,
  },
  async input => {
    const response = await fetch(input.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch article from ${input.url}`);
    }
    const articleHtml = await response.text();

    const {output} = await prompt({articleHtml});
    return output!;
  }
);
