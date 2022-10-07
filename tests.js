function tests() {
  const test = new UnitTestingApp();
  test.runInGas(true);
  test.enable();

  const text = `3. レンジ後ホソ期2つ下
環境認識: ホソ期終点レンジ後
スケール: レンジ＝ 15m　転換＝1m
トレンド: 5m
利益判定: プラス
`;
  const comment = Comment.createFromText(text);

  test.assert(() => '3' === comment.page_id, 'page_id');
  test.assert(() => 'range_thin_under2_conv' === comment.pattern.id, 'pattern_id');
  test.assert(() => 'レンジ後ホソ期2つ下' === comment.pattern.name, 'pattern_name');
  test.assert(() => 'レンジ＝ 15m　転換＝1m' === comment.pattern.getScalePattern(comment.trend_text), 'scale_text');
  test.assert(() => 'ホソ期終点レンジ後' === comment.environment, 'environment');
  test.assert(() => '5m' === comment.trend_text, 'trend_text');
  test.assert(() => 'プラス' === comment.result, 'result');
  test.assert(() => '' === comment.supplement, 'supplement');
  test.assert(
    () => 'レンジ後ホソ期2つ下' == comment.getRow()[1], 'getRow()[1]')
}


