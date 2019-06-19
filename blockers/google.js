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
    let tweets = google_get_tweets(elem);
    let sponsored_content = google_get_sponsored_top_window(elem);
    let side_window = google_get_side_window(elem);
    let pics = google_get_pictures(elem); //TODO - fix grid issue
    //TODO - get top pills on picture tab

    const items = [side_window, links, asked, movies, also_searched, articles, market_items, tweets, sponsored_content, pics];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function google_get_links(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="rc"],g-inner-card[class="cv2VAd"],div[data-hveid="CAoQAA"]')
    }else{
        found_elements = $(elem).find('div[class="rc"],g-inner-card[class="cv2VAd"],div[data-hveid="CAoQAA"]')
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
        found_elements = $('div[class="sh-dgr__content"],div[class="sh-dlr__content"]')
    }else{
        found_elements = $(elem).find('div[class="sh-dgr__content"],div[class="sh-dlr__content"]')
    }

    return found_elements
}

function google_get_tweets(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('g-inner-card[class="zf84ud cv2VAd"]')
    }else{
        found_elements = $(elem).find('g-inner-card[class="zf84ud cv2VAd"]')
    }

    return found_elements
}

function google_get_sponsored_top_window(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="lr_container mod"], div[class="rl_container"]')
    }else{
        found_elements = $(elem).find('div[class="lr_container mod"], div[class="rl_container"]')
    }

    return found_elements
}

function google_get_side_window(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="kp-header"]').parent()
    }else{
        found_elements = $(elem).find('div[class="kp-header"]').parent()
    }

    return found_elements
}

function google_get_pictures(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="mVDMnf nJGrxf"]')
    }else{
        found_elements = $(elem).find('div[class="mVDMnf nJGrxf"]')
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

    if (_.get(selectedElement, 'innerHTML', '').includes("kp-header")){
        wrapper.style.zIndex = 5;
    }

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

    // SPECIAL CASE FOR IMAGES //

    if (_.get(selectedElement, 'className', '').includes("mVDMnf nJGrxf")){
        let parent_elem = $(selectedElement.parentElement)
        let real_elem = $(selectedElement.parentElement.parentElement)
        wrapper.style.height = `${real_elem.outerHeight()}px`;
        wrapper.style.width = `${real_elem.outerWidth()}px`;
        wrapper.style.left = `0px`
        wrapper.style.top = `-${real_elem.outerHeight() - parent_elem.outerHeight()}px`
    }


    const classname = "spoiler-blocker-" + uuidv4();
    wrapper.className = classname
    selectedElement.className += ` ${classname}`

    wrapper.addEventListener('click', onclick_spoiler)
    selectedElement.parentNode.insertBefore(wrapper, selectedElement);
}


