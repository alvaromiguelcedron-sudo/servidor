
# API REST de Tareas y Categorías

API REST desarrollada con Node.js, Express y MongoDB para gestionar usuarios, tareas y categorías. Incluye autenticación mediante JSON Web Tokens (JWT).

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB y Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- pnpm

## Requisitos previos

- Node.js instalado.
- pnpm instalado.
- Una instancia de MongoDB disponible.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/alvaromiguelcedron-sudo/servidor.git
   ```

2. Entrar en la carpeta del proyecto:

   ```bash
   cd servidor
   ```

3. Instalar las dependencias:

   ```bash
   pnpm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   PORT=3000
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_seguro
   ```

   Reemplazá los valores de ejemplo por tu configuración real. No subas el archivo `.env` a GitHub.

## Ejecución

Iniciar el servidor en modo desarrollo:

```bash
pnpm dev
```

Iniciar el servidor normalmente:

```bash
pnpm start
```

La API estará disponible en:

`http://localhost:3000`

La ruta principal es:

`GET /`

## Autenticación

### Registrar usuario

`POST /api/auth/register`

Ejemplo de cuerpo JSON:

```json
{
  "username": "Usuario Ejemplo",
  "email": "usuario@example.com",
  "password": "UnaClaveSegura123"
}
```

### Iniciar sesión

`POST /api/auth/login`

Ejemplo de cuerpo JSON:

```json
{
  "email": "usuario@example.com",
  "password": "UnaClaveSegura123"
}
```

El inicio de sesión devuelve un token JWT. Para acceder a las rutas protegidas, enviá el encabezado:

`Authorization: Bearer TU_TOKEN_JWT`

## Endpoints de categorías

Todas estas rutas requieren autenticación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categories` | Listar categorías |
| GET | `/api/categories/:id` | Obtener una categoría |
| POST | `/api/categories` | Crear una categoría |
| PUT | `/api/categories/:id` | Actualizar una categoría |
| DELETE | `/api/categories/:id` | Eliminar una categoría |

Ejemplo para crear una categoría:

```json
{
  "nombre": "Estudio",
  "estado": true
}
```

## Endpoints de tareas

Todas estas rutas requieren autenticación. Cada usuario administra sus propias tareas.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tasks` | Listar tareas |
| GET | `/api/tasks/:id` | Obtener una tarea |
| POST | `/api/tasks` | Crear una tarea |
| PUT | `/api/tasks/:id` | Actualizar una tarea |
| DELETE | `/api/tasks/:id` | Eliminar una tarea |

Ejemplo para crear una tarea:

```json
{
  "titulo": "Estudiar backend",
  "descripcion": "Practicar API REST",
  "completada": false,
  "categoria": null
}
```

El campo `categoria` puede contener el ID de una categoría existente o `null`.

## Validaciones y seguridad

- Validación de los datos recibidos.
- Contraseñas protegidas mediante bcrypt.
- Autenticación con JWT.
- Normalización de correos electrónicos.
- Manejo de errores y respuestas HTTP.
- Restricción de acceso a las tareas por usuario.
- Variables de entorno para la configuración sensible.

## Autor

Álvaro Cedrón
