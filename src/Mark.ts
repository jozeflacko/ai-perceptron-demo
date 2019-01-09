export default class Mark {
    private x:number; 

    constructor(x: number) {
        //if(-1 <= x && x <= 1) {
            this.x = x;
        //} else {
            //throw new Error('Is not a valid Mark');
        //}         
    }
    public get(): number {
        return this.x;
    }
}