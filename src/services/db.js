import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('stayly.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      rating REAL NOT NULL,
      image_key TEXT NOT NULL
    );
  `);

  const countRow = db.getFirstSync('SELECT COUNT(*) as count FROM hotels;');
  if (countRow.count === 0) {
    db.runSync(
      'INSERT INTO hotels (name, category, price, rating, image_key) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?);',
      [
        'The Cove El Nido', 'Beach', 240, 4.9, 'cove',
        'Casa Palma', 'Boutique', 185, 4.8, 'palma',
        'The Atelier', 'City', 210, 4.9, 'atelier',
        'Amihan House', 'Resorts', 165, 4.7, 'amihan'
      ]
    );
  }
}