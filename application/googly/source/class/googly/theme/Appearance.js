/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Googly appearances
 */
qx.Theme.define("googly.theme.Appearance", {
  extend: unify.theme.dark.Appearance,
  
  appearances : {
    "button" : {
      base : true,
      
      style : function() {
        return {
          padding: "2px",
          margin: "10px 8px",
          fontSize: "12px",
          backgroundColor: "red",
          //properties : {
            verticalAlign: "middle"
          //}
        };
      }
    },
    
    "label" : {
      base : true,
      
      style : function() {
        return {
          paddingLeft: "10px",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingBottom: "10px"
        };
      }
    }
  }
});