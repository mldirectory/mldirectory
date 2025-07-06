
-- Create a table for store locations
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT,
  hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read stores (public data)
CREATE POLICY "Everyone can view stores" 
  ON public.stores 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy to allow everyone to insert stores (for admin functionality)
CREATE POLICY "Everyone can create stores" 
  ON public.stores 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create policy to allow everyone to update stores
CREATE POLICY "Everyone can update stores" 
  ON public.stores 
  FOR UPDATE 
  TO public
  USING (true);

-- Create policy to allow everyone to delete stores
CREATE POLICY "Everyone can delete stores" 
  ON public.stores 
  FOR DELETE 
  TO public
  USING (true);
