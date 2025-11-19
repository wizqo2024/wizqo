// Translation system - Central export
import { en } from './en'
import { es } from './es'
import { ar } from './ar'

export type Language = 'en' | 'es' | 'ar'

export const translations = {
  en,
  es,
  ar,
} as const

// Explicitly export interactive worksheet keys to prevent tree-shaking
// This ensures these keys are included in the bundle
export const interactiveWorksheetKeys = {
  en: {
    countObjectsAndWriteNumber: en.worksheets.countObjectsAndWriteNumber,
    countThe: en.worksheets.countThe,
    numberLabel: en.worksheets.numberLabel,
    objectNames: en.worksheets.objectNames,
    mathPuzzle: en.worksheets.mathPuzzle,
    mathRace: en.worksheets.mathRace,
    reflection: en.worksheets.reflection,
  },
  es: {
    countObjectsAndWriteNumber: es.worksheets.countObjectsAndWriteNumber,
    countThe: es.worksheets.countThe,
    numberLabel: es.worksheets.numberLabel,
    objectNames: es.worksheets.objectNames,
    mathPuzzle: es.worksheets.mathPuzzle,
    mathRace: es.worksheets.mathRace,
    reflection: es.worksheets.reflection,
  },
  ar: {
    countObjectsAndWriteNumber: ar.worksheets.countObjectsAndWriteNumber,
    countThe: ar.worksheets.countThe,
    numberLabel: ar.worksheets.numberLabel,
    objectNames: ar.worksheets.objectNames,
    mathPuzzle: ar.worksheets.mathPuzzle,
    mathRace: ar.worksheets.mathRace,
    reflection: ar.worksheets.reflection,
  },
} as const

// Runtime merge: Ensure worksheet keys are always present
// This fixes the tree-shaking issue by directly injecting the keys
const ensureWorksheetKeys = () => {
  // First, ensure interactive worksheet keys
  ensureInteractiveWorksheetKeys()
  
  // Then, ensure times-table worksheet keys
  ensureTimesTableWorksheetKeys()
  
  // Then, ensure place-value-hto worksheet keys
  ensurePlaceValueHtoKeys()
  
  // Then, ensure count-circle-1-10 worksheet keys
  ensureCountCircleKeys()
}

