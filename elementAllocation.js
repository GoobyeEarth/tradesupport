function allocatePics(slideOrPage, slides_num, picsNo = '', fileNo = '') {
  const WIDTH = 360;
  const SLIDE_HEIGHT = 540;
  const SLIDE_WIDTH = 720;

  const pageElements = slideOrPage.getPageElements();
  if (pageElements.length !== 0) {
    const common_height = WIDTH * pageElements[4].getHeight() / pageElements[4].getWidth();
    const title = SlidesApp.getActivePresentation().getName();
    const now = new Date();

    // add stamp
    const text_shape = slideOrPage.insertShape(SlidesApp.ShapeType.TEXT_BOX, 0, SLIDE_HEIGHT, SLIDE_WIDTH, 200)
    text_shape.getText()
      .setText(title + "\n" + slides_num + "\n" + now + "\n" + picsNo + '_' + fileNo)
      .getTextStyle()
      .setForegroundColor("#999999")
      .setFontSize(9);

    const shape_top = pageElements[0];
    shape_top.setTop(300);

    // Text box
    const shape_text = pageElements[1];
    shape_text.setTop(0);
    shape_text.setLeft(0);
    shape_text.setHeight(SLIDE_HEIGHT - common_height * 2);
    shape_text.setWidth(520);
    shape_text.bringToFront();

    shape_text.asShape().getText().setText(Comment.create(slides_num, null, '', '', '').getText());
    shape_text.asShape().getText().getTextStyle().setFontSize(12);
    let order_blank = 2;

    // 1d
    const shape1 = pageElements[order_blank++];
    const width1 = 200;
    const height1 = width1 * shape1.getHeight() / shape1.getWidth();
    shape1.setWidth(width1);
    shape1.setHeight(height1);
    shape1.setLeft(520);
    shape1.setTop(SLIDE_HEIGHT - common_height * 2 - height1 * 2);

    // 4h
    const shape5 = pageElements[order_blank++];
    const width5 = 200;
    const height5 = width5 * shape5.getHeight() / shape5.getWidth();
    shape5.setWidth(width5);
    shape5.setHeight(height5);
    shape5.setLeft(520);
    shape5.setTop(SLIDE_HEIGHT - common_height * 2 - height5);

    // 1h
    const shape = pageElements[order_blank++];
    const height = WIDTH * shape.getHeight() / shape.getWidth();
    shape.setWidth(WIDTH);
    shape.setHeight(height);
    shape.setLeft(0);
    shape.setTop(SLIDE_HEIGHT - common_height * 2);

    // 15m
    const shape2 = pageElements[order_blank++];
    const height2 = WIDTH * shape2.getHeight() / shape2.getWidth();
    shape2.setWidth(WIDTH);
    shape2.setHeight(height2);
    shape2.setLeft(WIDTH);
    shape2.setTop(SLIDE_HEIGHT - common_height * 2);

    // 5m
    const shape3 = pageElements[order_blank++];
    const height3 = WIDTH * shape3.getHeight() / shape3.getWidth();
    shape3.setWidth(WIDTH);
    shape3.setHeight(height3);
    shape3.setLeft(0);
    shape3.setTop(SLIDE_HEIGHT - common_height * 1);

    // 1m
    const shape4 = pageElements[order_blank++];
    const height4 = WIDTH * shape4.getHeight() / shape4.getWidth();
    shape4.setWidth(WIDTH);
    shape4.setHeight(height4);
    shape4.setLeft(WIDTH);
    shape4.setTop(SLIDE_HEIGHT - common_height * 1);
  }
}

