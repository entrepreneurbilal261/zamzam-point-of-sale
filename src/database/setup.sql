-- Run this SQL in your Supabase SQL editor to create the receipts table

-- Create receipts table for storing POS sales data
CREATE TABLE receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_receipts_date ON receipts(date);
CREATE INDEX idx_receipts_receipt_number ON receipts(receipt_number);
CREATE INDEX idx_receipts_created_at ON receipts(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on receipts" ON receipts
  FOR ALL 
  TO public
  USING (true)
  WITH CHECK (true);