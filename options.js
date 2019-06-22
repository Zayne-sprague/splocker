/**
 * Created by zaynesprague on 4/27/19.
 */

let movie_tiles_div = document.getElementById('movieTiles');
let show_tiles_div = document.getElementById('showTiles');
let custom_tiles_div = document.getElementById("customTiles");

const BLOCKABLE_ITEMS = [
    {"title": "Avengers Endgame", "type":"movie", "key": "endgame", "url": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg"},
    {"title": "Game Of Thrones", "type":"show", "key": "game_of_thrones", "url": "https://i.pinimg.com/originals/33/00/3a/33003a2dee1c9e2c87957153abcdc3b7.jpg"},
    {"title": "Barry: HBO", "type":"show", "key": "barry", "url": "https://resizing.flixster.com/itlIMvw9jQogd2VJFp4es2Q5sLA=/206x305/v1.dDsyODI3MzI7ajsxODA5MzsxMjAwOzEyMDA7MTgwMA"},
    {"title": "Black Mirror", "type":"show", "key": "black_mirror", "url": "https://i.pinimg.com/736x/df/a1/d3/dfa1d306e0d040a68c641016e0f132a8.jpg"},
    {"title": "Chernobyl: HBO", "type":"show", "key": "chernobyl", "url": "https://upload.wikimedia.org/wikipedia/en/a/a7/Chernobyl_2019_Miniseries.jpg"},
    {"title": "Godzilla King of Monsters", "type":"movie", "key": "godzilla", "url": "https://m.media-amazon.com/images/M/MV5BOGFjYWNkMTMtMTg1ZC00Y2I4LTg0ZTYtN2ZlMzI4MGQwNzg4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"},
    {"title": "IT Chapter Two", "type":"movie", "key": "it_chapter_two", "url": "https://m.media-amazon.com/images/M/MV5BNDlhMWY0NzYtMGQ4Yi00ZWFhLTkwZTctMGVjZDA0MTA5N2I5XkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_UX182_CR0,0,182,268_AL_.jpg"},
    {"title": "Joker", "type":"movie", "key": "joker", "url": "https://m.media-amazon.com/images/M/MV5BMTcyNjU1MjQ3MF5BMl5BanBnXkFtZTgwNTk1MDA4NzM@._V1_UX182_CR0,0,182,268_AL_.jpg"},
    {"title": "Spider-Man: Far From Home", "type":"movie", "key": "spider_man_far_from_home", "url": "https://m.media-amazon.com/images/M/MV5BNmIxMzY4ZTgtYmMzOS00NTU5LWJjYzAtYjM5YmE3OTAwMTFlXkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_UX182_CR0,0,182,268_AL_.jpg"},
    {"title": "Star Wars: Episode IX", "type":"movie", "key": "star_wars_the_rise_of_skywalkers", "url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Star_Wars_Episode_IX_poster.jpg/220px-Star_Wars_Episode_IX_poster.jpg"},
    {"title": "Stranger Things", "type":"show", "key": "stranger_things", "url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/ST3LambertPoster.png/220px-ST3LambertPoster.png"},
    {"title": "The Walking Dead", "type":"show", "key": "walking_dead", "url": "https://cdn.shopify.com/s/files/1/1353/0647/products/season1poster_1024x1024.png?v=1540413234"}
]



//TODO - use lodash instead yo
function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });

}


function construct_movie_options(){
    chrome.storage.sync.get('blockers', function(data) {

        let selected_tiles = data.blockers

        for (var item in BLOCKABLE_ITEMS){
            const title = BLOCKABLE_ITEMS[item]["title"];
            const tile_type = BLOCKABLE_ITEMS[item]["type"];
            const key = BLOCKABLE_ITEMS[item]["key"];
            const url = BLOCKABLE_ITEMS[item]["url"];

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

            let tile = document.createElement("div")
            tile.style.display = "inline-block"
            tile.style.margin = "40px"
            tile.style.cursor = "pointer"
            tile.style.textAlign = "center"
            tile.appendChild(button);

            let tileHeader = document.createElement("div")
            tileHeader.style.color = "white"
            tileHeader.style.fontSize = "20px"
            tileHeader.textContent = title

            if(selected_tiles.includes(key)){
                button.style["filter"] = "drop-shadow(0px 0px 25px #FFFFFF)"
            }

            tile.addEventListener("click", this.select_tile.bind(this, key, button, tileHeader))

            tile.appendChild(tileHeader)

            if (tile_type == "show"){
                show_tiles_div.appendChild(tile);
            }else{
                movie_tiles_div.appendChild(tile);
            }


        }

    })
}

