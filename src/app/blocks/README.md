# `blocks/` · Los componentes que se copian

Cada carpeta es un componente **independiente**: no importa nada de `demo/` ni de otros bloques.
Para usar uno, copia su carpeta a tu proyecto. Requisito: `ng add @angular/material`.

| Carpeta     | Componente                         | Estado       |
| ----------- | ---------------------------------- | ------------ |
| `table/`    | `<ui-table>` · tabla genérica      | ✅ Listo     |
| `skeleton/` | `<ui-skeleton>` + `*uiLoading`     | Próximamente |
| `form/`     | `<ui-form>` · ver / editar / crear | Próximamente |
| `dialogs/`  | `<ui-confirm>`                     | Próximamente |

## Estructura de un bloque

```
table/
├── table.ts         ← componente (y sus directivas pequeñas, si las tiene)
├── table.html
├── table.scss
└── table.types.ts   ← interfaces y tipos públicos
```

Convención de Angular 20+: sin sufijo `.component` en archivos ni clases (`table.ts`, `UiTable`).

---

## `table/` · `<ui-table>`

```ts
import { UiTable, UiCell } from './table/table';
import { TableColumn, TableAction, RowAction } from './table/table.types';

@Component({ imports: [UiTable, UiCell] /* … */ })
export class Eventos {
  eventos = signal<Evento[]>([]);

  columns: TableColumn<Evento>[] = [
    { key: 'titulo', header: 'Evento', sortable: true },
    { key: 'responsable', header: 'Responsable', cell: (e) => e.responsable.nombre },
  ];

  actions: TableAction[] = [
    { label: 'Nuevo evento', icon: 'add', variant: 'filled', run: () => this.crear() },
  ];

  rowActions: RowAction<Evento>[] = [
    { label: 'Duplicar', icon: 'content_copy', run: (e) => this.duplicar(e) },
  ];
}
```

```html
<ui-table
  [data]="eventos()"
  [columns]="columns"
  [actions]="actions"
  [rowActions]="rowActions"
  exportable
  exportFileName="eventos"
  importable
  (view)="ver($event)"
  (edit)="editar($event)"
  (remove)="eliminar($event)"
  (import)="importar($event)"
>
  <!-- Opcional: filtros propios dentro de la barra -->
  <mat-form-field uiTableFilters appearance="outline" subscriptSizing="dynamic">…</mat-form-field>

  <!-- Opcional: diseño propio para una columna (uiCell = key) -->
  <ng-template uiCell="titulo" let-e>
    <strong>{{ e.titulo }}</strong>
  </ng-template>
</ui-table>
```

| Entrada / salida                      | Tipo                 | Para qué                                                                       |
| ------------------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `[data]`                              | `T[]`                | Las filas                                                                      |
| `[columns]`                           | `TableColumn<T>[]`   | `key`, `header`, `cell?`, `sortable?`, `width?`, `align?`                      |
| `[actions]`                           | `TableAction[]`      | Botones de la barra superior                                                   |
| `[rowActions]`                        | `RowAction<T>[]`     | Acciones extra del menú ⋮ (Eliminar siempre va al final)                       |
| `[searchable]`                        | `boolean`            | Muestra el buscador. Por defecto `true`                                        |
| `[paginated]`                         | `boolean`            | Muestra el paginador. Por defecto `true`                                       |
| `[pageSizes]`                         | `number[]`           | Opciones del paginador. Por defecto `[5, 10, 25]`                              |
| `[exportable]` · `[exportFileName]`   | `boolean` · `string` | Botón **Exportar**: descarga en CSV lo filtrado y ordenado (todas las páginas) |
| `[importable]` · `[importAccept]`     | `boolean` · `string` | Botón **Importar**: abre el selector de archivos (`.csv,.json` por defecto)    |
| `[searchPlaceholder]` · `[emptyText]` | `string`             | Textos                                                                         |
| `(view)` · `(edit)` · `(remove)`      | `T`                  | Las tres acciones fijas. Emiten la fila                                        |
| `(import)`                            | `File`               | El archivo elegido en **Importar**. Tú decides cómo leerlo                     |
| `<ng-template uiCell="key" let-row>`  | plantilla            | Diseño propio para una columna                                                 |
| `[uiTableFilters]`                    | atributo             | Lo que lo lleve aparece dentro de la barra superior                            |

**Personalizar:** colores con `mat.theme` en tu `styles.scss`; altura de filas y colores de la tabla
con `mat.table-overrides(...)` en `table.scss`.

**Paginador en español (opcional):** copia `src/app/demo/shared/paginator-intl-es.ts` y añade
`providePaginatorEs()` a los providers de tu `app.config.ts`.

**Con los datos de tu backend:** la tabla recibe un array de cualquier tipo, así que basta con un
`httpResource` (necesita `provideHttpClient()` en `app.config.ts`). Ejemplo completo en
`src/app/demo/pages/eventos-api/` (ruta `/eventos`, datos de `public/api/eventos.json`):

```ts
protected readonly eventos = httpResource<Evento[]>(() => 'api/eventos', { defaultValue: [] });
```

```html
<!-- hasValue(): si la API falla, value() lanza un error -->
<ui-table [data]="eventos.hasValue() ? eventos.value() : []" [columns]="columns" />
```

---

## Reglas para añadir un bloque nuevo

1. Solo `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/material` y `@angular/cdk`.
2. Prefijo `ui-` en los selectores y `Ui` en las clases (`<ui-table>`, `UiTable`).
3. Signals (`input()`, `output()`, `computed`), `OnPush` y control flow (`@if`, `@for`).
4. Colores siempre con variables `--mat-sys-*`, nunca fijos.
5. Su página en `src/app/demo/pages/`, sus tests allí también, y su entrada en `src/app/demo/catalog.ts`.
6. Su sección en este README.
