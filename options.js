/**
 * Created by zaynesprague on 4/27/19.
 */

let movie_tiles_div = document.getElementById('movieTiles');


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
            button.style.width = "189px"
            button.style.height = "280px"
            button.style["background-repeat"] = "no-repeat"
            button.style["background-size"] = "contain"
            button.style["border"] = "none"
            button.style["filter"] = "drop-shadow(0px 0px 35px #444444)"
            button.style["margin"] = "20px";
            button.style["padding"] = "0px"
            button.style["cursor"] = "pointer"



            button.addEventListener('click', ()=>{})

            let movieTile = document.createElement("div")
            movieTile.style.display = "inline-block"
            movieTile.style.margin = "40px"
            movieTile.style.cursor = "pointer"
            movieTile.appendChild(button);

            let movieTileHeader = document.createElement("div")
            movieTileHeader.style.textAlign = "center"
            movieTileHeader.style.color = "white"
            movieTileHeader.style.fontSize = "20px"
            movieTileHeader.textContent = title

            movieTile.addEventListener("mouseenter", function(){
                movieTileHeader.style.textDecoration = "underline"
            })

            movieTile.addEventListener("mouseleave", function(){
                movieTileHeader.style.textDecoration = ""
            })

            if(selected_tiles.includes(key)){
                button.style["filter"] = "drop-shadow(0px 0px 35px #FFFFFF)"
            }

            movieTile.addEventListener("click", this.select_tile.bind(this, key, button, movieTileHeader))

            movieTile.appendChild(movieTileHeader)

            movie_tiles_div.appendChild(movieTile);


        }

    })
}

function select_tile(key, button, header){
    chrome.storage.sync.get('blockers', function(data) {

        let selected_tiles = data.blockers

        if(selected_tiles.includes(key)){
            selected_tiles = arrayRemove(selected_tiles, key)
            button.style["filter"] = "drop-shadow(0px 0px 35px #444444)"
        }else{
            selected_tiles.push(key);
            button.style["filter"] = "drop-shadow(0px 0px 35px #FFFFFF)"
        }

        chrome.storage.sync.set({blockers: selected_tiles}, function(){
            console.log("blocking " + selected_tiles);
        })
    })

}

construct_movie_options()
