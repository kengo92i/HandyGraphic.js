/**
* main.js v0.0.1
* Copyright (c) 2016 kengo92i
*/
handyGraphic.globalize();
window.onload = function () {
    var Hg = new Graphic(),
        win = Hg.Open(400, 400),
        util = new Util(),
        player = {
           x : 260,
           y : 180 
        },
        state = {
            sceneName : "none",
            score : [0, 0, 0, 0, 0, 0, 0],
            logx : [0, 0, 0, 0, 0, 0],
            logy : [0, 0, 0, 0, 0, 0],
            point : 0,
            total : 0,
            num : 0,
            standing : 1,
            t : 10,
            w : Math.floor( Math.random() * 21 ) - 10,
            isAim : true,
            bowstringShake : 1,
            clickerTurn : 0,
            clickerCheck : 0,
            miss : 0,
            decide : false,
            type : 1
        };


    // 終了画面
    var exitScene = new Scene();
    exitScene.draw = function () {
        Hg.Clear();
        Hg.SetColor("white");
        Hg.SetFillColor("black");
        Hg.BoxFill(0, 0, 400, 400);
        Hg.Box(102, 143, 200, 100);
        Hg.SetFillColor("white");
        Hg.SetFont("sans-serif", 20);
        Hg.Text(177, 185, "EXIT.");
    };


    // ヘルプ画面
    var helpScene = new Scene();
    helpScene.awake = function () {
        state.decide = false;
        state.sceneName = "help";
        window.addEventListener('keydown', helpSceneController, false);
    };
    helpScene.update = function () {
        if (state.decide) {
            window.removeEventListener('keydown', helpSceneController, false);
            this.nextScene(menuScene);
        }
    };
    helpScene.draw = function () {
        var helpTexts = [
                "〜操作方法〜",
                "1. メニュー画面",
                "【上下キー】モード選択",
                "【スペースキー】決定",
                "2. ゲーム画面",
                "【矢印キー】弓の移動",
                "【スペースキー】発射または決定",
                "〜ゲームの流れ〜",
                "・１立ち６本の計6立ち（３６射）を行います．",
                "・36射後 → スコアー画面",
                "・弓の位置を決定 → パワーゲージ調整 → 発射の流れ",
                "・画面右上にタイマーがあります．",
                "・タイマーが限界になると現在位置で決定されます．",
                "・弓のぶれ，風などを考慮して的を狙って下さい",
                "・点数は中心に近い方から10〜1点です．",
                "・的を外すと当然０点です．",
                "・画面左には現在のスコアーが表示されています．",
                "・スコアーによって，バッチが貰えます．",
                "・種類はGold, Silver, Bronze, Greenです．" 
            ],
            length = 0,
            i = 0;
        Hg.Clear();
        Hg.SetFillColor("black");
        Hg.BoxFill(0, 0, 400, 400);
        Hg.SetFillColor("white");
        Hg.SetFont("sans-serif", 12);
        for (i = 0; length = helpTexts.length, i < length; ++i) {
            Hg.Text(10, 380 - (20 * i), helpTexts[i]);
        }
        Hg.Text(260, 20, "【スペースキー】で戻る");

        drawTarget(320, 330, 4);
    };


    // 結果画面
    var resultScene = new Scene();
    resultScene.awake = function () {
        state.decide = false;
        state.sceneName = "result";
        window.addEventListener('keydown', resultSceneController, false);
    };
    resultScene.update = function () {
        if (state.decide) {
            window.removeEventListener('keydown', resultSceneController, false);
            this.nextScene(menuScene); 
        }

    };
    resultScene.draw = function () {
        var i = 0,
            score = 0,
            total = state.total;

        Hg.Clear();
        Hg.SetFillColor("black");
        Hg.BoxFill(10, 10, 380, 380);

        Hg.SetFillColor("white");
        Hg.SetFont('sans-serif', 24);
        Hg.Text(40, 360, "=== Score ===");

        for (var i = 1; i <= 6; ++i) {
            score = state.score[i];
            Hg.Text(40, 340-30*i, String(i) + " standing = " + String(score)); 
            if (score >= 55) { Hg.Text(245, 340-30*i, "Excellent!!"); }
            else if (score > 49 && score < 55) { Hg.Text(245, 340-30*i, "Good!!"); }
            else { Hg.Text(245, 340-30*i, "Bad!!"); }
        }

        Hg.Text(40, 110, "Total = " + total);

        Hg.SetColor("white");
        Hg.Box(30, 20, 170, 70);
        Hg.SetFont("sans-serif", 16);
        Hg.Text(40, 70, "Gold   = 330~");
        Hg.Text(40, 50, "Silver = 315~329");
        Hg.Text(40, 30, "Bronze = 300~314");

        Hg.Box(240, 20, 120, 120);
        var type = 0;
        if(total >= 330){ type = 1; } // 金
        else if (total < 330 && total >= 315){ type = 2; } // 銀
        else if (total < 315 && total >= 300){ type = 3; } // 銅
        else { type = 4; } // 緑
        drawBatch(300, 78, type);
    };


    // フォロースルー（情報更新）
    var followThroughScene = new Scene({
        t : 0,
        resX : 0,
        resY : 0,
        isAnimation : true
    });
    followThroughScene.awake = function () {
        this.t = 0;
        this.resX = state.logx[state.num];
        this.resY = state.logy[state.num];
        this.isAnimation = true;
        state.sceneName = "followThrought";
    };
    followThroughScene.update = function () {
        this.t += 1;
        if (this.t > 100) { this.isAnimation = false; }
        if (!this.isAnimation) {
            var point = checkPoint(this.resX, this.resY, state.num);
            state.total += point;
            state.score[state.standing] += point;
            state.num += 1;
            state.w = Math.floor( Math.random() * 21 ) - 10;
            if (state.num > 5) {
                state.logx = [0, 0, 0, 0, 0, 0]; 
                state.logy = [0, 0, 0, 0, 0, 0]; 
                state.standing += 1;
                state.num = 0;
            }

            if (state.standing <= 6) {
                this.nextScene(aimScene);
            } else {
                this.nextScene(resultScene);
            }
        }
    };
    followThroughScene.draw = function () {
        Hg.Clear();
        drawArchery(this.resX, this.resY, state);
        state.bowstringShake *= -1; 
    };


    // 矢が飛ぶシーン
    var shotScene = new Scene({
        t : 0,
        s : 0,
        n : 0,
        isAnimation : true
    });
    shotScene.awake = function () {
        var x = state.logx[state.num],
            y = state.logy[state.num];
        this.t = 0;
        this.s = 0;
        this.n = 0;
        if (x <= 145 || x >= 255) { this.n = 60; }
        if (y <= 145 || y >= 255) { this.n = 60; }
        this.isAnimation = true;
        state.sceneName = "shot";
    };
    shotScene.update = function () {
        this.t += 2;
        this.s += (state.logy[state.num] - 200) / 300;
        //console.log(state.logy[state.num]);

        if (this.t > 280 + this.n) { this.isAnimation = false; }
        if (!this.isAnimation) {
            this.nextScene(followThroughScene);
        }
    };
    shotScene.draw = function () {
        Hg.Clear();
        for (var i = 0; i < 100; ++i) {
            Hg.SetFillColor(Hg.RGB(155+i, 255, 255)); 
            Hg.BoxFill(0, 300, 400, 100-i);
        }
        Hg.SetFillColor("black");
        Hg.BoxFill(0, 0, 400, 100);        

        drawArcher(10, 100, this.t);

        Hg.SetWidth(6); //脚
        Hg.SetColor("black");
        Hg.Line(320, 100, 360, 175);
        Hg.Line(350, 160, 370, 100);
        Hg.SetWidth(1);
        drawShotArrow(10, 100, this.t, this.s);
    };


    // クリッカー操作画面
    var clickerScene = new Scene();
    clickerScene.awake = function () {
        state.clickerCheck = 0;
        state.clickerTurn = 0;
        state.sceneName = "clicker";
        window.addEventListener('keydown', clickerSceneController, false);
    };
    clickerScene.update = function () {
        state.clickerTurn += 2; 
        if (state.clickerTurn > 360) { state.clickerTurn = 0; }
        if (state.clickerCheck) {
            window.removeEventListener('keydown', clickerSceneController, false);
            var miss = judgeClicker(state.clickerCheck);
            state.logx[state.num] = player.x + state.w;
            state.logy[state.num] = player.y + miss;
            this.nextScene(shotScene);
        }
    };
    clickerScene.draw = function () {
        Hg.Clear();
        drawArchery(player.x, player.y, state);
        drawClicker(state.clickerTurn);
    };


    // 照準シーン
    var aimScene = new Scene();
    aimScene.awake = function () {
        state.isAim = true;
        state.t = 0;
        state.sceneName = "aim";
        window.addEventListener('keydown', playSceneController, false);
    };
    aimScene.update = function () {
        var d = [0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0];

        var k = d[(Math.floor( Math.random() * 100) % 11)];
        if (player.y < 270 || player.y > 140){
            player.y += k; // 重力ぽいもの
            if (player.y > 270) player.y = 270; //上制限
            if (player.y < 140) player.y = 140; //下制限
        }
  
        k = d[(Math.floor( Math.random() * 100) % 11)];
        if (player.x < 310 || player.x > 140) {
            player.x += k;//左右ぶれ
            if (player.x > 310) player.x = 310; //右制限
            if (player.x < 140) player.x = 140; //左制限
        }

        state.t += 1; 
        if (state.t >= 360) {
            state.t = 0;
            state.isAim = false;
        }

        if (state.isAim == false) {
            window.removeEventListener('keydown', playSceneController, false);
            this.nextScene(clickerScene);
        }
    };
    aimScene.draw = function () {
        Hg.Clear();
        drawArchery(player.x, player.y, state);
        drawInfomationWindow(player.x, player.y, state);
    };


    // メニュー画面
    var menuScene = new Scene();
    menuScene.awake = function () {
        state.decide = false;
        state.type = 1;
        window.addEventListener('keydown', menuSceneController, false);
    };
    menuScene.update = function () {
        if (state.decide) {
            window.removeEventListener('keydown', menuSceneController, false);
            switch (state.type) {
            case 1:
                initGame();
                this.nextScene(aimScene); 
                break;
            case 2:
                this.nextScene(helpScene);
                break;
            case 3:
                this.nextScene(exitScene);
                break;
            default:
                // Do Nothing ...
            } 
        }
    };
    menuScene.draw = function () {
        Hg.SetFillColor("black");
        Hg.BoxFill(0, 0, 400, 400);
        drawTarget(0, 400, 12);
        drawTarget(400, 400, 12);
        Hg.SetFillColor(Hg.RGB(160, 50, 70));
        Hg.BoxFill(0, 390, 400, 10);
        Hg.BoxFill(0, 0, 400, 10);

        Hg.SetFillColor("white");
        Hg.SetFont("sans-serif", 14);
        Hg.Text(135, 330, "アーチェリーゲーム");
        drawTarget(195, 280, 4);

        Hg.SetFillColor("DarkGoldenRod");
        Hg.BoxFill(100, (4-state.type)*50+30, 200, 30);

        Hg.SetColor("white");
        Hg.SetFillColor("white");
        Hg.Box(100, 180, 200, 30);
        Hg.Text(180, 190, "START");

        Hg.Box(100, 130, 200, 30);
        Hg.Text(185, 140, "HELP");

        Hg.Box(100, 80, 200, 30);
        Hg.Text(190, 90, "END");

        Hg.Text(250, 20, "[スペース] 決定");

        drawArcher(40, (4-state.type)*50, 1);
        drawShotArrow(40, (4-state.type)*50, 0, 0);
        Hg.SetFont("sans-serif", 12);
    };


    // ローディング画面
    var loadingScene = new Scene({t : 0});
    loadingScene.awake = function () {
        this.t = 0;
    };
    loadingScene.update = function () {
        this.t += 1;
        if (this.t > 30) {
            this.nextScene(menuScene);
        }
    };
    loadingScene.draw = function () {
        Hg.Clear();
        Hg.Box(45,195,310,35);
        Hg.Text(150, 140, "Nowloading...");
        Hg.BoxFill(50, 200, this.t*10, 25);
    };

    function initGame() {
        state.score = [0, 0, 0, 0, 0, 0, 0];
        state.logx = [0, 0, 0, 0, 0, 0];
        state.logy = [0, 0, 0, 0, 0, 0];
        state.point = 0;
        state.total = 0;
        state.num = 0;
        state.standing = 1;
    }

    function checkPoint(x, y, num) {
        var tx = 200,
            ty = 200,
            r = 5,
            i = 0,
            point = 0;

        for (i = 1; i <= 10; ++i) {
            if (Math.pow(x-tx, 2) + Math.pow(y-ty, 2) <= Math.pow(r*i, 2)) {
                state.logx[num] = x;
                state.logy[num] = y;
                return 11 - i; 
            } 
        } 

        state.logx[num] = 0;
        state.logy[num] = 0;
        return 0;
    }

    function judgeClicker(clickerCheck) {
        if (clickerCheck < 50) { return -30; }
        if (clickerCheck >= 50 && clickerCheck < 150) { return -20; }
        if (clickerCheck >= 150 && clickerCheck < 250){ return -15; }
        if (clickerCheck >= 250 && clickerCheck < 330){ return -10; }
        if (clickerCheck >= 330 && clickerCheck <= 350){ return 0; }
        if (clickerCheck > 350){ return 15; } 
    }

    function drawBatch(x, y, type) {
        var s = [x, x-50, x-32, x+32, x+50],
            v = [y+52, y+12, y-43, y-43, y+12],
            a = [x, x-45, x-29, x+29, x+45],
            b = [y+46, y+10, y-39, y-39, y+10],
            color = "";

        if (type == 1) { color = "yellow"; }
        else if (type == 2) { color = Hg.RGB(215, 215, 215); }
        else if (type == 3) { color = Hg.RGB(150, 70, 15); }
        else { color = Hg.RGB(10, 130, 15);}

        Hg.SetFillColor(color);
        Hg.SetColor("red");
        Hg.PolygonFill(5, s, v, 1);

        Hg.SetColor("lightgray");
        Hg.Polygon(5, a, b);

        Hg.SetFillColor("DarkGoldenRod");
        Hg.CircleFill(x, y, 18);
        Hg.SetFont("sans-serif", 12);
        Hg.Text(x-13, y-27, "-------");
        Hg.Text(x-13, y-32, "-------");

        drawTarget(300, 78, 1.5);
    }

    function drawTarget(tx, ty, r) {
        Hg.SetColor("black"); 
        Hg.SetFillColor("white"); 
        Hg.CircleFill(tx, ty, r*10);
        Hg.SetColor("dimgray"); 
        Hg.Circle(tx, ty, r*9);
        Hg.SetFillColor("black");
        Hg.CircleFill(tx, ty, r*8);
        Hg.SetColor("white"); 
        Hg.Circle(tx, ty, r*7);
        Hg.SetFillColor("blue");
        Hg.CircleFill(tx, ty, r*6);
        Hg.SetColor("dimgray"); 
        Hg.Circle(tx, ty, r*5);
        Hg.SetFillColor("red");
        Hg.CircleFill(tx, ty, r*4);
        Hg.SetColor("dimgray"); 
        Hg.Circle(tx, ty, r*3);
        Hg.SetFillColor("yellow");
        Hg.CircleFill(tx, ty, r*2);
        Hg.SetColor("dimgray"); 
        Hg.Circle(tx, ty, r*1);
        Hg.SetFillColor("dimgray"); 
        var offset = r / 2 - 1;
        Hg.Line(tx+offset, ty+offset, tx-offset, ty-offset);
        Hg.Line(tx-offset, ty+offset, tx+offset, ty-offset);
        Hg.SetColor("black"); 
        Hg.SetFillColor("black"); 
    }

    function drawStand(tx, ty) {
        Hg.SetColor(Hg.RGB(255, 255, 255));
        Hg.Line(tx, ty-20, 0, 0);
        Hg.Line(tx, ty-20, 400, 0);

        Hg.SetFillColor("dimgray");
        Hg.BoxFill(tx-50, ty-75, 10, 50);
        Hg.BoxFill(tx+40, ty-75, 10, 50);

        Hg.SetFillColor("lightgray");
        Hg.BoxFill(tx-55, tx-55, 110, 110);

        drawTarget(tx, ty, 5);
    }

    function drawStage() {
        var i = 0,
            n = 0,
            tx = 50,
            ty = 300,
            r = 3;

        for (i = 50; i < 200; ++i) {
            Hg.SetFillColor(Hg.RGB(i/2, i*1, i/5)); 
            Hg.BoxFill(0, 0, 400, 255 - i); 
        }

        Hg.SetFillColor(Hg.RGB(160, 50, 70));
        Hg.BoxFill(0, 380, 400, 20);
        for (i = 50; i < 150; ++i) {
            Hg.SetFillColor(Hg.RGB(i, i, i/5)); 
            Hg.BoxFill(0, 205, 400, 230 - i);
        }

        Hg.SetFillColor(Hg.RGB(240, 200, 100));
        Hg.BoxFill(0, 260, 400, 80);

        for (n = 0; n < 5; ++n) {
            for (i = 0; i < 4; ++i) {
                Hg.SetFillColor(Hg.RGB(0, 80, 25)); 
                Hg.BoxFill(0+(100*i), 250-(12*n), 100, 12);
                Hg.SetColor(Hg.RGB(0, 0, 0));
                Hg.Box(0+(100*i), 250-(12*n), 100, 12);
                Hg.SetFillColor(Hg.RGB(110, 120, 0));
                Hg.SetFont('sans-serif', 14);
                Hg.Text(0+(100*i), 250-(12*n), "##############");
            }
        }

        Hg.SetFillColor(Hg.RGB(0, 0, 0));
        for (i = 0; i < 8; i++) {
            Hg.SetFont('sans-serif', 12);
            Hg.Text(0, 260+10*i, "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
        }

        for (i = 0; i < 400; i += 100) {
            Hg.SetFillColor(Hg.RGB(255, 255, 255)); 
            Hg.BoxFill(tx-30+i, ty-30, 60, 60);
            drawTarget(tx+i, ty, r);
        } 
    }

    function drawBow(x, y) {
        Hg.SetColor("red");
        Hg.Circle(x, y, 1, 1); //サイトピンの照準
        Hg.SetFillColor("lightgray");
        Hg.BoxFill(x+21, y+60, 13, 150); //上リム
        Hg.SetFillColor("dimgray");
        Hg.BoxFill(x+21, y-310, 13, 150); //下リム
        Hg.SetFillColor("white");
        Hg.BoxFill(x+15, y+30, 20, 60); //接合上
        Hg.BoxFill(x+15, y-185, 20, 60); //接合下
  
        Hg.SetColor("white");
        Hg.Circle(x, y, 10, 10); //サイトピン
        Hg.Line(x, y-10, x, y-2); //サイトピンの線
        Hg.SetFillColor("white");
        Hg.BoxFill(x+10, y-2, 30, 3); //エクステンションバー
        Hg.SetFillColor("yellow");
        Hg.BoxFill(x+20, y-150, 13, 200); //ハンドル
        Hg.BoxFill(x+10, y-70, 10, 20); //レスト
        Hg.SetFillColor("white");
        Hg.BoxFill(x+40, y-25, 5, 50); //サイト本体
    }

    function drawHand(x, y) {
        var v = [x, x+40, 250, 150];
        var s = [y-75, y-75, 0, 0];

        Hg.SetFillColor(Hg.RGB(248, 210, 172));
        Hg.CircleFill(x+20, y-75, 20);
        Hg.SetFillColor(Hg.RGB(210, 250, 0));
        //Hg.SetFillColor("white");
        Hg.SetFillColor(Hg.RGB(210, 250, 0));
        Hg.PolygonFill(4, v, s);
    }

    function drawArrow(x, y) {
        var v = [x+15, 300, 350],
            s = [y-35, 0, 0],
            a = [x, x+1, x-22, x-20],
            b = [y, y+1, y+22, y+20];

        if (state.sceneName == "followThrought") {
            Hg.SetFillColor("white"); 
            Hg.CircleFill(x-18, y+18, 4, 4);
            Hg.SetFillColor("black");
            Hg.PolygonFill(4, a, b);
            Hg.SetFillColor("red");
            Hg.CircleFill(x-22, y+22, 2);
        } else {
            Hg.SetFillColor("lightgray");
            Hg.PolygonFill(3, v, s);
            Hg.SetFillColor(Hg.RGB(248, 210, 172));
            Hg.CircleFill(325, 0, 20); // 20, 25
        }
    }

    function drawBowstring(x, y) {
        if (state.sceneName == "followThrought") {
            x -= state.bowstringShake;
            Hg.SetColor("lightgreen"); 
            Hg.SetWidth(2);
            Hg.Line(x+27, y+210, x+27, y-310); //弦(発射後)
            Hg.SetWidth(1);
        } else {
            Hg.SetColor("lightgreen");
            Hg.Line(x+27, y+210, 325, 0); //弦(発射前)
        }
    }

    function drawLogArrow(x, y, num) {
        var i, 
            a = [0, 0, 0, 0],
            b = [0, 0, 0, 0],
            logx = state.logx,
            logy = state.logy;

        drawTarget(60, 340, 5);

        for (i = 0; i < 7; ++i) {
            logx[i] -= 140;
            logy[i] += 140;
            a = [logx[i], logx[i]+1, logx[i]-22, logx[i]-20]; 
            b = [logy[i], logy[i]+1, logy[i]+22, logy[i]+20]; 

            Hg.SetFillColor("white");
            Hg.CircleFill(logx[i]-18, logy[i]+18, 4);
            Hg.SetFillColor("black");
            Hg.PolygonFill(4, a, b);
            Hg.SetFillColor("red");
            Hg.CircleFill(logx[i]-22, logy[i]+22, 2);
        }
    }

    function drawTimer(t) {
        Hg.SetFillColor("black");
        Hg.BoxFill(325, 325, 70, 70);
        Hg.SetColor("white");
        Hg.Box(325, 325, 70, 70);
        Hg.SetFillColor("red");
        Hg.FanFill(360, 360, 25, 0, t); //タイマー
        Hg.SetFillColor("white");
        Hg.SetFont('sans-serif', 12);
        Hg.Text(350, 385, "2.5"); //目盛り
        Hg.Text(327, 358, "5");
        Hg.Text(350, 326, "7.5");
        Hg.Text(387, 358, "0");
    }

    function drawTable(x, y, state) {
        var i,
            score = state.score,
            total = state.total,
            num = state.num,
            standing = state.standing;

        Hg.SetFillColor("black");
        Hg.BoxFill(5, 90, 110, 180); // メイン
        Hg.BoxFill(375, 140, 20, 130); // 上下
        Hg.BoxFill(140, 375, 170, 20); // 左右
 
        Hg.SetFont('sans-serif', 12);
        Hg.SetFillColor("white");
        for (i = 1; i < 7; i++) {
            if (score[i] >= 55) { 
                Hg.SetFillColor("red"); // 文字を赤にする
            }
            Hg.Text(12, 220-15*i, String(i) + " standing = " + String(score[i]));
            if(score[i] >= 55) {
                Hg.SetFillColor("white"); // リセット
            }
        }
  
        Hg.SetColor("white");
        Hg.SetFillColor("white");
        Hg.SetFont('sans-serif', 12);
        Hg.Text(12, 100, "total = " + String(total));
        Hg.Text(12, 250, String(standing) + " standing");
        Hg.Text(12, 230, "残り矢: " + String(6-num) + "本");

        Hg.Box(5, 90, 110, 180); // 枠（メイン）
        Hg.Box(375, 140, 20, 130); // 枠（上下）
        
        for(i = 140; i < 270; i += 5) {
            Hg.Line(390, i, 395, i);
        }

        for(i = 140; i < 310; i += 5) {
            Hg.Line(i, 390, i, 395);
        }

        Hg.Box(140, 375, 170, 20); // 枠（左右）
        Hg.Line(375, y, 395, y);
        Hg.Line(x, 375, x, 395);
    }

    function drawWind(w) {
        Hg.SetFillColor("black");
        Hg.BoxFill(5, 5, 130, 80); // サブ
        Hg.SetFillColor("white");
        Hg.Box(5, 5, 130, 80);
        Hg.SetFont('sans-serif', 12);
        Hg.Text(8, 65, "現在");
        Hg.Text(8, 40, "風速 " + String(w) + " pixel/s");
        var windMessage = "";
        if (w < 0) { windMessage = "左に流される"; }
        else if (w > 0) { windMessage = "右に流される"; }
        else { windMessage = "無風"; }
        Hg.Text(8, 15, windMessage);
    }

    function drawArcher(x, y, t) {
        var a = [x+18, x+8, x, x-22, x+2],
            b = [y+60, y+75, y+70, y+50, y+60];

        Hg.SetFillColor(Hg.RGB(248, 210, 172));
        Hg.BoxFill(x, y, 4.0, 12); // 足
        Hg.BoxFill(x+10, y, 4, 12); 
        Hg.SetFillColor(Hg.RGB(180, 80, 60));
        Hg.BoxFill(x, y, 4, 4); // ブーツ
        Hg.BoxFill(x+12, y, 4, 4);
        Hg.SetFillColor(Hg.RGB(100, 250, 80));
        Hg.BoxFill(x, y+12, 16, 10); // ズボン
        Hg.SetFillColor(Hg.RGB(100, 250, 40));
        Hg.BoxFill(x, y+22, 16, 20); // トップス
        Hg.SetFillColor(Hg.RGB(120, 80, 60));
        Hg.BoxFill(x, y+22, 16, 3); // ベルト
        Hg.SetFillColor("yellow");
        Hg.CircleFill(x+8, y+23, 3); // バッチ
        Hg.SetFillColor(Hg.RGB(248, 210, 172));
        Hg.CircleFill(x+8, y+55, 10); // 頭

        Hg.SetFillColor("yellow");
        Hg.BoxFill(x-2, y+58, 20, 2);
        Hg.SetFillColor(Hg.RGB(100, 250, 40));
        Hg.PolygonFill(5, a, b);

        Hg.SetFillColor(Hg.RGB(210, 250, 0));
        Hg.BoxFill(x-3-(t/30), y+40, 14, 8); // 引き手
        Hg.BoxFill(x+15, y+35, 25, 6); // 押し手
        Hg.SetFillColor(Hg.RGB(248, 210, 172));
        Hg.CircleFill(x+12-(t/30), y+45, 5); // 引き手（手）
        Hg.CircleFill(x+40, y+39, 5); // 押し手（手）

        Hg.SetFillColor("yellow");
        Hg.BoxFill(x+41, y+25, 5, 30); // ハンドル
        Hg.SetFillColor("lightgray");
        Hg.BoxFill(x+40, y+55, 5, 10); // ハンドル（上）
        Hg.BoxFill(x+40, y+20, 5, 10); // ハンドル（下）
        Hg.SetColor("dimgray");
        Hg.SetWidth(2);
        Hg.Line(x+43, y+65, x+38, y+95); // リム
        Hg.Line(x+43, y+20, x+38, y-5);
        Hg.SetWidth(1);
        Hg.SetColor("green");
        Hg.Line(x+38, y+95, x+12+(t/15), y+45);
        Hg.Line(x+38, y-5, x+12+(t/15), y+45);

    }

    function drawShotArrow(x, y, t, s) {
        Hg.SetFillColor("red");
        Hg.BoxFill(x+12+t, y+44+s, 6, 3); // ノック
        Hg.SetFillColor("white");
        Hg.SetColor("lightgray");
        Hg.CircleFill(x+23+t, y+45+s, 5, 1); // 羽
        Hg.SetColor("black");
        Hg.Line(x+12+t, y+45+s, x+62+t, y+45+s); // シャフト
    }

    function drawPlayer(x, y) {
        drawBow(x, y);
        drawHand(x, y);
        drawArrow(x, y);
        drawBowstring(x, y);
    }

    function drawArchery(x, y, state) {
        var tx = 200,
            ty = 200; 
        drawStage();
        drawStand(tx, ty);
        drawPlayer(x, y);
    }

    function drawClicker(t) {
        var red = 0,
            green = 0;

        for (i = 0; i < 180; ++i) {
            Hg.SetFillColor(Hg.RGB(255, green, 0)); 
            Hg.BoxFill(20, 20, 360-i, 30);
            green += 2;
            if (green > 255) { green = 255; }
        }

        for (i = 180; i > 0; --i) {
            Hg.SetFillColor(Hg.RGB(255-red, 255, 0)); 
            Hg.BoxFill(20, 20, i, 30);
            red += 2;
            if (red > 255) { red = 255; }
        }

        Hg.SetColor("white");
        Hg.Box(330, 20, 20, 30); // 330 ~ 350
        Hg.SetColor("black");
        Hg.Line(20, 20, 20, 50); // 0
        Hg.Line(50, 20, 50, 50); // 50
        Hg.Line(150, 20, 150, 50); // 150
        Hg.Line(250, 20, 250, 50); // 250
        Hg.Box(20, 20, 360, 30); // 囲い
        drawTarget(20, 50, 2);
        Hg.SetFillColor("white");
        Hg.CircleFill(40, 70, 12); // パワー量

        Hg.SetFillColor("white");
        Hg.CircleFill(42+0.5*t, 71, 10);
        Hg.SetFillColor("black");
        Hg.BoxFill(52, 70, 0.5*t, 2);
        Hg.SetFillColor("red"); 
        Hg.BoxFill(52+0.5*t, 68, 15, 5);

        Hg.SetFillColor("black");
        Hg.SetFont('sans-serif', 12);
        Hg.Text(31, 67, String(20+t));
        Hg.Text(328, 52, "Good");

        Hg.SetFillColor("black");
        Hg.BoxFill(23+t, 20, 1, 30);
        Hg.SetColor("yellow");
        Hg.Box(20+t, 18, 6, 34);
    }

    function drawInfomationWindow(x, y, state) {
        drawLogArrow(x, y);
        drawTable(x, y, state);
        drawTimer(state.t);
        drawWind(state.w);
    }

    function helpSceneController(event) {
        var key = event.keyCode; 
        switch (key) {
        case 32:
            state.decide = true;
            break;
        default:
            // Do Nothing ...
        }
    }
    function resultSceneController(event) {
        var key = event.keyCode; 
        switch (key) {
        case 32:
            state.decide = true;
            break;
        default:
            // Do Nothing ...
        }
    }
    function clickerSceneController(event) {
        var key = event.keyCode; 
        switch (key) {
        case 32:
            state.clickerCheck = 20 + state.clickerTurn;
            break;
        default:
            // Do Nothing ...
        }
    }
    function playSceneController(event) {
        var key = event.keyCode; 
        switch (key) {
        case 27:
            state.score[state.standing] = 55; state.total += 55; state.standing += 1;
            break;
        case 32:
            state.isAim = false;
            break;
        case 37:
            player.x -= 10;
            if (player.x < 140) { player.x = 140; }
            break;
        case 39:
            player.x += 10;
            if (player.x > 310) { player.x = 310; }
            break;
        case 38:
            player.y += 20;
            if (player.y > 270) { player.y = 270; }
            break;
        case 40:
            player.y -= 10;
            if (player.y < 140) { player.y = 140; }
            break;
        default:
            // Do Nothing ...
        }
    }
    function menuSceneController(event) {
        var key = event.keyCode; 
        switch (key) {
        case 32:
            state.decide = true;
            break;
        case 38:
            state.type -= 1;
            if (state.type < 1) { state.type = 3; }
            break;
        case 40:
            state.type += 1;
            if (state.type > 3) { state.type = 1; }
            break;
        default:
            // Do Nothing ...
        }
    }

    function main() {
        loadingScene.start(); 
    }
    main();

};

