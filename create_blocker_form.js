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


let state = [show_title, show_blockers, show_image]
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

    home.style.display = "unset";
    form.style.display = "none";

    reset_form();


}

function show_form(){
    if(check_for_form()){
        console.log("no form detected.")
        return;
    }


    home.style.display = "none";
    form.style.display = "unset";
}

function show_title(){
    if(check_for_form()) {
        console.log("no form detected.")
        return;
    }
    show_form()

    //show and hide the respective containers for this page
    title_container.style.display = 'unset';
    blocker_container.style.display = 'none';
    image_container.style.display = 'none';
    next_container.style.display = 'unset';
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
    blocker_container.style.display = 'unset';
    image_container.style.display = 'none';
    next_container.style.display = 'unset';
    //                                                   //
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
    image_container.style.display = 'unset';
    next_container.style.display = 'unset';
    //                                                   //
}

function form_submit(){
    show_home();
}

function reset_form(){
    //hide everything
    title_container.style.display = 'none';
    blocker_container.style.display = 'none';
    image_container.style.display = 'none';
    next_container.style.display = 'none';
    //                                                   //


    current_state = 0;
}

function check_for_form(){
    return !form || _.size(form) > 1 || !home || _.size(home) > 1

}