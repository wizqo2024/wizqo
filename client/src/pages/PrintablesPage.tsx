import React from 'react'
const { Component, Fragment, useEffect, useRef, useMemo, useState, useCallback, useReducer, isValidElement, memo } = React
type ErrorInfo = React.ErrorInfo<any>
type ReactNode = React.ReactNode
type FC<P = {}> = React.FC<P>
type CSSProperties = React.CSSProperties
type ComponentType<P = {}> = React.ComponentType<P>
type MouseEvent<T = Element> = React.MouseEvent<T>
import { useTranslation } from '@/context/TranslationContext'
import { WizqoLogo } from '@/components/WizqoLogo'
import InteractiveBundleSections from '@/components/InteractiveBundleSections'
import { PRINTABLE_BUNDLE_SECTIONS, getPrintableSectionForDoc } from '@/data/printableBundles'
import { INTERACTIVE_CATEGORIES } from '@shared/interactive/interactiveWorksheets'
import { formatNumber } from '@/utils/numbers'
import { WorksheetFooter, ProblemBox, WorksheetHeader } from '@/components/worksheet'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './printables/PrintableShared'
// Local components defined below to avoid conflicts
import { makeRng, pick, pickNUnique, shuffleArray, buildWords } from '@/utils/printableUtils'
import { Sudoku } from '@/pages/worksheets/Sudoku'
import { WordSearch } from '@/pages/worksheets/WordSearch'
import { CVCWords, SightWordsPrePrimer, LetterTracingAZ } from './printables/LanguageWorksheets'
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
  MultiplicationDecimals
} from './printables/MultiplicationWorksheets'
import {
  EquivFractions4th,
  ComparingFractions4th,
  AddSubFractions4th
} from './printables/FractionWorksheets'
import MathMazeWorksheets from './MathMazeWorksheets'
import { MathWorksheets } from './MathWorksheets';
import { LogicWorksheets } from './LogicWorksheets';
import { GeographyWorksheets } from './GeographyWorksheets'
import { Symmetry } from './printables/Symmetry'
import { ScienceWorksheets } from './printables/ScienceWorksheets'
import { LinePlots, BarGraphs, MeanMedianMode } from './printables/DataAnalysisWorksheets'
import { GeometryWordProblems, MeasurementWordProblems, DecimalWordProblems, FractionWordProblems, WordProblems100 } from './printables/WordProblemWorksheets'
import {
  ClassifyingTriangles,
  ClassifyingQuadrilaterals,
  LinesAndAngles,
  ClassifyingAngles,
  SymmetryTransformations,
  AreaPerimeter
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
  'multiplying-fractions',
  'dividing-fractions',
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
    case 'shapes-colors-sort':
      return getTranslatedWorksheetTitle(docId, t, ' Shapes & Colors Sort (Cut & Glue)')
    case 'dot-to-dot-1-20':
      return getTranslatedWorksheetTitle(docId, t, '120 Dot-to-Dot')
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
    case 'sentence-building':
      return getTranslatedWorksheetTitle(docId, t, ' Sentence Building')
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
    case 'rounding-decimals':
      return getTranslatedWorksheetTitle(docId, t, ' Rounding Decimals')
    case 'estimating-sums-differences':
      return getTranslatedWorksheetTitle(docId, t, ' Estimating Sums & Differences')
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
        }
        
        /* Section styles - match index.css exactly */
        section.worksheet-section,
        section[class*="worksheet-section"],
        .worksheet-section {
          display: block !important;
          break-inside: auto !important;
          page-break-inside: auto !important;
          -webkit-region-break-inside: auto !important;
          -webkit-column-break-inside: auto !important;
          orphans: 2 !important;
          widows: 2 !important;
          overflow: visible !important;
          margin-bottom: 1.5rem !important;
          margin-top: 0 !important;
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
          background-color: white !important;
          background: white !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        
        /* First section should have NO top padding/margin */
        section:first-of-type,
        .worksheet-section:first-of-type {
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
                  let from = (u.searchParams.get('from') || '').trim()
                  const docId = (doc || '').trim()

                  if (from === docId) {
                    from = ''
                  }

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
        {/* Geography Worksheets */}
        <GeographyWorksheets
          docId="geo-continents-k2"
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
                <div>3. Practice writing both uppercase and lowercase letters</div>
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

        {activeDocs.includes('time-5min') && (
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

        {activeDocs.includes('dot-to-dot-1-20') && (() => {
          const dotCount = 20;
          return (
            <WorksheetSectionWrapper
              docId="dot-to-dot-1-20"
              title="120 Dot-to-Dot"
              emoji={String.fromCodePoint(0x270F)}
              description="Connect the dots in order to reveal the picture."
              problemCount={dotCount}
              learningObjectives={[
                'Count numbers 120 in order',
                'Follow sequential order',
                'Practice fine motor skills (drawing lines)',
                'Recognize number patterns'
              ]}
              parentTeacherTips={[
                'Encourage counting aloud while connecting dots',
                'Start at 1 and go in order: 1, 2, 3, 4...',
                'Help identify the picture as it emerges',
                'Extension: Try connecting backwards (20, 19, 18...)',
                'Practice number recognition and sequencing'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 animate-gradient-x mb-2" />
              {/* Worked Example */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-base"><strong>Instructions:</strong> Connect the dots from 1 to 20</div>
                  <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                    <div><strong>Step 1:</strong> Find dot number 1</div>
                    <div><strong>Step 2:</strong> Draw a line from 1 to 2</div>
                    <div><strong>Step 3:</strong> Continue: 2 to 3, 3 to 4, and so on...</div>
                    <div className="font-semibold text-blue-900"><strong>Answer:</strong>{String.fromCodePoint(0x279C)}</div>
                    <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                  </div>
                </div>
              </div>
              <div className="break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
                  {Array.from({ length: dotCount }).map((_, i) => (
                    <g key={i}>
                      <circle cx={60 + i * 35} cy={200 + (i % 2 === 0 ? -30 : 30)} r="4" fill="#111827" />
                      <text x={60 + i * 35 + 6} y={200 + (i % 2 === 0 ? -30 : 30) - 6} fontSize="12">{i + 1}</text>
                    </g>
                  ))}
                </svg>
              </div>
              {/* Extension/Challenge Problems */}
              <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                  <div>1. Can you connect the dots backwards? (20, 19, 18...)</div>
                  <div>2. Color the picture after connecting all the dots</div>
                  <div>3. What picture did you make? Draw it again on your own!</div>
                </div>
              </div>
              {/* Self-Assessment */}
              <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                  <div>{String.fromCharCode(0x2610)} I can count from 1 to 20</div>
                  <div>{String.fromCodePoint(0x270F)}</div>
                  <div>{String.fromCharCode(0x2610)} I can see the picture that was made</div>
                </div>
                <div className="mt-3 text-xs">
                  <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {dotCount}
                </div>
                <div className="mt-2 text-xs">
                  <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
              </div>
              {showAnswersForDoc('dot-to-dot-1-20', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="space-y-2 text-sm text-emerald-800">
                    <div>Connect the dots in this order: <strong>{String.fromCodePoint(0x2705)}</strong></div>
                    <div className="mt-2">The completed picture should show a wavy or zigzag pattern connecting all 20 dots in numerical order.</div>
                  </div>
                  <div className="text-xs text-emerald-700 mt-3">
                    Remember: Always start at dot 1 and connect in order. Count aloud as you go: 1, 2, 3, 4...
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          );
        })()}

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

        {activeDocs.includes('spot-difference') && (
          <WorksheetSectionWrapper
            docId="spot-difference"
            title="Spot-the-Difference (7)"
            emoji={String.fromCodePoint(0x1F4D1)}
            description="Find 7 differences between the two pictures."
            problemCount={7}
            learningObjectives={[
              'Develop visual discrimination skills',
              'Practice attention to detail',
              'Compare and contrast images',
              'Build observation and concentration skills'
            ]}
            parentTeacherTips={[
              'Look carefully at both pictures side by side',
              'Check colors, shapes, sizes, and positions',
              'Circle or mark each difference you find',
              'Take your time - there are 7 differences to find',
              'Extension: Create your own spot-the-difference pictures'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Task:</strong> Find 7 differences between the two pictures</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Look at the first picture carefully</div>
                  <div><strong>Step 2:</strong> Compare it to the second picture</div>
                  <div><strong>Step 3:</strong> Look for differences in: colors, shapes, sizes, positions, missing/added items</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> There are 7 differences - keep looking until you find them all!</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
              <div className="break-inside-avoid">
                <HiddenObjectsSceneSVGA />
              </div>
              <div className="break-inside-avoid">
                <HiddenObjectsSceneSVGB />
              </div>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you describe each difference you found in words?</div>
                <div>2. Try to find all 7 differences in under 2 minutes!</div>
                <div>3. Draw your own spot-the-difference picture for a friend to solve</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I can compare two pictures carefully</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 7
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('spot-difference', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="space-y-2 text-sm text-emerald-800">
                  <div>There are 7 differences between the two pictures. Look carefully at:</div>
                  <div className="pl-4">
                    <div>{String.fromCodePoint(0x279C)}</div>
                    <div>{String.fromCodePoint(0x279C)}</div>
                    <div>{String.fromCodePoint(0x279C)}</div>
                    <div>{String.fromCodePoint(0x279C)}</div>
                    <div>{String.fromCodePoint(0x279C)}</div>
                  </div>
                  <div className="text-xs text-emerald-700 mt-2">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
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

        {activeDocs.includes('feelings-checkin') && (
          <WorksheetSectionWrapper
            docId="feelings-checkin"
            title="Feelings Check-In Meter"
            emoji={String.fromCodePoint(0x1F600)}
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
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <defs>
                <linearGradient id="mood" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x="100" y="120" width="600" height="40" fill="url(#mood)" rx="8" />
              <circle cx="400" cy="140" r="56" fill="none" stroke="#111827" strokeWidth="4" />
              <text x="90" y="190" fontSize="16">Calm</text>
              <text x="380" y="190" fontSize="16">Okay</text>
              <text x="680" y="190" fontSize="16">Upset</text>
            </svg>
            {showAnswersForDoc('feelings-checkin', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  There's no right or wrong answer! Point to or color where you feel on the meter. All feelings are valid and important to express.
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('reward-chart') && (
          <WorksheetSectionWrapper
            docId="reward-chart"
            title="Weekly Reward / Sticker Chart"
            emoji={String.fromCodePoint(0x1F3C6)}
            description="Add a sticker or color a star each time you complete a task."
            problemCount={1}
            learningObjectives={[
              'Track daily accomplishments',
              'Build positive habits',
              'Practice goal-setting'
            ]}
            parentTeacherTips={[
              'Use stickers or colors to mark completion',
              'Celebrate achievements together',
              'Set small, achievable goals',
              'Extension: Create your own reward system'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <rect x="100" y="80" width="600" height="220" />
                {Array.from({ length: 5 }).map((_, r) => (
                  <line key={r} x1="100" y1={80 + (r + 1) * 44} x2="700" y2={80 + (r + 1) * 44} />
                ))}
                {Array.from({ length: 6 }).map((_, c) => (
                  <line key={c} x1={100 + (c + 1) * 100} y1="80" x2={100 + (c + 1) * 100} y2="300" />
                ))}
              </g>
              <text x="120" y="70" fontSize="16">Mon</text>
              <text x="220" y="70" fontSize="16">Tue</text>
              <text x="320" y="70" fontSize="16">Wed</text>
              <text x="420" y="70" fontSize="16">Thu</text>
              <text x="520" y="70" fontSize="16">Fri</text>
              <text x="620" y="70" fontSize="16">Sat</text>
              <text x="690" y="70" fontSize="16">Sun</text>
            </svg>
            {showAnswersForDoc('reward-chart', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  Add a sticker or color a star in each box when you complete a task. Track your progress throughout the week!
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('reading-mini-1') && (
          <WorksheetSectionWrapper
            docId="reading-mini-1"
            title="Mini Reading Passage + 3 Questions"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Read the short passage, then answer the questions in full sentences."
            problemCount={3}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details (where, what)',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss plant growth and caring for living things with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M50 50 Q50 30 50 10" stroke="#16a34a" strokeWidth="4" fill="none" />
                <path d="M50 30 Q70 15 50 15 Q30 15 50 30" fill="#22c55e" />
                <path d="M50 40 Q65 30 50 30 Q35 30 50 40" fill="#16a34a" />
                <circle cx="50" cy="55" r="5" fill="#78350f" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Where did Sara put the cup?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for where Sara put the cup</div>
                  <div><strong>Step 3:</strong> Find: "Sara planted a tiny seed in a cup by the window"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Sara put the cup by the window.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">{String.fromCodePoint(0x270F)}</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Sara put the cup?</li>
                <li>What did she give the seed every day?</li>
                <li>What did Sara see in the soil?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story in your own words?</div>
                <div>2. Why do you think Sara turned the cup toward the sun?</div>
                <div>3. Draw a picture of Sara's plant growing</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I understood the story</div>
                <div>{String.fromCharCode(0x2610)} I answered all 3 questions</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 3
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('reading-mini-1', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>By the window</strong> (Sara planted a tiny seed in a cup by the window)</li>
                  <li><strong>A little water</strong> (Every day, she gave it a little water)</li>
                  <li><strong>A green sprout</strong> (One morning, she saw a green sprout peek out of the soil)</li>
                </ol>
                <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-lost-hat') && (() => {
          const docId = 'reading-g1-lost-hat'
          const getTrans = (key: string, fallback: string) => {
            try {
              const result = t(key)
              // If result is the key itself, translation is missing - use fallback
              if (typeof result === 'string' && result === key) {
                return fallback
              }
              // If result starts with 'worksheets.', it's likely a missing translation key - use fallback
              if (typeof result === 'string' && result.startsWith('worksheets.')) {
                return fallback
              }
              // If result is null, undefined, or empty string, use fallback
              if (!result || (typeof result === 'string' && result.trim() === '')) {
                return fallback
              }
              // Otherwise use the translation
              return result
            } catch (error) {
              // If anything goes wrong, use fallback
              return fallback
            }
          }
          return (
            <WorksheetSectionWrapper
              docId={docId}
              title={getTrans(`worksheets.${docId}.title`, 'Passage  The Lost Hat (Grade 1)')}
              emoji={String.fromCodePoint(0x1F9E2)}
              description={getTrans(`worksheets.${docId}.description`, 'Short passage with 4 comprehension questions. Read carefully and answer in full sentences.')}
              problemCount={4}
              learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string') return obj
                return [
                  'Read and understand a short story',
                  'Answer comprehension questions about the text',
                  'Identify key details (who, what, where, why)',
                  'Practice reading fluency and comprehension'
                ]
              })()}
              parentTeacherTips={(() => {
                const tips = t(`worksheets.${docId}.parentTeacherTips`)
                if (Array.isArray(tips) && tips.length > 0 && typeof tips[0] === 'string') return tips
                return [
                  'Read the passage aloud first, then have the child read it',
                  'Ask questions to check understanding before answering',
                  'Encourage full sentence answers',
                  'Help identify key words in the questions that match the passage',
                  'Extension: Have the child retell the story in their own words'
                ]
              })()}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
              <div className="flex justify-center mb-6 print:mb-4">
                <svg viewBox="0 0 100 60" className="w-32 h-20">
                  <path d="M10 50 Q50 55 90 50 L85 40 Q50 30 15 40 Z" fill="#ef4444" />
                  <path d="M30 40 Q50 10 70 40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                  <circle cx="50" cy="30" r="4" fill="#fee2e2" />
                </svg>
              </div>
              {/* Worked Example */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-base"><strong>{getTrans(`worksheets.${docId}.example.question`, 'Question:')}</strong> {getTrans(`worksheets.${docId}.example.questionText`, 'Where did Mia go?')}</div>
                  <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                    <div><strong>{getTrans(`worksheets.${docId}.example.step1`, 'Step 1:')}</strong> {getTrans(`worksheets.${docId}.example.step1Text`, 'Read the passage carefully')}</div>
                    <div><strong>{getTrans(`worksheets.${docId}.example.step2`, 'Step 2:')}</strong> {getTrans(`worksheets.${docId}.example.step2Text`, 'Look for the answer to "Where did Mia go?"')}</div>
                    <div><strong>{getTrans(`worksheets.${docId}.example.step3`, 'Step 3:')}</strong> {getTrans(`worksheets.${docId}.example.step3Text`, 'Find: "Mia ran to the park"')}</div>
                    <div className="font-semibold text-blue-900"><strong>{getTrans(`worksheets.${docId}.example.answer`, 'Answer:')}</strong> {getTrans(`worksheets.${docId}.example.answerText`, 'Mia went to the park.')}</div>
                    <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-300 rounded p-4">
                <p className="text-slate-800 text-base">{getTrans(`worksheets.${docId}.passage`, 'Mia ran to the park. The wind was strong. Her red hat flew off! She looked under the slide and behind a tree. A dog found the hat by the bench. Mia laughed and waved. "Thank you!"')}</p>
                <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                  {(() => {
                    const questions = t(`worksheets.${docId}.questions`)
                    const qArray = Array.isArray(questions) && questions.length > 0 ? questions : [
                      'Where did Mia go?',
                      'What color was the hat?',
                      'Who found the hat?',
                      'Why did the hat fly off?'
                    ]
                    return qArray.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))
                  })()}
                </ol>
              </div>
              {/* Extension/Challenge Problems */}
              <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                  {(() => {
                    const items = t(`worksheets.${docId}.challenge.items`)
                    const itemsArray = Array.isArray(items) && items.length > 0 ? items : [
                      'Can you retell the story in your own words?',
                      'What do you think happened after Mia said "Thank you"?',
                      'Draw a picture of what happened in the story'
                    ]
                    return itemsArray.map((item, i) => (
                      <div key={i}>{i + 1}. {item}</div>
                    ))
                  })()}
                </div>
              </div>
              {/* Self-Assessment */}
              <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                  {(() => {
                    const items = t(`worksheets.${docId}.selfAssessment.items`)
                    const itemsArray = Array.isArray(items) && items.length > 0 ? items : [
                      'I understood the story',
                      'I answered all 4 questions',
                      'I used full sentences in my answers'
                    ]
                    return itemsArray.map((item, i) => (
                      <div key={i}>{String.fromCodePoint(0x279C)}</div>
                    ))
                  })()}
                </div>
                <div className="mt-3 text-xs">
                  <strong>{getTrans(`worksheets.${docId}.selfAssessment.score`, 'My score:')}</strong> ___ / 4
                </div>
                <div className="mt-2 text-xs">
                  <strong>{getTrans(`worksheets.${docId}.selfAssessment.hardest`, 'What was hardest?')}</strong> _________________________
                </div>
              </div>
              {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                    {(() => {
                      const answers = t(`worksheets.${docId}.answerKey.answers`)
                      const answersArray = Array.isArray(answers) && answers.length > 0 ? answers : [
                        'The park (Mia ran to the park)',
                        'Red (Her red hat flew off)',
                        'A dog (A dog found the hat by the bench)',
                        'The wind was strong (The wind was strong, so the hat flew off)'
                      ]
                      return answersArray.map((answer, i) => {
                        const parts = String(answer).split(' (')
                        const main = parts[0]
                        const explanation = parts[1]?.replace(')', '')
                        return (
                          <li key={i}><strong>{main}</strong>{explanation ? ` (${explanation})` : ''}</li>
                        )
                      })
                    })()}
                  </ol>
                  <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}
        {activeDocs.includes('reading-g1-ants') && (
          <WorksheetSectionWrapper
            docId="reading-g1-ants"
            title="Passage  Lunch for the Ants (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details (what, how, why)',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss what the child learned about ants from the story'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 40" className="w-40 h-16">
                {[20, 40, 60, 80].map(x => (
                  <g key={x} transform={`translate(${x}, 20)`}>
                    <circle cx="-5" cy="0" r="3" fill="#1e293b" />
                    <circle cx="0" cy="0" r="3" fill="#1e293b" />
                    <circle cx="5" cy="0" r="3" fill="#1e293b" />
                    <path d="M-2 -3 L-4 -6 M2 -3 L4 -6" stroke="#1e293b" strokeWidth="1" />
                  </g>
                ))}
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What did Sam drop?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what Sam dropped</div>
                  <div><strong>Step 3:</strong> Find: "Sam dropped a crumb"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Sam dropped a crumb.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <p className="text-slate-800 text-base leading-relaxed">Sam dropped a crumb. Ants marched in a line. They carried the crumb together. Sam watched quietly. He did not step near them. Soon, the ants were gone. The floor was clean!</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-2">
                <li>What did Sam drop?</li>
                <li>How did the ants move?</li>
                <li>What did Sam do while he watched?</li>
                <li>What happened to the floor?</li>
              </ol>
              {showAnswersForDoc('reading-g1-ants', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A crumb</li>
                    <li>In a line</li>
                    <li>He watched quietly</li>
                    <li>It was clean</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-bus-ride') && (
          <WorksheetSectionWrapper
            docId="reading-g1-bus-ride"
            title="Passage  The Bus Ride (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details (what, who, why)',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss bus safety and manners with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 120 60" className="w-40 h-16">
                <rect x="10" y="10" width="100" height="35" rx="5" fill="#facc15" />
                <rect x="15" y="15" width="20" height="15" fill="#bae6fd" />
                <rect x="40" y="15" width="20" height="15" fill="#bae6fd" />
                <rect x="65" y="15" width="20" height="15" fill="#bae6fd" />
                <rect x="90" y="15" width="15" height="15" fill="#bae6fd" />
                <circle cx="30" cy="45" r="8" fill="#1e293b" />
                <circle cx="90" cy="45" r="8" fill="#1e293b" />
                <rect x="10" y="35" width="100" height="5" fill="#1e293b" opacity="0.2" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What color were the seats?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for information about the seats</div>
                  <div><strong>Step 3:</strong> Find: "The seats were soft and blue"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> The seats were blue.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">{String.fromCodePoint(0x270F)}</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What color were the seats?</li>
                <li>Who did Eli hold hands with?</li>
                <li>What sound did the driver make?</li>
                <li>Why did the doors open?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story in your own words?</div>
                <div>2. Why do you think Eli waved to the driver?</div>
                <div>3. Draw a picture of Eli and his mom on the bus</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I understood the story</div>
                <div>{String.fromCharCode(0x2610)} I answered all 4 questions</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('reading-g1-bus-ride', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>Blue</strong> (The seats were soft and blue)</li>
                  <li><strong>His mom</strong> (Eli held his mom's hand)</li>
                  <li><strong>A bell</strong> (The driver rang a bell)</li>
                  <li><strong>It was their stop</strong> ("This is our stop," Mom said)</li>
                </ol>
                <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-pet-fish') && (
          <WorksheetSectionWrapper
            docId="reading-g1-pet-fish"
            title="Passage  The Pet Fish (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with 4 comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details (what, who, how many)',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss pet care and responsibility with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <circle cx="50" cy="30" r="25" fill="#ebf8ff" stroke="#93c5fd" strokeWidth="2" />
                <path d="M40 35 Q55 20 70 35 L75 30 Q75 40 70 35 Q55 50 40 35" fill="#f97316" />
                <circle cx="45" cy="32" r="1.5" fill="white" />
                <path d="M25 30 Q50 35 75 30" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What pet did Tara have?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what pet Tara had</div>
                  <div><strong>Step 3:</strong> Find: "Tara had a tiny orange fish"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Tara had a tiny orange fish.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <p className="text-slate-800 text-base leading-relaxed">Tara had a tiny orange fish. She named it Dot. Every morning, she shook in two flakes of food. Dot swam in little circles. Tara drew a picture of Dot for her wall.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-2">
                <li>What pet did Tara have?</li>
                <li>What was its name?</li>
                <li>How many flakes did she feed it?</li>
                <li>What did Tara put on her wall?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story in your own words?</div>
                <div>2. Why do you think Tara named her fish Dot?</div>
                <div>3. Draw a picture of Tara's fish</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I understood the story</div>
                <div>{String.fromCharCode(0x2610)} I answered all 4 questions</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('reading-g1-pet-fish', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>A tiny orange fish</strong> (Tara had a tiny orange fish)</li>
                  <li><strong>Dot</strong> (She named it Dot)</li>
                  <li><strong>Two flakes</strong> (Every morning, she shook in two flakes of food)</li>
                  <li><strong>A picture of Dot</strong> (Tara drew a picture of Dot for her wall)</li>
                </ol>
                <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-paper-bridge') && (
          <WorksheetSectionWrapper
            docId="reading-g2-paper-bridge"
            title="Passage  The Paper Bridge (Grade 2)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details and main idea',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Try building your own paper bridge with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 120 60" className="w-44 h-20">
                <path d="M10 50 Q60 10 110 50" stroke="#64748b" strokeWidth="4" fill="none" />
                <path d="M10 52 L110 52" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
                <rect x="50" y="30" width="20" height="15" fill="#e2e8f0" rx="1" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What was Lena building?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what Lena was building</div>
                  <div><strong>Step 3:</strong> Find: "Lena wanted a tiny bridge for her toy river"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Lena was building a tiny paper bridge.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <p className="text-slate-800 text-base leading-relaxed">Lena wanted a tiny bridge for her toy river. She folded strips of paper and taped them together. The first bridge bent and fell. She added more layers, tested again, and smiled. The paper bridge held three toy cars!</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-2">
                <li>What was Lena building?</li>
                <li>Why did the first bridge fail?</li>
                <li>What change helped it work?</li>
                <li>How many cars did it hold?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story in your own words?</div>
                <div>2. What lesson can we learn from Lena's story?</div>
                <div>3. Draw a picture of Lena's paper bridge</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I understood the story</div>
                <div>{String.fromCharCode(0x2610)} I answered all 4 questions</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('reading-g2-paper-bridge', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>A tiny paper bridge</strong> (Lena wanted a tiny bridge for her toy river)</li>
                  <li><strong>It bent and fell (too weak)</strong> (The first bridge bent and fell)</li>
                  <li><strong>More layers</strong> (She added more layers, tested again, and smiled)</li>
                  <li><strong>Three cars</strong> (The paper bridge held three toy cars!)</li>
                </ol>
                <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-rainy-garden') && (
          <WorksheetSectionWrapper
            docId="reading-g2-rainy-garden"
            title="Passage  Rainy Day Garden (Grade 2)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details and observations',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss the importance of rain for plants with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="0" y="50" width="100" height="10" fill="#22c55e" />
                <path d="M20 50 Q25 30 30 50" fill="#16a34a" />
                <path d="M70 50 Q75 30 80 50" fill="#16a34a" />
                {[20, 40, 60, 80].map(x => (
                  <path key={x} d={`M${x} 5 L${x - 2} 15`} stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                ))}
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What did Asha keep?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what Asha kept</div>
                  <div><strong>Step 3:</strong> Find: "Asha kept a notebook for her balcony garden"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Asha kept a notebook.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Asha had a small garden. She kept a notebook about her plants. On rainy days, she drew a cloud symbol. She watched her green beans closely. After a week of rain and sun, they grew very fast! She wrote a lesson: "Plants need both rain and sun."</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What did Asha keep?</li>
                <li>What symbol did she draw on rainy days?</li>
                <li>What happened to her beans after a week?</li>
                <li>What lesson did she write?</li>
              </ol>
              {showAnswersForDoc('reading-g2-rainy-garden', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>A notebook</li>
                    <li>A cloud</li>
                    <li>They grew fast</li>
                    <li>Plants need rain and sun</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-library-card') && (
          <WorksheetSectionWrapper
            docId="reading-g2-library-card"
            title="Passage  New Library Card (Grade 2)"
            emoji={String.fromCodePoint(0x1F4DA)}
            description="Short passage with comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details and sequence of events',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Visit a library with your child and explore together'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="15" y="15" width="70" height="40" rx="3" fill="#3b82f6" />
                <rect x="20" y="20" width="20" height="20" fill="#eff6ff" opacity="0.5" />
                <rect x="45" y="25" width="30" height="3" fill="white" />
                <rect x="45" y="32" width="20" height="3" fill="white" />
                <circle cx="25" cy="50" r="10" fill="#2563eb" opacity="0.3" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Where did Jada go?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for where Jada go</div>
                  <div><strong>Step 3:</strong> Find: "Jada visited the library with her uncle"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Jada went to the library.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <p className="text-slate-800 text-base">{String.fromCodePoint(0x270F)}</p>
            <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
              <li>Where did Jada go?</li>
              <li>What did she receive from the librarian?</li>
              <li>What kinds of books did she choose?</li>
              <li>Why did she sign her name?</li>
            </ol>
            {showAnswersForDoc('reading-g2-library-card', () => (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>The library</li>
                  <li>A new library card</li>
                  <li>Two mysteries and a science book</li>
                  <li>To complete the form and get the card</li>
                </ol>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-lost-and-found') && (
          <WorksheetSectionWrapper
            docId="reading-g2-lost-and-found"
            title="Passage  Lost and Found (Grade 2)"
            emoji={String.fromCodePoint(0x1F9F8)}
            description="Short passage with comprehension questions. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify key details and problem-solving',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss what to do when something is lost with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="30" y="35" width="40" height="15" rx="5" fill="#ef4444" />
                <path d="M35 35 Q50 20 65 35 Z" fill="#ef4444" />
                <rect x="40" y="25" width="20" height="10" fill="#bae6fd" />
                <circle cx="40" cy="50" r="6" fill="#1e293b" />
                <circle cx="60" cy="50" r="6" fill="#1e293b" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Where did Ben find the glove?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for where Ben found the glove</div>
                  <div><strong>Step 3:</strong> Find: "Ben noticed a glove under the slide"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Ben found the glove under the slide.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">{String.fromCodePoint(0x270F)}</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Ben find the glove?</li>
                <li>Where did he take it?</li>
                <li>What did he write?</li>
                <li>Who came later, and what happened?</li>
              </ol>
              {showAnswersForDoc('reading-g2-lost-and-found', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Under the slide</li>
                    <li>The office</li>
                    <li>{String.fromCodePoint(0x279C)}</li>
                    <li>A classmate; she found her glove</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g3-lighthouse') && (
          <WorksheetSectionWrapper
            docId="reading-g3-lighthouse"
            title="Passage  The Lighthouse Keeper's Trick (Grade 3)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with Q&A. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify problem and solution',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss problem-solving and helping others with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 80" className="w-24 h-24">
                <path d="M40 70 L60 70 L55 20 L45 20 Z" fill="#ef4444" />
                <rect x="42" y="15" width="16" height="8" fill="#1e293b" />
                <path d="M50 18 L100 10 L100 26 Z" fill="#fef3c7" opacity="0.6" />
                <path d="M30 70 L70 70" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What problem did the boat have?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what problem the boat had</div>
                  <div><strong>Step 3:</strong> Find: "a fishing boat drifted off course" and "the fog was thick"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> The boat drifted off course in thick fog.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">A fishing boat was lost at sea. The fog was very thick. The captain could not see the shore. Suddenly, he heard a loud bell. It was the lighthouse warning! He steered away from the rocks and followed the sound to safety.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What problem did the boat have?</li>
                <li>What stopped the captain from seeing?</li>
                <li>Why did the trick help the boat?</li>
                <li>What warned the captain?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">Challenge Questions</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story in your own words?</div>
                <div>2. Why do you think Mira's father taught her this trick?</div>
                <div>3. Draw a picture of Mira at the lighthouse</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I understood the story</div>
                <div>{String.fromCharCode(0x2610)} I answered all 4 questions</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('reading-g3-lighthouse', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>It drifted off course in thick fog</strong> (But the fog was thick, and a fishing boat drifted off course)</li>
                  <li><strong>A timed lamp flash</strong> (She covered one lamp for a few seconds, then uncovered it, making a slow flash)</li>
                  <li><strong>It guided the boat toward the safe beam and away from rocks</strong> (The boat turned toward the beam and away from the rocks)</li>
                  <li><strong>She keeps careful records and uses safe methods</strong> (Mira logged the event: "Used flash method to guide a boat. Lamps steady.")</li>
                </ol>
                <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g3-science-fair') && (
          <WorksheetSectionWrapper
            docId="reading-g3-science-fair"
            title="Passage  The Science Fair Plan (Grade 3)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with Q&A. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify scientific method steps',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss the scientific method and experiments with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-24 h-20">
                <path d="M40 20 L40 10 L60 10 L60 20 L75 50 L25 50 Z" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" />
                <rect x="35" y="40" width="30" height="5" fill="#38bdf8" opacity="0.5" />
                <circle cx="45" cy="35" r="3" fill="white" opacity="0.6" />
                <circle cx="55" cy="25" r="3" fill="white" opacity="0.6" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What problem did the team choose?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what problem the team chose</div>
                  <div><strong>Step 3:</strong> Find: "We chose one: sticky labels that won't peel cleanly"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> The team chose sticky labels that won't peel cleanly.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">{String.fromCodePoint(0x270F)}</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>What problem did the team choose?</li>
                <li>What were two variables they planned to test?</li>
                <li>What did they predict?</li>
                <li>Why did they write a procedure?</li>
              </ol>
              {showAnswersForDoc('reading-g3-science-fair', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>{String.fromCodePoint(0x2705)}</li>
                    <li>Soaking time and natural oils</li>
                    <li>Warm oil would loosen the glue fastest</li>
                    <li>To follow steps consistently and fairly</li>
                  </ol>
                </div>
              ))}
            </div>
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g3-community-garden') && (
          <WorksheetSectionWrapper
            docId="reading-g3-community-garden"
            title="Passage  The Community Garden (Grade 3)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short passage with Q&A. Read carefully and answer in full sentences."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Identify sequence of events and community action',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Read the passage aloud first, then have the child read it',
              'Ask questions to check understanding before answering',
              'Encourage full sentence answers',
              'Help identify key words in the questions that match the passage',
              'Extension: Discuss community projects and teamwork with your child'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-24 h-20">
                <path d="M10 50 Q50 60 90 50" stroke="#22c55e" strokeWidth="3" fill="none" />
                <path d="M50 50 L50 20" stroke="#16a34a" strokeWidth="2" />
                <path d="M50 35 Q30 25 50 30 Q70 25 50 35" fill="#22c55e" />
                <circle cx="50" cy="15" r="4" fill="#f43f5e" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What did families ask the town for?</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Read the passage carefully</div>
                  <div><strong>Step 2:</strong> Look for what families asked the town for</div>
                  <div><strong>Step 3:</strong> Find: "Families asked the town for permission to plant"</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Families asked the town for permission to plant a garden.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <p className="text-slate-800 text-base leading-relaxed">The empty lot near our school looked messy in spring. Families asked the town for permission to plant. We drew a map with paths, a tool shed, and a compost bin. By fall, we harvested tomatoes and herbs, and we sold bundles to raise money for books.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-2">
                <li>What did families ask the town for?</li>
                <li>What three things were on the map?</li>
                <li>What did they harvest?</li>
                <li>How did they use the money they earned?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story in your own words?</div>
                <div>2. Why do you think they sold bundles to raise money?</div>
                <div>3. Draw a picture of the community garden</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I understood the story</div>
                <div>{String.fromCharCode(0x2610)} I answered all 4 questions</div>
                <div>{String.fromCodePoint(0x270F)}</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('reading-g3-community-garden', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>Permission to plant a garden</strong> (Families asked the town for permission to plant)</li>
                  <li><strong>Paths, a tool shed, and a compost bin</strong> (We drew a map with paths, a tool shed, and a compost bin)</li>
                  <li><strong>Tomatoes and herbs</strong> (By fall, we harvested tomatoes and herbs)</li>
                  <li><strong>For books</strong> (We sold bundles to raise money for books)</li>
                </ol>
                <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-red-balloon') && (
          <WorksheetSectionWrapper
            docId="reading-g1-red-balloon"
            title="Passage  The Red Balloon (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={3}
            learningObjectives={[
              'Read short, simple sentences',
              'Identify main character and key events',
              'Answer literal comprehension questions',
              'Build basic reading confidence'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "the", "he", "saw"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-24 h-20">
                <path d="M50 45 L50 60" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <path d="M50 10 Q70 10 70 25 Q70 40 50 45 Q30 40 30 25 Q30 10 50 10" fill="#f43f5e" />
                <path d="M50 45 L45 50 L55 50 Z" fill="#f43f5e" />
                <circle cx="45" cy="20" r="3" fill="white" opacity="0.4" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What did Sam find?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Sam found a red balloon.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Sam saw a big red balloon in the grass. It was round and shiny. Sam held the string tight. The balloon went up, up, up!</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>What did Sam find in the grass?</li>
                <li>What color was the balloon?</li>
                <li>Where did the balloon go?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Sam with his balloon?</div>
                <div>2. Where do you think the balloon went?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 3
              </div>
            </div>
            {showAnswersForDoc('reading-g1-red-balloon', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>A red balloon</strong></li>
                  <li><strong>Red</strong></li>
                  <li><strong>Up into the air</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-big-box') && (
          <WorksheetSectionWrapper
            docId="reading-g1-big-box"
            title="Passage  The Big Box (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read short, simple sentences',
              'Identify characters and settings',
              'Identify key details and objects',
              'Build basic reading confidence'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "the", "she", "saw"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="20" y="20" width="60" height="35" fill="#d97706" />
                <rect x="20" y="20" width="60" height="10" fill="#b45309" />
                <path d="M20 20 L10 10 L40 10 L50 20 Z" fill="#f59e0b" />
                <path d="M80 20 L90 10 L60 10 L50 20 Z" fill="#f59e0b" />
                <circle cx="50" cy="15" r="4" fill="#6366f1" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Where did Mia find the box?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Mia found the box in the garage.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Mia found a big box in the garage. She opened it and saw old toys. There was a doll, a car, and a ball. Mia asked Mom, "Can I play with these?" Mom said yes. Mia played all afternoon.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>Where did Mia find the box?</li>
                <li>What was inside the box?</li>
                <li>What three things did she see?</li>
                <li>How long did Mia play?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Mia with her box?</div>
                <div>2. What would you put in a big box?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g1-big-box', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>In the garage</strong></li>
                  <li><strong>Old toys</strong></li>
                  <li><strong>A doll, a car, and a ball</strong></li>
                  <li><strong>All afternoon</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-garden-snail') && (
          <WorksheetSectionWrapper
            docId="reading-g1-garden-snail"
            title="Passage  The Garden Snail (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read short, simple sentences',
              'Identify main character and key events',
              'Identify key details and observations',
              'Build basic reading confidence'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "the", "he", "saw"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M10 50 Q50 60 90 50" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <path d="M20 45 Q30 20 60 20 Q80 20 80 45 Z" fill="#92400e" />
                <path d="M60 25 Q70 35 60 45" fill="none" stroke="#b45309" strokeWidth="1" />
                <path d="M15 45 Q40 50 70 45" fill="#fcd34d" />
                <circle cx="75" cy="40" r="1.5" fill="#1e293b" />
                <path d="M72 38 L75 32 M78 38 L81 32" stroke="#fcd34d" strokeWidth="1" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Where did Noah see the snail?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Noah saw the snail in the garden.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Noah saw a snail in the garden. It had a brown shell. The snail moved very slowly. Noah watched it crawl on a leaf. The snail left a shiny trail. Noah smiled and said, "Hello, little snail!"</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>Where did Noah see the snail?</li>
                <li>What color was the shell?</li>
                <li>How did the snail move?</li>
                <li>What did the snail leave behind?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Noah with his snail?</div>
                <div>2. Why do you think snails move slowly?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g1-garden-snail', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>In the garden</strong></li>
                  <li><strong>Brown</strong></li>
                  <li><strong>Very slowly</strong></li>
                  <li><strong>A shiny trail</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g1-birthday-cake') && (
          <WorksheetSectionWrapper
            docId="reading-g1-birthday-cake"
            title="Passage  The Birthday Cake (Grade 1)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read short, simple sentences',
              'Identify main character and key events',
              'Identify key details and sequence of events',
              'Build basic reading confidence'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "the", "she", "made"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="25" y="30" width="50" height="25" rx="2" fill="#78350f" />
                <rect x="25" y="30" width="50" height="5" fill="#fbcfe8" />
                {[30, 40, 50, 60, 70].map(x => (
                  <g key={x}>
                    <rect x={x - 1} y="15" width="2" height="15" fill="#60a5fa" />
                    <path d={`M${x - 2} 15 Q${x} 5 ${x + 2} 15 Z`} fill="#facc15" />
                  </g>
                ))}
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Whose birthday was it?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> It was Emma's birthday.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">It was Emma's birthday. Mom made a chocolate cake. There were five candles on top. Emma closed her eyes and made a wish. Then she blew out all the candles. Everyone clapped and sang "Happy Birthday!"</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>Whose birthday was it?</li>
                <li>What kind of cake did Mom make?</li>
                <li>How many candles were on the cake?</li>
                <li>What did everyone do after Emma blew out the candles?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Emma's birthday cake?</div>
                <div>2. What do you think Emma wished for?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g1-birthday-cake', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>Emma's</strong></li>
                  <li><strong>Chocolate cake</strong></li>
                  <li><strong>Five</strong></li>
                  <li><strong>Clapped and sang "Happy Birthday!"</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-bird-feeder') && (
          <WorksheetSectionWrapper
            docId="reading-g2-bird-feeder"
            title="Passage  The Bird Feeder (Grade 2)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read and understand a slightly complex story',
              'Answer comprehension questions about the text',
              'Identify key details and sequence of events',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "works", "journal", "worksheet"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 80 80" className="w-24 h-24">
                <path d="M40 10 L40 30" stroke="#94a3b8" strokeWidth="2" />
                <rect x="25" y="30" width="30" height="40" fill="#f1f5f9" stroke="#cbd5e1" />
                <rect x="30" y="45" width="20" height="15" fill="#1e293b" rx="10" />
                <path d="M25 30 L40 20 L55 30 Z" fill="#cbd5e1" />
                <circle cx="60" cy="50" r="8" fill="#3b82f6" />
                <path d="M68 50 L75 45" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What did they use to make the feeder?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> They used a milk carton.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Carlos and his sister made a bird feeder from a milk carton. They cut a hole in the side and filled it with seeds. They hung it on a tree branch. The next morning, a blue jay came to eat. Carlos wrote in his journal, "Our feeder works!"</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>What did they use to make the feeder?</li>
                <li>What did they put inside?</li>
                <li>Where did they hang it?</li>
                <li>What bird came to visit?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw the bird feeder?</div>
                <div>2. Why do you think Carlos wrote in his journal?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g2-bird-feeder', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>A milk carton</strong></li>
                  <li><strong>Seeds</strong></li>
                  <li><strong>On a tree branch</strong></li>
                  <li><strong>A blue jay</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-cookie-recipe') && (
          <WorksheetSectionWrapper
            docId="reading-g2-cookie-recipe"
            title="Passage  The Cookie Recipe (Grade 2)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read and understand a slightly complex story',
              'Answer comprehension questions about the text',
              'Identify key details and ingredients',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "recipe", "measured", "grandma"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <circle cx="50" cy="30" r="25" fill="#d97706" />
                {[40, 50, 60, 45, 55].map((x, i) => (
                  <circle key={i} cx={x} cy={30 + (i % 2 ? 10 : -10)} r="3" fill="#451a03" />
                ))}
                <path d="M30 30 Q50 40 70 30" stroke="#fef3c7" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.3" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Who did Ava bake with?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Ava baked with her grandma.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Ava wanted to bake cookies with her grandma. They read the recipe together. They needed flour, sugar, eggs, and butter. Ava measured the flour carefully. Grandma said, "Good job!" The cookies came out golden and sweet.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>Who did Ava bake with?</li>
                <li>What did they read together?</li>
                <li>What four things did they need?</li>
                <li>How did the cookies turn out?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Ava baking with her grandma?</div>
                <div>2. Why do you think Grandma said "Good job!"?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g2-cookie-recipe', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>Her grandma</strong></li>
                  <li><strong>The recipe</strong></li>
                  <li><strong>Flour, sugar, eggs, and butter</strong></li>
                  <li><strong>Golden and sweet</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-tree-house') && (
          <WorksheetSectionWrapper
            docId="reading-g2-tree-house"
            title="Passage  The Tree House (Grade 2)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read and understand a slightly complex story',
              'Answer comprehension questions about the text',
              'Identify key details and sequence of events',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "backyard", "ladder", "hideout"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 80" className="w-32 h-24">
                <path d="M50 80 L50 40" stroke="#78350f" strokeWidth="8" />
                <circle cx="50" cy="30" r="30" fill="#16a34a" />
                <rect x="35" y="35" width="30" height="25" fill="#92400e" rx="2" />
                <rect x="42" y="40" width="8" height="10" fill="#fef3c7" />
                <path d="M35 35 L50 25 L65 35 Z" fill="#451a03" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> Who helped Jake build the tree house?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Jake's dad helped him build the tree house.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Jake's dad helped him build a tree house in the backyard. They used wood planks and strong nails. Jake climbed up the ladder first. He looked out the window and saw the whole yard. "This is my secret hideout!" he said.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>Who helped Jake build the tree house?</li>
                <li>What did they use to build it?</li>
                <li>What did Jake see from the window?</li>
                <li>What did Jake call the tree house?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw the tree house?</div>
                <div>2. Why do you think Jake called it his "secret hideout"?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g2-tree-house', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>His dad</strong></li>
                  <li><strong>Wood planks and strong nails</strong></li>
                  <li><strong>The whole yard</strong></li>
                  <li><strong>His secret hideout</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g2-magic-seeds') && (
          <WorksheetSectionWrapper
            docId="reading-g2-magic-seeds"
            title="Passage  The Magic Seeds (Grade 2)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            hideDefaultHeader={true}
            learningObjectives={[
              'Read and understand a slightly complex story',
              'Answer comprehension questions about the text',
              'Identify key details and sequence of events',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "magic", "flowers", "sprouts"'
            ]}
            footer={
              <WorksheetFooter enabled={true} showCopyright={true} />
            }
          >
            <WorksheetHeader enabled={true} showScore={true} />

            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="30" y="20" width="40" height="30" rx="3" fill="#fde047" stroke="#ca8a04" />
                <path d="M15 50 Q50 55 85 50" stroke="#22c55e" strokeWidth="3" fill="none" />
                <path d="M50 50 Q55 35 65 30" stroke="#16a34a" strokeWidth="2" fill="none" />
                <circle cx="65" cy="30" r="5" fill="#f43f5e" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-green-900 mb-2 text-sm">{String.fromCodePoint(0x2705)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What did Mia find in the garden?</div>
                <div className="pl-3 border-l-2 border-green-300">
                  <div className="font-semibold text-green-900"><strong>Answer:</strong> Mia found a small packet of seeds.</div>
                </div>
              </div>
            </div>
            <ProblemBox enabled={true} variant="default">
              <p className="text-slate-800 text-lg leading-relaxed">Mia found a small packet of seeds in her garden. The packet said "Magic Seeds" on it. She planted them in a sunny spot and watered them every day. After one week, tiny green sprouts appeared. Two weeks later, beautiful flowers bloomed in red, yellow, and purple. Mia smiled and said, "These really are magic seeds!"</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>What did Mia find in the garden?</li>
                <li>What did the packet say?</li>
                <li>What happened after one week?</li>
                <li>What colors were the flowers?</li>
              </ol>
            </ProblemBox>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Mia's magic garden?</div>
                <div>2. Why do you think Mia called them "magic seeds"?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g2-magic-seeds', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>A small packet of seeds</strong></li>
                  <li><strong>"Magic Seeds"</strong></li>
                  <li><strong>Tiny green sprouts appeared</strong></li>
                  <li><strong>Red, yellow, and purple</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g3-school-play') && (
          <WorksheetSectionWrapper
            docId="reading-g3-school-play"
            title="Passage  The School Play (Grade 3)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read and understand a slightly complex story',
              'Answer comprehension questions about the text',
              'Identify theme and life lessons',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "explorers", "handled", "narrator"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M10 10 L10 50 L90 50 L90 10" fill="none" stroke="#78350f" strokeWidth="2" />
                <path d="M10 10 Q50 0 90 10 L90 50 Q50 60 10 50 Z" fill="#ef4444" />
                <path d="M30 10 L30 50 M70 10 L70 50" stroke="#b91c1c" strokeWidth="1" />
                <circle cx="50" cy="30" r="5" fill="#fde047" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What was the play about?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> The play was about explorers.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Our class practiced a play about explorers for three weeks. On the big day, the gym was full of parents. I forgot one line, but I kept going. After the show, my teacher said, "You handled that mistake like a pro." I learned that making mistakes is okay if you keep trying.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>What was the play about?</li>
                <li>How long did they practice?</li>
                <li>What happened during the performance?</li>
                <li>What lesson did the narrator learn?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you retell the story?</div>
                <div>2. Why do you think the teacher said "like a pro"?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g3-school-play', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>Explorers</strong></li>
                  <li><strong>Three weeks</strong></li>
                  <li><strong>Narrator forgot a line but kept going</strong></li>
                  <li><strong>Mistakes are okay if you keep trying</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('reading-g3-art-project') && (
          <WorksheetSectionWrapper
            docId="reading-g3-art-project"
            title="Passage  The Art Project (Grade 3)"
            emoji={String.fromCodePoint(0x1F4D6)}
            description="Short story with Q&A. Read and answer the questions."
            problemCount={4}
            learningObjectives={[
              'Read and understand a short story',
              'Answer comprehension questions about the text',
              'Analyze character motivation and feelings',
              'Practice reading fluency and comprehension'
            ]}
            parentTeacherTips={[
              'Have the child point to each word while reading',
              'Look at the picture together before reading the text',
              'Encourage the child to answer in complete sentences',
              'Practice recognizing sight words like "messy", "proudly", "mistake"'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            <div className="flex justify-center mb-6 print:mb-4">
              <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="20" y="10" width="60" height="40" fill="none" stroke="#64748b" strokeWidth="2" />
                <path d="M30 40 Q50 30 70 45" stroke="#3b82f6" strokeWidth="3" fill="none" />
                <circle cx="40" cy="20" r="5" fill="#ef4444" />
                <circle cx="65" cy="25" r="4" fill="#fde047" />
              </svg>
            </div>
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-base"><strong>Question:</strong> What was Lily making?</div>
                <div className="pl-3 border-l-2 border-blue-300">
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> Lily was making a painting of a sunset.</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-lg leading-relaxed">Lily worked on her painting for two hours. She wanted to make a perfect sunset. Suddenly, her blue paint spilled. It left a big messy streak across the yellow sun. Lily felt sad at first. Then she turned the streak into a mountain. She proudly showed her teacher the new painting.</p>
              <ol className="list-decimal list-inside mt-4 text-slate-800 text-base space-y-3">
                <li>What was Lily making?</li>
                <li>What happened when the blue paint spilled?</li>
                <li>How did Lily feel at first?</li>
                <li>What did Lily turn the blue streak into?</li>
              </ol>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Can you draw Lily's painting?</div>
                <div>2. Why was Lily proud of her painting?</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCodePoint(0x270F)}</div>
                <div>{String.fromCharCode(0x2610)} I answered all the questions</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 4
              </div>
            </div>
            {showAnswersForDoc('reading-g3-art-project', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                  <li><strong>A painting of a sunset</strong></li>
                  <li><strong>It left a messy streak across the sun</strong></li>
                  <li><strong>She felt sad</strong></li>
                  <li><strong>A mountain</strong></li>
                </ul>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {activeDocs.includes('pack') && (() => {
          // Build dynamic pack content by time/age/skill
          const timeInt = parseInt(packTime || '5', 10);
          const itemCount = timeInt <= 5 ? 3 : (timeInt <= 10 ? 4 : 5);
          const isK2 = packAge === 'k1' || packAge === 'k2' || packAge === 'g1' || packAge === 'g2';
          const is25 = packAge === '25'; // 2nd-5th Grade
          const is35 = packAge === '35';
          const wsSize = 8;
          const seedStr = `${effectiveSeed}|v${variant}|t${packTime}|a${packAge}|s${packSkill}`;
          const rng = makeRng(seedStr || 'default');
          const theme = packSkill === 'reading' ? 'sight' : (packSkill === 'stem' ? 'space' : pick(['animals', 'space', 'sight'], rng) || 'animals');
          const wordsFull = buildWords(theme, String(packAge));
          const words = pickNUnique(wordsFull, 8, rng);
          const grid = generateWordSearchGrid(wsSize, words.slice(0, 8), rng).flat();
          const treatAsMath = packSkill === 'math';
          // Choose a different maze path based on age and seed for variety
          let mazePath = '';
          if (isK2) {
            mazePath = pick([
              'M10 20h80v20H30v20h60v20H40v20h50',
              'M10 20h70v20H30v20h50v20H20v20h70'
            ], rng) || '';
          } else if (is25 || is35) {
            // 2nd-5th Grade or 3-5: use intermediate difficulty
            mazePath = pick([
              'M10 20h90v15H20v15h80v15H30v15h70v15H40v15h60',
              'M10 20h80v15H30v15h70v15H20v15h80v15H30v15h70'
            ], rng) || '';
          } else {
            mazePath = pick([
              'M10 15h90v10H20v10h80v10H30v10h70v10H40v10h60v10H50v10h50',
              'M10 15h70v10H30v10h80v10H40v10h70v10H50v10h60v10H60v10h40'
            ], rng) || '';
          }
          const drawingPrompt = packSkill === 'creativity'
            ? 'Invent a gadget for school. Label 3 parts.'
            : isK2
              ? 'Draw a creature from a circle, triangle, and rectangle.'
              : 'Draw your favorite animal and write one fact.';

          const items: ReactNode[] = [];

          // Add page-specific worksheet content based on 'from' parameter
          function pushPageSpecificWorksheet() {
            if (!fromParam || !treatAsMath) return; // Only for math packs with from parameter

            const pageRng = makeRng(`${seedStr}|page-specific`);
            function pageNextInt(min: number, max: number) { return Math.floor(pageRng() * (max - min + 1)) + min; }

            // Times Table page - include times-table worksheets
            if (fromParam === 'times-table') {
              const timesTableTypes = [
                'times-table-horizontal-1-5',
                'times-table-horizontal-6-12',
                'times-table-horizontal-1-12',
                'times-table-vertical-1-5',
                'times-table-vertical-6-12',
                'times-table-missing-1-5',
                'times-table-missing-6-12',
                'times-table-timed-1-5',
                'times-table-timed-6-12',
                'times-table-confidence-1-5',
                'times-table-confidence-6-12',
                'times-table-fluency-1-12',
                'times-table-mixed-review'
              ];
              const selectedType = timesTableTypes[Math.floor(pageRng() * timesTableTypes.length)];

              // Generate worksheet content based on type
              if (selectedType.startsWith('times-table-horizontal')) {
                const range = selectedType.includes('1-5') ? [1, 5] : selectedType.includes('6-12') ? [6, 12] : [1, 12];
                const count = selectedType.includes('1-12') ? 12 : 10;
                const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                    <div className="grid grid-cols-3 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">{String.fromCodePoint(0x279C)}<span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.startsWith('times-table-vertical')) {
                const range = selectedType.includes('1-5') ? [1, 5] : selectedType.includes('6-12') ? [6, 12] : [1, 12];
                const count = 8;
                const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                    <div className="grid grid-cols-2 gap-3">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2">
                          <div className="font-mono text-lg text-right">
                            <div>{a}</div>
                            <div>{String.fromCodePoint(0x279C)}</div>
                            <div className="border-t-2 border-slate-600 mt-1 pt-1 h-8 flex items-center justify-end">
                              <span className="inline-block w-16 h-6 border-b-2 border-slate-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.startsWith('times-table-missing')) {
                const range = selectedType.includes('1-5') ? [1, 5] : [6, 12];
                const count = 8;
                const problems = Array.from({ length: count }).map(() => {
                  const type = pageNextInt(1, 3);
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  const answer = a * b;
                  if (type === 1) return { a, b, showAnswer: false };
                  if (type === 2) return { a, answer, showB: false };
                  return { b, answer, showA: false };
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                    <div className="grid grid-cols-2 gap-2 text-base">
                      {problems.map((p, i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">
                            {p.a !== undefined ? p.a : <span className="inline-block w-10 h-5 border-b-2 border-slate-600 mx-1" />}
                            {p.b !== undefined ? p.b : <span className="inline-block w-10 h-5 border-b-2 border-slate-600 mx-1" />} =
                            {p.answer !== undefined ? p.answer : <span className="inline-block w-10 h-5 border-b-2 border-slate-600 mx-1" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.startsWith('times-table-timed')) {
                const range = selectedType.includes('1-5') ? [1, 5] : [6, 12];
                const count = 12;
                const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                    <div className="mb-2 text-sm text-slate-600">{String.fromCodePoint(0x270F)}</div>
                    <div className="grid grid-cols-4 gap-1.5 text-sm">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-1.5 text-center">
                          <div className="font-mono text-xs">{String.fromCodePoint(0x270F)}<span className="inline-block w-8 h-4 border-b border-slate-600 mx-0.5" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else {
                // Confidence or fluency - use horizontal format
                const range = selectedType.includes('1-5') ? [1, 5] : selectedType.includes('6-12') ? [6, 12] : [1, 12];
                const count = 10;
                const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-tt" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                    <div className="grid grid-cols-2 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border-2 border-blue-200 rounded-lg p-2 bg-blue-50">
                          <div className="font-mono text-lg text-center text-blue-700">
                            {a}  {b} = <span className="inline-block w-14 h-6 border-b-2 border-blue-600 mx-1" />
                          </div>
                          <div className="text-xs text-slate-600 text-center mt-1">Hint: {a} groups of {b}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            }
            // Multiplication page - include multiplication worksheets
            else if (fromParam === 'multiplication') {
              const multTypes = [
                'mult-facts-1-5',
                'mult-facts-6-12',
                'mult-arrays-2-5',
                'mult-word-problems-2-3',
                'mult-fact-families',
                'mult-fact-fluency'
              ];
              const selectedType = multTypes[Math.floor(pageRng() * multTypes.length)];

              if (selectedType.startsWith('mult-facts')) {
                const range = selectedType.includes('1-5') ? [1, 5] : [6, 12];
                const count = 12;
                const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const a = pageNextInt(range[0], range[1]);
                  const b = pageNextInt(range[0], range[1]);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Facts Practice</div>
                    <div className="grid grid-cols-3 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">{a} {String.fromCharCode(0x00D7)} {b} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.includes('arrays')) {
                const count = 4;
                const arrays: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const rows = pageNextInt(2, 5);
                  const cols = pageNextInt(2, 5);
                  return [rows, cols];
                });
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Arrays</div>
                    <div className="grid grid-cols-2 gap-3">
                      {arrays.map(([rows, cols], i) => (
                        <div key={i} className="border border-slate-300 rounded p-3">
                          <div className="text-center mb-2 font-semibold">{rows} {String.fromCharCode(0x00D7)} {cols} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '120px', margin: '0 auto' }}>
                            {Array.from({ length: rows * cols }).map((_, idx) => (
                              <div key={idx} className="aspect-square border border-slate-400 rounded bg-slate-100" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (selectedType.includes('word-problems')) {
                const problems = [
                  'Emma has 3 bags. Each bag has 4 apples. How many apples in all?',
                  'There are 5 rows of flowers. Each row has 3 flowers. How many flowers total?',
                  'Jake buys 2 packs of stickers. Each pack has 6 stickers. How many stickers does he have?'
                ];
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Word Problems</div>
                    <ol className="list-decimal list-inside space-y-2 text-base text-slate-800">
                      {problems.map((p, i) => (
                        <li key={i}>{p} <span className="inline-block w-16 h-5 border-b-2 border-slate-600 ml-2" /></li>
                      ))}
                    </ol>
                  </div>
                );
              } else {
                // Fact families or fluency
                const count = 6;
                const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                  const a = pageNextInt(2, 6);
                  const b = pageNextInt(2, 6);
                  return [a, b];
                });
                items.push(
                  <div key="page-specific-mult" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                    <div className="font-semibold text-xl mb-2">Multiplication Practice</div>
                    <div className="grid grid-cols-3 gap-2 text-base">
                      {facts.map(([a, b], i) => (
                        <div key={i} className="border border-slate-300 rounded p-2 text-center">
                          <div className="font-mono">{a} {String.fromCharCode(0x00D7)} {b} = <span className="inline-block w-12 h-5 border-b-2 border-slate-600 mx-1" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            }
            // Grade-specific pages - include grade-appropriate worksheets
            else if (fromParam === '1st-grade' || fromParam === '2nd-grade' || fromParam === '3rd-grade' ||
              fromParam === '4th-grade' || fromParam === '5th-grade' || fromParam === 'kindergarten') {
              const grade = fromParam.replace('-grade', '');
              const count = 8;
              const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
                let range: [number, number];
                if (grade === 'kindergarten' || grade === '1st') range = [1, 5];
                else if (grade === '2nd') range = [1, 10];
                else if (grade === '3rd') range = [1, 12];
                else range = [1, 12];
                const a = pageNextInt(range[0], range[1]);
                const b = pageNextInt(range[0], range[1]);
                return [a, b];
              });
              items.push(
                <div key="page-specific-grade" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                  <div className="font-semibold text-xl mb-2">{grade === 'kindergarten' ? 'Kindergarten' : grade.charAt(0).toUpperCase() + grade.slice(1)} Grade Math Practice</div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {facts.map(([a, b], i) => (
                      <div key={i} className="border border-slate-300 rounded p-1.5 text-center">
                        <div className="font-mono text-xs">{a} {String.fromCharCode(0x00D7)} {b} = <span className="inline-block w-8 h-4 border-b border-slate-600 mx-0.5" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          }

          // Helpers for extra activities
          function scrambleWordLocal(w: string) {
            const a = w.split('');
            for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(rng() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
            }
            return a.join('');
          }
          function buildMiniMathProblems(n: number) {
            const out: string[] = [];
            for (let i = 0; i < n; i++) {
              const isSimple = isK2; // K-2 only
              const a = Math.floor(rng() * (isSimple ? 9 : 12)) + 1;
              const b = Math.floor(rng() * (isSimple ? 9 : 12)) + 1;
              const useAdd = isSimple ? true : rng() < 0.6;
              if (useAdd) out.push(`${a} + ${b} = ____`);
              else out.push(`${Math.max(a, b)} - ${Math.min(a, b)} = ____`);
            }
            return out;
          }
          function buildMiniSudoku() {
            const base = [
              [1, 2, 3, 4],
              [3, 4, 1, 2],
              [2, 1, 4, 3],
              [4, 3, 2, 1],
            ];
            const removals = 6 + Math.floor(rng() * 3);
            const grid: number[][] = base.map(r => r.slice());
            let removed = 0;
            while (removed < removals) {
              const r = Math.floor(rng() * 4);
              const c = Math.floor(rng() * 4);
              if (grid[r][c] !== 0) { grid[r][c] = 0; removed++; }
            }
            return grid;
          }

          // Reading-specific generators
          function buildReadingPassage(age: string) {
            const poolG1 = [
              {
                text: 'Liam had a blue kite. On a windy day, he ran to the park. The kite rose high. Liam laughed and waved at it.',
                qs: ['What color was the kite?', 'Where did Liam go?', 'Why did the kite rise?']
              },
              {
                text: 'Nina put seeds in a pot. She set it by the sunny window. Each morning, she gave it water. A small leaf popped up!',
                qs: ['What did Nina put in the pot?', 'Where did she place the pot?', 'What popped up?']
              },
              {
                text: 'The class made a bird feeder from a cup. They filled it with seeds and hung it on a tree. A red bird came to snack.',
                qs: ['What did the class make?', 'What did they put in it?', 'Who came to snack?']
              }
            ];
            const poolG2 = [
              {
                text: 'Omar wanted to fix his squeaky bike wheel. He watched a quick video and learned to add oil to the axle. After two tries, the squeak was gone.',
                qs: ['What was Omar trying to fix?', 'What did he add to the axle?', 'What happened after two tries?']
              },
              {
                text: 'Maya kept a weather chart on her wall. She drew a sun for hot days, a cloud for cool days, and a raindrop for storms. After a week, her chart had many symbols.',
                qs: ['What did Maya keep on her wall?', 'What symbol did she draw for storms?', 'How long did she track the weather?']
              },
              {
                text: 'Leo and his sister built a pillow fort. They tested two roof designs until one stayed up. They read books inside with a small lamp.',
                qs: ['What did they build?', 'How many roof designs did they test?', 'What did they do inside the fort?']
              }
            ];
            const poolG3 = [
              {
                text: 'A town near the river held an early-morning clean-up. People wore gloves and filled bags with plastic and paper. By noon, the river path looked new. One volunteer wrote, Teamwork made a big job smaller.',
                qs: ['What problem were people solving?', 'When did they work?', 'What does the note tell us about the work?']
              },
              {
                text: 'The lighthouse keeper tested the backup lamp once a month. During a thick fog, the main lamp flickered. The keeper calmly switched to the backup, and ships stayed safe.',
                qs: ['How often was the backup lamp tested?', 'What happened during the fog?', 'Why did ships stay safe?']
              },
              {
                text: 'At the garden market, prices were lower near closing time. Jae waited, then bought apples and carrots with the same coins. He saved money by being patient.',
                qs: ['Where did Jae shop?', 'When were prices lower?', 'How did Jae save money?']
              }
            ];
            // For '25' (2nd-5th grade), use a mix of g2 and g3 passages
            let pool;
            if (age === 'g1') {
              pool = poolG1;
            } else if (age === 'g2') {
              pool = poolG2;
            } else if (age === '25') {
              // Mix of 2nd and 3rd grade passages for 2nd-5th grade range
              pool = [...poolG2, ...poolG3];
            } else {
              pool = poolG3;
            }
            const pickIdx = Math.floor(rng() * pool.length);
            return pool[pickIdx];
          }

          function pushReadingComprehensionFull() {
            const p = buildReadingPassage(packAge);
            items.push(
              <div key={`rc-full-${variant}`} className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                <p className="text-lg text-slate-800 mb-3">{p.text}</p>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  {p.qs.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
            );
          }

          function pushSequenceTask() {
            const seqPools: Record<string, string[][]> = {
              g1: [
                ['Put on boots.', 'Open the door.', 'Play in the snow.'],
                ['Crack the egg.', 'Stir in a bowl.', 'Cook in a pan.']
              ],
              g2: [
                ['Pick a book.', 'Find a quiet seat.', 'Read for ten minutes.'],
                ['Mix soil and water.', 'Press seeds into soil.', 'Label the pot.']
              ],
              '35': [
                ['Plan the route.', 'Pack supplies.', 'Start the hike.'],
                ['List choices.', 'Compare costs.', 'Choose the best value.']
              ]
            };
            const pool = seqPools[packAge as 'g1' | 'g2' | '25' | '35'] || (is25 ? seqPools.g2 : seqPools.g1);
            const choice = pool[Math.floor(rng() * pool.length)];
            items.push(
              <div key={`sequence-${variant}`} className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  {choice.map((s, i) => (<li key={i}><span className="opacity-0">{i + 1}. </span>{s}</li>))}
                </ol>
              </div>
            );
          }

          function pushMainIdeaTask() {
            const p = buildReadingPassage(packAge);
            const distractorA = 'Fun Day';
            const distractorB = 'The Big Storm';
            const options = [
              'Best Title',
              distractorA,
              distractorB
            ];
            // Shuffle options deterministically
            const order = [0, 1, 2].sort(() => (rng() < 0.5 ? -1 : 1));
            items.push(
              <div key={`main-idea-${variant}`} className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                <p className="text-base text-slate-800 mb-3">{p.text}</p>
                <ul className="space-y-1 text-lg text-slate-800">
                  {order.map((i) => (
                    <li key={i}><span className="inline-block w-4 h-4 border border-slate-400 mr-2 align-middle" /> {options[i]}</li>
                  ))}
                </ul>
              </div>
            );
          }
          // 0) Add page-specific worksheet if from parameter is set
          pushPageSpecificWorksheet();

          // 1) Word Search or Reading prompt
          if (!treatAsMath && packSkill !== 'creativity') {
            items.push(
              <div key="ws" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-3">{String.fromCodePoint(0x279C)}</div>
                <div className={`grid grid-cols-8 gap-2 font-mono text-lg`}>
                  {grid.map((c, i) => (
                    <div key={i} className="w-10 h-10 border border-slate-300 rounded-sm flex items-center justify-center">{c}</div>
                  ))}
                </div>
                <div className="mt-3 text-lg text-slate-700">Find: {words.join(', ')}</div>
              </div>
            );
          }
          // 2) Reading/S.T.E.M./Maze secondary item based on focus
          if (packSkill === 'stem') {
            items.push(
              <div key="stem" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-lg mb-2">STEM Mini-Task</div>
                <div className="text-base text-slate-700">{String.fromCodePoint(0x270F)}</div>
                <div className="mt-3 h-24 border border-dashed border-slate-300 rounded-md" />
              </div>
            );
          } else if (packSkill === 'reading') {
            // Add a fuller reading comprehension task instead of a maze
            pushReadingComprehensionFull();
          } else {
            // Build a unique grid maze using a seeded DFS (recursive backtracker)
            const mazeCols = isK2 ? 8 : ((is25 || is35) ? 10 : 12);
            const mazeRows = isK2 ? 8 : ((is25 || is35) ? 10 : 12);
            const total = mazeCols * mazeRows;
            const cells = Array.from({ length: total }, () => ({ t: true, r: true, b: true, l: true })) as { t: boolean; r: boolean; b: boolean; l: boolean }[];
            const visited = new Array(total).fill(false) as boolean[];
            const indexOf = (x: number, y: number) => y * mazeCols + x;
            const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < mazeCols && y < mazeRows;
            const stack: number[] = [0];
            visited[0] = true;
            while (stack.length) {
              const cur = stack[stack.length - 1];
              const cx = cur % mazeCols;
              const cy = Math.floor(cur / mazeCols);
              const neigh: Array<{ i: number; dir: 't' | 'r' | 'b' | 'l' }> = [];
              if (inBounds(cx, cy - 1) && !visited[indexOf(cx, cy - 1)]) neigh.push({ i: indexOf(cx, cy - 1), dir: 't' });
              if (inBounds(cx + 1, cy) && !visited[indexOf(cx + 1, cy)]) neigh.push({ i: indexOf(cx + 1, cy), dir: 'r' });
              if (inBounds(cx, cy + 1) && !visited[indexOf(cx, cy + 1)]) neigh.push({ i: indexOf(cx, cy + 1), dir: 'b' });
              if (inBounds(cx - 1, cy) && !visited[indexOf(cx - 1, cy)]) neigh.push({ i: indexOf(cx - 1, cy), dir: 'l' });
              if (neigh.length === 0) { stack.pop(); continue; }
              // pick neighbor deterministically
              const pickIdx = Math.floor(rng() * neigh.length);
              const next = neigh[pickIdx];
              // carve passage
              if (next.dir === 't') { cells[cur].t = false; cells[next.i].b = false; }
              if (next.dir === 'r') { cells[cur].r = false; cells[next.i].l = false; }
              if (next.dir === 'b') { cells[cur].b = false; cells[next.i].t = false; }
              if (next.dir === 'l') { cells[cur].l = false; cells[next.i].r = false; }
              visited[next.i] = true;
              stack.push(next.i);
            }

            // Convert walls to SVG lines
            const cellSize = 12;
            const pad = 6;
            const svgW = mazeCols * cellSize + pad * 2;
            const svgH = mazeRows * cellSize + pad * 2;
            const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
            for (let y = 0; y < mazeRows; y++) {
              for (let x = 0; x < mazeCols; x++) {
                const i = indexOf(x, y);
                const w = cells[i];
                const x0 = pad + x * cellSize;
                const y0 = pad + y * cellSize;
                const x1 = x0 + cellSize;
                const y1 = y0 + cellSize;
                if (w.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                if (w.l) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                if (w.b) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                if (w.r) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
              }
            }

            items.push(
              <div key="maze" className="border border-slate-200 rounded-lg p-5 sm:col-span-2">
                <div className="font-semibold text-2xl mb-3">Quick Maze</div>
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-96" preserveAspectRatio="xMinYMin meet">
                  <rect x={2} y={2} width={svgW - 4} height={svgH - 4} rx={8} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
                  {lines.map((l, idx) => (
                    <line key={idx} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
                  ))}
                  <text x={pad + 2} y={pad + 14} fontSize={10} fill="#10B981" textAnchor="start">START</text>
                  <text x={svgW - (pad + 2)} y={svgH - (pad + 2)} fontSize={10} fill="#EC4899" textAnchor="end">FINISH</text>
                </svg>
              </div>
            );
          }
          // Build an extras pool; prioritize by focus
          const extras: ReactNode[] = [];
          const pushColoring = () => {
            const letter = (words[Math.floor(rng() * words.length)] || 'A').slice(0, 1).toUpperCase();
            const isSpace = theme === 'space';
            const isSight = theme === 'sight';
            const isAnimals = theme === 'animals';
            // Seeded extras for variety
            const stars = Array.from({ length: 18 }, () => ({ x: Math.floor(rng() * 760) + 20, y: Math.floor(rng() * 520) + 40 }));
            const planet = { cx: 140 + Math.floor(rng() * 160), cy: 120 + Math.floor(rng() * 160), r: 32 + Math.floor(rng() * 24) };
            const animalTypes = ['Fish', 'Turtle', 'Butterfly', 'Bird', 'Dino'] as const;
            const animalPick = animalTypes[Math.floor(rng() * animalTypes.length)];
            extras.push(
              <div key="coloring-sheet" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                <svg viewBox="0 0 800 600" className="w-full h-[28rem] sm:h-[32rem] print:h-[36rem]" fill="none" stroke="#334155" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="coloring-title">
                  <title id="coloring-title">Big coloring illustration</title>
                  {isSpace && (
                    <g>
                      {/* Rocket body */}
                      <path d="M400 100 Q420 60 440 100 L440 360 Q420 400 400 360 Z" />
                      {/* Window */}
                      <circle cx="420" cy="200" r="24" />
                      {/* Fins */}
                      <path d="M440 300 L500 340 L440 340 Z" />
                      <path d="M400 300 L340 340 L400 340 Z" />
                      {/* Flame */}
                      <path d="M400 360 Q420 420 440 360" />
                      {/* Planet and ring */}
                      <circle cx={planet.cx} cy={planet.cy} r={planet.r} />
                      <ellipse cx={planet.cx} cy={planet.cy} rx={planet.r + 24} ry={planet.r / 2 + 8} />
                      {/* Stars */}
                      {stars.slice(0, 12).map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={6 + (i % 3)} />))}
                    </g>
                  )}
                  {isAnimals && (
                    <g>
                      {animalPick === 'Fish' && (
                        <g>
                          <ellipse cx="420" cy="280" rx={140 + Math.floor(rng() * 20)} ry={80 + Math.floor(rng() * 20)} />
                          <polygon points={`540,280 ${580 + Math.floor(rng() * 60)},${240 + Math.floor(rng() * 40)} ${580 + Math.floor(rng() * 60)},${320 - Math.floor(rng() * 40)}`} />
                          <circle cx={350 + Math.floor(rng() * 30)} cy={250 + Math.floor(rng() * 30)} r="10" />
                          <path d={`M${320 + Math.floor(rng() * 10)} 280 Q${360 + Math.floor(rng() * 10)} ${300 + Math.floor(rng() * 10)} ${400 + Math.floor(rng() * 10)} 280`} />
                          <path d={`M${320 + Math.floor(rng() * 10)} 240 Q${360 + Math.floor(rng() * 10)} ${260 + Math.floor(rng() * 10)} ${400 + Math.floor(rng() * 10)} 240`} />
                          {stars.slice(0, 6).map((s, i) => (<circle key={i} cx={280 + i * 20} cy={160 + i * 22} r={8} />))}
                        </g>
                      )}
                      {animalPick === 'Turtle' && (
                        <g>
                          <circle cx="420" cy="300" r={100 + Math.floor(rng() * 20)} />
                          <circle cx="340" cy="300" r="22" />
                          <ellipse cx="380" cy="360" rx="28" ry="16" />
                          <ellipse cx="460" cy="360" rx="28" ry="16" />
                          <ellipse cx="380" cy="240" rx="28" ry="16" />
                          <ellipse cx="460" cy="240" rx="28" ry="16" />
                          <path d="M360 300 H480" />
                          <path d="M420 240 V360" />
                          <path d="M380 260 L460 340" />
                          <path d="M460 260 L380 340" />
                        </g>
                      )}
                      {animalPick === 'Butterfly' && (
                        <g>
                          <line x1="420" y1="220" x2="420" y2="360" />
                          <path d="M420 260 Q360 220 300 260 Q360 300 420 280" />
                          <path d="M420 260 Q480 220 540 260 Q480 300 420 280" />
                          <path d="M420 300 Q360 340 300 320 Q360 300 420 320" />
                          <path d="M420 300 Q480 340 540 320 Q480 300 420 320" />
                          <circle cx="340" cy="260" r="10" />
                          <circle cx="500" cy="260" r="10" />
                        </g>
                      )}
                      {animalPick === 'Bird' && (
                        <g>
                          <ellipse cx="420" cy="300" rx="120" ry="70" />
                          <polygon points="520,300 560,280 560,320" />
                          <circle cx="360" cy="280" r="8" />
                          <path d="M420 290 Q380 320 340 310" />
                          <line x1="400" y1="360" x2="390" y2="390" />
                          <line x1="440" y1="360" x2="450" y2="390" />
                        </g>
                      )}
                      {animalPick === 'Dino' && (
                        <g>
                          <ellipse cx="420" cy="340" rx="140" ry="60" />
                          <path d="M360 240 Q380 200 420 220 Q460 240 460 280" />
                          <circle cx="380" cy="220" r="8" />
                          <path d="M500 340 Q560 320 580 300" />
                        </g>
                      )}
                    </g>
                  )}
                  {isSight && (
                    <g>
                      {/* Giant letter outline */}
                      <text x="260" y="360" fontSize="280" stroke="#334155" fill="none">{letter}</text>
                      {/* Book */}
                      <rect x="520" y="220" width="160" height="120" rx="8" />
                      <line x1="600" y1="220" x2="600" y2="340" />
                      <path d="M520 240 Q560 260 600 240" />
                      <path d="M600 240 Q640 260 680 240" />
                    </g>
                  )}
                </svg>
              </div>
            );
          };
          const pushDrawing = () => extras.push(
            <div key="draw" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
              <div className="font-semibold text-xl mb-2">Drawing Prompt</div>
              <div className="text-lg text-slate-700">{drawingPrompt}</div>
              <div className="mt-3 h-72 border border-dashed border-slate-300 rounded-md" />
            </div>
          );
          const pushMiniMath = () => extras.push(
            <div key="mini-math" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
              <div className="grid sm:grid-cols-2 gap-2 text-lg text-slate-800">
                {buildMiniMathProblems(8).map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span>{p}</span>
                    <span className="ml-3 flex-1 border-b border-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          );
          const pushPlaceValue = () => extras.push(
            <div key="place-value" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
              <div className="grid sm:grid-cols-2 gap-3 text-lg text-slate-800">
                {Array.from({ length: 6 }).map((_, i) => {
                  const n = 10 + Math.floor(rng() * 89);
                  const tens = Math.floor(n / 10);
                  const ones = n % 10;
                  return (
                    <div key={i} className="border border-slate-200 rounded p-2">
                      <div className="flex items-center justify-between"><span>Number:</span><span className="font-semibold">{n}</span></div>
                      <div className="flex items-center justify-between mt-1"><span>Tens:</span><span className="ml-3 flex-1 border-b border-slate-300" /></div>
                      <div className="flex items-center justify-between mt-1"><span>Ones:</span><span className="ml-3 flex-1 border-b border-slate-300" /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
          const pushTenFramesPractice = () => extras.push(
            <div key="ten-frames-mini" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {Array.from({ length: 2 }).map((_, i) => {
                  // Grade-appropriate targets: up to 10 for K2 pack, to 20 for Grade 2, higher for 2-5
                  const raw = packAge === 'k2' ? (4 + Math.floor(rng() * 7)) : (packAge === 'g2' ? (11 + Math.floor(rng() * 10)) : (packAge === '25' ? (11 + Math.floor(rng() * 10)) : (6 + Math.floor(rng() * 14))));
                  const target = Math.max(1, Math.min(raw, 20));
                  const frames = target > 10 ? 2 : 1;
                  const viewW = frames === 2 ? 440 : 220;
                  return (
                    <svg key={i} viewBox={`0 0 ${viewW} 110`} className="w-full h-auto bg-white border border-slate-300 rounded">
                      <text x="10" y="20" fontSize="14" fill="#111827">Make {target}</text>
                      {Array.from({ length: frames }).map((__, fIdx) => (
                        <g key={fIdx} transform={`translate(${10 + fIdx * 210},30)`}>
                          {Array.from({ length: 10 }).map((__, j) => (
                            <rect key={j} x={(j % 5) * 40} y={Math.floor(j / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                          ))}
                          {(() => {
                            const start = fIdx * 10;
                            const end = Math.min(target, (fIdx + 1) * 10);
                            const count = Math.max(0, end - start);
                            return Array.from({ length: count }).map((__, k) => (
                              <circle key={k} cx={18 + (k % 5) * 40} cy={18 + Math.floor(k / 5) * 40} r="10" fill="#7c3aed" />
                            ));
                          })()}
                        </g>
                      ))}
                    </svg>
                  );
                })}
              </div>
            </div>
          );
          const pushScramble = () => {
            const scrambleWords = words.slice(0, Math.min(5, words.length));
            extras.push(
              <div key="scramble" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Word Scramble</div>
                <div className="space-y-2 text-lg text-slate-800">
                  {scrambleWords.map((w, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>Unscramble: {scrambleWordLocal(w)}</span>
                      <span className="ml-3 flex-1 border-b border-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            );
          };
          const pushReading = () => {
            const readingSnippets = [
              'A fox saw the moon in the pond. It tried to catch it, but the water rippled and the moon danced away.',
              'Sara planted a tiny seed. Every day she gave it water and a song. One morning, a green leaf waved hello.'
            ];
            const reading = readingSnippets[Math.floor(rng() * readingSnippets.length)];
            extras.push(
              <div key="reading" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Mini Reading</div>
                <p className="text-lg text-slate-800 mb-3">{reading}</p>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  <li>Circle the main character.</li>
                  <li>Underline one action word.</li>
                </ol>
              </div>
            );
          };
          const pushMiniSudoku = () => {
            const miniS = buildMiniSudoku();
            extras.push(
              <div key="mini-sudoku" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">{String.fromCodePoint(0x279C)}</div>
                <div className="inline-grid grid-cols-4 gap-[3px] text-lg font-mono">
                  {miniS.flat().map((v, i) => (
                    <div key={i} className="w-12 h-12 border border-slate-300 rounded-sm flex items-center justify-center bg-white">
                      {v === 0 ? '' : v}
                    </div>
                  ))}
                </div>
              </div>
            );
          };

          if (treatAsMath) {
            pushMiniMath();
            pushPlaceValue();
            pushMiniSudoku();
            pushTenFramesPractice();
          } else if (packSkill === 'creativity') {
            pushColoring();
            pushDrawing();
            pushScramble();
            pushMiniMath();
            pushMiniSudoku();
            pushReading();
          } else if (packSkill === 'reading') {
            // Reading-focused extras only
            pushColoring(); // letter/book variant if theme === 'sight'
            pushReading(); // mini snippet + 2 questions
            pushScramble(); // sight-word scramble
            pushSequenceTask();
            pushMainIdeaTask();
          } else if (packSkill === 'stem') {
            pushColoring();
            pushMiniMath();
            pushMiniSudoku();
            pushScramble();
            pushReading();
            pushDrawing();
          } else if (packSkill === 'math') {
            pushMiniMath();
            pushPlaceValue();
            pushMiniSudoku();
            pushTenFramesPractice();
          } else {
            // mixed/focus
            pushColoring();
            pushMiniMath();
            pushScramble();
            pushReading();
            pushMiniSudoku();
            pushDrawing();
          }

          // Fill remaining slots from extras
          for (const extra of extras) {
            if (items.length >= itemCount) break;
            items.push(extra);
          }

          const buildLink = (nextVariant?: number, nextSeed?: string) => {
            const sp = new URLSearchParams({
              doc: 'pack',
              time: packTime,
              age: packAge,
              skill: packSkill,
              seed: nextSeed || effectiveSeed,
              variant: String(nextVariant ?? variant)
            })
            // Preserve the 'from' parameter to maintain page-specific content
            if (fromParam) {
              sp.set('from', fromParam)
            }
            return `/print?${sp.toString()}`
          }

          const shareUrl = (typeof window !== 'undefined') ? `${window.location.origin}${buildLink()}` : buildLink()
          async function copyShare() {
            try {
              await navigator.clipboard.writeText(shareUrl)
              setCopiedLink(true)
              setTimeout(() => setCopiedLink(false), 1500)
            } catch { }
          }

          const nextVariantUrl = buildLink(variant + 1)
          const todayUrl = buildLink(1, todaySeed)

          const displayFocus = treatAsMath ? 'Math' : friendlyFocus(packSkill);
          return (
            <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-5 print:border-0 print:p-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{docTitle}</h2>
                  <div className="text-slate-700 text-xl">{String.fromCodePoint(0x270F)}</div>
                  <div className="text-slate-700 text-sm">{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="print:hidden flex items-center gap-2">
                  <a href={todayUrl} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">{String.fromCodePoint(0x270F)}</a>
                  <a href={nextVariantUrl} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">{t('common.newPack')}</a>
                  <button onClick={copyShare} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">{copiedLink ? t('common.linkCopied') : t('common.copyLink')}</button>
                </div>
              </div>
              <div className="text-slate-700 text-xl mt-3 mb-3">{t('pages.printables.quickWins')}</div>
              <div className="grid sm:grid-cols-2 gap-6">
                {items.slice(0, itemCount)}
              </div>
            </section>
          );
        })()}
        {activeDocs.includes('stem-balloon-rocket') && (
          <WorksheetSectionWrapper
            docId="stem-balloon-rocket"
            title="Balloon Rocket (STEM)"
            emoji={String.fromCodePoint(0x1F52C)}
            description="Time: 10 minutes  Ages: 710. Build a balloon rocket and learn about action and reaction!"
            problemCount={1}
            learningObjectives={[
              'Understand action and reaction forces',
              'Build a working balloon rocket',
              'Practice following step-by-step instructions'
            ]}
            parentTeacherTips={[
              'Air pushes backward; the rocket moves forward (action/reaction)',
              'Help with tying the string securely',
              'Test different balloon sizes and angles',
              'Extension: Add a small paper cargo to the rocket'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-red-400 animate-gradient-x mb-2" />
            <div className="mb-4 text-slate-700 text-base">Build a simple rocket to see Newton's Third Law in action!</div>
            <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>Balloon</li>
                  <li>String or yarn (thick enough to slide)</li>
                  <li>Plastic straw</li>
                  <li>Clear tape</li>
                  <li>Two chairs (to tie the string)</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Thread the string through the straw.</li>
                  <li>Tie the string tightly between two chairs.</li>
                  <li>Tape the balloon to the straw (opening facing backward).</li>
                  <li>Blow up the balloon (do not tie it!) and hold the end closed. Then let go!</li>
                  <li>Measure distance and try again.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Air pushes backward; the rocket moves forward (action/reaction).
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Test balloon sizes, angles, or add a small paper cargo.
              </div>
            </div>
            {showAnswersForDoc('stem-balloon-rocket', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  <div className="mb-2"><strong>What you learned:</strong> When air pushes backward out of the balloon, the rocket moves forward. This is Newton's third law: for every action, there is an equal and opposite reaction!</div>
                  <div><strong>Success tip:</strong> Make sure the string is tight and the balloon opening faces backward. The tighter the string, the faster your rocket will go!</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('stem-walking-water') && (
          <WorksheetSectionWrapper
            docId="stem-walking-water"
            title="Walking Water (STEM)"
            emoji={String.fromCodePoint(0x1F52C)}
            description="Time: 1520 minutes  Ages: 610. Watch water walk through paper towels and mix colors!"
            problemCount={1}
            learningObjectives={[
              'Understand capillary action',
              'Observe color mixing',
              'Practice following scientific steps'
            ]}
            parentTeacherTips={[
              'Water climbs paper fibers (capillary action) and mixes colors',
              'Be patient - it takes time for the water to walk',
              'Try different towel brands or color combinations',
              'Extension: Try longer gaps between cups'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-red-400 animate-gradient-x mb-2" />
            <div className="mb-4 text-slate-700 text-base">{String.fromCodePoint(0x270F)}</div>
            <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>3 clear cups</li>
                  <li>Water</li>
                  <li>Paper towels</li>
                  <li>Red + blue food coloring</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Fill the outer cups with colored water; leave the middle empty.</li>
                  <li>{String.fromCodePoint(0x270F)}</li>
                  <li>Place bridges into the cups.</li>
                  <li>{String.fromCodePoint(0x270F)}</li>
                  <li>Record what changed.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Water climbs paper fibers (capillary action) and mixes colors.
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Try different towel brands, longer gaps, or other color pairs.
              </div>
            </div>
            {showAnswersForDoc('stem-walking-water', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  <div className="mb-2"><strong>What you learned:</strong> Water climbs up the paper towel through tiny spaces between the fibers. This is called capillary action! When the red and blue water meet in the middle cup, they mix to make purple.</div>
                  <div><strong>Success tip:</strong> Make sure the paper towels are fully in the water and the middle cup. Be patient - it takes 10-20 minutes for the water to walk!</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('arts-3-shape-creature') && (
          <WorksheetSectionWrapper
            docId="arts-3-shape-creature"
            title="Draw From 3 Shapes (Arts)"
            emoji={String.fromCodePoint(0x1F3A8)}
            description="Time: 1015 minutes  Ages: 612. Use 3 simple shapes to create a creative creature!"
            problemCount={1}
            learningObjectives={[
              'Use simple shapes to create art',
              'Practice creative thinking',
              'Combine shapes into a creature'
            ]}
            parentTeacherTips={[
              'Play with shape language and composition',
              'Encourage creativity - there are no wrong answers',
              'Help with drawing if needed',
              'Extension: Create a story about your creature'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
            <div className="mb-4 text-slate-700 text-base">{String.fromCodePoint(0x270F)}</div>
            <div className="grid sm:grid-cols-2 gap-6 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>Paper</li>
                  <li>Pencil or markers</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Draw a big circle, triangle, and rectangle anywhere.</li>
                  <li>Turn one shape into a face (eyes/mouth).</li>
                  <li>Connect shapes into one creature.</li>
                  <li>Add patterns and a background.</li>
                  <li>Name your creature and write a 1-line story.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Play with shape language and composition using simple constraints.
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Mirror (symmetry) version, only curved lines, or only straight lines.
              </div>
            </div>
            {showAnswersForDoc('arts-3-shape-creature', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  <div className="mb-2"><strong>What you learned:</strong> Simple shapes can be combined in creative ways to make unique creatures! There's no right or wrong way - use your imagination!</div>
                  <div><strong>Success tip:</strong> Start with big shapes, then add details. Don't worry about making it perfect - have fun and be creative!</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}
        {/* (Removed legacy one-pager duplicates) */}


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
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
          function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

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

        {activeDocs.includes('grammar-detective') && (
          <WorksheetSectionWrapper
            docId="grammar-detective"
            title="Grammar Detective"
            emoji={String.fromCodePoint(0x270D)}
            description="Find and fix the mistake in each sentence. Rewrite it correctly on the line."
            problemCount={5}
            learningObjectives={[
              'Identify grammar mistakes',
              'Fix sentence errors',
              'Practice proper grammar usage'
            ]}
            parentTeacherTips={[
              'Look for subject-verb agreement',
              'Check capitalization and punctuation',
              'Read each sentence carefully',
              'Extension: Write your own sentences with mistakes to fix'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
              <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-base"><strong>Problem:</strong> Find the mistake: "we goes to the park every saturday."</div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                  <div><strong>Step 1:</strong> Check subject-verb agreement: "we" (plural) needs "go" not "goes"</div>
                  <div><strong>Step 2:</strong> Check capitalization: "we" should be "We", "saturday" should be "Saturday"</div>
                  <div><strong>Step 3:</strong> Fix the sentence</div>
                  <div className="font-semibold text-blue-900"><strong>Answer:</strong> We go to the park every Saturday.</div>
                  <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                </div>
              </div>
            </div>
            <div className="break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              {[
                'we goes to the park every saturday.',
                'The cats is sleeping under the table.',
                'i can run faster then my friend.',
                'There is two pencils on the desk.',
                'She dont like broccoli.'
              ].map((s, i) => (
                <div key={i} className="mb-3">
                  <div className="text-sm">{i + 1}.) {s}</div>
                  <div className="border-b border-slate-300 mt-2" />
                </div>
              ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>1. Write your own sentences with mistakes for a friend to fix</div>
                <div>2. Can you explain why each mistake was wrong?</div>
                <div>3. Practice writing sentences with correct grammar</div>
              </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
              <div className="space-y-2 text-xs">
                <div>{String.fromCharCode(0x2610)} I can identify grammar mistakes</div>
                <div>{String.fromCharCode(0x2610)} I can fix sentence errors</div>
                <div>{String.fromCharCode(0x2610)} I understand proper grammar usage</div>
              </div>
              <div className="mt-3 text-xs">
                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 5
              </div>
              <div className="mt-2 text-xs">
                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
              </div>
            </div>
            {showAnswersForDoc('grammar-detective', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="space-y-2 text-sm text-emerald-800">
                  <div>1. <strong>We go</strong> to the park every <strong>Saturday</strong>. (subject-verb agreement, capitalization)</div>
                  <div>2. The cats <strong>are</strong> sleeping under the table. (subject-verb agreement)</div>
                  <div>3. <strong>I</strong> can run faster <strong>than</strong> my friend. (capitalization, than vs then)</div>
                  <div>4. There <strong>are</strong> two pencils on the desk. (subject-verb agreement)</div>
                  <div>5. She <strong>doesn't</strong> like broccoli. (contraction form)</div>
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}



        {activeDocs.includes('bookmark-templates') && (
          <WorksheetSectionWrapper
            docId="bookmark-templates"
            title="DIY Bookmark Templates"
            emoji={String.fromCodePoint(0x1F4D1)}
            description="Cut along the dotted lines. Decorate with doodles and colors. Add your name on the back!"
            problemCount={3}
            learningObjectives={[
              'Practice cutting skills',
              'Express creativity through art',
              'Create a useful craft'
            ]}
            parentTeacherTips={[
              'Use safety scissors',
              'Help with cutting if needed',
              'Encourage creativity in decoration',
              'Extension: Create your own bookmark designs'
            ]}
          >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-3 gap-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
              {['Be Kind', 'Keep Reading', 'Dream Big'].map((t, i) => (
                <div key={i} className="relative h-64 border border-slate-400 rounded bg-white">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-300 m-2 rounded" />
                  <div className="flex items-center justify-center h-full text-slate-700 font-semibold">{t}</div>
                </div>
              ))}
            </div>
            {showAnswersForDoc('bookmark-templates', () => (
              <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                <div className="text-sm text-emerald-800">
                  Cut along the dotted lines to create your bookmarks. Decorate them however you like - there's no right or wrong way! Add your name on the back to make them personal.
                </div>
              </div>
            ))}
          </WorksheetSectionWrapper>
        )}

        {activeDocs.includes('design-monster') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)

          // Simple SVG paths for parts
          const bodies = [
            { name: "Blob", path: "M 40,150 Q 20,80 80,40 Q 140,0 180,50 Q 220,100 200,160 Q 180,220 100,210 Q 20,200 40,150" },
            { name: "Boxy", path: "M 50,50 L 190,50 L 190,190 L 50,190 Z" },
            { name: "Triangle", path: "M 120,30 L 220,200 L 20,200 Z" },
            { name: "Egg", path: "M 120,30 Q 220,30 220,150 Q 220,220 120,220 Q 20,220 20,150 Q 20,30 120,30" },
            { name: "Cloud", path: "M 60,100 Q 40,60 80,60 Q 100,40 140,60 Q 180,40 200,80 Q 240,100 200,140 Q 220,180 160,180 Q 120,200 80,180 Q 20,160 60,100" },
            { name: "Ghost", path: "M 40,200 L 40,80 Q 40,20 120,20 Q 200,20 200,80 L 200,200 L 170,170 L 140,200 L 110,170 L 80,200 L 50,170 Z" }
          ]

          const eyes = [
            { name: "Cyclops", path: <circle cx="120" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="4" /> },
            { name: "Two Eyes", path: <g><circle cx="90" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="150" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="4" /></g> },
            { name: "Three Eyes", path: <g><circle cx="120" cy="80" r="12" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="90" cy="110" r="12" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="150" cy="110" r="12" fill="none" stroke="currentColor" strokeWidth="4" /></g> },
            { name: "Googly", path: <g><circle cx="100" cy="90" r="20" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="140" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="4" /></g> },
            { name: "Angry", path: <g><path d="M 80,80 L 110,100" stroke="currentColor" strokeWidth="4" /><path d="M 160,80 L 130,100" stroke="currentColor" strokeWidth="4" /><circle cx="95" cy="110" r="10" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="145" cy="110" r="10" fill="none" stroke="currentColor" strokeWidth="4" /></g> },
            { name: "Vertical", path: <g><ellipse cx="90" cy="100" rx="10" ry="25" fill="none" stroke="currentColor" strokeWidth="4" /><ellipse cx="150" cy="100" rx="10" ry="25" fill="none" stroke="currentColor" strokeWidth="4" /></g> }
          ]

          const mouths = [
            { name: "Smile", path: <path d="M 80,140 Q 120,180 160,140" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /> },
            { name: "Fangs", path: <path d="M 80,140 L 90,160 L 100,140 L 110,160 L 120,140 L 130,160 L 140,140 L 150,160 L 160,140" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" /> },
            { name: "O-Shape", path: <circle cx="120" cy="150" r="15" fill="none" stroke="currentColor" strokeWidth="4" /> },
            { name: "Tongue", path: <g><path d="M 80,140 Q 120,170 160,140" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M 110,155 Q 120,180 130,155" fill="none" stroke="currentColor" strokeWidth="4" /></g> },
            { name: "Zipper", path: <g><line x1="80" y1="150" x2="160" y2="150" stroke="currentColor" strokeWidth="4" /><line x1="90" y1="145" x2="90" y2="155" stroke="currentColor" strokeWidth="3" /><line x1="110" y1="145" x2="110" y2="155" stroke="currentColor" strokeWidth="3" /><line x1="130" y1="145" x2="130" y2="155" stroke="currentColor" strokeWidth="3" /><line x1="150" y1="145" x2="150" y2="155" stroke="currentColor" strokeWidth="3" /></g> },
            { name: "Wobbly", path: <path d="M 80,150 Q 100,130 120,150 Q 140,170 160,150" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /> }
          ]

          const limbs = [
            { name: "Tentacles", path: <path d="M 40,180 Q 10,220 30,240 M 200,180 Q 230,220 210,240" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /> },
            { name: "Robot Arms", path: <path d="M 40,120 L 10,120 L 10,160 M 200,120 L 230,120 L 230,160" fill="none" stroke="currentColor" strokeWidth="4" /> },
            { name: "Wings", path: <path d="M 40,100 Q 0,50 0,100 Q 0,150 40,120 M 200,100 Q 240,50 240,100 Q 240,150 200,120" fill="none" stroke="currentColor" strokeWidth="4" /> },
            { name: "Stick Legs", path: <path d="M 80,200 L 80,240 M 160,200 L 160,240" fill="none" stroke="currentColor" strokeWidth="4" /> },
            { name: "Claws", path: <g><path d="M 40,120 L 10,100 M 10,100 L 0,90 M 10,100 L 20,90" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M 200,120 L 230,100 M 230,100 L 240,90 M 230,100 L 220,90" fill="none" stroke="currentColor" strokeWidth="4" /></g> },
            { name: "Antennae", path: <path d="M 100,40 L 80,10 M 140,40 L 160,10" fill="none" stroke="currentColor" strokeWidth="4" /> }
          ]

          // Randomly select 6 distinct parts for each category to be the "options"
          const selectedBodies = shuffleArray([...bodies], rng).slice(0, 6)
          const selectedEyes = shuffleArray([...eyes], rng).slice(0, 6)
          const selectedMouths = shuffleArray([...mouths], rng).slice(0, 6)

          return (
            <WorksheetSectionWrapper
              docId="design-monster"
              title="Roll & Draw a Monster"
              emoji={String.fromCodePoint(0x1F47E)}
              description="Roll a die to pick a Body, Eyes, and Mouth. Draw your unique monster!"
              problemCount={1}
              learningObjectives={[
                'Follow multi-step instructions',
                'Practice creative drawing',
                'Develop fine motor skills',
                'Have fun with randomization'
              ]}
              parentTeacherTips={[
                'You need a standard 6-sided die',
                'If you don\'t have a die, pick numbers 1-6 randomly',
                'Combine the parts to make a silly creature',
                'Color your monster when you are done!'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-lime-400 animate-gradient-x mb-2" />

              <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                <div className="font-bold text-slate-800 bg-slate-100 p-2 rounded">Roll</div>
                <div className="font-bold text-slate-800 bg-slate-100 p-2 rounded">Body</div>
                <div className="font-bold text-slate-800 bg-slate-100 p-2 rounded">Eyes</div>
                <div className="font-bold text-slate-800 bg-slate-100 p-2 rounded">Mouth</div>

                {[1, 2, 3, 4, 5, 6].map((num, i) => (
                  <Fragment key={num}>
                    <div className="flex items-center justify-center font-bold text-2xl border border-slate-200 rounded">{num}</div>

                    {/* Body */}
                    <div className="flex items-center justify-center border border-slate-200 rounded p-1">
                      <svg viewBox="0 0 240 240" className="w-12 h-12 text-slate-600">
                        <path d={selectedBodies[i].path} fill="none" stroke="currentColor" strokeWidth="4" />
                      </svg>
                    </div>

                    {/* Eyes */}
                    <div className="flex items-center justify-center border border-slate-200 rounded p-1">
                      <svg viewBox="0 0 240 240" className="w-12 h-12 text-slate-600">
                        {selectedEyes[i].path}
                      </svg>
                    </div>

                    {/* Mouth */}
                    <div className="flex items-center justify-center border border-slate-200 rounded p-1">
                      <svg viewBox="0 0 240 240" className="w-12 h-12 text-slate-600">
                        {selectedMouths[i].path}
                      </svg>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="border-2 border-slate-400 rounded-lg h-96 bg-white relative">
                <div className="absolute top-2 left-2 text-slate-300 font-bold text-4xl opacity-20">DRAW HERE</div>
                <div className="absolute bottom-4 left-4 right-4 border-b-2 border-slate-300">
                  <span className="text-slate-400 text-sm">Monster Name:</span>
                </div>
              </div>

              {showAnswersForDoc('design-monster', () => (
                <div className="mt-4 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                  <div className="font-bold text-emerald-900 mb-2">Example Monster</div>
                  <div className="text-sm text-emerald-800 mb-2">Here is one possible combination (Roll 1, 1, 1):</div>
                  <div className="w-32 h-32 border border-emerald-400 bg-white rounded mx-auto relative">
                    <svg viewBox="0 0 240 240" className="w-full h-full text-emerald-600">
                      <path d={selectedBodies[0].path} fill="none" stroke="currentColor" strokeWidth="4" />
                      {selectedEyes[0].path}
                      {selectedMouths[0].path}
                    </svg>
                  </div>
                </div>
              ))}

            </WorksheetSectionWrapper>
          )
        })()}


        {activeDocs.includes('coloring') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)

          // Mandala Generator Logic
          // We will generate a circular pattern with X-fold symmetry
          const symmetry = Math.floor(rng() * 3) * 2 + 6 // 6, 8, or 10 fold
          const layers = 4 + Math.floor(rng() * 3) // 4 to 6 concentric layers

          // Helper to create a path for a single "petal" or segment
          const createSegment = (radius: number, type: number) => {
            // Types of shapes:
            // 0: Petal (elliptical)
            // 1: Diamond
            // 2: Heart-ish
            // 3: Spike
            const angle = (2 * Math.PI) / symmetry
            const w = radius * Math.tan(angle / 2) * 0.8 // Width at widest

            switch (type) {
              case 0: // Petal
                return `M 0,0 Q ${w},${radius * 0.5} 0,${radius} Q ${-w},${radius * 0.5} 0,0`
              case 1: // Diamond
                return `M 0,0 L ${w},${radius * 0.5} L 0,${radius} L ${-w},${radius * 0.5} Z`
              case 2: // Spike
                return `M 0,0 L ${w * 0.5},${radius} L 0,${radius * 0.8} L ${-w * 0.5},${radius} Z`
              case 3: // Round
                return `M 0,${radius * 0.2} A ${w},${radius * 0.4} 0 1,1 0,${radius * 0.2 + 0.01}`
              default:
                return `M 0,0 L 0,${radius}` // Line fallback
            }
          }

          const mandalaLayers = Array.from({ length: layers }).map((_, i) => {
            const r = 40 + (i * 30) // Increasing radius
            const type = Math.floor(rng() * 4)
            const segmentPath = createSegment(r, type)
            return { r, type, segmentPath }
          }).reverse() // Draw outer layers first (painter's algorithm if filled, but for outlining order doesn't matter much)

          return (
            <WorksheetSectionWrapper
              docId="coloring"
              title="Mindful Mandalas"
              emoji={String.fromCodePoint(0x1F300)}
              description="Color the patterns. Mandalas utilize symmetry to create calming designs."
              problemCount={1}
              learningObjectives={[
                'Practice fine motor control',
                'Explore symmetry and patterns',
                'Relax and focus',
                'Express creativity through color'
              ]}
              parentTeacherTips={[
                'Use colored pencils or fine markers',
                'Start from the center and work out',
                'Experiment with alternating colors',
                'Discuss the symmetry (how many matching parts?)'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 animate-gradient-x mb-2" />

              <div className="flex justify-center items-center py-8">
                <svg viewBox="-250 -250 500 500" className="w-[80%] max-w-lg border border-slate-200 rounded-full p-4">
                  {/* Background Circle */}
                  <circle cx="0" cy="0" r="240" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300" />

                  {/* Draw Layers */}
                  {mandalaLayers.map((layer, layerIdx) => (
                    <g key={layerIdx} className="text-slate-800">
                      {Array.from({ length: symmetry }).map((_, i) => (
                        <g key={i} transform={`rotate(${(i * 360) / symmetry})`}>
                          <path d={layer.segmentPath} fill="none" stroke="currentColor" strokeWidth="1.5" />
                          {/* Optional inner details */}
                          {layerIdx % 2 === 0 && (
                            <circle cx="0" cy={layer.r} r="3" fill="none" stroke="currentColor" strokeWidth="1" />
                          )}
                        </g>
                      ))}
                    </g>
                  ))}

                  {/* Center */}
                  <circle cx="0" cy="0" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-800" />
                </svg>
              </div>

              {showAnswersForDoc('coloring', () => (
                <div className="mt-4 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                  <div className="font-bold text-emerald-900 mb-2">About Mandalas</div>
                  <div className="text-sm text-emerald-800">
                    "Mandala" means "circle" in Sanskrit. They represent wholeness and balance. Since this one is procedurally generated, it is unique to this worksheet!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        })()}

        {activeDocs.includes('draw-half') && (() => {
          const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
          const problems = Array.from({ length: 6 }).map((_, i) => {
            // Generate random points for the left side
            const cx = 110
            const h = 220
            const numPoints = 3 + Math.floor(rng() * 3) // 3 to 5 internal points
            // Bias towards straight lines for easier drawing, but include some curves
            const type = rng() > 0.4 ? 'line' : 'curve'

            const points: { x: number, y: number }[] = []

            // Start (Top Center)
            points.push({ x: cx, y: 20 + rng() * 20 })

            const yStep = (h - 40) / (numPoints + 1)

            // Middle Points (Left Side)
            for (let j = 1; j <= numPoints; j++) {
              const yBase = 20 + (j * yStep)
              const y = yBase + (rng() * 20 - 10)
              const x = 20 + rng() * 70 // 20 to 90
              points.push({ x, y })
            }

            // End (Bottom Center)
            points.push({ x: cx, y: h - 20 - rng() * 20 })

            // Generate Path Data
            let fullD = `M ${points[0].x} ${points[0].y}`

            // Store geometry for mirroring
            const segments: any[] = []

            for (let j = 0; j < points.length - 1; j++) {
              const p1 = points[j]
              const p2 = points[j + 1]
              if (type === 'curve') {
                // Use a control point that pulls "outward" (left)
                const cpX = Math.min(p1.x, p2.x) - (10 + rng() * 30)
                const cpY = p1.y + (p2.y - p1.y) / 2
                segments.push({ type: 'Q', p1, p2, cp: { x: cpX, y: cpY } })
                fullD += ` Q ${cpX} ${cpY}, ${p2.x} ${p2.y}`
              } else {
                segments.push({ type: 'L', p1, p2 })
                fullD += ` L ${p2.x} ${p2.y}`
              }
            }

            // Mirror back up
            for (let j = segments.length - 1; j >= 0; j--) {
              const seg = segments[j]
              const target = seg.p1
              const mirrorTargetX = cx + (cx - target.x)

              if (seg.type === 'curve') {
                const mirrorCpX = cx + (cx - seg.cp.x)
                fullD += ` Q ${mirrorCpX} ${seg.cp.y}, ${mirrorTargetX} ${target.y}`
              } else {
                fullD += ` L ${mirrorTargetX} ${target.y}`
              }
            }

            fullD += ' Z' // Close loop
            return fullD
          })

          return (
            <WorksheetSectionWrapper
              docId="draw-half"
              title="Symmetry Drawing"
              emoji="🦋"
              description="Complete the picture by drawing the missing half. The shapes are random every time!"
              problemCount={6}
              learningObjectives={[
                'Practice symmetry and mirroring',
                'Develop spatial reasoning',
                'Improve fine motor control'
              ]}
              parentTeacherTips={[
                'Start by marking the key points (corners) on the empty side.',
                'Connect the dots to form the shape.',
                'Count the grid squares to ensure accuracy.'
              ]}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {problems.map((dPath, i) => (
                  <svg key={i} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`grid-${i}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`clip-${i}`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#grid-${i})`} />

                    {/* The Shape (Left Side Only visible initially) */}
                    <g clipPath={`url(#clip-${i})`}>
                      <path d={dPath} fill="none" stroke="#111827" strokeWidth="3" />
                      <path d={dPath} fill="#eff6ff" fillOpacity="0.5" stroke="none" />
                    </g>

                    {/* Dashed Center Line */}
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" strokeWidth="2" />

                    {/* Answer Key (Ghost Line) */}
                    {showAnswersForDoc('draw-half', () => (
                      <path d={dPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
                    ))}
                  </svg>
                ))}
              </div>
            </WorksheetSectionWrapper>
          )
        })()}




        {
          activeDocs.includes('hidden-object') && (
            <WorksheetSectionWrapper
              docId="hidden-object"
              title="Find the Hidden Object"
              emoji={String.fromCodePoint(0x1F50D)}
              description="Find and circle each item hidden in the scene below."
              problemCount={5}
              learningObjectives={[
                'Practice observation skills',
                'Develop attention to detail',
                'Practice visual scanning'
              ]}
              parentTeacherTips={[
                'Look carefully at the whole picture',
                'Take your time - objects can be hidden in plain sight',
                'Help children if they get stuck',
                'Extension: Create your own hidden object scene'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              {/* Worked Example */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-base"><strong>Problem:</strong> Find the hidden objects in the scene</div>
                  <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                    <div><strong>Step 1:</strong> Read the list of objects to find</div>
                    <div><strong>Step 2:</strong> Look carefully at the whole picture</div>
                    <div><strong>Step 3:</strong> Scan from top to bottom, left to right</div>
                    <div><strong>Step 4:</strong> Circle each object when you find it</div>
                    <div className="font-semibold text-blue-900"><strong>Answer:</strong> Objects can be hidden in plain sight - look carefully!</div>
                    <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                  </div>
                </div>
              </div>
              <div className="mb-3 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                <HiddenObjectsSceneSVGA />
              </div>
              <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                {['Key', 'Apple', 'Star', 'Leaf', 'Car', 'Book', 'Shell', 'Cloud', 'Ball', 'Hat'].map((x) => (<li key={x}>{String.fromCodePoint(0x270F)}</li>))}
              </ul>
              {/* Extension/Challenge Problems */}
              <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                  <div>1. Can you find all objects in under 2 minutes?</div>
                  <div>2. Create your own hidden object scene</div>
                  <div>3. Describe where each object is hidden</div>
                </div>
              </div>
              {/* Self-Assessment */}
              <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                  <div>{String.fromCodePoint(0x270F)}</div>
                  <div>{String.fromCodePoint(0x270F)}</div>
                  <div>{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="mt-3 text-xs">
                  <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 10
                </div>
                <div className="mt-2 text-xs">
                  <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
              </div>
              {showAnswersForDoc('hidden-object', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    <div className="mb-2">Find and circle these objects in the scene:</div>
                    <div><strong>Key, Apple, Star, Leaf, Car, Book, Shell, Cloud, Ball, Hat</strong></div>
                    <div className="text-xs text-emerald-700 mt-2">{String.fromCodePoint(0x279C)}</div>
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('maze-focus') && (
            <WorksheetSectionWrapper
              docId="maze-focus"
              title="Maze of Focus"
              emoji={String.fromCodePoint(0x1F300)}
              description="Follow the steps from START to FINISH. Skip distractions!"
              problemCount={1}
              learningObjectives={[
                'Practice focus and attention',
                'Learn to skip distractions',
                'Build self-regulation skills'
              ]}
              parentTeacherTips={[
                'Help children identify distractions',
                'Encourage taking breaks when needed',
                'Celebrate small wins along the way',
                'Extension: Create your own focus maze'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-4 gap-2 text-sm break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {['START', 'Deep breath', 'Phone buzz (skip)', 'One step', 'Snack break', 'Water sip', 'Chit-chat (skip)', 'Stretch', 'Refocus', 'Tiny goal', 'Timer 10 min', 'FINISH', ' Great job!'].map((t, i) => (
                  <div key={i} className={`h-12 border rounded flex items-center justify-center ${/skip/i.test(t) ? 'bg-slate-50 text-slate-400' : 'bg-white'}`}>{t}</div>
                ))}
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
                <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                  <div className="font-semibold text-slate-800 mb-2">Progress checklist</div>
                  <ul className="space-y-1 text-slate-700">
                    <li><span className="inline-block w-4 h-4 border border-slate-400 rounded mr-2" />Clear workspace</li>
                    <li><span className="inline-block w-4 h-4 border border-slate-400 rounded mr-2" />Turn off distractions</li>
                    <li><span className="inline-block w-4 h-4 border border-slate-400 rounded mr-2" />Take a deep breath</li>
                  </ul>
                </div>
                <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                  <div className="font-semibold text-slate-800 mb-2">Set your timer</div>
                  <div className="h-10 border-b-3 border-slate-600" />
                  <div className="mt-3 font-semibold text-slate-800 mb-1">Reward</div>
                  <div className="h-10 border-b-3 border-slate-600" />
                </div>
                <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                  <div className="font-semibold text-slate-800 mb-2">Notes</div>
                  <div className="h-10 border-b-3 border-slate-600 mb-2" />
                  <div className="h-10 border-b-3 border-slate-600 mb-2" />
                  <div className="h-6 border-b border-slate-300" />
                </div>
              </div>
              {showAnswersForDoc('maze-focus', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    Follow the path from START to FINISH, skipping the distractions (marked with "skip"). The path should be: START  Deep breath  One step  Water sip  Stretch  Refocus  Tiny goal  Timer 10 min  FINISH   Great job!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('gratitude-jar') && (
            <WorksheetSectionWrapper
              docId="gratitude-jar"
              title="Gratitude Jar"
              emoji={String.fromCodePoint(0x1F64F)}
              description="Write or draw one thing you're thankful for in each circle."
              problemCount={18}
              learningObjectives={[
                'Practice gratitude and mindfulness',
                'Express thankfulness',
                'Build positive thinking habits'
              ]}
              parentTeacherTips={[
                'Help children think of things they are grateful for',
                'Encourage both big and small things',
                'Make this a daily or weekly practice',
                'Extension: Share your gratitude with others'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <h2 className="text-lg font-bold text-slate-900">{String.fromCodePoint(0x270F)}</h2>
              <p className="text-slate-600 text-sm mb-3">{String.fromCodePoint(0x270F)}</p>
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" className="w-full h-auto bg-white border border-slate-300">
                <g fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
                  <path d="M120 70 H280" />
                  <path d="M140 70 C140 40, 260 40, 260 70" />
                  <path d="M130 70 C120 140, 120 320, 200 360 C280 320, 280 140, 270 70" />
                </g>
                {Array.from({ length: 18 }).map((_, i) => {
                  const col = i % 6
                  const row = Math.floor(i / 6)
                  const cx = 70 + col * 50
                  const cy = 110 + row * 60
                  return <circle key={i} cx={cx} cy={cy} r={18} stroke="#9ca3af" fill="none" vectorEffect="non-scaling-stroke" />
                })}
              </svg>
              {showAnswersForDoc('gratitude-jar', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There's no right or wrong answer! Write or draw things you're grateful for in each circle. Examples: family, friends, pets, favorite foods, toys, activities, nature, etc. Be creative and think of both big and small things!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('mood-tracker') && (
            <WorksheetSectionWrapper
              docId="mood-tracker"
              title="Mood Tracker"
              emoji={String.fromCodePoint(0x1F60C)}
              description="Color each day based on your mood. Use your own color legend."
              problemCount={7}
              learningObjectives={[
                'Track and identify emotions',
                'Practice self-awareness',
                'Understand mood patterns'
              ]}
              parentTeacherTips={[
                'Help children identify their moods',
                'All moods are valid and important',
                'Use this to start conversations about feelings',
                'Extension: Look for patterns in your moods'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <table className="w-full border border-slate-300">
                <thead>
                  <tr className="bg-slate-50 text-sm">
                    <th className="border border-slate-300 px-2 py-1 text-left">Day</th>
                    <th className="border border-slate-300 px-2 py-1 text-left">How I felt</th>
                    <th className="border border-slate-300 px-2 py-1 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <tr key={d} className="h-10">
                      <td className="border border-slate-300 px-2">{d}</td>
                      <td className="border border-slate-300" />
                      <td className="border border-slate-300" />
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAnswersForDoc('mood-tracker', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There's no right or wrong answer! Color each day based on how you felt. Create your own color legend (e.g., red = happy, blue = calm, yellow = excited). All moods are valid and important to track!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('mandalas') && (
            <WorksheetSectionWrapper
              docId="mandalas"
              title="Mindful Coloring Mandalas"
              emoji={String.fromCodePoint(0x1F308)}
              description="Color slowly. Start from the center and move outward."
              problemCount={1}
              learningObjectives={[
                'Practice mindfulness and relaxation',
                'Develop focus and attention',
                'Express creativity through coloring'
              ]}
              parentTeacherTips={[
                'Start from the center and work outward',
                'Take your time - there is no rush',
                'Use colors that make you feel calm',
                'Extension: Create your own mandala design'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <svg viewBox="0 0 400 400" className="w-full h-auto bg-white border border-slate-300">
                <g fill="none" stroke="#111827" strokeWidth="2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <circle key={i} cx={200} cy={200} r={30 + i * 25} />
                  ))}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const ang = (i / 12) * Math.PI * 2
                    const x1 = 200 + Math.cos(ang) * 40
                    const y1 = 200 + Math.sin(ang) * 40
                    const x2 = 200 + Math.cos(ang) * 160
                    const y2 = 200 + Math.sin(ang) * 160
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                  })}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const ang = (i / 8) * Math.PI * 2
                    const r = 110
                    const x = 200 + Math.cos(ang) * r
                    const y = 200 + Math.sin(ang) * r
                    return <polygon key={i} points={`${x},${y} ${x + 8},${y + 14} ${x - 8},${y + 14}`} />
                  })}
                </g>
              </svg>
              {showAnswersForDoc('mandalas', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Start from the center and work outward. Use colors that make you feel calm and happy. Take your time and enjoy the process!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('weekly-goals') && (
            <WorksheetSectionWrapper
              docId="weekly-goals"
              title="My Goals for the Week"
              emoji={String.fromCodePoint(0x1F3AF)}
              description="Write 3 goals, 1 thing to try, and 1 thing you're proud of."
              problemCount={5}
              learningObjectives={[
                'Set achievable goals',
                'Practice self-reflection',
                'Build planning skills'
              ]}
              parentTeacherTips={[
                'Help children set realistic, achievable goals',
                'Celebrate what they are proud of',
                'Encourage trying new things',
                'Extension: Review goals at the end of the week'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <h2 className="text-lg font-bold text-slate-900">{String.fromCodePoint(0x270F)}</h2>
              <p className="text-slate-600 text-sm mb-3">{String.fromCodePoint(0x270F)}</p>
              {['Goal 1', 'Goal 2', 'Goal 3', 'Try this', 'Proud of'].map((t, i) => (
                <div key={i} className="mb-3">
                  <div className="text-sm font-semibold text-slate-800">{t}</div>
                  <div className="h-10 border-b-3 border-slate-600" />
                </div>
              ))}
              {showAnswersForDoc('weekly-goals', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There's no right or wrong answer! Write your own goals, something new to try, and something you're proud of. Examples: Goals - finish homework, help at home, read a book; Try - a new sport, cooking, art; Proud of - learning something new, helping a friend, etc.
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('halloween-pack') && (
            <WorksheetSectionWrapper
              docId="halloween-pack"
              title="Halloween Puzzle Pack"
              emoji={String.fromCodePoint(0x1F383)}
              description="Mini pack: word list + costume ideas + tiny maze."
              problemCount={1}
              learningObjectives={[
                'Build vocabulary with Halloween words',
                'Practice creative thinking with costume ideas',
                'Develop problem-solving with maze navigation'
              ]}
              parentTeacherTips={[
                'Help children sound out the Halloween words',
                'Encourage creative costume ideas',
                'Guide children through the maze if needed',
                'Extension: Create your own Halloween word list'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="font-semibold mb-1">Spooky Word List</div>
                  <ul className="list-disc list-inside space-y-1">
                    {['ghost', 'pumpkin', 'witch', 'bat', 'candy', 'mask', 'moon', 'owl'].map(w => <li key={w}>{w}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-1">Costume Idea Box</div>
                  <div className="h-32 border border-dashed border-slate-400 rounded" />
                </div>
              </div>
              <div className="mt-6 hidden" aria-hidden>
                <div className="font-semibold mb-1 text-sm">Tiny Maze</div>
                {(() => {
                  // Generated mini-maze (10x10) with far-edge FINISH; true openings at START/FINISH
                  const cols = 10, rows = 10;
                  const cellSize = 20;
                  const pad = 14; // padding inside SVG
                  const svgW = cols * cellSize + pad * 2;
                  const svgH = rows * cellSize + pad * 2;
                  type Walls = { t: boolean; r: boolean; b: boolean; l: boolean };
                  const cells: Walls[] = Array.from({ length: cols * rows }, () => ({ t: true, r: true, b: true, l: true }));
                  const visited = new Array(cols * rows).fill(false) as boolean[];
                  const idx = (x: number, y: number) => y * cols + x;
                  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
                  // Depth-first backtracker (deterministic neighbor order)
                  const stack: number[] = [0];
                  visited[0] = true;
                  while (stack.length) {
                    const cur = stack[stack.length - 1];
                    const cx = cur % cols;
                    const cy = Math.floor(cur / cols);
                    const order: Array<{ x: number; y: number; dir: 't' | 'r' | 'b' | 'l' }> = [
                      { x: cx, y: cy - 1, dir: 't' },
                      { x: cx + 1, y: cy, dir: 'r' },
                      { x: cx, y: cy + 1, dir: 'b' },
                      { x: cx - 1, y: cy, dir: 'l' }
                    ];
                    const neigh = order.filter(n => inBounds(n.x, n.y) && !visited[idx(n.x, n.y)]);
                    if (!neigh.length) { stack.pop(); continue; }
                    const next = neigh[0];
                    const ni = idx(next.x, next.y);
                    if (next.dir === 't') { cells[cur].t = false; cells[ni].b = false; }
                    if (next.dir === 'r') { cells[cur].r = false; cells[ni].l = false; }
                    if (next.dir === 'b') { cells[cur].b = false; cells[ni].t = false; }
                    if (next.dir === 'l') { cells[cur].l = false; cells[ni].r = false; }
                    visited[ni] = true;
                    stack.push(ni);
                  }
                  // BFS to pick farthest border cell (right/bottom) as FINISH
                  const dist = new Array(cols * rows).fill(Infinity) as number[];
                  const q: number[] = [];
                  dist[0] = 0; q.push(0);
                  while (q.length) {
                    const cur = q.shift()!;
                    const cx = cur % cols; const cy = Math.floor(cur / cols);
                    const here = cells[cur];
                    const tryPush = (nx: number, ny: number, open: boolean) => {
                      if (!open || !inBounds(nx, ny)) return;
                      const ni = idx(nx, ny);
                      if (dist[ni] !== Infinity) return;
                      dist[ni] = dist[cur] + 1; q.push(ni);
                    };
                    tryPush(cx, cy - 1, !here.t);
                    tryPush(cx + 1, cy, !here.r ? true : false);
                    tryPush(cx, cy + 1, !here.b);
                    tryPush(cx - 1, cy, !here.l);
                  }
                  let exitI = cols * rows - 1; let maxD = -1;
                  for (let y = 0; y < rows; y++) {
                    const iRight = idx(cols - 1, y); if (dist[iRight] > maxD) { maxD = dist[iRight]; exitI = iRight; }
                  }
                  for (let x = 0; x < cols; x++) {
                    const iBottom = idx(x, rows - 1); if (dist[iBottom] > maxD) { maxD = dist[iBottom]; exitI = iBottom; }
                  }
                  const exitX = exitI % cols; const exitY = Math.floor(exitI / cols);
                  const exitSide: 'right' | 'bottom' = exitX === cols - 1 ? 'right' : 'bottom';
                  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
                  for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                      const c = cells[idx(x, y)];
                      const x0 = pad + x * cellSize;
                      const y0 = pad + y * cellSize;
                      const x1 = x0 + cellSize;
                      const y1 = y0 + cellSize;
                      const isStart = x === 0 && y === 0;
                      const isExitCell = x === exitX && y === exitY;
                      if (c.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                      if (c.l && !isStart) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                      if (c.b && !(isExitCell && exitSide === 'bottom')) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                      if (c.r && !(isExitCell && exitSide === 'right')) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
                    }
                  }
                  return (
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md bg-white border border-slate-300 rounded">
                      {/* outer border with openings at START and computed FINISH */}
                      <g stroke="#334155" strokeWidth={4} strokeLinecap="round">
                        {/* top border */}
                        <line x1={pad} y1={pad} x2={pad + cols * cellSize} y2={pad} />
                        {/* left border (skip start opening) */}
                        <line x1={pad} y1={pad + cellSize} x2={pad} y2={pad + rows * cellSize} />
                        {/* right border with optional gap for FINISH */}
                        {exitSide === 'right' ? (
                          <>
                            <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + exitY * cellSize} />
                            <line x1={pad + cols * cellSize} y1={pad + (exitY + 1) * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                          </>
                        ) : (
                          <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                        )}
                        {/* bottom border with optional gap for FINISH */}
                        {exitSide === 'bottom' ? (
                          <>
                            <line x1={pad} y1={pad + rows * cellSize} x2={pad + exitX * cellSize} y2={pad + rows * cellSize} />
                            <line x1={pad + (exitX + 1) * cellSize} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                          </>
                        ) : (
                          <line x1={pad} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                        )}
                      </g>
                      {/* maze walls */}
                      {lines.map((l, i) => (
                        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
                      ))}
                      {/* labels */}
                      <text x={pad - 6} y={pad - 8} fontSize="12" fill="#10B981" fontWeight={700}>START</text>
                      {exitSide === 'right' ? (
                        <text x={svgW - (pad - 8)} y={pad + exitY * cellSize + cellSize * 0.6} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="end">FINISH</text>
                      ) : (
                        <text x={pad + exitX * cellSize + cellSize * 0.5} y={svgH - (pad - 6)} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="middle">FINISH</text>
                      )}
                    </svg>
                  );
                })()}
              </div>
              {showAnswersForDoc('halloween-pack', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    <div className="mb-2"><strong>Spooky Word List:</strong> ghost, pumpkin, witch, bat, candy, mask, moon, owl</div>
                    <div className="mb-2"><strong>Costume Ideas:</strong> Be creative! Draw or write your costume ideas in the box.</div>
                    <div><strong>Maze:</strong> Follow the path from START to FINISH. There is one correct path through the maze!</div>
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('winter-kindness') && (
            <WorksheetSectionWrapper
              docId="winter-kindness"
              title="Winter Kindness Challenge"
              emoji={String.fromCodePoint(0x2744)}
              description="Color a square each time you complete a kind act."
              problemCount={25}
              learningObjectives={[
                'Practice kindness and empathy',
                'Track acts of kindness',
                'Build positive habits'
              ]}
              parentTeacherTips={[
                'Help children identify kind acts they can do',
                'Celebrate each act of kindness',
                'Encourage daily practice',
                'Extension: Share your kindness stories'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="h-10 border border-slate-300 rounded text-[10px] p-1">Act #{i + 1}</div>
                ))}
              </div>
              {showAnswersForDoc('winter-kindness', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong answer! Color a square each time you complete a kind act. Examples: helping someone, sharing, saying thank you, giving a compliment, helping with chores, etc. Keep track of your kindness acts!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('spring-scavenger') && (
            <WorksheetSectionWrapper
              docId="spring-scavenger"
              title="Spring Nature Scavenger Hunt"
              emoji={String.fromCodePoint(0x1F338)}
              description="Go outside and check off what you discover."
              problemCount={10}
              learningObjectives={[
                'Observe nature and surroundings',
                'Practice attention to detail',
                'Learn about spring nature'
              ]}
              parentTeacherTips={[
                'Go outside with children to explore',
                'Help identify items if needed',
                'Encourage careful observation',
                'Extension: Take photos of what you find'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-green-400 animate-gradient-x mb-2" />
              <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                {['Leaf with spots', 'Pink flower', 'Three smooth stones', 'Ant trail', 'Bird feather', 'Cloud shaped like an animal', 'Two kinds of grass', 'Buzzing insect', 'Tiny pinecone', 'Something yellow'].map(x => <li key={x}>{String.fromCodePoint(0x270F)}</li>)}
              </ul>
              {showAnswersForDoc('spring-scavenger', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    Check off each item as you find it outside! Look carefully - some items might be small. Have fun exploring nature!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('summer-pack') && (
            <WorksheetSectionWrapper
              docId="summer-pack"
              title="Summer Adventure Pack"
              emoji={String.fromCodePoint(0x2600)}
              description="A quick set for travel days: word list + maze box + drawing prompt."
              problemCount={1}
              learningObjectives={[
                'Build summer vocabulary',
                'Practice problem-solving with mazes',
                'Express creativity through drawing'
              ]}
              parentTeacherTips={[
                'Help children read the summer words',
                'Guide through the maze if needed',
                'Encourage creative drawing',
                'Extension: Create your own summer word list'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  {['beach', 'shell', 'sand', 'wave', 'sun', 'boat', 'crab', 'icecream'].map(w => <li key={w}>{w}</li>)}
                </ul>
                <div className="h-24 border border-dashed border-slate-400 rounded" />
                <div>
                  <div className="font-semibold mb-1">Draw: Your best summer day</div>
                  <div className="h-24 border border-slate-300 rounded" />
                </div>
              </div>
              {showAnswersForDoc('summer-pack', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    <div className="mb-2"><strong>Summer Words:</strong> beach, shell, sand, wave, sun, boat, crab, icecream</div>
                    <div className="mb-2"><strong>Maze:</strong> Draw your path through the maze in the box.</div>
                    <div><strong>Drawing:</strong> Be creative! Draw your best summer day in the box.</div>
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('brain-boost') && (
            <WorksheetSectionWrapper
              docId="brain-boost"
              title="7-Day Brain Boost Pack"
              emoji={String.fromCodePoint(0x1F9E0)}
              description="Do one mini-challenge each day. Track your streak!"
              problemCount={7}
              learningObjectives={[
                'Build daily learning habits',
                'Practice various cognitive skills',
                'Track progress and build streaks'
              ]}
              parentTeacherTips={[
                'Help children complete one challenge per day',
                'Celebrate completing the streak',
                'Encourage reflection on what was tricky',
                'Extension: Create your own daily challenges'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {['Memory pairs', 'Word jumble', 'Counting maze', 'Pattern copy', 'Quick sudoku', 'Riddle time', 'Spot the change'].map((t, i) => <li key={i}>{t}</li>)}
              </ol>
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-800 mb-2">Streak tracker</div>
                <table className="w-full border border-slate-300 text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <th key={d} className="border border-slate-300 px-2 py-1 text-center">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Array.from({ length: 7 }).map((_, i) => (
                        <td key={i} className="border border-slate-300 h-8 text-center align-middle">{String.fromCodePoint(0x279C)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 mb-1">What was tricky?</div>
                    <div className="h-6 border-b border-slate-400 mb-1" />
                    <div className="h-10 border-b-3 border-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 mb-1">What I nailed</div>
                    <div className="h-6 border-b border-slate-400 mb-1" />
                    <div className="h-10 border-b-3 border-slate-600" />
                  </div>
                </div>
              </div>
              {showAnswersForDoc('brain-boost', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    Complete one challenge each day and check it off in the streak tracker. Challenges: Memory pairs, Word jumble, Counting maze, Pattern copy, Quick sudoku, Riddle time, Spot the change. Track your progress and reflect on what was tricky and what you nailed!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('creative-challenge') && (
            <WorksheetSectionWrapper
              docId="creative-challenge"
              title="Creative Kids Challenge"
              emoji={String.fromCodePoint(0x1F4D1)}
              description="7 days of quick art prompts. Spend 510 minutes each."
              problemCount={7}
              learningObjectives={[
                'Express creativity through art',
                'Practice daily creative habits',
                'Develop artistic skills'
              ]}
              parentTeacherTips={[
                'Encourage children to try each prompt',
                'Focus on creativity, not perfection',
                'Celebrate their unique creations',
                'Extension: Create your own art prompts'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {['Draw a robot pet', 'Design a flag', 'Invent a snack package', 'Doodle your name in 3 styles', 'Sketch a tiny house', 'Create a new animal', 'Make a comic in 3 panels'].map((t, i) => <li key={i}>{t}</li>)}
              </ol>
              {showAnswersForDoc('creative-challenge', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong answer! Complete each creative prompt with your own unique ideas. Spend 5-10 minutes on each one. Be creative and have fun!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('ws-world') && (
            <WorksheetSectionWrapper
              docId="ws-world"
              title="Around the World Word Search"
              emoji={String.fromCodePoint(0x1F30D)}
              description="Find all the world words hidden in the grid. Use the clue list to track your progress."
              problemCount={11}
              learningObjectives={[
                'Build geography vocabulary',
                'Practice pattern recognition',
                'Develop attention to detail'
              ]}
              parentTeacherTips={[
                'Help children read the clue words',
                'Look for words horizontally, vertically, and diagonally',
                'Check off words as you find them',
                'Extension: Create your own word search'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 animate-gradient-x mb-2" />
              {(() => {
                const words = ['PARIS', 'NILE', 'AFRICA', 'ASIA', 'ALPS', 'TOKYO', 'ITALY', 'NORTH', 'SOUTH', 'RIO', 'BERLIN']
                return (
                  <div className="md:flex md:items-start md:gap-6">
                    <div className="flex-1">
                      <div className="grid grid-cols-12 gap-[2px] font-mono text-sm bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
                        {generateWordSearchGrid(12, [...words], makeRng(`${effectiveSeed}|ws-world|main|v${variant}`)).map((row, r) => (
                          <Fragment key={r}>
                            {row.map((ch, c) => (
                              <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center rounded-sm">{ch}</div>
                            ))}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:w-64 border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                      <div className="text-sm font-semibold text-slate-800 mb-2">Clue words</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {words.map(w => (<li key={w}>{String.fromCodePoint(0x270F)}</li>))}
                      </ul>
                    </div>
                  </div>
                )
              })()}
              {showAnswersForDoc('ws-world', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    Find all 11 words in the grid: PARIS, NILE, AFRICA, ASIA, ALPS, TOKYO, ITALY, NORTH, SOUTH, RIO, BERLIN. Words can be found horizontally, vertically, or diagonally. Check off each word as you find it!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('animal-pack') && (
            <WorksheetSectionWrapper
              docId="animal-pack"
              title="Animal Adventure Pack"
              emoji={String.fromCodePoint(0x1F43E)}
              description="Mix of animal-themed puzzles to print and enjoy."
              problemCount={1}
              learningObjectives={[
                'Learn about different animals',
                'Practice problem-solving with mazes',
                'Build vocabulary with animal words'
              ]}
              parentTeacherTips={[
                'Help children identify the animals',
                'Guide through the maze if needed',
                'Encourage reading the animal words',
                'Extension: Create your own animal puzzle'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 animate-gradient-x mb-2" />
              <div className="grid md:grid-cols-2 gap-4">
                {/* Mini maze */}
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-2">Mini maze: Help the cub reach its den</div>
                  {(() => {
                    // Harder mini-maze (10x10) with farthest-edge DEN from START (0,0)
                    const cols = 10, rows = 10;
                    const cellSize = 20;
                    const pad = 14;
                    const svgW = cols * cellSize + pad * 2;
                    const svgH = rows * cellSize + pad * 2;
                    type Walls = { t: boolean; r: boolean; b: boolean; l: boolean };
                    const cells: Walls[] = Array.from({ length: cols * rows }, () => ({ t: true, r: true, b: true, l: true }));
                    const visited = new Array(cols * rows).fill(false) as boolean[];
                    const idx = (x: number, y: number) => y * cols + x;
                    const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
                    // Depth-first backtracker (deterministic neighbor order)
                    const stack: number[] = [0];
                    visited[0] = true;
                    while (stack.length) {
                      const cur = stack[stack.length - 1];
                      const cx = cur % cols; const cy = Math.floor(cur / cols);
                      const order: Array<{ x: number; y: number; dir: 't' | 'r' | 'b' | 'l' }> = [
                        { x: cx, y: cy - 1, dir: 't' },
                        { x: cx + 1, y: cy, dir: 'r' },
                        { x: cx, y: cy + 1, dir: 'b' },
                        { x: cx - 1, y: cy, dir: 'l' }
                      ];
                      const neigh = order.filter(n => inBounds(n.x, n.y) && !visited[idx(n.x, n.y)]);
                      if (!neigh.length) { stack.pop(); continue; }
                      const next = neigh[0];
                      const ni = idx(next.x, next.y);
                      if (next.dir === 't') { cells[cur].t = false; cells[ni].b = false; }
                      if (next.dir === 'r') { cells[cur].r = false; cells[ni].l = false; }
                      if (next.dir === 'b') { cells[cur].b = false; cells[ni].t = false; }
                      if (next.dir === 'l') { cells[cur].l = false; cells[ni].r = false; }
                      visited[ni] = true;
                      stack.push(ni);
                    }
                    // BFS to locate farthest border cell on right/bottom
                    const dist = new Array(cols * rows).fill(Infinity) as number[];
                    const q: number[] = [];
                    dist[0] = 0; q.push(0);
                    while (q.length) {
                      const cur = q.shift()!;
                      const cx = cur % cols; const cy = Math.floor(cur / cols);
                      const here = cells[cur];
                      const tryPush = (nx: number, ny: number, open: boolean) => {
                        if (!open || !inBounds(nx, ny)) return;
                        const ni = idx(nx, ny);
                        if (dist[ni] !== Infinity) return;
                        dist[ni] = dist[cur] + 1; q.push(ni);
                      };
                      tryPush(cx, cy - 1, !here.t);
                      tryPush(cx + 1, cy, !here.r ? true : false);
                      tryPush(cx, cy + 1, !here.b);
                      tryPush(cx - 1, cy, !here.l);
                    }
                    let exitI = cols * rows - 1; let maxD = -1;
                    for (let y = 0; y < rows; y++) {
                      const iRight = idx(cols - 1, y); if (dist[iRight] > maxD) { maxD = dist[iRight]; exitI = iRight; }
                    }
                    for (let x = 0; x < cols; x++) {
                      const iBottom = idx(x, rows - 1); if (dist[iBottom] > maxD) { maxD = dist[iBottom]; exitI = iBottom; }
                    }
                    const exitX = exitI % cols; const exitY = Math.floor(exitI / cols);
                    const exitSide: 'right' | 'bottom' = exitX === cols - 1 ? 'right' : 'bottom';
                    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
                    for (let y = 0; y < rows; y++) {
                      for (let x = 0; x < cols; x++) {
                        const c = cells[idx(x, y)];
                        const x0 = pad + x * cellSize; const y0 = pad + y * cellSize;
                        const x1 = x0 + cellSize; const y1 = y0 + cellSize;
                        const isStart = x === 0 && y === 0;
                        const isExitCell = x === exitX && y === exitY;
                        if (c.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                        if (c.l && !isStart) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                        if (c.b && !(isExitCell && exitSide === 'bottom')) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                        if (c.r && !(isExitCell && exitSide === 'right')) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
                      }
                    }
                    return (
                      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md bg-white border border-slate-300 rounded">
                        {/* outer border with openings at START and computed DEN */}
                        <g stroke="#334155" strokeWidth={4} strokeLinecap="round">
                          {/* top border */}
                          <line x1={pad} y1={pad} x2={pad + cols * cellSize} y2={pad} />
                          {/* left border (skip start opening) */}
                          <line x1={pad} y1={pad + cellSize} x2={pad} y2={pad + rows * cellSize} />
                          {/* right border with optional gap for DEN */}
                          {exitSide === 'right' ? (
                            <>
                              <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + exitY * cellSize} />
                              <line x1={pad + cols * cellSize} y1={pad + (exitY + 1) * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                            </>
                          ) : (
                            <line x1={pad + cols * cellSize} y1={pad} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                          )}
                          {/* bottom border with optional gap for DEN */}
                          {exitSide === 'bottom' ? (
                            <>
                              <line x1={pad} y1={pad + rows * cellSize} x2={pad + exitX * cellSize} y2={pad + rows * cellSize} />
                              <line x1={pad + (exitX + 1) * cellSize} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                            </>
                          ) : (
                            <line x1={pad} y1={pad + rows * cellSize} x2={pad + cols * cellSize} y2={pad + rows * cellSize} />
                          )}
                        </g>
                        {/* maze walls */}
                        {lines.map((l, i) => (
                          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
                        ))}
                        {/* labels */}
                        <text x={pad - 6} y={pad - 8} fontSize="12" fill="#10B981" fontWeight={700}>START</text>
                        {exitSide === 'right' ? (
                          <text x={svgW - (pad - 8)} y={pad + exitY * cellSize + cellSize * 0.6} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="end">DEN</text>
                        ) : (
                          <text x={pad + exitX * cellSize + cellSize * 0.5} y={svgH - (pad - 6)} fontSize="12" fill="#ef4444" fontWeight={700} textAnchor="middle">DEN</text>
                        )}
                      </svg>
                    );
                  })()}
                </div>
                {/* Word list with checkboxes */}
                <div className="md:pl-2">
                  <div className="text-sm font-semibold text-slate-800 mb-2">Word list</div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                    <ul className="text-sm text-slate-700 space-y-1 columns-2 md:columns-1">
                      {['lion', 'zebra', 'panda', 'eagle', 'whale', 'koala'].map(w => (
                        <li key={w}>{String.fromCodePoint(0x270F)}</li>
                      ))}
                    </ul>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold text-slate-800 mb-1">Pick two animals to combine</div>
                      <div className="flex items-center gap-3 mb-1">
                        <span>{String.fromCodePoint(0x270F)}</span>
                        <div className="flex-1 border-b border-slate-400" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{String.fromCodePoint(0x279C)}</span>
                        <div className="flex-1 border-b border-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Draw challenge */}
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-800 mb-2">Draw challenge: Create your own creature</div>
                <div className="h-64 sm:h-72 print:h-[26rem] border border-slate-300 rounded bg-white" />
                <div className="mt-2 text-sm font-semibold text-slate-800">Creature name</div>
                <div className="h-6 border-b border-slate-400" />
              </div>
              {showAnswersForDoc('animal-pack', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    <div className="mb-2"><strong>Maze:</strong> Follow the path from START to DEN. There is one correct path!</div>
                    <div className="mb-2"><strong>Animal Words:</strong> lion, zebra, panda, eagle, whale, koala</div>
                    <div><strong>Creature Drawing:</strong> Be creative! Combine two animals and draw your own creature!</div>
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          (!doc || activeDocs.includes('ws-animals')) && (
            <WorksheetSectionWrapper
              docId="ws-animals"
              title="Word Search  Animals"
              emoji={String.fromCodePoint(0x1F43E)}
              description="Find 12 animal names. Circle horizontally, vertically, or diagonally."
              problemCount={12}
              learningObjectives={[
                'Build animal vocabulary',
                'Practice pattern recognition',
                'Develop attention to detail'
              ]}
              parentTeacherTips={[
                'Help children read the animal names',
                'Look for words in all directions',
                'Circle words as you find them',
                'Extension: Create your own animal word search'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-12 gap-[2px] font-mono text-sm bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
                {generateWordSearchGrid(12, ["DOG", "CAT", "LION", "BEAR", "WOLF", "SEAL", "FROG", "EAGLE", "MOUSE", "HORSE", "ZEBRA", "SNAKE"], makeRng(`${effectiveSeed}|ws-animals|main|v${variant}`)).map((row, r) => (
                  <Fragment key={r}>
                    {row.map((ch, c) => (
                      <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center rounded-sm">{ch}</div>
                    ))}
                  </Fragment>
                ))}
              </div>
              {showAnswersForDoc('ws-animals', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Answer Key</div>
                  <div className="text-sm text-emerald-800">
                    Find all 12 animal words: DOG, CAT, LION, BEAR, WOLF, SEAL, FROG, EAGLE, MOUSE, HORSE, ZEBRA, SNAKE. Words can be found horizontally, vertically, or diagonally. Circle each word as you find it!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('ws-space') && (
            <WorksheetSectionWrapper
              docId="ws-space"
              title="Word Search  Space"
              emoji={String.fromCodePoint(0x1F680)}
              description="Find 12 space words. Circle horizontally, vertically, or diagonally."
              problemCount={12}
              learningObjectives={[
                'Build space vocabulary',
                'Practice pattern recognition',
                'Develop attention to detail'
              ]}
              parentTeacherTips={[
                'Help children read the space words',
                'Look for words in all directions',
                'Circle words as you find them',
                'Extension: Create your own space word search'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-12 gap-1 font-mono text-sm">
                {generateWordSearchGrid(12, ["STAR", "MOON", "SUN", "COMET", "ORBIT", "SPACE", "ALIEN", "ROVER", "MARS", "VENUS", "NEBULA", "ASTRO"], makeRng(`${effectiveSeed}|ws-space|main|v${variant}`)).map((row, r) => (
                  <Fragment key={r}>
                    {row.map((ch, c) => (
                      <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center">{ch}</div>
                    ))}
                  </Fragment>
                ))}
              </div>
              {showAnswersForDoc('ws-space', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Answer Key</div>
                  <div className="text-sm text-emerald-800">
                    Find all 12 space words: STAR, MOON, SUN, COMET, ORBIT, SPACE, ALIEN, ROVER, MARS, VENUS, NEBULA, ASTRO. Words can be found horizontally, vertically, or diagonally. Circle each word as you find it!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        <Sudoku
          activeDocs={activeDocs}
          showAnswers={showAnswers}
          effectiveSeed={effectiveSeed}
          variant={String(variant)}
          showAnswersForDoc={showAnswersForDoc}
        />


        {
          activeDocs.includes('coloring') && (
            <WorksheetSectionWrapper
              docId="coloring"
              title="Coloring Page  Cute Animal"
              emoji={String.fromCodePoint(0x1F58D)}
              description="Print and color the outline below."
              problemCount={1}
              learningObjectives={[
                'Practice fine motor skills',
                'Express creativity through coloring',
                'Develop color recognition'
              ]}
              parentTeacherTips={[
                'Encourage children to color within the lines',
                'Let them choose their own colors',
                'Take time and enjoy the process',
                'Extension: Create your own coloring page'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="border border-slate-300 rounded p-4 bg-white print:border-0 print:p-0">
                <ColoringSVG />
              </div>
              {showAnswersForDoc('coloring', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Use your favorite colors and be creative. Take your time and enjoy coloring the cute animal!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('coloring-letters-numbers') && (
            <WorksheetSectionWrapper
              docId="coloring-letters-numbers"
              title="Alphabet & Number Coloring Pages"
              emoji={String.fromCodePoint(0x1F58D)}
              description="AZ animals and 110 rockets  trace, color, and learn letters and numbers."
              problemCount={36}
              learningObjectives={[
                'Learn letter recognition (A-Z)',
                'Learn number recognition (1-10)',
                'Practice fine motor skills through tracing and coloring',
                'Build alphabet and number knowledge'
              ]}
              parentTeacherTips={[
                'Help children trace the letters and numbers',
                'Encourage them to say the letter or number as they color',
                'Use different colors for each letter/number',
                'Extension: Practice writing the letters and numbers'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-x mb-2" />
              {/* AZ Letters grid (large) */}
              <div className="mb-8 grid grid-cols-3 sm:grid-cols-4 gap-6 print:gap-4">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch, i) => (
                  <div key={i} className="aspect-square min-h-[180px] sm:min-h-[220px] border border-slate-300 rounded bg-white flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <text x="100" y="135" textAnchor="middle" fontSize="120" fill="none" stroke="#111827" strokeWidth="4">{ch}</text>
                    </svg>
                  </div>
                ))}
              </div>
              {/* 110 Numbers with rocket icon (large) */}
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-6 print:gap-4">
                {Array.from({ length: 10 }, (_, idx) => idx + 1).map((n) => (
                  <div key={n} className="aspect-square min-h-[180px] sm:min-h-[220px] border border-slate-300 rounded bg-white flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <text x="70" y="135" textAnchor="middle" fontSize="96" fill="none" stroke="#111827" strokeWidth="4">{n}</text>
                      {/* small rocket */}
                      <g fill="none" stroke="#111827" strokeWidth="4">
                        <path d="M120 70 L140 110 L120 150 L100 110 Z" />
                        <circle cx="120" cy="110" r="8" />
                        <path d="M100 150 L120 170 L140 150" />
                      </g>
                    </svg>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('coloring-letters-numbers', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    Trace and color all 26 letters (A-Z) and all 10 numbers (1-10). There is no right or wrong way to color! Use your favorite colors and practice saying each letter and number as you color it.
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('coloring-animals') && (
            <WorksheetSectionWrapper
              docId="coloring-animals"
              title="Animal Friends Coloring Pages"
              emoji={String.fromCodePoint(0x1F58D)}
              description="Meet our friendly jungle and sea animals  lions, pandas, dolphins, and more. Ages 510."
              problemCount={6}
              learningObjectives={[
                'Learn about different animals',
                'Practice fine motor skills through coloring',
                'Express creativity and imagination'
              ]}
              parentTeacherTips={[
                'Help children identify the different animals',
                'Encourage them to use their favorite colors',
                'Talk about where each animal lives',
                'Extension: Draw your own animal'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 animate-gradient-x mb-2" />
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Lion */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <circle cx="200" cy="150" r="70" />
                      <circle cx="200" cy="150" r="95" strokeDasharray="8 8" />
                      <circle cx="175" cy="140" r="8" />
                      <circle cx="225" cy="140" r="8" />
                      <path d="M190 165 Q200 175 210 165" />
                      <path d="M145 200 Q200 220 255 200" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Turtle */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <ellipse cx="200" cy="180" rx="80" ry="45" />
                      <circle cx="120" cy="175" r="20" />
                      <line x1="155" y1="200" x2="135" y2="220" />
                      <line x1="245" y1="200" x2="265" y2="220" />
                      <line x1="180" y1="220" x2="170" y2="240" />
                      <line x1="220" y1="220" x2="230" y2="240" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Dolphin */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <path d="M60 180 C120 80, 260 80, 320 160 C250 140, 180 180, 120 190 Z" />
                      <path d="M120 190 L90 215 L140 205 Z" />
                      <circle cx="260" cy="145" r="5" />
                      <path d="M300 160 L340 160 L320 180 Z" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Elephant */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <path d="M90 200 C120 120, 260 120, 300 190 C270 210, 200 220, 140 210 Z" />
                      <circle cx="260" cy="165" r="6" />
                      <path d="M110 190 Q100 210 120 220" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Fish */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <path d="M120 160 C180 120, 240 120, 300 160 C240 200, 180 200, 120 160 Z" />
                      <path d="M120 160 L90 145 L95 175 Z" />
                      <circle cx="260" cy="160" r="5" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Bird */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <path d="M90 190 C140 150, 220 150, 270 190" />
                      <path d="M180 170 L210 150 L200 190 Z" />
                      <circle cx="280" cy="180" r="4" />
                    </g>
                  </svg>
                </div>
              </div>
              {showAnswersForDoc('coloring-animals', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Use your favorite colors to color the animals. Be creative and have fun!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('coloring-nature') && (
            <WorksheetSectionWrapper
              docId="coloring-nature"
              title="Nature & Seasons Coloring Pack"
              emoji={String.fromCodePoint(0x1F58D)}
              description="Color flowers, trees, rainbows, and seasonal scenes (spring to winter)."
              problemCount={6}
              learningObjectives={[
                'Learn about nature and seasons',
                'Practice fine motor skills through coloring',
                'Express creativity and appreciation for nature'
              ]}
              parentTeacherTips={[
                'Help children identify the different nature elements',
                'Encourage them to use colors that match the seasons',
                'Talk about what happens in each season',
                'Extension: Draw your own nature scene'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-gradient-x mb-2" />
              <div className="grid sm:grid-cols-2 gap-6 print:grid-cols-1">
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Flower */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <circle cx="200" cy="130" r="14" />
                      <circle cx="235" cy="130" r="18" />
                      <circle cx="165" cy="130" r="18" />
                      <circle cx="200" cy="95" r="18" />
                      <circle cx="200" cy="165" r="18" />
                      <path d="M200 144 L200 230" />
                      <path d="M200 200 Q230 220 250 240" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Leaf (large) */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M120 220 C200 120, 300 120, 280 220 C220 240, 180 240, 120 220 Z" />
                      <path d="M200 220 L200 150" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Tree */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <rect x="185" y="180" width="30" height="60" />
                      <circle cx="200" cy="150" r="22" />
                      <circle cx="170" cy="165" r="20" />
                      <circle cx="230" cy="165" r="20" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Rainbow */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M80 220 Q200 100 320 220" />
                      <path d="M100 220 Q200 120 300 220" />
                      <path d="M120 220 Q200 140 280 220" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Mountain */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M60 220 L160 120 L200 180 L240 140 L340 220 Z" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Sun */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <circle cx="200" cy="140" r="24" />
                      {Array.from({ length: 12 }).map((_, i) => { const a = i * Math.PI * 2 / 12; return <line key={i} x1={200} y1={140} x2={200 + Math.cos(a) * 50} y2={140 + Math.sin(a) * 50} /> })}
                    </g>
                  </svg>
                </div>
              </div>
              {showAnswersForDoc('coloring-nature', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Use your favorite colors to color the nature scenes. Be creative and think about what colors match each season!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('coloring-space') && (
            <WorksheetSectionWrapper
              docId="coloring-space"
              title="Space Adventure Coloring Pages"
              emoji={String.fromCodePoint(0x1F58D)}
              description="Rockets, planets, and astronauts. Great for science week or STEM lessons."
              problemCount={3}
              learningObjectives={[
                'Learn about space and astronomy',
                'Practice fine motor skills through coloring',
                'Express creativity and interest in space'
              ]}
              parentTeacherTips={[
                'Help children identify the different space elements',
                'Encourage them to use their favorite colors',
                'Talk about space, planets, and rockets',
                'Extension: Draw your own space scene'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-gradient-x mb-2" />
              {/* Enlarge coloring pages: single column, generous spacing for easy coloring/printing */}
              <div className="grid grid-cols-1 gap-8 print:gap-0">
                <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                  {/* Rocket - large coloring page */}
                  <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      {/* Nose cone */}
                      <polygon points="325,150 425,80 525,150" />
                      {/* Body */}
                      <rect x="325" y="150" width="200" height="500" rx="100" />
                      {/* Windows */}
                      <circle cx="425" cy="300" r="60" />
                      <circle cx="425" cy="420" r="35" />
                      {/* Fins */}
                      <polygon points="325,500 275,650 325,650" />
                      <polygon points="525,500 575,650 525,650" />
                      {/* Flames */}
                      <polygon points="425,650 380,750 425,850 470,750" />
                      {/* Stripes */}
                      <rect x="325" y="520" width="200" height="20" />
                      <rect x="325" y="560" width="200" height="20" />
                      {/* Stars background */}
                      <circle cx="120" cy="220" r="8" />
                      <circle cx="700" cy="260" r="8" />
                      <circle cx="660" cy="720" r="8" />
                      <circle cx="160" cy="800" r="8" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                  {/* Comet - large coloring page */}
                  <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      {/* Head */}
                      <circle cx="620" cy="300" r="80" />
                      {/* Tail (layered) */}
                      <polygon points="120,740 300,560 520,420 560,460 340,600 150,780" />
                      <polygon points="100,680 280,520 500,400 520,430 300,570 130,730" />
                      {/* Sparkles */}
                      <polygon points="200,260 210,290 240,300 210,310 200,340 190,310 160,300 190,290" />
                      <polygon points="700,700 710,720 730,730 710,740 700,760 690,740 670,730 690,720" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                  {/* Planet with rings - large coloring page */}
                  <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      {/* Planet */}
                      <circle cx="425" cy="550" r="250" />
                      {/* Rings (band between two ellipses) */}
                      <ellipse cx="425" cy="550" rx="360" ry="90" />
                      <ellipse cx="425" cy="550" rx="300" ry="70" />
                      {/* Surface stripes */}
                      <path d="M230 500 C 320 470, 530 470, 620 500" />
                      <path d="M220 560 C 320 590, 530 590, 630 560" />
                      <path d="M260 620 C 360 650, 490 650, 590 620" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                  {/* Astronaut - large coloring page */}
                  <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      {/* Helmet */}
                      <circle cx="425" cy="250" r="180" />
                      <rect x="320" y="220" width="210" height="80" rx="20" />
                      {/* Torso */}
                      <rect x="325" y="430" width="200" height="220" rx="30" />
                      {/* Arms */}
                      <rect x="255" y="450" width="60" height="160" rx="20" />
                      <rect x="535" y="450" width="60" height="160" rx="20" />
                      {/* Controls */}
                      <circle cx="385" cy="520" r="18" />
                      <circle cx="465" cy="520" r="18" />
                      <rect x="365" y="560" width="120" height="40" rx="10" />
                      {/* Legs */}
                      <rect x="345" y="660" width="60" height="160" rx="20" />
                      <rect x="445" y="660" width="60" height="160" rx="20" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                  {/* Satellite - large coloring page */}
                  <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      {/* Body */}
                      <rect x="370" y="450" width="110" height="110" rx="10" />
                      {/* Panels */}
                      <rect x="160" y="440" width="180" height="130" rx="8" />
                      <rect x="540" y="440" width="180" height="130" rx="8" />
                      {/* Grid lines */}
                      <line x1="210" y1="440" x2="210" y2="570" />
                      <line x1="260" y1="440" x2="260" y2="570" />
                      <line x1="160" y1="490" x2="340" y2="490" />
                      <line x1="590" y1="440" x2="590" y2="570" />
                      <line x1="640" y1="440" x2="640" y2="570" />
                      <line x1="540" y1="490" x2="720" y2="490" />
                      {/* Antenna */}
                      <line x1="425" y1="450" x2="425" y2="380" />
                      <circle cx="425" cy="360" r="14" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-6 bg-white print:p-0 print:m-0 print:border-0 print:rounded-none">
                  {/* Star cluster - large coloring page */}
                  <svg viewBox="0 0 850 1100" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                      {/* Large stars */}
                      <polygon points="200,200 230,270 305,280 245,330 260,400 200,360 140,400 155,330 95,280 170,270" />
                      <polygon points="640,260 670,330 745,340 685,390 700,460 640,420 580,460 595,390 535,340 610,330" />
                      {/* Medium stars */}
                      <polygon points="400,750 420,790 465,800 430,830 440,870 400,845 360,870 370,830 335,800 380,790" />
                      <polygon points="220,760 235,790 270,795 245,815 250,850 220,830 190,850 195,815 170,795 205,790" />
                    </g>
                  </svg>
                </div>
              </div>
              {showAnswersForDoc('coloring-space', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Use your favorite colors to color the space scenes. Be creative and imagine what space looks like!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('coloring-vehicles') && (
            <WorksheetSectionWrapper
              docId="coloring-vehicles"
              title="Vehicles & Transport Coloring Sheets"
              emoji={String.fromCodePoint(0x1F58D)}
              description="Cars, trucks, airplanes, and trains to keep little drivers busy and creative."
              problemCount={4}
              learningObjectives={[
                'Learn about different vehicles and transportation',
                'Practice fine motor skills through coloring',
                'Express creativity and interest in vehicles'
              ]}
              parentTeacherTips={[
                'Help children identify the different vehicles',
                'Encourage them to use their favorite colors',
                'Talk about how each vehicle is used',
                'Extension: Draw your own vehicle'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-gray-400 animate-gradient-x mb-2" />
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Car */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <rect x="120" y="170" width="160" height="40" rx="8" />
                      <path d="M150 170 Q200 140 250 170" />
                      <circle cx="160" cy="220" r="14" />
                      <circle cx="240" cy="220" r="14" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Truck */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <rect x="110" y="170" width="130" height="40" />
                      <rect x="240" y="180" width="40" height="30" />
                      <circle cx="150" cy="220" r="12" />
                      <circle cx="230" cy="220" r="12" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Airplane */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M80 180 L320 140 L320 160 L80 200 Z" />
                      <path d="M220 150 L280 100" />
                      <path d="M200 160 L260 210" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Train engine */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <rect x="120" y="160" width="160" height="40" />
                      <rect x="230" y="140" width="50" height="20" />
                      <circle cx="160" cy="210" r="12" />
                      <circle cx="240" cy="210" r="12" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Boat */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M100 200 L300 200 L260 230 L140 230 Z" />
                      <rect x="180" y="170" width="40" height="30" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Helicopter */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <rect x="170" y="170" width="60" height="25" />
                      <line x1="200" y1="170" x2="200" y2="150" />
                      <line x1="150" y1="150" x2="250" y2="150" />
                    </g>
                  </svg>
                </div>
              </div>
              {showAnswersForDoc('coloring-vehicles', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Use your favorite colors to color the vehicles. Be creative and have fun!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('coloring-heroes') && (
            <WorksheetSectionWrapper
              docId="coloring-heroes"
              title="Superheroes & Everyday Heroes Coloring Pages"
              emoji={String.fromCodePoint(0x1F58D)}
              description="Celebrate courage and kindness  superheroes and community helpers (doctors, firefighters, teachers)."
              problemCount={2}
              learningObjectives={[
                'Learn about community helpers and heroes',
                'Practice fine motor skills through coloring',
                'Express creativity and appreciation'
              ]}
              parentTeacherTips={[
                'Talk about the different types of heroes',
                'Encourage children to use their favorite colors',
                'Discuss how heroes help our community',
                'Extension: Draw your own hero'
              ]}
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-red-400 to-blue-400 animate-gradient-x mb-2" />
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Shield */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M200 90 L260 110 L250 170 L200 210 L150 170 L140 110 Z" />
                      <path d="M200 110 L235 125 L228 165 L200 188 L172 165 L165 125 Z" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Firefighter helmet */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M140 200 Q200 140 260 200" />
                      <rect x="160" y="195" width="80" height="20" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Star badge */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <polygon points="200,100 215,145 260,145 225,170 240,210 200,185 160,210 175,170 140,145 185,145" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Cape */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M160 100 Q200 200 240 100 Q220 160 180 160 Z" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Mask */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <rect x="150" y="140" width="100" height="30" rx="10" />
                      <circle cx="175" cy="155" r="8" />
                      <circle cx="225" cy="155" r="8" />
                    </g>
                  </svg>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white">
                  {/* Doctor stethoscope */}
                  <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                    <g fill="none" stroke="#111827" strokeWidth="3.5">
                      <path d="M180 120 C160 160, 240 160, 220 120" />
                      <circle cx="250" cy="130" r="10" />
                    </g>
                  </svg>
                </div>
              </div>
              {showAnswersForDoc('coloring-heroes', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    There is no right or wrong way to color! Use your favorite colors to color the superhero and hero symbols. Be creative and celebrate courage and kindness!
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {/* New 1st Grade Worksheets */}
        {
          activeDocs.includes('number-bonds-10') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);

            // Generate 8 problems (pairs summing to 10)
            const problems = Array.from({ length: 8 }, () => {
              const part1 = Math.floor(rng() * 11); // 0 to 10
              const part2 = 10 - part1;
              // Randomly choose which one to hide
              const hideFirst = rng() > 0.5;
              return { part1, part2, hideFirst };
            });

            return (
              <WorksheetSectionWrapper
                docId="number-bonds-10"
                title="Blooming Bonds: Making 10"
                emoji={String.fromCodePoint(0x1F522)}
                description="Fill in the empty petal to make 10. The two petals must add up to the center number."
                problemCount={8}
                learningObjectives={[
                  'Identify number pairs that sum to 10',
                  'Understand part-part-whole relationships',
                  'Build addition fluency',
                  'Develop algebraic thinking (finding the missing addend)'
                ]}
                parentTeacherTips={[
                  'Use fingers to check: "If you have 10 fingers and put down [known number], how many are left?"',
                  'Remind them that the two petals stick to the center to make 10.',
                  'Practice swapping: "3 + 7 is the same as 7 + 3".'
                ]}
              >
                {/* Decorative Garden Header */}
                <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-gradient-to-b from-sky-100 to-white rounded-lg">
                  <div className="absolute bottom-0 w-full flex justify-between text-4xl px-4 animate-bounce-slow">
                    <span>{String.fromCodePoint(0x1F33C)}</span><span>{String.fromCodePoint(0x1F33C)}</span><span>{String.fromCodePoint(0x1F33C)}</span><span>{String.fromCodePoint(0x1F33C)}</span><span>{String.fromCodePoint(0x1F33C)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 break-inside-avoid">
                  {problems.map((prob, idx) => (
                    <div key={idx} className="w-full flex justify-center">
                      <svg viewBox="0 0 200 180" className="w-full max-w-[250px] overflow-visible">
                        {/* Stem and Leaves */}
                        <path d="M100,100 Q100,140 100,180" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
                        <path d="M100,150 Q70,140 60,120" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
                        <path d="M100,160 Q130,150 140,130" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />

                        {/* Decorative Petals (Background) */}
                        <g transform="translate(100,80)">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                            <circle key={deg} cx="0" cy="0" r="35" fill="#fbcfe8" transform={`rotate(${deg}) translate(45)`} opacity="0.6" /> // Light pink
                          ))}
                        </g>

                        {/* Center (The Whole: 10) */}
                        <circle cx="100" cy="80" r="35" fill="#fef08a" stroke="#eab308" strokeWidth="3" />
                        <text x="100" y="92" fontSize="32" fontWeight="bold" fill="#854d0e" textAnchor="middle">10</text>

                        {/* Left Petal Connection */}
                        <line x1="65" y1="80" x2="40" y2="80" stroke="#16a34a" strokeWidth="4" />

                        {/* Right Petal Connection */}
                        <line x1="135" y1="80" x2="160" y2="80" stroke="#16a34a" strokeWidth="4" />

                        {/* Left Petal (Part 1) */}
                        <g>
                          <circle cx="40" cy="80" r="28" fill={prob.hideFirst ? "white" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="2" />
                          {prob.hideFirst ? (
                            <text x="40" y="90" fontSize="28" fill="#cbd5e1" textAnchor="middle">?</text>
                          ) : (
                            <text x="40" y="90" fontSize="28" fontWeight="bold" fill="#1e40af" textAnchor="middle">{prob.part1}</text>
                          )}
                        </g>

                        {/* Right Petal (Part 2) */}
                        <g>
                          <circle cx="160" cy="80" r="28" fill={!prob.hideFirst ? "white" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="2" />
                          {!prob.hideFirst ? (
                            <text x="160" y="90" fontSize="28" fill="#cbd5e1" textAnchor="middle">?</text>
                          ) : (
                            <text x="160" y="90" fontSize="28" fontWeight="bold" fill="#1e40af" textAnchor="middle">{prob.part2}</text>
                          )}
                        </g>
                      </svg>
                    </div>
                  ))}
                </div>

                {showAnswersForDoc('number-bonds-10', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-2 gap-4">
                      {problems.map((prob, idx) => {
                        const visible = prob.hideFirst ? prob.part2 : prob.part1;
                        const missing = prob.hideFirst ? prob.part1 : prob.part2;
                        return (
                          <div key={idx} className="text-sm text-emerald-800">
                            Flower {idx + 1}: <span className="font-bold">{visible} + <span className="underline">{missing}</span> = 10</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }



        {
          activeDocs.includes('dot-to-dot') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)

            // Define shapes with normalized coordinates (0-100 grid)
            const shapes = [
              {
                id: 'star',
                name: 'Star',
                emoji: '⭐',
                points: [
                  { x: 50, y: 10 }, { x: 61, y: 35 }, { x: 90, y: 35 }, { x: 65, y: 55 },
                  { x: 75, y: 85 }, { x: 50, y: 65 }, { x: 25, y: 85 }, { x: 35, y: 55 },
                  { x: 10, y: 35 }, { x: 39, y: 35 }, { x: 50, y: 10 } // Close the loop
                ]
              },
              {
                id: 'rocket',
                name: 'Rocket',
                emoji: '🚀',
                points: [
                  { x: 50, y: 10 }, { x: 70, y: 40 }, { x: 70, y: 80 }, { x: 85, y: 90 },
                  { x: 70, y: 90 }, { x: 50, y: 80 }, { x: 30, y: 90 }, { x: 15, y: 90 },
                  { x: 30, y: 80 }, { x: 30, y: 40 }, { x: 50, y: 10 }
                ]
              },
              {
                id: 'heart',
                name: 'Heart',
                emoji: '❤️',
                points: [
                  { x: 50, y: 30 }, { x: 65, y: 15 }, { x: 85, y: 15 }, { x: 95, y: 35 },
                  { x: 95, y: 50 }, { x: 50, y: 90 }, { x: 5, y: 50 }, { x: 5, y: 35 },
                  { x: 15, y: 15 }, { x: 35, y: 15 }, { x: 50, y: 30 }
                ]
              }
            ]

            const shapeIndex = Math.floor(rng() * shapes.length)
            const shape = shapes[shapeIndex]

            // Generate dot elements
            const dots = shape.points.slice(0, shape.points.length - 1).map((pt, i) => ({
              num: i + 1,
              x: pt.x * 4, // Scale to 400x400
              y: pt.y * 4
            }))

            // Path for answer key
            const pathData = shape.points.map((pt, i) =>
              `${i === 0 ? 'M' : 'L'}${pt.x * 4},${pt.y * 4}`
            ).join(' ') + " Z"

            return (
              <WorksheetSectionWrapper
                docId="dot-to-dot"
                title={`Connect the Dots: ${shape.name}`}
                emoji={shape.emoji}
                description={`Connect the dots from 1 to ${dots.length} to reveal the picture.`}
                problemCount={1}
                learningObjectives={[
                  'Sequence numbers correctly (1, 2, 3...)',
                  'Refine fine motor skills',
                  'Recognize shapes and drawing patterns'
                ]}
              >
                <div className="flex flex-col items-center justify-center p-8 bg-white border-4 border-double border-indigo-200 rounded-xl relative">
                  <svg width="400" height="400" viewBox="0 0 400 400" className="overflow-visible">
                    {/* Answer Key (Ghost Line) - Visible if showing answers */}
                    {showAnswersForDoc('dot-to-dot', () => (
                      <path d={pathData} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                    ))}

                    {/* Dots and Numbers */}
                    {dots.map((dot, i) => (
                      <g key={i}>
                        <circle cx={dot.x} cy={dot.y} r="4" fill="#1e40af" />
                        <text
                          x={dot.x}
                          y={dot.y - 12}
                          fontSize="16"
                          fontWeight="bold"
                          fill="#1e3a8a"
                          textAnchor="middle"
                        >
                          {dot.num}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {showAnswersForDoc('dot-to-dot', () => (
                    <div className="absolute bottom-4 right-4 text-2xl animate-bounce">
                      {shape.emoji}
                    </div>
                  ))}
                </div>
              </WorksheetSectionWrapper>
            )
          })()
        }




        {
          activeDocs.includes('count-write-30') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            // Generate path data
            const totalSteps = 30;
            const steps = Array.from({ length: totalSteps }, (_, i) => {
              const num = i + 1;
              // Leave some blank, strictly increasing probability of blank as we go up? 
              // Or just random scatter? Let's do random scatter but ensure 1 and 30 are visible.
              const isHidden = (num !== 1 && num !== 30) && (rng() > 0.4);
              return { num, isHidden };
            });

            // Snake layout logic for 6 rows of 5
            const getPosition = (index: number) => {
              const cols = 5;
              const row = Math.floor(index / cols);
              const isEvenRow = row % 2 === 0;
              const col = isEvenRow ? (index % cols) : (cols - 1 - (index % cols));
              return { row, col };
            };

            return (
              <WorksheetSectionWrapper
                docId="count-write-30"
                title="Bunny Hop: 1 to 30 Path"
                emoji={String.fromCodePoint(0x1F522)}
                description="Help the Bunny reach the Carrot! Fill in the missing numbers to complete the path."
                problemCount={1}
                learningObjectives={[
                  'Sequence numbers from 1 to 30',
                  'Identify valid next numbers (counting on)',
                  'Write numbers legibly',
                  'Understand numerical order'
                ]}
                parentTeacherTips={[
                  'Encourage your child to count out loud as they move along the path.',
                  'If they get stuck, ask: "What comes after [previous number]?"',
                  'Trace the path with a finger before writing.'
                ]}
              >
                <div className="print:hidden h-1 w-full rounded-full bg-orange-100 mb-6 overflow-hidden">
                  <div className="h-full w-1/3 bg-orange-400 opacity-50"></div>
                </div>

                {/* Path Container */}
                <div className="relative w-full max-w-2xl mx-auto p-8 break-inside-avoid">
                  {/* Svg Path Line (Background) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" viewBox="0 0 100 120" preserveAspectRatio="none">
                    {/* A simple winding path approximation using bezier curves could be complex to align perfectly, 
                        so we'll use a dashed line connecting centers logic if we had exact coords.
                        For a simpler robust approach, we can just rely on the grid layout visual flow.
                        But let's try a simple Polyline or Path.
                    */}
                    <path d="M 10 10 H 90 Q 100 10 100 20 V 20 Q 100 30 90 30 H 10 Q 0 30 0 40 V 40 Q 0 50 10 50 H 90 Q 100 50 100 60 V 60 Q 100 70 90 70 H 10 Q 0 70 0 80 V 80 Q 0 90 10 90 H 90 Q 100 90 100 100 V 100 Q 100 110 90 110 H 10"
                      fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                  </svg>

                  <div className="grid grid-cols-5 gap-y-8 gap-x-4 relative z-10">
                    {steps.map((step, i) => {
                      const { row, col } = getPosition(i);
                      // We used grid-cols-5, but need to re-order DOM elements? 
                      // Actually, generic grid flows Left->Right. 
                      // To achieve snake visual in DOM order, we need to sort the array by display position?
                      // EASIER: Just position absolutely or use specific grid-column start.

                      const gridRow = row + 1;
                      const gridCol = col + 1;

                      return (
                        <div key={i} className="flex flex-col items-center justify-center relative" style={{ gridRow: gridRow, gridColumn: gridCol }}>
                          {/* Connector Arrows (Visual enhancements) */}

                          {/* The Stone/Item */}
                          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-sm relative 
                                ${step.num === 1 || step.num === 30 ? 'bg-orange-100 border-orange-400' : 'bg-white border-slate-300'}
                             `}>
                            {step.num === 1 && <span className="absolute -top-8 text-4xl animate-bounce">{String.fromCodePoint(0x270F)}</span>}
                            {step.num === 30 && <span className="absolute -bottom-8 text-4xl">{String.fromCodePoint(0x270F)}</span>}

                            {step.isHidden ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-10 h-10 border-b-2 border-slate-300"></div>
                              </div>
                            ) : (
                              <span className={`text-2xl font-bold ${step.num === 1 || step.num === 30 ? 'text-orange-600' : 'text-slate-600'}`}>
                                {step.num}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {showAnswersForDoc('count-write-30', () => (
                  <div className="mt-8 p-4 border-2 border-emerald-500 bg-emerald-50 rounded-2xl print:border-black print:bg-white break-inside-avoid">
                    <div className="font-bold text-emerald-900 mb-3 text-lg flex items-center gap-2">
                      <span>{String.fromCodePoint(0x2705)}</span> Answer Key (Complete Path)
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-emerald-800 font-mono">
                      {steps.map(s => (
                        <span key={s.num} className={s.isHidden ? 'font-bold underline' : ''}>{s.num}{s.num < 30 ? ',' : ''}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()

        }

        {
          activeDocs.includes('missing-numbers-50') && (
            <MissingNumbers50
              showAnswersForDoc={showAnswersForDoc}
              seed={effectiveSeed}
              variant={variant}
            />
          )
        }





        {/* NEW CRITICAL WORKSHEETS - Fresh and Unique, No Duplicates */}

        {
          activeDocs.includes('add-2digit-regrouping') && (
            <Add2DigitRegrouping
              showAnswersForDoc={showAnswersForDoc}
              seed={effectiveSeed}
              variant={variant}
            />
          )
        }

        {
          activeDocs.includes('sub-2digit-regrouping') && (
            <Sub2DigitRegrouping
              showAnswersForDoc={showAnswersForDoc}
              seed={effectiveSeed}
              variant={variant}
            />
          )
        }

        {
          activeDocs.includes('fractions-halves-thirds-fourths') && (
            <FractionsHalvesThirdsFourths
              activeDocs={activeDocs}
              showAnswers={showAnswers}
              showAnswersForDoc={showAnswersForDoc}
              seed={effectiveSeed}
              variant={variant}
            />
          )
        }

        {/* Multiplication Worksheets */}
        {
          activeDocs.includes('mult-facts-1-5') && (
            <MultiplicationFacts seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-1-5" range={[1, 5]} />
          )
        }

        {
          activeDocs.includes('mult-arrays-2-5') && (
            <MultiplicationArrays2To5 seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('skip-count-mult') && (
            <SkipCountingMultiplication seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
          )
        }


        {
          activeDocs.includes('mult-facts-6-12') && (
            <MultiplicationFacts seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-6-12" range={[6, 12]} />
          )
        }

        {
          activeDocs.includes('mult-facts-0-12') && (
            <MultiplicationFacts seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-0-12" range={[0, 12]} />
          )
        }

        {
          activeDocs.includes('mult-arrays-models') && (
            <MultiplicationArraysModels seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('mult-arrays') && (
            <MultiplicationWindowArrays seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
          )
        }


        {
          activeDocs.includes('mult-fact-families') && (
            <MultiplicationFactFamilies
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="mult-fact-families"
              limit={12}
            />
          )
        }

        {
          activeDocs.includes('mult-2x1') && (
            <MultiplicationVertical
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="mult-2x1"
              digitsTop={2}
              digitsBottom={1}
            />
          )
        }

        {
          activeDocs.includes('mult-2x1-digit') && (
            <MultiplicationVertical
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="mult-2x1-digit"
              digitsTop={2}
              digitsBottom={1}
            />
          )
        }

        {
          activeDocs.includes('mult-2x2') && (
            <MultiplicationVertical
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="mult-2x2"
              digitsTop={2}
              digitsBottom={2}
              problemCount={8}
            />
          )
        }

        {
          activeDocs.includes('mult-2x2-digit') && (
            <MultiplicationVertical
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="mult-2x2-digit"
              digitsTop={2}
              digitsBottom={2}
            />
          )
        }

        {
          activeDocs.includes('mult-3x2-digit') && (
            <MultiplicationVertical
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="mult-3x2-digit"
              digitsTop={3}
              digitsBottom={2}
            />
          )
        }

        {
          activeDocs.includes('mult-area-model') && (
            <MultiplicationAreaModel
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
            />
          )
        }


        {
          activeDocs.includes('mult-fact-fluency') && (
            <MultiplicationFactFluency
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
            />
          )
        }

        {
          activeDocs.includes('mult-mixed-review') && (
            <MultiplicationMixedReview
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
            />
          )
        }

        {
          activeDocs.includes('mult-strategies') && (
            <MultiplicationStrategies
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
            />
          )
        }

        {
          activeDocs.includes('mult-patterns') && (
            <MultiplicationPatterns seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {/* Times Table Worksheets */}
        {
          activeDocs.includes('times-table-horizontal-1-5') && (
            <TimesTableHorizontal seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-horizontal-1-5" range={[1, 5]} />
          )
        }

        {
          activeDocs.includes('times-table-horizontal-6-12') && (
            <TimesTableHorizontal seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-horizontal-6-12" range={[6, 12]} />
          )
        }

        {
          activeDocs.includes('times-table-horizontal-1-12') && (
            <TimesTableHorizontal seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-horizontal-1-12" range={[1, 12]} />
          )
        }

        {
          activeDocs.includes('times-table-vertical-1-5') && (
            <TimesTableVertical seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-vertical-1-5" range={[1, 5]} />
          )
        }

        {
          activeDocs.includes('times-table-vertical-6-12') && (
            <TimesTableVertical seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-vertical-6-12" range={[6, 12]} />
          )
        }

        {
          activeDocs.includes('times-table-vertical-1-12') && (
            <TimesTableVertical seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-vertical-1-12" range={[1, 12]} />
          )
        }

        {
          activeDocs.includes('times-table-missing-1-5') && (
            <TimesTableMissing seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-missing-1-5" range={[1, 5]} />
          )
        }

        {
          activeDocs.includes('times-table-missing-6-12') && (
            <TimesTableMissing seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-missing-6-12" range={[6, 12]} />
          )
        }

        {
          activeDocs.includes('times-table-missing-mixed') && (
            <TimesTableMissing seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-missing-mixed" range={[1, 12]} />
          )

        }

        {
          activeDocs.includes('times-table-timed-1-5') && (
            <MultiplicationTimed seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-timed-1-5" range={[1, 5]} count={20} timeLimit="2 minutes" />
          )
        }

        {
          activeDocs.includes('times-table-timed-6-12') && (
            <MultiplicationTimed seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-timed-6-12" range={[6, 12]} count={20} timeLimit="3 minutes" />
          )
        }

        {
          activeDocs.includes('times-table-timed-1-12') && (
            <MultiplicationTimed seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="times-table-timed-1-12" range={[1, 12]} count={30} timeLimit="5 minutes" />
          )
        }

        {
          activeDocs.includes('mult-word-problems') && (
            <MultiplicationWordProblems seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-word-problems" difficulty="basic" problemCount={6} />
          )
        }

        {
          activeDocs.includes('mult-word-problems-2-3') && (
            <MultiplicationWordProblems seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-word-problems-2-3" difficulty="basic" problemCount={6} />
          )
        }

        {
          activeDocs.includes('mult-multi-step-word') && (
            <MultiplicationWordProblems seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-multi-step-word" difficulty="multi-step" problemCount={4} />
          )
        }

        {
          activeDocs.includes('mult-complex-word') && (
            <MultiplicationWordProblems seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-complex-word" difficulty="complex" problemCount={4} />
          )
        }

        {
          activeDocs.includes('times-table-blank-1-5') && (
            <MultiplicationBlankTable
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-blank-1-5"
              range={[1, 5]}
            />
          )
        }

        {
          activeDocs.includes('times-table-blank-6-12') && (
            <MultiplicationBlankTable
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-blank-6-12"
              range={[6, 12]}
            />
          )
        }

        {
          activeDocs.includes('times-table-blank-1-12') && (
            <MultiplicationBlankTable
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-blank-1-12"
              range={[1, 12]}
            />
          )
        }

        {
          activeDocs.includes('times-table-confidence-1-5') && (
            <MultiplicationConfidence
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-confidence-1-5"
              range={[1, 5]}
            />
          )
        }

        {
          activeDocs.includes('times-table-confidence-6-12') && (
            <MultiplicationConfidence
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-confidence-6-12"
              range={[6, 12]}
            />
          )
        }

        {
          activeDocs.includes('times-table-fluency-1-12') && (
            <MultiplicationFluency
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-fluency-1-12"
              range={[1, 12]}
            />
          )
        }

        {
          activeDocs.includes('times-table-mixed-review') && (
            <MultiplicationFluency
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-mixed-review"
              range={[1, 12]}
            />
          )
        }

        {
          activeDocs.includes('times-table-color-1-5') && (
            <MultiplicationColorByNumber
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-color-1-5"
              range={[1, 5]}
            />
          )
        }

        {
          activeDocs.includes('times-table-color-6-12') && (
            <MultiplicationColorByNumber
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-color-6-12"
              range={[6, 12]}
            />
          )
        }

        {
          activeDocs.includes('times-table-color-1-12') && (
            <MultiplicationColorByNumber
              seed={effectiveSeed}
              variant={variant}
              showAnswersForDoc={showAnswersForDoc}
              docId="times-table-color-1-12"
              range={[1, 12]}
            />
          )
        }

        {
          activeDocs.includes('rhyming-words') && (
            <WorksheetSectionWrapper
              docId="rhyming-words"
              title="Rhyming Words"
              emoji={String.fromCodePoint(0x1F3B5)}
              description="Circle the word that rhymes with the picture. Say both words out loud."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { word: 'cat', options: ['bat', 'dog', 'car'], correct: 0 },
                  { word: 'hat', options: ['mat', 'cup', 'tree'], correct: 0 },
                  { word: 'sun', options: ['run', 'bed', 'car'], correct: 0 },
                  { word: 'cake', options: ['lake', 'book', 'ball'], correct: 0 },
                  { word: 'bee', options: ['tree', 'cat', 'dog'], correct: 0 },
                  { word: 'boat', options: ['goat', 'car', 'house'], correct: 0 },
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="text-center mb-2">
                      <div className="text-4xl mb-2">
                        {item.word === 'cat' && ''}
                        {item.word === 'hat' && ''}
                        {item.word === 'sun' && ''}
                        {item.word === 'cake' && ''}
                        {item.word === 'bee' && ''}
                        {item.word === 'boat' && ''}
                      </div>
                      <p className="text-xl font-bold text-slate-900">{item.word}</p>
                    </div>
                    <div className="space-y-2">
                      {item.options.map((opt, optIdx) => (
                        <div key={optIdx} className="border-2 border-slate-200 rounded-full px-4 py-2 text-center text-slate-700 font-semibold mx-1 w-full bg-slate-50">
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('rhyming-words', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>cat {String.fromCharCode(0x2192)} bat</li>
                    <li>hat {String.fromCharCode(0x2192)} mat</li>
                    <li>sun {String.fromCharCode(0x2192)} run</li>
                    <li>cake {String.fromCharCode(0x2192)} lake</li>
                    <li>bee {String.fromCharCode(0x2192)} tree</li>
                    <li>boat {String.fromCharCode(0x2192)} goat</li>
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('cvc-words') && (
            <CVCWords
              activeDocs={activeDocs}
              showAnswersForDoc={showAnswersForDoc}
              seed="default"
              variant={0}
            />
          )
        }

        {
          activeDocs.includes('sight-words-pre-primer') && (
            <SightWordsPrePrimer
              activeDocs={activeDocs}
              showAnswersForDoc={showAnswersForDoc}
              seed="default"
              variant={0}
            />
          )
        }

        {
          activeDocs.includes('letter-tracing-az') && (
            <LetterTracingAZ
              activeDocs={activeDocs}
              showAnswersForDoc={showAnswersForDoc}
              seed="default"
              variant={0}
            />
          )
        }

        {
          activeDocs.includes('more-less-equal-10') && (
            <MoreLessEqual10
              activeDocs={activeDocs}
              showAnswersForDoc={showAnswersForDoc}
              seed="default"
              variant={0}
            />
          )
        }

        {
          activeDocs.includes('counting-objects-20') && (
            <WorksheetSectionWrapper
              docId="counting-objects-20"
              title="Count the Objects (120)"
              emoji={String.fromCodePoint(0x1F522)}
              description="Count each group of objects carefully. Write the total number in the blank space provided."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 animate-gradient-x mb-2" />
              <div className="grid grid-cols-2 gap-4">
                {[4, 7, 12, 9, 15, 18, 6, 11, 14, 20].map((count, idx) => (
                  <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                    <div className="flex flex-wrap gap-2 justify-center mb-3" style={{ minHeight: '80px' }}>
                      {Array.from({ length: count }).map((_, i) => {
                        const shapes = ['🎈', '⭐️', '🍪', '⚽', '🧸', '🚗', '🦋', '🐟'];
                        return (
                          <span key={i} className="text-2xl leading-none">
                            {shapes[i % shapes.length]}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">How many?</p>
                      <div className="w-16 h-16 border-2 border-slate-300 rounded-lg bg-white mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('counting-objects-20', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-semibold mb-1">Answer key</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {[4, 7, 12, 9, 15, 18, 6, 11, 14, 20].map((count, i) => (
                      <li key={i}>Group {i + 1}: {count} objects</li>
                    ))}
                  </ul>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {
          activeDocs.includes('sentence-building') && (
            <WorksheetSectionWrapper
              docId="sentence-building"
              title="Sentence Building"
              emoji={String.fromCodePoint(0x1F4D1)}
              description="Put the words in order to make a complete sentence. Write the sentence on the line provided below."
            >
              <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-gradient-x mb-2" />
              <div className="space-y-4">
                {[
                  { words: ['The', 'cat', 'is', 'sleeping', '.'], sentence: 'The cat is sleeping.', visual: '' },
                  { words: ['I', 'like', 'to', 'read', '.'], sentence: 'I like to read.', visual: '' },
                  { words: ['We', 'play', 'at', 'the', 'park', '.'], sentence: 'We play at the park.', visual: '' },
                  { words: ['She', 'has', 'a', 'red', 'ball', '.'], sentence: 'She has a red ball.', visual: '' },
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-300 rounded p-4 bg-white break-inside-avoid">
                    <div className="flex gap-4 items-start mb-4">
                      {/* Visual Cue */}
                      <div className="w-16 h-16 flex items-center justify-center text-4xl bg-slate-50 rounded-lg border border-slate-100 shrink-0">
                        {item.visual}
                      </div>

                      {/* Word Scramble */}
                      <div className="flex-1">
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">Put words in order:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.words.map((word, wIdx) => (
                            <span key={wIdx} className="px-3 py-1 border-2 border-slate-300 rounded-lg text-slate-700 font-bold bg-slate-50">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Writing Line */}
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">Write the sentence:</p>
                      <div className="h-12 border-b-2 border-slate-300 border-dashed w-full relative">
                        <div className="absolute bottom-0 w-full border-b border-slate-200" style={{ marginBottom: '10px' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showAnswersForDoc('sentence-building', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                  <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    <ul className="list-disc list-inside space-y-0.5">
                      {[
                        'The cat is sleeping.',
                        'I like to read.',
                        'We play at the park.',
                        'She has a red ball.',
                      ].map((sent, i) => (
                        <li key={i}>{sent}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </WorksheetSectionWrapper>
          )
        }

        {/* New Kindergarten Worksheets - Code-based */}
        {
          activeDocs.includes('kindergarten-counting-1-10') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
            const problems = Array.from({ length: 6 }, () => {
              const count = nextInt(1, 10);
              const objectTypes = ['🍎', '🐶', '🐱', '🐸', '🦆', '🦋', '🌸', '⭐️', '🍪', '⚽', '🧸', '🚗'];
              const objectType = objectTypes[nextInt(0, objectTypes.length - 1)];
              return { count, objectType };
            });
            return (
              <WorksheetSectionWrapper
                docId="kindergarten-counting-1-10"
                title="Counting With Pictures"
                emoji={String.fromCodePoint(0x1F9FA)}
                description="Count the objects in each group. Write the number in the box."
                problemCount={problems.length}
                learningObjectives={[
                  'Count objects from 1 to 10',
                  'Recognize and write numbers 110',
                  'Match quantities to numbers',
                  'Build number sense'
                ]}
                parentTeacherTips={[
                  'Point to each object as you count together',
                  'Encourage saying the number out loud',
                  'Practice writing numbers correctly',
                  'Extension: Count objects around the house'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                  <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Count the apples:</strong></div>
                    <div className="flex gap-2 justify-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-4xl leading-none">{String.fromCodePoint(0x1F34E)}</span>
                      ))}
                    </div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                      <div><strong>Step 1:</strong> Point to each apple and count: 1, 2, 3, 4, 5</div>
                      <div className="font-semibold text-blue-900"><strong>Answer:</strong> 5</div>
                      <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white break-inside-avoid">
                      <div className="text-center mb-3">
                        <div className="flex flex-wrap gap-2 justify-center content-center mb-3" style={{ minHeight: '80px' }}>
                          {Array.from({ length: p.count }).map((_, j) => (
                            <span key={j} className="text-4xl leading-none">{p.objectType}</span>
                          ))}
                        </div>
                        <div className="text-center">
                          <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">How many?</p>
                          <div className="w-16 h-16 border-2 border-slate-300 rounded-lg bg-white mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Count objects in your room. How many can you find?</div>
                    <div>2. Draw your own group of objects and count them</div>
                    <div>3. Practice counting backwards from 10 to 1</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can count objects from 1 to 10</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCharCode(0x2610)} I can match quantities to numbers</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {showAnswersForDoc('kindergarten-counting-1-10', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2 text-sm text-emerald-800">
                      {problems.map((p, i) => (
                        <div key={i}>
                          {i + 1}. <strong>{p.count}</strong> {p.objectType}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">
                      Remember: Count each object carefully. Point to each one as you count!
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('kindergarten-number-recognition') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=kindergarten-number-recognition`);
            function shuffleArray<T>(array: T[]): T[] {
              const newArray = [...array];
              for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(rng() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
              }
              return newArray;
            }

            // Generate 2 sets of matching problems (4 items each) to fit on page
            const allNumbers = shuffleArray(Array.from({ length: 10 }, (_, i) => i + 1));
            const set1Numbers = allNumbers.slice(0, 5).sort((a, b) => a - b);
            const set2Numbers = allNumbers.slice(5, 10).sort((a, b) => a - b);
            const numbers = allNumbers;

            const sets = [
              { title: 'Match 1', numbers: set1Numbers, objects: shuffleArray([...set1Numbers]) },
              { title: 'Match 2', numbers: set2Numbers, objects: shuffleArray([...set2Numbers]) }
            ];

            const objectTypes = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];

            return (
              <WorksheetSectionWrapper
                docId="kindergarten-number-recognition"
                title="Number Matching"
                emoji={String.fromCodePoint(0x1F9FA)}
                description="Draw a line from the number to the correct group of animals."
                problemCount={2}
                learningObjectives={[
                  'Recognize numbers 110',
                  'Match numbers to quantities',
                  'Count objects accurately',
                  'Build number recognition skills'
                ]}
                parentTeacherTips={[
                  'Have your child say the number out loud',
                  'Count the objects together before matching',
                  'Encourage drawing straight lines',
                  'Extension: Practice writing the numbers'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />

                {sets.map((set, setIdx) => (
                  <div key={setIdx} className="mb-8 break-inside-avoid">
                    <div className="flex justify-between px-8 mb-4 font-bold text-slate-500 uppercase tracking-widest text-sm">
                      <span>Number</span>
                      <span>How Many?</span>
                    </div>

                    <div className="border-2 border-slate-200 rounded-xl p-6 bg-white relative">
                      {/* Center dashed line for visual separation */}
                      <div className="absolute left-1/2 top-4 bottom-4 border-l-2 border-dashed border-slate-100 transform -translate-x-1/2" />

                      <div className="flex justify-between">
                        {/* Left Column: Numbers */}
                        <div className="space-y-8 w-1/3">
                          {set.numbers.map((num, i) => (
                            <div key={i} className="h-20 flex items-center justify-center pl-4 relative">
                              <span className="text-5xl font-bold text-slate-800">{num}</span>
                              <div className="absolute right-0 top-1/2 w-3 h-3 bg-slate-300 rounded-full transform translate-x-1/2 -translate-y-1/2" />
                            </div>
                          ))}
                        </div>

                        {/* Right Column: Objects */}
                        <div className="space-y-8 w-1/2">
                          {set.objects.map((count, i) => {
                            // Use a consistent object type for this count to avoid confusion
                            const objType = objectTypes[count % objectTypes.length];
                            return (
                              <div key={i} className="h-20 flex items-center pl-8 relative">
                                <div className="absolute left-0 top-1/2 w-3 h-3 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                                <div className="flex flex-wrap gap-1">
                                  {Array.from({ length: count }).map((_, j) => (
                                    <span key={j} className="text-2xl leading-none">{objType}</span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center text-sm text-slate-500 mt-4 italic">
                  Tip: Use a ruler to draw straight lines!
                </div>

                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Find numbers around your house. What numbers can you see?</div>
                    <div>2. Draw your own number and matching objects</div>
                    <div>{String.fromCodePoint(0x279C)}</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCharCode(0x2610)} I can count objects accurately</div>
                    <div>{String.fromCharCode(0x2610)} I can match numbers to quantities</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {numbers.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {
                  showAnswersForDoc('kindergarten-number-recognition', () => (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                      <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                      <div className="space-y-2 text-sm text-emerald-800">
                        {numbers.map((num, i) => {
                          const objectType = objectTypes[i % objectTypes.length];
                          return (
                            <div key={i}>
                              {i + 1}. Number <strong>{num}</strong> matches {num} {objectType}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-emerald-700 mt-3">
                        Remember: Count the objects first, then match to the correct number!
                      </div>
                    </div>
                  ))
                }
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('kindergarten-shapes') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            const shapesData = [
              { name: 'Circle', render: (props: any) => <circle cx="50" cy="50" r="40" {...props} />, color: 'blue', instruction: 'Color the circle blue' },
              { name: 'Square', render: (props: any) => <rect x="15" y="15" width="70" height="70" {...props} />, color: 'red', instruction: 'Color the square red' },
              { name: 'Triangle', render: (props: any) => <polygon points="50,15 90,85 10,85" {...props} />, color: 'green', instruction: 'Color the triangle green' },
              { name: 'Rectangle', render: (props: any) => <rect x="15" y="25" width="70" height="50" {...props} />, color: 'yellow', instruction: 'Color the rectangle yellow' },
              { name: 'Star', render: (props: any) => <polygon points="50,5 61,35 95,35 68,55 79,85 50,65 21,85 32,55 5,35 39,35" {...props} />, color: 'purple', instruction: 'Color the star purple' },
              { name: 'Diamond', render: (props: any) => <polygon points="50,10 90,50 50,90 10,50" {...props} />, color: 'orange', instruction: 'Color the diamond orange' },
            ];

            // Shuffle the shapes
            const problems = [...shapesData].sort(() => 0.5 - rng());

            return (
              <WorksheetSectionWrapper
                docId="kindergarten-shapes"
                title="Shapes Coloring"
                emoji={String.fromCodePoint(0x1F537)}
                description="Color each shape according to the instructions."
                problemCount={problems.length}
                learningObjectives={[
                  'Identify basic shapes (circle, square, triangle, etc.)',
                  'Recognize shape names',
                  'Follow color instructions',
                  'Build fine motor skills'
                ]}
                parentTeacherTips={[
                  'Say the shape name together before coloring',
                  'Point out shapes in everyday objects',
                  'Encourage staying inside the lines',
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 animate-gradient-x mb-2" />

                <div className="grid grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((shape, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-6 bg-white break-inside-avoid flex flex-col items-center">
                      {/* Shape Outline */}
                      <div className="w-32 h-32 mb-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                          {shape.render({ fill: 'white', stroke: '#334155', strokeWidth: '3' })}
                        </svg>
                      </div>

                      <div className="text-center w-full">
                        <div className="text-xl font-bold text-slate-800 mb-1">{shape.name}</div>
                        <div className="text-sm font-medium text-slate-500 mb-3">{shape.instruction}</div>

                        {/* Color Indicator */}
                        <div className="flex items-center justify-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-100 mx-auto w-max">
                          <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: shape.color }}></span>
                          <span style={{ color: shape.color === 'yellow' ? '#eab308' : shape.color }}>{shape.color}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Find shapes in your room. What shapes can you see?</div>
                    <div>2. Draw your own shapes and color them</div>
                    <div>3. Make a shape collage using different shapes</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can identify basic shapes</div>
                    <div>{String.fromCharCode(0x2610)} I can say shape names</div>
                    <div>{String.fromCharCode(0x2610)} I can follow color instructions</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {showAnswersForDoc('kindergarten-shapes', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2 text-sm text-emerald-800">
                      {problems.map((shape, i) => (
                        <div key={i}>
                          {i + 1}. {shape.name}: {shape.instruction}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">
                      Remember: Say the shape name out loud as you color it!
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('kindergarten-patterns') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);

            // Reuse shapes/colors (locally defined for safety)
            const shapes = {
              circle: { render: (props: any) => <circle cx="50" cy="50" r="40" {...props} />, label: 'Circle' },
              square: { render: (props: any) => <rect x="15" y="15" width="70" height="70" rx="4" {...props} />, label: 'Square' },
              triangle: { render: (props: any) => <polygon points="50,15 85,85 15,85" strokeLinejoin="round" {...props} />, label: 'Triangle' },
              star: { render: (props: any) => <polygon points="50,5 61,40 98,40 68,62 79,95 50,75 21,95 32,62 2,40 39,40" strokeLinejoin="round" {...props} />, label: 'Star' },
              diamond: { render: (props: any) => <polygon points="50,10 90,50 50,90 10,50" strokeLinejoin="round" {...props} />, label: 'Diamond' },
              heart: { render: (props: any) => <path d="M50 30 C65 10, 95 20, 95 50 C95 75, 50 95, 50 95 C50 95, 5 75, 5 50 C5 20, 35 10, 50 30 Z" strokeLinejoin="round" {...props} />, label: 'Heart' },
            };

            const colors = [
              { name: 'Red', fill: '#ef4444', border: 'text-red-600' },
              { name: 'Blue', fill: '#3b82f6', border: 'text-blue-600' },
              { name: 'Green', fill: '#22c55e', border: 'text-green-600' },
              { name: 'Yellow', fill: '#eab308', border: 'text-yellow-600' },
              { name: 'Purple', fill: '#a855f7', border: 'text-purple-600' },
              { name: 'Orange', fill: '#f97316', border: 'text-orange-600' },
            ];

            const shapeKeys = Object.keys(shapes) as Array<keyof typeof shapes>;

            // Logic: Mixed Patterns (Mastery)
            // 6 Problems total. Randomly choosing between Color Logic and Shape Logic.

            const patterns = Array.from({ length: 6 }).map((_, i) => {
              const mode = rng() > 0.5 ? 'color' : 'shape';

              if (mode === 'color') {
                // COLOR LOGIC (Same Shape, Diff Colors)
                const baseShapeKey = shapeKeys[Math.floor(rng() * shapeKeys.length)];
                let cA = colors[Math.floor(rng() * colors.length)];
                let cB = colors[Math.floor(rng() * colors.length)];
                while (cB.name === cA.name) cB = colors[Math.floor(rng() * colors.length)];

                // Simple ABAB or AABB for mixed review
                const subType = rng() > 0.5 ? 'ABAB' : 'ABC';

                let sequence: any[] = [];
                let nextItem, distractor;
                let patternName = subType;

                if (subType === 'ABAB') {
                  const itemA = { shape: baseShapeKey, color: cA };
                  const itemB = { shape: baseShapeKey, color: cB };
                  sequence = [itemA, itemB, itemA, itemB, itemA];
                  nextItem = itemB;
                  distractor = itemA;
                } else { // ABC
                  let cC = colors[Math.floor(rng() * colors.length)];
                  while (cC.name === cA.name || cC.name === cB.name) cC = colors[Math.floor(rng() * colors.length)];
                  const itemA = { shape: baseShapeKey, color: cA };
                  const itemB = { shape: baseShapeKey, color: cB };
                  const itemC = { shape: baseShapeKey, color: cC };
                  sequence = [itemA, itemB, itemC, itemA, itemB];
                  nextItem = itemC;
                  distractor = itemA;
                }

                return {
                  id: i,
                  mode: 'Color Pattern',
                  patternName,
                  sequence,
                  next: nextItem,
                  option1: distractor,
                  option2: nextItem,
                  desc: `${patternName} (${nextItem.color.name})`
                };
              } else {
                // SHAPE LOGIC (Same Color, Diff Shapes)
                const baseColor = colors[Math.floor(rng() * colors.length)];
                let sA = shapeKeys[Math.floor(rng() * shapeKeys.length)];
                let sB = shapeKeys[Math.floor(rng() * shapeKeys.length)];
                while (sB === sA) sB = shapeKeys[Math.floor(rng() * shapeKeys.length)];

                const subType = rng() > 0.5 ? 'ABAB' : 'ABC';
                let sequence: any[] = [];
                let nextItem, distractor;
                let patternName = subType;

                if (subType === 'ABAB') {
                  const itemA = { shape: sA, color: baseColor };
                  const itemB = { shape: sB, color: baseColor };
                  sequence = [itemA, itemB, itemA, itemB, itemA];
                  nextItem = itemB;
                  distractor = itemA;
                } else { // ABC
                  let sC = shapeKeys[Math.floor(rng() * shapeKeys.length)];
                  while (sC === sA || sC === sB) sC = shapeKeys[Math.floor(rng() * shapeKeys.length)];
                  const itemA = { shape: sA, color: baseColor };
                  const itemB = { shape: sB, color: baseColor };
                  const itemC = { shape: sC, color: baseColor };
                  sequence = [itemA, itemB, itemC, itemA, itemB];
                  nextItem = itemC;
                  distractor = itemA;
                }

                return {
                  id: i,
                  mode: 'Shape Pattern',
                  patternName,
                  sequence,
                  next: nextItem,
                  option1: distractor,
                  option2: nextItem,
                  desc: `${patternName} (${nextItem.shape})`
                };
              }
            });
            return (
              <WorksheetSectionWrapper
                docId="kindergarten-patterns"
                title="Pattern Mastery"
                emoji={String.fromCodePoint(0x1F9FA)}
                description="Look closely! Some patterns change color, some change shape."
                problemCount={patterns.length}
                learningObjectives={[
                  'Master different pattern types (ABAB, AABB, ABC)',
                  'Distinguish between color patterns and shape patterns',
                  'Demonstrate advanced logical thinking'
                ]}
                parentTeacherTips={[
                  'Ask: "What is changing here? The color or the shape?"',
                  'Encourage your child to explain their reasoning',
                  'This is a review activity to check for mastery'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 animate-gradient-x mb-2" />

                {/* Mixed Review Guide */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                  <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>Sometimes the <strong>Colors</strong> change (Red, Blue, Red...).</div>
                    <div>Sometimes the <strong>Shapes</strong> change (Circle, Square, Circle...).</div>
                    <div>Watch closely to see which one it is!</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6" style={{ pageBreakAfter: 'auto' }}>
                  {patterns.map((p, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-xl p-4 bg-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-slate-100 px-3 py-1 rounded-bl-lg text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {p.mode}
                      </div>
                      <div className="mb-2 text-sm font-bold text-slate-700">
                        {i + 1}. What comes next?
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 md:gap-3 justify-center bg-slate-50 rounded-lg p-4 border border-slate-100">
                          {p.sequence.map((item, idx) => {
                            const S = shapes[item.shape as keyof typeof shapes].render;
                            return (
                              <svg key={idx} viewBox="0 0 100 100" className="w-12 h-12 md:w-14 md:h-14 drop-shadow-sm">
                                <S fill={item.color.fill} stroke="white" strokeWidth="2" />
                              </svg>
                            );
                          })}
                          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg text-slate-300 font-bold text-2xl">
                            ?
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-8">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Choose:</div>
                        <div className="flex gap-6">
                          {[p.option1, p.option2].sort(() => Math.random() - 0.5).map((opt, optIdx) => {
                            const S = shapes[opt.shape as keyof typeof shapes].render;
                            return (
                              <div key={optIdx} className="w-16 h-16 md:w-20 md:h-20 border-2 border-slate-200 rounded-xl flex items-center justify-center hover:border-violet-400 cursor-pointer transition-colors bg-white print:border-slate-300">
                                <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14">
                                  <S fill={opt.color.fill} stroke="white" strokeWidth="2" />
                                </svg>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {showAnswersForDoc('kindergarten-patterns', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Answer Key</div>
                    <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                      {patterns.map((p, i) => (
                        <li key={i}>
                          <strong>{i + 1}. {p.mode} ({p.patternName}):</strong> {p.desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('kindergarten-addition-pictures') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const problems = Array.from({ length: 6 }, () => {
              const a = nextInt(1, 4);
              const b = nextInt(1, 4);
              return { a, b, sum: a + b };
            });
            const objectTypes = ['🍎', '🍊', '🍌', '🍇', '🍓', '🍒'];
            return (
              <WorksheetSectionWrapper
                docId="kindergarten-addition-pictures"
                title="Addition with Pictures"
                emoji={String.fromCodePoint(0x2795)}
                description="Count the objects in each group. Add them together and write the answer."
                problemCount={problems.length}
                learningObjectives={[
                  'Understand addition as combining groups',
                  'Count objects to solve addition problems',
                  'Write addition equations',
                  'Build early addition skills'
                ]}
                parentTeacherTips={[
                  'Count each group together first',
                  'Say: "How many in the first group? How many in the second?"',
                  'Encourage counting all objects together',
                  'Extension: Practice with real objects'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-red-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                  <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Problem:</strong> 2 + 3 = ?</div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex gap-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <span key={i} className="text-4xl">🍎</span>
                        ))}
                      </div>
                      <div className="text-3xl font-bold">+</div>
                      <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span key={i} className="text-4xl">🍎</span>
                        ))}
                      </div>
                      <div className="text-3xl font-bold">=</div>
                      <div className="text-3xl font-bold text-blue-700">?</div>
                    </div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                      <div><strong>Step 1:</strong> Count first group: 1, 2</div>
                      <div><strong>Step 2:</strong> Count second group: 1, 2, 3</div>
                      <div><strong>Step 3:</strong> Count all together: 1, 2, 3, 4, 5</div>
                      <div className="font-semibold text-blue-900"><strong>Answer:</strong> 5</div>
                      <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => {
                    const objectType = objectTypes[i % objectTypes.length];
                    return (
                      <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white break-inside-avoid">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          {/* Group 1 */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-wrap gap-1 justify-center content-center min-h-[3rem] w-24">
                              {Array.from({ length: p.a }).map((_, j) => (
                                <span key={j} className="text-3xl leading-none">{objectType}</span>
                              ))}
                            </div>
                            <div className="w-8 h-8 border border-dashed border-slate-300 rounded bg-slate-50"></div>
                          </div>

                          <div className="text-2xl font-bold text-slate-400 pb-10">+</div>

                          {/* Group 2 */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-wrap gap-1 justify-center content-center min-h-[3rem] w-24">
                              {Array.from({ length: p.b }).map((_, j) => (
                                <span key={j} className="text-3xl leading-none">{objectType}</span>
                              ))}
                            </div>
                            <div className="w-8 h-8 border border-dashed border-slate-300 rounded bg-slate-50"></div>
                          </div>

                          <div className="text-2xl font-bold text-slate-400 pb-10">=</div>

                          {/* Answer */}
                          <div className="flex flex-col items-center gap-2 pb-10">
                            <div className="w-14 h-14 border-2 border-slate-800 rounded bg-white"></div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 text-center uppercase tracking-wide text-xs">Count and add</div>
                      </div>
                    );
                  })}
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Use real objects to practice addition (toys, blocks, etc.)</div>
                    <div>2. Create your own addition problems</div>
                    <div>3. Practice addition with numbers up to 10</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can count objects in groups</div>
                    <div>{String.fromCharCode(0x2610)} I can add two groups together</div>
                    <div>{String.fromCharCode(0x2610)} I can write addition answers</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {showAnswersForDoc('kindergarten-addition-pictures', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2 text-sm text-emerald-800">
                      {problems.map((p, i) => {
                        const objectType = objectTypes[i % objectTypes.length];
                        return (
                          <div key={i}>
                            {i + 1}. {p.a} {objectType} + {p.b} {objectType} = <strong>{p.sum}</strong>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">
                      Remember: Count all the objects together to find the total!
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {/* Visual Counting Worksheet with Cute Characters */}
        {
          activeDocs.includes('kindergarten-counting-visual') && (() => {
            // Cute character components
            const CuteBear = ({ x, y, size = 60 }: { x: number; y: number; size?: number; key?: any }) => (
              <g transform={`translate(${x}, ${y})`}>
                <circle cx={size / 2} cy={size / 2} r={size * 0.45} fill="#FF7F50" />
                <circle cx={size * 0.25} cy={size * 0.25} r={size * 0.15} fill="#FF6347" />
                <circle cx={size * 0.75} cy={size * 0.25} r={size * 0.15} fill="#FF6347" />
                <circle cx={size / 2} cy={size * 0.55} r={size * 0.2} fill="#FFDAB9" />
                <path d={`M${size * 0.5} ${size * 0.5} L${size * 0.45} ${size * 0.55} L${size * 0.55} ${size * 0.55} Z`} fill="#E91E63" />
                <circle cx={size * 0.4} cy={size * 0.4} r={size * 0.05} fill="#000000" />
                <circle cx={size * 0.6} cy={size * 0.4} r={size * 0.05} fill="#000000" />
                <path
                  d={`M${size * 0.4} ${size * 0.65} Q${size * 0.5} ${size * 0.75}, ${size * 0.6} ${size * 0.65}`}
                  stroke="#B71C1C"
                  strokeWidth={size * 0.03}
                  fill="none"
                />
              </g>
            );

            const CuteStar = ({ x, y, size = 60 }: { x: number; y: number; size?: number; key?: any }) => (
              <g transform={`translate(${x}, ${y})`}>
                <polygon
                  points={`
                  ${size * 0.5},${size * 0.0}
                  ${size * 0.61},${size * 0.35}
                  ${size * 1.0},${size * 0.35}
                  ${size * 0.68},${size * 0.57}
                  ${size * 0.8},${size * 0.9}
                  ${size * 0.5},${size * 0.7}
                  ${size * 0.2},${size * 0.9}
                  ${size * 0.32},${size * 0.57}
                  ${size * 0.0},${size * 0.35}
                  ${size * 0.39},${size * 0.35}
                `}
                  fill="#FFEB3B"
                  stroke="#FFC107"
                  strokeWidth={size * 0.015}
                />
                <circle cx={size * 0.4} cy={size * 0.45} r={size * 0.05} fill="#000000" />
                <circle cx={size * 0.6} cy={size * 0.45} r={size * 0.05} fill="#000000" />
                <path
                  d={`M${size * 0.4} ${size * 0.6} Q${size * 0.5} ${size * 0.7}, ${size * 0.6} ${size * 0.6}`}
                  stroke="#000000"
                  strokeWidth={size * 0.03}
                  fill="none"
                />
              </g>
            );

            const CuteCat = ({ x, y, size = 60 }: { x: number; y: number; size?: number; key?: any }) => (
              <g transform={`translate(${x}, ${y})`}>
                <circle cx={size / 2} cy={size / 2} r={size * 0.45} fill="#CE93D8" />
                <path d={`M${size * 0.2} ${size * 0.2} L${size * 0.35} ${size * 0.05} L${size * 0.45} ${size * 0.25} Z`} fill="#F48FB1" />
                <path d={`M${size * 0.8} ${size * 0.2} L${size * 0.65} ${size * 0.05} L${size * 0.55} ${size * 0.25} Z`} fill="#F48FB1" />
                <path d={`M${size * 0.1} ${size * 0.4} L${size * 0.35} ${size * 0.05} L${size * 0.45} ${size * 0.3} C${size * 0.35} ${size * 0.4}, ${size * 0.2} ${size * 0.4} ${size * 0.1} ${size * 0.4} Z`} fill="#9C27B0" />
                <path d={`M${size * 0.9} ${size * 0.4} L${size * 0.65} ${size * 0.05} L${size * 0.55} ${size * 0.3} C${size * 0.65} ${size * 0.4}, ${size * 0.8} ${size * 0.4} ${size * 0.9} ${size * 0.4} Z`} fill="#9C27B0" />
                <circle cx={size * 0.4} cy={size * 0.4} r={size * 0.05} fill="#000000" />
                <circle cx={size * 0.6} cy={size * 0.4} r={size * 0.05} fill="#000000" />
                <path d={`M${size * 0.5} ${size * 0.5} L${size * 0.48} ${size * 0.55} L${size * 0.52} ${size * 0.55} Z`} fill="#F48FB1" />
                <path
                  d={`M${size * 0.4} ${size * 0.65} Q${size * 0.5} ${size * 0.75}, ${size * 0.6} ${size * 0.65}`}
                  stroke="#4A148C"
                  strokeWidth={size * 0.03}
                  fill="none"
                />
              </g>
            );

            const CuteApple = ({ x, y, size = 60 }: { x: number; y: number; size?: number; key?: any }) => (
              <g transform={`translate(${x}, ${y})`}>
                <path
                  d={`M${size * 0.5} 0 C0 0, 0 ${size * 1.0}, ${size * 0.5} ${size * 1.0} C${size * 1.0} ${size * 1.0}, ${size * 1.0} 0, ${size * 0.5} 0 Z`}
                  transform={`scale(0.8) translate(${size * 0.1}, ${size * 0.05})`}
                  fill="#F44336"
                  stroke="#D32F2F"
                  strokeWidth={size * 0.02}
                />
                <rect x={size * 0.47} y={size * 0.05} width={size * 0.06} height={size * 0.15} fill="#795548" />
                <ellipse cx={size * 0.6} cy={size * 0.1} rx={size * 0.15} ry={size * 0.08} transform={`rotate(20 ${size * 0.6} ${size * 0.1})`} fill="#4CAF50" />
                <circle cx={size * 0.4} cy={size * 0.45} r={size * 0.05} fill="#000000" />
                <circle cx={size * 0.6} cy={size * 0.45} r={size * 0.05} fill="#000000" />
                <path
                  d={`M${size * 0.4} ${size * 0.6} Q${size * 0.5} ${size * 0.7}, ${size * 0.6} ${size * 0.6}`}
                  stroke="#000000"
                  strokeWidth={size * 0.03}
                  fill="none"
                />
              </g>
            );

            const CuteFlower = ({ x, y, size = 60 }: { x: number; y: number; size?: number; key?: any }) => (
              <g transform={`translate(${x}, ${y})`}>
                <circle cx={size / 2} cy={size / 2} r={size * 0.25} fill="#FF9800" />
                <circle cx={size / 2} cy={size * 0.2} r={size * 0.2} fill="#E91E63" />
                <circle cx={size / 2} cy={size * 0.8} r={size * 0.2} fill="#E91E63" />
                <circle cx={size * 0.2} cy={size / 2} r={size * 0.2} fill="#E91E63" />
                <circle cx={size * 0.8} cy={size / 2} r={size * 0.2} fill="#E91E63" />
                <circle cx={size * 0.3} cy={size * 0.3} r={size * 0.2} fill="#F06292" />
                <circle cx={size * 0.7} cy={size * 0.3} r={size * 0.2} fill="#F06292" />
                <circle cx={size * 0.3} cy={size * 0.7} r={size * 0.2} fill="#F06292" />
                <circle cx={size * 0.7} cy={size * 0.7} r={size * 0.2} fill="#F06292" />
                <circle cx={size * 0.45} cy={size * 0.45} r={size * 0.03} fill="#000000" />
                <circle cx={size * 0.55} cy={size * 0.45} r={size * 0.03} fill="#000000" />
                <path
                  d={`M${size * 0.45} ${size * 0.55} Q${size * 0.5} ${size * 0.6}, ${size * 0.55} ${size * 0.55}`}
                  stroke="#000000"
                  strokeWidth={size * 0.02}
                  fill="none"
                />
              </g>
            );

            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const characterComponents = [
              { Component: CuteBear, name: 'Bears', title: 'bears' },
              { Component: CuteStar, name: 'Stars', title: 'stars' },
              { Component: CuteCat, name: 'Cats', title: 'cats' },
              { Component: CuteApple, name: 'Apples', title: 'apples' },
              { Component: CuteFlower, name: 'Flowers', title: 'flowers' },
            ];

            const problems = Array.from({ length: 6 }, () => {
              const count = nextInt(1, 10);
              const charIndex = nextInt(0, characterComponents.length - 1);
              const layout = count <= 5 ? 'row' : 'grid';
              return { count, charIndex, layout };
            });

            const CountingProblemCard = (props: { title: string; count: number; Component: any; layout: 'row' | 'grid' }) => {
              const { title, count, Component, layout } = props;
              const charSize = 60;
              const padding = 10;
              let svgWidth = 650;
              let svgHeight = 100;
              const characterPositions: Array<{ x: number; y: number }> = [];

              if (layout === 'row') {
                svgWidth = count * (charSize + padding) + padding;
                svgHeight = charSize + 2 * padding;
                for (let i = 0; i < count; i++) {
                  characterPositions.push({ x: padding + i * (charSize + padding), y: padding });
                }
              } else if (layout === 'grid') {
                const cols = 5;
                const rows = Math.ceil(count / cols);
                svgWidth = cols * (charSize + padding) + padding;
                svgHeight = rows * (charSize + padding) + padding;
                for (let i = 0; i < count; i++) {
                  const col = i % cols;
                  const row = Math.floor(i / cols);
                  characterPositions.push({
                    x: padding + col * (charSize + padding),
                    y: padding + row * (charSize + padding),
                  });
                }
              }

              return (
                <div className="border-4 border-pink-200 rounded-2xl p-5 my-4 bg-pink-50 flex flex-wrap items-start break-inside-avoid" style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.1)', overflow: 'visible', height: 'auto', minHeight: 'auto' }}>
                  <div className="min-w-[150px] font-bold text-2xl text-pink-900 mb-2 md:mb-0">
                    How many {title}?
                  </div>
                  <div className="mx-5 flex-1 min-w-0" style={{ overflow: 'visible' }}>
                    <svg width={svgWidth} height={svgHeight} className="max-w-full h-auto" style={{ maxWidth: '100%', height: 'auto', overflow: 'visible' }} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
                      {characterPositions.map((pos, index) => (
                        <Component key={index} x={pos.x} y={pos.y} size={charSize} />
                      ))}
                    </svg>
                  </div>
                  <div className="ml-auto min-w-[80px] mt-2 md:mt-0" style={{ flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80" style={{ maxWidth: '100%', height: 'auto' }} preserveAspectRatio="xMidYMid meet">
                      <rect
                        x="0"
                        y="0"
                        width="80"
                        height="80"
                        rx="10"
                        ry="10"
                        fill="#FFFFFF"
                        stroke="#00BCD4"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                </div>
              );
            };

            return (
              <WorksheetSectionWrapper
                docId="kindergarten-counting-visual"
                title="Counting with Cute Characters"
                emoji={String.fromCodePoint(0x1F9FA)}
                description="Count the cute cartoon characters in each group. Write the number in the box."
                problemCount={problems.length}
                learningObjectives={[
                  'Count objects from 1 to 10',
                  'Recognize and write numbers 110',
                  'Match quantities to numbers',
                  'Build number sense with visual characters'
                ]}
                parentTeacherTips={[
                  'Point to each character as you count together',
                  'Encourage saying the number out loud',
                  'Practice writing numbers correctly',
                  'Extension: Count objects around the house'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                  <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Count the bears:</strong></div>
                    <div className="flex gap-2 justify-center mb-3">
                      <svg width="240" height="80">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <CuteBear key={i} x={i * 70 + 10} y={10} size={60} />
                        ))}
                      </svg>
                    </div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                      <div><strong>Step 1:</strong> Point to each bear and count: 1, 2, 3</div>
                      <div className="font-semibold text-blue-900"><strong>Answer:</strong> 3</div>
                      <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => {
                    const charData = characterComponents[p.charIndex];
                    return (
                      <CountingProblemCard
                        key={i}
                        title={charData.title}
                        count={p.count}
                        Component={charData.Component}
                        layout={p.layout as "row" | "grid"}
                      />
                    );
                  })}
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Count characters in your room. How many can you find?</div>
                    <div>2. Draw your own cute characters and count them</div>
                    <div>3. Practice counting backwards from 10 to 1</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can count characters from 1 to 10</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCharCode(0x2610)} I can match quantities to numbers</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {showAnswersForDoc('kindergarten-counting-visual', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2 text-sm text-emerald-800">
                      {problems.map((p, i) => {
                        const charData = characterComponents[p.charIndex];
                        return (
                          <div key={i}>
                            {i + 1}. <strong>{p.count}</strong> {charData.title}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">
                      Remember: Count each character carefully. Point to each one as you count!
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }


        {
          activeDocs.includes('doubles-facts') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const problems = Array.from({ length: 12 }, () => {
              const num = nextInt(1, 10);
              return { num, double: num * 2 };
            });

            return (
              <WorksheetSectionWrapper
                docId="doubles-facts"
                title="Magic Mirror Doubles"
                emoji={String.fromCodePoint(0x2211)}
                description="Enter the Magic Mirror Kingdom! Add the number to its reflection to find the double."
                problemCount={problems.length}
                learningObjectives={[
                  'Memorize doubles facts from 1+1 to 10+10',
                  'Understand doubling as adding a number to itself',
                  'Build mental math fluency'
                ]}
                parentTeacherTips={[
                  'Doubling means adding the same number twice.',
                  'Use a mirror to show "reflection" concept.',
                  'Practice saying: "Double 3 is 6" or "3 plus 3 is 6".'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 animate-gradient-x mb-2" />

                {/* Theme Header */}
                <div className="w-full h-20 mb-6 bg-indigo-50 rounded-lg border-2 border-indigo-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute opacity-10 text-6xl rotate-12 left-10">🏰</div>
                  <div className="absolute opacity-10 text-6xl -rotate-12 right-10">👑</div>
                  <div className="text-2xl font-bold text-indigo-900 flex items-center gap-3 z-10 font-serif">
                    <span>🏰</span> ROYAL REFLECTIONS <span>👑</span>
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg print:border print:bg-white relative">
                  <div className="absolute -top-3 -right-3 text-3xl">{String.fromCodePoint(0x1F680)}</div>
                  <div className="font-semibold text-purple-900 mb-3 text-sm font-serif">Mirror, Mirror on the wall...</div>
                  <div className="flex items-center gap-6 justify-center">
                    <div className="text-center">
                      <div className="text-xs text-purple-600 mb-1">Real Number</div>
                      <div className="w-12 h-16 border-2 border-purple-400 bg-white flex items-center justify-center text-3xl font-bold rounded-lg shadow-sm">3</div>
                    </div>
                    <div className="text-2xl text-purple-400">+</div>
                    <div className="text-center relative">
                      <div className="text-xs text-purple-600 mb-1">Reflection</div>
                      {/* Mirror Effect */}
                      <div className="w-12 h-16 border-2 border-indigo-300 bg-indigo-50/50 flex items-center justify-center text-3xl font-bold rounded-lg relative overflow-hidden">
                        <span className="relative z-10 text-indigo-900">3</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="text-2xl text-purple-400">=</div>
                    <div className="text-center">
                      <div className="text-xs text-purple-600 mb-1">Double</div>
                      <div className="w-12 h-16 border-2 border-purple-600 bg-purple-100 flex items-center justify-center text-3xl font-bold rounded-lg shadow-md text-purple-900">6</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-sm text-purple-800 italic">
                    "3 plus 3 equals 6!"
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 break-inside-avoid">
                  {problems.map((p, i) => (
                    <div key={i} className="border-2 border-indigo-100 rounded-xl p-4 bg-white shadow-sm break-inside-avoid relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-50 rounded-bl-xl flex items-center justify-center text-indigo-300 text-xs">

                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-10 h-12 border border-slate-200 rounded flex items-center justify-center text-2xl font-bold text-slate-700 bg-slate-50">
                          {p.num}
                        </div>
                        <div className="text-xl text-slate-400">+</div>
                        <div className="w-10 h-12 border border-indigo-200 rounded flex items-center justify-center text-2xl font-bold text-indigo-700 bg-indigo-50 relative overflow-hidden">
                          {p.num}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/50 to-transparent"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-xl text-slate-400">=</div>
                        <div className="w-16 h-12 border-b-2 border-slate-300 bg-slate-50 rounded flex items-center justify-center text-2xl text-slate-800">
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-indigo-200 rounded bg-indigo-50" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-bold text-indigo-900 mb-3 text-sm font-serif">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs text-indigo-800">
                    <div>{String.fromCharCode(0x2610)} I can double numbers 1-5</div>
                    <div>{String.fromCharCode(0x2610)} I can double numbers 6-10</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                  </div>
                </div>

                {showAnswersForDoc('doubles-facts', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Answer Key</div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-emerald-800 font-mono">
                      {problems.map((p, i) => (
                        <div key={i}>
                          {p.num}  <strong>{p.double}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }

        {
          doc === 'bundle' && showAnswers && bundleAnswerSections.length > 0 && (
            <section className="mb-10 break-inside-avoid border border-emerald-200 rounded-xl p-4 bg-emerald-50 text-emerald-900 print:border-0 print:bg-white print:text-black">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">{String.fromCodePoint(0x2705)}</h2>
              <p className="text-sm mb-4 text-emerald-900/80 print:text-slate-700">Quick glance answers for every printable in this bundle. Keep scrolling for the full worksheets, or print this page for an overview.</p>
              <div className="space-y-4">
                {bundleAnswerSections.map(({ docId, title, content }) => (
                  <div key={docId} className="print:break-inside-avoid">
                    <div className="font-semibold text-emerald-900 mb-2">{title}</div>
                    {content}
                  </div>
                ))}
              </div>
            </section>
          )
        }

        {/* Kindergarten Worksheets */}
        {
          activeDocs.includes('count-circle-1-10') && (() => {
            try {
              const docId = 'count-circle-1-10'
              const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)

              const seaCreatures = ['🐠', '🐡', '🦞', '🦀', '🐬', '🐳', '🦈', '🐙', '🦑', '🦐', '🐚', '🪸'];
              const bubbles = ['🫧', '⚪']; // Decorative background elements

              const problems = Array.from({ length: 8 }, () => {
                const count = Math.floor(rng() * 10) + 1
                const creature = seaCreatures[Math.floor(rng() * seaCreatures.length)]
                return { count, creature, objects: Array.from({ length: count }, (_, i) => i) }
              })

              return (
                <WorksheetSectionWrapper
                  docId={docId}
                  title="Undersea Counting"
                  emoji={String.fromCodePoint(0x1F522)}
                  description="Count the sea creatures in each group. Circle the correct number bubble!"
                  problemCount={problems.length}
                  learningObjectives={[
                    'Count objects accurately up to 10',
                    'Match quantities to numerals',
                    'Develop one-to-one correspondence',
                    'Build number recognition skills'
                  ]}
                  parentTeacherTips={[
                    'Encourage students to point to each creature as they count.',
                    'Ask: "How many fish did you find?"',
                    'Practice counting aloud: 1, 2, 3...',
                    'Fun Twist: Pretend to be a diver exploring the ocean!'
                  ]}
                >
                  <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 animate-gradient-x mb-4" />

                  {/* Decorative Ocean Header */}
                  <div className="w-full h-24 mb-6 relative overflow-hidden bg-gradient-to-b from-cyan-100 to-blue-100 rounded-xl border-2 border-cyan-200">
                    <div className="absolute inset-0 flex items-center justify-around opacity-30">
                      <span className="text-4xl animate-float-slow">🐟</span>
                      <span className="text-2xl animate-float-medium mt-10">🐠</span>
                      <span className="text-5xl animate-float-fast">🐡</span>
                      <span className="text-3xl animate-float-slow mt-4">🐙</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/60 px-6 py-2 rounded-full border border-cyan-300 backdrop-blur-sm">
                        <span className="text-2xl font-bold text-cyan-800 tracking-wider">OCEAN ADVENTURE</span>
                      </div>
                    </div>
                  </div>

                  {/* Worked Example */}
                  <div className="mb-6 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-lg print:border print:bg-white relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12">{String.fromCodePoint(0x1F41F)}</div>
                    <div className="font-semibold text-cyan-900 mb-3 text-sm relative z-10">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="space-y-2 text-sm relative z-10">
                      <div className="font-bold text-cyan-800">Problem: Count the Octopus friends by pointing to each one.</div>
                      <div className="flex items-center gap-4 my-2">
                        <div className="flex gap-2 text-3xl bg-white p-2 rounded-lg border border-cyan-100 shadow-sm">
                          <span>🐙</span><span>🐙</span><span>🐙</span>
                        </div>
                        <div className="text-cyan-700">{String.fromCodePoint(0x27A1)}</div>
                        <div className="flex gap-2">
                          <span className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400">2</span>
                          <span className="w-8 h-8 rounded-full border-2 border-purple-500 bg-purple-100 flex items-center justify-center font-bold text-purple-700 shadow-sm">3</span>
                          <span className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400">4</span>
                        </div>
                      </div>
                      <div className="text-xs text-cyan-700 italic">"One, Two, Three! Circle the number 3!"</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 break-inside-avoid">
                    {problems.map((p, i) => (
                      <div key={i} className="border-2 border-cyan-200 rounded-2xl p-4 bg-white relative shadow-sm">
                        {/* Water Background Effect (Subtle) */}
                        <div className="absolute inset-0 bg-cyan-50 opacity-30 rounded-2xl pointer-events-none"></div>

                        <div className="relative z-10">
                          <div className="flex gap-3 mb-4 flex-wrap justify-center min-h-[4rem] items-center px-4">
                            {p.objects.map((_, j) => (
                              <div key={j} className="text-4xl transform hover:scale-110 transition-transform duration-200 cursor-default select-none" title="Count me!">
                                {p.creature}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                              <div key={n} className="w-8 h-8 md:w-9 md:h-9 border-2 border-slate-300 rounded-full flex items-center justify-center text-sm md:text-base font-semibold text-slate-600 hover:border-cyan-400 hover:bg-cyan-50">
                                {n}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showAnswersForDoc('count-circle-1-10', () => (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                      <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                        {problems.map((p, i) => (
                          <div key={i}>
                            Box {i + 1}: <span className="font-bold">{p.count}</span> {p.creature}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </WorksheetSectionWrapper>
              )
            } catch (error) {
              console.error('Error rendering count-circle-1-10:', error)
              return (
                <div className="p-4 border-2 border-red-300 bg-red-50 rounded">
                  <p className="text-red-800">Error loading worksheet. Please refresh the page.</p>
                </div>
              )
            }
          })()
        }

        {
          activeDocs.includes('count-match-1-20') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
            const treasureItems = ['💎', '🪙', '👑', '💍', '🧭', '🗺️', '🦜', '⚔️', '🏴‍☠️'];

            const problems = Array.from({ length: 6 }, (_, idx) => {
              const count = Math.floor(rng() * 20) + 1
              const emoji = treasureItems[idx % treasureItems.length]
              return { count, emoji }
            })

            return (
              <WorksheetSectionWrapper
                docId="count-match-1-20"
                title="Treasure Hunt Counting"
                emoji={String.fromCodePoint(0x1F522)}
                description="Ahoy matey! Count the treasures in each chest and circle the matching number."
                problemCount={problems.length}
                learningObjectives={[
                  'Count objects accurately up to 20',
                  'Match quantities to numerals',
                  'Develop subitizing and one-to-one correspondence',
                  'Build number recognition skills'
                ]}
                parentTeacherTips={[
                  'Encourage students to point to each coin or gem as they count.',
                  'Ask: "How many treasures did we find?"',
                  'Try counting in groups of 5 for larger numbers.',
                  'Pretend to put the treasures in a bag as you count!'
                ]}
              >
                <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 animate-gradient-x mb-4" />

                {/* Decorative Header */}
                <div className="w-full h-20 mb-6 bg-amber-50 rounded-lg border-2 border-amber-300 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute opacity-10 text-6xl rotate-12 left-10">🏴‍☠️</div>
                  <div className="absolute opacity-10 text-6xl -rotate-12 right-10">🗺️</div>
                  <div className="text-2xl font-bold text-amber-900 flex items-center gap-3 z-10">
                    <span>💎</span> PIRATE TREASURE <span>💎</span>
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg print:border print:bg-white relative">
                  <div className="absolute -top-3 -right-3 text-4xl transform rotate-12">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="font-semibold text-yellow-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-amber-200/50 border-2 border-amber-400/50 rounded-lg flex flex-wrap items-center justify-center gap-1 p-1">
                      {Array.from({ length: 4 }).map((_, i) => <span key={i} className="text-xl">🪙</span>)}
                    </div>
                    <div className="flex-1 text-sm bg-white p-2 rounded border border-yellow-100 italic text-slate-700">
                      "I see 1, 2, 3, 4 gold coins in the chest! Circle 4!"
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                  {problems.map((p, i) => (
                    <div key={i} className="flex flex-col items-center">
                      {/* Treasure Chest Container */}
                      <div className="w-full bg-amber-100 border-4 border-amber-700 rounded-t-xl rounded-b-lg p-1 relative shadow-lg">
                        {/* Lid Detail */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-amber-800 rounded-full"></div>

                        {/* Inside the Chest */}
                        <div className="bg-amber-900/10 rounded-lg p-4 min-h-[8rem] flex items-center justify-center">
                          <div className="grid grid-cols-5 gap-1 place-items-center">
                            {Array.from({ length: p.count }).map((_, j) => (
                              <div key={j} className="text-2xl print:text-3xl leading-none drop-shadow-sm filter contrast-125">
                                {p.emoji}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Number Options - Planks */}
                      <div className="w-[90%] bg-amber-50 border-x-2 border-b-2 border-amber-200 rounded-b-xl p-3 flex justify-around shadow-sm">
                        {[p.count - 2, p.count - 1, p.count, p.count + 1, p.count + 2].filter(n => n > 0 && n <= 20).slice(0, 4).sort((a, b) => a - b).map(n => (
                          <div key={n} className="w-10 h-10 md:w-12 md:h-12 border-2 border-amber-300 rounded-lg flex items-center justify-center text-lg font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 hover:border-amber-500 cursor-pointer shadow-inner">
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {showAnswersForDoc('count-match-1-20', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                      {problems.map((p, i) => (
                        <div key={i}>
                          Chest {i + 1}: <span className="font-bold">{p.count}</span> {p.emoji === '' ? 'Coins' : p.emoji === '' ? 'Gems' : 'Treasures'}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x279C)}</div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }

        {
          activeDocs.includes('how-many-1-15') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
            const emojis = ['🎈', '⭐️', '🍪', '⚽', '🧸', '🚗', '🦋', '🐟', '🍎', '🐱', '🍦', '🚀', '🎁', '🐶']
            const problems = Array.from({ length: 8 }, () => {
              const count = Math.floor(rng() * 15) + 1
              const emoji = emojis[Math.floor(rng() * emojis.length)]
              return { count, emoji, objects: Array.from({ length: count }, (_, i) => i) }
            })
            return (
              <WorksheetSectionWrapper
                docId="how-many-1-15"
                title="How Many? (115)"
                emoji={String.fromCodePoint(0x1F4D1)}
                description="Count how many objects you see. Write the number in the box."
                problemCount={problems.length}
                learningObjectives={[
                  'Count objects accurately up to 15',
                  'Write numbers to represent quantities',
                  'Develop one-to-one correspondence',
                  'Build number recognition and writing skills'
                ]}
                parentTeacherTips={[
                  'Encourage students to point to each object as they count',
                  'Use one-to-one correspondence: one object = one number',
                  'Help students recognize that the last number counted is the total',
                  'Practice writing numbers correctly',
                  'Extension: Try counting larger groups or counting backwards'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                  <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Problem:</strong> Count the circles and write the number</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                      <div><strong>Step 1:</strong> Point to each circle and count: 1, 2, 3, 4, 5, 6, 7</div>
                      <div><strong>Step 2:</strong> The last number counted is 7, so there are 7 circles</div>
                      <div><strong>Step 3:</strong> Write the number 7 in the box</div>
                      <div className="font-semibold text-blue-900"><strong>Answer:</strong> 7</div>
                      <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="border border-slate-300 rounded-xl p-4 bg-white">
                      <div className="grid grid-cols-5 gap-2 mb-4 h-28 place-items-center content-center">
                        {p.objects.map((_, j) => (
                          <div key={j} className="text-3xl print:text-4xl leading-none">
                            {p.emoji}
                          </div>
                        ))}
                      </div>
                      <div className="text-center pt-2 border-t border-slate-100">
                        <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">How many?</p>
                        <div className="inline-block w-20 h-10 border-2 border-slate-400 rounded-lg text-center text-2xl font-bold text-slate-700 flex items-center justify-center bg-white">
                          {/* Student writes here */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Count objects around you: How many pencils? How many books?</div>
                    <div>2. Draw your own group of objects and count them</div>
                    <div>3. Try counting backwards from 15: 15, 14, 13, 12...</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can count objects accurately up to 15</div>
                    <div>{String.fromCharCode(0x2610)} I can write numbers correctly</div>
                    <div>{String.fromCharCode(0x2610)} I wrote all {problems.length} numbers correctly</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {showAnswersForDoc('how-many-1-15', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                      {problems.map((p, i) => (
                        <li key={i}><strong>Box {i + 1}:</strong> {p.count} (There are {p.count} {p.emoji} to count)</li>
                      ))}
                    </ul>
                    <div className="text-xs text-emerald-700 mt-3">{String.fromCodePoint(0x27A1)} Success!</div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }

        {
          activeDocs.includes('count-color-1-10') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)

            const shapes = [
              { name: 'Starfish', render: (props: any) => <path d="M50 8 L63 35 L92 38 L72 60 L79 90 L50 75 L21 90 L28 60 L8 38 L37 35 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" {...props} /> },
              { name: 'Fish', render: (props: any) => <path d="M75 50 Q60 30 30 30 Q10 30 10 50 Q10 70 30 70 Q60 70 75 50 Z M75 50 L90 35 V65 L75 50 M25 45 A 2 2 0 1 1 25 45.01" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" {...props} /> },
              { name: 'Shell', render: (props: any) => <path d="M20 80 Q50 10 80 80 L20 80 M50 20 L50 80 M35 25 L35 80 M65 25 L65 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" {...props} /> },
              { name: 'Jellyfish', render: (props: any) => <path d="M25 40 Q50 -10 75 40 M25 40 Q50 30 75 40 M30 40 Q30 70 25 85 M50 40 Q50 70 50 90 M70 40 Q70 70 75 85" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props} /> },
              { name: 'Seahorse', render: (props: any) => <path d="M45 20 Q60 15 60 30 Q60 45 50 50 Q45 55 45 65 Q45 80 55 85 M45 20 L35 25 M48 25 A 1 1 0 1 1 48 25.01" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props} /> },
              { name: 'Turtle', render: (props: any) => <path d="M50 30 A 15 20 0 1 1 50 70 A 15 20 0 1 1 50 30 M50 30 L50 20 M35 40 L20 25 M65 40 L80 25 M35 60 L20 75 M65 60 L80 75" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props} /> },
            ];

            const problems = Array.from({ length: 6 }, () => {
              const count = Math.floor(rng() * 10) + 1
              const total = 10
              const shape = shapes[Math.floor(rng() * shapes.length)]
              return { count, total, shape, objects: Array.from({ length: total }, (_, i) => i) }
            })
            return (
              <WorksheetSectionWrapper
                docId="count-color-1-10"
                title="Coral Reef Colors (110)"
                emoji={String.fromCodePoint(0x1F58D)}
                description="Divers found a beautiful reef! Read the number and color that many sea creatures."
                problemCount={problems.length}
                learningObjectives={[
                  'Count objects accurately up to 10',
                  'Color the correct number of items',
                  'Develop one-to-one correspondence',
                  'Build number recognition and fine motor skills'
                ]}
                parentTeacherTips={[
                  'Encourage students to count before coloring',
                  'Use one-to-one correspondence: count each creature once',
                  'Help students understand they should color exactly the number shown',
                  'Talk about the sea creatures: which one is your favorite?'
                ]}
              >
                <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500 animate-gradient-x mb-4" />

                {/* Decorative Header */}
                <div className="w-full h-24 mb-6 relative overflow-hidden bg-teal-50 rounded-xl border-2 border-teal-200">
                  <div className="absolute -bottom-4 left-0 text-6xl text-teal-200 opacity-50">🌊</div>
                  <div className="absolute -bottom-4 right-0 text-6xl text-teal-200 opacity-50">🌊</div>
                  <div className="absolute top-2 left-10 text-2xl animate-bounce-slow">🐠</div>
                  <div className="absolute top-8 right-20 text-xl animate-bounce-medium">🐡</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 px-8 py-2 rounded-full border border-teal-300 shadow-sm">
                      <span className="text-2xl font-bold text-teal-800">REEF EXPLORER</span>
                    </div>
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                  <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold text-slate-700">Task: Color 3 Fish</div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-blue-100">
                      <div className="flex gap-2">
                        <span className="text-3xl text-blue-500">{String.fromCodePoint(0x270F)}</span>
                        <span className="text-3xl text-blue-500">{String.fromCodePoint(0x270F)}</span>
                        <span className="text-3xl text-blue-500">🐠</span>
                        <span className="text-3xl text-slate-200">{String.fromCodePoint(0x270F)}</span>
                        <span className="text-3xl text-slate-200">{String.fromCodePoint(0x270F)}</span>
                      </div>
                      <div className="text-blue-600 font-bold">{String.fromCodePoint(0x270F)}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 break-inside-avoid">
                  {problems.map((p, i) => (
                    <div key={i} className="border-2 border-teal-200 rounded-xl p-6 bg-white shadow-sm relative overflow-hidden">
                      {/* Bubbles Background */}
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-teal-50 rounded-full opacity-50"></div>
                      <div className="absolute left-10 bottom-2 w-8 h-8 rounded-full border-2 border-teal-100 opacity-50"></div>

                      <div className="text-center mb-4 relative z-10">
                        <div className="inline-block px-4 py-1 bg-teal-100 rounded-full text-2xl font-bold text-teal-900 mb-2 border border-teal-300">
                          Color {p.count} {p.shape.name}{p.count > 1 ? (p.shape.name.endsWith('sh') ? '' : 's') : ''}
                        </div>
                        <div className="text-xs text-teal-600 mt-1">Found {p.total} {p.shape.name}{p.total > 1 ? (p.shape.name.endsWith('sh') ? '' : 's') : ''}. Color only {p.count}!</div>
                      </div>

                      <div className="flex gap-4 flex-wrap justify-center relative z-10">
                        {p.objects.map((_, j) => (
                          <div key={j} className="w-14 h-14 print:w-16 print:h-16 flex items-center justify-center text-slate-400 hover:text-teal-500 transition-colors duration-300 cursor-pointer">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                              {p.shape.render({})}
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {showAnswersForDoc('count-color-1-10', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                      {problems.map((p, i) => (
                        <div key={i}>
                          Box {i + 1}: Color <span className="font-bold">{p.count}</span> {p.shape.name}{p.count > 1 ? (p.shape.name.endsWith('sh') ? '' : 's') : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }

        {
          activeDocs.includes('picture-addition-10') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
            const visuals = ['🍎', '⭐️', '🍄', '⚽️', '🚗', '🐶', '🍕', '🎈']

            const problems = Array.from({ length: 8 }, () => {
              const icon = visuals[Math.floor(rng() * visuals.length)]
              const a = Math.floor(rng() * 5) + 1
              const b = Math.floor(rng() * 5) + 1
              return { a, b, sum: a + b, icon }
            })

            return (
              <WorksheetSectionWrapper
                docId="picture-addition-10"
                title="Picture Addition"
                emoji="➕"
                description="Count the pictures and add them together."
                problemCount={problems.length}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-4 flex items-center justify-center text-2xl bg-white shadow-sm">
                      <div className="flex gap-1">
                        {Array.from({ length: p.a }).map((_, k) => <div key={k}>{p.icon}</div>)}
                      </div>
                      <div className="mx-3 font-bold text-slate-400">+</div>
                      <div className="flex gap-1">
                        {Array.from({ length: p.b }).map((_, k) => <div key={k}>{p.icon}</div>)}
                      </div>
                      <div className="mx-3 font-bold text-slate-400">=</div>
                      <div className="w-12 h-12 border-2 border-slate-300 rounded-lg bg-slate-50"></div>
                    </div>
                  ))}
                </div>
                {showAnswersForDoc('picture-addition-10', () => (
                  <div className="mt-4 p-4 border-2 border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-900">
                    <div className="font-bold mb-2">Answer Key:</div>
                    <div className="grid grid-cols-4 gap-2">
                      {problems.map((p, i) => <div key={i}>{p.a} + {p.b} = <strong>{p.sum}</strong></div>)}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }

        {
          activeDocs.includes('same-different') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
            const themes = [
              { same: '🍎', diff: '🍏' },
              { same: '🐶', diff: '🐱' },
              { same: '🚗', diff: '🚙' },
              { same: '⭕️', diff: '❌' },
              { same: '🙂', diff: '😐' },
              { same: '🌲', diff: '🌳' },
              { same: '⭐️', diff: '🌟' },
              { same: '🔷', diff: '🔵' },
            ]

            const sets = Array.from({ length: 8 }, () => {
              const theme = themes[Math.floor(rng() * themes.length)]
              const different = Math.floor(rng() * 4)
              return { ...theme, different }
            })

            return (
              <WorksheetSectionWrapper
                docId="same-different"
                title="Same or Different?"
                emoji="🤔"
                description="Circle the picture that is different from the others."
                problemCount={sets.length}
              >
                <div className="space-y-4">
                  {sets.map((p, i) => (
                    <div key={i} className="flex justify-around items-center p-4 border-2 border-slate-200 rounded-xl bg-white">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="text-4xl transform hover:scale-110 transition-transform cursor-pointer">
                          {j === p.different ? p.diff : p.same}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can find the different one</div>
                    <div>{String.fromCharCode(0x2610)} I can see what's the same</div>
                    <div>{String.fromCharCode(0x2610)} I understand same and different</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>Something I found that's different:</strong> _________________________
                  </div>
                </div>

                {
                  showAnswersForDoc('same-different', () => (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                      <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {sets.map((s, i) => (<li key={i} className="text-emerald-800">Row {i + 1}: Position {s.different + 1} is different</li>))}
                      </ul>
                    </div>
                  ))
                }
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('line-tracing') && (() => {
            const rng = makeRng('line-tracing');

            // Icons for Tracing Missions (Start -> End)
            const tracingThemes = [
              {
                name: 'Nature',
                start: { label: 'Bee', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🐝</text> },
                end: { label: 'Flower', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🌸</text> }
              },
              {
                name: 'Space',
                start: { label: 'Rocket', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🚀</text> },
                end: { label: 'Planet', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🪐</text> }
              },
              {
                name: 'Home',
                start: { label: 'Car', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🚗</text> },
                end: { label: 'House', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🏠</text> }
              },
              {
                name: 'Pets',
                start: { label: 'Dog', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🐶</text> },
                end: { label: 'Bone', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🦴</text> }
              },
              {
                name: 'Sports',
                start: { label: 'Player', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🏃</text> },
                end: { label: 'Finish', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🏁</text> }
              },
              {
                name: 'Food',
                start: { label: 'Rabbit', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🐰</text> },
                end: { label: 'Carrot', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>🥕</text> }
              },
            ];

            const lines = Array.from({ length: 6 }).map((_, i) => {
              const theme = tracingThemes[i % tracingThemes.length]; // Cycle through themes
              const isDiagonal = rng() > 0.4; // 60% chance of diagonal

              // Coordinates (viewBox 0 0 100 50)
              // Start X: 15, End X: 85
              const yStart = 25;
              // If diagonal, vary End Y significantly
              const yEnd = isDiagonal
                ? (rng() > 0.5 ? 10 : 40) // Up to 10 or Down to 40
                : 25; // Straight across

              return {
                id: i,
                theme,
                x1: 15, y1: yStart,
                x2: 85, y2: yEnd,
                label: `Help the ${theme.start.label} find the ${theme.end.label}`
              };
            });
            return (
              <WorksheetSectionWrapper
                docId="line-tracing"
                title="Line Tracing Mission"
                emoji={String.fromCharCode(0xD83D, 0xDD8A, 0xFE0F)}
                description="Help the friends find their way! Trace the dashed lines."
                problemCount={lines.length}
                learningObjectives={[
                  'Trace lines from left to right',
                  'Control pencil movement (Start to Stop)',
                  'Develop fine motor precision'
                ]}
                parentTeacherTips={[
                  'Say: "Start at the Green dot, stop at the Red dot"',
                  'Encourage one continuous smooth line',
                  'Make it a game: "Zoom the rocket to the planet!"'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {lines.map((line, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-xl p-4 bg-white break-inside-avoid">
                      <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">{line.theme.name} Mission</div>
                      <div className="relative">
                        <svg viewBox="0 0 100 60" className="w-full h-32 border border-slate-100 rounded-lg bg-slate-50">
                          {/* Guide Line */}
                          <line
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke="#94a3b8"
                            strokeWidth="3"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                          />

                          {/* Start Dot (Green) */}
                          <circle cx={line.x1} cy={line.y1} r="3" fill="#22c55e" />

                          {/* End Dot (Red) */}
                          <circle cx={line.x2} cy={line.y2} r="3" fill="#ef4444" />

                          {/* Render Start Icon */}
                          <line.theme.start.render
                            x={line.x1}
                            y={line.y1}
                            fontSize="22"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />

                          {/* Render End Icon */}
                          <line.theme.end.render
                            x={line.x2}
                            y={line.y2}
                            fontSize="22"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium text-slate-700">
                        {line.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenge */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-2 text-sm">{String.fromCodePoint(0x1F680)}</div>
                  <div className="text-sm text-purple-800">
                    Can you trace the lines without lifting your pencil?
                  </div>
                </div>

                {showAnswersForDoc('line-tracing', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Mission Check</div>
                    <div className="text-sm text-emerald-800">
                      Check if the line connects the two pictures neatly. Did they stay on the dashed line?
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('curve-tracing') && (() => {
            const rng = makeRng('curve-tracing');

            // Themes: Start -> End paired with a Curve Type preference
            const curveThemes = [
              {
                name: 'Frog Hop',
                type: 'arc', // Quadratic Bezier (Job)
                start: { label: 'Frog', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F438)}</text> },
                end: { label: 'Lilypad', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1FAB7)}</text> }
              },
              {
                name: 'Kangaroo Jump',
                type: 'arc',
                start: { label: 'Kangaroo', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F998)}</text> },
                end: { label: 'Grass', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F33F)}</text> }
              },
              {
                name: 'Dolphin Dive',
                type: 'wave', // S-Curve
                start: { label: 'Dolphin', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F42C)}</text> },
                end: { label: 'Ocean', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F30A)}</text> }
              },
              {
                name: 'Butterfly Flutter',
                type: 'loop', // Complex wave/loop
                start: { label: 'Butterfly', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F98B)}</text> },
                end: { label: 'Flower', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F33C)}</text> }
              },
              {
                name: 'Bee Flight',
                type: 'wave',
                start: { label: 'Bee', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F41D)}</text> },
                end: { label: 'Hive', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F3E2)}</text> }
              },
              {
                name: 'Bunny Hop',
                type: 'arc',
                start: { label: 'Bunny', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F430)}</text> },
                end: { label: 'Carrot', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F955)}</text> }
              },
            ];

            const curves = Array.from({ length: 6 }).map((_, i) => {
              const theme = curveThemes[i % curveThemes.length];

              // Coordinates
              const x1 = 15, y1 = 40;
              const x2 = 85, y2 = 40;

              let d = '';
              // Generate path based on type
              if (theme.type === 'arc') {
                // High arch: Control point in middle, very high
                // Randomize height slightly: 5 to 15
                const controlY = 5 + (rng() * 10);
                d = `M ${x1} ${y1} Q 50 ${controlY}, ${x2} ${y2}`;
              } else if (theme.type === 'wave') {
                // S-Curve: Up then Down
                // C (x1+20, y1-20) (x2-20, y2+20) x2 y2
                const amp = 15 + rng() * 10;
                d = `M ${x1} ${y1} C ${x1 + 25} ${y1 - amp}, ${x2 - 25} ${y2 + amp}, ${x2} ${y2}`;
              } else {
                // Loop/Flutter: Double bump
                // M start Q (1/3, up) (1/2, mid) Q (2/3, down) end
                const midX = 50;
                const amp = 20;
                d = `M ${x1} ${y1} Q ${x1 + 15} ${y1 - amp} ${midX} ${y1} Q ${x2 - 15} ${y2 + amp} ${x2} ${y2}`;
              }

              return {
                id: i,
                theme,
                x1, y1, x2, y2,
                d,
                label: `Help the ${theme.start.label} reach the ${theme.end.label}`
              };
            });
            return (
              <WorksheetSectionWrapper
                docId="curve-tracing"
                title="Curve Tracing Adventure"
                emoji={String.fromCharCode(0xD83D, 0xDC3E)}
                description="Follow the path! Help the animals move."
                problemCount={curves.length}
                learningObjectives={[
                  'Trace curved lines (Waves and Arcs)',
                  'Develop fluid pencil movement',
                  'Practice continuous strokes'
                ]}
                parentTeacherTips={[
                  'Encourage one continuous smooth motion (no stopping)',
                  'Say: "Up and down like a wave"',
                  'Rotate the paper if needed'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {curves.map((curve, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-xl p-4 bg-white break-inside-avoid">
                      <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">{curve.theme.name}</div>
                      <div className="relative">
                        <svg viewBox="0 0 100 60" className="w-full h-32 border border-slate-100 rounded-lg bg-slate-50">
                          {/* Guide Line */}
                          <path
                            d={curve.d}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="3"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                          />

                          {/* Start Dot (Green) */}
                          <circle cx={curve.x1} cy={curve.y1} r="3" fill="#22c55e" />

                          {/* End Dot (Red) */}
                          <circle cx={curve.x2} cy={curve.y2} r="3" fill="#ef4444" />

                          {/* Render Start Icon */}
                          <curve.theme.start.render
                            x={curve.x1}
                            y={curve.y1}
                            fontSize="22"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />

                          {/* Render End Icon */}
                          <curve.theme.end.render
                            x={curve.x2}
                            y={curve.y2}
                            fontSize="22"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium text-slate-700">
                        {curve.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenge */}
                <div className="mt-6 print:mt-0 p-4 bg-blue-50 border-2 border-blue-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-blue-900 mb-2 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                  <div className="text-sm text-blue-800">
                    <div>1. Trace the wave with your finger first.</div>
                    <div>2. Now try with a blue crayon!</div>
                  </div>
                </div>

                {showAnswersForDoc('curve-tracing', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="text-sm text-emerald-800">
                      Did the line stay smooth? Did they connect the start to the end?
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('zigzag-lines') && (() => {
            const rng = makeRng('zigzag-lines');

            // Themes: Start -> End
            const zigzagThemes = [
              {
                name: 'Mountain Climb',
                type: 'mountain', // Wide, tall
                start: { label: 'Hiker', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F9D7)}</text> },
                end: { label: 'Flag', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F6A9)}</text> }
              },
              {
                name: 'Brushing Teeth',
                type: 'teeth', // Sharp, narrow
                start: { label: 'Tooth', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F9B7)}</text> },
                end: { label: 'Sparkle', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F9EA)}</text> }
              },
              {
                name: 'Bunny Hops',
                type: 'grass', // Regular
                start: { label: 'Bunny', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F430)}</text> },
                end: { label: 'Carrot', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F955)}</text> }
              },
              {
                name: 'Stormy Sky',
                type: 'lightning', // Irregular
                start: { label: 'Cloud', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x2601)}</text> },
                end: { label: 'Tree', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F332)}</text> }
              },
              {
                name: 'Pyramid Trek',
                type: 'mountain',
                start: { label: 'Camel', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F42A)}</text> },
                end: { label: 'Oasis', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F3DD)}</text> }
              },
              {
                name: 'Puppy Run',
                type: 'grass',
                start: { label: 'Dog', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F436)}</text> },
                end: { label: 'Bone', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F9B4)}</text> }
              },
            ];

            const zigzagPaths = Array.from({ length: 6 }).map((_, i) => {
              const theme = zigzagThemes[i % zigzagThemes.length];

              // Coordinates
              const xStart = 15;
              const xEnd = 85;
              const yBase = 50;

              let points = [`${xStart} ${yBase}`];
              let currentX = xStart;

              // Configuration based on type
              let minWidth, maxWidth, minHeight, maxHeight;

              if (theme.type === 'mountain') {
                minWidth = 15; maxWidth = 25;
                minHeight = 25; maxHeight = 35;
              } else if (theme.type === 'teeth') {
                minWidth = 8; maxWidth = 12;
                minHeight = 15; maxHeight = 25;
              } else {
                // grass/lightning
                minWidth = 12; maxWidth = 18;
                minHeight = 20; maxHeight = 30;
              }

              let up = true;

              while (currentX < xEnd) {
                // Determine step width
                const stepW = minWidth + (rng() * (maxWidth - minWidth));

                // Check if next step overshoots significantly, if so, clamp to end
                let nextX = currentX + stepW;
                if (nextX > xEnd) {
                  nextX = xEnd;
                }

                // Determine height target
                // Up moves to yBase - height, Down moves to yBase + height?
                // Actually lets align 'base' as center (50), so Up is < 50, Down is > 50?
                // Or just zigzag from Base (50) to Peak (20) back to Base (50)?
                // Let's do triangular pulses: Base -> Peak -> Base

                // Simple zigzag: Alternating High/Low
                // Low = 50 + (height/2), High = 50 - (height/2)
                const h = minHeight + (rng() * (maxHeight - minHeight));
                const yTarget = up ? (50 - h) : (50 + h);

                points.push(`${nextX} ${yTarget}`);

                currentX = nextX;
                up = !up;
              }

              // Ensure we end at a reasonable spot? 
              // The logic above traces to xEnd.
              // Let's create the SVG path command.
              // M x0 y0 L x1 y1 L x2 y2 ...
              const d = 'M ' + points.map(p => p).join(' L ');

              // Calculate start/end for dots (First and Last point)
              // Parse "x y"
              const startCoord = points[0].split(' ');
              const endCoord = points[points.length - 1].split(' ');

              return {
                id: i,
                theme,
                d,
                x1: parseFloat(startCoord[0]),
                y1: parseFloat(startCoord[1]),
                x2: parseFloat(endCoord[0]),
                y2: parseFloat(endCoord[1]),
                label: `Trace the ${theme.type} path!`
              };
            });

            return (
              <WorksheetSectionWrapper
                docId="zigzag-lines"
                title="Zigzag Mountains & Monsters"
                emoji={String.fromCharCode(0x26F0, 0xFE0F)}
                description="Climb the mountains and brush the teeth! Trace the sharp lines."
                problemCount={zigzagPaths.length}
                learningObjectives={[
                  'Trace angular lines (Zigzags)',
                  'Practice sharp turns (Stop and Pivot)',
                  'Develop rhythm in writing'
                ]}
                parentTeacherTips={[
                  'Say: "Zoom UP, Stop. Zoom DOWN, Stop."',
                  'Encourage sharp points, not rounded curves',
                  'Keep the pencil on the paper'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-gradient-x mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {zigzagPaths.map((path, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-xl p-4 bg-white break-inside-avoid">
                      <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">{path.theme.name}</div>
                      <div className="relative">
                        <svg viewBox="0 0 100 80" className="w-full h-32 border border-slate-100 rounded-lg bg-slate-50">
                          {/* Guide Line */}
                          <path
                            d={path.d}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="3"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Start Dot (Green) */}
                          <circle cx={path.x1} cy={path.y1} r="3" fill="#22c55e" />

                          {/* End Dot (Red) */}
                          <circle cx={path.x2} cy={path.y2} r="3" fill="#ef4444" />

                          {/* Render Start Icon */}
                          <path.theme.start.render
                            x={path.x1}
                            y={path.y1}
                            fontSize="22"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />

                          {/* Render End Icon */}
                          <path.theme.end.render
                            x={path.x2}
                            y={path.y2}
                            fontSize="22"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium text-slate-700">
                        {path.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenge */}
                <div className="mt-6 print:mt-0 p-4 bg-emerald-50 border-2 border-emerald-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-emerald-900 mb-2 text-sm">{String.fromCodePoint(0x2705)}</div>
                  <div className="text-sm text-emerald-800">
                    <div>1. Can you draw mountains on the back?</div>
                    <div>2. Draw sharp teeth for a silly monster!</div>
                  </div>
                </div>

                {showAnswersForDoc('zigzag-lines', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="text-sm text-emerald-800">
                      Are the points sharp? Did the line go up and down?
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('path-tracing') && (() => {
            const rng = makeRng('path-tracing');

            // Themes: Start -> End
            const pathThemes = [
              {
                name: 'City Drive',
                type: 'road',
                start: { label: 'Car', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F697)}</text> },
                end: { label: 'Garage', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F3E0)}</text> }
              },
              {
                name: 'Mouse Hunt',
                type: 'tube',
                start: { label: 'Mouse', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F42D)}</text> },
                end: { label: 'Cheese', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F9C0)}</text> }
              },
              {
                name: 'Space Mission',
                type: 'road',
                start: { label: 'Rocket', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F680)}</text> },
                end: { label: 'Earth', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F30D)}</text> }
              },
              {
                name: 'Bear Cave',
                type: 'tube',
                start: { label: 'Bear', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F43B)}</text> },
                end: { label: 'Cave', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F573)}</text> }
              },
              {
                name: 'Deep Sea',
                type: 'road',
                start: { label: 'Sub', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F6F3)}</text> },
                end: { label: 'Gem', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F48E)}</text> }
              },
              {
                name: 'Garden Path',
                type: 'tube',
                start: { label: 'Bee', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F41D)}</text> },
                end: { label: 'Flower', render: (props: any) => <text fontSize="40" x="50" y="65" textAnchor="middle" {...props}>{String.fromCodePoint(0x1F33B)}</text> }
              },
            ];

            const mazePaths = Array.from({ length: 6 }).map((_, i) => {
              const theme = pathThemes[i % pathThemes.length];

              // Coordinates
              const x1 = 20, y1 = 20;
              const x2 = 80, y2 = 80;

              let d = '';
              // Logic: Generate a path that stays within bounds but has turns
              // Grid: 20, 50, 80

              const type = i % 3; // 0: L-shape, 1: Z-shape, 2: Curve

              if (type === 0) {
                // L-Shape variations
                // 1: Right then Down
                // 2: Down then Right
                const downFirst = rng() > 0.5;
                if (downFirst) {
                  d = `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`;
                } else {
                  d = `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}`;
                }
              } else if (type === 1) {
                // Z-Shape / Step
                // Right, Down, Right OR Down, Right, Down
                const downFirst = rng() > 0.5;
                if (downFirst) {
                  const midY = 50;
                  d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
                } else {
                  const midX = 50;
                  d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
                }
              } else {
                // Curve / S-Bend
                // C (x1, y2) (x2, y1) x2 y2
                const cp1x = x1 + (rng() * 40);
                const cp1y = y1 + (rng() * 60);
                const cp2x = x2 - (rng() * 40);
                const cp2y = y2 - (rng() * 60);
                d = `M ${x1} ${y1} C ${cp1x} ${y1} ${cp2x} ${y2} ${x2} ${y2}`;
              }

              return {
                id: i,
                theme,
                d,
                x1, y1, x2, y2,
                label: `Help the ${theme.start.label} find the ${theme.end.label}`
              };
            });

            return (
              <WorksheetSectionWrapper
                docId="path-tracing"
                title="Lost & Found Mazes"
                emoji={String.fromCharCode(0xD83D, 0xDE97)}
                description="Follow the road! Don't go off the track."
                problemCount={mazePaths.length}
                learningObjectives={[
                  'Trace inside lines (Precision)',
                  'Solve simple mazes',
                  'Plan hand movement'
                ]}
                parentTeacherTips={[
                  'Say: "Stay on the road!"',
                  'If they go off, say "Crash! Try again."',
                  'Use a thick marker for easier tracing'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 animate-gradient-x mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {mazePaths.map((path, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-xl p-4 bg-white break-inside-avoid">
                      <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">{path.theme.name}</div>
                      <div className="relative">
                        <svg viewBox="0 0 100 100" className="w-full h-48 border border-slate-100 rounded-lg bg-slate-50">
                          {/* Road Background - Thick Light Gray */}
                          <path
                            d={path.d}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Road Center - Dashed White/Darker */}
                          <path
                            d={path.d}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Start Dot (Green) */}
                          <circle cx={path.x1} cy={path.y1} r="3" fill="#22c55e" />

                          {/* End Dot (Red) */}
                          <circle cx={path.x2} cy={path.y2} r="3" fill="#ef4444" />

                          {/* Render Start Icon */}
                          <path.theme.start.render
                            x={path.x1}
                            y={path.y1}
                            fontSize="28"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />

                          {/* Render End Icon */}
                          <path.theme.end.render
                            x={path.x2}
                            y={path.y2}
                            fontSize="28"
                            dominantBaseline="middle"
                            style={{ userSelect: 'none' }}
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium text-slate-700">
                        {path.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenge */}
                <div className="mt-6 print:mt-0 p-4 bg-orange-50 border-2 border-orange-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-orange-900 mb-2 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="text-sm text-orange-800">
                    <div>1. Trace fast like a race car!</div>
                    <div>2. Trace slow like a turtle.</div>
                    <div>3. Can you do it without touching the sides?</div>
                  </div>
                </div>

                {showAnswersForDoc('path-tracing', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="text-sm text-emerald-800">
                      Did they stay on the gray road? Did they reach the end?
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('perimeter-shapes') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
            const problems = Array.from({ length: 6 }, () => {
              const length = nextInt(4, 10);
              const width = nextInt(3, 8);
              return { length, width, perimeter: 2 * (length + width) };
            });
            const renderRectangle = (length: number, width: number) => {
              const scale = 8;
              const rectWidth = length * scale;
              const rectHeight = width * scale;
              const viewBoxWidth = Math.max(rectWidth, 60) + 20;
              const viewBoxHeight = Math.max(rectHeight, 60) + 20;
              const x = (viewBoxWidth - rectWidth) / 2;
              const y = (viewBoxHeight - rectHeight) / 2;

              return (
                <svg width="120" height="80" viewBox="0 0 120 80" className="overflow-visible">
                  <rect
                    x={60 - (length * 10 / 2)}
                    y={40 - (width * 10 / 2)}
                    width={length * 10}
                    height={width * 10}
                    fill="#3b82f6"
                    fillOpacity="0.1"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                  />
                  {/* Dimensions */}
                  <text x="60" y={40 - (width * 10 / 2) - 5} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e3a8a">{length} units</text>
                  <text x={60 - (length * 10 / 2) - 8} y="40" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e3a8a" transform={`rotate(-90 ${60 - (length * 10 / 2) - 8} 40)`}>{width} units</text>
                </svg>
              );
            };
            return (
              <WorksheetSectionWrapper
                docId="perimeter-shapes"
                title="Perimeter of Shapes"
                emoji={String.fromCharCode(0xD83D, 0xDF92)}
                description="Find the perimeter of each rectangle."
                problemCount={problems.length}
                learningObjectives={[
                  'Calculate perimeter of rectangles',
                  'Understand that perimeter is the distance around a shape',
                  'Use the formula: Perimeter = 2  (length + width)'
                ]}
                parentTeacherTips={[
                  'Perimeter = distance around the shape',
                  'For rectangles: P = 2  (length + width)',
                  'Or: P = length + width + length + width',
                  'Extension: Find perimeter of irregular shapes'
                ]}
              >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 bg-blue-900 rounded-xl overflow-hidden shadow-lg border-2 border-blue-800 print:border print:bg-white text-white">
                  <div className="bg-blue-800 px-4 py-2 flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span className="font-bold uppercase tracking-wider text-sm">Worked Example: Site Analysis</span>
                  </div>
                  <div className="p-4 flex flex-col md:flex-row gap-6 bg-gradient-to-br from-blue-900 to-blue-800 print:text-black print:from-white print:to-white">
                    <div className="w-full md:w-32 h-24 bg-blue-600 border border-white/30 relative rounded overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 opacity-20 bg-[size:10px_10px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"></div>
                      <div className="absolute inset-4 border-2 border-white/60 bg-white/10 flex items-center justify-center font-mono text-xs text-white">
                        5 x 3
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="text-sm">We need to find the perimeter of a rectangle that is <strong>5 units long</strong> and <strong>3 units wide</strong>.</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/10 p-2 rounded border border-white/20">
                          <div className="text-[10px] uppercase opacity-70">Step 1: Add Sides</div>
                          <div className="font-mono font-bold">5 + 3 = 8</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded border border-white/20">
                          <div className="text-[10px] uppercase opacity-70">Step 2: Double It</div>
                          <div className="font-mono font-bold">8 × 2 = 16</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                        <span className="font-bold text-yellow-300 print:text-blue-800 uppercase tracking-tight">Total Perimeter: 16 units</span>
                        <span className="text-[10px] italic opacity-80">Tip: Distance around!</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="break-inside-avoid">
                      <div className="bg-blue-600 p-1 rounded-t-lg w-fit px-3 text-white text-xs font-bold font-mono tracking-wider border-t border-l border-r border-white relative top-0.5 z-10">PLOT #{i + 1}</div>
                      <div className="bg-blue-50 border-2 border-blue-900 p-4 relative overflow-hidden shadow-sm">
                        {/* Blueprint Grid Background */}
                        <div className="absolute inset-0 opacity-10 bg-[size:10px_10px] bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center">
                          <div className="mb-2">
                            {renderRectangle(p.length, p.width)}
                          </div>

                          <div className="w-full flex items-center justify-between gap-2 mt-2 bg-white px-2 py-1 rounded border border-blue-200">
                            <div className="flex gap-3">
                              <span className="text-[10px] font-bold text-blue-900">L: {p.length}</span>
                              <span className="text-[10px] font-bold text-blue-900">W: {p.width}</span>
                            </div>
                            <div className="flex-1 flex items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-400">P:</span>
                              <div className="flex-1 border-b border-black h-4"></div>
                              <span className="text-[8px] text-slate-500">units</span>
                            </div>
                          </div>
                          <div className="w-full mt-3">
                            <div className="text-[8px] uppercase font-bold text-slate-400 mb-1">Calculation Area:</div>
                            <div className="h-10 border border-dashed border-blue-200 rounded bg-white/50"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)} Rocket Challenge</div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Find the perimeter of a square with side length 6</div>
                    <div>2. A rectangle has perimeter 20. If length is 7, what is the width?</div>
                    <div>3. Find the perimeter of your desk or table</div>
                  </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)} Self-Assessment</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can find the perimeter of rectangles</div>
                    <div>{String.fromCharCode(0x2610)} I understand what perimeter means</div>
                    <div>{String.fromCharCode(0x2610)} I can use the formula correctly</div>
                  </div>
                  <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                  </div>
                </div>
                {showAnswersForDoc('perimeter-shapes', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Answer Key (with steps)</div>
                    <div className="space-y-3">
                      {problems.map((p, i) => (
                        <div key={i} className="border-b border-emerald-200 pb-3 last:border-b-0">
                          <div className="font-semibold mb-2 text-sm">{i + 1}. Length: {p.length}, Width: {p.width}</div>
                          <div className="text-xs text-emerald-800 space-y-1 pl-4">
                            <div><strong>Step 1:</strong> {p.length} + {p.width} = {p.length + p.width}</div>
                            <div><strong>Step 2:</strong> {p.length + p.width} × 2 = {p.perimeter}</div>
                            <div className="font-semibold">Answer: {p.perimeter} units</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('area-rectangles') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const problems = Array.from({ length: 6 }, () => {
              const length = nextInt(4, 9);
              const width = nextInt(2, 6);
              return { label: `Room ${String.fromCharCode(65 + nextInt(0, 5))}-${nextInt(10, 99)}`, length, width, area: length * width };
            });

            return (
              <WorksheetSectionWrapper
                docId="area-rectangles"
                title="Construction Zone: Blueprint Area"
                emoji={String.fromCharCode(0xD83C, 0xDFE0)}
                description="The architect needs the floor area for each room! Calculate the space inside the blueprints."
                problemCount={problems.length}
                learningObjectives={[
                  'Calculate area of rectangles using multiplication',
                  'Understand area as \"space inside\" (square units)',
                  'Read blueprint dimensions'
                ]}
                parentTeacherTips={[
                  'Area = Length  Width',
                  'Imagine tiling the floor with squares',
                  'Units are always \"squared\" (sq ft, sq m) for area'
                ]}
              >
                {/* Blueprint Header */}
                <div className="print:hidden w-full h-16 mb-6 relative overflow-hidden bg-blue-600 rounded-lg flex items-center justify-center border-4 border-white shadow-lg">
                  <div className="absolute inset-0 opacity-30 bg-[size:20px_20px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]"></div>
                  <div className="text-2xl font-black text-white z-10 flex gap-4 items-center tracking-widest uppercase" style={{ textShadow: '2px 2px 0px #000' }}>
                    ARCHITECT BLUEPRINTS
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-900 text-white border-2 border-white rounded-lg print:bg-white print:text-black print:border-blue-900 shadow-md">
                  <div className="flex gap-4 items-start">
                    <div className="hidden md:block w-32 h-24 bg-blue-600 border border-white relative">
                      <div className="absolute inset-0 opacity-30 bg-[size:10px_10px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-mono text-xs">
                        5 x 4
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold border-b border-blue-400 mb-2 pb-1 text-sm uppercase">Example: Master Bedroom</div>
                      <div className="space-y-1 text-sm font-mono">
                        <div>Length: 5 units</div>
                        <div>Width:  4 units</div>
                        <div className="mt-2 text-yellow-300 print:text-blue-700 font-bold">{String.fromCodePoint(0x279C)} Area: 20 sq units</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="break-inside-avoid">
                      <div className="bg-blue-600 p-1 rounded-t-lg w-fit px-3 text-white text-xs font-bold font-mono tracking-wider border-t border-l border-r border-white relative top-0.5 z-10">{p.label}</div>
                      <div className="bg-blue-50 border-2 border-blue-900 p-4 relative overflow-hidden shadow-sm">
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-10 bg-[size:10px_10px] bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center">
                          <div className="mb-2">
                            <svg width="120" height="80" viewBox="0 0 120 80" className="overflow-visible">
                              <rect
                                x={60 - (p.length * 10 / 2)}
                                y={40 - (p.width * 10 / 2)}
                                width={p.length * 10}
                                height={p.width * 10}
                                fill="#3b82f6"
                                fillOpacity="0.2"
                                stroke="#1e3a8a"
                                strokeWidth="2"
                              />
                              {/* Dimensions */}
                              <text x="60" y={40 + (p.width * 10 / 2) + 12} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e3a8a">{p.length} units</text>
                              <text x={60 - (p.length * 10 / 2) - 10} y="40" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e3a8a" transform={`rotate(-90 ${60 - (p.length * 10 / 2) - 10} 40)`}>{p.width} units</text>
                            </svg>
                          </div>

                          <div className="w-full flex items-center justify-between gap-2 mt-2 bg-white px-2 py-1 rounded border border-blue-200">
                            <span className="text-xs font-bold text-blue-900">AREA:</span>
                            <div className="w-16 border-b border-black"></div>
                            <span className="text-[10px] text-slate-500">sq units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x1F4CB)} Self-Assessment</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x2705)} I can find the area of a rectangle by multiplying.</div>
                    <div>{String.fromCodePoint(0x2705)} I can explain what area represents in a blueprint.</div>
                    <div>{String.fromCodePoint(0x2705)} I can use square units correctly.</div>
                  </div>
                </div>

                {showAnswersForDoc('area-rectangles', () => (
                  <div className="mt-6 p-4 border-4 border-double border-blue-900 bg-blue-50 rounded print:border print:bg-white print:page-break-before-always font-mono">
                    <div className="text-center font-bold text-blue-900 mb-6 text-xl border-b border-blue-200 pb-2">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {problems.map((p, i) => (
                        <div key={i} className="flex justify-between border-b border-blue-200 pb-1">
                          <span>{String.fromCodePoint(0x279C)}</span>
                          <span className="font-bold">{p.area} sq units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }
        {
          activeDocs.includes('time-to-minute') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const times = Array.from({ length: 6 }, () => {
              const hour = nextInt(1, 12);
              const minute = nextInt(0, 59);
              return `${hour}:${minute.toString().padStart(2, '0')}`;
            });
            const renderClockTheme = (time: string, seed: number) => {
              const [hours, minutes] = time.split(':').map(Number);
              const hourAngle = ((hours % 12) * 30 + minutes * 0.5 - 90) * (Math.PI / 180);
              const minuteAngle = (minutes * 6 - 90) * (Math.PI / 180);
              const centerX = 50;
              const centerY = 50;
              const radius = 35;

              // Future/Tech styled clock
              return (
                <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto mb-2">
                  <defs>
                    <radialGradient id={`clockGrad${seed}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="90%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </radialGradient>
                  </defs>

                  {/* Outer Rim */}
                  <circle cx={centerX} cy={centerY} r={radius + 4} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10 2" className="animate-[spin_10s_linear_infinite]" />
                  <circle cx={centerX} cy={centerY} r={radius} fill={`url(#clockGrad${seed})`} stroke="#60a5fa" strokeWidth="1" />

                  {/* Ticks */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const isMain = i % 3 === 0;
                    const len = isMain ? 6 : 3;
                    const x1 = centerX + (radius - len) * Math.cos(angle);
                    const y1 = centerY + (radius - len) * Math.sin(angle);
                    const x2 = centerX + (radius - 1) * Math.cos(angle);
                    const y2 = centerY + (radius - 1) * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMain ? "#60a5fa" : "#475569"} strokeWidth={isMain ? 2 : 1} />;
                  })}

                  {/* Hands - Glowing */}
                  <line x1={centerX} y1={centerY} x2={centerX + 18 * Math.cos(hourAngle)} y2={centerY + 18 * Math.sin(hourAngle)} stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                  <line x1={centerX} y1={centerY} x2={centerX + 28 * Math.cos(minuteAngle)} y2={centerY + 28 * Math.sin(minuteAngle)} stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

                  {/* Center Hub */}
                  <circle cx={centerX} cy={centerY} r="3" fill="#0891b2" stroke="white" strokeWidth="1" />
                </svg>
              );
            };
            return (
              <WorksheetSectionWrapper
                docId="time-to-minute"
                title="Time Traveler's Mission"
                emoji={String.fromCharCode(0x23F0)}
                description="Use the Temporal Portals to jump through time! Read the clock to set your destination."
                problemCount={times.length}
                learningObjectives={[
                  'Read time on analog clocks to the minute',
                  'Understand hour and minute hands',
                  'Write time in digital format'
                ]}
                parentTeacherTips={[
                  'Blue Hand (Short) = Hours',
                  'Aqua Hand (Long) = Minutes',
                  'Each number equals 5 minutes',
                  'Mission: Write the time exactly!'
                ]}
              >
                {/* Time Travel Header */}
                <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-slate-900 rounded-lg flex items-center justify-center border-b-4 border-cyan-500">
                  <div className="absolute inset-x-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-80"></div>
                  {/* Stars */}
                  <div className="absolute top-2 left-10 text-xs text-white opacity-60">{String.fromCodePoint(0x2B50)}</div>
                  <div className="absolute bottom-4 right-20 text-xs text-white opacity-40">{String.fromCodePoint(0x2B50)}</div>

                  <div className="text-2xl font-mono text-cyan-400 z-10 flex gap-4 items-center tracking-widest shadow-cyan-500/50">
                    <span>{String.fromCodePoint(0x2B50)}</span> CHRONOS SYSTEM <span>{String.fromCodePoint(0x2B50)}</span>
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-slate-100 border-2 border-slate-300 rounded-lg print:border print:bg-white flex gap-4 items-center">
                  <div className="shrink-0">
                    <svg viewBox="0 0 100 100" className="w-20 h-20">
                      <circle cx="50" cy="50" r="35" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="50" y1="50" x2="65" y2="65" stroke="#06b6d4" strokeWidth="3" />
                      <line x1="50" y1="50" x2="50" y2="20" stroke="#22d3ee" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="space-y-1 text-sm font-mono text-slate-700">
                    <div className="font-bold text-indigo-700">DESTINATION: DINO ERA</div>
                    <div>Hour Hand (Short): Past 4</div>
                    <div>Minute Hand (Long): At 12 (:00)</div>
                    <div className="bg-slate-800 text-green-400 inline-block px-2 py-1 rounded font-bold mt-1">TIME SET: 4:00</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                  {times.map((t, i) => (
                    <div key={i} className="border-4 border-slate-200 rounded-xl p-4 bg-white break-inside-avoid relative overflow-hidden shadow-sm">
                      {/* Tech deco */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-100 rounded-tl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-100 rounded-br-xl"></div>

                      {renderClockTheme(t, i)}

                      <div className="text-center font-mono text-slate-500 text-xs mb-1">TARGET COORDINATES</div>
                      <div className="flex justify-center">
                        <div className="bg-slate-100 border-2 border-slate-300 rounded px-4 py-2 w-32 h-12 flex items-center justify-center">
                          {/* Student writes time here */}
                          <span className="text-slate-300 text-2xl font-digital">__:__</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs font-mono">
                    <div>[ ] Time jump successful</div>
                    <div>[ ] No temporal paradoxes detected</div>
                    <div>[ ] Ready for next jump</div>
                  </div>
                </div>

                {showAnswersForDoc('time-to-minute', () => (
                  <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-2 gap-4">
                      {times.map((t, i) => (
                        <div key={i} className="text-sm border-b border-emerald-200 pb-2">
                          <span className="font-mono font-bold text-emerald-800">JUMP #{i + 1}:</span> {t}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('customary-units') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
            const problems = Array.from({ length: 6 }, () => {
              const feet = nextInt(1, 10);
              return { feet, inches: feet * 12 };
            });
            return (
              <WorksheetSectionWrapper
                docId="customary-units"
                title="Mad Science: Length Formula"
                emoji={String.fromCharCode(0xD83E, 0xDDEC)}
                description="Professor Quant needs precise measurements for the secret formula! Convert the units to complete the experiment."
                problemCount={problems.length}
                learningObjectives={[
                  'Convert between inches, feet, and yards',
                  'Understand customary measurement relationships',
                  'Use multiplication and division for conversions'
                ]}
                parentTeacherTips={[
                  '1 foot = 12 inches',
                  '1 yard = 3 feet = 36 inches',
                  'Scientist Tip: Big Unit -> Small Unit = Multiply!',
                  'Precision is key in the lab.'
                ]}
              >
                {/* Lab Header */}
                <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-slate-800 rounded-lg flex items-center justify-center border-b-4 border-lime-400">
                  <div className="text-2xl font-mono text-lime-400 font-bold z-10 flex gap-4 items-center animate-pulse">
                    <span>{String.fromCodePoint(0x279C)}</span>
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-yellow-50 border-4 border-slate-800 rounded-lg print:border print:bg-white shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
                  <div className="font-mono text-slate-900 font-bold border-b-2 border-slate-800 mb-2 pb-1">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-sm font-mono text-slate-800">
                    <div className="text-base"><strong>TASK:</strong> Convert 3 Feet of Copper Wire</div>
                    <div className="pl-4 border-l-4 border-lime-400 bg-white p-2 space-y-1">
                      <div><strong className="text-blue-600">FORMULA:</strong> 1 Foot = 12 Inches</div>
                      <div>{String.fromCodePoint(0x270F)}</div>
                      <div className="font-bold text-lg text-lime-600 bg-slate-900 inline-block px-2 transform -rotate-1">RESULT: 36 INCHES</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-slate-100 border-2 border-slate-300 rounded text-sm text-slate-700 font-mono text-center">
                  <strong>{String.fromCodePoint(0x270F)}</strong> 1 Yard = 3 Feet | 1 Foot = 12 Inches
                </div>

                <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-lg p-0 bg-white break-inside-avoid overflow-hidden">
                      <div className="bg-slate-100 p-2 border-b border-slate-300 font-mono text-xs text-slate-500 flex justify-between">
                        <span>SAMPLE #{i + 140}</span>
                        <span>STATUS: PENDING</span>
                      </div>
                      <div className="p-4">
                        <div className="text-center mb-3 font-bold text-lg font-mono text-slate-800">
                          {p.feet} FEET <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span> ____ INCHES
                        </div>

                        {/* Visual Ruler */}
                        <div className="h-6 w-full bg-yellow-300 border border-yellow-500 mb-3 relative opacity-50">
                          <div className="absolute top-0 bottom-0 left-0 w-px bg-black"></div>
                          <div className="absolute top-0 bottom-0 left-1/4 w-px bg-black opacity-50"></div>
                          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black"></div>
                          <div className="absolute top-0 bottom-0 left-3/4 w-px bg-black opacity-50"></div>
                          <div className="absolute top-0 bottom-0 right-0 w-px bg-black"></div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase mb-1">Calculations:</div>
                          <div className="h-8 border-b border-dashed border-slate-300"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                  </div>
                </div>

                {showAnswersForDoc('customary-units', () => (
                  <div className="mt-6 p-4 border-2 border-lime-500 bg-lime-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-lime-900 mb-3 text-base font-mono">{String.fromCodePoint(0x279C)}</div>
                    <div className="space-y-3">
                      {problems.map((p, i) => (
                        <div key={i} className="border-b border-lime-200 pb-3 last:border-b-0 font-mono text-sm">
                          <div><strong>SAMPLE #{i + 140}:</strong> {p.feet} ft = <span className="bg-lime-200 px-1">{p.inches} in</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('metric-units') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
            const problems = Array.from({ length: 6 }, () => {
              const meters = nextInt(1, 10);
              return { meters, centimeters: meters * 100 };
            });
            return (
              <WorksheetSectionWrapper
                docId="metric-units"
                title="Mad Science: Metric Analysis"
                emoji={String.fromCharCode(0xD83D, 0xDCCF)}
                description="Analyze the samples using the metric system! Convert meters to centimeters for the final report."
                problemCount={problems.length}
                learningObjectives={[
                  'Convert between centimeters, meters, and kilometers',
                  'Understand metric measurement relationships',
                  'Use multiplication and division for conversions'
                ]}
                parentTeacherTips={[
                  '1 meter = 100 centimeters',
                  '1 kilometer = 1000 meters',
                  'Metric system is based on powers of 10!',
                  'Meters are for length, Centimeters are for small details.'
                ]}
              >
                {/* Lab Header */}
                <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-slate-900 rounded-lg flex items-center justify-center border-b-4 border-cyan-400">
                  <div className="absolute top-0 right-0 p-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-2xl font-mono text-cyan-400 font-bold z-10 flex gap-4 items-center tracking-widest">
                    METRIC SECTOR
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-cyan-50 border-4 border-slate-800 rounded-lg print:border print:bg-white relative">
                  <div className="absolute -top-3 left-4 bg-slate-800 text-cyan-400 font-mono text-xs px-2 py-1 rounded">SYS: ACTIVE</div>
                  <div className="font-mono text-slate-900 font-bold mb-2">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-sm font-mono text-slate-800">
                    <div className="text-base"><strong>SUBJECT:</strong> Alien Vine Growth</div>
                    <div className="pl-4 border-l-4 border-cyan-500 bg-white p-2">
                      <div><strong>MEASUREMENT:</strong> 2 Meters</div>
                      <div><strong>CONVERSION RATE:</strong> 1m = 100cm</div>
                      <div><strong>CALCULATION:</strong>{String.fromCodePoint(0x279C)}</div>
                      <div className="mt-1 font-bold text-cyan-700">FINAL DATA: 200 cm</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-slate-800 border-2 border-slate-600 rounded text-sm text-cyan-400 font-mono text-center shadow-inner">
                  <strong>{String.fromCodePoint(0x1F4CF)}</strong> 1 km = 1000 m | 1 m = 100 cm
                </div>

                <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-lg p-4 bg-white break-inside-avoid relative">
                      <div className="absolute top-2 right-2 text-xs font-mono text-slate-400">ID: {i + 800}</div>

                      <div className="flex flex-col items-center">
                        {/* Stylized Laser Measure */}
                        <div className="w-full h-2 bg-slate-200 mb-4 relative rounded overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 bg-red-500 w-1/2 opacity-50"></div>
                          <div className="absolute left-1/2 top-0 bottom-0 bg-green-500 w-1/2 opacity-50"></div>
                          {/* Laser dot */}
                          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-red-600 rounded-full transform -translate-y-1/2 shadow-[0_0_5px_rgba(220,38,38,1)]"></div>
                        </div>

                        <div className="text-center mb-2 font-bold text-lg font-mono text-slate-800">
                          {p.meters} m <span className="text-slate-400">=</span> ____ cm
                        </div>

                        <div className="w-full border-t border-slate-100 pt-2">
                          <div className="text-xs text-slate-500 font-mono text-center">Enter Value:</div>
                          <div className="h-8 bg-slate-50 border border-slate-300 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                  <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                  </div>
                </div>

                {showAnswersForDoc('metric-units', () => (
                  <div className="mt-6 p-4 border-2 border-cyan-500 bg-cyan-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-cyan-900 mb-3 text-base font-mono">{String.fromCodePoint(0x279C)}</div>
                    <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                      {problems.map((p, i) => (
                        <div key={i} className="border-b border-cyan-200 pb-2">
                          <span className="font-bold">{p.meters} m</span>  {p.centimeters} cm
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('liquid-measurement') && (
            <LiquidMeasurement docId="liquid-measurement" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('mass-weight') && (
            <MassAndWeight docId="mass-weight" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('line-plots') && (
            <LinePlots docId="line-plots" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('bar-graphs-pictographs') && (
            <BarGraphs docId="bar-graphs-pictographs" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('mean-median-mode') && (
            <MeanMedianMode docId="mean-median-mode" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('classifying-triangles') && (
            <ClassifyingTriangles docId="classifying-triangles" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('classifying-quadrilaterals') && (
            <ClassifyingQuadrilaterals docId="classifying-quadrilaterals" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('lines-angles-4th') && (
            <LinesAndAngles docId="lines-angles-4th" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('classifying-angles') && (
            <ClassifyingAngles docId="classifying-angles" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('symmetry-transformations') && (
            <SymmetryTransformations docId="symmetry-transformations" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('area-perimeter-4th') && (
            <AreaPerimeter docId="area-perimeter-4th" showAnswersForDoc={showAnswersForDoc} />
          )
        }

        {
          activeDocs.includes('multi-step-word-problems') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const problems = Array.from({ length: 6 }, () => {
              const type = nextInt(0, 3);
              if (type === 0) {
                // (A * B) - C
                const a = nextInt(3, 8);
                const b = nextInt(2, 5);
                const c = nextInt(1, a * b - 1);
                return {
                  text: `Detective Zoom found ${a} boxes of evidence. Each box had ${b} clues. But ${c} clues resulted in a dead end. How many useful clues are left?`,
                  steps: [`${a}  ${b} = ${a * b} total clues`, `${a * b} - ${c} = ${a * b - c}`],
                  answer: `${a * b - c} clues`
                };
              } else if (type === 1) {
                // (A + B) - C
                const a = nextInt(10, 30);
                const b = nextInt(5, 20);
                const c = nextInt(5, 15);
                return {
                  text: `There were ${a} witnesses on Monday and ${b} on Tuesday. ${c} of them were suspects. How many were innocent witnesses?`,
                  steps: [`${a} + ${b} = ${a + b} total people`, `${a + b} - ${c} = ${a + b - c}`],
                  answer: `${a + b - c} witnesses`
                };
              } else {
                // (A - B) + C
                const a = nextInt(20, 50);
                const b = nextInt(5, 15);
                const c = nextInt(10, 20);
                return {
                  text: `Officer Pat had ${a} donuts. The team ate ${b}. Then Officer Mike brought ${c} more. How many donuts are there now?`,
                  steps: [`${a} - ${b} = ${a - b} left`, `${a - b} + ${c} = ${a - b + c}`],
                  answer: `${a - b + c} donuts`
                };
              }
            });

            return (
              <WorksheetSectionWrapper
                docId="multi-step-word-problems"
                title="Math Detective Agency"
                emoji={String.fromCharCode(0xD83D, 0xDD75, 0xFE0F)}
                description="Crack the case! Solve step-by-step to catch the answer."
                problemCount={problems.length}
                learningObjectives={[
                  'Solve multi-step word problems',
                  'Identify sequence of operations',
                  'Show work for each clue'
                ]}
                parentTeacherTips={[
                  'Look for keywords: "each", "total", "left", "more"',
                  'Solve one clue at a time',
                  'Double check the final verdict'
                ]}
              >
                {/* Agency Header */}
                <div className="print:hidden w-full h-20 mb-6 relative overflow-hidden bg-slate-800 rounded-t-lg border-b-4 border-yellow-500 shadow-lg">
                  <div className="absolute top-2 left-4 text-4xl">{String.fromCodePoint(0x279C)}</div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-2xl font-bold text-slate-100 font-mono tracking-widest uppercase">Top Secret Case Files</div>
                    <div className="text-yellow-500 font-bold text-xs uppercase bg-slate-900 px-2 py-0.5 rounded border border-yellow-500 mt-1">Authorized Eyes Only</div>
                  </div>
                </div>

                {/* Example Case */}
                <div className="mb-8 mx-auto max-w-2xl bg-amber-50 p-1 border border-slate-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] rotate-0 relative">
                  {/* Paperclip */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-slate-400 z-10 bg-transparent border-b-transparent"></div>

                  <div className="bg-white p-6 border border-slate-200">
                    <div className="flex justify-between items-start mb-4 border-b-2 border-slate-800 pb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 uppercase tracking-wide">Case #00-EXAMPLE</h3>
                        <p className="text-xs text-slate-500">Subject: The Missing Marbles</p>
                      </div>
                      <div className="text-4xl opacity-20">{String.fromCodePoint(0x270F)}</div>
                    </div>

                    <div className="space-y-4">
                      <div className="font-serif italic text-slate-700 text-lg">
                        "Start with 15 marbles. Lose 5. Find 8 more. How many now?"
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm font-mono mt-4 bg-slate-50 p-4 rounded border border-slate-200">
                        <div>
                          <span className="bg-slate-200 text-slate-600 px-1 text-xs rounded uppercase font-bold mr-2">Clue 1</span>
                          15 - 5 = 10
                        </div>
                        <div>
                          <span className="bg-slate-200 text-slate-600 px-1 text-xs rounded uppercase font-bold mr-2">Clue 2</span>
                          10 + 8 = 18
                        </div>
                      </div>

                      <div className="mt-2 text-right">
                        <span className="text-red-600 font-bold text-xl font-stamp transform -rotate-2 inline-block border-2 border-red-600 px-2 py-1">VERDICT: 18</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="relative group break-inside-avoid">
                      {/* Folder Tab */}
                      <div className="absolute -top-3 left-0 w-24 h-4 bg-amber-200 rounded-t-lg border-t border-l border-r border-amber-300 group-hover:-top-4 transition-all"></div>

                      <div className="bg-amber-100 p-6 rounded-b-lg rounded-tr-lg border border-amber-300 shadow-md relative">
                        <div className="absolute top-2 right-2 text-xs font-mono text-amber-600 opacity-50">CASE #{400 + i}</div>
                        <div className="font-serif text-slate-800 mb-4 leading-relaxed">
                          {p.text}
                        </div>

                        <div className="bg-white p-3 rounded border border-amber-200 h-28 relative">
                          <div className="absolute top-1 left-2 text-[10px] text-slate-400 uppercase tracking-wider">Investigative Notes</div>
                          {/* Lines for writing */}
                          <div className="w-full h-full pt-4 space-y-6">
                            <div className="border-b border-slate-200"></div>
                            <div className="border-b border-slate-200"></div>
                            <div className="border-b border-slate-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {showAnswersForDoc('multi-step-word-problems', () => (
                  <div className="mt-6 p-6 border-l-4 border-slate-800 bg-slate-50 rounded print:page-break-before-always">
                    <div className="font-bold text-slate-900 mb-4 text-xl uppercase tracking-widest border-b border-slate-300 pb-2">{String.fromCodePoint(0x270F)}</div>
                    <div className="grid grid-cols-1 gap-4">
                      {problems.map((p, i) => (
                        <div key={i} className="flex flex-col text-sm font-mono text-slate-700 bg-white p-3 border border-slate-200 shadow-sm">
                          <div className="font-bold text-slate-900 mb-1">CASE #{400 + i}</div>
                          <div className="flex flex-wrap gap-x-4">
                            {p.steps.map((s, j) => <span key={j} className="text-slate-500">STEP {j + 1}: {s}</span>)}
                          </div>
                          <div className="mt-1 font-bold text-red-600">VERDICT: {p.answer}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

        {
          activeDocs.includes('elapsed-time-word-problems') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            // Generate time travel scenarios
            const problems = Array.from({ length: 6 }, () => {
              const startHour = nextInt(1, 10);
              const startMin = nextInt(0, 3) * 15; // 00, 15, 30, 45
              const durationMin = nextInt(2, 6) * 15; // 30 mins to 90 mins

              const totalStartMin = startHour * 60 + startMin;
              const totalEndMin = totalStartMin + durationMin;

              const endHour = Math.floor(totalEndMin / 60);
              const endMin = totalEndMin % 60;

              // Format times
              const pad = (n: number) => n.toString().padStart(2, '0');
              const startTime = `${startHour}:${pad(startMin)} PM`;
              const endTime = `${endHour}:${pad(endMin)} PM`;

              const dHours = Math.floor(durationMin / 60);
              const dMins = durationMin % 60;
              const durationStr = dHours > 0
                ? `${dHours} hr ${dMins > 0 ? `${dMins} min` : ''}`
                : `${dMins} min`;

              return {
                mission: `Mission #${nextInt(100, 999)}`,
                scenario: `Rocket launch at ${startTime}. Landed at ${endTime}.`,
                question: "How long was the mission?",
                answer: durationStr,
                start: startTime,
                end: endTime,
                calc: `${endTime} - ${startTime} = ${durationStr}`
              };
            });

            return (
              <WorksheetSectionWrapper
                docId="elapsed-time-word-problems"
                title="Time Travel Mission Control"
                emoji={String.fromCharCode(0xD83D, 0xDE80)}
                description="Calculate mission durations! The space station needs precise flight logs."
                problemCount={problems.length}
                learningObjectives={[
                  'Calculate elapsed time between two events',
                  'Solve word problems involving hours and minutes',
                  'Work with AM/PM time contexts'
                ]}
                parentTeacherTips={[
                  'Use a \"Z-Chart\" or number line to jump to the next hour',
                  'Count hours first, then add remaining minutes',
                  'Example: 3:15 to 4:00 (45m) + 4:00 to 4:30 (30m) = 75m = 1h 15m'
                ]}
              >
                {/* Mission Control Header */}
                <div className="print:hidden w-full h-16 mb-6 relative overflow-hidden bg-slate-900 rounded-lg flex items-center justify-center border-b-4 border-blue-500">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <div className="text-2xl font-mono text-blue-400 font-bold z-10 flex gap-4 items-center tracking-widest uppercase">
                    FLIGHT LOGS
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-slate-900 text-blue-100 border-2 border-blue-500 rounded-lg print:bg-white print:text-black print:border-slate-300">
                  <div className="font-mono text-blue-300 mb-2 text-sm print:text-slate-600">MISSION BRIEFING:</div>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="font-mono text-2xl border-2 border-blue-400 px-4 py-2 rounded bg-slate-800 print:bg-slate-100 print:text-slate-800">
                      14:00  15:30
                    </div>
                    <div className="space-y-1 text-sm font-mono">
                      <div><span className="text-blue-400 font-bold print:text-blue-700">LAUNCH:</span> 2:00 PM</div>
                      <div><span className="text-green-400 font-bold print:text-green-700">LANDING:</span> 3:30 PM</div>
                      <div className="border-t border-blue-700 my-1 pt-1 print:border-slate-300">
                        <span className="text-yellow-400 font-bold print:text-slate-900">DURATION:</span> 1 hour 30 minutes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="relative bg-white border-2 border-slate-200 rounded-xl p-4 shadow-sm break-inside-avoid overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 border-r border-dotted border-slate-300"></div>
                      <div className="pl-4">
                        <div className="flex justify-between mb-2 border-b border-slate-100 pb-2">
                          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 rounded py-0.5">{p.mission}</span>
                          <span className="text-xl">{String.fromCodePoint(0x1F680)}</span>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-bold text-slate-700 mb-1">Flight Path:</div>
                          <div className="text-lg font-mono text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 text-center">
                            {p.start} <span className="text-slate-400 mx-1">{String.fromCodePoint(0x279C)}</span> {p.end}
                          </div>
                        </div>

                        <div className="text-sm text-slate-600 font-medium mb-3">{p.question}</div>

                        <div className="bg-blue-50 rounded p-2 h-16 border border-blue-100 relative">
                          <div className="absolute top-1 left-2 text-[10px] text-blue-300 uppercase">Mission Duration</div>
                          {/* Space for answer */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment - Mission Debrief */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-blue-900 rounded bg-slate-50" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">MISSION DEBRIEF</div>
                  <div className="space-y-2 text-xs text-slate-700 font-mono">
                    <div>[ ] Time calculations accurate</div>
                    <div>[ ] Flight logs completed</div>
                    <div>[ ] Ready for deep space mission</div>
                  </div>
                </div>

                {showAnswersForDoc('elapsed-time-word-problems', () => (
                  <div className="mt-6 p-6 border-2 border-dashed border-slate-400 bg-white rounded print:page-break-before-always font-mono">
                    <div className="text-center font-bold text-slate-800 mb-6 text-xl border-b mb-4 pb-2">ANSWER LOG</div>
                    <div className="grid grid-cols-2 gap-4">
                      {problems.map((p, i) => (
                        <div key={i} className="border-b border-slate-200 pb-2">
                          <div className="text-xs text-slate-500 mb-1">{p.mission}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">{p.start} - {p.end}</span>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{p.answer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }
        {
          activeDocs.includes('perimeter-area-word-problems') && (() => {
            const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`);
            function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

            const problems = Array.from({ length: 6 }, () => {
              const length = nextInt(5, 12);
              const width = nextInt(4, 8);
              const isPerim = rng() > 0.5;

              const scenario = isPerim
                ? `Mrs. Green needs to put a fence around her rectangular garden. It is ${length}m long and ${width}m wide. How much fencing does she need?`
                : `Mr. Brown is planting grass in his rectangular backyard. It is ${length}m long and ${width}m wide. What is the area of the yard?`;

              return {
                text: scenario,
                type: isPerim ? 'PERIMETER' : 'AREA',
                length, width,
                val: isPerim ? 2 * (length + width) : length * width,
                unit: isPerim ? 'm' : 'sq m'
              };
            });

            return (
              <WorksheetSectionWrapper
                docId="perimeter-area-word-problems"
                title="Landscape Design Co."
                emoji={String.fromCharCode(0xD83C, 0xDF3B)}
                description="Help the gardeners plan! Calculate perimeter for fencing and area for grass."
                problemCount={problems.length}
                learningObjectives={[
                  'Distinguish between perimeter (outside) and area (inside)',
                  'Solve real-world word problems',
                  'Apply formulas correctly'
                ]}
                parentTeacherTips={[
                  'Perimeter = Fencing/Border (Add all sides)',
                  'Area = Grass/Carpet/Floor (Multiply Length x Width)',
                  'Draw the garden to visualize!'
                ]}
              >
                {/* Landscape Header */}
                <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center border-b-4 border-emerald-800">
                  <div className="text-2xl font-serif text-white font-bold z-10 flex gap-4 items-center shadow-black drop-shadow-md">
                    GREEN THUMB LANDSCAPING
                  </div>
                </div>

                {/* Worked Example */}
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-600 rounded-lg print:border print:bg-white flex gap-4 items-center">
                  <div className="text-4xl">{String.fromCodePoint(0x2705)}</div>
                  <div className="space-y-2 text-sm flex-1">
                    <div className="font-bold text-green-800 border-b border-green-300 pb-1">TRAINING MANUAL:</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-2 rounded border border-green-200">
                        <div className="font-bold text-green-700">PERIMETER (Fencing)</div>
                        <div className="text-xs text-slate-600">Distance AROUND the edge.</div>
                        <div className="font-mono text-xs mt-1">{String.fromCodePoint(0x270F)}</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-green-200">
                        <div className="font-bold text-green-700">AREA (Grass)</div>
                        <div className="text-xs text-slate-600">Space INSIDE the shape.</div>
                        <div className="font-mono text-xs mt-1">{String.fromCodePoint(0x270F)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                  {problems.map((p, i) => (
                    <div key={i} className="relative bg-white border border-slate-300 rounded-xl p-5 shadow-sm break-inside-avoid">
                      <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-l border-b border-green-200">
                        JOB #{100 + i}
                      </div>

                      <div className="flex gap-3 mb-3">
                        <div className="text-2xl pt-1">
                          {p.type === 'PERIMETER' ? '' : ''}
                        </div>
                        <div className="text-sm text-slate-800 leading-relaxed font-medium">
                          {p.text}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded border border-slate-200">
                        <div className="flex justify-between text-xs text-slate-500 uppercase font-bold mb-2">
                          <span>Plan:</span>
                          <span>Solution:</span>
                        </div>
                        <div className="h-8 border-b border-slate-300 flex items-end justify-between px-2 pb-1">
                          <span className="text-slate-400 italic text-xs">{p.type}</span>
                          <span className="font-bold text-lg text-slate-300">____________ {p.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-green-700 rounded bg-green-50" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-bold text-green-900 mb-3 text-sm">{String.fromCodePoint(0x2705)}</div>
                  <div className="space-y-2 text-xs text-green-800">
                    <div>{String.fromCodePoint(0x2705)}</div>
                    <div>{String.fromCodePoint(0x2705)}</div>
                    <div>{String.fromCodePoint(0x279C)}</div>
                  </div>
                </div>

                {showAnswersForDoc('perimeter-area-word-problems', () => (
                  <div className="mt-6 p-6 border-2 border-emerald-500 bg-white rounded print:page-break-before-always font-mono">
                    <div className="text-center font-bold text-emerald-900 mb-6 text-xl border-b border-emerald-100 pb-2">{String.fromCodePoint(0x279C)}</div>
                    <div className="grid grid-cols-2 gap-4">
                      {problems.map((p, i) => (
                        <div key={i} className="border-b border-slate-100 pb-2 text-sm">
                          <span className="font-bold">Job #{100 + i}:</span> {p.val} {p.unit} ({p.type})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </WorksheetSectionWrapper>
            );
          })()
        }

















        {
          activeDocs.some((d: string) => d.startsWith('reading-g1')) && (() => {
            const data = generateReadingStory(`${effectiveSeed}|reading-g1`, 1) || { title: 'Reading', story: '', questions: [], emoji: '📖' }

            return (
              <WorksheetSectionWrapper
                docId={doc}
                title={data?.title}
                emoji={data?.emoji}
                description="Read the story and answer the questions."
                problemCount={data?.questions?.length}
              >
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-center mb-4 text-slate-800">{data?.title}</h3>
                  <div className="text-lg leading-relaxed font-serif text-slate-700 whitespace-pre-line mb-8">
                    {data?.story}
                  </div>

                  <div className="space-y-6">
                    <div className="font-bold border-b border-slate-200 pb-2">Questions:</div>
                    {data?.questions?.map((q: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-lg">
                        <div className="font-medium mb-2">{i + 1}. {q?.q}</div>
                        <div className="flex flex-col gap-2">
                          {(q?.options || []).sort((a: string, b: string) => makeRng(`${effectiveSeed}|q${i}` + a)() - 0.5).map((opt: string, k: number) => (
                            <div key={k} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {showAnswersForDoc(doc, () => (
                  <div className="mt-4 p-4 border rounded font-mono text-sm">
                    {data?.questions?.map((q: any, i: number) => (
                      <div key={i} className="mb-1">{i + 1}) {q.a}</div>
                    ))}
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }


        {
          activeDocs.some((d: string) => d.startsWith('reading-g2')) && (() => {
            const data = generateReadingStory(`${effectiveSeed}|reading-g2`, 2) || { title: 'Reading', story: '', questions: [], emoji: '📖' }

            return (
              <WorksheetSectionWrapper
                docId={doc}
                title={data?.title}
                emoji={data?.emoji}
                description="Read the story and answer the questions."
                problemCount={data?.questions?.length}
              >
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-center mb-4 text-slate-800">{data?.title}</h3>
                  <div className="text-lg leading-relaxed font-serif text-slate-700 whitespace-pre-line mb-8">
                    {data?.story}
                  </div>

                  <div className="space-y-6">
                    <div className="font-bold border-b border-slate-200 pb-2">Questions:</div>
                    {data?.questions?.map((q: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-lg">
                        <div className="font-medium mb-2">{i + 1}. {q?.q}</div>
                        <div className="flex flex-col gap-2">
                          {(q?.options || []).sort((a: string, b: string) => makeRng(`${effectiveSeed}|q${i}` + a)() - 0.5).map((opt: string, k: number) => (
                            <div key={k} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {showAnswersForDoc(doc, () => (
                  <div className="mt-4 p-4 border rounded font-mono text-sm">
                    {data?.questions?.map((q: any, i: number) => (
                      <div key={i} className="mb-1">{i + 1}) {q?.a}</div>
                    ))}
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }

        {
          activeDocs.some((d: string) => d.startsWith('reading-g3')) && (() => {
            const data = generateReadingStory(`${effectiveSeed}|reading-g3`, 3) || { title: 'Reading', story: '', questions: [], emoji: '📖' }

            return (
              <WorksheetSectionWrapper
                docId={doc}
                title={data?.title}
                emoji={data?.emoji}
                description="Read the passage and answer the questions."
                problemCount={data?.questions?.length}
              >
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                  <h3 className="text-xl font-bold text-center mb-4 text-slate-800">{data?.title}</h3>
                  <div className="text-base leading-relaxed font-serif text-slate-700 whitespace-pre-line mb-8 columns-1 md:columns-2 gap-8">
                    {data?.story}
                  </div>

                  <div className="space-y-6 break-inside-avoid">
                    <div className="font-bold border-b border-slate-200 pb-2">Comprehension Check:</div>
                    {data?.questions?.map((q: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-lg">
                        <div className="font-medium mb-2">{i + 1}. {q?.q}</div>
                        <div className="flex flex-col gap-2">
                          {(q?.options || []).sort((a: string, b: string) => makeRng(`${effectiveSeed}|q${i}` + a)() - 0.5).map((opt: string, k: number) => (
                            <div key={k} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {showAnswersForDoc(doc, () => (
                  <div className="mt-4 p-4 border rounded font-mono text-sm">
                    {data?.questions?.map((q: any, i: number) => (
                      <div key={i} className="mb-1">{i + 1}) {q?.a}</div>
                    ))}
                  </div>
                ))}
              </WorksheetSectionWrapper>
            )
          })()
        }



        {
          activeDocs.some((d: string) => d.startsWith('science-lifecycle') || d.startsWith('science-match')) && (
            <ScienceWorksheets
              doc={doc || ''}
              effectiveSeed={typeof effectiveSeed === 'string' ? effectiveSeed : String(effectiveSeed)}
              variant={typeof variant === 'string' ? variant : String(variant)}
              showAnswersForDoc={showAnswersForDoc}
            />
          )
        }




        {
          activeDocs.some((d: string) => d.startsWith('word-search') || d.startsWith('spelling')) && (() => {
            const data = generateWordSearch(`${effectiveSeed}|${doc}`) || { theme: 'Words', words: [], grid: [] }

            return (
              <WorksheetSectionWrapper
                docId={doc}
                title={`${data?.theme || 'Words'} Word Search`}
                emoji="🔎"
                description={`Find these words hidden in the grid: ${(data?.words || []).join(', ')}`}
                problemCount={data?.words?.length || 0}
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="bg-white p-2 rounded-lg border-2 border-slate-800">
                    {(data?.grid || []).map((row: string[], r: number) => (
                      <div key={r} className="flex">
                        {(row || []).map((letter: string, c: number) => (
                          <div key={c} className="w-8 h-8 flex items-center justify-center font-mono font-bold text-lg border border-slate-100 hover:bg-yellow-100 cursor-pointer">
                            {letter}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold mb-4">Word Bank</h3>
                    <div className="flex flex-wrap gap-2">
                      {data?.words?.map((w: string, i: number) => (
                        <div key={i} className="px-3 py-1 bg-slate-100 rounded text-sm font-medium border border-slate-300">
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </WorksheetSectionWrapper>
            )
          })()
        }


        <footer className="text-center text-slate-500 text-xs print:hidden">
          {getTrans('common.printTip', 'Tip: Use your browser menu  Print  Save as PDF.')}
        </footer>
      </div >
    </div >
  )
}


function generateWordSearchGrid(size: number, words: string[], rng: () => number): string[][] {
  // very basic filler grid with words placed sequentially across rows to demonstrate printing
  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''))
  let r = 0, c = 0
  for (const w of words) {
    for (let i = 0; i < w.length; i++) {
      if (r >= size) break
      grid[r][c] = w[i]
      c++
      if (c >= size) { r++; c = 0 }
    }
    r++; c = 0
    if (r >= size) break
  }
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid[i][j]) grid[i][j] = letters[Math.floor(rng() * letters.length)]
    }
  }
  return grid
}

function ColoringSVG() {
  // Simple cat face line art for coloring
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="#111827" strokeWidth="4">
        <circle cx="200" cy="210" r="120" />
        <polygon points="110,120 170,80 170,150" />
        <polygon points="290,120 230,80 230,150" />
        <circle cx="160" cy="200" r="16" />
        <circle cx="240" cy="200" r="16" />
        <polygon points="200,220 190,235 210,235" />
        <path d="M150 260 Q200 300 250 260" />
        <line x1="120" y1="220" x2="70" y2="210" />
        <line x1="120" y1="230" x2="70" y2="230" />
        <line x1="120" y1="240" x2="70" y2="250" />
        <line x1="280" y1="220" x2="330" y2="210" />
        <line x1="280" y1="230" x2="330" y2="230" />
        <line x1="280" y1="240" x2="330" y2="250" />
      </g>
    </svg>
  )
}

function HiddenObjectsSceneSVGA() {
  // Hand-drawn busy scene with hidden shapes matching the checklist
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Background sky and ground */}
      <rect x="0" y="0" width="800" height="240" fill="url(#sky)" />
      <rect x="0" y="240" width="800" height="160" fill="#f1f5f9" />

      {/* Trees */}
      {[100, 220, 560, 700].map((x, i) => (
        <g key={i}>
          <rect x={x} y={220} width="10" height="40" fill="#64748b" />
          <circle cx={x + 5} cy={200} r="28" fill="#a7f3d0" />
          <circle cx={x - 15} cy={215} r="18" fill="#a7f3d0" />
          <circle cx={x + 22} cy={215} r="18" fill="#a7f3d0" />
        </g>
      ))}

      {/* Cloud (hidden object: Cloud)  larger, line-art */}
      <g>
        <ellipse cx="180" cy="90" rx="70" ry="28" fill="none" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="215" cy="90" rx="50" ry="22" fill="none" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="140" cy="96" rx="45" ry="18" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Star (hidden on tree)  bigger, line-art */}
      <polygon points="560,145 568,170 596,170 572,186 580,210 560,196 540,210 548,186 524,170 552,170" fill="none" stroke="#111827" strokeWidth="3.5" />

      {/* Leaf (on ground)  clearer outline with vein */}
      <g>
        <path d="M290 300 C320 280, 360 310, 330 330 C345 345, 305 350, 290 330 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M325 295 Q325 315 318 332" fill="none" stroke="#111827" strokeWidth="2.5" />
      </g>

      {/* Book (bench)  larger, line-art with page lines */}
      <g>
        <rect x="392" y="285" width="80" height="10" fill="none" stroke="#111827" strokeWidth="3" />
        <rect x="398" y="248" width="68" height="36" rx="2" fill="none" stroke="#111827" strokeWidth="3" />
        <line x1="432" y1="248" x2="432" y2="284" stroke="#111827" strokeWidth="3" />
        <line x1="404" y1="256" x2="464" y2="256" stroke="#111827" strokeWidth="2" />
        <line x1="404" y1="263" x2="464" y2="263" stroke="#111827" strokeWidth="2" />
        <line x1="404" y1="270" x2="464" y2="270" stroke="#111827" strokeWidth="2" />
      </g>

      {/* Car (simple)  larger, line-art */}
      <g>
        <rect x="620" y="265" width="120" height="36" rx="8" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="650" y="270" width="50" height="16" rx="3" fill="none" stroke="#111827" strokeWidth="2.5" />
        <circle cx="648" cy="308" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <circle cx="712" cy="308" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Key (on ground)  larger, line-art with teeth */}
      <g>
        <circle cx="520" cy="328" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="538" y="325" width="36" height="8" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="574" y="325" width="8" height="12" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="584" y="325" width="8" height="12" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Apple (on tree)  larger, line-art with stem + leaf */}
      <g>
        <circle cx="220" cy="205" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <line x1="220" y1="191" x2="220" y2="199" stroke="#111827" strokeWidth="3" />
        <ellipse cx="228" cy="196" rx="8" ry="4" fill="none" stroke="#111827" strokeWidth="2.5" />
      </g>

      {/* Shell (near pond)  larger, line-art with scallops */}
      <g>
        <path d="M100 324 C118 296, 162 296, 180 324 C172 340, 108 340, 100 324 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 112 + i * 14; return (<path key={i} d={`M${x} 322 Q${x + 4} 312 ${x + 8} 322`} stroke="#111827" fill="none" strokeWidth="2.5" />);
        })}
      </g>

      {/* Ball  larger, line-art with stripes */}
      <g>
        <circle cx="360" cy="310" r="16" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M342 310 Q360 296 378 310" stroke="#111827" strokeWidth="2.5" fill="none" />
        <path d="M360 294 Q370 310 360 326" stroke="#111827" strokeWidth="2.5" fill="none" />
      </g>

      {/* Hat (on bench)  clearer fedora outline */}
      <g>
        <ellipse cx="475" cy="282" rx="28" ry="10" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M452 268 Q475 258 498 268" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="458" y="264" width="34" height="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <line x1="458" y1="270" x2="492" y2="270" stroke="#111827" strokeWidth="3" />
      </g>
    </svg>
  )
}

// Variant B with 7 differences from A: (1) no star, (2) leaf moved, (3) book moved, (4) car color/position, (5) key moved, (6) apple moved, (7) add a bird
function HiddenObjectsSceneSVGB() {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
      <defs>
        <linearGradient id="skyB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Background sky and ground */}
      <rect x="0" y="0" width="800" height="240" fill="url(#skyB)" />
      <rect x="0" y="240" width="800" height="160" fill="#f1f5f9" />

      {/* Trees */}
      {[100, 220, 560, 700].map((x, i) => (
        <g key={i}>
          <rect x={x} y="220" width="10" height="40" fill="#64748b" />
          <circle cx={x + 5} cy="200" r="28" fill="#a7f3d0" />
          <circle cx={x - 15} cy="215" r="18" fill="#a7f3d0" />
          <circle cx={x + 22} cy="215" r="18" fill="#a7f3d0" />
        </g>
      ))}

      {/* Cloud (same) */}
      <g>
        <ellipse cx="180" cy="90" rx="50" ry="20" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="210" cy="90" rx="35" ry="16" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="150" cy="94" rx="30" ry="14" fill="#ffffff" stroke="#94a3b8" />
      </g>

      {/* Star removed (difference 1) */}

      {/* Leaf moved (difference 2) */}
      <path d="M500 310 C520 300, 540 320, 520 330 C530 340, 510 345, 500 330 Z" fill="#86efac" stroke="#16a34a" />

      {/* Book moved to ground (difference 3) */}
      <g>
        <rect x="460" y="310" width="60" height="8" fill="#94a3b8" />
        <rect x="465" y="280" width="50" height="30" fill="#e2e8f0" stroke="#64748b" />
        <line x1="490" y1="280" x2="490" y2="310" stroke="#64748b" />
      </g>

      {/* Car changed color and slightly moved (difference 4) */}
      <g>
        <rect x="620" y="275" width="90" height="30" rx="6" fill="#86efac" stroke="#64748b" />
        <circle cx="640" cy="310" r="10" fill="#475569" />
        <circle cx="690" cy="310" r="10" fill="#475569" />
      </g>

      {/* Key moved (difference 5) */}
      <g>
        <circle cx="140" cy="335" r="8" fill="#fde68a" stroke="#b45309" />
        <rect x="148" y="333" width="20" height="4" fill="#fde68a" stroke="#b45309" />
        <rect x="168" y="333" width="4" height="6" fill="#fde68a" stroke="#b45309" />
        <rect x="173" y="333" width="4" height="6" fill="#fde68a" stroke="#b45309" />
      </g>

      {/* Apple moved (difference 6) */}
      <circle cx="260" cy="190" r="8" fill="#ef4444" stroke="#991b1b" />

      {/* Shell (same) */}
      <g>
        <path d="M110 320 C120 300, 150 300, 160 320 C155 330, 115 330, 110 320 Z" fill="#f5d0fe" stroke="#a855f7" />
        <line x1="120" y1="318" x2="150" y2="318" stroke="#9333ea" />
      </g>

      {/* Bird in sky (difference 7) */}
      <g>
        <path d="M600 80 Q610 70, 620 80 M620 80 Q630 70, 640 80" fill="none" stroke="#64748b" strokeWidth="3" />
      </g>
    </svg>
  )
}


function generateReadingStory(seed: string, grade: number) {
  const rng = makeRng(seed)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]

  // Vocabulary banks
  const animals = ['ant', 'beetle', 'ladybug', 'butterfly', 'spider', 'bee']
  const adjectives = ['tiny', 'busy', 'fast', 'brave', 'happy', 'red']
  const places = ['garden', 'park', 'forest', 'playground', 'backyard']
  const foods = ['crumb', 'leaf', 'seed', 'berry', 'cookie']
  const actions = ['ran', 'crawled', 'flew', 'marched', 'climbed']

  // Grade 1: Simple sentences
  if (grade === 1) {
    const mainChar = pick(animals)
    const name = pick(['Andy', 'Betty', 'Carl', 'Dora', 'Eddie', 'Fay'])
    const adj = pick(adjectives)
    const place = pick(places)
    const food = pick(foods)
    const action = pick(actions)

    const title = `The ${adj.charAt(0).toUpperCase() + adj.slice(1)} ${mainChar.charAt(0).toUpperCase() + mainChar.slice(1)}`

    const story = `Once there was a ${adj} ${mainChar} named ${name}.
    ${name} lived in a big ${place}.
    One day, ${name} was very hungry.
    ${name} ${action} to find some food.
    Suddenly, ${name} found a big, yummy ${food}.
    ${name} was so happy to find the ${food}!`

    const questions = [
      { q: `What kind of animal was ${name}?`, options: [mainChar, 'cat', 'bird'], a: mainChar },
      { q: `Where did ${name} live?`, options: [place, 'house', 'school'], a: place },
      { q: `What did ${name} find to eat?`, options: [food, 'pizza', 'apple'], a: food },
    ]

    return { title, story, questions, emoji: '📖' }
  }

  // Grade 2: More complex sentences, social themes
  if (grade === 2) {
    const friend1 = pick(['Sam', 'Mia', 'Leo', 'Zoe', 'Max', 'Ava'])
    const friend2 = pick(['Ben', 'Lily', 'Tom', 'Eva', 'Jay', 'Sky'])
    const activity = pick(['painting', 'soccer', 'baking', 'hiking', 'gardening'])
    const object = pick(['ball', 'brush', 'spoon', 'map', 'flower'])
    const setting = pick(['park', 'kitchen', 'studio', 'trail', 'backyard'])
    const emotion = pick(['excited', 'nervous', 'happy', 'proud', 'curious'])

    const title = `${friend1} and ${friend2}'s ${activity.charAt(0).toUpperCase() + activity.slice(1)} Day`

    const story = `It was a beautiful Saturday morning. ${friend1} called ${friend2} on the phone.
    "Do you want to go ${activity} today?" asked ${friend1}.
    "Yes! I am so ${emotion}!" replied ${friend2}.
    They met at the ${setting}. ${friend1} brought a big ${object} to help them start.
    They spent the whole afternoon ${activity} together. Using the ${object} was very helpful.
    At the end of the day, they were tired but happy.`

    const questions = [
      { q: `What activity did the friends do?`, options: [activity, 'swimming', 'reading'], a: activity },
      { q: `Where did they meet?`, options: [setting, 'school', 'store'], a: setting },
      { q: `How did ${friend2} feel about playing?`, options: [emotion, 'angry', 'sad'], a: emotion },
      { q: `What item did ${friend1} bring?`, options: [object, 'shoe', 'hat'], a: object },
    ]

    return { title, story, questions, emoji: '👫' }
  }

  // Grade 3: Paragraphs, informative/science themes
  if (grade === 3) {
    const topics = [
      { t: 'Bees', f: 'pollinate flowers', h: 'hive', d: 'honey' },
      { t: 'Frogs', f: 'catch flies', h: 'pond', d: 'eggs' },
      { t: 'Volcanoes', f: 'erupt lava', h: 'mountain', d: 'magma' },
      { t: 'Trees', f: 'make oxygen', h: 'forest', d: 'wood' }
    ]
    const topic = pick(topics)
    const adjDoc = pick(['amazing', 'fascinating', 'important', 'incredible'])

    const title = `The ${adjDoc.charAt(0).toUpperCase() + adjDoc.slice(1)} World of ${topic.t}`

    const story = `${topic.t} are truly ${adjDoc} parts of nature. Did you know that they ${topic.f}? This helps our world in many ways.

    Most ${topic.t.toLowerCase()} can be found in a ${topic.h}. This is their home where they allow themselves to grow and thrive.

    Another interesting fact is related to ${topic.d}. This plays a key role in the life of ${topic.t.toLowerCase()}. Scientists study them to learn more about our planet.`

    const questions = [
      { q: `What is the main topic of the passage?`, options: [topic.t, 'Cars', 'Space'], a: topic.t },
      { q: `Where can you usually find them?`, options: [topic.h, 'ocean', 'city'], a: topic.h },
      { q: `What do they do according to the text?`, options: [topic.f, 'sleep all day', 'fly to space'], a: topic.f },
      { q: `What specific term was mentioned?`, options: [topic.d, 'plastic', 'glass'], a: topic.d },
    ]

    return { title, story, questions, emoji: '🌍' }
  }
}

// Social Studies & Science Generators







// Creative & Brain Tools Generators







function generateWordSearch(seed: string) {
  const rng = makeRng(seed)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]

  const themes = [
    { name: 'Space', words: ['STAR', 'MOON', 'SUN', 'PLANET', 'ORBIT', 'COMET'] },
    { name: 'Animals', words: ['LION', 'TIGER', 'BEAR', 'ZEBRA', 'WOLF', 'FOX'] },
    { name: 'Colors', words: ['RED', 'BLUE', 'GREEN', 'PINK', 'BLACK', 'WHITE'] },
    { name: 'School', words: ['BOOK', 'DESK', 'PEN', 'MATH', 'READ', 'WRITE'] },
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
