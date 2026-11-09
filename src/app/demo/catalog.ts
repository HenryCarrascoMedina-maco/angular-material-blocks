/** Lista de bloques que muestra la demo (menú lateral e inicio). */
export interface BlockInfo {
  path: string;
  title: string;
  description: string;
  icon: string;
  folder: string;
  ready: boolean;
}

export const CATALOG: BlockInfo[] = [
  {
    path: 'tabla',
    title: 'Tabla genérica',
    description: 'Buscador, filtros, columnas con plantilla, acciones, menú ⋮, orden y paginación.',
    icon: 'table_view',
    folder: 'src/app/blocks/table',
    ready: true,
  },
  {
    path: 'skeleton',
    title: 'Skeleton loader',
    description: 'Un skeleton para cada componente y la directiva *uiLoading.',
    icon: 'view_day',
    folder: 'src/app/blocks/skeleton',
    ready: false,
  },
  {
    path: 'formulario',
    title: 'Formulario',
    description: 'Ver, editar y crear con un solo componente, desde un array de campos.',
    icon: 'edit_note',
    folder: 'src/app/blocks/form',
    ready: false,
  },
  {
    path: 'dialogos',
    title: 'Diálogo de confirmación',
    description: 'await confirm.ask({...}) y listo.',
    icon: 'help',
    folder: 'src/app/blocks/dialogs',
    ready: false,
  },
];
