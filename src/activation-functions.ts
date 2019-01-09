import { Sign } from './models';

export function signOfTheSum(n: number): Sign {
    return n>=0 ? Sign.positive : Sign.negative;
}