function block_content(elem=document.getElementsByTagName("HTML")[0]){
    chrome.storage.sync.get('blockers', function(data) {

        let selected_tiles = data.blockers
        build_regex(get_blocker_array(selected_tiles))
        if (!REGEX) { return; }

        const domain = window.location.hostname;
        if(domain == "twitter.com"){
            block_twitter(elem);
        }else if(domain == "www.reddit.com"){
            block_reddit(elem);
        }else if(domain == "www.youtube.com") {
            block_youtube(elem);
        }else if(domain == "www.facebook.com"){
            block_facebook(elem);
        }else if(domain == "www.google.com"){
            block_google(elem);
        }else if(domain == "www.tumblr.com"){
            block_tumblr(elem);
        } else {
            check_for_regex(elem);
        }
    })
}


function check_for_regex(element, params={}){
    if(REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){

        if(REGEX.test(_.get(element, 'childNodes[0].nodeValue',''))){

            if(element.parentNode && (element.tagName == "EM" || element.tagName == "B" || element.tagName == "A" || element.tagName == "STRONG" )) {
                hide_element(element.parentNode, "", null, params)
            }else if ( element.tagName=="YT-FORMATTED-STRING" && (_.get(element, 'parentNode.parentNode.parentNode.tagName') == "YTD-VIDEO-RENDERER" || _.get(element, 'parentNode.parentNode.parentNode.tagName') == "YTD-EXPANDER") && !is_this_a_spoiler_blocker_element(element.parentNode.parentNode) ){ // youtube specific
                hide_element(element.parentNode.parentNode, "", 1000, params)
            } else {
                hide_element(element, "", null, params);
            }

        }else{
            //params = set_params(element, params)
            for(let i = 0; i<_.size(_.get(element,'childNodes')); i++){
                check_for_regex(_.get(element, `childNodes[${i}]`), params)
            }
        }
    }
}

function check_element_mutation(addedElements){

    for(let i = 0; i < addedElements.length; i++){
        block_content(addedElements[i].parentNode);
    }

}


function hide_element(selectedElement, search_term="", z_index_override=null, params={}){
    let wrapper = document.createElement('div');
    let elem = $(selectedElement)
    const styles = window.getComputedStyle(selectedElement);

    wrapper.style.color = "white";
    wrapper.style.backgroundColor = "#100e17";
    wrapper.style.height = `${elem.outerHeight()}px`; //selectedElement.offsetHeight + "px";
    wrapper.style.width = `${elem.outerWidth()}px`; //selectedElement.offsetWidth + "px";
    wrapper.style.margin = "1px 0 1px 0px";
    wrapper.style.position = "absolute"
    wrapper.style.borderRadius = "3px"
    wrapper.style.zIndex = z_index_override || selectedElement.style.zIndex;

    if(styles['position'] == "relative"){
        wrapper.style.zIndex = styles["zIndex"] == "auto" ? 1 : parseInt(`${styles["zIndex"]}`) + 1;
    }

    if (selectedElement.style.position == "absolute" || selectedElement.style.position == "relative"){

        wrapper.style.top = selectedElement.style.top;
        wrapper.style.left = selectedElement.style.left;
        wrapper.style.right = selectedElement.style.right;
        wrapper.style.bottom = selectedElement.style.bottom;

    }


    wrapper.style["overflow-wrap"] = "break-wrap";
    wrapper.style["text-overflow"] = "ellipsis";
    wrapper.style["overflow"] = "hidden";

    if(selectedElement.offsetHeight > 20){
        wrapper.textContent = "Spoiler! " + search_term + " was found in this snippit"
    }


    const classname = "spoiler-blocker-" + uuidv4();
    wrapper.className = classname
    selectedElement.className += ` ${classname}`

    wrapper.addEventListener('click', onclick_spoiler)
    selectedElement.parentNode.insertBefore(wrapper, selectedElement);

}

function onclick_spoiler(e){
    e.preventDefault()


    $(e.target).fadeOut("slow", "swing", function(){
        e.target.parentNode.removeChild(e.target);
    })

}
