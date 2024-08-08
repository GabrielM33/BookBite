"use client"

import React from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// If Textarea component doesn't exist, you can use Input instead
// import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  bookName: z.string().min(1, "Book name is required"),
  author: z.string().min(1, "Author name is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters long"),
})

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>;

const BookSummaryForm = () => {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookName: "",
      author: "",
      summary: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    // Here you would typically send the data to your backend
    console.log(values)
    // After successful submission, redirect to a confirmation page
    router.push('/summaries')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="bookName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the book name" {...field} className="input-field" />
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
                <Input placeholder="Enter the author's name" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Summary</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter the book summary" 
                  className="input-field h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="submit-button capitalize">Create Summary</Button>
      </form>
    </Form>
  )
}

export default BookSummaryForm