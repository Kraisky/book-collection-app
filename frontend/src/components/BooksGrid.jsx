import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import BookDetailModal from './BookDetailModal'

export default function BooksGrid() {
  const [selectedBook, setSelectedBook] = useState(null)
  const queryClient = useQueryClient()

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => axios.get('/api/books').then(res => res.data)
  })

  if (isLoading) return <div className="text-center py-8">Loading books...</div>

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {books.map(book => (
          <div 
            key={book.id} 
            onClick={() => setSelectedBook(book)}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                <span className="text-center text-sm p-2">No Cover</span>
              </div>
            )}
            <div className="p-2 bg-white">
              <h3 className="font-semibold text-sm truncate">{book.title}</h3>
              <p className="text-xs text-gray-600 truncate">{book.author}</p>
            </div>
          </div>
        ))}
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
