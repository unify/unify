(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date().valueOf();
qx.$$build = 1301061875680;
qx.$$type = "source";
  
if (!window.qxsettings) qxsettings = {};
var settings = {"qx.application":"kitchensink.Application","qx.version":"1.3.0-unify","unify.root":"/kitchensink"};
for (var k in settings) qxsettings[k] = settings[k];

if (!window.qxvariants) qxvariants = {};
var variants = {"qx.debug":"on"};
for (var k in variants) qxvariants[k] = variants[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"script"},"kitchensink":{"resourceUri":"../source/resource","sourceUri":"../source/class","version":"trunk"},"qx":{"resourceUri":"../../../../qooxdoo/qooxdoo/framework/source/resource","sourceUri":"../../../../qooxdoo/qooxdoo/framework/source/class","version":"1.4-pre"},"unify":{"resourceUri":"../../../framework/source/resource","sourceUri":"../../../framework/source/class","version":"trunk"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {"unify/.DS_Store":"unify","unify/animation.sass":"unify","unify/core.sass":"unify","unify/iphoneos/.DS_Store":"unify","unify/iphoneos/ajax-loader.gif":[32,32,"gif","unify"],"unify/iphoneos/base.sass":"unify","unify/iphoneos/icons-22/band-aid.png":[20,19,"png","unify"],"unify/iphoneos/icons-22/chat.png":[18,15,"png","unify"],"unify/iphoneos/icons-22/clock.png":[18,18,"png","unify"],"unify/iphoneos/icons-22/eye.png":[20,13,"png","unify"],"unify/iphoneos/icons-22/flag.png":[14,18,"png","unify"],"unify/iphoneos/icons-22/fork-and-knife.png":[17,18,"png","unify"],"unify/iphoneos/icons-22/gear.png":[18,19,"png","unify"],"unify/iphoneos/icons-22/heart.png":[17,15,"png","unify"],"unify/iphoneos/icons-22/lightning-bolt.png":[12,18,"png","unify"],"unify/iphoneos/icons-22/magnifying-glass.png":[18,18,"png","unify"],"unify/iphoneos/icons-22/map-marker.png":[11,19,"png","unify"],"unify/iphoneos/icons-22/map-pin.png":[11,19,"png","unify"],"unify/iphoneos/icons-22/microphone.png":[12,18,"png","unify"],"unify/iphoneos/icons-22/music-note.png":[16,18,"png","unify"],"unify/iphoneos/icons-22/paw.png":[20,19,"png","unify"],"unify/iphoneos/icons-22/plus.png":[15,15,"png","unify"],"unify/iphoneos/icons-22/puzzle.png":[20,18,"png","unify"],"unify/iphoneos/icons-22/readme.txt":"unify","unify/iphoneos/icons-22/star.png":[17,17,"png","unify"],"unify/iphoneos/icons-22/tag.png":[18,18,"png","unify"],"unify/iphoneos/icons-22/tshirt.png":[24,17,"png","unify"],"unify/iphoneos/icons-32/01-refresh.png":[24,26,"png","unify"],"unify/iphoneos/icons-32/02-redo.png":[30,26,"png","unify"],"unify/iphoneos/icons-32/03-loopback.png":[32,22,"png","unify"],"unify/iphoneos/icons-32/04-squiggle.png":[33,16,"png","unify"],"unify/iphoneos/icons-32/05-shuffle.png":[28,20,"png","unify"],"unify/iphoneos/icons-32/06-magnifying-glass.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/07-map-marker.png":[16,26,"png","unify"],"unify/iphoneos/icons-32/08-chat.png":[24,22,"png","unify"],"unify/iphoneos/icons-32/09-chat2.png":[24,22,"png","unify"],"unify/iphoneos/icons-32/10-medical.png":[22,22,"png","unify"],"unify/iphoneos/icons-32/100-coffee.png":[20,24,"png","unify"],"unify/iphoneos/icons-32/101-gameplan.png":[28,28,"png","unify"],"unify/iphoneos/icons-32/102-walk.png":[14,27,"png","unify"],"unify/iphoneos/icons-32/103-map.png":[26,21,"png","unify"],"unify/iphoneos/icons-32/104-index-cards.png":[26,17,"png","unify"],"unify/iphoneos/icons-32/105-piano.png":[23,22,"png","unify"],"unify/iphoneos/icons-32/106-sliders.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/107-widescreen.png":[30,19,"png","unify"],"unify/iphoneos/icons-32/108-badge.png":[21,26,"png","unify"],"unify/iphoneos/icons-32/109-chicken.png":[28,12,"png","unify"],"unify/iphoneos/icons-32/11-clock.png":[25,25,"png","unify"],"unify/iphoneos/icons-32/110-bug.png":[22,23,"png","unify"],"unify/iphoneos/icons-32/111-user.png":[24,21,"png","unify"],"unify/iphoneos/icons-32/112-group.png":[32,21,"png","unify"],"unify/iphoneos/icons-32/113-navigation.png":[28,28,"png","unify"],"unify/iphoneos/icons-32/114-balloon.png":[20,26,"png","unify"],"unify/iphoneos/icons-32/115-bow-and-arrow.png":[23,29,"png","unify"],"unify/iphoneos/icons-32/116-controller.png":[30,20,"png","unify"],"unify/iphoneos/icons-32/117-todo.png":[18,19,"png","unify"],"unify/iphoneos/icons-32/118-coathanger.png":[32,20,"png","unify"],"unify/iphoneos/icons-32/119-piggybank.png":[27,20,"png","unify"],"unify/iphoneos/icons-32/12-eye.png":[24,16,"png","unify"],"unify/iphoneos/icons-32/120-headphones.png":[22,21,"png","unify"],"unify/iphoneos/icons-32/121-lanscape.png":[24,18,"png","unify"],"unify/iphoneos/icons-32/122-stats.png":[27,19,"png","unify"],"unify/iphoneos/icons-32/123-id-card.png":[24,17,"png","unify"],"unify/iphoneos/icons-32/124-bullhorn.png":[24,17,"png","unify"],"unify/iphoneos/icons-32/125-food.png":[29,23,"png","unify"],"unify/iphoneos/icons-32/126-moon.png":[19,22,"png","unify"],"unify/iphoneos/icons-32/127-sock.png":[17,24,"png","unify"],"unify/iphoneos/icons-32/128-bone.png":[30,13,"png","unify"],"unify/iphoneos/icons-32/129-golf.png":[29,26,"png","unify"],"unify/iphoneos/icons-32/13-target.png":[28,28,"png","unify"],"unify/iphoneos/icons-32/130-dice.png":[35,28,"png","unify"],"unify/iphoneos/icons-32/14-tag.png":[22,22,"png","unify"],"unify/iphoneos/icons-32/15-tags.png":[24,25,"png","unify"],"unify/iphoneos/icons-32/16-line-chart.png":[30,24,"png","unify"],"unify/iphoneos/icons-32/17-bar-chart.png":[29,24,"png","unify"],"unify/iphoneos/icons-32/18-envelope.png":[24,16,"png","unify"],"unify/iphoneos/icons-32/19-gear.png":[26,26,"png","unify"],"unify/iphoneos/icons-32/20-gear2.png":[26,28,"png","unify"],"unify/iphoneos/icons-32/21-skull.png":[22,24,"png","unify"],"unify/iphoneos/icons-32/22-skull-n-crossbones.png":[30,32,"png","unify"],"unify/iphoneos/icons-32/23-bird.png":[25,24,"png","unify"],"unify/iphoneos/icons-32/24-gift.png":[22,26,"png","unify"],"unify/iphoneos/icons-32/25-weather.png":[24,26,"png","unify"],"unify/iphoneos/icons-32/26-bandaid.png":[26,26,"png","unify"],"unify/iphoneos/icons-32/27-planet.png":[29,18,"png","unify"],"unify/iphoneos/icons-32/28-star.png":[26,26,"png","unify"],"unify/iphoneos/icons-32/29-heart.png":[24,21,"png","unify"],"unify/iphoneos/icons-32/30-key.png":[12,26,"png","unify"],"unify/iphoneos/icons-32/31-ipod.png":[17,29,"png","unify"],"unify/iphoneos/icons-32/32-iphone.png":[16,28,"png","unify"],"unify/iphoneos/icons-32/33-cabinet.png":[20,26,"png","unify"],"unify/iphoneos/icons-32/34-coffee.png":[24,26,"png","unify"],"unify/iphoneos/icons-32/35-shopping-bag.png":[24,22,"png","unify"],"unify/iphoneos/icons-32/36-toolbox.png":[26,20,"png","unify"],"unify/iphoneos/icons-32/37-suitcase.png":[26,22,"png","unify"],"unify/iphoneos/icons-32/38-airplane.png":[22,24,"png","unify"],"unify/iphoneos/icons-32/39-spraycan.png":[16,24,"png","unify"],"unify/iphoneos/icons-32/40-inbox.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/41-picture-frame.png":[24,26,"png","unify"],"unify/iphoneos/icons-32/42-photos.png":[22,24,"png","unify"],"unify/iphoneos/icons-32/43-film-roll.png":[26,22,"png","unify"],"unify/iphoneos/icons-32/44-shoebox.png":[24,22,"png","unify"],"unify/iphoneos/icons-32/45-movie1.png":[19,25,"png","unify"],"unify/iphoneos/icons-32/46-movie2.png":[20,25,"png","unify"],"unify/iphoneos/icons-32/47-fuel.png":[28,24,"png","unify"],"unify/iphoneos/icons-32/48-fork-and-knife.png":[18,26,"png","unify"],"unify/iphoneos/icons-32/49-battery.png":[26,14,"png","unify"],"unify/iphoneos/icons-32/50-beaker.png":[18,22,"png","unify"],"unify/iphoneos/icons-32/51-outlet.png":[24,20,"png","unify"],"unify/iphoneos/icons-32/52-pinetree.png":[18,24,"png","unify"],"unify/iphoneos/icons-32/53-house.png":[22,22,"png","unify"],"unify/iphoneos/icons-32/54-lock.png":[20,24,"png","unify"],"unify/iphoneos/icons-32/55-network.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/56-cloud.png":[24,16,"png","unify"],"unify/iphoneos/icons-32/57-download.png":[19,24,"png","unify"],"unify/iphoneos/icons-32/58-bookmark.png":[10,26,"png","unify"],"unify/iphoneos/icons-32/59-flag.png":[18,26,"png","unify"],"unify/iphoneos/icons-32/60-signpost.png":[22,28,"png","unify"],"unify/iphoneos/icons-32/61-brightness.png":[20,20,"png","unify"],"unify/iphoneos/icons-32/62-contrast.png":[20,20,"png","unify"],"unify/iphoneos/icons-32/63-runner.png":[18,25,"png","unify"],"unify/iphoneos/icons-32/64-zap.png":[12,24,"png","unify"],"unify/iphoneos/icons-32/65-note.png":[15,24,"png","unify"],"unify/iphoneos/icons-32/66-microphone.png":[12,24,"png","unify"],"unify/iphoneos/icons-32/67-tshirt.png":[26,18,"png","unify"],"unify/iphoneos/icons-32/68-paperclip.png":[14,26,"png","unify"],"unify/iphoneos/icons-32/69-display.png":[22,20,"png","unify"],"unify/iphoneos/icons-32/70-tv.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/71-compass.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/72-pin.png":[10,20,"png","unify"],"unify/iphoneos/icons-32/73-radar.png":[27,27,"png","unify"],"unify/iphoneos/icons-32/74-location.png":[20,20,"png","unify"],"unify/iphoneos/icons-32/75-phone.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/76-baby.png":[18,26,"png","unify"],"unify/iphoneos/icons-32/77-ekg.png":[26,22,"png","unify"],"unify/iphoneos/icons-32/78-stopwatch.png":[22,26,"png","unify"],"unify/iphoneos/icons-32/79-medical-bag.png":[24,20,"png","unify"],"unify/iphoneos/icons-32/80-shopping-cart.png":[26,19,"png","unify"],"unify/iphoneos/icons-32/81-dashboard.png":[28,28,"png","unify"],"unify/iphoneos/icons-32/82-dogpaw.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/83-calendar.png":[23,25,"png","unify"],"unify/iphoneos/icons-32/84-lightbulb.png":[14,21,"png","unify"],"unify/iphoneos/icons-32/85-trophy.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/86-camera.png":[24,18,"png","unify"],"unify/iphoneos/icons-32/87-wineglass.png":[14,24,"png","unify"],"unify/iphoneos/icons-32/88-beermug.png":[22,27,"png","unify"],"unify/iphoneos/icons-32/89-dumbbell.png":[28,10,"png","unify"],"unify/iphoneos/icons-32/90-lifebuoy.png":[24,24,"png","unify"],"unify/iphoneos/icons-32/91-beaker2.png":[20,24,"png","unify"],"unify/iphoneos/icons-32/92-testtube.png":[12,26,"png","unify"],"unify/iphoneos/icons-32/93-thermometer.png":[12,28,"png","unify"],"unify/iphoneos/icons-32/94-pill.png":[30,12,"png","unify"],"unify/iphoneos/icons-32/95-equalizer.png":[26,24,"png","unify"],"unify/iphoneos/icons-32/96-book.png":[18,26,"png","unify"],"unify/iphoneos/icons-32/97-puzzle.png":[28,25,"png","unify"],"unify/iphoneos/icons-32/98-palette.png":[24,20,"png","unify"],"unify/iphoneos/icons-32/99-umbrella.png":[24,26,"png","unify"],"unify/iphoneos/icons-32/readme.txt":"unify","unify/iphoneos/list/arrow-selected.png":[10,13,"png","unify"],"unify/iphoneos/list/arrow.png":[10,13,"png","unify"],"unify/iphoneos/navigation-bar/.DS_Store":"unify","unify/iphoneos/navigation-bar/black/navigationbar.png":[1,44,"png","unify"],"unify/iphoneos/navigation-bar/blue/navigationbar.png":[1,44,"png","unify"],"unify/iphoneos/navigation-bar/silver/navigationbar.png":[1,44,"png","unify"],"unify/iphoneos/pinstripes.png":[7,1,"png","unify"],"unify/iphoneos/scrollviewbgtexture.png":[256,256,"png","unify"],"unify/iphoneos/search/cancel-touched.png":[19,19,"png","unify"],"unify/iphoneos/search/cancel.png":[19,19,"png","unify"],"unify/iphoneos/search/magnifying-glass.png":[14,15,"png","unify"],"unify/iphoneos/style.sass":"unify","unify/iphoneos/tabbar/mask.png":[48,32,"png","unify"],"unify/iphoneos/tabbar/mask@2x.png":[96,64,"png","unify"],"unify/iphoneos/theme.sass":"unify","unify/iphoneos/tool-bar/.DS_Store":"unify","unify/iphoneos/tool-bar/black/.DS_Store":"unify","unify/iphoneos/tool-bar/black/button-back.png":[21,60,"png","unify"],"unify/iphoneos/tool-bar/black/button-blue.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/black/button-normal.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/black/button-red.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/black/segmented-all.png":[13,150,"png","unify"],"unify/iphoneos/tool-bar/black/toolbar.png":[1,44,"png","unify"],"unify/iphoneos/tool-bar/blue/.DS_Store":"unify","unify/iphoneos/tool-bar/blue/button-back.png":[21,60,"png","unify"],"unify/iphoneos/tool-bar/blue/button-blue.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/blue/button-normal.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/blue/button-red.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/blue/segmented-all.png":[13,150,"png","unify"],"unify/iphoneos/tool-bar/blue/toolbar.png":[1,44,"png","unify"],"unify/iphoneos/tool-bar/silver/button-back.png":[20,60,"png","unify"],"unify/iphoneos/tool-bar/silver/button-blue.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/silver/button-normal.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/silver/button-red.png":[11,60,"png","unify"],"unify/iphoneos/tool-bar/silver/segmented-all.png":[13,150,"png","unify"],"unify/iphoneos/tool-bar/silver/toolbar.png":[1,44,"png","unify"],"unify/mixins.sass":"unify","unify/reset.sass":"unify"};
qx.$$translations = {};
qx.$$locales = {};
qx.$$packageData = {};

qx.$$loader = {
  parts : {"boot":[0]},
  uris : [["qx:qx/Bootstrap.js","qx:qx/core/property/Util.js","qx:qx/core/Setting.js","qx:qx/bom/client/Engine.js","qx:qx/core/Variant.js","qx:qx/core/property/Debug.js","qx:qx/Mixin.js","qx:qx/Interface.js","qx:qx/Class.js","qx:qx/dev/StackTrace.js","qx:qx/core/ObjectRegistry.js","qx:qx/lang/Type.js","qx:qx/lang/Array.js","qx:qx/lang/Function.js","qx:qx/lang/String.js","qx:qx/type/BaseError.js","qx:qx/core/AssertionError.js","qx:qx/core/Assert.js","qx:qx/lang/JsonImpl.js","qx:qx/core/GlobalError.js","qx:qx/event/GlobalError.js","qx:qx/core/ValidationError.js","qx:qx/core/property/Core.js","qx:qx/core/property/Multi.js","qx:qx/core/property/Group.js","qx:qx/core/MAssert.js","qx:qx/core/property/Simple.js","qx:qx/core/Object.js","qx:qx/lang/Json.js","qx:qx/event/IEventHandler.js","qx:qx/dom/Node.js","qx:qx/bom/Event.js","qx:qx/event/Manager.js","qx:qx/event/Registration.js","unify:unify/event/handler/Transition.js","qx:qx/bom/client/Platform.js","qx:qx/bom/client/System.js","qx:qx/event/handler/UserAction.js","qx:qx/event/handler/Mouse.js","qx:qx/bom/client/Feature.js","qx:qx/lang/Object.js","qx:qx/bom/element/Class.js","unify:unify/bom/client/System.js","qx:qx/lang/RingBuffer.js","qx:qx/log/appender/RingBuffer.js","qx:qx/log/Logger.js","qx:qx/log/appender/Util.js","qx:qx/log/appender/Native.js","qx:qx/application/IApplication.js","qx:qx/event/handler/Application.js","qx:qx/event/IEventDispatcher.js","qx:qx/event/dispatch/Direct.js","qx:qx/util/ObjectPool.js","qx:qx/event/Pool.js","qx:qx/event/type/Event.js","qx:qx/event/type/Native.js","qx:qx/event/handler/Window.js","qx:qx/core/Init.js","qx:qx/application/Native.js","unify:unify/event/handler/Orientation.js","qx:qx/event/dispatch/AbstractBubbling.js","qx:qx/event/dispatch/DomBubbling.js","unify:unify/event/handler/Touch.js","unify:unify/Application.js","kitchensink:kitchensink/Application.js","qx:qx/core/WindowError.js","qx:qx/core/Type.js","qx:qx/util/DisposeUtil.js","qx:qx/event/handler/Object.js","qx:qx/event/type/Data.js","qx:qx/lang/Date.js","qx:qx/lang/Core.js","qx:qx/event/type/Dom.js","qx:qx/event/type/Mouse.js","qx:qx/event/type/MouseWheel.js","qx:qx/bom/Viewport.js","qx:qx/bom/Document.js","qx:qx/bom/client/Browser.js","qx:qx/dom/Hierarchy.js","qx:qx/bom/Selector.js","unify:unify/event/type/Orientation.js","unify:unify/event/type/Touch.js","unify:unify/bom/client/Extension.js","unify:unify/view/ViewManager.js","qx:qx/bom/element2/Class.js","qx:qx/type/BaseArray.js","unify:unify/view/Path.js","unify:unify/view/PopOverManager.js","unify:unify/view/Navigation.js","unify:unify/bom/History.js","unify:unify/event/type/History.js","unify:unify/bom/Storage.js","qx:qx/bom/Cookie.js","qx:qx/bom/element2/Style.js","qx:qx/locale/MTranslation.js","unify:unify/view/StaticView.js","kitchensink:kitchensink/view/Start.js","unify:unify/ui/Abstract.js","unify:unify/ui/Container.js","unify:unify/ui/Layer.js","qx:qx/bom/Html.js","unify:unify/ui/ToolBar.js","unify:unify/ui/NavigationBar.js","unify:unify/ui/Content.js","kitchensink:kitchensink/view/Uicomponents.js","unify:unify/ui/ScrollView.js","unify:unify/ui/ScrollIndicator.js","kitchensink:kitchensink/view/Widgets.js","qx:qx/ui/core/MChildrenHandling.js","qx:qx/ui/core/LayoutItem.js","unify:unify/ui/widget/core/Widget.js","unify:unify/ui/widget/core/Layer.js","qx:qx/ui/core/queue/Layout.js","qx:qx/util/DeferredCallManager.js","qx:qx/util/DeferredCall.js","qx:qx/event/handler/Element.js","qx:qx/html/Element.js","qx:qx/ui/core/queue/Manager.js","qx:qx/event/dispatch/MouseCapture.js","qx:qx/event/handler/Focus.js","qx:qx/bom/Selection.js","qx:qx/bom/Range.js","qx:qx/util/StringSplit.js","qx:qx/event/type/Focus.js","qx:qx/bom/element/Attribute.js","qx:qx/event/handler/Capture.js","qx:qx/bom/element/Scroll.js","qx:qx/bom/element/Overflow.js","qx:qx/bom/element/Clip.js","qx:qx/bom/element/Opacity.js","qx:qx/bom/element/Cursor.js","qx:qx/bom/element/BoxSizing.js","qx:qx/bom/element/Style.js","qx:qx/bom/element/Location.js","qx:qx/event/handler/Appear.js","qx:qx/bom/Element.js","qx:qx/xml/Document.js","qx:qx/ui/core/queue/Widget.js","qx:qx/ui/core/queue/Visibility.js","qx:qx/ui/core/queue/Appearance.js","qx:qx/ui/core/queue/Dispose.js","qx:qx/ui/layout/Abstract.js","qx:qx/bom/Font.js","qx:qx/ui/layout/VBox.js","qx:qx/ui/layout/Util.js","qx:qx/theme/manager/Decoration.js","qx:qx/ui/decoration/IDecorator.js","qx:qx/util/ValueManager.js","qx:qx/util/AliasManager.js","qx:qx/bom/element2/Dimension.js","unify:unify/ui/widget/container/Composite.js","unify:unify/ui/widget/container/NavigationBar.js","unify:unify/ui/widget/layout/NavigationBar.js","unify:unify/ui/widget/basic/Label.js","qx:qx/bom/Label.js","qx:qx/bom/element/Dimension.js","qx:qx/util/ResourceManager.js","unify:unify/ui/widget/form/Button.js","qx:qx/event/handler/Input.js","unify:unify/ui/widget/form/Input.js","qx:qx/bom/Input.js","unify:unify/view/ServiceView.js","unify:unify/view/SysInfo.js","unify:unify/business/StaticData.js","unify:unify/business/SysInfo.js","unify:unify/bom/client/Device.js","unify:unify/bom/client/Runtime.js","unify:unify/bom/client/Platform.js","unify:unify/bom/client/Engine.js","qx:qx/bom/client/Version.js","unify:unify/bom/client/Feature.js","unify:unify/bom/client/Ajax.js","unify:unify/view/TabViewManager.js"]],
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

qx.$$loader.importPackageData = function (dataMap, callback) {
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
  if (callback){
    callback(dataMap);
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

