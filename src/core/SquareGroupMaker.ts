import { SquareGroup } from "./SquareGroup";
import { IPoint } from "./types";
import { getRandom } from "./utils";

export class TShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }], _centerPoint, _color)
    }
}
export class TShapeMirror extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }], _centerPoint, _color)
    }
}
export class ZShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], _centerPoint, _color)
    }
    // 重写rotate方法
    rotate(){
        super.rotate();
        this.rotateClock = !this.rotateClock;
    }
}
export class ZShapeMirror extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }], _centerPoint, _color)
    }

    // 重写rotate方法
    rotate(){
        super.rotate();
        this.rotateClock = !this.rotateClock;
    }
}
export class OShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], _centerPoint, _color)
    }
    // 重写rotate方法
    rotate(){
        return;
    }
}
export class LineShapeV extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }], _centerPoint, _color)
    }
    // 重写rotate方法
    rotate(){
        super.rotate();
        this.rotateClock = !this.rotateClock;
    }
}
export class LineShapeH extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], _centerPoint, _color)
    }

    // 重写rotate方法
    rotate(){
        super.rotate();
        this.rotateClock = !this.rotateClock;
    }
}
export class LShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }], _centerPoint, _color)
    }
}
export class LShapeOpposite extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string,
    ) {
        super([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }], _centerPoint, _color)
    }
}

export const shapeArr = [
    TShape,
    TShapeMirror,
    ZShape,
    ZShapeMirror,
    OShape,
    LineShapeV,
    LineShapeH,
    LShape,
    LShapeOpposite,
]

export const colorArr = [
    "red",
    "blue",
    "pink",
    "green",
    "orange",
    "white",
    "yellow"
]


export function createSquareGroup (centerPoint:IPoint) {
    let index = getRandom(0,shapeArr.length);
    const shape = shapeArr[index];
    index = getRandom(0,colorArr.length);
    const color = colorArr[index];
    return new shape(centerPoint,color);
}