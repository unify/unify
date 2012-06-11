/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Interface for animation manager that handles view transitions. This is used
 * in unify.Application#getViewAnimationManager
 */
core.Interface("unify.view.animation.IAnimationManager", {
  members : {
    
    /**
     * Initialisation of "view in" transition.
     * @fromView {unify.view.StaticView?}if view to push out,
     * @toView {unify.view.StaticView?} is view to pull in.
     */
    initIn : function(fromView, toView) {},
    
    /**
     * Initialisation of "view out" transition.
     * @fromView {unify.view.StaticView?}if view to push out,
     * @toView {unify.view.StaticView?} is view to pull in.
     */
    initOut : function(fromView, toView) {},
    
    /**
     * Initialisation of "modal view in" transition.
     * @fromView {unify.view.StaticView?}if view to push out,
     * @toView {unify.view.StaticView?} is view to pull in.
     */
    initModalIn : function(fromView, toView) {},
    
    /**
     * Initialisation of "modal view out" transition.
     * @fromView {unify.view.StaticView?}if view to push out,
     * @toView {unify.view.StaticView?} is view to pull in.
     */
    initModalOut : function(fromView, toView) {},
    
    /**
     * Animate in views from @fromView {unify.view.StaticView?} to @toView {unify.view.StaticView?}
     * in @duration {Integer} milliseconds. After animation is done @callback {Function} is called.
     */
    animateIn : function(fromView, toView, duration, callback) {},
    
    /**
     * Animate out views from @fromView {unify.view.StaticView?} to @toView {unify.view.StaticView?}
     * in @duration {Integer} milliseconds. After animation is done @callback {Function} is called.
     */
    animateOut : function(fromView, toView, duration, callback) {},
    
    /**
     * Animate in modal views from @fromView {unify.view.StaticView?} to @toView {unify.view.StaticView?}
     * in @duration {Integer} milliseconds. After animation is done @callback {Function} is called.
     */
    animateModalIn : function(fromView, toView, duration, callback) {},
    
    /**
     * Animate out modal views from @fromView {unify.view.StaticView?} to @toView {unify.view.StaticView?}
     * in @duration {Integer} milliseconds. After animation is done @callback {Function} is called.
     */
    animateModalOut : function(fromView, toView, duration, callback) {}
  }
});