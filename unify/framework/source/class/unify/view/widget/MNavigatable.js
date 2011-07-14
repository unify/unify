qx.Mixin.define("unify.view.widget.MNavigatable", {
  members : {
    __makeNavigatable : function(widget) {
      console.log(widget);
      var e = widget.getElement();
      // Register to navigation events
      qx.event.Registration.addListener(e, "click", this.__onClick, this);//TODO remove click handling, we care for touches. clicks are emulated into touches if neccassary
      qx.event.Registration.addListener(e, "tap", this._onTap, this);
      qx.event.Registration.addListener(e, "touchhold", this._onTouchHold, this);
      qx.event.Registration.addListener(e, "touchrelease", this._onTouchRelease, this);
      qx.event.Registration.addListener(e, "touchleave", this._onTouchRelease, this);//TODO separate onTouchLeave handler that prevents tap after leave?
    },
    
    __onClick : function(e) {
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), "a[href]");
      if (elem) {
        e.preventDefault();
      }
    }
  }
});