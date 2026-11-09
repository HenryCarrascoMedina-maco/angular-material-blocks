# angular-material-blocks

Componentes de **Angular Material** listos para copiar. Sin dependencias extra, con signals.
Cada componente se construye paso a paso en un vídeo del canal.

- **Angular 22** · **Angular Material 22** · Standalone · Signals · `OnPush`
- Solo `@angular/material` y `@angular/cdk`. Ninguna otra librería.

## Usar un componente en tu proyecto

1. Instala Angular Material: `ng add @angular/material`
2. Copia la carpeta del bloque, por ejemplo `src/app/blocks/table`, a tu proyecto.
3. Impórtalo y úsalo. [`src/app/blocks/README.md`](src/app/blocks/README.md) tiene el ejemplo y la API de cada uno.

El código es tuyo: cámbialo como quieras.

| Bloque | Qué hace | Estado |
|---|---|---|
| [`table`](src/app/blocks/README.md#table--ui-table) | Tabla con buscador, filtros, celdas con plantilla, acciones, menú ⋮, orden y paginación | ✅ |
| `skeleton` | Skeleton para cada componente + directiva `*uiLoading` | Próximamente |
| `form` | Formulario para ver, editar y crear | Próximamente |
| `dialogs` | Diálogo de confirmación | Próximamente |

## Estructura

```
src/app/
├── blocks/            ← LOS COMPONENTES: cada carpeta se copia tal cual
│   └── table/
│       ├── table.ts          ← componente + directiva uiCell
│       ├── table.html
│       ├── table.scss
│       └── table.types.ts    ← interfaces
└── demo/              ← la app que enseña cada bloque (no hace falta copiarla)
    ├── catalog.ts     ← lista de bloques del menú y del inicio
    ├── data/          ← datos de ejemplo
    ├── home/
    ├── pages/         ← una página por bloque
    └── shared/
```

## Ejecutar la demo

```bash
npm install
npm start          # http://localhost:4200
npm test           # tests (Vitest)
npm run build
```

## Añadir un bloque nuevo

Lee [`src/app/blocks/README.md`](src/app/blocks/README.md): reglas, nombres y checklist.

## Licencia

MIT
