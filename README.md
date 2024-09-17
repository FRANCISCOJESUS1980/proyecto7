PROYECTOAPI REST AUTH

Este proyecto es una API para la gestion de usuarios y publicaciones, desarrollado con Express y MongoDB, cumpliendo los requisitos de seguridad, autenticacion y permisos para usuarios con roles distintos (usuario, administrador)

se ha creado una base de datos con mongo y un archivo .env donde meto la clave y la bbdd

ENDPOINTS

Usuarios
-POST /api/users/register
-registro de un usuario
-cuerpo
-POST /api/users/login
-iniciar sesion
-cuerpo
-GET /api/users/
-obtener todos los usuarios (solo administradores)
-requiere token
-PUT /api/users/:id
-actualizar el rol de un usuario (solo administradores)
-requiere token
-DELETE /api/users/:id
-eliminar un usuario (solo administradores o el propio usuario)
-requiere token

    POSTS
     -POST /api/posts/
      -crear un nuevo post (requiere autorizacion)
      -cuerpo

-GET /api/posts/
-obtener todos los posts

-PUT /api/posts/:id
-actualizar el post (solo el creador del post)
-requiere token
-DELETE /api/posts/:id
-eliminar un post (solo el creador del post)
-requiere token

      SEGURIDAD Y ROLES

      Los usuarios solo pueden ser creados con rol "user".
      El primer administrador se debe crear directamente en la base de datos.
      Los administradores pueden modificar roles y eliminar usuarios.
      Los usuarios pueden eliminar sus propias cuentas.

      AUTENTICACION
      Se utiliza JWT para la autenticación. Los tokens deben enviarse en el encabezado
