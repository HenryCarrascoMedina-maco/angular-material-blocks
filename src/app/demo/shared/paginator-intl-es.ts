import { Injectable, Provider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/** Textos del paginador de Material en español. Opcional. */
@Injectable()
export class PaginatorIntlEs extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página';
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) return `0 de ${length}`;
    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);
    return `${start + 1} – ${end} de ${length}`;
  };
}

/** Para la demo. En tu app: `providers: [providePaginatorEs()]` en app.config.ts */
export function providePaginatorEs(): Provider {
  return { provide: MatPaginatorIntl, useClass: PaginatorIntlEs };
}
