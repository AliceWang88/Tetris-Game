import { SquareGroup } from "./SquareGroup";
import { Square } from "./Square";
import { IPoint, Direction, isIPoint } from "./types";
import TerisConfig from "./viewer/TerisConfig";

export class MoveRules {

    /**
     * 是否能移动
     * @param squareGroup 
     * @param targetPoint  即是中心点
     * @param existSquares 界面上已经有的方块们
     */
    static canMove(positionArr: IPoint[], targetPoint: IPoint, existSquares: Square[]) {
        let pointsArr: IPoint[] = [];
        positionArr.forEach(p => {
            pointsArr.push({
                x: p.x + targetPoint.x,
                y: p.y + targetPoint.y,
            })
        })
        // 判断 是否有点超出边界 true:超出了
        let result = pointsArr.some(p => {
            return p.x < 0 || p.x >= TerisConfig.panel.width || p.y < 0 || p.y >= TerisConfig.panel.height;
        })

        if (result) {
            return false;  // 不能移动
        }

        // 判断 是否和现有方块重叠
        result = pointsArr.some(p => {
            return existSquares.some(sq => {
                return sq.point.x === p.x && sq.point.y === p.y;
            })
        })
        if (result) {
            return false;
        }

        return true;
    }
    static move(squareGroup: SquareGroup, targetPoint: IPoint, existSquares: Square[]): boolean;
    static move(squareGroup: SquareGroup, direction: Direction, existSquares: Square[]): boolean;
    static move(squareGroup: SquareGroup, targetPointOrDirection: IPoint | Direction, existSquares: Square[]): boolean {
        // 判断第2参数是否是IPoint类型
        if (isIPoint(targetPointOrDirection)) {
            const result = this.canMove(squareGroup.positionArr, targetPointOrDirection, existSquares);
            if (result) {
                // 可以移动
                squareGroup.centerPoint = targetPointOrDirection;
                return true;  // 移动成功
            }
            return false;
        } else {
            let direction = targetPointOrDirection;
            let targetPoint: IPoint;

            if (direction === Direction.down) {
                targetPoint = {
                    x: squareGroup.centerPoint.x,
                    y: squareGroup.centerPoint.y + 1,
                }
            } else if (direction === Direction.left) {
                targetPoint = {
                    x: squareGroup.centerPoint.x - 1,
                    y: squareGroup.centerPoint.y,
                }
            } else {
                targetPoint = {
                    x: squareGroup.centerPoint.x + 1,
                    y: squareGroup.centerPoint.y,
                }
            }
            return this.move(squareGroup, targetPoint, existSquares);
        }
    }

    /**
     * 移动到底
     * @param squareGroup 
     * @param direction 
     */
    static moveDirectly(squareGroup: SquareGroup, direction: Direction, existSquares: Square[]) {
        while (this.move(squareGroup, direction, existSquares)) { }
        return true;
    }


    static rotate(squareGroup: SquareGroup, existSquares: Square[]) {
        const newPositionArr = squareGroup.getRotatePosition();
        const res = this.canMove(newPositionArr, squareGroup.centerPoint, existSquares);
        if (res) {
            // 能移动
            squareGroup.rotate();
            return true;
        }
        return false;
    }

    static getYarrToclearBlocks(existSquares: Square[]) {
        // 所有y数组
        const arr = existSquares.map(sq => sq.point.y);
        // 最小y
        const minY = Math.min(...arr);
        // 最大y
        const maxY = Math.max(...arr);
        let yArr: number[] = [];
        // 循环判断该y行方块的数量 和 界面宽的格子数 对比
        for (let y = minY; y <= maxY; y++) {
            const length = arr.filter(it => it === y).length;
            if (length === TerisConfig.panel.width) {
                // 可以消除
                // 进行界面消除
                this.deleteYsquares(existSquares,y)
                // 记录
                yArr.push(y);
            }
        }
        return yArr;
    }

    /**
     * 界面消除y行上的方块
     * @param existSquares 
     * @param y 
     */
    private static deleteYsquares (existSquares: Square[],y:number) {
        const ySquares = existSquares.filter(sq=>sq.point.y === y);
        ySquares.forEach(sq=>{
            if(sq.view){
                sq.view.remove();  
            }
        })
    }
}