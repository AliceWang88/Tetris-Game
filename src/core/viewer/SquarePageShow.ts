import { IShow } from "../types";
import { Square } from "../Square";
import $ from 'jquery'
import TerisConfig from "./TerisConfig";

export class SquarePageShow implements IShow {
    constructor (
        private _sq:Square,
        private _container:JQuery<HTMLElement>
    ){}

    private _dom?:JQuery<HTMLElement>
    private _isRemove:boolean = false; // 默认没有移除过

    show() {
        if(this._isRemove){
            return;
        }
        if(!this._dom){
            this._dom = $("<div>").css({
                position:'absolute',
                width:TerisConfig.teris.width,
                height:TerisConfig.teris.height,
                border:TerisConfig.teris.border,
                boxSizing:'border-box',
            }).appendTo(this._container)
        }
        // 会变化的数据
        this._dom.css({
            left:this._sq.point.x * TerisConfig.teris.width,
            top:this._sq.point.y * TerisConfig.teris.height,
            background:this._sq.color,
        })
    };
    remove(){
        if(this._dom && !this._isRemove){
            this._isRemove = true;  // 移除
            this._dom.remove();     // 界面
            this._dom = undefined;  // 数据
        }
    };

}