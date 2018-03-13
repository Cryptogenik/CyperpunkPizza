(function() {
  this.SearchCompleter = (function() {
    function SearchCompleter() {}

    SearchCompleter.MAX_SUGGESTIONS = 10;

    SearchCompleter.selected = 0;

    SearchCompleter.lastSearch = '';

    SearchCompleter.complete = function(queryField) {
      var text, url;
      text = queryField.val();
      if (text === '') {
        SearchCompleter.clearCompletions();
        return;
      }
      if (text === SearchCompleter.lastSearch) {
        return;
      }
      SearchCompleter.lastSearch = text;
      url = "http://suggestqueries.google.com/complete/search?client=chrome&q=" + text + "&callback=googlecallback";
      return $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        success: function(response) {
          return SearchCompleter.showCompletion(response[1]);
        }
      });
    };

    SearchCompleter.showCompletion = function(possibiities) {
      var completionHtml, possibility, _i, _len;
      completionHtml = "";
      possibiities = possibiities.slice(0, SearchCompleter.MAX_SUGGESTIONS);
      for (_i = 0, _len = possibiities.length; _i < _len; _i++) {
        possibility = possibiities[_i];
        completionHtml += "<p class=\"googlebar-suggestion\">" + possibility + "</p>";
      }
      $('#googlebar-suggestions').html(completionHtml);
      return SearchCompleter.selected = 0;
    };

    SearchCompleter.clearCompletions = function() {
      $('#googlebar-suggestions').html('');
      return SearchCompleter.lastSearch = '';
    };

    SearchCompleter.selectUp = function() {
      if (SearchCompleter.selected <= 0) {
        return;
      }
      SearchCompleter.deselect();
      return SearchCompleter.select(--SearchCompleter.selected);
    };

    SearchCompleter.selectDown = function() {
      if (SearchCompleter.selected >= SearchCompleter.MAX_SUGGESTIONS) {
        return;
      }
      SearchCompleter.deselect();
      return SearchCompleter.select(++SearchCompleter.selected);
    };

    SearchCompleter.deselect = function() {
      return $('.googlebar-suggestion.selected').removeClass("selected");
    };

    SearchCompleter.select = function(num) {
      if (num === 0) {
        return;
      }
      return $('.googlebar-suggestion:nth-of-type(' + num + ')').addClass("selected");
    };

    SearchCompleter.acceptSelection = function() {
      if (SearchCompleter.selected === 0) {
        return SearchCompleter.openSearch($('#google-query-field').val());
      } else {
        return SearchCompleter.openSearch(SearchCompleter.getCurrentSelectedText());
      }
    };

    SearchCompleter.getCurrentSelectedText = function() {
      return $('.googlebar-suggestion:nth-of-type(' + SearchCompleter.selected + ')').html();
    };

    SearchCompleter.openSearch = function(term) {
      return window.location.href = "https://www.google.de/search?q=" + term;
    };

    return SearchCompleter;

  })();

  $(document).ready(function() {
    var googleQueryField;
    googleQueryField = $('#google-query-field');
    googleQueryField.keyup(function(event) {
      if ((event.keyCode === 38) || (event.keyCode === 40)) {
        event.preventDefault();
        if (event.keyCode === 38) {
          return SearchCompleter.selectUp();
        } else {
          return SearchCompleter.selectDown();
        }
      } else if (event.keyCode === 13) {
        return SearchCompleter.acceptSelection();
      } else if (event.keyCode === 27) {
        googleQueryField.val('');
        return SearchCompleter.complete(googleQueryField);
      } else {
        return SearchCompleter.complete(googleQueryField);
      }
    });
    googleQueryField.blur(function() {
      return SearchCompleter.clearCompletions();
    });
    return googleQueryField.focus(function() {
      return SearchCompleter.complete(googleQueryField);
    });
  });

}).call(this);
