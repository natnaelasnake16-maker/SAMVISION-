-- Run these commands in your Supabase SQL Editor to allow the Admin panel to save data.

-- 1. Enable access to frames
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to anon" ON public.frames FOR ALL USING (true) WITH CHECK (true);

-- 2. Enable access to frame_branches
ALTER TABLE public.frame_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to anon" ON public.frame_branches FOR ALL USING (true) WITH CHECK (true);

-- 3. Enable access to lens_compatibility
ALTER TABLE public.lens_compatibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to anon" ON public.lens_compatibility FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable access to branches (optional but good for consistency)
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to anon" ON public.branches FOR ALL USING (true) WITH CHECK (true);
