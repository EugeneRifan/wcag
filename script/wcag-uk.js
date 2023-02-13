var version="22";

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function linkUnderstanding() {
	var understandingBaseURI;
	if (respecConfig.specStatus == "ED") understandingBaseURI = "../../understanding/";
	else understandingBaseURI = "https://www.w3.org/WAI/WCAG" + version + "/Understanding/";
	document.querySelectorAll('.sc,.guideline').forEach(function(node){
		var heading = textNoDescendant(findHeading(node));
		var pathFrag = titleToPathFrag(heading);
		if (node.id == "parsing") pathFrag = "parsing"; // special case parsing
		var el = document.createElement("div");
		el.setAttribute("class", "doclinks");
		el.innerHTML = "<a href=\"" + understandingBaseURI + pathFrag + ".html\" hreflang=\"en\">Розуміння " + heading + "</a> <span class=\"screenreader\">|</span> <br /><a href=\"https://www.w3.org/WAI/WCAG" + version + "/quickref/#" + pathFrag + "\" hreflang=\"en\">Як відповідати вимогам " + heading + "</a>";
		if (node.className = "sc") node.insertBefore(el, node.children[2]);
		if (node.className = "guideline") node.insertBefore(el, node.children[1]);
	})
}

function textNoDescendant(el) {
	var textContent = "";
	el.childNodes.forEach(function(node) {
		if (node.nodeType == 3) textContent += node.textContent;
	})
	return textContent;
}

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function findHeading(el) {
	return el.querySelector('h1, h2, h3, h4, h5, h6');
}

function addTextSemantics() {
	// put brackets around the change marker
	document.querySelectorAll('p.change').forEach(function(node){
		var change = node.textContent;
		node.textContent = "[" + change + "]";
	})
	// put level before and parentheses around the conformance level marker
	document.querySelectorAll('p.conformance-level').forEach(function(node){
		var level = node.textContent;
		node.textContent = "(Рівень " + level + ")";
	})
	// put principle in principle headings
	document.querySelectorAll('section.sc h2 bdi.secno').forEach(function(node){
		var num = node.textContent;
		node.textContent = "Principle " + num;
	})
	// put guideline in GL headings
	document.querySelectorAll('section.guideline h3 bdi.secno').forEach(function(node){
		var num = node.textContent;
		node.textContent = "Настанова " + num;
	})
	// put success criterion in SC headings
	document.querySelectorAll('section.sc h4 bdi.secno').forEach(function(node){
		var num = node.textContent;
		node.textContent = "Критерій успішності " + num;
	})
}

function markConformanceLevel() {
}

function swapInDefinitions() {
	if (new URLSearchParams(window.location.search).get("defs") != null) document.querySelectorAll('.internalDFN').forEach(function(node){
		node.title = node.textContent;
		node.textContent = findDef(document.querySelector(node.href.substring(node.href.indexOf('#'))).parentNode.nextElementSibling.firstElementChild).textContent;
	})
	function findDef(el){
		if (el.hasAttribute('class')) return findDef(el.nextElementSibling);
		else return el;
	}
}

require(["core/pubsubhub"], function(respecEvents) {
    "use strict";
    respecEvents.sub('end', function(message) {
    	if (message === 'core/link-to-dfn') {
    		linkUnderstanding();
    	}
	})
})

// Change the authors credit to WCAG 2.0 editors credit
require(["core/pubsubhub"], function(respecEvents) {
    "use strict";
    respecEvents.sub('end', function(message) {
    	if (message === 'core/link-to-dfn') {
    		document.querySelectorAll("div.head dt").forEach(function(node){
    			if (node.textContent == "Former editors:") node.textContent = "WCAG 2.0 Editors (until December 2008):";
    		});
    	}
	})
})

// Fix the scroll-to-fragID problem:
require(["core/pubsubhub"], function (respecEvents) {
    "use strict";
    respecEvents.sub("end-all", function () {
        if(window.location.hash) {
            window.location = window.location.hash;
        }
    });
});