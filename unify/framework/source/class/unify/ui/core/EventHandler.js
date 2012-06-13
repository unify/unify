/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

(function(global) {

  var emulateTouch = unify.bom.client.Device.DESKTOP;

  var touchSynthesizer = function(e) {
    return {
      myValue: true,
      touches: [{
        identifier : 1,
        target: lowland.bom.Events.getTarget(e),
        pageX : e.screenX,
        pageY : e.screenY
      }],
      scale: 1.0
    };
  };
  
  var eventElement = document.documentElement;

  if (emulateTouch) {
    var root = null;
    lowland.bom.Events.set(eventElement, "click", function(e) {
      if (!root) {
        root = unify.core.Init.getApplication().getRoot().getElement();
      }
      var target = lowland.bom.Events.getTarget(e);
      if (target.unify || unify.bom.Element.contains(root, target)) {
        target.unify = true;
        lowland.bom.Events.preventDefault(e);
      }
    });
    lowland.bom.Events.set(eventElement, "mousedown", function(e) {
      if (e.button == 0) {
        lowland.bom.Events.dispatch(lowland.bom.Events.getTarget(e), "touchstart", false, touchSynthesizer(e));
      }
    });
    lowland.bom.Events.set(eventElement, "mousemove", function(e) {
      lowland.bom.Events.dispatch(lowland.bom.Events.getTarget(e), "touchmove", false, touchSynthesizer(e));
    });
    lowland.bom.Events.set(eventElement, "mouseup", function(e) {
      if (e.button == 0) {
        lowland.bom.Events.dispatch(lowland.bom.Events.getTarget(e), "touchend", false, touchSynthesizer(e));
      }
    });
  }
  
  var touchElement = [];
  
  lowland.bom.Events.listen(eventElement, "touchstart", function(e) {
    touchElement.push(e.touches[0]);
  });
  lowland.bom.Events.listen(eventElement, "touchmove", function(e) {
    var fTouch = e.touches[0];
    var removes = [];
    
    for (var i=0,ii=touchElement.length; i<ii; i++) {
      var touch = touchElement[i];
      
      if (fTouch.identifier == touch.identifier) {
        var x = Math.abs(touch.pageX - fTouch.pageX);
        var y = Math.abs(touch.pageY - fTouch.pageY);
        
        if (x+y >= 10) {
          removes.push(i);
        }
      }
    }
    for (i=0,ii=removes.length; i<ii; i++) {
      touchElement.splice(removes[i], 1);
    }
  });
  lowland.bom.Events.listen(eventElement, "touchend", function(e) {
    var removeTouchElement = [];
    for (var i=0,ii=touchElement.length; i<ii; i++) {
      var touch = touchElement[i];
      
      if (lowland.bom.Events.getTarget(e) == touch.target) {
        removeTouchElement.push(touch);
        
        lowland.bom.Events.dispatch(lowland.bom.Events.getTarget(e), "tap");
      }
    }
    for (i=removeTouchElement.length-1; i>=0; i--) {
      touchElement.remove(removeTouchElement[i]);
    }
    removeTouchElement = null;
  });

})(this);
