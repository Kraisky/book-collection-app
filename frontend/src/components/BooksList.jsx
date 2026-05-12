import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import BookDetailModal from './BookDetailModal'

export default function BooksList() {
  const [selectedBook, setSelectedBook] = useState(null)
  const queryClient = useQueryClient()

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => axios.get('/api/books').then(res => res.data)
  })

  if (isLoading) return <div className="text-center py-8">Loading books...</div>

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Author</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">ISBN</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Published</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr 
                key={book.id} 
                onClick={() => setSelectedBook(book)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-3">{book.title}</td>
                <td className="px-6 py-3">{book.author}</td>
                <td className="px-6 py-3 text-sm">{book.isbn}</td>
                <td className="px-6 py-3 text-sm">{book.published_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['books'] })}
        />
      )}
    </>
  )
}
