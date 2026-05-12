import express from 'express';
import { getDB } from '../db/database.js';

const router = express.Router();

// Get config
router.get('/', (req, res) => {
  const db = getDB();
  try {
    const config = db.prepare('SELECT * FROM synology_config LIMIT 1').get();
    if (!config) {
      return res.json(null);
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save/Update config
router.post('/', (req, res) => {
  const db = getDB();
  const { share_path, username, password } = req.body;

  try {
    const existing = db.prepare('SELECT id FROM synology_config LIMIT 1').get();

    if (existing) {
      db.prepare(`
        UPDATE synology_config 
        SET share_path = ?, username = ?, password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(share_path, username, password, existing.id);
    } else {
      db.prepare(`
        INSERT INTO synology_config (share_path, username, password)
        VALUES (?, ?, ?)
      `).run(share_path, username, password);
    }

    const config = db.prepare('SELECT * FROM synology_config LIMIT 1').get();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
