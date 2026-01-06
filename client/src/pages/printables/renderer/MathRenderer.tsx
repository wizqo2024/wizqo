import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
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
    AreaModelMult,
} from '../MultiplicationWorksheets';
import {
    EquivFractions4th,
    ComparingFractions4th,
    AddSubFractions4th,
    MixedImproperFractions,
    FractionBasicID,
    // AddSubFractionsUnlike,
    // MultiplyingFractions,
    // MultiplyingFractionsWhole,
    // DividingFractions
} from '../FractionWorksheets';
import MathMazeWorksheets from '../../MathMazeWorksheets';
import { AdditionSubtraction0To10, PlaceValueHTO, Sub2Digit100, NumberTracing1To10, NumberTracing1To20, MoreLessEqual10, TenFrames1To10, WordProblems100, Compare2Digit, EvenOdd100, Time5Min } from '../MathWorksheets';
import { LogicWorksheets } from '../../LogicWorksheets';
import { Symmetry } from '../Symmetry';
import { LinePlots, BarGraphs, MeanMedianMode } from '../DataAnalysisWorksheets';
import { GeometryWordProblems, MeasurementWordProblems, DecimalWordProblems, FractionWordProblems, MultiStepWordProblems } from '../WordProblemWorksheets';
import {
    ClassifyingTriangles,
    ClassifyingQuadrilaterals,
    LinesAndAngles,
    ClassifyingAngles,
    SymmetryTransformations,
    AreaPerimeter,
    IdentifyPolygons
} from '../../GeometryWorksheets';
import {
    MassAndWeight,
    LiquidMeasurement,
    ElapsedTime,
    CustomaryUnits
} from '../../MeasurementWorksheets';
import {
    DecimalsPlaceValue,
    ComparingDecimals,
    AddSubDecimals,
    FractionsToDecimals
} from '../../DecimalWorksheets';
import {
    LongDivision1Digit,
    LongDivision2Digit,
    LongDivisionMultiDigit,
    DividingBy10And100,
    DivisionFacts,
    DivisionWithRemainders,
    DivisionWordProblems
} from '../DivisionWorksheets';
import { OrderOfOperations } from '../OrderOfOperations';
import { NumberLineAddition, SkipCountingWorksheet, BalanceEquations, SubtractionStories, NumberBonds10, CountWrite30, MissingNumbers50 as MissingNumbers50FirstGrade, DoublesFacts, PictureAddition10, CountingObjects20 } from '../FirstGradeMathWorksheets';
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
    BarGraphsData,
    Add2Digit100,
    Add2DigitRegrouping,
    Sub2DigitRegrouping,
    FractionsHalvesThirdsFourths,
    SkipCounting5To120,
    MissingNumbers50,
    MeasurementLength
} from '../SecondGradeMath';
import {
    PowersOf10,
    RoundingDecimals,
    EstimatingSumsDifferences,
    EvaluatingExpressions,
    SolvingOneStepEquations,
    PatternsRules,
    AddSubMixedNumbers,
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
    WritingExpressions,
    MultiplyingFractions,
    MultiplyingFractionsWhole,
    DividingFractions
} from '../FifthGradeWorksheets';
import { FractionsNumberLine, FractionsWholeNumbers, MetricUnits, MoneyWordProblems as MoneyProblems3rd } from '../ThirdGradeMathWorksheets';
import { FactorsMultiples, PrimeComposite } from '../FactorsWorksheets';
import { GeographyWorksheets } from '../../GeographyWorksheets';

// Props interface
interface MathRendererProps {
    activeDocs: string[];
    seed: string;
    variant: number;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
    t: (key: string) => string;
    getTrans: (key: string, fallback: string) => string;
    language?: string;
}

