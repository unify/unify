(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date().valueOf();
qx.$$build = 1298881400925;
qx.$$type = "source";
  
if (!window.qxsettings) qxsettings = {};
var settings = {"qx.application":"widgets.Application","qx.version":"1.3.0-unify","unify.root":"/widgets"};
for (var k in settings) qxsettings[k] = settings[k];

if (!window.qxvariants) qxvariants = {};
var variants = {"qx.debug":"on"};
for (var k in variants) qxvariants[k] = variants[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"script"},"qx":{"resourceUri":"../../../../qooxdoo/qooxdoo/framework/source/resource","sourceUri":"../../../../qooxdoo/qooxdoo/framework/source/class","version":"1.4-pre"},"unify":{"resourceUri":"../../../framework/source/resource","sourceUri":"../../../framework/source/class","version":"trunk"},"widgets":{"resourceUri":"../source/resource","sourceUri":"../source/class","version":"trunk"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {"widgets/favicon.ico":"widgets","widgets/icons/icon_128x128.png":[128,128,"png","widgets"],"widgets/icons/icon_16x16.png":[16,16,"png","widgets"],"widgets/icons/icon_32x32.png":[32,32,"png","widgets"],"widgets/icons/icon_48x48.png":[48,48,"png","widgets"],"widgets/icons/icon_57x57.png":[57,57,"png","widgets"],"widgets/icons/readme.txt":"widgets","widgets/style.css":"widgets","widgets/style.sass":"widgets"};
qx.$$translations = {};
qx.$$locales = {};
qx.$$packageData = {};

qx.$$loader = {
  parts : {"boot":[0]},
  uris : [["qx:qx/Bootstrap.js","qx:qx/core/property/Util.js","qx:qx/core/Setting.js","qx:qx/bom/client/Engine.js","qx:qx/core/Variant.js","qx:qx/core/property/Debug.js","qx:qx/Mixin.js","qx:qx/Interface.js","qx:qx/Class.js","qx:qx/dev/StackTrace.js","qx:qx/core/ObjectRegistry.js","qx:qx/lang/Type.js","qx:qx/lang/Array.js","qx:qx/lang/Function.js","qx:qx/lang/String.js","qx:qx/type/BaseError.js","qx:qx/core/AssertionError.js","qx:qx/core/Assert.js","qx:qx/lang/JsonImpl.js","qx:qx/core/GlobalError.js","qx:qx/event/GlobalError.js","qx:qx/lang/Json.js","qx:qx/event/IEventHandler.js","qx:qx/dom/Node.js","qx:qx/bom/Event.js","qx:qx/event/Manager.js","qx:qx/event/Registration.js","qx:qx/core/ValidationError.js","qx:qx/core/property/Core.js","qx:qx/core/property/Multi.js","qx:qx/core/property/Group.js","qx:qx/core/MAssert.js","qx:qx/core/property/Simple.js","qx:qx/core/Object.js","unify:unify/event/handler/Transition.js","qx:qx/bom/client/Platform.js","qx:qx/bom/client/System.js","qx:qx/event/handler/UserAction.js","qx:qx/event/handler/Mouse.js","qx:qx/bom/client/Feature.js","qx:qx/lang/Object.js","qx:qx/bom/element/Class.js","unify:unify/bom/client/System.js","qx:qx/lang/RingBuffer.js","qx:qx/log/appender/RingBuffer.js","qx:qx/log/Logger.js","qx:qx/log/appender/Util.js","qx:qx/log/appender/Native.js","qx:qx/application/IApplication.js","qx:qx/event/handler/Application.js","qx:qx/event/IEventDispatcher.js","qx:qx/event/dispatch/Direct.js","qx:qx/event/handler/Window.js","qx:qx/core/Init.js","qx:qx/application/Native.js","unify:unify/event/handler/Orientation.js","qx:qx/event/dispatch/AbstractBubbling.js","qx:qx/event/dispatch/DomBubbling.js","unify:unify/event/handler/Touch.js","unify:unify/Application.js","widgets:widgets/Application.js","qx:qx/core/WindowError.js","qx:qx/lang/Date.js","qx:qx/core/Type.js","qx:qx/lang/Core.js","qx:qx/event/type/Event.js","qx:qx/event/handler/Object.js","qx:qx/event/type/Data.js","qx:qx/util/DisposeUtil.js","qx:qx/util/ObjectPool.js","qx:qx/event/Pool.js","qx:qx/event/type/Native.js","qx:qx/event/type/Dom.js","qx:qx/event/type/Mouse.js","qx:qx/event/type/MouseWheel.js","qx:qx/bom/Viewport.js","qx:qx/bom/Document.js","qx:qx/bom/client/Browser.js","qx:qx/dom/Hierarchy.js","qx:qx/bom/Selector.js","unify:unify/event/type/Orientation.js","unify:unify/event/type/Touch.js","unify:unify/bom/client/Extension.js","unify:unify/view/ViewManager.js","qx:qx/type/BaseArray.js","unify:unify/view/Path.js","unify:unify/view/PopOverManager.js","unify:unify/view/Navigation.js","unify:unify/bom/History.js","unify:unify/event/type/History.js","unify:unify/bom/Storage.js","qx:qx/bom/Cookie.js","qx:qx/bom/element2/Class.js","qx:qx/bom/element2/Style.js","qx:qx/locale/MTranslation.js","unify:unify/view/StaticView.js","widgets:widgets/view/Start.js","unify:unify/ui/Abstract.js","unify:unify/ui/Container.js","unify:unify/ui/Layer.js","qx:qx/bom/Html.js","qx:qx/ui/core/MChildrenHandling.js","unify:unify/ui/widget/qx/LayoutItem.js","unify:unify/ui/widget/core/Widget.js","unify:unify/ui/widget/core/Layer.js","unify:unify/ui/widget/qx/queue/Layout.js","qx:qx/util/DeferredCallManager.js","qx:qx/util/DeferredCall.js","qx:qx/event/handler/Element.js","qx:qx/html/Element.js","unify:unify/ui/widget/qx/queue/Manager.js","qx:qx/event/dispatch/MouseCapture.js","qx:qx/event/handler/Focus.js","qx:qx/bom/Selection.js","qx:qx/bom/Range.js","qx:qx/util/StringSplit.js","qx:qx/bom/Element.js","qx:qx/bom/element/Attribute.js","qx:qx/xml/Document.js","qx:qx/event/type/Focus.js","qx:qx/event/handler/Capture.js","qx:qx/bom/element/Scroll.js","qx:qx/bom/element/Overflow.js","qx:qx/bom/element/Clip.js","qx:qx/bom/element/Opacity.js","qx:qx/bom/element/Cursor.js","qx:qx/bom/element/BoxSizing.js","qx:qx/bom/element/Style.js","qx:qx/bom/element/Location.js","qx:qx/event/handler/Appear.js","unify:unify/ui/widget/qx/queue/Widget.js","unify:unify/ui/widget/qx/queue/Visibility.js","unify:unify/ui/widget/qx/queue/Appearance.js","unify:unify/ui/widget/qx/queue/Dispose.js","qx:qx/ui/layout/Abstract.js","qx:qx/ui/core/LayoutItem.js","qx:qx/ui/core/queue/Layout.js","qx:qx/ui/core/queue/Manager.js","qx:qx/ui/core/queue/Widget.js","qx:qx/ui/core/queue/Visibility.js","qx:qx/ui/core/queue/Appearance.js","qx:qx/ui/core/queue/Dispose.js","qx:qx/ui/layout/Basic.js","qx:qx/bom/element2/Dimension.js","unify:unify/ui/widget/basic/Label.js","unify:unify/view/TabViewManager.js"]],
  urisBefore : [],
  packageHashes : {"0":"0"},
  boot : "boot",
  closureParts : {},
  bootIsInline : false,
  
  decodeUris : function(compressedUris)
  {
    var libs = qx.$$libraries;
    var uris = [];
    for (var i=0; i<compressedUris.length; i++)
    {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length==2 && uri[0] in libs) {
        var prefix = libs[uri[0]].sourceUri;
        euri = prefix + "/" + uri[1];
      } else {
        euri = compressedUris[i];
      }
      
      uris.push(euri);
    }
    return uris;      
  }
};  

function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.onreadystatechange = elem.onload = function()
  {
    if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")
    {
      elem.onreadystatechange = elem.onload = null;
      callback();
    }
  };

  if (qx.$$type === "source") {
    elem.src = uri + "?r=" + qx.$$start;
  } else {
    elem.src = uri + "?r=" + qx.$$build;
  }
  
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);

