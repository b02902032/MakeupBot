var connectObj = {
        host: location.host,
        socket: null,

            init: function(){
                //$("#message").append(connectObj.host + "<br/>");
                var url = "ws://" + connectObj.host + "/socket";
                connectObj.socket = new WebSocket(url);
                connectObj.socket.onopen = function(event){
                    console.log("on open");
                    return true;
                },
                connectObj.socket.onmessage = function(event){
                    connectObj.showMsg(event.data);
                },
                connectObj.socket.onclose = function(event){
                    console.log("on close");
                },
                connectObj.socket.onerror = function(event){
                    console.log("on error");
                }
            },
            sendMsg: function(message){
                connectObj.socket.send(JSON.stringify(message));
                //console.log("sendMsg");
            },
            showMsg: function(message){
                var data = JSON.parse(message);
                //console.log("showMsg");
                console.log(data);
                for(key in data){
                    switch(key){
                        case 'draw_face':
                            console.log('draw_face success show cam.jpg');
                            document.getElementById('my_result').innerHTML = '<img src="static/face.jpg"/>';
                    }
                }

            }

        };

function waitForSocketConnection(socket, callback){
    setTimeout(
        function(){
            if (socket.readyState === 1) {
                if(callback !== undefined){
                    callback();
                }
                return;
            } else {
                waitForSocketConnection(socket,callback);
            }
        }, 5);
};

function sendMessage(msg,log) {
    waitForSocketConnection(connectObj.socket, function() {
            console.log(" sendMessage: "+log);
            connectObj.sendMsg(msg);
        });
    };

connectObj.init();

function imageUpload(){
    var elem = document.getElementById('userMakeupTemplateShowImg');
    if (!elem.hasAttribute('chosen')) {
        var att = document.createAttribute('chosen');
        att = 'false';
    }
    if(elem.src =="#"){
        elem.setAttribute('chosen','false');
    }
    else{
        elem.setAttribute('chosen','true'); 
    }
    console.log(elem);
}

function templateReadyHandler(){
    var isChoose = 'false', chooseIdx = 0, trueCount = 0;

    //set displayFace
    var face = document.getElementById('displayFace');
    face.src = "static/cam.jpg";

    //set chosen template
    for(i = 1; i < 10; i++){
        if(i < 9){
            var elem = document.getElementById('s'+i);
            if(elem.getAttribute('chosen')=='true'){
                isChoose = 'true';
                chooseIdx = i;
                trueCount++;
            }
        }
        else if(i == 9){
            var elem = document.getElementById('userMakeupTemplateShowImg');
            if(elem.getAttribute('chosen')=='true'){
                isChoose = 'true';
                chooseIdx = i;
                trueCount++;
            }
        }       
    }
    if(trueCount > 1){
        alert("you can only choose one template.");
    }
    else{
        if(isChoose=='true'){
            if(chooseIdx == 9){
                var elem = document.getElementById('userMakeupTemplateShowImg'), tar = document.getElementById('draggable');
                tar.src = elem.src;

            }
            else{
                var elem = document.getElementById('s'+chooseIdx), tar = document.getElementById('draggable');
                tar.src = elem.src;
            }
        }
        else{
            alert("you need to choose one template.");
        }
        console.log("chooseIdx: "+chooseIdx);
    }

}
function editFinishedHandler(){

    console.log("editFinishedHandler");
    //calculate the relative position
    var draggableOffset = $("#draggableDiv").offset();
    var faceOffset = $('#displayFace').offset();
    var draggableElem = document.getElementById('draggable');
    var faceElem = document.getElementById('displayFace');
    var dtop = Number(draggableOffset.top) - Number(faceOffset.top);
    var dleft = Number(draggableOffset.left) - Number(faceOffset.left);
    console.log('relative position: ( '+dtop+' , '+dleft+' )');
    alert('relative position: ( '+dtop+' , '+dleft+' )');
    var draggableW = draggableElem.offsetWidth;
    var draggableH = draggableElem.offsetHeight;
    alert('templatesize: ( '+draggableW+' , '+draggableH+' )');


    //alert("Top position: " + x.top + " Left position: " + x.left);

}

