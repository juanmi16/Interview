# Arquitectura del proyecto — Atenea (React + .NET + SQL Server)

Documento para **entender** el proyecto. Lenguaje simple, sin rodeos.
Releélo las veces que haga falta.

---

## 1. Qué estamos construyendo

Una app web donde una persona **se loguea** y ve **sus números** (métricas)
en un panel (dashboard). Cada usuario ve **solo lo suyo**.

Ese es el esqueleto de casi cualquier app profesional: login + datos por
usuario. Si lo entendés a fondo, te sirve para la entrevista **y** como base
del proyecto serio a futuro.

---

## 2. El dibujo (grabate esto)

```
   NAVEGADOR DEL USUARIO
   ┌───────────────────────────┐
   │   FRONTEND  (React+Vite)   │   <- la PANTALLA. Corre en localhost:5173
   │   Login  |  Dashboard      │
   └─────────────┬─────────────┘
                 │  pide datos por HTTP (mensajes con JSON)
                 │  manda el "token" para probar quién es
                 ▼
   ┌───────────────────────────┐
   │   BACKEND  (.NET Web API)  │   <- la LÓGICA y la SEGURIDAD. localhost:5xxx
   │   Controllers → Services   │
   │           → Data (EF Core) │
   └─────────────┬─────────────┘
                 │  consultas SQL
                 ▼
   ┌───────────────────────────┐
   │   BASE DE DATOS            │   <- donde VIVEN los datos
   │   SQL Server: AteneaDb │
   │   Tablas: Usuarios, Metricas│
   └───────────────────────────┘
```

**Son DOS programas separados** (frontend y backend) corriendo a la vez, en
puertos distintos, que se hablan por HTTP. La base de datos es un tercer
servicio. Entender esta separación ya te pone por delante en la entrevista.

**El flujo completo, en una línea:**
> React manda email+clave → .NET verifica y devuelve un *token* → React guarda
> el token → React pide `/mis-metricas` mandando el token → .NET responde
> **solo** los números de ese usuario → React los pinta.

---

## 3. Las tres partes

### `backend/` — el .NET (ASP.NET Core Web API)
El cerebro. No tiene pantalla. Expone **endpoints** (URLs) que devuelven o
reciben datos en formato **JSON**. Acá vive la seguridad: valida el login,
genera el token, y decide qué puede ver cada usuario.

### `frontend/` — el React (Vite + TypeScript)
La cara visible. Formularios, botones, tablas, gráficos. **No sabe nada de la
base de datos**: cada vez que necesita algo, se lo *pide* al backend.

### `database/` — SQL Server
Donde se guardan los datos de verdad, aunque apagues todo. El backend le habla
con consultas SQL (a través de EF Core).

---

## 4. El backend por dentro: 3 PROYECTOS separados (Clean Architecture)

Un profesional NO mete todo en un solo proyecto: separa las capas en
**proyectos independientes** (librerías). Nuestro backend son 3:

| Proyecto | Rol (en simple) | Depende de |
|---|---|---|
| **Atenea.Domain** | El **corazón**: entidades (`Usuario`, `Metrica`) + contratos (interfaces). No sabe que existe una base de datos ni una API. | **NADA** |
| **Atenea.Infrastructure** | Los **datos**: EF Core, `AppDbContext`, repositorios. Es quien realmente toca SQL Server. | Domain |
| **Atenea.Api** | La **cara**: controllers, DTOs, `Program.cs`. Recibe los pedidos HTTP. | Domain + Infrastructure |

### La REGLA DE ORO (esto te lo preguntan en la entrevista)
**Las dependencias apuntan HACIA ADENTRO, al Domain.** El Domain no depende de
nadie; Infrastructure y Api dependen del Domain, nunca al revés.

```
   Atenea.Api  ───────►  Atenea.Infrastructure
        │                       │
        ▼                       ▼
             Atenea.Domain                 (el centro; no depende de NADA)
```

¿Por qué importa? Porque mañana podés cambiar SQL Server por PostgreSQL, o EF
por otra cosa: tocás **solo Infrastructure**, y el Domain (las reglas del
negocio) ni se entera. Eso se llama **inversión de dependencias**, y es de las
cosas que separan a un junior de un senior.

### Qué hay en cada proyecto
```
Atenea.Domain/
  Entities/     -> Usuario.cs, Metrica.cs (espejo de las tablas)
  Interfaces/   -> contratos (ej. IMetricaRepository): el "qué", no el "cómo"

Atenea.Infrastructure/
  Data/         -> AppDbContext: la conexión EF Core a SQL Server
  Repositories/ -> implementaciones que sí tocan la base: el "cómo"

Atenea.Api/
  Controllers/  -> reciben los pedidos HTTP y responden
  Dtos/         -> objetos "de transporte": lo que entra/sale por la API
  Program.cs    -> el arranque: enchufa todo (base, CORS, auth, DI)
  appsettings.json -> configuración (la cadena de conexión, etc.)
```

