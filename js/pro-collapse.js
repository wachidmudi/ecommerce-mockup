/* ========================================================================
 * Tutorial specific Javascript
 * 
 * ========================================================================
 * Copyright 2016 Bootbites.com (unless otherwise stated)
 * For license information see: http://bootbites.com/license
 * ======================================================================== */

// Global variables
var collapseNavSelector = $('[data-toggle="collapse-nav"]'),
  collapseNavStickyClass = 'sticky';

// Custom function
// Read collapseNav data- & find elements, return data in neat object
// =========================
function collapseNavGetData(target) {
  // collapseNavTarget
  var collapseNavTarget = target.data('target') || null;
  collapseNavTarget = $(collapseNavTarget);
  
  // Check target exists
  if (collapseNavTarget.size() === 0) {
    return false;
  }
  collapseNavTarget.addClass('collapse-nav-target').addClass('dropdown');
  if (target.find(target.data('target')).size() > 0) {
    collapseNavTarget.addClass('sticky');
  }
  
  // collapseNavItems 
  var collapseNavItems = 'li';
  var collapseNavItemsNoSticky = target.find('> ' + collapseNavItems).not('.' + collapseNavStickyClass);
  collapseNavItems = target.find('> ' + collapseNavItems);
  
  // collapseNavParent
  var collapseNavParent = target.data('parent') || '.navbar';
  collapseNavParent = target.parents(collapseNavParent);
  
  // collapseNavWidthOffset & parent
  // Can be value or selectors of elements
  var collapseNavWidthOffset = target.data('width-offset');
  
  var data = {
    collapseNav:              target, // the data-toggle="collapse-nav" element
    collapseNavParent:        collapseNavParent,
    collapseNavTarget:        collapseNavTarget, // object of more menu target where items are moved to
    collapseNavTargetMenu:    collapseNavTarget.find('.dropdown-menu'),
    collapseNavItems:         collapseNavItems, // object of items within collapseNav to collapse, override with data-items="li"
    collapseNavItemsNoSticky: collapseNavItemsNoSticky, // object of items within collapseNav to collapse, override with data-items="li"
    collapseNavItemsSticky:   target.find('> ' + '.' + collapseNavStickyClass), // object of  sticky items within collapseNav
    collapseNavCollapseWidth: target.data('collapse-width') || 250, // a pixel width where the collapseNav should be fully collapse ie. on mobile
    collapseNavWidthOffset:   collapseNavWidthOffset || 160, // offset for width calculation, can be value or selectors of elements
    collapseNavWidth:         0 // collapseNav width based on space available
  };

  return data;
}

// Custom function
// Calculates collapseNav element width
// =========================
function collapseNavGetWidth(data) {
  var collapseNavParentWidth = data.collapseNavParent.width(),
    collapseNavWidth = 0, // fallback, will trigger collapse
    collapseNavParentMargins = {
      'left': parseInt(data.collapseNavParent.css('margin-left')),
      'right': parseInt(data.collapseNavParent.css('margin-right'))
    },
    collapseNavOutterSpace = {
      'margin-left': parseInt(data.collapseNav.css('margin-left')),
      'margin-right': parseInt(data.collapseNav.css('margin-right')),
      'padding-left': parseInt(data.collapseNav.css('padding-left')),
      'padding-right': parseInt(data.collapseNav.css('padding-right'))      
    };

  // Check for negative margins on parent
  if (collapseNavParentMargins.left < 0 || collapseNavParentMargins.right < 0) {
    collapseNavParentWidth = data.collapseNavParent.outerWidth(true);
  }
  
  // Check for padding & margins on trigger
  $.each(collapseNavOutterSpace, function(a, v) {
    collapseNavParentWidth -= v;
  });
    
  // Otherwise calculate width base on elements within
  if (collapseNavParentWidth > 0) {
    collapseNavWidth =  collapseNavParentWidth;
    
    // Process width offset
    if (data.collapseNavParent.find(data.collapseNavWidthOffset).size() > 0) {
      // Offset with element width(s) ie. other navbar elements with parent
      data.collapseNavParent.find(data.collapseNavWidthOffset).each(function() {
        collapseNavWidth -= $(this).outerWidth(true);
      });
    }
    else {
      // Offset with value
      collapseNavWidth -= data.collapseNavWidthOffset;
    }

    // minus sticky items
    data.collapseNavItemsSticky.each(function() {
      collapseNavWidth -= $(this).outerWidth(true);
    });
    
    if (collapseNavWidth <= 0 || collapseNavWidth <= data.collapseNavCollapseWidth) {
      collapseNavWidth = 0;
    }
  }
  return collapseNavWidth;
}

