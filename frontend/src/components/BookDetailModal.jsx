import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function BookDetailModal({ book, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(book)
  const [metadataResults, setMetadataResults] = useState([])

  const { mutate: fetchMetadata, isPending: searchPending } = useMutation({
    mutationFn: () => axios.post(`/api/metadata/fetch/${book.id}`),
    onSuccess: (res) => {
      setFormData(res.data)
      onUpdate()
    }
  })

  const { mutate: updateBook, isPending: updatePending } = useMutation({
    mutationFn: (data) => axios.put(`/api/books/${book.id}`, data),
    onSuccess: (res) => {
      setFormData(res.data)
      setIsEditing(false)
      onUpdate()
    }
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    updateBook(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{formData.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="flex gap-4 mb-4">
            {formData.cover_url && (
              <img 
                src={formData.cover_url} 
                alt={formData.title}
                className="h-40 rounded object-cover"
              />
            )}
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    name="author"
                    value={formData.author || ''}
                    onChange={handleChange}
                    placeholder="Author"
                    className="w-full border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn || ''}
                    onChange={handleChange}
                    placeholder="ISBN"
                    className="w-full border rounded px-2 py-1"
                  />
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Description"
                    rows="3"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>Author:</strong> {formData.author || 'N/A'}</p>
                  <p><strong>ISBN:</strong> {formData.isbn || 'N/A'}</p>
                  <p><strong>Published:</strong> {formData.published_date || 'N/A'}</p>
                  <p className="text-sm">{formData.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 border-t pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updatePending}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => fetchMetadata()}
                  disabled={searchPending}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {searchPending ? 'Searching...' : 'Fetch Metadata'}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="ml-auto bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
