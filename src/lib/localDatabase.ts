// Local Database Service using SQLite (sql.js)
// Creates actual SQL database files that can be saved locally
// Uses IndexedDB for persistence (survives browser restarts)

import initSqlJs, { Database } from 'sql.js';

const DB_NAME = 'zamzam_pos.db';
const INDEXEDDB_NAME = 'zamzam_pos_storage';
const INDEXEDDB_VERSION = 1;
const INDEXEDDB_STORE = 'database';

export interface ReceiptRecord {
  id: string;
  receipt_number: string;
  items: string; // JSON string
  total: number;
  date: string; // ISO 8601 string
  customer_name?: string | null;
  created_at: string;
}

class LocalDatabase {
  private db: Database | null = null;
  private SQL: any = null;
  private indexedDB: IDBDatabase | null = null;

  // Initialize IndexedDB for persistent storage
  private async initIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(INDEXEDDB_STORE)) {
          db.createObjectStore(INDEXEDDB_STORE);
        }
      };
    });
  }

  // Save database to IndexedDB (persists across sessions)
  private async saveToIndexedDB(): Promise<void> {
    if (!this.db || !this.indexedDB) return;

    try {
      const data = this.db.export();
      const transaction = this.indexedDB.transaction([INDEXEDDB_STORE], 'readwrite');
      const store = transaction.objectStore(INDEXEDDB_STORE);
      store.put(data, 'database');
    } catch (error) {
      console.error('Failed to save to IndexedDB:', error);
    }
  }

  // Load database from IndexedDB
  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    if (!this.indexedDB) return null;

    try {
      const transaction = this.indexedDB.transaction([INDEXEDDB_STORE], 'readonly');
      const store = transaction.objectStore(INDEXEDDB_STORE);
      const request = store.get('database');

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to load from IndexedDB:', error);
      return null;
    }
  }

  async init(): Promise<void> {
    if (this.db && this.SQL) return;

    try {
      // Initialize IndexedDB first
      await this.initIndexedDB();

      // Initialize sql.js
      this.SQL = await initSqlJs({
        locateFile: (file: string) => {
          if (file.endsWith('.wasm')) {
            return `/sql-wasm.wasm`;
          }
          return `https://sql.js.org/dist/${file}`;
        }
      });

      // Try to load from IndexedDB (persists across sessions)
      const savedDb = await this.loadFromIndexedDB();
      
      if (savedDb) {
        try {
          // Load existing database from IndexedDB
          this.db = new this.SQL.Database(savedDb);
          
          // Verify database is valid
          this.db.exec('SELECT COUNT(*) FROM receipts');
          console.log('Database loaded from IndexedDB');
        } catch (e) {
          console.warn('Failed to load existing database, creating new one:', e);
          // If loading fails, create new database
          this.db = new this.SQL.Database();
          this.createTables();
        }
      } else {
        // Create new database
        this.db = new this.SQL.Database();
        this.createTables();
      }
    } catch (error) {
      console.error('Failed to initialize SQLite:', error);
      throw error;
    }
  }

  private createTables(): void {
    if (!this.db) return;

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY,
        receipt_number TEXT NOT NULL UNIQUE,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        date TEXT NOT NULL,
        customer_name TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
      CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);
      CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);
    `;

    this.db.run(createTableSQL);
    this.saveToStorage();
  }

  private async saveToStorage(): Promise<void> {
    if (!this.db) return;
    
    try {
      // Save to IndexedDB (persists across browser restarts)
      await this.saveToIndexedDB();
      
      // Also save to localStorage as backup
      const data = this.db.export();
      const buffer = Array.from(data);
      const base64 = btoa(String.fromCharCode(...buffer));
      localStorage.setItem(`${DB_NAME}_backup`, base64);
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  async saveReceipt(receipt: {
    id: string;
    items: any[];
    total: number;
    date: Date;
    customerName?: string;
  }): Promise<void> {
    if (!this.db) await this.init();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const itemsJson = JSON.stringify(receipt.items);
    const dateStr = receipt.date.toISOString();
    const createdAt = new Date().toISOString();

    try {
      this.db.run(
        `INSERT OR REPLACE INTO receipts 
         (id, receipt_number, items, total, date, customer_name, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          receipt.id,
          receipt.id,
          itemsJson,
          receipt.total,
          dateStr,
          receipt.customerName || null,
          createdAt
        ]
      );

      // Force save immediately (to IndexedDB - persists across sessions)
      await this.saveToStorage();
      
      // Verify the save worked
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM receipts WHERE id = ?');
      stmt.bind([receipt.id]);
      let count = 0;
      if (stmt.step()) {
        const row = stmt.getAsObject() as any;
        count = row.count || 0;
      }
      stmt.free();
      
      if (count === 0) {
        throw new Error('Receipt not saved properly');
      }
    } catch (error) {
      console.error('Error saving receipt to database:', error);
      throw error;
    }
  }

  async getReceiptsByDateRange(startDate: Date, endDate: Date): Promise<ReceiptRecord[]> {
    if (!this.db) await this.init();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const startStr = startDate.toISOString();
    const endStr = endDate.toISOString();

    const stmt = this.db.prepare(
      `SELECT * FROM receipts 
       WHERE date >= ? AND date <= ? 
       ORDER BY created_at DESC`
    );
    
    stmt.bind([startStr, endStr]);
    
    const results: ReceiptRecord[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      results.push(row as ReceiptRecord);
    }
    
    stmt.free();
    return results;
  }

  async getTodayReceipts(): Promise<ReceiptRecord[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getReceiptsByDateRange(today, tomorrow);
  }

  async getMonthlyReceipts(year: number, month: number): Promise<ReceiptRecord[]> {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.getReceiptsByDateRange(startDate, endDate);
  }

  async getAllReceipts(): Promise<ReceiptRecord[]> {
    if (!this.db) await this.init();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stmt = this.db.prepare('SELECT * FROM receipts ORDER BY created_at DESC');
    
    const results: ReceiptRecord[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      results.push(row as ReceiptRecord);
    }
    
    stmt.free();
    return results;
  }

  // Export database as .db file (for download)
  async exportDatabase(): Promise<Blob> {
    if (!this.db) await this.init();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const data = this.db.export();
    return new Blob([data], { type: 'application/x-sqlite3' });
  }

  // Auto-download database file
  async downloadDatabase(): Promise<void> {
    const blob = await this.exportDatabase();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = DB_NAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import database from .db file
  async importDatabase(file: File): Promise<void> {
    if (!this.SQL) {
      this.SQL = await initSqlJs({
        locateFile: (file: string) => {
          if (file.endsWith('.wasm')) {
            return `/sql-wasm.wasm`;
          }
          return `https://sql.js.org/dist/${file}`;
        }
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    this.db = new this.SQL.Database(uint8Array);
    this.saveToStorage();
  }

  // Get database file path (for EXE deployment)
  getDatabasePath(): string {
    return DB_NAME;
  }
}

export const localDatabase = new LocalDatabase();
