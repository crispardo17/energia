import {advancedLessons,advancedUnits} from './english-advanced.js';
import {enrichSessions} from './english-session.js';
import {a1Translations} from './a1-translations.js';
import { a1Lessons, a1Units } from './a1-curriculum.js';
export const levels = [
  { id: 'A1', name: 'Primeras palabras', subtitle: 'Construye tu base', description: 'Preséntate, habla de tu rutina y empieza a conectar.', color: '#c9edbc', topics: ['Presentaciones', 'Vida cotidiana', 'Preguntas básicas'] },
  { id: 'A2', name: 'Un poco más lejos', subtitle: 'Gana confianza', description: 'Cuenta lo que pasó y prepara tu próxima aventura.', color: '#f4e5ab', topics: ['Pasado simple', 'Planes', 'En la ciudad'] },
  { id: 'B1', name: 'Tu propia voz', subtitle: 'Conversa con autonomía', description: 'Comparte experiencias, opiniones y posibilidades.', color: '#c6dbf9', topics: ['Experiencias', 'Condicionales', 'Opiniones'] },
  { id: 'B2', name: 'Sin perder el hilo', subtitle: 'Expresa ideas complejas', description: 'Argumenta con claridad y descubre nuevos matices.', color: '#dcccf4', topics: ['Argumentación', 'Voz pasiva', 'Estilo indirecto'] },
  { id: 'C1', name: 'Más allá de las palabras', subtitle: 'Encuentra el matiz', description: 'Adapta tu registro y comunica ideas con precisión.', color: '#f4cdbc', topics: ['Inversión', 'Registro', 'Cohesión'] },
  { id: 'C2', name: 'Cada matiz cuenta', subtitle: 'Afina tu expresión', description: 'Explora inferencias, énfasis y lenguaje idiomático.', color: '#c7e6df', topics: ['Inferencias', 'Énfasis', 'Expresiones idiomáticas'] },
];
export const lessons = enrichSessions([...a1Lessons.map((l,i)=>({...l,translation:a1Translations[i]})),...advancedLessons]);
export const units = [...a1Units,...advancedUnits];
