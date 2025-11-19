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
  
  // Then, ensure mult-facts-0-12 worksheet keys
  ensureMultFactsKeys()
  
  // Then, ensure math-maze worksheet keys
  ensureMathMazeKeys()
  
  // Then, ensure number-tracing-1-20 worksheet keys
  ensureNumberTracing120Keys()
  
  // Then, ensure addition-subtraction-0-10 worksheet keys
  ensureAdditionSubtraction010Keys()
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
          tensLabel: 'Tens',
          onesLabel: 'Ones',
          expandedLabel: 'Expanded',
        },
        labels: {
          number: 'Number:',
          tens: 'Tens:',
          ones: 'Ones:',
          expanded: 'Expanded:',
          more: '+{count} more',
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
          tensLabel: 'Decenas',
          onesLabel: 'Unidades',
          expandedLabel: 'Expandida',
        },
        labels: {
          number: 'Número:',
          tens: 'Decenas:',
          ones: 'Unidades:',
          expanded: 'Expandida:',
          more: '+{count} más',
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
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['place-value-hto']) {
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
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['count-circle-1-10']) {
        worksheets['count-circle-1-10'] = keys['count-circle-1-10']
      }
    }
  }
}

// Ensure mult-facts-0-12 worksheet keys are present
const ensureMultFactsKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const multFactsKeys = {
    en: {
      'mult-facts-0-12': {
        title: 'Multiplication Facts 0–12',
        description: 'Practice all multiplication facts from 0×0 to 12×12. Build speed and accuracy.',
        learningObjectives: [
          'Master multiplication facts from 0×0 to 12×12',
          'Build speed and accuracy with multiplication facts',
          'Memorize multiplication tables',
          'Develop fact fluency for mental math',
        ],
        parentTeacherTips: [
          'Practice daily for 5-10 minutes for best results',
          'Use strategies: doubles (6×6), skip counting, or arrays',
          'Start with easier facts (0s, 1s, 2s, 5s, 10s) and work up',
          'Use flashcards or games to make practice fun',
          'Extension: Time yourself and try to beat your record',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '6 × 4 = ?',
          strategy1: 'Strategy 1 (Skip counting):',
          strategy1Text: 'Count by 4s: 4, 8, 12, 16, 20, 24 (6 times)',
          strategy2: 'Strategy 2 (Arrays):',
          strategy2Text: '6 rows of 4 = 24',
          strategy3: 'Strategy 3 (Doubles):',
          strategy3Text: '6 × 2 = 12, so 6 × 4 = 12 + 12 = 24',
          answer: 'Answer:',
          answerText: '24',
          tip: '💡 Tip: Use the strategy that works best for you! Practice helps you memorize facts faster!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Time yourself: How fast can you solve all 20 problems?',
            'Try solving: 13 × 5 = ? and 11 × 12 = ?',
            'Create your own multiplication problems and solve them',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can solve multiplication facts quickly',
            'I know my multiplication facts from 0-12',
            'I solved all {count} problems correctly',
          ],
          score: 'My score:',
          time: 'My time:',
          minutes: 'minutes',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          remember: '💡 Remember: Practice makes perfect! Keep practicing your multiplication facts daily to build speed and accuracy!',
        },
      },
    },
    es: {
      'mult-facts-0-12': {
        title: 'Operaciones de Multiplicación 0–12',
        description: 'Practica todas las operaciones de multiplicación del 0×0 al 12×12. Desarrolla velocidad y precisión.',
        learningObjectives: [
          'Dominar las operaciones de multiplicación del 0×0 al 12×12',
          'Desarrollar velocidad y precisión con operaciones de multiplicación',
          'Memorizar las tablas de multiplicar',
          'Desarrollar fluidez en operaciones para cálculo mental',
        ],
        parentTeacherTips: [
          'Practica diariamente durante 5-10 minutos para mejores resultados',
          'Usa estrategias: dobles (6×6), conteo saltado o matrices',
          'Comienza con operaciones más fáciles (0s, 1s, 2s, 5s, 10s) y avanza',
          'Usa tarjetas o juegos para hacer la práctica divertida',
          'Extensión: Cronométrate e intenta superar tu récord',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '6 × 4 = ?',
          strategy1: 'Estrategia 1 (Conteo saltado):',
          strategy1Text: 'Cuenta de 4 en 4: 4, 8, 12, 16, 20, 24 (6 veces)',
          strategy2: 'Estrategia 2 (Matrices):',
          strategy2Text: '6 filas de 4 = 24',
          strategy3: 'Estrategia 3 (Dobles):',
          strategy3Text: '6 × 2 = 12, entonces 6 × 4 = 12 + 12 = 24',
          answer: 'Respuesta:',
          answerText: '24',
          tip: '💡 Consejo: ¡Usa la estrategia que mejor funcione para ti! ¡La práctica te ayuda a memorizar las operaciones más rápido!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Cronométrate: ¿Qué tan rápido puedes resolver los 20 problemas?',
            'Intenta resolver: 13 × 5 = ? y 11 × 12 = ?',
            'Crea tus propios problemas de multiplicación y resuélvelos',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo resolver operaciones de multiplicación rápidamente',
            'Conozco mis operaciones de multiplicación del 0-12',
            'Resolví correctamente todos los {count} problemas',
          ],
          score: 'Mi puntuación:',
          time: 'Mi tiempo:',
          minutes: 'minutos',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          remember: '💡 Recuerda: ¡La práctica hace la perfección! ¡Sigue practicando tus operaciones de multiplicación diariamente para desarrollar velocidad y precisión!',
        },
      },
    },
    ar: {
      'mult-facts-0-12': {
        title: 'حقائق الضرب 0–12',
        description: 'تدرب على جميع حقائق الضرب من 0×0 إلى 12×12. بناء السرعة والدقة.',
        learningObjectives: [
          'إتقان حقائق الضرب من 0×0 إلى 12×12',
          'بناء السرعة والدقة مع حقائق الضرب',
          'حفظ جداول الضرب',
          'تطوير الطلاقة في الحقائق للحساب الذهني',
        ],
        parentTeacherTips: [
          'تدرب يومياً لمدة 5-10 دقائق للحصول على أفضل النتائج',
          'استخدم الاستراتيجيات: المضاعفات (6×6)، العد المتخطي، أو المصفوفات',
          'ابدأ بحقائق أسهل (0s، 1s، 2s، 5s، 10s) واعمل حتى',
          'استخدم البطاقات التعليمية أو الألعاب لجعل الممارسة ممتعة',
          'التمديد: قم بتوقيت نفسك وحاول تحطيم رقمك القياسي',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المشكلة:',
          problemText: '6 × 4 = ?',
          strategy1: 'الاستراتيجية 1 (العد المتخطي):',
          strategy1Text: 'عد بالـ 4: 4، 8، 12، 16، 20، 24 (6 مرات)',
          strategy2: 'الاستراتيجية 2 (المصفوفات):',
          strategy2Text: '6 صفوف من 4 = 24',
          strategy3: 'الاستراتيجية 3 (المضاعفات):',
          strategy3Text: '6 × 2 = 12، إذن 6 × 4 = 12 + 12 = 24',
          answer: 'الإجابة:',
          answerText: '24',
          tip: '💡 نصيحة: استخدم الاستراتيجية التي تناسبك أكثر! الممارسة تساعدك على حفظ الحقائق بشكل أسرع!',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'قم بتوقيت نفسك: ما مدى سرعة حل جميع المشاكل الـ 20؟',
            'حاول حل: 13 × 5 = ? و 11 × 12 = ?',
            'أنشئ مشاكل الضرب الخاصة بك وحلها',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني حل حقائق الضرب بسرعة',
            'أعرف حقائق الضرب من 0-12',
            'حللت جميع المشاكل الـ {count} بشكل صحيح',
          ],
          score: 'نقاطي:',
          time: 'وقتي:',
          minutes: 'دقائق',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          remember: '💡 تذكر: الممارسة تصنع الكمال! استمر في ممارسة حقائق الضرب يومياً لبناء السرعة والدقة!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = multFactsKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['mult-facts-0-12']) {
        worksheets['mult-facts-0-12'] = keys['mult-facts-0-12']
      }
    }
  }
}

