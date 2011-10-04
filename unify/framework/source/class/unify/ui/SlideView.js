/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Slide view component to have left/right sliding boxes with 100% width
 * @deprecated
 */
qx.Class.define("unify.ui.SlideView", 
{
  extend : unify.ui.ScrollView,
  
  construct : function() 
  {
    this.base(arguments);
    
    this.setEnableScrollY(false);
    this.setPaging(true);
    this.setShowIndicatorX(false);
  },
  
  properties : 
  {
    /** Whether the slide indicator (dots) should be displayed */
    showSlideIndicator :
    {
      init : true,
      check : "Boolean"
    },
    
    totalPages :
    {
      init : 1,
      check : "Number"
    }
  },
  
  members : 
  {
    
    /** {SlideIndicator} Instance of a ScrollIndicator used for paginated indication (dots) */
    __slideIndicator : null,
    
    /** {Boolean} Cache field for same named property */
    __showSlideIndicator : true,
    
    /** {Integer} Cache field for same named property */
    __totalPages : 1,
    
    /** {Integer} current index of pages in this SlideView */
    __currentPageIndex : 0,
    
    
    /**
     * Adds the given HTML string, control or DOM element.
     *
     * @param obj {String|Element|unify.ui.Abstract} HTML, control or element to insert
     */
    add : function(obj) 
    {
      this.base(arguments, obj);
      
      this.__resize();
      this.__updateSlideIndicator(this.__currentPageIndex, true);
    },
    
    /**
     * Replaces current content with the given HTML string, control or DOM element.
     *
     * @param obj {String|Element|unify.ui.Abstract} HTML, control or element to insert
     */
    replace : function(obj) 
    {
      this.base(arguments, obj);
      
      this.__resize();
      this.__updateSlideIndicator(this.__currentPageIndex, true);
    },
    
    /**
     * Scrolls to a specific page
     *
     * @param pageIndex {Integer} Index of page to show, starting with 0
     */
    scrollToPage : function(pageIndex) 
    {
      //this.debug('SlideView::scrollToPage(pageIndex)', pageIndex, qx.bom.Document.getWidth(), this);
      this.scrollTo(-pageIndex * qx.bom.Document.getWidth());
      this.__updateSlideIndicator(pageIndex);
    },
    
    // overridden
    _createElement : function() 
    {
      var 
        slideViewEl = this.base(arguments),
        SlideIndicator = unify.ui.SlideIndicator,
        slideIndicator = this.__slideIndicator = new SlideIndicator(this.__totalPages),
        Registration = qx.event.Registration,
        showSlideIndicator = this.__showSlideIndicator = this.getShowSlideIndicator();
        
      slideViewEl.className = "scroll-view slide-view";
      Registration.addListener(window, "resize", this.__onResize, this);
    
      if(showSlideIndicator)
      {
        slideViewEl.appendChild(slideIndicator.getElement());
        
        // add snap event handler
        Registration.addListener(this, "snap", this.__onSnap, this);
      }
      
      return slideViewEl;
    },
    
    /**
     * Updates the given slide indicator to show current page
     *
     * @param pageIndex {Integer} Index of page to indicate, active dot
     * @param redoTotals {Integer} Re-create indicator with this many total dots
     */
    __updateSlideIndicator : function(pageIndex, redoTotals) 
    {
      if(!this.__showSlideIndicator)
      {
        //console.log('SlideView::__updateSlideIndicator() slide indicator inactive');
        return;
      }
      //this.debug('SlideView::__updateSlideIndicator(pageIndex, redoTotals)', pageIndex, redoTotals);
      
      if(pageIndex === undefined || pageIndex === null)
      {
        // find pageIndex by calculation
        pageIndex = Math.round((-this.getScrollLeft() + 10) / qx.bom.Document.getWidth());
        //this.debug('SlideView::__updateSlideIndicator() calculated pageIndex = ', pageIndex);
      }
      
      // set current page index
      this.__currentPageIndex = pageIndex;
      
      // redo totals
      if(redoTotals === true)
      {
        // how many pages do we have in total?
        var totalChilds = this.getContentElement().childNodes.length;
        //this.debug('SlideView::__updateSlideIndicator() totalChilds = ', totalChilds);
        
        // update page count
        if(this.__totalPages !== totalChilds)
        {
          this.__totalPages = totalChilds;
          this.setTotalPages(totalChilds);
          
          //this.debug('SlideView::__updateSlideIndicator() this.__totalPages = ', this.__totalPages);
        }
        
        // render complete SlideIndicator element (including inactive dots)
        this.__slideIndicator.renderComplete(this.__totalPages, this.__currentPageIndex);
      }
      else
      {
        //this.debug('SlideView::__updateSlideIndicator() using this.__totalPages = ', this.__totalPages);
        
        // set active dot on SlideIndicator element
        this.__slideIndicator.render(this.__currentPageIndex);
      }
    },
    
    /**
     * Window resize event handler to resize slide view and resnap into bounds of paging
     */
    __onResize : function() 
    {
      this.__resize();
      this.reflow();
    },
    
    /**
     * Snap event (fired in the underlying ScrollView) handler
     */
    __onSnap : function() 
    {
      //console.log('SlideView::__onSnap()');
      this.__updateSlideIndicator();
    },
    
    /**
     * Resize of slide view to document width
     */
    __resize : function() 
    {
      var childs = this.getContentElement().childNodes;
      var width = qx.bom.Document.getWidth() + "px";
      for (var i=0,len=childs.length; i<len; i++) {
        childs[i].style.width = width;
      }
    }
    
  }
});
