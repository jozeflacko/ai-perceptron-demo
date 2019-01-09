import Point from './Point';
import { getRandomFloat } from './utils';
import * as activationFunction from './activation-functions';
import {Sign} from './models';

export default class Perceptron {
    
    private static readonly LEARNING_RATE: number = 0.05;

    numberOfWeights = 0;
    weights: number[] = [];

    constructor(numberOfWeights: number) {
       this.numberOfWeights = numberOfWeights;
       for(let i=0; i<this.numberOfWeights; i++) {
           this.weights.push(this.getRandom());
       }
    }

    private getRandom(): number {
        return getRandomFloat(-1,1);
    }

    private doGuess(inputs: number[]): Sign {
        if(inputs.length !== this.weights.length) {
            throw new Error('Number of Inputs is not matching lenght of weights!');
        }
        let sum: number = 0;
        this.weights.map((weight: number, index:number)=>{
            sum += weight * inputs[index];
        });

        return activationFunction.signOfTheSum(sum);
    }

    public doTrain(inputs: number[], trueValue: number): Sign {
        const guess = this.doGuess(inputs);
        const error = trueValue - guess; // will be 0 when predicated value was same as true value, otherwise will be +2 or -2

        // tweek weights (tune all weights)
        const newWeights = this.weights.map((weight:number, index: number)=>{
            return Number((weight + (error * inputs[index] * Perceptron.LEARNING_RATE)).toFixed(2));
        });

        this.weights = newWeights;

        return guess; // return back to the point what was the guess
    }
}