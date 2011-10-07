/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 *
 * Embedded iframe widget
 */
qx.Class.define("unify.ui.widget.embed.Iframe", {
  extend : unify.ui.widget.core.Widget,
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "iframe"
    }
  },
  
  members : {
    __isLoaded : false,
    __content : null,
    
    // overridden
    _createElement : function() {
      var e = qx.bom.Iframe.create();
      qx.event.Registration.addListener(e, "load", this.__iframeLoaded, this);
      return e;
    },
    
    /**
     * Executed on loading of iframe, this is called after adding iframe to DOM
     */
    __iframeLoaded : function() {
      qx.event.Registration.removeListener(this.getElement(), "load", this.__iframeLoaded, this);
      this.__isLoaded = true;
      
      var c = this.__content;
      if (c) {
        this.__content = null;
        
        if (c.type == "html") {
          this.setHtmlFromText(c.content);
        } else if (c.type == "fragment") {
          this.setContent(c.content);
        }
      }
    },
    
    /**
     * Set content of IFrame as document fragment
     *
     * @param documentFragment {DocumentFragment} Document fragment to add to iframe
     */
    setContent : function(documentFragment) {
      if (this.__isLoaded) {
        var doc = qx.bom.Iframe.getDocument(this.getElement());
        doc.body.appendChild(documentFragment);
      } else {
        this.__content = {
          type: "fragment",
          content: documentFragment
        };
      }
    },
    
    /**
     * Set content of IFrame as HTML string
     *
     * @param text {String} HTML content as string
     */
    setContentFromText : function(text) {
      var div = document.createElement("div");
      div.innerHTML = text;
      
      var df = document.createDocumentFragment();
      var dcn = div.childNodes;
      for (var i=0, ii=dcn.length; i<ii; i++) {
        df.appendChild(dcn[i]);
      }
      this.setContent(df);
    },
    
    /**
     * Set content of IFrame from HTML document as string
     *
     * @param text {String} Full HTML content as string
     */
    setHtmlFromText : function(text) {
      if (this.__isLoaded) {
        var doc = qx.bom.Iframe.getDocument(this.getElement());
        doc.open();
        doc.write(text);
        doc.close();
      } else {
        this.__content = {
          type: "html",
          content: text
        };
      }
    }
  }
});
