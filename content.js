

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    block_content()
});




// ---- ON LOAD ---- //
block_content()
// ----------------- //



// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type == 'childList') {
            check_element_mutation(mutation.addedNodes);
        }
        else if (mutation.type == 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};


window.addEventListener("load", function(){
    // Options for the observer (which mutations to observe)
    let config = { childList: true, subtree: true };

    let observer = new MutationObserver(callback);
    observer.observe(document.getElementsByTagName("body")[0], config);

})
