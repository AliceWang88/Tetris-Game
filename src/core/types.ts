import { SquareGroup } from "./SquareGroup";
import { Game } from "./Game";

export interface IPoint {
   readonly x:number,
   readonly y:number
}

export function isIPoint (obj:any): obj is IPoint{
    if(typeof (obj as IPoint).x === 'number'){   // ！判断方式
        return true;
    }
    return false;
}

export interface IShow {
    show:()=>void
    remove:()=>void
}

export interface IGroupShow {
    show(curTeris?:SquareGroup,nextTeris?:SquareGroup):void,
    remove(nextTeris:SquareGroup):void,
    init(game:Game):void,
    gameOver():void,
    gameStart():void,
    gamePause():void,
    scoreChange(score:string):void,
    levelChange(level:string):void,
}

export enum Direction {
    "down",
    "left",
    "right"
}

export enum GameStatus {
    "init",
    "playing",
    "pause",
    "over"
}