function selectPatterns() {
  const html = HtmlService.createHtmlOutputFromFile('select_patterns');
  SlidesApp.getUi().showModalDialog(html, "手法選択");
}

function selectPatterns2() {
  const html = HtmlService.createHtmlOutputFromFile('select_patterns2');
  SlidesApp.getUi().showModalDialog(html, "手法選択2");
}

function getPatterns(version) {
  return PATTERNS.filter((pattern) => pattern.version === version).map(pattern => ({
    id: pattern.id,
    name: pattern.name,
  }));
}

function getSupplement() {
  const selection = SlidesApp.getActivePresentation().getSelection();
  const currentPage = selection.getCurrentPage();
  const allocation = new Allocation(currentPage);
  const text = allocation.getCommentText(currentPage);
  return Comment.getSupplement(text);
}

function getEnvironments(pattern_id) {
  const pattern = Pattern.findById(pattern_id);
  return pattern.envChoices;
}

function getScaleText(pattern_id, trend_text) {
  if (pattern_id == '' || trend_text == '') {
    return '';
  }

  return Pattern.findById(pattern_id).getScalePattern(trend_text);
}

function applyScaleText(pattern_id, version, environment, new_env, trend_text, result, supplement) {
  const selection = SlidesApp.getActivePresentation().getSelection();
  const currentPage = selection.getCurrentPage();

  const allocation = new Allocation(currentPage);
  const text = allocation.getCommentText();
  const input = Input.create(pattern_id, version, environment, new_env, trend_text, result, supplement).loadText(text);
  
  allocation.setCommentText(input.getComment().getText());
}

function inputPatterns(){
  const html = HtmlService.createHtmlOutputFromFile('input_patterns');
  SlidesApp.getUi().showModalDialog(html, "手法入力");
}

function fillInput() {
  const selection = SlidesApp.getActivePresentation().getSelection();
  const currentPage = selection.getCurrentPage();
  const allocation = new Allocation(currentPage);
  const text = allocation.getCommentText(currentPage);
  const comment = Comment.createFromText(text);
  return comment.getHash();
}

function applyComment(pattern_text, version, env_text, trend_text, result, supplement) {
  const selection = SlidesApp.getActivePresentation().getSelection();
  const currentPage = selection.getCurrentPage();

  const allocation = new Allocation(currentPage);
  const text = allocation.getCommentText();
  const comment = Comment.createFromText(text);

  allocation.setCommentText(comment.update(pattern_text, version, env_text, trend_text, result, supplement).getText());
}

///////////////////////////////////////////////////////////////////////////////////////////////
function filterPresentation() {
  const html = HtmlService.createHtmlOutputFromFile('dialog');
  SlidesApp.getUi().showModalDialog(html, "抽出したいスライドの検索");
}

function searchSlides(contains) {
  var presentation = SlidesApp.getActivePresentation();
  let slides = presentation.getSlides();

  slides.slice(1).forEach(slide => {
    var shapes = slide.getShapes();
    if (shapes.length >= 3) {
      if (shapes[2].getText().asString().indexOf(contains) !== -1) {
        slide.getBackground().setSolidFill('#274e13');
      }
    }
  });
}

function fixTextBox2() {
  var selection = SlidesApp.getActivePresentation().getSelection();
  var currentPage = selection.getCurrentPage();
  const pageElements = currentPage.getPageElements();

  if (selection.getSelectionType() == SlidesApp.SelectionType.PAGE_ELEMENT) {
    if (pageElements.length !== 0) {
      const slides_num = SlidesApp.getActivePresentation().getSlides().length;
      const shape_top = pageElements[0];
      shape_top.remove();

      const shape_text = pageElements[1];
      shape_text.setTop(0);
      shape_text.setLeft(0);

      shape_text.asShape().getText().setText(slides_num + '. ');
      shape_text.asShape().getText().getTextStyle().setFontSize(12);
    }
  }
}

function allocatePics() {
  var selection = SlidesApp.getActivePresentation().getSelection();
  var currentPage = selection.getCurrentPage();

  if (selection.getSelectionType() == SlidesApp.SelectionType.PAGE_ELEMENT) {
    const slides_num = SlidesApp.getActivePresentation().getSlides().length;
    const allocation = new Allocation(currentPage);
    allocatiosaveRealTraden.allocatePics(slides_num);
  }
}

