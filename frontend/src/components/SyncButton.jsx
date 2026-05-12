import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export default function SyncButton() {
  const [message, setMessage] = useState('')
  const queryClient = useQueryClient()

  const { mutate: syncBooks, isPending } = useMutation({
    mutationFn: () => axios.post('/api/sync/scan'),
    onSuccess: (data) => {
      setMessage(`✓ Found ${data.data.foundBooks} books, added ${data.data.addedBooks}`)
      queryClient.invalidateQueries({ queryKey: ['books'] })
      setTimeout(() => setMessage(''), 3000)
    },
    onError: (error) => {
      setMessage(`✗ Error: ${error.response?.data?.error || error.message}`)
      setTimeout(() => setMessage(''), 3000)
    }
  })

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => syncBooks()}
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? 'Syncing...' : '🔄 Sync from SMB'}
      </button>
      {message && <span className="text-sm">{message}</span>}
    </div>
  )
}
