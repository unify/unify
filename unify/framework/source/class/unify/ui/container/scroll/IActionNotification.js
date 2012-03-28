/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2012, Dominik Göpel

 *********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Interface for Action Notification widgets of unify.ui.container.ActionScroll
 */
qx.Interface.define("unify.ui.container.scroll.IActionNotification", {
  properties : {
    //phase of the notification
    phase : {check : ["initial", "activated", "executing"]}
  },
  members:{
    show:function(){},
    exclude:function(){}
  }
});