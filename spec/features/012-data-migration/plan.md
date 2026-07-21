# Plan — Migración de Datos

## Enfoque
1. Acceder a la DB actual (MySQL/MariaDB probable) o scrapear el HTML
2. Crear script Node.js en scripts/migrate.ts
3. Transformar datos al schema de TypeORM
4. Insertar en PostgreSQL

## Pasos
1. Obtener acceso a la DB actual (dump SQL o credenciales)
2. Crear mapeo de campos: título, contenido, fecha, categoría
3. Script de migración con transformación
4. Validación post-migración
