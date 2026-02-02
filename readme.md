# Inicialización del Proyecto – Gestión de Cupones (Oppa)

Este proyecto corresponde a un backend desarrollado en **Node.js + Express**, que utiliza **Firestore Emulator** para modelar y validar la funcionalidad de **Gestión de Cupones** del proyecto Oppa.

El objetivo principal es validar el **modelamiento de datos y las consultas necesarias para el dashboard administrativo**, sin desarrollar una interfaz gráfica.

---

## 📦 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **Firebase CLI**
  ```bash
  npm install -g firebase-tools
  ```
- **Java (JDK)** – requerido por Firestore Emulator
  ```bash
  java -version
  ```

---

## 📁 Estructura del proyecto

```
modelamiento/
├── src/
│   ├── server.js              # Entry point de la API
│   ├── firestore.js           # Configuración Firestore Emulator
│   └── routes/
│       ├── seed.routes.js     # Inserción de datos por endpoint
│       ├── dashboard.routes.js# Queries del dashboard
│       └── coupons.routes.js  # CRUD de cupones
├── data/
│   └── seed.json              # Datos de prueba
├── firebase.json              # Configuración de emuladores
├── .firebaserc                # projectId local
├── package.json
└── README.md
```

> ⚠️ La carpeta `node_modules` **no debe incluirse** en la entrega.

---

## ⚙️ Instalación del proyecto

Desde la carpeta raíz del proyecto:

```bash
npm install
```

---

## 🔥 Levantar Firestore Emulator

En una terminal, desde la raíz del proyecto:

```bash
firebase emulators:start
```

Servicios disponibles:
- Firestore Emulator: `http://127.0.0.1:8080`
- Emulator UI: `http://127.0.0.1:4000`

⚠️ **No cerrar esta terminal** mientras el proyecto esté en uso.

---

## 🖥️ Levantar la API Node.js

En **otra terminal**, desde la raíz del proyecto:

```bash
npm run dev
```

La API se levantará en:

```
http://127.0.0.1:3000
```

Endpoint de prueba:
```
GET /health
```

---

## 📥 Cargar datos de prueba (seed)

Con el emulador y la API levantados, ejecutar:

### PowerShell
```powershell
Invoke-RestMethod -Uri http://127.0.0.1:3000/seed/load -Method POST
```

Esto cargará los datos definidos en `data/seed.json` en Firestore Emulator.

---

## 👀 Visualizar datos en Firestore

Abrir en el navegador:

```
http://127.0.0.1:4000/firestore
```

Colecciones creadas:
- `cupones`
- `usos`

---

## 📊 Consultar información del dashboard

Para obtener los datos del dashboard administrativo:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:3000/dashboard/coupons -Method GET
```

El endpoint retorna:
- código del cupón
- estado
- tipo y valor de descuento
- vigencia
- cantidad de usos
- servicios asociados (IDs)

---

## 🧠 Consideraciones importantes

- El proyecto trabaja **solo con Firestore Emulator**, no con Firestore real.
- La entidad **servicios no está modelada aún**; se utilizan identificadores (`id_servicio`) como strings.
- Toda la inserción de datos se realiza **exclusivamente mediante endpoints**, según lo solicitado.

---

## ✅ Estado del proyecto

- ✔ Firestore Emulator operativo
- ✔ API Express funcional
- ✔ Inserción por endpoint
- ✔ Queries del dashboard validadas
- ✔ Estructura ordenada (`src/` como entry point)

---


