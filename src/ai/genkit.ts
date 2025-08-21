import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // location: 'us-central1', // Optional: specify location for Vertex AI
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
