CREATE TYPE station_state AS ENUM ('FULL', 'EMPTY', 'NORMAL');

CREATE TABLE public.stations
(
    id      BIGINT           NOT NULL,
    name    TEXT             NOT NULL,
    lat     DOUBLE PRECISION NOT NULL,
    lng     DOUBLE PRECISION NOT NULL,
    enabled BOOLEAN          NOT NULL,
    address TEXT             NOT NULL,
    total   SMALLINT NULL,
    CONSTRAINT stations_pkey PRIMARY KEY (id)
);

CREATE TABLE public.current
(
    station_id  BIGINT                   NOT NULL,
    unavailable BIGINT                   NOT NULL DEFAULT 0,
    success     BIGINT                   NOT NULL DEFAULT 0,
    fail        BIGINT                   NOT NULL DEFAULT 0,
    update      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Taipei'::TEXT),
    bikes       SMALLINT                 NOT NULL DEFAULT 0,
    slots       SMALLINT                 NOT NULL DEFAULT 0,
    full        BIGINT                   NOT NULL DEFAULT 0,
    status      station_state            NOT NULL DEFAULT 'NORMAL'::station_state,
    CONSTRAINT history_pkey PRIMARY KEY (station_id),
    CONSTRAINT history_station_id_fkey FOREIGN KEY (station_id)
        REFERENCES stations (id) ON DELETE CASCADE
);

CREATE TABLE public.history
(
    id         UUID                     NOT NULL DEFAULT GEN_RANDOM_UUID(),
    station_id BIGINT                   NOT NULL,
    available  INTEGER                  NOT NULL,
    empty      INTEGER                  NOT NULL,
    at         TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT recently_pkey PRIMARY KEY (id),
    CONSTRAINT recently_station_id_fkey FOREIGN KEY (station_id)
        REFERENCES stations (id) ON DELETE CASCADE
);

CREATE
OR REPLACE FUNCTION cleanup_recently_after_insert()
RETURNS TRIGGER AS $$

BEGIN
  SET
search_path = public;

DELETE
FROM history
WHERE id IN (SELECT id
             FROM (SELECT id,
                          ROW_NUMBER() OVER (PARTITION BY station_id ORDER BY at DESC) AS rn
                   FROM history
                   WHERE station_id = NEW.station_id) sub
             WHERE rn > 48);
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_cleanup_recently_after_insert
    AFTER INSERT
    ON history
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_recently_after_insert();
