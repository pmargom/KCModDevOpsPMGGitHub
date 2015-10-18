# NodePop  

Máster Keepcoding Bootcamp 2015 - Módulo JavaScript, Node.js, Express, MongoDB.
Creación de un API web RESTFul para dar respuesta la prática final del módulo. Se han desarrollado las siguientes operaciones:
  - Usuarios
    - autenticación.
    - registro.
  - Anuncios
    - obtener listado (solo usuarios autenticados).
  - Tags
    - obtener listado de tags almacenados en la colección de anuncios.
  - PushTokens
    - almacenar información del usaurio para recibir notificaciones push.

### Version
0.1.0

### Detalles técnicos

NodePop usa un número de proyectos open source para funcionar correctamente:

* [node.js] - framework javascript para desarrollo de backends.
* [Express] - framework web para aplicaciones desarrolladas con node.js.
* [MongoDB] - base de datos NoSql.
* [Mongoose] - ORM para el modelado de datos.

### Instalación

Para inicializar la base de datos en mongo con información de prueba:

```sh
$ npm run initDB
```
Para iniciar la aplicación en modo dev:
```sh
$ npm run dev
```

### Localización de errores 

La aplicación permite localizar los errores devueltos. Para gestionarlos, se ha usado:

* i18n v0.5.0

### API Documentación

Existe una documentación disponible en **./doc/apiv1**. Para la generación y actualización de la misma se ha usado [ApiDocs].

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does it's job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Express]: <http://expressjs.com>
   [node.js]: <http://nodejs.org>
   [MongoDB]: <https://www.mongodb.com>
   [Mongoose]: <http://mongoosejs.com>
   [ApiDocs]: <http://apidocjs.com>




