function block_google(elem=null){

    const elements = google_get_page_elements(elem);

    for (var i = 0; i < _.get(elements, 'length'); i++){
        let element = elements[i];

        if (REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
            google_hide_element(element)
        }
    }


}

function google_get_page_elements(elem=null){
    let links = google_get_links(elem);
    let asked = google_get_people_also_asked(elem);
    let movies = google_get_movie_tiles(elem);
    let also_searched = google_get_also_searched_for(elem);
    let articles = google_get_articles(elem);
    let market_items = google_get_market_items(elem);
    //let pics = google_get_pictures(elem); //TODO - fix grid issue
    //TODO - get top pills on picture tab

    const items = [links, asked, movies, also_searched, articles, market_items];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function google_get_links(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="rc"],g-inner-card[class="cv2VAd"]')
    }else{
        found_elements = $(elem).find('div[class="rc"],g-inner-card[class="cv2VAd"]')
    }

    return found_elements
}

function google_get_people_also_asked(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[jsname="ARU61"]')
    }else{
        found_elements = $(elem).find('div[jsname="ARU61"]')
    }

    return found_elements
}

function google_get_movie_tiles(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="XQ6p1d"]').parent()
    }else{
        found_elements = $(elem).find('div[class="XQ6p1d"]').parent()
    }

    return found_elements
}

function google_get_also_searched_for(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('p[class="nVcaUb"] > a')
    }else{
        found_elements = $(elem).find('p[class="nVcaUb"] > a')
    }

    return found_elements
}

function google_get_articles(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="g card"]')
    }else{
        found_elements = $(elem).find('div[class="g card"]')
    }

    return found_elements
}

function google_get_market_items(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="sh-dgr__content"]')
    }else{
        found_elements = $(elem).find('div[class="sh-dgr__content"]')
    }

    return found_elements
}

function google_get_pictures(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="rg_bx rg_di rg_el ivg-i"]')
    }else{
        found_elements = $(elem).find('div[class="rg_bx rg_di rg_el ivg-i"]')
    }

    return found_elements
}

function google_hide_element(selectedElement, search_term="", z_index_override=null, params={}){
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

    if (styles["display"] == "inline-block"){
        wrapper.style.top = `${ selectedElement.getBoundingClientRect().top}px`;
        wrapper.style.left = `${selectedElement.getBoundingClientRect().left}px`;
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


