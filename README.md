# 📚 Book Collection Manager

A full-stack web application for managing and displaying your book collection with automatic metadata lookup and Synology SMB integration.

## Features ✨

- **Grid & List Views**: Display books like Calibre with cover images or detailed table view
- **SMB Share Integration**: Connect to Synology NAS or any SMB share to scan and import books
- **Automatic Metadata Lookup**: Fetch book information from Google Books and Open Library APIs
- **Metadata Management**: View and edit book details (title, author, ISBN, cover, description)
- **Web-Based UI**: Responsive interface accessible from any browser
- **Docker Ready**: One-command deployment with Docker Compose

## Quick Start 🚀

### Prerequisites

- Docker & Docker Compose (or Node.js 20+ for local development)

### With Docker Compose

```bash
# Clone or download this repository
cd book-collection-app

# Build and run the app
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/api
```

The app will start and you can access it immediately on http://localhost:3000

### First-Time Setup

1. Open http://localhost:3000 in your browser
2. Click **Settings** button
3. Enter your SMB share details:
   - **Share Path**: `\\nas-ip-address\ShareName` (e.g., `\\192.168.1.100\Boeken`)
   - **Username**: Your Synology username
   - **Password**: Your Synology password
4. Click **Save**
5. Click **🔄 Sync from SMB** to scan your book folder

## Usage 📖

### Viewing Books

- **Grid View**: Click the "Grid View" button to see book covers (like Calibre)
- **List View**: Click the "List View" button for a detailed table with sortable columns
- **Toggle**: Switch between views with the view toggle buttons

### Managing Metadata

1. Click on any book to open the detail modal
2. Click **"Fetch Metadata"** to automatically download book info from APIs
3. Click **"Edit"** to manually update title, author, ISBN, or description
4. Changes are saved immediately

### Scanning & Importing

- Click **"🔄 Sync from SMB"** button to scan your Synology share
- New books are automatically detected and added to the library
- Metadata fetching happens on-demand when you click "Fetch Metadata"

## Architecture 🏗️

```
Book Collection Manager
├── Frontend (React + Vite + TailwindCSS)
│   ├── Grid view with book covers
│   ├── List view with metadata table
│   ├── Book detail modal with metadata lookup
│   └── Settings modal for SMB configuration
├── Backend (Node.js + Express + SQLite)
│   ├── REST API for books and metadata
│   ├── SMB client for Synology integration
│   ├── Metadata services (Google Books, Open Library)
│   └── SQLite database (persistent in /data)
└── Docker Compose (production deployment)
```

## API Endpoints 🔌

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Configuration

- `GET /api/config` - Get SMB configuration
- `POST /api/config` - Save SMB configuration

### Metadata

- `POST /api/metadata/search` - Search metadata (title, author)
- `POST /api/metadata/fetch/:bookId` - Fetch and auto-update metadata

### Sync

- `POST /api/sync/scan` - Scan SMB share and import books

## Local Development 💻

### Backend

```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

Both services will be running and the frontend will proxy API requests to the backend.

## Configuration

### SMB/Synology

In the Settings modal, configure:
- **Share Path**: Format `\\hostname\ShareName` or `\\IP\ShareName`
- **Username**: Synology user account
- **Password**: Account password

Supported book formats: `.pdf`, `.epub`, `.mobi`, `.azw`, `.azw3`

### Metadata APIs

The app uses free APIs:
- **Google Books API**: No key required (limited requests)
- **Open Library API**: Free and open source

For large imports, consider adding your own Google Books API key in `.env`.

## Troubleshooting 🔧

### Connection Failed
- Verify SMB share path format: `\\192.168.1.100\Boeken`
- Check username and password are correct
- Ensure your NAS is accessible from Docker network
- For Docker on macOS/Windows, check DNS resolution

### No Books Found
- Make sure book files are in subdirectories of the share
- Check file extensions (.pdf, .epub, .mobi, .azw, .azw3)
- Click "Sync from SMB" button to re-scan

### Metadata Not Showing
- Some books may not have metadata available
- Try searching manually with different book title/author
- Click "Edit" to manually add metadata

## File Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express app
│   │   ├── db/database.js           # SQLite setup
│   │   ├── routes/
│   │   │   ├── books.js            # Book CRUD
│   │   │   ├── config.js           # SMB config
│   │   │   ├── metadata.js         # Metadata API
│   │   │   └── sync.js             # SMB scanning
│   │   └── services/
│   │       ├── smb.js              # SMB client
│   │       └── metadata.js         # Metadata lookup
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── BooksGrid.jsx
│   │   │   ├── BooksList.jsx
│   │   │   ├── BookDetailModal.jsx
│   │   │   ├── SettingsModal.jsx
│   │   │   └── SyncButton.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml              # Production deployment
├── README.md
└── DEVELOPMENT.md
```

## Technologies Used 🛠️

- **Frontend**: React 18, Vite, TailwindCSS, React Query
- **Backend**: Node.js, Express, SQLite3
- **SMB Client**: smbhclient
- **Metadata**: Google Books API, Open Library API
- **Container**: Docker, Docker Compose

## Performance Notes ⚡

- First sync may take time depending on book folder size
- Metadata lookup is cached per book
- SQLite provides fast local queries
- Responsive design works on desktop and mobile browsers

## Future Enhancements 🚀

- [ ] Batch metadata import with progress bar
- [ ] Search and advanced filtering
- [ ] Book rating and tagging system
- [ ] Export to CSV/Excel
- [ ] Mobile app (React Native)
- [ ] LDAP authentication
- [ ] Multiple SMB share support

## License 📄

MIT - Feel free to use this project for any purpose.

## Support 💬

For issues or questions, check the DEVELOPMENT.md file for setup help.

