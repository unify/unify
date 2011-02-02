/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Used exclusively by {@link SlideView} for displaying current position as dots.
 */
qx.Class.define("unify.ui.SlideIndicator",
{
  extend : unify.ui.Abstract,
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  
  /**
   * @param totalDots {Number} total amount of dots (pages) to show initially
   */
  construct : function(totalDots)
  {
    this.base(arguments);
    
    if(totalDots) 
    {
      // set total pages to local property
      this.setTotalDots(totalDots);
    }
  },
  
  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties :
  {
    /** total amount of dots (pages) to show */
    totalDots :
    {
      check : "Number",
      init : 1
    },
    
    /** index of currently active dot */
    activeDot :
    {
      check : "Number",
      init : 0
    }
  },
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  
  members :
  {
    // default values
    __totalDots : 0,
    __activeDot : 0,
    __dotContainer : null,
    __allDots : [],
    
    
    /*
    ---------------------------------------------------------------------------
      INTERFACE METHODS
    ---------------------------------------------------------------------------
    */
    
    // overridden
    _createElement : function()
    {
      var 
        doc = document,
        indicatorContainer = this.__dotContainer = doc.createElement("div"),
        totalDots = this.__totalDots = this.getTotalDots();
        
      indicatorContainer.className = "slide-indicator";
      
      // add a dot for each page
      for(var i = 0; i < this.__totalDots; i += 1)
      {
        this.__allDots[i] = doc.createElement("div");
        this.__dotContainer.appendChild(this.__allDots[i]);
      }
      
      // set first dot to active
      this.__activeDot = 0;
      this.setActiveDot(this.__activeDot);
      this.__allDots[this.__activeDot].className = 'activedot';
      
      return indicatorContainer;
    },
    
    
    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */
    
    /**
     * re-create the slide indicator with totalDots 
     * then show its active dot on position given by activeDot
     *
     * @param totalDots {Integer} number of dots to show
     * @param activeDot {Integer} index of active dot
     */
    renderComplete : function(totalDots, activeDot)
    {
      //this.debug('SlideIndicator::renderComplete() reached, totalDots, activeDot = ', totalDots, activeDot);
      
      // Update internal fields for totalDots and activeDot
      if(this.__totalDots !== totalDots)
      {
        var doc = document;
        
        // re-create all dots
        this.__dotContainer.innerHTML = '';
        this.__allDots = [];
        
        // update total dots
        this.__totalDots = totalDots;
        this.setTotalDots(this.__totalDots);
        
        // add a dot for each page
        for(var i = 0; i < this.__totalDots; i += 1)
        {
          this.__allDots[i] = doc.createElement("div");
          this.__dotContainer.appendChild(this.__allDots[i]);
        }
        //this.debug('SlideIndicator::renderComplete() total dots drawn: ', totalDots);
        
        // set active dot
        this.__allDots[activeDot].className = 'activedot';
        
      }
      else
      {
        //this.debug('SlideIndicator::renderComplete() just updating active dot, activeDot = ', activeDot);
        
        // just update active dot via render()
        this.render(activeDot);
      }
    },
    
    
    /**
     * make slide indicator show its active dot on position given by activeDot
     *
     * @param activeDot {Integer} index of active dot
     */
    render : function(activeDot)
    {
      //this.debug('SlideIndicator::render() reached, activeDot = ', activeDot);
      
      if(this.__activeDot !== activeDot)
      {
        // reset currently active dot
        this.__allDots[this.__activeDot].className = '';
        this.__allDots[activeDot].className = 'activedot';
        
        // update active dot
        this.__activeDot = activeDot;
        this.setActiveDot(this.__activeDot);
      }
    }
    
  }
});
