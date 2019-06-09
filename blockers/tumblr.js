//TODO - capture websites associated with profiles (or at least as much as I can)
//TODO - fix scrolling down then up causing blockers to resize too small

function block_tumblr(elem=null){

    const elements = tumblr_get_page_elements(elem);

    for (var i = 0; i < _.get(elements, 'length'); i++){
        let element = elements[i];

        if (REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
            tumblr_hide_element(element)
        }
    }


}

function tumblr_get_page_elements(elem=null){
    let users = tumblr_get_users(elem);
    let posts = tumblr_get_posts(elem);


    const items = [users, posts];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function tumblr_get_users(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="indash_blog indash_tumblelog_compact fade_in"] > div')
    }else{
        found_elements = $(elem).find('div[class="indash_blog indash_tumblelog_compact fade_in"] > div')
    }

    return found_elements
}

function tumblr_get_posts(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('article')
    }else{
        found_elements = $(elem).find('article')
    }

    return found_elements
}


function tumblr_hide_element(selectedElement, search_term="", z_index_override=null, params={}){
    let wrapper = document.createElement('div');
    let elem = $(selectedElement)
    const styles = window.getComputedStyle(selectedElement);

    if(styles.display == "none"){ return; }

    wrapper.style.color = "white";
    wrapper.style.backgroundColor = "#100e17";
    wrapper.style.height = `${elem.outerHeight()}px`; //selectedElement.offsetHeight + "px";
    wrapper.style.width = `${elem.outerWidth()}px`; //selectedElement.offsetWidth + "px";
    wrapper.style.margin = "1px 0 1px 0px";
    wrapper.style.position = "absolute"
    wrapper.style.borderRadius = "3px"
    wrapper.style.zIndex = 75;

    wrapper.style["overflow-wrap"] = "break-wrap";
    wrapper.style["text-overflow"] = "ellipsis";
    wrapper.style["overflow"] = "hidden";

    if (selectedElement.style.position == "absolute"){

        wrapper.style.top = styles["top"];
        wrapper.style.left = styles["left"];

    }


    if(selectedElement.offsetHeight > 20){
        wrapper.textContent = "Spoiler! " + search_term + " was found in this snippit"
    }


    const classname = "spoiler-blocker-" + uuidv4();
    wrapper.className = classname
    selectedElement.className += ` ${classname}`

    wrapper.addEventListener('click', onclick_spoiler)
    selectedElement.parentNode.insertBefore(wrapper, selectedElement);
}


