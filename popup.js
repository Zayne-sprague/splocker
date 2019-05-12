
let changeColor = document.getElementById('changeColor')
let movieTilesDiv = document.getElementById('movieTiles')

function fx(search_terms){
    if(window.find){
        for (var search_term_index in search_terms) {
            var search_term = search_terms[search_term_index];

            while (window.find(search_term)) {
                //TODO - find a better way of doing this (causing screen movement)
                var rng = window.getSelection().getRangeAt(0);

                function rangeSelectsSingleNode(range) {
                    var startNode = range.startContainer;
                    return startNode === range.endContainer &&
                        startNode.hasChildNodes() &&
                        range.endOffset === range.startOffset + 1;
                }

                var selectedElement = null;
                if (rangeSelectsSingleNode(rng)) {
                    // Selection encompasses a single element
                    selectedElement = range.startContainer.childNodes[rng.startOffset];
                } else if (rng.startContainer.nodeType === 3) {
                    // Selection range starts inside a text node, so get its parent
                    selectedElement = rng.startContainer.parentNode;

                    if(selectedElement.tagName == "EM"){
                        selectedElement = selectedElement.parentNode;
                    }
                } else {
                    // Selection starts inside an element
                    selectedElement = rng.startContainer;
                }

                var wrapper = document.createElement('div');


                wrapper.style.color = "white";
                wrapper.style.backgroundColor = "black";
                wrapper.style.height = "calc(" + selectedElement.offsetHeight + "px)";
                wrapper.style.width = selectedElement.offsetWidth + "px";
                wrapper.style.margin = "1px 0 1px 0px";
                wrapper.style.zIndex = "1000000"
                wrapper.style.position = "absolute";
                wrapper.style["overflow-wrap"] = "break-wrap";
                wrapper.style["text-overflow"] = "ellipsis";

                if(selectedElement.offsetHeight > 20){
                    wrapper.textContent = "Spoiler! " + search_term + " was found in this snippit"
                }

                wrapper.addEventListener('click', hide_element)

                //selectedElement.style.display = "none";

                selectedElement.parentNode.insertBefore(wrapper, selectedElement);
                //wrapper.appendChild(selectedElement);


            }
        }
    }
}

chrome.storage.sync.get('blockers', function(data) {
    let selected_tiles = data.blockers

    var ar = []
    for (var tile in selected_tiles){

        for(var item in SPOILERS[selected_tiles[tile]]){
            ar.push(item);
        }
    }

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: `(${fx})(${ar});`
            }, () => {
            });
    })
})

function hide_element(e){
    e.preventDefault()
    e.target.style.background = "transparent"
    e.target.textContent = ""
    e.target.removeEventListener("click", hide_element)

}







//TODO - use lodash instead yo
function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });

}


function construct_movie_options(){
    chrome.storage.sync.get('blockers', function(data) {

        let selected_tiles = data.blockers

        const blockable_items = [
            {"title": "Avengers Endgame", "key": "endgame", "url": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg"},
            {"title": "Game Of Thrones", "key": "game_of_thrones", "url": "https://i.pinimg.com/originals/33/00/3a/33003a2dee1c9e2c87957153abcdc3b7.jpg"}
        ]

        for (var item in blockable_items){
            const title = blockable_items[item]["title"];
            const key = blockable_items[item]["key"];
            const url = blockable_items[item]["url"];

            let button = document.createElement('button')
            button.style.background = `url(${url})`;
            button.style.width = "80px"
            button.style.height = "120px"
            button.style["background-repeat"] = "no-repeat"
            button.style["background-size"] = "contain"
            button.style["border"] = "none"
            button.style["filter"] = "drop-shadow(0px 0px 20px #444444)"
            button.style["margin"] = "20px";

            if(selected_tiles.includes(key)){
                button.style["filter"] = "drop-shadow(0px 0px 20px #FFFFFF)"
            }

            button.addEventListener('click', function(){
                chrome.storage.sync.get('blockers', function(data) {

                    let selected_tiles = data.blockers

                    if(selected_tiles.includes(key)){
                        selected_tiles = arrayRemove(selected_tiles, key)
                        button.style["filter"] = "drop-shadow(0px 0px 20px #444444)"
                    }else{
                        selected_tiles.push(key);
                        button.style["filter"] = "drop-shadow(0px 0px 20px #FFFFFF)"
                    }

                    chrome.storage.sync.set({blockers: selected_tiles}, function(){
                        chrome.tabs.query({currentWindow: true, active: true},function(tabArray) {
                            chrome.tabs.sendMessage(tabArray[0].id,"");
                        });
                    })
                })

            })

            movieTilesDiv.appendChild(button);


        }

    })
}

construct_movie_options()



