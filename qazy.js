if(!("qazy" in window))
    window.qazy = {};
if(!("img" in qazy))
    qazy.img = "";
if(!("elems" in qazy))
    qazy.elems = qazy.autoSelect();

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

/**
 * Return a standard list of elements to lazy load.
 */
qazy.autoSelect = function() {
    return document.getElementsByTagName("IMG");
}

/**
 * Scan the given set of elements and reveal the visible elements.
 */
qazy.scan = function(elems) {
    for(var i = 0; i < elems.length; i++) {
        if(qazy.isVisible(elems[i]))
            qazy.reveal(elems[i]);
    }
}

/**
 * Scan the configured list of elements and reveal the visible elements.
 */
qazy.autoReveal = function() {
    qazy.scan(qazy.elems);
}
            
window.addEventListener("resize", qazy.scan, false);
window.addEventListener("scroll", qazy.scan, false);
//responsible for stopping img loading the image from server and also for displaying lazy loading image.

/**
 * Lazy load the given set of elements.
 */
qazy.lazyLoad = function(elems) {
    for(var i = 0; i < elems.length; i++)
        qazy.hide(elems[i]);
}

qazy.autoHide = function(){
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
	qazy.autoHide();
}, 50);

window.addEventListener("load", function() {
	clearInterval(qazy.intervalObject);
	qazy.autoHide();
	qazy.scan();
}, false);
