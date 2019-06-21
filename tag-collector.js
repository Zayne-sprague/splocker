$(document).ready(function(){
    var $input = $("#blockersInputContainerTags input"),
        $appendHere = $(".tagHere"),
        TABKEY = 9,
        ENTERKEY = 13;
    $input.focus();

    $input.keydown(function(e){

        if ( $(document.getElementsByClassName('tagHere')).find('div').length >= 50){
            document.getElementById("phrase_note_warning").style.display = 'block'
            document.getElementById("phrase_note_warning").innerText = "You can only have 50 phrases"
            return false;
        }

        if(e.keyCode == TABKEY || e.keyCode == ENTERKEY) {
            if(e.preventDefault) {
                e.preventDefault();
                if($(this).val() == '' || $(this).val() == ' ') {
                    return false;
                }
                addTag($(this));
            }
            return false;
        }

        if($(this).val() == '' && e.keyCode === 8) {
            $(".tag:last-child").remove();
        }

    })

    function addTag(element) {
        var $tag = $("<div />"), $a = $("<a href='#' />"), $span = $("<span />");
        $tag.addClass('tag');
        $('<i class="fa fa-times" aria-hidden="true"></i>').appendTo($a);
        $span.text($(element).val());
        $a.bind('click', function(){
            $(this).parent().remove();
            $(this).unbind('click');
        });
        $a.appendTo($tag);
        $span.appendTo($tag);
        $tag.appendTo($appendHere);
        $(element).val('');
    }

});