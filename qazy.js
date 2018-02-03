/*! Qazy 1.0.0 | MIT License | https://github.com/EIGHTFINITE/qazy */

(function(){
"use strict";

// Create the qazy object if it does not yet exist
if(!("qazy" in window))
    window.qazy = {};
// Current version. This is the one thing you can't override
qazy.version = "1.0.0";
// Default url to change images to. Empty by default hiding images
if(!("img" in qazy))
    qazy.img = "";
// Set to 0 or higher to catch any late images. Elems are overridden every run
if(!("interval" in qazy))
    qazy.interval = -1;
// Set to true to prevent automatic setup
if(!("preventSetup" in qazy))
    qazy.preventSetup = false;

/**
 * Return a standard list of elements to lazy load.
 *
 * @returns {HTMLCollection} - A standard list of elements to lazy load.
 */
if(!("autoSelect" in qazy)) {
    qazy.autoSelect = function() {
        return document.getElementsByTagName("IMG");
    }
}

// Set of elements to automatically hide/reveal. (You can also just pass a set
// to the scan and lazyLoad functions instead of setting it here.)
if(!("elems" in qazy))
    qazy.elems = qazy.autoSelect();

/**
 * Returns whether an element is visible to the user.
 *
 * @param {HTMLElement} elem - Element to be checked for visibility.
 *
 * @returns {boolean} - Visibility.
 */
if(!("isVisible" in qazy)) {
    qazy.isVisible = function(elem) {
        var tempElem = elem;
        while(true) {
            if(tempElem.nodeType !== 1 || !tempElem.getClientRects().length)
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
}

/**
 * Reveal a single element.
 *
 * @param {HTMLElement} elem - Element to be revealed.
 * @param {boolean=} ignorePlaceholder - (Optional) Ignore placeholder.
 *
 * @returns {boolean} - Success.
 */
if(!("reveal" in qazy)) {
    qazy.reveal = function(elem, ignorePlaceholder) {
        var success = false;
        var qazyPlaceholderAttribute = elem.getAttribute("data-qazy-placeholder");
        if(!ignorePlaceholder && typeof qazyPlaceholderAttribute === "string") {
            elem.src = qazyPlaceholderAttribute;
            success = true;
        }
        else {
            var qazySrcAttribute = elem.getAttribute("data-qazy-src");
            if(typeof qazySrcAttribute === "string") {
                elem.src = qazySrcAttribute;
                success = true;
            }
        }
        elem.removeAttribute("data-qazy-src");
        return success;
    }
}

/**
 * Scan the given set of elements and reveal the visible elements.
 *
 * @param {(Array|HTMLCollection)} elems - The set of elements to scan.
 * @param {boolean=} force - (Optional) Reveal all elements.
 * @param {boolean=} ignorePlaceholder - (Optional) Ignore placeholders.
 *
 * @returns {number} - Number of elements that were revealed.
 */
if(!("scan" in qazy)) {
    qazy.scan = function(elems, force, ignorePlaceholder) {
        var count = 0;
        for(var i = 0; i < elems.length; i++) {
            if(force || qazy.isVisible(elems[i]))
                count += qazy.reveal(elems[i], ignorePlaceholder);
        }
        return count;
    }
}

/**
 * Scan the configured list of elements and reveal the visible elements.
 *
 * @returns {number} - Number of elements that were revealed.
 */
if(!("autoReveal" in qazy)) {
    qazy.autoReveal = function() {
        return qazy.scan(qazy.elems);
    }
}

/**
 * Hide a single element.
 *
 * @param {HTMLElement} elem - Element to be hidden.
 *
 * @returns {boolean} - Success.
 */
if(!("hide" in qazy)) {
    qazy.hide = function(elem) {
        if(elem.getAttribute("data-qazy-src") !== null)
            return false;
        elem.setAttribute("data-qazy-src", elem.src);
        elem.src = qazy.img;
        return true;
    }
}

/**
 * Lazy load the given set of elements.
 *
 * @param {(Array|HTMLCollection)} elems - The set of elements to lazy load.
 * @param {boolean=} force - (Optional) Lazy load elements even if they are visible.
 *
 * @returns {number} - Number of elements that were lazy loaded.
 */
if(!("lazyLoad" in qazy)) {
    qazy.lazyLoad = function(elems, force) {
        var count = 0;
        for(var i = 0; i < elems.length; i++) {
            if(force || !qazy.isVisible(elems[i]))
                count += qazy.hide(elems[i]);
        }
        return count;
    }
}

/**
 * Hide the configured list of elements.
 *
 * @returns {number} - Number of elements that were lazy loaded.
 */
if(!("autoHide" in qazy)) {
    qazy.autoHide = function() {
        return qazy.lazyLoad(qazy.elems);
    }
}

/**
 * Code to be run by the interval object.
 */
if(!("intervalFunction" in qazy)) {
    qazy.intervalFunction = function() {
        qazy.elems = qazy.autoSelect();
        qazy.autoHide();
        qazy.autoReveal();
    }
}

/**
 * Code to be run when the page is loaded.
 */
if(!("onload" in qazy)) {
    qazy.onload = function() {
        if(qazy.interval >= 0) {
            // Run the interval code one last time
            qazy.intervalFunction();
            clearInterval(qazy.intervalObject);
        }
        qazy.autoHide();
        qazy.autoReveal();
    }
}

/**
 * Code to be run when the page is resized.
 */
if(!("onresize" in qazy)) {
    qazy.onresize = function() {
        qazy.autoReveal();
    }
}

/**
 * Code to be run when the page is scrolled.
 */
if(!("onscroll" in qazy)) {
    qazy.onscroll = function() {
        qazy.autoReveal();
    }
}

/**
 * Sets up the listeners to automatically lazy load images.
 */
if(!("setup" in qazy)) {
    qazy.setup = function() {
        if(qazy.interval >= 0) {
            qazy.intervalObject = setInterval(qazy.intervalFunction, qazy.interval);
        }
        if(window.addEventListener) {
            window.addEventListener("resize", qazy.onresize, false);
            window.addEventListener("scroll", qazy.onscroll, false);
            window.addEventListener("load", qazy.onload, false);
        }
        else {
            window.attachEvent("onresize", qazy.onresize);
            window.attachEvent("onscroll", qazy.onscroll);
            window.attachEvent("onload", qazy.onload);
        }
        qazy.autoHide();
        qazy.autoReveal();
    }
}

// Run the setup
if(!qazy.preventSetup)
    qazy.setup();

})();
