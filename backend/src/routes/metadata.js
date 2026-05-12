import express from 'express';
import { searchMetadata } from '../services/metadata.js';
import { getDB } from '../db/database.js';

const router = express.Router();

// Search metadata
router.post('/search', async (req, res) => {
  const { query, type = 'title' } = req.body;

  try {
    const results = await searchMetadata(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-fetch metadata for a book by ID
router.post('/fetch/:bookId', async (req, res) => {
  const db = getDB();
  const bookId = req.params.bookId;

  try {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const results = await searchMetadata(book.title);
    if (results.length > 0) {
      const metadata = results[0];
      db.prepare(`
        UPDATE books 
        SET author = ?, isbn = ?, cover_url = ?, description = ?, published_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        metadata.author,
        metadata.isbn,
        metadata.cover_url,
        metadata.description,
        metadata.published_date,
        bookId
      );

      const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
      res.json(updated);
    } else {
      res.status(404).json({ error: 'No metadata found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
