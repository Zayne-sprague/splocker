chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    run_blockers();
});

function fx(search_terms){

    var reg = build_regex(search_terms)


    check_for_regex(document.getElementsByTagName("HTML")[0], reg)



}

function should_this_element_be_blocked(element, search_term, bypass_spoiler_tag_search=false){

    if(bypass_spoiler_tag_search || !is_this_a_spoiler_blocker_element(element)){
        //~1133.7ms twitter
        if (_.get(element, "tagName") == "SCRIPT" || _.get(element, "tagName") == "STYLE" ) {
            return false;
        }
        //2790.2ms twitter
        if (_.includes(_.lowerCase(_.get(element, 'childNodes[0].nodeValue', '')), search_term)) {
            if (element.tagName == "EM" || element.tagName == "B" || element.tagName == "A" || element.tagName == "STRONG") {
                hide_element(element.parentNode, search_term)
                return true
            }else if ( element.tagName=="YT-FORMATTED-STRING" && (_.get(element, 'parentNode.parentNode.parentNode.tagName') == "YTD-VIDEO-RENDERER" || _.get(element, 'parentNode.parentNode.parentNode.tagName') == "YTD-EXPANDER") && !is_this_a_spoiler_blocker_element(element.parentNode.parentNode) ){ // youtube specific
                hide_element(element.parentNode.parentNode, "", 1000)
                return true
            } else {
                hide_element(element, search_term)
                return true
            }
        }

    }
    return false
}

function is_this_a_spoiler_blocker_element(element){
    //614.8ms on reddit
    return _.includes(_.get(element, 'className', ''), 'spoiler-blocker-') || _.includes(_.get(element, 'parentNode.className', ''), 'spoiler-blocker-')
}

function hide_element(selectedElement, search_term="", z_index_override=null){
    let wrapper = document.createElement('div');
    let elem = $(selectedElement)
    wrapper.style.color = "white";
    wrapper.style.backgroundColor = "black";
    wrapper.style.height = `${elem.outerHeight()}px`; //selectedElement.offsetHeight + "px";
    wrapper.style.width = `${elem.outerWidth()}px`; //selectedElement.offsetWidth + "px";
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


    wrapper.style.zIndex = z_index_override || selectedElement.style.zIndex;
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

            for (let i = 0; i < addedElements.length; i++){
                 const new_node = addedElements[i];


                for (const blocker in data.blockers) {
                    var reg = build_regex(SPOILERS[data.blockers[blocker]])

                    check_for_regex(new_node.parentNode, reg);
                }

            }
        }
    })
}


function build_regex(tags){
    return new RegExp(`\\b(?<!\\.)${_.join(tags, '|')}[.]?\\b`, 'i')
}

function check_for_regex(element, regex){
    if(regex.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
        if(regex.test(_.get(element, 'childNodes[0].nodeValue',''))){

            if(element.parentNode && (element.tagName == "EM" || element.tagName == "B" || element.tagName == "A" || element.tagName == "STRONG" )) {
                hide_element(element.parentNode)
            }else if ( element.tagName=="YT-FORMATTED-STRING" && (_.get(element, 'parentNode.parentNode.parentNode.tagName') == "YTD-VIDEO-RENDERER" || _.get(element, 'parentNode.parentNode.parentNode.tagName') == "YTD-EXPANDER") && !is_this_a_spoiler_blocker_element(element.parentNode.parentNode) ){ // youtube specific
                hide_element(element.parentNode.parentNode, "", 1000)
            } else {
                hide_element(element, "");
            }

        }else{
            for(let i = 0; i<_.size(_.get(element,'childNodes')); i++){
                check_for_regex(_.get(element, `childNodes[${i}]`), regex)
            }
        }
    }
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
