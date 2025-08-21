import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-article.ts';
import '@/ai/flows/generate-daily-digest.ts';
import '@/ai/flows/get-article-content.ts';
