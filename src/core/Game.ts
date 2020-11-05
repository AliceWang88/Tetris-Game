import { SquareGroup } from "./SquareGroup";
import { createSquareGroup } from "./SquareGroupMaker";
import { Square } from "./Square";
import { GameStatus, IGroupShow, Direction } from "./types";
import TerisConfig from "./viewer/TerisConfig";
import { SquareGroupPageShow } from "./viewer/SquareGroupPageShow";
import { MoveRules } from "./moveRules";

export class Game {
    private _curTeris: SquareGroup = createSquareGroup({ x: 0, y: 0 });  // 当前方块
    private _nextTeris: SquareGroup = createSquareGroup({ x: 0, y: 0 });  // 下一个方块
    private _score: number = 0;             //  分数
    private _level: number = TerisConfig.levels[0].level;            //  游戏等级
    private _existsSquares: Square[] = [];  //  界面上所有的方块
    private _gameStatus: GameStatus = GameStatus.init;    //  游戏状态
    private _viewer?: IGroupShow = new SquareGroupPageShow();
    private _timer?: number;
    private _duration: number = TerisConfig.levels[0].duration;

    get level() {
        return this._level;
    }

    set level(val) {
        this._level = val;
        if (this._viewer) {
            this._viewer.levelChange(val.toString());
        }
    }

    get score() {
        return this._score;
    }

    set score(val) {
        this._score = val;
        // 更新分数界面
        if (this._viewer) {
            this._viewer.scoreChange(val.toString());
        }
        // 判断等级及变速
        const level = TerisConfig.levels.filter(l => val >= l.score).pop();
        if (level && level.level > this._level) {
            this.level = level.level;
            this._duration = level.duration;
        }
    }

    get existsSquares() {
        return this._existsSquares;
    }

    get curTeris() {
        return this._curTeris;
    }

    get gameStatus() {
        return this._gameStatus;
    }

    constructor() {
        // 初始化游戏
        this._init();
        if (this._viewer) {
            this._viewer.init(this);
        }
    }

    private _init() {
        this._gameStatus = GameStatus.init;
        this._score = 0;
        this._level = TerisConfig.levels[0].level;
        this._existsSquares.forEach(sq => {
            if (sq.view) {
                sq.view.remove();
            }
        })
        this._existsSquares = [];

        // 显示
        if (this._viewer) {
            this._viewer.show(undefined, this._nextTeris)
        }
        // 设置中心点位置到合适显示位置
        this._setCenterPoint(TerisConfig.panel.width, this._curTeris);   // 如果显示的还是不够正中，可以切换方块组的中心点
        this._setCenterPoint(TerisConfig.next.width, this._nextTeris);
    }

    private _setCenterPoint(width: number, squareGroup: SquareGroup) {
        let minY: number = 0;
        squareGroup.positionArr.forEach(p => {
            if (p.y < minY) {
                minY = p.y;
            }
        });
        squareGroup.centerPoint = {
            x: Math.ceil(width / 2) - 1,
            y: -minY,
        }
    }

    start() {
        if (this._gameStatus === GameStatus.playing) {
            return;
        }
        if (this._gameStatus === GameStatus.over) {
            this._init();
        }
        if (this._gameStatus === GameStatus.init) {
            if (this._viewer) {
                this._viewer.show(this._curTeris);
            }
        }
        if (this._viewer) {
            this._viewer.gameStart();
        }
        this._gameStatus = GameStatus.playing;
        this.autoDown();
    }

    pause() {
        this._clearTimer();
        if (this._viewer) {
            this._viewer.gamePause();
        }
        this._gameStatus = GameStatus.pause;
    }

    autoDown() {
        if (this._gameStatus !== GameStatus.playing || this._timer) {
            return;
        }
        this._timer = setInterval(() => {     //  把@types node 删除 不报错
            const res = MoveRules.move(this._curTeris, Direction.down, this._existsSquares);
            if (!res) {
                // 不能移动
                // 清除定时器
                this._clearTimer();
                // 触底
                this._touchEnd();
                // 切换方块
                this._switch();
            }

        }, this._duration)
    }

    downDirectly() {
        if (this._gameStatus !== GameStatus.playing) {
            return;
        }
        this._clearTimer();
        const res = MoveRules.moveDirectly(this._curTeris, Direction.down, this._existsSquares);
        if (res) {
            // 触底
            this._touchEnd();
            // 切换方块
            this._switch();
        }
    }

    toLeft() {
        if (this._gameStatus === GameStatus.playing) {
            MoveRules.move(this._curTeris, Direction.left, this._existsSquares);
        }
    }

    toRight() {
        if (this._gameStatus === GameStatus.playing) {
            MoveRules.move(this._curTeris, Direction.right, this._existsSquares);
        }
    }

    rotate() {
        if (this._gameStatus === GameStatus.playing) {
            MoveRules.rotate(this._curTeris, this._existsSquares);
        }
    }

    // 清除定时器
    private _clearTimer() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    // 触底
    private _touchEnd() {
        // 保存界面上的方块
        this._existsSquares = this._existsSquares.concat(this._curTeris.squareArr);
        // 得到可消除的行数组
        const yArr = MoveRules.getYarrToclearBlocks(this._existsSquares);
        if (yArr.length === 0) {
            return;
        }
        // 进行数据消块
        this._dataClearSquare(yArr);
        // 计分
        this._setScores(yArr.length);
    }

    /**
     * 数据清除y行上的所有方块，特定方块更新y坐标
     * @param yArr 可消除行数组
     */
    private _dataClearSquare(yArr: number[]) {
        yArr.forEach(y => {
            this._existsSquares = this._existsSquares.filter(sq => sq.point.y !== y);
            this._existsSquares.map(sq => {
                if (sq.point.y < y) {
                    sq.point = {
                        x: sq.point.x,
                        y: sq.point.y + 1,
                    }
                }
            })
        })
    }

    /**
     * 计分
     * @param num 消除的行数量
     */
    private _setScores(num: number) {
        this.score += num * 10 + (num - 1) * 10;
    }

    private _switch() {
        this._curTeris = this._nextTeris;
        // 清除next的界面显示
        if (this._viewer) {
            this._viewer.remove(this._nextTeris)
        }
        // 生成新的next方块
        this._nextTeris = createSquareGroup({ x: 0, y: 0 })
        // 调整中心点位置
        this._setCenterPoint(TerisConfig.panel.width, this._curTeris);   // 如果显示的还是不够正中，可以更换方块组的中心点
        this._setCenterPoint(TerisConfig.next.width, this._nextTeris);
        const res = MoveRules.canMove(this._curTeris.positionArr, this._curTeris.centerPoint, this._existsSquares);
        if (!res) {
            // 结束
            this._gameStatus = GameStatus.over;
            if (this._viewer) {
                this._viewer.gameOver();
            }
            return;
        }
        // 显示2个方块
        if (this._viewer) {
            this._viewer.show(this._curTeris, this._nextTeris)
        }
        // 自动下落
        this.autoDown();
    }

}