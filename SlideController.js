function selectPatterns() {
  const html = HtmlService.createHtmlOutputFromFile('select_patterns');
  SlidesApp.getUi().showModalDialog(html, "手法選択");
}

function getPatterns() {
  return PATTERNS.map(pattern => ({
    id: pattern.id,
    name: pattern.name,
  }));
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

function applyScaleText(pattern_id, environment, result, trend_text) {
  const selection = SlidesApp.getActivePresentation().getSelection();
  const currentPage = selection.getCurrentPage();
  const element = currentPage.getPageElements()[8];
  const text = element.asShape().getText().asString();

  const ptn = Pattern.findById(pattern_id);
  const comment = Comment.createResetFromText(text);
  comment.updatePattern(ptn, environment, result, trend_text);
  element.asShape().getText().setText(comment.getText());
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

function myFunction2() {
  var selection = SlidesApp.getActivePresentation().getSelection();
  var currentPage = selection.getCurrentPage();

  if (selection.getSelectionType() == SlidesApp.SelectionType.PAGE_ELEMENT) {
    const slides_num = SlidesApp.getActivePresentation().getSlides().length;
    allocatePics(currentPage, slides_num);
  }
}

function sortSlides() {
  const slides = SlidesApp.getActivePresentation().getSlides();

  function readText(slide) {

    try {
      const elements = slide.getPageElements();
      const text = elements[8].asShape().getText().asString();
      return Comment.getPatternText(text);
    } catch (e) {
      throw e;
    }
  }

  let sorted = slides.slice(1, slides.length).sort((s1, s2) => readText(s1) < readText(s2) ? 1 : -1);
  sorted.forEach((slide, id) => slide.move(id + 1));
}


function sortFiles(files) {
  let sorted = [];
  while (files.hasNext()) {
    let file = files.next();
    if (!file.getMimeType().match(/image/)) {
      continue;
    }
    const number = file.getName().slice(7, 12)
    sorted.push({id: number, file: file});
  }


  sorted.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }

    if (a.id > b.id) {
      return 1;
    }

    return 0;
  });

  return sorted;
}

function allocateAllPics() {
  let presentation = SlidesApp.getActivePresentation();
  const currentPage = presentation.getSelection().getCurrentPage();
  const ui = SlidesApp.getUi();

  const input = ui.prompt('スクショ配置', '画像が保存されているGoogleドライブのフォルダのURLを入力してください', ui.ButtonSet.OK_CANCEL);

  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const url_drive_id = input.getResponseText().match(/https:\/\/drive.google.com\/drive\/folders\/(.*)$/)[1];

  const folder = DriveApp.getFolderById(url_drive_id);
  const files = folder.getFiles();

  const sorted = sortFiles(files);

  let pagePicsNum = 0;

  let slidePointer = currentPage;
  sorted.forEach(fp => {
    pagePicsNum++;

    slidePointer.insertImage(fp.file.getBlob());
    if (pagePicsNum === 6) {
      const number = fp.file.getName().slice(7, 12)
      allocatePics(slidePointer, presentation.getSlides().length, number, folder.getName());
      slidePointer = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
      pagePicsNum = 0;
    }
  });
}

function organaizeFolder() {
  const ui = SlidesApp.getUi();

  const input = ui.prompt('フォルダ仕分け', '画像が保存されているGoogleドライブのフォルダのURLを入力してください', ui.ButtonSet.OK_CANCEL);

  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const url_drive_id = input.getResponseText().match(/https:\/\/drive.google.com\/drive\/folders\/(.*)$/)[1];

  const folder = DriveApp.getFolderById(url_drive_id);
  const files = sortFiles(folder.getFiles());

  let count = 0;
  let child = null;
  files.forEach(fp => {
    if (count % 60 === 0) {
      child = folder.createFolder('divided_' + String(count / 60));
    }

    fp.file.moveTo(child);

    count++;
  });
}

