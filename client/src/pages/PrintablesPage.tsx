import React, {
  Component,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
  useReducer,
  isValidElement,
  memo,
  lazy,
  Suspense,
  ReactNode,
  ErrorInfo,
  FC,
  CSSProperties,
  ComponentType,
  MouseEvent
} from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WizqoLogo } from '@/components/WizqoLogo'
import InteractiveBundleSections from '@/components/InteractiveBundleSections'
import { PRINTABLE_BUNDLE_SECTIONS, getPrintableSectionForDoc } from '@/data/printableBundles'
import { INTERACTIVE_CATEGORIES } from '@shared/interactive/interactiveWorksheets'
import { getWorksheetSEOBySlug } from '@shared/worksheetSEO'
import { formatNumber } from '@/utils/numbers'

import { WorksheetFooter, ProblemBox, WorksheetHeader } from '@/components/worksheet'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './printables/PrintableShared'
// Local components defined below to avoid conflicts
import { makeRng, pick, pickNUnique, shuffleArray, buildWords } from '@/utils/printableUtils'
import { SpecificWorksheetProps } from '../types/printable';

import { MathRenderer } from './printables/renderer/MathRenderer';
import { LanguageRenderer } from './printables/renderer/LanguageRenderer';
import { EarlyLearnerRenderer } from './printables/renderer/EarlyLearnerRenderer';
import { HolidayRenderer } from './printables/renderer/HolidayRenderer';

import {
  trackWorksheetDownload,
  trackWorksheetView,
  trackPrintDialog,
  trackAnswerKeyToggle,
  trackTimeOnPage,
  trackScrollDepth,
  trackUserFlow
} from '@/utils/analytics'
import { ReadingComprehension } from './printables/ReadingWorksheets'
import { MoreLessEqual10, TenFrames1To10, Sub2Digit100 } from './printables/MathWorksheets'
import { Add2DigitRegrouping, Sub2DigitRegrouping, EvenOdd100, Compare2Digit, FractionsHalvesThirdsFourths, SkipCounting5To120, MissingNumbers50, Time5Min } from './printables/SecondGradeMath'

import {
  MultiplicationFacts,
  MultiplicationArrays2To5,
  MultiplicationArraysModels,
  MultiplicationWindowArrays,
  SkipCountingMultiplication,
  TimesTableHorizontal,
  TimesTableVertical,
  TimesTableMissing,
  MultiplicationPatterns,
  MultiplicationTimed,
  MultiplicationWordProblems,
  MultiplicationFactFamilies,
  MultiplicationVertical,
  MultiplicationAreaModel,
  MultiplicationFactFluency,
  MultiplicationMixedReview,
  MultiplicationStrategies,
  MultiplicationBlankTable,
  MultiplicationColorByNumber,
  MultiplicationConfidence,
  MultiplicationFluency,
  MultiplicationBy10And100,
  MultiplicationProperties,
  MultiplicationDecimals,
  PartialProducts,
  AreaModelMult
} from './printables/MultiplicationWorksheets'
import {
  EquivFractions4th,
  ComparingFractions4th,
  AddSubFractions4th,
  MixedImproperFractions
} from './printables/FractionWorksheets'

import MathMazeWorksheets from './MathMazeWorksheets'
import { MathWorksheets } from './MathWorksheets';
import { LogicWorksheets } from './LogicWorksheets';
import { GeographyWorksheets } from './GeographyWorksheets'
import { Symmetry } from './printables/Symmetry'
import { ScienceWorksheets } from './printables/ScienceWorksheets'
import { LinePlots, BarGraphs, MeanMedianMode } from './printables/DataAnalysisWorksheets'
import { GeometryWordProblems, MeasurementWordProblems, DecimalWordProblems, FractionWordProblems, WordProblems100, MultiStepWordProblems } from './printables/WordProblemWorksheets'
import {
  ClassifyingTriangles,
  ClassifyingQuadrilaterals,
  LinesAndAngles,
  ClassifyingAngles,
  SymmetryTransformations,
  AreaPerimeter,
  IdentifyPolygons
} from './GeometryWorksheets'
import {
  MassAndWeight,
  LiquidMeasurement,
  ElapsedTime,
  CustomaryUnits
} from './MeasurementWorksheets'
import {
  DecimalsPlaceValue,
  ComparingDecimals,
  AddSubDecimals,
  FractionsToDecimals
} from './DecimalWorksheets'
import {
  LongDivision1Digit,
  LongDivision2Digit,
  LongDivisionMultiDigit,
  DividingBy10And100,
  DivisionFacts
} from './printables/DivisionWorksheets'

import { OrderOfOperations } from './printables/OrderOfOperations'
import {
  ComparisonWorksheet,
  PatternWorksheet,
  ShapeWorksheet,
  NumberRecognitionWorksheet,
  SpotDifferenceWorksheet,
  ColoringWorksheet,
  ColorByNumberWorksheet,
  DesignMonsterWorksheet,
  DrawHalfWorksheet,
  HiddenObjectWorksheet,
  MazeFocusWorksheet,
  BookmarkTemplates
} from './printables/KindergartenExtraWorksheets'
import { NumberLineAddition, SkipCountingWorksheet, BalanceEquations, SubtractionStories, NumberBonds10, CountWrite30, MissingNumbers50 as MissingNumbers50FirstGrade, DoublesFacts, PictureAddition10, CountingObjects20, MoreLessEqual10 } from './printables/FirstGradeMathWorksheets'
import { TenFrames1To10, AdditionSubtraction0To10, NumberTracing1To20 } from './printables/MathWorksheets'
import MathMazeWorksheets from './MathMazeWorksheets'
import { SentenceBuilding, RhymingWords, CVCWords, SightWordsPrePrimer, LetterTracingAZ } from './printables/LanguageWorksheets'
import { FractionBasicID } from './printables/FractionWorksheets'
import {
  ExpandedForm200,
  NumberPatterns200,
  RoundingNearest10,
  AddThreeNumbers,
  MissingAddends,
  FactFamilies20,
  MentalMath20,
  DoublesNearDoubles,
  NumberLine200,
  MoneyCoinsBills,
  MeasurementLength,
  BarGraphsData,
  Add2Digit100
} from './printables/SecondGradeMath'
import {
  PowersOf10,
  RoundingDecimals,
  EstimatingSumsDifferences,
  EvaluatingExpressions,
  SolvingOneStepEquations,
  PatternsRules,
  AddSubMixedNumbers,
  AddSubFractionsUnlike,
  MultiplyingFractions,
  MultiplyingFractionsWhole,
  DividingFractions,
  MultiplyingDecimals,
  DividingDecimals,
  FractionsDecimalsPercents,
  ComparingOrderingFractionsDecimals,
  AddingDecimalsChallenge,
  VolumeRectangularPrisms,
  AreaTrianglesParallelograms,
  ClassifyingShapes5th,
  CoordinateGraphing,
  Nets3DShapes,
  Transformations5th,
  LineGraphs,
  MeanMedianModeRange,
  StemLeafPlots,
  Probability5th,
  FifthGradeWordProblems,
  WritingExpressions
} from './printables/FifthGradeWorksheets'
import { OnePagerWorksheet } from './printables/OnePagerWorksheet';
import { FractionsNumberLine, FractionsWholeNumbers, MetricUnits, MoneyWordProblems } from './printables/ThirdGradeMathWorksheets'
import { FactorsMultiples, PrimeComposite } from './printables/FactorsWorksheets'
import { GratitudeJar, MoodTracker, WeeklyGoals, Mandalas, FeelingsCheckin } from './printables/SocialEmotionalWorksheets'
import { DotToDot1to20, AnimalPack } from './printables/KindergartenExtraWorksheets'
import { HalloweenPack, WinterKindness, SpringScavenger, SummerPack } from './printables/HolidayWorksheets'
import { BrainBoost, CreativeChallenge } from './LogicWorksheets'
import { RewardChart } from './printables/SocialEmotionalWorksheets'

import {
  trackWorksheetDownload,
  trackWorksheetView,
  trackPrintDialog,
  trackAnswerKeyToggle,
  trackTimeOnPage,
  trackScrollDepth,
  trackUserFlow
} from '@/utils/analytics'

const INTERACTIVE_DOC_IDS = INTERACTIVE_CATEGORIES.flatMap((category) => category.docs.map((doc) => doc.id))

// Helper function to get theme for regular worksheets based on docId
export function getWorksheetTheme(docId: string): {
  background: string
  border: string
  text: string
  cornerAccent: string
  cornerAccent2: string
} {
  // Math worksheets
  if (docId.includes('math') || docId.includes('number') || docId.includes('addition') || docId.includes('subtraction') ||
    docId.includes('place-value') || docId.includes('counting') || docId.includes('skip-count') || docId.includes('expanded') ||
    docId.includes('rounding') || docId.includes('fact') || docId.includes('mental-math') || docId.includes('doubles') ||
    docId.includes('compare') || docId.includes('word-problems') || docId.includes('number-line') || docId.includes('number-patterns') ||
    docId.includes('missing-addends') || docId.includes('add-three') || docId.includes('balance-equations') || docId.includes('picture-addition') ||
    docId.includes('subtraction-stories') || docId.includes('number-bonds') || docId.includes('count-write') || docId.includes('missing-numbers') ||
    docId.includes('ten-frames') || docId.includes('number-tracing') || docId.includes('dot-to-dot') || docId.includes('color-by-number') || docId.includes('fraction')) {
    return {
      background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
      border: 'border-purple-300',
      text: 'text-purple-900',
      cornerAccent: 'rgba(196, 181, 253, 0.3)',
      cornerAccent2: 'rgba(251, 207, 232, 0.2)',
    }
  }
  // Reading worksheets
  if (docId.includes('reading') || docId.includes('comprehension')) {
    return {
      background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      cornerAccent: 'rgba(191, 219, 254, 0.3)',
      cornerAccent2: 'rgba(186, 230, 253, 0.2)',
    }
  }
  // Writing/Handwriting worksheets
  if (docId.includes('writing') || docId.includes('handwriting') || docId.includes('tracing') || docId.includes('spelling') || docId.includes('grammar')) {
    return {
      background: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50',
      border: 'border-emerald-300',
      text: 'text-emerald-800',
      cornerAccent: 'rgba(167, 243, 208, 0.3)',
      cornerAccent2: 'rgba(134, 239, 172, 0.2)',
    }
  }
  // Science worksheets
  if (docId.includes('science') || docId.includes('stem')) {
    return {
      background: 'bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50',
      border: 'border-green-300',
      text: 'text-green-800',
      cornerAccent: 'rgba(187, 247, 208, 0.3)',
      cornerAccent2: 'rgba(167, 243, 208, 0.2)',
    }
  }
  // Geography worksheets
  if (docId.includes('geo') || docId.includes('geography') || docId.includes('continents') || docId.includes('map')) {
    return {
      background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      cornerAccent: 'rgba(253, 230, 138, 0.3)',
      cornerAccent2: 'rgba(254, 243, 199, 0.2)',
    }
  }
  // Logic/Focus worksheets
  if (docId.includes('logic') || docId.includes('spot-difference') || docId.includes('pattern') || docId.includes('maze') ||
    docId.includes('missing-shape') || docId.includes('size-comparison') || docId.includes('shapes-colors-sort')) {
    return {
      background: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
      border: 'border-slate-300',
      text: 'text-slate-800',
      cornerAccent: 'rgba(226, 232, 240, 0.3)',
      cornerAccent2: 'rgba(241, 245, 249, 0.2)',
    }
  }
  // Default theme
  return {
    background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
    border: 'border-purple-300',
    text: 'text-purple-800',
    cornerAccent: 'rgba(196, 181, 253, 0.3)',
    cornerAccent2: 'rgba(251, 207, 232, 0.2)',
  }
}

// Professional header component for print worksheets - matching Interactive Worksheets Generator



const ANSWERABLE_BASE_DOC_IDS = [
  'coloring',
  'design-monster',
  'rhyming-words',
  'science-match',
  'spelling',
  'logic-grid',
  'grammar-detective',
  'math-maze',
  // Reading print views
  'reading-mini-1',
  'reading-g1-lost-hat',
  'reading-g1-ants',
  'reading-g1-bus-ride',
  'reading-g1-pet-fish',
  'reading-g1-red-balloon',
  'reading-g1-big-box',
  'reading-g1-garden-snail',
  'reading-g1-birthday-cake',
  'reading-g2-paper-bridge',
  'reading-g2-rainy-garden',
  'reading-g2-library-card',
  'reading-g2-lost-and-found',
  'reading-g2-bird-feeder',
  'reading-g2-cookie-recipe',
  'reading-g2-tree-house',
  'reading-g2-magic-seeds',
  'reading-g3-lighthouse',
  'reading-g3-science-fair',
  'reading-g3-community-garden',
  'reading-g3-school-play',
  'reading-g3-art-project',
  // 2nd grade math printables
  'place-value-hto',
  'skip-count-5-10-120',
  'add-2digit-100',
  'sub-2digit-100',
  'add-2digit-regrouping',
  'sub-2digit-regrouping',
  'word-problems-100',
  'compare-2digit',
  'even-odd-100',
  // New 1st Grade worksheets
  'number-bonds-10',
  'count-write-30',
  'missing-numbers-50',
  'picture-addition-10',
  'subtraction-stories',
  'balance-equations-10',
  'skip-count-2s',
  'number-line-add',
  'doubles-facts',
  'pattern-complete',
  'missing-shape',
  'size-comparison',
  'color-by-number',
  'cvc-words',
  'sentence-building',
  'sight-words-pre-primer',
  'fractions-halves-thirds-fourths',
  // New 2nd Grade worksheets
  'expanded-form-200',
  'number-patterns-200',
  'rounding-nearest-10',
  'add-three-numbers',
  'missing-addends',
  'fact-families-20',
  'mental-math-20',
  'number-line-200',
  'doubles-near-doubles',
  // Multiplication worksheets
  'mult-facts-1-5',
  'mult-arrays-2-5',
  'mult-arrays',
  'skip-count-mult',
  'mult-word-problems-2-3',
  'mult-facts-6-12',
  'mult-arrays-models',
  'mult-multi-step-word',
  'mult-fact-families',
  'mult-2x1',
  'mult-2x2',
  'mult-area-model',
  'mult-complex-word',
  'mult-fact-fluency',
  'mult-mixed-review',
  'mult-strategies',
  'mult-patterns',
  // Times Table worksheets
  'times-table-horizontal-1-5',
  'times-table-horizontal-6-12',
  'times-table-horizontal-1-12',
  'times-table-vertical-1-5',
  'times-table-vertical-6-12',
  'times-table-vertical-1-12',
  'times-table-missing-1-5',
  'times-table-missing-6-12',
  'times-table-missing-mixed',
  'times-table-timed-1-5',
  'times-table-timed-6-12',
  'times-table-timed-1-12',
  'times-table-blank-1-5',
  'times-table-blank-6-12',
  'times-table-blank-1-12',
  'times-table-confidence-1-5',
  'times-table-confidence-6-12',
  'times-table-fluency-1-12',
  'times-table-mixed-review',
  'times-table-color-1-5',
  'times-table-color-6-12',
  'times-table-color-1-12',

  'money-coins-bills',
  'measurement-length',
  'bar-graphs-data',
  'time-5min',
  'more-less',
  'more-less-equal-10',
  // Kindergarten worksheets
  'count-circle-1-10',
  'count-match-1-20',
  'how-many-1-15',
  'count-color-1-10',
  'counting-objects-20',
  'number-id-1-10',
  'number-tracing-1-10',
  'number-matching-1-15',
  'number-order-1-20',
  'find-number-1-10',
  'shape-identification',
  'color-shapes',
  'shape-sorting',
  'color-recognition',
  'draw-shape',
  'ab-pattern',
  'color-patterns',
  'shape-patterns',
  'what-comes-next',
  'big-small',

  'long-short',
  'heavy-light',
  'same-different',
  'line-tracing',
  'curve-tracing',
  'zigzag-lines',
  'path-tracing',
  // New Kindergarten worksheets (code-based)
  'kindergarten-counting-1-10',
  'kindergarten-number-recognition',
  'kindergarten-shapes',
  'kindergarten-patterns',
  'kindergarten-addition-pictures',
  'kindergarten-counting-visual',
  // 3rd Grade worksheets
  'mult-facts-0-12',

  'mult-word-problems',
  'mult-by-10-100',
  'mult-properties',
  'div-facts-1-12',
  'div-with-remainders',
  'div-word-problems',
  'fact-families-mult-div',
  'div-by-10-100',
  'fractions-whole',
  'comparing-fractions',
  'equivalent-fractions',
  'fractions-number-line',
  'add-sub-fractions',
  'multi-step-word-problems',
  'elapsed-time-word-problems',
  'money-word-problems',
  'perimeter-area-word-problems',
  'identify-polygons',
  'perimeter-shapes',
  'area-rectangles',
  'lines-rays-angles',
  'symmetry',
  'time-to-minute',
  'customary-units',
  'metric-units',
  'liquid-measurement',
  'mass-weight',
  // 4th Grade worksheets
  'mult-2x1-digit',
  'mult-2x2-digit',
  'long-division-1digit',
  'long-division-2digit',
  'area-model-mult',
  'partial-products',
  'equivalent-fractions-4th',
  'comparing-fractions-4th',
  'add-sub-fractions-4th',
  'mixed-improper-fractions',
  'decimals-place-value',
  'comparing-decimals',
  'add-sub-decimals',
  'fractions-to-decimals',
  'fractions-to-decimals-basic-tenths',
  'fractions-to-decimals-division',
  'classifying-angles',
  'area-perimeter-4th',
  'lines-angles-4th',
  'classifying-triangles',
  'classifying-quadrilaterals',
  'symmetry-transformations',
  'customary-conversion',
  'metric-conversion',
  'elapsed-time-4th',
  'liquid-measurement-4th',
  'mass-weight-4th',
  'multi-step-word-4th',
  'fraction-word-problems',
  'decimal-word-problems',
  'measurement-word-problems',
  'geometry-word-problems',
  'line-plots',
  'bar-graphs-pictographs',
  'mean-median-mode',
  // 5th Grade worksheets
  'mult-3x2-digit',
  'long-division-multidigit',
  'order-of-operations',
  'pemdas-basic',
  'pemdas-parentheses',
  'pemdas-practice',
  'pemdas-exponents',
  'pemdas-multistep',
  'pemdas-word-problems',
  'pemdas-advanced',
  'pemdas-complex',
  'pemdas-rules',
  'pemdas-mixed-review',
  'pemdas-fluency',
  'pemdas-step-by-step',
  'powers-of-10',
  'rounding-decimals',
  'estimating-sums-differences',
  'add-sub-mixed-numbers',

  'multiplying-decimals',
  'dividing-decimals',
  'fractions-decimals-percents',
  'comparing-ordering-fractions-decimals',
  'evaluating-expressions',
  'writing-expressions',
  'solving-one-step-equations',
  'patterns-rules',
  'coordinate-graphing',
  'volume-rectangular-prisms',
  'area-triangles-parallelograms',
  'classifying-shapes',
  'nets-3d-shapes',
  'transformations-5th',
  'multi-step-word-5th',
  'fraction-word-problems-5th',
  'decimal-word-problems-5th',
  'ratio-proportion-word-problems',
  'percent-word-problems',
  'line-graphs',
  'mean-median-mode-range',
  'stem-leaf-plots',
  'probability',
  'adding-decimals-challenge',
  'add-sub-fractions-unlike',
  'mixed-numbers-add-sub',
  'fraction-mult-whole',
  'fraction-mult',
  'div-fractions',
]

// Helper function to get translated worksheet title
function getTranslatedWorksheetTitle(docId: string, t: ((key: string) => string) | undefined, fallback: string): string {
  if (t) {
    const translated = t(`worksheets.${docId}.title`)
    if (translated && translated !== `worksheets.${docId}.title` && !translated.startsWith('worksheets.')) {
      // Extract emoji from fallback if present, otherwise use first emoji from translated
      const emojiMatch = fallback.match(/^[\u1F300-\u1F9FF]|[\u2600-\u26FF]|[\u2700-\u27BF]/)
      const emoji = emojiMatch ? emojiMatch[0] : ''
      return emoji ? `${emoji} ${translated}` : translated
    }
  }
  return fallback
}

