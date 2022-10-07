class Comment {
  constructor(page_id, pattern, environment, trend_text, result, supplement) {
    this.page_id = page_id;
    this.pattern = pattern;
    this.environment = environment;
    this.trend_text = trend_text;
    this.result = result;
    this.supplement = supplement;
  }

  static create(page_id, pattern, environment, trend_text, result, supplement) {
    return new Comment(page_id, pattern, environment, trend_text, result, supplement);
  }

  static createResetFromText(text) {
    return new Comment(Comment.getPageId(text), null, '', '', '', Comment.getSupplement(text));
  }

  static createFromText(text) {
    return new Comment(
      Comment.getPageId(text),
      Pattern.findByText(Comment.getPatternText(text)),
      Comment.getEnvironment(text),
      Comment.getTrendText(text),
      Comment.getResultText(text),
      Comment.getSupplement(text)
    )
  }

  updatePattern(pattern, environment, trend_text, result) {
    this.pattern = pattern;
    this.environment = environment;
    this.trend_text = trend_text;
    this.result = result;
  }

  getText() {
    const pattern_name = this.pattern == null ? '' : this.pattern.name;
    const pattern_text = this.pattern == null ? '' : this.pattern.getScalePattern(this.trend_text);

    return this.page_id + '. ' + pattern_name + "\n"
      + '環境認識: ' + this.environment + "\n"
      + 'スケール: ' + pattern_text + "\n"
      + 'トレンド: ' + this.trend_text + "\n"
      + '利益判定: ' + this.result + "\n"
      + this.supplement;
  }

  getRow() {
    const pattern_name = this.pattern == null ? '' : this.pattern.name;
    const pattern_text = this.pattern == null ? '' : this.pattern.getScalePattern(this.trend_text);

    return [
      this.page_id,
      pattern_name,
      this.environment,
      pattern_text,
      this.trend_text,
      this.result,
      this.supplement.trim(),
    ];
  }

  static getPageId(text) {
    return text.split("\n")[0].split('.')[0]
  }

  static getPatternText(text) {
    return text.split("\n")[0].split('.')[1].trim();
  }

  static getEnvironment(text) {
    return text.split("\n")[1].replace('環境認識:', '').trim();
  }

  static getTrendText(text) {
    return text.split("\n")[3].replace('トレンド:', '').trim();
  }

  static getResultText(text) {
    return text.split("\n")[4].replace('利益判定:', '').trim();
  }

  static getSupplement(text) {
    const arr = text.split("\n");
    return arr.slice(5, arr.length).join("\n");
  }
};