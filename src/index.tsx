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
  private static readonly NUMBER_OF_POINTS = 1500; 
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
    console.log('const');  
  }

  componentDidMount() {    
    this.clearCanvas();
    this.drawCardesianLines();
    this.drawDivisionLine();   
    this.drawAllPoints(false);    
  }

  private drawAllPoints(paintPoints: boolean): void {
    this.points.map((point:Point)=>{
      point.drawPointOnCanvas(paintPoints);    
    });    
  }

  private redrawCanvas() {
    console.log('redraw');  
    this.clearCanvas();
    this.drawCardesianLines();
    this.drawDivisionLine();       
    this.drawAllPoints(true);
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
      
      point.drawPointOnCanvas(false);
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

  private animateTrainingFor10Seconds = () => {
    const train = this.trainPerceptorAndRepaintAllPoints;
    const interval = setInterval(train,300);
    setTimeout(()=> { clearInterval(interval); }, 10000);
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
        <h1>This is a demo project describing how perceptron in Neural Networks works</h1>
        <p>This project is written in React and TypeScript.<br/><br/>
          <b>What is this demo doing:</b><br/>
          There are many points on the canvas. Some of them have positive value and some negative value.<br/> Value of each perceptron depends whether its position is above or below a yellow line.<br/><br/>
          We are going to train exactly 1 perceptron for about 10 seconds. <br/>Task of this perceptron is to find whether point has positive or negative value. <br/>
        </p>
          <ul>
            <li style={{"color":"#777"}}>Initially points have all grey color</li>            
            <li style={{"color":"green"}}>When perceptron correctly finds that point has positive value, color of the point will change to green.</li>
            <li style={{"color":"red"}}>When the perceptron finds that the point has a negative value, color of the point will change to red.</li>          
          </ul> 
        <p>
          Black line will describe what perceptron thinks (where could be the yellow line).
          Click start button to begin the training
        </p>
        <button onClick={this.animateTrainingFor10Seconds}>Start the training</button>          
        <br/><br/>
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

