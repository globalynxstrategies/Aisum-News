"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Sparkles } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  generateDailyDigest,
  type GenerateDailyDigestOutput,
} from "@/ai/flows/generate-daily-digest";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const topics = [
  { id: "machine learning", label: "Machine Learning" },
  { id: "neural networks", label: "Neural Networks" },
  { id: "computer vision", label: "Computer Vision" },
  {
    id: "natural language processing",
    label: "Natural Language Processing (NLP)",
  },
  { id: "robotics", label: "Robotics" },
  { id: "ethical ai", label: "Ethical AI" },
  { id: "generative ai", label: "Generative AI" },
] as const;

const formSchema = z.object({
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one interest.",
  }),
});

export function DailyDigest() {
  const [digest, setDigest] = useState<GenerateDailyDigestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDigest(null);
    try {
      const result = await generateDailyDigest({
        interests: values.interests,
        articleCount: 5,
      });
      setDigest(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate your daily digest. Please try again.",
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
            name="interests"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-lg">Your Interests</FormLabel>
                  <FormDescription>
                    Select the AI topics you're interested in for a personalized
                    news digest.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-base">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Sparkles className="mr-2 h-4 w-4" />
            Generate My Digest
          </Button>
        </form>
      </Form>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      )}

      {digest && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-primary">
              Your Personalized Daily Digest
            </CardTitle>
            <CardDescription>
              Here are the top stories based on your interests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-2">
              Top Stories Summary
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed mb-6">
              {digest.summary}
            </p>

            <h3 className="font-semibold text-lg mb-2">
              Summarized Articles
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {digest.articles.map((article, index) => (
                <li key={index}>{article}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
