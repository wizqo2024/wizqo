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
    AreaModelMult
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
    DividingBy10And100
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
    // CoordinateGraphing,
    Nets3DShapes,
    Transformations5th,
    // LineGraphsAs5th,
    MeanMedianModeRange, // Assuming this export exists or check file
    StemLeafPlots,
    Probability5th,
    FifthGradeWordProblems,
    WritingExpressions
} from '../FifthGradeWorksheets';
import { FractionsNumberLine, FractionsWholeNumbers, MetricUnits, MoneyWordProblems as MoneyProblems3rd } from '../ThirdGradeMathWorksheets';
import { FactorsMultiples, PrimeComposite } from '../FactorsWorksheets';
import { GeographyWorksheets } from '../../GeographyWorksheets';

// Props interface
interface MathRendererProps {
    activeDocs: string[];
    seed: string;
    variant: string;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
    t: any;
    getTrans: any;
    language?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ activeDocs, seed: effectiveSeed, variant, showAnswersForDoc, t, getTrans, language = 'en' }) => {
    return (
        <>
            {/* Multiplication Section */}
            {/* Basic Facts 0-12 */}
            {activeDocs.includes('mult-facts-0-12') && (
                <MultiplicationFacts seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-0-12" range={[0, 12]} />
            )}
            {activeDocs.includes('mult-facts-1-5') && (
                <MultiplicationFacts seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-1-5" range={[1, 5]} />
            )}
            {activeDocs.includes('mult-facts-6-12') && (
                <MultiplicationFacts seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} docId="mult-facts-6-12" range={[6, 12]} />
            )}

            {/* Arrays */}
            {activeDocs.includes('mult-arrays-2-5') && (
                <MultiplicationArrays2To5 seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {(activeDocs.includes('mult-arrays') || activeDocs.includes('mult-arrays-models')) && (
                <MultiplicationArraysModels seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('mult-window-arrays') && (
                <MultiplicationWindowArrays seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {/* Skip Counting Mult */}
            {activeDocs.includes('skip-count-mult') && (
                <SkipCountingMultiplication seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {/* Times Tables */}
            {activeDocs.some(d => ['mult-horizontal', 'mult-horizontal-1-5', 'mult-horizontal-6-12', 'times-table-horizontal-1-5', 'times-table-horizontal-6-12', 'times-table-horizontal-1-12'].includes(d)) && (
                <TimesTableHorizontal
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find(d => d.startsWith('mult-horizontal') || d.startsWith('times-table-horizontal')) || 'times-table-horizontal-1-12'}
                    range={(activeDocs.includes('mult-horizontal-1-5') || activeDocs.includes('times-table-horizontal-1-5')) ? [1, 5] : (activeDocs.includes('mult-horizontal-6-12') || activeDocs.includes('times-table-horizontal-6-12')) ? [6, 12] : [1, 12]}
                />
            )}
            {activeDocs.some(d => ['mult-vertical', 'mult-vertical-1-5', 'mult-vertical-6-12', 'times-table-vertical-1-5', 'times-table-vertical-6-12', 'times-table-vertical-1-12'].includes(d)) && (
                <TimesTableVertical
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find(d => d.startsWith('mult-vertical') || d.startsWith('times-table-vertical')) || 'times-table-vertical-1-12'}
                    range={(activeDocs.includes('mult-vertical-1-5') || activeDocs.includes('times-table-vertical-1-5')) ? [1, 5] : (activeDocs.includes('mult-vertical-6-12') || activeDocs.includes('times-table-vertical-6-12')) ? [6, 12] : [1, 12]}
                />
            )}
            {activeDocs.some(d => ['mult-missing', 'mult-missing-1-5', 'mult-missing-6-12', 'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed'].includes(d)) && (
                <TimesTableMissing
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                    docId={activeDocs.find(d => d.startsWith('mult-missing') || d.startsWith('times-table-missing')) || 'times-table-missing-mixed'}
                    range={(activeDocs.includes('mult-missing-1-5') || activeDocs.includes('times-table-missing-1-5')) ? [1, 5] : (activeDocs.includes('mult-missing-6-12') || activeDocs.includes('times-table-missing-6-12')) ? [6, 12] : [1, 12]}
                />
            )}
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

            {/* Specific Math Worksheets from MathWorksheets.tsx and SecondGradeMath.tsx */}
            {activeDocs.includes('addition-subtraction-0-10') && (
                <AdditionSubtraction0To10
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('number-tracing-1-10') && (
                <NumberTracing1To10
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('number-tracing-1-20') && (
                <NumberTracing1To20
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('place-value-hto') && (
                <PlaceValueHTO
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('money-coins-bills') && (
                <MoneyCoinsBills
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('measurement-length') && (
                <MeasurementLength
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('bar-graphs-data') && (
                <BarGraphsData
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
            {activeDocs.includes('add-2digit-100') && (
                <Add2Digit100
                    seed={effectiveSeed}
                    variant={variant}
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}

            {/* Geometry */}
            <GeographyWorksheets docId="geo-continents-k2" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <GeographyWorksheets docId="geo-compass-rose" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <GeographyWorksheets docId="geo-landforms" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <GeographyWorksheets docId="geo-latlong" commonProps={{ activeDocs, showAnswers: true, docTitle: "", effectiveSeed, variant, showAnswersForDoc, t, getTrans }} />
            <ClassifyingTriangles seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <ClassifyingQuadrilaterals seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <LinesAndAngles seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <ClassifyingAngles seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <SymmetryTransformations seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <AreaPerimeter seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <IdentifyPolygons seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />

            {/* Measurement */}
            <MassAndWeight seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            <LiquidMeasurement seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            <ElapsedTime seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            <CustomaryUnits seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />

            {/* Decimals */}
            <DecimalsPlaceValue seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            <ComparingDecimals seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            <AddSubDecimals seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            <FractionsToDecimals seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />

            {/* Division */}
            <LongDivision1Digit seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <LongDivision2Digit seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <LongDivisionMultiDigit seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />
            <DividingBy10And100 seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} activeDocs={activeDocs} />

            {/* 5th Grade */}
            {activeDocs.includes('powers-of-10') && <PowersOf10 seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('rounding-decimals') && <RoundingDecimals seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('estimating-sums-differences') && <EstimatingSumsDifferences seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('evaluating-expressions') && <EvaluatingExpressions seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('writing-expressions') && <WritingExpressions seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('solving-one-step-equations') && <SolvingOneStepEquations seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('patterns-rules') && <PatternsRules seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Critical Math Restorations */}
            {activeDocs.includes('add-2digit-regrouping') && <Add2DigitRegrouping docId="add-2digit-regrouping" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('sub-2digit-regrouping') && <Sub2DigitRegrouping docId="sub-2digit-regrouping" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fractions-halves-thirds-fourths') && <FractionsHalvesThirdsFourths docId="fractions-halves-thirds-fourths" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('more-less-equal-10') && <MoreLessEqual10 docId="more-less-equal-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('counting-objects-20') && <CountingObjects20 docId="counting-objects-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* 2nd Grade Extras */}
            {activeDocs.includes('expanded-form-200') && <ExpandedForm200 docId="expanded-form-200" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('number-patterns-200') && <NumberPatterns200 docId="number-patterns-200" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('rounding-nearest-10') && <RoundingNearest10 docId="rounding-nearest-10" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('add-three-numbers') && <AddThreeNumbers docId="add-three-numbers" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('missing-addends') && <MissingAddends docId="missing-addends" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('fact-families-20') && <FactFamilies20 docId="fact-families-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mental-math-20') && <MentalMath20 docId="mental-math-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('doubles-near-doubles') && <DoublesNearDoubles docId="doubles-near-doubles" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('number-line-200') && <NumberLine200 docId="number-line-200" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

        </>
    );
};
