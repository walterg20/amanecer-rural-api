export interface ProgramaTV {
  seccion: string
  nombre: string
  descripcion: string
  horarios: string
  canales: string[]
}

export const programas: ProgramaTV[] = [
  {
    seccion: 'amanecer-rural-tv',
    nombre: 'Amanecer Rural TV',
    descripcion: 'Programa matutino dedicado al campo, la ganadería, la agricultura y la vida rural. Noticias, reportajes y entrevistas sobre el sector agropecuario.',
    horarios: 'Lunes a viernes 06:00 - 08:00 | Sábados 07:00 - 09:00',
    canales: ['Canal 9 (Resistencia)', 'Cablevisión Flow', 'YouTube'],
  },
  {
    seccion: 'avance-rural-tv',
    nombre: 'Avance Rural TV',
    descripcion: 'Programa de mediodía con el resumen de la actualidad agropecuaria, precios de hacienda, granos, clima y novedades del sector.',
    horarios: 'Lunes a viernes 12:00 - 13:00 | Sábados 12:00 - 13:30',
    canales: ['Canal 9 (Resistencia)', 'Cablevisión Flow', 'YouTube'],
  },
]
