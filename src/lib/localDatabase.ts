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
      this.ensureMenuAndInventoryTables();
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

      CREATE TABLE IF NOT EXISTS menu_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_urdu TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT '📋',
        color TEXT NOT NULL DEFAULT 'bg-gray-500',
        show_on_main INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        name TEXT NOT NULL,
        name_urdu TEXT NOT NULL DEFAULT '',
        price REAL,
        sizes_json TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id)
      );

      CREATE TABLE IF NOT EXISTS inventory_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_urdu TEXT DEFAULT '',
        quantity REAL NOT NULL DEFAULT 0,
        unit TEXT NOT NULL DEFAULT 'pcs',
        low_stock_at REAL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
      CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory_items(quantity);

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'Other',
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    `;

    this.db.run(createTableSQL);
    this.saveToStorage();
  }

  // Call after init so existing DBs get new tables too
  private ensureMenuAndInventoryTables(): void {
    if (!this.db) return;
    try {
      this.db.run(`CREATE TABLE IF NOT EXISTS menu_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_urdu TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT '📋',
        color TEXT NOT NULL DEFAULT 'bg-gray-500',
        show_on_main INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0
      )`);
      this.db.run(`CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        name TEXT NOT NULL,
        name_urdu TEXT NOT NULL DEFAULT '',
        price REAL,
        sizes_json TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id)
      )`);
      this.db.run(`CREATE TABLE IF NOT EXISTS inventory_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_urdu TEXT DEFAULT '',
        quantity REAL NOT NULL DEFAULT 0,
        unit TEXT NOT NULL DEFAULT 'pcs',
        low_stock_at REAL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory_items(quantity)`);
    } catch (_) {}
    this.ensureExpensesTable();
    this.ensureInventoryExtended();
  }

  private ensureExpensesTable(): void {
    if (!this.db) return;
    try {
      this.db.run(`CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'Other',
        created_at TEXT DEFAULT (datetime('now'))
      )`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`);
    } catch (_) {}
  }

  // Extended inventory: extra columns + movement log
  private ensureInventoryExtended(): void {
    if (!this.db) return;
    try {
      // Add columns if missing (SQLite doesn't support IF NOT EXISTS for columns)
      const cols = ['category', 'cost_price', 'notes', 'max_stock'];
      for (const col of cols) {
        try {
          if (col === 'category') this.db.run('ALTER TABLE inventory_items ADD COLUMN category TEXT DEFAULT ""');
          if (col === 'cost_price') this.db.run('ALTER TABLE inventory_items ADD COLUMN cost_price REAL');
          if (col === 'notes') this.db.run('ALTER TABLE inventory_items ADD COLUMN notes TEXT DEFAULT ""');
          if (col === 'max_stock') this.db.run('ALTER TABLE inventory_items ADD COLUMN max_stock REAL');
        } catch (_) {}
      }
      this.db.run(`CREATE TABLE IF NOT EXISTS inventory_log (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity_change REAL NOT NULL,
        quantity_after REAL NOT NULL,
        reason TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (item_id) REFERENCES inventory_items(id)
      )`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_inventory_log_item ON inventory_log(item_id)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_inventory_log_created ON inventory_log(created_at)`);
    } catch (_) {}
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
      const stmt = this.db.prepare(
        `INSERT OR REPLACE INTO receipts 
         (id, receipt_number, items, total, date, customer_name, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.bind([
        receipt.id,
        receipt.id,
        itemsJson,
        receipt.total,
        dateStr,
        receipt.customerName || null,
        createdAt
      ]);
      stmt.step();
      stmt.free();

      // Force save immediately (to IndexedDB - persists across sessions)
      await this.saveToStorage();
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

  // ----- Expenses (for Profit & Loss) -----
  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<{ id: string; date: string; amount: number; description: string; category: string }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    this.ensureExpensesTable();
    const pad = (n: number) => String(n).padStart(2, '0');
    const startStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
    const endStr = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}`;
    try {
      const stmt = this.db.prepare(
        `SELECT id, date, amount, COALESCE(description,'') as description, COALESCE(category,'Other') as category FROM expenses WHERE date >= ? AND date <= ? ORDER BY date DESC`
      );
      stmt.bind([startStr, endStr]);
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async saveExpense(expense: { id?: string; date: string; amount: number; description?: string; category?: string }): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    this.ensureExpensesTable();
    const id = expense.id || `exp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO expenses (id, date, amount, description, category) VALUES (?,?,?,?,?)'
    );
    stmt.bind([
      id,
      expense.date,
      expense.amount,
      expense.description ?? '',
      expense.category ?? 'Other'
    ]);
    stmt.step();
    stmt.free();
    await this.saveToStorage();
  }

  async deleteExpense(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    const stmt = this.db.prepare('DELETE FROM expenses WHERE id = ?');
    stmt.bind([id]);
    stmt.step();
    stmt.free();
    await this.saveToStorage();
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

  // ----- Menu (categories + items) -----
  async getMenuFromDb(): Promise<{ id: string; name: string; name_urdu: string; icon: string; color: string; show_on_main: number; sort_order: number }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    this.ensureMenuAndInventoryTables();
    try {
      const stmt = this.db.prepare('SELECT * FROM menu_categories ORDER BY show_on_main DESC, sort_order ASC');
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async getMenuItemsByCategory(categoryId: string): Promise<{ id: string; category_id: string; name: string; name_urdu: string; price: number | null; sizes_json: string | null; sort_order: number }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    try {
      const stmt = this.db.prepare('SELECT * FROM menu_items WHERE category_id = ? ORDER BY sort_order ASC');
      stmt.bind([categoryId]);
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async getFullMenuFromDb(): Promise<{ id: string; name: string; nameUrdu: string; icon: string; color: string; show_on_main: number; items: { id: string; name: string; nameUrdu: string; category: string; price?: number; sizes?: Record<string, number> }[] }[]> {
    const categories = await this.getMenuFromDb();
    const result: any[] = [];
    for (const cat of categories) {
      const items = await this.getMenuItemsByCategory(cat.id);
      result.push({
        id: cat.id,
        name: cat.name,
        nameUrdu: cat.name_urdu,
        icon: cat.icon,
        color: cat.color,
        show_on_main: cat.show_on_main,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          nameUrdu: i.name_urdu || '',
          category: i.category_id,
          price: i.price ?? undefined,
          sizes: i.sizes_json ? JSON.parse(i.sizes_json) : undefined,
        })),
      });
    }
    return result;
  }

  async seedMenuFromDefault(categories: { id: string; name: string; nameUrdu: string; icon: string; color: string; items: { id: string; name: string; nameUrdu: string; category: string; price?: number; sizes?: Record<string, number> }[] }[]): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    this.ensureMenuAndInventoryTables();
    const dealIds = ['pizza-deals', 'burger-deals', 'birthday-deals'];
    try {
      const catStmt = this.db.prepare(
        'INSERT OR REPLACE INTO menu_categories (id, name, name_urdu, icon, color, show_on_main, sort_order) VALUES (?,?,?,?,?,?,?)'
      );
      const itemStmt = this.db.prepare(
        'INSERT OR REPLACE INTO menu_items (id, category_id, name, name_urdu, price, sizes_json, sort_order) VALUES (?,?,?,?,?,?,?)'
      );
      for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const showOnMain = dealIds.includes(c.id) ? 1 : 0;
        catStmt.bind([c.id, c.name, c.nameUrdu || '', c.icon || '📋', c.color || 'bg-gray-500', showOnMain, i]);
        catStmt.step();
        catStmt.reset();
        for (let j = 0; j < (c.items || []).length; j++) {
          const item = (c.items || [])[j];
          const sizesJson = item.sizes ? JSON.stringify(item.sizes) : null;
          itemStmt.bind([item.id, c.id, item.name, item.nameUrdu || '', item.price ?? null, sizesJson, j]);
          itemStmt.step();
          itemStmt.reset();
        }
      }
      catStmt.free();
      itemStmt.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Seed failed: ${msg}`);
    }
    await this.saveToStorage();
  }

  async saveMenuCategory(cat: { id: string; name: string; name_urdu?: string; icon?: string; color?: string; show_on_main?: boolean; sort_order?: number }): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    this.ensureMenuAndInventoryTables();
    try {
      const stmt = this.db.prepare(
        'INSERT OR REPLACE INTO menu_categories (id, name, name_urdu, icon, color, show_on_main, sort_order) VALUES (?,?,?,?,?,?,?)'
      );
      stmt.bind([cat.id, cat.name, cat.name_urdu ?? '', cat.icon ?? '📋', cat.color ?? 'bg-gray-500', cat.show_on_main ? 1 : 0, cat.sort_order ?? 0]);
      stmt.step();
      stmt.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Save failed: ${msg}`);
    }
    await this.saveToStorage();
  }

  async deleteMenuCategory(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    try {
      const delItems = this.db.prepare('DELETE FROM menu_items WHERE category_id = ?');
      delItems.bind([id]);
      delItems.step();
      delItems.free();
      const delCat = this.db.prepare('DELETE FROM menu_categories WHERE id = ?');
      delCat.bind([id]);
      delCat.step();
      delCat.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Delete failed: ${msg}`);
    }
    await this.saveToStorage();
  }

  async saveMenuItem(item: { id: string; category_id: string; name: string; name_urdu?: string; price?: number | null; sizes_json?: string | null; sort_order?: number }): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    try {
      const stmt = this.db.prepare(
        'INSERT OR REPLACE INTO menu_items (id, category_id, name, name_urdu, price, sizes_json, sort_order) VALUES (?,?,?,?,?,?,?)'
      );
      stmt.bind([item.id, item.category_id, item.name, item.name_urdu ?? '', item.price ?? null, item.sizes_json ?? null, item.sort_order ?? 0]);
      stmt.step();
      stmt.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Save failed: ${msg}`);
    }
    await this.saveToStorage();
  }

  async deleteMenuItem(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    try {
      const stmt = this.db.prepare('DELETE FROM menu_items WHERE id = ?');
      stmt.bind([id]);
      stmt.step();
      stmt.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Delete failed: ${msg}`);
    }
    await this.saveToStorage();
  }

  // ----- Inventory -----
  async getInventoryItems(): Promise<{ id: string; name: string; name_urdu: string; quantity: number; unit: string; low_stock_at: number | null; category: string; cost_price: number | null; notes: string; max_stock: number | null }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    this.ensureMenuAndInventoryTables();
    try {
      const stmt = this.db.prepare('SELECT id, name, name_urdu, quantity, unit, low_stock_at, COALESCE(category, "") as category, cost_price, COALESCE(notes, "") as notes, max_stock FROM inventory_items ORDER BY category ASC, name ASC');
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async getLowStockItems(): Promise<{ id: string; name: string; quantity: number; unit: string; low_stock_at: number }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    this.ensureMenuAndInventoryTables();
    try {
      const stmt = this.db.prepare('SELECT id, name, quantity, unit, low_stock_at FROM inventory_items WHERE low_stock_at IS NOT NULL AND quantity <= low_stock_at ORDER BY quantity ASC');
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async logInventoryMovement(itemId: string, type: 'in' | 'out' | 'adjust', quantityChange: number, quantityAfter: number, reason?: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    this.ensureMenuAndInventoryTables();
    const id = `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const stmt = this.db.prepare(
      'INSERT INTO inventory_log (id, item_id, type, quantity_change, quantity_after, reason) VALUES (?,?,?,?,?,?)'
    );
    stmt.bind([id, itemId, type, quantityChange, quantityAfter, reason ?? null]);
    stmt.step();
    stmt.free();
    await this.saveToStorage();
  }

  async getInventoryLog(itemId?: string): Promise<{ id: string; item_id: string; type: string; quantity_change: number; quantity_after: number; reason: string | null; created_at: string }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    this.ensureMenuAndInventoryTables();
    try {
      const sql = itemId
        ? 'SELECT id, item_id, type, quantity_change, quantity_after, reason, created_at FROM inventory_log WHERE item_id = ? ORDER BY created_at DESC'
        : 'SELECT id, item_id, type, quantity_change, quantity_after, reason, created_at FROM inventory_log ORDER BY created_at DESC';
      const stmt = this.db.prepare(sql);
      if (itemId) stmt.bind([itemId]);
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async getInventoryLogByDateRange(startDate: Date, endDate: Date): Promise<{ id: string; item_id: string; type: string; quantity_change: number; quantity_after: number; reason: string | null; created_at: string }[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];
    this.ensureMenuAndInventoryTables();
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const startStr = start.toISOString();
    const endStr = end.toISOString();
    try {
      const stmt = this.db.prepare(
        'SELECT id, item_id, type, quantity_change, quantity_after, reason, created_at FROM inventory_log WHERE created_at >= ? AND created_at <= ? ORDER BY created_at DESC'
      );
      stmt.bind([startStr, endStr]);
      const rows: any[] = [];
      while (stmt.step()) rows.push(stmt.getAsObject() as any);
      stmt.free();
      return rows;
    } catch (_) {
      return [];
    }
  }

  async saveInventoryItem(item: { id: string; name: string; name_urdu?: string; quantity: number; unit?: string; low_stock_at?: number | null; category?: string; cost_price?: number | null; notes?: string; max_stock?: number | null }): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    this.ensureMenuAndInventoryTables();
    try {
      const now = new Date().toISOString();
      const stmt = this.db.prepare(
        'INSERT OR REPLACE INTO inventory_items (id, name, name_urdu, quantity, unit, low_stock_at, category, cost_price, notes, max_stock, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
      );
      stmt.bind([
        item.id,
        item.name,
        item.name_urdu ?? '',
        item.quantity,
        item.unit ?? 'pcs',
        item.low_stock_at ?? null,
        item.category ?? '',
        item.cost_price ?? null,
        item.notes ?? '',
        item.max_stock ?? null,
        now
      ]);
      stmt.step();
      stmt.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Save failed: ${msg}`);
    }
    await this.saveToStorage();
  }

  async updateInventoryQuantity(id: string, quantity: number, logReason?: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    const stmt = this.db.prepare('SELECT quantity FROM inventory_items WHERE id = ?');
    stmt.bind([id]);
    let oldQty = 0;
    if (stmt.step()) oldQty = (stmt.getAsObject() as any).quantity ?? 0;
    stmt.free();
    const change = quantity - oldQty;
    const now = new Date().toISOString();
    const upd = this.db.prepare('UPDATE inventory_items SET quantity = ?, updated_at = ? WHERE id = ?');
    upd.bind([quantity, now, id]);
    upd.step();
    upd.free();
    if (change !== 0) {
      const type = change > 0 ? 'in' : (change < 0 ? 'out' : 'adjust');
      await this.logInventoryMovement(id, type as 'in' | 'out' | 'adjust', change, quantity, logReason);
    }
    await this.saveToStorage();
  }

  async deleteInventoryItem(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');
    try {
      const stmt = this.db.prepare('DELETE FROM inventory_items WHERE id = ?');
      stmt.bind([id]);
      stmt.step();
      stmt.free();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Delete failed: ${msg}`);
    }
    await this.saveToStorage();
  }
}

export const localDatabase = new LocalDatabase();
