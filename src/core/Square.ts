import { IPoint, IShow } from "./types";

export class Square {
    private _point: IPoint = { x: 0, y: 0 };
    private _color: string = '';
    private _view?: IShow;

    get point() {
        return this._point;
    }

    set point(val) {
        this._point = val;
        // 点坐标一变，重新显示
        if (this._view) {
            this._view.show();
        }
    }

    get color() {
        return this._color;
    }

    set color(val) {
        this._color = val;
    }

    get view() {
        return this._view;
    }

    set view(val) {
        this._view = val;
        // 显示方式一变，重新显示
        if (this._view) {
            this._view.show();
        }
    }
}