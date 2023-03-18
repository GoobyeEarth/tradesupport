function slideRoutes() {
  const ui = SlidesApp.getUi();
  const menu1 = ui.createMenu("配置");

  menu1.addItem("スクショを配置", "Tradesupport.allocatePics");
  menu1.addItem("テキストボックス調整", "Tradesupport.fixTextBox2");
  menu1.addItem("スクショ一気に配置", 'Tradesupport.triggerAllPicsAllocator');
  menu1.addItem("フォルダ配置からスクショまで", 'Tradesupport.triggerFolderOrganizer');
  
  menu1.addItem("画像生成", 'Tradesupport.triggerGeneratePics');
  menu1.addItem('接頭語を付与', 'Tradesupport.addPrefix');
  menu1.addItem('TradingView貼り付け', 'Tradesupport.saveRealTrade');

  menu1.addToUi();

  const menu2 = ui.createMenu('仕分けツール');
  menu2.addItem("手法選択", "Tradesupport.selectPatterns");
  menu2.addItem("手法選択2", "Tradesupport.selectPatterns2");
  menu2.addItem("手法テキスト入力", "Tradesupport.inputPatterns");
  menu2.addItem("フィルター", "Tradesupport.filterPresentation");
  menu2.addItem("並び替え", "Tradesupport.sortSlides");
  menu2.addToUi();
}

function sheetRoutes() {
  const ui = SpreadsheetApp.getUi();

  const menu = ui.createMenu("検証用");
  menu.addItem("スライドを読み込む",'Tradesupport.readSlide');
  menu.addToUi();
}

