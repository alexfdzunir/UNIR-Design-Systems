import type { Meta, StoryObj } from '@storybook/angular';
import footer from '../../components/footer/footer.stories';
import navigationHeader from '../../components/navigation-header/navigation-header.stories';
import { heading, icon, indent } from '../../stories/helpers';
import {
  accordion,
  anchors,
  card,
  carousel,
  downloads,
  figures,
  formPanel,
  hero,
  moduleHtml,
  pageImg,
  pagesFigma,
  profiles,
  programCard,
  reviews,
  richText,
  section,
  table,
  testimonials,
} from '../../stories/page-parts';

const panel = (title: string) => `Información detallada sobre ${title.toLowerCase().replace(/[¿?]/g, '')}: consulta los requisitos, el calendario y las condiciones en la guía de la titulación.`;
const items = (titles: string[]): [string, string][] => titles.map((t) => [t, panel(t)]);
const note = (text: string) => `<div class="aem-featured-text"><p class="aem-featured-text__text">${text}</p></div>`;

const content = [
  hero({
    crumbs: ['Inicio', 'Educación', 'Grado en Maestro en Educación Primaria'],
    pretitle: 'Grado en',
    title: 'Maestro en Educación Primaria',
    text: 'Ejerce como maestro en la etapa educativa de 6 a 12 años y elige entre siete menciones para especializarte',
    data: [
      ['Inicio', '9 mar 2026'],
      ['Duración', '4 cursos'],
      ['Créditos', '240 ECTS'],
      ['Modalidad', 'Online'],
      ['Menciones', '7'],
      ['Prácticas', '+3.000 centros'],
    ],
  }),
  `<div class="aem-section aem-section--flush aem-page__anchors" style="padding-bottom: 0">\n${anchors(['Descripción', 'Plan de Estudios', 'Salidas Profesionales', 'FAQ', 'Claustro', 'Admisión', 'Calidad'])}\n</div>`,
  section(note('Estudia de manera paralela una de las siguientes menciones: Audición y Lenguaje, Pedagogía Terapéutica, Enseñanza de la Lengua Inglesa, Educación Musical, Educación Física, Educación Artística o Didáctica de la Religión.'), {
    id: 'seccion-1',
    heading: {
      title: 'Obtén el título habilitante para ser maestro con el Grado en Educación Primaria online',
      subtitle: 'Elige entre la mayor oferta de menciones en Magisterio de Primaria para especializarte y transforma la educación del siglo XXI',
      text: 'El Grado en Educación Primaria es una carrera universitaria que te habilita para ejercer como maestro en la etapa educativa de 6 a 12 años en centros privados, públicos y concertados. UNIR te ofrece la opción de cursar este título oficial, en formato online, durante cuatro cursos para convertirte en el docente que la sociedad demanda. Este grado está avalado por más de una década de experiencia e incorpora a su plan de estudios la pedagogía digital, el uso de la IA en el aula y el desarrollo de competencias digitales docentes. Elige estudiar magisterio a distancia en UNIR y tendrás la oportunidad de realizar prácticas en uno de nuestros más de 3.000 centros educativos con los que tenemos acuerdo, así como especializarte en una de las 7 menciones que ofrecemos.',
    },
  }),
  section(
    `${note("Como estudiante, tendrás acceso gratuito al workshop premium: 'Inteligencia Artificial para Docentes', donde aprenderás a aplicar herramientas de IA.")}
${downloads([['Descarga el Plan de Estudios', 'Archivo.PDF']])}
<a class="aem-link-button" href="#">Ver calendario académico ${icon('caret-right')}</a>`,
    {
      flush: true,
      heading: {
        title: 'Reconoce créditos para finalizar antes la carrera de Magisterio',
        text: 'UNIR te ofrece planes específicos de reconocimiento de créditos para graduados, diplomados, técnicos superiores o licenciados. Además, podrás reconocer hasta 32 ECTS si has finalizado el Ciclo Formativo Superior de Integración Social. Obtén tu título de Grado en Magisterio de Primaria online en menos tiempo al no tener que realizar los cuatro cursos académicos.',
      },
    },
  ),
  section(
    richText([], [
      'Conoce la organización de los colegios de Educación Primaria y la diversidad de acciones que comprende su funcionamiento.',
      'Apuesta por la universidad con más menciones para ampliar tus salidas profesionales: te ofrecemos un total de siete.',
      'Consigue la habilitación lingüística (de manera opcional) para impartir clases en colegios bilingües.',
      'Especialízate en las tecnologías de la información y la comunicación para aplicarlas en las aulas.',
      'Trabaja en cualquier ámbito relacionado con la educación infantil: extraescolares, proyectos, museos, elaboración de libros de texto, etc.',
    ]),
    {
      flush: true,
      heading: {
        title: '¿Por qué estudiar el Grado en Maestro de Educación Primaria online en UNIR?',
        text: 'Con el Magisterio de Primaria serás un maestro capaz de implementar proyectos educativos innovadores desde la profesionalidad y el compromiso.',
      },
    },
  ),
  section(
    figures([
      ['+10', 'mil', 'maestros han egresado en UNIR', ''],
      ['+10', '', 'años formando maestros online', ''],
      ['65', '%', 'de los egresados está trabajando', ''],
    ]),
    { flush: true, heading: { title: '¿Qué cifras hacen único al Grado en Magisterio de Primaria online de UNIR?' } },
  ),
  section('', {
    id: 'seccion-2',
    flush: true,
    heading: {
      title: '¿Qué asignaturas estudiarás en el Grado en Educación Primaria de UNIR?',
      text: 'El programa de la Carrera de Educación Primaria online de UNIR está diseñado para que desarrolles proyectos educativos innovadores y de alta calidad, adaptados a las necesidades actuales del aula. La formación se completa con contenidos específicos en metodología bilingüe, idiomas, atención a la diversidad y competencias digitales aplicadas a las tecnologías de la información. Te prepararás para intervenir con solvencia en toda la etapa de 6 a 12 años, con una formación sólida en didácticas específicas, evaluación formativa y diseño de situaciones de aprendizaje adaptadas a distintos contextos.',
    },
  }),
  section(accordion(items(['Mención en Audición y Lenguaje', 'Mención en Pedagogía Terapéutica (Educación Especial)', 'Mención en Educación Física', 'Mención en Educación Musical'])), {
    flush: true,
    className: 'aem-accordion-block',
    heading: {
      title: '¿Qué menciones habilitantes ofrece el Grado en Educación Primaria a distancia?',
      text: 'Al estudiar en UNIR tienes la opción de elegir entre siete menciones para especializarte y ampliar tus oportunidades laborales una vez consigas tu título de Primaria. No es obligatorio que curses una mención de forma íntegra, ya que podrás elegir optativas de distintas ramas para adquirir una visión más general.',
    },
  }),
  section(
    `<div class="aem-banner aem-banner--content">
${indent(heading({ pretitle: 'FORMACIÓN EXCLUSIVA', title: 'Prepárate las oposiciones mientras estudias tu Grado en Primaria o al finalizarlo', subtitle: '¿Quieres conseguir tu plaza como maestro o maestra?', text: 'En UNIR te ofrecemos 4 cursos dirigidos solo a nuestros estudiantes. Con una duración de 9 meses, están diseñados para potenciar al máximo tus posibilidades de éxito en la preparación de oposiciones en:' }), 2)}
${indent(richText([], ['Educación Primaria.', 'Educación Infantil.', 'Audición y Lenguaje.', 'Pedagogía Terapéutica (PT).']), 2)}
${indent(heading({ subtitle: '¿Qué te ofrecemos?', text: 'Contamos con un equipo de profesionales que llevan formando a docentes más de 18 años. Aprovecha nuestra metodología flexible, adaptada a tu ritmo de vida y necesidades, y aprovecha beneficios como:' }), 2)}
  <ol class="aem-list aem-list--ordered">
${['Elaboración personalizada de la programación didáctica con correcciones individualizadas.', 'Técnicas de memorización avanzadas para consolidar conocimientos clave.', 'Mejora de oratoria y expresión oral, para destacar en la fase de exposición.', 'Simulacros reales de examen y tutorización personalizada.', 'Material actualizado conforme a la normativa vigente.'].map((t) => `    <li><span>${t}</span></li>`).join('\n')}
  </ol>
</div>`,
    { flush: true },
  ),
  section(
    table(['Tipo', 'ECTS'], [
      ['Obligatorias', '15'],
      ['Optativas', '24'],
      ['Trabajo Fin de Estudios', '12'],
      ['Prácticas', '9'],
      ['Créditos totales', '60'],
    ]),
    { flush: true, heading: { title: 'Estructura del plan de estudios', text: 'Los créditos del programa están repartidos de la siguiente forma:' } },
  ),
  section(accordion(items(['Primer año - 60 ECTS', 'Segundo año - 60 ECTS', 'Tercer año - 60 ECTS', 'Cuarto año - 60 ECTS', 'Asignaturas optativas', 'Menciones'])), {
    flush: true,
    className: 'aem-accordion-block',
    heading: {
      title: 'Distribución de asignaturas por cursos y cuatrimestres',
      text: 'Consulta la distribución de asignaturas por cuatrimestres y sus contenidos, las competencias a adquirir, la metodología de aprendizaje, el proceso de evaluación, la bibliografía asociada y orientaciones para el estudio.',
    },
  }),
  section(accordion(items(['Prácticas profesionales', 'Trabajo Fin de Grado', 'Sistema de evaluación', 'Departamentos de apoyo al estudiante'])), {
    flush: true,
    className: 'aem-accordion-block',
    heading: { title: 'Experiencia formativa y apoyo' },
  }),
  section(
    carousel(
      (
        [
          ['chalkboard-simple', 'Clases 100% online', 'Fórmate con sesiones en directo y plantea tus dudas directamente a los docentes. En caso de que no puedas, accede a las grabaciones cuando lo necesites.'],
          ['users', 'Recursos didácticos', 'Accede a nuestro Campus Virtual, una plataforma online con conexión directa a las clases, los profesores, otros compañeros, masterclass o foros de debate.'],
          ['file', 'Networking activo', 'Establece relaciones con personas de todo el mundo con intereses comunes, a través de espacios de debate y chats que te permitirán crear una agenda profesional.'],
          ['square-logo', 'Seguimiento personalizado', 'Nuestros Mentores - UNIR te acompañarán durante todo el curso vía mail o telefónica. Recibe orientación académica y organiza tus estudios según tus objetivos.'],
          ['tree-structure', 'Exámenes online y/o presenciales', 'Elige en cada asignatura y convocatoria cómo quieres realizar esta prueba evaluatoria: desde tu ordenador o en los centros habilitados por UNIR.'],
        ] as [string, string, string][]
      ).map(([name, title, text]) => card({ icon: name, title, text, fill: 'secondary' })),
      'Metodología',
    ),
    { secondary: true, className: 'aem-card-block', heading: { title: 'Una metodología adaptada a ti' } },
  ),
  section(
    richText([], [
      'Ejercer como maestro o maestra en la etapa de 6 a 12 años en centros escolares públicos (tras aprobar la oposición), concertados y privados.',
      'Participar en proyectos educativos de organismos e instituciones como museos, agrupaciones artísticas y deportivas, teatros o centros culturales.',
      'Desarrollar proyectos educativos destinados al público infantil y colaborar con ONGs vinculadas a la infancia y la educación.',
      'Generar, revisar y distribuir materiales didácticos, libros de texto, programas informáticos y recursos digitales educativos, incluyendo apps educativas.',
      'Dirigir actividades extraescolares y diseñar propuestas pedagógicas en diferentes entornos culturales.',
      'Dar apoyo escolar en aulas hospitalarias o en el Servicio de Apoyo Educativo Domiciliario, además de investigar en el ámbito educativo.',
    ]),
    {
      id: 'seccion-3',
      heading: {
        title: '¿Qué oportunidades laborales ofrece estudiar Magisterio de Primaria?',
        text: 'El Grado en Educación Primaria online te permitirá dominar los procedimientos de enseñanza en esta etapa. Haz realidad tu vocación por la enseñanza o mejora profesionalmente con una perspectiva global e inclusiva. Esta titulación a distancia te habilita para:',
      },
    },
  ),
  section(
    richText([], [
      'Un itinerario bilingüe para impartir clases en inglés, ya sea en Infantil o Primaria.',
      'Acceder al Doble Grado en Infantil y Primaria para completar las asignaturas que te permitan ser un docente capaz de trabajar en ambas etapas educativas.',
      'Apostar por completar tu formación de Primaria con otro grado en Pedagogía.',
    ]),
    { flush: true, heading: { title: 'Completa tu formación en Educación Primaria', text: 'En caso de que quieras seguir estudiando y ampliando conocimientos relacionados con el área educativa, la universidad te ofrece:' } },
  ),
  section(
    richText([], [
      'Diseñarás, regularás y evaluarás procesos y espacios de enseñanza y aprendizaje, contemplando contextos de diversidad y plurilingües.',
      'Dominarás herramientas tecnológicas al servicio de los procesos de enseñanza.',
      'Conocerás las áreas curriculares y los conocimientos disciplinarios derivados.',
      'Comprenderás la organización de los centros y la legislación que les afecta.',
      'Colaborarás con los diferentes sectores partícipes de la comunidad educativa.',
      'Desempeñarás las funciones de tutoría y de orientación, fomentando la convivencia en el aula y fuera de ella.',
    ]),
    {
      flush: true,
      heading: {
        title: 'Perfil profesional',
        text: 'Al estudiar magisterio en UNIR conseguirás desarrollar tu proactividad, exigencia, responsabilidad, compromiso y nivel de adaptación gracias a la metodología 100% online. Además de interiorizar los contenidos necesarios para el desarrollo de la actividad laboral como docente de Primaria, te prepararás con las últimas tendencias en competencias digitales. Como maestro egresado:',
      },
    },
  ),
  section(
    figures([
      ['+100', '', 'centros educativos te están buscando', ''],
      ['+800', '', 'vacantes ofertadas en Educación', ''],
      ['70', '%', 'de nuestros egresados logró cambiar de empleo', ''],
    ]),
    { flush: true, heading: { title: 'Encuentra trabajo de maestro de Primaria en el Portal de Empleo de UNIR' } },
  ),
  section(
    accordion(
      items([
        '¿Qué caracteriza a la Educación Primaria?',
        '¿En qué casos es especialmente interesante cursar el Grado en Educación Primaria en modalidad online?',
        '¿Cómo son las prácticas del Grado en Magisterio Primaria?',
        '¿Cómo acceder al Grado en Educación Primaria desde Infantil?',
        '¿Cuánto tiempo implica la adaptación al Grado de Maestro en Educación Primaria?',
        '¿Qué es una mención y cuánto dura? ¿Es obligatoria?',
        'Con el título de Maestro en Educación Primaria, ¿puedo ejercer en todo el territorio europeo?',
      ]),
    ),
    { id: 'seccion-4', flush: true, className: 'aem-accordion-block', heading: { title: 'Resuelve tus dudas' } },
  ),
  section(
    `${profiles([
      [
        'Dirección',
        [
          [pageImg('prof-rodriguez'), 'Directora académica', 'Carlota Pérez Sancho', 'Doctora en Educación y Licenciada en Psicopedagogía por la Universidad de Navarra. Acreditada por ANECA y con un sexenio CNEAI. Directora de Área de Grados y Directora Académica de los Grados en Educación Infantil y Primaria.'],
          [pageImg('prof-inigo'), 'Coordinadora académica', 'Irene Martínez Hernández', 'Licenciada en Pedagogía, Máster en Psicología de la Educación, ambas en la universidad de Murcia. Es Tutora de Seguimiento Presencial en el Programa en Acompañamiento en Centros Educativos de UNIR.'],
        ],
      ],
      [
        'Nuestros expertos y docentes destacados',
        [
          [pageImg('prof-mosquera'), 'Docente UNIR', 'Ana Mª Aguirre Ocaña', ''],
          [pageImg('prof-marcos'), 'Docente UNIR', 'Analía Barbón Gutiérrez', 'Doctora en Psicología por la Universidad de Oviedo, con la calificación de Sobresaliente Cum Laude. Premio extraordinario de Doctorado de su promoción. Especialista en Psicología del lenguaje, con experiencia clínica e investigadora.'],
          [pageImg('prof-ruiz'), 'Docente UNIR', 'Miguel Ángel Ruiz Domínguez', 'Dirige el portal educativo Yo Soy Tu Profe, referencia en el sector con cerca de un millón de visitas mensuales y distintos reconocimientos. Además, colabora con distintos medios de comunicación divulgando aspectos pedagógicos.'],
          [pageImg('prof-diago'), 'Docente UNIR', 'Mª Luz Diago Egaña', 'Doctora en Ciencias Biológicas por la Universidad de León. Trabajó como docente de posgrado en la Universidad ULBRA de Brasil. En 2000 se incorporó como docente e investigadora en el área de Biología Celular a IE Universidad (Segovia).'],
        ],
      ],
    ])}
<div class="aem-list-block__actions">
  <a class="aem-button aem-button--outlined" href="#">Ver más profesores</a>
  <p class="aem-list-block__count">Has visto 6 de 31 profesores</p>
</div>`,
    {
      id: 'seccion-5',
      flush: true,
      heading: {
        title: '¿Qué equipo docente forma parte del Grado de Primaria online de UNIR?',
        text: 'Se trata de docentes e investigadores en activo en colegios, que comparten sus conocimientos mediante la docencia universitaria. La mayoría son doctores acreditados por ANECA y están especializados en diferentes ámbitos, como acoso escolar, neurociencia, TIC, videojuegos, orientación educativa o atención temprana, entre otros.',
      },
    },
  ),
  section(
    testimonials([
      ['La figura del tutor para mí fue muy importante y la valoré muy positivamente, porque me llamaban y estaban pendientes de mí. El hecho de poder hacer prácticas en UNIR me permitió presentarme y hacer que me conocieran. Si tienes claro tu objetivo, es una universidad que realmente vale la pena.', 'Agnés Muntanyola', 'Egresada del Grado en Maestro de Educación Primaria', pageImg('alumni-sanz')],
    ]),
    { flush: true, heading: { title: 'Conoce la experiencia de nuestros egresados' } },
  ),
  section(reviews('Valoración media de 75 valoraciones', '* Opiniones recogidas por UNIR a través de encuestas de satisfacción.', []), {
    flush: true,
    heading: {
      title: 'Nuestros estudiantes valoran el título',
      text: 'La opinión que nuestros egresados tienen de nuestros grados, másteres oficiales y títulos propios es muy valiosa. Nos sirve para seguir mejorando y para que los futuros estudiantes tengan una referencia sobre las titulaciones, los docentes o nuestra metodología 100% online.',
    },
  }),
  section(accordion(items(['Perfil recomendado', 'Requisitos de acceso', 'Criterios específicos', 'Proceso de admisión'])), {
    id: 'seccion-6',
    flush: true,
    className: 'aem-accordion-block',
    heading: { title: '¿Cómo acceder al Grado en Maestro de Educación Primaria en UNIR?' },
  }),
  section(
    `${accordion(items(['Calidad en la titulación', 'Documentación de la titulación', 'Documentación específica', 'Reconocimiento de créditos']))}
<p class="aem-heading__text"><strong>Convocatoria actual: 9 mar 2026</strong></p>
<a class="aem-link-button" href="#">Ver calendario ${icon('caret-right')}</a>`,
    { id: 'seccion-7', flush: true, className: 'aem-accordion-block', heading: { title: 'Documentación de Calidad de la titulación y normativa' } },
  ),
  section(
    carousel(
      [
        programCard(pageImg('program-generic'), 'Grado en Maestro en', 'Educación Infantil', ['4 cursos', '240 ECTS', '9 mar 2026']),
        programCard(pageImg('program-generic'), 'Grado Combinado en Maestro en', 'Educación Infantil y Primaria', ['5 cursos', '342 ECTS', '9 mar 2026']),
        programCard(pageImg('program-generic'), 'Experto Universitario en', 'Enseñanza de la Religión Católica en Infantil y Primaria (DECA)', ['19 semanas', '24 ECTS', '9 mar 2026']),
      ],
      'Otras titulaciones',
    ),
    { secondary: true, className: 'aem-card-block', heading: { title: 'Otras titulaciones que podrían interesarte' } },
  ),
];

const meta: Meta = {
  title: 'AEM/Pages/Ficha Grado Educación',
  parameters: {
    figmaUrl: pagesFigma('2561:17638'),
    order: 2,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Ficha de grado (Maestro en Educación Primaria): hero con datos clave, anclas, descripción con texto destacado, reconocimiento de créditos, cifras, menciones, banner de oposiciones, plan de estudios, metodología, salidas, empleo, preguntas, claustro, testimonio, valoraciones, admisión, calidad y otras titulaciones, junto al formulario lateral.',
      },
    },
  },
  render: () => ({
    template: `<div class="aem-page">
${moduleHtml(navigationHeader)}
<div class="aem-page__aside-layout">
<main>
${content.join('\n')}
</main>
<aside aria-label="Solicita información">
${formPanel([
  ['calendar-blank', 'Abierta próxima convocatoria'],
  ['clock', 'Hasta 40% de descuento hasta el 15 de abril'],
  ['lightning', 'Plazas limitadas', true],
])}
</aside>
</div>
${moduleHtml(footer, { showContact: true })}
</div>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
