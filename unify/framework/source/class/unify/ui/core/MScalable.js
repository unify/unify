/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2012, Dominik Göpel

 *********************************************************************************************** */

/**
 * Mixin to support widget scaling via transform
 *
 */
qx.Mixin.define("unify.ui.core.MScalable", {
  construct : function() {
    this.__scale=1;
    this.__maxScale=Infinity;
    this.renderLayout = this.__wrapRenderLayout();
    this._computeSizeHint = this.__wrapComputeSizeHint();
    this._getHeightForWidth= this.__wrapGetHeightForWidth();
  },

  members : {

    __scale:null,
    __maxScale:null,
    
    getScale: function(){
      return this.__scale;
    },

    /**
     * set scale factor
     * 
     * a scale value smaller than 1 is set to 1
     * a scale value bigger than what is allowed by maxHeight/preferredHeight or maxWidth/preferredWidth 
     * is set to max possible scale that does not violate max dim
     * 
     * @param scale {Number} scale factor. 
     */
    setScale: function(scale){
      var newScale=Math.max(1,Math.min(scale,this.__maxScale));
      if(newScale!==this.__scale){
        this.__scale=newScale;
        this.setStyle({transform:unify.bom.Transform.scale(newScale,newScale),transformOrigin:"0% 0%",transitionDuration:"0ms"});

        this.invalidateLayoutCache();
        this.scheduleLayoutUpdate();
      }
    },

    /**
     * wraps renderLayout with a function that accounts for scale factor
     * 
     * @return {Function} wrapped function
     * @private
     */
    __wrapRenderLayout : function() {
      var original = this.renderLayout;
      var context = this;

      var newFnt = function(left,top,width,height) {
        return original.call(context, left,top,Math.round(width/this.__scale),Math.round(height/this.__scale));
      };

      return newFnt;
    },

    /**
     * wraps _computeSizeHint with a function that accounts for scale factor
     * 
     * @return {Function} wrapped function
     * @private
     */
    __wrapComputeSizeHint: function(){
      var original = this._computeSizeHint;
      var context = this;

      var newFnt = function() {
        var hint = original.call(context);
        var maxWidthScale=(hint.maxWidth/hint.width)||Infinity;
        var maxHeightScale=(hint.maxHeight/hint.height)||Infinity;
        
        this.__maxScale=Math.min(maxWidthScale,maxHeightScale);
        
        if(hint.width){
          hint.width=Math.round(hint.width*this.__scale);
        }
        if(hint.height){
          hint.height=Math.round(hint.height*this.__scale);
        }
        return hint;
      };

      return newFnt;
    },

    /**
     * wraps _getHeightForWidth with a function that accounts for scale factor
     * @return {Function}
     * @private
     */
    __wrapGetHeightForWidth: function(){
      var original = this._getHeightForWidth;
      var context = this;

      var newFnt = function(width) {
        var height = original.call(context, width);
        return height?Math.round(height*this.__scale):height;
      };

      return newFnt;
    }
  },

  destruct : function() {
    this.__scale=null;
  }
});