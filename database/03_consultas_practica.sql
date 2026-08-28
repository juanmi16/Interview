-- ============================================================
--  AteneaDb  -  CONSULTAS DE PRACTICA
--  Estas son las mismas ideas que el backend va a ejecutar.
--  Corre bloque por bloque y mira los resultados.
-- ============================================================
USE AteneaDb;
GO

-- (A) Todos los usuarios
SELECT * FROM dbo.Usuarios;

-- (B) Todas las metricas junto al NOMBRE de su dueno  --> esto es un JOIN
SELECT u.Nombre, m.Titulo, m.Valor, m.Fecha
FROM dbo.Metricas AS m
INNER JOIN dbo.Usuarios AS u ON u.Id = m.UsuarioId
ORDER BY u.Nombre, m.Titulo;

-- (C) SOLO las metricas de Juanmi (Id = 1)
--     ESTA es la consulta clave: tras el login, el backend filtra
--     por el Id del usuario logueado, para que nadie vea lo ajeno.
SELECT m.Titulo, m.Valor
FROM dbo.Metricas AS m
WHERE m.UsuarioId = 1;

-- (D) Total de "Ventas del mes" por usuario  --> GROUP BY + SUM
SELECT u.Nombre, SUM(m.Valor) AS TotalVentas
FROM dbo.Metricas AS m
INNER JOIN dbo.Usuarios AS u ON u.Id = m.UsuarioId
WHERE m.Titulo = 'Ventas del mes'
GROUP BY u.Nombre;

-- (E) Cuantas metricas tiene cada usuario  --> COUNT
SELECT u.Nombre, COUNT(*) AS CantidadMetricas
FROM dbo.Usuarios AS u
LEFT JOIN dbo.Metricas AS m ON m.UsuarioId = u.Id
GROUP BY u.Nombre;
