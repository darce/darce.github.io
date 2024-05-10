export const mapRange = (
    value: number,
    inputMin: number,
    inputMax: number,
    outputMin: number,
    outputMax: number
) => {
    const mappedValue: number = ((value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin)) + outputMin
    return mappedValue
}

export const throttle = (callback: (...args: any[]) => void, pause: number) => {
    let isPaused: boolean = false
    /** Handle different return types of setTimeout: number for client, Timeout for node */
    let timeout: ReturnType<typeof setTimeout>

    const throttledFunction = (...args: any[]) => {
        if (isPaused) return
        isPaused = true;
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            callback(...args)
            isPaused = false
        }, pause)
    }

    return throttledFunction
}