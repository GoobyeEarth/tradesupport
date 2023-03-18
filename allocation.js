class Allocation {
  constructor(slide) {
    this.slide = slide;
    this.WIDTH = 360;
    this.SLIDE_HEIGHT = 540;
    this.SLIDE_WIDTH = 720;
  }

  allocatePics(slides_num, picsNo = '', fileNo = '') {
    const pageElements = this.slide.getPageElements();
    if (pageElements.length !== 0) {
      const common_height = this.WIDTH * pageElements[4].getHeight() / pageElements[4].getWidth();

      this.addStamp(pageElements, slides_num, picsNo, fileNo);
      this.allocateComment(pageElements, slides_num, );

      let order_blank = 2;
      // 1d
      const shape1 = pageElements[order_blank++];
      const width1 = 200;
      const height1 = width1 * shape1.getHeight() / shape1.getWidth();
      shape1.setWidth(width1);
      shape1.setHeight(height1);
      shape1.setLeft(520);
      shape1.setTop(this.SLIDE_HEIGHT - common_height * 2 - height1 * 2);

      // 4h
      const shape5 = pageElements[order_blank++];
      const width5 = 200;
      const height5 = width5 * shape5.getHeight() / shape5.getWidth();
      shape5.setWidth(width5);
      shape5.setHeight(height5);
      shape5.setLeft(520);
      shape5.setTop(this.SLIDE_HEIGHT - common_height * 2 - height5);

      // 1h
      const shape = pageElements[order_blank++];
      const height = this.WIDTH * shape.getHeight() / shape.getWidth();
      shape.setWidth(this.WIDTH);
      shape.setHeight(height);
      shape.setLeft(0);
      shape.setTop(this.SLIDE_HEIGHT - common_height * 2);

      // 15m
      const shape2 = pageElements[order_blank++];
      const height2 = this.WIDTH * shape2.getHeight() / shape2.getWidth();
      shape2.setWidth(this.WIDTH);
      shape2.setHeight(height2);
      shape2.setLeft(this.WIDTH);
      shape2.setTop(this.SLIDE_HEIGHT - common_height * 2);

      // 5m
      const shape3 = pageElements[order_blank++];
      const height3 = this.WIDTH * shape3.getHeight() / shape3.getWidth();
      shape3.setWidth(this.WIDTH);
      shape3.setHeight(height3);
      shape3.setLeft(0);
      shape3.setTop(this.SLIDE_HEIGHT - common_height * 1);

      // 1m
      const shape4 = pageElements[order_blank++];
      const height4 = this.WIDTH * shape4.getHeight() / shape4.getWidth();
      shape4.setWidth(this.WIDTH);
      shape4.setHeight(height4);
      shape4.setLeft(this.WIDTH);
      shape4.setTop(this.SLIDE_HEIGHT - common_height * 1);
    }
  }

  allocateTradingView(slides_num, picsNo = '', fileNo = '') {
    const pageElements = this.slide.getPageElements();

    if (pageElements.length !== 0) {
      const input = SlidesApp.getUi().prompt('フォルダ仕分け', '画像が保存されているGoogleドライブのフォルダのURLを入力してください' + pageElements.length, SlidesApp.getUi().ButtonSet.OK_CANCEL);
      const common_height = this.WIDTH * pageElements[2].getHeight() / pageElements[2].getWidth();
      this.addStamp(pageElements, slides_num, picsNo, fileNo);
      

      this.allocateComment(pageElements, slides_num, common_height);


      const shape = pageElements[2];
      shape.setTop(this.SLIDE_HEIGHT - shape.getHeight());
    }
  }

  addStamp(pageElements, slides_num, picsNo, fileNo) {
      const title = SlidesApp.getActivePresentation().getName();
      const now = new Date();
      const text_shape = this.slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 0, this.SLIDE_HEIGHT, this.SLIDE_WIDTH, 200)
      text_shape.getText()
        .setText(title + "\n" + slides_num + "\n" + now + "\n" + picsNo + '_' + fileNo)
        .getTextStyle()
        .setForegroundColor("#999999")
        .setFontSize(9);

      const shape_top = pageElements[0];
      shape_top.setTop(300);
  }

  allocateComment(pageElements, slides_num, common_height) {
      // Text box
      const shape_text = pageElements[1];
      shape_text.setTop(0);
      shape_text.setLeft(0);
      shape_text.setHeight(this.SLIDE_HEIGHT - common_height * 2);
      shape_text.setWidth(520);
      shape_text.bringToFront();

      shape_text.asShape().getText().setText(Comment.create(slides_num, '', '', '', '', '', '', '').getText());
      shape_text.asShape().getText().getTextStyle().setFontSize(12);
      shape_text.asShape().getText().getParagraphStyle().setSpacingMode(SlidesApp.SpacingMode.NEVER_COLLAPSE).setLineSpacing(100).setSpaceBelow(5);
  }

  getCommentText() {
    const elements = this.slide.getPageElements();
    const element = elements[elements.length - 2];

    return element.asShape().getText().asString();
  }

  setCommentText(text) {
    const elements = this.slide.getPageElements();
    const element = elements[elements.length - 2];

    element.asShape().getText().setText(text);
  }
}