/**
 * Created by zaynesprague on 4/27/19.
 */

chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({color: '#3aa757'}, function(){
        console.log("The color is green.");
    });

    chrome.storage.sync.set({blockers: []}, function(){
        console.log("Empty Blockers");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
            })],
            actions: [ new chrome.declarativeContent.ShowPageAction()]
        }]);
    });


});