// Ensure math-maze worksheet keys are present
const ensureMathMazeKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const mathMazeKeys = {
    en: {
      'math-maze': {
        title: 'Math Maze Adventure',
        description: 'Start at S and reach F. Move up/down/left/right only onto tiles whose equation equals the target shown in that row. Circle your path!',
        learningObjectives: [
          'Solve addition and subtraction equations',
          'Navigate through a maze using math skills',
          'Apply problem-solving strategies',
          'Practice mental math and number recognition',
        ],
        parentTeacherTips: [
          'Choose a target number for each row before starting',
          'Only move onto tiles where the equation equals the row target',
          'Work backwards: start from F and find valid paths',
          'Encourage students to check their math as they go',
          'Extension: Create your own math maze with different equations',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: 'Find a path from S to F',
          step1: 'Step 1:',
          step1Text: 'Choose target numbers for each row (e.g., Row 1 = 6, Row 2 = 8, Row 3 = 10)',
          step2: 'Step 2:',
          step2Text: 'Find tiles in Row 1 that equal 6: 4+2=6, 8-2=6, etc.',
          step3: 'Step 3:',
          step3Text: 'Move to Row 2 and find tiles that equal 8: 6+2=8, 9-1=8, etc.',
          step4: 'Step 4:',
          step4Text: 'Continue to Row 3 and find tiles that equal 10: 7+3=10, 12-2=10, etc.',
          step5: 'Step 5:',
          step5Text: 'Draw your path from S to F following valid tiles',
          tip: '💡 Tip: Check each equation before moving onto that tile!',
        },
        howToPlay: {
          title: 'How to play',
          step1: 'Choose a target number per row (e.g., row 1 = 6).',
          step2: 'Step only on equations that equal that row\'s target.',
          step3: 'Draw your path from S to F without diagonal moves.',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Can you find a different path using different target numbers?',
            'Try using only addition equations (no subtraction)',
            'Create your own math maze with 3 rows and 5 columns',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can solve addition and subtraction equations',
            'I found a valid path from S to F',
            'I checked my math as I went',
          ],
          targetNumbers: 'My target numbers:',
          targetNumbersFormat: 'Row 1: ___, Row 2: ___, Row 3: ___',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          exampleTargetPlan: 'Example target plan:',
          row1: 'Row 1 target: 6 → valid tiles: 4+2, 8-2, 3+3, etc.',
          row2: 'Row 2 target: 8 → valid tiles: 6+2, 9-1, 5+3, etc.',
          row3: 'Row 3 target: 10 → valid tiles: 7+3, 12-2, 5+5, etc.',
          remember: '💡 Remember: Any path that follows the row targets is correct! Choose your own target numbers and find a valid path from S to F.',
        },
      },
    },
    es: {
      'math-maze': {
        title: 'Aventura de Laberinto Matemático',
        description: 'Comienza en S y llega a F. Muévete arriba/abajo/izquierda/derecha solo sobre casillas cuya ecuación sea igual al objetivo mostrado en esa fila. ¡Marca tu camino!',
        learningObjectives: [
          'Resolver ecuaciones de suma y resta',
          'Navegar por un laberinto usando habilidades matemáticas',
          'Aplicar estrategias de resolución de problemas',
          'Practicar cálculo mental y reconocimiento de números',
        ],
        parentTeacherTips: [
          'Elige un número objetivo para cada fila antes de comenzar',
          'Solo muévete sobre casillas donde la ecuación sea igual al objetivo de la fila',
          'Trabaja hacia atrás: comienza desde F y encuentra caminos válidos',
          'Anima a los estudiantes a verificar sus cálculos mientras avanzan',
          'Extensión: Crea tu propio laberinto matemático con diferentes ecuaciones',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: 'Encuentra un camino de S a F',
          step1: 'Paso 1:',
          step1Text: 'Elige números objetivo para cada fila (ej., Fila 1 = 6, Fila 2 = 8, Fila 3 = 10)',
          step2: 'Paso 2:',
          step2Text: 'Encuentra casillas en la Fila 1 que sean igual a 6: 4+2=6, 8-2=6, etc.',
          step3: 'Paso 3:',
          step3Text: 'Muévete a la Fila 2 y encuentra casillas que sean igual a 8: 6+2=8, 9-1=8, etc.',
          step4: 'Paso 4:',
          step4Text: 'Continúa a la Fila 3 y encuentra casillas que sean igual a 10: 7+3=10, 12-2=10, etc.',
          step5: 'Paso 5:',
          step5Text: 'Dibuja tu camino de S a F siguiendo casillas válidas',
          tip: '💡 Consejo: ¡Verifica cada ecuación antes de moverte a esa casilla!',
        },
        howToPlay: {
          title: 'Cómo jugar',
          step1: 'Elige un número objetivo por fila (ej., fila 1 = 6).',
          step2: 'Pisa solo ecuaciones que sean igual al objetivo de esa fila.',
          step3: 'Dibuja tu camino de S a F sin movimientos diagonales.',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            '¿Puedes encontrar un camino diferente usando diferentes números objetivo?',
            'Intenta usar solo ecuaciones de suma (sin resta)',
            'Crea tu propio laberinto matemático con 3 filas y 5 columnas',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo resolver ecuaciones de suma y resta',
            'Encontré un camino válido de S a F',
            'Verifiqué mis cálculos mientras avanzaba',
          ],
          targetNumbers: 'Mis números objetivo:',
          targetNumbersFormat: 'Fila 1: ___, Fila 2: ___, Fila 3: ___',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          exampleTargetPlan: 'Plan de objetivo de ejemplo:',
          row1: 'Fila 1 objetivo: 6 → casillas válidas: 4+2, 8-2, 3+3, etc.',
          row2: 'Fila 2 objetivo: 8 → casillas válidas: 6+2, 9-1, 5+3, etc.',
          row3: 'Fila 3 objetivo: 10 → casillas válidas: 7+3, 12-2, 5+5, etc.',
          remember: '💡 Recuerda: ¡Cualquier camino que siga los objetivos de las filas es correcto! Elige tus propios números objetivo y encuentra un camino válido de S a F.',
        },
      },
    },
    ar: {
      'math-maze': {
        title: 'مغامرة متاهة الرياضيات',
        description: 'ابدأ من S ووصل إلى F. تحرك لأعلى/لأسفل/يسار/يمين فقط على المربعات التي تساوي معادلتها الهدف الموضح في ذلك الصف. ضع دائرة حول مسارك!',
        learningObjectives: [
          'حل معادلات الجمع والطرح',
          'التنقل عبر متاهة باستخدام مهارات الرياضيات',
          'تطبيق استراتيجيات حل المشكلات',
          'ممارسة الحساب الذهني والتعرف على الأرقام',
        ],
        parentTeacherTips: [
          'اختر رقم هدف لكل صف قبل البدء',
          'تحرك فقط على المربعات حيث المعادلة تساوي هدف الصف',
          'اعمل للخلف: ابدأ من F وابحث عن مسارات صحيحة',
          'شجع الطلاب على التحقق من حساباتهم أثناء التقدم',
          'التمديد: أنشئ متاهة رياضية خاصة بك بمعادلات مختلفة',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المشكلة:',
          problemText: 'ابحث عن مسار من S إلى F',
          step1: 'الخطوة 1:',
          step1Text: 'اختر أرقام هدف لكل صف (مثلاً، الصف 1 = 6، الصف 2 = 8، الصف 3 = 10)',
          step2: 'الخطوة 2:',
          step2Text: 'ابحث عن مربعات في الصف 1 تساوي 6: 4+2=6، 8-2=6، إلخ.',
          step3: 'الخطوة 3:',
          step3Text: 'انتقل إلى الصف 2 وابحث عن مربعات تساوي 8: 6+2=8، 9-1=8، إلخ.',
          step4: 'الخطوة 4:',
          step4Text: 'تابع إلى الصف 3 وابحث عن مربعات تساوي 10: 7+3=10، 12-2=10، إلخ.',
          step5: 'الخطوة 5:',
          step5Text: 'ارسم مسارك من S إلى F متبعاً المربعات الصحيحة',
          tip: '💡 نصيحة: تحقق من كل معادلة قبل الانتقال إلى ذلك المربع!',
        },
        howToPlay: {
          title: 'كيفية اللعب',
          step1: 'اختر رقم هدف لكل صف (مثلاً، الصف 1 = 6).',
          step2: 'خطو فقط على المعادلات التي تساوي هدف ذلك الصف.',
          step3: 'ارسم مسارك من S إلى F بدون حركات قطرية.',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'هل يمكنك العثور على مسار مختلف باستخدام أرقام هدف مختلفة؟',
            'جرب استخدام معادلات الجمع فقط (بدون طرح)',
            'أنشئ متاهة رياضية خاصة بك بـ 3 صفوف و 5 أعمدة',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني حل معادلات الجمع والطرح',
            'وجدت مساراً صحيحاً من S إلى F',
            'تحققت من حساباتي أثناء التقدم',
          ],
          targetNumbers: 'أرقام الهدف الخاصة بي:',
          targetNumbersFormat: 'الصف 1: ___، الصف 2: ___، الصف 3: ___',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          exampleTargetPlan: 'خطة الهدف المثال:',
          row1: 'هدف الصف 1: 6 → مربعات صحيحة: 4+2، 8-2، 3+3، إلخ.',
          row2: 'هدف الصف 2: 8 → مربعات صحيحة: 6+2، 9-1، 5+3، إلخ.',
          row3: 'هدف الصف 3: 10 → مربعات صحيحة: 7+3، 12-2، 5+5، إلخ.',
          remember: '💡 تذكر: أي مسار يتبع أهداف الصفوف صحيح! اختر أرقام الهدف الخاصة بك وابحث عن مسار صحيح من S إلى F.',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = mathMazeKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['math-maze']) {
        worksheets['math-maze'] = keys['math-maze']
      }
    }
  }
}

