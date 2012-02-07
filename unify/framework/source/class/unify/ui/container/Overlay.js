/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Overlay container widget
 */
qx.Class.define("unify.ui.container.Overlay", {
  extend : unify.ui.container.SimpleOverlay,
  
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "overlay"
    },
    
    /** Paint arrow */
    hasArrow : {
      check: "Boolean",
      init: true,
      apply: "_applyHasArrow"
    },

    /** relative position of the arrow on its axis
     *
     * may be "left,right,center,top,bottom, a percentage of the axis size or a pixel value (relative to axis start)
     */
    relativeArrowPosition : {
      init: "left",
      nullable: true
    }
  },

  
  /**
   * @param noArrow {Boolean?} set to true if overlay should not have an arrow element
   */
  construct : function(noArrow) {
    this.base(arguments, new unify.ui.layout.special.OverlayLayout());
    
    this.addListener("appearance", this.__syncAppearance, this);
    
    this._showChildControl("container");
    //this.setHasArrow(!noArrow);//applyHasArrow creates the arrow if required
  },
  
  members : {
    
    /**
     * Appearance queue hit widget, so check if arrow is needed
     */
    __syncAppearance : function() {
      if (this.getHasArrow()) {
        this._showChildControl("arrow");
      }
    },

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;
      
      if (id == "arrow") {
        control = new unify.ui.other.Arrow();
        this._addAt(control, 1, {
          type: "arrow"
        });
      }
      
      return control || this.base(arguments, id);
    },

    /**
     * shows/hides the arrow element depending on value
     * @param value {Boolean} new hasArrow value
     */
    _applyHasArrow : function(value) {
      if (value) {
        this._showChildControl("arrow");
      } else {
        this._excludeChildControl("arrow");
      }
    },
    
    //overridden, calculate overlaysize as content size + arrow size depending on arrow direction
    _computeSizeHint: function(){
      var hint=this.base(arguments);
      
      if(this.getHasArrow()){
        var arrow=this.getChildControl("arrow");
        var arrowHint=arrow.getSizeHint();
        var direction=arrow.getDirection();
        if(direction=="left"||direction=="right"){
          hint.width+=arrowHint.width;
        } else if(direction=="top"||direction=="bottom"){
          hint.height+=arrowHint.height;
        }
      }
      
      return hint;
    },
    
    /**
     * Calculates a position hint to align overlay to trigger widget
     *
     * if the overlay has an arrow, the arrows pointing edge is used as reference
     */
    __getPositionHint : function() {
      var pos = this.base(arguments);
      
      var left = pos.left;
      var top = pos.top;
      
      var isString = false;
      
      var staticPosition = this.getStaticPosition();
      if (staticPosition && typeof(staticPosition.left) == "string" || typeof(staticPosition.top) == "string") {
        isString = true;
      }
      
      var arrow=this.getChildControl("arrow", true);
      if(arrow && !isString){
        var thisSize=this.getSizeHint();
        var arrowPosition=this.calculateArrowPosition(thisSize.height,thisSize.width);

        left-=arrowPosition.left;
        top-=arrowPosition.top;
        var arrowDirection=arrow.getDirection();

        //now account for arrow pointing edge offset
        //TODO at the moment we assume the pointing edge is in the middle, refactor into arrow class to allow arbitraty points
        var arrowSize=arrow.getSizeHint();
        if(arrowDirection=="left"||arrowDirection=="right"){
          top-=Math.round(arrowSize.height/2);
        } else if (arrowDirection=="bottom"||arrowDirection=="top"){
          left-=Math.round(arrowSize.width/2);
        }
      }

      return {
        left: left,
        top: top
      };
    },

    /**
     * calculate the left/top position of the arrow element on the overlay .
     *
     * this function is used by the layout and by __getPositionHint
     * @param height {Number} height of the overlay content
     * @param width {Number} width of the overlay content
     */
    calculateArrowPosition : function(height,width){
      var GAP = 6;//TODO use border width +1?
      var arrow = this.getChildControl("arrow");
      var arrowLeft=0;
      var arrowTop=0;

      if(arrow){
        var arrowWidth=arrow.getWidth();
        var arrowHeight=arrow.getHeight();
        var arrowDirection=arrow.getDirection();
        var arrowPosition=this.getRelativeArrowPosition();

        if(arrowDirection=="left" || arrowDirection=="right"){
          var relativeOffset=this._toPixelValue(height,arrowPosition);
          if(arrowPosition=="top"){
            arrowTop=GAP;
          } else if(arrowPosition=="bottom"){
            arrowTop = height - arrowHeight - GAP;
          } else if(arrowPosition=="center"){
            arrowTop = Math.round(height / 2 - arrowHeight/2);
          } else {
            arrowTop = relativeOffset - Math.round(arrowHeight/2);
          }
        } else if (arrowDirection=="top" || arrowDirection=="bottom"){
          var relativeOffset=this._toPixelValue(width,arrowPosition);
          if(arrowPosition=="left"){
            arrowLeft=GAP;
          } else if(arrowPosition=="right"){
            arrowLeft = width - arrowWidth - GAP;
          } else if(arrowPosition=="center"){
            arrowLeft = Math.round(width / 2 - arrowWidth/2);
          } else {
            arrowLeft = relativeOffset - Math.round(arrowWidth/2);
          }
        }
      }

      return {
        left: arrowLeft,
        top: arrowTop
      }
    }
  }
});