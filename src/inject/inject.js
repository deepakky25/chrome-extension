document.cookie = "rc_userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
chrome.extension.sendMessage({ action: "getUseridCookie" }, function(response) {
	document.cookie = "rc_userid="+response.cookieValue;
});

function getDevice(width) {
	width = parseInt(width);
	if(width < 768)
	  return "phone";
	else if (width >= 768 && width < 992)
		return "tablet";
	else if (width >= 992 && width < 1200)
		return "desktop";
	else if (width >= 1200 )
		return "desktoplg"
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function extractPageData() {
	if($('div[id^="rcjsload"] script')) {
		var src = $('div[id^="rcjsload"] script').attr("src");
	  var widget_id = src.split("?")[1].split("&")[0].split("=")[1];
		var device = getDevice(src.split("?")[1].split("&")[3].split("=")[1]);
		var curr_url = window.location.href;
		var userid = getCookie("rc_userid");
		console.log(widget_id + "  " + device + "  " + curr_url + " " + userid);

	  var url = "";
		$.ajax({
	    url: url,
	    data: {"widget_id": widget_id, "device": device, "url": curr_url, "userid": userid },
	    method: "GET",
	    dataType:'json',
	    success: function (responses) {
				//var response = [{"headline": "Aleppo Is In Ruins", "provider": "revcontent", "image-url": "//blogs-images.forbes.com/unicefusa/files/2017/02/640.UN051527_Med-Res-2.jpg?width=960"}, {"headline": "But These Kids Are", "provider": "revcontent", "image-url": "//blogs-images.forbes.com/unicefusa/files/2017/02/640.Nagham.UN051530_Med-Res.jpg?width=960"}];
				var divs = $(".rc-item");
				for(var i = 0 ; i < response.length && i < divs.length ; i++) {
					$(divs[i]).find(".rc-headline").html(response[i]["headline"]);
					$(divs[i]).find(".rc-provider").html(response[i]["provider"]);
					var block = $(divs[i]).find(".rc-photo").attr("style").split("background-image:")[1].trim().split(" ");
					block[0] = "url('"+response[i]["image-url"]+"');";
					$(divs[i]).find(".rc-photo").attr("style", "background-image: "+block.join(" "));
				}
	    },
	    error: function () {
	        alert("Error Occured");
	    }
	  });
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == "replaceData") {
		alert("hello");
    extractPageData();
	}
  sendResponse();
});
