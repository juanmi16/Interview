-- ============================================================
--  AteneaDb  -  DATOS DE EJEMPLO (para practicar consultas)
--  Corre esto DESPUES de 01_esquema.sql
-- ============================================================
USE AteneaDb;
GO

-- Dos usuarios de ejemplo.
-- La PasswordHash aca es de mentira ('HASH_DE_PRUEBA'): cuando armemos
-- el login real, el backend genera el hash de verdad (con BCrypt) al
-- registrar al usuario. Por ahora solo queremos datos para ver numeros.
INSERT INTO dbo.Usuarios (Nombre, Email, PasswordHash) VALUES
    ('Juanmi', 'juanmi@demo.com', 'HASH_DE_PRUEBA'),
    ('Ana',    'ana@demo.com',    'HASH_DE_PRUEBA');
GO

-- Metricas: las primeras 3 son de Juanmi (UsuarioId = 1),
-- las ultimas 2 son de Ana (UsuarioId = 2).
INSERT INTO dbo.Metricas (Titulo, Valor, UsuarioId) VALUES
    ('Ventas del mes',   15230.50, 1),
    ('Clientes nuevos',      42.00, 1),
    ('Ticket promedio',     362.63, 1),
    ('Ventas del mes',    9800.00, 2),
    ('Clientes nuevos',      17.00, 2);
GO
