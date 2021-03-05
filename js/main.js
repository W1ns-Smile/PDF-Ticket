const { jsPDF } = window.jspdf;
//const doc = new jsPDF();
var oFileIn;

function toJSON(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function (sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
  });
  return result;
}

function displayJSON(json) {
  var base = JSON.parse(JSON.stringify(json, undefined, 2));
  for (var key in base) {
    for (var key2 in key) {
      var barcode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(barcode, base[key][key2]["Barcode"], {
        format: "EAN13",
        background: "none",
      });
      console.log(barcode);
      var html =
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><section class="main"><div class="name">' +
        base[key][key2]["Name"] +
        '</div><div class="company">' +
        base[key][key2]["Company"] +
        '</div><div class="barcode">'+barcode+
        '</div></section><style>.main{width:700px;height:1000px;background-image:url(image/ticket.png);background-size:contain;background-repeat:no-repeat;margin:0 auto}.name{padding-top:230px;padding-left:500px;font-size:24px}.company{padding-left:500px;font-size:24px}.barcode{padding-top:175px;padding-left:560px}</style></body></html>';
      /* var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><section class="main"><div class="name">'+base[key][key2]['Name']+'</div><div class="company">'+base[key][key2]['Company']+'</div><div class="barcode"><svg>'+barcode+'</svg></div></section><style>@font-face{font-family:DINPro-CondensedMedium;src:local("DINPro-CondensedMedium"),url(https://nomail.com.ua/files/woff/bf27039ecba4e6511abddd84122a8aac.woff) format("woff")}body{font-family:DINPro-CondensedMedium}.main{width:700px;height:1000px;background-image:url(image/ticket.png);background-size:contain;background-repeat:no-repeat;margin:0 auto}.name{padding-top:230px;padding-left:500px;font-size:24px}.company{padding-left:500px;font-size:24px}.barcode{padding-top:175px;padding-left:560px}</style></body></html>'; */
      //console.log(barcode);
      document.querySelector("#result").innerHTML = html;
      html2canvas(document.querySelector("#result"), {useCORS: true, allowTaint: true}).then(function(canvas) {
        let img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.onload = function () {
          let pdf = new jsPDF('landscape', 'mm', 'a4');
          pdf.addImage(img, 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
          pdf.save('certificate.pdf');
        };
      });
      /* var doc = new jsPDF('p', 'mm');
      html2canvas(document.querySelector("#result"), {useCORS : true, allowTaint:true, letterRendering: true}).then(function (canvas) {        
            var imgData = canvas.toDataURL(
                'image/png');
                console.log(imgData);              
            doc.addImage(imgData, 'PNG', 10, 10);
            doc.save('sample-file.pdf');
        }); */
      //doc.text(document.write(html), 10, 10);
      //doc.save(base[key][key2]['Name']/*+" - "+base[key][key2]['Manager']*/+".pdf");
    }
  }
}

function filePicked(oEvent) {
  // Get The File From The Input
  var oFile = oEvent.target.files[0];
  var sFilename = oFile.name;

  console.log(sFilename);

  var reader = new FileReader();

  reader.onload = function (e) {
    console.log("onload");
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: "binary",
    });

    var jsonData = toJSON(workbook);
    displayJSON(jsonData);
  };

  reader.readAsBinaryString(oFile);
}

window.onload = function () {
  if (window.File && window.FileList && window.FileReader && window.Blob) {
    oFileIn = document.getElementById("input");
    if (oFileIn.addEventListener) {
      oFileIn.addEventListener("change", filePicked, false);
    }
  } else {
    alert("HTML5 File API не поддерживается");
  }
};
