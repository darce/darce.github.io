const TYPE_LABELS: Record<string, string> = {
    method: 'Format: method',
    note: 'Format: field note',
    experiment: 'Format: hypothesis test',
}

const STATUS_LABELS: Record<string, string> = {
    running: 'Evidence: in daily use',
    measured: 'Evidence: measurement complete',
    registered: 'Evidence: measurement pending',
    rerun: 'Evidence: rerun planned',
    closed: 'Evidence: closed',
}

/** Translate machine-readable research taxonomy into reader-facing badge copy. */
export function formatResearchBadge(kind: 'type' | 'status', value: string): string {
    if (kind === 'type') {
        return TYPE_LABELS[value] ?? `Format: ${value}`
    }
    return STATUS_LABELS[value] ?? `Evidence: ${value}`
}