function resolveDocTitle(docId: string, context: { packTime: string; bundleCategory?: string; t?: (key: string) => string }): string {
  const { packTime, bundleCategory, t } = context
  switch (docId) {
    case 'bundle':
      return bundleCategory ? `${bundleCategory} ${t ? t('pages.printables.printableBundle') : 'Printable Bundle'}` : (t ? t('pages.printables.printableBundle') : 'Printable Bundle')
    case 'ten-frames-1-20':
      return getTranslatedWorksheetTitle(docId, t, ' Ten Frames 120')
    case 'number-tracing-1-20':
      return getTranslatedWorksheetTitle(docId, t, ' Number Tracing 120')
    case 'stem-balloon-rocket':
      return getTranslatedWorksheetTitle(docId, t, ' Balloon Rocket (STEM)')
    case 'stem-walking-water':
      return getTranslatedWorksheetTitle(docId, t, ' Walking Water (STEM)')
    case 'arts-3-shape-creature':
      return getTranslatedWorksheetTitle(docId, t, ' Draw From 3 Shapes (Arts)')
    case 'number-tracing-1-10':
      return getTranslatedWorksheetTitle(docId, t, ' Number Tracing 110')
    case 'uppercase-lowercase-match':
      return getTranslatedWorksheetTitle(docId, t, 'AaZz Upper/Lower Letter Match')
    case 'beginning-sounds-az':
      return getTranslatedWorksheetTitle(docId, t, ' Beginning Sounds (AZ)')
    case 'kindergarten-counting-1-10':
      return getTranslatedWorksheetTitle(docId, t, ' Counting 110')
    case 'kindergarten-number-recognition':
      return getTranslatedWorksheetTitle(docId, t, ' Number Recognition')
    case 'kindergarten-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Shapes')
    case 'kindergarten-patterns':
      return getTranslatedWorksheetTitle(docId, t, ' Patterns')
    case 'kindergarten-addition-pictures':
      return getTranslatedWorksheetTitle(docId, t, ' Addition with Pictures')
    case 'kindergarten-counting-visual':
      return getTranslatedWorksheetTitle(docId, t, ' Counting with Cute Characters')
    case 'addition-subtraction-0-10':
      return getTranslatedWorksheetTitle(docId, t, ' Addition & Subtraction 010')
    case 'ten-frames-1-10':
      return getTranslatedWorksheetTitle(docId, t, ' Ten Frames 110')
    case 'sentence-building':
      return getTranslatedWorksheetTitle(docId, t, '📝 Sentence Scramble')
    case 'add-sub-fractions-unlike':
      return getTranslatedWorksheetTitle(docId, t, '🍰 Adding & Subtracting Fractions (Unlike)')
    case 'mixed-numbers-add-sub':
      return getTranslatedWorksheetTitle(docId, t, '🏔️ Mixed Numbers: Add & Subtract')
    case 'fraction-mult':
      return getTranslatedWorksheetTitle(docId, t, '✖️ Multiplying Fractions')
    case 'fraction-mult-whole':
      return getTranslatedWorksheetTitle(docId, t, '🔢 Fractions × Whole Numbers')
    case 'div-fractions':
      return getTranslatedWorksheetTitle(docId, t, '➗ Dividing Fractions')
    case 'rounding-decimals':
      return getTranslatedWorksheetTitle(docId, t, '🎯 Rounding Decimals')
    case 'estimating-sums-differences':
      return getTranslatedWorksheetTitle(docId, t, '🧮 Estimating Sums & Differences')
    case 'factors-multiples':
      return getTranslatedWorksheetTitle(docId, t, '🔢 Factors & Multiples')
    case 'prime-composite':
      return getTranslatedWorksheetTitle(docId, t, '🔢 Prime & Composite Numbers')
    case 'shapes-colors-sort':
      return getTranslatedWorksheetTitle(docId, t, ' Shapes & Colors Sort (Cut & Glue)')
    case 'dot-to-dot-1-20':
      return getTranslatedWorksheetTitle(docId, t, 'Connect the Dots (1-20)')
    case 'tangram-animals':
      return getTranslatedWorksheetTitle(docId, t, 'Tangram Animals (Cutouts)')
    case 'spot-difference':
    case 'spotdiff':
      return getTranslatedWorksheetTitle(docId, t, ' Spot-the-Difference')
    case 'directed-drawing-animals':
      return getTranslatedWorksheetTitle(docId, t, ' Directed Drawing: Animals')
    case 'cut-and-paste-crafts':
      return getTranslatedWorksheetTitle(docId, t, ' Cut-and-Paste Paper Crafts')
    case 'feelings-checkin':
      return getTranslatedWorksheetTitle(docId, t, ' Feelings Check-In Meter')
    case 'reward-chart':
      return getTranslatedWorksheetTitle(docId, t, ' Weekly Reward / Sticker Chart')
    case 'reading-mini-1':
      return getTranslatedWorksheetTitle(docId, t, ' Mini Reading Passage + 3 Questions')
    case 'reading-g1-lost-hat':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Lost Hat (Reading)')
    case 'reading-g1-ants':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  Lunch for the Ants (Reading)')
    case 'reading-g1-bus-ride':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Bus Ride (Reading)')
    case 'reading-g1-pet-fish':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Pet Fish (Reading)')
    case 'reading-g2-paper-bridge':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Paper Bridge (Reading)')
    case 'reading-g2-rainy-garden':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  Rainy Day Garden (Reading)')
    case 'reading-g2-library-card':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  New Library Card (Reading)')
    case 'reading-g2-lost-and-found':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  Lost and Found (Reading)')
    case 'reading-g3-lighthouse':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Lighthouse Keepers Trick (Reading)')
    case 'reading-g3-science-fair':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Science Fair Plan (Reading)')
    case 'reading-g3-community-garden':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Community Garden (Reading)')
    case 'reading-g1-red-balloon':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Red Balloon (Reading)')
    case 'reading-g1-big-box':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Big Box (Reading)')
    case 'reading-g1-garden-snail':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Garden Snail (Reading)')
    case 'reading-g1-birthday-cake':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Birthday Cake (Reading)')
    case 'reading-g2-bird-feeder':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Bird Feeder (Reading)')
    case 'reading-g2-cookie-recipe':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Cookie Recipe (Reading)')
    case 'reading-g2-tree-house':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Tree House (Reading)')
    case 'reading-g2-magic-seeds':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Magic Seeds (Reading)')
    case 'reading-g3-school-play':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The School Play (Reading)')
    case 'reading-g3-art-project':
      return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Art Project (Reading)')
    case 'pack':
      return `Todays ${packTime}-Minute Print Pack`
    case 'math-maze':
      return getTranslatedWorksheetTitle(docId, t, ' Math Maze Adventure')
    case 'spelling':
      return getTranslatedWorksheetTitle(docId, t, ' Spelling Challenge Worksheet')
    case 'science-match':
      return getTranslatedWorksheetTitle(docId, t, ' Science Fun Facts Match')
    case 'grammar-detective':
      return getTranslatedWorksheetTitle(docId, t, ' Grammar Detective')
    case 'sudoku4':
      return getTranslatedWorksheetTitle(docId, t, ' Sudoku  44 (Easy)')
    case 'sudoku6':
      return getTranslatedWorksheetTitle(docId, t, ' Sudoku  66 (Medium)')
    case 'place-value-hto':
      return getTranslatedWorksheetTitle(docId, t, ' Place Value (Tens/Ones)')
    case 'skip-count-5-10-120':
      return getTranslatedWorksheetTitle(docId, t, ' Skip Counting by 5s & 10s')
    case 'add-2digit-100':
      return getTranslatedWorksheetTitle(docId, t, ' Add 2-Digit Numbers (to 100)')
    case 'sub-2digit-100':
      return getTranslatedWorksheetTitle(docId, t, ' Subtract 2-Digit Numbers (to 100)')
    case 'word-problems-100':
      return getTranslatedWorksheetTitle(docId, t, ' Word Problems (within 100)')
    case 'compare-2digit':
      return getTranslatedWorksheetTitle(docId, t, ' Compare 2-Digit Numbers')
    case 'even-odd-100':
      return getTranslatedWorksheetTitle(docId, t, ' Even or Odd to 100')
    case 'time-5min':
      return getTranslatedWorksheetTitle(docId, t, ' Tell Time to 5 Minutes')
    case 'color-by-number':
      return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Pages')
    // New 1st Grade worksheets
    case 'number-bonds-10':
      return getTranslatedWorksheetTitle(docId, t, ' Number Bonds to 10')
    case 'count-write-30':
      return getTranslatedWorksheetTitle(docId, t, ' Count & Write 130')
    case 'missing-numbers-50':
      return getTranslatedWorksheetTitle(docId, t, ' Missing Numbers 150')
    case 'picture-addition-10':
      return getTranslatedWorksheetTitle(docId, t, ' Picture Addition to 10')
    case 'subtraction-stories':
      return getTranslatedWorksheetTitle(docId, t, ' Subtraction Stories')
    case 'balance-equations-10':
      return getTranslatedWorksheetTitle(docId, t, ' Balance Equations (to 10)')
    case 'skip-count-2s':
      return getTranslatedWorksheetTitle(docId, t, ' Skip Counting by 2s')
    case 'number-line-add':
      return getTranslatedWorksheetTitle(docId, t, ' Number Line Addition')
    case 'doubles-facts':
      return getTranslatedWorksheetTitle(docId, t, ' Doubles Facts Practice')
    case 'pattern-complete':
      return getTranslatedWorksheetTitle(docId, t, ' Pattern Completion')
    case 'missing-shape':
      return getTranslatedWorksheetTitle(docId, t, ' Find the Missing Shape')
    case 'size-comparison':
      return getTranslatedWorksheetTitle(docId, t, ' Size Comparison')
    // New 2nd Grade worksheets
    case 'expanded-form-200':
      return getTranslatedWorksheetTitle(docId, t, ' Expanded Form to 200')
    case 'number-patterns-200':
      return getTranslatedWorksheetTitle(docId, t, ' Number Patterns to 200')
    case 'rounding-nearest-10':
      return getTranslatedWorksheetTitle(docId, t, ' Rounding to Nearest 10')
    case 'add-three-numbers':
      return getTranslatedWorksheetTitle(docId, t, ' Adding 3 Numbers')
    case 'missing-addends':
      return getTranslatedWorksheetTitle(docId, t, ' Missing Addends')
    case 'fact-families-20':
      return getTranslatedWorksheetTitle(docId, t, ' Fact Families (to 20)')
    case 'mental-math-20':
      if (t) {
        const translated = t('worksheets.mental-math-20.title')
        if (translated && translated !== 'worksheets.mental-math-20.title' && !translated.startsWith('worksheets.')) {
          return translated
        }
      }
      return ' Mental Math (Add/Sub to 20)'
    case 'number-line-200':
      return getTranslatedWorksheetTitle(docId, t, ' Number Line to 200')
    case 'doubles-near-doubles':
      return getTranslatedWorksheetTitle(docId, t, ' Doubles & Near Doubles')
    case 'money-coins-bills':
      return getTranslatedWorksheetTitle(docId, t, ' Money: Coins & Bills')
    case 'measurement-length':
      return getTranslatedWorksheetTitle(docId, t, ' Measurement: Length')
    case 'bar-graphs-data':
      return getTranslatedWorksheetTitle(docId, t, ' Bar Graphs & Data')
    case 'add-2digit-regrouping':
      return getTranslatedWorksheetTitle(docId, t, ' 2-Digit Addition (WITH Regrouping)')
    case 'sub-2digit-regrouping':
      return getTranslatedWorksheetTitle(docId, t, ' 2-Digit Subtraction (WITH Regrouping)')
    case 'fractions-halves-thirds-fourths':
      return getTranslatedWorksheetTitle(docId, t, ' Fractions: Halves, Thirds, Fourths')
    case 'rhyming-words':
      return getTranslatedWorksheetTitle(docId, t, ' Rhyming Words')
    case 'cvc-words':
      return getTranslatedWorksheetTitle(docId, t, ' CVC Words (Consonant-Vowel-Consonant)')
    case 'sight-words-pre-primer':
      return getTranslatedWorksheetTitle(docId, t, ' Sight Words (Dolch Pre-Primer)')
    case 'letter-tracing-az':
      return getTranslatedWorksheetTitle(docId, t, ' Letter Tracing AZ')
    case 'more-less-equal-10':
      return getTranslatedWorksheetTitle(docId, t, ' More, Less, or Equal? (110)')
    case 'counting-objects-20':
      return getTranslatedWorksheetTitle(docId, t, ' Count the Objects (120)')
    // Multiplication worksheets
    case 'mult-facts-1-5':
      if (t) {
        const translated = t('worksheets.mult-facts-1-5.title')
        if (translated && translated !== 'worksheets.mult-facts-1-5.title' && !translated.startsWith('worksheets.')) {
          return translated
        }
      }
      return ' Basic Multiplication Facts (1-5)'
    case 'mult-arrays-2-5':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Arrays (2-5)')
    case 'skip-count-mult':
      return getTranslatedWorksheetTitle(docId, t, ' Skip Counting for Multiplication')
    case 'mult-word-problems-2-3':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Word Problems (2nd-3rd)')
    case 'mult-facts-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Advanced Multiplication Facts (6-12)')
    case 'mult-arrays-models':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Arrays & Models')
    case 'mult-multi-step-word':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
    case 'mult-fact-families':
      return getTranslatedWorksheetTitle(docId, t, ' Fact Families (Multiplication & Division)')
    case 'mult-2x1':
      if (t) {
        const translated = t('worksheets.mult-2x1.title')
        if (translated && translated !== 'worksheets.mult-2x1.title' && !translated.startsWith('worksheets.')) {
          return translated
        }
      }
      return ' Multi-Digit Multiplication (21)'
    case 'mult-2x2':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (22)')
    case 'mult-area-model':
      return getTranslatedWorksheetTitle(docId, t, ' Area Model Multiplication')
    case 'mult-complex-word':
      return getTranslatedWorksheetTitle(docId, t, ' Complex Word Problems')
    case 'mult-fact-fluency':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Fact Fluency')
    case 'mult-mixed-review':
      return getTranslatedWorksheetTitle(docId, t, ' Mixed Multiplication Review')
    case 'mult-strategies':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Strategies')
    case 'mult-patterns':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Patterns')
    // Times Table worksheets
    case 'times-table-horizontal-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Horizontal Times Table (1-5)')
    case 'times-table-horizontal-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Horizontal Times Table (6-12)')
    case 'times-table-horizontal-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Complete Horizontal Times Table (1-12)')
    case 'times-table-vertical-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Vertical Times Table (1-5)')
    case 'times-table-vertical-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Vertical Times Table (6-12)')
    case 'times-table-vertical-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Complete Vertical Times Table (1-12)')
    case 'times-table-missing-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Missing Number Times Table (1-5)')
    case 'times-table-missing-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Missing Number Times Table (6-12)')
    case 'times-table-missing-mixed':
      return getTranslatedWorksheetTitle(docId, t, ' Mixed Missing Number Challenge')
    case 'times-table-timed-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Timed Times Table Test (1-5)')
    case 'times-table-timed-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Timed Times Table Test (6-12)')
    case 'times-table-timed-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Complete Timed Test (1-12)')
    case 'times-table-blank-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Blank Times Table (1-5) - Fill In')
    case 'times-table-blank-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Blank Times Table (6-12) - Fill In')
    case 'times-table-blank-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Complete Blank Times Table (1-12)')
    case 'times-table-confidence-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Confidence-Building Times Table (1-5)')
    case 'times-table-confidence-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Confidence-Building Times Table (6-12)')
    case 'times-table-fluency-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Times Table Fluency Practice (1-12)')
    case 'times-table-mixed-review':
      return getTranslatedWorksheetTitle(docId, t, ' Mixed Times Table Review')
    case 'times-table-color-1-5':
      return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Times Table (1-5)')
    case 'times-table-color-6-12':
      return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Times Table (6-12)')
    case 'times-table-color-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Times Table (1-12)')
    case 'bookmark-templates':
      return getTranslatedWorksheetTitle(docId, t, ' DIY Bookmark Templates')
    case 'design-monster':
      return getTranslatedWorksheetTitle(docId, t, ' Design Your Monster')
    case 'draw-half':
      return getTranslatedWorksheetTitle(docId, t, ' Draw the Missing Half')
    case 'coloring-animals':
      return getTranslatedWorksheetTitle(docId, t, ' Animal Friends Coloring')
    case 'coloring-nature':
      return getTranslatedWorksheetTitle(docId, t, ' Nature & Seasons Coloring')
    case 'coloring-space':
      return getTranslatedWorksheetTitle(docId, t, ' Space Adventure Coloring')
    case 'coloring-vehicles':
      return getTranslatedWorksheetTitle(docId, t, ' Vehicles & Transport Coloring')
    case 'coloring-letters-numbers':
      return getTranslatedWorksheetTitle(docId, t, ' Alphabet & Number Coloring')
    case 'coloring-heroes':
      return getTranslatedWorksheetTitle(docId, t, ' Superheroes & Everyday Heroes')
    case 'coloring':
      return getTranslatedWorksheetTitle(docId, t, ' Coloring Page  Cute Animal')
    case 'hidden-object':
      return getTranslatedWorksheetTitle(docId, t, ' Find the Hidden Object')
    case 'maze-focus':
      return getTranslatedWorksheetTitle(docId, t, ' Maze of Focus')
    case 'ws-animals':
      return getTranslatedWorksheetTitle(docId, t, ' Word Search  Animals')
    case 'ws-space':
      return getTranslatedWorksheetTitle(docId, t, ' Word Search  Space')
    case 'logic-grid':
      return getTranslatedWorksheetTitle(docId, t, ' Logic Grid Puzzle')
    case 'gratitude-jar':
      return getTranslatedWorksheetTitle(docId, t, ' Gratitude Jar Worksheet')
    case 'mood-tracker':
      return getTranslatedWorksheetTitle(docId, t, ' Mood Tracker Coloring Page')
    case 'mandalas':
      return getTranslatedWorksheetTitle(docId, t, ' Mindful Coloring Mandalas')
    case 'weekly-goals':
      return getTranslatedWorksheetTitle(docId, t, ' My Goals for the Week')
    case 'halloween-pack':
      return getTranslatedWorksheetTitle(docId, t, ' Halloween Puzzle Pack')
    case 'winter-kindness':
      return getTranslatedWorksheetTitle(docId, t, ' Winter Kindness Challenge')
    case 'spring-scavenger':
      return getTranslatedWorksheetTitle(docId, t, ' Spring Nature Scavenger Hunt')
    case 'summer-pack':
      return getTranslatedWorksheetTitle(docId, t, ' Summer Adventure Pack')
    case 'brain-boost':
      return getTranslatedWorksheetTitle(docId, t, ' 7-Day Brain Boost Pack')
    case 'creative-challenge':
      return getTranslatedWorksheetTitle(docId, t, ' Creative Kids Challenge')
    case 'ws-world':
      return getTranslatedWorksheetTitle(docId, t, ' Around the World Word Search')
    case 'animal-pack':
      return getTranslatedWorksheetTitle(docId, t, ' Animal Adventure Pack')
    case 'geo-continents-k2':
      return getTranslatedWorksheetTitle(docId, t, ' Label the 7 Continents (K2)')
    case 'geo-compass-rose':
      return getTranslatedWorksheetTitle(docId, t, ' Compass Rose & Directions')
    case 'geo-landforms':
      return getTranslatedWorksheetTitle(docId, t, ' Landforms vs Water Bodies')
    case 'geo-latlong':
      return getTranslatedWorksheetTitle(docId, t, ' Latitude & Longitude Basics')
    // Interactive Worksheets - Math
    case 'interactive-math-rhythm':
      return getTranslatedWorksheetTitle(docId, t, ' Number Pattern Rhythm')
    case 'interactive-math-race':
      return getTranslatedWorksheetTitle(docId, t, ' Math Race Challenge')
    case 'interactive-math-puzzle':
      return getTranslatedWorksheetTitle(docId, t, ' Equation Puzzle Box')
    case 'interactive-math-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Geometry Shape Challenge')
    case 'interactive-math-money':
      return getTranslatedWorksheetTitle(docId, t, ' Money Math Mastery')
    case 'interactive-math-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Fraction Fun Practice')
    case 'interactive-math-measurement':
      return getTranslatedWorksheetTitle(docId, t, ' Measurement Mission')
    // Interactive Worksheets - Reading
    case 'interactive-reading-adventure':
      return getTranslatedWorksheetTitle(docId, t, ' Reading Adventure Quest')
    case 'interactive-reading-detective':
      return getTranslatedWorksheetTitle(docId, t, ' Reading Detective Challenge')
    case 'interactive-reading-vocab':
      return getTranslatedWorksheetTitle(docId, t, ' Vocabulary Builder Workshop')
    case 'interactive-reading-summary':
      return getTranslatedWorksheetTitle(docId, t, ' Summary & Main Idea')
    case 'interactive-reading-compare':
      return getTranslatedWorksheetTitle(docId, t, ' Compare & Contrast Passages')
    case 'interactive-reading-prek':
      return getTranslatedWorksheetTitle(docId, t, ' Picture Story Time')
    case 'interactive-reading-storymap':
      return getTranslatedWorksheetTitle(docId, t, ' Story Map Builders')
    // Interactive Worksheets - Writing
    case 'interactive-writing-prompts':
      return getTranslatedWorksheetTitle(docId, t, ' Creative Writing Prompts')
    case 'interactive-writing-sentences':
      return getTranslatedWorksheetTitle(docId, t, ' Sentence Builder Workshop')
    case 'interactive-writing-poetry':
      return getTranslatedWorksheetTitle(docId, t, ' Poetry Writing Practice')
    case 'interactive-writing-opinion':
      return getTranslatedWorksheetTitle(docId, t, ' Opinion Writing Framework')
    case 'interactive-writing-prek':
      return getTranslatedWorksheetTitle(docId, t, ' Drawing & Labeling')
    // Interactive Worksheets - Science
    case 'interactive-science-observation':
      return getTranslatedWorksheetTitle(docId, t, ' Science Observation Journal')
    case 'interactive-science-lifecycle':
      return getTranslatedWorksheetTitle(docId, t, ' Life Cycle Explorer')
    case 'interactive-science-states':
      return getTranslatedWorksheetTitle(docId, t, ' States of Matter Lab')
    case 'interactive-science-weather':
      return getTranslatedWorksheetTitle(docId, t, ' Weather Watcher Journal')
    case 'interactive-science-prek':
      return getTranslatedWorksheetTitle(docId, t, ' Nature Explorer')
    case 'interactive-science-space':
      return getTranslatedWorksheetTitle(docId, t, ' Space & Astronomy Explorer')
    // Interactive Worksheets - Geography
    case 'interactive-geography-map':
      return getTranslatedWorksheetTitle(docId, t, ' Interactive Map Skills')
    case 'interactive-geography-culture':
      return getTranslatedWorksheetTitle(docId, t, ' Culture Explorer')
    case 'interactive-geography-history':
      return getTranslatedWorksheetTitle(docId, t, ' Historical Timeline Builder')
    case 'interactive-geography-prek':
      return getTranslatedWorksheetTitle(docId, t, ' My Community Explorer')
    // Interactive Worksheets - Grammar
    case 'interactive-grammar-parts':
      return getTranslatedWorksheetTitle(docId, t, ' Parts of Speech Practice')
    case 'interactive-grammar-tenses':
      return getTranslatedWorksheetTitle(docId, t, ' Verb Tense Mastery')
    case 'interactive-grammar-antonyms':
      return getTranslatedWorksheetTitle(docId, t, ' Synonyms & Antonyms Challenge')
    case 'interactive-grammar-prek':
      return getTranslatedWorksheetTitle(docId, t, ' Word & Picture Match')
    // Interactive Worksheets - Art
    case 'interactive-art-design':
      return getTranslatedWorksheetTitle(docId, t, ' Creative Design Challenge')
    case 'interactive-art-colorwheel':
      return getTranslatedWorksheetTitle(docId, t, ' Color Theory Practice')
    case 'interactive-art-sketch':
      return getTranslatedWorksheetTitle(docId, t, ' Sketch & Observe')
    // Interactive Worksheets - Early Learning
    case 'interactive-early-phonics':
      return getTranslatedWorksheetTitle(docId, t, ' Phonics Fun Practice')
    case 'interactive-early-counting':
      return getTranslatedWorksheetTitle(docId, t, ' Counting & Number Recognition')
    case 'interactive-early-patterns':
      return getTranslatedWorksheetTitle(docId, t, ' Pattern Recognition Explorer')
    case 'interactive-early-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Shape & Color Explorer')
    case 'interactive-early-letters':
      return getTranslatedWorksheetTitle(docId, t, ' Letter Formation Practice')
    case 'interactive-early-numbers':
      return getTranslatedWorksheetTitle(docId, t, ' Number Writing & Recognition')
    case 'interactive-early-foundations':
      return getTranslatedWorksheetTitle(docId, t, ' Foundational Skills Review')
    case 'interactive-early-basics':
      return getTranslatedWorksheetTitle(docId, t, ' Basic Skills Practice')
    // Interactive Worksheets - Logic
    case 'interactive-logic-sequence':
      return getTranslatedWorksheetTitle(docId, t, ' Sequencing Challenge')
    case 'interactive-logic-riddles':
      return getTranslatedWorksheetTitle(docId, t, ' Brain Teaser Riddles')
    case 'interactive-logic-deduction':
      return getTranslatedWorksheetTitle(docId, t, ' Deductive Reasoning Quest')
    case 'interactive-logic-prek':
      return getTranslatedWorksheetTitle(docId, t, ' Simple Patterns & Sorting')
    // Interactive Worksheets - SEL
    case 'interactive-sel-mindfulness':
      return getTranslatedWorksheetTitle(docId, t, ' Mindfulness & Reflection')
    case 'interactive-sel-empathy':
      return getTranslatedWorksheetTitle(docId, t, ' Empathy Builder')
    case 'interactive-sel-goals':
      return getTranslatedWorksheetTitle(docId, t, ' Goal Setting & Growth')
    case 'interactive-sel-prek':
      return getTranslatedWorksheetTitle(docId, t, ' Feelings & Emotions Explorer')
    // Kindergarten worksheets
    case 'count-circle-1-10':
      if (t) {
        const translated = t('worksheets.count-circle-1-10.title')
        if (translated && translated !== 'worksheets.count-circle-1-10.title' && !translated.startsWith('worksheets.')) {
          return translated
        }
      }
      return ' Count & Circle 110'
    case 'count-match-1-20':
      return getTranslatedWorksheetTitle(docId, t, ' Count & Match 120')
    case 'how-many-1-15':
      return getTranslatedWorksheetTitle(docId, t, ' How Many? (115)')
    case 'count-color-1-10':
      return getTranslatedWorksheetTitle(docId, t, ' Count & Color (110)')
    case 'number-id-1-10':
      // Use translation if available, otherwise fallback to English
      if (context.t) {
        const translated = context.t('worksheets.number-id-1-10.title')
        if (translated && translated !== 'worksheets.number-id-1-10.title') {
          return ` ${translated}`
        }
      }
      return ' Number Identification 110'
    case 'number-matching-1-15':
      return getTranslatedWorksheetTitle(docId, t, ' Number Matching 115')
    case 'number-order-1-20':
      return getTranslatedWorksheetTitle(docId, t, ' Number Order 120')
    case 'find-number-1-10':
      return getTranslatedWorksheetTitle(docId, t, ' Find the Number (110)')
    case 'shape-identification':
      return getTranslatedWorksheetTitle(docId, t, ' Shape Identification')
    case 'color-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Color the Shapes')
    case 'shape-sorting':
      return getTranslatedWorksheetTitle(docId, t, ' Shape Sorting')
    case 'color-recognition':
      return getTranslatedWorksheetTitle(docId, t, ' Color Recognition')
    case 'draw-shape':
      return getTranslatedWorksheetTitle(docId, t, ' Draw the Shape')
    case 'ab-pattern':
      return getTranslatedWorksheetTitle(docId, t, ' AB Pattern Completion')
    case 'color-patterns':
      return getTranslatedWorksheetTitle(docId, t, ' Color Patterns')
    case 'shape-patterns':
      return getTranslatedWorksheetTitle(docId, t, ' Shape Patterns')
    case 'what-comes-next':
      return getTranslatedWorksheetTitle(docId, t, ' What Comes Next?')
    case 'big-small':
      return getTranslatedWorksheetTitle(docId, t, ' Big and Small')
    case 'more-less':
      return getTranslatedWorksheetTitle(docId, t, ' More and Less')
    case 'long-short':
      return getTranslatedWorksheetTitle(docId, t, ' Long and Short')
    case 'heavy-light':
      return getTranslatedWorksheetTitle(docId, t, ' Heavy and Light')
    case 'same-different':
      return getTranslatedWorksheetTitle(docId, t, ' Same and Different')
    case 'line-tracing':
      return getTranslatedWorksheetTitle(docId, t, ' Line Tracing')
    case 'curve-tracing':
      return getTranslatedWorksheetTitle(docId, t, ' Curve Tracing')
    case 'zigzag-lines':
      return getTranslatedWorksheetTitle(docId, t, ' Zigzag Lines')
    case 'path-tracing':
      return getTranslatedWorksheetTitle(docId, t, ' Path Tracing')
    // 3rd Grade worksheets
    case 'mult-facts-0-12':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Facts 012')
    case 'mult-arrays':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Arrays')
    case 'mult-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplication Word Problems')
    case 'mult-by-10-100':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplying by 10, 100')
    case 'mult-properties':
      return getTranslatedWorksheetTitle(docId, t, ' Properties of Multiplication')
    case 'div-facts-1-12':
      return getTranslatedWorksheetTitle(docId, t, ' Division Facts 112')
    case 'div-with-remainders':
      return getTranslatedWorksheetTitle(docId, t, ' Division with Remainders')
    case 'div-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Division Word Problems')
    case 'fact-families-mult-div':
      return getTranslatedWorksheetTitle(docId, t, ' Fact Families (Mult/Div)')
    case 'div-by-10-100':
      return getTranslatedWorksheetTitle(docId, t, ' Dividing by 10, 100')
    case 'fractions-whole':
      return getTranslatedWorksheetTitle(docId, t, ' Fractions: Parts of a Whole')
    case 'comparing-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Comparing Fractions')
    case 'equivalent-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Equivalent Fractions')
    case 'fractions-number-line':
      return getTranslatedWorksheetTitle(docId, t, ' Fractions on a Number Line')
    case 'add-sub-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Fractions')
    case 'multi-step-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
    case 'elapsed-time-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Elapsed Time Word Problems')
    case 'money-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Money Word Problems')
    case 'perimeter-area-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Perimeter & Area Word Problems')
    case 'identify-polygons':
      return getTranslatedWorksheetTitle(docId, t, ' Identify Polygons')
    case 'perimeter-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Perimeter of Shapes')
    case 'area-rectangles':
      return getTranslatedWorksheetTitle(docId, t, ' Area of Rectangles')
    case 'lines-rays-angles':
      return getTranslatedWorksheetTitle(docId, t, ' Lines, Rays, and Angles')
    case 'symmetry':
      return getTranslatedWorksheetTitle(docId, t, ' Symmetry')
    case 'time-to-minute':
      return getTranslatedWorksheetTitle(docId, t, ' Time to the Minute')
    case 'customary-units':
      return getTranslatedWorksheetTitle(docId, t, ' Customary Units')
    case 'metric-units':
      return getTranslatedWorksheetTitle(docId, t, ' Metric Units')
    case 'liquid-measurement':
      return getTranslatedWorksheetTitle(docId, t, ' Liquid Measurement')
    case 'mass-weight':
      return getTranslatedWorksheetTitle(docId, t, ' Mass and Weight')
    // 4th Grade worksheets
    case 'mult-2x1-digit':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (21)')
    case 'mult-2x2-digit':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (22)')
    case 'long-division-1digit':
      return getTranslatedWorksheetTitle(docId, t, ' Long Division (1-Digit Divisor)')
    case 'long-division-2digit':
      return getTranslatedWorksheetTitle(docId, t, ' Long Division (2-Digit Divisor)')
    case 'area-model-mult':
      return getTranslatedWorksheetTitle(docId, t, ' Area Model Multiplication')
    case 'partial-products':
      return getTranslatedWorksheetTitle(docId, t, ' Partial Products Multiplication')
    case 'equivalent-fractions-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Equivalent Fractions')
    case 'comparing-fractions-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Comparing Fractions')
    case 'add-sub-fractions-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Fractions')
    case 'mixed-improper-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Mixed Numbers & Improper Fractions')
    case 'decimals-place-value':
      return getTranslatedWorksheetTitle(docId, t, ' Decimals: Place Value')
    case 'comparing-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Comparing & Ordering Decimals')
    case 'add-sub-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Decimals')
    case 'fractions-to-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Fractions to Decimals')
    case 'classifying-angles':
      return getTranslatedWorksheetTitle(docId, t, ' Classifying Angles')
    case 'area-perimeter-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Area & Perimeter')
    case 'lines-angles-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Lines & Angles')
    case 'classifying-triangles':
      return getTranslatedWorksheetTitle(docId, t, ' Classifying Triangles')
    case 'classifying-quadrilaterals':
      return getTranslatedWorksheetTitle(docId, t, ' Classifying Quadrilaterals')
    case 'symmetry-transformations':
      return getTranslatedWorksheetTitle(docId, t, ' Symmetry & Transformations')
    case 'customary-conversion':
      return getTranslatedWorksheetTitle(docId, t, ' Customary Units Conversion')
    case 'metric-conversion':
      return getTranslatedWorksheetTitle(docId, t, ' Metric Units Conversion')
    case 'elapsed-time-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Elapsed Time')
    case 'liquid-measurement-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Liquid Measurement')
    case 'mass-weight-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Mass and Weight')
    case 'multi-step-word-4th':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
    case 'fraction-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Fraction Word Problems')
    case 'decimal-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Decimal Word Problems')
    case 'measurement-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Measurement Word Problems')
    case 'geometry-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Geometry Word Problems')
    case 'line-plots':
      return getTranslatedWorksheetTitle(docId, t, ' Line Plots')
    case 'bar-graphs-pictographs':
      return getTranslatedWorksheetTitle(docId, t, ' Bar Graphs & Pictographs')
    case 'mean-median-mode':
      return getTranslatedWorksheetTitle(docId, t, ' Mean, Median, Mode')
    // 5th Grade worksheets
    case 'mult-3x2-digit':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (32)')
    case 'long-division-multidigit':
      return getTranslatedWorksheetTitle(docId, t, ' Long Division (Multi-Digit)')
    case 'order-of-operations':
      return getTranslatedWorksheetTitle(docId, t, ' Order of Operations')
    case 'pemdas-basic':
      return getTranslatedWorksheetTitle(docId, t, 'Basic Order of Operations (PEMDAS)')
    case 'pemdas-parentheses':
      return getTranslatedWorksheetTitle(docId, t, 'PEMDAS with Parentheses')
    case 'pemdas-practice':
      return getTranslatedWorksheetTitle(docId, t, 'Order of Operations Practice Sheet')
    case 'pemdas-exponents':
      return getTranslatedWorksheetTitle(docId, t, 'PEMDAS with Exponents')
    case 'pemdas-multistep':
      return getTranslatedWorksheetTitle(docId, t, 'Multi-Step PEMDAS Problems')
    case 'pemdas-word-problems':
      return getTranslatedWorksheetTitle(docId, t, 'PEMDAS Word Problems')
    case 'pemdas-advanced':
      return getTranslatedWorksheetTitle(docId, t, 'Advanced Parentheses and Exponents')
    case 'pemdas-complex':
      return getTranslatedWorksheetTitle(docId, t, 'Complex PEMDAS Expressions')
    case 'pemdas-rules':
      return getTranslatedWorksheetTitle(docId, t, 'PEMDAS Rules and Practice')
    case 'pemdas-mixed-review':
      return getTranslatedWorksheetTitle(docId, t, 'Mixed PEMDAS Review')
    case 'pemdas-fluency':
      return getTranslatedWorksheetTitle(docId, t, 'PEMDAS Fluency Practice')
    case 'pemdas-step-by-step':
      return getTranslatedWorksheetTitle(docId, t, 'Step-by-Step PEMDAS Guide')
    case 'powers-of-10':
      return getTranslatedWorksheetTitle(docId, t, ' Powers of 10')

    case 'add-sub-mixed-numbers':
      return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Mixed Numbers')
    case 'multiplying-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplying Fractions')
    case 'dividing-fractions':
      return getTranslatedWorksheetTitle(docId, t, ' Dividing Fractions')
    case 'multiplying-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Multiplying Decimals')
    case 'dividing-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Dividing Decimals')
    case 'fractions-decimals-percents':
      return getTranslatedWorksheetTitle(docId, t, ' Fractions, Decimals, & Percents')
    case 'comparing-ordering-fractions-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Comparing & Ordering Fractions/Decimals')
    case 'evaluating-expressions':
      return getTranslatedWorksheetTitle(docId, t, ' Evaluating Expressions')
    case 'writing-expressions':
      return getTranslatedWorksheetTitle(docId, t, ' Writing Expressions')
    case 'solving-one-step-equations':
      return getTranslatedWorksheetTitle(docId, t, ' Solving One-Step Equations')
    case 'patterns-rules':
      return getTranslatedWorksheetTitle(docId, t, ' Patterns & Rules')
    case 'coordinate-graphing':
      return getTranslatedWorksheetTitle(docId, t, ' Coordinate Graphing')
    case 'volume-rectangular-prisms':
      return getTranslatedWorksheetTitle(docId, t, ' Volume of Rectangular Prisms')
    case 'area-triangles-parallelograms':
      return getTranslatedWorksheetTitle(docId, t, ' Area of Triangles & Parallelograms')
    case 'classifying-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Classifying 2D & 3D Shapes')
    case 'nets-3d-shapes':
      return getTranslatedWorksheetTitle(docId, t, ' Nets of 3D Shapes')
    case 'transformations-5th':
      return getTranslatedWorksheetTitle(docId, t, ' Transformations')
    case 'multi-step-word-5th':
      return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
    case 'fraction-word-problems-5th':
      return getTranslatedWorksheetTitle(docId, t, ' Fraction Word Problems')
    case 'decimal-word-problems-5th':
      return getTranslatedWorksheetTitle(docId, t, ' Decimal Word Problems')
    case 'ratio-proportion-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Ratio & Proportion Word Problems')
    case 'percent-word-problems':
      return getTranslatedWorksheetTitle(docId, t, ' Percent Word Problems')
    case 'line-graphs':
      return getTranslatedWorksheetTitle(docId, t, ' Line Graphs')
    case 'mean-median-mode-range':
      return getTranslatedWorksheetTitle(docId, t, ' Mean, Median, Mode, Range')
    case 'stem-leaf-plots':
      return getTranslatedWorksheetTitle(docId, t, ' Stem-and-Leaf Plots')
    case 'probability':
      return getTranslatedWorksheetTitle(docId, t, ' Probability')
    case 'adding-decimals-challenge':
      return getTranslatedWorksheetTitle(docId, t, ' Adding Decimals Challenge')
    default:
      return t ? t('pages.printables.printableFunLearning') : 'Printable Fun Learning Activities'
  }
}

