class Comment {
  constructor(page_id, pattern_name, version, environment, scale_text, trend_text, result, supplement) {
    this.page_id = page_id;
    this.pattern_name = pattern_name;
    this.version = version;
    this.scale_text = scale_text;
    this.environment = environment;
    this.trend_text = trend_text;
    this.result = result;
    this.supplement = supplement;
  }

  static create(page_id, pattern_name, version, environment, scale_text, trend_text, result, supplement){
    return new Comment(page_id, pattern_name, version, environment, scale_text, trend_text, result, supplement);
  }

  static createFromText(text) {
    return new Comment(
      Comment.getPageId(text),
      Comment.getPatternName(text),
      Comment.getVersion(text),
      Comment.getEnvironment(text),
      Comment.getScaleText(text),
      Comment.getTrendText(text),
      Comment.getResultText(text),
      Comment.getSupplement(text)
    )
  }

  update(pattern_name, version, environment, trend_text, result, supplement){
    this.pattern_name = pattern_name;
    this.version = version;
    this.environment = environment;
    this.trend_text = trend_text;
    this.result = result;
    this.supplement = supplement;
    return this;
  }

  getText() {
    return this.page_id + '. ' + this.pattern_name + "\n"
      + 'version: ' + this.version + "\n"
      + '環境認識: ' + this.environment + "\n"
      + 'スケール: ' + this.scale_text + "\n"
      + 'トレンド: ' + this.trend_text + "\n"
      + '利益判定: ' + this.result + "\n"
      + this.supplement;
  }

  getRow() {
    return [
      this.page_id,
      this.pattern_name,
      this.version,
      this.environment,
      this.scale_text,
      this.trend_text,
      this.result,
      this.supplement.trim(),
    ];
  }

  getHash() {
    return {
      pattern_name: this.pattern_name,
      version: this.version,
      environment: this.environment,
      scale_text: this.scale_text,
      trend_text: this.trend_text,
      result: this.result,
      supplement: this.supplement,
    }
  }

  static detectEnvironment(environment, new_env) {
    return environment == '新規' ? new_env : environment;
  }

  static getPageId(text) {
    return text.split("\n")[0].split('.')[0]
  }

  static getPatternName(text) {
    return text.split("\n")[0].split('.')[1].trim();
  }

  static getVersion(text) {
    return text.split("\n").find(text => text.includes('version:')).replace('version:', '').trim();
  }

  static getEnvironment(text) {
    return text.split("\n").find(text => text.includes('環境認識:')).replace('環境認識:', '').trim();
  }

  static getScaleText(text) {
    return text.split("\n").find(text => text.includes('スケール:')).replace('スケール:', '').trim();
  }

  static getTrendText(text) {
    return text.split("\n").find(text => text.includes('トレンド:')).replace('トレンド:', '').trim();
  }

  static getResultText(text) {
    return text.split("\n").find(text => text.includes('利益判定:')).replace('利益判定:', '').trim();
  }

  static getSupplement(text) {
    const arr = text.split("\n");
    return arr.slice(6, arr.length).join("\n");
  }
};
