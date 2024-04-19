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