// Ensure number-tracing-1-20 worksheet keys are present
const ensureNumberTracing120Keys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const numberTracingKeys = {
    en: {
      'number-tracing-1-20': {
        title: 'Trace Numbers 1–20',
        description: 'Start‑point arrows included. Say each number while tracing; then color one object for each number.',
        learningObjectives: [
          'Recognize and write numbers 1–20',
          'Practice fine motor skills (tracing)',
          'Follow directional arrows',
          'Build number recognition and formation',
        ],
        parentTeacherTips: [
          'Start at the red dot and follow the arrow',
          'Say the number name while tracing',
          'Encourage proper pencil grip',
          'Color one object for each number after tracing',
          'Extension: Practice writing numbers without tracing lines',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          number: 'Number:',
          numberValue: '15',
          step1: 'Step 1:',
          step1Text: 'Find the red dot (start point)',
          step2: 'Step 2:',
          step2Text: 'Follow the arrow direction',
          step3: 'Step 3:',
          step3Text: 'Trace along the dashed line',
          step4: 'Step 4:',
          step4Text: 'Say "fifteen" while tracing',
          answer: 'Answer:',
          answerText: 'Trace the number 15 following the dashed line, starting at the red dot',
          tip: '💡 Tip: Always start at the red dot and follow the arrow. Say the number name as you trace!',
        },
        challenge: {
          title: '🌟 More Fun (Optional):',
          items: [
            'Try writing the numbers 1–20 without tracing lines',
            'Count objects around you: How many can you find of each number?',
            'Draw your own numbers and trace them!',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can recognize numbers 1–20',
            'I can trace numbers following the lines',
            'I can say the number names',
          ],
          score: 'My score:',
          scoreFormat: '___ / 20',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          instruction: 'Trace each number following the dashed lines. Start at the red dot and follow the arrow direction.',
          numbersToTrace: 'Numbers to trace:',
          numbersList: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
          remember: '💡 Remember: Always start at the red dot, follow the arrow, and say the number name as you trace!',
        },
      },
    },
    es: {
      'number-tracing-1-20': {
        title: 'Trazar Números 1–20',
        description: 'Flechas de punto de inicio incluidas. Di cada número mientras trazas; luego colorea un objeto por cada número.',
        learningObjectives: [
          'Reconocer y escribir números del 1 al 20',
          'Practicar habilidades motoras finas (trazado)',
          'Seguir flechas direccionales',
          'Desarrollar reconocimiento y formación de números',
        ],
        parentTeacherTips: [
          'Comienza en el punto rojo y sigue la flecha',
          'Di el nombre del número mientras trazas',
          'Anima a usar el agarre correcto del lápiz',
          'Colorea un objeto por cada número después de trazar',
          'Extensión: Practica escribiendo números sin líneas de trazado',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          number: 'Número:',
          numberValue: '15',
          step1: 'Paso 1:',
          step1Text: 'Encuentra el punto rojo (punto de inicio)',
          step2: 'Paso 2:',
          step2Text: 'Sigue la dirección de la flecha',
          step3: 'Paso 3:',
          step3Text: 'Traza a lo largo de la línea punteada',
          step4: 'Paso 4:',
          step4Text: 'Di "quince" mientras trazas',
          answer: 'Respuesta:',
          answerText: 'Traza el número 15 siguiendo la línea punteada, comenzando en el punto rojo',
          tip: '💡 Consejo: ¡Siempre comienza en el punto rojo y sigue la flecha. Di el nombre del número mientras trazas!',
        },
        challenge: {
          title: '🌟 Más Diversión (Opcional):',
          items: [
            'Intenta escribir los números del 1 al 20 sin líneas de trazado',
            'Cuenta objetos a tu alrededor: ¿Cuántos puedes encontrar de cada número?',
            '¡Dibuja tus propios números y trázalos!',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo reconocer números del 1 al 20',
            'Puedo trazar números siguiendo las líneas',
            'Puedo decir los nombres de los números',
          ],
          score: 'Mi puntuación:',
          scoreFormat: '___ / 20',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          instruction: 'Traza cada número siguiendo las líneas punteadas. Comienza en el punto rojo y sigue la dirección de la flecha.',
          numbersToTrace: 'Números a trazar:',
          numbersList: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
          remember: '💡 Recuerda: ¡Siempre comienza en el punto rojo, sigue la flecha y di el nombre del número mientras trazas!',
        },
      },
    },
    ar: {
      'number-tracing-1-20': {
        title: 'تتبع الأرقام 1–20',
        description: 'أسهم نقطة البداية متضمنة. قل كل رقم أثناء التتبع؛ ثم لون كائناً واحداً لكل رقم.',
        learningObjectives: [
          'التعرف على الأرقام من 1 إلى 20 وكتابتها',
          'ممارسة المهارات الحركية الدقيقة (التتبع)',
          'اتباع الأسهم الاتجاهية',
          'بناء التعرف على الأرقام وتكوينها',
        ],
        parentTeacherTips: [
          'ابدأ من النقطة الحمراء واتبع السهم',
          'قل اسم الرقم أثناء التتبع',
          'شجع على الإمساك الصحيح بالقلم',
          'لون كائناً واحداً لكل رقم بعد التتبع',
          'التمديد: تدرب على كتابة الأرقام بدون خطوط التتبع',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          number: 'الرقم:',
          numberValue: '15',
          step1: 'الخطوة 1:',
          step1Text: 'ابحث عن النقطة الحمراء (نقطة البداية)',
          step2: 'الخطوة 2:',
          step2Text: 'اتبع اتجاه السهم',
          step3: 'الخطوة 3:',
          step3Text: 'تتبع على طول الخط المتقطع',
          step4: 'الخطوة 4:',
          step4Text: 'قل "خمسة عشر" أثناء التتبع',
          answer: 'الإجابة:',
          answerText: 'تتبع الرقم 15 متبعاً الخط المتقطع، بدءاً من النقطة الحمراء',
          tip: '💡 نصيحة: ابدأ دائماً من النقطة الحمراء واتبع السهم. قل اسم الرقم أثناء التتبع!',
        },
        challenge: {
          title: '🌟 المزيد من المرح (اختياري):',
          items: [
            'حاول كتابة الأرقام من 1 إلى 20 بدون خطوط التتبع',
            'عد الأشياء من حولك: كم يمكنك العثور على كل رقم؟',
            'ارسم أرقامك الخاصة وتتبعها!',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني التعرف على الأرقام من 1 إلى 20',
            'يمكنني تتبع الأرقام متبعاً الخطوط',
            'يمكنني قول أسماء الأرقام',
          ],
          score: 'نقاطي:',
          scoreFormat: '___ / 20',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          instruction: 'تتبع كل رقم متبعاً الخطوط المتقطعة. ابدأ من النقطة الحمراء واتبع اتجاه السهم.',
          numbersToTrace: 'الأرقام للتتبع:',
          numbersList: '1، 2، 3، 4، 5، 6، 7، 8، 9، 10، 11، 12، 13، 14، 15، 16، 17، 18، 19، 20',
          remember: '💡 تذكر: ابدأ دائماً من النقطة الحمراء، اتبع السهم، وقل اسم الرقم أثناء التتبع!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = numberTracingKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['number-tracing-1-20']) {
        worksheets['number-tracing-1-20'] = keys['number-tracing-1-20']
      }
    }
  }
}

