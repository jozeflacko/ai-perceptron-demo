import Mark from './Mark';

export default class Coordinate {
    private x:Mark;
    private y:Mark;    

    constructor(x: number, y:number) {
        this.x = new Mark(x); 
        this.y = new Mark(y); 
    }
    public getXMark(): Mark {
        return this.x;
    }
    public getYMark(): Mark {
        return this.y;
    }
    public getX(): number {
        return this.x.get();
    }
    public getY(): number {
        return this.y.get();
    }
}