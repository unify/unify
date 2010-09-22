/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Same basic control as {@link Abstract} but with additional
 * support for children managment.
 */
qx.Class.define("unify.ui.mobile.Container",
{
  extend : unify.ui.mobile.Abstract,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      OVERRIDEABLE METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function() {
      return document.createElement("div");
    },


    /**
     * Returns the DOM element which should contain children managed via
     * the methods {@link #add}, {@link #remove} and {@link #replace}.
     *
     * @overrideable
     * @return {Element} DOM element to insert children to
     */
    getContentElement : function() {
      return this.getElement();
    },




    /*
    ---------------------------------------------------------------------------
      CONTENT MANAGMENT
    ---------------------------------------------------------------------------
    */

    /**
     * Adds the given HTML string, control or DOM element.
     *
     * @param obj {String|Element|unify.ui.mobile.Abstract} HTML, control or element to insert
     */
    add : function(obj)
    {
      var target = this.getContentElement();
      if (typeof obj === "string")
      {
        var fragment = qx.bom.Html.clean([obj], window, true);
        target.appendChild(fragment);
      }
      else
      {
        var elem;

        if (obj.nodeType != null) {
          elem = obj;
        } else if (obj.getElement) {
          elem = obj.getElement();
        } else if (qx.core.Variant.isSet("qx.debug", "on")) {
          throw new Error(this.toString() + " invalid element to add(): " + obj);
        }

        target.appendChild(elem);
      }
    },


    /**
     * Removes the given control or DOM element.
     *
     * HTML strings are not supported here. Use {@link #clear} to remove the whole content.
     *
     * @param obj {Element|unify.ui.mobile.Abstract} Control or element to remove
     */
    remove : function(obj)
    {
      if (typeof obj === "string")
      {
        throw new Error(this.toString() + " invalid element to remove(): " + obj);
      }
      else
      {
        var target = this.getContentElement();
        var elem;

        if (obj.nodeType != null) {
          elem = obj;
        } else if (obj.getElement) {
          elem = obj.getElement();
        } else if (qx.core.Variant.isSet("qx.debug", "on")) {
          throw new Error(this.toString() + " invalid element to remove(): " + obj);
        }

        target.removeChild(elem);
      }
    },


    /**
     * Removes all content from the control.
     */
    clear : function() {
      this.getContentElement().innerHTML = "";
    },


    __intervalHandle : null,

    /**
     * Replaces current content with given content
     *
     * @param obj {String|Element|unify.ui.mobile.Abstract} HTML, control or element to insert
     */
    replace : function(obj)
    {
      if (this.__intervalHandle) 
      {
        this.warn("Still executing old replace() call. Clear it.");
        window.clearInterval(this.__intervalHandle);
        this.__intervalHandle = null;
      }
      
      var target = this.getContentElement();
      if (typeof obj === "string")
      {
        target.innerHTML = obj;

        // On iPhone, most often on slower models e.g. 3G during a high load
        // innerHTML applies are not working. The old content is removed, but the
        // new contnet is not applied. With a continues retry it works OK, but lead
        // to an issue because the method this way works asyncrously which is not
        // what the application developer might excpect.
        if (!target.firstChild)
        {
          this.warn("Content could not be applied with first try!");
          
          var self = this;
          var counter = 0;
          self.__intervalHandle = window.setInterval(function() 
          {
            target.innerHTML = obj;
            counter++;
            
            if (target.firstChild) 
            {
              self.debug("Content applied successfully after " + counter + " attempts");
              window.clearInterval(self.__intervalHandle);
              self.__intervalHandle = null;
            }
          }, 100);
        }
      }
      else
      {
        target.innerHTML = "";
        this.add(obj);
      }
    }
  }
});
