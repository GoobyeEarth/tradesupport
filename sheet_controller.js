var _prop = {
  get_profit: function (target_list, leverage) {
    var profit = 1;
    target_list.forEach((target) => {
        profit *= !isNaN(target) ? 1 + target * leverage : 1;
      }
    );

    return profit;
  },
  compare_profit: function (target_list, start_leverage, limit_leverage) {
    compare1_leverage = (start_leverage + limit_leverage) / 2;
    compare2_leverage = (compare1_leverage + limit_leverage) / 2;

    for (var i = 0; i < 100; i++) {
      if (_prop.get_profit(target_list, compare1_leverage) < _prop.get_profit(target_list, compare2_leverage)) {
        start_leverage = compare1_leverage;
        compare1_leverage = compare2_leverage;
        compare2_leverage = (compare1_leverage + limit_leverage) / 2;
      } else {
        limit_leverage = compare2_leverage;
        break;
      }
    }

    return [start_leverage, limit_leverage];
  }
};

// 最大レバレッジの計算
function MAX_LEVERAGE(target_list, loop = 20) {
  target_list = target_list.filter(target => target[0] !== "" && isFinite(target));
  target_list = target_list.map(target => isFinite(target) ? parseFloat(target) : NaN);

  var min = target_list.reduce((acc, target) => {
    return (!isNaN(target) && acc > target) ? target : acc;
  });

  var start_leverage = 0;
  var limit_leverage = -1 / min;

  for (var i = 0; i < loop; i++) {
    [start_leverage, limit_leverage] = _prop.compare_profit(target_list, start_leverage, limit_leverage);
  }

  return start_leverage;
}

function readSlide() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const input = ui.prompt('URLを入力してください', 'スライドのURLを入力してください', ui.ButtonSet.OK_CANCEL);
  if (input.getSelectedButton() == ui.Button.CANCEL) {
    return;
  }

  const presentation = SlidesApp.openByUrl(input.getResponseText());

  const values = presentation.getSlides().slice(1).map(slide => {
    try {
      const allocation = new Allocation(slide);
      const comment = Comment.createFromText(allocation.getCommentText());
      return comment.getRow();
    } catch(e) {
      return ['', 'error', e, '', '', '', '', '',];
    }
  });

  const rangeText = 'A2:H' + (values.length + 1);
  sheet.getRange(rangeText).setValues(values);
}