function draggableHandler(){
    if(document.getElementById("slideFour").checked){
        alert("you need to disable resizable.");
    }
    else{
        if(document.getElementById("slideThree").checked){
            $( "#draggableDiv" ).draggable("enable");

        }
        else{
            $( "#draggableDiv" ).draggable("disable");
        }
    }
}
function resizableHandler(){
    if(document.getElementById("slideFour").checked){
        $( "#draggable" ).resizable("enable");
    }
    else{
        $( "#draggable" ).resizable("disable");   
    }
}

$(function(){
    
    var pagePositon = 0,
        sectionsSeclector = 'section',
        $scrollItems = $(sectionsSeclector),
        offsetTolorence = 30,
        pageMaxPosition = $scrollItems.length - 1,
        wheelUp = 0,
        wheelDown = 0;

    //Map the sections:
    $scrollItems.each(function(index,ele) { $(ele).attr("debog",index).data("pos",index); });

    // Bind to scroll
    $(window).bind('scroll',upPos);
    
    // Mouse wheel down
    $(document).on('mousewheel DOMMouseScroll', function (e) {
        //prevent the default mousewheel scrolling
        e.preventDefault();
        //get the delta to determine the mousewheel scrol UP and DOWN
        var delta = e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ? 1 : -1;

        if(delta < 0){
            //mousewheel down handler
            wheelDown = 1;
            wheelUp = 0;
            console.log("down");
        }
        else if(delta > 0){
            //mousewheel up handler
            wheelUp = 1;
            wheelDown = 0;
            console.log("up");
        }
        //prevent the default mousewheel scrolling
        e.preventDefault();
        return false;
    });

    //Move on click:
    $('#arrow_prev a').click(function(e){

        if ($(this).hasClass('arrowPrev') && pagePositon-1 >= 0) {
            pagePositon--;
            $('html, body').stop().animate({ 
                  scrollTop: $scrollItems.eq(pagePositon).offset().top
              }, 300);
            return false;
        }
    });
    $('#arrow_next a').click(function(e){
        if ($(this).hasClass('arrowNext') && pagePositon+1 <= pageMaxPosition) {
            pagePositon++;
            $('html, body').stop().animate({ 
                  scrollTop: $scrollItems.eq(pagePositon).offset().top
            }, 300);
            return false;
        }
    });
    
    //Update position func:
    function upPos(){
       var fromTop = $(this).scrollTop();
       var $cur = null;
        $scrollItems.each(function(index,ele){
            if ($(ele).offset().top < fromTop + offsetTolorence) $cur = $(ele);
        });
       if ($cur != null && pagePositon != $cur.data('pos')) {
           pagePositon = $cur.data('pos');
       }                   
    }

    /**********
    test function
    **********/
    $( "#draggable" ).resizable();
    $( "#draggableDiv" ).draggable();


    /**********/
    /**********/
    if (window.File && window.FileReader && window.FileList && window.Blob) {
            function handleFileSelect(evt) {
                console.log("handleFileSelect");
                // FileList object containing all files
                var files = evt.target.files;

                for (var i = 0; f = files[i]; i++) {
                    console.log(f.name+"\n"+f.type+"\n"+f.size+"\n"+f.lastModifiedDate.toLocaleDateString());
                    var reader = new FileReader();

                    // read in the site URLs from the file and store
                    // them in a global array.
                    reader.onload = (
                        function(theFile) {
                            return function(e) {
                                $('#userMakeupTemplateShowImg').attr('src', e.target.result);
                                $('#userMakeupTemplateShowImg').attr('style', 'visibility: visible');
                            };
                        }
                    )(f);
                    reader.readAsDataURL(f);
                    imageUpload();
                }
            }

            document.getElementById('files')
                    .addEventListener('change', handleFileSelect, false);
    }
    else {
            alert("Your browser does not support files.");
    }
    /**********/

    /**********/
    /**********
    test function
    **********/
    
});

