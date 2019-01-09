export function getRandomInteger(min:number, max:number): number {
    return Math.floor(Math.random() * (max - min) ) + min;
}
export function getRandomFloat(min:number, max:number): number {
    const random =  Math.random() * (max - min) + min;
    const randomNumberWith2Decimals = Number(random.toFixed(2));

    return randomNumberWith2Decimals;
}
export function cutDecimalsFromNumber(number: number, howManyKeep: number): number {
    return Number(number.toFixed(howManyKeep));
}