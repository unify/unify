/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Button to support navigation
 *
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.basic.NavigationButton", {
  extend: unify.ui.form.Button,

  include : [unify.ui.core.MNavigatable],
  
  /**
   * @param label {String} Label on button
   */
  construct : function(label) {
    this.base(arguments, label);
    
    this._applyMNavigatable();
  }
});
