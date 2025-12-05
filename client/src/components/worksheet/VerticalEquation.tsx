import React from 'react'
import clsx from 'clsx'

type Operator = '+' | '−' | '×' | '÷'

interface VerticalEquationProps {
  top: React.ReactNode
  bottom: React.ReactNode
  operator: Operator
  topClassName?: string
  bottomClassName?: string
  operatorClassName?: string
  borderColorClass?: string
  answerWidthClass?: string
  answerHeightClass?: string
  answerContainerClassName?: string
  printAnswerWidthClass?: string
  printAnswerHeightClass?: string
  className?: string
  sizeClassName?: string
  printSizeClassName?: string
}

export function VerticalEquation({
  top,
  bottom,
  operator,
  topClassName = '',
  bottomClassName = '',
  operatorClassName,
  borderColorClass = 'border-slate-600',
  answerWidthClass = 'w-20',
  answerHeightClass = 'h-10',
  answerContainerClassName = 'h-12',
  printAnswerWidthClass = 'min-w-[1.75in]',
  printAnswerHeightClass = 'h-6',
  className = '',
  sizeClassName = 'text-2xl',
  printSizeClassName = 'text-xl'
}: VerticalEquationProps) {
  const operatorColorClass = operatorClassName ?? bottomClassName

  return (
    <div className={clsx('vertical-equation font-mono leading-7 text-right', sizeClassName, className)}>
      <div className="space-y-1 print:hidden">
        <div className={topClassName}>{top}</div>
        <div className={bottomClassName}>
          {operator} {bottom}
        </div>
        <div
          className={clsx(
            'border-t-[3px] mt-2 pt-2 flex items-center justify-end',
            borderColorClass,
            answerContainerClassName
          )}
        >
          <span
            className={clsx(
              'inline-block border-b-[3px]',
              borderColorClass,
              answerWidthClass,
              answerHeightClass
            )}
          />
        </div>
      </div>
      <div
        className={clsx(
          'hidden print:flex font-mono items-center justify-end gap-2 leading-tight',
          printSizeClassName
        )}
      >
        <span className={topClassName}>{top}</span>
        <span className={operatorColorClass}>{operator}</span>
        <span className={bottomClassName}>{bottom}</span>
        <span>=</span>
        <span
          className={clsx(
            'inline-block border-b-2 align-middle',
            borderColorClass,
            printAnswerWidthClass,
            printAnswerHeightClass
          )}
        />
      </div>
    </div>
  )
}
