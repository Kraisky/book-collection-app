import express from 'express';
import { getDB } from '../db/database.js';

const router = express.Router();

// Get all books
router.get('/', (req, res) => {
  const db = getDB();
  try {
    const books = db.prepare('SELECT * FROM books ORDER BY title ASC').all();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book
router.get('/:id', (req, res) => {
  const db = getDB();
  try {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create book
router.post('/', (req, res) => {
  const db = getDB();
  const { title, author, isbn, file_path, cover_url, description, published_date } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO books (title, author, isbn, file_path, cover_url, description, published_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, author, isbn, file_path, cover_url, description, published_date);

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put('/:id', (req, res) => {
  const db = getDB();
  const { title, author, isbn, cover_url, description, published_date } = req.body;

  try {
    db.prepare(`
      UPDATE books 
      SET title = ?, author = ?, isbn = ?, cover_url = ?, description = ?, published_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, author, isbn, cover_url, description, published_date, req.params.id);

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', (req, res) => {
  const db = getDB();
  try {
    db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
