class @LINKS_CONSTANTS
	@STORAGE_KEY = 'startpage.links'

class @Links
	@contents

	@masonry

	@initMasonry: () ->
		unless Links.masonry is null or Links.masonry is undefined
			Links.masonry.masonry('destroy')

		Links.masonry = $('#link-view').masonry({
		  itemSelector: '.category-wrapper'
		})

	@loadFromLocalStorage: () ->
		contents = localStorage.getItem(LINKS_CONSTANTS.STORAGE_KEY)

		if contents is null
			Links.contents = []
		else
			Links.contents = JSON.parse(contents)

	@saveToLocalStorage: () ->
		localStorage.setItem(LINKS_CONSTANTS.STORAGE_KEY, JSON.stringify(Links.contents))

	@render: () ->
		categoriesHtml = ''

		categoryIndex = 0

		for category in Links.contents
			# Sorry...
			# In my defense, I must say that I was too tired to get a templating engine.
			categoryHtml = '<div class="category-wrapper">'
			categoryHtml += '<div class="category" data-category-index="' + categoryIndex++ +'">'

			categoryHtml += '<div class="title-wrapper">'
			# Edit icons
			categoryHtml += '<div class="title-edit-icons">'
			categoryHtml += '<img class="title-edit-icon category-add-item-btn" src="startpage_assets/icons/add.svg">'
			categoryHtml += '<img class="title-edit-icon category-remove-btn" src="startpage_assets/icons/remove.svg">'
			categoryHtml += '<img class="title-edit-icon category-edit-btn" src="startpage_assets/icons/edit.svg">'
			categoryHtml += '<span class="clearfix"/>'
			categoryHtml += '</div>' # /title-edit-icons

			categoryHtml += '<div class="colorpicker-wrapper">' + ColorPickerGenerator.getColorPickerCode() + '</div>'

			# Now we can set the actual title.
			categoryHtml += '<p class="title" style="background-color:' + category.color + ';border-color:' + ColorUtil.changeLuminance(category.color, 0.3) + '">' + category.name + '</p>'
			categoryHtml += '</div>' # / title-wrapper


			categoryHtml += '<div class="entries">'

			entryIndex = 0

			for entry in category.entries
				categoryHtml += '<p class="entry" data-entry-index="' + entryIndex++ + '">'
				categoryHtml += '<a class="entry-title" href="' + entry.href + '">' + entry.title + '</a>'
				categoryHtml += '<img class="entry-edit-btn" src="startpage_assets/icons/edit.svg">'
				categoryHtml += '<img class="entry-remove-btn" src="startpage_assets/icons/remove.svg">'
				categoryHtml += '</p>'

			categoryHtml += '</div>' # /entries
			categoryHtml += '</div>' # /category
			categoryHtml += '</div>' # /category-wrapper

			categoriesHtml += categoryHtml

		# All categories are rendered. We can now put the rendered html into the link view.
		$('#link-view').html(categoriesHtml)

		# Initialize masonry
		Links.initMasonry()


class @ColorPickerGenerator
	@getColorPickerCode: ->
		html = '<div class="colorpicker">'
		# Light variants
		html += ColorPickerGenerator.getColorSwatchCode('#1abc9c')
		html += ColorPickerGenerator.getColorSwatchCode('#2ecc71')
		html += ColorPickerGenerator.getColorSwatchCode('#3498db')
		html += ColorPickerGenerator.getColorSwatchCode('#9b59b6')
		html += ColorPickerGenerator.getColorSwatchCode('#f1c40f')
		html += ColorPickerGenerator.getColorSwatchCode('#e67e22')
		html += ColorPickerGenerator.getColorSwatchCode('#e74c3c')
		html += ColorPickerGenerator.getColorSwatchCode('#34495e')
		# Dark variants
		html += ColorPickerGenerator.getColorSwatchCode('#16a085')
		html += ColorPickerGenerator.getColorSwatchCode('#27ae60')
		html += ColorPickerGenerator.getColorSwatchCode('#2980b9')
		html += ColorPickerGenerator.getColorSwatchCode('#8e44ad')
		html += ColorPickerGenerator.getColorSwatchCode('#f39c12')
		html += ColorPickerGenerator.getColorSwatchCode('#d35400')
		html += ColorPickerGenerator.getColorSwatchCode('#c0392b')
		html += ColorPickerGenerator.getColorSwatchCode('#2c3e50')
		html += '</div>'

		return html

	@getColorSwatchCode: (color) ->
		return '<div class="colorpicker-color" data-color="' + color + '" style="background-color:' + color + '" />'


$(document).ready ->
	Links.loadFromLocalStorage()
	Links.render()