const ensureInteractiveWorksheetKeys = () => {
  // Define the keys directly to prevent tree-shaking
  const interactiveKeys = {
    en: {
      countObjectsAndWriteNumber: 'Count the objects and write the number.',
      countThe: 'Count the {{object}}',
      numberLabel: 'Number',
      objectNames: {
        stars: 'stars',
        hearts: 'hearts',
        circles: 'circles',
        apples: 'apples',
        balls: 'balls',
        flowers: 'flowers',
        butterflies: 'butterflies',
        fish: 'fish',
      },
      mathPuzzle: {
        instructions: 'Fill in the missing numbers to complete each equation. Show a different strategy (number line, draw, tens frame) for at least two puzzles.',
        answerLabel: 'Puzzle {{number}} answer',
      },
      mathRace: {
        instructions: 'Set a 60-second timer. Solve as many facts as you can, then circle your personal record.',
      },
      reflection: {
        title: 'Reflection',
        mathRaceQuestions: 'How many facts did you solve? ______ • Which strategy helped you most? ____________________',
        generalQuestions: 'What helped you complete your tasks? What would you do differently next time?',
        mandalaQuestion: 'Reflection: How did creating this mandala make you feel?',
      },
    },
    es: {
      countObjectsAndWriteNumber: 'Cuenta los objetos y escribe el número.',
      countThe: 'Cuenta {{object}}',
      numberLabel: 'Número',
      objectNames: {
        stars: 'estrellas',
        hearts: 'corazones',
        circles: 'círculos',
        apples: 'manzanas',
        balls: 'pelotas',
        flowers: 'flores',
        butterflies: 'mariposas',
        fish: 'peces',
      },
      mathPuzzle: {
        instructions: 'Completa los números faltantes para completar cada ecuación. Muestra una estrategia diferente (recta numérica, dibujo, marco de diez) para al menos dos rompecabezas.',
        answerLabel: 'Respuesta del rompecabezas {{number}}',
      },
      mathRace: {
        instructions: 'Configura un temporizador de 60 segundos. Resuelve tantos hechos como puedas, luego marca tu récord personal.',
      },
      reflection: {
        title: 'Reflexión',
        mathRaceQuestions: '¿Cuántos hechos resolviste? ______ • ¿Qué estrategia te ayudó más? ____________________',
        generalQuestions: '¿Qué te ayudó a completar tus tareas? ¿Qué harías diferente la próxima vez?',
        mandalaQuestion: 'Reflexión: ¿Cómo te hizo sentir crear este mandala?',
      },
    },
    ar: {
      countObjectsAndWriteNumber: 'عد الكائنات واكتب الرقم.',
      countThe: 'عد {{object}}',
      numberLabel: 'الرقم',
      objectNames: {
        stars: 'النجوم',
        hearts: 'القلوب',
        circles: 'الدوائر',
        apples: 'التفاح',
        balls: 'الكرات',
        flowers: 'الزهور',
        butterflies: 'الفراشات',
        fish: 'الأسماك',
      },
      mathPuzzle: {
        instructions: 'املأ الأرقام المفقودة لإكمال كل معادلة. أظهر استراتيجية مختلفة (خط الأعداد، الرسم، إطار العشرة) لاثنين على الأقل من الألغاز.',
        answerLabel: 'إجابة اللغز {{number}}',
      },
      mathRace: {
        instructions: 'اضبط مؤقتاً لمدة 60 ثانية. حل أكبر عدد ممكن من الحقائق، ثم ضع دائرة حول رقمك الشخصي.',
      },
      reflection: {
        title: 'التفكير',
        mathRaceQuestions: 'كم عدد الحقائق التي حللتها؟ ______ • ما الاستراتيجية التي ساعدتك أكثر؟ ____________________',
        generalQuestions: 'ما الذي ساعدك على إكمال مهامك؟ ماذا ستفعل بشكل مختلف في المرة القادمة؟',
        mandalaQuestion: 'التفكير: كيف جعلك إنشاء هذا الماندالا تشعر؟',
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = interactiveKeys[lang]
      
      // Only merge if keys are missing (to avoid overwriting if they exist)
      if (!worksheets.countObjectsAndWriteNumber) {
        worksheets.countObjectsAndWriteNumber = keys.countObjectsAndWriteNumber
      }
      if (!worksheets.countThe) {
        worksheets.countThe = keys.countThe
      }
      if (!worksheets.numberLabel) {
        worksheets.numberLabel = keys.numberLabel
      }
      if (!worksheets.objectNames) {
        worksheets.objectNames = keys.objectNames
      }
      if (!worksheets.mathPuzzle) {
        worksheets.mathPuzzle = keys.mathPuzzle
      }
      if (!worksheets.mathRace) {
        worksheets.mathRace = keys.mathRace
      }
      if (!worksheets.reflection) {
        worksheets.reflection = keys.reflection
      }
    }
  }
}

// Ensure place-value-hto worksheet keys are present
const ensurePlaceValueHtoKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const placeValueKeys = {
    en: {
      'place-value-hto': {
        title: 'Place Value – Tens and Ones (to 99)',
        description: 'Write how many tens and ones in each number. Then write the complete number in expanded form in the blank spaces.',
        learningObjectives: [
          'Understand place value: tens and ones',
          'Break numbers into tens and ones',
          'Write numbers in expanded form',
        ],
        parentTeacherTips: [
          'The tens place tells how many groups of 10',
          'The ones place tells how many extra ones',
          'Expanded form shows the value of each place',
          'Example: 47 = 4 tens + 7 ones = 40 + 7',
          'Extension: Try with 3-digit numbers (hundreds, tens, ones)',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          number: 'Number:',
          tensLabel: '4 tens = 40',
          onesLabel: '7 ones = 7',
          expandedLabel: '47 = 40 + 7',
          step1: 'Step 1: Find tens:',
          step1Text: '47 has 4 tens (40)',
          step2: 'Step 2: Find ones:',
          step2Text: '47 has 7 ones',
          step3: 'Step 3: Expanded form:',
          step3Text: '40 + 7',
          answer: 'Answer:',
          answerText: 'Tens: 4, Ones: 7, Expanded: 40 + 7',
          tip: '💡 Tip: The tens digit tells you how many groups of 10, the ones digit tells you how many extra ones!',
        },
        legend: {
          tenLabel: '= 1 Ten (10)',
          oneLabel: '= 1 One',
        },
        labels: {
          number: 'Number:',
          tens: 'Tens:',
          ones: 'Ones:',
          expanded: 'Expanded:',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Write 56 in expanded form: ___ + ___',
            'What number has 8 tens and 3 ones? ___',
            'Can you write a 3-digit number in expanded form? (hundreds, tens, ones)',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I understand tens and ones',
            'I can break numbers into tens and ones',
            'I can write numbers in expanded form',
          ],
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
        },
      },
    },
    es: {
      'place-value-hto': {
        title: 'Valor Posicional – Decenas y Unidades (hasta 99)',
        description: 'Escribe cuántas decenas y unidades hay en cada número. Luego escribe el número completo en forma expandida en los espacios en blanco.',
        learningObjectives: [
          'Entender el valor posicional: decenas y unidades',
          'Descomponer números en decenas y unidades',
          'Escribir números en forma expandida',
        ],
        parentTeacherTips: [
          'El lugar de las decenas indica cuántos grupos de 10',
          'El lugar de las unidades indica cuántas unidades extra',
          'La forma expandida muestra el valor de cada posición',
          'Ejemplo: 47 = 4 decenas + 7 unidades = 40 + 7',
          'Extensión: Prueba con números de 3 dígitos (centenas, decenas, unidades)',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          number: 'Número:',
          tensLabel: '4 decenas = 40',
          onesLabel: '7 unidades = 7',
          expandedLabel: '47 = 40 + 7',
          step1: 'Paso 1: Encuentra las decenas:',
          step1Text: '47 tiene 4 decenas (40)',
          step2: 'Paso 2: Encuentra las unidades:',
          step2Text: '47 tiene 7 unidades',
          step3: 'Paso 3: Forma expandida:',
          step3Text: '40 + 7',
          answer: 'Respuesta:',
          answerText: 'Decenas: 4, Unidades: 7, Expandida: 40 + 7',
          tip: '💡 Consejo: ¡El dígito de las decenas te dice cuántos grupos de 10, el dígito de las unidades te dice cuántas unidades extra!',
        },
        legend: {
          tenLabel: '= 1 Decena (10)',
          oneLabel: '= 1 Unidad',
        },
        labels: {
          number: 'Número:',
          tens: 'Decenas:',
          ones: 'Unidades:',
          expanded: 'Expandida:',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Escribe 56 en forma expandida: ___ + ___',
            '¿Qué número tiene 8 decenas y 3 unidades? ___',
            '¿Puedes escribir un número de 3 dígitos en forma expandida? (centenas, decenas, unidades)',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Entiendo las decenas y unidades',
            'Puedo descomponer números en decenas y unidades',
            'Puedo escribir números en forma expandida',
          ],
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
        },
      },
    },
    ar: {
      'place-value-hto': {
        title: 'القيمة المكانية – العشرات والآحاد (حتى 99)',
        description: 'اكتب كم عشرة وكم واحد في كل رقم. ثم اكتب الرقم الكامل في الصورة الموسعة في المسافات الفارغة.',
        learningObjectives: [
          'فهم القيمة المكانية: العشرات والآحاد',
          'تحليل الأرقام إلى عشرات وآحاد',
          'كتابة الأرقام في الصورة الموسعة',
        ],
        parentTeacherTips: [
          'مكان العشرات يخبرك بعدد مجموعات الـ 10',
          'مكان الآحاد يخبرك بعدد الآحاد الإضافية',
          'الصورة الموسعة تُظهر قيمة كل مكان',
          'مثال: 47 = 4 عشرات + 7 آحاد = 40 + 7',
          'التمديد: جرب مع أرقام من 3 أرقام (مئات، عشرات، آحاد)',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          number: 'الرقم:',
          tensLabel: '4 عشرات = 40',
          onesLabel: '7 آحاد = 7',
          expandedLabel: '47 = 40 + 7',
          step1: 'الخطوة 1: ابحث عن العشرات:',
          step1Text: '47 لديه 4 عشرات (40)',
          step2: 'الخطوة 2: ابحث عن الآحاد:',
          step2Text: '47 لديه 7 آحاد',
          step3: 'الخطوة 3: الصورة الموسعة:',
          step3Text: '40 + 7',
          answer: 'الإجابة:',
          answerText: 'العشرات: 4، الآحاد: 7، الموسعة: 40 + 7',
          tip: '💡 نصيحة: رقم العشرات يخبرك بعدد مجموعات الـ 10، رقم الآحاد يخبرك بعدد الآحاد الإضافية!',
        },
        legend: {
          tenLabel: '= عشرة واحدة (10)',
          oneLabel: '= واحد واحد',
        },
        labels: {
          number: 'الرقم:',
          tens: 'العشرات:',
          ones: 'الآحاد:',
          expanded: 'الموسعة:',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'اكتب 56 في الصورة الموسعة: ___ + ___',
            'ما الرقم الذي لديه 8 عشرات و 3 آحاد؟ ___',
            'هل يمكنك كتابة رقم من 3 أرقام في الصورة الموسعة؟ (مئات، عشرات، آحاد)',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'أفهم العشرات والآحاد',
            'يمكنني تحليل الأرقام إلى عشرات وآحاد',
            'يمكنني كتابة الأرقام في الصورة الموسعة',
          ],
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = placeValueKeys[lang]
      
      // Only merge if keys are missing (to avoid overwriting if they exist)
      if (keys['place-value-hto'] && !worksheets['place-value-hto']) {
        worksheets['place-value-hto'] = keys['place-value-hto']
      }
    }
  }
}

