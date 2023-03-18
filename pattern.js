class Pattern {
  constructor(id, version, name, envChoices, scale_pattern) {
    this.id = id;
    this.version = version;
    this.name = name;
    this.envChoices = envChoices;
    this.scale_pattern = scale_pattern;
  }

  static findById(pattern_id) {
    return PATTERNS.find(p => p.id == pattern_id);
  }

  static findByText(pattern_text) {
    return PATTERNS.find(p => p.name == pattern_text);
  }

  getScalePattern(trend_text) {
    const trend_index = SCALES.indexOf(trend_text);
    if(trend_index === -1) {
      return '';
    }
    return this.scale_pattern(Scale.getId(trend_text));
  }

  getPattern(pattern_id) {
    return PATTERNS.find(p => p.id == pattern_id);
  }
}

class Scale {
  static getText(id) {
    if (0 <= id < SCALES.length) {
      return SCALES[id];
    } else {
      return '';
    }
  }

  static getId(text) {
    return SCALES.indexOf(text);
  }
}

const SCALES = ['1s', '5s', '15s', '1m', '5m', '15m', '1h', '4h', '1d'];
const PATTERNS = [
  new Pattern(
    'additional_third_wave',
    'トレンドの起点を下位足から',
    '追撃３波',
    ['レンジホソ期ホソ期っぽい感じ', '上昇からのさらなる一波'],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'thin_soon_down',
    'トレンドの起点を下位足から',
    'ホソ期直下げ',
    ['２派戻し'],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    '3wave_after_thin_with_jumped',
    'トレンドの起点を下位足から',
    'ハネ付きホソ期転換３波',
    ['ホソ期後ハネ期の継続派'],
    (scale_id) => 'ハネ付きホソ期＝' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'conversion_after_descending',
    'トレンドの起点を下位足から',
    'ディセンディング型転換',
    [],
    (scale_id) => 'ホソ期＝' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'conversion_in_thin',
    'トレンドの起点を下位足から',
    'ホソ期内部反転',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 3)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'h&s_continuation',
    'トレンドの起点を下位足から',
    '継続三尊',
    ['ホソ期のこぶ'],
    (scale_id) => '形＝' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'conversion_after_end_thick',
    'トレンドの起点を下位足から',
    'ハネ期終わりの転換',
    ['ホソ期後ハネ期の継続派'],
    (scale_id) => 'ハネ期＝' + Scale.getText(scale_id + 2)
      + '　内部ホソ期＝' + Scale.getText(scale_id)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'zigzag_of_thin_end',
    'トレンドの起点を下位足から',
    'ホソ期終点ジグザグ',
    [],
    (scale_id) => '形＝' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),

    new Pattern(
    'follow_thin_thin',
    'トレンドの起点を下位足から',
    '順張りホソ期ホソ期',
    ['レンジ中からの飛び出し'],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'time_passed_conversion',
    'トレンドの起点を下位足から',
    '時間経過による転換',
    [],
    (scale_id) => '形＝' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'range_thin_under2_conv',
    'トレンドの起点を下位足から',
    'レンジ後二つ下',
    ['ホソ期終点レンジ後', 'ハネ期終点レンジ後'],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'back_back_after_drop',
    'トレンドの起点を下位足から',
    '大きな下げの後の調整の調整',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2) + 'ー' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'big_thick_back',
    'トレンドの起点を下位足から',
    '大きなハネ期の逆行',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 3)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'range_thin_thin',
    'トレンドの起点を下位足から',
    'レンジ後ホソ期ホソ期',
    [],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'low_bar_of_3waves',
    'トレンドの起点を下位足から',
    '転換３波の下位足',
    ['ハネ付きホソ期転換３波'],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　レンジ＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'thin_3wave_after_range',
    'トレンドの起点を下位足から',
    'ホソ期後レンジ３波',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　レンジ＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'thin_3wave_after_range2',
    'トレンドの起点を下位足から',
    'ホソ期後レンジ３波2',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　レンジ＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'conversion_after_jump',
    'トレンドの起点を下位足から',
    'ハネた後の転換',
    [],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 3)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'first_thin_in_thin',
    'トレンドの起点を下位足から',
    'ホソ期転換内ホソ期',
    ['上位足継続の５波目', 'レンジの二つ下からの上昇'],
    (scale_id) => 'ホソ期＝' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1)
  ),
    new Pattern(
    'thin_range_down',
    'トレンドの起点を下位足から',
    'ホソ期レンジ下げ',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id + 2) + 'ー' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id),
  ),
    new Pattern(
    '3rd_expansion',
    'トレンドの起点を下位足から',
    '３段加速',
    [],
    (scale_id) => '形＝' + Scale.getText(scale_id + 3)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    '3rd_jump_after_thin',
    'トレンドの起点を下位足から',
    'ホソ期後ハネ期３波',
    [],
    (scale_id) => '形＝' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
    new Pattern(
    'expansion_from_range',
    'トレンドの起点を下位足から',
    'レンジ内部からの継続',
    [],
    (scale_id) => 'レンジ＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
  ///////////////////////////////////////////////
    new Pattern(
    '3-3波',
    '低負荷型',
    '3-3波',
    [],
    null,
  ),
    new Pattern(
    '５波目からのカウンター',
    '低負荷型',
    '５波目からのカウンター',
    [],
    null,
  ),
    new Pattern(
    'ジグザグ転換',
    '低負荷型',
    'ジグザグ転換',
    [],
    null,
  ),
    new Pattern(
    '伸びた後のレンジ狙い',
    '低負荷型',
    '伸びた後のレンジ狙い',
    [],
    null,
  ),
    new Pattern(
    '足場継続３波',
    '低負荷型',
    '足場継続３波',
    [],
    null,
  ),
    new Pattern(
    '単一転換への逆張り',
    '低負荷型',
    '単一転換への逆張り',
    [],
    null,
  ),
    new Pattern(
    'ハネ期後',
    '低負荷型',
    'ハネ期後',
    [],
    null,
  ),
    new Pattern(
    'トレンド内の逆行からの調整狙い',
    '低負荷型',
    'トレンド内の逆行からの調整狙い',
    [],
    null,
  ),
    new Pattern(
    '伸びレンジ下げ',
    '低負荷型',
    '伸びレンジ下げ',
    [],
    null,
  ),
];

const ENVIRONMENTS = [
  '上位足継続の５波目',
  'レンジの二つ下からの上昇',
  '上位足継続の５波目',
  'レンジの二つ下からの上昇',
  'レンジホソ期ホソ期っぽい感じ',
  '上昇からのさらなる一波',
  'レンジ後レンジ後レンジ',
  'ホソ期終点レンジ後',
  'ハネ期終点レンジ後',
  '大きな下げの後の調整の調整',
  '２派戻し',
  'ホソ期のこぶ',
];

