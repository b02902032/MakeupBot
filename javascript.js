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

