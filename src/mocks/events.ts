//INI SPEC-003 - 02
// Asignación de categorías oficiales y colores semánticos a datos semilla
import type { CalendarEvent, EventCategory } from '../types/calendar';
import { EVENT_CATEGORY_MAP } from '../utils/categoryUtils';
//FIN SPEC-003 - 02

const currentYear = new Date().getFullYear();

// Paleta de colores temáticos para los indicadores
const EVENT_COLORS = {
  sport: EVENT_CATEGORY_MAP.health.color,
  meal: EVENT_CATEGORY_MAP.personal.color,
  work: EVENT_CATEGORY_MAP.work.color,
  meeting: EVENT_CATEGORY_MAP.work.color,
  important: EVENT_CATEGORY_MAP.important.color,
  friends: EVENT_CATEGORY_MAP.personal.color,
  family: EVENT_CATEGORY_MAP.personal.color,
  vacation: EVENT_CATEGORY_MAP.personal.color,
};

interface EventTemplate {
  title: string;
  time: string;
  desc: string;
  category: EventCategory;
  color: string;
}

// 1. Actividades matutinas deportivas
const MORNING_SPORTS: EventTemplate[] = [
  { title: 'Partido de Tenis en el Club', time: '07:00 - 08:15', desc: 'Entrenamiento y partido matutino de tenis', category: 'health', color: EVENT_COLORS.sport },
  { title: 'Natación en Piscina Olímpica', time: '06:45 - 08:00', desc: 'Sesión de largos y resistencia en el agua', category: 'health', color: EVENT_COLORS.sport },
  { title: 'Ruta en Bicicleta de Ruta', time: '07:00 - 08:30', desc: 'Recorrido en bici al aire libre por la costanera', category: 'health', color: EVENT_COLORS.sport },
  { title: 'Paseo en Bicicleta Urbana', time: '07:30 - 08:30', desc: 'Pedaleo suave y activación matinal', category: 'health', color: EVENT_COLORS.sport },
];

// 2. Comidas del día
const MEAL_EVENTS: EventTemplate[] = [
  { title: 'Desayuno Saludable & Café', time: '08:30 - 09:15', desc: 'Tostadas, fruta fresca y café americano', category: 'personal', color: EVENT_COLORS.meal },
  { title: 'Almuerzo con Menú Ejecutivo', time: '13:00 - 14:00', desc: 'Pausa para almuerzo nutritivo', category: 'personal', color: EVENT_COLORS.meal },
  { title: 'Cena Gourmet & Maridaje', time: '20:30 - 22:00', desc: 'Cena tranquila al finalizar la jornada', category: 'personal', color: EVENT_COLORS.meal },
  { title: 'Brunch de Fin de Semana', time: '11:00 - 12:30', desc: 'Brunch relajado con jugos naturales y panadería', category: 'personal', color: EVENT_COLORS.meal },
];

// 3. Trabajo diario y proyectos
const WORK_EVENTS: EventTemplate[] = [
  { title: 'Jornada Laboral y Enfoque en Código', time: '09:30 - 13:00', desc: 'Desarrollo de nuevas funcionalidades y arquitectura', category: 'work', color: EVENT_COLORS.work },
  { title: 'Revisión de Pull Requests y QA', time: '14:30 - 16:00', desc: 'Revisión técnica de código y pruebas de integración', category: 'work', color: EVENT_COLORS.work },
  { title: 'Bloque de Deep Work y Planificación', time: '10:00 - 12:30', desc: 'Resolución de problemas técnicos complejos', category: 'work', color: EVENT_COLORS.work },
  { title: 'Cierre de Sprint y Documentación', time: '16:00 - 17:30', desc: 'Actualización de documentación y métricas de avance', category: 'work', color: EVENT_COLORS.work },
];

// 4. Reuniones internas y con clientes
const MEETING_EVENTS: EventTemplate[] = [
  { title: 'Reunión de Sincronización con Clientes', time: '10:30 - 11:30', desc: 'Demostración de hitos y avances de producto al cliente', category: 'work', color: EVENT_COLORS.meeting },
  { title: 'Llamada de Estrategia con Cliente Principal', time: '15:00 - 16:00', desc: 'Negociación de requerimientos y próximas entregas', category: 'important', color: EVENT_COLORS.important },
  { title: 'Reunión de Equipo & Daily Standup', time: '09:30 - 10:00', desc: 'Alineación de objetivos diarios entre desarrolladores', category: 'work', color: EVENT_COLORS.meeting },
  { title: 'Presentación de Propuesta Comercial', time: '16:30 - 17:30', desc: 'Pitch de soluciones tecnológicas a nuevos clientes', category: 'important', color: EVENT_COLORS.important },
];

