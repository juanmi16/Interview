-- ============================================================
--  AteneaDb  -  ESQUEMA (la estructura de las tablas)
--  Motor: SQL Server Express
--
--  IMPORTANTE (para entender, no para pelear):
--  Esto es EXACTAMENTE lo que EF Core va a generar por debajo
--  cuando hagamos "Code-First" en el backend. Lo escribo en SQL
--  puro para que VEAS lo que pasa. Cuando conectemos EF, EF sera
--  el "dueno" del esquema (crea/actualiza tablas con migraciones),
--  asi que NO corras este script contra la misma base que use EF
--  para no chocar. Sirve para leer, aprender y practicar SQL.
-- ============================================================

-- 1) Crear la base solo si no existe
IF DB_ID('AteneaDb') IS NULL
    CREATE DATABASE AteneaDb;
GO

USE AteneaDb;
GO

-- 2) Tabla de USUARIOS  (quien se loguea a la app)
IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuarios (
        Id            INT            IDENTITY(1,1) NOT NULL,   -- se autoincrementa solo
        Nombre        NVARCHAR(100)  NOT NULL,
        Email         NVARCHAR(200)  NOT NULL,
        PasswordHash  NVARCHAR(500)  NOT NULL,                 -- OJO: guardamos el HASH, nunca la clave en texto
        FechaCreacion DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_Usuarios PRIMARY KEY (Id),
        CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)            -- no se repiten emails
    );
END
GO

-- 3) Tabla de METRICAS  (los "numeros" que ve cada usuario)
IF OBJECT_ID('dbo.Metricas', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Metricas (
        Id        INT            IDENTITY(1,1) NOT NULL,
        Titulo    NVARCHAR(150)  NOT NULL,
        Valor     DECIMAL(18,2)  NOT NULL,
        Fecha     DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
        UsuarioId INT            NOT NULL,                      -- a QUE usuario pertenece esta metrica

        CONSTRAINT PK_Metricas PRIMARY KEY (Id),
        CONSTRAINT FK_Metricas_Usuarios FOREIGN KEY (UsuarioId)
            REFERENCES dbo.Usuarios (Id) ON DELETE CASCADE      -- si borro el usuario, se borran sus metricas
    );
END
GO

-- 4) Indice para buscar rapido "las metricas de tal usuario"
--    (es la consulta que el backend hara en cada login)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Metricas_UsuarioId')
    CREATE INDEX IX_Metricas_UsuarioId ON dbo.Metricas (UsuarioId);
GO
