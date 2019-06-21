let form = document.getElementById('createForm');
let home = document.getElementById('home')

//containers
let title_container = document.getElementById( 'titleInputContainer');
let blocker_container = document.getElementById( 'blockersInputContainer');
let image_container = document.getElementById( 'imageInputContainer');
let next_container = document.getElementById( 'nextButtonContainer');
let submit_container = document.getElementById('submitButtonContainer');

//buttons
let back_button = document.getElementById('formBackButton');
let next_button = document.getElementById('formNextButton');

//TODO - find a better way to remove event listeners from the buttons
let actions_set = false;
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

    if (!actions_set){
        back_button.addEventListener('click', this.form_back.bind(this))
        next_button.addEventListener('click', this.form_next.bind(this))
        actions_set = true;
    }

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