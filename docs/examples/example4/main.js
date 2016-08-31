handyGraphic.globalize();
window.onload = function () {
    var Hg = new Graphic(); 
    var win = Hg.Open(400, 400);

    Hg.SetWidth(3);
    Hg.SetColor("363947");
    Hg.SetFillColor("#40AAEF");

    Hg.Box(10, 70, 80, 50);
    Hg.BoxFill(10, 160, 80, 50);
    Hg.BoxFill(10, 260, 80, 50, 1);

    Hg.SetFillColor("363947");
    Hg.SetFont('ＭＳ Ｐゴシック', 14);
    Hg.Text(100, 90, "Hg.Box(10, 10, 50, 50) // 線だけの図形")
    Hg.Text(100, 180, "Hg.BoxFill(10, 100, 100, 50) // 塗りつぶし図形")
    Hg.Text(100, 280, "Hg.BoxFill(10, 200, 100, 50, 1) // 枠線あり")

    Hg.SetFont('ＭＳ Ｐゴシック', 25);
    Hg.Text(100, 360, "= 図形の描き方 =")

}