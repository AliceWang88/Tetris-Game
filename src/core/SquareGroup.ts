import { Square } from "./Square";
import { IPoint } from "./types";
import { SquarePageShow } from "./viewer/SquarePageShow";
import $ from 'jquery';


export class SquareGroup {
    private _squareArr: Square[] = [];  // 方块组所有方块对象

    constructor(
        private _positionArr: IPoint[],   // 相对中心点位置数组
        private _centerPoint: IPoint,     // 中心点
        private _color: string            //  方块颜色
    ) {
        this._createSquares();  // 创建方块
    }

    get squareArr () {
        return this._squareArr;
    }

    get centerPoint() {
        return this._centerPoint;
    }

    set centerPoint(val) {
        this._centerPoint = val;
        this._setPoints();  //  更新每个方块的点坐标
    }

    get positionArr () {
        return this._positionArr;
    }

    set positionArr (val) {
        this._positionArr = val;
        // this._setPoints();  //  更新square点坐标
    }

    // 根据：中心点、相对位置数组positionArr   更新每个方块的点坐标
    private _setPoints () {
        this._positionArr.forEach((p,index) => {
            this._squareArr[index].point = {
                x: p.x + this._centerPoint.x,
                y: p.y + this._centerPoint.y,
            }
        })
    }

    // 创建方块
    private _createSquares() {
        this._positionArr.forEach(p => {
            const sq = new Square();
            sq.color = this._color;
            sq.point = {
                x: p.x + this._centerPoint.x,
                y: p.y + this._centerPoint.y,
            }
            this._squareArr.push(sq);
        })
    }

    protected rotateClock = true;  // 默认 顺时针旋转

    // 根据旋转方向，获得旋转后的点坐标
    getRotatePosition () {
        let newShape:IPoint[] = [];
        if(this.rotateClock){
            // 顺时针
            this._positionArr.forEach(p=>{
                newShape.push({
                    x:-p.y,
                    y:p.x,
                })
            })
        } else {
            // 逆时针
            this._positionArr.forEach(p=>{
                newShape.push({
                    x:p.y,
                    y:-p.x,
                })
            })
        }
        return newShape;
    }

    rotate () {
      this._positionArr =  this.getRotatePosition();
      this._setPoints();
    }
}
