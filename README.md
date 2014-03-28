# scrollIntent

With scrollIntent, you can determine what a user intends to achieve based on the way they are scrolling, triggering functionality specific to that behaviour. This can make for a more intuitive and optimised experience for the user.

Example uses:

- [A Step Toward Better Infinite Scrolling](#a-step-toward-better-infinite-scrolling)
- [Offer Immediate Navigation when the User Needs it](#offer-immediate-navigation-when-the-user-needs-it)

[Read the article](http://ianlunn.co.uk/articles/experimenting-custom-functionality-appropriate-users-scrolling-behaviour/) that describes some uses for scrollIntent - [Experimenting with Custom Functionality Appropriate to a User’s Scrolling Behaviour](http://ianlunn.co.uk/articles/experimenting-custom-functionality-appropriate-users-scrolling-behaviour/)

### A Step Toward Better Infinite Scrolling

On a page with infinite scrolling, if the user is scrolling down slowly, we can assume they are focused on the content and continue loading more content as they scroll. However, when the user scrolls down too fast to be focused on content, we can then stop loading content and instead, allow the user to naturally reach the page's end. Infinite scrolling with a footer -- the best of both worlds!

### Offer Immediate Navigation when the User Needs it

As with the infinite scrolling example, if a user starts scrolling over a certain speed, we can assume they are no longer interested in the content and instead want to navigate elsewhere. Rather than make the user scroll all the way to the top/bottom of the page to reach navigation, we can show that navigation via CSS/jQuery sooner.

## How scrollIntent Works

scrollIntent monitors the scrolling behaviour of a user to allow you to execute functionality specific to that behaviour.

When a user begins scrolling, scrollIntent will determine attributes of scrolling, such as the direction, speed, method of scrolling and so on. These attributes can then be queried by a developer to determine when a function specific to a certain behaviour should be executed.

## Usage

Please see [Documentation](https://github.com/IanLunn/scrollIntent/blob/master/documentation.md) for complete usage instructions.

## Browser Support

Tested with the following desktop browser:

- Google Chrome 33
- Safari 7
- Firefox 27
- Opera 20
- Internet Explorer 8, 9, 10, 11

scrollIntent is not supported on mobile/tablet devices. See [Limitations](#limitations).

## Performance

When executing JavaScript during scrolling, care should be taken to ensure there are no impacts on performance. scrollIntent will run multiple conditional checks as the user scrolls. To do this without affecting performance, these conditional checks are run every 250 milliseconds. This amount of time can be changed in `options`. You should aim for a fine balance between performance and responsiveness of functions executed by scrollIntent.

## Limitations

scrollIntent is developed for desktops only. For this reason, scrollIntent should be used for enhancing a website only.

scrollIntent doesn't work on mobile/tablets due to these devices applying limitations on JavaScript during scrolling. There are ways to work around this, such as using [iScroll](http://cubiq.org/iscroll-5) -- which "hijacks" the browsers scrolling mechanism. However, work arounds that "hijack" scrolling may add usability issues to a web page. Furthermore, scrollIntent most likely could with with iScroll but the two haven't been tested together.

## Todo List

- `destroy()` function
- Make `setupDeveloperIndicators` also apply indicators for `minWaypoint` and `maxWaypoint`

## Author

Ian Lunn

- [GitHub](https://github.com/IanLunn)
- [Twitter](https://twitter.com/IanLunn)
- [Website](http://ianlunn.co.uk/)

## Support Future Development

To support the future development of scrollIntent.js and other open source projects created by [Ian Lunn](https://github.com/IanLunn), please consider making a donation.

Your donation is not-for-profit (or beer!), and will allow Ian to spend a little less time on client projects and more time supporting and creating open source software.

Thank you.

**Bitcoin:**

Bitcoin donations may be sent to the following address:

<div style="text-align: center;">
<a href="bitcoin:1KEbFvcXL8m6LogG2wjSUFz2xH6PeN6jRd?label=scrollIntent%20Development"><img src="http://ianlunn.co.uk/images/btc-donate.jpg" /></a>
<p>1KEbFvcXL8m6LogG2wjSUFz2xH6PeN6jRd</p>
</div>
