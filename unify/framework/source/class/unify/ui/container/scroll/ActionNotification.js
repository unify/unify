/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2012, Dominik Göpel

 *********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Action Notification widget for unify.ui.container.ActionScroll
 * 
 */
core.Class("unify.ui.container.scroll.ActionNotification", {
  include: [unify.ui.container.Composite, unify.ui.core.MChildControl],
  implement:  [unify.ui.container.scroll.IActionNotification],
  
  
  properties : {
    //location of the notification
    location:{
      type: ["top","bottom"],
      apply: function(value,old) { this._applyLocation(value, old); }
    },
    //phase of the notification
    phase : { 
      type : ["initial", "activated", "executing"],
      apply: function(value,old) { this._applyPhase(value, old); }
    },
    
    /** parent scroll container of this notification */
    scroll : { /*check:"unify.ui.container.ActionScroll"*/ }
  },
  
  construct: function(scroll,location,layout){

    unify.ui.container.Composite.call(this,layout||new unify.ui.layout.HBox);
    this._showChildControl("iconcontainer");
    this._showChildControl("label");
    this.__pullIconElem=this.getChildControl("pullicon").getElement();
    this.__activityIconElem=this.getChildControl("activityicon").getElement();
    this.setScroll(scroll);
    this.setLocation(location);
    this.setPhase("initial");

    this.__labelValues={};
    //TODO translate?
    this.setLabelValue("initial","pull to refresh ...");
    this.setLabelValue("activated","release to refresh ...");
    this.setLabelValue("executing","refreshing ...");

  },
  
  members : {
    
    //map of label values for phases
    __labelValues:null,
    
    //cached for performance reasons
    __pullIconElem:null,
    __activityIconElem:null,

    /**
     * set label value for a phase
     * 
     * @param phase {String} one of "initial","activated","executing"
     * @param value {String} the notification text to set on label
     */
    setLabelValue: function(phase,value){
      this.__labelValues[phase]=value;
      if(phase==this.getPhase()){
        this.getChildControl("label").setValue(value);
      }
    },
    
    //overridden
    _createChildControlImpl: function(id){
      var child;
      switch(id){
        case "label":{
          child=new unify.ui.basic.Label((this.__labelValues)?(this.__labelValues.initial):(""));
          this._addAt(child,1,{flex:1});
        }
        break;
        case "iconcontainer":{
          child=new unify.ui.container.Composite(new unify.ui.layout.Canvas);
          child.add(this.getChildControl("pullicon"));
          child.add(this.getChildControl("activityicon"));
          this._addAt(child,0);
        }
        break;
        case "pullicon":{
          child=new unify.ui.basic.Content();
        }
        break;
        case "activityicon":{
          child=new unify.ui.basic.Content();
        }
        break;
        default:{
          throw new Error("invalid child control id: "+id);
        }
      }
      return child;
    },

    /**
     * called when apply property changes its value.
     * 
     * @param phase {String} new value for phase
     */
    _applyPhase : function(phase,old){
      var activityIcon=this.__activityIconElem;
      var pullIcon=this.__pullIconElem;
      var Style=core.bom.Style;
      var labelValue="";
      var location=this.getLocation();
      //start regular and rotate 180° counter-clockwise
      var rotateStr=unify.bom.Transform.accelRotate;
      var initialTranform=rotateStr(0);
      var activatedTranform=rotateStr(-180);
      if(location=="bottom"){
        //start 180° rotated and rotate clockwise
        initialTranform=rotateStr(180);
        activatedTranform=rotateStr(360);
      }
      
      switch(phase){
        case "initial":{
          Style.set(pullIcon,{
            display:"",
            transitionDuration:((old=="activated")?("350ms"):("0ms")),
            transform:initialTranform
          });
          Style.set(activityIcon,{
            display:"none",
            animationName:"",
            animationIterationCount:""
          });
        }
        break;
        case "activated":{
          Style.set(pullIcon,{
            display:"",
            transitionDuration:((old=="initial")?("350ms"):("0ms")),
            transform:activatedTranform
          });
          Style.set(activityIcon,{
            display:"none",
            animationName:"",
            animationIterationCount:""
          });
        }
        break;
        case "executing":{
          Style.set(pullIcon,{
            display:"none",
            transitionDuration:"0ms",
            transform:initialTranform
          });
          Style.set(activityIcon,{
            display:"",
            animationName:"rotateZ",
            animationIterationCount:"infinite"
          });
        }
        break;
        default:{
          throw new Error("qooxdoo property system broken, called apply with disallowed value: "+phase);
        }
      }
      if(this.__labelValues){
        var labelValue=this.__labelValues[phase];
        if(labelValue){
          this.getChildControl("label").setValue(labelValue);
        }
      }
    },

    /**
     * called when location property changes its value.
     * 
     * @param value {String} new value for location
     */
    _applyLocation: function(value){
      var height=this.getScroll().getNotificationHeight();
      switch(value){
        case "top":{
          this.setStyle({
            height:height,
            marginTop:-height
          });
          var layout=this.getLayout()
          if(layout.setAlignY){
            layout.setAlignY("bottom");
          }
        }
        break;
        case "bottom":{
          this.setStyle({
            height:height,
            marginBottom:-height
          });
          var layout=this.getLayout()
          if(layout.setAlignY){
            layout.setAlignY("top");
          }
        }
        break;
        default:{
          throw new Error("qooxdoo property system broken, called apply with disallowed value: "+value);
        }
      }
    }
  }
});