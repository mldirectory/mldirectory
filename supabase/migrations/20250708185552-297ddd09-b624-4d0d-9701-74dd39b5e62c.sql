-- Add created_by column to stores table to track who created each store
ALTER TABLE public.stores ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Update RLS policies for better access control
DROP POLICY IF EXISTS "Everyone can view stores" ON public.stores;
DROP POLICY IF EXISTS "Everyone can create stores" ON public.stores;
DROP POLICY IF EXISTS "Everyone can update stores" ON public.stores;
DROP POLICY IF EXISTS "Everyone can delete stores" ON public.stores;

-- New policies
-- Public can view all stores (for the main store locator)
CREATE POLICY "Everyone can view stores" ON public.stores
    FOR SELECT USING (true);

-- Authenticated users can create stores (will automatically set created_by)
CREATE POLICY "Authenticated users can create stores" ON public.stores
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own stores OR master admin can update all
CREATE POLICY "Users can update their own stores or master admin can update all" ON public.stores
    FOR UPDATE 
    USING (
        created_by = auth.uid() OR 
        auth.jwt() ->> 'email' = 'mattresslocatorsite@gmail.com'
    );

-- Users can delete their own stores OR master admin can delete all  
CREATE POLICY "Users can delete their own stores or master admin can delete all" ON public.stores
    FOR DELETE 
    USING (
        created_by = auth.uid() OR 
        auth.jwt() ->> 'email' = 'mattresslocatorsite@gmail.com'
    );