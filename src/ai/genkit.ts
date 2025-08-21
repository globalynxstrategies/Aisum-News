import {genkit} from 'genkit';
import {googleAI, vertexAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI({
      location: 'us-central1',
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
