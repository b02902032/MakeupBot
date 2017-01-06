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
            showMsg: function(){
                var data = JSON.parse(message);
                //console.log("showMsg");
                console.log(data);
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
    /**********/
    $( "#draggable" ).draggable();
    /**********/
    if (window.File && window.FileReader && window.FileList
            && window.Blob) {
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
                }
            }

            document.getElementById('files')
                    .addEventListener('change', handleFileSelect, false);
        } else {
            alert("Your browser does not support files.");
        }
    /**********/
    


    /**********/
    /**********
    test function
    **********/
    
});

