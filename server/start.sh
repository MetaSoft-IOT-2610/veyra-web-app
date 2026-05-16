#!/usr/bin/env bash
# Mock backend para Veyra (json-server 0.17.4).
# Sirve TODOS los bounded contexts en un único json-server (puerto 3000),
# porque las vistas hacen joins en runtime entre contexts
# (monitoring = nursing + profiles + rooms), por lo que deben compartir una sola DB.
#
# Uso:
#   1) Copia db.json y routes.json a la carpeta /server del proyecto.
#   2) bash server/start.sh
#   3) En otra terminal: npm start   (ng serve usa environment.development.ts)
#
# Requiere environment.development.ts parcheado (ambas base URLs -> :3000).

json-server --watch db.json --routes routes.json --port 3000
