/*!
  scrollIntent.js
  Version: 1.0
  Author: Ian Lunn
  Author URL: http://ianlunn.co.uk/
  Twitter: https://twitter.com/IanLunn
  GitHub: https://github.com/IanLunn/scrollIntent

  This is a FREE script and is available under a MIT License:
  http://www.opensource.org/licenses/mit-license.php

  scrollIntent.js and its dependencies are
  (c) Ian Lunn Design Limited 2014 unless otherwise stated.
*/

var ScrollIntent = (function () {

	"use strict";

  // Private variables (self is publicly exposed later)
  var self,

      settings = {
        namespace: "scrollIntent",

        // A pixel value to offset the scroll position by
        scrollYOffset: 0,

        // How often the scroll check should occur
        scrollThreshold: 100,

        /*
         * Number of times callbacks should be executed between
         * all specified actions
         */
        callbacksPerActions: undefined,

        /*
         * Reset the number of callbacks allowed per scroll when the scroll
         * direction changes
         */
        resetCallbacksPerActionOnDirectionChange: true,

        // Reset the duration of the scroll event if the scroll direction changes
        resetDurationOnDirectionChange: false,

        /*
         * For development only: if true, waypoint indicators will be added
         * to the document to show where waypoints are
         */
         developerIndicators: false
      },

      /*
       * styleElement, waypointElement, and indicatorElement are used to
       * display the developerIndicators
       */
      styleElement = undefined,
      indicatorElement = undefined,
      waypointElement = [];


  /*
   * Extend object a with the properties of object b.
   * If there's a conflict, object b takes precedence.
   */
  function extend(a, b) {

    for( var i in b ) {
      a[ i ] = b[ i ];
    }

    return a;
  }


  /*
   * Convert a keycode (a number associated with a key) to a keyword
   *
   * @param {Number} keycode - The keycode you wish to have converted to a keyword
   */
  function convertKeycodeToKeyword(keycode) {

    var keycodeToKeyword = {
      32: "space",
      38: "up",
      40: "down"
    };

    var keyword = keycodeToKeyword[keycode];

    if(keyword === undefined) {
      keyword = false;
    }

    return keyword;
  }


  /*
   * Event to be executed when the user finishes resizing the window
   *
   * @param {Function} callback - The function to be executed when resizing ends
   */
  function windowResizeEnd(callback) {

    callback();
  }


  /*
   * Convert developer defined data types to usable values.
   * A developer can either specify a number,
   * string or object, which equate to the following:
   *
   * Number: pixels
   * String: percentage
   *
   * @param {Number, String, Object} dataType
   */
  function convertDataTypeToNumber(dataType) {

    switch(typeof dataType) {

      case "number":
        return dataType;

      // Convert the string percentage to a numeric percentage
      case "string":
        return parseFloat(dataType) / 100;
    }
  }

  /*
   * Cross browser function to return the height of the document
   */
  function getDocumentHeight() {

    var body = document.body,
        html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    return height;
  }


  /*
   * Get an element's height. If the element is window, return
   * window.innerHeight else return element.clientHeight
   */
  function getElementHeight(element) {

    var elementHeight;

    if(element === window) {
      elementHeight = window.innerHeight || document.documentElement.clientHeight;
    }else{
      elementHeight = element.clientHeight;
    }

    return elementHeight;
  }


  /*
   * Compute the waypoint, returning a pixel value including any offset
   *
   * @param {Object} element
   * @param {Number, String} waypoint
   * @param {Object} waypointRelativeTo
   * @param {Object} waypointOffset
   * @param {Object} waypointOffsetRelativeTo
   */
  function computeWaypoint(element, waypoint, waypointRelativeTo, waypointOffset, waypointOffsetRelativeTo) {

    var offsetElement;

    /*
     * If a waypointOffsetRelativeTo element is defined use it, else use the
     * one scrollIntent is attached to
     */
    if(waypointOffsetRelativeTo !== undefined) {
      offsetElement = waypointOffsetRelativeTo;
    }else{
      offsetElement = element;
    }

    /*
     * If the waypoint should be relative to something other than the element
     * scrollIntent is attached to, base the waypoint on the specified element
     * instead
     */
    if(waypointRelativeTo !== undefined) {
      element = waypointRelativeTo;
    }

    // Compute the waypoint based on the waypoint type
    switch(typeof waypoint) {

      case "number":
        var computedWaypoint = waypoint;
      break;

      /*
       * Convert the waypoint to a usable number and calculate the waypoints
       * pixel value relative to the percentage of the element
       */
      case "string":
        var convertedWaypoint = convertDataTypeToNumber(waypoint);
        var computedWaypoint = getElementHeight(element) * convertedWaypoint;
    }

    // If using an offset convert it to a usable number
    if(waypointOffset !== undefined) {

      switch(typeof waypointOffset) {

        case "number":
          computedWaypoint = computedWaypoint + waypointOffset;
        break;

        case "string":
          var convertedWaypointOffset = convertDataTypeToNumber(waypointOffset);
          computedWaypoint = computedWaypoint + (getElementHeight(offsetElement) * convertedWaypointOffset);
      }
    }

    return computedWaypoint;
  }


  /*
   * Determine if a string is within an array (used for querying scrollMethod)
   *
   * @param {Anything} value - A value to search for within the array
   * @param {Array} array - The array to search within
   * @param {Number} i - The index of the array at which to begin the search. The default is 0, which will search the whole array.
   */
  function inArray(value, array, i) {
    var len;
    if(array) {

      if(array.indexOf) {
        return array.indexOf.call(array, value, i);
      }

      len = array.length;
      i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

      for(;i < len; i++) {
        // Skip accessing in sparse arrays
        if(i in array && array[i] === value) {
          return i;
        }
      }
    }
    return -1;
  }


  /*
   * Cross Browser helper to addEventListener (https://gist.github.com/eduardocereto/955642)
   *
   * @param {HTMLElement} obj The Element to attach event to.
   * @param {string} evt The event that will trigger the binded function.
   * @param {function(event)} fnc The function to bind to the element.
   * @return {boolean} true if it was successfuly binded.
   */
  function cb_addEventListener(obj, evt, fnc) {

    // W3C model
    if(obj.addEventListener) {
        obj.addEventListener(evt, fnc, false);
        return true;
    }

    // Microsoft model
    else if(obj.attachEvent) {
        return obj.attachEvent("on" + evt, fnc);
    }

    // Browser don't support W3C or MSFT model, go on with traditional
    else {
        evt = "on"+evt;
        if(typeof obj[evt] === "function") {

            // Object already has a function on traditional
            // Let's wrap it with our own function inside another function
            fnc = (function(f1,f2) {
                return function() {
                    f1.apply(this,arguments);
                    f2.apply(this,arguments);
                }
            })(obj[evt], fnc);
        }
        obj[evt] = fnc;
        return true;
    }
    return false;
  }


  /*
   * Constructor
   */
  ScrollIntent = function (element, actions, options) {

    // Public Variables
    self = this;
    self.element = element;
    self.actions = actions;

    // Public Methods
    self.initComplete = function() {};
    self.scrolling = function() {};
    self.scrollingStopped = function() {};

    /* If the action is not an array put it in one for easier management
     * of future code
     */
    if(!(actions instanceof Array)) {
      self.actions = [actions];
    }

    // Merge the developer's options with the defaults
    self.settings = extend(settings, options);

    // Count the number of actions
    self.numberOfActions = (self.actions.length === undefined) ? 1 : self.actions.length;

    //the Y position of the scrollbar (number)
    self.scrollY = undefined;

    //the previous Y position of the scrollbar (number)
    self.scrollYPrev = undefined;

    //true if the element is currently scrolling
    self.isScrolling = false;

    //the direction of scrolling ("up/down")
    self.direction = undefined;

    self.scrollYStart = 0;
    self.scrollAmount = 0;
    self.keyPressesPerEvent = 0;

    // Start scrollIntent
    self.init();
  };

  /*
   * Compute the scrollYOffset into a pixel value
   *
   * The scrollYOffset can be specified as either a number or string,
   * a number such as 900 represents pixels (900px), a string such as "90%",
   * represents 90% of the element height
   */
  function computeScrollYOffset() {

    var computedScrollYOffset;
    var convertedScrollYOffset;

    // Compute the scrollYOffset
    switch(typeof settings.scrollYOffset) {

      case "number":
        computedScrollYOffset = settings.scrollYOffset;
      break;

      case "string":

        // Convert the waypoint to a usable number
        convertedScrollYOffset = convertDataTypeToNumber(self.settings.scrollYOffset);

        /*
         * Calculate the waypoints pixel value relative to the
         * percentage of the element
         */
        computedScrollYOffset = getElementHeight(self.element) * convertedScrollYOffset;
      break;
    }

    return computedScrollYOffset;
  }


  /*
   * Get the Y position of an element's scroll bar (getting the window is
   * different to other elements)
   */
  function getScrollY(element, computedScrollYOffset) {

    var scrollY,
        windowScrollTop;

    if(element === window) {

      // Get the window's scrollTop position (cross browser friendly)
      windowScrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
      scrollY = windowScrollTop + computedScrollYOffset;
    }else{
      scrollY = element.scrollTop + computedScrollYOffset;
    }

    // IE8 fix. Stop IE8 from returning NaN.
    if(isNaN(scrollY) === true) {
      scrollY = 0;
    }

    return scrollY;
  }


  /*
   * Initiate scrollIntent :)
   */
	ScrollIntent.prototype.init = function () {

    var self = this;

    // Compute the scrollYOffset
    self.computedScrollYOffset = computeScrollYOffset();

    //get the initial scrollY position
    self.scrollY = getScrollY(self.element, self.computedScrollYOffset);

    /*
     * Set up each action by computing the waypoint and putting the
     * scrollMethod into an array
     */
    self.setUpActions();

    // Set up waypoint indicators for development
    self.setupDeveloperIndicators(true, true);

    // When the element scrolls...
    self.element.onscroll = function(e) {

      self.scrollY = getScrollY(self.element, self.computedScrollYOffset);

      // The user is now scrolling, get the time they started scrolling
      if(self.isScrolling === false) {

        self.isScrolling = true;
        self.scrollYStart = self.scrollYPrev;
        self.startTime = +new Date();

        /* If no scrollMethod was defined via an event,
         * assume the user is using the scrollbar
         */
        if(self.scrollMethod === undefined) {
          self.scrollMethod = "scrollbar";
        }

        /*
         * Start a timer to keep checking to determine whether the user is
         * scrolling or has stopped scrolling and update the scrollYPrev
         */
        self.scrollCheckTimer = setInterval(function() {

          if(self.scrollY === self.scrollYPrev) {
            self.stopScrollCheck();
          }else{
            self.whenScrolling();
          }

          self.scrollYPrev = self.scrollY;
        }, self.settings.scrollThreshold);
      }
    }

    // Mousewheel event for most modern browsers
    cb_addEventListener(self.element, "mousewheel", function(e) {
      self.scrollMethod = "mousewheel";
    });

    // Mousewheel event for Firefox
    cb_addEventListener(self.element, "DOMMouseScroll", function(e) {
      self.scrollMethod = "mousewheel";
    });

    // Mousewheel for oldIE
    cb_addEventListener(window, "onmousewheel", function(e) {
      self.scrollMethod = "mousewheel";
    });

    cb_addEventListener(self.element, "mousedown", function(e) {
      self.mousedown = true;
    });

    cb_addEventListener(self.element, "mouseup", function(e) {
      self.mousedown = false;
    });

    // When a key is pressed down, find out which one and how many times
    cb_addEventListener(self.element, "keydown", function(e) {
      e = e || window.event;
      var charCode = e.charCode || e.keyCode;

      self.scrollMethod = convertKeycodeToKeyword(charCode);
      self.keyPressesPerEvent++;
    });

    /*
     * When window resizing ends recompute the waypoint, scrollYOffset and
     * reset the indicators for each action
     */
    window.onresize = function() {

      if(this.resizeTO) {
        clearTimeout(this.resizeTO);
      }

      this.resizeTO = setTimeout(function() {

          windowResizeEnd(function() {

            for(var i = 0; i < self.numberOfActions; i++) {

              var action = self.actions[i];
              action.computedWaypoint = computeWaypoint(self.element, action.waypoint, action.waypointRelativeTo, action.waypointOffset, action.waypointOffsetRelativeTo);
            }

            // Recompute the scrollYOffset
            self.computedScrollYOffset = computeScrollYOffset();

            /*
             * Adjust the developer indicators based on the new waypoint
             * and scrollYOffset
             */
            self.setupDeveloperIndicators(true, true);
          });
      }, 200);
    }

    // Callback
    self.initComplete(self);

    return false;
	}


  /*
   * Destroy scrollIntent :(
   */
  ScrollIntent.prototype.destroy = function() {

    //TODO

    return false;
  }


  /*
   * For each action, check all of the defined conditions to determine if the
   * action should be executed
   */
  ScrollIntent.prototype.checkConditions = function() {

    var self = this;

    for(var i = 0; i < self.numberOfActions; i++) {

      var action = self.actions[i];

      // Reset the number of waypoints if the waypoint changed position
      if(action.computedWaypoint !== action.previousComputedWaypoint) {
        action.noOfWaypointsTriggered = 0;
      }

      // Work out the duration of scrolling up to this point
      self.nowTime = +new Date();
      self.currentScrollDuration = self.nowTime - self.startTime;

      /*
       * Work out if the user has just crossed a waypoint
       */
      if(action.computedWaypoint !== undefined) {

        if(self.scrollY > action.computedWaypoint) {

          // The user just scrolled DOWN over the waypoint
          action.waypointPassed = (action.afterWaypoint === false) ? true:false;

          // The scroll position is now after/below the waypoint
          action.afterWaypoint = true;
        }else{

          // The user just scrolled UP over the waypoint
          action.waypointPassed = (action.afterWaypoint === true) ? true:false;

          // The scroll position is before/above the waypoint
          action.afterWaypoint = false;
        }
      }

      // If a condition isn't met, continue to the next loop iteration
      if(

        // Direction
        (action.direction !== undefined && self.direction !== action.direction)

        // Callbacks per scroll
        || (action.callbacksPerAction !== undefined && action.noOfCallbacksTriggered > action.callbacksPerAction)

        // Minimum speed
        || (action.minSpeed !== undefined && (self.scrollAmount <= action.minSpeed))

        // Maximum speed
        || (action.maxSpeed !== undefined && (self.scrollAmount > action.maxSpeed))

        // Waypoint
        || (action.computedWaypoint !== undefined

            && (action.waypointPassed === false

              // Prevent a waypoint when an ancor is clicked
              || (self.scrollAmount === 0 && self.scrollMethod === "scrollbar")
            )
          )

        // Minimum wayPoint
        || (action.minWaypoint !== undefined && self.scrollY < action.minWaypoint)

        // Maximum wayPoint
        || (action.maxWaypoint !== undefined && self.scrollY > action.maxWaypoint)

        // Scroll method
        || (action.scrollMethod !== undefined && inArray(self.scrollMethod, action.scrollMethod) === -1)

        // Key presses per event
        || (action.keyPressesPerEvent !== undefined && self.keyPressesPerEvent !== action.keyPressesPerEvent)

        // Minimum duration
        || (action.minDuration !== undefined && self.currentScrollDuration < action.minDuration)

        // Maximum duration
        || (action.maxDuration !== undefined && self.currentScrollDuration > action.maxDuration)

        // Custom conditions
        || (action.custom !== undefined && action.custom(self) !== true)
       ) {
        continue;
      }

      // Conditions met!

      // The waypoint is now the previous waypoint
      action.previousComputedWaypoint = action.computedWaypoint;

      // Run the callback for the action that was met
      action.callback(self);

      // Increase the number of callbacks that were triggered in this action
      action.noOfCallbacksTriggered++;
      action.noOfWaypointsTriggered = 1;

      // Recompute the waypoint into a pixel value
      action.computedWaypoint = computeWaypoint(self.element, action.waypoint, action.waypointRelativeTo, action.waypointOffset, action.waypointOffsetRelativeTo);

      // Recompute the scrollYOffset
      self.computedScrollYOffset = computeScrollYOffset();

      // Adjust the developer indicators based on the new waypoint and scrollYOffset
      self.setupDeveloperIndicators(true, true);
    }

    return false;
  }


  /*
   * Functionality to be executed whilst the user is scrolling,
   * every x amount of milliseconds, as defined by the scrollThreshold setting
   */
  ScrollIntent.prototype.whenScrolling = function() {

    var self = this;

    // Determine scroll direction
    self.newDirection = (self.scrollY > self.scrollYPrev) ? "down": "up";

    /*
     * if there was a previous scrollY position (the user was already scrolling)
     * recompute the waypoint and scrollYOffset, then setup developer indicators
     */
    if(self.scrollYPrev !== undefined) {

      for(var i = 0; i < self.numberOfActions; i++) {

        var action = self.actions[i];

        action.computedWaypoint = computeWaypoint(self.element, action.waypoint, action.waypointRelativeTo, action.waypointOffset, action.waypointOffsetRelativeTo);

        // Recompute the scrollYOffset
        self.computedScrollYOffset = computeScrollYOffset();

        // Adjust the developer indicators based on the new waypoint and scrollYOffset
        self.setupDeveloperIndicators(true, true);
      }

      /*
       * If the user changed direction during scrolling, reset
       * callbacksPerAction and startTime if defined in the settings
       */
      if(self.direction !== self.newDirection) {
        if(self.settings.resetCallbacksPerActionOnDirectionChange === true) {

          for(var i = 0; i < self.numberOfActions; i++) {
            self.actions[i].noOfCallbacksTriggered = 1;
            self.actions[i].noOfWaypointsTriggered = 0;
          }

          self.scrollYStart = self.scrollYPrev;
        }

        if(self.settings.resetDurationOnDirectionChange === true) {
          self.startTime = +new Date();
        }
      }

      // The new direction is now the old direction
      self.direction = self.newDirection;

      // Check to see if conditions are being met
      self.checkConditions();

      // How much has the user scrolled since the last check?
      self.scrollAmount = Math.round(Math.abs(self.scrollY - self.scrollYPrev));
    }

    // Callback
    self.scrolling(self);

    return false;
  }


  /*
   * To be executed when the user stops scrolling
   *
   * stop the scroll check timer,
   * reset the scrollAmount, scrollMethod, and number of keyPressesPerEvent
   * reset the noOfCallbacksTriggered and noOfWaypointsTrigger for each action
   *
   */
  ScrollIntent.prototype.stopScrollCheck = function() {

    var self = this;

    clearInterval(self.scrollCheckTimer);
    self.isScrolling = false;
    self.scrollAmount = 0;
    self.scrollMethod = undefined;
    self.keyPressesPerEvent = 0;

    for(var i = 0; i < self.numberOfActions; i++) {

      var action = self.actions[i];

      action.noOfCallbacksTriggered = 1;
      action.noOfWaypointsTriggered = 0;
    }

    // Callback
    self.scrollingStopped(self);

    return false;
  }


  /*
   * Set up waypoint and scrollY indicators (lines on the page that show where
   * waypoints are) if specified in settings - FOR DEVELOPMENT ONLY
   *
   * @param {Boolean} showWaypoint - show waypoint positions (red)
   * @param {Boolean} showScrollOffset - show the scrollOffset position (blue)
   *
   * TODO: make developer indicators available for minWaypoint and maxWaypoint
   *
   */
   ScrollIntent.prototype.setupDeveloperIndicators = function (showWaypoint, showScrollOffset) {

    var self = this;

    // If using indicators for development and they are yet to be set...
    if(settings.developerIndicators === true) {

      var waypointStyles = "";
      var scrollYStyles = "";

      // Remove any previous indicator styles
      if(styleElement !== undefined) {
        styleElement.parentNode.removeChild(styleElement);
      }

      // If showing waypoint indicators...
      if(showWaypoint === true) {

        // Remove existing indicators
        if(waypointElement.length !== 0) {

          // Count the number of previous waypoint elements
          var numberOfWaypointElements = waypointElement.length;

          // Remove each waypoint element
          for(var i = 0; i < numberOfWaypointElements; i++) {
            waypointElement[i].parentNode.removeChild(waypointElement[i]);
          }
        }

        // Add waypoint indicators for each action
        for(var i = 0; i < self.numberOfActions; i++) {

          //don't set up a waypoint if one isn't defined
          if(self.actions[i].computedWaypoint === undefined) {
            continue;
          }

          var friendlyI = i + 1;

          // Set up the waypoint styles
          waypointStyles += '.' + settings.namespace + '-waypoint'+friendlyI+'{position: absolute; z-index: 99999; top:'+self.actions[i].computedWaypoint+'px; border: red solid 2px; left: 0; right: 0;}.' + self.settings.namespace + '-waypoint'+friendlyI+':after{position: absolute; top: 0; text-align: center; width: 200px; height: 20px; content: "ScrollIntent: Waypoint '+(friendlyI)+'"; background: black; background: rgba(0,0,0,.8); color: white; padding: 12px; left: 20px; border: none;}';

          // Create the waypoint
          waypointElement[i] = document.createElement("div");
          waypointElement[i].className = self.settings.namespace + "-waypoint" + friendlyI + " " + self.settings.namespace + "-indicator";

          // Add the waypoint to the body
          document.body.appendChild(waypointElement[i]);
        }
      }

      // If showing scroll offset indicator...
      if(showScrollOffset === true) {

        scrollYStyles = '.' + self.settings.namespace + '-scrolly{position: fixed; z-index: 99999; top: '+self.computedScrollYOffset+'px; border: blue solid 2px; left: 0; right: 0;}';


        // Remove existing indicators
        if(indicatorElement !== undefined) {
          indicatorElement.parentNode.removeChild(indicatorElement);
        }

        // Create the indicator
        indicatorElement = document.createElement("div");
        indicatorElement.className = self.settings.namespace + "-scrolly " + self.settings.namespace + "-indicator";

        // Add the indicator to the body
        document.body.appendChild(indicatorElement);
      }

      // Create a <style> for the waypoint and indicator styles
      styleElement = document.createElement("style");
      var css = waypointStyles + scrollYStyles;
      styleElement.className = self.settings.namespace + "-indicator-styles";

      // Add the waypoint and indicator styles
      styleElement.type = "text/css";
      if(styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css;
      }else{
        styleElement.appendChild(document.createTextNode(css));
      }

      // Get the <head> and append the styles in it
      var head = document.head || document.getElementsByTagName("head")[0];
      head.appendChild(styleElement);
    }

    return false;
  }


  /*
   * Set up each action by computing the waypoint and putting the
   * scrollMethod into an array
   */
  ScrollIntent.prototype.setUpActions = function () {

    var self = this;

    for(var i = 0; i < self.numberOfActions; i++) {

      var action = self.actions[i];

      action.noOfCallbacksTriggered = 0;
      action.noOfWaypointsTriggered = 0;

      action.computedWaypoint = computeWaypoint(self.element, action.waypoint, action.waypointRelativeTo, action.waypointOffset, action.waypointOffsetRelativeTo);

      // Is the scroll position before or after waypoints?
      action.afterWaypoint = (self.scrollY > action.computedWaypoint) ? true : false;

      if(action.scrollMethod !== undefined && !(action.scrollMethod instanceof Array)) {
        action.scrollMethod = [action.scrollMethod];
      }
    }

    return false;
  }

	return ScrollIntent;
})();
