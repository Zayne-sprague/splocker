function block_youtube(elem=null){

    const elements = youtube_get_page_elements(elem);

    for (var i = 0; i < _.get(elements, 'length'); i++){
        let element = elements[i];

        if (REGEX.test(_.get(element, 'innerText')) && !is_this_a_spoiler_blocker_element(element) && element.tagName != "SCRIPT"){
            youtube_hide_element(element)
        }
    }


}

function youtube_get_page_elements(elem=null){
    let videos = youtube_get_videos(elem);
    let movies = youtube_get_movies(elem);
    let descriptions = youtube_get_descriptions(elem);
    let comments = youtube_get_comments(elem);

    const items = [videos, movies, descriptions, comments];

    return $( $.map(items, a => [...$.makeArray(a)]) )

}

function youtube_get_videos(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('.style-scope.ytd-video-renderer[id="dismissable"]')
    }else{
        found_elements = $(elem).find('.style-scope.ytd-video-renderer[id="dismissable"]')
    }

    return found_elements
}

function youtube_get_descriptions(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[id="container"][class="style-scope ytd-video-secondary-info-renderer"]')
    }else{
        found_elements = $(elem).find('div[id="container"][class="style-scope ytd-video-secondary-info-renderer"]')
    }

    return found_elements
}

function youtube_get_movies(elem=null){
    let found_elements;


    //TODO - Fix inlined elements
    if (!elem){
        found_elements = $('ytd-movie-renderer,ytd-grid-movie-renderer,div[id="dismissable"][class="style-scope ytd-compact-video-renderer"],div[id="dismissable"][class="style-scope ytd-grid-video-renderer"]')
    }else{
        found_elements = $(elem).find('ytd-movie-renderer,ytd-grid-movie-renderer,div[id="dismissable"][class="style-scope ytd-compact-video-renderer"],div[id="dismissable"][class="style-scope ytd-grid-video-renderer"]')
    }

    return found_elements
}

function youtube_get_comments(elem=null){
    let found_elements;

    if (!elem){
        found_elements = $('div[id="body"][class="style-scope ytd-comment-renderer"]')
    }else{
        found_elements = $(elem).find('div[id="body"][class="style-scope ytd-comment-renderer"]')
    }

    return found_elements
}


function youtube_hide_element(selectedElement, search_term="", z_index_override=null, params={}){
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


