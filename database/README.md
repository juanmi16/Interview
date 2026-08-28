# Carpeta `database/`

Scripts SQL de la base **AteneaDb** (SQL Server Express).

## Para qué sirve esta carpeta
Vos ya sabés SQL, así que acá dejo la estructura y datos **en SQL puro**,
para que veas exactamente qué está pasando por debajo. Es material de
**lectura y práctica**.

> ⚠️ Cuando conectemos **EF Core (Code-First)** en el backend, EF pasa a ser
> el "dueño" del esquema: crea y actualiza las tablas con *migraciones*.
> Para no chocar, no corras `01_esquema.sql` contra la MISMA base que use EF.
> Si querés practicar SQL a mano, usá otra base (ej. `AteneaDb_Practica`)
> cambiando el `USE` de arriba.

## Archivos (correr en orden)
1. `01_esquema.sql` — crea la base y las tablas `Usuarios` y `Metricas`.
2. `02_datos_ejemplo.sql` — inserta 2 usuarios y 5 métricas de ejemplo.
3. `03_consultas_practica.sql` — SELECTs, JOINs, GROUP BY para practicar.

## Cómo correrlos
Tu instancia es `.\SQLEXPRESS`. Opciones:

- **SSMS** (SQL Server Management Studio) o **Azure Data Studio**: conectá al
  servidor `.\SQLEXPRESS` (autenticación de Windows) y abrí los `.sql`.
- **Por línea de comando** con `sqlcmd`:

```bash
sqlcmd -S .\SQLEXPRESS -E -i 01_esquema.sql
sqlcmd -S .\SQLEXPRESS -E -i 02_datos_ejemplo.sql
```

(`-E` = autenticación de Windows, sin usuario ni clave.)

## Cadena de conexión que usará el backend
```
Server=.\SQLEXPRESS;Database=AteneaDb;Trusted_Connection=True;TrustServerCertificate=True;
```
- `Trusted_Connection=True` → entra con tu usuario de Windows (sin password).
- `TrustServerCertificate=True` → evita el error de certificado SSL en local.
