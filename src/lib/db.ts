import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface Cat {
  id: number;
  name: string;
  age: number;
  weight: number;
  breed: string;
  description: string;
  logo_path?: string;
  created_at: string;
  updated_at: string;
}

export interface CatWithDetails extends Cat {
  habits: string[];
  gallery: string[];
}

const dbPath = path.join(process.cwd(), 'cats.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

function initDatabase() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS cats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      weight REAL NOT NULL,
      breed TEXT NOT NULL,
      description TEXT NOT NULL,
      logo_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS cat_habits (
      cat_id INTEGER,
      habit_id INTEGER,
      FOREIGN KEY (cat_id) REFERENCES cats (id) ON DELETE CASCADE,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
      PRIMARY KEY (cat_id, habit_id)
    )
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS cat_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (cat_id) REFERENCES cats (id) ON DELETE CASCADE
    )
  `);

    db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_cats_timestamp 
    AFTER UPDATE ON cats 
    BEGIN
      UPDATE cats SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);
}

initDatabase();

const defaultHabits = [
    'Кусать за ноги', 'Ловить лучики солнца', 'Мурчать по утрам',
    'Выпрашивать вкусняшки', 'Спать на клавиатуре', 'Гонять мячик',
    'Ловить мышей', 'Пить воду из-под крана', 'Тереться об ноги',
    'Играть с коробками',
];

const habitStmt = db.prepare('INSERT OR IGNORE INTO habits (name) VALUES (?)');
defaultHabits.forEach((habit) => habitStmt.run(habit));

export const catsDB = {
    getAllCats(): CatWithDetails[] {
        const cats = db.prepare('SELECT * FROM cats ORDER BY created_at DESC').all() as Cat[];

        return cats.map((cat) => this.enrichCatWithDetails(cat));
    },

    getCatById(id: number): CatWithDetails | null {
        try {
            if (!id || typeof id !== 'number' || Number.isNaN(id)) {
                return null;
            }

            const cat = db.prepare('SELECT * FROM cats WHERE id = ?').get(id) as Cat;

            if (!cat) {
                return null;
            }
            return this.enrichCatWithDetails(cat);
        } catch {
            return null;
        }
    },

    createCat(data: {
        name: string;
        age: number;
        weight: number;
        breed: string;
        description: string;
        logo?: string;
        habits?: string[];
        gallery?: string[];
    }): CatWithDetails {
        const {
            name, age, weight, breed, description, logo, habits = [], gallery = [],
        } = data;

        const stmt = db.prepare(`
      INSERT INTO cats (name, age, weight, breed, description, logo_path) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(name, age, weight, breed, description, logo || null);
        const catId = result.lastInsertRowid as number;

        this.addHabitsToCat(catId, habits);

        this.addPhotosToCat(catId, gallery);

        return this.getCatById(catId)!;
    },

    updateCat(id: number, data: Partial<{
    name: string;
    age: number;
    weight: number;
    breed: string;
    description: string;
    logo: string;
    habits: string[];
    gallery: string[];
  }>): CatWithDetails | null {
        const {
            name, age, weight, breed, description, logo, habits, gallery,
        } = data;

        const updates: string[] = [];
        const values: any[] = [];

        if (name !== undefined) { updates.push('name = ?'); values.push(name); }
        if (age !== undefined) { updates.push('age = ?'); values.push(age); }
        if (weight !== undefined) { updates.push('weight = ?'); values.push(weight); }
        if (breed !== undefined) { updates.push('breed = ?'); values.push(breed); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (logo !== undefined) { updates.push('logo_path = ?'); values.push(logo || null); }

        if (updates.length > 0) {
            values.push(id);
            const stmt = db.prepare(`UPDATE cats SET ${updates.join(', ')} WHERE id = ?`);
            stmt.run(...values);
        }

        if (habits !== undefined) {
            db.prepare('DELETE FROM cat_habits WHERE cat_id = ?').run(id);
            this.addHabitsToCat(id, habits);
        }

        if (gallery !== undefined) {
            db.prepare('DELETE FROM cat_photos WHERE cat_id = ?').run(id);
            this.addPhotosToCat(id, gallery);
        }

        return this.getCatById(id);
    },

    deleteCat(id: number): boolean {
        const stmt = db.prepare('DELETE FROM cats WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    },

    searchCats(searchTerm: string): CatWithDetails[] {
        const cats = db.prepare(`
      SELECT * FROM cats 
      WHERE name LIKE ? OR breed LIKE ? OR description LIKE ?
      ORDER BY name
    `).all(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`) as Cat[];

        return cats.map((cat) => this.enrichCatWithDetails(cat));
    },

    enrichCatWithDetails(cat: Cat): CatWithDetails {
        const habits = db.prepare(`
      SELECT h.name FROM habits h
      JOIN cat_habits ch ON h.id = ch.habit_id
      WHERE ch.cat_id = ?
      ORDER BY h.name
    `).all(cat.id).map((h: any) => h.name);

        const gallery = db.prepare(`
          SELECT filename FROM cat_photos 
          WHERE cat_id = ? 
          ORDER BY order_index, id
        `).all(cat.id).map((p: any) => p.filename);

        return {
            ...cat,
            habits,
            gallery,
        };
    },

    addHabitsToCat(catId: number, habits: string[]): void {
        if (!habits.length) return;

        const linkStmt = db.prepare('INSERT OR IGNORE INTO cat_habits (cat_id, habit_id) VALUES (?, ?)');

        habits.forEach((habit) => {
            let habitRow = db.prepare('SELECT id FROM habits WHERE name = ?').get(habit) as { id: number } | undefined;

            if (!habitRow) {
                const insertResult = db.prepare('INSERT INTO habits (name) VALUES (?)').run(habit);
                habitRow = { id: insertResult.lastInsertRowid as number };
            }

            if (habitRow) {
                linkStmt.run(catId, habitRow.id);
            }
        });
    },

    addPhotosToCat(catId: number, photos: string[]): void {
        if (!photos.length) return;

        const stmt = db.prepare('INSERT INTO cat_photos (cat_id, filename, order_index) VALUES (?, ?, ?)');

        photos.forEach((photo, index) => {
            stmt.run(catId, photo, index);
        });
    },

    getAllHabits(): string[] {
        return db.prepare('SELECT name FROM habits ORDER BY name').all().map((h: any) => h.name);
    },
};

export default db;
