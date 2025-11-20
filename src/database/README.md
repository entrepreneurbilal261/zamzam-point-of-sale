# Database Setup - SQLite Local Files

## Current Implementation

The POS system now uses **SQLite** (via sql.js) to create actual SQL database files. All data is stored locally in SQL format.

### How It Works

- All receipts are stored in a SQLite database
- Database is saved in browser's localStorage (as base64) for persistence
- Can be exported as `.db` file (actual SQLite database file)
- Can be imported from `.db` file
- **No internet connection required**
- Works completely offline

### Database File

- **Database Name**: `zamzam_pos.db`
- **Location**: Stored in browser localStorage (can be exported as .db file)
- **Format**: SQLite 3 database file

### Database Structure

The `receipts` table stores:
- `id` - Unique receipt ID (TEXT PRIMARY KEY)
- `receipt_number` - Receipt number (TEXT, UNIQUE)
- `items` - JSON string of items array (TEXT)
- `total` - Total amount (REAL)
- `date` - ISO 8601 date string (TEXT)
- `customer_name` - Optional customer name (TEXT, NULLABLE)
- `created_at` - Timestamp (TEXT, DEFAULT datetime('now'))

### Indexes

- `idx_receipts_date` - Index on date column
- `idx_receipts_receipt_number` - Index on receipt_number column
- `idx_receipts_created_at` - Index on created_at column

### SQL Schema File

The schema is defined in:
- `src/database/schema.sql` - SQLite schema template

### Example Queries

**Get today's orders:**
```sql
SELECT * FROM receipts 
WHERE date(date) = date('now') 
ORDER BY created_at DESC;
```

**Get monthly orders:**
```sql
SELECT * FROM receipts 
WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now') 
ORDER BY created_at DESC;
```

**Get total revenue for a date:**
```sql
SELECT SUM(total) as total_revenue 
FROM receipts 
WHERE date(date) = date('now');
```

### Exporting Database

When you deploy as EXE, you can:
1. Export the database as a `.db` file using the export function
2. Save it to your local file system
3. Open it with any SQLite browser (DB Browser, SQLiteStudio, etc.)
4. Run SQL queries directly on the file

### Importing Database

You can import an existing `.db` file to restore data:
1. Use the import function in the application
2. Select your `.db` file
3. Data will be loaded into the application

### For EXE Deployment

When converting to EXE:
1. The database will be stored as a local `.db` file on the system
2. No internet connection needed
3. All data is in standard SQLite format
4. Can be backed up by copying the `.db` file
5. Can be opened with any SQLite tool

### File Location (When Deployed as EXE)

The database file will be saved in:
- Application data directory (e.g., `%APPDATA%/zamzam-pos/zamzam_pos.db` on Windows)
- Or in the application folder
- Can be configured based on your EXE framework (Electron/Tauri)
