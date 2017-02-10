chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "getUseridCookie") {
      chrome.cookies.get({url: "https://revcontent.com/", name: "__ID"}, function(cookie) {
         var userid = cookie.value;
         sendResponse({cookieValue: userid});
   	  });
    }
   return true;
});

chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab)
    chrome.tabs.sendMessage(tab.id, {action: "replaceData"}, function(response) {});
 });
