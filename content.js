chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    run_blockers();
});

function fx(search_terms){


    if(window.find){
        $(`*`).filter( function (){
            for (var search_index in search_terms){
                var search_term = search_terms[search_index];
                if (should_this_element_be_blocked(this, search_term)){
                    break;
                }

            }
        })
    }


}

function should_this_element_be_blocked(element, search_term){
    if(!is_this_a_spoiler_blocker_element(element) && _.includes(_.lowerCase(_.get(element, 'childNodes[0].nodeValue', '')), search_term)){
        if (element.tagName == "EM" || element.tagName == "B" || element.tagName == "A" || element.tagName == "STRONG" ){
            hide_element(element.parentNode, search_term)
            return true
        }else{
            hide_element(element, search_term)
            return true
        }
    }
    return false
}

function is_this_a_spoiler_blocker_element(element){
    return _.includes(_.get(element, 'className', ''), 'spoiler-blocker-') || _.includes(_.get(element, 'parentNode.className', ''), 'spoiler-blocker-')
}

function hide_element(selectedElement, search_term=""){
    var wrapper = document.createElement('div');

    wrapper.style.color = "white";
    wrapper.style.backgroundColor = "black";
    wrapper.style.height = `${selectedElement.offsetHeight}px`
    wrapper.style.width = `${selectedElement.offsetWidth}px`
    wrapper.style.margin = "1px 0 1px 0px";
    wrapper.style.position = "absolute"

    if(wrapper.style.position == "relative"){
        wrapper.style.position = "relative";
    }

    if (selectedElement.style.position == "absolute" || selectedElement.style.position == "relative"){

        wrapper.style.top = selectedElement.style.top;
        wrapper.style.left = selectedElement.style.left;
        wrapper.style.right = selectedElement.style.right;
        wrapper.style.bottom = selectedElement.style.bottom;

    }


    wrapper.style.zIndex = selectedElement.style.zIndex;
    wrapper.style["overflow-wrap"] = "break-wrap";
    wrapper.style["text-overflow"] = "ellipsis";

    if(selectedElement.offsetHeight > 20){
        wrapper.textContent = "Spoiler! " + search_term + " was found in this snippit"
    }


    const classname = "spoiler-blocker-" + uuidv4();
    wrapper.className = classname
    selectedElement.className += ` ${classname}`

    wrapper.addEventListener('click', onclick_spoiler)
    selectedElement.parentNode.insertBefore(wrapper, selectedElement);

}

function run_blockers(){
    chrome.storage.sync.get('blockers', function(data) {

        if(data.blockers.length >= 0){
            for (var blocker in data.blockers){
                fx(SPOILERS[data.blockers[blocker]])
            }
        }
    })
}

function check_element_mutation(addedElements){
    chrome.storage.sync.get('blockers', function(data) {
        if (data.blockers.length >= 0) {

            for (var i = 0; i < addedElements.length; i++){
                var new_node = addedElements[i];

                if(!is_this_a_spoiler_blocker_element(new_node) && new_node.parentNode) {

                    $(new_node.parentNode).find("*").filter(function () {
                        for (var blocker in data.blockers) {
                            for (var term_index in SPOILERS[data.blockers[blocker]]) {
                                var search_term = SPOILERS[data.blockers[blocker]][term_index]
                                if (should_this_element_be_blocked(this, search_term)) {
                                    return;
                                }
                            }
                        }
                    })
                }
            }
        }
    })
}


function onclick_spoiler(e){
    e.preventDefault()

    e.target.parentNode.removeChild(e.target);

}


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

run_blockers();



// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            check_element_mutation(mutation.addedNodes);
        }
        else if (mutation.type == 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};


window.addEventListener("load", function(){
    // Options for the observer (which mutations to observe)
    var config = { childList: true, subtree: true };

    var observer = new MutationObserver(callback);
    observer.observe(document.getElementsByTagName("body")[0], config);

})
