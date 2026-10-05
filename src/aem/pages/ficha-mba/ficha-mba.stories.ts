import type { Meta, StoryObj } from '@storybook/angular';
import footer from '../../components/footer/footer.stories';
import navigationHeader from '../../components/navigation-header/navigation-header.stories';
import { icon } from '../../stories/helpers';
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

const TITLE = 'Formación del Profesorado de Educación Secundaria Obligatoria y Bachillerato, Formación Profesional y Enseñanzas de Idiomas';

const panel = (title: string) => `Información detallada sobre ${title.toLowerCase().replace(/[¿?]/g, '')}: consulta los requisitos, el calendario y las condiciones en la guía de la titulación.`;
const items = (titles: string[], tag?: string): [string, string, string?][] => titles.map((t, i) => [t, panel(t), i === 0 ? tag : undefined]);

const content = [
  hero({
    crumbs: ['Inicio', 'Educación', `Máster en ${TITLE}`],
    pretitle: 'Máster Universitario en',
    title: TITLE,
    text: 'Aquí comienza tu carrera como docente, de forma práctica, con casos reales y una selección de 18 especialidades',
    data: [
      ['Inicio', '9 mar 2026'],
      ['Duración', '1 curso'],
      ['Créditos', '60 ECTS'],
      ['Modalidad', 'Online'],
      ['Especialidades', '18'],
      ['Prácticas', '9 ECTS'],
    ],
  }),
  `<div class="aem-section aem-section--flush aem-page__anchors" style="padding-bottom: 0">\n${anchors(['Descripción', 'Plan de Estudios', 'Salidas Profesionales', 'FAQ', 'Claustro', 'Admisión', 'Calidad'])}\n</div>`,
  section('', {
    id: 'seccion-1',
    heading: {
      title: 'Conviértete en docente con el Máster en Formación del Profesorado online en Educación Secundaria (MAES)',
      subtitle: 'Tu forma de enseñar impulsa el futuro de tus estudiantes',
      text: 'El Máster en Formación del Profesorado es un posgrado habilitante que capacita para dar clase en ESO, Bachillerato, FP, Escuelas Oficiales de Idiomas y Centros de Educación de Personas Adultas. Hasta 2009, se exigía el CAP, pero fue reemplazado por esta titulación oficial. La duración de esta formación es de un curso académico y en UNIR se ofrece en modalidad online, con 18 especialidades a elegir, para que puedas estudiar en línea aquella que más se adecúe a tu formación previa y a tus intereses. Te formarás con una metodología práctica e integral gracias a nuestras clases orientadas a la resolución de supuestos prácticos.',
    },
  }),
  section(
    `${richText([
      'Apostamos por una evaluación basada en la aplicación de competencias y conocimientos de forma práctica. Además, tendrás la oportunidad de completar tu formación con cursos y talleres voluntarios incluidos en el Máster del Profesorado online.',
      '<strong>Centrados en el aprendizaje experiencial: “aprende haciendo”.</strong> Asimilarás los conceptos de forma sencilla gracias a la interconexión entre todas las asignaturas y una metodología basada en la resolución de problemas, casos prácticos y no memorizando conceptos.',
      '<strong>Trabajamos con exámenes prácticos y evaluación continua.</strong> Cada asignatura cuenta con un examen final que implicará que resuelvas de manera práctica un caso de aula con todo lo aprendido. Realizarás un máximo de 2 actividades por asignatura, siendo una transversal entre materias.',
      '<strong>Accede al Curso de Competencias y Habilidades Docentes.</strong> Complementa tu formación con contenido sobre prevención y mediación de conflictos, preparación de tutorías con las familias o herramientas para trabajar la concentración. Otorga 5 ECTS adicionales baremables en oposiciones.',
    ])}
${downloads([['Descargar el Plan de Estudios', 'Archivo.PDF']])}
<a class="aem-link-button" href="#">Ver calendario académico ${icon('caret-right')}</a>`,
    { flush: true, heading: { title: '¿Cómo es estudiar el Máster en Educación Secundaria online (antiguo CAP) en UNIR?' } },
  ),
  section(
    figures([
      ['1ª', '', 'posición en másteres online de Formación del Profesorado', 'Mejor Ranking El Mundo, 2025'],
      ['+28', 'mil', 'estudiantes se han formado como docentes', ''],
      ['+95', '%', 'de nuestros matriculados supera con éxito el máster', ''],
    ]),
    { flush: true, heading: { title: 'Cifras que avalan la calidad del Máster del Profesorado de UNIR' } },
  ),
  section(
    richText([], [
      'Compatibilizarás mejor tus estudios con tu vida personal y laboral gracias a un Prácticum concentrado en 9 ECTS (156h).',
      'Sabrás cómo aplicar propuestas docentes innovadoras que te permitan adaptarte a las necesidades del aula.',
      'Descubrirás cómo utilizar la tecnología educativa para favorecer la mejora del aprendizaje y potenciar la motivación del alumnado.',
      'Elaborarás instrumentos de evaluación con estrategias y técnicas que te permitirán motivar el aprendizaje significativo.',
      'Aplicarás metodologías didácticas adaptadas a la atención a la diversidad de los estudiantes.',
      'Aprenderás a elaborar tus propios materiales educativos con los que trabajar durante tus clases.',
    ]),
    {
      flush: true,
      heading: {
        title: '¿Por qué estudiar el Máster del Profesorado online de UNIR?',
        subtitle: 'Tu forma de enseñar impulsa el futuro de tus estudiantes',
        text: 'Al matricularte en este Máster Universitario en Formación del Profesorado vivirás una experiencia enriquecedora en la que conocerás de cerca la realidad de cómo ser profesor de Secundaria, Bachillerato, FP o idiomas. Te presentamos los motivos que hacen de nuestra oferta la elección perfecta para tu futuro educativo:',
      },
    },
  ),
  section(
    richText([], [
      'Sesiones en directo con especialistas, en las que se abordará el recorrido completo de la oposición (antes, durante y después de las pruebas).',
      'Clases magistrales grabadas con pautas sobre cómo preparar y destacar en la elaboración de la programación didáctica que presentarás en las oposiciones.',
      'Materiales complementarios descargables con presentaciones, planillas, dossier de ayuda y ejemplos de programaciones.',
      'Una herramienta interactiva para consultar la legislación por cada Comunidad Autónoma.',
    ]),
    {
      flush: true,
      heading: {
        title: 'Aula oposiciones: recursos prácticos para afrontarlas con seguridad',
        text: 'Sabemos que uno de tus posibles objetivos es presentarte a oposiciones. Por ello, ponemos a tu disposición formación complementaria y recursos especializados orientados a su preparación, diseñados junto a expertos de la Escuela de Oposiciones de UNIR. Contarás con:',
      },
    },
  ),
  section(accordion(items(['Curso de Competencias y Habilidades Docentes', 'Workshop Premium de IA para docentes'], 'Incluido')), {
    flush: true,
    className: 'aem-accordion-block',
    heading: { title: 'Conviértete en un experto en docencia con el MAES online', text: 'Completa tu formación con cursos y talleres que te hagan destacar e impulsen tu carrera a otro nivel.' },
  }),
  section('', {
    id: 'seccion-2',
    flush: true,
    heading: {
      title: '¿Qué asignaturas encontrarás en el Máster Universitario en Formación del Profesorado online de UNIR?',
      subtitle: 'Tu forma de enseñar impulsa el futuro de tus estudiantes',
      text: 'En este máster para ser profesor las asignaturas están interconectadas para que relaciones los conocimientos aprendidos y adquieras un aprendizaje significativo que te ayude a impulsar tu labor docente. Estas se dividen de distinta manera según la especialidad que elijas de entre las 18 que te ofrecemos.',
    },
  }),
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
  section(
    `${accordion(items(['Física y Química', 'Biología y Geología', 'Matemáticas', 'Geografía e Historia', 'Lengua Castellana y Literatura', 'Lenguas Extranjeras (Inglés)', 'Economía y Empresa', 'Tecnología e Informática', 'Orientación Educativa']))}
<a class="aem-link-button" href="#">Consulta la tabla de accesos ${icon('caret-right')}</a>`,
    {
      flush: true,
      className: 'aem-accordion-block',
      heading: {
        title: 'Elige entre 18 especialidades del Máster de Profesorado',
        text: 'Este amplio número de especialidades para el Máster de Profesorado de UNIR nos sitúa como la universidad privada online (recogidas en el RD 665/2015) con la mayor oferta educativa del mercado. Descubre cuáles puedes cursar según tus intereses y la titulación previa que hayas estudiado.',
      },
    },
  ),
  section(accordion(items(['Prácticas profesionales', 'Trabajo de Fin de Máster', 'Sistema de evaluación', 'Departamentos de apoyo al estudiante'])), {
    flush: true,
    className: 'aem-accordion-block',
    heading: { title: 'Experiencia formativa y apoyo' },
  }),
  section(
    carousel(
      (
        [
          ['chalkboard-simple', 'Clases 100% online', 'Fórmate con sesiones en directo en el Campus Virtual, plantea tus dudas directamente a los docentes y conecta con compañeros. Si no puedes, accede a las grabaciones cuando lo necesites.'],
          ['users', 'Seguimiento personalizado', 'Nuestros Mentores - UNIR te acompañarán durante todo el curso vía mail o telefónica. Recibe orientación académica y organiza tus estudios según tus objetivos.'],
          ['file', 'Aprendizaje basado en problemas', 'Encuentra soluciones a retos diarios con profesores en activo que te aporten su perspectiva. Aplica el aprendizaje cooperativo, el aula invertida o la gamificación.'],
          ['square-logo', 'Participa en talleres prácticos', 'Descubre otras maneras de enfocar tu trabajo en el aula con experiencias reales de otros docentes, nuevas herramientas y metodologías.'],
          ['tree-structure', 'Formación integral y competencial', 'Todas las asignaturas están interconectadas para formarte de manera transversal a lo largo del curso. Sabrás qué es importante y cómo aplicarlo en el aula.'],
        ] as [string, string, string][]
      ).map(([name, title, text]) => card({ icon: name, title, text, fill: 'secondary' })),
      'Metodología',
    ),
    { secondary: true, className: 'aem-card-block', heading: { title: 'Una metodología adaptada a ti' } },
  ),
  section(
    richText([], [
      'Docente en Educación Secundaria Obligatoria y Bachillerato dentro de tu especialidad: adquirirás las competencias para saber transmitir tus conocimientos a estudiantes adolescentes.',
      'Profesor/a de lengua extranjera en Escuelas Oficiales de Idiomas y en centros educativos públicos, privados y concertados de enseñanza reglada.',
      'Jefatura de estudios: una vez adquirida experiencia docente, podrás llegar a ejercer la jefatura de departamento en el área de tu especialidad.',
      'Docente de Formación Profesional en los grados afines a tu formación: sabrás cómo transmitir tu experiencia profesional a estudiantes que estén iniciándose en su etapa laboral.',
      'Tutor/a: adquirirás conocimientos que te permitirán comenzar tu formación como docente para poder llegar a tutorizar a grupos de estudiantes en los colegios e institutos.',
      'Coordinador/a de proyectos educativos: iniciarás el camino hacia el liderazgo en la coordinación de diferentes proyectos educativos que se realicen en el centro.',
    ]),
    {
      id: 'seccion-3',
      heading: {
        title: '¿Qué salidas profesionales ofrece el Máster en Formación del Profesorado online?',
        text: 'Este Máster online de Profesorado constituye un requisito indispensable para ser docente en los distintos niveles de la Educación Secundaria, Bachillerato, Formación Profesional y enseñanza de idiomas. Actualmente, es la única vía que existe para que trabajes como docente tanto en centros públicos como privados o concertados. Así lo establece la Ley Orgánica 2/2006, de 3 de mayo, de Educación en sus artículos 94, 95 y 97.',
      },
    },
  ),
  section(
    richText([], [
      'Desarrollar tus clases mediante metodologías, herramientas y recursos didácticos que te permitan lograr un aprendizaje significativo de tus estudiantes.',
      'Participar en el desarrollo integral de tus estudiantes y fomentar las habilidades interpersonales en el aula.',
      'Convertir los objetivos generales en logros concretos y adaptar el currículo y la acción educativa a las circunstancias específicas de los centros a través de una adecuada preparación pedagógica.',
      'Crear proyectos de innovación que contribuyan a la permanente mejora cualitativa del sistema educativo.',
    ]),
    {
      flush: true,
      heading: {
        title: 'Perfil profesional',
        text: 'Al finalizar el Máster Universitario en Formación del Profesorado estarás habilitado para ser profesor u orientador de Educación Secundaria Obligatoria y Bachillerato, Formación Profesional y enseñanzas de idiomas. Las capacidades que habrás adquirido en el máster te permitirán:',
      },
    },
  ),
  section(
    richText([], [
      'Curso de Cualificación para la Enseñanza de Lengua y Literatura: te permitirá impartir Lengua Castellana y Literatura (Secundaria) y Literatura Universal (Bachillerato).',
      'Curso de Cualificación para la Enseñanza de Filosofía y Valores Éticos: te cualificará para impartir Educación en Valores Cívicos y Éticos (Secundaria) y Filosofía e Historia de la Filosofía (Bachillerato).',
      'Curso de Cualificación para la Enseñanza de Geografía e Historia: podrás impartir Ciencias Sociales (Secundaria) y Geografía e Historia (Bachillerato).',
    ]),
    {
      flush: true,
      heading: {
        title: 'Impulsa tu formación con un curso de cualificación',
        text: 'Mejora tu perfil profesional y amplía tus opciones laborales en el mundo de la docencia con uno o varios cursos de cualificación que puedes añadir tras acabar tu MAES online. Si estudias entre 24 y 36 ECTS podrás impartir varias asignaturas en Secundaria y Bachillerato en centros privados y concertados*',
      },
    },
  ),
  section(
    carousel(
      (
        [
          ['logo-aneca', 'ANECA', 'Centro certificado por ANECA, según el modelo AUDIT', 'Los títulos oficiales de la Facultad de Ciencias de la Educación y de Humanidades de UNIR están certificados por AUDIT y cuentan con la Acreditación Institucional otorgada por la Agencia Nacional de Evaluación y Acreditación.'],
          ['logo-qs', 'QS Stars', 'UNIR: una universidad de 5 estrellas, según QS Stars', 'UNIR alcanza la máxima calificación en el rating de la reconocida consultora británica. Estamos entre las mejores universidades en línea del mundo tras superar ampliamente todos los requisitos exigibles.'],
          ['logo-the-color', 'Times Higher Education', 'UNIR, la universidad en línea nº1 del mundo en español, según Times Higher Education', 'La prestigiosa revista THE reconoce a UNIR en 2024 como la primera universidad hispanohablante en línea del mundo y nos distingue desde 2023 como la universidad privada en línea número 1 de España en Educación.'],
          ['logo-forbes-color', 'Forbes', 'Líderes en innovación educativa, según ‘Forbes’', 'Forbes nos posiciona entre las tres mejores universidades de España y como la primera online, y destaca a UNIR como un referente global en la formación online por su metodología.'],
        ] as [string, string, string, string][]
      ).map(([file, alt, title, text]) => card({ logo: [pageImg(file, 'png'), alt], title, text, fill: 'secondary' })),
      'Reconocimientos',
    ),
    { secondary: true, className: 'aem-card-block', heading: { title: 'Reconocimientos académicos' } },
  ),
  section(
    accordion(
      items([
        '¿Qué es el CAP para ser profesor?',
        '¿Cuánto dura el Máster del Profesorado?',
        '¿Qué me va a aportar el Máster en Formación del Profesorado?',
        '¿El Máster de Profesorado solo habilita para ejercer como docente en la especialidad cursada?',
        '¿En qué tipo de centros educativos puedo realizar las prácticas del Máster de Profesorado de Secundaria y Bachillerato?',
        'Si vivo fuera de España, ¿tendría que realizar las prácticas en el extranjero?',
        '¿Cuánto cuesta el MAES? ¿Qué condiciones financieras ofrece UNIR?',
      ]),
    ),
    { id: 'seccion-4', className: 'aem-accordion-block', heading: { title: 'Resuelve tus dudas' } },
  ),
  section(
    `${profiles([
      [
        'Dirección',
        [
          [pageImg('prof-rodriguez'), 'Directora académica', 'Inmaculada Rodríguez Moranta', 'Directora Académica del MU en Formación del Profesorado en Educación Secundaria, Bachillerato, Formación Profesional y Enseñanza de Idiomas. Acreditada ANECA como Profesora Contratada Doctora y con Sexenio de Investigación por la CNEAI.'],
          [pageImg('prof-inigo'), 'Coordinadora académica', 'Victoria Íñigo Mendoza', 'Doctora en Ciencias Agrarias y Alimentarias. Licenciada en Química. Es la coordinadora académica del Máster en Formación del Profesorado en Educación Secundaria Obligatoria y Bachillerato, Formación Profesional y Enseñanza de Idiomas.'],
        ],
      ],
      [
        'Nuestros expertos y docentes destacados',
        [
          [pageImg('prof-mosquera'), 'Docente UNIR', 'Ingrid Mosquera Gende', 'Profesora Titular de Universidad. Finalista en los premios Educa Abanca 2025 como Mejor Docente de España. Mejor Docente de España Categoría Universidad VIII Premios EDUCA ABANCA 2024.'],
          [pageImg('prof-marcos'), 'Docente UNIR', 'Rafael Marcos Sánchez', 'Doctor en Economía, Licenciado en Ciencias Económicas y Empresariales y licenciado en Ciencias Actuariales por la Universidad Complutense de Madrid. Profesor en UNIR desde 2011.'],
          [pageImg('prof-ruiz'), 'Docente UNIR', 'Miguel Ángel Ruiz Domínguez', 'Dirige el portal educativo Yo Soy Tu Profe, referencia en el sector con cerca de un millón de visitas mensuales y distintos reconocimientos. Además, colabora con distintos medios de comunicación divulgando aspectos pedagógicos.'],
          [pageImg('prof-diago'), 'Docente UNIR', 'Mª Luz Diago Egaña', 'Doctora en Ciencias Biológicas por la Universidad de León. Trabajó como docente de posgrado en la Universidad ULBRA de Brasil. En 2000 se incorporó como docente e investigadora en el área de Biología Celular a IE Universidad (Segovia).'],
        ],
      ],
    ])}
<div class="aem-list-block__actions">
  <a class="aem-button aem-button--outlined" href="#">Ver más profesores</a>
  <p class="aem-list-block__count">Has visto 9 de 31 profesores</p>
</div>`,
    {
      id: 'seccion-5',
      flush: true,
      heading: {
        title: 'Estudia el Máster del Profesorado de la mano de profesores con experiencia en las aulas',
        text: 'El equipo del Máster en Profesorado a distancia consta de profesores en activo, altamente cualificados, con una dilatada experiencia profesional en su área. Contamos con docentes que han sido distinguidos en los prestigiosos premios educativos Educa Abanca, que se conceden por la excelencia educativa, la implicación en el proceso de la enseñanza y su repercusión social.',
      },
    },
  ),
  section(
    testimonials([
      ['“Lo más destacable de la titulación, sin duda, son los docentes. Además, la programación está pensada de forma global para que todas las asignaturas se interconecten con un hilo conductor común, lo que facilita mucho el progreso conjunto entre todas las asignaturas.”', 'José Manuel Sanz', 'Estudiante del Máster en Profesorado', pageImg('alumni-sanz')],
    ]),
    { flush: true, heading: { title: 'Conoce la experiencia de nuestros egresados' } },
  ),
  section(
    reviews('Valoración media de 63 valoraciones', '*Opiniones recogidas por UNIR a través de encuestas de satisfacción', [
      ['Lo que más he valorado de la titulación que he cursado en UNIR es la flexibilidad que permite poder compaginar trabajo y estudios, además de otras cuestiones como la calidad de los docentes, las sesiones informativas sobre todas las cuestiones del máster, etc.', 'Alan Peries Castaño'],
      ['La profesionalidad del equipo humano de UNIR que deriva en un trato excelente que favorece la motivación y una metodología rica en materiales bien seleccionados. La experiencia académica en UNIR me ha encantado y he podido alcanzar mis objetivos formativos.', 'Aitor Jiménez Fernández'],
      ['Los profesores tienen gran experiencia en el campo de la docencia, compaginando las clases de UNIR con centros de secundaria, lo que les da una visión de la realidad, y no sólo de lo que pone en los manuales. Además, en mi caso concreto, la UNIR me ayudó a encontrar las prácticas en el centro.', 'Begoña López Arias'],
    ]),
    {
      flush: true,
      heading: {
        title: 'Nuestros estudiantes valoran el título',
        text: 'La opinión que nuestros egresados tienen de nuestros grados, másteres oficiales y títulos propios es muy valiosa. Nos sirve para seguir mejorando y para que los futuros estudiantes tengan una referencia sobre las titulaciones, los docentes o nuestra metodología 100% online.',
      },
    },
  ),
  section(card({ title: 'Descubre la historia personal de José Antonio, egresado del máster', fill: 'image', image: pageImg('video-jose-antonio'), play: true, mediaHeight: '28.3125rem' }), {
    flush: true,
    heading: { title: 'Aprende más sobre la titulación' },
  }),
  section(accordion(items(['Perfil recomendado', 'Requisitos de acceso', 'Criterios específicos', 'Proceso de admisión'])), {
    id: 'seccion-6',
    flush: true,
    className: 'aem-accordion-block',
    heading: { title: '¿Cómo acceder al Máster online del Profesorado de UNIR?' },
  }),
  section(
    `${accordion(items(['Calidad en la titulación', 'Documentación de la Titulación', 'Documentación específica', 'Reconocimiento de créditos']))}
<p class="aem-heading__text"><strong>Convocatoria actual: 9 mar 2026</strong></p>
<a class="aem-link-button" href="#">Ver calendario ${icon('caret-right')}</a>`,
    { id: 'seccion-7', flush: true, className: 'aem-accordion-block', heading: { title: 'Documentación de Calidad de la titulación y normativa' } },
  ),
  section(
    carousel(
      [
        programCard(pageImg('program-generic'), 'Certificado oficial en', 'Formación Pedagógica y Didáctica para Técnicos de Formación Profesional', ['1 curso', '60 ECTS', '16 mar 2026']),
        programCard(pageImg('program-generic'), 'Máster Universitario en', 'Tecnología Educativa y Competencias Digitales', ['1 curso', '60 ECTS', '16 mar 2026']),
        programCard(pageImg('program-generic'), 'Máster Universitario en', 'Estudios Avanzados en Literatura Española y Latinoamericana', ['1 curso', '60 ECTS', '16 mar 2026']),
        programCard(pageImg('program-generic'), 'Máster Universitario en', 'Neuropsicología y Educación', ['1 curso', '60 ECTS', '16 mar 2026']),
      ],
      'Otras titulaciones',
    ),
    { secondary: true, className: 'aem-card-block', heading: { title: 'Otras titulaciones que podrían interesarte' } },
  ),
];

const meta: Meta = {
  title: 'AEM/Pages/Ficha MBA',
  parameters: {
    figmaUrl: pagesFigma('2026:171803'),
    order: 1,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Ficha de programa (Máster en Formación del Profesorado): hero con datos clave, menú de anclas, descripción, cifras, plan de estudios con tabla, especialidades, metodología, salidas, reconocimientos, preguntas, claustro, testimonios, valoraciones, vídeo, admisión, calidad y otras titulaciones, junto al formulario lateral fijo.',
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
