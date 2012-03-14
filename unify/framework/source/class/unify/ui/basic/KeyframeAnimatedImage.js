/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, TELEKOM AG

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */

(function() {
  
  var styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  //TODO write keyframe rule with correct prefix depending on browser engine
  var rules = document.createTextNode(
      '@-webkit-keyframes KAI_rotateZ{' +//use a unique name to avoid overriding other keyframe definitions
        'from{' +
          '-webkit-transform:rotate3d(0,0,1,0deg)}' +
        'to{' +
          '-webkit-transform:rotate3d(0,0,1,360deg)' +
        '}' +
      '}');
  styleNode.appendChild(rules);
  document.head.appendChild(styleNode);
  
  core.Class("unify.ui.basic.KeyframeAnimatedImage", {
    include : [unify.ui.basic.Image],
    
    construct : function(source) {
      this.__source = source;
      unify.ui.basic.Image.call(this);
      
      this.addListener("changeVisibility", this.__onChangeVisibility, this);
    },
  
    properties:{
      /** Duration of rotation */
      animateRotateDuration:{
        init:1500,
        type:"Integer"
      }
    },
  
    members : {
      _createElement: function(){
        //use a backgroundimage div because android (at least on motorola xoom with 3.1) has problems rotating images around their center
        var elem= document.createElement('div');
        core.bom.Style.set(elem,{
          backgroundColor:"transparent",
          backgroundPosition:"center center",
          backgroundRepeat:"no-repeat",
          backgroundImage:"url("+core.io.Asset.toUri(this.__source)+")",
          transformOriginX:"50%",
          transformOriginY:"50%"
        });
        return elem;
      },
      _applySource : function(value) {
        this.setStyle({backgroundImage:"url("+core.io.Asset.toUri(value)+")"});
      },
      /**
       * Event handler for visibility changes
       *
       * @param e {Event} Change event
       */
      __onChangeVisibility : function(e) {
        if (e.getData() == "visible") {
          this.__startRotate();
        } else {
          this.__stopRotate();
        }
      },
  
      /**
       * starts rotation by adding the required css styles
       */
      __startRotate : function(){
        this.setStyle({
            animationName: "KAI_rotateZ",
            animationDuration: this.getAnimateRotateDuration()+"ms",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear"
        });
      },
  
      /**
       * stops rotation by removing the required css styles
       */
      __stopRotate : function(){
        this.setStyle({
          animationName: "",
          animationDuration: "",
          animationIterationCount: "",
          animationTimingFunction: ""
        });
      }
    }
  });

})();