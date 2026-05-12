export default function Navigation({ onSettingsClick }) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📚 Book Collection</h1>
        <button
          onClick={onSettingsClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Settings
        </button>
      </div>
    </nav>
  )
}
