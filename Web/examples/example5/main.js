handyGraphic.globalize();
window.onload = function () {
    var Hg = new Graphic(); 
    var win = Hg.Open(400, 400);

    var isFall = true,
    ballPainter = {
        paint: function (sprite, win) {
            Hg.CircleFill(sprite.x, sprite.y, 20);
        }
    },
    ballToFall = {
        execute: function (sprite, win, time) {
            if (isFall) { sprite.y -= 2; } 

            if (sprite.y <= 50) {
                isFall = false; 
            }
        }
    },
    ball = new Sprite("ball", ballPainter, [ ballToFall ]);

    ball.x = 150;
    ball.y = 400;

    var scene1 = new Scene();
    scene1.update = function () {
        if (!isFall) {
            setTimeout(function () {
                isFall = true;
                ball.y = 400; 
            }, 2000);
        }
        ball.update(win, 1);
    };
    scene1.draw = function () {
        Hg.Clear();
        Hg.BoxFill(0, 0, 400, 30);
        ball.paint(win);
    };
    scene1.start();
}