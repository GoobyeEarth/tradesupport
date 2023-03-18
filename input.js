class Input {
  constructor(page_id, version, pattern_id, environment, new_env, trend_text, result, supplement) {
    this.page_id = page_id;
    this.version = version;
    this.pattern_id = pattern_id;
    this.environment = environment;
    this.new_env = new_env;
    this.trend_text = trend_text;
    this.result = result;
    this.supplement = supplement;
  }

  loadText(text) {
    this.page_id = Comment.getPageId(text);
    return this;
  }

  static create(pattern_id, version, environment, new_env, trend_text, result, supplement) {
    return new Input(null, version, pattern_id, environment, new_env, trend_text, result, supplement);
  }

  getComment() {
    const pattern = Pattern.findById(this.pattern_id);
    return Comment.create(
      this.page_id,
      pattern == null ? '' : pattern.name,
      this.version,
      this.environment == '新規' ? this.new_env : this.environment,
      pattern == null ? '' : pattern.getScalePattern(this.trend_text),
      this.trend_text,
      this.result,
      this.supplement
    );
  }

}