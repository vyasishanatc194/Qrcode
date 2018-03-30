//Check Validurl after read qr 
function ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
        return false;
    } else {
        return true;
    }
}
(function () {
    'use strict';
    //Get Upload image or button for check qr
    var upload = document.getElementById('uploadQRcode');
    //var createqr = document.getElementById('createqr');
    var preview = document.getElementById('preview');
    //initialise qrcode
    var qr = new QrCode();
    //Callback function for qr code
    qr.callback = function (err, successfull) {
        
        //Check if Element availabel or not if available then remove it
        var elemspan = document.getElementById('qrfromurlspan');
        if (typeof elemspan !== 'undefined' && elemspan !== null) {
            elemspan.remove();
        }
        //Create Span element
        var span = document.createElement('span');
        span.id = 'qrfromurlspan';
        
        //After read qr code If successfull
        if (successfull) {
            //get Result From the successfull
            var data = successfull.result;
            // Validate url if result if url
            var checkUrl = ValidURL(data);
            var x = data;
            //if result is jason then check element 
            if (x.charAt(0) == '{') {
                var response = JSON.parse(data);
                // if result have method and action then create form 
                if (data.indexOf("method") >= 0 && data.indexOf("action") >= 0 ) {
                    var elemFoundiframe = document.getElementById('upload_iframe_readQR');
                    if (typeof elemFoundiframe !== 'undefined' && elemFoundiframe !== null) {
                        var form = document.getElementById('qrlCreateForm;');
                    }else{
                        var iframe = document.createElement("iframe");
                        iframe.setAttribute("name", "upload_iframe_readQR");
                        iframe.setAttribute("id", "upload_iframe_readQR");
                        iframe.setAttribute("width", "0");
                        iframe.setAttribute("height", "0");
                        iframe.setAttribute("border", "0");
                        iframe.setAttribute("src", "javascript:false;");
                        iframe.style.display = "none";
                        span.appendChild(iframe);
                        var form = document.createElement('form');
                        form.id = 'qrlCreateForm';
                        form.target = "upload_iframe_readQR";
                    }
                    var response = JSON.parse(data);
                    form.action = response.action;
                    form.method = response.method;
                    //create form fields using json
                    for (var key in response) {
                        if (key != 'action' && key != 'method') {
                            var input = document.createElement("input");
                            input.setAttribute("type", "hidden");
                            input.setAttribute("name", key);
                            input.setAttribute("value", response[key]);
                            form.appendChild(input)
                        }
                    }
                    //append submit form to span
                    span.appendChild(form);
                }else{
                    //check key for response
                    for (var key in response) {
                        //if key have value for url or link then send them to link
                        if (key == 'link' || key == 'url') {
                            var url = response[key]
                            //check validate url
                            if (ValidURL(url)) {
                                var checkclick = 'onClick = "window.open('
                                    + "'" + url + "','_blank');return false;" + '"';
                                span.innerHTML = '<a target="_blank" ' + checkclick +' id="clickUrl" href="" target= "_blank">' + url + '</a>';
                                // var wind = window.open('', '_blank');
                                // wind.location = url;
                            } else {
                                span.innerHTML = '<a href="' + url + '" target= "_blank">' + url + '</a>';
                            }
                        } else {
                            span.innerHTML = '<a href="' + url + '" target= "_blank">' + url + '</a>';
                        }
                    }
                }
            // Check Url validation
            }else if (checkUrl) {
                var checkclick = 'onClick = "window.open('
                    + "'" + data +"','_blank');return false;" + '"';
                span.innerHTML = '<a ' + checkclick + ' id="clickUrl" href="" >' + data + '</a>';
                //span.innerHTML = '<a href="' + data + '" target= "_blank">' + data + '</a>';
                // var wind = window.open('', '_blank');
                // wind.location = data;
                
            } else {
                span.innerHTML = data;
            }
        }
        // Some error
        else {
            span.textContent = 'Error! See error message in console!   => ' + err;
            console.error(err);
        }
        //append to preview div
        preview.appendChild(span);
        // For Submitting Form
        formsubmitReadQR();
    }
    // function for event (onclick and focusout)
    var generatQrCode = function () {
        // get giles
        var elemFiles = this.files;
        //check if files is not available 
        if (typeof elemFiles === 'undefined' && elemFiles !== null) {
            var file = document.getElementById('uploadQRcode');
            this.files = file.files
        }
        //check files length
        for (var i = 0; i < this.files.length; i++) {
            var file = this.files[i];
            var imageType = /^image\//;

            if (!imageType.test(file.type)) {
                throw new Error('File type not valid');
            }

            // Read file
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                // Show as preview image
                //check img tag available if avail then remove it
                var elem = document.getElementById('qrfromurl_'+i);
                if (typeof elem !== 'undefined' && elem !== null) {
                    elem.remove();
                }
                // check image and set it in image tag from uploaded
                var img = document.createElement('img');
                img.src = this.result;
                img.id = 'qrfromurl_'+i;
                preview.appendChild(img);
                // Analyse code
                qr.decode(this.result);
            }.bind(reader), false);
            reader.readAsDataURL(file);

        }
        
        delete this.files;
        document.getElementById('uploadQRcode').value= '';
    }
    upload.addEventListener('change', generatQrCode, false);
  //  createqr.addEventListener('click', generatQrCode, false);
    //Use for always show scan tab
    $('#myTab li:first-child a').tab('show')
   // for submit form
    function formsubmitReadQR(){
        //get element form from its id and check if its available or not if available then submit it
        var elemFound = document.getElementById('qrlCreateForm');
        if (typeof elemFound !== 'undefined' && elemFound !== null) {
            elemFound.submit();
        }
        var elemFoundanchor = document.getElementById('clickUrl');
        if (typeof elemFoundanchor !== 'undefined' && elemFoundanchor !== null) {
            elemFoundanchor.click();
        }
    }
})();