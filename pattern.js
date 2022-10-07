class Pattern {
  constructor(id, name, envChoices, scale_pattern) {
    this.id = id;
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
    'first_thin_in_thin',
    'ホソ期転換内ホソ期',
    ['上位足継続の５波目', 'レンジの二つ下からの上昇'],
    (scale_id) => 'ホソ期＝' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1)
  ),
  new Pattern(
    'conversion_in_thin',
    'ホソ期内部反転',
    ['上位足継続の５波目', 'レンジの二つ下からの上昇'],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 3)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'thin_range_down',
    'ホソ期レンジ下げ',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id + 2) + 'ー' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id),
  ),
  new Pattern(
    'follow_thin_thin',
    '順張りホソ期ホソ期',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id) + 'ー' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'big_thick_back',
    '大きなハネ期の逆行',
    [],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 4)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'range_thin_thin',
    'レンジ後ホソ期ホソ期',
    [],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'range_thin_under2_conv',
    'レンジ後ホソ期2つ下',
    ['ホソ期終点レンジ後'],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 1)
      + '　転換＝' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'range_after_range',
    'レンジ後レンジ',
    ['レンジ後'],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id),
  ),
  new Pattern(
    'conversion_after_jump',
    'ハネた後の転換',
    [],
    (scale_id) => 'レンジ＝ ' + Scale.getText(scale_id + 3)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
  ),
  new Pattern(
    'additional_third_wave',
    '追撃３波',
    ['レンジホソ期ホソ期っぽい感じ', '上昇からのさらなる一波'],
    (scale_id) => 'ホソ期＝ ' + Scale.getText(scale_id + 2)
      + '　転換＝' + Scale.getText(scale_id + 1) + 'ー' + Scale.getText(scale_id - 1),
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
  'ホソ期終点レンジ後'
];

