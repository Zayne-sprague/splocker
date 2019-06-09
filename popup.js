
let changeColor = document.getElementById('changeColor')
let movieTilesDiv = document.getElementById('movieTiles')


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