function construct_custom_options(){
    clear_custom_tiles();


    chrome.storage.sync.get('blockers', function(data) {
        let selected_tiles = data.blockers

        chrome.storage.sync.get('custom_blockers', function (data) {
            let custom_tiles = _.union(_.get(data, 'custom_blockers', []), [custom_blocker_data()])


            for (var item in custom_tiles) {

                let title = custom_tiles[item]['title']
                let image_type = custom_tiles[item]['image']['type']
                let image_url = custom_tiles[item]['image']['url']
                let blockers = custom_tiles[item]['blockers']


                let button = document.createElement('button')
                button.style.background = `url(${image_url})`;
                button.style.width = "189px"
                button.style.height = "280px"
                button.style["background-repeat"] = "no-repeat"
                button.style["background-size"] = "contain"
                button.style["border"] = "none"
                button.style["filter"] = "drop-shadow(0px 0px 35px #444444)"
                button.style["margin"] = "20px";
                button.style["padding"] = "0px"
                button.style["cursor"] = "pointer"

                let tile = document.createElement("div")
                tile.style.position = "relative"
                tile.style.display = "inline-block"
                tile.style.margin = "40px"
                tile.style.cursor = "pointer"
                tile.style.textAlign = "center"
                tile.appendChild(button);


                let edit_icon = document.createElement("button");
                edit_icon.className="edit-icon";


                let tileHeader = document.createElement("div")
                tileHeader.style.color = "white"
                tileHeader.style.fontSize = "20px"
                tileHeader.textContent = title

                if (selected_tiles.includes(title)) {
                    button.style["filter"] = "drop-shadow(0px 0px 25px #FFFFFF)"
                }

                if(_.get(blockers, '[0]', '') != "ONCLICK_HANDLER_SPECIAL"){
                    tile.addEventListener("click", this.select_custom_tile.bind(this, title, blockers, button, tileHeader))
                    edit_icon.addEventListener("click", this.selected_custom_tile_edit.bind(this, title))
                    tile.appendChild(edit_icon);
                }else{
                    tile.addEventListener('click', start_form.bind(this))
                }

                tile.appendChild(tileHeader)

                custom_tiles_div.appendChild(tile);

            }

        })
    })


}

function clear_custom_tiles(){
    let tiles = $("#customTiles div")

    for (var i = 0; i < tiles.length; i++){
        tiles.remove();
    }
}

function custom_blocker_data(){
    return {
        title: "",
        image: {"type": "internal", "url": "images/New_Blocker.png"},
        blockers: ["ONCLICK_HANDLER_SPECIAL"]
    }
}

function select_tile(key, button, header){
    chrome.storage.sync.get('blockers', function(data) {

        let selected_tiles = data.blockers

        if(selected_tiles.includes(key)){
            selected_tiles = arrayRemove(selected_tiles, key)
            button.style["filter"] = "drop-shadow(0px 0px 35px #444444)"
        }else{
            selected_tiles.push(key);
            button.style["filter"] = "drop-shadow(0px 0px 25px #FFFFFF)"
        }

        chrome.storage.sync.set({blockers: selected_tiles}, function(){
            console.log("blocking " + selected_tiles);
        })
    })

}

function select_custom_tile(key, blockers, button, header){
    chrome.storage.sync.get('blockers_custom', function(data) {

        let selected_tiles = _.get(data, 'blockers_custom', {})

        if(_.get(selected_tiles, key)){
            delete selected_tiles[`${key}`]
            button.style["filter"] = "drop-shadow(0px 0px 35px #444444)"
        }else{
            selected_tiles[key] = blockers;
            button.style["filter"] = "drop-shadow(0px 0px 25px #FFFFFF)"
        }

        chrome.storage.sync.set({blockers_custom: selected_tiles}, function(){
            console.log("blocking " + selected_tiles);
        })
    })

}

function selected_custom_tile_edit(title){
    start_edit(title)
}

//TODO - this is good for debugging custom blockers
//chrome.storage.sync.set({'custom_blockers': []})


construct_movie_options()
construct_custom_options()