(function() {
  this.LINKS_CONSTANTS = (function() {
    function LINKS_CONSTANTS() {}

    LINKS_CONSTANTS.STORAGE_KEY = 'startpage.links';

    return LINKS_CONSTANTS;

  })();

  this.Links = (function() {
    function Links() {}

    Links.contents;

    Links.masonry;

    Links.initMasonry = function() {
      if (!(Links.masonry === null || Links.masonry === void 0)) {
        Links.masonry.masonry('destroy');
      }
      return Links.masonry = $('#link-view').masonry({
        itemSelector: '.category-wrapper'
      });
    };

    Links.loadFromLocalStorage = function() {
      var contents;
      contents = localStorage.getItem(LINKS_CONSTANTS.STORAGE_KEY);
      if (contents === null) {
        return Links.contents = [];
      } else {
        return Links.contents = JSON.parse(contents);
      }
    };

    Links.saveToLocalStorage = function() {
      return localStorage.setItem(LINKS_CONSTANTS.STORAGE_KEY, JSON.stringify(Links.contents));
    };

    Links.render = function() {
      var categoriesHtml, category, categoryHtml, categoryIndex, entry, entryIndex, i, j, len, len1, ref, ref1;
      categoriesHtml = '';
      categoryIndex = 0;
      ref = Links.contents;
      for (i = 0, len = ref.length; i < len; i++) {
        category = ref[i];
        categoryHtml = '<div class="category-wrapper">';
        categoryHtml += '<div class="category" data-category-index="' + categoryIndex++ + '">';
        categoryHtml += '<div class="title-wrapper">';
        categoryHtml += '<div class="title-edit-icons">';
        categoryHtml += '<img class="title-edit-icon category-add-item-btn" src="startpage_assets/icons/add.svg">';
        categoryHtml += '<img class="title-edit-icon category-remove-btn" src="startpage_assets/icons/remove.svg">';
        categoryHtml += '<img class="title-edit-icon category-edit-btn" src="startpage_assets/icons/edit.svg">';
        categoryHtml += '<span class="clearfix"/>';
        categoryHtml += '</div>';
        categoryHtml += '<div class="colorpicker-wrapper">' + ColorPickerGenerator.getColorPickerCode() + '</div>';
        categoryHtml += '<p class="title" style="background-color:' + category.color + ';border-color:' + ColorUtil.changeLuminance(category.color, 0.3) + '">' + category.name + '</p>';
        categoryHtml += '</div>';
        categoryHtml += '<div class="entries">';
        entryIndex = 0;
        ref1 = category.entries;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          entry = ref1[j];
          categoryHtml += '<p class="entry" data-entry-index="' + entryIndex++ + '">';
          categoryHtml += '<a class="entry-title" href="' + entry.href + '">' + entry.title + '</a>';
          categoryHtml += '<img class="entry-edit-btn" src="startpage_assets/icons/edit.svg">';
          categoryHtml += '<img class="entry-remove-btn" src="startpage_assets/icons/remove.svg">';
          categoryHtml += '</p>';
        }
        categoryHtml += '</div>';
        categoryHtml += '</div>';
        categoryHtml += '</div>';
        categoriesHtml += categoryHtml;
      }
      $('#link-view').html(categoriesHtml);
      return Links.initMasonry();
    };

    return Links;

  })();

  this.ColorPickerGenerator = (function() {
    function ColorPickerGenerator() {}

    ColorPickerGenerator.getColorPickerCode = function() {
      var html;
      html = '<div class="colorpicker">';
      html += ColorPickerGenerator.getColorSwatchCode('#1abc9c');
      html += ColorPickerGenerator.getColorSwatchCode('#2ecc71');
      html += ColorPickerGenerator.getColorSwatchCode('#3498db');
      html += ColorPickerGenerator.getColorSwatchCode('#9b59b6');
      html += ColorPickerGenerator.getColorSwatchCode('#f1c40f');
      html += ColorPickerGenerator.getColorSwatchCode('#e67e22');
      html += ColorPickerGenerator.getColorSwatchCode('#e74c3c');
      html += ColorPickerGenerator.getColorSwatchCode('#34495e');
      html += ColorPickerGenerator.getColorSwatchCode('#16a085');
      html += ColorPickerGenerator.getColorSwatchCode('#27ae60');
      html += ColorPickerGenerator.getColorSwatchCode('#2980b9');
      html += ColorPickerGenerator.getColorSwatchCode('#8e44ad');
      html += ColorPickerGenerator.getColorSwatchCode('#f39c12');
      html += ColorPickerGenerator.getColorSwatchCode('#d35400');
      html += ColorPickerGenerator.getColorSwatchCode('#c0392b');
      html += ColorPickerGenerator.getColorSwatchCode('#2c3e50');
      html += '</div>';
      return html;
    };

    ColorPickerGenerator.getColorSwatchCode = function(color) {
      return '<div class="colorpicker-color" data-color="' + color + '" style="background-color:' + color + '" />';
    };

    return ColorPickerGenerator;

  })();

  $(document).ready(function() {
    Links.loadFromLocalStorage();
    return Links.render();
  });

}).call(this);
