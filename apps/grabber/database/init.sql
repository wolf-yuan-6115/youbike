CREATE TYPE station_state AS ENUM ('FULL', 'EMPTY', 'NORMAL');

--- Create tables
CREATE TABLE public.current
(
    station_id  integer                  NOT NULL,
    unavailable integer                  NOT NULL DEFAULT 0,
    success     integer                  NOT NULL DEFAULT 0,
    update      timestamp with time zone NOT NULL DEFAULT (now()),
    bikes       smallint                 NOT NULL DEFAULT 0,
    slots       smallint                 NOT NULL DEFAULT 0,
    full        integer                  NOT NULL DEFAULT 0,
    status USER-DEFINED NOT NULL DEFAULT 'NORMAL'::station_state,
    CONSTRAINT current_pkey PRIMARY KEY (station_id),
    CONSTRAINT history_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations (id)
);
CREATE TABLE public.history
(
    id         uuid                     NOT NULL DEFAULT gen_random_uuid(),
    station_id integer                  NOT NULL,
    available  smallint                 NOT NULL,
    empty      smallint                 NOT NULL,
    at         timestamp with time zone NOT NULL,
    CONSTRAINT history_pkey PRIMARY KEY (id),
    CONSTRAINT recently_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations (id)
);
CREATE TABLE public.stations
(
    id         integer  NOT NULL,
    name       text     NOT NULL,
    lat        real     NOT NULL,
    lng        real     NOT NULL,
    address    text     NOT NULL,
    total      smallint NOT NULL DEFAULT 0,
    name_en    text     NOT NULL,
    address_en text     NOT NULL,
    CONSTRAINT stations_pkey PRIMARY KEY (id)
);

--- Create a 5-day history trigger, for no-brain insert from grabber
CREATE
OR REPLACE FUNCTION public.cleanup_recently_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
DELETE
FROM history
WHERE id IN (SELECT id
             FROM (SELECT id,
                          ROW_NUMBER() OVER (
               PARTITION BY station_id, date_trunc('day', at)
               ORDER BY date_trunc('day', at) DESC
             ) AS day_rn, DENSE_RANK() OVER (
               PARTITION BY station_id
               ORDER BY date_trunc('day', at) DESC
             ) AS day_rank
                   FROM history
                   WHERE station_id = NEW.station_id) sub
             WHERE day_rank > 5);
RETURN NEW;
END;
$function$

CREATE TRIGGER "trg_cleanup_recently_after_insert"
    AFTER INSERT
    ON "public"."history"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."cleanup_recently_after_insert"();

--- Create get_history_with_limit function used in home page
CREATE
OR REPLACE FUNCTION public.get_history_with_limit(max_rows integer DEFAULT 3)
 RETURNS TABLE(id uuid, station_id integer, available smallint, empty smallint, at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
BEGIN
RETURN QUERY WITH ranked_data AS (
    SELECT r.*,
           ROW_NUMBER() OVER (PARTITION BY r.station_id ORDER BY r.at DESC) AS row_num
    FROM history r
  )
SELECT r.id, r.station_id, r.available, r.empty, r.at
FROM ranked_data r
WHERE r.row_num <= 6
ORDER BY r.at DESC;
END;
$function$

--- Configure RLS
alter
policy "Enable read access for all users"
on "public"."current"
to public
using (true);
      alter

policy "Enable read access for all users"
on "public"."history"
to public
using (true);
            alter
policy "Enable read access for all users"
on "public"."stations"
to public
using (true);
