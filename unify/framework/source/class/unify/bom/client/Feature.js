/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * This class comes with all relevant information regarding
 * the client's implemented features.
 *
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
core.Module("unify.bom.client.Feature",
{
  /** {Boolean} Flag to detect if the client supports SVG graphics */
  SVG : document.implementation && document.implementation.hasFeature && (document.implementation.hasFeature("org.w3c.dom.svg", "1.0") || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")),

  /** {Boolean} Flag to detect if the client supports Canvas graphics */
  CANVAS : !!window.CanvasRenderingContext2D,

  /** {Boolean} Flag to detect if the client supports XPATH queries */
  XPATH : !!document.evaluate,

  /** {Boolean} Whether JSON is supported natively */
  JSON : !!window.JSON,

  /** {Boolean} Whether web workers are supported */
  WORKERS : !!window.Worker,

  /** {Boolean} Whether HTML5 application cache is supported */
  APPCACHE : !!window.applicationCache,

  /** {Boolean} Whether the client supports the HTML5 geo location API */
  GEOLOCATION : !!navigator.geolocation,

  /** {Boolean} Whether the client supports cross window messaging */
  MESSAGING : !!window.postMessage,



  /** {Boolean} Whether the client supports embedding of video using HTML5 video tag */
  VIDEOTAG : !!document.createElement("video")["canPlayType"],

  /** {Boolean} Whether H264 video is supported in HTML5 video tags */
  VIDEOTAG_H264 : false,

  /** {Boolean} Whether Ogg Theora video is supported in HTML5 video tags */
  VIDEOTAG_THEORA : false,

  /** {Boolean} Whether WEBM aka VC8 is supported in HTML5 video tags */
  VIDEOTAG_WEBM : false,



  /** {Boolean} Whether the client supports embedding of video using HTML5 audio tag */
  AUDIOTAG : !!document.createElement("audio")["canPlayType"],

  /** {Boolean} Whether MP3 audio is supported in HTML5 audio tags */
  AUDIOTAG_MP3 : false,

  /** {Boolean} Whether OGG audio is supported in HTML5 audio tags */
  AUDIOTAG_OGG : false,

  /** {Boolean} Whether AAC audio is supported in HTML5 audio tags */
  AUDIOTAG_AAC : false,

  /** {Boolean} Whether WAV audio is supported in HTML5 audio tags */
  AUDIOTAG_WAV : false,



  /** {Boolean} Whether HTML5 session storage is supported */
  STORAGE_SESSION : "sessionStorage" in window,

  /** {Boolean} Whether HTML5 local storage is supported */
  STORAGE_LOCAL : "localStorage" in window,

  /** {Boolean} Whether HTML5 SQL databases are supported */
  STORAGE_SQL : !!window.openDatabase,

  /** {Boolean} Whether HTML5 indexed db storage is supported */
  STORAGE_INDEXEDDB : "indexedDB" in window,



  /** {Boolean} Whether the client supports history events */
  HISTORY_EVENTS : "onhashchange" in history,

  /** {Boolean} Whether the client supports history managment */
  HISTORY_MANAGMENT : !!(history && history.pushState),



  /** {Boolean} Whether the client supports CSS transforms */
  CSS_TRANSFORM : false,

  /** {Boolean} Whether the client supports CSS 3D transforms */
  CSS_TRANSFORM3D : false,

  /** {Boolean} Whether the client supports CSS transitions */
  CSS_TRANSITION : false,

  /** {Boolean} Whether the client supports CSS animations */
  CSS_ANIMATION : false,

  /** {Boolean} Whether the client supports CSS box reflections */
  CSS_BOXREFLECTION : false,

  /** {Boolean} Whether the client supports CSS box shadow */
  CSS_BOXSHADOW : false,

  /** {Boolean} Whether the client supports CSS border images */
  CSS_BORDERIMAGE : false,

  /** {Boolean} Whether the client supports CSS border radius */
  CSS_BORDERRADIUS : false,
  
  /** {Boolean} New native touch scrolling support */
  CSS_TOUCHSCROLL : false
});

(function(statics) {
  var undef = undefined;
  var node = document.createElement("div");
  var style = node.style;
  var prefix = core.Env.getValue("engine");
  prefix = {
    "presto" : "Ms",
    "trident" : "O",
    "webkit" : "Webkit",
    "gecko" : "Moz"
  }[prefix];

  statics.CSS_TRANSFORM = style[prefix + "Transform"] !== undef;
  statics.CSS_TRANSFORM3D = style[prefix + "Perspective"] !== undef;
  statics.CSS_TRANSITION = style[prefix + "Transition"] !== undef;
  statics.CSS_ANIMATION = style[prefix + "AnimationName"] !== undef;

  statics.CSS_BOXREFLECTION = style[prefix + "BoxReflect"] !== undef;
  statics.CSS_BOXSHADOW = style[prefix + "BoxShadow"] !== undef;
  statics.CSS_BORDERIMAGE = style[prefix + "BorderImage"] !== undef;
  statics.CSS_BORDERRADIUS = style[prefix + "BorderRadius"] !== undef;
  
  statics.CSS_TOUCHSCROLL = style[prefix + "OverflowScrolling"] !== undef;

  var html5test = {maybe:true, probably:true};
  if (statics.VIDEOTAG)
  {
    var elem = document.createElement("video");
    statics.VIDEOTAG_H264 = html5test[elem.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')] || false;
    statics.VIDEOTAG_THEORA = html5test[elem.canPlayType('video/ogg; codecs="theora, vorbis"')] || false;
    statics.VIDEOTAG_WEBM = html5test[elem.canPlayType('video/webm; codecs="vp8, vorbis"')] || false;
  }

  if (statics.AUDIOTAG)
  {
    var elem = document.createElement("audio");
    statics.AUDIOTAG_MP3 = html5test[elem.canPlayType('audio/mpeg3;')] || false;
    statics.AUDIOTAG_OGG = html5test[elem.canPlayType('audio/ogg; codecs="vorbis"')] || false;
    statics.AUDIOTAG_AAC = html5test[elem.canPlayType('audio/x-m4a;')] || html5test[elem.canPlayType('audio/aac;')] || false;
    statics.AUDIOTAG_WAV = html5test[elem.canPlayType('audio/wav; codecs="1"')] || false;
  }
})(unify.bom.client.Feature);