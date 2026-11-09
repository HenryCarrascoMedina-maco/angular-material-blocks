/** Opciones de la demo: cada una activa algo opcional de <ui-table>. */
export type Opcion =
  | 'buscador'
  | 'filtro'
  | 'nuevo'
  | 'importar'
  | 'exportar'
  | 'acciones'
  | 'celdas'
  | 'ordenar'
  | 'paginador';

/** Genera el código de "Cómo se usa" con solo lo que está activo. */
export function generarUso(o: Record<Opcion, boolean>) {
  const s = o.ordenar ? ', sortable: true' : '';
  const tipos = ['TableColumn', o.nuevo && 'TableAction', o.acciones && 'RowAction'].filter(Boolean);
  const ts = [
    `import { Component, signal } from '@angular/core';`,
    `import { UiTable${o.celdas ? ', UiCell' : ''} } from './table/table';`,
    `import { ${tipos.join(', ')} } from './table/table.types';`,
    ``,
    `@Component({`,
    `  selector: 'app-eventos',`,
    `  imports: [UiTable${o.celdas ? ', UiCell' : ''}],`,
    `  templateUrl: './eventos.html',`,
    `})`,
    `export class Eventos {`,
    `  eventos = signal<Evento[]>([]);`,
    ``,
    `  columns: TableColumn<Evento>[] = [`,
    `    { key: 'evento', header: 'Evento', cell: e => e.titulo${s} },`,
    `    { key: 'tipo', header: 'Tipo'${s} },`,
    `    { key: 'estado', header: 'Estado'${s} },`,
    `    { key: 'responsable', header: 'Responsable', cell: e => e.responsable.nombre${s} },`,
    `  ];`,
    ...(o.nuevo
      ? [
          ``,
          `  actions: TableAction[] = [`,
          `    { label: 'Nuevo evento', icon: 'add', variant: 'filled', run: () => this.crear() },`,
          `  ];`,
        ]
      : []),
    ...(o.acciones
      ? [
          ``,
          `  rowActions: RowAction<Evento>[] = [`,
          `    { label: 'Duplicar', icon: 'content_copy', run: e => this.duplicar(e) },`,
          `    { label: 'Cancelar evento', icon: 'event_busy', run: e => this.cancelar(e),`,
          `      hidden: e => e.estado === 'Cancelado' },`,
          `  ];`,
        ]
      : []),
    ``,
    `  ver(e: Evento) { /* … */ }`,
    `  editar(e: Evento) { /* … */ }`,
    `  eliminar(e: Evento) { /* … */ }`,
    ...(o.importar ? [`  importar(archivo: File) { /* … */ }`] : []),
    `}`,
  ].join('\n');

  const attrs = [
    `[data]="eventos()"`,
    `[columns]="columns"`,
    o.nuevo && `[actions]="actions"`,
    o.acciones && `[rowActions]="rowActions"`,
    !o.buscador && `[searchable]="false"`,
    o.exportar && `exportable`,
    o.exportar && `exportFileName="eventos"`,
    o.importar && `importable`,
    !o.paginador && `[paginated]="false"`,
    `(view)="ver($event)"`,
    `(edit)="editar($event)"`,
    `(remove)="eliminar($event)"`,
    o.importar && `(import)="importar($event)"`,
  ].filter(Boolean);

  const bloques: string[][] = [];
  if (o.filtro) {
    bloques.push([
      `  <!-- Opcional: filtro propio dentro de la barra -->`,
      `  <mat-form-field uiTableFilters appearance="outline" subscriptSizing="dynamic">`,
      `    <mat-select [(value)]="tipo" placeholder="Todos los tipos"> … </mat-select>`,
      `  </mat-form-field>`,
    ]);
  }
  if (o.celdas) {
    bloques.push([
      `  <!-- Opcional: diseño propio para una columna (uiCell = key) -->`,
      `  <ng-template uiCell="estado" let-e>`,
      `    <span class="estado">{{ e.estado }}</span>`,
      `  </ng-template>`,
    ]);
  }
  const body = bloques.map((b) => b.join('\n')).join('\n\n');

  const html = [
    `<ui-table`,
    ...attrs.map((a) => `  ${a}`),
    body ? `>\n\n${body}\n</ui-table>` : `/>`,
  ].join('\n');

  return { ts, html };
}