// Ensure addition-subtraction-0-10 worksheet keys are present
const ensureAdditionSubtraction010Keys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const additionSubtractionKeys = {
    en: {
      'addition-subtraction-0-10': {
        title: 'Addition & Subtraction 0–10',
        description: 'Use the number line if needed to solve each addition problem. Write the correct answer in the blank space provided.',
        learningObjectives: [
          'Add numbers within 10',
          'Subtract numbers within 10',
          'Use a number line to solve problems',
          'Build fact fluency for addition and subtraction',
        ],
        parentTeacherTips: [
          'Use the number line: start at the first number, then move right for addition, left for subtraction',
          'Encourage counting on for addition (e.g., 5 + 3: start at 5, count 3 more)',
          'For subtraction, count backwards (e.g., 8 - 3: start at 8, count back 3)',
          'Practice makes perfect - try to solve without the number line as you get better',
          'Extension: Try solving problems mentally without using the number line',
        ],
        workedExample: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '5 + 3 = ?',
          countAll: 'Count all the circles: 5 + 3 = 8',
          step1: 'Step 1: Count the blue circles: 5',
          step2: 'Step 2: Count the green circles: 3',
          step3: 'Step 3: Count them all together: 8',
          answer: 'Answer:',
          answerText: '5 + 3 = 8',
          tip: '💡 Tip: You can also use the number line below - start at 5, move 3 steps right!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          problem1: 'Can you solve 7 + 2 without using the number line? ___',
          problem2: 'What is 9 - 4? Try solving it mentally! ___',
          problem3: 'Create your own problem: ___ + ___ = ?',
        },
        selfAssessment: {
          title: '📊 How did you do?',
          question1: 'I can add numbers within 10',
          question2: 'I can subtract numbers within 10',
          question3: 'I can use the number line to help me',
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          note: 'Note: Problems are randomly generated. Use the number line to solve each problem.',
          tip: '💡 Remember: For addition, move right on the number line. For subtraction, move left. Start at the first number!',
        },
      },
    },
    es: {
      'addition-subtraction-0-10': {
        title: 'Suma y Resta 0–10',
        description: 'Usa la recta numérica si es necesario para resolver cada problema de suma. Escribe la respuesta correcta en el espacio en blanco proporcionado.',
        learningObjectives: [
          'Sumar números hasta 10',
          'Restar números hasta 10',
          'Usar la recta numérica para resolver problemas',
          'Desarrollar fluidez en las operaciones de suma y resta',
        ],
        parentTeacherTips: [
          'Usa la recta numérica: comienza en el primer número, luego muévete a la derecha para sumar, a la izquierda para restar',
          'Anima a contar para sumar (ejemplo: 5 + 3: comienza en 5, cuenta 3 más)',
          'Para la resta, cuenta hacia atrás (ejemplo: 8 - 3: comienza en 8, cuenta 3 hacia atrás)',
          'La práctica hace la perfección - intenta resolver sin usar la recta numérica a medida que mejoras',
          'Extensión: Intenta resolver problemas mentalmente sin usar la recta numérica',
        ],
        workedExample: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '5 + 3 = ?',
          countAll: 'Cuenta todos los círculos: 5 + 3 = 8',
          step1: 'Paso 1: Cuenta los círculos azules: 5',
          step2: 'Paso 2: Cuenta los círculos verdes: 3',
          step3: 'Paso 3: Cuéntalos todos juntos: 8',
          answer: 'Respuesta:',
          answerText: '5 + 3 = 8',
          tip: '💡 Consejo: También puedes usar la recta numérica de abajo - ¡comienza en 5, muévete 3 pasos a la derecha!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          problem1: '¿Puedes resolver 7 + 2 sin usar la recta numérica? ___',
          problem2: '¿Cuánto es 9 - 4? ¡Intenta resolverlo mentalmente! ___',
          problem3: 'Crea tu propio problema: ___ + ___ = ?',
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          question1: 'Puedo sumar números hasta 10',
          question2: 'Puedo restar números hasta 10',
          question3: 'Puedo usar la recta numérica para ayudarme',
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          note: 'Nota: Los problemas se generan aleatoriamente. Usa la recta numérica para resolver cada problema.',
          tip: '💡 Recuerda: Para sumar, muévete a la derecha en la recta numérica. Para restar, muévete a la izquierda. ¡Comienza en el primer número!',
        },
      },
    },
    ar: {
      'addition-subtraction-0-10': {
        title: 'الجمع والطرح 0–10',
        description: 'استخدم خط الأعداد إذا لزم الأمر لحل كل مسألة جمع. اكتب الإجابة الصحيحة في المساحة المقدمة.',
        learningObjectives: [
          'جمع الأرقام حتى 10',
          'طرح الأرقام حتى 10',
          'استخدام خط الأعداد لحل المسائل',
          'بناء الطلاقة في حقائق الجمع والطرح',
        ],
        parentTeacherTips: [
          'استخدم خط الأعداد: ابدأ من الرقم الأول، ثم انتقل إلى اليمين للجمع، وإلى اليسار للطرح',
          'شجع على العد للأمام في الجمع (مثال: 5 + 3: ابدأ من 5، عد 3 أخرى)',
          'للطرح، عد للخلف (مثال: 8 - 3: ابدأ من 8، عد للخلف 3)',
          'الممارسة تجعل الكمال - حاول الحل دون استخدام خط الأعداد كلما تحسنت',
          'التوسع: جرب حل المسائل ذهنياً دون استخدام خط الأعداد',
        ],
        workedExample: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: '5 + 3 = ?',
          countAll: 'عد جميع الدوائر: 5 + 3 = 8',
          step1: 'الخطوة 1: عد الدوائر الزرقاء: 5',
          step2: 'الخطوة 2: عد الدوائر الخضراء: 3',
          step3: 'الخطوة 3: عدهم جميعاً معاً: 8',
          answer: 'الإجابة:',
          answerText: '5 + 3 = 8',
          tip: '💡 نصيحة: يمكنك أيضاً استخدام خط الأعداد أدناه - ابدأ من 5، انتقل 3 خطوات إلى اليمين!',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          problem1: 'هل يمكنك حل 7 + 2 دون استخدام خط الأعداد؟ ___',
          problem2: 'ما هو 9 - 4؟ جرب حله ذهنياً! ___',
          problem3: 'أنشئ مسألتك الخاصة: ___ + ___ = ?',
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          question1: 'يمكنني جمع الأرقام حتى 10',
          question2: 'يمكنني طرح الأرقام حتى 10',
          question3: 'يمكنني استخدام خط الأعداد لمساعدتي',
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          note: 'ملاحظة: يتم إنشاء المسائل بشكل عشوائي. استخدم خط الأعداد لحل كل مسألة.',
          tip: '💡 تذكر: للجمع، انتقل إلى اليمين على خط الأعداد. للطرح، انتقل إلى اليسار. ابدأ من الرقم الأول!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = additionSubtractionKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['addition-subtraction-0-10']) {
        worksheets['addition-subtraction-0-10'] = keys['addition-subtraction-0-10']
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
            'Time yourself: Can you complete all {count} problems in under 2 minutes?',
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
            'Time yourself: Can you complete all {count} problems in under 2 minutes?',
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
            'Cronométrate: ¿Puedes completar los {count} problemas en menos de 2 minutos?',
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
            'Cronométrate: ¿Puedes completar los {count} problemas en menos de 2 minutos?',
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
            'قم بقياس وقتك: هل يمكنك إكمال جميع المسائل الـ {count} في أقل من دقيقتين؟',
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
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['times-table-horizontal-1-5']) {
        worksheets['times-table-horizontal-1-5'] = keys['times-table-horizontal-1-5']
      }
      if (keys['times-table-vertical-1-5']) {
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
