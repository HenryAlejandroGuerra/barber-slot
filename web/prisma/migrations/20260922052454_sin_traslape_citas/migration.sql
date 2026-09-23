CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE cita
  ADD CONSTRAINT cita_sin_traslape
  EXCLUDE USING gist (
    barbero_id WITH =,
    tstzrange(fecha_inicio, fecha_fin) WITH &&
  ) WHERE (estado <> 'cancelada');
