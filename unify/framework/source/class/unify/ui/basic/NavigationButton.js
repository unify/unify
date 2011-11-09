/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Button to support navigation
 *
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.basic.NavigationButton", {
  extend: unify.ui.form.Button,

  include : [unify.ui.core.MNavigatable],
  
  construct : function(label) {
    this.base(arguments, label);
    
    this._makeNavigatable();
  }
});
