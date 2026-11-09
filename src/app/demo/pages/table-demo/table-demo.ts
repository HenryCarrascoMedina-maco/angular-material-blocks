import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiCell, UiTable } from '../../../blocks/table/table';
import { RowAction, TableAction, TableColumn } from '../../../blocks/table/table.types';
import { EVENTOS, Evento, TIPOS, TipoEvento } from '../../data/eventos';
import { CodeBlock } from '../../shared/code-block';
import { Opcion, generarUso } from './table-demo.snippets';

@Component({
  selector: 'app-table-demo',
  imports: [
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    UiTable,
    UiCell,
    CodeBlock,
  ],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDemo {
  private readonly snack = inject(MatSnackBar);

  // --- Opciones: todo lo que se puede activar en <ui-table> ---
  protected readonly opciones: { key: Opcion; label: string; icon: string }[] = [
    { key: 'buscador', label: 'Buscador', icon: 'search' },
    { key: 'filtro', label: 'Filtro propio', icon: 'filter_list' },
    { key: 'nuevo', label: 'Botón "Nuevo"', icon: 'add' },
    { key: 'importar', label: 'Importar', icon: 'upload' },
    { key: 'exportar', label: 'Exportar CSV', icon: 'download' },
    { key: 'acciones', label: 'Acciones extra en ⋮', icon: 'more_vert' },
    { key: 'celdas', label: 'Celdas con diseño', icon: 'palette' },
    { key: 'ordenar', label: 'Ordenar columnas', icon: 'swap_vert' },
    { key: 'paginador', label: 'Paginador', icon: 'last_page' },
  ];
  protected readonly op: Record<Opcion, WritableSignal<boolean>> = {
    buscador: signal(true),
    filtro: signal(true),
    nuevo: signal(true),
    importar: signal(true),
    exportar: signal(true),
    acciones: signal(true),
    celdas: signal(true),
    ordenar: signal(true),
    paginador: signal(true),
  };

  /** El código de "Cómo se usa" cambia según las opciones activas. */
  protected readonly uso = computed(() =>
    generarUso(
      Object.fromEntries(this.opciones.map((o) => [o.key, this.op[o.key]()])) as Record<
        Opcion,
        boolean
      >,
    ),
  );

  // --- Datos y filtro propio ---
  private readonly todos = signal<Evento[]>(EVENTOS);
  protected readonly tipos = TIPOS;
  protected readonly tipo = signal<TipoEvento | null>(null);
  protected readonly iconos: Record<string, string> = {
    Reunión: 'groups',
    Feriado: 'calendar_month',
    Lanzamiento: 'rocket_launch',
    Formación: 'school',
  };
  protected readonly eventos = computed(() => {
    const tipo = this.op.filtro() ? this.tipo() : null;
    return tipo ? this.todos().filter((e) => e.tipo === tipo) : this.todos();
  });

  // --- Configuración de la tabla ---
  protected readonly columns = computed<TableColumn<Evento>[]>(() => {
    const sortable = this.op.ordenar();
    return [
      { key: 'evento', header: 'Evento', cell: (e) => e.titulo, sortable },
      { key: 'tipo', header: 'Tipo', sortable },
      { key: 'estado', header: 'Estado', sortable },
      { key: 'responsable', header: 'Responsable', cell: (e) => e.responsable.nombre, sortable },
    ];
  });

  protected readonly actions = computed<TableAction[]>(() =>
    this.op.nuevo()
      ? [
          {
            label: 'Nuevo evento',
            icon: 'add',
            variant: 'filled',
            run: () => this.log('Nuevo evento.run()'),
          },
        ]
      : [],
  );

  private readonly todasRowActions: RowAction<Evento>[] = [
    { label: 'Duplicar', icon: 'content_copy', run: (e) => this.duplicar(e) },
    {
      label: 'Programar aviso',
      icon: 'schedule',
      run: (e) => this.log(`Programar aviso → ${e.titulo}`),
    },
    {
      label: 'Cancelar evento',
      icon: 'event_busy',
      run: (e) => this.cambiarEstado(e, 'Cancelado'),
      hidden: (e) => e.estado === 'Cancelado',
    },
  ];
  protected readonly rowActions = computed(() => (this.op.acciones() ? this.todasRowActions : []));

  // --- Lo que emite la tabla ---
  protected readonly eventLog = signal<string[]>([]);

  protected ver(e: Evento) {
    this.log(`(view) → ${e.titulo}`);
  }

  protected editar(e: Evento) {
    this.log(`(edit) → ${e.titulo}`);
  }

  protected eliminar(e: Evento) {
    this.todos.update((list) => list.filter((x) => x.id !== e.id));
    this.log(`(remove) → ${e.titulo}`);
    this.snack.open(`"${e.titulo}" eliminado`, 'OK', { duration: 2500 });
  }

  protected importar(file: File) {
    this.log(`(import) → ${file.name}`);
    this.snack.open(`Archivo recibido: ${file.name} (${Math.ceil(file.size / 1024)} KB)`, 'OK', {
      duration: 2500,
    });
  }

  private duplicar(e: Evento) {
    const copia: Evento = { ...e, id: Date.now(), titulo: `${e.titulo} (copia)` };
    this.todos.update((list) => [copia, ...list]);
    this.log(`Duplicar → ${e.titulo}`);
  }

  private cambiarEstado(e: Evento, estado: Evento['estado']) {
    this.todos.update((list) => list.map((x) => (x.id === e.id ? { ...x, estado } : x)));
    this.log(`Cancelar evento → ${e.titulo}`);
  }

  protected iniciales(nombre: string) {
    return nombre
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
  }

  private log(msg: string) {
    this.eventLog.update((l) => [msg, ...l].slice(0, 8));
  }
}
