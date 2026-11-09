/** Una columna de la tabla. */
export interface TableColumn<T> {
  /** Id único de la columna. Si no hay `cell`, también es la propiedad que se lee de la fila. */
  key: string;
  /** Texto de la cabecera. */
  header: string;
  /** Valor calculado de la celda (se usa si no hay una plantilla `uiCell` para esta columna). */
  cell?: (row: T) => string | number;
  /** Permite ordenar por esta columna. */
  sortable?: boolean;
  /** Ancho de la columna: '120px', '20%'… */
  width?: string;
  /** Alineación del contenido. */
  align?: 'start' | 'center' | 'end';
}

/** Botón de la barra superior: Nuevo, Filtros, Exportar… */
export interface TableAction {
  label: string;
  /** Nombre de un icono de Material Symbols. */
  icon?: string;
  /** Apariencia del botón de Angular Material. */
  variant?: 'filled' | 'tonal' | 'outlined' | 'elevated' | 'text';
  run: () => void;
}

/** Acción extra del menú ⋮ de cada fila. "Eliminar" siempre está y va al final. */
export interface RowAction<T> {
  label: string;
  icon: string;
  run: (row: T) => void;
  /** Ocultar la acción en algunas filas. */
  hidden?: (row: T) => boolean;
}
