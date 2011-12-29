/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Activity indicator
 */
qx.Class.define("unify.ui.other.ActivityIndicator", {
  extend: unify.ui.container.Composite,
  type: "singleton",
  
  include : [unify.ui.core.MChildControl],
  
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "activityindicator"
    },
    
    /** {String} Text of activity indicator */
    text : {
      check: "String",
      apply: "_applyText"
    }
  },
  
  construct : function() {
    this.base(arguments, new unify.ui.layout.VBox());
    
    this._showChildControl("image");
    this._showChildControl("label");
    
    qx.core.Init.getApplication().getRoot().add(this, {
      top: "50%",
      left: "50%"
    });
    this.setVisibility("excluded");
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
        control = new unify.ui.basic.Label().set({
          alignX: "center",
          appearance: this.getAppearance() + "/" + id
        });
        this._addAt(control, 1);
      }
      
      return control || this.base(arguments, id);
    },
    
    _applyText : function(value) {
      this.getChildControl("label").setValue(value);
    },
    
    show : function() {
      this.getChildControl("image").show();
      this.base(arguments);
    },
    
    hide : function() {
      this.base(arguments);
      this.getChildControl("image").hide();
    }
  }
});