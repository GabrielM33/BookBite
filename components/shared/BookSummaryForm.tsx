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

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>;

const BookSummaryForm = () => {
  const router = useRouter();
  const [summary, setSummary] = useState(''); // State to hold the generated summary
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookName: "",
      author: "",
    },
  });

  const generateSummary = async (bookName: string, author: string) => {
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookName, author }),
      });
  
      const text = await response.text(); // Get raw text response first
      console.log('Raw response:', text); // Log the raw response
  
      const data = JSON.parse(text); // Then try to parse it as JSON
  
      return data.summary;
    } catch (error) {
      console.error('Error:', error);
      return 'An error occurred while generating the summary.';
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    console.log('Submitting form with values:', values);
  
    const generatedSummary = await generateSummary(values.bookName, values.author);
    
    if (generatedSummary) {
      console.log('Generated Summary:', generatedSummary);
      setSummary(generatedSummary);
    } else {
      console.error('No summary was generated.');
      setSummary('No summary was generated.');
    }
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
