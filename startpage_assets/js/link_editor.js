this.LinkEditor = (function() {
  function LinkEditor() {}

  LinkEditor.editing = false;

  LinkEditor.registerEvents = function() {
    $('#edit-editmode').click(function() {
      return LinkEditor.toggleEditMode();
    });
    $('#edit-add').click(function() {
      return LinkEditor.addEmptyCategory();
    });
    $('#edit-raw-data').click(function() {
      return LinkEditor.openRawEditor();
    });
    $(document).on('click', '.category-remove-btn', function() {
      return LinkEditor.removeCategory(LinkEditor.getCategoryID($(this)));
    });
    $(document).on('click', '.category-edit-btn', function() {
      return LinkEditor.toggleEditingCategory(LinkEditor.getContainingCategory($(this)));
    });
    $(document).on('click', '.category-add-item-btn', function() {
      var catID;
      catID = LinkEditor.getCategoryID($(this));
      return LinkEditor.addEntry(catID);
    });
    $(document).on('click', '.entry-edit-btn', function() {
      return LinkEditor.editEntry($(this));
    });
    $(document).on('click', '.entry-remove-btn', function() {
      return LinkEditor.removeEntry($(this));
    });
    $(document).on('confirmation', '.remodal', function() {
      var categoryID, entryID;
      entryID = parseInt($('#entry-editor-entry-id').val());
      categoryID = parseInt($('#entry-editor-category-id').val());
      Links.contents[categoryID].entries[entryID] = {
        title: $('#entry-edit-title').val(),
        href: $('#entry-edit-href').val()
      };
      return Links.render();
    });
    $(document).on('click', '.colorpicker-color', function() {
      return LinkEditor.updateCategoryColor($(this));
    });
    $('#raw-data-cancel').click(function() {
      return LinkEditor.closeRawEditor();
    });
    return $('#raw-data-save').click(function() {
      return LinkEditor.saveRawEditor();
    });
  };

  LinkEditor.addEmptyCategory = function() {
    LinkEditor.saveCurrentlyEditing();
    Links.contents.push({
      name: "New Category",
      color: "#2c3e50",
      entries: []
    });
    return LinkEditor.updateLinks();
  };

  LinkEditor.toggleEditingCategory = function(category) {
    if (!category.hasClass('editing')) {
      category.addClass('editing');
      return LinkEditor.editCategory(category);
    } else {
      category.removeClass('editing');
      return LinkEditor.stopEditCategory(category);
    }
  };

  LinkEditor.editCategory = function(category) {
    var title, titleElement;
    titleElement = category.find('.title');
    title = titleElement.html();
    return titleElement.html('<input class="category-title-field" type="text" value="' + title + '">');
  };

  LinkEditor.stopEditCategory = function(category) {
    category.find('.title').html(category.find('.category-title-field').val());
    return LinkEditor.updateSavedCategory(category);
  };

  LinkEditor.updateSavedCategory = function(category) {
    var saved;
    saved = Links.contents[LinkEditor.getCategoryID(category)];
    return saved.name = category.find('.title').html();
  };

  LinkEditor.removeCategory = function(id) {
    LinkEditor.saveCurrentlyEditing();
    Links.contents.splice(id, 1);
    return LinkEditor.updateLinks();
  };

  LinkEditor.updateCategoryColor = function(clickedColorPickerColor) {
    var catID;
    catID = LinkEditor.getCategoryID(clickedColorPickerColor);
    Links.contents[catID].color = clickedColorPickerColor.attr('data-color');
    LinkEditor.saveCurrentlyEditing();
    return Links.render();
  };

  LinkEditor.editEntry = function(entry) {
    var entryID, modelEntry;
    entryID = LinkEditor.getEntryID(entry);
    $('#entry-editor-entry-id').val(entryID);
    $('#entry-editor-category-id').val(LinkEditor.getCategoryID(entry));
    modelEntry = Links.contents[LinkEditor.getCategoryID(entry)].entries[LinkEditor.getEntryID(entry)];
    $('#entry-edit-title').val(modelEntry.title);
    $('#entry-edit-href').val(modelEntry.href);
    return location.hash = "edit-entry";
  };

  LinkEditor.addEntry = function(categoryID) {
    var entry;
    Links.contents[categoryID].entries.push({
      title: '',
      href: 'http://'
    });
    Links.render();
    entry = $('.category[data-category-index="' + categoryID + '"] > .entries > .entry:last-of-type');
    return LinkEditor.editEntry(entry);
  };

  LinkEditor.removeEntry = function(entry) {
    Links.contents[LinkEditor.getCategoryID(entry)].entries.splice(LinkEditor.getEntryID(entry), 1);
    return Links.render();
  };

  LinkEditor.updateLinks = function() {
    return Links.render();
  };

  LinkEditor.getCategoryID = function(element) {
    return parseInt(LinkEditor.getContainingCategory(element).attr('data-category-index'));
  };

  LinkEditor.getContainingCategory = function(element) {
    return element.closest('.category');
  };

  LinkEditor.getEntryID = function(element) {
    return parseInt(LinkEditor.getContainingEntry(element).attr('data-entry-index'));
  };

  LinkEditor.getContainingEntry = function(element) {
    return element.closest('.entry');
  };

  LinkEditor.saveCurrentlyEditing = function() {
    return $('.category.editing').each(function() {
      return LinkEditor.stopEditCategory($(this));
    });
  };

  LinkEditor.openRawEditor = function() {
    LinkEditor.saveCurrentlyEditing();
    $('#raw-data-box').val(JSON.stringify(Links.contents, null, "    "));
    return $('#raw-data-editor').addClass('editing');
  };

  LinkEditor.closeRawEditor = function() {
    return $('#raw-data-editor').removeClass('editing');
  };

  LinkEditor.saveRawEditor = function() {
    var code, data, e;
    try {
      code = $('#raw-data-box').val();
      if (!code || /^\s*$/.test(code)) {
        Links.contents = [];
      } else {
        data = JSON.parse(code);
        if (data instanceof Array) {
          Links.contents = data;
        } else {
          throw "No array given";
        }
      }
      Links.render();
      return LinkEditor.closeRawEditor();
    } catch (_error) {
      e = _error;
      return alert('Please check the format of the data you entered.');
    }
  };

  LinkEditor.toggleEditMode = function() {
    LinkEditor.editing = !LinkEditor.editing;
    if (LinkEditor.editing) {
      $('#editbar').addClass('editing');
      return $('#link-view').addClass('editing');
    } else {
      LinkEditor.saveCurrentlyEditing();
      $('.editing').removeClass('editing');
      return Links.saveToLocalStorage();
    }
  };

  return LinkEditor;

})();

$(document).ready(function() {
  return LinkEditor.registerEvents();
});