**¿Por qué DTOs y no mandar la entidad directa?**
La entidad `Usuario` tiene el `PasswordHash`. Si la devolvés tal cual por la
API, estás filtrando datos sensibles. El **DTO** (Data Transfer Object) es una
versión "para afuera" con solo lo que se puede mostrar. Suma mucho en entrevista.

---

## 5. EF Core y el puente con tu SQL

**EF Core** es un *ORM*: traduce entre **clases de C#** y **tablas de SQL**.
Vos trabajás con objetos (`usuario.Nombre`) y EF arma el SQL por vos.

Elegimos **Code-First**: escribís las clases C#, y con un comando
(*migración*) EF crea/actualiza las tablas.

```
Clase C#  ──(EF Code-First)──►  Tabla SQL
  Usuario                          dbo.Usuarios
    Id                               Id  INT PK IDENTITY
    Nombre                           Nombre NVARCHAR(100)
    Email                            Email  NVARCHAR(200) UNIQUE
```

Como vos ya sabés SQL, en `database/01_esquema.sql` tenés el SQL **equivalente**
a mano, para ver qué genera EF por debajo. (No corras ese script contra la misma
base que use EF; es para leer y practicar. Ver `database/README.md`.)

---

## 6. El frontend por dentro

Cuando lo armemos, `frontend/src/` va a tener:
```
api/         -> funciones que llaman al backend (login(), getMetricas())
pages/       -> pantallas completas: LoginPage, DashboardPage
components/   -> piezas reutilizables (una tarjeta de número, una tabla)
context/     -> estado global: "quién está logueado" y el token
types/       -> tipos TypeScript (Usuario, Metrica) para no equivocarse
App.tsx      -> arma las rutas (qué se ve en cada URL)
main.tsx     -> el punto de arranque de React
```

---

## 7. El modelo de datos

Dos tablas, relación **1 a muchos**: un `Usuario` tiene muchas `Metricas`.

```
Usuarios                         Metricas
--------                         --------
Id (PK)  ◄─────────────┐         Id (PK)
Nombre                 └──────── UsuarioId (FK)   (apunta a Usuarios.Id)
Email (unique)                   Titulo
PasswordHash                     Valor
FechaCreacion                    Fecha
```

- **PK** (Primary Key): identifica cada fila de forma única.
- **FK** (Foreign Key): `Metricas.UsuarioId` "apunta" a un usuario. Así se sabe
  de quién es cada número.

---

## 8. Cómo correr cada parte

**Backend (.NET):**
```bash
cd backend/Atenea.Api
dotnet run
```
Te va a decir en qué `http://localhost:PUERTO` quedó escuchando.

**Frontend (React):**
```bash
cd frontend
npm run dev
```
Abre en `http://localhost:5173`.

**Los dos a la vez:** cada uno en su propia terminal. Son programas separados.

---

## 9. Glosario rápido

- **API**: puerta de entrada del backend; conjunto de URLs que devuelven datos.
- **Endpoint**: una URL concreta de la API (ej. `POST /api/auth/login`).
- **HTTP**: el "idioma" de pedidos/respuestas entre frontend y backend.
- **JSON**: formato de texto para mandar datos (`{ "nombre": "Juanmi" }`).
- **DTO**: objeto de transporte; lo que entra/sale por la API (sin datos sensibles).
- **ORM / EF Core**: traductor entre clases C# y tablas SQL.
- **Migración**: comando que hace que la base coincida con tus clases.
- **Token / JWT**: credencial temporal que prueba quién sos en cada pedido.
- **CORS**: permiso para que el frontend (puerto 5173) pueda llamar al backend
  (otro puerto). Hay que activarlo o el navegador bloquea las llamadas.
- **Hash**: transformación irreversible de la clave. Se guarda el hash, nunca
  la clave real.

---

## 10. Roadmap (5 pasos)

- [x] **Paso 1 — Esqueleto** *(HECHO)*: proyectos creados, backend compila,
      frontend instala, scripts SQL y esta doc listos.
- [ ] **Paso 2 — Primer número** *(EN CURSO)*: entidades `Usuario` y `Metrica` ✅;
      falta `AppDbContext` + primer endpoint que devuelve métricas y React que las pinta.
- [ ] **Paso 3 — Base de datos real**: migración EF → tablas en SQL Server;
      los números salen de la base.
- [ ] **Paso 4 — Login**: registro/login, hash de la clave, token JWT; cada
      usuario ve solo lo suyo.
- [ ] **Paso 5 — Pulido + preguntas típicas de entrevista.**
