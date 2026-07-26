# Fix 003 — PgAdmin eliminado de docker-compose

## Decisión
Se eliminó el servicio `pgadmin` del `docker-compose.yml` porque el equipo usa DBeaver como cliente de base de datos.

## Cambio
- Eliminado el bloque `pgadmin` completo del `docker-compose.yml`
- Ya no hay riesgo de credenciales por defecto ni exposición de puerto 5050

## Archivo
`docker-compose.yml`

## Criterios de aceptación
- [x] `docker-compose up` ya no levanta pgadmin
- [x] postgres y redis siguen funcionando normalmente
- [x] `docker-compose.yml` no referencia pgadmin en ninguna sección
