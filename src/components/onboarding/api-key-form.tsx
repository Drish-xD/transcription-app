"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { saveApiKey } from "./actions";

const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, "API key is required")
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid API key format"),
});

type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

interface ApiKeyFormProps {
  userId: string;
}

export function ApiKeyForm({ userId }: ApiKeyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: "",
    },
  });

  async function onSubmit(data: ApiKeyFormValues) {
    setIsLoading(true);
    
    try {
      await saveApiKey({
        userId,
        apiKey: data.apiKey,
      });
      
      toast.success("API key saved successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to save API key:", error);
      toast.error("Failed to save API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gemini API Key</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your Gemini API key" 
                  {...field} 
                  type="password"
                />
              </FormControl>
              <FormDescription>
                Enter your Gemini API key to enable transcription capabilities.
                You can get your API key from the{" "}
                <a
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Google AI Studio
                </a>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save API Key & Continue"}
        </Button>
      </form>
    </Form>
  );
} 