export const MathRenderer = ({ activeDocs, seed: effectiveSeed, variant, showAnswersForDoc, t, getTrans, language = 'en' }: MathRendererProps) => {
    const numVariant = variant;
    return (
        <>
            {/* Multiplication Section */}
            {/* Basic Facts 0-12 */}
            {activeDocs.includes('mult-facts-0-12') && (
                <MultiplicationFacts seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-0-12" range={[0, 12]} />
            )}
            {activeDocs.includes('mult-facts-1-5') && (
                <MultiplicationFacts seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-1-5" range={[1, 5]} />
            )}
            {activeDocs.includes('mult-facts-6-12') && (
                <MultiplicationFacts seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-6-12" range={[6, 12]} />
            )}

            {/* Arrays */}
            {activeDocs.includes('mult-arrays-2-5') && (
                <MultiplicationArrays2To5 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {(activeDocs.includes('mult-arrays') || activeDocs.includes('mult-arrays-models')) && (
                <MultiplicationArraysModels seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('mult-window-arrays') && (
                <MultiplicationWindowArrays seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {/* Skip Counting Mult */}
            {activeDocs.includes('skip-count-mult') && (
                <SkipCountingMultiplication seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {/* Times Tables */}
            {activeDocs.some((d: string) => ['mult-horizontal', 'mult-horizontal-1-5', 'mult-horizontal-6-12', 'times-table-horizontal-1-5', 'times-table-horizontal-6-12', 'times-table-horizontal-1-12'].includes(d)) && (
                <TimesTableHorizontal
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => d.startsWith('mult-horizontal') || d.startsWith('times-table-horizontal')) || 'times-table-horizontal-1-12'}
                    range={(activeDocs.includes('mult-horizontal-1-5') || activeDocs.includes('times-table-horizontal-1-5')) ? [1, 5] : (activeDocs.includes('mult-horizontal-6-12') || activeDocs.includes('times-table-horizontal-6-12')) ? [6, 12] : [1, 12]}
                />
            )}
            {activeDocs.some((d: string) => ['mult-vertical', 'mult-vertical-1-5', 'mult-vertical-6-12', 'times-table-vertical-1-5', 'times-table-vertical-6-12', 'times-table-vertical-1-12'].includes(d)) && (
                <TimesTableVertical
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => d.startsWith('mult-vertical') || d.startsWith('times-table-vertical')) || 'times-table-vertical-1-12'}
                    range={(activeDocs.includes('mult-vertical-1-5') || activeDocs.includes('times-table-vertical-1-5')) ? [1, 5] : (activeDocs.includes('mult-vertical-6-12') || activeDocs.includes('times-table-vertical-6-12')) ? [6, 12] : [1, 12]}
                />
            )}
            {activeDocs.some((d: string) => ['mult-missing', 'mult-missing-1-5', 'mult-missing-6-12', 'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed'].includes(d)) && (
                <TimesTableMissing
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => d.startsWith('mult-missing') || d.startsWith('times-table-missing')) || 'times-table-missing-mixed'}
                    range={(activeDocs.includes('mult-missing-1-5') || activeDocs.includes('times-table-missing-1-5')) ? [1, 5] : (activeDocs.includes('mult-missing-6-12') || activeDocs.includes('times-table-missing-6-12')) ? [6, 12] : [1, 12]}
                />
            )}
            {activeDocs.some((d: string) => ['mult-timed', 'times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12'].includes(d)) && (
                <MultiplicationTimed
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => ['times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12'].includes(d)) || 'times-table-timed-1-12'}
                    count={60}
                    timeLimit={(activeDocs.includes('times-table-timed-6-12') || activeDocs.includes('times-table-timed-1-12')) ? "5 minutes" : "3 minutes"}
                />
            )}

            {activeDocs.includes('mult-patterns') && <MultiplicationPatterns seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mult-strategies') && <MultiplicationStrategies seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mult-fact-fluency') && <MultiplicationFactFluency seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mult-mixed-review') && <MultiplicationMixedReview seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('times-table-mixed-review') && <MultiplicationMixedReview seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mult-fact-families') && <MultiplicationFactFamilies docId="mult-fact-families" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {activeDocs.includes('times-table-fluency-1-12') && (
                <MultiplicationFactFluency seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {activeDocs.some((d: string) => d.startsWith('times-table-blank-')) && (
                <MultiplicationBlankTable
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => d.startsWith('times-table-blank-')) || 'times-table-blank-1-12'}
                    range={
                        activeDocs.some((d: string) => d.includes('-1-5')) ? [1, 5] :
                            activeDocs.some((d: string) => d.includes('-6-12')) ? [6, 12] : [1, 12]
                    }
                />
            )}

            {activeDocs.some((d: string) => d.startsWith('times-table-color-')) && (
                <MultiplicationColorByNumber
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => d.startsWith('times-table-color-')) || 'times-table-color-1-12'}
                    range={
                        activeDocs.some((d: string) => d.includes('-1-5')) ? [1, 5] :
                            activeDocs.some((d: string) => d.includes('-6-12')) ? [6, 12] : [1, 12]
                    }
                />
            )}

            {activeDocs.some((d: string) => d.startsWith('times-table-confidence-')) && (
                <MultiplicationConfidence
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find((d: string) => d.startsWith('times-table-confidence-')) || 'times-table-confidence-1-5'}
                    range={
                        activeDocs.some((d: string) => d.includes('-6-12')) ? [6, 12] : [1, 5]
                    }
                />
            )}

            {/* Multiplication Word Problems */}
            {activeDocs.includes('mult-word-problems') && (
                <MultiplicationWordProblems seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-word-problems" difficulty="basic" />
            )}
            {activeDocs.includes('mult-word-problems-2-3') && (
                <MultiplicationWordProblems seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-word-problems-2-3" difficulty="basic" />
            )}
            {activeDocs.includes('mult-multi-step-word') && (
                <MultiplicationWordProblems seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-multi-step-word" difficulty="multi-step" />
            )}
            {activeDocs.includes('mult-complex-word') && (
                <MultiplicationWordProblems seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mult-complex-word" difficulty="complex" />
            )}

            {/* Multi-Digit Multiplication (Vertical) */}
            {activeDocs.some((d: string) => ['mult-2x1', 'mult-2x2', 'mult-3x1', 'mult-3x2', 'mult-2x1-digit', 'mult-2x2-digit', 'mult-3x1-digit', 'mult-3x2-digit'].includes(d)) && (() => {
                const docId = activeDocs.find((d: string) => d.startsWith('mult-')) || 'mult-2x1';
                let top = 2, bottom = 1;
                if (docId.includes('2x2')) { top = 2; bottom = 2; }
                else if (docId.includes('3x2')) { top = 3; bottom = 2; }

                return (
                    <MultiplicationVertical
                        seed={effectiveSeed}
                        variant={numVariant}
                        showAnswersForDoc={showAnswersForDoc}
                        docId={docId}
                        digitsTop={top}
                        digitsBottom={bottom}
                    />
                )
            })()}

            {activeDocs.includes('mult-area-model') && <AreaModelMult seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Specific Math Worksheets from MathWorksheets.tsx and SecondGradeMath.tsx */}
            {activeDocs.includes('addition-subtraction-0-10') && (
                <AdditionSubtraction0To10
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('number-tracing-1-10') && (
                <NumberTracing1To10
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('number-tracing-1-20') && (
                <NumberTracing1To20
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('place-value-hto') && (
                <PlaceValueHTO
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('money-coins-bills') && (
                <MoneyCoinsBills
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('measurement-length') && (
                <MeasurementLength
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('bar-graphs-data') && (
                <BarGraphsData
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('add-2digit-100') && (
                <Add2Digit100
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}

            {/* Geometry */}
            <GeographyWorksheets docId="geo-continents-k2" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <GeographyWorksheets docId="geo-compass-rose" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <GeographyWorksheets docId="geo-landforms" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <GeographyWorksheets docId="geo-latlong" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            {activeDocs.includes('classifying-triangles') && <ClassifyingTriangles docId="classifying-triangles" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('classifying-quadrilaterals') && <ClassifyingQuadrilaterals docId="classifying-quadrilaterals" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('lines-and-angles') || activeDocs.includes('lines-rays-angles')) && <LinesAndAngles docId="lines-and-angles" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('classifying-angles') && <ClassifyingAngles docId="classifying-angles" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('symmetry-transformations') || activeDocs.includes('symmetry')) && <SymmetryTransformations docId="symmetry-transformations" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('area-perimeter') || activeDocs.includes('area-rectangles') || activeDocs.includes('perimeter-shapes') || activeDocs.includes('perimeter-area-word-problems')) && <AreaPerimeter docId="area-perimeter" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('identify-polygons') && <IdentifyPolygons docId="identify-polygons" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Measurement */}
            {activeDocs.includes('mass-weight') && <MassAndWeight docId="mass-weight" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('liquid-measurement') && <LiquidMeasurement docId="liquid-measurement" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('elapsed-time') && <ElapsedTime docId="elapsed-time" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('customary-units') && <CustomaryUnits docId="customary-units" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Decimals */}
            {activeDocs.includes('decimals-place-value') && <DecimalsPlaceValue docId="decimals-place-value" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('comparing-decimals') && <ComparingDecimals docId="comparing-decimals" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('add-sub-decimals') && <AddSubDecimals docId="add-sub-decimals" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fractions-to-decimals') && <FractionsToDecimals docId="fractions-to-decimals" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Division */}
            {activeDocs.includes('long-division-1-digit') && <LongDivision1Digit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('long-division-2-digit') && <LongDivision2Digit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('long-division-multi-digit') && <LongDivisionMultiDigit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('long-division-multi-digit') && <LongDivisionMultiDigit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('dividing-by-10-100') || activeDocs.includes('div-by-10-100')) && <DividingBy10And100 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 3rd Grade Math Restoration */}
            {activeDocs.includes('metric-units') && <MetricUnits docId="metric-units" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('money-word-problems') && <MoneyProblems3rd docId="money-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fractions-number-line') && <FractionsNumberLine docId="fractions-number-line" showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fractions-whole') && <FractionsWholeNumbers docId="fractions-whole" showAnswersForDoc={showAnswersForDoc} />}

            {/* 3rd Grade Multiplication & Division */}
            {activeDocs.includes('mult-properties') && <MultiplicationProperties seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mult-by-10-100') && <MultiplicationBy10And100 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('div-with-remainders') && <DivisionWithRemainders seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('div-word-problems') && <DivisionWordProblems seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fact-families-mult-div') && <MultiplicationFactFamilies docId="fact-families-mult-div" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 3rd Grade Fractions Extras */}
            {(activeDocs.includes('comparing-fractions') || activeDocs.includes('comparing-fractions-4th')) && <ComparingFractions4th seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('equivalent-fractions') || activeDocs.includes('equivalent-fractions-4th')) && <EquivFractions4th seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('add-sub-fractions') || activeDocs.includes('add-sub-fractions-4th')) && <AddSubFractions4th seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 3rd Grade Measurement & Data */}
            {/* 3rd Grade Measurement & Data */}
            {(activeDocs.includes('time-to-minute') || activeDocs.includes('time-to-the-minute')) && <Time5Min seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('elapsed-time-word-problems') && <MeasurementWordProblems docId="elapsed-time-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('multi-step-word-problems') || activeDocs.includes('multi-step-word-5th') || activeDocs.includes('multi-step-word-4th')) && <MultiStepWordProblems docId="multi-step-word-problems" showAnswersForDoc={showAnswersForDoc} />}

            {/* 4th & 5th Grade Data Analysis */}
            {activeDocs.includes('line-plots') && <LinePlots docId="line-plots" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('bar-graphs-pictographs') || activeDocs.includes('bar-graphs-data')) && <BarGraphs docId="bar-graphs-pictographs" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('mean-median-mode') || activeDocs.includes('mean-median-mode-range')) && <MeanMedianMode docId="mean-median-mode" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 4th Grade Geometry & Measurement */}
            {activeDocs.includes('lines-angles-4th') && <LinesAndAngles docId="lines-angles-4th" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('area-perimeter-4th') && <AreaPerimeter docId="area-perimeter-4th" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('customary-conversion') && <CustomaryUnits docId="customary-conversion" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('metric-conversion') && <MetricUnits docId="metric-conversion" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('elapsed-time-4th') && <ElapsedTime docId="elapsed-time-4th" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('liquid-measurement-4th') && <LiquidMeasurement docId="liquid-measurement-4th" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mass-weight-4th') && <MassAndWeight docId="mass-weight-4th" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 4th Grade Fractions & Decimals */}
            {activeDocs.includes('mixed-improper-fractions') && <MixedImproperFractions seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('fractions-to-decimals') || activeDocs.includes('fractions-to-decimals-basic-tenths') || activeDocs.includes('fractions-to-decimals-division')) && <FractionsToDecimals seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 4th Grade Word Problems */}
            {(activeDocs.includes('fraction-word-problems') || activeDocs.includes('fraction-word-problems-5th')) && <FractionWordProblems docId="fraction-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('decimal-word-problems') || activeDocs.includes('decimal-word-problems-5th')) && <DecimalWordProblems docId="decimal-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('measurement-word-problems') || activeDocs.includes('measurement-word-problems-5th')) && <MeasurementWordProblems docId="measurement-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('geometry-word-problems') && <GeometryWordProblems docId="geometry-word-problems" showAnswersForDoc={showAnswersForDoc} />}

            {/* 4th Grade Multiplication & Division */}
            {(activeDocs.includes('mult-2x1-digit') || activeDocs.includes('mult-2x1')) && <MultiplicationVertical docId="mult-2x1-digit" digitsTop={2} digitsBottom={1} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('mult-2x2-digit') || activeDocs.includes('mult-2x2')) && <MultiplicationVertical docId="mult-2x2-digit" digitsTop={2} digitsBottom={2} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('area-model-mult') || activeDocs.includes('mult-area-model')) && <AreaModelMult seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('partial-products') && <PartialProducts seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('long-division-1digit') || activeDocs.includes('long-division-1-digit')) && <LongDivision1Digit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('long-division-2digit') || activeDocs.includes('long-division-2-digit')) && <LongDivision2Digit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}



            {/* 5th Grade */}
            {activeDocs.includes('multiplying-decimals') && <MultiplyingDecimals seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('dividing-decimals') && <DividingDecimals seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fractions-decimals-percents') && <FractionsDecimalsPercents seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('comparing-ordering-fractions-decimals') && <ComparingOrderingFractionsDecimals seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('adding-decimals-challenge') && <AddingDecimalsChallenge seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('add-sub-mixed-numbers') || activeDocs.includes('mixed-numbers-add-sub')) && <AddSubMixedNumbers seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('fraction-mult') || activeDocs.includes('fraction-mult-whole') || activeDocs.includes('multiplying-fractions')) && <MultiplyingFractionsWhole seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('multiplying-fractions') && <MultiplyingFractions seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="multiplying-fractions" />}
            {(activeDocs.includes('div-fractions') || activeDocs.includes('fraction-div') || activeDocs.includes('dividing-fractions')) && <DividingFractions seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId={activeDocs.includes('dividing-fractions') ? "dividing-fractions" : undefined} />}

            {/* 5th Grade Operations */}
            {activeDocs.includes('long-division-multidigit') && <LongDivisionMultiDigit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('order-of-operations-pemdas') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="order-of-operations-pemdas" />}

            {/* Order of Operations (PEMDAS) - New Mappings */}
            {activeDocs.includes('pemdas-basic') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-basic" />}
            {activeDocs.includes('pemdas-parentheses') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-parentheses" />}
            {activeDocs.includes('pemdas-practice') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-practice" />}
            {activeDocs.includes('pemdas-exponents') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-exponents" />}
            {activeDocs.includes('pemdas-multistep') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-multistep" />}
            {activeDocs.includes('pemdas-word-problems') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-word-problems" />}
            {activeDocs.includes('pemdas-advanced') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-advanced" />}
            {activeDocs.includes('pemdas-complex') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-complex" />}
            {activeDocs.includes('pemdas-rules') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-rules" />}
            {activeDocs.includes('pemdas-mixed-review') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-mixed-review" />}
            {activeDocs.includes('pemdas-fluency') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-fluency" />}
            {activeDocs.includes('pemdas-step-by-step') && <OrderOfOperations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="pemdas-step-by-step" />}

            {/* 5th Grade Geometry & Algebra */}
            {activeDocs.includes('volume-rectangular-prisms') && <VolumeRectangularPrisms seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('area-triangles-parallelograms') && <AreaTrianglesParallelograms seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('classifying-shapes') && <ClassifyingShapes5th seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('coordinate-graphing') && <CoordinateGraphing seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('nets-3d-shapes') && <Nets3DShapes seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('transformations-5th') && <Transformations5th seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('patterns-rules') && <PatternsRules seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('solving-one-step-equations') || activeDocs.includes('writing-expressions')) && <SolvingOneStepEquations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('evaluating-expressions') && <EvaluatingExpressions seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 5th Grade Data Analysis */}
            {activeDocs.includes('mean-median-mode-range') && <MeanMedianModeRange seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="mean-median-mode-range" />}
            {activeDocs.includes('line-graphs') && <LineGraphs seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="line-graphs" />}
            {activeDocs.includes('stem-leaf-plots') && <StemLeafPlots seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="stem-leaf-plots" />}
            {activeDocs.includes('probability') && <Probability5th seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} docId="probability" />}

            {/* 5th Grade Word Problems */}
            {activeDocs.includes('percent-word-problems') && <FifthGradeWordProblems docId="percent-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('ratio-proportion-word-problems') && <FifthGradeWordProblems docId="ratio-proportion-word-problems" showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('multi-step-word-5th')) && <FifthGradeWordProblems docId="multi-step-word-5th" showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('fraction-word-problems-5th')) && <FifthGradeWordProblems docId="fraction-word-problems-5th" showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('decimal-word-problems-5th')) && <FifthGradeWordProblems docId="decimal-word-problems-5th" showAnswersForDoc={showAnswersForDoc} />}

            {/* 5th Grade Operations */}
            {activeDocs.includes('powers-of-10') && <PowersOf10 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('rounding-decimals') && <RoundingDecimals seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('estimating-sums-differences') && <EstimatingSumsDifferences seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('powers-of-10') && <PowersOf10 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('rounding-decimals') && <RoundingDecimals seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('estimating-sums-differences') && <EstimatingSumsDifferences seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('evaluating-expressions') && <EvaluatingExpressions seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('writing-expressions') && <WritingExpressions seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('solving-one-step-equations') && <SolvingOneStepEquations seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('patterns-rules') && <PatternsRules seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Critical Math Restorations */}
            {activeDocs.includes('add-2digit-regrouping') && <Add2DigitRegrouping docId="add-2digit-regrouping" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('sub-2digit-regrouping') && <Sub2DigitRegrouping docId="sub-2digit-regrouping" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fractions-halves-thirds-fourths') && <FractionsHalvesThirdsFourths seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} showAnswers={true} />}
            {activeDocs.includes('more-less-equal-10') && <MoreLessEqual10 docId="more-less-equal-10" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('counting-objects-20') && <CountingObjects20 docId="counting-objects-20" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 2nd Grade Extras */}
            {activeDocs.includes('expanded-form-200') && <ExpandedForm200 docId="expanded-form-200" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('number-patterns-200') && <NumberPatterns200 docId="number-patterns-200" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('rounding-nearest-10') && <RoundingNearest10 docId="rounding-nearest-10" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('add-three-numbers') && <AddThreeNumbers docId="add-three-numbers" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('missing-addends') && <MissingAddends docId="missing-addends" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fact-families-20') && <FactFamilies20 docId="fact-families-20" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mental-math-20') && <MentalMath20 docId="mental-math-20" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('doubles-near-doubles') && <DoublesNearDoubles docId="doubles-near-doubles" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('number-line-200') && <NumberLine200 docId="number-line-200" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Additional Math Restoration */}

            {activeDocs.includes('sub-2digit-100') && <Sub2Digit100 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('word-problems-100') && <WordProblems100 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('compare-2-digit') || activeDocs.includes('compare-2digit')) && <Compare2Digit seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('even-odd-100') && <EvenOdd100 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('time-5-min') || activeDocs.includes('time-5min')) && <Time5Min seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {(activeDocs.includes('skip-count-5-10-120') || activeDocs.includes('skip-counting-by-5s-and-10s-to-120')) && <SkipCounting5To120 seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* First Grade Restoration */}
            {(activeDocs.includes('number-line-addition') || activeDocs.includes('number-line-add')) && (
                <NumberLineAddition
                    docId={activeDocs.includes('number-line-add') ? 'number-line-add' : 'number-line-addition'}
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {(activeDocs.includes('skip-counting') || activeDocs.includes('skip-count-2s')) && (
                <SkipCountingWorksheet
                    docId={activeDocs.includes('skip-count-2s') ? 'skip-count-2s' : 'skip-counting'}
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {(activeDocs.includes('balance-equations') || activeDocs.includes('balance-equations-10')) && (
                <BalanceEquations
                    docId={activeDocs.includes('balance-equations-10') ? 'balance-equations-10' : 'balance-equations'}
                    seed={effectiveSeed}
                    variant={numVariant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('subtraction-stories') && <SubtractionStories docId="subtraction-stories" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('number-bonds-10') && <NumberBonds10 docId="number-bonds-10" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('count-write-30') && <CountWrite30 docId="count-write-30" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('missing-numbers-50') && <MissingNumbers50FirstGrade docId="missing-numbers-50" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('doubles-facts') && <DoublesFacts docId="doubles-facts" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('picture-addition-10') && <PictureAddition10 docId="picture-addition-10" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('ten-frames-1-10') && <TenFrames1To10 docId="ten-frames-1-10" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Higher Grade Content */}
            {activeDocs.includes('div-facts-1-12') && <DivisionFacts seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('factors-multiples') && <FactorsMultiples docId="factors-multiples" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('prime-composite') && <PrimeComposite docId="prime-composite" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('math-maze') && <MathMazeWorksheets key="math-maze" docId="math-maze" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('logic-grid') && <LogicWorksheets docId="logic-grid" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('logic-maze') && <LogicWorksheets docId="logic-maze" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />}

        </>
    );
};
