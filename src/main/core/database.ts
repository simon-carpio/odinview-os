import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

// This class will manage all database operations for the application.
// It uses a Singleton pattern to ensure only one instance exists.
export class DatabaseManager {
  private static instance: DatabaseManager;
  public db: Database.Database;

  private constructor(userDataPath: string) {
    // Ensure the directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    
    const dbPath = path.join(userDataPath, 'odinview.db');
    this.db = new Database(dbPath);
    console.log(`Database initialized at: ${dbPath}`);
    this.initSchema();
  }

  public static getInstance(userDataPath: string): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(userDataPath);
    }
    return DatabaseManager.instance;
  }

  private initSchema(): void {
    // This function sets up the initial schema if it doesn't exist.
    console.log("Initializing database schema...");
    const createKnowledgeTable = `
      CREATE TABLE IF NOT EXISTS KnowledgeItems (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL, -- 'file', 'url', 'note'
        source TEXT NOT NULL, -- file path, url, etc.
        content TEXT,
        embedding BLOB,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;
    this.db.exec(createKnowledgeTable);
    console.log("'KnowledgeItems' table is ready.");
  }
}