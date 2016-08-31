YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "handyGraphic.Graphic",
        "handyGraphic.Scene",
        "handyGraphic.Sprite",
        "handyGraphic.Util",
        "handyGraphic.Window",
        "handyGraphic.globalize"
    ],
    "modules": [
        "handyGraphic"
    ],
    "allModules": [
        {
            "displayName": "handyGraphic",
            "name": "handyGraphic",
            "description": "グラフィックスライブラリ HandyGraphic.js\n\n基本的に，各APIのサンプルコードは以下のテンプレートを前提にしています．\nまた，動作に必要な変数宣言などを省略している場合もあるので，ご了承ください．\n\n```\nhandyGraphic.globalize(); // handyGraphic.jsをグローバル展開する\nwindow.onload = function () {\n  var Hg = new Graphic(); // Graphicオブジェクトを作成する\n  var win = Hg.Open(400, 400); // 描画するウィンドウを作成する\n\n  // 以降に処理を書いていきます．\n  // 図形の描画，Scene，Spriteの作成など\n}\n```"
        }
    ],
    "elements": []
} };
});