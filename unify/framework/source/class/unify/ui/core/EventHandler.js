/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

(function(global) {

  var emulateTouch = true;

  var touchSynthesizer = function(e) {
    return {
      myValue: true,
      touches: [{
        target: e.target,
        pageX : e.screenX,
        pageY : e.screenY
      }],
      scale: 1.0
    };
  };
  
  var eventElement = document.documentElement;

  if (emulateTouch) {
    lowland.bom.Events.set(eventElement, "click", function(e) {
      lowland.bom.Events.dispatch(e.target, "tap");
      e.preventDefault();
    });
    lowland.bom.Events.set(eventElement, "mousedown", function(e) {
      lowland.bom.Events.dispatch(e.target, "touchstart", false, touchSynthesizer(e));
      e.preventDefault();
    });
    lowland.bom.Events.set(eventElement, "mousemove", function(e) {
      lowland.bom.Events.dispatch(e.target, "touchmove", false, touchSynthesizer(e));
      e.preventDefault();
    });
    lowland.bom.Events.set(eventElement, "mouseup", function(e) {
      lowland.bom.Events.dispatch(e.target, "touchend", false, touchSynthesizer(e));
      e.preventDefault();
    });
  }

})(this);