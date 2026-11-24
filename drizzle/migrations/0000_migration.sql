CREATE TABLE public.poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id uuid NOT NULL UNIQUE,
  q1 smallint NOT NULL CHECK (q1 BETWEEN 0 AND 3),
  q2 smallint NOT NULL CHECK (q2 BETWEEN 0 AND 3),
  q3 smallint NOT NULL CHECK (q3 BETWEEN 0 AND 3),
  q4 smallint NOT NULL CHECK (q4 BETWEEN 0 AND 3),
  q5 smallint NOT NULL CHECK (q5 BETWEEN 0 AND 3),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.poll_votes TO anon, authenticated;
GRANT ALL ON public.poll_votes TO service_role;

ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can cast one vote"
  ON public.poll_votes FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Aggregated counts only; individual ballots stay private.
CREATE OR REPLACE FUNCTION public.get_poll_results()
RETURNS TABLE (question smallint, option smallint, votes bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT x.question, x.option, count(*)::bigint
  FROM public.poll_votes v
  CROSS JOIN LATERAL (VALUES
    (1::smallint, v.q1), (2::smallint, v.q2), (3::smallint, v.q3), (4::smallint, v.q4), (5::smallint, v.q5)
  ) AS x(question, option)
  GROUP BY x.question, x.option
$$;

REVOKE ALL ON FUNCTION public.get_poll_results() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_poll_results() TO anon, authenticated, service_role;