# About this project

Modern browser start page, developed for use in Chromium and Google Chrome.

This might work with other browsers as well but is untested and this is not
intended.

The startpage features an inplace editor to allow adding, removing and modifying
categories and links without having to edit code.  
It also gets search suggestions from google while typing and loads a new random
background image from [Unsplash](http://unsplash.com/) every time it is loaded.

# Usage guide

The usage guide is located in
[the wiki of this project](https://gitlab.com/shad1w/startpage/wikis/home)

# Download and requirements

To download the startpage, download [this project as a zip file]
(https://gitlab.com/shad1w/startpage/repository/archive.zip?ref=master)
and unpack it to any place you want. Then open the `index.html` file with your
browser and set it as your start page.

To use this startpage, your browser needs to support the HTML5 local storage and
should keep any data even after closing all browser windows.

In Chromium and Google Chrome browsers you need to allow "cookies and site data"
for this site for it to work. You also need to set your preferences so that
the local storage for websites is not cleared when you close your browser.

# Build process

For building/compiling the startpage, you simply have to compile the scss file
(`styles/styles.scss`) and all the coffeescript files in the `js/` directory.

I use a tool called [Koala](http://koala-app.com/) for this but you can use
anything with similar functionality.

# Screenshot

![screenshot](/uploads/2a1ae920d245f49d714d4e9a3ec9de86/startpage.PNG)