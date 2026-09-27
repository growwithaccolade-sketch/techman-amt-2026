-- Normalize the first 50 TechMan catalogue items so 45/50 are available.
-- The five intentionally unavailable products are IDs 10, 20, 30, 40 and 50.
update public.products
set
  stock = case
    when external_id in (10,20,30,40,50) then 0
    else 6 + ((external_id * 7) % 13)
  end,
  specs = jsonb_set(
    coalesce(specs, '{}'::jsonb),
    '{Availability}',
    to_jsonb(
      case
        when external_id in (10,20,30,40,50) then 'Currently unavailable'
        else 'In stock'
      end
    ),
    true
  ),
  updated_at = now()
where external_id between 1 and 50;
