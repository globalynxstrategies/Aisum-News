import { Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleSummarizer } from "@/components/article-summarizer";
import { DailyDigest } from "@/components/daily-digest";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-2">
          <Bot className="w-12 h-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Aisum News
          </h1>
        </div>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Your personal AI-powered news summarizer and digester. Get the
          essence of AI news, fast.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="summarize" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summarize">Summarize Article</TabsTrigger>
            <TabsTrigger value="digest">Daily Digest</TabsTrigger>
          </TabsList>
          <TabsContent value="summarize" className="mt-6">
            <ArticleSummarizer />
          </TabsContent>
          <TabsContent value="digest" className="mt-6">
            <DailyDigest />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
