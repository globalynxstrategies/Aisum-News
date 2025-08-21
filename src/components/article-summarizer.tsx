"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  summarizeArticle,
  type SummarizeArticleOutput,
} from "@/ai/flows/summarize-article";
import { getArticleContent } from "@/ai/flows/get-article-content";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  articleUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  articleContent: z.string().min(100, {
    message: "Article content must be at least 100 characters.",
  }),
});

export function ArticleSummarizer() {
  const [summary, setSummary] = useState<SummarizeArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleUrl: "",
      articleContent: "",
    },
  });

  const handleFetchArticle = async () => {
    const url = form.getValues("articleUrl");
    if (!url) {
      form.setError("articleUrl", {
        type: "manual",
        message: "Please enter a URL to fetch.",
      });
      return;
    }
    // Clear previous error
    form.clearErrors("articleUrl");

    setIsFetching(true);
    try {
      const result = await getArticleContent({ url });
      form.setValue("articleContent", result.articleContent, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch the article content. Please try again or paste the content manually.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeArticle(values);
      setSummary(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to summarize the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="articleUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Article URL</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input placeholder="https://example.com/article" {...field} />
                  </FormControl>
                  <Button type="button" onClick={handleFetchArticle} disabled={isFetching || !field.value} className="w-40">
                    {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Fetch Article
                  </Button>
                </div>
                <FormDescription>
                  Enter a URL and click "Fetch Article" to automatically load the content.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="articleContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Article Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the full content of the news article here, or fetch it from a URL above."
                    className="min-h-[200px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The content to be summarized will appear here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading || isFetching} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Summarize Article
          </Button>
        </form>
      </Form>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-primary">AI-Generated Summary</CardTitle>
            {form.getValues("articleUrl") && (
              <CardDescription>
                <Link
                  href={form.getValues("articleUrl")!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-foreground/80 hover:text-accent-foreground underline"
                >
                  View Original Article
                </Link>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed">
              {summary.summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
