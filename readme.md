# Backend Gestión de Cupones -- Oppa

Backend desarrollado en **Node.js + Express + Firestore Emulator**,
enfocado en el modelamiento de datos y consultas necesarias para el
dashboard administrativo del sistema de cupones de Oppa.

El proyecto está orientado a validar estructura, arquitectura por capas
y consultas complejas, trabajando exclusivamente en entorno local
mediante Firebase Emulator.

------------------------------------------------------------------------

#  Requisitos Previos

-   Node.js v18 o superior
-   Firebase CLI npm install -g firebase-tools
-   Java (requerido por Firestore Emulator) java -version

------------------------------------------------------------------------

#  Estructura del Proyecto

oppa-modelamiento-backend/
│
├── src/
│   ├── config/
│   │   └── firestore.js        # Configuración y conexión a Firestore
│   │
│   ├── controllers/            # Manejo de request/response
│   ├── services/               # Lógica de negocio
│   ├── repositories/           # Acceso a datos (Firestore)
│   ├── routes/                 # Definición de endpoints
│   │
│   ├── utils/
│   │   └── mock.js             # Datos mock utilizados para seed
│   │
│   └── server.js               # Entry point de la aplicación
│
├── scripts/
│   └── seedFirestore.js        # Script de carga masiva de datos
│
├── firebase.json               # Configuración de emuladores
├── .firebaserc                 # projectId local
├── package.json
└── README.md


------------------------------------------------------------------------

#  Instalación

Desde la raíz del proyecto:

npm install

------------------------------------------------------------------------

# Levantar Firestore Emulator

firebase emulators:start

Servicios disponibles:

-   Firestore: http://127.0.0.1:8080
-   Emulator UI: http://127.0.0.1:4000

------------------------------------------------------------------------

# Levantar la API

npm run dev

API disponible en: http://localhost:3000

Endpoint de prueba: GET /health

------------------------------------------------------------------------

# Cargar Datos de Prueba (Seed)

La carga de datos se realiza ejecutando el script:

node scripts/seedFirestore.js

Este script inserta datos en las siguientes colecciones:

-   coleccion-cupon
-   coleccion-servicio
-   coleccion_usos
-   usuarios

Los datos mock se encuentran en: src/utils/mock.js

------------------------------------------------------------------------

#  Visualizar Datos

Abrir: http://127.0.0.1:4000/firestore

------------------------------------------------------------------------

#  Arquitectura Implementada

-   Routes → Definen endpoints
-   Controllers → Manejan request/response
-   Services → Lógica de negocio
-   Repositories → Acceso a Firestore
-   Config → Configuración base de datos
-   Utils → Datos mock y helpers

------------------------------------------------------------------------

#  Funcionalidades

✔ Firestore Emulator operativo\
✔ Arquitectura modular por capas\
✔ Seed automatizado mediante script\
✔ Inserción masiva con batch\
✔ Modelamiento desacoplado

------------------------------------------------------------------------

#  Objetivo

Validar modelamiento de datos, consultas para dashboard administrativo y
correcta separación de responsabilidades en backend profesional.