// 5. Amigos y vida social
const SOCIAL_FRIENDS: EventTemplate[] = [
  { title: 'Salida de Cerveza y Charlas con Amigos', time: '19:30 - 22:00', desc: 'Encuentro con el grupo de amigos para desconectar', category: 'personal', color: EVENT_COLORS.friends },
  { title: 'Tarde de Juegos de Mesa con Amigos', time: '17:00 - 20:00', desc: 'Risas y partidas de estrategia con amigos de toda la vida', category: 'personal', color: EVENT_COLORS.friends },
  { title: 'Cena y Parrilla con el Grupo de Amigos', time: '20:30 - 23:30', desc: 'Asado en casa y anécdotas de la semana', category: 'personal', color: EVENT_COLORS.friends },
  { title: 'Cine & Café con Amistades', time: '18:30 - 21:00', desc: 'Estreno de película y debate post-función', category: 'personal', color: EVENT_COLORS.friends },
];

// 6. Familia, esposa y parientes
const FAMILY_EVENTS: EventTemplate[] = [
  { title: 'Cena Romántica con mi Esposa', time: '20:30 - 23:00', desc: 'Cena a la luz de las velas en nuestro restaurante preferido', category: 'personal', color: EVENT_COLORS.family },
  { title: 'Caminata y Paseo con mi Esposa', time: '18:00 - 19:30', desc: 'Paseo tranquilo al atardecer por el parque', category: 'personal', color: EVENT_COLORS.family },
  { title: 'Almuerzo Familiar de Domingo con Parientes', time: '13:30 - 16:30', desc: 'Reunión familiar con padres, hermanos y sobrinos', category: 'personal', color: EVENT_COLORS.family },
  { title: 'Visita a la Casa de los Padres', time: '17:00 - 19:30', desc: 'Tarde de té, charlas y actualización con la familia', category: 'personal', color: EVENT_COLORS.family },
  { title: 'Cumpleaños y Festejo Familiar', time: '19:00 - 22:30', desc: 'Celebración familiar especial con torta y brindis', category: 'important', color: EVENT_COLORS.important },
];

// 7. Vacaciones y escapadas
const VACATION_EVENTS: EventTemplate[] = [
  { title: 'Vacaciones de Verano en la Playa', time: 'Todo el día', desc: 'Día de descanso, sol y mar junto a la familia', category: 'personal', color: EVENT_COLORS.vacation },
  { title: 'Escapada de Fin de Semana a la Montaña', time: 'Todo el día', desc: 'Senderismo, aire puro y descanso en cabaña', category: 'personal', color: EVENT_COLORS.vacation },
  { title: 'Viaje Turístico & Descanso', time: 'Todo el día', desc: 'Exploración de paisajes y relajación total', category: 'personal', color: EVENT_COLORS.vacation },
];

/**
 * Genera eventos realistas y variados durante todo el año:
 * Distribuye de 2 a 3 eventos diarios que integran:
 * - Deportes matutinos (tenis, natación, bicicleta)
 * - Comidas (desayunos, almuerzos, cenas)
 * - Trabajo y reuniones con clientes
 * - Encuentros con amigos
 * - Momentos familiares y con la esposa
 * - Períodos de vacaciones
 */
function generateRichMockEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const dateObj = new Date(currentYear, month, day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Domingo o Sábado

      // Temporadas especiales de vacaciones:
      // - Segunda quincena de Enero (verano)
      // - Primera quincena de Julio (vacaciones de invierno)
      const isSummerVacation = month === 0 && day >= 15 && day <= 28;
      const isWinterVacation = month === 6 && day >= 10 && day <= 20;

      if (isSummerVacation || isWinterVacation) {
        // En período de vacaciones
        const vacTemplate = VACATION_EVENTS[(day + month) % VACATION_EVENTS.length];
        events.push({
          id: `evt-${month + 1}-${day}-vac`,
          title: vacTemplate.title,
          date: dateStr,
          time: vacTemplate.time,
          description: vacTemplate.desc,
          color: vacTemplate.color,
          category: vacTemplate.category,
        });

        // Actividad deportiva o familiar relajada en vacaciones
        const sportOrFamily = (day % 2 === 0)
          ? MORNING_SPORTS[day % MORNING_SPORTS.length]
          : FAMILY_EVENTS[day % FAMILY_EVENTS.length];
        events.push({
          id: `evt-${month + 1}-${day}-vac-act`,
          title: sportOrFamily.title,
          date: dateStr,
          time: sportOrFamily.time,
          description: sportOrFamily.desc,
          color: sportOrFamily.color,
          category: sportOrFamily.category,
        });

        // Cena de vacaciones
        const dinner = MEAL_EVENTS[2];
        events.push({
          id: `evt-${month + 1}-${day}-vac-dinner`,
          title: `${dinner.title} en Vacaciones`,
          date: dateStr,
          time: '21:00 - 23:00',
          description: 'Cena relajada descubriendo gastronomía local',
          color: EVENT_COLORS.meal,
          category: 'personal',
        });

        continue;
      }

      // --- DÍAS HÁBILES (Lunes a Viernes) ---
      if (!isWeekend) {
        // 1. Actividad matinal deportiva (Tenis, Nadar, Bicicleta)
        const sport = MORNING_SPORTS[(day + month) % MORNING_SPORTS.length];
        events.push({
          id: `evt-${month + 1}-${day}-1`,
          title: sport.title,
          date: dateStr,
          time: sport.time,
          description: sport.desc,
          color: sport.color,
          category: sport.category,
        });

        // 2. Trabajo diario o Reunión con clientes
        const isClientMeetingDay = day % 3 === 0;
        const workOrMeeting = isClientMeetingDay
          ? MEETING_EVENTS[(day + month) % MEETING_EVENTS.length]
          : WORK_EVENTS[(day + month) % WORK_EVENTS.length];

        events.push({
          id: `evt-${month + 1}-${day}-2`,
          title: workOrMeeting.title,
          date: dateStr,
          time: workOrMeeting.time,
          description: workOrMeeting.desc,
          color: workOrMeeting.color,
          category: workOrMeeting.category,
        });

        // 3. Tarde/Noche: Almuerzo/Cena, Amigos o Esposa/Familia
        if (day % 4 === 0) {
          const friends = SOCIAL_FRIENDS[(day + month) % SOCIAL_FRIENDS.length];
          events.push({
            id: `evt-${month + 1}-${day}-3`,
            title: friends.title,
            date: dateStr,
            time: friends.time,
            description: friends.desc,
            color: friends.color,
            category: friends.category,
          });
        } else if (day % 4 === 1 || day % 4 === 3) {
          const family = FAMILY_EVENTS[(day + month) % FAMILY_EVENTS.length];
          events.push({
            id: `evt-${month + 1}-${day}-3`,
            title: family.title,
            date: dateStr,
            time: family.time,
            description: family.desc,
            color: family.color,
            category: family.category,
          });
        } else {
          const meal = MEAL_EVENTS[(day + month) % MEAL_EVENTS.length];
          events.push({
            id: `evt-${month + 1}-${day}-3`,
            title: meal.title,
            date: dateStr,
            time: meal.time,
            description: meal.desc,
            color: meal.color,
            category: meal.category,
          });
        }
      } 
      // --- FINES DE SEMANA (Sábado y Domingo) ---
      else {
        // 1. Mañana deportiva o brunch
        const isBiciOrTenis = day % 2 === 0;
        const morningAct = isBiciOrTenis
          ? MORNING_SPORTS[day % MORNING_SPORTS.length]
          : MEAL_EVENTS[3]; // Brunch de fin de semana

        events.push({
          id: `evt-${month + 1}-${day}-wk1`,
          title: morningAct.title,
          date: dateStr,
          time: morningAct.time,
          description: morningAct.desc,
          color: morningAct.color,
          category: morningAct.category,
        });

        // 2. Familia / Esposa / Parientes
        const familyAct = FAMILY_EVENTS[(day * 2) % FAMILY_EVENTS.length];
        events.push({
          id: `evt-${month + 1}-${day}-wk2`,
          title: familyAct.title,
          date: dateStr,
          time: familyAct.time,
          description: familyAct.desc,
          color: familyAct.color,
          category: familyAct.category,
        });

        // 3. Amigos o cena especial
        const socialOrDinner = (day % 2 === 0)
          ? SOCIAL_FRIENDS[day % SOCIAL_FRIENDS.length]
          : MEAL_EVENTS[2]; // Cena gourmet

        events.push({
          id: `evt-${month + 1}-${day}-wk3`,
          title: socialOrDinner.title,
          date: dateStr,
          time: socialOrDinner.time,
          description: socialOrDinner.desc,
          color: socialOrDinner.color,
          category: socialOrDinner.category,
        });
      }
    }
  }

  return events;
}

export const mockEvents: CalendarEvent[] = generateRichMockEvents();
