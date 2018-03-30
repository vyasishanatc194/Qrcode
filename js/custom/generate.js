// This js used to generate qr code from simple string or Url
//Get Contant from tthe text field
// var qrUrl = document.getElementById("text");
// // Create Qr COde using VanillaQr Library
// var qr = new VanillaQR({
//     url: qrUrl.value,
//     size: 400,
//     colorLight: "#ffffff",
//     colorDark: "#000000"

// });
//Append Generated Qr Code
//document.getElementById('qrcode').appendChild(qr.domElement);
//Create qr controllers
function createQR() {
    qr.url = qrUrl.value;
    qr.init();
    convertCanvasToImage()
}

// Converts canvas to an image
function convertCanvasToImage() {
    // find in Qr code Object canvas tag
    var canvasImage = document.getElementById("qrcode");
    var canvas = canvasImage.querySelector('canvas');
    //  get todataUrl
    var img = canvas.toDataURL("image/png");
    

    // var image = qr.toImage('png');
    // image.src = img
    // window.open(image.src);
    // get a object and set image url in href for download qr code as image
    var a = document.getElementById('qrcodeimages');
    a.href = img;
}


//createQR();
//convertCanvasToImage();
// When in input gives in text field then call the function to create qr code
$("#text").
    on("blur", function () {
        createQR();
    }).
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            createQR();
        }
    });

function createBulkQR(url) {
    var qrBulk = new VanillaQR({
        url: url,
        size: 400,
        colorLight: "#ffffff",
        colorDark: "#000000"

    });
    
    qrBulk.init();
    document.getElementById('getBulkQr').appendChild(qrBulk.domElement);
    // // find in Qr code Object canvas tag
    var canvasImage = document.getElementById("getBulkQr").lastChild;//document.getElementById("qrcode");
    var canvas = canvasImage.querySelector('canvas');
    //  get todataUrl
    var img = canvasImage.toDataURL("image/png");
    //get converted image
    var image = qrBulk.toImage('png');
    // get image src 
    var imgSrc = image.src;
    //return base64 url
    return imgSrc.replace(/^data:image\/(png|jpg);base64,/, "");
    
}

// var generateOption = document.querySelector('input[name = "generateOption"]:checked').value;
// console.log(generateOption)
// var generateOption= document.getElementsByClassName('generateOption');
radiobtn = document.getElementById("makeRequestSelection");
radiobtn.checked = true;
$(".generateOption").change(function () {
    var val = $('.generateOption:checked').val();
    //console.log(val);
    $('.checkGenerateSelection').removeClass('show active');
    $('#' + val).addClass('show active')
});
// var getRequest = document.getElementById("createrequestQr");

// getRequest.onclick = function (){
//     var action = document.getElementById("action").value;
//     console.log(action);
//     var method = document.getElementById("getmethod").value;
//     console.log(method);
//     var getDetail = document.getElementById("enterdetail").value;
//     console.log(getDetail);
//     getDetail = JSON.parse(getDetail);
//     console.log(getDetail);
//     getDetail.action = action;
//     getDetail.method = method;
//     console.log(getDetail);
// }

