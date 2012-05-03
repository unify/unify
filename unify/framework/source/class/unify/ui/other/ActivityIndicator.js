/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Activity indicator
 */
core.Class("unify.ui.other.ActivityIndicator", {
  include : [unify.ui.container.Composite, unify.ui.core.MChildControl],
  implement : [unify.ui.core.IPopOver],
  
  properties : {
    // overridden
    appearance : {
      init: "activityindicator"
    },
    
    /** {String} Text of activity indicator */
    text : {
      type: "String",
      apply: function(value) { this._applyText(value); }
    },
    
    modal : {
      type: "Boolean",
      init: true
    }
  },
  
  construct : function() {
    unify.ui.container.Composite.call(this, new unify.ui.layout.VBox());
    unify.ui.core.MChildControl.call(this);
    
    this._showChildControl("image");
    this._showChildControl("label");
  },
  
  members : {
    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;
      
      if (id == "image") {
        var control;
        if(unify.bom.client.System.ANDROID){
          //AnimatedImage is based on requestAnimationFrame and is choppy on at least motorola xoom with android 3.1
          //so we use a keyframe based solution here
          control=new unify.ui.basic.KeyframeAnimatedImage();
        } else {
          control=new unify.ui.basic.AnimatedImage();
        }
        control.set({
          alignX: "center",
          allowGrowX: false,
          allowGrowY: false,
          allowShrinkX: false,
          allowShrinkY: false,
          appearance: this.getAppearance() + "/" + id
        });
        this._addAt(control, 0);
      } else if (id == "label") {
        control = new unify.ui.basic.Label();
        control.set({
          alignX: "center",
          appearance: this.getAppearance() + "/" + id
        });
        this._addAt(control, 1);
      }
      
      return control || unify.ui.container.Composite.prototype._createChildControlImpl.call(this, id);
    },
    
    _applyText : function(value) {
      this.getChildControl("label").setValue(value);
    },
    
    show : function() {
      this.getChildControl("image").show();
      unify.ui.container.Composite.prototype.show.call(this);
    },
    
    hide : function() {
      unify.ui.container.Composite.prototype.hide.call(this);
      this.getChildControl("image").hide();
    }
  }
});