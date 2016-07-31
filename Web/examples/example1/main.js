handyGraphic.globalize(); // handyGraphic.jsをグローバル展開する
window.onload = function () {
  var Hg = new Graphic(); // Graphicオブジェクトを作成する
  var win = Hg.Open(400, 400); // 描画するウィンドウを作成する

  Hg.Line(100, 100, 300, 300); // 直線の描画
  Hg.Circle(150, 150, 100); // 円の描画
  Hg.Text(10, 380, "HandyGraphic"); // 文字の表示
}