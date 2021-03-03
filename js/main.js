import { jsPDF } from "jspdf";

const ExcelJS = require('exceljs');
const workbook = new Excel.Workbook();
var filename = '/src/example.xlsx';
await workbook.xlsx.readFile(filename)
.then(function() {
    var worksheet = workbook.getWorksheet(sheet);
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
      console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    });
});
const doc = new jsPDF();

var name = '';
var company = '';
var barcode = '';
JsBarcode("#barcode", barcode, {
    format: "EAN13",
    lineColor: "#0aa",
    width: 4,
    height: 40,
    displayValue: false
  });
var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><section class="main"><div class="name">'+name+'</div><div class="company">'+company+'</div><div class="barcode"><svg id="barcode"></svg></div></section><style>@font-face{font-family:DINPro-CondensedMedium;src:local("DINPro-CondensedMedium"),url(https://nomail.com.ua/files/woff/bf27039ecba4e6511abddd84122a8aac.woff) format("woff")}body{font-family:DINPro-CondensedMedium}.main{width:700px;height:1000px;background-image:url(.$background.);background-size:contain;background-repeat:no-repeat;margin:0 auto}.name{padding-top:230px;padding-left:500px;font-size:24px}.company{padding-left:500px;font-size:24px}.barcode{padding-top:175px;padding-left:560px}</style></body></html>';
doc.text(html, 10, 10);
doc.save(name+".pdf");

