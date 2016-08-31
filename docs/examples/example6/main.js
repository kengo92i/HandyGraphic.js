handyGraphic.globalize();
window.onload = function () {
    var Hg = new Graphic(); 
    var win = Hg.Open(400, 400);

    var isFall = true,
    ballPainter = {
        paint: function (sprite, win) {
            Hg.CircleFill(sprite.x, sprite.y, sprite.r, 1);
        }
    },
    ballToFall = {
        execute: function (sprite, win, time) {
            if (isFall) { sprite.x += 1; } 

            if (sprite.x >= 360) {
                isFall = false; 
            }
        }
    },
    scaleUpBall = {
        execute: function (sprite, win, time) {
            if (isFall) { 
                sprite.r += 0.1; 
                sprite.y += 0.1; 
            } 
        }
    },
    ball = new Sprite("ball", ballPainter, [ ballToFall, scaleUpBall ]);

    var housePainter = {
        paint: function (sprite, win) {
            Hg.SetFillColor(Hg.RGB(250, 230, 190));
            Hg.BoxFill(sprite.x - 10, sprite.y + 5, 50, 30);//小屋
            Hg.SetFillColor(Hg.RGB(180, 150, 100));
            Hg.PolygonFill(3, [sprite.x - 20, sprite.x + 50, sprite.x + 15], [sprite.y + 35, sprite.y + 35, sprite.y + 65], 1);//屋根
            Hg.SetColor("white");
            Hg.BoxFill(sprite.x, sprite.y + 15, 15, 15);//窓
            Hg.Line(sprite.x, sprite.y + 22, sprite.x + 14, sprite.y + 22);//枠
            Hg.Line(sprite.x + 7, sprite.y + 16, sprite.x + 7, sprite.y + 30);
            Hg.SetColor("#93B8CA");
            Hg.SetFillColor("F5F5F5");
        }
    },
    house = new Sprite("house", housePainter, []);

    var humanPainter = {
        paint: function (sprite, win) {
            Hg.SetFillColor("black");
            Hg.BoxFill(ball.x-ball.r-5, 32, 5, 20);
        } 
    },
    human = new Sprite("human", humanPainter, []);

    ball.r = 1;
    ball.x = 32;
    ball.y = 32;

    house.x = 30;
    house.y = 26;


    var scene1 = new Scene();
    scene1.update = function () {
        if (!isFall) {
            setTimeout(function () {
                isFall = true;
                ball.x = 32; 
                ball.y = 32; 
                ball.r = 1;
            }, 2000);
        }
        ball.update(win, 1);
    };
    scene1.draw = function () {
        Hg.Clear();
        Hg.SetWidth(1);
        
        for(var i = 0; i < 200; i++){ //空
            Hg.SetFillColor(Hg.RGB(55+i, 155+i/2, 255));
            Hg.BoxFill(0.0, 205.0, 400.0, 200.0-i);
        }

        Hg.SetWidth(3);
        Hg.SetColor("#93B8CA");
        Hg.SetFillColor("F5F5F5");
        Hg.BoxFill(0, 0, 400, 30, 1); // 地面
        house.paint(win);
        ball.paint(win);
        human.paint(win);
    };
    scene1.start();
}