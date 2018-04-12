//get audio element
var audio = document.getElementById('denied');
// var button = document.getElementById('play-button');
// button.addEventListener('click', function () {
//   audio.play();
// });
// Playaudio
function playAudio() {
    //alert('here');
    audio.play();
}
//get element startscanning
var startVideoScanning = document.getElementById('startScanning');
var app = '';
// On click 
startVideoScanning.onclick = function () {
    document.getElementById('app').style.display = 'block';
    //create new app variable with vue
    app = new Vue({
        el: '#app',
        data: {
            scanner: null,
            activeCameraId: null,
            cameras: [],
            scans: []
        },
        mounted: function () {
            var self = this;
            
            //initialise scanner
            self.scanner = new Instascan.Scanner({ video: document.getElementById('previewVideo'), scanPeriod: 5 });
            //add listener for get scan
            self.scanner.addListener('scan', function (content, image) {
                $('.checkScan').show();
                //console.log(Date.now())
                // Add flash on body with element 
                //document.getElementById("overlay").style.display = "block";
                //set timeout for removing flash using element
                // setTimeout(function () {
                //     document.getElementById("overlay").style.display = "none";
                // }, 2000);
                //payaudio function
                playAudio();
                // check url validate if content (qr code data) have url
                var checkUrl = ValidURL(content);
                var x = content;
                // check content is json  starting with {
                if (x.charAt(0) == '{') {
                    //check content have method and action then create form
                    if (content.indexOf("method") >= 0 && content.indexOf("action") >= 0) {
                        var response = JSON.parse(content);
                        var elemFoundiframe = document.getElementById('upload_iframe_scanQR');
                        if (typeof elemFoundiframe !== 'undefined' && elemFoundiframe !== null) {
                            var form = document.getElementById('qrlCreateFormScan;');
                        }else{
                            var iframe = document.createElement("iframe");
                            iframe.setAttribute("name", "upload_iframe_scanQR");
                            iframe.setAttribute("id", "upload_iframe_scanQR");
                            iframe.setAttribute("width", "0");
                            iframe.setAttribute("height", "0");
                            iframe.setAttribute("border", "0");
                            iframe.setAttribute("src", "javascript:false;");
                            iframe.style.display = "none";
                            document.getElementById('forScan').appendChild(iframe);
                            var form = document.createElement('form');
                            form.id = 'qrlCreateFormScan';
                            form.target = "upload_iframe_scanQR";
                        }
                        
                        // var elemFound = document.getElementById('qrlCreateFormScan');
                        // if (typeof elemFound !== 'undefined' && elemFound !== null) {
                        //     elemFound.remove();
                        // }
                        //create form element
                        
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
                        //append form to element or div
                        document.getElementById('forScan').appendChild(form);
                        //self.scans.unshift({ date: +(Date.now()), content: response[key] });
                        // For Submitting Form
                        formsubmit();
                    } else {
                        var response = JSON.parse(content);
                        for (var key in response) {
                            //check json have link or url key thenre direct that
                            if (key == 'link' || key == 'url') {
                                var url = response[key]
                                //validate url
                                if (ValidURL(url)) {
                                    //window.open(url, '_blank');
                                    self.scans.unshift({ date: +(Date.now()), content: url });
                                } else {
                                    self.scans.unshift({ date: +(Date.now()), content: url });
                                }
                            } else {
                                self.scans.unshift({ date: +(Date.now()), content: response[key] });
                            }
                        }
                    }
                }
                // check url validate
                else if (checkUrl) {
                    //var response = JSON.parse(content);
                    self.scans.unshift({ date: +(Date.now()), content: content });
                } else {
                    self.scans.unshift({  content: content });
                }
            });
            //check camera available or not 
            // if avail then get them
            Instascan.Camera.getCameras().then(function (cameras) {
                self.cameras = cameras;
                if (cameras.length > 0) {
                    self.activeCameraId = cameras[0].id;
                    self.scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);                   
            });

        },
        methods: {
            formatName: function (name) {
                return name || '(unknown)';
            },
            selectCamera: function (camera) {
                this.activeCameraId = camera.id;
                this.scanner.start(camera);
            }
        }
    });
    // display stop button
    document.getElementById('stopScanning').style.display = 'block';
    startVideoScanning.style.display = 'none';
    return false;

}
// Onclick stop 
document.getElementById('stopScanning').onclick = function () {
    $('.checkScan').hide();
    app.scanner.stop();
    document.getElementById('stopScanning').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    startVideoScanning.style.display = 'block';
    return false;
}
// for submit form
function formsubmit() {
    //get element form from its id and check if its available or not if available then submit it
    var elemFound = document.getElementById('qrlCreateFormScan');
    if (typeof elemFound !== 'undefined' && elemFound !== null) {
        elemFound.submit();
    }
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    var i = 0;
    var getValue = '';
    $(element).each(function () {
        if (i > 0) {
            getValue = getValue + ',';
        }
        getValue = getValue + $(this).html();
        i++;
    });
    $temp.val(getValue).select();
    document.execCommand("copy");
    $temp.remove();
    alert('Copy To Clipboard')
}