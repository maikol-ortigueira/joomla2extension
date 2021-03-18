# Joomla to Extension

## ¿Porque?

Yo dedico parte de mi tiempo a programar extensiones personalizadas para Joomla!. Necesito tener dichas extensiones organizadas para poder empaquetar y crear un fichero autoinstalable.

Si eres desarrollador de componentes en Joomla sabrás que el paquete instalador de tu componente debe tener una estructura de carpetas y archivos específica, que no coincide exactamente con la estructura del componente una vez instalado en un sitio Joomla!. Hasta la fecha yo solucionaba este problema con mi "[joomla-gulp-system](https://github.com/maikol-ortigueira/joomla-gulp-system)".

Este sistema me permite crear las carpetas y los archivos de mi extensión en una carpeta fuera de la instalación de Joomla y según voy modificando el código este se actualiza automáticamente en la instalación Joomla de pruebas.

Esto está bastante bien pero tiene algún inconveniente, y sin duda el más importante es que siempre hay que depurar el código dentro de la instalación de joomla (lógico) lo que me obliga a tener continuamente abiertos ambos frentes (el código dentro de mi instalación y el código dentro de mi carpeta final).

Pues bien, con mi Joomla2Extension realizo la automátización al revés, es decir, vigila mi extensión dentro de la instalación de Joomla y actualiza los cambios en mi carpeta final. Esto permite que solo tenga que trabajar dentro de la instalación de Joomla.

Es cierto que esto hace un poco mas complicado actualizar los ficheros de idiomas, pero espero solucionar esto pronto.

## ¿Como se instala?

La siguiente configuración funciona con un linux ubuntu 20.04 (entiendo que debería funcionar también con mac y windows).

Debes tener instalado node.js (primero) y gulp, si no es así puedes obtener mas información de como instalar ambos sistemas en [node.js](https://nodejs.org/) y [gulpjs.com](https://gulpjs.com/docs/en/getting-started/quick-start/).

Debes clonar este repositorio en una carpeta de tu equipo, abrir una terminal dentro del repositorio clonado y escribir `npm install`. Esto instalará los paquetes necesarios para que mi sistema funcione.

Una vez termine la instalación de paquetes debes realizar un par de configuraciones.

## ¿Como configurar?

Verás que dentro del repositorio existen dos ficheros con la extension `.dist` que son `config.json.dist` y `extensions-config.json.dist`.

### config.json.dist

Debes renombrar este fichero suprimiendo `.dist` y dentro de dicho fichero tendrás que indicar:

```bash
{
    "extName": "nombre_de_la_extension_sin_prefijo",
    "srcDir": "ruta_absoluta_instalacion_joomla",
    "destDir": "ruta_absoluta_destino_codigo_extension"
}
```

Este fichero finalmente se llamará **config.json** y estará en la misma carpeta que config.json.dist

### extensions-config.json.dist

**¡¡OJO!!** te recomiendo que este fichero lo copies (no simplemente renombrar) ya que podrías volver a necesitarlo.
Debes copiar y pegar en la carpeta final de tu extensión, renombrarlo quitando la extensión `.dist` y configurarlo.

Debes indicar:

```bash
{
    "components": ["nombre_del_componente"],
    "plugins": {
        "system": ["nombre_del_plugin_de_sistema", "otro_nombre_distinto_de_plugin_de_sistema"],
        "content": ["nombre_del_plugin_de_contenido"]
    },
    "modules": {
        "site": ["todavia_no_implementado"],
        "admin": ["todavia_no_implementado"]
    },
    "package": "un_nombre_para_el_paquete_opcional_y_solo_uno"
}
```

Este fichero finalmente se llamará **extensions-config.dist** y para saber donde debe estar este fichero tendrás que **revisar el fichero config.json** que acabas de configurar.

El destino de dicho fichero vendrá determinado por `ruta_absoluta_destino_codigo_extension/nombre_de_la_extension_sin_prefijo`.

## ¿Como funciona?
Si todo está bien configurado podrás listar las tareas con el comando `gulp --tasks`.

Con el comando `gulp` el sistema vigilará el código tus extensiones (sólo de las extensiones añadidas al fichero extensions-config.json) y actualizará los cambios en la carpeta final de tus extensiones.


## Proximamente

- Pretendo crear una tarea que empaquete las extensiones listas para instalar en un Joomla!.

## Despedida

Espero que este sistema te ayude en tus desarrollos.
