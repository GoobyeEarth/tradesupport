const test = new UnitTestingApp();
test.runInGas(true);
test.enable();

function tests_all() {
  file_service();
  comment();
  api();
  input();
  comment();
}

function wip()  {
}

function file_service() {
  service = new TriggerService('test', 'test');
  test.assert(() => '{"test":"test","lib_name":"Tradesupport","closure_name":"test"}' === service.getPropsJson({test: 'test'}), 'getPropsJson');
}

function api() {
  test.printHeader('API test');
  console.log(getPatterns().length);
  test.assert(() => getPatterns('トレンドの起点を下位足から').length == 23, 'getPatterns()');
}

function comment() {
  const text = `3. レンジ後ホソ期2つ下
version: トレンドの起点を下位足から
環境認識: ホソ期終点レンジ後
スケール: レンジ＝ 15m　転換＝1m
トレンド: 5m
利益判定: プラス
コメント
`;

  test.printHeader('Comment テスト');
  test.assert(() => Comment.getEnvironment(text) === 'ホソ期終点レンジ後', 'getEnvironment()')

  const comment = Comment.createFromText(text);
  test.assert(() => '3' === comment.page_id, 'page_id');
  test.assert(() => 'レンジ後ホソ期2つ下' === comment.pattern_name, 'pattern_name');
  test.assert(() => 'レンジ＝ 15m　転換＝1m' === comment.scale_text, 'scale_text');
  test.assert(() => 'ホソ期終点レンジ後' === comment.environment, 'environment');
  test.assert(() => '5m' === comment.trend_text, 'trend_text');
  test.assert(() => 'プラス' === comment.result, 'result');
  test.assert(() => "コメント\n" === comment.supplement, 'supplement');
  test.assert(() => 'レンジ後ホソ期2つ下' == comment.getRow()[1], 'getRow()[1]');
}

function input() {
  (() => {
    test.printHeader('Input テスト');
    const input = Input.create('thin_3wave_after_range', 'トレンドの起点を下位足から', 'なし', '', '15m', 'プラス', 'サプリメント')
    input.page_id = '1';
    test.assert(() => input.getComment().getText() == 
`1. ホソ期後レンジ３波
version: トレンドの起点を下位足から
環境認識: なし
スケール: ホソ期＝ 4h　レンジ＝ 4h　転換＝15mー5m
トレンド: 15m
利益判定: プラス
サプリメント`, 'thin_3wave_after_range');
  })();
}
