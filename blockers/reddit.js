function block_reddit(elem=null){

    const elements = reddit_get_page_elements(elem);

    for (var i = 0; i < _.get(elements, 'length'); i++){
        let element = elements[i];

        if (REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
            reddit_hide_element(element)
        }
    }


}

function reddit_get_page_elements(elem=null){
    let communites_and_users = reddit_get_communites_and_users(elem)
    let posts = reddit_get_posts(elem);
    let comments = reddit_get_comments(elem);

    const items = [communites_and_users, posts, comments];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function reddit_get_communites_and_users(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('a[class="drj9xz-3 gnPsqz s1vwhtdg-0 eNMPaR"]').parent()
    }else{
        found_elements = $(elem).find('a[class="drj9xz-3 gnPsqz s1vwhtdg-0 eNMPaR"]').parent()
    }

    return found_elements
}

function reddit_get_posts(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div.Post').parent()
    }else{
        found_elements = $(elem).find('div.Post').parent()
    }

    return found_elements
}

function reddit_get_comments(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div.Comment').parent()
    }else{
        found_elements = $(elem).find('div.Comment').parent()
    }

    return found_elements
}

function reddit_hide_element(selectedElement, search_term="", z_index_override=null, params={}){
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
    wrapper.style.zIndex = 4;

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


