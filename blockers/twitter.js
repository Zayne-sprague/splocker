function block_twitter(elem=null){

    const elements = tw_get_page_elements(elem);

    for (var i = 0; i < _.get(elements, 'length'); i++){
        let element = elements[i];

        if (REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
            tw_hide_element(element)
        }
    }


}

function tw_get_page_elements(elem=null){
    let tweets = tw_get_tweets(elem);
    let moments = tw_get_moments(elem);
    let lists = tw_get_lists(elem);
    let trends = tw_get_trends(elem);
    let people = tw_get_people(elem);

    const items = [tweets, moments, lists, trends, people];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function tw_get_tweets(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('li[data-item-type="tweet"]')
    }else{
        found_elements = $(elem).find('li[data-item-type="tweet"]')
    }

    return found_elements
}

function tw_get_moments(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[data-component-context="moment_capsule"]')
    }else{
        found_elements = $(elem).find('div[data-component-context="moment_capsule"]')
    }

    return found_elements
}

function tw_get_lists(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[data-item-type="list"]')
    }else{
        found_elements = $(elem).find('div[data-item-type="list"]')
    }

    return found_elements
}

function tw_get_trends(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('a[data-query-source="trend_click"]')
    }else{
        found_elements = $(elem).find('a[data-query-source="trend_click"]')
    }

    return found_elements
}

function tw_get_people(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[data-item-type="user"]')
    }else{
        found_elements = $(elem).find('div[data-item-type="user"]')
    }

    return found_elements
}

function tw_hide_element(selectedElement, search_term="", z_index_override=null, params={}){
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
    wrapper.style.zIndex = 2;


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


