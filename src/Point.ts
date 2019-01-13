import Canvas from './Canvas';
import Coordinate from './Coordinate';
import {getRandomFloat} from './utils';
import {Sign} from './models';
import { signOfTheSum } from './activation-functions';


export default class Point {
    private coordinate: Coordinate;
    private canvas: Canvas;
    private bias: number;

    private trueValue: Sign;
    private predicatedValue: Sign;

    constructor(canvas: Canvas, functionForLine:(x:number)=> number) {
        this.canvas = canvas;
        this.coordinate = new Coordinate(getRandomFloat(-1,1), getRandomFloat(-1,1));   
        const lineYvalueAtPoint = functionForLine(this.coordinate.getX());    
        this.trueValue = lineYvalueAtPoint < this.coordinate.getY() ? Sign.positive : Sign.negative;
        this.predicatedValue = this.generateRandomPredicatedValue();
        this.bias = 1 // always equal to 1
    }
    /**
     * Extract outside
     */
    private generateRandomPredicatedValue(): Sign {       ;
        return getRandomFloat(-1,1) >= 0 ? Sign.positive : Sign.negative;
    }

    public drawPointOnCanvas(paintPoints: boolean = true) {
        if(this.canvas) {
            this.canvas.drawDot(this.coordinate, this.getColorDependingIfPredictionWasSameAsTrueValue(paintPoints));
        }        
    }

    public getBias(): number {
        return this.bias;
    }

    // green - prediction was correct
    // red - prediction was false
    public getColorDependingIfPredictionWasSameAsTrueValue(paintPoints:boolean = true): string {       
        if(paintPoints === true && this.getTrueValue() === this.getPredicatedValue()) {
            if(this.getTrueValue() === 1) {
                return "green";
            } else {
                return "red";
            }
        } else {
            return "#DDD";
        }
    }

    /**
     * If x >= y then value is 1, otherwise -1
     */
    public getTrueValue() {
        return this.trueValue;
    }

    public setPredicatedValue(value: Sign) {
        this.predicatedValue = value;
    }
    public getPredicatedValue() {
        return this.predicatedValue;
    }
    public getInputsForPerceptorToGuess(): number[] {
        return [
            this.coordinate.getX(),
            this.coordinate.getY(),
            this.bias // must be added to overcome 0 result when inputs would be also 0
        ];
    }
}