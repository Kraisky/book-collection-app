import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import BooksGrid from './components/BooksGrid'
import BooksList from './components/BooksList'
import './App.css'

const queryClient = new QueryClient()

export default function App() {
  const [viewMode, setViewMode] = useState('grid')

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            List View
          </button>
        </div>
        
        {viewMode === 'grid' ? <BooksGrid /> : <BooksList />}
      </Layout>
    </QueryClientProvider>
  )
}
