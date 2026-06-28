var TOKEN        = "mbh-2026-laser";
var NOTIFY_EMAIL = "marked.by.hand.designs@gmail.com";
var DRIVE_FOLDER = "MBH Orders";

function getNextOrderId() {
  var props = PropertiesService.getScriptProperties();
  var n = parseInt(props.getProperty("orderCount") || "0") + 1;
  props.setProperty("orderCount", String(n));
  return "ORD-" + String(n).padStart(4, "0");
}

function doPost(e) {
  if (e.parameter.token !== TOKEN) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var customerName  = e.parameter.name         || "(not given)";
  var customerEmail = e.parameter.email        || "";
  var orderType     = e.parameter.order_type   || "Order";
  var material      = e.parameter.material     || "";
  var quantity      = e.parameter.quantity     || "";
  var message       = e.parameter.message      || "";
  var dxfContent    = e.parameter.dxf_content  || "";
  var dxfFilename   = e.parameter.dxf_filename || "";
  var snapshot      = e.parameter.snapshot     || "";

  var orderId    = getNextOrderId();
  var date       = Utilities.formatDate(new Date(), "Australia/Sydney", "yyyy-MM-dd");
  var safeName   = customerName.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_") || "unknown";
  var folderName = orderId + "_" + orderType + "_" + date + "_" + safeName;

  var folders     = DriveApp.getFoldersByName(DRIVE_FOLDER);
  var root        = folders.hasNext() ? folders.next() : DriveApp.createFolder(DRIVE_FOLDER);
  var orderFolder = root.createFolder(folderName);

  var fileLink = "";
  if (dxfContent && dxfFilename) {
    var dxfFile = orderFolder.createFile(dxfFilename, dxfContent, "application/dxf");
    fileLink = "\n\nDXF file: " + dxfFile.getUrl();
  }

  if (snapshot && snapshot.indexOf("data:image/png;base64,") === 0) {
    var base64  = snapshot.replace("data:image/png;base64,", "");
    var imgBlob = Utilities.newBlob(Utilities.base64Decode(base64), "image/png", "preview.png");
    orderFolder.createFile(imgBlob);
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: customerEmail,
    subject: orderId + " — " + orderType + " — " + customerName + " — " + material + " x " + quantity,
    body: message + fileLink + "\n\nOrder folder: " + orderFolder.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, orderId: orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}
