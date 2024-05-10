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

export const throttle = (func: (...args: any[]) => void, limit: number) => {
    type Timeout = number | NodeJS.Timeout;
    let lastFunc: Timeout
    let lastRan: number

    return (...args: []) => {
        const context = this
        if (!lastRan) {
            func.apply(context, args)
            lastRan = Date.now()
        } else {
            clearTimeout(lastFunc as number)
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args)
                    lastRan = Date.now()
                }
            }, limit - (Date.now() - lastRan))
        }
    }
}