const interactiveDocIds = INTERACTIVE_CATEGORIES.flatMap((category) => category.docs.map((doc) => doc.id))
const BUNDLE_DOC_ALLOWLIST = new Set<string>([
  ...Object.values(PRINTABLE_BUNDLE_SECTIONS).flat(),
  ...interactiveDocIds,
])

// Generate a seed based on today's date for consistent daily content
const today = new Date()
const todaySeed = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

export function PrintablesPage({ docId: propDocId }: { docId?: string } = {}) {
  const { t, language } = useTranslation()

  // Force re-render when language changes (important for /print route with ?lang=ar)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, forceUpdate] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    // Force re-render when language changes to ensure translations update
    forceUpdate()
  }, [language])

  // Helper function to get translations with fallback
  // Include language in dependencies to ensure it updates when language changes
  const getTrans = useCallback((key: string, fallback: string) => {
    try {
      if (!t || typeof t !== 'function') {
        return fallback
      }
      const result = t(key)
      // Debug: Log if translation is missing
      if (typeof window !== 'undefined' && import.meta.env.DEV &&
        key.includes('number-id-1-10') && (result === key || (typeof result === 'string' && result.startsWith('worksheets.')))) {
        console.warn(`[PrintablesPage] Translation missing for key: ${key}, language: ${language}, result: ${result}`)
      }
      // If result is the key itself, translation is missing - use fallback
      if (typeof result === 'string' && result === key) {
        return fallback
      }
      // If result starts with 'worksheets.', it's likely a missing translation key - use fallback
      if (typeof result === 'string' && result.startsWith('worksheets.')) {
        return fallback
      }
      // If result is empty or falsy, use fallback
      if (!result || (typeof result === 'string' && result.trim() === '')) {
        return fallback
      }
      return result
    } catch (error) {
      return fallback
    }
  }, [t, language])

  // CRITICAL: Early check to ensure we're on /print route, not /printables or other routes
  // This prevents autoprint from triggering on category pages
  const [isPrintRoute, setIsPrintRoute] = useState(() => {
    if (typeof window === 'undefined') return false
    const pathname = window.location.pathname
    return pathname === '/print' || pathname.startsWith('/print?')
  })

  // Update route check when location changes
  useEffect(() => {
    const checkRoute = () => {
      if (typeof window === 'undefined') return
      const pathname = window.location.pathname
      const isPrint = pathname === '/print' || pathname.startsWith('/print?')
      setIsPrintRoute(isPrint)
    }
    checkRoute()
    window.addEventListener('popstate', checkRoute)
    return () => window.removeEventListener('popstate', checkRoute)
  }, [])

  // Track URL search params in state so they update reactively when URL changes
  const [urlSearch, setUrlSearch] = useState(() =>
    typeof window !== 'undefined' ? window.location.search : ''
  )

  // Update URL search when location changes (for language changes)
  useEffect(() => {
    const updateSearch = () => {
      const currentSearch = typeof window !== 'undefined' ? window.location.search : ''
      if (currentSearch !== urlSearch) {
        setUrlSearch(currentSearch)
      }
    }

    // Check immediately
    updateSearch()

    // Listen for URL changes
    window.addEventListener('popstate', updateSearch)
    window.addEventListener('hashchange', updateSearch)

    // Also check periodically for programmatic URL changes (e.g., when lang param is added)
    const interval = setInterval(updateSearch, 100)

    return () => {
      window.removeEventListener('popstate', updateSearch)
      window.removeEventListener('hashchange', updateSearch)
      clearInterval(interval)
    }
  }, [urlSearch])

  const params = useMemo(() => {
    return new URLSearchParams(urlSearch)
  }, [urlSearch])

  const doc = propDocId || params.get('doc') || ''
  const isPreview = (params.get('preview') || '').toLowerCase() === '1' || (params.get('preview') || '').toLowerCase() === 'true'
  // CRITICAL: Never trigger autoprint if preview=1 (used in iframes on category pages)
  // Only calculate autoPrint if we're on the /print route AND not in preview mode - prevents popup on category pages
  const autoPrint = !isPreview && isPrintRoute && ((params.get('autoprint') || '').toLowerCase() === '1' || (params.get('autoprint') || '').toLowerCase() === 'true')
  const autoDownload = (params.get('download') || '').toLowerCase() === '1' || (params.get('download') || '').toLowerCase() === 'true'
  const packTime = params.get('time') || '5'
  const packAge = params.get('age') || 'k2'
  const packSkill = params.get('skill') || 'mixed'
  const fromParam = params.get('from') || ''
  const seedParam = params.get('seed') || ''
  const timestampParam = params.get('timestamp') || ''
  const variantParam = params.get('variant') || '1'
  // Initialize showAnswers from URL parameter if present, otherwise default to false
  const [showAnswers, setShowAnswers] = useState(() => {
    const showAnswersParam = params.get('showAnswers')
    return showAnswersParam === '1' || showAnswersParam === 'true'
  })
  const [copiedLink, setCopiedLink] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false)
  const bundleItemsParam = params.get('items') || ''
  const bundleCategoryParam = params.get('category') || ''
  // Customization parameters
  const teacherName = params.get('teacher') || ''
  const className = params.get('class') || ''
  const studentsParam = params.get('students') || ''
  const studentNames = studentsParam ? studentsParam.split(',').map((s: string) => s.trim()).filter(Boolean) : []
  const activeDocs = useMemo(() => {
    if (doc === 'bundle') {
      return bundleItemsParam
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s && BUNDLE_DOC_ALLOWLIST.has(s))
    }
    return doc ? [doc] : []
  }, [doc, bundleItemsParam])
  const interactiveDocs = useMemo(
    () => activeDocs.filter((id: string) => id.startsWith('interactive-')),
    [activeDocs]
  )
  const primaryDoc = activeDocs[0] || doc || ''
  const answerableDocs = useMemo(
    () => new Set([...ANSWERABLE_BASE_DOC_IDS, ...INTERACTIVE_DOC_IDS]),
    []
  )
  const bundleHasAnswers = doc === 'bundle' && activeDocs.some((id: string) => answerableDocs.has(id))
  const shouldShowAnswerToggle = (activeDocs.length === 1 && answerableDocs.has(primaryDoc)) || bundleHasAnswers
  const docTitle = useMemo(() => {
    // If single worksheet, show its title instead of "Bundle"
    if (doc === 'bundle' && activeDocs.length === 1 && activeDocs[0].startsWith('interactive-')) {
      const singleDocId = activeDocs[0]
      // Try to get the worksheet title from INTERACTIVE_CATEGORIES
      for (const category of INTERACTIVE_CATEGORIES) {
        const worksheet = category.docs.find(d => d.id === singleDocId)
        if (worksheet) {
          // Use translated title if available, otherwise fall back to English title
          const translatedTitle = t(`interactive.${singleDocId}.title`)
          const title = translatedTitle !== `interactive.${singleDocId}.title` ? translatedTitle : worksheet.title
          return `${category.icon} ${title}`
        }
      }
    }
    return resolveDocTitle(doc || '', { packTime, bundleCategory: bundleCategoryParam || undefined, t })
  }, [doc, packTime, bundleCategoryParam, activeDocs, t, language])
  const pinHref = useMemo(() => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print'
      const desc = `${docTitle}  free printable for kids`
      return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc)}`
    } catch {
      return '#'
    }
  }, [docTitle])

  // Build a daily/variant seed: today if none provided
  const todaySeed = useMemo(() => {
    try {
      const d = new Date()
      const y = d.getUTCFullYear()
      const m = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return '2025-01-01'
    }
  }, [])

  const effectiveSeed = seedParam || (timestampParam ? `ts:${timestampParam}` : todaySeed)
  const variant = parseInt(variantParam || '1', 10)
  const bundleAnswerSections: Array<{ docId: string; title: string; content: ReactNode }> = []
  const showAnswersForDoc = (docId: string, factory: () => ReactNode) => {
    if (!showAnswers) return null
    const content = factory()
    if (doc === 'bundle') {
      const title = resolveDocTitle(docId, { packTime, bundleCategory: bundleCategoryParam || undefined, t })
      let summaryContent = content
      if (isValidElement(content)) {
        // Clone to remove some props or simplify for summary if needed
        // For now just keep as is
      }
      bundleAnswerSections.push({ docId, title, content: summaryContent })
      return null
    }
    return (
      <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-300 break-inside-avoid">
        <h3 className="text-lg font-bold text-slate-500 mb-4 flex items-center gap-2">
          <span>{String.fromCodePoint(0x1F511)}</span>
          Answer Key
        </h3>
        {content}
      </div>
    )
  }

  // Challenge and Assessment Component for addition-subtraction-0-10


  const friendlyAge = (v: string) =>
    v === 'k1' ? 'K1'
      : v === 'k2' ? 'K2'
        : v === 'g1' ? '1st Grade'
          : v === 'g2' ? '2nd Grade'
            : v === '25' ? '2nd-5th Grade'
              : v === '35' ? '35'
                : v === '68' ? '68'
                  : v
  const friendlyFocus = (v: string) => ({ mixed: 'Mixed', focus: 'Focus', reading: 'Reading', stem: 'STEM', creativity: 'Creativity', math: 'Math' } as any)[v] || v

  // Helpers moved to @/utils/printableUtils and components
  // makeRng, pick, pickNUnique etc. imported from utils

  // local components
  function SafeImg({ sources, alt, className }: { sources: string[]; alt: string; className?: string }) {
    const [idx, setIdx] = useState(0)
    const src = sources[idx] || sources[0]
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        loading="eager"
        decoding="async"
        onError={() => setIdx((i: number) => Math.min(i + 1, sources.length - 1))}
      />
    )
  }
  // Track worksheet view on mount
  useEffect(() => {
    if (doc && primaryDoc) {
      const from = params.get('from') || 'unknown'
      const grade = from.includes('grade') ? from.replace('-grade', '') :
        from.includes('kindergarten') ? 'kindergarten' :
          from.includes('multiplication') ? 'multiplication' :
            from.includes('reading') ? 'reading' : undefined
      trackWorksheetView(primaryDoc, docTitle, from, grade)
    }
  }, [doc, primaryDoc, docTitle])

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      if (timeSpent > 3) { // Only track if user spent more than 3 seconds
        trackTimeOnPage(`/print?doc=${doc}`, timeSpent)
      }
    }
  }, [doc])

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScroll < 50) {
          trackScrollDepth(`/print?doc=${doc}`, 25)
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScroll < 75) {
          trackScrollDepth(`/print?doc=${doc}`, 50)
        } else if (scrollPercent >= 75 && scrollPercent < 100 && maxScroll < 100) {
          trackScrollDepth(`/print?doc=${doc}`, 75)
        } else if (scrollPercent >= 100) {
          trackScrollDepth(`/print?doc=${doc}`, 100)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [doc])

  // PDF download function - completely rewritten from scratch to match Ctrl+P exactly
  const downloadPDF = useCallback(async () => {
    try {
      setIsDownloadingPDF(true)

      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas').then(m => m.default || m)
      ])

      // Wait for content to render
      // If showAnswers is true, wait a bit longer for answers to render
      if (showAnswers) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      } else {
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Find the worksheet content container
      const contentElement = document.querySelector('[data-worksheet-content="true"]') as HTMLElement
      if (!contentElement) {
        throw new Error('Could not find worksheet content. Please refresh the page and try again.')
      }

      // Store original styles for restoration
      const originalStyles = new Map<HTMLElement, { [key: string]: string }>()

      // Apply print styles by creating a style tag with ALL print CSS from index.css
      // CRITICAL: html2canvas doesn't respect @media print, so we must apply ALL print styles as regular styles
      const printStyleTag = document.createElement('style')
      printStyleTag.id = 'pdf-export-print-styles'
      printStyleTag.textContent = `
        /* ============================================================================
         * EXACT MATCH: All print styles from index.css @media print
         * Applied as regular styles for html2canvas compatibility
         * ============================================================================ */
        
        /* Base backgrounds - match index.css exactly */
        html, body, #root, [data-worksheet-content="true"] {
          background-color: white !important;
          background: white !important;
          color: black !important;
        }
        
        /* Override dark backgrounds */
        [class*="bg-black"],
        [class*="bg-slate-900"],
        [class*="bg-gray-900"],
        [class*="bg-zinc-900"],
        [class*="bg-neutral-900"],
        [class*="bg-stone-900"],
        [class*="dark"],
        .bg-black,
        .bg-slate-900,
        .bg-gray-900 {
          background-color: white !important;
          background: white !important;
          color: black !important;
        }
        
        /* Worksheet content backgrounds */
        [data-worksheet-content="true"],
        [data-worksheet-content="true"] section,
        [data-worksheet-content="true"] div,
        .worksheet-section {
          background-color: white !important;
          background: white !important;
        }
        
        /* Body and HTML - match index.css exactly */
        body, html {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Fix blank first page - remove min-height constraints */
        [data-worksheet-content="true"],
        .min-h-screen {
          min-height: auto !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: white !important;
        }
        
        /* CRITICAL: Main content container - match index.css @media print exactly */
        [data-worksheet-content="true"] {
          width: 794px !important;
          max-width: 794px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: white !important;
        }
        
        /* CRITICAL: Inner div - match print styles with colorful border and emoji stars */
        [data-worksheet-content="true"] > div:first-child,
        [data-worksheet-content="true"] .max-w-4xl {
          position: relative !important;
          border-radius: 12px !important;
          border: 4px solid transparent !important;
          border-image: linear-gradient(
            135deg,
            #f472b6 0%,
            #a78bfa 20%,
            #60a5fa 40%,
            #34d399 60%,
            #fbbf24 80%,
            #fb7185 100%
          ) 1 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          padding: 20px 24px 24px 24px !important;
          margin: 0.5in !important;
        }
        
        /* Decorative emoji-style border using CSS patterns - applied to ALL worksheets */
        [data-worksheet-content="true"] > div:first-child::before,
        [data-worksheet-content="true"] > div.max-w-4xl::before,
        .max-w-4xl.mx-auto::before,
        [data-worksheet-content="true"] .max-w-4xl::before {
          content: '' !important;
          position: absolute !important;
          top: -8px !important;
          left: -8px !important;
          right: -8px !important;
          bottom: -8px !important;
          background-image: 
            /* Stars pattern */
            repeating-linear-gradient(0deg, transparent, transparent 20px, #fbbf24 20px, #fbbf24 21px),
            repeating-linear-gradient(90deg, transparent, transparent 20px, #f472b6 20px, #f472b6 21px),
            repeating-linear-gradient(45deg, transparent, transparent 15px, #60a5fa 15px, #60a5fa 16px),
            repeating-linear-gradient(135deg, transparent, transparent 15px, #34d399 15px, #34d399 16px),
            /* Base gradient */
            linear-gradient(135deg, #f472b6 0%, #a78bfa 20%, #60a5fa 40%, #34d399 60%, #fbbf24 80%, #fb7185 100%) !important;
          background-size: 100% 2px, 2px 100%, 100% 2px, 2px 100%, 100% 100% !important;
          background-position: top, right, bottom, left, center !important;
          background-repeat: repeat-x, repeat-y, repeat-x, repeat-y, no-repeat !important;
          border-radius: 14px !important;
          z-index: -1 !important;
          opacity: 0.3 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Decorative emoji stars at top - applied to ALL worksheets */
        [data-worksheet-content="true"] > div:first-child::after,
        [data-worksheet-content="true"] > div.max-w-4xl::after,
        .max-w-4xl.mx-auto::after,
        [data-worksheet-content="true"] .max-w-4xl::after {
          content: '   ' !important;
          position: absolute !important;
          top: 0px !important;
          left: 50% !important;
          transform: translateX(-50%) translateY(-50%) !important;
          font-size: 18px !important;
          letter-spacing: 10px !important;
          z-index: 10 !important;
          background: white !important;
          padding: 4px 12px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color: #f472b6 !important;
          display: block !important;
          white-space: nowrap !important;
        }
        
        /* Ensure all divs inside worksheet content have white background */
        [data-worksheet-content="true"] > div:first-child > * {
          background-color: white !important;
          background: white !important;
        }
        
        /* Remove top margin/padding from first page content */
        [data-worksheet-content="true"] > *:first-child,
        [data-worksheet-content="true"] > section:first-child,
        .worksheet-section:first-child {
          margin-top: 0.25rem !important;
          padding-top: 0.25rem !important;
          background-color: white !important;
        }
        
        /* Fix blank first page - ensure first element starts at top */
        [data-worksheet-content="true"] > *:first-child,
        [data-worksheet-content="true"] > section:first-child {
          page-break-before: auto !important;
        }
        
        /* Remove all top margins from first section */
        section.worksheet-section:first-child,
        .worksheet-section:first-child {
          margin-top: 0 !important;
          padding-top: 0 !important;
          background-color: transparent !important;
        }

        /* Ensure CHILDREN of the section can also break */
        .worksheet-section > div,
        .worksheet-section > div > div {
          break-inside: auto !important;
          page-break-inside: auto !important;
        }

        /* Preserve content borders within worksheets */
        section[class*="break-inside-avoid"] div[class*="border"],
        section[class*="break-inside-avoid"] div[class*="rounded"] {
          border: 1px solid #cbd5e1 !important;
          border-radius: 4px !important;
        }
        
        /* Hide print:hidden elements */
        [class*="print:hidden"] {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Show print:block elements */
        [class*="print:block"] {
          display: block !important;
        }
        
        /* Hide URLs in print */
        a[href]::after { content: none !important; }
        a { text-decoration: none !important; }
        
        /* Remove box shadows */
        * {
          box-shadow: none !important;
        }
        
        /* Typography - match index.css */
        p { 
          line-height: 1.5 !important; 
          margin: 0.5rem 0 !important;
        }
        
        div, span { 
          line-height: 1.4 !important; 
        }
        
        h1, h2, h3 { 
          page-break-after: avoid !important; 
          margin-bottom: 0.75rem !important;
          margin-top: 1rem !important;
          line-height: 1.3 !important;
        }
        
        /* First section headings should be more compact */
        .worksheet-section:first-of-type h1,
        .worksheet-section:first-of-type h2,
        .worksheet-section:first-of-type h3 {
          margin-top: 0.25rem !important;
          margin-bottom: 0.375rem !important;
        }
        
        /* Keep headings with following content */
        h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + * {
          page-break-before: avoid !important;
          break-before: avoid !important;
        }
        
        /* Prevent breaks in images and visual elements */
        img, svg, picture, canvas, video {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          break-after: avoid !important;
          max-height: 100vh !important;
        }
        
        /* Problem Box Component */
        .problem-box {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          background-color: white !important;
          margin-bottom: 20px !important;
        }
        
        .problem-box-default {
          border: 1px solid #d5d5d5 !important;
          border-radius: 10px !important;
          padding: 16px !important;
        }
        
        .problem-box-highlight {
          border: 1px solid #b3d9ff !important;
          border-radius: 10px !important;
          padding: 16px !important;
          background-color: #eaf4ff !important;
        }
        
        .problem-box-minimal {
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          padding: 12px !important;
          background-color: transparent !important;
        }
      `
      document.head.appendChild(printStyleTag)

      // Hide print:hidden elements
      const printHiddenElements = document.querySelectorAll('[class*="print:hidden"]')
      printHiddenElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        originalStyles.set(htmlEl, { display: htmlEl.style.display, visibility: htmlEl.style.visibility })
        htmlEl.style.display = 'none'
        htmlEl.style.visibility = 'hidden'
      })

      // Show print:block elements
      const printBlockElements = document.querySelectorAll('[class*="print:block"]')
      printBlockElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        const computedStyle = window.getComputedStyle(htmlEl)
        if (computedStyle.display === 'none') {
          originalStyles.set(htmlEl, { display: htmlEl.style.display })
          htmlEl.style.display = 'block'
        }
      })

      // Set body to print dimensions
      const originalBodyStyle = {
        width: document.body.style.width,
        maxWidth: document.body.style.maxWidth,
        margin: document.body.style.margin,
        padding: document.body.style.padding,
        background: document.body.style.background
      }

      document.body.style.width = '794px'
      document.body.style.maxWidth = '794px'
      document.body.style.margin = '0 auto'
      document.body.style.padding = '0'
      document.body.style.background = 'white'

      // Set content element to print dimensions
      const originalContentStyle = {
        width: contentElement.style.width,
        maxWidth: contentElement.style.maxWidth,
        margin: contentElement.style.margin,
        padding: contentElement.style.padding,
        background: contentElement.style.background
      }

      contentElement.style.width = '794px'
      contentElement.style.maxWidth = '794px'
      contentElement.style.margin = '0 auto'
      contentElement.style.padding = '0'
      contentElement.style.background = 'white'

      // Set inner div to match print layout EXACTLY - with colorful border and emoji stars
      // CRITICAL: Print styles show colorful border, padding 20px 24px, and emoji stars - match Ctrl+P exactly
      const innerDiv = contentElement.querySelector(':scope > div:first-child') as HTMLElement
      if (innerDiv) {
        originalStyles.set(innerDiv, {
          margin: innerDiv.style.margin,
          marginTop: innerDiv.style.marginTop,
          width: innerDiv.style.width,
          maxWidth: innerDiv.style.maxWidth,
          padding: innerDiv.style.padding,
          position: innerDiv.style.position,
          overflow: innerDiv.style.overflow,
          backgroundColor: innerDiv.style.backgroundColor,
          background: innerDiv.style.background,
          boxSizing: innerDiv.style.boxSizing,
          borderRadius: innerDiv.style.borderRadius,
          border: innerDiv.style.border,
          borderImage: innerDiv.style.borderImage,
          webkitPrintColorAdjust: innerDiv.style.webkitPrintColorAdjust,
          printColorAdjust: innerDiv.style.printColorAdjust,
          colorAdjust: (innerDiv.style as any).colorAdjust
        })
        // Match print styles with colorful border and padding
        innerDiv.style.position = 'relative'
        innerDiv.style.borderRadius = '12px'
        innerDiv.style.border = '4px solid transparent'
        innerDiv.style.borderImage = 'linear-gradient(135deg, #f472b6 0%, #a78bfa 20%, #60a5fa 40%, #34d399 60%, #fbbf24 80%, #fb7185 100%) 1'
        innerDiv.style.borderImageSlice = '1'
        const innerStyle = innerDiv.style as any
        innerStyle.webkitPrintColorAdjust = 'exact'
        innerStyle.printColorAdjust = 'exact'
        innerStyle.colorAdjust = 'exact'
        innerDiv.style.padding = '20px 24px 24px 24px'
        innerDiv.style.margin = '0.5in'
        innerDiv.style.backgroundColor = 'white'
        innerDiv.style.background = 'white'
      }

      // Wait for styles to apply - ensure colorful border, emoji stars, and all print styles are rendered
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Capture with html2canvas - ensure colors are captured correctly
      const canvas = await html2canvas(contentElement, {
        scale: 2.0,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: contentElement.scrollHeight,
        onclone: (clonedDoc: Document) => {
          // Remove style tags
          clonedDoc.querySelectorAll('style').forEach(tag => {
            if (tag.id !== 'pdf-export-print-styles') {
              tag.remove()
            }
          })

          // Apply print styles to cloned document
          const clonedBody = clonedDoc.body
          if (clonedBody) {
            clonedBody.style.width = '794px'
            clonedBody.style.maxWidth = '794px'
            clonedBody.style.margin = '0'
            clonedBody.style.padding = '0'
            clonedBody.style.background = 'white'
          }

          // Apply print styles to cloned inner div - with colorful border and emoji stars
          const clonedContentElement = clonedDoc.querySelector('[data-worksheet-content="true"]') as HTMLElement
          if (clonedContentElement) {
            const clonedInnerDiv = clonedContentElement.querySelector(':scope > div:first-child') as HTMLElement
            if (clonedInnerDiv) {
              // Match print styles with colorful border, padding, and emoji stars
              clonedInnerDiv.style.position = 'relative'
              clonedInnerDiv.style.borderRadius = '12px'
              clonedInnerDiv.style.border = '4px solid transparent'
              clonedInnerDiv.style.borderImage = 'linear-gradient(135deg, #f472b6 0%, #a78bfa 20%, #60a5fa 40%, #34d399 60%, #fbbf24 80%, #fb7185 100%) 1'
              clonedInnerDiv.style.borderImageSlice = '1'
              clonedInnerDiv.style.webkitPrintColorAdjust = 'exact'
              clonedInnerDiv.style.printColorAdjust = 'exact'
                ; (clonedInnerDiv.style as any).colorAdjust = 'exact'
              clonedInnerDiv.style.padding = '20px 24px 24px 24px'
              clonedInnerDiv.style.margin = '0.5in'
              clonedInnerDiv.style.backgroundColor = 'white'
              clonedInnerDiv.style.background = 'white'
            }
          }

          // Ensure print styles are in cloned document
          const clonedStyleTag = clonedDoc.getElementById('pdf-export-print-styles')
          if (!clonedStyleTag) {
            const styleTag = clonedDoc.createElement('style')
            styleTag.id = 'pdf-export-print-styles'
            styleTag.textContent = printStyleTag.textContent
            clonedDoc.head.appendChild(styleTag)
          }

          // Process print: utility classes
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement
            const classList = Array.from(htmlEl.classList)

            if (classList.some(cls => cls.includes('print:block'))) {
              htmlEl.style.display = 'block'
            }
            if (classList.some(cls => cls.includes('print:hidden'))) {
              htmlEl.style.display = 'none'
            }
          })
        }
      })

      // Restore original styles
      document.body.style.width = originalBodyStyle.width
      document.body.style.maxWidth = originalBodyStyle.maxWidth
      document.body.style.margin = originalBodyStyle.margin
      document.body.style.padding = originalBodyStyle.padding
      document.body.style.background = originalBodyStyle.background

      contentElement.style.width = originalContentStyle.width
      contentElement.style.maxWidth = originalContentStyle.maxWidth
      contentElement.style.margin = originalContentStyle.margin
      contentElement.style.padding = originalContentStyle.padding
      contentElement.style.background = originalContentStyle.background

      originalStyles.forEach((styles, element) => {
        Object.entries(styles).forEach(([prop, value]) => {
          (element.style as any)[prop] = value
        })
      })

      printStyleTag.remove()

      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Failed to capture content. Please try again.')
      }

      // Create PDF - A4 size (210mm x 297mm)
      const pageWidthMm = 210 // A4 width in mm
      const pageHeightMm = 297 // A4 height in mm
      const pdf = new jsPDF('p', 'mm', 'a4')

      // Calculate image dimensions
      const imgWidth = pageWidthMm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95)

      if (imgHeight <= pageHeightMm) {
        // Single page
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        // Multiple pages - split canvas into pages
        const pixelsPerMm = canvas.width / imgWidth
        const pageHeightPx = pageHeightMm * pixelsPerMm
        let currentY = 0

        while (currentY < canvas.height) {
          const pageHeightActual = Math.min(pageHeightPx, canvas.height - currentY)

          // Create a canvas for this page
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = canvas.width
          pageCanvas.height = pageHeightActual
          const pageCtx = pageCanvas.getContext('2d')

          if (pageCtx) {
            // Fill white background
            pageCtx.fillStyle = '#ffffff'
            pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)

            // Draw portion of original canvas
            pageCtx.drawImage(
              canvas,
              0, currentY,
              canvas.width, pageHeightActual,
              0, 0,
              pageCanvas.width, pageCanvas.height
            )

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95)
            const pageImgHeight = (pageHeightActual * imgWidth) / canvas.width

            pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight)

            currentY += pageHeightActual
            if (currentY < canvas.height) {
              pdf.addPage()
            }
          } else {
            break
          }
        }
      }

      // Generate filename and download
      const filename = docTitle
        ? `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
        : `worksheet_${doc || 'download'}.pdf`

      pdf.save(filename)

      // Track download
      if (doc && primaryDoc) {
        const from = params.get('from') || 'unknown'
        const grade = from.includes('grade') ? from.replace('-grade', '') : undefined
        trackWorksheetDownload(primaryDoc, docTitle, from, grade)
      }

    } catch (error) {
      console.error('PDF download failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`PDF download failed: ${errorMessage}\n\nPlease try using the Print button and select "Save as PDF" instead.`)
    } finally {
      setIsDownloadingPDF(false)
    }
  }, [doc, primaryDoc, docTitle, params, showAnswers])

  // OLD PDF download function - kept for reference but not used
  // This was causing blank pages, so we now use browser print dialog instead
  const downloadPDF_OLD = useCallback(async () => {
    let wrapperElement: HTMLElement | null = null
    let wrapperOriginalStyle: { width: string; maxWidth: string; margin: string; padding: string } | null = null

    try {
      setIsDownloadingPDF(true)

      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas').then(m => m.default || m)
      ])

      // If showAnswers is true, wait a bit longer for answers to render
      if (showAnswers) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Wait for content to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500))

      // Find the worksheet content container
      const contentElement = document.querySelector('[data-worksheet-content="true"]') as HTMLElement
      if (!contentElement) {
        throw new Error('Could not find worksheet content. Please refresh the page and try again.')
      }

      // Apply print styles temporarily
      const printStyleTag = document.createElement('style')
      printStyleTag.id = 'pdf-export-print-styles'
      printStyleTag.textContent = `
        /* Apply print styles */
        [data-worksheet-content="true"] {
          width: 794px !important;
          max-width: 794px !important;
        }
      `
      document.head.appendChild(printStyleTag)

      // Capture with html2canvas
      const canvas = await html2canvas(contentElement, {
        scale: 2.0,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false
      })

      // Remove print styles
      printStyleTag.remove()

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)

      // Generate filename and download
      const filename = docTitle
        ? `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
        : `worksheet_${doc || 'download'}.pdf`

      pdf.save(filename)

    } catch (error) {
      console.error('PDF download failed:', error)
      alert('PDF download failed. Please try using the Print button instead.')
    } finally {
      setIsDownloadingPDF(false)
    }
  }, [doc, docTitle, showAnswers])

  // OLD PDF download function - kept for reference but not used
  // This was causing blank pages, so we now use browser print dialog instead
  const downloadPDF_OLD2 = useCallback(async () => {
    let wrapperElement: HTMLElement | null = null
    let wrapperOriginalStyle: { width: string; maxWidth: string; margin: string; padding: string } | null = null

    try {
      setIsDownloadingPDF(true)

      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas').then(m => m.default || m)
      ])

      // If showAnswers is true, wait a bit longer for answers to render
      if (showAnswers) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Wait for content to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500))

      // Find the worksheet content container
      const contentElement = document.querySelector('[data-worksheet-content="true"]') as HTMLElement
      if (!contentElement) {
        throw new Error('Could not find worksheet content. Please refresh the page and try again.')
      }

      // Apply print styles temporarily
      const printStyleTag = document.createElement('style')
      printStyleTag.id = 'pdf-export-print-styles'
      printStyleTag.textContent = `
        /* Apply print styles */
        [data-worksheet-content="true"] {
          width: 794px !important;
          max-width: 794px !important;
        }
      `
      document.head.appendChild(printStyleTag)

      // Capture with html2canvas
      const canvas = await html2canvas(contentElement, {
        scale: 2.0,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false
      })

      // Remove print styles
      printStyleTag.remove()

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)

      // Generate filename and download
      const filename = docTitle
        ? `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
        : `worksheet_${doc || 'download'}.pdf`

      pdf.save(filename)

    } catch (error) {
      console.error('PDF download failed:', error)
      alert('PDF download failed. Please try using the Print button instead.')
    } finally {
      setIsDownloadingPDF(false)
    }
  }, [doc, docTitle, showAnswers])

  // Auto-download PDF when download=1 parameter is present
  useEffect(() => {
    if (!autoDownload) return
    // Defer a bit to let the view render fully
    const t = setTimeout(() => {
      downloadPDF()
    }, 1200)
    return () => clearTimeout(t)
  }, [autoDownload, downloadPDF])

  // Track if print has already been called to prevent multiple popups
  // Use a more robust approach with sessionStorage and ref to persist across re-renders
  const hasPrintedRef = useRef(false)
  const printCallTimeRef = useRef<number>(0)
  const printTimeoutRef = useRef<any>(null)
  const hasScheduledPrintRef = useRef(false)

  // Auto-open browser print dialog when requested (e.g., from "Download PDF" links)
  // ONLY run on /print route, not on category pages like /printables or in preview mode (iframes)
  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') return

    try {
      // Check pathname directly to ensure we're on /print route
      const currentPathname = window.location.pathname
      if (currentPathname !== '/print') {
        return // Don't run on category pages like /printables
      }

      // Check autoprint parameter directly from URL
      const currentSearch = window.location.search
      const currentParams = new URLSearchParams(currentSearch)
      const autoprintParam = (currentParams.get('autoprint') || '').toLowerCase()
      const hasAutoprint = autoprintParam === '1' || autoprintParam === 'true'
      const isPreviewParam = (currentParams.get('preview') || '').toLowerCase() === '1' || (currentParams.get('preview') || '').toLowerCase() === 'true'
      const hasAutoDownload = (currentParams.get('download') || '').toLowerCase() === '1' || (currentParams.get('download') || '').toLowerCase() === 'true'

      // CRITICAL: Never trigger autoprint in preview mode (used in iframes on category pages)
      if (isPreviewParam) {
        return // Don't run in preview mode (iframes)
      }

      // Skip if autoprint is not set or download is handling it
      if (!hasAutoprint || hasAutoDownload) {
        return
      }

      // Check if we're in an iframe and parent is not on /print route
      const isInIframe = window.self !== window.top
      if (isInIframe) {
        try {
          const parentPath = window.top?.location?.pathname || ''
          if (parentPath !== '/print') {
            return // Don't trigger print if parent is not on print route
          }
        } catch (e) {
          // Cross-origin iframe - can't access parent, so don't trigger print to be safe
          return
        }
      }

      // Use a URL-based key with timestamp to ensure fresh prints on navigation
      const currentUrl = window.location.href
      const printKey = `autoprint_${currentUrl}`
      const now = Date.now()
      const PRINT_COOLDOWN = 2000 // 2 seconds - prevent duplicate prints within 2 seconds

      // Check if we've already printed for this exact URL in this session
      // Use a timestamp to allow re-printing if user navigates away and comes back
      const lastPrintTime = sessionStorage.getItem(printKey)
      if (lastPrintTime) {
        const timeSinceLastPrint = now - parseInt(lastPrintTime, 10)
        if (timeSinceLastPrint < PRINT_COOLDOWN) {
          return // Too soon since last print attempt
        }
      }

      // Check if we've already scheduled a print for this exact URL recently
      // Only block if we've scheduled it very recently (within cooldown)
      const scheduledUrl = sessionStorage.getItem('autoprint_scheduled_url')
      if (scheduledUrl === currentUrl) {
        const scheduledTime = sessionStorage.getItem(printKey)
        if (scheduledTime) {
          const timeSinceScheduled = now - parseInt(scheduledTime, 10)
          if (timeSinceScheduled < PRINT_COOLDOWN) {
            return // Too soon since last scheduled print for this URL
          }
        }
        // It's been long enough, allow re-printing
      }

      // If we get here, we should proceed with printing

      // Mark that we're scheduling a print for this URL
      hasScheduledPrintRef.current = true
      sessionStorage.setItem('autoprint_scheduled_url', currentUrl)
      sessionStorage.setItem(printKey, now.toString())

      // Clear any existing timeout
      if (printTimeoutRef.current) {
        clearTimeout(printTimeoutRef.current)
      }

      // Defer a bit to let the view render fully
      printTimeoutRef.current = setTimeout(() => {
        try {
          // Final checks before printing
          const finalPathname = window.location.pathname
          if (finalPathname !== '/print') {
            return
          }

          const finalSearch = window.location.search
          const finalParams = new URLSearchParams(finalSearch)
          const finalIsPreview = (finalParams.get('preview') || '').toLowerCase() === '1' || (finalParams.get('preview') || '').toLowerCase() === 'true'
          if (finalIsPreview) {
            return
          }

          // Check if still scheduled for this URL - but don't block print if not set
          // The sessionStorage flag was set earlier to prevent duplicate attempts
          const stillScheduledUrl = sessionStorage.getItem('autoprint_scheduled_url')
          // Only check if the scheduled URL exists and doesn't match - this allows first-time prints
          if (stillScheduledUrl && stillScheduledUrl !== currentUrl) {
            return
          }

          // All checks passed - trigger print
          window.print()

          // Track auto-print
          if (doc && primaryDoc) {
            const from = params.get('from') || 'unknown'
            const grade = from.includes('grade') ? from.replace('-grade', '') : undefined
            trackPrintDialog(primaryDoc, from)
            trackWorksheetDownload(primaryDoc, docTitle, from, grade)
          }
        } catch (e) {
          console.error('Error in autoprint timeout:', e)
        }
      }, 1200)

      return () => {
        if (printTimeoutRef.current) {
          clearTimeout(printTimeoutRef.current)
          printTimeoutRef.current = null
        }
      }
    } catch (e) {
      console.error('Error in autoprint effect:', e)
    }
  }, [urlSearch, doc, primaryDoc, docTitle, params]) // Re-run when URL or doc changes

  // Reset print flag when URL changes (new worksheet loaded)
  // Use a ref to track the previous URL to only reset when URL actually changes
  const previousUrlRef = useRef<string>('')
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only reset on exact /print route, not /printables
    const currentPathname = window.location.pathname
    if (currentPathname !== '/print') {
      // If we're not on print route, ensure print is disabled
      hasScheduledPrintRef.current = true
      return
    }

    // Check preview mode
    const currentSearch = window.location.search
    const currentParams = new URLSearchParams(currentSearch)
    const isPreviewParam = (currentParams.get('preview') || '').toLowerCase() === '1' || (currentParams.get('preview') || '').toLowerCase() === 'true'

    if (isPreviewParam) {
      hasScheduledPrintRef.current = true
      return
    }

    // Get current URL
    const currentUrl = window.location.href

    // Only reset if URL actually changed from a previous URL (not on initial mount)
    // On initial mount, previousUrlRef.current is '', so we check if it's not empty
    if (previousUrlRef.current && currentUrl !== previousUrlRef.current) {
      // URL actually changed from a previous URL - reset everything
      previousUrlRef.current = currentUrl

      // Clear the scheduled URL flag to allow autoprint to work for new URLs
      sessionStorage.removeItem('autoprint_scheduled_url')

      // Reset refs for new worksheet
      hasPrintedRef.current = false
      printCallTimeRef.current = 0
      hasScheduledPrintRef.current = false

      // Clear any pending timeout from previous URL
      if (printTimeoutRef.current) {
        clearTimeout(printTimeoutRef.current)
        printTimeoutRef.current = null
      }
    } else if (!previousUrlRef.current) {
      // Initial mount - just set the previous URL, don't clear anything
      // This allows the autoprint effect to run and set up the print timeout
      previousUrlRef.current = currentUrl
    }
  }, [urlSearch, doc])
  return (
    <div className="min-h-screen bg-white" data-worksheet-content="true" data-doc={doc || primaryDoc || ''}>
      <style>{`
        @media print {
          @page { 
            size: A4;
            margin: 0 !important;
          }
          html, body, #root, [data-worksheet-content="true"] {
            background-color: white !important;
            background: white !important;
            color: black !important;
            width: 794px !important;
            max-width: 794px !important;
            margin: 0 !important; 
            padding: 0 !important; 
            font-size: 11pt !important;
            line-height: 1.3 !important;
          }
          /* Decorative emoji-style border using CSS patterns - applied to ALL worksheets */
          [data-worksheet-content="true"] > div:first-child::before,
          [data-worksheet-content="true"] > div.max-w-4xl::before,
          .max-w-4xl.mx-auto::before,
          [data-worksheet-content="true"] .max-w-4xl::before {
            content: '' !important;
            position: absolute !important;
            top: -8px !important;
            left: -8px !important;
            right: -8px !important;
            bottom: -8px !important;
            background-image: 
              /* Stars pattern */
              repeating-linear-gradient(0deg, transparent, transparent 20px, #fbbf24 20px, #fbbf24 21px),
              repeating-linear-gradient(90deg, transparent, transparent 20px, #f472b6 20px, #f472b6 21px),
              repeating-linear-gradient(45deg, transparent, transparent 15px, #60a5fa 15px, #60a5fa 16px),
              repeating-linear-gradient(135deg, transparent, transparent 15px, #34d399 15px, #34d399 16px),
              /* Base gradient */
              linear-gradient(135deg, #f472b6 0%, #a78bfa 20%, #60a5fa 40%, #34d399 60%, #fbbf24 80%, #fb7185 100%) !important;
            background-size: 100% 2px, 2px 100%, 100% 2px, 2px 100%, 100% 100% !important;
            background-position: top, right, bottom, left, center !important;
            background-repeat: repeat-x, repeat-y, repeat-x, repeat-y, no-repeat !important;
            border-radius: 14px !important;
            z-index: -1 !important;
            opacity: 0.3 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Decorative emoji stars at top - applied to ALL worksheets */
          [data-worksheet-content="true"] > div:first-child::after,
          [data-worksheet-content="true"] > div.max-w-4xl::after,
          .max-w-4xl.mx-auto::after,
          [data-worksheet-content="true"] .max-w-4xl::after {
            content: '   ' !important;
            position: absolute !important;
            top: 0px !important;
            left: 50% !important;
            transform: translateX(-50%) translateY(-50%) !important;
            font-size: 18px !important;
            letter-spacing: 10px !important;
            z-index: 10 !important;
            background: white !important;
            padding: 4px 12px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: #f472b6 !important;
            display: block !important;
            white-space: nowrap !important;
          }
          /* Thin colorful decorative border with emoji-style pattern - applied to ALL worksheets */
          [data-worksheet-content="true"] > div:first-child,
          [data-worksheet-content="true"] .max-w-4xl {
            position: relative !important;
            border-radius: 12px !important;
            border: 4px solid transparent !important;
            border-image: linear-gradient(
              135deg,
              #f472b6 0%,
              #a78bfa 20%,
              #60a5fa 40%,
              #34d399 60%,
              #fbbf24 80%,
              #fb7185 100%
            ) 1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            padding: 20px 24px 24px 24px !important;
            margin: 0.95in 0.5in 0.5in 0.5in !important;
          }
          /* Logo and domain for all worksheets - positioned above border */
          [data-worksheet-content="true"] .wizqo-logo-print {
            position: absolute !important;
            top: -65px !important;
            left: 0px !important;
            z-index: 20 !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
            background: white !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          [data-worksheet-content="true"] .wizqo-logo-print img {
            width: 45px !important;
            height: 45px !important;
            object-fit: contain !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          [data-worksheet-content="true"] .wizqo-logo-print .domain-text {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #4845D2 !important;
            white-space: nowrap !important;
            letter-spacing: 0.5px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Layout fixes for kindergarten-counting-visual worksheet only */
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] * {
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] img,
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] svg,
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .emoji,
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .icon {
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            overflow: visible !important;
          }
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .flex,
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] [class*="flex"] {
            flex-wrap: wrap !important;
            align-items: flex-start !important;
            overflow: visible !important;
          }
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] *[class*="h-"],
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] *[class*="min-h-"],
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] *[class*="max-h-"],
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] *[style*="height"] {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
          }
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .border-4,
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .border-2,
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] [class*="border"] {
            overflow: visible !important;
          }
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .max-w-4xl {
            padding: 0 !important;
            margin: 0.95in 0.5in 0.5in 0.5in !important;
            page-break-inside: avoid !important;
          }
          [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .break-inside-avoid {
            page-break-inside: avoid !important;
            overflow: visible !important;
          }
        }
      `}</style>
      {/* Print layout optimized - updated 2025-01-11 */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0 print:py-0 print:mt-0 ${isPreview ? 'preview-mode' : ''}`}>
        {/* Logo and domain for all worksheets */}
        <div className="hidden print:block wizqo-logo-print">
          <img src="/logo.svg" alt="Wizqo Logo" />
          <span className="domain-text">www.wizqo.com</span>
        </div>
        {/* Customization header (print view - appears once at top) */}
        {(teacherName || className || studentNames.length > 0) && !isPreview && (
          <div className="hidden print:block print-customization-header" aria-hidden>
            <div className="flex flex-wrap gap-x-3 items-center">
              {teacherName && <span><strong>Teacher:</strong> {teacherName}</span>}
              {className && teacherName && <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span>}
              {className && <span><strong>Class:</strong> {className}</span>}
              {studentNames.length > 0 && (teacherName || className) && <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span>}
              {studentNames.length > 0 && (
                <span><strong>Students:</strong> {studentNames.join(', ')}</span>
              )}
            </div>
          </div>
        )}
        {/* Doc-specific back link and download button */}
        {!isPreview && (
          <div className="mb-4 print:hidden flex justify-between items-center" data-html2canvas-ignore="true">
            <a
              href={(() => {
                try {
                  const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
                  const from = (u.searchParams.get('from') || '').trim()
                  const docId = (doc || '').trim()


                  // HOTFIX: Mapping lost "from" params for specific Kindergarten worksheets
                  if (!from && ['big-small', 'heavy-light', 'long-short', 'same-different', 'more-less'].includes(docId)) {
                    return '/worksheets/kindergarten-math-worksheets'
                  }

                  // If coming from interactive worksheets generator, go back there
                  if (from === 'interactive') {
                    return '/interactive-worksheets-generator'
                  }
                  // If coming from grade pages, go back to the appropriate grade page
                  if (from === 'kindergarten') {
                    return '/worksheets/kindergarten-math-worksheets'
                  }
                  if (from === '1st-grade') {
                    return '/worksheets/1st-grade-math-worksheets'
                  }
                  if (from === '2nd-grade') {
                    return '/worksheets/2nd-grade-math-worksheets'
                  }
                  if (from === '3rd-grade') {
                    return '/worksheets/3rd-grade-math-worksheets'
                  }
                  if (from === '4th-grade') {
                    return '/worksheets/4th-grade-math-worksheets'
                  }
                  if (from === '5th-grade') {
                    return '/worksheets/5th-grade-math-worksheets'
                  }
                  if (from === 'reading-comprehension') {
                    return '/worksheets/reading-comprehension'
                  }
                  if (from === 'multiplication') {
                    return '/worksheets/multiplication-worksheets'
                  }
                  if (from === 'times-table') {
                    return '/worksheets/times-table-multiplication-worksheets'
                  }
                  if (from === 'fractions-to-decimals') {
                    return '/worksheets/fractions-to-decimals-worksheets'
                  }
                  if (from === 'order-of-operations') {
                    return '/worksheets/order-of-operations-worksheets'
                  }
                  if (from === 'handwriting') {
                    return '/worksheets/handwriting-worksheet-maker'
                  }
                  if (from === 'geometry-worksheets' || from === 'geometry') {
                    return '/printables/geometry-worksheets'
                  }
                  if (from === 'geography-worksheets' || from === 'geography') {
                    return '/printables/geography-worksheets'
                  }
                  if (from === 'measurement-worksheets' || from === 'measurement') {
                    return '/printables/measurement-worksheets'
                  }
                  if (from === 'logic-worksheets' || from === 'logic') {
                    return '/printables/logic-worksheets'
                  }
                  if (from === 'decimal-worksheets' || from === 'decimal') {
                    return '/printables/decimal-worksheets'
                  }
                  if (from === 'math-maze-worksheets' || from === 'math-maze') {
                    return '/printables/math-maze-worksheets'
                  }
                  if (from === 'data-analysis-worksheets') {
                    return '/printables/data-analysis-worksheets'
                  }
                  if (from === 'word-problem-worksheets') {
                    return '/printables/word-problem-worksheets'
                  }
                  if (from === 'science-worksheets') {
                    return '/printables/science-worksheets'
                  }
                  if (from === 'all') {
                    return '/worksheets/all'
                  }

                  // Check if 'from' is a known SEO slug
                  if (from) {
                    const seo = getWorksheetSEOBySlug(from)
                    if (seo) return `/worksheets/${seo.slug}`
                  }

                  // Robust fallback: if 'from' looks like a full internal path, use it
                  if (from && (from.startsWith('/') || from.includes('-worksheets') || from.includes('-worksheet-') || from === 'reading-comprehension')) {
                    if (from.startsWith('/')) return from
                    return `/worksheets/${from}`
                  }
                  // Determine category anchor by doc or bundle selection
                  const cat = (() => {
                    if (docId === 'bundle') {
                      if (bundleCategoryParam) return bundleCategoryParam
                      if (primaryDoc) {
                        return getPrintableSectionForDoc(primaryDoc) || (primaryDoc.startsWith('coloring') ? 'Coloring' : primaryDoc.startsWith('geo-') ? 'Geography' : '')
                      }
                      return 'Worksheets'
                    }
                    if (!docId) return ''
                    const found = getPrintableSectionForDoc(docId)
                    if (found) return found

                    // Improved fallback logic
                    if (docId.startsWith('coloring')) return 'Coloring'
                    if (docId.startsWith('geo-')) return 'Geography'
                    return 'Worksheets'
                  })()
                  const hash = cat ? `#${encodeURIComponent(cat)}` : ''
                  return `/printables${hash}`
                } catch {
                  return '/printables'
                }
              })()}
              onClick={(e: MouseEvent) => {
                // If coming from within the site (internal referrer) AND we have history, use history.back()
                // Checking history.length > 1 is critical: if opened in new tab, referrer exists but back() does nothing.
                if (typeof window !== 'undefined' &&
                  document.referrer &&
                  document.referrer.includes(window.location.host) &&
                  window.history.length > 1) {
                  e.preventDefault()
                  window.history.back()
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
              aria-label={t('pages.printables.backPrintablePage')}
            >
              <span>{String.fromCodePoint(0x2B05)}</span>
              <span>{(() => {
                try {
                  const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
                  const from = u.searchParams.get('from')
                  if (from === 'interactive') {
                    return t('pages.printables.backToInteractive')
                  }
                  if (from === 'kindergarten') {
                    return t('pages.printables.backToKindergarten')
                  }
                  if (from === '1st-grade') {
                    return t('pages.printables.backToFirstGrade')
                  }
                  if (from === '2nd-grade') {
                    return t('pages.printables.backToSecondGrade')
                  }
                  if (from === '3rd-grade') {
                    return t('pages.printables.backToThirdGrade')
                  }
                  if (from === '4th-grade') {
                    return t('pages.printables.backToFourthGrade')
                  }
                  if (from === '5th-grade') {
                    return t('pages.printables.backToFifthGrade')
                  }
                  if (from === 'reading-comprehension') {
                    return t('pages.printables.backToReadingComprehension')
                  }
                  if (from === 'multiplication') {
                    return t('pages.printables.backToMultiplication')
                  }
                  if (from === 'times-table') {
                    return t('pages.printables.backToTimesTable')
                  }
                  if (from === 'fractions-to-decimals') {
                    return t('pages.printables.backToFractionsToDecimals')
                  }
                  if (from === 'order-of-operations') {
                    return 'Back to Order of Operations'
                  }
                  if (from === 'handwriting') {
                    return t('pages.handwriting.title')
                  }
                  if (from === 'geometry-worksheets' || from === 'geometry') {
                    return 'Back to Geometry Worksheets'
                  }
                  if (from === 'geography-worksheets' || from === 'geography') {
                    return 'Back to Geography Worksheets'
                  }
                  if (from === 'measurement-worksheets' || from === 'measurement') {
                    return 'Back to Measurement Worksheets'
                  }
                  if (from === 'logic-worksheets' || from === 'logic') {
                    return 'Back to Logic Worksheets'
                  }
                  if (from === 'decimal-worksheets' || from === 'decimal') {
                    return 'Back to Decimals Worksheets'
                  }
                  if (from === 'math-maze-worksheets' || from === 'math-maze') {
                    return 'Back to Math Maze Worksheets'
                  }
                  if (from === 'data-analysis-worksheets') {
                    return 'Back to Data Analysis Worksheets'
                  }
                  if (from === 'word-problem-worksheets') {
                    return 'Back to Word Problem Worksheets'
                  }
                  if (from === 'science-worksheets') {
                    return 'Back to Science Worksheets'
                  }
                  if (from === 'all') {
                    return t('pages.printables.backToAllWorksheets')
                  }

                  // Check if 'from' is a known SEO slug
                  if (from) {
                    const seo = getWorksheetSEOBySlug(from)
                    if (seo) return `Back to ${seo.h1}`
                  }

                  if (from && (from.includes('grade') || from.includes('worksheets') || from.includes('comprehension'))) {
                    // Title-ize if we don't have a specific translation
                    return `Back to ${from.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`
                  }
                  return t('pages.printables.backPrintablePage')
                } catch {
                  return t('pages.printables.backPrintablePage')
                }
              })()}</span>
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={(e: MouseEvent) => {
                  e.preventDefault()
                  e.stopPropagation()
                  try {
                    window.print()
                  } catch (error: unknown) {
                    // Fallback: open print dialog using a different method
                    setTimeout(() => {
                      try {
                        window.print()
                      } catch (err: unknown) {
                        console.error('Print failed:', err)
                        // Last resort: show message to user
                        alert('Please use your browser\'s print function (Ctrl+P or Cmd+P)')
                      }
                    }, 100)
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 print:hidden"
              >
                <span>{String.fromCodePoint(0x1F5A8)}</span> Print
              </button>
              <button
                onClick={(e: MouseEvent) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isDownloadingPNG) return

                  setIsDownloadingPNG(true)
                  const contentElement = document.querySelector('[data-worksheet-content="true"]') as HTMLElement
                  if (!contentElement) {
                    setIsDownloadingPNG(false)
                    return
                  }

                  // Small timeout to allow UI to update
                  setTimeout(() => {
                    import('html2canvas').then(m => m.default || m).then(html2canvas => {
                      html2canvas(contentElement, {
                        scale: 2.0,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff',
                        allowTaint: false,
                        ignoreElements: (element: Element) => {
                          // Explicitly ignore elements with data-html2canvas-ignore
                          if (element.hasAttribute('data-html2canvas-ignore')) return true
                          // Ignore elements that are hidden in print
                          if (element.classList.contains('print:hidden')) return true
                          return false
                        },
                        onclone: (clonedDoc: Document) => {
                          // Double safety: find any print:hidden elements in the clone and remove them
                          const printHidden = clonedDoc.querySelectorAll('.print\\:hidden')
                          printHidden.forEach((el: Element) => {
                            if (el.parentNode) el.parentNode.removeChild(el)
                          })
                          // Also remove the specific button container if strictly needed
                          const ignoreEls = clonedDoc.querySelectorAll('[data-html2canvas-ignore="true"]')
                          ignoreEls.forEach((el: Element) => {
                            if (el.parentNode) el.parentNode.removeChild(el)
                          })
                        }
                      }).then((canvas: HTMLCanvasElement) => {
                        const imgData = canvas.toDataURL('image/png')
                        const link = document.createElement('a')
                        link.download = docTitle
                          ? `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
                          : `worksheet_${doc || 'download'}.png`
                        link.href = imgData
                        link.click()
                        setIsDownloadingPNG(false)
                      }).catch((error: unknown) => {
                        console.error('PNG capture failed:', error)
                        setIsDownloadingPNG(false)
                      })
                    }).catch((error: unknown) => {
                      console.error('Failed to load html2canvas:', error)
                      setIsDownloadingPNG(false)
                    })
                  }, 50)
                }}
                disabled={isDownloadingPNG}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 print:hidden ${isDownloadingPNG ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isDownloadingPNG ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12 a 8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291 a 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>{String.fromCodePoint(0x2B07)}</span>
                    <span>Download Worksheet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {!isPreview && (
          <header className="relative mb-6 flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
            {/* Header Title */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{docTitle}</h1>
              <p className="text-slate-600 mt-2 print:mt-1 text-sm">{t('pages.printables.printInstructions')}</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={pinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden print:hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-sm"
                title={t('pages.printables.pinThisPrintable')}
                aria-label={t('pages.printables.pinThisPrintableAria')}
              >
                <span>{String.fromCodePoint(0x279C)}</span>
                <span>{t('pages.printables.pinThis')}</span>
              </a>

              {shouldShowAnswerToggle && (
                <div className="print:hidden">
                  <button
                    onClick={(e: MouseEvent) => {
                      const newValue = !showAnswers
                      setShowAnswers(newValue)
                      trackAnswerKeyToggle(primaryDoc, newValue ? 'show' : 'hide')
                    }}
                    aria-pressed={showAnswers}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 ${showAnswers ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'}`}
                    title={t('pages.printables.toggleAnswerKey')}
                  >
                    {showAnswers ? t('pages.printables.hideAnswers') : t('pages.printables.showAnswers')}
                  </button>
                </div>
              )}
              <div className="print:block">
                <WizqoLogo className="w-20 h-auto opacity-80" />
              </div>
            </div>
          </header>
        )}

        {/* Doc-specific sections (unique content per topic) */}
        <div key={`interactive-${interactiveDocs.join('-')}-${language}-${effectiveSeed}`}>
          {interactiveDocs.length > 0 && (
            <InteractiveBundleSections
              docIds={interactiveDocs}
              seed={effectiveSeed}
              variant={variant}
              showAnswers={showAnswers}
              teacherName={teacherName}
              className={className}
              studentNames={studentNames}
              isPrintMode={true}
            />
          )}
        </div>
        <MathRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
          language={language}
        />
        <LanguageRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
        />
        <EarlyLearnerRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
        />
        <HolidayRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
        />
        <GeographyWorksheets
          docId="geo-compass-rose"
          commonProps={{
            activeDocs,
            showAnswers,
            docTitle,
            effectiveSeed,
            variant,
            showAnswersForDoc,
            t,
            getTrans
          }}
        />
        <GeographyWorksheets
          docId="geo-landforms"
          commonProps={{
            activeDocs,
            showAnswers,
            docTitle,
            effectiveSeed,
            variant,
            showAnswersForDoc,
            t,
            getTrans
          }}
        />

        <GeographyWorksheets
          docId="geo-latlong"
          commonProps={{
            activeDocs,
            showAnswers,
            docTitle,
            effectiveSeed,
            variant,
            showAnswersForDoc,
            t,
            getTrans
          }}
        />

        <MathMazeWorksheets
          docId="math-maze"
          commonProps={{
            activeDocs,
            showAnswers,
            docTitle,
            effectiveSeed,
            variant,
            showAnswersForDoc,
            t,
            getTrans
          }}
        />

        <LogicWorksheets
          docId="logic-grid"
          commonProps={{
            activeDocs,
            showAnswers,
            docTitle,
            effectiveSeed,
            variant,
            showAnswersForDoc,
            t,
            getTrans
          }}
        />

        {/* Manual blocks replacing the previous loop to avoid duplication issues */}
        {activeDocs.includes('addition-subtraction-0-10') && (
          <MathWorksheets
            docId="addition-subtraction-0-10"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('number-tracing-1-10') && (
          <MathWorksheets
            docId="number-tracing-1-10"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('number-tracing-1-20') && (
          <MathWorksheets
            docId="number-tracing-1-20"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('place-value-hto') && (
          <MathWorksheets
            docId="place-value-hto"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('color-by-number') && (
          <MathWorksheets
            docId="color-by-number"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('money-coins-bills') && (
          <MathWorksheets
            docId="money-coins-bills"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('measurement-length') && (
          <MathWorksheets
            docId="measurement-length"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('bar-graphs-data') && (
          <MathWorksheets
            docId="bar-graphs-data"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}
        {activeDocs.includes('add-2digit-100') && (
          <MathWorksheets
            docId="add-2digit-100"
            commonProps={{
              activeDocs,
              showAnswers,
              docTitle,
              effectiveSeed,
              variant,
              showAnswersForDoc,
              t,
              getTrans,
              language
            }}
          />
        )}




        {activeDocs.includes('uppercase-lowercase-match') && (
          <WorksheetSectionWrapper
            docId="uppercase-lowercase-match"
            title="AaZz Upper/Lower Letter Match"
            emoji={String.fromCodePoint(0x1F520)}
            description="Draw lines from uppercase to lowercase. Say the sound for each match."
            problemCount={26}
            learningObjectives={[
              'Match uppercase and lowercase letters',
              'Recognize letter pairs',
              'Practice letter sounds'
            ]}
            parentTeacherTips={[
              'Uppercase letters are big (A, B, C), lowercase are small (a, b, c)',
              'Say the letter sound as you match',
              'Help students see that uppercase and lowercase are the same letter',
              'Extension: Practice writing both uppercase and lowercase'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2">
                <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                <span>Example - Let's solve this together:</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="font-semibold text-base text-indigo-900"><strong>Problem:</strong> Match uppercase "A" to lowercase "a"</div>
                {/* Visual example */}
                <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                  <svg viewBox="0 0 400 140" className="w-full h-auto">
                    {/* Uppercase A */}
                    <circle cx="60" cy="50" r="4" fill="#ef4444" />
                    <line x1="60" y1="50" x2="100" y2="50" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <line x1="100" y1="50" x2="95" y2="45" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <line x1="100" y1="50" x2="95" y2="55" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <text x="80" y="80" fontSize="64" fill="#6366f1" fontWeight="bold">A</text>
                    <circle cx="100" cy="100" r="6" fill="#94a3b8" />
                    {/* Connecting line */}
                    <path d="M 100 100 Q 200 60 300 100" stroke="#6366f1" strokeWidth="3" strokeDasharray="5 5" fill="none" />
                    {/* Lowercase a */}
                    <circle cx="340" cy="50" r="4" fill="#ef4444" />
                    <line x1="340" y1="50" x2="300" y2="50" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <line x1="300" y1="50" x2="305" y2="45" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <line x1="300" y1="50" x2="305" y2="55" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <text x="320" y="80" fontSize="64" fill="#8b5cf6" fontWeight="bold">a</text>
                    <circle cx="300" cy="100" r="6" fill="#94a3b8" />
                    <text x="200" y="120" fontSize="16" fill="#6366f1" textAnchor="middle" fontWeight="bold">{String.fromCodePoint(0x279C)}</text>
                  </svg>
                </div>
                <div className="pl-4 border-l-2 border-indigo-300 space-y-1">
                  <div><strong>{t('common.step1')}</strong> {t('worksheets.readingAlphabet.example.step1Text', 'Find uppercase')} <span className="text-indigo-700 font-bold text-lg">"A"</span> {t('worksheets.readingAlphabet.example.step1Text2', '(big letter)')}</div>
                  <div><strong>Step 2:</strong> Find lowercase <span className="text-purple-700 font-bold text-lg">"a"</span> (small letter)</div>
                  <div><strong>Step 3:</strong> Draw a line connecting them</div>
                  <div><strong>Step 4:</strong> Say <span className="text-indigo-700 font-bold">"A"</span> sound as you match</div>
                  <div className="font-semibold text-indigo-900 mt-2"><strong>Answer:</strong> <span className="text-indigo-700">A</span> matches <span className="text-purple-700">a</span></div>
                  <div className="text-xs text-indigo-700 mt-2 flex items-center gap-1">
                    <span>{String.fromCodePoint(0x279C)}</span>
                    <span>Tip: Uppercase and lowercase are the same letter, just different sizes!</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
              {[['A', 'a'], ['B', 'b'], ['C', 'c'], ['D', 'd'], ['E', 'e'], ['F', 'f'], ['G', 'g'], ['H', 'h'], ['I', 'i'], ['J', 'j'], ['K', 'k'], ['L', 'l'], ['M', 'm']].map(([U, l]) => (
                <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <circle cx="48" cy="40" r="4" fill="#ef4444" />
                  <line x1="48" y1="40" x2="70" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                  <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                  <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                  <circle cx="330" cy="40" r="4" fill="#ef4444" />
                  <line x1="330" y1="40" x2="308" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                </svg>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['N', 'n'], ['O', 'o'], ['P', 'p'], ['Q', 'q'], ['R', 'r'], ['S', 's'], ['T', 't'], ['U', 'u'], ['V', 'v'], ['W', 'w'], ['X', 'x'], ['Y', 'y'], ['Z', 'z']].map(([U, l]) => (
                <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <circle cx="48" cy="40" r="4" fill="#ef4444" />
                  <line x1="48" y1="40" x2="70" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="70" y1="40" x2="64" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                  <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                  <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                  <circle cx="330" cy="40" r="4" fill="#ef4444" />
                  <line x1="330" y1="40" x2="308" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="308" y1="40" x2="314" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                </svg>
              ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Write your own uppercase and lowercase letter pairs</div>
                <div>2. Can you name all 26 letters in order?</div>
                <div>3. Practice writing both uppercase and lowercase</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I can match uppercase and lowercase letters</div>
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I can say letter sounds</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 26
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('uppercase-lowercase-match', () => {
              const letters = [['A', 'a'], ['B', 'b'], ['C', 'c'], ['D', 'd'], ['E', 'e'], ['F', 'f'], ['G', 'g'], ['H', 'h'], ['I', 'i'], ['J', 'j'], ['K', 'k'], ['L', 'l'], ['M', 'm'], ['N', 'n'], ['O', 'o'], ['P', 'p'], ['Q', 'q'], ['R', 'r'], ['S', 's'], ['T', 't'], ['U', 'u'], ['V', 'v'], ['W', 'w'], ['X', 'x'], ['Y', 'y'], ['Z', 'z']];
              return (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="space-y-1 text-sm text-emerald-800">
                    {letters.map(([U, l], i) => (
                      <div key={i}>{String.fromCodePoint(0x2705)}<strong>{l}</strong></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('beginning-sounds-az') && (
          <WorksheetSectionWrapper
            docId="beginning-sounds-az"
            title="Beginning Sounds (AZ)"
            emoji={String.fromCodePoint(0x1F524)}
            description="Circle pictures that begin with each letter. Say the sound out loud (e.g., A as in apple)."
            problemCount={26}
            learningObjectives={[
              'Identify beginning sounds of words',
              'Match letters to their sounds',
              'Recognize letter-sound relationships'
            ]}
            parentTeacherTips={[
              'Say the sound, not the letter name (A says /a/ as in apple)',
              'Help students listen for the first sound in each word',
              'Encourage students to say the sound out loud',
              'Extension: Find objects around you that start with each letter'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2">
                <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                <span>Example - Let's solve this together:</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="font-semibold text-base text-indigo-900"><strong>Problem:</strong> Circle the picture that begins with <span className="text-3xl text-indigo-700">"A"</span></div>
                {/* Visual example with pictures */}
                <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🍎</div>
                      <div className="text-xs font-semibold text-indigo-700">apple</div>
                      <div className="mt-2 w-16 h-16 rounded-full border-4 border-green-500 mx-auto flex items-center justify-center">
                        <span className="text-2xl">A</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl mb-2">✈️</div>
                      <div className="text-xs font-semibold text-indigo-700">airplane</div>
                      <div className="mt-2 w-16 h-16 rounded-full border-4 border-green-500 mx-auto flex items-center justify-center">
                        <span className="text-2xl">A</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl mb-2">🦋</div>
                      <div className="text-xs font-semibold text-slate-500">butterfly</div>
                      <div className="mt-2 w-16 h-16 rounded-full border-4 border-slate-300 mx-auto flex items-center justify-center">
                        <span className="text-xl text-slate-400">{String.fromCodePoint(0x270F)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-indigo-900 font-semibold">{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="pl-4 border-l-2 border-indigo-300 space-y-1">
                  <div><strong>Step 1:</strong> Say the sound: <span className="text-indigo-700 font-bold">/a/</span> (like in apple)</div>
                  <div><strong>Step 2:</strong> Look at the pictures.</div>
                  <div><strong>Step 3:</strong> Which one starts with /a/? <span className="text-green-600 font-bold">Apple and airplane both start with /a/!</span></div>
                  <div><strong>Step 4:</strong> Circle the pictures that begin with /a/</div>
                  <div className="font-semibold text-indigo-900 mt-2"><strong>Answer:</strong> Circle 🍎 and ✈️</div>
                  <div className="text-xs text-indigo-700 mt-2 flex items-center gap-1">
                    <span>{String.fromCodePoint(0x1F4A1)}</span>
                    <span>Tip: Say the sound, not the letter name! A says /a/ as in apple!</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
              {(() => {
                const rows: Array<[string, string, string, string]> = [
                  ['A', '🍎', '🐜', '⚓'], ['B', '🐻', '💣', '🐝'], ['C', '🐱', '🚗', '🍰'], ['D', '🐶', '🎲', '🍩'],
                  ['E', '🥚', '🐘', '🦅'], ['F', '🐟', '🦊', '🍟'], ['G', '🍇', '🎁', '🎸'], ['H', '🏠', '👒', '🐹'],
                  ['I', '🧊', '🍦', '🦎'], ['J', '🏺', '👖', '🚁'], ['K', '🪁', '🔑', '🦘'], ['L', '🦁', '🍋', '🪵'],
                  ['M', '🌙', '🐵', '🖱️'], ['N', '🥜', '🥅', '🥡'], ['O', '🐙', '🦉', '🍊'], ['P', '🐷', '🍕', '✏️'],
                  ['Q', '👑', '❓', '🦆'], ['R', '🐰', '💍', '🤖'], ['S', '☀️', '🐍', '⭐'], ['T', '🐢', '🎪', '🐅'],
                  ['U', '☂️', '🆙', '🦄'], ['V', '🎻', '🌋', '🚐'], ['W', '🐋', '🍉', '⌚'], ['X', '📦', '🦊', '🧹'],
                  ['Y', '🧶', '⛵', '🍠'], ['Z', '🦓', '🤐', '⚡'],
                ]
                return rows.map(([L, a, b, c]) => (
                  <svg key={L} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                    <text x="40" y="60" fontSize="40" fill="#111827">{L}</text>
                    <text x="140" y="60" fontSize="36">{a}</text>
                    <text x="200" y="60" fontSize="36">{b}</text>
                    <text x="260" y="60" fontSize="36">{c}</text>
                    <rect x="130" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                    <rect x="190" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                    <rect x="250" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                  </svg>
                ))
              })()}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Find objects around you that start with each letter</div>
                <div>2. Can you think of 3 words that start with each letter?</div>
                <div>3. Practice saying the sound for each letter</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I can identify beginning sounds</div>
                <div>{String.fromCharCode(0x2610)} I can match letters to their sounds</div>
                <div>{String.fromCharCode(0x2610)} I understand letter-sound relationships</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 26
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('beginning-sounds-az', () => {
              const answers: Record<string, string[]> = {
                'A': ['🍎', '🐜', '⚓'], 'B': ['🐻', '💣', '🐝'], 'C': ['🐱', '🚗', '🍰'], 'D': ['🐶', '🎲', '🍩'],
                'E': ['🥚', '🐘', '🦅'], 'F': ['🐟', '🦊', '🍟'], 'G': ['🍇', '🎁', '🎸'], 'H': ['🏠', '👒', '🐹'],
                'I': ['🧊', '🍦', '🦎'], 'J': ['🏺', '👖', '🚁'], 'K': ['🪁', '🔑', '🦘'], 'L': ['🦁', '🍋', '🪵'],
                'M': ['🌙', '🐵', '🖱️'], 'N': ['🥜', '🥅', '🥡'], 'O': ['🐙', '🦉', '🍊'], 'P': ['🐷', '🍕', '✏️'],
                'Q': ['👑', '❓', '🦆'], 'R': ['🐰', '💍', '🤖'], 'S': ['☀️', '🐍', '⭐'], 'T': ['🐢', '🎪', '🐅'],
                'U': ['☂️', '🆙', '🦄'], 'V': ['🎻', '🌋', '🚐'], 'W': ['🐋', '🍉', '⌚'], 'X': ['📦', '🦊', '🧹'],
                'Y': ['🧶', '⛵', '🍠'], 'Z': ['🦓', '🤐', '⚡']
              };
              return (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="space-y-1 text-sm text-emerald-800">
                    {Object.entries(answers).map(([letter, emojis]) => (
                      <div key={letter}>{letter}: Circle <strong>{emojis.join(', ')}</strong></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </WorksheetSectionWrapper>
        )}



        {
          activeDocs.includes('ten-frames-1-10') && (() => {
            return (
              <TenFrames1To10
                docId="ten-frames-1-10"
                activeDocs={activeDocs}
                showAnswersForDoc={showAnswersForDoc}
                seed={effectiveSeed}
                variant={variant}
              />
            )
          })()
        }



        {(activeDocs.includes('skip-count-5-10-120') || activeDocs.includes('skip-counting-by-5s-and-10s-to-120')) && (
          <SkipCounting5To120
            showAnswersForDoc={showAnswersForDoc}
            seed={effectiveSeed}
            variant={variant}
          />
        )}



        {activeDocs.includes('sub-2digit-100') && (
          <Sub2Digit100 seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {activeDocs.includes('word-problems-100') && (
          <WordProblems100 docId="word-problems-100" showAnswersForDoc={showAnswersForDoc} />
        )}

        {activeDocs.includes('compare-2digit') && (
          <Compare2Digit
            showAnswersForDoc={showAnswersForDoc}
            seed={effectiveSeed}
            variant={variant}
          />
        )}

        {activeDocs.includes('even-odd-100') && (
          <EvenOdd100
            showAnswersForDoc={showAnswersForDoc}
            seed={effectiveSeed}
            variant={variant}
          />
        )}

        {activeDocs.includes('cvc-words') && (
          <CVCWords docId="cvc-words" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('rhyming-words') && (
          <RhymingWords docId="rhyming-words" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('sight-words-pre-primer') && (
          <SightWordsPrePrimer docId="sight-words-pre-primer" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('letter-tracing-az') && (
          <LetterTracingAZ docId="letter-tracing-az" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('sentence-building') && (
          <SentenceBuilding docId="sentence-building" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('story-elements') && (
          <Time5Min
            showAnswersForDoc={showAnswersForDoc}
            seed={effectiveSeed}
            variant={variant}
          />
        )}

        {activeDocs.includes('ten-frames-1-20') && (() => {
          const numbers = Array.from({ length: 20 }, (_, n) => n + 1);
          return (
            <WorksheetSectionWrapper
              docId="ten-frames-1-20"
              title="Ten Frames 120"
              emoji={String.fromCodePoint(0x1F51F)}
              description="Color the circles to match each number. Say how many are filled and how many are empty."
              problemCount={numbers.length}
              learningObjectives={[
                'Recognize numbers 120',
                'Understand number quantity using ten frames',
                'Count and represent numbers visually',
                'Build number sense and subitizing skills'
              ]}
              parentTeacherTips={[
                'Ten frames help children see numbers as groups of 10',
                'Encourage counting aloud while coloring',
                'Ask: "How many filled? How many empty?"',
                'For numbers 1120, use two ten frames (one full, one partial)',
                'Extension: Practice addition and subtraction using ten frames'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 animate-gradient-x mb-2" />
              {/* Worked Example */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-base"><strong>Number:</strong> 7</div>
                  <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                    <div><strong>Step 1:</strong> Look at the number: 7</div>
                    <div><strong>Step 2:</strong> Color 7 circles in the ten frame</div>
                    <div><strong>Step 3:</strong> Count: 7 filled, 3 empty</div>
                    <div className="font-semibold text-blue-900"><strong>Answer:</strong> Color 7 circles. Say "7 filled, 3 empty"</div>
                    <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {numbers.map((n) => (
                  <div key={n} className="break-inside-avoid">
                    <svg viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                      <text x="40" y="50" fontSize="36" fill="#111827">{n}</text>
                      <g transform="translate(120,60)">
                        {Array.from({ length: 10 }).map((__, i) => (
                          <rect key={i} x={(i % 5) * 40} y={Math.floor(i / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                        ))}
                      </g>
                      {n > 10 && (
                        <g transform="translate(120,120)">
                          {Array.from({ length: 10 }).map((__, i) => (
                            <rect key={i} x={(i % 5) * 40} y={Math.floor(i / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                          ))}
                        </g>
                      )}
                    </svg>
                  </div>
                ))}
              </div>
              {/* Extension/Challenge Problems */}
              <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                  <div>1. Can you show 15 using ten frames? Color it!</div>
                  <div>2. How many ways can you make 10? (5+5, 6+4, 7+3...)</div>
                  <div>3. Draw your own ten frame and show the number 12</div>
                </div>
              </div>
              {/* Self-Assessment */}
              <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                  <div>{String.fromCodePoint(0x270F)}</div>
                  <div>{String.fromCharCode(0x2610)} I can show numbers using ten frames</div>
                  <div>{String.fromCharCode(0x2610)} I can count filled and empty spaces</div>
                </div>
                <div className="mt-3 text-xs">
                  <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {numbers.length}
                </div>
                <div className="mt-2 text-xs">
                  <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
              </div>
              {showAnswersForDoc('ten-frames-1-20', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="space-y-2 text-sm text-emerald-800">
                    {numbers.map((n, i) => {
                      const filled = n <= 10 ? n : 10;
                      const empty = n <= 10 ? 10 - n : 0;
                      const secondFilled = n > 10 ? n - 10 : 0;
                      const secondEmpty = n > 10 ? 10 - (n - 10) : 0;
                      return (
                        <div key={i}>
                          {i + 1}. <strong>{n}:</strong> {n <= 10
                            ? `${filled} filled, ${empty} empty (in one ten frame)`
                            : `First ten frame: 10 filled. Second ten frame: ${secondFilled} filled, ${secondEmpty} empty`}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-emerald-700 mt-3">
                    Remember: For numbers 110, use one ten frame. For numbers 1120, fill the first ten frame completely (10) and use the second ten frame for the remaining amount!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

        {activeDocs.includes('shapes-colors-sort') && (
          <WorksheetSectionWrapper
            docId="shapes-colors-sort"
            title="Shape Safari: Jungle Feeding Time"
            emoji={String.fromCodePoint(0x1F3A8)}
            description="Cut out the Shape Treats and feed them to the right Animal! Match the colors."
            problemCount={6}
            learningObjectives={[
              'Identify and name basic shapes (circle, rectangle, triangle)',
              'Recognize and match colors (blue, red, green)',
              'Practice fine motor skills (cutting and gluing)',
              'Sort objects by color attribute'
            ]}
            parentTeacherTips={[
              'Supervise scissor use for safety',
              'Encourage naming shapes and colors while sorting',
              'Ask: "What does the Lion like to eat? (Red shapes!)"',
              'Extension: Sort by shape instead of color, or by both attributes',
              'Practice cutting on the lines for fine motor development'
            ]}
          >
            {/* Themed Header / Decoration */}
            <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-gradient-to-b from-green-100 to-emerald-50 rounded-lg flex items-center justify-center">
              <div className="text-4xl animate-bounce-slow flex gap-4">
                <span>{String.fromCodePoint(0x1F33F)}</span><span>{String.fromCodePoint(0x1F33F)}</span><span>{String.fromCodePoint(0x1F33F)}</span>
              </div>
            </div>

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg print:border print:bg-white flex gap-4 items-center">
              <div className="text-3xl">{String.fromCodePoint(0x1F9ED)}</div>
              <div className="text-sm text-orange-900">
                <strong>How to Play:</strong>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>Cut out the shapes at the bottom.</li>
                  <li>Look at the color (Red, Blue, Green).</li>
                  <li>Glue the "treat" into the matching Animal's Cage!</li>
                </ol>
              </div>
            </div>

            {/* Main Activity Area */}
            <div className="flex flex-col gap-8 h-full">

              {/* CAGES (Top Half) */}
              <div className="grid grid-cols-3 gap-4">
                {/* Lion's Den (Red) */}
                <div className="flex flex-col h-64 border-4 border-red-400 border-dashed rounded-xl bg-red-50 relative overflow-hidden">
                  <div className="absolute top-2 left-0 w-full text-center font-bold text-red-700 uppercase tracking-widest bg-red-100 py-1 border-b border-red-200">Lion's Den</div>
                  <div className="flex-1 flex items-center justify-center mt-8">
                    <span className="text-6xl opacity-20 grayscale-0 filter hue-rotate-0">{String.fromCodePoint(0x1F981)}</span>
                  </div>
                  <div className="absolute bottom-2 w-full text-center text-xs text-red-500 font-bold">RED TREATS ONLY</div>
                </div>

                {/* Hippo's Pool (Blue) */}
                <div className="flex flex-col h-64 border-4 border-blue-400 border-dashed rounded-xl bg-blue-50 relative overflow-hidden">
                  <div className="absolute top-2 left-0 w-full text-center font-bold text-blue-700 uppercase tracking-widest bg-blue-100 py-1 border-b border-blue-200">Hippo's Pool</div>
                  <div className="flex-1 flex items-center justify-center mt-8">
                    <span className="text-6xl opacity-20 grayscale-0">{String.fromCodePoint(0x1F99B)}</span>
                  </div>
                  <div className="absolute bottom-2 w-full text-center text-xs text-blue-500 font-bold">BLUE TREATS ONLY</div>
                </div>

                {/* Croc's Swamp (Green) */}
                <div className="flex flex-col h-64 border-4 border-emerald-400 border-dashed rounded-xl bg-emerald-50 relative overflow-hidden">
                  <div className="absolute top-2 left-0 w-full text-center font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 py-1 border-b border-emerald-200">Croc's Swamp</div>
                  <div className="flex-1 flex items-center justify-center mt-8">
                    <span className="text-6xl opacity-20 grayscale-0">{String.fromCodePoint(0x1F40A)}</span>
                  </div>
                  <div className="absolute bottom-2 w-full text-center text-xs text-emerald-500 font-bold">GREEN TREATS ONLY</div>
                </div>
              </div>

              {/* CUTOUT STRIP (Bottom Half) */}
              <div className="mt-8 border-t-4 border-slate-300 border-dashed pt-8 page-break-inside-avoid">
                <div className="flex items-center gap-2 mb-6 text-slate-500 uppercase tracking-widest text-sm font-bold justify-center">
                  <span className="text-xl">{String.fromCodePoint(0x2702)}</span> Cut out these treats
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Blue Circle */}
                  <div className="h-28 border-2 border-slate-300 border-dashed rounded bg-white flex items-center justify-center relative p-2">
                    <div className="w-16 h-16 rounded-full bg-blue-500 shadow-sm border-2 border-blue-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">Circle</span>
                    </div>
                  </div>
                  {/* Red Triangle */}
                  <div className="h-28 border-2 border-slate-300 border-dashed rounded bg-white flex items-center justify-center relative p-2">
                    <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[60px] border-b-red-500 drop-shadow-sm flex items-center justify-center mb-2">
                    </div>
                    <span className="absolute bottom-2 text-red-700 text-[10px] font-bold">Triangle</span>
                  </div>
                  {/* Green Rect */}
                  <div className="h-28 border-2 border-slate-300 border-dashed rounded bg-white flex items-center justify-center relative p-2">
                    <div className="w-20 h-14 bg-emerald-500 shadow-sm border-2 border-emerald-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">Rect</span>
                    </div>
                  </div>

                  {/* Blue Rect */}
                  <div className="h-28 border-2 border-slate-300 border-dashed rounded bg-white flex items-center justify-center relative p-2">
                    <div className="w-20 h-14 bg-blue-500 shadow-sm border-2 border-blue-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">Rect</span>
                    </div>
                  </div>

                  {/* Red Circle */}
                  <div className="h-28 border-2 border-slate-300 border-dashed rounded bg-white flex items-center justify-center relative p-2">
                    <div className="w-16 h-16 rounded-full bg-red-500 shadow-sm border-2 border-red-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">Circle</span>
                    </div>
                  </div>

                  {/* Green Triangle */}
                  <div className="h-28 border-2 border-slate-300 border-dashed rounded bg-white flex items-center justify-center relative p-2">
                    <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[60px] border-b-emerald-500 drop-shadow-sm flex items-center justify-center mb-2">
                    </div>
                    <span className="absolute bottom-2 text-emerald-700 text-[10px] font-bold">Triangle</span>
                  </div>
                </div>
              </div>

            </div>

            {showAnswersForDoc('shapes-colors-sort', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-2 text-base">{String.fromCharCode(0x2705)} Answer Key</div>
                <div className="text-sm text-emerald-800 space-y-1">
                  <div>{String.fromCodePoint(0x2705)}<strong>Lion (Red Cage):</strong> Red Triangle, Red Circle</div>
                  <div>{String.fromCodePoint(0x2705)}<strong>Hippo (Blue Cage):</strong> Blue Circle, Blue Rectangle</div>
                  <div>{String.fromCodePoint(0x279C)}<strong>Croc (Green Cage):</strong> Green Rectangle, Green Triangle</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}



        {activeDocs.includes('tangram-animals') && (
          <WorksheetSectionWrapper
            docId="tangram-animals"
            title="Tangram Animals (Cutouts)"
            emoji={String.fromCodePoint(0x1F43E)}
            description="Cut the shapes and arrange to make animal silhouettes. Glue the final shape on a clean sheet."
            problemCount={5}
            learningObjectives={[
              'Identify and name geometric shapes',
              'Practice spatial reasoning and problem-solving',
              'Develop fine motor skills (cutting and arranging)',
              'Understand how shapes can be combined to create new shapes'
            ]}
            parentTeacherTips={[
              'Supervise scissor use for safety',
              'Encourage children to try different arrangements',
              'Ask: "What animal does this look like?"',
              'Extension: Create your own tangram animals or objects',
              'Practice spatial thinking by rotating and flipping shapes'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Task:</strong> Make a cat using tangram pieces</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Cut out all the tangram shapes carefully</div>
                  <div><strong>Step 2:</strong> Try arranging the shapes to make a cat shape</div>
                  <div><strong>Step 3:</strong> When you're happy with your animal, glue it on a clean sheet</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> There are many ways to arrange the shapes - be creative!</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
                <g fill="none" stroke="#111827" strokeWidth="3.5">
                  <polygon points="100,50 200,50 200,150 100,150" />
                  <polygon points="220,50 270,100 220,150 170,100" />
                  <polygon points="300,50 350,50 350,150 300,150" />
                  <polygon points="380,50 430,100 380,150 330,100" />
                  <polygon points="460,50 560,50 560,150 460,150" />
                </g>
              </svg>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you make a different animal using the same shapes?</div>
                <div>2. Try making a house, a tree, or a person with the tangram pieces</div>
                <div>3. Draw your tangram creation and label the shapes you used</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I can identify the tangram shapes</div>
                <div>{String.fromCharCode(0x2610)} I can arrange shapes to make animals</div>
                <div>{String.fromCharCode(0x2610)} I can cut and glue carefully</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 5
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('tangram-animals', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="space-y-2 text-sm text-emerald-800">
                  <div>Tangram puzzles have many solutions! The goal is to use all 7 pieces to create different shapes.</div>
                  <div className="mt-2">Common animals you can make: cat, rabbit, bird, fish, horse, and more!</div>
                  <div className="text-xs text-emerald-700 mt-2">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {/* Coloring Worksheets (Generic Handler) */}
        {activeDocs.filter(doc => doc.startsWith('coloring')).map(docId => (
          <ColoringWorksheet
            key={docId}
            docId={docId}
            showAnswersForDoc={showAnswersForDoc}
            seed={effectiveSeed}
            variant={variant}
          />
        ))}

        {activeDocs.includes('spot-difference') && (
          <SpotDifferenceWorksheet
            docId="spot-difference"
            showAnswersForDoc={showAnswersForDoc}
            seed={effectiveSeed}
            variant={variant}
          />
        )}

        {activeDocs.includes('directed-drawing-animals') && (
          <WorksheetSectionWrapper
            docId="directed-drawing-animals"
            title="Directed Drawing: Animals"
            emoji={String.fromCodePoint(0x1F43E)}
            description="Follow each step to draw a fish silhouette using simple shapes. No face features (eyes, nose, mouth, ears)."
            problemCount={6}
            learningObjectives={[
              'Follow step-by-step drawing instructions',
              'Use simple shapes to create drawings',
              'Practice fine motor skills'
            ]}
            parentTeacherTips={[
              'Follow the steps in order',
              'Use simple shapes like circles and triangles',
              'Take your time with each step',
              'Extension: Create your own step-by-step drawing'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
            {/* Full-page, 6-step grid (2x3) with thick strokes for easy tracing */}
            <svg viewBox="0 0 900 1200" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                {/* Panel frames */}
                <rect x="50" y="60" width="360" height="300" rx="16" />
                <rect x="490" y="60" width="360" height="300" rx="16" />
                <rect x="50" y="420" width="360" height="300" rx="16" />
                <rect x="490" y="420" width="360" height="300" rx="16" />
                <rect x="50" y="780" width="360" height="300" rx="16" />
                <rect x="490" y="780" width="360" height="300" rx="16" />

                {/* Step numbers */}
                <text x="70" y="100" fontSize="28" fill="#111827">1</text>
                <text x="510" y="100" fontSize="28" fill="#111827">2</text>
                <text x="70" y="460" fontSize="28" fill="#111827">3</text>
                <text x="510" y="460" fontSize="28" fill="#111827">4</text>
                <text x="70" y="820" fontSize="28" fill="#111827">5</text>
                <text x="510" y="820" fontSize="28" fill="#111827">6</text>

                {/* Step 1 (panel 1): Body ellipse */}
                <ellipse cx="230" cy="210" rx="130" ry="70" />
                {/* Step 2 (panel 2): Add tail */}
                <ellipse cx="670" cy="210" rx="130" ry="70" />
                <polygon points="740,210 830,160 830,260" />
                {/* Step 3 (panel 3): Dorsal fin */}
                <ellipse cx="230" cy="570" rx="130" ry="70" />
                <polygon points="260,520 320,490 300,540" />
                <polygon points="740,210 830,160 830,260" opacity="0" />
                {/* Step 4 (panel 4): Ventral fin */}
                <ellipse cx="670" cy="570" rx="130" ry="70" />
                <polygon points="700,620 760,650 740,600" />
                <polygon points="740,570 830,520 830,620" opacity="0" />
                {/* Step 5 (panel 5): Side fin */}
                <ellipse cx="230" cy="930" rx="130" ry="70" />
                <polygon points="160,930 110,960 160,990" />
                {/* Step 6 (panel 6): Gentle stripes (no face) */}
                <ellipse cx="670" cy="930" rx="130" ry="70" />
                <path d="M600 900 C 640 880, 700 880, 740 900" />
                <path d="M590 930 C 640 915, 700 915, 750 930" />
                <path d="M610 960 C 650 980, 690 980, 730 960" />
              </g>
            </svg>
            {showAnswersForDoc('directed-drawing-animals', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  Follow the 6 steps in order: 1) Draw body ellipse, 2) Add tail, 3) Add dorsal fin, 4) Add ventral fin, 5) Add side fin, 6) Add gentle stripes. Your fish should look like the final step!
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('cut-and-paste-crafts') && (
          <WorksheetSectionWrapper
            docId="cut-and-paste-crafts"
            title="Cut-and-Paste Paper Crafts"
            emoji={String.fromCodePoint(0x2702)}
            description="Point to or color how you feel today."
            problemCount={1}
            learningObjectives={[
              'Identify and express feelings',
              'Understand emotional states',
              'Practice self-awareness'
            ]}
            parentTeacherTips={[
              'Help children identify their feelings',
              'All feelings are valid',
              'Use this as a conversation starter',
              'Extension: Talk about what makes you feel each way'
            ]}
          >
            <h2 className="text-lg font-bold text-slate-900">Cut-and-Paste Paper Crafts</h2>
            <p className="text-slate-600 text-sm mb-3">Cut the parts and glue them in place. Color when finished.</p>
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <rect x="80" y="60" width="80" height="80" />
                <circle cx="220" cy="100" r="40" />
                <polygon points="320,60 380,140 260,140" />
                <rect x="420" y="60" width="80" height="80" />
                <rect x="510" y="70" width="30" height="60" />
                <rect x="550" y="70" width="30" height="60" />
              </g>
            </svg>
            {showAnswersForDoc('cut-and-paste-crafts', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  Cut out the shapes and glue them together to create your craft. Be creative with colors!
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}



        {/* --- Missing Wire-ups --- */}
        {activeDocs.includes('div-facts-1-12') && (
          <DivisionFacts docId="div-facts-1-12" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('factors-multiples') && (
          <FactorsMultiples docId="factors-multiples" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('prime-composite') && (
          <PrimeComposite docId="prime-composite" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('gratitude-jar') && (
          <GratitudeJar docId="gratitude-jar" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('mood-tracker') && (
          <MoodTracker docId="mood-tracker" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('weekly-goals') && (
          <WeeklyGoals docId="weekly-goals" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('mandalas') && (
          <Mandalas docId="mandalas" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('feelings-checkin') && (
          <FeelingsCheckin docId="feelings-checkin" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {activeDocs.includes('halloween-pack') && (
          <HalloweenPack docId="halloween-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('winter-kindness') && (
          <WinterKindness docId="winter-kindness" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('brain-boost') && (
          <BrainBoost docId="brain-boost" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('creative-challenge') && (
          <CreativeChallenge docId="creative-challenge" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}


        {/* --- Missing Critical Worksheets Restoration --- */}
        {/* Math: Regrouping */}
        {activeDocs.includes('add-2digit-regrouping') && (
          <Add2DigitRegrouping docId="add-2digit-regrouping" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('sub-2digit-regrouping') && (
          <Sub2DigitRegrouping docId="sub-2digit-regrouping" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {/* Math: Fractions */}
        {activeDocs.includes('fractions-halves-thirds-fourths') && (
          <FractionsHalvesThirdsFourths docId="fractions-halves-thirds-fourths" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {/* Language: Rhyming */}
        {activeDocs.includes('rhyming-words') && (
          <RhymingWords docId="rhyming-words" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('cvc-words') && (
          <CVCWords docId="cvc-words" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('sentence-building') && (
          <SentenceBuilding docId="sentence-building" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('sight-words-pre-primer') && (
          <SightWordsPrePrimer docId="sight-words-pre-primer" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('fractions-halves-thirds-fourths') && (
          <FractionBasicID docId="fractions-halves-thirds-fourths" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('add-sub-fractions-unlike') && (
          <AddSubFractionsUnlike docId="add-sub-fractions-unlike" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('mixed-numbers-add-sub') && (
          <AddSubMixedNumbers docId="mixed-numbers-add-sub" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('fraction-mult') && (
          <MultiplyingFractions docId="fraction-mult" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('fraction-mult-whole') && (
          <MultiplyingFractionsWhole docId="fraction-mult-whole" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('div-fractions') && (
          <DividingFractions docId="div-fractions" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('letter-tracing-az') && (
          <LetterTracingAZ docId="letter-tracing-az" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {/* Math: First Grade */}
        {activeDocs.includes('more-less-equal-10') && (
          <MoreLessEqual10 docId="more-less-equal-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('counting-objects-20') && (
          <CountingObjects20 docId="counting-objects-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {/* Math: Second Grade */}
        {activeDocs.includes('expanded-form-200') && (
          <ExpandedForm200 docId="expanded-form-200" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('number-patterns-200') && (
          <NumberPatterns200 docId="number-patterns-200" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('rounding-nearest-10') && (
          <RoundingNearest10 docId="rounding-nearest-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('add-three-numbers') && (
          <AddThreeNumbers docId="add-three-numbers" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('missing-addends') && (
          <MissingAddends docId="missing-addends" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('fact-families-20') && (
          <FactFamilies20 docId="fact-families-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('mental-math-20') && (
          <MentalMath20 docId="mental-math-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('doubles-near-doubles') && (
          <DoublesNearDoubles docId="doubles-near-doubles" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('number-line-200') && (
          <NumberLine200 docId="number-line-200" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('money-coins-bills') && (
          <MoneyCoinsBills docId="money-coins-bills" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('measurement-length') && (
          <MeasurementLength docId="measurement-length" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('bar-graphs-data') && (
          <BarGraphsData docId="bar-graphs-data" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('add-2digit-100') && (
          <Add2Digit100 docId="add-2digit-100" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}


        {/* --- 1st Grade Worksheets Restoration --- */}
        {activeDocs.includes('ten-frames-1-10') && (
          <TenFrames1To10 docId="ten-frames-1-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('number-tracing-1-20') && (
          <NumberTracing1To20 showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('number-bonds-10') && (
          <NumberBonds10 docId="number-bonds-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('count-write-30') && (
          <CountWrite30 docId="count-write-30" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('missing-numbers-50') && (
          <MissingNumbers50FirstGrade docId="missing-numbers-50" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('addition-subtraction-0-10') && (
          <AdditionSubtraction0To10 showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('math-maze') && (
          <MathMazeWorksheets docId="math-maze" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('picture-addition-10') && (
          <PictureAddition10 docId="picture-addition-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('subtraction-stories') && (
          <SubtractionStories docId="subtraction-stories" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('balance-equations-10') && (
          <BalanceEquations docId="balance-equations-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('skip-count-2s') && (
          <SkipCountingWorksheet docId="skip-count-2s" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('number-line-add') && (
          <NumberLineAddition docId="number-line-add" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('doubles-facts') && (
          <DoublesFacts docId="doubles-facts" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('more-less-equal-10') && (
          <MoreLessEqual10 docId="more-less-equal-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('counting-objects-20') && (
          <CountingObjects20 docId="counting-objects-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('color-by-number') && (
          <ColorByNumberWorksheet docId="color-by-number" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('design-monster') && (
          <DesignMonsterWorksheet docId="design-monster" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('draw-half') && (
          <DrawHalfWorksheet docId="draw-half" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('dot-to-dot-1-20') && (
          <DotToDot1to20 docId="dot-to-dot-1-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('size-comparison') && (
          <ComparisonWorksheet docId="size-comparison" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('hidden-object') && (
          <HiddenObjectWorksheet docId="hidden-object" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('maze-focus') && (
          <MazeFocusWorksheet docId="maze-focus" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('bookmark-templates') && (
          <BookmarkTemplates docId="bookmark-templates" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {/* STEM & One-Pagers */}
        {activeDocs.includes('stem-balloon-rocket') && (
          <OnePagerWorksheet docId="stem-balloon-rocket" effectiveSeed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('stem-walking-water') && (
          <OnePagerWorksheet docId="stem-walking-water" effectiveSeed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('arts-3-shape-creature') && (
          <OnePagerWorksheet docId="arts-3-shape-creature" effectiveSeed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('reading-mini-1') && (
          <ReadingComprehension docId="reading-mini-1" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}

        {/* Word Search Handler (Generic) */}
        {activeDocs.some(d => ['word-search', 'ws-animals', 'ws-space', 'ws-sight-words', 'ws-world'].includes(d)) && (
          <WordSearch
            activeDocs={activeDocs}
            showAnswers={true}
            effectiveSeed={effectiveSeed}
            variant={String(variant)}
            packTime="free"
            packAge="k2"
            packSkill="brain"
            showAnswersForDoc={showAnswersForDoc}
          />
        )}


        {/* --- New & Restored Worksheets --- */}
        {activeDocs.includes('reward-chart') && (
          <RewardChart docId="reward-chart" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('spring-scavenger') && (
          <SpringScavenger docId="spring-scavenger" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('summer-pack') && (
          <SummerPack docId="summer-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}
        {activeDocs.includes('animal-pack') && (
          <AnimalPack docId="animal-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
        )}


        <ReadingComprehension
          docId="reading-mini-1"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g1-lost-hat"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g1-ants"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g1-bus-ride"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g1-pet-fish"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g2-paper-bridge"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g2-rainy-garden"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g2-library-card"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g2-lost-and-found"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g3-lighthouse"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g3-science-fair"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g3-community-garden"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />
        <ReadingComprehension
          docId="reading-g1-red-balloon"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g1-big-box"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g1-garden-snail"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g1-birthday-cake"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g2-bird-feeder"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g2-cookie-recipe"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g2-tree-house"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g2-magic-seeds"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g3-school-play"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />

        <ReadingComprehension
          docId="reading-g3-art-project"
          activeDocs={activeDocs}
          showAnswersForDoc={showAnswersForDoc}
          seed={effectiveSeed}
          variant={variant}
        />



        {/* --- Multiplication Worksheets --- */}

        {/* Basic Facts 0-12 */}
        {activeDocs.includes('mult-facts-0-12') && (
          <MultiplicationFacts
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId="mult-facts-0-12"
            range={[0, 12]}
          />
        )}

        {/* Basic Facts 1-5 */}
        {activeDocs.includes('mult-facts-1-5') && (
          <MultiplicationFacts
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId="mult-facts-1-5"
            range={[1, 5]}
          />
        )}

        {/* Basic Facts 6-12 */}
        {activeDocs.includes('mult-facts-6-12') && (
          <MultiplicationFacts
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId="mult-facts-6-12"
            range={[6, 12]}
          />
        )}

        {/* Arrays 2-5 */}
        {activeDocs.includes('mult-arrays-2-5') && (
          <MultiplicationArrays2To5
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
          />
        )}

        {/* Arrays Models */}
        {(activeDocs.includes('mult-arrays') || activeDocs.includes('mult-arrays-models')) && (
          <MultiplicationArraysModels
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
          />
        )}

        {/* Skip Counting to Multiply */}
        {activeDocs.includes('skip-count-mult') && (
          <SkipCountingMultiplication
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
          />
        )}

        {/* --- Times Table Worksheets --- */}

        {/* Horizontal Times Tables */}
        {activeDocs.some(d => ['mult-horizontal', 'mult-horizontal-1-5', 'mult-horizontal-6-12', 'times-table-horizontal-1-5', 'times-table-horizontal-6-12', 'times-table-horizontal-1-12'].includes(d)) && (
          <TimesTableHorizontal
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-horizontal') || d.startsWith('times-table-horizontal')) || 'times-table-horizontal-1-12'}
            range={(activeDocs.includes('mult-horizontal-1-5') || activeDocs.includes('times-table-horizontal-1-5')) ? [1, 5] : (activeDocs.includes('mult-horizontal-6-12') || activeDocs.includes('times-table-horizontal-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Vertical Times Tables */}
        {activeDocs.some(d => ['mult-vertical', 'mult-vertical-1-5', 'mult-vertical-6-12', 'times-table-vertical-1-5', 'times-table-vertical-6-12', 'times-table-vertical-1-12'].includes(d)) && (
          <TimesTableVertical
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-vertical') || d.startsWith('times-table-vertical')) || 'times-table-vertical-1-12'}
            range={(activeDocs.includes('mult-vertical-1-5') || activeDocs.includes('times-table-vertical-1-5')) ? [1, 5] : (activeDocs.includes('mult-vertical-6-12') || activeDocs.includes('times-table-vertical-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Missing Factors */}
        {activeDocs.some(d => ['mult-missing', 'mult-missing-1-5', 'mult-missing-6-12', 'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed'].includes(d)) && (
          <TimesTableMissing
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-missing') || d.startsWith('times-table-missing')) || 'times-table-missing-mixed'}
            range={(activeDocs.includes('mult-missing-1-5') || activeDocs.includes('times-table-missing-1-5')) ? [1, 5] : (activeDocs.includes('mult-missing-6-12') || activeDocs.includes('times-table-missing-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Timed Tests */}
        {activeDocs.some(d => ['mult-timed', 'times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12'].includes(d)) && (
          <MultiplicationTimed
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
          />
        )}

        {/* Blank Tables */}
        {activeDocs.some(d => ['mult-blank', 'mult-blank-1-5', 'mult-blank-6-12', 'mult-blank-1-12', 'times-table-blank-1-5', 'times-table-blank-6-12', 'times-table-blank-1-12'].includes(d)) && (
          <MultiplicationBlankTable
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-blank') || d.startsWith('times-table-blank')) || 'times-table-blank-1-12'}
            range={(activeDocs.includes('mult-blank-1-5') || activeDocs.includes('times-table-blank-1-5')) ? [1, 5] : (activeDocs.includes('mult-blank-6-12') || activeDocs.includes('times-table-blank-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Confidence Building */}
        {activeDocs.some(d => ['mult-confidence', 'mult-confidence-1-5', 'mult-confidence-6-12', 'times-table-confidence-1-5', 'times-table-confidence-6-12'].includes(d)) && (
          <MultiplicationConfidence
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-confidence') || d.startsWith('times-table-confidence')) || 'times-table-confidence-1-5'}
            range={(activeDocs.includes('mult-confidence-1-5') || activeDocs.includes('times-table-confidence-1-5')) ? [1, 5] : (activeDocs.includes('mult-confidence-6-12') || activeDocs.includes('times-table-confidence-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Fluency & Mixed Review */}
        {activeDocs.some(d => ['mult-fluency', 'mult-fluency-1-5', 'mult-fluency-6-12', 'times-table-mixed-review', 'times-table-fluency-1-12'].includes(d)) && (
          <MultiplicationFluency
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => ['times-table-mixed-review', 'times-table-fluency-1-12'].includes(d) || d.startsWith('mult-fluency')) || 'times-table-fluency-1-12'}
            range={(activeDocs.includes('mult-fluency-1-5') || activeDocs.includes('times-table-fluency-1-5')) ? [1, 5] : (activeDocs.includes('mult-fluency-6-12') || activeDocs.includes('times-table-fluency-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Color By Number */}
        {activeDocs.some(d => ['mult-color-by-number', 'mult-color-by-number-1-5', 'mult-color-by-number-6-12', 'times-table-color-1-5', 'times-table-color-6-12', 'times-table-color-1-12'].includes(d)) && (
          <MultiplicationColorByNumber
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-color-by-number') || d.startsWith('times-table-color')) || 'times-table-color-1-12'}
            range={(activeDocs.includes('mult-color-by-number-1-5') || activeDocs.includes('times-table-color-1-5')) ? [1, 5] : (activeDocs.includes('mult-color-by-number-6-12') || activeDocs.includes('times-table-color-6-12')) ? [6, 12] : [1, 12]}
          />
        )}

        {/* Partial Products */}
        {activeDocs.includes('partial-products') && (
          <PartialProducts
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
          />
        )}


        {/* Timed Tests */}
        {activeDocs.some(d => ['mult-timed', 'times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12'].includes(d)) && (
          <MultiplicationTimed
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => ['times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12'].includes(d)) || 'times-table-timed-1-12'}
            count={60}
            timeLimit={(activeDocs.includes('times-table-timed-6-12') || activeDocs.includes('times-table-timed-1-12')) ? "5 minutes" : "3 minutes"}
          />
        )}

        {/* Word Problems */}
        {activeDocs.some(d => d.startsWith('mult-word-problems') || d === 'mult-multi-step-word' || d === 'mult-complex-word') && (
          <MultiplicationWordProblems
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => d.startsWith('mult-word-problems') || d.startsWith('mult-multi') || d.startsWith('mult-complex')) || 'mult-word-problems'}
            difficulty={activeDocs.includes('mult-multi-step-word') ? 'multi-step' : activeDocs.includes('mult-complex-word') ? 'complex' : 'basic'}
          />
        )}

        {/* Fact Families */}
        {activeDocs.some(d => ['mult-fact-families', 'mult-fact-fluency', 'mult-mixed-review'].includes(d)) && (
          <MultiplicationFactFamilies
            seed={effectiveSeed}
            variant={variant}
            showAnswersForDoc={showAnswersForDoc}
            docId={activeDocs.find(d => ['mult-fact-families', 'mult-fact-fluency', 'mult-mixed-review'].includes(d)) || 'mult-fact-families'}
          />
        )}

        {/* Multi-Digit Multiplication (Vertical) */}
        {activeDocs.some(d => ['mult-2x1', 'mult-2x2', 'mult-3x1', 'mult-3x2', 'mult-2x1-digit', 'mult-2x2-digit', 'mult-3x1-digit', 'mult-3x2-digit'].includes(d)) && (() => {
          const docId = activeDocs.find(d => d.startsWith('mult-')) || 'mult-2x1';
          let top = 2, bottom = 1;
          if (docId.includes('2x2')) { top = 2; bottom = 2; }
          else if (docId.includes('3x1')) { top = 3; bottom = 1; }
          else if (docId.includes('3x2')) { top = 3; bottom = 2; }

          return (
            <MultiplicationVertical
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId={docId}
              digitsTop={top}
              digitsBottom={bottom}
            />
          )
        })()}





        {activeDocs.includes('spelling') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=spelling`)
          const gradeLevel = (parseInt(effectiveSeed.slice(-1), 16) % 3) + 1 // Grades 1-3

          // Vocabulary words by pattern
          const vocabWords = {
            cvc: ['cat', 'dog', 'pig', 'box', 'rug', 'bus', 'hat', 'web', 'pin', 'fox'],
            blends: ['frog', 'star', 'blue', 'drum', 'flag', 'crab', 'tree', 'swim', 'stop', 'plan'],
            silentE: ['cake', 'bike', 'rose', 'cube', 'kite', 'bone', 'game', 'home', 'time', 'nose'],
            longVowels: ['tree', 'rain', 'boat', 'blue', 'pie', 'leaf', 'road', 'moon', 'stay', 'fruit'],
            compound: ['cupcake', 'sunshine', 'rainbow', 'butterfly', 'starfish', 'popcorn', 'jellyfish', 'snowman', 'football', 'ladybug']
          }

          let selectedWords: string[] = []
          let patternTitle = ""

          // Select pattern based on randomness (or grade bias)
          const roll = Math.floor(rng() * 10)
          if (roll < 2) {
            selectedWords = shuffleArray(vocabWords.cvc, rng).slice(0, 5)
            patternTitle = "Short Vowels (CVC)"
          } else if (roll < 4) {
            selectedWords = shuffleArray(vocabWords.blends, rng).slice(0, 5)
            patternTitle = "Consonant Blends"
          } else if (roll < 6) {
            selectedWords = shuffleArray(vocabWords.silentE, rng).slice(0, 5)
            patternTitle = "Silent E"
          } else if (roll < 8) {
            selectedWords = shuffleArray(vocabWords.longVowels, rng).slice(0, 5)
            patternTitle = "Long Vowel Teams"
          } else {
            selectedWords = shuffleArray(vocabWords.compound, rng).slice(0, 5)
            patternTitle = "Compound Words"
          }

          return (
            <WorksheetSectionWrapper
              docId="spelling"
              title={`Spelling Challenge: ${patternTitle}`}
              emoji={String.fromCodePoint(0x270F)}
              description="Read, trace, and write the words. Then find them in the puzzle!"
              problemCount={selectedWords.length + 1}
              learningObjectives={[
                'Recognize common spelling patterns',
                'Practice spelling skills',
                'Develop word recognition'
              ]}
              parentTeacherTips={[
                'Look for common spelling patterns',
                'Say the words out loud',
                'Extension: Use these words in a sentence'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 animate-gradient-x mb-2" />

              {/* List A: Read, Trace, Write */}
              <div className="mb-8">
                <div className="grid grid-cols-4 gap-4 mb-2 font-bold text-slate-700 border-b-2 border-slate-300 pb-1">
                  <div className="text-center">Read</div>
                  <div className="text-center text-slate-400">Trace</div>
                  <div className="text-center text-slate-400">Write</div>
                  <div className="text-center text-slate-400">Write Again</div>
                </div>

                {selectedWords.map(word => (
                  <div key={word} className="grid grid-cols-4 gap-4 h-16 items-center border-b border-slate-200">
                    <div className="text-xl font-bold text-center tracking-wide">{word}</div>
                    <div className="text-xl font-bold text-center tracking-wide text-slate-300 font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{word}</div>
                    <div className="border-b border-slate-300 relative"></div>
                    <div className="border-b border-slate-300 relative"></div>
                  </div>
                ))}
              </div>

              {/* Word Scramble */}
              <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <h3 className="font-bold text-orange-900 mb-2">{String.fromCodePoint(0x1F520)} Unscramble the Words</h3>
                <div className="grid grid-cols-2 gap-4">
                  {shuffleArray([...selectedWords].slice(0, 4), rng).map(word => {
                    const scrambled = shuffleArray(word.split(''), rng).join('')
                    return (
                      <div key={word} className="flex gap-2 items-center">
                        <span className="font-mono text-lg tracking-widest uppercase bg-white px-2 py-1 rounded border border-orange-200">{scrambled}</span>
                        <span className="text-xl">{String.fromCodePoint(0x2192)}</span>
                        <div className="border-b-2 border-slate-400 w-32 h-8"></div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Answer Key */}
              {showAnswersForDoc('spelling', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)} Solution</div>
                  <div className="text-sm text-emerald-800">
                    <div className="mb-2"><strong>Words used:</strong> {selectedWords.join(', ')}</div>
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('science-match') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=science-match`);
          const pairs = [
            { question: "Mars is known as the red planet.", answer: "A dusty red world" },
            { question: "Whales are the largest mammals.", answer: "A huge ocean animal" },
            { question: "Lightning is a giant spark of electricity.", answer: "Shocking sky energy" },
            { question: "Penguins live in the Southern Hemisphere.", answer: "A cold-loving bird" },
            { question: "Clouds are made of tiny water droplets.", answer: "Weather water in the sky" },
            { question: "Earth orbits the Sun once a year.", answer: "Our home planet's trip" },
          ];

          // Shuffle questions (Left side)
          const shuffledQuestions = [...pairs].sort(() => rng() - 0.5);

          // Shuffle answers (Right side)
          const shuffledAnswers = [...pairs].sort(() => rng() - 0.5);

          return (
            <WorksheetSectionWrapper
              docId="science-match"
              title="Science Fun Facts Match"
              emoji={String.fromCodePoint(0x1F9EA)}
              description="Draw a line to match each fact with its pair."
              problemCount={6}
              learningObjectives={[
                'Learn science facts',
                'Match related concepts',
                'Understand scientific relationships'
              ]}
              parentTeacherTips={[
                'Read each fact carefully',
                'Look for key words that connect facts',
                'Help students understand the relationships',
                'Extension: Research more about these science topics'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />

              <div className="grid grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                <ol className="list-decimal list-inside space-y-4 text-sm">
                  {shuffledQuestions.map((q, i) => (
                    <li key={i} className="p-2 border border-blue-100 rounded bg-blue-50/50">{q.question}</li>
                  ))}
                </ol>
                <ul className="list-none space-y-4 text-sm">
                  {shuffledAnswers.map((a, i) => (
                    <li key={i} className="p-2 border border-slate-200 rounded flex gap-2">
                      <span className="font-bold text-blue-600">{String.fromCharCode(65 + i)})</span>
                      <span>{a.answer}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {showAnswersForDoc('science-match', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <div className="grid grid-cols-1 gap-1">
                    {shuffledQuestions.map((q, i) => {
                      const answerIndex = shuffledAnswers.findIndex(a => a.answer === q.answer);
                      const letter = String.fromCharCode(65 + answerIndex);
                      return <div key={i}>{i + 1}. {letter} ({q.answer})</div>
                    })}
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}
        <WorksheetFooter />
      </div>
    </div>
  )
}

function generateWordSearch(seed: string) {
  const rng = makeRng(seed)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]

  const themes = [
    { name: 'Space', words: ['STAR', 'MOON', 'SUN', 'PLANET', 'ORBIT', 'COMET'] },
    { name: 'Animals', words: ['LION', 'TIGER', 'BEAR', 'ZEBRA', 'WOLF', 'FOX'] },
    { name: 'Colors', words: ['RED', 'BLUE', 'GREEN', 'PINK', 'BLACK', 'WHITE'] },
    { name: 'School', words: ['BOOK', 'DESK', 'PEN', 'MATH', 'READ', 'WRITE'] },
    { name: 'World', words: ['MAP', 'GLOBE', 'LAND', 'OCEAN', 'CITY', 'FLAG'] },
  ]

  const theme = pick(themes)
  const size = 10
  const grid = Array(size).fill(null).map(() => Array(size).fill(''))
  const placedWords = []

  for (const word of theme.words) {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 50) {
      const dir = rng() > 0.5 ? 'H' : 'V' // Horizontal or Vertical only for simplicity
      const row = Math.floor(rng() * size)
      const col = Math.floor(rng() * size)

      if (dir === 'H') {
        if (col + word.length <= size) {
          let clear = true
          for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) clear = false
          }
          if (clear) {
            for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i]
            placed = true
            placedWords.push(word)
          }
        }
      } else {
        if (row + word.length <= size) {
          let clear = true
          for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) clear = false
          }
          if (clear) {
            for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i]
            placed = true
            placedWords.push(word)
          }
        }
      }
      attempts++
    }
  }

  // Fill empty
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = letters[Math.floor(rng() * letters.length)]
    }
  }

  return { theme: theme.name, grid, words: placedWords }
}




export default PrintablesPage