// Ensure count-circle-1-10 worksheet keys are present
const ensureCountCircleKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const countCircleKeys = {
    en: {
      'count-circle-1-10': {
        title: 'Count & Circle 1–10',
        description: 'Count the objects in each box. Circle the correct number.',
        learningObjectives: [
          'Count objects accurately up to 10',
          'Match quantities to numerals',
          'Develop one-to-one correspondence',
          'Build number recognition skills',
        ],
        parentTeacherTips: [
          'Encourage students to point to each object as they count',
          'Use one-to-one correspondence: one object = one number',
          'Help students recognize that the last number counted is the total',
          'Practice counting aloud: 1, 2, 3, 4, 5...',
          'Extension: Try counting larger groups or counting backwards',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: 'Count the circles and circle the correct number',
          step1: 'Step 1:',
          step1Text: 'Point to each circle and count: 1, 2, 3, 4, 5',
          step2: 'Step 2:',
          step2Text: 'The last number counted is 5, so there are 5 circles',
          step3: 'Step 3:',
          step3Text: 'Circle the number 5',
          answer: 'Answer:',
          answerText: 'Circle 5',
          tip: '💡 Tip: Count each object once, and the last number you say is the total!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Count objects around you: How many pencils? How many books?',
            'Draw your own group of objects and count them',
            'Try counting backwards from 10: 10, 9, 8, 7...',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can count objects accurately',
            'I can match quantities to numbers',
            'I circled all {count} correct numbers',
          ],
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
        },
      },
    },
    es: {
      'count-circle-1-10': {
        title: 'Contar y Encerrar 1–10',
        description: 'Cuenta los objetos en cada caja. Encierra el número correcto.',
        learningObjectives: [
          'Contar objetos con precisión hasta 10',
          'Hacer coincidir cantidades con numerales',
          'Desarrollar correspondencia uno a uno',
          'Desarrollar habilidades de reconocimiento de números',
        ],
        parentTeacherTips: [
          'Anima a los estudiantes a señalar cada objeto mientras cuentan',
          'Usa correspondencia uno a uno: un objeto = un número',
          'Ayuda a los estudiantes a reconocer que el último número contado es el total',
          'Practica contando en voz alta: 1, 2, 3, 4, 5...',
          'Extensión: Intenta contar grupos más grandes o contar hacia atrás',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: 'Cuenta los círculos y encierra el número correcto',
          step1: 'Paso 1:',
          step1Text: 'Señala cada círculo y cuenta: 1, 2, 3, 4, 5',
          step2: 'Paso 2:',
          step2Text: 'El último número contado es 5, así que hay 5 círculos',
          step3: 'Paso 3:',
          step3Text: 'Encierra el número 5',
          answer: 'Respuesta:',
          answerText: 'Encierra el 5',
          tip: '💡 Consejo: ¡Cuenta cada objeto una vez, y el último número que digas es el total!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Cuenta objetos a tu alrededor: ¿Cuántos lápices? ¿Cuántos libros?',
            'Dibuja tu propio grupo de objetos y cuéntalos',
            'Intenta contar hacia atrás desde 10: 10, 9, 8, 7...',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo contar objetos con precisión',
            'Puedo hacer coincidir cantidades con números',
            'Encerré todos los {count} números correctos',
          ],
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
        },
      },
    },
    ar: {
      'count-circle-1-10': {
        title: 'عد وأحط 1–10',
        description: 'عد الكائنات في كل صندوق. أحط الرقم الصحيح.',
        learningObjectives: [
          'عد الكائنات بدقة حتى 10',
          'مطابقة الكميات مع الأرقام',
          'تطوير المراسلة واحد لواحد',
          'بناء مهارات التعرف على الأرقام',
        ],
        parentTeacherTips: [
          'شجع الطلاب على الإشارة إلى كل كائن أثناء العد',
          'استخدم المراسلة واحد لواحد: كائن واحد = رقم واحد',
          'ساعد الطلاب على إدراك أن آخر رقم تم عدّه هو المجموع',
          'تدرب على العد بصوت عالٍ: 1، 2، 3، 4، 5...',
          'امتداد: جرب عد مجموعات أكبر أو العد للخلف',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: 'عد الدوائر وأحط الرقم الصحيح',
          step1: 'الخطوة 1:',
          step1Text: 'أشر إلى كل دائرة وعد: 1، 2، 3، 4، 5',
          step2: 'الخطوة 2:',
          step2Text: 'آخر رقم تم عدّه هو 5، إذن هناك 5 دوائر',
          step3: 'الخطوة 3:',
          step3Text: 'أحط الرقم 5',
          answer: 'الإجابة:',
          answerText: 'أحط 5',
          tip: '💡 نصيحة: عد كل كائن مرة واحدة، وآخر رقم تقوله هو المجموع!',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          items: [
            'عد الكائنات من حولك: كم قلم؟ كم كتاب؟',
            'ارسم مجموعة خاصة بك من الكائنات وعدها',
            'جرب العد للخلف من 10: 10، 9، 8، 7...',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني عد الكائنات بدقة',
            'يمكنني مطابقة الكميات مع الأرقام',
            'أحطت جميع الأرقام الصحيحة {count}',
          ],
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = countCircleKeys[lang]
      
      // Only merge if keys are missing (to avoid overwriting if they exist)
      if (keys['count-circle-1-10'] && !worksheets['count-circle-1-10']) {
        worksheets['count-circle-1-10'] = keys['count-circle-1-10']
      }
    }
  }
}

