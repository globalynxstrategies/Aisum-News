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

const getArticleContentFlow = ai.defineFlow(
  {
    name: 'getArticleContentFlow',
    inputSchema: GetArticleContentInputSchema,
    outputSchema: GetArticleContentOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      tools: [ai.tool.googleSearch()],
      prompt: `Extract the main text content from the following URL, removing all boilerplate like headers, footers, ads, and navigation.

  URL:
  ${input.url}`,
    });
    const articleContent = output as string;
    return {articleContent};
  }
);
