class @SearchCompleter
	@MAX_SUGGESTIONS = 10
	@selected = 0
	@lastSearch = ''

	@complete: (queryField) ->
		text = queryField.val()
		if text is ''
			SearchCompleter.clearCompletions()
			return

		return if text is SearchCompleter.lastSearch

		SearchCompleter.lastSearch = text

		url = "http://suggestqueries.google.com/complete/search?client=chrome&q=" + text + "&callback=googlecallback"

		$.ajax({
			url: url,
			jsonp: "callback",
			dataType: "jsonp",
			success: ( response ) ->
				SearchCompleter.showCompletion(response[1])
		});

	@showCompletion: (possibiities) ->
		completionHtml = ""

		possibiities = possibiities.slice(0, SearchCompleter.MAX_SUGGESTIONS)

		for possibility in possibiities
			completionHtml += "<p class=\"googlebar-suggestion\">" + possibility + "</p>"

		$('#googlebar-suggestions').html(completionHtml)

		#reset selected because we have a new list now.
		#The old one is no longer there so the selection has gone as well.
		SearchCompleter.selected = 0

	@clearCompletions: () ->
		$('#googlebar-suggestions').html('')
		SearchCompleter.lastSearch = ''

	@selectUp: () ->
		return if SearchCompleter.selected <= 0;

		SearchCompleter.deselect();
		SearchCompleter.select(--SearchCompleter.selected)

	@selectDown: () ->
		return if SearchCompleter.selected >= SearchCompleter.MAX_SUGGESTIONS

		SearchCompleter.deselect();
		SearchCompleter.select(++SearchCompleter.selected)

	@deselect: () ->
		$('.googlebar-suggestion.selected').removeClass("selected")

	@select: (num) ->
		return if num is 0
		$('.googlebar-suggestion:nth-of-type(' + num + ')').addClass("selected")

	@acceptSelection: () ->
		if SearchCompleter.selected is 0
			SearchCompleter.openSearch($('#google-query-field').val())
		else
			SearchCompleter.openSearch(SearchCompleter.getCurrentSelectedText())

	@getCurrentSelectedText: () ->
		$('.googlebar-suggestion:nth-of-type(' + SearchCompleter.selected + ')').html()
	
	@openSearch: (term) ->
		window.location.href = "https://www.google.de/search?q=" + term


$(document).ready ->
	googleQueryField = $('#google-query-field')

	# Handle the search suggestions with keypresses.
	googleQueryField.keyup (event) ->
		# The following comments show the keycodes for the relevant keys.
		# Arrow up = 38
		# Arrow down = 40
		if (event.keyCode is 38) or (event.keyCode is 40)
			event.preventDefault()

			if event.keyCode is 38 
				SearchCompleter.selectUp()
			else
				SearchCompleter.selectDown()
		# Enter = 13
		else if event.keyCode is 13
			SearchCompleter.acceptSelection()
		# ESC = 27
		else if event.keyCode is 27
			googleQueryField.val('')
			SearchCompleter.complete(googleQueryField)
		else
			SearchCompleter.complete(googleQueryField)

	# Handle focusing and unfocusing
	googleQueryField.blur -> 
		SearchCompleter.clearCompletions()
	googleQueryField.focus -> 
		SearchCompleter.complete(googleQueryField)