// Ensure times-table worksheet keys are present
const ensureTimesTableWorksheetKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const timesTableKeys = {
    en: {
      'times-table-horizontal-1-5': {
        title: 'Horizontal Times Table (1-5)',
        description: 'Practice times tables 1-5 in horizontal format. Write the answer in each blank. Build confidence with simple, stress-free multiplication practice.',
        learningObjectives: [
          'Memorize multiplication facts for numbers 1-5',
          'Practice multiplication in horizontal format',
          'Build speed and accuracy with basic facts',
        ],
        parentTeacherTips: [
          'Start with easier facts (1s, 2s) and work up to 5s',
          'Use skip counting to help: 3 × 4 means count by 3s four times',
          'Practice daily for 5-10 minutes for best results',
          'Extension: Time yourself and try to beat your record!',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '3 × 4 = ?',
          method1: 'Method 1 (Skip Counting):',
          method1Text: 'Count by 3s four times: 3, 6, 9, 12',
          method2: 'Method 2 (Repeated Addition):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Method 3 (Visual):',
          method3Text: '3 groups of 4 objects = 12 objects',
          answer: 'Answer:',
          answerText: '12',
          tip: '💡 Tip: You can also think of it as 4 × 3 = 12 (order doesn\'t matter!)',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Create your own multiplication problem: ___ × ___ = ?',
            'Solve: 5 × 5 = ? (the biggest fact in this worksheet!)',
            'Write all the facts that equal 12: ___ × ___ = 12',
            'Time yourself: Can you complete all 15 problems in under 2 minutes?',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can multiply numbers 1-5 easily',
            'I need more practice with some facts',
            'I can say the answers quickly (fluency)',
          ],
          score: 'My score:',
          timeTaken: 'Time taken:',
          minutes: 'minutes',
          factsToPractice: 'Facts I want to practice more:',
        },
        answerKey: {
          title: '✅ Answer Key',
          studyTip: '💡 Study Tip:',
          studyTipText: 'Practice saying these facts out loud daily. Try to answer faster each time!',
        },
      },
      'times-table-vertical-1-5': {
        title: 'Vertical Times Table (1-5)',
        description: 'Practice times tables 1-5 in vertical format. Write the answer in each blank. Build confidence with simple, stress-free multiplication practice.',
        learningObjectives: [
          'Memorize multiplication facts for numbers 1-5',
          'Practice multiplication in vertical format',
          'Build speed and accuracy with basic facts',
        ],
        parentTeacherTips: [
          'Start with easier facts (1s, 2s) and work up to 5s',
          'Use skip counting to help: 3 × 4 means count by 3s four times',
          'Practice daily for 5-10 minutes for best results',
          'Extension: Time yourself and try to beat your record!',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '3 × 4 = ?',
          method1: 'Method 1 (Skip Counting):',
          method1Text: 'Count by 3s four times: 3, 6, 9, 12',
          method2: 'Method 2 (Repeated Addition):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Method 3 (Visual):',
          method3Text: '3 groups of 4 objects = 12 objects',
          answer: 'Answer:',
          answerText: '12',
          tip: '💡 Tip: You can also think of it as 4 × 3 = 12 (order doesn\'t matter!)',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Create your own multiplication problem: ___ × ___ = ?',
            'Solve: 5 × 5 = ? (the biggest fact in this worksheet!)',
            'Write all the facts that equal 12: ___ × ___ = 12',
            'Time yourself: Can you complete all 15 problems in under 2 minutes?',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can multiply numbers 1-5 easily',
            'I need more practice with some facts',
            'I can say the answers quickly (fluency)',
          ],
          score: 'My score:',
          timeTaken: 'Time taken:',
          minutes: 'minutes',
          factsToPractice: 'Facts I want to practice more:',
        },
        answerKey: {
          title: '✅ Answer Key',
          studyTip: '💡 Study Tip:',
          studyTipText: 'Practice saying these facts out loud daily. Try to answer faster each time!',
        },
      },
    },
    es: {
      'times-table-horizontal-1-5': {
        title: 'Tabla de Multiplicar Horizontal (1-5)',
        description: 'Practica las tablas de multiplicar del 1 al 5 en formato horizontal. Escribe la respuesta en cada espacio en blanco. Desarrolla confianza con práctica de multiplicación simple y sin estrés.',
        learningObjectives: [
          'Memorizar las tablas de multiplicar para los números 1-5',
          'Practicar la multiplicación en formato horizontal',
          'Desarrollar velocidad y precisión con operaciones básicas',
        ],
        parentTeacherTips: [
          'Comienza con operaciones más fáciles (1s, 2s) y avanza hasta 5s',
          'Usa el conteo saltado para ayudar: 3 × 4 significa contar de 3 en 3 cuatro veces',
          'Practica diariamente durante 5-10 minutos para mejores resultados',
          'Extensión: ¡Cronométrate e intenta superar tu récord!',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '3 × 4 = ?',
          method1: 'Método 1 (Conteo Saltado):',
          method1Text: 'Cuenta de 3 en 3 cuatro veces: 3, 6, 9, 12',
          method2: 'Método 2 (Suma Repetida):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Método 3 (Visual):',
          method3Text: '3 grupos de 4 objetos = 12 objetos',
          answer: 'Respuesta:',
          answerText: '12',
          tip: '💡 Consejo: ¡También puedes pensarlo como 4 × 3 = 12 (el orden no importa!)',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Crea tu propio problema de multiplicación: ___ × ___ = ?',
            'Resuelve: 5 × 5 = ? (¡la operación más grande en esta hoja de trabajo!)',
            'Escribe todas las operaciones que igualan 12: ___ × ___ = 12',
            'Cronométrate: ¿Puedes completar las 15 operaciones en menos de 2 minutos?',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo multiplicar números del 1 al 5 fácilmente',
            'Necesito más práctica con algunas operaciones',
            'Puedo decir las respuestas rápidamente (fluidez)',
          ],
          score: 'Mi puntuación:',
          timeTaken: 'Tiempo tomado:',
          minutes: 'minutos',
          factsToPractice: 'Operaciones que quiero practicar más:',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          studyTip: '💡 Consejo de Estudio:',
          studyTipText: '¡Practica diciendo estas operaciones en voz alta diariamente. Intenta responder más rápido cada vez!',
        },
      },
      'times-table-vertical-1-5': {
        title: 'Tabla de Multiplicar Vertical (1-5)',
        description: 'Practica las tablas de multiplicar 1-5 en formato vertical. Escribe la respuesta en cada espacio en blanco. Desarrolla confianza con práctica de multiplicación simple y sin estrés.',
        learningObjectives: [
          'Memorizar las operaciones de multiplicación para los números 1-5',
          'Practicar multiplicación en formato vertical',
          'Desarrollar velocidad y precisión con operaciones básicas',
        ],
        parentTeacherTips: [
          'Comienza con operaciones más fáciles (1s, 2s) y avanza hasta 5s',
          'Usa el conteo saltado para ayudar: 3 × 4 significa contar de 3 en 3 cuatro veces',
          'Practica diariamente durante 5-10 minutos para mejores resultados',
          'Extensión: ¡Cronométrate e intenta superar tu récord!',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '3 × 4 = ?',
          method1: 'Método 1 (Conteo Saltado):',
          method1Text: 'Cuenta de 3 en 3 cuatro veces: 3, 6, 9, 12',
          method2: 'Método 2 (Suma Repetida):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Método 3 (Visual):',
          method3Text: '3 grupos de 4 objetos = 12 objetos',
          answer: 'Respuesta:',
          answerText: '12',
          tip: '💡 Consejo: También puedes pensarlo como 4 × 3 = 12 (¡el orden no importa!)',
        },
        challenge: {
          title: '🌟 Desafíate a Ti Mismo (Opcional):',
          items: [
            'Crea tu propio problema de multiplicación: ___ × ___ = ?',
            'Resuelve: 5 × 5 = ? (¡la operación más grande en esta hoja de trabajo!)',
            'Escribe todas las operaciones que igualan 12: ___ × ___ = 12',
            'Cronométrate: ¿Puedes completar los 15 problemas en menos de 2 minutos?',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo multiplicar números 1-5 fácilmente',
            'Necesito más práctica con algunas operaciones',
            'Puedo decir las respuestas rápidamente (fluidez)',
          ],
          score: 'Mi puntuación:',
          timeTaken: 'Tiempo tomado:',
          minutes: 'minutos',
          factsToPractice: 'Operaciones que quiero practicar más:',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          studyTip: '💡 Consejo de Estudio:',
          studyTipText: '¡Practica diciendo estas operaciones en voz alta diariamente. Intenta responder más rápido cada vez!',
        },
      },
    },
    ar: {
      'times-table-horizontal-1-5': {
        title: 'جدول الضرب الأفقي (1-5)',
        description: 'تدرب على جداول الضرب من 1 إلى 5 في التنسيق الأفقي. اكتب الإجابة في كل فراغ. بناء الثقة مع ممارسة الضرب البسيطة والخالية من الإجهاد.',
        learningObjectives: [
          'حفظ حقائق الضرب للأرقام 1-5',
          'ممارسة الضرب في التنسيق الأفقي',
          'بناء السرعة والدقة مع الحقائق الأساسية',
        ],
        parentTeacherTips: [
          'ابدأ بالحقائق الأسهل (1s، 2s) وتقدم حتى 5s',
          'استخدم العد المتخطي للمساعدة: 3 × 4 يعني العد بالثلاثات أربع مرات',
          'تدرب يومياً لمدة 5-10 دقائق للحصول على أفضل النتائج',
          'امتداد: قم بقياس وقتك وحاول تحطيم رقمك القياسي!',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: '3 × 4 = ?',
          method1: 'الطريقة 1 (العد المتخطي):',
          method1Text: 'عد بالثلاثات أربع مرات: 3، 6، 9، 12',
          method2: 'الطريقة 2 (الجمع المتكرر):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'الطريقة 3 (البصري):',
          method3Text: '3 مجموعات من 4 أشياء = 12 شيئاً',
          answer: 'الإجابة:',
          answerText: '12',
          tip: '💡 نصيحة: يمكنك أيضاً التفكير فيها كـ 4 × 3 = 12 (الترتيب لا يهم!)',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          items: [
            'أنشئ مسألة ضرب خاصة بك: ___ × ___ = ?',
            'حل: 5 × 5 = ? (أكبر حقيقة في هذه الورقة!)',
            'اكتب جميع الحقائق التي تساوي 12: ___ × ___ = 12',
            'قم بقياس وقتك: هل يمكنك إكمال جميع المسائل الـ 15 في أقل من دقيقتين؟',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني ضرب الأرقام 1-5 بسهولة',
            'أحتاج إلى مزيد من الممارسة مع بعض الحقائق',
            'يمكنني قول الإجابات بسرعة (الطلاقة)',
          ],
          score: 'نقاطي:',
          timeTaken: 'الوقت المستغرق:',
          minutes: 'دقائق',
          factsToPractice: 'الحقائق التي أريد ممارستها أكثر:',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          studyTip: '💡 نصيحة للدراسة:',
          studyTipText: 'تدرب على قول هذه الحقائق بصوت عالٍ يومياً. حاول الإجابة بشكل أسرع في كل مرة!',
        },
      },
      'times-table-vertical-1-5': {
        title: 'جدول الضرب العمودي (1-5)',
        description: 'تدرب على جداول الضرب 1-5 في التنسيق العمودي. اكتب الإجابة في كل فراغ. بناء الثقة مع ممارسة الضرب البسيطة والخالية من الإجهاد.',
        learningObjectives: [
          'حفظ حقائق الضرب للأرقام 1-5',
          'ممارسة الضرب في التنسيق العمودي',
          'بناء السرعة والدقة مع الحقائق الأساسية',
        ],
        parentTeacherTips: [
          'ابدأ بحقائق أسهل (1s، 2s) واعمل حتى 5s',
          'استخدم العد المتخطي للمساعدة: 3 × 4 يعني العد بالثلاثات أربع مرات',
          'تدرب يومياً لمدة 5-10 دقائق للحصول على أفضل النتائج',
          'التمديد: قم بتوقيت نفسك وحاول تحطيم رقمك القياسي!',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المشكلة:',
          problemText: '3 × 4 = ?',
          method1: 'الطريقة 1 (العد المتخطي):',
          method1Text: 'عد بالثلاثات أربع مرات: 3، 6، 9، 12',
          method2: 'الطريقة 2 (الجمع المتكرر):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'الطريقة 3 (البصري):',
          method3Text: '3 مجموعات من 4 أشياء = 12 شيئاً',
          answer: 'الإجابة:',
          answerText: '12',
          tip: '💡 نصيحة: يمكنك أيضاً التفكير في الأمر كـ 4 × 3 = 12 (الترتيب لا يهم!)',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'أنشئ مشكلة الضرب الخاصة بك: ___ × ___ = ?',
            'حل: 5 × 5 = ? (أكبر حقيقة في ورقة العمل هذه!)',
            'اكتب جميع الحقائق التي تساوي 12: ___ × ___ = 12',
            'قم بتوقيت نفسك: هل يمكنك إكمال جميع المشاكل الـ 15 في أقل من دقيقتين؟',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني ضرب الأرقام 1-5 بسهولة',
            'أحتاج إلى مزيد من الممارسة مع بعض الحقائق',
            'يمكنني قول الإجابات بسرعة (الطلاقة)',
          ],
          score: 'نقاطي:',
          timeTaken: 'الوقت المستغرق:',
          minutes: 'دقائق',
          factsToPractice: 'الحقائق التي أريد ممارستها أكثر:',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          studyTip: '💡 نصيحة للدراسة:',
          studyTipText: 'تدرب على قول هذه الحقائق بصوت عالٍ يومياً. حاول الإجابة بشكل أسرع في كل مرة!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = timesTableKeys[lang]
      
      // Only merge if keys are missing (to avoid overwriting if they exist)
      if (keys['times-table-horizontal-1-5'] && !worksheets['times-table-horizontal-1-5']) {
        worksheets['times-table-horizontal-1-5'] = keys['times-table-horizontal-1-5']
      }
      if (keys['times-table-vertical-1-5'] && !worksheets['times-table-vertical-1-5']) {
        worksheets['times-table-vertical-1-5'] = keys['times-table-vertical-1-5']
      }
    }
  }
}

