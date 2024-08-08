"use client"

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  bookName: z.string().min(1, "Book name is required"),
  author: z.string().min(1, "Author name is required"),
});

type FormValues = z.infer<typeof formSchema>;

const BookSummaryForm = () => {
  const router = useRouter();
  const [summary, setSummary] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookName: "",
      author: "",
    },
  });

  const generateSummary = async (bookName: string, author: string) => {
    try {
      const response = await fetch('/api/openai', {  // Correct route to call OpenAI API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookName, author }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
      }
  
      const data = await response.json();
      return data.summary || 'No summary found';
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating the summary.');
      return null;
    }
};

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    const generatedSummary = await generateSummary(values.bookName, values.author);

    if (generatedSummary) {
      setSummary(generatedSummary);
    } else {
      setSummary('No summary was generated.');
    }

    setLoading(false);
  };  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="form-title">Book Summary</h2>

        <FormField
          control={form.control}
          name="bookName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Name</FormLabel>
              <FormControl>
                <Input {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="submit-button capitalize" disabled={loading}>
          {loading ? 'Generating Summary...' : 'Submit'}
        </Button>

        <div className="mt-4">
          <FormLabel>Book Summary</FormLabel>
          <div className="output-box p-2 border rounded h-32 overflow-y-auto">
            {error && <p className="text-red-500">{error}</p>}
            {summary ? summary : 'The summary will appear here after submission.'}
          </div>
        </div>

      </form>
    </Form>
  );
};

export default BookSummaryForm;
