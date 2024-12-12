/**
 * Plugin to handle the Google Map
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkMap',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   * @constructor
   * @param {HTMLElement} element The element that will be monitored
   */
  function Plugin(element) {
    this.element = $(element);
    this.options = JSON.parse(this.element.attr('data-section-settings'));
    this.locations = [];
    this.markers = [];

    this.element.on('click', '[data-action="toggle-store"]', this._toggleStore.bind(this));
    this.element.on('click', '.featured-map__store-item', this._activateStore.bind(this));
    this.element.on('shopify:block:select', this._blockSelected.bind(this));

    this.googleMapContainer = this.element.find('.featured-map__gmap').get(0);

    if (this.options['apiKey'] && this.options['mapAddresses'].length > 0) {
      var $script = $('script[src*="' + this.options['apiKey'] + '&"]'),
        self = this;

      if ($script.length === 0) {
        $.getScript(
          'https://maps.googleapis.com/maps/api/js?key=' + this.options['apiKey']
        ).then(function() {
          self._initMap();
        });
      } else {
        this._initMap();
      }
    }

    $(window).on('resize.trademarkMap', this._repositionMap.bind(this));
  }

  Plugin.prototype.destroy = function() {
    $(window).off('resize.trademarkMap');
  };

  Plugin.prototype._blockSelected = function(event) {
    this._selectStore($(event.target));
  };

  Plugin.prototype._toggleStore = function(event) {
    this._selectStore($(event.currentTarget).closest('.featured-map__store-item'));
  };

  Plugin.prototype._activateStore = function(event) {
    this._selectStore($(event.currentTarget));
  };

  Plugin.prototype._selectStore = function(storeElement) {
    storeElement.addClass('featured-map__store-item--active');

    if (window.matchMedia('screen and (max-width: 800px)').matches) {
      storeElement.find('.featured-map__store-inner').slideDown()
        .end().find('.plus-button').addClass('plus-button--active');

      storeElement.siblings('.featured-map__store-item--active')
        .find('.featured-map__store-inner').slideUp()
        .end().find('.plus-button').removeClass('plus-button--active');
    }

    storeElement.siblings('.featured-map__store-item--active').removeClass('featured-map__store-item--active');

    this._repositionMap();
    this._setNewCenter(storeElement.attr('data-store-index'));
  };

  Plugin.prototype._initMap = function() {
    var geocoder = new google.maps.Geocoder(),
      self = this;

    var mapOptions = {
      zoom: self.options['zoom'],
      draggable: false,
      clickableIcons: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      disableDefaultUI: true
    };

    this.googleMap = new google.maps.Map(this.googleMapContainer, mapOptions);
    var styledMapType = new google.maps.StyledMapType(JSON.parse(this.element.find('[data-gmap-style]').html()));

    this.googleMap.mapTypes.set('styled_map', styledMapType);
    this.googleMap.setMapTypeId('styled_map');

    this._repositionMap();

    // We need to geocode each addresses individually
    this.options['mapAddresses'].forEach(function(address, index) {
      geocoder.geocode({ address: address }, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          if (Shopify.designMode) {

          }
        } else {
          if (index === 0) {
            self.googleMap.setCenter(results[0].geometry.location);
          }

          self.locations[index] = results[0].geometry.location;

          var icon = {
            path: "M32.7374478,5.617 C29.1154478,1.995 24.2994478,0 19.1774478,0 C14.0544478,0 9.23944778,1.995 5.61744778,5.617 C-1.08555222,12.319 -1.91855222,24.929 3.81344778,32.569 L19.1774478,54.757 L34.5184478,32.6 C40.2734478,24.929 39.4404478,12.319 32.7374478,5.617 Z M19.3544478,26 C15.4954478,26 12.3544478,22.859 12.3544478,19 C12.3544478,15.141 15.4954478,12 19.3544478,12 C23.2134478,12 26.3544478,15.141 26.3544478,19 C26.3544478,22.859 23.2134478,26 19.3544478,26 Z",
            fillColor: index === 0 ? self.options['markerActiveColor'] : self.options['markerColor'],
            fillOpacity: 1,
            anchor: new google.maps.Point(15,55),
            strokeWeight: 0,
            scale: window.matchMedia('screen and (max-width: 559px)').matches ? 0.5 : (index === 0 ? 0.7 : 0.5)
          };

          self.markers[index] = new google.maps.Marker({
            map: self.googleMap,
            position: results[0].geometry.location,
            icon: icon
          });
        }
      });
    });
  };

  Plugin.prototype._setNewCenter = function(index) {
    var self = this,
      indexAsInt = parseInt(index);

    this.googleMap.panTo(this.locations[indexAsInt]);

    this.markers.forEach(function(marker, markerIndex) {
      if (markerIndex === indexAsInt) {
        marker.icon.fillColor = self.options['markerActiveColor'];
        marker.icon.scale = window.matchMedia('screen and (max-width: 559px)').matches ? 0.5 : 0.7;
      } else {
        marker.icon.fillColor = self.options['markerColor'];
        marker.icon.scale = 0.5;
      }

      marker.setMap(self.googleMap);
    });
  };

  /**
   * Reposition the GMap container (which allows to re-use it on mobile and desktop)
   *
   * @private
   */
  Plugin.prototype._repositionMap = function() {
    var container = null;

    if (window.matchMedia('screen and (min-width: 801px)').matches) {
      container = this.element.find('.featured-map__map-container--desktop');
    } else {
      container = this.element.find('.featured-map__store-item--active .featured-map__map-container--mobile');
    }

    container.append(this.googleMapContainer);

    var center = this.googleMap.getCenter();
    google.maps.event.trigger(this.googleMap, 'resize');
    this.googleMap.setCenter(center);
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle the header search
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkHeaderSearch',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   */
  function Plugin(element) {
    this.headerSearch = $(element);
    this.headerSearchForm = this.headerSearch.find('.header-search__form');
    this.headerInput = this.headerSearch.find('.header-search__input');
    this.headerSearchResults = this.headerSearch.find('.header-search__results-wrapper');

    this.searchResultsTemplate = Template7.compile($('#search-results-template').html());
    this.searchMode = "product",
    this.body = $('body');
    this.pageOverlay = $('.page__overlay');

    this.sidebarNavInstance = $('.sidebar-nav').data('plugin_trademarkMobileSidebar');
    this.miniCartInstance = $('.mini-cart').data('plugin_trademarkMiniCart');

    $('[data-action="open-search"]').on('click', $.proxy(this._openSearch, this));
    $('[data-action="close-search"]').on('click', $.proxy(this._closeSearch, this));

    this.headerInput.on('keyup', $.proxy(this._initSearch, this));

    this.headerSearchForm.on('submit', $.proxy(this._formSubmitted, this));
  }

  Plugin.prototype.destroy = function() {
    $('[data-action="open-search"]').off('click');
    $('[data-action="close-search"]').off('click');

    this.headerSearch.removeData('plugin_trademarkHeaderSearch');
    this.headerInput.off('keyup');
    this.headerSearchForm.off('submit');
    this.body.off('.trademarkHeaderSearch');
  };

  Plugin.prototype._openSearch = function(event) {
    var self = this;

    // If either mobile sidebar or mini-cart are open we must first close them, otherwise we open directly

    if (this.sidebarNavInstance.state === 'opening' || this.sidebarNavInstance.state === 'opened') {
      this.sidebarNavInstance._toggleSidebar(event);

      $(document).one('closed.trademarkMobileSidebar', function() {
        self._doOpenSearch();
      });
    } else if (undefined !== this.miniCartInstance && (this.miniCartInstance.state === 'opening' || this.miniCartInstance.state === 'opened')) {
      this.miniCartInstance._toggleMiniCart(event);

      $(document).one('closed.trademarkMiniCart', function() {
        self._doOpenSearch();
      });
    } else {
      this._doOpenSearch(); // Both are closed so we can open directly
    }

    event.preventDefault();
  };

  Plugin.prototype._closeSearch = function(event) {
    this.body.removeClass('no-scroll');
    this.pageOverlay.removeClass('page__overlay--open');
    this.headerSearch.removeClass('header-search--open');
    this.body.off('.trademarkHeaderSearch');

    event.preventDefault();
  };

  Plugin.prototype._doOpenSearch = function() {
    var self = this;

    this.body.addClass('no-scroll');
    this.pageOverlay.addClass('page__overlay--open');

    this.headerSearch.addClass('header-search--open');
    this.headerSearch.one('transitionend', function() {
      self._cursorFocus(self.headerInput);
    });

    this.body.on('keyup.trademarkHeaderSearch', function(event) {
      if (event.keyCode == 27) {
        self._closeSearch(event);
      }
    });

    this.body.on('click.trademarkHeaderSearch', function(outsideEvent) {
      if (!$(outsideEvent.target).closest('#shopify-section-header').length) {
        self._closeSearch(outsideEvent);
      }
    });
  };

  Plugin.prototype._initSearch = function(event) {
    var target = $(event.currentTarget);

    clearTimeout(target.data('timeout'));

    target.data('timeout', setTimeout($.proxy(this._doSearch, this), 250));
  };

  Plugin.prototype._doSearch = function(event) {
    // No autocompletion on mobile
    if (Modernizr.mq('(max-width: 559px)')) {
      return;
    }

    // If we are on mobile, we do a single search that will get all resources, based on the setting. If tablet and higher, we do two Ajax calls: one
    // that will fetch product only, and another one that will fetch anything else
    if (this.headerInput.val() === '') {
      this.headerSearchResults.empty();
      return; // No need to search if it's empty
    } else {
      this.headerSearchResults.html(this.searchResultsTemplate({is_loading: true}));
    }

    if (this.searchMode === 'product') {
      this._doCompleteSearch();
    } else {
      this._doSeparateSearch();
    }
  };

  Plugin.prototype._doCompleteSearch = function(event) {
    var self = this;

    $.ajax({
      method: 'GET',
      url: window.theme.localeRootUrl + '/search?view=json',
      dataType: 'json',
      data: {
        q: this.headerInput.val() + '*',
        type: this.searchMode
      }
    }).then(function(data) {
      self.headerSearchResults.html(self.searchResultsTemplate({
        is_loading: false,
        split_search: false,
        on_sale_label: window.languages.productLabelsOnSale,
        results: data['results'],
        has_results: (data['results'].length > 0),
        results_count: data['results_count'],
        results_label: data['results_label'],
        results_url: (data['url'] + '&type=' + self.searchMode)
      }));
    });
  };

  Plugin.prototype._doSeparateSearch = function(event) {
    var searchTypes = this.searchMode.split(','),
      self = this;

    var firstSearch = $.ajax({
      method: 'GET',
      url: window.theme.localeRootUrl + '/search?view=json',
      dataType: 'json',
      data: {
        q: this.headerInput.val() + '*',
        type: searchTypes[0]
      }
    });

    var lastSearch = $.ajax({
      method: 'GET',
      url: window.theme.localeRootUrl + '/search?view=json',
      dataType: 'json',
      data: {
        q: this.headerInput.val() + '*',
        type: searchTypes.slice(1).join(',')
      }
    });

    $.when(firstSearch, lastSearch).then(function(data1, data2) {
      self.headerSearchResults.html(self.searchResultsTemplate({
        is_loading: false,
        split_search: true,
        on_sale_label: window.languages.productLabelsOnSale,
        has_products_results: (data1[0]['results'].length > 0),
        has_others_results: (data2[0]['results'].length > 0),
        products: {
          results: data1[0]['results'],
          results_count: data1[0]['results_count'],
          results_label: data1[0]['results_label'],
          results_url: (data1[0]['url'] + '&type=' + searchTypes[0])
        },
        others: {
          results: data2[0]['results'],
          results_count: data2[0]['results_count'],
          results_label: data2[0]['results_label'],
          results_url: (data2[0]['url'] + '&type=' + searchTypes.slice(1).join(','))
        }
      }));
    });
  };

  Plugin.prototype._formSubmitted = function(event) {
    this.headerInput.val(this.headerInput.val() + '*');
    return true;
  };

  /**
   * Allow to give focus on an item while preserving scroll position
   */
  Plugin.prototype._cursorFocus = function(element) {
    var x = window.scrollX,
      y = window.scrollY;

    element.focus();
    window.scrollTo(x, y);
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle home slideshow
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkHomeSlideshow',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   * @constructor
   * @param {HTMLElement} element The element that will be monitored
   */
  function Plugin(element) {
    this.slideshow = $(element);
    this.slideshowAnchor = this.slideshow.find('.slideshow--anchor');
    this.slideshowAnchorSlides = this.slideshowAnchor.find('.slideshow__slide');
    this.slideshowMain = this.slideshow.find('.slideshow--main');
    this.slideshowMainSlides = this.slideshowMain.find('.slideshow__slide');
    this.slideshowSlidesCount = this.slideshowMainSlides.length;
    this.slideshowCount = this.slideshow.find('.slideshow__current-slide');
    this.slideshowButtons = this.slideshow.find('.slideshow__nav-button');
    this.hasTransitionPending = false;
    this.paused = false;

    this.slideshow.find('.slideshow__nav-next').on('click', $.proxy(this.nextSlide, this));
    this.slideshow.find('.slideshow__nav-prev').on('click', $.proxy(this.prevSlide, this));
    this.slideshow.on('swipeleft', $.proxy(this.nextSlide, this));
    this.slideshow.on('swiperight', $.proxy(this.prevSlide, this));

    // If we have the autoplay set up, we activate it
    this.hasAutoplay = (this.slideshow.attr('data-autoplay') === 'true');
    this.autoplayCycleSpeed = parseInt(this.slideshow.attr('data-cycle-speed'));

    if (this.hasAutoplay) {
      this._setupAutoplay();
    }

    // We simulate an initial change so that various events can be hooked up correctly
    var firstSlide = this.slideshowMainSlides.eq(0);
    this._didChange(firstSlide, firstSlide);
  }

  /**
   * Clear the memory and remove any listener
   */
  Plugin.prototype.destroy = function() {
    this.slideshow.off('swipeleft swiperight');
    this.slideshowButtons.off('click');
    clearInterval(this.timer);

    this.slideshow.removeData('plugin_trademarkHomeSlideshow');
  };

  /**
   * Move to the next slide
   */
  Plugin.prototype.nextSlide = function() {
    var currentAnchorSlide = this.slideshowAnchorSlides.filter('.slideshow__slide--active'),
      prevOrNextAnchorSlide = currentAnchorSlide.next('.slideshow__slide'),
      currentMainSlide = this.slideshowMainSlides.filter('.slideshow__slide--active'),
      prevOrNextMainSlide = currentMainSlide.next('.slideshow__slide');

    if (prevOrNextAnchorSlide.length === 0) {
      prevOrNextAnchorSlide = this.slideshowAnchorSlides.first();
    }

    if (prevOrNextMainSlide.length === 0) {
      prevOrNextMainSlide = (prevOrNextMainSlide.length !== 0) ? prevOrNextMainSlide : this.slideshowMainSlides.first();
    }

    this._move(currentAnchorSlide, prevOrNextAnchorSlide, currentMainSlide, prevOrNextMainSlide, 'next');

    return false;
  };

  /**
   * Move to the previous slide
   */
  Plugin.prototype.prevSlide = function() {
    var currentAnchorSlide = this.slideshowAnchorSlides.filter('.slideshow__slide--active'),
      prevOrNextAnchorSlide = currentAnchorSlide.prev('.slideshow__slide'),
      currentMainSlide = this.slideshowMainSlides.filter('.slideshow__slide--active'),
      prevOrNextMainSlide = currentMainSlide.prev('.slideshow__slide');

    if (prevOrNextAnchorSlide.length === 0) {
      prevOrNextAnchorSlide = this.slideshowAnchorSlides.last();
    }

    if (prevOrNextMainSlide.length === 0) {
      prevOrNextMainSlide = (prevOrNextMainSlide.length !== 0) ? prevOrNextMainSlide : this.slideshowMainSlides.last();
    }

    this._move(currentAnchorSlide, prevOrNextAnchorSlide, currentMainSlide, prevOrNextMainSlide, 'previous');

    return false;
  };

  /**
   * Move to a specific slide
   */
  Plugin.prototype.goToSlide = function(index) {
    var desiredIndex = parseInt(index) - 1,
      currentAnchorSlide = this.slideshowAnchorSlides.filter('.slideshow__slide--active'),
      prevOrNextAnchorSlide = this.slideshowAnchorSlides.eq(desiredIndex === 0 ? 1 : (desiredIndex + 1) % this.slideshowSlidesCount),
      currentMainSlide = this.slideshowMainSlides.filter('.slideshow__slide--active'),
      prevOrNextMainSlide = this.slideshowMainSlides.eq(desiredIndex),
      currentIndex = this.slideshowMainSlides.index(currentMainSlide);

    if (currentIndex === desiredIndex) {
      return;
    }

    this._move(currentAnchorSlide, prevOrNextAnchorSlide, currentMainSlide, prevOrNextMainSlide, (currentIndex > desiredIndex) ? 'previous' : 'next');

    return false;
  };

  /**
   * Pause the autoplay
   */
  Plugin.prototype.pause = function() {
    this.paused = true;
  };

  /**
   * Restart the autoplay
   */
  Plugin.prototype.play = function() {
    this.paused = false;
  };

  /**
   * Add the various classes to properly animate all the slides
   *
   * @param currentAnchorSlide
   * @param prevOrNextAnchorSlide
   * @param currentMainSlide
   * @param prevOrNextMainSlide
   * @param direction
   * @private
   */
  Plugin.prototype._move = function(currentAnchorSlide, prevOrNextAnchorSlide, currentMainSlide, prevOrNextMainSlide, direction) {
    if (this.hasTransitionPending) {
      return;
    }

    if (this.hasAutoplay && !this.paused) {
      this._clearAutoplay();
    }

    var self = this;

    this.slideshowButtons.attr('disabled', 'disabled');

    this._willChange(currentMainSlide, prevOrNextMainSlide);

    if (Modernizr.cssanimations) {
      var animationClasses = 'slideshow__slide--animating ' + (direction === 'next' ? 'slideshow__slide--animating-rtl' : 'slideshow__slide--animating-ltr');

      // 1st: add all the classes needed to trigger animations
      prevOrNextAnchorSlide.addClass(animationClasses);
      prevOrNextMainSlide.addClass(animationClasses);
      currentMainSlide.addClass('slideshow__slide--removing');
      currentAnchorSlide.addClass('slideshow__slide--removing');

      // 2nd: listen to the event to properly removing the classes when animations are over
      prevOrNextAnchorSlide.find('.slideshow__media-container').one('webkitAnimationEnd animationend', function() {
        prevOrNextAnchorSlide.removeClass(animationClasses).addClass('slideshow__slide--active');
        currentAnchorSlide.removeClass('slideshow__slide--active slideshow__slide--removing');
      });

      prevOrNextMainSlide.find('.slideshow__media').one('webkitAnimationEnd animationend', function() {
        prevOrNextMainSlide.removeClass(animationClasses).addClass('slideshow__slide--active');
        currentMainSlide.removeClass('slideshow__slide--active slideshow__slide--removing');

        self.slideshowCount.text(prevOrNextMainSlide.attr('data-slide-index'));
        self.slideshowButtons.removeAttr('disabled');

        self._didChange(currentMainSlide, prevOrNextMainSlide);
      });
    } else {
      prevOrNextAnchorSlide.addClass('slideshow__slide--active');
      currentAnchorSlide.removeClass('slideshow__slide--active');

      prevOrNextMainSlide.addClass('slideshow__slide--active');
      currentMainSlide.removeClass('slideshow__slide--active');

      this.slideshowCount.text(prevOrNextMainSlide.attr('data-slide-index'));
      this.slideshowButtons.removeAttr('disabled');

      this._didChange(currentMainSlide, prevOrNextMainSlide);
    }
  };

  /**
   * Callback that is called before the slide changes
   */
  Plugin.prototype._willChange = function(previousSlide, newSlide) {
    this.hasTransitionPending = true;
  };

  /**
   * Callback that is called after the slide has changed
   */
  Plugin.prototype._didChange = function(previousSlide, newSlide) {
    this.hasTransitionPending = false;

    if (this.hasAutoplay && !this.paused) {
      this._setupAutoplay();
    }
  };

  /**
   * Setup the autoplay which allows to automatically change slide
   */
  Plugin.prototype._setupAutoplay = function() {
    var self = this;

    // If there is a previous timer, clear it
    this._clearAutoplay();

    this.timer = setInterval(function() {
      if (!self.paused) {
        self.nextSlide();
      }
    }, this.autoplayCycleSpeed);
  };

  /**
   * Clear the autoplay
   */
  Plugin.prototype._clearAutoplay = function() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = null;
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle the main nav
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkMainNav',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   */
  function Plugin(element) {
    this.mainNav = $(element);
    this.mainNavLinks = this.mainNav.find('.header__link');

    // Improve accessibility of menu by adding classes when an item is on focus
    this.mainNavLinks.on('focusin', function() {
      $(this).addClass('header__link--focused');
    });

    this.mainNavLinks.on('focusout', function() {
      $(this).removeClass('header__link--focused');
    });

    // Add a listener to check if the main nav can fit and init it (only when the logo is positioned in the center)
    if (!this.mainNav.hasClass('header__main-nav--stretched')) {
      this.mainNavWidth = Math.ceil(this.mainNav.width() + 35);
      this._verifyOverlap();

      $(window).on('resize.trademarkMainNav', $.proxy(this._verifyOverlap, this));
    }

    // We need to handle the overlap
    this.mainNav.find('.nav-dropdown--first').on('mouseenter', function() {
      var windowWidth = window.innerWidth,
        item = $(this),
        nestedMenus = item.find('.nav-dropdown--second'),
        rightEdge = this.getBoundingClientRect().right,
        shouldOpenLeft = false;

      nestedMenus.each(function(index, item) {
        if ((rightEdge + item.offsetWidth) > windowWidth) {
          shouldOpenLeft = true;
          return false; // this allows to break from the each
        }
      });

      if (shouldOpenLeft) {
        nestedMenus.addClass('nav-dropdown--left');
      } else {
        nestedMenus.removeClass('nav-dropdown--left');
      }
    });
  }

  Plugin.prototype.destroy = function() {
    this.mainNavLinks.off('focusin focusout');
    this.mainNav.removeData('plugin_trademarkMainNav');

    $(window).off('.trademarkMainNav');
  };

  Plugin.prototype._verifyOverlap = function() {
    // We need to find if the main nav overlap the logo. To find out this, we get the right edge of the main nav, and verify it's not "after" the left
    // position of the logo (the +35 is to add a bit more space)
    var isOverlapping = this.mainNavWidth > Math.ceil($('.header__logo').position().left - $('.header__inner').position().left);

    // If it's overlapping, we use the mobile navigation instead
    if (isOverlapping) {
      this.mainNav.hide();
      $('.header__nav-toggle').removeClass('hidden-desk');
    } else {
      this.mainNav.show();
      $('.header__nav-toggle').addClass('hidden-desk');
    }

    $('.header').addClass('header--init');
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle the mini-cart
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkMiniCart',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   */
  function Plugin(element) {
    this.miniCart = $(element);
    this.announcementBar = $('.announcement-bar');
    this.header = $('.header');
    this.headerCartCount = $('.header__cart-count');
    this.sidebarNav = $('.sidebar-nav');

    this.state = 'closed';

    this.body = $('body');
    this.pageOverlay = $('.page__overlay');

    this.body.on('click keypress', '[data-action="toggle-mini-cart"]', $.proxy(this._toggleMiniCart, this));
    this.miniCart.on('click', '[data-action="remove-line-item"]', $.proxy(this._removeLine, this));

    $(document).on('theme:cart:updated', $.proxy(this._cartUpdated, this));
    $(window).on('resize.trademarkMiniCart', $.proxy(this._computeMiniCartHeight, this));

    // We automatically re-render it a first time to solve a strange issue where adding a product in Ajax, going to Checkout and go back does not re-render
    // the very last version in Liquid
    this._rerender();

    if (Modernizr.csstransitions) {
      this.miniCart.on('transitionend', $.proxy(this._emitTransitionEvent, this));
    }
  }

  Plugin.prototype.destroy = function() {
    this.miniCart.removeData('plugin_trademarkMiniCart');
    this.miniCart.find('[data-action="remove-line-item"]').off('click');
    this.body.off('.trademarkMiniCart');

    $(document).off('theme:cart:updated');
    $(window).off('.trademarkMiniCart');
  };

  Plugin.prototype.getState = function() {
    return this.state;
  };

  Plugin.prototype._toggleMiniCart = function(event) {
    var self = this;

    // The mini-cart can be toggled using "Enter" key in keyboard as well
    if ((event.keyCode ? event.keyCode : event.which) == 13) {
      event.preventDefault(); // Prevent to follow the link
    }

    this._computeMiniCartHeight();

    this.miniCart.toggleClass('mini-cart--open');

    if (this.miniCart.hasClass('mini-cart--open')) {
      // Before opening, we must check if the nav sidebar is open. If that's the case we first close it
      var sidebarNavInstance = this.sidebarNav.data('plugin_trademarkMobileSidebar');

      if (sidebarNavInstance.state === 'opening' || sidebarNavInstance.state === 'opened') {
        sidebarNavInstance._toggleSidebar(event);
      }

      this.state = 'opening';
      $(document).trigger('opening.trademarkMiniCart');

      this.body.addClass('no-scroll');
      this.pageOverlay.addClass('page__overlay--open');

      if (!Modernizr.csstransitions) {
        this.state = 'opened';
        $(document).trigger('opened.trademarkMiniCart');
      }

      this.miniCart.one('transitionend', function() {
        self.miniCart.focus(); // Allows to give focus for better accessibility on keyboard
      });

      this.body.on('keyup.trademarkMiniCart', function(outsideEvent) {
        if (outsideEvent.keyCode == 27) {
          self._toggleMiniCart(outsideEvent);
        }
      });

      this.body.on('click.trademarkMiniCart', function(outsideEvent) {
        if (!$(outsideEvent.target).closest('#shopify-section-header').length) {
          self._toggleMiniCart(outsideEvent);
        }
      });
    } else {
      this.state = 'closing';
      $(document).trigger('closing.trademarkMiniCart');

      this.body.removeClass('no-scroll');
      this.body.off('.trademarkMiniCart');
      this.pageOverlay.removeClass('page__overlay--open');

      if (!Modernizr.csstransitions) {
        this.state = 'closed';
        $(document).trigger('closed.trademarkMiniCart');
      }
    }

    event.preventDefault();
  };

  Plugin.prototype._cartUpdated = function(event, cart, forceOpening) {
    this.headerCartCount.text(cart['item_count']);

    // We only re-render the cart from server. Since automatic discount can alter the lines as well as the total,
    // it is easier to simply re-render from the source
    this._rerender();

    if (forceOpening) {
      this._toggleMiniCart(event);
    }
  };

  Plugin.prototype._removeLine = function(event) {
    var target = $(event.currentTarget),
      variantId = target.attr('data-variant-id'),
      lineItem = target.closest('.mini-cart__item-wrapper'),
      items = target.closest('.mini-cart__items');

    items.addClass('mini-cart__items--loading');

    $.ajax({
      method: 'POST',
      url: window.theme.localeRootUrl + '/cart/change.js',
      dataType: 'json',
      data: {
        quantity: 0,
        id: variantId
      }
    }).then(function(newCart) {
      items.removeClass('mini-cart__items--loading');
      lineItem.slideUp(250, function() {$(this).remove();});

      $(document).trigger('theme:cart:updated', [newCart, false, false]);
    });

    event.preventDefault();
  };

  /**
   * Rerender each items of the mini cart
   *
   * @param cart
   * @private
   */
  Plugin.prototype._rerender = function() {
    // We render the alternate mini-cart template instead of rendering it in JavaScript. This allows app vendor to hook their own logic within the
    // mini-cart in pure Liquid
    var self = this;

    $.ajax(window.theme.localeRootUrl + '/cart?view=mini-cart').then(function(result) {
      var domResult = $(result),
        miniCartCount = domResult.attr('data-cart-item-count');

      self.miniCart.find('.mini-cart__inner').replaceWith(domResult.find('.mini-cart__inner'));
      self.headerCartCount.text(miniCartCount);
      self._computeMiniCartHeight();
    });
  };

  /**
   * Compute the correct mini-cart height (by taking into account things such as top bar, viewport...)
   */
  Plugin.prototype._computeMiniCartHeight = function() {
    // First, we need to get how much of the "top bar" (which is not fixed) is visible in the viewport
    var announcementBarVisibleHeight = 0,
      headerOuterHeight = this.header.outerHeight();

    if (this.announcementBar.length > 0) {
      var announcementBarHeight = this.announcementBar.height(),
        windowHeight = $(window).height(),
        rect = this.announcementBar[0].getBoundingClientRect();

      announcementBarVisibleHeight = Math.max(0, rect.top > 0 ? Math.min(announcementBarHeight, windowHeight - rect.top) : (rect.bottom < windowHeight ? rect.bottom : windowHeight));
    }

    this.miniCart.find('.mini-cart__inner').css('max-height', (window.innerHeight - headerOuterHeight - announcementBarVisibleHeight) + 'px');
  };

  /**
   * Callback called whenever the transition (animation of opening or closing) is ended so we can emit events for other parts of the system
   */
  Plugin.prototype._emitTransitionEvent = function(event) {
    if (event.originalEvent.propertyName !== 'transform') {
      return;
    }

    if (this.state === 'opening' || this.state === 'opened') {
      this.state = 'opened';
      $(document).trigger('opened.trademarkMiniCart');
    } else {
      this.state = 'closed';
      $(document).trigger('closed.trademarkMiniCart');
    }
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle the mobile sidebar
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkMobileSidebar',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   */
  function Plugin(element) {
    this.sidebarNav = $(element);
    this.announcementBar = $('.announcement-bar');
    this.header = $('.header');
    this.headerNavToggle = this.header.find('[data-action="toggle-mobile-sidebar"]');
    this.miniCart = $('.mini-cart');

    this.state = 'closed';

    this.body = $('body');
    this.pageOverlay = $('.page__overlay');

    this.headerNavToggle.on('click.trademarkMobileSidebar', $.proxy(this._toggleSidebar, this));
    this.sidebarNav.find('[data-action="toggle-mobile-sub-menu"]').on('click.trademarkMobileSidebar', $.proxy(this._toggleSubMenu, this));

    $(window).on('resize.trademarkMobileSidebar', $.proxy(this._computeSidebarHeight, this));

    if (Modernizr.csstransitions) {
      this.sidebarNav.on('transitionend', $.proxy(this._emitTransitionEvent, this));
    }
  }

  Plugin.prototype.destroy = function() {
    this.header.find('[data-action="toggle-mobile-sidebar"]').off('click');
    this.sidebarNav.find('[data-action="toggle-mobile-sub-menu"]').off('click');
    this.body.off('.trademarkMobileSidebar');
    $(window).off('.trademarkMobileSidebar');

    this.sidebarNav.removeData('plugin_trademarkMobileSidebar');
  };

  Plugin.prototype.getState = function() {
    return this.state;
  };

  /**
   * Tgogle the navigation sidebar
   */
  Plugin.prototype._toggleSidebar = function(event) {
    var self = this;

    this.headerNavToggle.toggleClass('header__nav-toggle--open');

    this._computeSidebarHeight();
    this.sidebarNav.toggleClass('sidebar-nav--open');

    if (this.sidebarNav.hasClass('sidebar-nav--open')) {
      // Before opening, we must check if the mini-cart is open. If that's the case we first close it
      var miniCartInstance = this.miniCart.data('plugin_trademarkMiniCart');

      if (undefined !== miniCartInstance && (miniCartInstance.state === 'opening' || miniCartInstance.state === 'opened')) {
        miniCartInstance._toggleMiniCart(event);
      }

      this.state = 'opening';
      $(document).trigger('opening.trademarkMobileSidebar');

      this.body.addClass('no-scroll');
      this.pageOverlay.addClass('page__overlay--open');

      this.body.on('click.trademarkMobileSidebar', function(outsideEvent) {
        if (!$(outsideEvent.target).closest('#shopify-section-header').length) {
          self._toggleSidebar(outsideEvent);
        }
      });

      if (!Modernizr.csstransitions) {
        this.state = 'opened';
        $(document).trigger('opened.trademarkMobileSidebar');
      }
    } else {
      this.state = 'closing';
      $(document).trigger('closing.trademarkMobileSidebar');

      this.body.removeClass('no-scroll');
      this.body.off('.trademarkMobileSidebar');
      this.pageOverlay.removeClass('page__overlay--open');

      if (!Modernizr.csstransitions) {
        this.state = 'closed';
        $(document).trigger('closed.trademarkMobileSidebar');
      }
    }

    event.preventDefault();
  };

  /**
   * Toggle a submenu
   */
  Plugin.prototype._toggleSubMenu = function(event) {
    var buttonContainer = $(event.target),
      sidebarMenu = buttonContainer.closest('li').find('> .sidebar-nav__sub-links');

    buttonContainer.attr('aria-expanded', function(index, attr) {return attr === 'true' ? 'false' : 'true'})
      .find('.plus-button').toggleClass('plus-button--active');
    sidebarMenu.slideToggle();

    event.preventDefault();
  };

  /**
   * Compute the correct sidebar height (by taking into account things such as top bar, viewport...)
   */
  Plugin.prototype._computeSidebarHeight = function() {
    // First, we need to get how much of the "top bar" (which is not fixed) is visible in the viewport
    var announcementBarVisibleHeight = 0,
      headerOuterHeight = this.header.outerHeight();

    if (this.announcementBar.length > 0) {
      var announcementBarHeight = this.announcementBar.height(),
        windowHeight = $(window).height(),
        rect = this.announcementBar[0].getBoundingClientRect();

      announcementBarVisibleHeight = Math.max(0, rect.top > 0 ? Math.min(announcementBarHeight, windowHeight - rect.top) : (rect.bottom < windowHeight ? rect.bottom : windowHeight));
    }

    this.sidebarNav.css('max-height', (window.innerHeight - headerOuterHeight - announcementBarVisibleHeight) + 'px');
  };

  /**
   * Callback called whenever the transition (animation of opening or closing) is ended so we can emit events for other parts of the system
   */
  Plugin.prototype._emitTransitionEvent = function(event) {
    if (event.originalEvent.propertyName !== 'transform') {
      return;
    }

    this._cursorFocus(this.sidebarNav); // Give the focus to the sidebar for easier keyboard navigation

    if (this.state === 'opening' || this.state === 'opened') {
      this.state = 'opened';
      $(document).trigger('opened.trademarkMobileSidebar');
    } else {
      this.state = 'closed';
      $(document).trigger('closed.trademarkMobileSidebar');
    }
  };

  /**
   * Allow to give focus on an item while preserving scroll position
   */
  Plugin.prototype._cursorFocus = function(element) {
    var x = window.scrollX,
      y = window.scrollY;

    element.focus();
    window.scrollTo(x, y);
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle product update
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkProduct',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   * @constructor
   * @param {HTMLElement} element The element that will be monitored
   * @param {Object} options
   */
  function Plugin(element, options) {
    this.element = $(element);

    this._init(options);
  }

  Plugin.prototype._init = function(options) {
    this.product = options['product'];
    this.enableHistoryState = options['enableHistoryState'];
    this.optionsWithValues = options['optionsWithValues'];
    this.allowSelectingSoldOutVariants = options['allowSelectingSoldOutVariants'];
    this.context = options['context'] || null;
    this.singleOptionSelectors = this.element.find('.single-option-selector');
    this.dataSelectors = this.element.find('[data-selector-type]').toArray();
    this.masterSelector = this.element.find('#product-select-' + options['product']['id']);
    this.productSlides = this.element.find('.product__slides');
    this.productPrices = this.element.find('.product__prices');
    this.addToCartButton = this.element.find('.product__add-to-cart');
    this.quantitySelector = this.element.find('.quantity-selector');

    this.currentVariant = this._getVariantFromOptions();

    this.singleOptionSelectors.on('change', $.proxy(this._onSelectorChanged, this));
    this.quantitySelector.find('[data-action="decrease-product-quantity"]').on('click', $.proxy(this._decreaseProductQuantity, this));
    this.quantitySelector.find('[data-action="increase-product-quantity"]').on('click', $.proxy(this._increaseProductQuantity, this));

    // In order to improve accessibility in keyboard, we allow to update swatches when pressing the Enter key over a label
    this.singleOptionSelectors.next('label').on('keypress', function(e) {
      if ((e.keyCode ? e.keyCode : e.which) == 13) {
        $(this).trigger('click');
      }
    });

    // If Ajax cart is enabled we add some more listeners to add product in the background
    
      this.addToCartButton.on('click', $.proxy(this._addToCart, this));
    
  };

  Plugin.prototype.destroy = function() {
    this.singleOptionSelectors.off('change');
    this.singleOptionSelectors.next('label').off('keypress');
    this.addToCartButton.off('click');
    this.quantitySelector.find('[data-action="decrease-product-quantity"]').off('click');
    this.quantitySelector.find('[data-action="increase-product-quantity"]').off('click');

    this.element.removeData('plugin_trademarkProduct');
  };

  /**
   * ---------------------------------------------------------------------------------------------------
   * CODE THAT HANDLE PRODUCT OPERATIONS
   * ---------------------------------------------------------------------------------------------------
   */

  Plugin.prototype._decreaseProductQuantity = function(event) {
    var currentQuantity = this.quantitySelector.find('.quantity-selector__current-quantity'),
      currentQuantityAsNumber = parseInt(currentQuantity.text());

    // Do nothing if it's already one...
    if (currentQuantityAsNumber === 1) {
      event.preventDefault();
      return;
    }

    var newQuantity = currentQuantityAsNumber - 1;

    currentQuantity.text(newQuantity);

    this.element.find('[name="quantity"]').val(newQuantity);

    event.preventDefault();
  };

  Plugin.prototype._increaseProductQuantity = function(event) {
    var currentQuantity = this.quantitySelector.find('.quantity-selector__current-quantity'),
      currentQuantityAsNumber = parseInt(currentQuantity.text()),
      newQuantity = currentQuantityAsNumber + 1;

    currentQuantity.text(newQuantity);

    this.element.find('[name="quantity"]').val(newQuantity);

    event.preventDefault();
  };

  /**
   * ---------------------------------------------------------------------------------------------------
   * CODE THAT HANDLE VARIANT CHANGES IN THE FRONT
   * ---------------------------------------------------------------------------------------------------
   */

  /**
   * Whenever the variant changes, we have several things to update: the slideshow image, the prices,
   * the labels...
   */
  Plugin.prototype._onVariantChanged = function(previousVariant, newVariant) {
    // 1st: the slideshow
    this._updateSlideshowImage(previousVariant, newVariant);

    // 2st: the prices
    this._updateProductPrices(previousVariant, newVariant);

    // 2st: the unit prices
    this._updateProductUnitPrices(previousVariant, newVariant);

    // 4rd: update the variant dropdowns
    this._updateSelectors(previousVariant, newVariant);

    // 5th: the add to cart button
    this._updateAddToCartButton(previousVariant, newVariant);
  };

  /**
   * Switch to the correct slideshow image
   */
  Plugin.prototype._updateSlideshowImage = function(previousVariant, newVariant) {
    if (!newVariant || !newVariant['featured_media']) {
      return;
    }

    if (this.productSlides.length > 0) {
      this.productSlides.slick(
        'slickGoTo',
        parseInt(this.productSlides.find('[data-media-id="' + newVariant['featured_media']['id'] + '"]').attr('data-media-position'))
      );
    }

    if (this.context === 'homepage') {
      this.element.find('.product__featured-image[data-media-id="' + newVariant['featured_media']['id'] + '"]').show()
        .siblings().hide();
    }
  };

  /**
   * Update the prices. If the variant does not exist, we hide the prices completely
   */
  Plugin.prototype._updateProductPrices = function(previousVariant, newVariant) {
    if (!newVariant) {
      this.productPrices.each(function(index, element) {
        var parent = $(element).parent();

        if (parent.hasClass('form__control')) {
          parent.hide();
        } else {
          $(element).hide();
        }
      });
    } else {
      if (previousVariant && (previousVariant['price'] === newVariant['price']) && (previousVariant['compare_at_price'] === newVariant['compare_at_price'])) {
        return;
      }

      this.productPrices.empty();

      if (newVariant['compare_at_price'] > newVariant['price']) {
        this.productPrices.append('<span class="product__price product__price--new h4" data-money-convertible>' + Shopify.formatMoney(newVariant['price'], window.theme.moneyFormat) + '</span>');
        this.productPrices.append('<span class="product__price product__price--old h4" data-money-convertible>' + Shopify.formatMoney(newVariant['compare_at_price'], window.theme.moneyFormat) + '</span>');
      } else {
        this.productPrices.append('<span class="product__price h4" data-money-convertible>' + Shopify.formatMoney(newVariant['price'], window.theme.moneyFormat) + '</span>');
      }

      this.productPrices.show().parent().show();
    }
  };

  /**
   * Update the prices. If the variant does not exist, we hide the prices completely
   */
  Plugin.prototype._updateProductUnitPrices = function(previousVariant, newVariant) {
    var unitPriceMeasurement = this.element.find('.unit-price-measurement');

    if (!unitPriceMeasurement) {
      return; // Sometimes merchant remove element from the code without taking care of JS... so let's be defensive
    }

    if (!newVariant || !newVariant['unit_price_measurement']) {
      unitPriceMeasurement.parent().hide();
    } else {
      unitPriceMeasurement.parent().show();

      unitPriceMeasurement.find('.unit-price-measurement__price').html(Shopify.formatMoney(newVariant['unit_price'], window.theme.moneyFormat));
      unitPriceMeasurement.find('.unit-price-measurement__reference-unit').html(newVariant['unit_price_measurement']['reference_unit']);

      var unitPriceReferenceValue = unitPriceMeasurement.find('.unit-price-measurement__reference-value');
      unitPriceReferenceValue.html(newVariant['unit_price_measurement']['reference_value']);
      unitPriceReferenceValue.css('display', newVariant['unit_price_measurement']['reference_value'] === 1 ? 'none' : 'inline');
    }
  };

  /**
   * Update the selectors
   *
   * We have different kind of selectors: the size one, the color swatch and standard dropdown. When a new variant is selected, we must check the options
   * and prevent selection of unavailable and, if selected by the merchant, sold out variants
   */
  Plugin.prototype._updateSelectors = function(previousVariant, newVariant) {
    // No need to recompute the combinations if there is only one option
    if (!newVariant || this.product['options'].length <= 1) {
      return;
    }

    var option1 = newVariant['option1'],
      option2 = newVariant['option2'],
      option3 = newVariant['option3'],
      variantsCount = this.product['variants'].length;

    for (var i = 0 ; i != this.dataSelectors.length ; ++i) {
      var dataSelector = $(this.dataSelectors[i]),
        dataSelectorType = dataSelector.attr('data-selector-type'),
        optionIndex = (i + 1),
        optionValues = this.optionsWithValues[i]['values'];

      for (var j = 0 ; j != optionValues.length ; ++j) {
        var valueToCheck = optionValues[j],
          variantExists = false,
          allowVariantSelection = false,
          variantAvailable = false;

        if (optionIndex === 1) {
          for (var k = 0 ; k != variantsCount ; ++k) {
            var currentVariant = this.product['variants'][k];

            if (currentVariant['option1'] === valueToCheck && currentVariant['option2'] === option2 && currentVariant['option3'] === option3) {
              variantExists = true;
              variantAvailable = currentVariant['available'];

              break;
            }
          }
        } else if (optionIndex === 2) {
          for (var k = 0 ; k != variantsCount ; ++k) {
            var currentVariant = this.product['variants'][k];

            if (currentVariant['option1'] === option1 && currentVariant['option2'] === valueToCheck && currentVariant['option3'] === option3) {
              variantExists = true;
              variantAvailable = currentVariant['available'];

              break;
            }
          }
        } else if (optionIndex === 3) {
          for (var k = 0 ; k != variantsCount ; ++k) {
            var currentVariant = this.product['variants'][k];

            if (currentVariant['option1'] === option1 && currentVariant['option2'] === option2 && currentVariant['option3'] === valueToCheck) {
              variantExists = true;
              variantAvailable = currentVariant['available'];

              break;
            }
          }
        }

        if (variantExists) {
          if (variantAvailable || this.allowSelectingSoldOutVariants) {
            allowVariantSelection = true;
          }
        } else {
          allowVariantSelection = false;
        }

        if (dataSelectorType === 'size') {
          // For the size, we need to add the "product__size--unavailable" class and "disabled" to the input
          var sizeItem = dataSelector.find('.product__size').eq(j);

          if (allowVariantSelection) {
            sizeItem.removeClass('product__size--unavailable').find('> input').removeAttr('disabled')
              .next('label').attr('tabindex', 0);
          } else {
            sizeItem.addClass('product__size--unavailable').find('> input').attr('disabled', 'disabled')
              .next('label').removeAttr('tabindex');
          }
        } else if (dataSelectorType === 'color') {
          // For the color, we need to add the "product__color--unavailable" class and "disabled" to the input
          var colorItem = dataSelector.find('.product__color').eq(j);

          if (allowVariantSelection) {
            colorItem.removeClass('product__color--unavailable').find('> input').removeAttr('disabled')
              .next('label').attr('tabindex', 0);
          } else {
            colorItem.addClass('product__color--unavailable').find('> input').attr('disabled', 'disabled')
              .next('label').removeAttr('tabindex');
          }
        } else if (dataSelectorType === 'select') {
          // For the select, we need to add disabled to the option
          var optionItem = dataSelector.find('option').eq(j);

          if (allowVariantSelection) {
            optionItem.removeAttr('disabled');
          } else {
            optionItem.attr('disabled', 'disabled');
          }
        }
      }
    }
  };

  /**
   * Update the add to cart button
   */
  Plugin.prototype._updateAddToCartButton = function(previousVariant, newVariant) {
    // Check if we have payment button
    var smartPaymentButton = this.element.find('.shopify-payment-button');

    if (!newVariant) {
      this.addToCartButton.attr('disabled', 'disabled')
        .removeClass('button--primary')
        .addClass('button--secondary')
        .text(window.languages.productFormUnavailable);

      smartPaymentButton.hide();
    } else {
      if (newVariant['available']) {
        this.addToCartButton.removeAttr('disabled')
          .addClass('button--primary')
          .removeClass('button--secondary')
          .text(window.languages.productFormAddToCart);

        smartPaymentButton.show();
      } else {
        this.addToCartButton.attr('disabled', 'disabled')
          .removeClass('button--primary')
          .addClass('button--secondary')
          .text(window.languages.productFormSoldOut);

        smartPaymentButton.hide();
      }
    }
  };

  /**
   * ---------------------------------------------------------------------------------------------------
   * INTERNAL CODE THAT HANDLE VARIANT CHANGES
   * ---------------------------------------------------------------------------------------------------
   */

  /**
   * This call back is called whenever a property in one of the select or radio button has changed
   */
  Plugin.prototype._onSelectorChanged = function() {
    var previousVariant = this.currentVariant;

    this.currentVariant = this._getVariantFromOptions();
    this._onVariantChanged(previousVariant, this.currentVariant);

    if (this.currentVariant) {
      if (this.enableHistoryState) {
        this._updateHistoryState(this.currentVariant);
      }

      // We need to modify the hidden select that contain the id attribute as well
      this.masterSelector.find('[selected]').removeAttr('selected');
      this.masterSelector.find('[value="' + this.currentVariant['id'] + '"]').prop('selected', true);
    }

    // We also trigger an event so that other system can hookup and perform additional changes
    $(document).trigger('variant_changed.product', this.currentVariant);
  };

  /**
   * Update the HTML history state
   */
  Plugin.prototype._updateHistoryState = function(variant) {
    if (!history.replaceState) {
      return;
    }

    var newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
    window.history.replaceState({path: newUrl}, '', newUrl);
  };

  /**
   * Get the variant that is currently selected
   */
  Plugin.prototype._getVariantFromOptions = function() {
    var selectedValues = this._getCurrentOptions();
    var variants = this.product['variants'];
    var found = false;

    variants.forEach(function(variant) {
      var satisfied = true;

      selectedValues.forEach(function(option) {
        if (satisfied) {
          satisfied = (option.value === variant[option.index]);
        }
      });

      if (satisfied) {
        found = variant;
      }
    });

    return found || null;
  };

  /**
   * Extract all the current options
   */
  Plugin.prototype._getCurrentOptions = function() {
    var currentOptions = this.singleOptionSelectors.toArray().map(function(element) {
      var $element = $(element),
        type = $element.attr('type'),
        index = $element.attr('data-option-index');

      if (type === 'radio' || type === 'checkbox') {
        if ($element[0].checked) {
          return {value: $element.val(), index: index};
        } else {
          return false;
        }
      } else {
        return {value: $element.val(), index: index};
      }
    });

    // remove any unchecked input values if using radio buttons or checkboxes

    return currentOptions.filter(function(item) {
      return item;
    });
  };

  /**
   * ---------------------------------------------------------------------------------------------------
   * INTERNAL CODE THAT HANDLE PRODUCT ADD TO CART
   * ---------------------------------------------------------------------------------------------------
   */

  Plugin.prototype._addToCart = function(event) {
    var self = this;

    // First, we switch the status of the button to display the spinner
    this.addToCartButton.attr('disabled', 'disabled').addClass('button--loading');

    // Then we add the product in Ajax
    $.ajax({
      method: 'POST',
      url: window.theme.localeRootUrl + '/cart/add.js',
      dataType: 'json',
      data: this.element.find('form[action*="/cart/add"]').serialize()
    }).then(function() {
      $.ajax({
        method: 'GET',
        url: window.theme.localeRootUrl + '/cart.js',
        dataType: 'json'
      }).then(function(cart) {
        // Last parameter set to true allow to indicate the cart to force open the mini-cart)
        $(document).trigger('theme:cart:updated', [cart, true, true]);
        self.addToCartButton.removeAttr('disabled').removeClass('button--loading');
      });
    }).catch(function(error) {
      // If there is an error while adding (usually if all products are added to the cart), we temporarily
      // display the message from Shopify, and then revert to the original message after 2 seconds
      var errorMessage = error.responseJSON['description'];

      self.addToCartButton.text(errorMessage)
        .removeAttr('disabled')
        .removeClass('button--loading');

      setTimeout(function() {
        self.addToCartButton.text(window.languages.productFormAddToCart);
      }, 2500);
    });

    event.preventDefault();
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle tabs
 */

(function ($) {

  'use strict';

  var pluginName = 'trademarkTabs',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   */
  function Plugin(element, options) {
    this.element = $(element);
    this.navItems = this.element.find('.tabs__nav-item');
    this.content = this.element.find('.tabs__content');
    this.contentItems = this.content.find('.tabs__content-item');

    this.navItems.on('click', $.proxy(this._changeTab, this));

    var tabsNav = this.element.find('.tabs__nav-inner'),
      tabsNavElem = tabsNav.get(0);

    tabsNavElem.classList[tabsNavElem.scrollWidth - tabsNavElem.clientWidth - tabsNavElem.scrollLeft > 20 ? 'add' : 'remove']('tabs__nav-inner--shadowed-right');

    tabsNav.on('scroll', function() {
      this.classList[this.scrollLeft > 20 ? 'add' : 'remove']('tabs__nav-inner--shadowed-left');
      this.classList[this.scrollWidth - this.clientWidth - this.scrollLeft > 20 ? 'add' : 'remove']('tabs__nav-inner--shadowed-right');
    });
  }

  Plugin.prototype.destroy = function() {
    this.navItems.off('click');

    this.element.removeData('plugin_trademarkTabs');
  };

  Plugin.prototype._changeTab = function(event) {
    var target = $(event.target),
      currentItem = this.contentItems.filter('.tabs__content-item--active'),
      newItem = this.contentItems.eq(target.index()),
      self = this;

    // Set the current height to the container, so that animation can be done
    this.content.css('height', currentItem.height());

    // Change the active nav item
    target.siblings().removeClass('tabs__nav-item--active').end().addClass('tabs__nav-item--active');

    currentItem.removeClass('tabs__content-item--active');
    newItem.addClass('tabs__content-item--active');

    // Set the height of the new item for the parent to trigger CSS3 animation
    this.content.css('height', newItem.height());

    // Then, make sure to remove the hard-coded height to allow change in height inside the container
    if (Modernizr.cssanimations) {
      this.content.one('webkitAnimationEnd animationend', function() {
        self.content.css('height', '');
      });
    } else {
      this.content.css('height', '');
    }

    event.preventDefault();
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));
/**
 * Plugin to handle all the dynamic features of a product
 */

(function ($) {

  'use strict';

  var pluginName = 'valuePicker',
    namespace = 'plugin_' + pluginName;

  /**
   * The Plugin constructor
   * @constructor
   * @param {HTMLElement} element The element that will be monitored
   * @param {object} options The plugin options
   */
  function Plugin(element, options) {
    $(document).on('click', '[data-action="open-value-picker"]', this._toggleValuePicker.bind(this));
    $(document).on('click', '[data-action="close-value-picker"]', this._closeValuePicker.bind(this));
  }

  Plugin.prototype._toggleValuePicker = function(event) {
    var $target = $(event.currentTarget),
      isClosed = ($target.attr('aria-expanded') === 'false');

    $target.attr('aria-expanded', isClosed ? 'true' : 'false');
    $('#' + $target.attr('aria-controls')).attr('aria-hidden', isClosed ? 'false' : 'true');

    // If it's now open, we attach a listener to detect if we loose the focus
    if ($target.attr('aria-expanded') === 'true') {
      var closestWrapper = $target.closest('.value-picker-wrapper'),
        self = this;

      closestWrapper.on('focusout', function(event) {
        if (!closestWrapper.get(0).contains(event.relatedTarget)) {
          self._closeByValueWrapper($(event.currentTarget));
        }
      });
    }
  };

  Plugin.prototype._closeValuePicker = function(event) {
    var $target = $(event.currentTarget);
    $('[data-action="open-value-picker"][aria-controls="' + $target.attr('aria-controls') + '"]').attr('aria-expanded', 'false');
    $('#' + $target.attr('aria-controls')).attr('aria-hidden', 'true');
  };

  Plugin.prototype._closeByValueWrapper = function(target) {
    target.find('[data-action="open-value-picker"]').attr('aria-expanded', 'false');
    target.find('.value-picker').attr('aria-hidden', 'true');
    target.off('focusout');
  };

  /**
   * Init the plugin
   */
  Plugin.prototype._init = function() {
  };

  $.fn[pluginName] = function(options) {
    var method = false,
      methodArgs = arguments;

    if (typeof options == 'string') {
      method = options;
    }

    return this.each(function() {
      var plugin = $.data(this, namespace);

      if (!plugin && !method) {
        $.data(this, namespace, new Plugin(this, options));
      } else if (method) {
        callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
      }
    });
  };
}(jQuery));

var router = new RouterRouter();

router.route('*all', function() {
  var bodyElement = $('body');

  /**
   * -------------------------
   * VALUE PICKER
   * -------------------------
   */

  $(document).valuePicker();

  /**
   * -------------------------
   * STICKY HEADER POLYFILL AND HEADER SIZE
   * -------------------------
   */

  (function() {
    var headerSection = $('.shopify-section__header');

    Stickyfill.add(headerSection.get(0));
    $('.anchor').css('top', -headerSection.height());

    $(document).on('shopify:section:unload', '#shopify-section-header', function(event) {
      Stickyfill.remove(event.target);
    });

    $(document).on('shopify:section:load', '#shopify-section-header', function(event) {
      Stickyfill.add(event.target);
    });
  }());

  /**
   * -------------------------
   * MOBILE/TABLET NAVIGATION
   * -------------------------
   */

  (function() {
    $('.sidebar-nav').trademarkMobileSidebar();

    $(document).on('shopify:section:unload', '#shopify-section-header', function(event) {
      $(event.target).find('.sidebar-nav').data('plugin_trademarkMobileSidebar').destroy();
    });

    $(document).on('shopify:section:load', '#shopify-section-header', function(event) {
      $(event.target).find('.sidebar-nav').trademarkMobileSidebar();
    });
  }());

  /**
   * -------------------------
   * MAIN NAVIGATION (ACCESSIBILITY)
   * -------------------------
   */

  (function() {
    $('.header__main-nav').trademarkMainNav();

    $(document).on('shopify:section:unload', '#shopify-section-header', function(event) {
      $(event.target).find('.header__main-nav').data('plugin_trademarkMainNav').destroy();
    });

    $(document).on('shopify:section:load', '#shopify-section-header', function(event) {
      $(event.target).find('.header__main-nav').trademarkMainNav();
    });
  }());

  /**
   * -------------------------
   * MINI-CART
   * -------------------------
   */

  (function() {
    
      $('.mini-cart').trademarkMiniCart();

      $(document).on('shopify:section:unload', '#shopify-section-header', function(event) {
        $(event.target).find('.mini-cart').data('plugin_trademarkMiniCart').destroy();
      });

      $(document).on('shopify:section:load', '#shopify-section-header', function(event) {
        $(event.target).find('.mini-cart').trademarkMiniCart();
      });
    
  }());

  /**
   * -------------------------
   * SEARCH
   * Note that search initialization must happen after mini-cart and sidebar, as it relies on the existence of those two
   * -------------------------
   */

  (function() {
    $('.header-search').trademarkHeaderSearch();

    $(document).on('shopify:section:unload', '#shopify-section-header', function(event) {
      $(event.target).find('.header-search').data('plugin_trademarkHeaderSearch').destroy();
    });

    $(document).on('shopify:section:load', '#shopify-section-header', function(event) {
      $(event.target).find('.header-search').trademarkHeaderSearch();
    });
  }());

  /**
   * -------------------------
   * RTE (FOR PAGE THAT CONTAINED USER DEFINED TEXT, WE DO SOME POST-PROCESSING
   * -------------------------
   */

  (function() {
    // 1st: wrap tables
    $('.rte table').addClass('table').wrap('<div class="table-wrapper"></div>');

    // 2nd: wrap videos
    var iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]');
    var iframeReset = iframeVideo.add('.rte iframe#admin_bar_iframe');

    iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="video-wrapper"></div>');
    });

    iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }());

  /**
   * -------------------------
   * FEATURED COLLECTIONS
   * -------------------------
   */

  (function() {
    if (!Modernizr.touchevents || Modernizr.mq('(min-width: 1024px)')) {
      bodyElement.on('mouseenter mouseleave', '.collection-item', function() {
        $(this).toggleClass('collection-item--hovered').find('.collection-item__bottom').slideToggle({duration: 250});
      });
    }
  }());

  /**
   * ----------------------------
   * FEATURED MAP
   * ----------------------------
   */

  (function() {
    $('.featured-map').trademarkMap();

    $(document).on('shopify:section:load', '.shopify-section__featured-map', function(event) {
      $(event.target).find('.featured-map').trademarkMap();
    });

    $(document).on('shopify:section:unload', '.shopify-section__featured-map', function(event) {
      $(event.target).find('.featured-map').data('plugin_trademarkMap').destroy();
    });
  }());

  /**
   * -------------------------
   * TWITTER
   * -------------------------
   */

  (function() {
    var initTwitter = function(domElement) {
      if (domElement.length === 0) {
        return;
      }

      window.twttr = (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {}; if (d.getElementById(id)) return t; js = d.createElement(s);
        js.id = id; js.src = "https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); t._e = []; t.ready = function(f) {t._e.push(f);};
        return t;
      }(document, "script", "twitter-wjs"));

      var twitterHandle = domElement.attr('data-twitter-handle');

      twttr.ready(function () {
        twttr.widgets.createTimeline(
          {
            sourceType: 'profile',
            screenName: twitterHandle
          },
          document.getElementById('twitter-timeline'),
          {
            tweetLimit: 1,
            lang: window.theme.locale || 'en',
            chrome: 'noheader nofooter noborders transparent noscrollbar'
          }
        ).then(function (result) {
          // Twitter return the results in an iframe, so we need to parse the code to extract what we want

          var content = $(result).contents(),
            twitterModule = $('.tweet');

          twitterModule.find('.tweet__content').html(content.find('.timeline-Tweet-text'));
          twitterModule.find('.tweet__date').text(content.find('.timeline-Tweet-timestamp .dt-updated').attr('aria-label'));
        });
      });
    };

    initTwitter($('.footer [data-twitter-handle]'));

    $(document).on('shopify:section:load', '#shopify-section-footer', function(event) {
      initTwitter($(event.target).find('[data-twitter-handle]'));
    });
  }());

  /**
   * -------------------------
   * MARKETING POPUP
   * -------------------------
   */

  (function() {
    var popupModalInstance = null;

    var initPopup = function(element) {
      if (element.length === 0 || Modernizr.mq('(max-width: 559px)')) {
        return;
      }

      popupModalInstance = element.remodal({
        hashTracking: (window.theme.template !== null),
        appendTo: '#shopify-section-popup'
      });

      setTimeout(function() {
        // We save into the cookie in order to avoid annoying the user
        if (popupModalInstance.getState() === 'closed' && !$.cookie('theme_popup_seen') && element.attr('data-visible') === 'true') {
          popupModalInstance.open();
        }

        $.cookie('theme_popup_seen', true, {expires: parseInt(element.attr('data-remember-me')) });
      }, parseInt(element.attr('data-delay')));
    };

    initPopup($('.promotion-popup'), false);

    $(document).on('shopify:section:select', '#shopify-section-popup', function() {
      if (popupModalInstance && popupModalInstance.getState() !== 'opened') {
        popupModalInstance.open();
      }
    });

    $(document).on('shopify:section:deselect', '#shopify-section-popup', function() {
      if (popupModalInstance) {
        popupModalInstance.close();
      }
    });

    $(document).on('shopify:section:load', '#shopify-section-popup', function(event) {
      initPopup($(event.target).find('.promotion-popup'));
    });
  })();

  /**
   * -------------------------
   * FAQ PAGE (we can't know in advance the exact URLs, so those are handled here as well)
   * -------------------------
   */

  (function() {
    bodyElement.on('click', '.faq__question', function() {
      $(this).next('.faq__answer').slideToggle(150);
    });

    $(document).on('shopify:block:select', '#shopify-section-page-faq-template', function(event) {
      $(event.target).find('.faq__answer').slideDown(150);
    });

    $(document).on('shopify:block:deselect', '#shopify-section-page-faq-template', function(event) {
      $(event.target).find('.faq__answer').slideUp(150);
    });
  }());
});
router.route('(:lang/)blogs/*blog/*article', function() {
  /**
   * -------------------------
   * STICKY SHARE BUTTONS
   * -------------------------
   */

  (function() {
    var header = $('#shopify-section-header'),
      shareButtons = $('.article__body .share-buttons');

    shareButtons.css('top', header.height() + 20);
    shareButtons.Stickyfill();
  }());
});
router.route('(:lang/)blogs/*blog', function() {
});
router.route('(:lang/)cart', function() {
  /**
   * -------------------------
   * CART NOTE
   * -------------------------
   */

  $('.cart__note').on('change', function() {
    $.ajax({
      method: 'POST',
      url: window.theme.localeRootUrl + '/cart/update.js',
      data: {
        note: $(this).val()
      },
      dataType: 'json'
    });
  });

  /**
   * -------------------------
   * SHIPPING ESTIMATOR
   * -------------------------
   */

  (function() {
    var initShippingEstimator = function() {
      var shippingEstimator = $('.shipping-estimator');

      // If the estimator has been disabled, we do not need to attach all the other listeners
      if (shippingEstimator.length === 0) {
        return;
      }

      var shippingEstimatorForm = shippingEstimator.find('.shipping-estimator__form'),
        shippingEstimatorSubmit = shippingEstimator.find('.shipping-estimator__submit'),
        shippingEstimatorResults = shippingEstimator.find('.shipping-estimator__results'),
        shippingEstimatorList = shippingEstimatorResults.find('.shipping-estimator__list'),
        cartEstimatedShipping = $('.cart__shipping');

      $('.shipping-estimator--mobile .shipping-estimator__title').on('click', function() {
        $(this).next('.shipping-estimator__inner').slideToggle();
        $(this).closest('.shipping-estimator').toggleClass('shipping-estimator--active');
      });

      var submitShippingEstimatorForm = function(event) {
        shippingEstimatorSubmit.text(window.languages.shippingEstimatorSubmitting);

        $.ajax({
          method: 'GET',
          url: window.theme.localeRootUrl + '/cart/shipping_rates.json',
          data: $(event.currentTarget).closest('.shipping-estimator__form').find('input, select').serialize(),
          success: function(results) {
            shippingEstimatorList.empty();

            results['shipping_rates'].forEach(function(item) {
              var amount = Shopify.formatMoney(item['price'] * 100, window.theme.moneyFormat);
              shippingEstimatorList.append('<li class="shipping-estimator__item">' + item['name'] + ': <span data-money-convertible>' + amount + '</span></li>');
            });

            if (results['shipping_rates'].length > 0) {
              var firstPrice = Shopify.formatMoney(results['shipping_rates'][0]['price'] * 100, window.theme.moneyFormat);
              cartEstimatedShipping.html(window.languages.cartEstimatedShipping + ' ' + firstPrice);
            }
          },
          error: function(results) {
            shippingEstimatorList.empty();

            var response = results.responseJSON,
              errors = [];

            for (var key in response) {
              if (response.hasOwnProperty(key)) {
                errors.push({key: key, value: response[key][0]});
              }
            }

            errors.forEach(function(item) {
              shippingEstimatorList.append('<li class="shipping-estimator__item">' + item['key'] + ': ' + item['value'] + '</li>');
            });
          },
          complete: function(results) {
            shippingEstimatorSubmit.html(window.languages.shippingEstimatorSubmit);
            shippingEstimatorResults.show();
          }
        });

        event.preventDefault();
      };

      shippingEstimatorForm.on('keypress', function(event) {
        // If Enter is press, we submit the form
        if (event.keyCode == 13) {
          submitShippingEstimatorForm(event);
        }
      });

      $('.shipping-estimator__submit').on('click', function(event) {
        submitShippingEstimatorForm(event);
      });

      new Shopify.CountryProvinceSelector('address_country', 'address_province', {hideElement: 'address_province_container'});
      new Shopify.CountryProvinceSelector('address_country_mobile', 'address_province_mobile', {hideElement: 'address_province_container_mobile'});
    };

    initShippingEstimator();

    $(document).on('shopify:section:load', '#shopify-section-cart-template', function() {
      initShippingEstimator();
    });
  }());

  /**
   * -------------------------
   * RECOMMENDED PRODUCTS
   * -------------------------
   */

  (function() {
    var initProducts = function(domElement) {
      if (domElement.length === 0) {
        return;
      }

      domElement.slick({
        accessibility: false,
        dots: true,
        dotsClass: 'slider-dots',
        arrows: false,
        adaptiveHeight: true,
        mobileFirst: true,
        infinite: false,
        centerMode: true,
        centerPadding: '32px',
        slidesToShow: 1,
        initialSlide: Math.ceil(domElement.attr('data-slides-count') / 2) - 1,
        responsive: [
          {
            breakpoint: 560,
            settings: 'unslick'
          }
        ]
      })
    };

    initProducts($('.list-products'));

    $(document).on('shopify:section:unload', '.shopify-section__cart-related-products', function(event) {
      $(event.target).find('.list-products').slick('unslick');
    });

    $(document).on('shopify:section:load', '.shopify-section__cart-related-products', function(event) {
      initProducts($(event.target).find('.list-products'));
    });

    $(window).on('resize orientationChange', function() {
      if (window.innerWidth < 560) {
        // If not created yet, we create it
        var slick = $('.list-products');

        if (slick.slick('getSlick').unslicked) {
          initProducts(slick);
        }
      }
    });
  }());
});
router.route('(:lang/)collections/*type', function() {
  /**
   * -------------------------
   * SORT BY AND SEARCH
   * -------------------------
   */

  (function() {
    Shopify.queryParams = {};

    var bindFilters = function() {
      $('#collection-sort-by').on('change', function () {
        Shopify.queryParams.sort_by = $(this).val();
        location.search = $.param(Shopify.queryParams);
      });

      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');

          if (aKeyValue.length > 1) {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }

      $('#collection-tag-filter, #collection-type-filter').on('change', function (event) {
        window.location.href = $(event.currentTarget).find(':selected').val();
      });
    };

    bindFilters();

    $(document).on('shopify:section:load', function(event) {
      bindFilters();
    });
  }());
});
/**
 * ----------------------------------------------------------------------------------------------------
 * GIFT CARDS
 * ----------------------------------------------------------------------------------------------------
 */

router.route('(:lang/)gift_cards/*id', function() {
  (function() {
    var config = {
      qrCode: '#QrCode',
      printButton: '#PrintGiftCard',
      giftCardCode: '#GiftCardDigits'
    };

    var $qrCode = $(config.qrCode);

    new QRCode($qrCode[0], {
      text: $qrCode.attr('data-identifier'),
      width: 175,
      height: 175
    });

    $(config.printButton).on('click', function() {
      window.print();
    });

    // Auto-select gift card code on click, based on ID passed to the function
    $(config.giftCardCode).on('click', {element: 'GiftCardDigits'}, selectText);

    function selectText(evt) {
      var text = document.getElementById(evt.data.element);
      var range = '';

      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
      } else if (window.getSelection) {
        var selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }());
});
router.route('(:lang)', function(pattern) {
  if (pattern === 'search') {
    return;
  }

  /**
   * -------------------------
   * SLIDESHOW
   * -------------------------
   */

  (function() {
    var initFullScreenSlideshow = function(slideshow) {
      var slidesCount = slideshow.next('.fs-slideshow__slide-count'),
        slideshowProgressBarAdvancement = slideshow.nextAll('.fs-slideshow__progress-bar').find('.fs-slideshow__progress-bar-advancement');

      slideshow.slick({
        dots: false,
        arrow: true,
        pauseOnHover: false,
        accessibility: false,
        adaptiveHeight: true,
        useTransform: true,
        useCSS: true,
        autoplay: (slideshow.attr('data-autoplay') === 'true'),
        autoplaySpeed: parseInt(slideshow.attr('data-cycle-speed')),
        prevArrow: '<button aria-label="previous" class="fs-slideshow__nav-button fs-slideshow__nav-prev slick-prev"><svg class="icon icon-arrow-left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-left"></use></svg></button>',
        nextArrow: '<button aria-label="next" class="fs-slideshow__nav-button fs-slideshow__nav-next slick-next"><svg class="icon icon-arrow-right"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-right"></use></svg></button>'
      });

      slideshow.on('afterChange', function(event, slick, currentSlide) {
        if (slidesCount.length > 0) {
          slidesCount.find('.fs-slideshow__current-slide').text(currentSlide + 1); // Slick is 0-indexed
        }

        if (slideshowProgressBarAdvancement.length > 0) {
          slideshowProgressBarAdvancement.css('width', ((currentSlide + 1) / slick.slideCount * 100) + '%');
        }
      });
    };

    // Trademark has two different slideshows: a "dual" one that is quite complex and a full-screen that is simpler to implement. When this change,
    // we either init one or the other
    $('.slideshow-section').each(function(index, item) {
      var slideshowSection = $(item),
        slideshowType = slideshowSection.attr('data-slideshow-type');

      if (slideshowType === 'dual') {
        slideshowSection.find('.dual-slideshow').trademarkHomeSlideshow();
      } else {
        initFullScreenSlideshow(slideshowSection.find('.fs-slideshow__slides'));
      }
    });

    $(document).on('shopify:section:unload', '.shopify-section__slideshow', function(event) {
      var slideshowSection = $(event.target).find('.slideshow-section');

      // If previous slideshow was dual, we have to delete the plugin completely (which will free the memory)
      if (slideshowSection.attr('data-slideshow-type') === 'dual') {
        slideshowSection.find('.dual-slideshow').data('plugin_trademarkHomeSlideshow').destroy();
      } else {
        // Otherwise, logic is a bit simpler and we just call slick to delete
        slideshowSection.find('.fs-slideshow__slides').slick('unslick');
      }
    });

    $(document).on('shopify:section:load', '.shopify-section__slideshow', function(event) {
      var slideshowSection = $(event.target).find('.slideshow-section');

      // If slideshow is dual we need to instantiate the whole plugin, otherwise setup is simpler
      if (slideshowSection.attr('data-slideshow-type') === 'dual') {
        slideshowSection.find('.dual-slideshow').trademarkHomeSlideshow();
      } else {
        var slideshow = slideshowSection.find('.fs-slideshow__slides');

        initFullScreenSlideshow(slideshow);
      }
    });

    $(document).on('shopify:block:select', '.shopify-section__slideshow', function(event) {
      var slideshowSection = $(event.target).closest('.slideshow-section');

      if (slideshowSection.attr('data-slideshow-type') === 'dual') {
        var slideshow = slideshowSection.find('.dual-slideshow').data('plugin_trademarkHomeSlideshow');

        slideshow.pause();
        slideshow.goToSlide($(event.target).attr('data-slide-index'));
      } else {
        var slideshow = slideshowSection.find('.fs-slideshow__slides');

        slideshow.slick('goTo', $(event.target).attr('data-slide-index'));

        if (slideshow.attr('data-autoplay') === 'true') {
          slideshow.slick('pause');
        }
      }
    });

    $(document).on('shopify:block:deselect', '.shopify-section__slideshow', function(event) {
      var slideshowSection = $(event.target).closest('.slideshow-section');

      if (slideshowSection.attr('data-slideshow-type') === 'dual') {
        slideshowSection.find('.dual-slideshow').data('plugin_trademarkHomeSlideshow').play();
      } else {
        var slideshow = slideshowSection.find('.fs-slideshow__slides');

        if (slideshow.attr('data-autoplay') === 'true') {
          slideshow.slick('play');
        }
      }
    });
  }());

  /**
   * -------------------------
   * FEATURED COLLECTIONS
   * -------------------------
   */

  (function() {
    var initCollections = function(domElement) {
      if (domElement.length === 0) {
        return;
      }

      domElement.slick({
        accessibility: false,
        dots: true,
        dotsClass: 'slider-dots',
        arrows: false,
        mobileFirst: true,
        infinite: false,
        centerMode: true,
        centerPadding: '32px',
        initialSlide: Math.ceil(domElement.attr('data-slides-count') / 2) - 1,
        slidesToShow: 1,
        responsive: [
          {
            breakpoint: 560,
            settings: 'unslick'
          }
        ]
      })
    };

    initCollections($('.list-collections'));

    $(document).on('shopify:section:unload', '.shopify-section__collection-list', function(event) {
      $(event.target).find('.list-collections').slick('unslick');
    });

    $(document).on('shopify:section:load', '.shopify-section__collection-list', function(event) {
      initCollections($(event.target).find('.list-collections'));
    });

    $(document).on('shopify:block:select', '.shopify-section__collection-list', function(event) {
      $(event.target).closest('.list-collections').slick('slickGoTo', $(event.target).attr('data-slide-index'));
    });

    $(window).on('resize orientationChange', function() {
      if (window.innerWidth < 560) {
        // If not created yet, we create it
        var slick = $('.list-collections');

        if (slick.slick('getSlick').unslicked) {
          initCollections(slick);
        }
      }
    });
  }());

  /**
   * -------------------------
   * FEATURED PRODUCTS
   * -------------------------
   */

  (function() {
    var initProducts = function(domElement) {
      if (domElement.length === 0) {
        return;
      }

      domElement.slick({
        accessibility: false,
        dots: true,
        dotsClass: 'slider-dots',
        arrows: false,
        adaptiveHeight: true,
        mobileFirst: true,
        infinite: false,
        centerMode: true,
        centerPadding: '32px',
        slidesToShow: 1,
        initialSlide: Math.ceil(domElement.attr('data-slides-count') / 2) - 1,
        responsive: [
          {
            breakpoint: 560,
            settings: 'unslick'
          }
        ]
      })
    };

    initProducts($('.list-products'));

    $(document).on('shopify:section:unload', '.shopify-section__featured-collection', function(event) {
      $(event.target).find('.list-products').slick('unslick');
    });

    $(document).on('shopify:section:load', '.shopify-section__featured-collection', function(event) {
      initProducts($(event.target).find('.list-products'));
    });

    $(window).on('resize orientationChange', function() {
      if (window.innerWidth < 560) {
        // If not created yet, we create it
        var slick = $('.list-products');

        if (slick.slick('getSlick').unslicked) {
          initProducts(slick);
        }
      }
    });
  }());
});
/**
 * ----------------------------------------------------------------------------------------------------
 * LOGIN
 * ----------------------------------------------------------------------------------------------------
 */

router.route('(:lang/)account/login', function() {
  /**
   * -------------------------
   * SWITCH TO RECOVER FORM
   * -------------------------
   */

  (function() {
    var switchToRecoverForm = function() {
      $('#login-section, #recover-password-section').toggle();
      $('.page__title').text(window.languages.recoverPasswordTitle);
    };

    $('[data-action="display-recover-form"]').on('click', function() {
      switchToRecoverForm();
      return false;
    });

    // We also switch if we directly have the hash "recover"
    if (window.location.hash === '#recover' || window.recoverPassword === true) {
      switchToRecoverForm();
    }
  }());
});
router.route('(:lang/)password', function() {
  (function() {
    var passwordModal = $('.password-popup');

    $('[data-action="toggle-storefront-password"]').on('click', function() {
      passwordModal.remodal({hashTracking: false}).open();
    });
  })();
});
/**
 * ----------------------------------------------------------------------------------------------------
 * PRODUCT ROUTE
 * ----------------------------------------------------------------------------------------------------
 */

var productRoute = function() {
  /**
   * -------------------------
   * PRODUCT SLIDESHOW
   * -------------------------
   */

  (function() {
    var initProductSlideshow = function(domElement) {
      if (domElement.length === 0) {
        return;
      }
      
      var productSlideshow = domElement,
        productSlides = productSlideshow.find('.product__slides'),
        productThumbnails = domElement.find('.product__thumbnails');

      // We keep track of each media, indexed by ID
      var mediaList = {};

      /**
       * Let's first handle 3D models
       */
      var productModels = productSlides.find('.product__slide--model'),
        hasLoadedModels = false;

      if (productModels.length > 0) {
        // We first load the CSS for the model viewer
        var stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = 'https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css';
        document.head.appendChild(stylesheet);

        // Then we use the loadFeatures and initialize the model
        window.Shopify.loadFeatures([{
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: function() {
            productModels.each(function(index, item) {
              var modelViewer = item.querySelector('model-viewer');
              mediaList[item.getAttribute('data-media-id')] = new window.Shopify.ModelViewerUI(modelViewer);

              modelViewer.addEventListener('shopify_model_viewer_ui_toggle_play', function() {
                productSlides.slick('slickSetOption', 'draggable', false);
                productSlides.slick('slickSetOption', 'touchMove', false);
                productSlides.slick('slickSetOption', 'swipe', false);
              });

              modelViewer.addEventListener('shopify_model_viewer_ui_toggle_pause', function() {
                productSlides.slick('slickSetOption', 'draggable', true);
                productSlides.slick('slickSetOption', 'touchMove', true);
                productSlides.slick('slickSetOption', 'swipe', true);
              });
            });

            hasLoadedModels = true;
          }
        }, {
          name: 'shopify-xr',
          version: '1.0',
        }]);
      }

      /**
       * Then handle native video
       */
      var productNativeVideos = productSlides.find('.product__slide--video-native'),
        hasLoadedNativeVideos = false;

      if (productNativeVideos.length > 0) {
        // Load the CSS
        var stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = 'https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css';
        document.head.appendChild(stylesheet);

        // Load the feature and set the video
        window.Shopify.loadFeatures([{
          name: 'video-ui',
          version: '1.0',
          onLoad: function() {
            productNativeVideos.each(function(index, item) {
              var player = new Shopify.Plyr(item.querySelector('video'), {
                controls: [
                  'play',
                  'progress',
                  'mute',
                  'volume',
                  'play-large',
                  'fullscreen'
                ],
                loop: {active: (productSlideshow.attr('data-enable-video-looping') === 'true')},
                hideControlsOnPause: true,
                iconUrl: '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
                tooltips: {
                  controls: false,
                  seek: true
                }
              });

              player.on('play', function() {
                productSlides.slick('slickSetOption', 'draggable', false);
                productSlides.slick('slickSetOption', 'touchMove', false);
                productSlides.slick('slickSetOption', 'swipe', false);
              });

              player.on('pause', function() {
                productSlides.slick('slickSetOption', 'draggable', true);
                productSlides.slick('slickSetOption', 'touchMove', true);
                productSlides.slick('slickSetOption', 'swipe', true);
              });

              mediaList[item.getAttribute('data-media-id')] = player;
            });

            hasLoadedNativeVideos = true;
          }
        }]);
      }

      /**
       * And finally the YouTube videos
       */
      var productExternalVideos = productSlides.find('.product__slide--external-video'),
        hasLoadedExternalVideos = false;

      if (productExternalVideos.length > 0) {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.async = true;
        script.src = '//www.youtube.com/iframe_api';
        script.onload = function() {
          var playerLoadingInterval = setInterval(() => {
            if (window.YT !== undefined && window.YT.Player !== undefined) {
              productExternalVideos.each(function(index, item) {
                var player = new YT.Player(item.querySelector('iframe'), {
                  videoId: item.getAttribute('data-video-id'),
                  events: {
                    onStateChange: (event) => {
                      if (event.data === 0 && (productSlideshow.attr('data-enable-video-looping') === 'true')) {
                        event.target.seekTo(0);
                      }
                    }
                  }
                });

                mediaList[item.getAttribute('data-media-id')] = player;
              });

              hasLoadedExternalVideos = true;

              clearInterval(playerLoadingInterval);
            }
          }, 50);
        };
      }

      productSlides.on('beforeChange', function(event, slick, currentPosition, nextPosition) {
        productThumbnails.find('.product__thumbnail').removeClass('product__thumbnail--active')
          .eq(nextPosition).addClass('product__thumbnail--active');

        // We have to do various things based on the type of the new media. First, we disable the interaction
        // of the previous media if there is one
        var currentSlide = $(slick.$slides[currentPosition]);

        if (currentSlide.hasClass('product__slide--model')) {
          mediaList[currentSlide.attr('data-media-id')].pause();
        } else if (currentSlide.hasClass('product__slide--external-video')) {
          mediaList[currentSlide.attr('data-media-id')].pauseVideo();
        } else if (currentSlide.hasClass('product__slide--video-native')) {
          mediaList[currentSlide.attr('data-media-id')].pause();
        }

        // If the previous media was of type media, then we need to revert to default XR button
        var arButton = productSlideshow.find('[data-shopify-xr]');

        if (currentSlide.hasClass('product__slide--model')) {
          arButton.attr('data-shopify-model3d-id', arButton.attr('data-shopify-model3d-default-id'));
        }
      });

      productSlides.on('afterChange', function(event, slick, currentPosition) {
        // Then for the new media, if it's on destkop, we autoplay
        var newSlide = $(slick.$slides[currentPosition]);

        if (Modernizr.mq('(min-width: 801px)')) {
          if (newSlide.hasClass('product__slide--model')) {
            mediaList[newSlide.attr('data-media-id')].play();
          } else if (newSlide.hasClass('product__slide--external-video')) {
            mediaList[newSlide.attr('data-media-id')].playVideo();
            newSlide.focus(); // For external video we need to put the focus manually
          } else if (newSlide.hasClass('product__slide--video-native')) {
            mediaList[newSlide.attr('data-media-id')].play();
          }
        }

        var arButton = productSlideshow.find('[data-shopify-xr]');

        // If the new media is of type model, we need to update the AR button
        if (newSlide.hasClass('product__slide--model')) {
          arButton.attr('data-shopify-model3d-id', newSlide.attr('data-media-id'));
        }
      });

      productSlides.slick({
        adaptiveHeight: true,
        accessibility: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: parseInt(productSlides.attr('data-initial-slide')),
        arrows: false,
        dots: false,
        fade: true
      });

      productThumbnails.find('.product__thumbnail').on('click', function(event) {
        event.preventDefault();

        var thumbnail = $(this);

        thumbnail.addClass('product__thumbnail--active');
        thumbnail.siblings().removeClass('product__thumbnail--active');

        productSlides.slick('slickGoTo', $(this).attr('data-slide-index'));
      });

      // If image zoom is enabled we also allow to open the images in a lightbox
      if (productSlideshow.attr('data-enable-image-zoom') === 'true' && Modernizr.mq('(min-width: 801px)')) {
        productSlides.magnificPopup({
          delegate: '.product__slide--image',
          type: 'image',
          gallery: {
            enabled: true,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><svg class="icon icon-arrow-%dir% mfp-prevent-close"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-%dir%"></use></svg></button>'
          }
        });
      }
    };

    initProductSlideshow($('.product__slideshow'));

    $(document).on('shopify:section:unload', '#shopify-section-product-template', function(event) {
      $(event.target).find('.product__slides').slick('unslick');
      $(event.target).find('.product__thumbnail').off('click');
    });

    $(document).on('shopify:section:load', '#shopify-section-product-template', function(event) {
      initProductSlideshow($(event.target).find('.product__slideshow'));
    });
  }());

  /**
   * -------------------------
   * PRODUCT TABS
   * -------------------------
   */

  (function() {
    var initProductTabs = function(domElement) {
      if (domElement.length === 0) {
        return;
      }

      domElement.trademarkTabs();
    };

    initProductTabs($('.product__tabs'));

    $(document).on('shopify:section:unload', '#shopify-section-product-template', function(event) {
      $(event.target).find('.product__tabs').data('plugin_trademarkTabs').destroy();
    });

    $(document).on('shopify:section:load', '#shopify-section-product-template', function(event) {
      initProductTabs($(event.target).find('.product__tabs'));
    });
  }());

  /**
   * -------------------------
   * PRODUCT RECOMMENDATIONS
   * -------------------------
   */

  (function() {
    var createCarousel = function(domElement) {
      domElement.slick({
        accessibility: false,
        dots: true,
        dotsClass: 'slider-dots',
        arrows: false,
        adaptiveHeight: true,
        mobileFirst: true,
        infinite: false,
        centerMode: true,
        centerPadding: '32px',
        slidesToShow: 1,
        initialSlide: (domElement.children().length / 2) - 1,
        responsive: [
          {
            breakpoint: 560,
            settings: 'unslick'
          }
        ]
      })
    };

    var initProducts = function(domElement) {
      if (domElement.length === 0) {
        return;
      }

      if (domElement.attr('data-use-recommendations') === 'true') {
        var url = '/recommendations/products?section_id=product-recommendations&limit=4&product_id=' + domElement.attr('data-product-id');
        $.ajax(url).then(function(content) {
          domElement.find('.list-products').html($(content).find('.list-products').contents());
          createCarousel(domElement.find('.list-products'));
        });
      } else {
        createCarousel(domElement.find('.list-products'));
      }
    };

    initProducts($('.product-recommendations'));

    $(document).on('shopify:section:unload', function(event) {
      $(event.target).find('.product-recommendations .list-products').slick('unslick');
    });

    $(document).on('shopify:section:load', function(event) {
      initProducts($(event.target).find('.product-recommendations'));
    });

    $(window).on('resize orientationChange', function() {
      if (window.innerWidth < 560) {
        // If not created yet, we create it
        var slick = $('.product-recommendations .list-products');

        if (slick.slick('getSlick').unslicked) {
          createCarousel(slick);
        }
      }
    });
  }());
};

router.route('(:lang/)products/*type', productRoute);
router.route('(:lang/)collections/*collection/products/*type', productRoute);
router.route('(:lang/)products_preview', productRoute);