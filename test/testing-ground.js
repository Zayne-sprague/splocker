
function show_more_spoilers(){


    for (var i = 0; i<10000; i++){
        var new_element = document.createElement("div")

        new_element.textContent = "tony stark dies yo!"
        document.getElementsByClassName("more-spoilers")[0].appendChild(new_element)
    }
}