handyGraphic.globalize();
window.onload = function () {
    var Hg = new Graphic(); 
    var win = Hg.Open(400, 400);

    var scene1 = new Scene({t : 0}); // 初めのシーン
    scene1.awake = function () {
        this.t = 0; // 起動時の処理
    };
    scene1.update = function () {
        this.t += 1; // 更新処理
        if (this.t >= 200) {
            this.nextScene(scene2); // シーン遷移
        }
    };
    scene1.draw = function () {
        Hg.Clear();
        Hg.Box(this.t, this.t, 10, 10); 
    };

    var scene2 = new Scene({t : 0}); // 次のシーン
    scene2.awake = function () {
        this.t = 0; // 起動時の処理
    };
    scene2.update = function () {
        this.t += 1; // 更新処理
        if (this.t >= 200) {
            this.nextScene(scene1); // シーン遷移
        }
    };
    scene2.draw = function () {
        Hg.Clear();
        Hg.Circle(200, 200, 10); 
    };
    
    scene1.start(); // シーンの起動
}