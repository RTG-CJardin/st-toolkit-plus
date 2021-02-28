/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function write_export_string() {
  var cell, exportString;
  for (var i = 0; i < IMPORT_CELL_ORDER; i++) {
    cell = IMPORT_CELL_ORDER;
    exportString += SpreadsheetApp.getActive().getRange(cell).getValue() + "|";
  }
  SpreadsheetApp.getActiveSheet().getRange("D2").setValue(exportString);
}

function read_import_string() {
  var importString = SpreadsheetApp.getActive().getRange("E2").getValue();
  var cell, data;
  for (var i = 0; i < IMPORT_CELL_ORDER; i++) {
    cell = IMPORT_CELL_ORDER;
    data = importString.substring(0, importString.indexOf("|"));
    SpreadsheetApp.getActiveSheet().getRange(cell).setValue(data);
    importString = importString.substring(
      importString.indexOf("|") + 1,
      importString.length
    );
  }
  SpreadsheetApp.getActiveSheet().getRange("E2").setValue("");
}