function sortSlides() {
  const html = HtmlService.createHtmlOutputFromFile('sort_slides');
  SlidesApp.getUi().showModalDialog(html, "並び替えの基準");

  
}

function executeSorting(type, sign) {
  const slides = SlidesApp.getActivePresentation().getSlides();

  let selection = null;
  if(type == '手法') {
    selection = Comment.getPatternName
  } else if(type == '損益') {
    selection = Comment.getResultText
  } else if(type == 'ページ番号') {
    selection = (text) => parseInt(Comment.getPageId(text));
  }

  function readText(slide) {
    try {
      const allocation = new Allocation(slide);
      return selection(allocation.getCommentText());
    } catch (e) {
      throw e;
    }
  }

  const comparison = sign == '昇順' ? (s1, s2) => s1 > s2: (s1, s2) => s1 < s2; 

  let sorted = slides.slice(1, slides.length).sort((s1, s2) => comparison(readText(s1), readText(s2)) ? 1 : -1);
  sorted.forEach((slide, id) => slide.move(id + 1));
}

function triggerAllPicsAllocator() {
  let presentation = SlidesApp.getActivePresentation();
  const ui = SlidesApp.getUi();

  const input = ui.prompt('スクショ配置', '画像が保存されているGoogleドライブのフォルダのURLを入力してください', ui.ButtonSet.OK_CANCEL);

  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const url_drive_id = input.getResponseText().match(/https:\/\/drive.google.com\/drive\/folders\/(.*)$/)[1];
  const service = new AllocateAllPicsService();
  service.setTrigger(url_drive_id, 0, presentation.getId());
}

function allocateAllPics() {
  const service = new AllocateAllPicsService();
  service.execute();
}

function triggerFolderOrganizer() {
  const ui = SlidesApp.getUi();
  const input = ui.prompt('フォルダ仕分け', '画像が保存されているGoogleドライブのフォルダのURLを入力してください', ui.ButtonSet.OK_CANCEL);

  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const url_drive_id = input.getResponseText().match(/https:\/\/drive.google.com\/drive\/folders\/(.*)$/)[1];
  //AllocateAllPicsServiceも終わりにexecuteしている。
  const service = new OrganizeFolderService();
  service.setTrigger(url_drive_id, 0, SlidesApp.getActivePresentation().getId());
}

function organizeFolder() {
  const service = new OrganizeFolderService();
  service.execute();
}

function triggerGeneratePics() {
  const ui = SlidesApp.getUi();
  const input = ui.prompt('画像保存先', '画像を保存するGoogleドライブのフォルダのURLを入力してください', ui.ButtonSet.OK_CANCEL);
  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const url_drive_id = input.getResponseText().match(/https:\/\/drive.google.com\/drive\/folders\/(.*)$/)[1];
  const service = new GeneratePicsService();
  service.setTrigger(url_drive_id, SlidesApp.getActivePresentation().getId(), 1);
}

function generatePics() {
  const service = new GeneratePicsService();
  service.execute();
}

function addPrefix() {
  const ui = SlidesApp.getUi();
  const input = ui.prompt('配番に接頭語を付ける', '配番につけたい接頭語を付けてください。例) usdjpy_2017_ => usdjpy_2017_1', ui.ButtonSet.OK_CANCEL);
  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const prefix = input.getResponseText().trim();
  const presentation = SlidesApp.getActivePresentation();
  presentation.getSlides().slice(1).forEach(slide => {
    const allocation = new Allocation(slide);
    const comment = Comment.createFromText(allocation.getCommentText());

    comment.page_id = comment.page_id.indexOf(prefix) !== -1 ? comment.page_id : prefix + comment.page_id;
    allocation.setCommentText(comment.getText());
  });
}

function saveRealTrade() {
  var selection = SlidesApp.getActivePresentation().getSelection();
  var currentPage = selection.getCurrentPage();

  if (selection.getSelectionType() == SlidesApp.SelectionType.PAGE_ELEMENT) {
    const slides_num = SlidesApp.getActivePresentation().getSlides().length;
    const allocation = new Allocation(currentPage);
    allocation.allocateTradingView(slides_num);
  }
}
