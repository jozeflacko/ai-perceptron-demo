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
    this.canvas = new Canvas(React.createRef<HTMLCanvasElement>(), 640, 640); // size of the canvas is 640x640
    this.setRandomInitialWeightsForFunctionLine();
    this.perceptron = new Perceptron(Main.NUMBER_OF_WEIGHTS);  // we will have only 1 perceptron
    this.points = this.createPoints(Main.NUMBER_OF_POINTS, this.canvas);    
  }

  componentDidMount() {    
    this.redrawCanvas();
    this.animateTrainingFor10Seconds();
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
    const grey = '#DDD';
    const start: Coordinate = new Coordinate(-1, 0);
    const end: Coordinate = new Coordinate(1, 0);
    this.canvas.drawLine(start, end, grey);
 
    const start2: Coordinate = new Coordinate(0,1);
    const end2: Coordinate = new Coordinate(0, -1);
    this.canvas.drawLine(start2, end2, grey);
  }

  private clearCanvas() {
    this.canvas.clearCanvas();
  }

  private drawExpectedGuessedDivisionLine() { 
    const start: Coordinate = new Coordinate(-1,this.guessfunctionFromPerceptronFromWeights(-1));
    const end: Coordinate = new Coordinate(1,this.guessfunctionFromPerceptronFromWeights(1));
    this.canvas.drawLine(start, end, 'black');
  }

  private animateTrainingFor10Seconds() {
    const train = this.trainPerceptorAndRepaintAllPoints;
    const interval = setInterval(train,300);
    setTimeout(()=> { clearInterval(interval); },10000);
  }

  private setRandomInitialWeightsForFunctionLine(): void {
    this.lineWeightForX = math.getRandomFloat(-0.9,0.9);
    if(this.lineWeightForX === 0) {
      this.lineWeightForX = 0.3;
    }
    this.lineWeightForY = math.getRandomFloat(-0.9,0.9);
    if(this.lineWeightForY === 0) {
      this.lineWeightForY = 0.3;
    }
  }
  
  render() {
    return (
      <div className="App">
        <h1>This is demo describing how a perceptron in neural networks work</h1>
        <p>There are many point on the canvas. Some of them have positive value and some negative.
          Value depends whether a point is above or below a yellow random line crossing the canvas.
        </p>
        <p>
          We are going to train a perceptron to find out when the value of the point is positive and when not. 
          Points at the begining are grey. 
          <ul>
            <li>When perceptron correctly finds out that point had positive value, then 
          the color of the point will be green.</li>  
            <li>When the perceptring finds out that the point has a negative value,
           then the color will be red.  </li>  
          </ul> 
          <p>Black line is showing what perceptron thinks (that where could be the yellow line).
            Training will last 10 seconds
          </p>
        </p>  
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

