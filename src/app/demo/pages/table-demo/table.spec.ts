import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiCell, UiTable } from '../../../blocks/table/table';
import { TableColumn } from '../../../blocks/table/table.types';

interface Fila {
  id: number;
  nombre: string;
}

@Component({
  imports: [UiTable, UiCell],
  template: `
    <ui-table
      [data]="data()"
      [columns]="columns"
      [exportable]="extra()"
      [importable]="extra()"
      [searchable]="!extra()"
      [paginated]="!extra()"
      (view)="visto = $event"
    >
      <ng-template uiCell="nombre" let-f><b class="custom">{{ f.nombre }}</b></ng-template>
    </ui-table>
  `,
})
class Host {
  data = signal<Fila[]>([
    { id: 1, nombre: 'Ana' },
    { id: 2, nombre: 'Luis' },
  ]);
  columns: TableColumn<Fila>[] = [
    { key: 'id', header: 'Id' },
    { key: 'nombre', header: 'Nombre' },
  ];
  visto?: Fila;
  extra = signal(false);
}

describe('UiTable', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('pinta una fila por elemento y la columna de acciones', async () => {
    const { el } = await render();
    expect(el.querySelectorAll('tr.mat-mdc-row').length).toBe(2);
    expect(el.querySelector('th.actions')?.textContent).toContain('Acciones');
  });

  it('usa la plantilla uiCell cuando existe', async () => {
    const { el } = await render();
    expect(el.querySelector('b.custom')?.textContent).toBe('Ana');
  });

  it('emite (view) con la fila', async () => {
    const { fixture, el } = await render();
    const ver = el.querySelector<HTMLButtonElement>('tr.mat-mdc-row td.actions button');
    ver?.click();
    expect(fixture.componentInstance.visto?.nombre).toBe('Ana');
  });

  it('muestra Importar y Exportar solo si se activan', async () => {
    const { fixture, el } = await render();
    const textos = () => [...el.querySelectorAll('.toolbar button')].map((b) => b.textContent);
    expect(textos().join()).not.toContain('Exportar');

    fixture.componentInstance.extra.set(true);
    await fixture.whenStable();
    expect(textos().join()).toContain('Exportar');
    expect(textos().join()).toContain('Importar');
  });

  it('oculta buscador y paginador con [searchable]=false y [paginated]=false', async () => {
    const { fixture, el } = await render();
    expect(el.querySelector('.search')).not.toBeNull();
    expect(el.querySelector('mat-paginator')).not.toBeNull();

    fixture.componentInstance.extra.set(true);
    await fixture.whenStable();
    expect(el.querySelector('.search')).toBeNull();
    expect(el.querySelector('mat-paginator')).toBeNull();
  });
});
