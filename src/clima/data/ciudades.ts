export interface Ciudad {
  nombre: string
  provincia: string
  lat: number
  lon: number
}

export const ciudades: Ciudad[] = [
  { nombre: 'Resistencia', provincia: 'Chaco', lat: -27.4514, lon: -58.9866 },
  { nombre: 'Corrientes', provincia: 'Corrientes', lat: -27.4698, lon: -58.8301 },
  { nombre: 'Presidencia Roque Sáenz Peña', provincia: 'Chaco', lat: -26.7854, lon: -60.4387 },
  { nombre: 'Formosa', provincia: 'Formosa', lat: -26.1849, lon: -58.1731 },
  { nombre: 'Reconquista', provincia: 'Santa Fe', lat: -29.1448, lon: -59.6429 },
  { nombre: 'Goya', provincia: 'Corrientes', lat: -29.1399, lon: -59.2653 },
  { nombre: 'Charata', provincia: 'Chaco', lat: -27.2167, lon: -61.2000 },
  { nombre: 'Villa Ángela', provincia: 'Chaco', lat: -27.5833, lon: -60.7167 },
  { nombre: 'General José de San Martín', provincia: 'Chaco', lat: -26.5375, lon: -59.3381 },
  { nombre: 'Tres Isletas', provincia: 'Chaco', lat: -26.3500, lon: -60.4333 },
  { nombre: 'Castelli', provincia: 'Chaco', lat: -25.9500, lon: -60.6167 },
  { nombre: 'Avellaneda', provincia: 'Santa Fe', lat: -29.1167, lon: -59.6500 },
  { nombre: 'Vera', provincia: 'Santa Fe', lat: -29.4667, lon: -60.2167 },
  { nombre: 'Ituzaingó', provincia: 'Corrientes', lat: -27.5833, lon: -56.6833 },
  { nombre: 'Clorinda', provincia: 'Formosa', lat: -25.2833, lon: -57.7167 },
]
