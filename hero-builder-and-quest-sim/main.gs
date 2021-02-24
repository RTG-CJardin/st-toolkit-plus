function onEdit(e) {
  var sheetName = SpreadsheetApp.getActiveSheet().getName();
  if (sheetName == QUEST_SHEET){
    quest = new Quest();
  }
  else if (HERO_SHEETS.has(sheetName)) {

    var heroClassAddress = "C3";

    var itemTypeSlot1Address = "B6";
    var itemTypeSlot2Address = "B7";
    var itemTypeSlot3Address = "B8";
    var itemTypeSlot4Address = "B9";
    var itemTypeSlot5Address = "B10";
    var itemTypeSlot6Address = "B11";

    var setAllQualityAddress  = "D4";
    var setAllElementsAddress = "E4";
    var setAllSpiritsAddress  = "F4";

    var importAddress = "E2";

    var typeColumn    = 2;
    var itemColumn    = 3;
    var qualityColumn = 4;
    var elementColumn = 5;
    var spiritsColumn = 6;

    var skillRow = 14;

    // Get cell edited - If it's B6 then do something
    var cellAddress = e.range.getA1Notation();
    var temp_val;
  
    switch (cellAddress) {
      case heroClassAddress:
        var cell, rule, args, myTarget, eq;

        // Iterate through the item slots and set to the class defaults
        for (var itemSlot = 6; itemSlot < 12; itemSlot ++) {
          cellA1 = "B" + itemSlot;
          cell = SpreadsheetApp.getActive().getRange(cellA1);
          rule = cell.getDataValidation();
          args = rule.getCriteriaValues();
          myTarget = args[0].getValues();
          eq = myTarget[0][0];

          SpreadsheetApp.getActiveSheet().getRange(itemSlot, typeColumn).setValue("");
          SpreadsheetApp.getActiveSheet().getRange(itemSlot, itemColumn).setValue("");
          SpreadsheetApp.getActiveSheet().getRange(itemSlot, elementColumn).setValue("");
          SpreadsheetApp.getActiveSheet().getRange(itemSlot, spiritsColumn).setValue("");
          SpreadsheetApp.getActiveSheet().getRange(cellA1).setValue(eq);
        }
        for (var skill = 1; skill <= 4; skill ++) {
          SpreadsheetApp.getActiveSheet().getRange(skillRow, skill).setValue("");
        }
        break;

      case itemTypeSlot1Address:
        clear_item(1)
        break;
      case itemTypeSlot2Address:
        clear_item(2)
        break;
      case itemTypeSlot3Address:
        clear_item(3)
        break;
      case itemTypeSlot4Address:
        clear_item(4)
        break;
      case itemTypeSlot5Address:
        clear_item(5)
        break;
      case itemTypeSlot6Address:
        clear_item(6)
        break;

      case setAllQualityAddress:
        temp_val = SpreadsheetApp.getActiveSheet().getRange(4, qualityColumn).getValue();
        set_all_items(qualityColumn, temp_val);
        break;
      case setAllElementsAddress:
        temp_val = SpreadsheetApp.getActiveSheet().getRange(4, elementColumn).getValue();
        set_all_items(elementColumn, temp_val);
        break;
      case setAllSpiritsAddress:
        temp_val = SpreadsheetApp.getActiveSheet().getRange(4, spiritsColumn).getValue();
        set_all_items(spiritsColumn, temp_val);
        break;

      case importAddress:
        read_import_string();
    }

    set_mundra_spirits();
    write_export_string(); 
    //myFunction_builder();
    quest = new Quest();
  }
}

function clear_item(item) {
  var item_row = item + 5
  SpreadsheetApp.getActiveSheet().getRange(item_row, itemColumn).setValue("");
  SpreadsheetApp.getActiveSheet().getRange(item_row, elementColumn).setValue("");
  SpreadsheetApp.getActiveSheet().getRange(item_row, spiritsColumn).setValue("");
}

function set_all_items(column, value) {
  for (var i = 6; i < 12; i ++) {
    SpreadsheetApp.getActiveSheet().getRange(i, column).setValue(value);
  }
  SpreadsheetApp.getActiveSheet().getRange(4, column).setValue("");
}

function set_mundra_spirits() {
  var item;
  for (var row = 6; row < 12; row ++) {
    item = SpreadsheetApp.getActiveSheet().getRange(`C${row}`).getValue();
    if (MUNDRAS_ITEMS.has(item)) {
      SpreadsheetApp.getActiveSheet().getRange(`F${row}`).setValue(MUNDRAS_SPIRIT);
    }
  }
}
