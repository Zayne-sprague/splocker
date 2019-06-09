function block_facebook(elem=null){

    const elements = fb_get_page_elements(elem);

    for (var i = 0; i < _.get(elements, 'length'); i++){
        let element = elements[i];

        if (REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
            fb_hide_element(element)
        }
    }


}

function fb_get_page_elements(elem=null){
    let videos = fb_get_videos(elem);
    let shortcuts = fb_get_shortcuts(elem);
    let posts = fb_get_posts(elem);
    let links = fb_get_links(elem);
    let profiles = fb_get_profiles(elem);

    const items = [videos, shortcuts, posts, links, profiles];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function fb_get_videos(elem=null){
    let found_elements;
    //TODO - fix grid videos (last 1)
    if (!elem){
        found_elements = $('div[role="VIDEOS_MIXED"],div[role="VIDEOS"],div[class="clearfix _104r clearfix _ikh"],div[class="_4bl7 _3-8_"],div[id="video_hub_featured_video_container"],div[class="_4-u3 _3cuh _2pi9 _2pio"],td[class="_51m-"]')
    }else{
        found_elements = $(elem).find('div[role="VIDEOS_MIXED"],div[role="VIDEOS"],div[class="clearfix _104r clearfix _ikh"],div[class="_4bl7 _3-8_"],div[id="video_hub_featured_video_container"],div[class="_4-u3 _3cuh _2pi9 _2pio"],td[class="_51m-"]')
    }

    return found_elements
}

function fb_get_shortcuts(elem){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="_77we"]')
    }else{
        found_elements = $(elem).find('div[class="_77we"]')
    }

    return found_elements
}

function fb_get_posts(elem){
    let found_elements;

    if (!elem){
        found_elements = $('div[class="_6rp0"],div[class="_1dwg _1w_m _q7o"],div[aria-label="Comment"],div[class="_5pcr userContentWrapper"]')
    }else{
        found_elements = $(elem).find('div[class="_6rp0"],div[class="_1dwg _1w_m _q7o"],div[aria-label="Comment"],div[class="_5pcr userContentWrapper"]')
    }

    return found_elements
}

function fb_get_links(elem){
    let found_elements;

    if (!elem){
        found_elements = $('a[class="_1k3u"]')
    }else{
        found_elements = $(elem).find('a[class="_1k3u"]')
    }

    return found_elements
}

function fb_get_profiles(elem){
    let found_elements;

    if (!elem){
        found_elements = $('li[class="_4-lt"]')
    }else{
        found_elements = $(elem).find('li[class="_4-lt"]')
    }

    return found_elements
}

function fb_hide_element(selectedElement, search_term="", z_index_override=null, params={}){
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
    wrapper.style.zIndex = 7;

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


