/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 */
core.Class("unify.ui.core.MRemoteLayoutHandling", {

  members : {
    /**
     * Set layout on children container
     */
    setLayout : function(layout) {
      return this.getChildrenContainer().setLayout(layout);
    },
    
    /**
     * Get Layout from children container
     */
    getLayout : function() {
      return this.getChildrenContainer().getLayout();
    }
  }
});
