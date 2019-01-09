import {cutDecimalsFromNumber} from './utils';
import Coordinate from './Coordinate';
import Mark from './Mark';

export interface CanvasDimentions {
    width: number;
    height: number;    
}

export default class Canvas {
    private canvasReference: React.RefObject<HTMLCanvasElement>;
    private width: number = 0;
    private height: number = 0;
    
    constructor(canvasReference:React.RefObject<HTMLCanvasElement>, width:number, height:number) {
        this.canvasReference = canvasReference;
        this.width = width;
        this.height = height;
    }

    getDimentions(): CanvasDimentions {
        const dimentions: CanvasDimentions = {
            width:this.width,
            height: this.height
        };
        return dimentions;        
    }

    getObject(): HTMLCanvasElement|null {
        return this.canvasReference.current;
    }

    getReference(): React.RefObject<HTMLCanvasElement>{
        return this.canvasReference;
    }

    drawLine(start:Coordinate, end:Coordinate, color: string): void {
        const c = this.getObject();
        if(c) {
          var ctx = c.getContext("2d");
          if(ctx) {
            ctx.beginPath();

            const x1 = this.mapXCardesianToCanvas(start.getXMark());
            const y1 = this.mapYCardesianToCanvas(start.getYMark());
            ctx.moveTo(x1, y1);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineTo(
                this.mapXCardesianToCanvas(end.getXMark()),
                this.mapYCardesianToCanvas(end.getYMark())
            );
            ctx.stroke();
          }
        }
    }
    drawDot(coordinate: Coordinate, color:string):void {    
        const borderColor: string = "white";
        const radius: number = 5;
        
        const canvasObject = this.getObject();   
        if(canvasObject) {
            const context = canvasObject.getContext("2d");
            if(context) {
                context.beginPath();                
                const coords = this.mapCardesianCoordinateToCanvas(coordinate);
                context.arc(coords.x, coords.y, radius, 0, 2 * Math.PI);
                context.fillStyle = color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = borderColor;
                context.stroke();
            }
        }
       
    }
    private mapCardesianCoordinateToCanvas(coordinate: Coordinate): { x:number, y:number} {
        return {
            x: this.mapXCardesianToCanvas(coordinate.getXMark()),
            y: this.mapYCardesianToCanvas(coordinate.getYMark())
        }
    }

    public clearCanvas(): void {
        const canvas = this.getObject();
        if(canvas) {
            const context = canvas.getContext('2d');
            if(context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    private mapXCardesianToCanvas(xMark: Mark): number {
        const x = xMark.get();     
        const halfWidth = this.getDimentions().width / 2;   
        const result = cutDecimalsFromNumber((x*halfWidth/1) + halfWidth,0);
        
        return result;
    }

    public mapYCardesianToCanvas(yMark: Mark): number {
        const y = yMark.get();
        const halfHeight = this.getDimentions().height / 2; 
        const result = (this.getDimentions().height - cutDecimalsFromNumber((y*halfHeight/1) + halfHeight,0));
        
        return result;
    }
}