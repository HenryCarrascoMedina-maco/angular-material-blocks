import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RowAction, TableAction, TableColumn } from './table.types';

/**
 * Plantilla propia para una columna. `uiCell` = key de la columna.
 *
 * <ng-template uiCell="titulo" let-row> <strong>{{ row.titulo }}</strong> </ng-template>
 */
@Directive({ selector: 'ng-template[uiCell]' })
export class UiCell {
  readonly name = input.required<string>({ alias: 'uiCell' });
  readonly template = inject(TemplateRef);
}

/**
 * Tabla genérica de Angular Material: buscador, botones, importar/exportar,
 * columnas configurables, celdas con plantilla, acciones fijas (ver, editar,
 * menú ⋮ con eliminar), ordenación y paginación.
 */
@Component({
  selector: 'ui-table',
  imports: [
    NgTemplateOutlet,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTable<T> {
  // Entradas: lo que configura quien usa la tabla
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly actions = input<TableAction[]>([]);
  readonly rowActions = input<RowAction<T>[]>([]);
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Buscar…');
  readonly paginated = input(true, { transform: booleanAttribute });
  readonly pageSizes = input([5, 10, 25]);
  readonly emptyText = input('Sin resultados');

  /** Botón "Exportar": descarga en CSV lo que se ve (filtrado y ordenado). */
  readonly exportable = input(false, { transform: booleanAttribute });
  readonly exportFileName = input('datos');
  /** Botón "Importar": abre el selector de archivos y emite (import) con el archivo. */
  readonly importable = input(false, { transform: booleanAttribute });
  readonly importAccept = input('.csv,.json');

  // Salidas
  readonly view = output<T>();
  readonly edit = output<T>();
  readonly remove = output<T>();
  readonly import = output<File>();

  // Plantillas de celda que llegan desde fuera
  private readonly cells = contentChildren(UiCell);
  protected readonly cellTpl = computed(
    () => new Map(this.cells().map((c) => [c.name(), c.template])),
  );

  // Columnas que pinta mat-table: las del usuario + 'actions'
  protected readonly displayed = computed(() => [...this.columns().map((c) => c.key), 'actions']);

  protected readonly intl = inject(MatPaginatorIntl);
  protected readonly query = signal('');
  protected readonly source = new MatTableDataSource<T>([]);
  private readonly sort = viewChild.required(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    effect(() => {
      this.source.data = this.data();
    });
    effect(() => {
      this.source.filter = this.searchable() ? this.query().trim().toLowerCase() : '';
    });
    effect(() => {
      this.source.sort = this.sort();
    });
    effect(() => {
      this.source.paginator = (this.paginated() && this.paginator()) || null;
    });

    // Busca y ordena por lo que se ve en cada columna, no por el objeto entero
    this.source.filterPredicate = (row, q) =>
      this.columns().some((c) => String(this.value(row, c.key)).toLowerCase().includes(q));
    this.source.sortingDataAccessor = (row, key) => this.value(row, key);
  }

  /** Valor de una celda: `cell()` si existe; si no, la propiedad con el nombre de la key. */
  protected value(row: T, key: string): string | number {
    const col = this.columns().find((c) => c.key === key);
    if (col?.cell) return col.cell(row);
    return ((row as Record<string, unknown>)[key] ?? '') as string | number;
  }

  /** Descarga un CSV con las filas filtradas y ordenadas (todas las páginas). */
  protected exportCsv() {
    const cols = this.columns();
    const rows = this.source.sortData([...this.source.filteredData], this.sort());
    const esc = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
    const csv = [
      cols.map((c) => esc(c.header)).join(','),
      ...rows.map((r) => cols.map((c) => esc(this.value(r, c.key))).join(',')),
    ].join('\r\n');

    // ﻿ (BOM) para que Excel lea bien las tildes
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.exportFileName()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  protected onFile(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (file) this.import.emit(file);
    input.value = ''; // permite volver a elegir el mismo archivo
  }
}
