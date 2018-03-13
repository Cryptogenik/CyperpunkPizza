class @LinkEditor
	@editing = false

	@registerEvents: ->
		$('#edit-editmode').click ->
			LinkEditor.toggleEditMode()

		$('#edit-add').click ->
			LinkEditor.addEmptyCategory()

		$('#edit-raw-data').click ->
			LinkEditor.openRawEditor()

		$(document).on 'click', '.category-remove-btn', ->
			LinkEditor.removeCategory(LinkEditor.getCategoryID($(this)))

		$(document).on 'click', '.category-edit-btn', ->
			LinkEditor.toggleEditingCategory(LinkEditor.getContainingCategory($(this)))

		$(document).on 'click', '.category-add-item-btn', ->
			catID = LinkEditor.getCategoryID($(this))
			LinkEditor.addEntry(catID)

		$(document).on 'click', '.entry-edit-btn', ->
			LinkEditor.editEntry($(this))

		$(document).on 'click', '.entry-remove-btn', ->
			LinkEditor.removeEntry($(this))

		$(document).on 'confirmation', '.remodal', ->
			entryID = parseInt($('#entry-editor-entry-id').val())
			categoryID = parseInt($('#entry-editor-category-id').val())

			Links.contents[categoryID].entries[entryID] = {
				title: $('#entry-edit-title').val(),
				href: $('#entry-edit-href').val()
			}

			Links.render()

		$(document).on 'click', '.colorpicker-color', ->
			LinkEditor.updateCategoryColor($(this))

		# Raw editor buttons
		$('#raw-data-cancel').click ->
			LinkEditor.closeRawEditor()

		$('#raw-data-save').click ->
			LinkEditor.saveRawEditor()

	@addEmptyCategory: ->
		# This needs to be done so that the re-render doesn't clear changes.
		LinkEditor.saveCurrentlyEditing()
		
		Links.contents.push({
				name: "New Category",
				color: "#2c3e50",
				entries: []
			});
		LinkEditor.updateLinks()

	@toggleEditingCategory: (category) ->
		unless category.hasClass('editing')
			category.addClass('editing')
			LinkEditor.editCategory(category)
		else
			category.removeClass('editing')
			LinkEditor.stopEditCategory(category)


	@editCategory: (category) ->
		titleElement = category.find('.title')
		title = titleElement.html()
		titleElement.html('<input class="category-title-field" type="text" value="' + title + '">')	

	@stopEditCategory: (category) ->
		category.find('.title').html(category.find('.category-title-field').val())
		LinkEditor.updateSavedCategory(category)

	@updateSavedCategory: (category) ->
		saved = Links.contents[LinkEditor.getCategoryID(category)]
		
		saved.name = category.find('.title').html()

	@removeCategory: (id) ->
		# This needs to be done so that the re-render doesn't clear changes.
		LinkEditor.saveCurrentlyEditing()

		Links.contents.splice(id, 1)
		LinkEditor.updateLinks()

	@updateCategoryColor: (clickedColorPickerColor) ->
		catID = LinkEditor.getCategoryID(clickedColorPickerColor)

		Links.contents[catID].color = clickedColorPickerColor.attr('data-color')

		# This needs to be done so that the re-render doesn't clear changes.
		LinkEditor.saveCurrentlyEditing()
		
		Links.render()

	@editEntry: (entry) ->
		entryID = LinkEditor.getEntryID(entry)

		$('#entry-editor-entry-id').val(entryID)
		$('#entry-editor-category-id').val(LinkEditor.getCategoryID(entry))

		modelEntry = Links.contents[LinkEditor.getCategoryID(entry)].entries[LinkEditor.getEntryID(entry)]

		$('#entry-edit-title').val(modelEntry.title)
		$('#entry-edit-href').val(modelEntry.href)

		location.hash = "edit-entry" # This simply opens the edit modal

	@addEntry: (categoryID) ->
		Links.contents[categoryID].entries.push({title: '', href: 'http://'})
		Links.render()
		entry = $('.category[data-category-index="' + categoryID + '"] > .entries > .entry:last-of-type')
		LinkEditor.editEntry(entry)

	@removeEntry: (entry) ->
		Links.contents[LinkEditor.getCategoryID(entry)].entries.splice(LinkEditor.getEntryID(entry), 1)
		Links.render()

	@updateLinks: ->
		Links.render()

	# This gets the ID of the category for ANY element inside it, no matter how deep inside.
	@getCategoryID: (element) ->
		parseInt(LinkEditor.getContainingCategory(element).attr('data-category-index'))

	@getContainingCategory: (element) ->
		element.closest('.category')

	# This gets the ID of the entry for ANY element inside it, no matter how deep inside.
	@getEntryID: (element) ->
		parseInt(LinkEditor.getContainingEntry(element).attr('data-entry-index'))

	@getContainingEntry: (element) ->
		element.closest('.entry')

	@saveCurrentlyEditing: ->
		$('.category.editing').each ->
				LinkEditor.stopEditCategory($(this))

	@openRawEditor: ->
		LinkEditor.saveCurrentlyEditing()

		$('#raw-data-box').val(JSON.stringify(Links.contents, null, "    "))
		$('#raw-data-editor').addClass('editing')

	@closeRawEditor: ->
		$('#raw-data-editor').removeClass('editing')

	@saveRawEditor: ->
		try
			code = $('#raw-data-box').val()

			if `!code || /^\s*$/.test(code)` # If code is empty
				Links.contents = []
			else
				data = JSON.parse(code)
				if data instanceof Array
					Links.contents = data
				else
					throw "No array given"

			Links.render()
			LinkEditor.closeRawEditor()
		catch e
			alert 'Please check the format of the data you entered.'
		


	@toggleEditMode: ->
		LinkEditor.editing = !LinkEditor.editing

		if LinkEditor.editing
			$('#editbar').addClass('editing')
			$('#link-view').addClass('editing')
		else
			LinkEditor.saveCurrentlyEditing()

			$('.editing').removeClass('editing')
			Links.saveToLocalStorage()


$(document).ready ->
	LinkEditor.registerEvents()