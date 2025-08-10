import { DatabaseManager } from '../database';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('DatabaseManager', () => {
  let dbManager: DatabaseManager;
  let tempDir: string;

  beforeAll(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'odinview-test-'));
    dbManager = DatabaseManager.getInstance(tempDir);
  });

  afterAll(() => {
    // Clean up: close database and remove temp directory
    if (dbManager.db) {
      dbManager.db.close();
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should be a singleton', () => {
    const anotherInstance = DatabaseManager.getInstance(tempDir);
    expect(anotherInstance).toBe(dbManager);
  });

  it('should have an initialized database connection', () => {
    expect(dbManager.db).toBeInstanceOf(Database);
  });

  it('should initialize the KnowledgeItems table', () => {
    const stmt = dbManager.db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='KnowledgeItems';"
    );
    const table = stmt.get() as { name: string } | undefined;
    expect(table).toBeDefined();
    expect(table?.name).toBe('KnowledgeItems');
  });

  it('should create database file in specified directory', () => {
    const dbPath = path.join(tempDir, 'odinview.db');
    expect(fs.existsSync(dbPath)).toBe(true);
  });
});