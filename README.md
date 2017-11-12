# Bunker Hills Men's Club

The web project for the home (front-end only) of the Bunker Hills Men's Club.

Manages the event calendar, communications, and event registration for club members.

## Pending Tasks for 2018
    
###Required Updates, Upgrades, and Performance Enhancements
* ~~Update the website project to use Angular CLI and WebPack~~
* ~~Update website to Angular 5~~
* ~~Move top-level features to lazy routes~~
* Convert from Stripe v2 to v3
* Update the Contacts
* Update the email forward rules
* Move all admin pages to a separate admin feature
* Split public and private event feature pages
* Results page and detail page should be capable of linking to Golf Genius event portal
  * Each event (mid-week and majors) will have a separate event portal page in GG
  * i.e. Not just the document link that we have now

###New Season Roll-over
* Add 2018 events
* Delete all login tokens from 2017
* Ensure online sign-up works for returning members
* Ensure online sign-up works for new members
* Update season config settings (i.e. create online registration windows)

###Possible Enhancements/Features
* Make Contact page data driven (so it isn't a programmer task each year)
* Photo Gallery
* Registration for events open to non-members
* Registration for meetings including optional meal
* Skins online signup
* Payments: ability to choose whether or not to save a card
* Payments: saving/selecting multiple cards
* Where to display sponsors
* Job to refund all for a rainout
* Online check-in page for skins, same-day sign-up, and moving players
* Forum: find partners, buy/sell, suggestions
* Add Google Analytics and report on website usage
* Consider using Golf Genius for the season long match play
* Payment report by users
* Print styling - move print formatting to server for some reports
* Possible new or improved reports/exports for Golf Genius integration

###Admin Training / Documentation
* Who can do admin tasks (roles)
* How to upload results and teetimes (Dan)
* How to add groups on the par 3s
* How to update SLP and Dam Cup documents
* How to manually sign up a user for an event
* How to manually register a new users
* How to add an event
* How to change an event
* How to add or change policies (including rules)
* How to publish home page announcements
* How to export event signups

###Issues
* Bug: New reg and login: should not be presented with a reg button
* Creation of new mid-week events should also create the signup slots
* Ensure new member registration obeys the config flag
* Identity and handle returning inactive member signup (redirect from failed login)
* How to handle members with the same name? (typeaheads)
* How can we gracefully handle a 503 from the api?
* "Secure" wording on the payment component
* Scroll to top on mobile
* Match play cannot handle multiple documents
* Upload 2 day event teetimes?
* Easy home page link to tee times and results
* Clean up Quick Links to include only our events
* Remove "League" language (replace with ?)
* Make home page api calls public on the back-end for guest users
    * current events
    * sponsors
    * announcements
