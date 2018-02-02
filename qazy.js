if(!("qazy" in window))
    window.qazy = {};
if(!("img" in qazy))
    qazy.img = "";
if(!("elems" in qazy))
    qazy.elems = void(0);

/**
 * Reveal a single element.
 */
qazy.reveal = function(elem) {
	var qazySrcAttribute = elem.getAttribute("data-qazy-src")
	if(typeof qazySrcAttribute === "string")
		elem.src = qazySrcAttribute;
	elem.removeAttribute("data-qazy-src");
}

/**
 * Hide a single element.
 */
qazy.hide = function(elem) {
    if(elem.getAttribute("data-qazy-src") === null) {
        elem.setAttribute("data-qazy-src", elem.src);
        elem.src = qazy.img;
    }
}

/**
 * Returns whether an element is visible to the user.
 */
qazy.isVisible = function(elem) {
    var tempElem = elem;
    while(true) {
        if(tempElem.nodeType !== 1)
            return false;
        if(tempElem.offsetWidth || tempElem.offsetHeight || tempElem.getClientRects().length)
            return false;
        if(window.getComputedStyle) {
            if(document.defaultView.getComputedStyle(tempElem)['opacity'] === '0' || document.defaultView.getComputedStyle(tempElem)['display'] === 'none' || document.defaultView.getComputedStyle(tempElem)['visibility'] === 'hidden')
                return false;
        }
        else {
            if(tempElem.currentStyle['opacity'] === '0' || tempElem.currentStyle['display'] === 'none' || tempElem.currentStyle['visibility'] === 'hidden')
                return false;
        }
        if(tempElem === document.documentElement)
            break;
        if(tempElem.parentNode === null)
            return false;
        tempElem = tempElem.parentNode;
    }
    var elemDomRect = elem.getBoundingClientRect();
    if(elemDomRect.top > window.innerHeight || elemDomRect.left > window.innerWidth || elemDomRect.bottom < 0 || elemDomRect.right < 0)
        return false;
    return true;
}

qazy.scan = function(){
	for(var count = 0; count < qazy.elems.length; count++)
	{
		var offsetParentTop = 0;
		var temp = qazy.elems[count];
		do
		{
			if(!isNaN(temp.offsetTop))
			{
				offsetParentTop += temp.offsetTop;
			}
		}while(temp = temp.offsetParent)
		
		var pageYOffset = window.pageYOffset;
		var viewportHeight = window.innerHeight;
		
		var offsetParentLeft = 0;
		var temp = qazy.elems[count];
		do
		{
			if(!isNaN(temp.offsetLeft))
			{
				offsetParentLeft += temp.offsetLeft;
			}
		}while(temp = temp.offsetParent);
		
		var pageXOffset = window.pageXOffset;
		var viewportWidth = window.innerWidth;
		
		if(offsetParentTop > pageYOffset && offsetParentTop < pageYOffset + viewportHeight && offsetParentLeft > pageXOffset && offsetParentLeft < pageXOffset + viewportWidth)
		{
			qazy.elems[count].src = qazy.elems[count].getAttribute("data-qazy-src");
			qazy.elems.splice(count, 1);
			count--;
		}
	}
};
            
window.addEventListener("resize", qazy.scan, false);
window.addEventListener("scroll", qazy.scan, false);
            
//responsible for stopping img loading the image from server and also for displaying lazy loading image.
qazy.qazy_list_maker = function(){
	var elements = document.querySelectorAll("img[data-qazy][data-qazy='true']");
	
	for(var count = 0; count < elements.length; count++)
	{
		qazy.elems.push(elements[count]);
		elements[count].setAttribute("data-qazy", "false");
		
		var source_url = elements[count].src;
		elements[count].setAttribute("data-qazy-src", source_url);
		
		elements[count].src = elements[count].getAttribute("data-qazy-placeholder") || qazy.img; 
	}
};
            
qazy.intervalObject = setInterval(function(){
	qazy.qazy_list_maker();
}, 50);

window.addEventListener("load", function() {
	clearInterval(qazy.intervalObject);
	qazy.qazy_list_maker();
	qazy.scan();
}, false);
