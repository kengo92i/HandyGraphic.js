handyGraphic.globalize();
window.onload = function () {
    var Hg = new Graphic(); 
    var win = Hg.Open(400, 400);

    var i = 0,
        w = 100,
        h = 40;

    for (i = 1; i <= 12; ++i) {
        w -= 4;
        h += 4;
        Hg.Box(i * 28 - 10, i * 20 + 20, w, h);
    }
}