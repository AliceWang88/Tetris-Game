import { IGroupShow, GameStatus } from "../types";
import { SquareGroup } from "../SquareGroup";
import $ from 'jquery';
import { SquarePageShow } from "./SquarePageShow";
import TerisConfig from "./TerisConfig";
import { Game } from "../Game";
import { MoveRules } from "../moveRules";


export class SquareGroupPageShow implements IGroupShow {
    private _panel = $("#panel");
    private _next = $("#next");
    private _modal = $("#modal");
    private _score = $("#score");
    private _level = $("#level");

    show(curTeris?: SquareGroup, nextTeris?: SquareGroup): void {
        if (curTeris) {
            curTeris.squareArr.forEach(sq => {
                sq.view = new SquarePageShow(sq,this._panel);
            })
        }
        if (nextTeris) {
            nextTeris.squareArr.forEach(sq => {
                sq.view = new SquarePageShow(sq,this._next);
            })
        }
    }

    /**
     * 清除next方块的界面显示
     * @param nextTeris 
     */
    remove( nextTeris: SquareGroup){
        nextTeris.squareArr.forEach(sq => {
            if(sq.view){
                sq.view.remove();
            } 
        })
    }

    init(game:Game){
        this._panel.css({
            width:TerisConfig.panel.width * TerisConfig.teris.width,
            height:TerisConfig.panel.height * TerisConfig.teris.height,
        })
        this._next.css({
            width:TerisConfig.next.width * TerisConfig.teris.width,
            height:TerisConfig.next.height * TerisConfig.teris.height,
        })

        // 键盘事件
        $(document).keydown(e=>{
            if(e.keyCode === 32){
                if(game.gameStatus === GameStatus.playing){
                    game.pause();
                } else {
                    game.start();
                }
                // 开始 暂停
            } else if (e.keyCode === 37){
                // 左
                game.toLeft();
            } else if (e.keyCode === 38){
                // 旋转
                game.rotate();
            } else if (e.keyCode === 39){
                // 右
                game.toRight();
            }else if (e.keyCode === 40){
                // 下
                game.downDirectly();
            }
        })
    }

    gameOver(){
        this._modal.css({
            display:'flex',
        })
        this._modal.html('游戏结束')
    }

    gameStart(){
        this._modal.css({
            display:'none',
        })
    }

    gamePause(){
        this._modal.css({
            display:'flex',
        })
        this._modal.html('游戏暂停')
    }

    scoreChange (val:string) {
        this._score.html(val);
    }

    levelChange(val:string){
        this._level.html('level'+val);
    }
}