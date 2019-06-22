let form = document.getElementById('createForm');
let home = document.getElementById('home')

//containers
let title_container = document.getElementById( 'titleInputContainer');
let blocker_container = document.getElementById( 'blockersInputContainer');
let image_container = document.getElementById( 'imageInputContainer');
let next_container = document.getElementById( 'nextButtonContainer');
let submit_container = document.getElementById('submitButtonContainer');
let delete_container = document.getElementById( "deleteButtonContainer");

//buttons
let back_button = document.getElementById('formBackButton');
let next_button = document.getElementById('formNextButton');
let delete_button = document.getElementById('formDeleteButton');
let edit_submit_button = document.getElementById("formEditSubmitButton");
let form_edit_back_button = document.getElementById('formEditBackButton');

//copy
let title_copy = document.getElementById('titleInputCopy');
let blocker_copy = document.getElementById('blockersInputCopy');
let form_title_copy = document.getElementById('formTitle');

//TODO - find a better way to remove event listeners from the buttons
let actions_set = false;
let edit_actions_set = false;
// ^^^^^^^^^^^^^^^^^^^^^

//TODO - find a way to save images locally, can't save it in server
let state = [show_title, show_blockers]//, show_image]
let validator = [validate_title, validate_blockers]
let current_state;

function start_form(){

    if(check_for_form()){
        console.log("no form detected.")
        return;
    }
    edit_submit_button.style.display = "none";
    form_edit_back_button.style.display = "none";
    delete_container.style.display = 'none';
    back_button.style.display = "block";
    next_button.style.display = "block";



    if (!actions_set){
        back_button.addEventListener('click', this.form_back.bind(this))
        next_button.addEventListener('click', this.form_next.bind(this))
        actions_set = true;
    }

    title_copy.innerText = "What do you want to call this blocker?";
    blocker_copy.innerText = "What are key words you want to block?";
    form_title_copy.innerText = "Let's make a new blocker!";
    current_state = 0;
    state[current_state]()

}

function form_back(){
    if(check_for_form()){
        console.log("no form detected.")
        return;
    }

    if (current_state == 0){
        show_home();
    }else{
        current_state -= 1;
        form_run_state()
    }

}

function form_next(e){

    if(check_for_form()){
        console.log("no form detected.");
        return;
    }

    if (!validator[current_state]()){
        return;
    }

    window.setTimeout(()=>{
        if (current_state != _.size(state) - 1){
            current_state += 1;
            form_run_state();
        }else{
            form_submit();
        }
    }, 100);
}

function form_run_state(){
    if(current_state){
        state[current_state]()
    }
}

function show_home(){
    if(check_for_form()){
        console.log("no form detected.")
        return;
    }

    home.style.display = "block";
    form.style.display = "none";

    reset_form();


}

function show_form(){
    if(check_for_form()){
        console.log("no form detected.")
        return;
    }


    home.style.display = "none";
    form.style.display = "table";
}

function show_title(){
    if(check_for_form()) {
        console.log("no form detected.")
        return;
    }
    show_form()

    //show and hide the respective containers for this page
    title_container.style.display = 'block';
    blocker_container.style.display = 'none';
    image_container.style.display = 'none';
    next_container.style.display = 'block';
    //                                                   //

}

function show_blockers(){
    if(check_for_form()){
        console.log("no form detected.")
        return;
    }
    //show_form()

    //show and hide the respective containers for this page
    title_container.style.display = 'none';
    blocker_container.style.display = 'block';
    image_container.style.display = 'none';
    next_container.style.display = 'block';
    //                                                   //

    next_button.innerText = "Create"
}

function show_image(){
    if(check_for_form()){
        console.log("no form detected.")
        return;
    }
    show_form()
    //show and hide the respective containers for this page
    title_container.style.display = 'none';
    blocker_container.style.display = 'none';
    image_container.style.display = 'block';
    next_container.style.display = 'block';
    //                                                   //
}

function validate_title(){
    if ($('#titleInput').val() == "" || $('#titleInput').val() == " "){
        return false;
    }
    return true;
}

function validate_blockers(){
    var tags = $(document.getElementsByClassName('tagHere')).find('div span');

    if (tags.length <= 0){
        document.getElementById("phrase_note_warning").innerText = "Needs at least 1 item to block"
        return false;
    }

    return true;
}