function loadScriptList(list, callback) {
  if (list.length == 0) {
    callback();
    return;
  }
  loadScript(list.shift(), function() {
    if (isWebkit) {
      // force asynchronous load
      // Safari fails with an "maximum recursion depth exceeded" error if it is
      // called sync.      
      window.setTimeout(function() {
        loadScriptList(list, callback);
      }, 0);
    } else {
      loadScriptList(list, callback);
    }
  });
}

var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

qx.$$loader.importPackageData = function (dataMap) {
  if (dataMap["resources"]){
    var resMap = dataMap["resources"];
    for (var k in resMap) qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]){
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap){
      if (!qxlocs[lang]) qxlocs[lang] = locMap[lang];
      else 
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]){
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap){
      if (!qxtrans[lang]) qxtrans[lang] = trMap[lang];
      else 
        for (var k in trMap[lang]) qxtrans[lang][k] = trMap[lang][k];
    }
  }
}

qx.$$loader.signalStartup = function () 
{
  qx.$$loader.scriptLoaded = true;
  if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
    qx.event.handler.Application.onScriptLoaded();
    qx.$$loader.applicationHandlerReady = true; 
  } else {
    qx.$$loader.applicationHandlerReady = false;
  }
}

qx.$$loader.init = function(){
  var l=qx.$$loader;
  if (l.urisBefore.length>0){
    loadScriptList(l.urisBefore, function(){
      l.initUris();
    });
  } else {
    l.initUris();
  }
}

qx.$$loader.initUris = function(){
  var l=qx.$$loader;
  var bootPackageHash=l.packageHashes[l.parts[l.boot][0]];
  if (l.bootIsInline){
    l.importPackageData(qx.$$packageData[bootPackageHash]);
    l.signalStartup();
  } else {
    loadScriptList(l.decodeUris(l.uris[l.parts[l.boot]]), function(){
      // Opera needs this extra time to parse the scripts
      window.setTimeout(function(){
        l.importPackageData(qx.$$packageData[bootPackageHash] || {});
        l.signalStartup();
      }, 0);
    });
  }
}
})();

qx.$$packageData['0']={};


qx.$$loader.init();

