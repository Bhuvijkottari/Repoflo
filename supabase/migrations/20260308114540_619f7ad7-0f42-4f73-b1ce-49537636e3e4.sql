CREATE TABLE public.feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);