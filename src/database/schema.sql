-- SQLite Schema for Zamzam Point of Sale System
-- This file can be used to initialize your local SQLite database
-- When deploying as EXE, place this file in your local system and initialize the database

-- Create receipts table for storing POS sales data
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  items TEXT NOT NULL, -- JSON string of items array
  total REAL NOT NULL,
  date TEXT NOT NULL, -- ISO 8601 date string
  customer_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);

-- Example query to get today's orders
-- SELECT * FROM receipts WHERE date(date) = date('now') ORDER BY created_at DESC;

-- Example query to get monthly orders
-- SELECT * FROM receipts WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now') ORDER BY created_at DESC;

