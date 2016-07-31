/**
 * handyGraphic.js v1.0.0
 * Copyright (c) 2016 kengo92i
 */
(function(global) {

    "use strict";

    var document = global.document;
    /**
     * グラフィックスライブラリ HandyGraphic.js
     *
     * 基本的に，各APIのサンプルコードは以下のテンプレートを前提にしています．
     * また，動作に必要な変数宣言などを省略している場合もあるので，ご了承ください．
     *
     * ```
     * handyGraphic.globalize(); // handyGraphic.jsをグローバル展開する
     * window.onload = function () {
     *   var Hg = new Graphic(); // Graphicオブジェクトを作成する
     *   var win = Hg.Open(400, 400); // 描画するウィンドウを作成する
     *
     *   // 以降に処理を書いていきます．
     *   // 図形の描画，Scene，Spriteの作成など
     * }
     * ```
     *
     * @module handyGraphic
     */
    var handyGraphic = handyGraphic || {};

    /**
     * handyGraphic.js をグローバル領域に展開．
     * 
     * 各オブジェクトをグローバル領域に展開することで，名前空間の指定を省くことができます．
     * ただし，各オブジェクト名がグローバル空間内で使用されていないことが前提です．
     *
     * @class globalize
     * @constructor
     * @namespace handyGraphic
     *
     * @example
     * ```
     * // globalize を実行しない
     * var Hg = new handyGraphic.Graphic();
     * var win = new handyGraohic.Window(300, 300);
     * var scene1 = new handyGraphic.Scene();
     *
     * // グローバル領域に展開
     * handyGraphic.globalize();
     * var Hg = new Graphic();
     * var win = new Window(300, 300);
     * var scene1 = new Scene();
     * ```
     */
    var globalize = function () {
        for (var key in handyGraphic) {
            if (key == "globalize") { continue; }
            global[key] = handyGraphic[key];
        }
    };

    // 座標変換用
    var transOriginY = function (win, y) {
        return win.getHeight() - y;
    };

    /**
     * Window オブジェクトは，ウィンドウのインスタンスです．
     * 描画処理に代表される画面に見える処理は，実際のところ Window オブジェクトに対して行われています．
     * Window オブジェクトの作成は，Graphic オブジェクトの Open，WOpen メソッドを用いて作成することがベストプラクティスです．
     *
     * また，1つのWebページに複数のウィンドウを作成することもできます．
     * その場合は Window オブジェクトを表示する画面の数だけ作成する必要があります．
     *
     * @class Window
     * @constructor
     * @namespace handyGraphic
     * @param {Number} w ウィンドウの幅
     * @param {Number} h ウィンドウの高さ
     * @param {Number} id Canvasのid
     */
    var Window = function (w, h, canvasId) {
        canvasId = canvasId || 'canvas';
        /**
         * canvasIdで指定されたcanvasオブジェクト
         * canvasIdを指定しない場合は，'#canvas'が指定されたものとする．
         * @property canvas
         * @type {Canvas}
         */
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = w;
        this.canvas.height = h;
        /**
         * canvasの2Dコンテキスト
         * @property ctx
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.canvas.getContext('2d');
    };
    /**
     * ウィンドウの幅を取得する
     *
     * @method getWidth
     * @return {Number} ウィンドウの幅
     */
    Window.prototype.getWidth = function () {
        return this.canvas.width;
    };
    /**
     * ウィンドウの高さを取得する
     *
     * @method getHeight
     * @return {Number} ウィンドウの高さ
     */
    Window.prototype.getHeight = function () {
        return this.canvas.height;
    };
    /**
     * 描画するための2Dレンダリングコンテキストを取得する
     *
     * @method getContext2d
     * @return {CanvasRenderingContext2D} 2Dレンダリングコンテキスト
     */
    Window.prototype.getContext2d = function () {
        return this.ctx;
    };


    /**
     * Graphic オブジェクトは基本的な図形の描画，文字の表示，描画設定の変更などをサポートしています．
     *
     * Graphic オブジェクトの各機能は C言語版 Handy Graphic の描画機能を参考にしています．
     * 変数名を Hg とすることで，C言語版の関数名と同じように扱うことができます．
     * また，一部のメソッドは仕様が変わっているものもあるので，APIドキュメントを随時参照してください．
     *
     * ウィンドウを指定して描画を行う場合は，WLine，WCircleなどを使用します．
     * ウィンドウは，Open，WOpen メソッドを使用することで作成することができます．
     * Open メソッドは実行するたびにカレントウィンドウが変更されることに注意してください．
     * カレントウィンドウとは，ウィンドウを指定せずに描画メソッドを実行した場合に描画が行われるウィンドウです．
     *
     * @class Graphic
     * @constructor
     * @namespace handyGraphic
     * @example
     * ```
     * handyGraphic.globalize(); // handyGraphic.jsをグローバル展開する
     * window.onload = function () {
     *   var Hg = new Graphic(); // Graphicオブジェクトを作成する
     *   var win = Hg.Open(400, 400); // 描画するウィンドウを作成する
     *
     *   Hg.Line(100, 100, 300, 300); // 直線の描画
     *   Hg.Circle(50, 50, 100); // 円の描画
     * }
     * ```
     */
    var Graphic = function () {
        /**
         * 参照しているWindowオブジェクト（カレントウィンドウ）
         * @property win
         * @type {Window}
         */
        this.win = null;
    };
    Graphic.prototype.test = function () {
        console.log("execute Graphic.test()");
    };
    /**
     * 描画するウィンドウを作成する．
     * 実行するたび，参照しているWindowオブジェクト(カレントウィンドウ)が変更される．
     * canvasId を指定しない場合は，#canvasが指定されているものとしてウィンドウを動作します．
     *
     * @method Open
     * @param {Number} w ウィンドウの幅
     * @param {Number} h ウィンドウの高さ
     * @param {String} canvasId canvasのId
     * @return {Window} ウィンドウオブジェクト 
     * @example
     * ```
     * var win1 = Hg.Open(400, 400); // 400x400のウィンドウを作成
     * var win2 = Hg.Open(300, 300, "canvas2"); // カレントウィンドウがwin2に変更される
     * ```
     */
    Graphic.prototype.Open = function (w, h, canvasId) {
        if (w < 0 || h < 0) return null;
        this.win = new handyGraphic.Window(w, h, canvasId);
        return this.win;
    };
    /**
     * 描画する線の太さを変更する．
     * 指定できるのは0より大きい数値のみで，それ以外の値を指定しても無視されます．
     *
     * @method SetWidth
     * @param {Number} t 線の太さを示す数値
     * @example
     * ```
     * Hg.SetWidth(1); // 線の太さを1に指定（デフォルト値）
     * Hg.SetWidth(3); // 線の太さを3に指定
     * ```
     */
    Graphic.prototype.SetWidth = function (t) {
        this.WSetWidth(this.win, t);
    };
    /**
     * 描画する線の色を変更する．
     * いったん色を指定すると，別の色を指定するまで同じ色が使われます．一度も指定しない場合は黒で描画する．
     * colorに指定する色はCSSで指定するフォーマットに対応
     *
     * @method SetColor
     * @param {String} color 線の色を表す文字列
     * @example
     * ```
     * Hg.SetColor("red"); // 色名で指定
     * Hg.SetColor("rgb(192, 80, 77)"); // rgb(r, g, b) 指定
     * Hg.SetColor("#FF0000"); // カラーコード指定
     * Hg.SetColor(Hg.RGB(192, 80, 77); // RGBメソッドを使用
     * ```
     */
    Graphic.prototype.SetColor = function (color) {
        this.WSetColor(this.win, color);
    };
    /**
     * 図形の塗りつぶす色を変更する．
     * colorに指定する色はCSSで指定するフォーマットに対応．
     * 別の色を指定するまで同じ色が使われます．一度も指定しない場合は白で塗りつぶされます．
     *
     * @method SetFillColor
     * @param {String} color 塗りつぶす色を表す文字列
     * @example
     * ```
     * Hg.SetFillColor("red"); // 色名で指定
     * Hg.SetFillColor("rgb(192, 80, 77)"); // rgb(r, g, b) 指定
     * Hg.SetFillColor("#FF0000"); // カラーコード指定
     * Hg.SetFillColor(Hg.RGB(192, 80, 77); // RGBメソッドを使用
     * ```
     */
    Graphic.prototype.SetFillColor = function (color) {
        this.WSetFillColor(this.win, color);
    };
    /**
     * (x0, y0) と (x1, y1) を結ぶ線分を描画．
     * これらの点はウィンドウの外部の点でも構いません．
     *
     * @method Line
     * @param {Number} x0 始点のx座標
     * @param {Number} y0 始点のy座標
     * @param {Number} x1 終点のx座標
     * @param {Number} y0 終点のy座標
     * @example
     * ```
     * Hg.Line(100, 100, 300, 300); // (100, 100) と (300, 300) を結ぶ線分を描画
     * ```
     */
    Graphic.prototype.Line = function (x0, y0, x1, y1) {
        this.WLine(this.win, x0, y0, x1, y1);
    };
    /**
     * 座標(x, y) を中心とした半径rの円を描画．
     * 中心点はウィンドウの外部の点でも構いません．
     *
     * @method Circle
     * @param {Number} x 中心のx座標
     * @param {Number} y 中心のy座標
     * @param {Number} r 半径
     * @example
     * ```
     * Hg.Circle(10, 10, 5); // (10, 10) を中心とした半径5の円を描画
     * ```
     */
    Graphic.prototype.Circle = function (x, y, r) {
        this.WCircle(this.win, x, y, r);
    };
    /**
     * 座標(x, y) を中心とした半径rの塗りつぶされた円を描画．
     * 中心点はウィンドウの外部の点でも構いません．
     *
     * 引数 stroke が 0 の場合は円周を描きません．
     * 0 以外の値(例えば 1)の場合，他の線と同じ太さ，同じ色の線で円周を描きます．
     *
     * @method CircleFill
     * @param {Number} x 中心のx座標
     * @param {Number} y 中心のy座標
     * @param {Number} r 半径
     * @param {Number} stroke 円周を描くかどうか
     * @example
     * ```
     * Hg.CircleFill(10, 10, 5); // (10, 10) を中心とした半径5の塗りつぶされた円を描画
     * Hg.CircleFill(10, 10, 5, 0); // strokeを指定しない or =0 なら円周は描画されない
     * Hg.CircleFill(10, 10, 5, 1); // 円周を描画する
     * ```
     */
    Graphic.prototype.CircleFill = function (x, y, r, stroke) {
        this.WCircleFill(this.win, x, y, r, stroke);
    };
    /**
     * 座標(x, y) を左下隅とする幅w，高さhの長方形を描画．
     * 左下隅の座標ははウィンドウの外部の点でも構いません．
     *
     * @method Box
     * @param {Number} x 左下隅のx座標
     * @param {Number} y 左下隅のy座標
     * @param {Number} w 幅
     * @param {Number} r 高さ
     * @example
     * ```
     * Hg.Box(10, 10, 3, 5); // (10, 10) を左下隅とする幅3，高さ5の長方形を描画
     * ```
     */
    Graphic.prototype.Box = function (x, y, w, h) {
        this.WBox(this.win, x, y, w, h);
    };
    /**
     * 座標(x, y) を左下隅とする幅w，高さhの塗りつぶされた長方形を描画．
     * 左下隅の座標はウィンドウの外部の点でも構いません．
     *
     * 引数 stroke が 0 の場合は周囲に長方形を描きません．
     * 0 以外の値(例えば 1)の場合，他の線図形と同じ太さ，同じ色の線で長方形を描きます．
     *
     * @method BoxFill
     * @param {Number} x 左下隅のx座標
     * @param {Number} y 左下隅のy座標
     * @param {Number} w 幅
     * @param {Number} r 高さ
     * @param {Number} stroke 周囲を描くかどうか
     * @example
     * ```
     * Hg.BoxFill(10, 10, 3, 5); // (10, 10) を左下隅とする幅3，高さ5の塗りつぶされた長方形を描画
     * Hg.BoxFill(10, 10, 3, 5, 0); // strokeを指定しない or =0 なら円周は描画されない
     * Hg.BoxFill(10, 10, 3, 5, 1); // 円周を描画する
     * ```
     */
    Graphic.prototype.BoxFill = function (x, y, w, h, stroke) {
        this.WBoxFill(this.win, x, y, w, h, stroke);
    };
    /**
     * 指定された座標群 x，y を結ぶような多角形を描画．
     * 最初の点と最後の点の間が結ばれます．
     *
     * @method Polygon
     * @param {Number} n 頂点数
     * @param {Array} x x座標の配列
     * @param {Array} y y座標の配列
     * @example
     * ```
     * var x = [x0, x1, x2, x3, x4];
     * var y = [y0, y1, y2, y3, y4];
     *
     * Hg.Polygon(5, x, y);
     * ```
     */
    Graphic.prototype.Polygon = function (n, x, y) {
        this.WPolygon(this.win, n, x, y);
    };
    /**
     * 指定された座標群 x，y を結ぶような塗りつぶされた多角形を描画．
     * 最初の点と最後の点の間が結ばれます．
     *
     * 引数 stroke が 0 の場合は周囲の線を描きません．
     *
     * @method PolygonFill
     * @param {Number} n 頂点数
     * @param {Array} x x座標の配列
     * @param {Array} y y座標の配列
     * @param {Number} stroke 周囲を描くかどうか
     * @example
     * ```
     * var x = [x0, x1, x2, x3, x4];
     * var y = [y0, y1, y2, y3, y4];
     *
     * Hg.PolygonFill(5, x, y); // 円周なし
     * Hg.PolygonFill(5, x, y, 0); // 円周なし
     * Hg.PolygonFill(5, x, y, 1); // 円周あり
     * ```
     */
    Graphic.prototype.PolygonFill = function (n, x, y, stroke) {
       this.WPolygonFill(this.win, n, x, y, stroke); 
    };
    /**
     * 座標(x, y) を中心とした半径rの円について，開始角度 a0 と終了角度 a1 を指定して円弧を描画．
     * 円弧は始点角度から終了角度までを反時計回りに結びます．中心座標はウィンドウの外部でも良い．
     *
     * 角度は， 0 ~ 360 で表される整数を使います．
     *
     * @method Arc
     * @param {Number} x 円弧の中心のx座標
     * @param {Number} y 円弧の中心のy座標
     * @param {Number} r 円弧の半径
     * @param {Number} a0 開始角度
     * @param {Number} a1 終了角度
     * @example
     * ```
     * Hg.Arc(10, 10, 5, 0, 135); 
     * ```
     */
    Graphic.prototype.Arc = function (x, y, r, a0, a1) {
        this.WArc(this.win, x, y, r, a0, a1);
    };
    /**
     * 座標(x, y) を中心とした半径rの円について，開始角度 a0 と終了角度 a1 を指定して扇型の孤を描画．
     * 扇型の弧は始点角度から終了角度までを反時計回りに結びます．中心座標はウィンドウの外部でも良い．
     *
     * 角度は， 0 ~ 360 で表される整数を使います．
     *
     * @method Fan
     * @param {Number} x 弧の中心のx座標
     * @param {Number} y 弧の中心のy座標
     * @param {Number} r 弧の半径
     * @param {Number} a0 開始角度
     * @param {Number} a1 終了角度
     * @example
     * ```
     * Hg.Fan(10, 10, 5, 0, 135); 
     * ```
     */
    Graphic.prototype.Fan = function (x, y, r, a0, a1) {
        this.WFan(this.win, x, y, r, a0, a1);
    };
    /**
     * 座標(x, y) を中心とした半径rの円について，開始角度 a0 と終了角度 a1 を指定して塗りつぶされた扇型を描画．
     * 扇型の弧は始点角度から終了角度までを反時計回りに結びます．中心座標はウィンドウの外部でも良い．
     *
     * 引数 stroke が 0 の場合は周囲の線を描きません．
     * 角度は， 0 ~ 360 で表される整数を使います．
     *
     * @method FanFill
     * @param {Number} x 弧の中心のx座標
     * @param {Number} y 弧の中心のy座標
     * @param {Number} r 弧の半径
     * @param {Number} a0 開始角度
     * @param {Number} a1 終了角度
     * @param {Number} stroke 周囲を描くかどうか
     * @example
     * ```
     * Hg.FanFill(10, 10, 5, 0, 135); // 円周なし
     * Hg.FanFill(10, 10, 5, 0, 135, 0); // 円周なし
     * Hg.FanFill(10, 10, 5, 0, 135, 1); // 円周あり
     * ```
     */
    Graphic.prototype.FanFill = function (x, y, r, a0, a1, stroke) {
        this.WFanFill(this.win, x, y, r, a0, a1, stroke);
    };
    /**
     * 座標(x, y)を左下隅として，指定された文字列を描きます．
     * 左下隅の座標はウィンドウの外部の点でも構いません．
     *
     * @method Text
     * @param {Number} x x座標
     * @param {Number} y y座標
     * @param {String} 表示する文字列
     * @example
     * ```
     * Hg.Text(10, 10, "Hello World");
     * ```
     */
    Graphic.prototype.Text = function (x, y, str) {
        this.WText(this.win, x, y, str);
    };
    /**
     * 文字列を描画する場合のフォントと大きさを指定する．
     * いったん指定されると，別の指定があるまで同じ字体と大きさが使われる．
     *
     * @method SetFont
     * @param {Number} x x座標
     * @param {Number} y y座標
     * @param {String} 表示する文字列
     * @example
     * ```
     * Hg.SetFont("sans-serif", 12);
     * ```
     */
    Graphic.prototype.SetFont = function (font, size) {
        this.WSetFont(this.win, font, size);
    };
    /**
     * ウィンドウ内に書かれたすべての図形や文字を消去する．
     *
     * @method Clear
     * @example
     * ```
     * Hg.Clear(); // ウィンドウの初期化
     * ```
     */
    Graphic.prototype.Clear = function () {
        this.WClear(this.win);
    };
    /**
     * 描画するウィンドウを作成する．Openメソッドと違い，WOpenメソッドはカレントウィンドウが変更されません．
     *
     * @method WOpen
     * @param {Number} w ウィンドウの幅
     * @param {Number} h ウィンドウの高さ
     * @param {String} canvasId canvasのId
     * @return {Window} ウィンドウオブジェクト 
     * @example
     * ```
     * var win1 = Hg.Open(400, 400); // 400x400のウィンドウを作成
     * var win2 = Hg.WOpen(300, 300, "canvas2"); // カレントウィンドウが変更されない
     * ```
     */
    Graphic.prototype.WOpen = function (w, h, canvasId) {
        if (w < 0 || h < 0) return null;
        return new handyGraphic.Window(w, h, canvasId);
    };
    /**
     * 指定したウィンドウの描画する線の太さを変更する
     * 指定できるのは0より大きい数値のみで，それ以外の値を指定しても無視されます．
     *
     * @method WSetWidth
     * @param {Window} win 指定するウィンドウ
     * @param {Number} t 線の太さを示す数値
     * @example
     * ```
     * Hg.WSetWidth(win1, 5); // win1の線の太さを5に指定
     * Hg.WSetWidth(win2, 3); // win2の線の太さを3に指定
     * ```
     */
    Graphic.prototype.WSetWidth = function (win, t) {
        win.ctx.lineWidth = t;
    };
    /**
     * 指定したウィンドウの描画する線の色を変更する
     * いったん色を指定すると，別の色を指定するまで同じ色が使われます．一度も指定しない場合は黒で描画する．
     * colorに指定する色はCSSで指定するフォーマットに対応
     *
     * @method WSetColor
     * @param {Window} win 指定するウィンドウ
     * @param {String} color 線の色を表す文字列
     * @example
     * ```
     * Hg.SetColor(win1, "red"); 
     * Hg.SetColor(win2, Hg.RGB(192, 80, 77);
     * ```
     */
    Graphic.prototype.WSetColor = function (win, color) {
        win.ctx.strokeStyle = color;
    };
    /**
     * 指定したウィンドウの図形の塗りつぶす色を変更する
     * colorに指定する色はCSSで指定するフォーマットに対応
     * 別の色を指定するまで同じ色が使われます．一度も指定しない場合は白で塗りつぶされます．
     *
     * @method WSetFillColor
     * @param {Window} win 指定するウィンドウ
     * @param {String} color 塗りつぶす色を表す文字列
     * @example
     * ```
     * Hg.SetFillColor(win1, "red");
     * Hg.SetFillColor(win2, Hg.RGB(192, 80, 77);
     * ```
     */
    Graphic.prototype.WSetFillColor = function (win, color) {
        win.ctx.fillStyle = color;
    };
    /**
     * 指定したウィンドウに (x0, y0) と (x1, y1) を結ぶ線分を描画．
     * これらの点はウィンドウの外部の点でも構いません．
     *
     * @method WLine
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x0 始点のx座標
     * @param {Number} y0 始点のy座標
     * @param {Number} x1 終点のx座標
     * @param {Number} y0 終点のy座標
     * @example
     * ```
     * Hg.WLine(win1, 100, 100, 300, 300);
     * Hg.WLine(win2, 100, 100, 300, 300);
     * ```
     */
    Graphic.prototype.WLine = function (win, x0, y0, x1, y1) {
        y0 = transOriginY(win, y0);
        y1 = transOriginY(win, y1);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    };
    /**
     * 指定したウィンドウに 座標(x, y) を中心とした半径rの円を描画．
     * 中心点はウィンドウの外部の点でも構いません．
     *
     * @method WCircle
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 中心のx座標
     * @param {Number} y 中心のy座標
     * @param {Number} r 半径
     * @example
     * ```
     * Hg.WCircle(win1, 10, 10, 5);
     * Hg.WCircle(win2, 10, 10, 5);
     * ```
     */
    Graphic.prototype.WCircle = function (win, x, y, r) {
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    };
    /**
     * 指定したウィンドウに 座標(x, y) を中心とした半径rの塗りつぶされた円を描画．
     * 中心点はウィンドウの外部の点でも構いません．
     *
     * 引数 stroke が 0 の場合は円周を描きません．
     * 0 以外の値(例えば 1)の場合，他の線と同じ太さ，同じ色の線で円周を描きます．
     *
     * @method WCircleFill
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 中心のx座標
     * @param {Number} y 中心のy座標
     * @param {Number} r 半径
     * @param {Number} stroke 円周を描くかどうか
     * @example
     * ```
     * Hg.CircleFill(win1, 10, 10, 5);
     * Hg.CircleFill(win2, 10, 10, 5, 0);
     * Hg.CircleFill(win2, 10, 10, 5, 1);
     * ```
     */
    Graphic.prototype.WCircleFill = function (win, x, y, r, stroke) {
        stroke = stroke || 0;
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        if (stroke != 0) {
            ctx.closePath();
            ctx.stroke();
        }
    };
    /**
     * 指定したウィンドウに 座標(x, y) を左下隅とする幅w，高さhの長方形を描画．
     * 左下隅の座標ははウィンドウの外部の点でも構いません．
     *
     * @method WBox
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 左下隅のx座標
     * @param {Number} y 左下隅のy座標
     * @param {Number} w 幅
     * @param {Number} r 高さ
     * @example
     * ```
     * Hg.WBox(win1, 10, 10, 3, 5);
     * Hg.WBox(win2, 10, 10, 3, 5);
     * ```
     */
    Graphic.prototype.WBox = function (win, x, y, w, h) {
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.strokeRect(x, y-h, w, h);
    };
    /**
     * 指定したウィンドウに 座標(x, y) を左下隅とする幅w，高さhの塗りつぶされた長方形を描画．
     * 左下隅の座標はウィンドウの外部の点でも構いません．
     *
     * 引数 stroke が 0 の場合は周囲に長方形を描きません．
     * 0 以外の値(例えば 1)の場合，他の線図形と同じ太さ，同じ色の線で長方形を描きます．
     *
     * @method WBoxFill
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 左下隅のx座標
     * @param {Number} y 左下隅のy座標
     * @param {Number} w 幅
     * @param {Number} r 高さ
     * @param {Number} stroke 周囲を描くかどうか
     * @example
     * ```
     * Hg.WBoxFill(win1, 10, 10, 3, 5);
     * Hg.WBoxFill(win2, 10, 10, 3, 5, 0);
     * Hg.WBoxFill(win2, 10, 10, 3, 5, 1);
     * ```
     */
    Graphic.prototype.WBoxFill = function (win, x, y, w, h, stroke) {
        stroke = stroke || 0;
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.fillRect(x, y-h, w, h);
        if (stroke != 0) {
            ctx.strokeRect(x, y-h, w, h);
        }
    };
    /**
     * 指定したウィンドウに 指定された座標群 x，y を結ぶような多角形を描画．
     * 最初の点と最後の点の間が結ばれます．
     *
     * @method WPolygon
     * @param {Window} win 指定するウィンドウ
     * @param {Number} n 頂点数
     * @param {Array} x x座標の配列
     * @param {Array} y y座標の配列
     * @example
     * ```
     * var x = [x0, x1, x2, x3, x4];
     * var y = [y0, y1, y2, y3, y4];
     *
     * Hg.WPolygon(win1, 5, x, y);
     * Hg.WPolygon(win2, 5, x, y);
     * ```
     */
    Graphic.prototype.WPolygon = function (win, n, x, y) {
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.moveTo(x[0], transOriginY(win, y[0]));
        for (var i = 1; i < n; ++i) {
            ctx.lineTo(x[i], transOriginY(win, y[i])); 
        }
        ctx.closePath();
        ctx.stroke();
    };
    /**
     * 指定したウィンドウに 指定された座標群 x，y を結ぶような塗りつぶされた多角形を描画．
     * 最初の点と最後の点の間が結ばれます．
     *
     * 引数 stroke が 0 の場合は周囲の線を描きません．
     *
     * @method WPolygonFill
     * @param {Window} win 指定するウィンドウ
     * @param {Number} n 頂点数
     * @param {Array} x x座標の配列
     * @param {Array} y y座標の配列
     * @param {Number} stroke 周囲を描くかどうか
     * @example
     * ```
     * var x = [x0, x1, x2, x3, x4];
     * var y = [y0, y1, y2, y3, y4];
     *
     * Hg.WPolygonFill(win1, 5, x, y);
     * Hg.WPolygonFill(win2, 5, x, y, 0);
     * Hg.WPolygonFill(win2, 5, x, y, 1);
     * ```
     */
    Graphic.prototype.WPolygonFill = function (win, n, x, y, stroke) {
        stroke = stroke || 0;
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.moveTo(x[0], transOriginY(win, y[0]));
        for (var i = 1; i < n; ++i) {
            ctx.lineTo(x[i], transOriginY(win, y[i])); 
        }
        ctx.closePath();
        ctx.fill();
        if (stroke != 0) {
            ctx.beginPath();
            ctx.moveTo(x[0], transOriginY(win, y[0]));
            for (var i = 1; i < n; ++i) {
                ctx.lineTo(x[i], transOriginY(win, y[i])); 
            }
            ctx.closePath();
            ctx.stroke();
        }
    };
    /**
     * 指定したウィンドウに 座標(x, y) を中心とした半径rの円について，開始角度 a0 と終了角度 a1 を指定して円弧を描画．
     * 円弧は始点角度から終了角度までを反時計回りに結びます．中心座標はウィンドウの外部でも良い．
     *
     * 角度は， 0 ~ 360 で表される整数を使います．
     *
     * @method WArc
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 円弧の中心のx座標
     * @param {Number} y 円弧の中心のy座標
     * @param {Number} r 円弧の半径
     * @param {Number} a0 開始角度
     * @param {Number} a1 終了角度
     * @example
     * ```
     * Hg.WArc(win1, 10, 10, 5, 0, 135); 
     * Hg.WArc(win2, 10, 10, 5, 0, 135); 
     * ```
     */
    Graphic.prototype.WArc = function (win, x, y, r, a0, a1) {
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.arc(x, y, r, a0 * Math.PI / 180, a1 * Math.PI / 180, true);
        ctx.stroke();
    };
    /**
     * 指定したウィンドウに 座標(x, y) を中心とした半径rの円について，開始角度 a0 と終了角度 a1 を指定して扇型の孤を描画．
     * 扇型の弧は始点角度から終了角度までを反時計回りに結びます．中心座標はウィンドウの外部でも良い．
     *
     * 角度は， 0 ~ 360 で表される整数を使います．
     *
     * @method WFan
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 弧の中心のx座標
     * @param {Number} y 弧の中心のy座標
     * @param {Number} r 弧の半径
     * @param {Number} a0 開始角度
     * @param {Number} a1 終了角度
     * @example
     * ```
     * Hg.WFan(win1, 10, 10, 5, 0, 135); 
     * Hg.WFan(win2, 10, 10, 5, 0, 135); 
     * ```
     */
    Graphic.prototype.WFan = function (win, x, y, r, a0, a1) {
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.arc(x, y, r, a0 * Math.PI / 180, a1 * Math.PI / 180, true);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    };
    /**
     * 指定したウィンドウに 座標(x, y) を中心とした半径rの円について，開始角度 a0 と終了角度 a1 を指定して塗りつぶされた扇型を描画．
     * 扇型の弧は始点角度から終了角度までを反時計回りに結びます．中心座標はウィンドウの外部でも良い．
     *
     * 引数 stroke が 0 の場合は周囲の線を描きません．
     * 角度は， 0 ~ 360 で表される整数を使います．
     *
     * @method WFanFill
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x 弧の中心のx座標
     * @param {Number} y 弧の中心のy座標
     * @param {Number} r 弧の半径
     * @param {Number} a0 開始角度
     * @param {Number} a1 終了角度
     * @param {Number} stroke 周囲を描くかどうか
     * @example
     * ```
     * Hg.WFanFill(win1, 10, 10, 5, 0, 135);
     * Hg.WFanFill(win2, 10, 10, 5, 0, 135, 0);
     * Hg.WFanFill(win2, 10, 10, 5, 0, 135, 1);
     * ```
     */
    Graphic.prototype.WFanFill = function (win, x, y, r, a0, a1, stroke) {
        stroke = stroke || 0;
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.arc(x, y, r, a0 * Math.PI / 180, a1 * Math.PI / 180, true);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
        if (stroke != 0) {
            ctx.beginPath();
            ctx.arc(x, y, r, a0 * Math.PI / 180, a1 * Math.PI / 180, true);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
    };
    /**
     * 指定するウィンドウに 座標(x, y)を左下隅として，指定された文字列を描きます．
     * 左下隅の座標はウィンドウの外部の点でも構いません．
     *
     * @method WText
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x x座標
     * @param {Number} y y座標
     * @param {String} 表示する文字列
     * @example
     * ```
     * Hg.WText(win1, 10, 10, "Hello World");
     * Hg.WText(win2, 10, 10, "Hello World");
     * ```
     */
    Graphic.prototype.WText = function (win, x, y, str) {
        y = transOriginY(win, y);
        var ctx = win.getContext2d();
        ctx.fillText(str, x, y);
    };
    /**
     * 指定するウィンドウに 文字列を描画する場合のフォントと大きさを指定する．
     * いったん指定されると，別の指定があるまで同じ字体と大きさが使われる．
     *
     * @method WSetText
     * @param {Window} win 指定するウィンドウ
     * @param {Number} x x座標
     * @param {Number} y y座標
     * @param {String} 表示する文字列
     * @example
     * ```
     * Hg.WSetFont(win1, "sans-serif", 12);
     * Hg.WSetFont(win2, "sans-serif", 16);
     * ```
     */
    Graphic.prototype.WSetFont = function (win, font, size) {
        var fontstyle = String(size) + "px '" + font + "'",
            ctx = win.ctx;
        ctx.font = fontstyle;
    };
    /**
     * 指定したウィンドウ内に書かれたすべての図形や文字を消去する．
     *
     * @method WClear
     * @param {Window} win 指定するウィンドウ
     * @example
     * ```
     * Hg.WClear(win1); // win1ウィンドウの初期化
     * Hg.WClear(win2); // win2ウィンドウの初期化
     * ```
     */
    Graphic.prototype.WClear = function (win) {
        var ctx = win.getContext2d();
        ctx.beginPath();
        ctx.clearRect(0, 0, win.getWidth(), win.getHeight()); 
    }; 
    /**
     * 0 ~ 255 の値で指定された数値を元に，白から黒までの範囲で色を作成する．
     * 0が黒，255が白です．引数の数値は0 <= g <= 255 の整数で指定する．
     *
     * @method Gray
     * @param {Number} g グレーの濃度を示す整数
     * @return {String} CSSで指定するフォーマット形式の文字列
     * @example
     * ```
     * String color = Hg.Gray(0); // 黒色
     * HgSetColor(color); // 黒色に変更
     *
     * HgSetColor(Hg.Gray(255)); // 白色に変更
     * ```
     */
    Graphic.prototype.Gray = function (g) {
        if (g < 0 || g > 255) return null;
        return "rgb(" + g + "," + g + "," + g + ")";
    };
    /**
     * 白黒の半透明色を作成する．
     * 0が黒，255が白です．引数の数値は0 <= g <= 255 の整数で指定する．
     * アルファ値は0.0 <= a <= 1.0 の範囲内の値で指定する．
     *
     * @method GrayA
     * @param {Number} g グレーの濃度を示す整数
     * @param {Number} a アルファ値
     * @return {String} CSSで指定するフォーマット形式の文字列
     * @example
     * ```
     * String color = Hg.GrayA(0, 0.5); // 半透明の黒色
     * HgSetColor(color);
     *
     * HgSetColor(Hg.GrayA(255, 0.5)); // 半透明の白色に変更
     * ```
     */
    Graphic.prototype.GrayA = function (g, a) {
        if (g < 0 || g > 255) return null;
        if (a < 0.0 || a > 1.0) return null;
        return "rgba(" + g + "," + g + "," + g + "," + a + ")";
    };
    /**
     * 赤，緑，青の三原色の数値を元に色を作成する．
     * 引数の数値は 0 <= r, g, b <= 255 の整数で指定する
     *
     * @method RGB
     * @param {Number} r 赤の濃度を示す整数
     * @param {Number} g 緑の濃度を示す整数
     * @param {Number} b 青の濃度を示す整数
     * @return {String} CSSで指定するフォーマット形式の文字列
     * @example
     * ```
     * String color = Hg.RGB(255, 255, 0); // 黄色
     * HgSetColor(color);
     *
     * HgSetColor(Hg.RGB(0, 255, 255)); // シアンに変更
     * ```
     */
    Graphic.prototype.RGB = function (r, g, b) {
        if (r < 0 || r > 255) return null;
        if (g < 0 || g > 255) return null;
        if (b < 0 || b > 255) return null;
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    /**
     * 透明度を指定して，赤，緑，青の三原色の数値を元にを作成する．
     * 引数の数値は 0 <= r, g, b <= 255 の整数で指定する．
     * アルファ値は 0.0 <= a <= 1.0 の範囲内の値で指定する．
     *
     * @method RGBA
     * @param {Number} r 赤の濃度を示す整数
     * @param {Number} g 緑の濃度を示す整数
     * @param {Number} b 青の濃度を示す整数
     * @param {Number} a アルファ値
     * @return {String} CSSで指定するフォーマット形式の文字列
     * @example
     * ```
     * String color = Hg.RGB(255, 255, 0, 0.5); // 半透明な黄色
     * HgSetColor(color);
     *
     * HgSetColor(Hg.RGB(0, 255, 255, 0.5)); // 半透明なシアンに変更
     * ```
     */
    Graphic.prototype.RGBA = function (r, g, b, a) {
        if (r < 0 || r > 255) return null;
        if (g < 0 || g > 255) return null;
        if (b < 0 || b > 255) return null;
        if (a < 0.0 || a > 1.0) return null;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };

    /**
     * Util オブジェクトは便利な機能を提供する予定です．
     *
     * @class Util
     * @constructor
     * @namespace handyGraphic
     */
    var Util = function () {
        // No property...
    };


    global.requestAnimationFrame = (function () {
        return  global.requestAnimationFrame   ||
            global.webkitRequestAnimationFrame ||
            global.mozRequestAnimationFrame    ||
            global.oRequestAnimationFrame      ||
            global.msRequestAnimationFrame     ||
            function (callback) {
                global.setTimeout(callback, 1000 / 60);
            };
    }());
    global.cancelAnimationFrame = (function() {
        return window.cancelAnimationFrame ||
            window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.msCancelAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            function(id) { window.clearTimeout(id); };
    }());

    /**
     * Scene オブジェクトは，描画単位を論理的に分割するためのものです．
     *
     * ゲームやアニメーションなどを作成する場合は，描画処理が複雑になり，また規模も大きくなります．
     * Scene オブジェクトを使うことで，描画処理をシーン単位で分割することで管理がしやすくなります．
     * 例えば，ゲームを作成する場合は，タイトル画面，プレイ画面，スコア画面などの単位に分割することが考えられます．
     * 当然のことながら，Scene オブジェクトは複数作成することができます．
     *
     * シーン間の画面遷移や，アニメーションなどはScene オブジェクトの機能を使うことで簡単に実現できます．
     * 画面遷移はnextSceneメソッド，アニメーションはupdateメソッドを利用します．
     *
     * また，Scene オブジェクト作成時に，シーン内変数などを宣言することができます．
     * これは，シーン内だけで必要な変数を宣言する場合や，アニメーションなどを実現する場合に有用です．
     *
     * @class Scene
     * @constructor
     * @namespace handyGraphic
     * @param args シーン内に定義する変数
     *
     * @example
     * ```
     * var scene1 = new Scene({t : 0}); // 引数でシーン内変数を宣言する
     * scene1.awake = function () {
     *     this.t = 0; // 起動時の処理
     * };
     * scene1.update = function () {
     *     this.t += 1; // 更新処理
     *     if (this.t >= 200) {
     *        this.nextScene(scene2); // シーン遷移
     *     }
     * };
     * scene1.draw = function () {
     *     Hg.Clear();
     *     Hg.Box(this.t, this.t, 5, 5); 
     * };
     * scene1.start(); // シーンの起動
     * ```
     */    
    var Scene = function (args) {
        var _animationId = null;
        var _running = false;
        if (typeof args != "undefined") {
            this.initialize(args); 
        }
    };
    Scene.prototype.initialize = function (args) {
        var self = this;
        Object.keys(args).forEach(function (key) {
            var value = this[key];
            Object.defineProperty(self, key, {
                value : this[key],
                writable : true,
                enumerable : true,
                configurable : true
            });
        }, args);
    };
    /**
     * シーンの起動時に実行されるメソッド．
     * 初期化処理など，起動時に１度だけ実行する必要がある処理を記述する
     *
     * @method awake
     * @example
     * ```
     * var scene1 = new Scene({t : 0});
     * scene1.awake = function () {
     *     // 起動時の処理を記述する
     *     this.t = 0; // シーン内の変数の初期化など
     * }
     * ```
     */
    Scene.prototype.awake = function () {
        // 起動時の処理を記述する
    };
    /**
     * ワンフレーム毎に実行されるメソッド．
     * 座標の更新，条件判定，シーンの移動判定などを記述する
     *
     * @method update
     * @example
     * ```
     * var scene1 = new Scene({t : 0});
     * scene1.update = function () {
     *     // 変数などの更新処理を記述する
     *     this.t += 1; // 更新処理
     * }
     * ```
     */
    Scene.prototype.update = function () {
        // 変数などの更新処理を記述する
    };
    /**
     * 描画処理を記述するメソッド．
     * 現在のシーンとして表示される情報を記述する
     *
     * @method draw
     * @example
     * ```
     * var scene1 = new Scene();
     * scene1.draw = function () {
     *     // 描画処理を記述する
     *     Hg.Clear();
     *     Hg.Box(10, 10, 5, 5); 
     * }
     * ```
     */
    Scene.prototype.draw = function () {
        // 描画処理を記述する
    };
    Scene.prototype.render = function () {
        this.update();
        this.draw();
        this._animationId = requestAnimationFrame(this.render.bind(this));
        if (!this._running) { cancelAnimationFrame(this._animationId); }
    };
    /**
     * シーンの起動を行うメソッド．
     * このメソッドを実行することでシーンが開始される．
     *
     * @method start
     * @example
     * ```
     * var scene1 = new Scene();
     * // シーンの設定を記述する
     * scene1.start(); // シーンの起動
     * ```
     */
    Scene.prototype.start = function () {
        this._running = true;
        this.awake();
        this.render();
    };
    /**
     * シーンを終了するメソッド．
     * このメソッドを実行することでシーンが終了する．
     *
     * @method exit
     * @example
     * ```
     * scene1.exit(); // シーンの終了
     * ```
     */
    Scene.prototype.exit = function () {
        this._running = false;
    };
    /**
     * シーンを遷移するメソッド．
     * 現在のシーンを終了し，引数で与えられたシーンを開始する．
     *
     * @method nextScene
     * @param _nextScene 遷移先シーン
     * @example
     * ```
     * var scene1 = new Scene(); // 最初のシーン
     * var scene2 = new Scene(); // 遷移先のシーン
     * scene1.update = function () {
     *     if (シーンの遷移条件) {
     *        this.nextScene(scene2); // シーン遷移
     *     }
     * };
     * scene1.start(); // シーンの起動
     * ```
     */
    Scene.prototype.nextScene = function (_nextScene) {
        this.exit();
        _nextScene.start();
    };

    /**
     * Sprite オブジェクトは，図形や画像を表示するための視覚要素です．
     * スプライトオブジェクトはStratgy，Commandデザインパターンを取り入れています．
     * それぞれのデザインパターンの詳細については，他の資料を参照してください．
     *
     * スプライトは自身を自分ではペイントせず，別のオブジェクトに委譲します．
     * スプライトの描画はペインターオブジェクトを作成することによって実現します．
     * これはStrategyデザインパターンの一例です．
     * ペインターはスプライトの引数 painter としてスプライトに紐づけられます．
     * ペインターの詳細はpaint メソッドに記載しています．
     *
     * スプライトの振る舞いもスプライト内では定義せず，ビヘイビアオブジェクトを作成します．
     * ビヘイビアはスプライトの振る舞いをカプセル化し，スプライトに対するコマンドのように扱われます．
     * これはCommandデザインパターンの一例です．
     * スプライトはビヘイビアを実行でき，ビヘイビアの配列を保持することができます．
     * ビヘイビアの詳細はupdate メソッドに記載しています．
     * 
     *
     * @class Sprite
     * @constructor
     * @namespace handyGraphic
     * @param name スプライトの名前
     * @param painter スプライトをペイントするオブジェクト
     * @param behaviors スプライトの振る舞いの配列
     * @example
     * ```
     * var isFall = true,
     *     ballPainter = {
     *         paint: function (sprite, win) {
     *             Hg.Clear();
     *             Hg.CircleFill(sprite.x, sprite.y, 20);
     *         }
     *     },
     *     ballToFall = {
     *         execute: function (sprite, win, time) {
     *             if (isFall) { sprite.y -= 1; } 
     *
     *             if (sprite.y <= 20) {
     *                 isFall = false; 
     *             }
     *         }
     *     },
     *     ball = new Sprite("ball", ballPainter, [ ballToFall ]);
     *
     * ball.x = 150;
     * ball.y = 400;
     *
     * var scene1 = new Scene();
     * scene1.update = function () {
     *     ball.update(win, 1);
     * };
     * scene1.draw = function () {
     *     ball.paint(win);
     * };
     * scene1.start();
     * ```
     */
    var Sprite = function (name, painter, behaviors) {
        /**
         * スプライトの名前
         * @property name
         * @type {String}
         */
        this.name = name || "";

        /**
         * スプライトをペイントするオブジェクト
         * @property painter
         * @type {Painter}
         */
        this.painter = painter || undefined;

        /**
         * スプライトの振る舞いの配列
         * @property behaviors
         * @type {Array}
         */
        this.behaviors = behaviors || [];

        /**
         * スプライトの左下隅のx座標
         * @property x
         * @type {Number}
         */
        this.x = 0;

        /**
         * スプライトの左下隅のy座標
         * @property y
         * @type {Number}
         */
        this.y = 0;

        /**
         * スプライトの幅
         * @property width
         * @type {Number}
         */
        this.width = 10;

        /**
         * スプライトの高さ
         * @property height
         * @type {Number}
         */
        this.height = 10;

        /**
         * スプライトのx方向の速度
         * @property velocityX
         * @type {Number}
         */
         this.velocityX = 0;

        /**
         * スプライトのy方向の速度
         * @property velocityY
         * @type {Number}
         */
         this.velocityY = 0;

        /**
         * スプライトが可視であるか示すブール値
         * @property visible
         * @type {Boolean}
         */
        this.visible = true;

        /**
         * スプライトがアニメーション中であるか示すブール値
         * @property animating
         * @type {Boolean}
         */
        this.animating = false;
    };
    /**
     * スプライトが保持するペインターを用いてペイントする．
     * イメージペインターを実装することで，スプライトは画像を扱うことも可能です．
     *
     * ペインターはvoid paint(sprite, win) というメソッドを必ず実装する必要があります．
     * paintメソッドを備えていれば，ペインターの実装は開発者の自由にすることができます．
     * ペインターは基本的に，実行時にスプライトに割り当てることが出来る交換可能なペイントアルゴリズムです．
     * この仕組みはペインターがStrategyデザインパターンの一例だということを意味しています．
     * 
     * @method paint
     * @param win スプライトを描画するウィンドウ
     * @example
     * ```
     * // ペインターの一例
     * var ballPainter = {
     *     paint: function (sprite, win) {
     *         Hg.Clear();
     *         Hg.CircleFill(sprite.x, sprite.y, 20);
     *     }
     * };
     * var ball = new Sprite("ball", ballPainter);
     * ball.paint(win); // スプライトを描画する
     * ```
     */
    Sprite.prototype.paint = function (win) {
        if (this.painter !== undefined && this.visible) {
            this.painter.paint(this, win); 
        }
    };
    /**
     * スプライトのビヘイビアを追加された順番で実行する．
     *
     * ビヘイビアはvoid execute(sprite, win, time) というメソッドを必ず実装する必要があります．
     * executeメセッドを備えていれば，ビヘイビアの実装は開発者の自由にすることができます．
     * ビヘイビアはスプライトによって実行され，実行されることでスプライトに対する振る舞いを実現します．
     * また，ビヘイビアは配列で保持しているため，いくつでも割り当てることができ，そしてビヘイビアを組み合わせることもできます．
     * この仕組みはビヘイビアがCommandデザインパターンの一例だということを意味しています．
     *
     * @method update
     * @param win スプライトを描画するウィンドウ
     * @param time 実行感覚
     * @example
     * ```
     * // ビヘイビアの一例
     * var isFall = true,
     * var ballToFall = {
     *     execute: function (sprite, win, time) {
     *         if (isFall) { sprite.y -= 1; } 
     *  
     *         if (sprite.y <= 20) {
     *             isFall = false; 
     *         }
     *     }
     * };
     * var ball = new Sprite("ball", ballPainter, [ ballToFall ]);
     * ball.update(win, time); // 落下の振る舞いを実行する
     * ```
     */
    Sprite.prototype.update = function (win, time) {
        for (var i = 0; i < this.behaviors.length; ++i) {
            this.behaviors[i].execute(this, win, time);
        }
    };

    handyGraphic = {
        Window : Window,
        Graphic : Graphic,
        Scene : Scene,
        Sprite : Sprite,
        Util : Util,
        globalize : globalize
    };

    global.handyGraphic = handyGraphic;

    return handyGraphic;
}(window));