// Run the merge immediately
ensureWorksheetKeys()

// Helper function to get translation with fallback
// Returns string, array, or object depending on the translation value
export function getTranslation(language: Language, key: string): string | any {
  try {
    const keys = key.split('.')
    let value: any = translations[language]
    
    // Debug logging removed - translations are working correctly
    if (false && typeof window !== 'undefined' && keys[0] === 'worksheets' && process.env.NODE_ENV === 'development') {
      const debugKey = `translation-debug-${language}`
      if (!(window as any)[debugKey]) {
        (window as any)[debugKey] = true
        const langObj = translations[language]
        const worksheetsObj = langObj && typeof langObj === 'object' ? langObj.worksheets : undefined
        const objectNamesObj = worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.objectNames : undefined
        
        console.log(`[getTranslation] Top-level translations structure for ${language}:`, {
          hasTranslations: !!translations,
          hasLanguage: !!langObj,
          languageType: typeof langObj,
          languageKeys: langObj && typeof langObj === 'object' ? Object.keys(langObj).slice(0, 20) : 'N/A',
          hasWorksheets: langObj && typeof langObj === 'object' ? 'worksheets' in langObj : false,
          worksheetsType: typeof worksheetsObj,
          worksheetsValue: worksheetsObj,
          worksheetsIsUndefined: worksheetsObj === undefined,
          worksheetsIsNull: worksheetsObj === null,
          worksheetsKeys: worksheetsObj && typeof worksheetsObj === 'object' ? Object.keys(worksheetsObj).slice(0, 30) : 'N/A',
          // Direct access to nested objects
          hasObjectNames: worksheetsObj && typeof worksheetsObj === 'object' ? 'objectNames' in worksheetsObj : false,
          objectNamesType: typeof objectNamesObj,
          objectNamesValue: objectNamesObj,
          objectNamesIsUndefined: objectNamesObj === undefined,
          objectNamesKeys: objectNamesObj && typeof objectNamesObj === 'object' ? Object.keys(objectNamesObj).slice(0, 10) : 'N/A',
          // Try direct access to specific keys
          directCountObjects: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.countObjectsAndWriteNumber : 'N/A',
          directCountThe: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.countThe : 'N/A',
          directNumberLabel: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.numberLabel : 'N/A',
          directObjectNamesBalls: objectNamesObj && typeof objectNamesObj === 'object' ? objectNamesObj.balls : 'N/A'
        })
      }
    }
    
    // Debug: Log if translations object is missing or malformed
    if (!value) {
      console.warn(`[getTranslation] Translation object not found for language: ${language}`, {
        availableLanguages: Object.keys(translations),
        translationsObject: translations,
        translationsType: typeof translations,
        hasEn: !!translations.en,
        hasAr: !!translations.ar,
        hasEs: !!translations.es,
        enType: typeof translations.en,
        arType: typeof translations.ar
      })
      // Fallback to English
      value = translations.en
      if (!value) {
        console.error(`[getTranslation] Even English fallback is missing!`, { translations })
        return key
      }
    }
    
    // Debug logging removed - translations are working correctly
    
    // Navigate through nested keys
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      if (value === null || value === undefined) {
        // If we're looking for interactive worksheet keys and they're missing,
        // try to get them from the exported interactiveWorksheetKeys
        // Only check interactiveWorksheetKeys for actual interactive keys (not regular worksheet keys)
        const INTERACTIVE_KEYS = ['countObjectsAndWriteNumber', 'countThe', 'numberLabel', 'objectNames', 'mathPuzzle', 'mathRace', 'reflection']
        if (keys[0] === 'worksheets' && i >= 1) {
          const interactiveKey = keys[1] as keyof typeof interactiveWorksheetKeys.en
          // Only try interactiveWorksheetKeys fallback if this is actually an interactive key
          if (interactiveKey && INTERACTIVE_KEYS.includes(interactiveKey) && interactiveWorksheetKeys[language] && interactiveKey in interactiveWorksheetKeys[language]) {
            const interactiveValue = (interactiveWorksheetKeys[language] as any)[interactiveKey]
            if (interactiveValue !== undefined) {
              if (typeof window !== 'undefined') {
                console.log(`[getTranslation] Using interactiveWorksheetKeys fallback for: ${key}, language: ${language}, interactiveKey: ${interactiveKey}`)
              }
              // Continue navigation from the interactive value
              value = interactiveValue
              // Continue with remaining keys if any (starting from index 2, since we already handled 0 and 1)
              for (let j = 2; j < keys.length; j++) {
                if (value === null || value === undefined) break
                value = value[keys[j]]
              }
              if (value !== null && value !== undefined) {
                if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
                  return value
                }
                if (typeof value === 'string') {
                  return value
                }
              }
            } else if (typeof window !== 'undefined') {
              console.warn(`[getTranslation] interactiveWorksheetKeys[${language}][${interactiveKey}] is undefined`)
            }
          }
          // Don't log warnings for non-interactive keys - they're just regular worksheet keys
        }
        
        // Debug logging removed - translations are working correctly
        break
      }
      value = value[k]
    }
    
    // If we got a valid value (string, array, or object), return it
    if (value !== null && value !== undefined) {
      // Return arrays and objects as-is
      if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
        return value
      }
      // Return strings (including empty strings) - but check if it's actually a translation
      if (typeof value === 'string') {
        // If the value is the same as the key, it might be a missing translation
        // But we still return it since it's a valid string
        return value
      }
    }
    
    // Fallback to English if translation missing
    if (language !== 'en') {
      let fallbackValue: any = translations.en
      if (fallbackValue) {
        for (const k of keys) {
          if (fallbackValue === null || fallbackValue === undefined) break
          fallbackValue = fallbackValue[k]
        }
        if (fallbackValue !== null && fallbackValue !== undefined) {
          // Return arrays and objects as-is
          if (Array.isArray(fallbackValue) || (typeof fallbackValue === 'object' && typeof fallbackValue !== 'string')) {
            return fallbackValue
          }
          // Return strings
          if (typeof fallbackValue === 'string') {
            return fallbackValue
          }
        }
      }
      // Also try interactiveWorksheetKeys fallback for English
      // Only check for actual interactive keys
      const INTERACTIVE_KEYS = ['countObjectsAndWriteNumber', 'countThe', 'numberLabel', 'objectNames', 'mathPuzzle', 'mathRace', 'reflection']
      if (keys[0] === 'worksheets' && keys.length >= 2) {
        const interactiveKey = keys[1] as keyof typeof interactiveWorksheetKeys.en
        if (interactiveKey && INTERACTIVE_KEYS.includes(interactiveKey) && interactiveWorksheetKeys.en && interactiveKey in interactiveWorksheetKeys.en) {
          const interactiveValue = (interactiveWorksheetKeys.en as any)[interactiveKey]
          if (interactiveValue !== undefined) {
            let englishValue = interactiveValue
            // Continue with remaining keys if any
            for (let j = 2; j < keys.length; j++) {
              if (englishValue === null || englishValue === undefined) break
              englishValue = englishValue[keys[j]]
            }
            if (englishValue !== null && englishValue !== undefined) {
              if (Array.isArray(englishValue) || (typeof englishValue === 'object' && typeof englishValue !== 'string')) {
                return englishValue
              }
              if (typeof englishValue === 'string') {
                return englishValue
              }
            }
          }
        }
      }
    }
    
    // Final fallback: return the key itself (so it's visible if translation missing)
    // Only warn in development to avoid console spam
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
    }
    return key
  } catch (error) {
    // If anything goes wrong, just return the key
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn('Translation error for key:', key, 'language:', language, error)
    }
    return key
  }
}

// Check if language is RTL
export function isRTL(language: Language): boolean {
  return language === 'ar'
}

// Get all available languages
export function getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]
}