// Custom function that resizes menu
// =========================
function collapseNavResize(data) {
  var collapseItemsWidth = 0;
  
  // See how many "items" fit inside collapseNavWidth
  if (data.collapseNavWidth > 0 ) {
    data.collapseNavItemsNoSticky.each(function() {
      var collapseNavItem = $(this),
        collapseNavItemId = '.' + collapseNavItem.data('collapse-item-id');
      collapseItemsWidth += collapseNavItem.outerWidth(true);
        
      if (data.collapseNavWidth < collapseItemsWidth) {
        data.collapseNav.find(collapseNavItemId).addClass('collapse-item-hidden');
        data.collapseNavTargetMenu.find(collapseNavItemId).removeClass('collapse-item-hidden');
      }
      else {
        data.collapseNav.find(collapseNavItemId).removeClass('collapse-item-hidden');
        data.collapseNavTargetMenu.find(collapseNavItemId).addClass('collapse-item-hidden');
      }
    });
  }
  else {
    // Assume all collapsed
    data.collapseNavItemsNoSticky.addClass('collapse-item-hidden');
    data.collapseNavTargetMenu.find('.collapse-item').removeClass('collapse-item-hidden');
    data.collapseNav.width('auto');
  }
  
  // see if collapseNavTarget contains visible elements, :visible selector fails
  var visibleItems = data.collapseNavTargetMenu.find('.collapse-item').filter(function() {
    return $(this).css('display') !== 'none';
  }).size();

  if (visibleItems > 0) {
    data.collapseNavTarget.show();
  }
  else {
    data.collapseNavTarget.hide();
  }
  
}

// Run through all collapse-nav elements
// =========================
function collapseNavTrigger(setup) {
  collapseNavSelector.each(function() {
    var collapseNav = $(this),
      collapseNavData = collapseNavGetData(collapseNav);
      
    if (collapseNavData === false) {
      // No target so bail
      return false;
    }
  
    // Run setup only on first run
    // ---------------------------
    if (setup === true) {
      // Check target has <ul class="dropdown-menu"></ul> & data-toggle elements, if not create them
      if (collapseNavData.collapseNavTarget.find('[data-toggle="dropdown"]').size() === 0) {
        $('<a href="#" class="dropdown-toggle" data-toggle="dropdown">More <span class="caret"></span></a>').appendTo(collapseNavData.collapseNavTarget);
      }
      if (collapseNavData.collapseNavTarget.find('.dropdown-menu').size() === 0) {
        collapseNavData.collapseNavTargetMenu = $('<ul class="dropdown-menu"></ul>');
        collapseNavData.collapseNavTargetMenu.appendTo(collapseNavData.collapseNavTarget);
      }
      
      // clone $collapseNav > collapseNavItems into collapseNavTarget
      collapseNavData.collapseNavItems.each(function(i) {
        var collapseItem = $(this);
        collapseItem.addClass('collapse-item');
        
        if (!collapseItem.hasClass(collapseNavStickyClass)) {
          // Add identifier & class to each non-sticky item
          collapseItem.data('collapse-item-id', 'collapse-item-' + i).addClass('collapse-item-' + i);
          collapseItem.clone().appendTo(collapseNavData.collapseNavTargetMenu);
        }
      });
      
      collapseNavData.collapseNav.addClass('collapse-nav');
    }

    // Calulate navbar width
    // ---------------------------
    collapseNavData.collapseNavWidth = collapseNavGetWidth(collapseNavData);
    
    // Trigger menu resizing
    // ---------------------------
    collapseNavResize(collapseNavData);
  });
}

// Run on doc ready
// =========================
$(document).ready(function(){
  collapseNavTrigger(true);
  
  // On resize
  $(window).on('resize', function() {
    collapseNavTrigger(false);
  });
});