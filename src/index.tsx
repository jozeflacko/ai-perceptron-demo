import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './index.css';
import Point from './Point';
import Canvas, { CanvasDimentions } from './Canvas';
import Perceptron from './Perceptron';
import Coordinate from './Coordinate';
import * as math from './utils';

class Main extends Component {
  
  private static readonly NUMBER_OF_WEIGHTS = 3; // should be the same as how many coordinated we have in a point: x,y + bias
  private static readonly NUMBER_OF_POINTS = 300; 

  private canvas: Canvas;
  private perceptron: Perceptron;

  private points: Point[] = [];

  private lineWeightForX: number = -1;
  private lineWeightForY: number = -1;

  constructor(props: {}) {
    super(props);
    this.canvas = new Canvas(React.createRef<HTMLCanvasElement>(), 640, 640);    
    this.setLineWeights();
    
    // we will have only 1 perceptron
    this.perceptron = new Perceptron(Main.NUMBER_OF_WEIGHTS); 

    // and 1 point which we want to find out the value
    this.points = this.createPoints(Main.NUMBER_OF_POINTS, this.canvas);    
  }

  private setLineWeights(): void {
    this.lineWeightForX = math.getRandomFloat(-0.9,0.9);
    if(this.lineWeightForX === 0) {
      this.lineWeightForX = 0.3;
    }
    this.lineWeightForY = math.getRandomFloat(-0.9,0.9);
    if(this.lineWeightForY === 0) {
      this.lineWeightForY = 0.3;
    }
  }

  componentDidMount() {    
    this.redrawCanvas();
    this.animateTraining();
  }

  private animateTraining() {
    const train = this.trainPerceptorAndRepaintAllPoints;
    const i = setInterval(()=>{
      train();
    },300);
    setTimeout(()=> {
      clearInterval(i);
    },10000);
  }

  private drawAllPoints(): void {
    this.points.map((point:Point)=>{
      point.drawPointOnCanvas();    
    });    
  }

  private redrawCanvas() {
    this.clearCanvas();
    this.drawCardesianLines();
    this.drawDivisionLine();   
    this.drawAllPoints();
    this.drawExpectedGuessedDivisionLine();  
  }

  private trainPerceptorWithAllPoints() {
    this.points.map((point:Point)=>{
      const currentPredicatedValue = this.perceptron.doTrain(point.getInputsForPerceptorToGuess(), point.getTrueValue());  
      point.setPredicatedValue(currentPredicatedValue);
    });  
 
  }

  private trainPerceptorAndRepaintAllPoints = () => { 
    this.trainPerceptorWithAllPoints();
    this.redrawCanvas();
  }

  private createPoints(howMany:number, canvas: Canvas):Point[] {
    const points:Point[] = [];
    for(let i=0;i<howMany;i++) {
      const point: Point = new Point(canvas, this.functionForLine);
      
      point.drawPointOnCanvas();
      points.push(point);
    }
    return points;
  }
  private functionForLine = (x: number): number => {
    return this.lineWeightForX*x + this.lineWeightForY;
  }  

  private guessfunctionFromPerceptronFromWeights(x: number): number {
    const [w0,w1,w2] = this.perceptron.weights;   
    return -(w2/w1) - (w0/w1) * x;

  }
  private drawDivisionLine() {
    const start: Coordinate = new Coordinate(-1, this.functionForLine(-1));
    const end: Coordinate = new Coordinate(1, this.functionForLine(1));
    this.canvas.drawLine(start, end, 'orange');
  }

  private drawCardesianLines() {
    const start: Coordinate = new Coordinate(-1, 0);
    const end: Coordinate = new Coordinate(1, 0);
    this.canvas.drawLine(start, end, '#DDD');
 
    const start2: Coordinate = new Coordinate(0,1);
    const end2: Coordinate = new Coordinate(0, -1);
    this.canvas.drawLine(start2, end2, '#DDD');
  }

  private clearCanvas() {
    this.canvas.clearCanvas();
  }

  private drawExpectedGuessedDivisionLine() { 
    const start: Coordinate = new Coordinate(-1,this.guessfunctionFromPerceptronFromWeights(-1));
    const end: Coordinate = new Coordinate(1,this.guessfunctionFromPerceptronFromWeights(1));
    this.canvas.drawLine(start, end, 'black');
  }
  
  render() {
    return (
      <div className="App">
        <h1>This is demo describing perceptron</h1>
        <h3>Points below line should have a value -1 and abowe should have value 1</h3>
        <h4>If the prefiction of the perceptron is false, then point will have red color, otherwise will be green</h4>
        <h4>Division line is for {this.functionForLine.toString()}</h4>
        <h4>orange is division line, black is the expected line</h4>        
        <canvas 
          id="myCanvas" 
          width={this.canvas.getDimentions().width} 
          height={this.canvas.getDimentions().height} 
          ref={this.canvas.getReference()}
        ></canvas>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));

