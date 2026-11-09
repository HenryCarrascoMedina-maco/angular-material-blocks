/** Datos de ejemplo para las demos. */
export type TipoEvento = 'Reunión' | 'Feriado' | 'Lanzamiento' | 'Formación';
export type EstadoEvento = 'Pendiente' | 'Confirmado' | 'Cancelado';

export interface Evento {
  id: number;
  titulo: string;
  tipo: TipoEvento;
  fecha: Date;
  hora: string;
  lugar: string;
  estado: EstadoEvento;
  responsable: { nombre: string };
}

export const TIPOS: TipoEvento[] = ['Reunión', 'Feriado', 'Lanzamiento', 'Formación'];

const TITULOS = [
  'Reunión de equipo',
  'Lanzamiento v2.0',
  'Feriado: Navidad',
  'Curso de Angular Material',
  'Demo con el cliente',
  'Feriado: Año Nuevo',
  'Reunión de planificación',
  'Formación en accesibilidad',
  'Lanzamiento app móvil',
  'Reunión retrospectiva',
  'Formación en .NET',
  'Lanzamiento de la landing',
  'Reunión con diseño',
  'Formación Git avanzado',
  'Feriado: Día del Trabajo',
  'Lanzamiento del blog',
  'Reunión de presupuesto',
  'Formación en testing',
  'Reunión 1:1',
  'Lanzamiento beta cerrada',
  'Formación en Docker',
  'Reunión de cierre de año',
  'Feriado: Fiestas Patrias',
];
const PERSONAS = ['Ana Torres', 'Luis Pérez', 'Marta Gil', 'Jorge Ruiz', 'Sofía León'];
const HORAS = ['09:00', '10:30', '16:00', '12:00', '18:00'];
const LUGARES = ['Sala 2', 'Online', 'Auditorio', 'Oficina central'];
const ESTADOS: EstadoEvento[] = ['Confirmado', 'Pendiente', 'Confirmado', 'Cancelado', 'Pendiente'];

function tipoDe(titulo: string): TipoEvento {
  if (titulo.startsWith('Feriado')) return 'Feriado';
  if (titulo.startsWith('Lanzamiento')) return 'Lanzamiento';
  if (titulo.startsWith('Formación') || titulo.startsWith('Curso')) return 'Formación';
  return 'Reunión';
}

export const EVENTOS: Evento[] = TITULOS.map((titulo, i) => ({
  id: i + 1,
  titulo,
  tipo: tipoDe(titulo),
  fecha: new Date(2026, 11, 1 + i),
  hora: HORAS[i % HORAS.length],
  lugar: LUGARES[i % LUGARES.length],
  estado: ESTADOS[i % ESTADOS.length],
  responsable: { nombre: PERSONAS[i % PERSONAS.length] },
}));
