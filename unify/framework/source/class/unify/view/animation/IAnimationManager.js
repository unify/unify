/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Interface for animation manager that handles view transitions. This is used
 * in unify.Application#getViewAnimationManager
 */
core.Interface("unify.view.animation.IAnimationManager", {
  members : {
    /**
     * Initialisation of view in transition
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     */
    initIn : function(fromView, toView) {},
    
    /**
     * Initialisation of view out transition
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     */
    initOut : function(fromView, toView) {},
    
    /**
     * Initialisation of modal view in transition
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     */
    initModalIn : function(fromView, toView) {},
    
    /**
     * Initialisation of modal view out transition
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     */
    initModalOut : function(fromView, toView) {},
    
    /**
     * Animate in views from fromView to toView
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     * @param duration {Integer} Duration of animation in milliseconds
     * @param callback {Function?null} Call back function called after animation is done
     */
    animateIn : function(fromView, toView, duration, callback) {},
    
    /**
     * Animate out views from fromView to toView
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     * @param duration {Integer} Duration of animation in milliseconds
     * @param callback {Function?null} Call back function called after animation is done
     */
    animateOut : function(fromView, toView, duration, callback) {},
    
    /**
     * Modal animate in views from fromView to toView
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     * @param duration {Integer} Duration of animation in milliseconds
     * @param callback {Function?null} Call back function called after animation is done
     */
    animateModalIn : function(fromView, toView, duration, callback) {},
    
    /**
     * Modal animate out views from fromView to toView
     *
     * @param fromView {unify.view.StaticView?null} View to push out
     * @param toView {unify.view.StaticView?null} View to pull in
     * @param duration {Integer} Duration of animation in milliseconds
     * @param callback {Function?null} Call back function called after animation is done
     */
    animateModalOut : function(fromView, toView, duration, callback) {}
  }
});