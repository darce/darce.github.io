import React, { useId } from 'react'
import styles from './SearchWorkflow.module.scss'

type Kind = 'entry' | 'similar' | 'selection'

// These are explanatory schematics, not reconstructed application screens.
// Lettered photographs make the same object traceable through a state change.
function Photo({ x, y, letter, selected = false, width = 68, height = 46 }: {
    x: number; y: number; letter: string; selected?: boolean; width?: number; height?: number
}) {
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} rx="3" className={selected ? styles.selected : styles.photo} />
            <text x={x + width / 2} y={y + height / 2 + 6} textAnchor="middle">{letter}</text>
        </g>
    )
}

function Entry({ arrow }: { arrow: string }) {
    return (
        <>
            <rect x="8" y="8" width="136" height="66" rx="6" className={styles.panel} />
            <rect x="160" y="8" width="136" height="66" rx="6" className={styles.panel} />
            <text x="76" y="46" textAnchor="middle" className={styles.title}>Words</text>
            <text x="228" y="36" textAnchor="middle" className={styles.title}>Reference</text>
            <text x="228" y="57" textAnchor="middle">image</text>
            <path d="M76 74 V92 Q76 112 96 112 H152 M228 74 V92 Q228 112 208 112 H152" className={styles.link} />
            <path d="M152 112 V154" className={styles.link} markerEnd={arrow} />
            <text x="170" y="137">Search</text>
            <rect x="46" y="154" width="212" height="82" rx="6" className={styles.panel} />
            <text x="152" y="177" textAnchor="middle" className={styles.title}>Candidate photographs</text>
            {['A', 'B', 'C'].map((letter, i) => <Photo key={letter} x={70 + i * 56} y={190} letter={letter} width={50} height={34} />)}
        </>
    )
}

function Similar({ arrow }: { arrow: string }) {
    return (
        <>
            <rect x="40" y="8" width="256" height="68" rx="6" className={styles.panel} />
            <text x="52" y="29" className={styles.title}>1 · Text results</text>
            {['A', 'B', 'C'].map((letter, i) => <Photo key={letter} x={52 + i * 80} y={39} letter={letter} selected={letter === 'B'} height={26} />)}
            <path d="M168 76 V104" className={styles.link} markerEnd={arrow} />
            <text x="181" y="94">Open B</text>

            <rect x="40" y="104" width="256" height="68" rx="6" className={styles.panel} />
            <text x="52" y="125" className={styles.title}>2 · Inspect B</text>
            <Photo x={116} y={135} letter="B" selected height={26} />
            <path d="M168 172 V202" className={styles.link} markerEnd={arrow} />
            <text x="177" y="191">Find similar</text>

            <rect x="40" y="202" width="256" height="68" rx="6" className={styles.panel} />
            <text x="52" y="223" className={styles.title}>3 · Similar to B</text>
            {['E', 'F', 'G'].map((letter, i) => <Photo key={letter} x={52 + i * 80} y={233} letter={letter} height={26} />)}
            <path d="M40 246 H16 V53 H40" className={styles.returnLink} markerEnd={arrow} />
            <text x="40" y="294">Back to text results</text>
        </>
    )
}

function Selection({ arrow }: { arrow: string }) {
    return (
        <>
            <text x="84" y="27" textAnchor="middle" className={styles.title}>Map</text>
            <text x="268" y="27" textAnchor="middle" className={styles.title}>Image grid</text>
            <rect x="8" y="40" width="152" height="170" rx="6" className={styles.panel} />
            {[[28, 62], [56, 59], [107, 64], [136, 58], [40, 179], [68, 187], [121, 178]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3" className={styles.point} />
            ))}
            <rect x="20" y="82" width="128" height="76" rx="4" className={styles.selected} />
            {['A', 'B', 'C'].map((letter, i) => <text key={letter} x={42 + i * 42} y="129" textAnchor="middle">{letter}</text>)}
            <path d="M160 120 H192" className={styles.link} markerEnd={arrow} />
            <rect x="192" y="40" width="152" height="170" rx="6" className={styles.panel} />
            {['A', 'B', 'C'].map((letter, i) => <Photo key={letter} x={204 + i * 46} y={94} letter={letter} selected width={40} height={52} />)}
            <text x="176" y="246" textAnchor="middle">Same selected photographs</text>
        </>
    )
}

const sizes: Record<Kind, [number, number]> = { entry: [304, 244], similar: [304, 306], selection: [352, 262] }

export default function SearchWorkflow({ kind, label, children }: { kind: Kind; label: string; children: React.ReactNode }) {
    const marker = `workflow-${useId().replace(/:/g, '')}`
    const [width, height] = sizes[kind]
    const arrow = `url(#${marker})`
    return (
        <figure
            role="img"
            aria-label={label}
            data-workflow={kind}
            className={styles.figure}
            style={{ '--workflow-width': `${width / 16}rem` } as React.CSSProperties}
        >
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false" className={`${styles.canvas} ${kind === 'selection' ? styles.selection : ''}`}>
                <defs>
                    <marker id={marker} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
                    </marker>
                </defs>
                {kind === 'entry' ? <Entry arrow={arrow} /> : kind === 'similar' ? <Similar arrow={arrow} /> : <Selection arrow={arrow} />}
            </svg>
            <figcaption>{children}</figcaption>
        </figure>
    )
}
