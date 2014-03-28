#Documentation

##What is scrollIntent.js?

With scrollIntent, you can determine what a user intends to achieve based on the way they are scrolling, triggering functionality specific to that behaviour. This can make for a more intuitive and optimized experience for the user.

Example uses:

- [A Step Toward Better Infinite Scrolling](#a-step-toward-better-infinite-scrolling)
- [Offer Immediate Navigation when the User Needs it](#offer-immediate-navigation-when-the-user-needs-it)

### A Step Toward Better Infinite Scrolling

On a page with infinite scrolling, if the user is scrolling down slowly, we can assume they are focused on the content and continue loading more content as they scroll. However, when the user scrolls down too fast to be focused on content, we can then stop loading content and instead, allow the user to naturally reach the page's end. Infinite scrolling with a footer -- the best of both worlds!

### Offer Immediate Navigation when the User Needs it

As with the infinite scrolling example, if a user starts scrolling over a certain speed, we can assume they are no longer interested in the content and instead want to navigate elsewhere. Rather than make the user scroll all the way to the top/bottom of the page to reach navigation, we can show that navigation via CSS/jQuery sooner.

## How scrollIntent Works

scrollIntent monitors the scrolling behaviour of a user to allow you to execute functionality specific to that behaviour.

When a user begins scrolling, scrollIntent will determine attributes of scrolling, such as the direction, speed, method of scrolling and so on. These attributes can then be queried by a developer to determine when a function specific to a certain behaviour should be executed.

## Using scrollIntent

scrollIntent is a standalone JavaScript plugin that can be initiated on multiple elements.

  ```javascript
  new scrollIntent(element, actions, options);
  ```

As shown in this code example, scrollIntent must be passed an element to be attached to and a set of [actions](#actions). You may also specify [options](#options) which will override scrollIntent's default settings.

[Actions](#actions) are a combination of conditions and a callback -- a function to be executed when the specified conditions are met. More on [actions](#actions) shortly.

### Including scrollIntent on a web page

For best results, scrollIntent should be placed at the bottom of a HTML page, just before the closing `</body>` element. This will ensure scrollIntent loads when the page is ready.

  ```javascript

  <script src="js/scrollIntent.js"></script>
  <script>
    var actions = {
      //your actions here
    };

    var options = {
      //your options here
    }

    new ScrollIntent(window, actions, options);
  </script>
  ```

In this code example, the scrollIntent plugin is referenced and then an instance of scrollIntent is attached to `window`. By attaching to `window`, you will be able to query a user's actions when they begin scrolling the main window of a web page.

scrollIntent.js can be attached to other scrollable elements, such as `<div id="test">`, like so:

  ```javascript
  var testElement = document.getElementById("test");

  new ScrollIntent(testElement, actions, options);
  ```

Multiple instances of scrollIntent can be initiated like so:

  ```javascript
  var testElement = document.getElementById("test");

  var windowActions = {
    //actions for the window element
  }

  var testElementActions = {
    //actions for <div id="test"></div>
  }

  new ScrollIntent(window, windowActions);
  new ScrollIntent(testElement, testElementActions);
  ```

With scrollIntent attached to an element(s), you can then specify [actions](#actions), which consist of a callback and the conditions that need to be met before the callback is executed.

### Actions

Actions consist of:

- [a callback](#callback) - a function to be executed when conditions are met
- [conditions](#conditions) - describe the user's behaviours required for the callback to be executed
- [action modifiers](#action-modifiers) - options that change the way in which actions work

#### callback

`function(scrollIntent)`

`callback` is a function which is executed once all defined conditions are met.

  ```javascript
  var actions = {
    direction: "down",
    callbacksPerAction: 1,
    callback: function(scrollIntent) {
      alert("condition met!");
    }
  }
  ```

In the above example, the callback will show a message when the user scrolls down (`direction: down`). An action modifier is used (`callbacksPerAction: 1`) to make the callback execute only once each time the user carries out this action.

The callback is passed `scrollIntent`, which can be used to retrieve scrollIntent's [public variables](#public-variables-and-methods).

#### Conditions
Conditions describe the behaviour of the user required to execute the [callback](#callback).

The following describes each condition.

#####direction

`string`: `"up"` or `"down"`

The direction in which the scrollbar is moving.

#####minDuration

`number`: A number representing milliseconds. `1000` is 1000 milliseconds (1 second)

The minimum duration of time the user must scroll before the condition is true.

#####maxDuration

`number`: A number representing milliseconds. `1000` is 1000 milliseconds (1 second)

The maximum duration of time the user must scroll before the condition is false.

#####waypoint

`number` or `string`

Example: `900` or `"50%"`

A specific value the scrollbar position should reach for the condition to be true.

The scrollbar position is publicly available as `scrollY` and by default is at the top of the viewport, meaning a waypoint must pass the top of the viewport for it to execute a callback. The `scrollY` position can be changed using the `scrollYOffset` in `options`.

Note that when the scrollbar reaches the `computedWaypoint` ([explained here](#computed-waypoint)), the callback will be triggered once, until the waypoint is passed again -- meaning the `callbacksPerAction` action modifier has no affect on this condition (only one callback can be triggered per action).

Number: A pixel value, `900` equates to 900px.

String: A percentage value, `"50%"` equates to 50% of the height of the element scrollIntent is attached to. When using percentage values within a string, using the `%` identifier is optional - `"50%"` and `"50"` both represent 50% providing the values are within a string. Should you wish for the percentage to be relative to a different element, see the `waypointRelativeTo` action modifier.

Tip: Set `developerIndicators` to `true` in your scrollIntent options during development for a visual representation of `waypoint`.


#####minWaypoint

`number` or `string`

Example: `900` or `"50%"`

A specific value the scrollbar position should be equal to or greater for the condition to be true.

Number: A pixel value, `900` equates to 900px.

String: A percentage value, `"50%"` equates to 50% of the height of the element scrollIntent is bound to. When using percentage values within a string, using the `%` identifier is optional - `"50%"` and `"50"` both represent 50% providing the values are within a string. Should you wish for the percentage to be relative to a different element, see the `waypointRelativeTo` action modifier.


#####maxWaypoint

`number` or `string`

Example: `900` or `"50%"`

A specific value the scrollbar position should be equal to or less than for the condition to be true.

Number: A pixel value, `900` equates to 900px.

String: A percentage value, `"50%"` equates to 50% of the height of the element scrollIntent is bound to. When using percentage values within a string, using the `%` identifier is optional - `"50%"` and `"50"` both represent 50% providing the values are within a string. Should you wish for the percentage to be relative to a different element, see the `waypointRelativeTo` action modifier.


#####minSpeed

`number`

Example: `100`

The minimum amount of pixels the user needs to be scrolling within the `scrollThreshold` ([see scrollThreshold option](#scrollthreshold)), as defined in scrollIntent's settings. The default can be overridden in `options` ([see Options](#options)).

By default, `scrollThreshold` is 250 milliseconds, so specifying `minSpeed: 100` would mean the user must be scrolling at least 100px in 250 milliseconds for the condition to be true.


#####maxSpeed

`number`

Example: `100`

The maximum amount of pixels the user must be scrolling within the `scrollThreshold` ([see scrollThreshold option](#scrollthreshold)), as defined in scrollIntent's settings. The default can be overridden in `options` ([see Options](#options)).

By default, `scrollThreshold` is 250 milliseconds, so specifying `maxSpeed: 100` would mean the user must be scrolling at most 100px in 250 milliseconds for the condition to be true.

#####custom

`function(scrollIntent)`

A custom function that must return `true` or `false`. If `true` is returned, the custom condition will be met.

  ```javascript
  custom: function(scrollIntent) {

    //my custom function
    if(1 + 1 === 2) {
      return true;
    }
  },
  ```

In the above example, the `custom` function will always return true.

The custom function is passed `scrollIntent`, which can be used to retrieve scrollIntent's [public variables](#public-variables-and-methods).

#### Action Modifiers

Action modifiers change the way in which an `action` behaves.

#####callbacksPerAction

`number`

Modifies: `callback`

The amount of times `callback` should be executed during the action.

  ```javascript
  var actions = {
    direction: 'down',
    callback: function() {
      console.log('scrolling down');
    }
  }

  new ScrollIntent(window, actions);
  ```

In the above example, the console will show a message when the user is scrolling down, and will do so for every 250 milliseconds the user scrolls, as defined by the `scrollThreshold` option.

Using the `callbacksPerAction` action modifier, you could have this message show in the console only once per action (each time the user completes the action of scrolling, then stopping), like so:

  ```javascript
  var actions = {
    direction: 'down',
    callbacksPerAction: 1,
    callback: function() {
      console.log('scrolling down');
    }
  }

  new ScrollIntent(window, actions);
  ```

#####waypointRelativeTo

`element`

Modifies: `waypoint`, `minWaypoint`, and `maxWaypoint`  
Default: The element scrollIntent is attached to

By default, the waypoint is relative to the element scrollIntent is attached to. If scrollIntent is attached to and thus detecting the scroll event on `window` but you want the waypoint to be relative to `document.body`, use this modifier.

In the following example, the callback will trigger when the scrollbar position reaches 90% of the window/viewport height.

  ```javascript
  actions = {
    waypoint: "90%",
    callback: function() {
      console.log("The scrollbar is now at 90% of the window height");
    }
  }

  new ScrollIntent(window, actions);
  ```

Should you wish for the waypoint to instead be 90% of the body/document height, use the `waypointRelativeTo` action modifier, like so:

  ```javascript
  actions = {
    waypoint: "90%",
    waypointRelativeTo: document.body,
    callback: function() {
      console.log("The scrollbar is now at 90% of the body height");
    }
  }

  new ScrollIntent(window, actions);
  ```

Tip: Set `developerIndicators` to `true` in `options` during development for a visual representation of `waypoint`.


#####waypointOffset

`number` or `string`

Example: `900` or `"50%"`  
Modifies: `waypoint`, `minWaypoint`, and `maxWaypoint`

A value the `waypoint` condition should be offset by.

When using `waypoint`, without a `waypointOffset`, the computed `waypoint` will only be true when it reaches the top of the viewport. In the following example, the computed waypoint will be 200px + 50% of the height of the element that scrollIntent is attached to (in this case, `window`). Meaning when the user scrolls down 200px, they will then need to scroll half the height of their browser window/viewport before the condition is met.

  ```javascript
  var actions = {
    waypoint: 200,
    waypointOffset: "50%",
    callback: function() {
      console.log("waypoint reached!");
    }
  };

  new ScrollIntent(window, actions);
  ```

Number: A pixel value, `900` equates to 900px.

String: A percentage value, `"50%"` equates to 50% of the height of the element scrollIntent is bound to. When using percentage values within a string, using the `%` indentifier is optional - `"50%"` and `"50"` both represent 50% providing the values are within a string.

Tip: Set `developerIndicators` to `true` in `options` during development for a visual representation of `waypoint`.

#####waypointOffsetRelativeTo

`element`

Modifies: `waypoint`, `minWaypoint`, and `maxWaypoint`

By default, `waypointOffset` is relative to the element scrollIntent is attached to. If scrollIntent is attached to and thus detecting the scroll event on `window` but you want the `waypointOffset` to be relative to `document.body`, use this modifier.

In the `waypointOffset` example, you saw that the computed waypoint will be 200px + 50% of the height of the window, like so:

  ```javascript
  var actions = {
    waypoint: 200,
    waypointOffset: "50%",
    callback: function() {
      console.log("waypoint reached!");
    }
  };

  new ScrollIntent(window, actions);
  ```

Should you wish for the `waypointOffset` to be instead relative to `document.body`, use the following:

  ```javascript
  var actions = {
    waypoint: 200,
    waypointOffset: "50%",
    waypointOffsetRelativeTo: document.body,
    callback: function() {
      console.log("waypoint reached!");
    }
  };

  new ScrollIntent(window, actions);
  ```

The user will now need to scroll 200px plus, 50% of the page height (200px over the center of the document).

#####destroyAfterNoOfCallbacks (TODO)

`number`

**NOT YET IMPLEMENTED**

When a certain number of callbacks have been executed, the action will be destroyed so it can no longer execute.

### Multiple Actions Per Element

ScrollIntent supports multiple actions per element, simply by placing each `action` object within an array, like so:

  ```javascript
  var actions = [
    {
      direction: "down",
      callbacksPerAction: 1,
      callback: hideMenu()
    },
    {
      direction: "up",
      callbacksPerAction: 1,
      callback: showMenu()
    }
  ];

  new ScrollIntent(window, actions);
  ```

In this example, when the user scrolls down, the `hideMenu` function will be executed, and when scrolling up, the `showMenu` function will be texecuted.


### Options

Options allow you to change the way in which scrollIntent operates. All of scrollIntent's options are already set by default so you don't need to specify your own options. Should you need to override a default option though, does so via the following options.

#### scrollYOffset

`number` or `string`

Default: `0` (the top of the viewport)  
Example: `50` or `"90%"`

A value the vertical scroll position should be offset by.

Number: A pixel value, `50` equates to 50px.

String: A percentage value, `"90%"` equates to 90% of the height of the viewport. When using percentage values within a string, using the `%` indentifier is optional - `"50%"` and `"50"` both represent 50% providing the values are within a string.


#### scrollThreshold

`number`

Default: `250` (milliseconds)

The amount of time between condition checks whilst the user is scrolling.

To keep the performance of a web page optimal, the number of condition checks are throttled whilst the user is scrolling. By default, when the user begins scrolling, scrollIntent will check whether conditions are true every 250 milliseconds, if they are, a callback will be executed. Thus, a callback can only be triggered at most every 250 milliseconds.

A callback only being able to execute every 250 milliseconds may seem a little too slow -- depending on your use for scrollIntent. If that's the case, the `scrollThreshold` can be reduced. Note that care should be taken to ensure a balance between responsive callbacks and page peformance.

####resetCallbacksPerActionOnDirectionChange

`true` or `false`

Default: `true`

Reset the number of callbacks allowed per action when the scroll direction changes.

The `callbacksPerAction` action modifier will be reset when the user changes scroll direction.

####resetDurationOnDirectionChange

`true` or `false`

Default: `false`

Reset the duration of the scroll event if the scroll direction changes.

When using the `minDuration` and/or `maxDuration` conditions, the duration will be reset when the user changes scroll direction.

#### developerIndicators

`true` or `false`

Default: `false`

Set `developerIndicators` to `true` in `options` during development for a visual representation of the scroll position (a blue line), as well as an indicator for a `waypoint`. Used for development purposes only.

Currently only displays when scrollIntent is attached to `window`.


### Public Variables and Methods

The following variables and methods are available publicly:

#### `actions`

Contains your defined actions, including the `computedWaypoint`.

The `computedWaypoint` is the final pixel value based on the `waypoint`/`minWaypoint`/`maxWaypoint`, `waypointOffset`, and `waypointRelativeTo` conditions and action modifiers.

Assuming `waypoint` is given a value of `"50%"`, `waypointRelativeTo` has the value of `window`, and the window has a height of 600px, the `computedWaypoint` will be `300` = `windowHeight * .5`. If `waypointOffset` is specified with a value of `10`, the `computedWaypoint` will be `310` = `(windowHeight * .5) + 10`, and so on.


#### `computedScrollYOffset`

The `computedScrollYOffset` is the number of pixels the `scrollY` should be offset by.

Assuming the `scrollYOffset` option is given a value of `"50%"`, and the window has a height of 600px, the `computedScrollYOffset` will be `300` = `windowHeight * .5`.

#### `currentScrollDuration`

The amount of time in milliseconds that the user has been scrolling for.

#### `direction`

The direction the user is scrolling. `"up"` or `"down"`.

#### `element`

The element scrollIntent is attached to.

#### `isScrolling`

Whether the user is currently scrolling or not. `true` or `false`.

#### `nowTime`

The time of the last condition check in milliseconds.

#### `numberOfActions`

The number of actions specified.

#### `scrollAmount`

How far the user has scrolled since the last condition check.

#### `scrollMethod`

The method being used to scroll.

#### `scrollY`

The position of the scrollbar, including any `computedScrollYOffset`.

Without a `computedScrollYOffset`, the initiate `scrollY` will be `0`. If the user scrolls 100px, it will then be `100`, and so on.

The `scrollY` is represented as a blue line when `developerIndicators` is set to `true` in `options`.

#### `scrollYPrev`

The previous position of the scrollbar (used to determine distance by comparing current and previous scrollY positions).

#### `scrollYStart`

The position on the scrollbar at which an action began.

#### `settings`

scrollIntent's default `settings`, with any overridden with your own specified `options`.

#### `startTime`

The time an action began.

#### `initComplete(scrollIntent)`

A function that is executed when initiation of scrollIntent is complete.

#### `scrolling(scrollIntent)`

A function that is executed whilst the user is scrolling. This function is throttled according to the `scrollThreshold` option.

#### `scrollingStopped(scrollIntent)`

A function that is executed once the user has stopped scrolling.
