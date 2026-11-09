import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiCell, UiTable } from '../../../blocks/table/table';
import { RowAction, TableAction, TableColumn } from '../../../blocks/table/table.types';

/** Lo que devuelve tu backend. Puede traer más campos de los que muestras. */
interface Evento {
  id: number;
  titulo: string;
  tipo: string;
  fecha: string;
  estado: 'Pendiente' | 'Confirmado' | 'Cancelado';
  responsable: { nombre: string };
}

@Component({
  selector: 'app-eventos-api',
  imports: [UiTable, UiCell],
  templateUrl: './eventos-api.html',
  styleUrl: './eventos-api.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosApi {
  private readonly snack = inject(MatSnackBar);

  /** GET a tu API. Cambia la URL por la de tu backend. */
  protected readonly eventos = httpResource<Evento[]>(() => 'api/eventos.json', {
    defaultValue: [],
  });

  protected readonly columns: TableColumn<Evento>[] = [
    { key: 'titulo', header: 'Evento', sortable: true },
    { key: 'tipo', header: 'Tipo', sortable: true },
    { key: 'estado', header: 'Estado', sortable: true },
    { key: 'responsable', header: 'Responsable', cell: (e) => e.responsable.nombre },
  ];

  protected readonly actions: TableAction[] = [
    { label: 'Recargar', icon: 'refresh', run: () => this.eventos.reload() },
    { label: 'Nuevo evento', icon: 'add', variant: 'filled', run: () => this.avisar('Nuevo') },
  ];

  protected readonly rowActions: RowAction<Evento>[] = [
    { label: 'Duplicar', icon: 'content_copy', run: (e) => this.avisar(`Duplicar ${e.titulo}`) },
  ];

  protected ver(e: Evento) {
    this.avisar(`Ver ${e.titulo}`);
  }

  protected editar(e: Evento) {
    this.avisar(`Editar ${e.titulo}`);
  }

  protected eliminar(e: Evento) {
    // Con tu API: this.http.delete(`api/eventos/${e.id}`), y después this.eventos.reload()
    this.eventos.update((lista) => lista.filter((x) => x.id !== e.id));
    this.avisar(`"${e.titulo}" eliminado`);
  }

  private avisar(msg: string) {
    this.snack.open(msg, 'OK', { duration: 2500 });
  }
}
