// File: /pages/add/summaries/book.tsx

import BookSummaryForm from '@/components/shared/BookSummaryForm'

export default function AddBookSummaryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Summary</h1>
      <BookSummaryForm />
    </div>
  )
}