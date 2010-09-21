//ceebox
/*
 * CeeBox 2.1.5 jQuery Plugin
 * Requires jQuery 1.3.2 and swfobject.jquery.js plugin to work
 * Code hosted on GitHub (http://github.com/catcubed/ceebox) Please visit there for version history information
 * By Colin Fahrion (http://www.catcubed.com)
 * Inspiration for ceebox comes from Thickbox (http://jquery.com/demo/thickbox/) and Videobox (http://videobox-lb.sourceforge.net/)
 * However, along the upgrade path ceebox has morphed a long way from those roots.
 * Copyright (c) 2009 Colin Fahrion
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

// To make ceebox work add $(".ceebox").ceebox(); to your global js file or if you don't have one just uncomment the following...
//$(document).ready(function(){ $(".ceebox").ceebox();});

/* OPTIONAL DEFAULT opts
  * You can change many of the default options
  * $(".ceebox").ceebox({vidWidth:600,vidHeight:400,htmlWidth:600,htmlHeight:400,animSpeed:"fast",overlayColor:"#f00",overlayOpacity:0.8});
*/

(function($) {
$.ceebox = {version:"2.1.5"};

//--------------------------- CEEBOX FUNCTION -------------------------------------
$.fn.ceebox = function(opts){
	opts = $.extend({selector: $(this).selector},$.fn.ceebox.defaults, opts);
	//initilize some global private functions and variables
	var elem = this;
	var selector = $(this).selector;
	if (opts.videoJSON) { 
		$.getJSON(opts.videoJSON, function(json){//loads optional JSON file
			$.extend($.fn.ceebox.videos,json);
			init(elem,opts,selector);
		});
	} else {init(elem,opts,selector);}
	
	return this;
};


//--------------------------- PUBLIC GLOBAL VARIABLES -------------------------------------------
$.fn.ceebox.defaults = {
	// all types of links are activated by default. You can turn them off separately by setting to false
	html:true,
	image:true,
	video:true,
	modal:false, //if set to true all ceebox links are modal (unless you set modal:false in the rel);
	// Default size opts
	// false = autosize to browser window
	// Numerical sizes are uses for maximums; if the browser is smaller it will scale to match the browser. You can set any or all of the opts.
	// common ratios are included "4:3", "3:2", "16:9" (as set in $.fn.ceebox.ratios), or ratio can also be set to a decimal amount (i.e., "3:2" is the same as 1.5)
	titles: true, //set to false if you don't want titles/captions§
	htmlGallery:true,
	imageGallery:true,
	videoGallery:true,
	videoWidth: false, //set max size for all video links
	videoHeight: false, 
	videoRatio: "16:9",
	htmlWidth: false, //set max size for all html links
	htmlHeight: false,
	htmlRatio: false,
	imageWidth: false, //set max size for all image links (image ratio is determined by the image itself)
	imageHeight: false,
	//ceebox display settings
	animSpeed: "normal", // animation resize transition speed (can be set to "slow","normal","fast", or in milliseconds like 1000)
	easing: "swing", // supports use of the easing plugin for resize anim (http://gsgd.co.uk/sandbox/jquery/easing/)
	fadeOut: 400, //speed that ceebox fades out when closed or advancing through galleries
	fadeIn: 400, //speed that ceebox fades in when opened or advancing through galleries
	overlayColor:"#000",
	overlayOpacity:0.8,
	// color settings for background, text, and border. If these are set to blank then it uses css colors. If set here it overrides css. This becomes useful with metadata and color animations which allows you to change colors from link to link.
	boxColor:"", //background color for ceebox.
	textColor:"", //color for text in ceebox.
	borderColor:"", //outside border color.
	borderWidth: "3px", //the border on ceebox. Can be used like css ie,"4px 2px 4px 2px"
	padding: 15, //ceebox padding
	margin: 150, //minimum margin between ceebox inside content and browser frame (this does not count the padding and border; I know it's odd. I'll likely change how it works at some point)
	//misc settings
	onload:null, //callback function once ceebox popup is loaded. MUST BE A FUNCTION!
	unload:null, //callback function once ceebox popup is unloaded. MUST BE A FUNCTION!
	videoJSON:null, //allows addition of seperate json file with more video support.
	iPhoneRedirect:true //set to automatically redirect iPhone users for video links (youtube will launch video player)
};
// ratio shortcuts
$.fn.ceebox.ratios = {"4:3": 1.333, "3:2": 1.5, "16:9": 1.778,"1:1":1,"square":1};

// set up modal regex expressions for testing rel attribute; publically accessable so that ceebox can adjust to suit your needs.
// regex for width/height captures the last value if result of regex is an array
// Can be set to Thickbox way {width: /[0-9]+/, height: /[0-9]+/g}; With this width only captures first value and height captures both but uses only the second
$.fn.ceebox.relMatch = {
	width: /(?:width:)([0-9]+)/i, // force a max width
	height: /(?:height:)([0-9]+)/i, // force a max height
	ratio: /(?:ratio:)([0-9\.:]+)/i, // force a ratio
	modal: /modal:true/i, // set as modal
	nonmodal: /modal:false/i, // set as nonmodal (only useful if modal is the default)
	videoSrc:/(?:videoSrc:)(http:[\/\-\._0-9a-zA-Z:]+)/i, // add a different src url for a video this is for help supporting sites that use annoying src urls, which is any site that uses media.mtvnservices.com. Also as bonus, with a bit of ingenuity this can be used to RickRoll people.
	videoId:/(?:videoId:)([\-\._0-9a-zA-Z:]+)/i //add an id which is useful for Daily Show and other sites like the above.
};

// html for loader anim div
$.fn.ceebox.loader = "<div id='cee_load' style='z-index:105;top:50%;left:50%;position:fixed'></div>";

// video players public variables - *optional
// siteRgx: Regular Expression used to test which site it is. Make sure that you include subfolders! ie, google.com/video so that it doesn't force a video player for the entire site.
// idRgx: Regular Expression used to grab id. Note use of non-capturing variables
// src: the src id style. Add [id] and ceebox will grab replace with the id from the link
// *flashvars: additional flashvars if you add an id it will replace it
// *param: additional parameters if you add an id it will replace it
// *width: force a set width
// *height: force a set height
$.fn.ceebox.videos = {
	base : { //base variables that are added to every player
		param: {wmode: "transparent",allowFullScreen: "true",allowScriptAccess: "always"},
		flashvars: {autoplay: true}
	},
	facebook: {
		siteRgx: /facebook\.com\/video/i,
		idRgx: /(?:v=)([a-zA-Z0-9_]+)/i,
		src: "http://www.facebook.com/v/[id]"
	},
	youtube: {
		siteRgx : /youtube\.com\/watch/i, 
		idRgx: /(?:v=)([a-zA-Z0-9_\-]+)/i,
		src : "http://www.youtube.com/v/[id]&hl=en&fs=1&autoplay=1"
	},
	metacafe: {
		siteRgx : /metacafe\.com\/watch/i, 
		idRgx: /(?:watch\/)([a-zA-Z0-9_]+)/i,
		src: "http://www.metacafe.com/fplayer/[id]/.swf"
	},
	google: {
		siteRgx : /google\.com\/videoplay/i,
		idRgx: /(?:id=)([a-zA-Z0-9_\-]+)/i,
		src : "http://video.google.com/googleplayer.swf?docId=[id]&hl=en&fs=true",
		flashvars: {playerMode: "normal",fs: true}
	},
	spike: { //also detects ifilm which was spike's old name
		siteRgx : /spike\.com\/video|ifilm\.com\/video/i,
		idRgx: /(?:\/)([0-9]+)/i,
		src : "http://www.spike.com/efp",
		flashvars : {flvbaseclip:"[id]"}
	},
	vimeo: {
		siteRgx : /vimeo\.com\/[0-9]+/i,
		idRgx: /(?:\.com\/)([a-zA-Z0-9_]+)/i,
		src : "http://www.vimeo.com/moogaloop.swf?clip_id=[id]&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1"
	},
	dailymotion: {
		siteRgx : /dailymotion\.com\/video/i, //one issue is that some dailymotion vids are really atom films
		idRgx: /(?:video\/)([a-zA-Z0-9_]+)/i,
		src : "http://www.dailymotion.com/swf/[id]&related=0&autoplay=1"
	},
	cnn: {
		siteRgx : /cnn\.com\/video/i, 
		idRgx: /(?:\?\/video\/)([a-zA-Z0-9_\/\.]+)/i,
		src : "http://i.cdn.turner.com/cnn/.element/apps/cvp/3.0/swf/cnn_416x234_embed.swf?context=embed&videoId=[id]",
		width:416,
		height:374
	}
};



//--------------------------- PUBLIC FUNCTIONS ---------------------------------------------------------------

//--------------------------- Overlay function (makes the blank popup and loader) -------------------------------
// this function is called ahead of time so the loader is there, but it does not have to be called as the ceebox.popup script also calls this

$.fn.ceebox.overlay = function(opts) {
	opts = $.extend({//adds a few basic opts then merges in the defaults
		width: 60,
		height: 30,
		type: "html"
	}, $.fn.ceebox.defaults, opts);
	
	// 1. Creates overlay unless one already exists
	if ($("#cee_overlay").size() === 0){
		$("<div id='cee_overlay'></div>").css({
				 opacity : opts.overlayOpacity,
				 position: "absolute",
				 top: 0,
				 left: 0,
				 backgroundColor: opts.overlayColor,
				 width: "100%",
				 height: $(document).height(),
				 zIndex: 100
			}).appendTo($("body"));
	}
	// 2. Creates popup box unless one already exists
	if ($("#cee_box").size() === 0){
		var pos = boxPos(opts); //set up margin and position
		
		// 2a. set up css 
		var boxCSS = {
			position: pos.position,
			zIndex: 102,
			top: "50%",
			left: "50%",
			height: opts.height + "px",
			width: opts.width + "px",
			marginLeft: pos.mleft + 'px',
			marginTop: pos.mtop + 'px',
			opacity:0,
			borderWidth:opts.borderWidth,
			borderColor:opts.borderColor,
			backgroundColor:opts.boxColor,
			color:opts.textColor
		};
		
		// 2b. add ceebox popup
		$("<div id='cee_box'></div>").css(boxCSS).appendTo("body").animate({opacity:1},opts.animSpeed,function(){
				$("#cee_overlay").addClass("cee_close");
			});
	} 
	
	// 3. adds current type as class to ceebox
	$("#cee_box").removeClass().addClass("cee_" + opts.type);
	
	// 4. appends loading anim if not present
	if ($("#cee_load").size() === 0) {$($.fn.ceebox.loader).appendTo("body");}
	
	// 5. show loading animation
    $("#cee_load").show("fast").animate({opacity:1},"fast");

};

//------------------------Popup function (adds content to popup and animates) -------------------------------
// if the content is a link it sets up as a ceebox content
// otherwise it can be used to add any html content to a ceebox style popup

$.fn.ceebox.popup = function(content,opts) {
	var page = pageSize(opts.margin);
	opts = $.extend({
		//used as base only if non-link html content is sent.
		//if a the content is a link than the ceebox build function sets these
		width: page.width, 
		height: page.height, 
		modal:false,
		type: "html",
		onload:null
	}, $.fn.ceebox.defaults, opts);
	
	// private variables and functions
	var gallery,family;
	
	// 1. if content is link, set up ceebox content based on link info
	if ($(content).is("a,area,input") && (opts.type == "html" || opts.type == "image" || opts.type == "video")) { //
		// 1a. grab gallery data, if it's there
		if (opts.gallery) {family = $(opts.selector).eq(opts.gallery.parentId).find("a[href],area[href],input[href]");}
		
		// 1b. build ceebox content using constructors (this is where the heavy lifting happens)
		Build[opts.type].prototype = new BoxAttr(content,opts);
		var cb = new Build[opts.type]();
		content = cb.content;
		
		// 1c. modify options based on properties of constructed ceebox content
		opts.action = cb.action;
		opts.modal = cb.modal;
		
		// 1d. get computed height of title text area
		if (opts.titles) {
			opts.titleHeight = $(cb.titlebox).contents().contents().wrap("<div></div>").parent().attr("id","ceetitletest").css({position:"absolute",top:"-300px",width:cb.width + "px"}).appendTo("body").height();
			$("#ceetitletest").remove();
			opts.titleHeight = (opts.titleHeight >= 10) ? opts.titleHeight + 20 : 30;
		} else {opts.titleHeight = 0;}
		
		// 1e. sets final width and height of ceebox popup
		opts.width = cb.width + 2*opts.padding;
		opts.height = cb.height + opts.titleHeight + 2*opts.padding;
	}
	
	// 2. Creates overlay and empty ceebox to page if one does not already exist; also adds loader
	$.fn.ceebox.overlay(opts);
	
	// attach action,onload, and unload functions to global variable to be called by $.fn.ceebox.onload() and $.fn.ceebox.closebox()
	base.action = opts.action;
	base.onload = opts.onload;
	base.unload = opts.unload;

	// 3. setup animation based on opts
	var pos = boxPos(opts);//grab margins
	
	var animOpts = {
			marginLeft: pos.mleft,
			marginTop: pos.mtop,
			width: opts.width + "px",
			height: opts.height + "px",
			borderWidth:opts.borderWidth
	};
	if (opts.borderColor) {
		var reg = /#[1-90a-f]+/gi;
		var borderColor = cssParse(opts.borderColor,reg);
		animOpts = $.extend(animOpts,{
			borderTopColor:borderColor[0],
			borderRightColor:borderColor[1],
			borderBottomColor:borderColor[2],
			borderLeftColor:borderColor[3]
		});
	}
	animOpts = (opts.textColor) ? $.extend(animOpts,{color:opts.textColor}): animOpts;
	animOpts = (opts.boxColor) ? $.extend(animOpts,{backgroundColor:opts.boxColor}): animOpts;
	
	// 4. animate ceebox
	$("#cee_box").animate(animOpts,opts.animSpeed,opts.easing,function(){

			// 5. append content once animation finishes
			var children = $(this).append(content).children().hide();
			var len = children.length;
			var onloadcall = true;
			
			// 6. fade content in
			children.fadeIn(opts.fadeIn,function(){
				if ($(this).is("#cee_iframeContent")) {onloadcall = false;} //cancel onload function call if cee_iframe is loaded as it has on onload attached to it.
				// Call onload on last item loaded.
				if (onloadcall && this == children[len-1]) {$.fn.ceebox.onload();}

			});
			
			// 7. check to see if it's modal
			if (opts.modal===true) {
				$("#cee_overlay").removeClass("cee_close"); //remove close function on overlay
			} else {
				// 7a. add closebtn
				$("<a href='#' id='cee_closeBtn' class='cee_close' title='Close'>close</a>").prependTo("#cee_box");
				// 7b. add gallery next/prev nav if there is a gallery group
				if (opts.gallery) {addGallery(opts.gallery,family,opts);}
				
				// 7c. add key events
				keyEvents(gallery,family,opts.fadeOut);
			}
		});
};

//--------------------------- ceebox close function ----------------------------------
$.fn.ceebox.closebox = function(fade,unload) { //removes ceebox popup
	fade = fade || 400;
	$("#cee_box").fadeOut(fade);
	$("#cee_overlay").fadeOut((typeof fade == 'number') ? fade*2 : "slow",function(){
		$('#cee_box,#cee_overlay,#cee_HideSelect,#cee_load').unbind().trigger("unload").remove();
		if (isFunction(unload)) { unload(); } else if (isFunction(base.unload)) {base.unload();}
		base.unload = null; //call optional unload callback, then empty function
	});
	document.onkeydown = null;
};
//--------------------------- ceebox onload function ----------------------------------
// made a public function mainly for cee_iframe to call. $.fn.ceebox.popup calls this automatically once all children objects of the popup are loaded
$.fn.ceebox.onload = function(opts){
		$("#cee_load").hide(300).fadeOut(600,function(){$(this).remove();}); // remove loading anim
		if (isFunction(base.action)) {base.action(); base.action = null;} // call ceebox specific functions (ie, add flash player or ajax), then empty function
		if (isFunction(base.onload)) {base.onload(); base.onload = null;}// call optional onload callback, then empty function
};
//--------------------------- PRIVATE FUNCTIONS ---------------------------------------------------

//--------------------------- Init function which sets up global variables ----------------------------------
var base = {}; //global private variable holder
function init(elem,opts,selector) {
	base.vidRegex = function(){ //builds single regex object from the every siteRgx in the ceebox.videos public variable
		var regStr = "";
		$.each($.fn.ceebox.videos,function(i,v){ 
			if (v.siteRgx !== null && typeof v.siteRgx !== 'string') {
				var tmp = String(v.siteRgx);
				regStr = regStr + tmp.slice(1,tmp.length-2) + "|";
			}
		});
		return new RegExp(regStr + "\\.swf$","i");
	}();
	
	base.userAgent = navigator.userAgent;
	$(".cee_close").die().live("click",function(){$.fn.ceebox.closebox();return false;}); //adds close button functionality
	
	if (selector != false) {$(elem).each(function(i){ceeboxLinkSort(this,i,opts,selector);});} //as long as a selector was passed, this sets up all the links
	
	//adds click functionality via jquery live event bubbling
	$(elem).live("click", function(e){
		var tgt = $(e.target).closest("[href]");
		var tgtData = tgt.data("ceebox");
		if (tgtData) {
			var linkOpts = (tgtData.opts) ? $.extend({}, opts, tgtData.opts) : opts; // metadata plugin support (applied on link element)
			$.fn.ceebox.overlay(linkOpts);
			if (tgtData.type == "image") { 
				var imgPreload = new Image();
				imgPreload.onload = function(){
					var w = imgPreload.width,h=imgPreload.height;
					//set image max sizes to so that image doesn't scale larger
					linkOpts.imageWidth = getSmlr(w,$.fn.ceebox.defaults.imageWidth);
					linkOpts.imageHeight = getSmlr(h,$.fn.ceebox.defaults.imageHeight);
					linkOpts.imageRatio = w/h;
					$.fn.ceebox.popup(tgt,$.extend(linkOpts,{type:tgtData.type},{gallery:tgtData.gallery})); //build popup
				};
				imgPreload.src = $(tgt).attr("href");
			} else {$.fn.ceebox.popup(tgt,$.extend(linkOpts,{type:tgtData.type},{gallery:tgtData.gallery}));} //build popup
			return false;
		}
	});
}
//--------------------------- MAIN CEEBOX LINK SORTING AND EVENT ATTACHMENT FUNCTION ----------------------------------------------

var ceeboxLinkSort = function(parent,parentId,opts,selector) {
	
	// private function variables
	var family,cbLinks = [],galleryLinks = [],gNum = 0;
	
	// 1. if dom element is a link use that otherwise find any and all links under selected dom element
	($(parent).is("[href]")) ? family = $(parent) : family = $(parent).find("[href]");
	
	// 2. url match functions
	var urlMatch = {
		image: function(h,r) {if (r && r.match(/\bimage\b/i)) { return true; } else { return h.match(/\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/i) || false;}},
		video: function(h,r) {if (r && r.match(/\bvideo\b/i)) { return true; } else { return h.match(base.vidRegex) || false; }},
		html: function(h) {return true;}
	};
	var familyLen = family.length;
	
	// 3. sort links by type
	family.each(function(i){
		var alink = this;
		var metadata = $.metadata ? $(alink).metadata() : false;
		var linkOpts = metadata ? $.extend({}, opts, metadata) : opts; // metadata plugin support (applied on link element)
		
		$.each(urlMatch, function(type) {
			
			if (urlMatch[type]($(alink).attr("href"),$(alink).attr("rel")) && linkOpts[type]) {	
				var gallery = false;
				// 2. set up array of gallery links
				if (linkOpts[type + "Gallery"] === true) {
					galleryLinks[galleryLinks.length] = i;
					gallery = true;
				}
				cbLinks[cbLinks.length] = {linkObj:alink,type:type,gallery:gallery,linkOpts:linkOpts};
				return false;
			}
		});
	});
	var gLen = galleryLinks.length;
	$.each(cbLinks,function(i){
		if (cbLinks[i].gallery) {
			var gallery = {parentId:parentId,gNum:gNum,gLen:gLen};
			if (gNum > 0) {gallery.prevId = galleryLinks[gNum-1];}
			if (gNum < gLen - 1) {gallery.nextId = galleryLinks[gNum+1];}
			gNum++;
		}
		if (!$.support.opacity && $(parent).is("map")) {$(cbLinks[i].linkObj).click(function(e){e.preventDefault();});} //IE falls to return false if using image map with ceebox gallery
		$.data(cbLinks[i].linkObj,"ceebox",{type:cbLinks[i].type,opts:cbLinks[i].linkOpts,gallery:gallery});
	});
	
};
//--------------------------- ceebox builder constructor objects ----------------------------------

// 1. sets up base attr based on default options and link options
var BoxAttr = function(cblink,o) {
	var w = o[o.type + "Width"]; //width
	var h = o[o.type + "Height"]; //height
	var r = o[o.type + "Ratio"] || w/h; //ratio

	//grab options form rel
	var rel = $(cblink).attr("rel");
	if (rel && rel!== "") {
		var m = {};
		//sort out relMatch regex expressions and exec them to the rel
		$.each($.fn.ceebox.relMatch,function(i,v){m[i] = v.exec(rel);});
		//check for modal option and overwrite if present
		if (m.modal) {o.modal = true;}
		if (m.nonmodal) {o.modal = false;}
		//check for size option (overwrites the base size)
		if (m.width) {w = Number(lastItem(m.width));}
		if (m.height) {h = Number(lastItem(m.height));}
		if (m.ratio) {r = lastItem(m.ratio); r = (Number(r)) ? Number(r) : String(r);}
		// grabs optional video src or id
		if (m.videoSrc) {this.videoSrc = String(lastItem(m.videoSrc));}
		if (m.videoId) {this.videoId = String(lastItem(m.videoId));}
	}
	
	// compare vs page size
	var p = pageSize(o.margin);
	w = getSmlr(w,p.width);
	h = getSmlr(h,p.height);
	
	if (r) { //if ratio value has been passed, adjust size to the ratio
		// test if it's a ratio name shortcut
		if (!Number(r)) {r = ($.fn.ceebox.ratios[r]) ? Number($.fn.ceebox.ratios[r]) : 1;}
		//makes sure that it's smaller than the max width and height
		if (w/h > r) {w = parseInt(h * r,10);}
		if (w/h < r) {h = parseInt(w / r,10);}
	}
	
	// set all important values to this
	this.modal = o.modal;
	this.href = $(cblink).attr("href");
	this.title = $(cblink).attr("title") || cblink.t || ""; //.t is used for ceetip
	this.titlebox = (o.titles) ? "<div id='cee_title'><h2>"+this.title+"</h2></div>" : "";
	this.width = w;
	this.height = h;
	this.rel = rel;
	this.iPhoneRedirect = o.iPhoneRedirect;
};
// 2. builds content based on type
var Build = {
	image: function() {
		this.content = "<img id='cee_img' src='"+this.href+"' width='"+this.width+"' height='"+this.height+"' alt='"+this.title+"'/>" + this.titlebox;
	}, 
	video: function() { 
		//sort through list of supported video players and get src,ids,params,etc.
		var content = "",cb = this;
		
		var vid = function(){
			var rtn = this,id = cb.videoId;
			rtn.flashvars = rtn.param = {};
			rtn.src = cb.videoSrc || cb.href;
			rtn.width = cb.width;
			rtn.height = cb.height;
			$.each($.fn.ceebox.videos,function(i,v){ 
				if (v.siteRgx && typeof v.siteRgx != 'string' && v.siteRgx.test(cb.href)) {
					if (v.idRgx) { 
						v.idRgx = new RegExp(v.idRgx);
						id = String(lastItem(v.idRgx.exec(cb.href)));
					}
					rtn.src = (v.src) ? v.src.replace("[id]",id) : rtn.src;
					//check for [id] in flashvars
					if (v.flashvars) {$.each(v.flashvars, function(ii,vv){
							if (typeof vv =='string') {rtn.flashvars[ii] = vv.replace("[id]",id);}
						});}
					//check for [id] in params
					if (v.param) {$.each(v.param, function(ii,vv){
							if (typeof vv =='string') {rtn.param[ii] = vv.replace("[id]",id);}
						});}
					rtn.width = v.width || rtn.width;
					rtn.height = v.height || rtn.height;
					rtn.site = i;
					return;
				}
			});
			return rtn;
			
		}();
		
		if ($.flash.hasVersion(8)) {
			//setup final attributes
			this.width = vid.width;
			this.height = vid.height;
			// add action to embed object once ceebox is loaded
			
			this.action = function() {
				$('#cee_vid').flash({
					swf: vid.src,
					params: $.extend($.fn.ceebox.videos.base.param,vid.param),
					flashvars: $.extend($.fn.ceebox.videos.base.flashvars,vid.flashvars),
					width: vid.width,
					height: vid.height
				});
			};
		} else {
			this.width = 400; this.height = 200;
			if( ((base.userAgent.match(/iPhone/i)) && this.iPhoneRedirect) || ((base.userAgent.match(/iPod/i)) && this.iPhoneRedirect)) { 
				var redirect = this.href;
				this.action = function(){$.fn.ceebox.closebox(400,function(){window.location = redirect;});};
			} else {
				vid.site = vid.site || "SWF file";
				content = "<p style='margin:20px'>Adobe Flash 8 or higher is required to view this movie. You can either:</p><ul><li>Follow link to <a href='"+ this.href +"'>" + vid.site + " </a></li><li>or <a href='http://www.adobe.com/products/flashplayer/'>Install Flash</a></li><li> or <a href='#' class='cee_close'>Close This Popup</a></li></ul>";
			}
		}
		this.content = "<div id='cee_vid' style='width:"+this.width+"px;height:"+this.height+"px;'>" + content + "</div>" + this.titlebox;
		},
	html: function() {
		//test whether or not content is iframe or ajax
		var h = this.href,r = this.rel;
		var m = [h.match(/[a-zA-Z0-9_\.]+\.[a-zA-Z]{2,4}/i),h.match(/^http:+/),(r) ? r.match(/^iframe/) : false];
		if ((document.domain == m[0] && m[1] && !m[2]) || (!m[1] && !m[2])) { //if linked to same domain and not iframe than it's an ajax link
			var id, ajx = (id = h.match(/#[a-zA-Z0-9_\-]+/)) ? String(h.split("#")[0] + " " + id) : h;
			this.action = function(){ $("#cee_ajax").load(ajx);};
			this.content = this.titlebox + "<div id='cee_ajax' style='width:"+(this.width-30)+"px;height:"+(this.height-20)+"px'></div>";
		} else {
			$("#cee_iframe").remove();
			this.content = this.titlebox + "<iframe frameborder='0' hspace='0' src='"+h+"' id='cee_iframeContent' name='cee_iframeContent"+Math.round(Math.random()*1000)+"' onload='jQuery.fn.ceebox.onload()' style='width:"+(this.width)+"px;height:"+(this.height)+"px;' > </iframe>";
			
		}
	}
};

//--------------------------- specific single purpose private functions ----------------------------------

// pageSize function used in box and overlay function (not a constructor)
function pageSize(margin){
	var de = document.documentElement;
	margin = margin || 100;
	this.width = (window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth) - margin;
	this.height = (window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight) - margin;
	return this;
}
function boxPos(opts){ //returns margin and positioning
	// 1. set up base sizes and positions
	var pos = "fixed",scroll = 0, reg = /[0-9]+/g, b = cssParse(opts.borderWidth,reg);
	// 2. IE 6 Browser fixes
	if (!window.XMLHttpRequest) {
		if ($("#cee_HideSelect") === null) {$("body").append("<iframe id='cee_HideSelect'></iframe>");} //fixes IE6's form select z-index issue
		pos = "absolute"; //IE 6 positioning is special... and I mean that in the most demeaning way possible
		scroll = parseInt((document.documentElement && document.documentElement.scrollTop || document.body.scrollTop),10);
	}
	
	this.mleft = parseInt(-1*((opts.width) / 2 + Number(b[3])),10);
	this.mtop = parseInt(-1*((opts.height) / 2 + Number(b[0])),10) + scroll;
	this.position = pos;
	return this;
}

function cssParse(css,reg){ //parses string into separate values for each side which is required for color anim and other uses
	var temp = css.match(reg),rtn = [],l = temp.length;
	if (l > 1) {
		rtn[0] = temp[0];
		rtn[1] = temp[1];
		rtn[2] = (l == 2) ? temp[0] : temp[2];
		rtn[3] = (l == 4) ? temp[3] : temp[1];
	} else {rtn = [temp,temp,temp,temp];}
	return rtn;
}

function keyEvents() { //adds key events for close/next/prev
	document.onkeydown = function(e){
		e = e || window.event;
		var kc = e.keyCode || e.which;
		switch (kc) {
			case 13:
				return false;
			case 27:
				$.fn.ceebox.closebox();
				document.onkeydown = null;
				break;
			case 188:
			case 37:
				$("#cee_prev").trigger("click");
				break;
			case 190:
			case 39:
				$("#cee_next").trigger("click");
				break;
			default:
				break;
		}
		return true;
	};
}

function addGallery(g,family,opts){ // adds gallery next/prev functionality
	//set up base sizing and positioning for image gallery
	var h = opts.height, w = opts.width, th = opts.titleHeight, p = opts.padding;
	var nav = {
		image : {
			w: parseInt(w / 2,10),
			h: h-th-2*p,
			top: p,
			bgtop: (h-th-2*p)/2
		},
		video : {
			w: 60,
			h: 80,
			top: parseInt(((h-th-10)-2*p) / 2,10),
			bgtop: 24
		}
	};
	nav.html = nav.video;
	// function for creating prev/next buttons
	function navLink(btn,id) {
		var s, on = nav[opts.type].bgtop, off = (on-2000), px = "px";
		
		(btn == "prev") ? s = [{left:0},"left"] : s = [{right:0}, x = "right"];

		var style = function(y) {return $.extend({zIndex:105,width:nav[opts.type].w + px, height:nav[opts.type].h + px,position:"absolute",top:nav[opts.type].top,backgroundPosition:s[1] + " " + y + px},s[0]);};
		
		$("<a href='#'></a>").text(btn).attr({id:"cee_" + btn}).css(style(off)).hover(
				function(){$(this).css(style(on));},
				function(){$(this).css(style(off));}
			).one("click",function(e){
				e.preventDefault();
				(function(f,id,fade){ //click functionality for next/prev links
					$("#cee_prev,#cee_next").unbind().click(function(){return false;}); //removes any functionality from next/prev which stops this from being triggered twice
					document.onkeydown = null; //removes key events
					var content = $("#cee_box").children(), len = content.length;
					content.fadeOut(fade,function(){
						$(this).remove();
						if (this == content[len-1]) {f.eq(id).trigger("click");} //triggers next gallery item once all content is gone
					});
				})(family,id,opts.fadeOut);

			}).appendTo("#cee_box");
	}
	
	// add prev/next buttons	
	if (g.prevId >= 0) {navLink("prev",g.prevId);}
	if (g.nextId) {navLink("next",g.nextId);}
	$("#cee_title").append("<div id='cee_count'>Item " + (g.gNum+1) +" of "+ g.gLen + "</div>");
}

//------------------------------ Generic helper functions ------------------------------------

function getSmlr(a,b) {return ((a && a < b) || !b) ? a : b;}
function isFunction(a) {return typeof a == 'function';}
function lastItem(a) {var l = a.length;return (l > 1) ? a[l-1] : a;}

//------------------------------ Debug function ----------------------------------------------
function debug(a,tag,opts) {
	//must turn on by setting debugging to true as a global variable
	if (debugging === true) {var bugs="", header = "[ceebox](" + (tag||"")  + ")";
		($.isArray(a) || typeof a == 'object' || typeof a == 'function') ? $.each(a, function(i, val) { bugs = bugs +i + ":" + val + ", ";}) : bugs = a;
		
		if (window.console && window.console.log) {
			window.console.log(header + bugs);
		} else {
			if ($("#debug").size() === 0) {$("<ul id='debug'></ul>").appendTo("body").css({border:"1px solid #ccf",position:"fixed",top:"10px",right:"10px",width:"300px",padding:"10px",listStyle:"square"});
			$("<li>").css({margin:"0 0 5px"}).appendTo("#debug").append(header).wrapInner("<b></b>").append(" " + bugs);}
		}
	}
}


})(jQuery);