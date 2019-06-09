let REGEX = null

function get_blocker_array(blockers){
    let return_data = []
    if (blockers.length >= 0) {

        for (const blocker in blockers) {
            return_data = _.union(return_data, SPOILERS[blockers[blocker]])
        }

    }

    return return_data;
}

function build_regex(tags=null){
    if (!tags){
        tags = get_blocker_array()
    }
    if (!tags || _.size(tags) <= 0){
        return null
    }
    REGEX = new RegExp(`\\b(?<![.])(${_.join(tags, '|')})[.]?\\b`, 'i')
}

function is_this_a_spoiler_blocker_element(element){
    //614.8ms on reddit
    return _.includes(_.get(element, 'className', ''), 'spoiler-blocker-') || _.includes(_.get(element, 'parentNode.className', ''), 'spoiler-blocker-')
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}