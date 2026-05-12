import express from 'express';
import { connectToSMB, scanBooksFolder, disconnectSMB } from '../services/smb.js';
import { getDB } from '../db/database.js';

const router = express.Router();

// Scan SMB share and import books
router.post('/scan', async (req, res) => {
  const db = getDB();
  
  try {
    const config = db.prepare('SELECT * FROM synology_config LIMIT 1').get();
    
    if (!config) {
      return res.status(400).json({ error: 'SMB config not set' });
    }

    // Connect to SMB
    const connected = await connectToSMB(config.share_path, config.username, config.password);
    if (!connected) {
      return res.status(500).json({ error: 'Failed to connect to SMB share' });
    }

    // Scan for books
    const books = await scanBooksFolder('/');
    
    // Add books to database
    const addedBooks = [];
    for (const book of books) {
      const filename = book.filename.replace(/\.[^/.]+$/, '');
      
      // Check if already exists
      const existing = db.prepare('SELECT id FROM books WHERE file_path = ?').get(book.path);
      if (!existing) {
        const result = db.prepare(`
          INSERT INTO books (title, file_path)
          VALUES (?, ?)
        `).run(filename, book.path);
        
        addedBooks.push(result.lastInsertRowid);
      }
    }

    // Disconnect
    await disconnectSMB();
    
    // Update last sync time
    db.prepare(`
      UPDATE synology_config SET last_sync = CURRENT_TIMESTAMP WHERE id = ?
    `).run(config.id);

    res.json({ 
      message: 'Scan completed', 
      foundBooks: books.length,
      addedBooks: addedBooks.length 
    });
  } catch (error) {
    await disconnectSMB();
    res.status(500).json({ error: error.message });
  }
});

export default router;