function form_submit(){
    chrome.storage.sync.get('custom_blockers', function (data) {

        var tags = $(document.getElementsByClassName('tagHere')).find('div span');
        var blockers = []
        for (var i = 0; i < tags.length; i++){
            blockers.push(tags[i].innerText);
        }
        var title = $('#titleInput').val();
        var new_data = {
            "blockers": blockers,
            "title": title,
            "image": {"type": "internal", "url": "images/New_Blocker.png"}
        }

        let custom_tiles = _.get(data, 'custom_blockers', [])
        custom_tiles.push(new_data);

        chrome.storage.sync.set({'custom_blockers': custom_tiles})
        construct_custom_options()

        show_home();

    })

}

function reset_form(){
    //hide everything
    title_container.style.display = 'none';
    blocker_container.style.display = 'none';
    image_container.style.display = 'none';
    next_container.style.display = 'none';
    //

    document.getElementById("phrase_note_warning").innerText = "";
    var tags = $(document.getElementsByClassName('tagHere')).find('div');
    for (var i = 0; i < tags.length; i++){
        tags[i].remove()
    }
    $('#titleInput').val("")

    current_state = 0;
}

function check_for_form(){
    return !form || _.size(form) > 1 || !home || _.size(home) > 1

}



//EDITING TILES


let custom_tile;

function start_edit(title) {
    chrome.storage.sync.get('custom_blockers', function (data) {

        custom_tile = _.get(_.filter(data.custom_blockers, (data)=>{ return _.get(data, 'title', '') == title }), '[0]')

        if(!custom_tile) { return; }

        delete_container.style.display = "block";
        edit_submit_button.style.display = "block";
        form_edit_back_button.style.display = "block";
        next_container.style.display = "block";
        back_button.style.display = "none";
        next_button.style.display = "none";

        let tagArea = $(document.getElementsByClassName('tagHere'))
        for (var i = 0; i<_.size(custom_tile.blockers); i++){
            var $tag = $("<div />"), $a = $("<a href='#' />"), $span = $("<span />");
            $tag.addClass('tag');
            $('<i class="fa fa-times" aria-hidden="true"></i>').appendTo($a);
            $span.text(custom_tile.blockers[i]);
            $a.bind('click', function(){
                $(this).parent().remove();
                $(this).unbind('click');
            });
            $a.appendTo($tag);
            $span.appendTo($tag);
            $tag.appendTo(tagArea);
        }


        $('#titleInput').val(custom_tile.title)


        if (check_for_form()) {
            console.log("no form detected.")
            return;
        }

        if (!edit_actions_set) {
            form_edit_back_button.addEventListener('click', this.exit_edit.bind(this))
            edit_submit_button.addEventListener('click', this.edit_tile.bind(this, false))
            delete_button.addEventListener('click', this.delete_tile.bind(this))
            edit_actions_set = true;
        }

        title_copy.innerText = "Title"
        blocker_copy.innerText = "Blockers"
        form_title_copy.innerText = "Edit"

        show_form()
        //show and hide the respective containers for this page
        title_container.style.display = 'block';
        blocker_container.style.display = 'block';
        image_container.style.display = 'none';
        //                                                   //

        document.getElementById('blockersInputContainerTags').style.top = "72%";
        document.getElementById('titleInput').style.margin = "0px 0px 10px 0px"
        document.getElementById("regular_note").className = "note push-up"
        document.getElementById("phrase_note_warning").className = "red note push-up"

        edit_submit_button.innerText = "Submit"

    })
}

function reset_after_edit(){
    document.getElementById('blockersInputContainerTags').style.top = "60%";
    document.getElementById('titleInput').style.margin = "50px 0px 0px 0px"
    document.getElementById("regular_note").className = "note"
    document.getElementById("phrase_note_warning").className = "red note"

    delete_container.style.display = "none";
    edit_submit_button.style.display = "none";
    form_edit_back_button.style.display = "none";
}

function exit_edit(){
    reset_after_edit();


    reset_form();
    show_home();
}

function delete_tile(){
    edit_tile(true);
    construct_custom_options();
}

function edit_tile(delete_tile=false){
    if(!custom_tile) {return;}

    chrome.storage.sync.get('custom_blockers', function (data) {
        let custom_tiles = _.filter(_.get(data, 'custom_blockers', []), function(data){ return data.title != custom_tile.title})

        chrome.storage.sync.set({'custom_blockers': custom_tiles}, function() {
            if (!delete_tile){
                reset_after_edit();
                form_submit();
            }
            else {
                exit_edit();
            }
        })
    })
}
