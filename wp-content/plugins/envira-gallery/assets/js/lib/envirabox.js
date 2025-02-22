(function (window, document, $, undefined) {
	'use strict';

	window.console = window.console || {
		info: function (stuff) {},
	};

	// If there's no jQuery, envirabox can't work
	// =========================================
	if (!$) {
		return;
	}

	// Check if envirabox is already initialized
	// ========================================
	if ($.fn.envirabox) {
		console.info('EnviraBox already initialized');

		return;
	}

	// Private default settings
	// ========================
	let defaults = {
		// Enable infinite gallery navigation
		loop: false,

		// Space around image, ignored if zoomed-in or viewport width is smaller than 800px
		margin: [44, 0],

		// Horizontal space between slides
		gutter: 50,

		// Enable keyboard navigation
		keyboard: true,

		// Should display navigation arrows at the screen edges
		arrows: true,

		// Should display infobar (counter and arrows at the top)
		infobar: false,

		// Should display toolbar (buttons at the top)
		toolbar: true,

		// What buttons should appear in the top right corner.
		// Buttons will be created using templates from `btnTpl` option
		// and they will be placed into toolbar (class="envirabox-toolbar"` element)
		buttons: [
			'slideShow',
			'fullScreen',
			'thumbs',
			'close',
			// "zoom",
			// "share",
			// "slideShow",
			// "fullScreen",
			// "download",
			'thumbs',
			'close',
		],

		// Detect "idle" time in seconds
		idleTime: 3,

		// Should display buttons at top right corner of the content
		// If 'auto' - they will be created for content having type 'html', 'inline' or 'ajax'
		// Use template from `btnTpl.smallBtn` for customization
		smallBtn: true,

		// Disable right-click and use simple image protection for images
		protect: false,

		// Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
		modal: false,

		image: {
			// Wait for images to load before displaying
			// Requires predefined image dimensions
			// If 'auto' - will zoom in thumbnail if 'width' and 'height' attributes are found
			preload: 'auto',
		},

		ajax: {
			// Object containing settings for ajax request
			settings: {
				// This helps to indicate that request comes from the modal
				// Feel free to change naming
				data: {
					envirabox: true,
				},
			},
		},

		iframe: {
			// Iframe template
			tpl:
				'<iframe id="envirabox-frame{rnd}" name="envirabox-frame{rnd}" class="envirabox-iframe {additionalClasses}" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',

			// Preload iframe before displaying it
			// This allows to calculate iframe content width and height
			// (note: Due to "Same Origin Policy", you can't get cross domain data).
			preload: true,

			// Custom CSS styling for iframe wrapping element
			// You can use this to set custom iframe dimensions
			css: {},

			// Iframe tag attributes
			attr: {
				scrolling: 'auto',
			},
		},

		genericDiv: {
			// Iframe template
			tpl:
				'<div id="envirabox-generic-div{rnd}" name="envirabox-generic-div{rnd}" class="fb-video"></div>',

			// Preload iframe before displaying it
			// This allows to calculate iframe content width and height
			// (note: Due to "Same Origin Policy", you can't get cross domain data).
			preload: true,

			provider: 'facebook',

			// Custom CSS styling for iframe wrapping element
			// You can use this to set custom iframe dimensions
			css: {},

			// Iframe tag attributes
			attr: {
				scrolling: 'auto',
			},
		},

		// Open/close animation type
		// Possible values:
		// false            - disable
		// "zoom"           - zoom images from/to thumbnail
		// "fade"
		// "zoom-in-out"
		//
		animationEffect: 'zoom',

		// Duration in ms for open/close animation
		animationDuration: 366,

		// Should image change opacity while zooming
		// If opacity is 'auto', then opacity will be changed if image and thumbnail have different aspect ratios
		zoomOpacity: 'auto',

		// Transition effect between slides
		//
		// Possible values:
		// false            - disable
		// "fade'
		// "slide'
		// "circular'
		// "tube'
		// "zoom-in-out'
		// "rotate'
		//
		transitionEffect: 'fade',

		// Duration in ms for transition animation
		transitionDuration: 366,

		// Custom CSS class for slide element
		slideClass: 'enviraboxSlide',

		// Custom CSS class for layout
		baseClass: 'enviraboxLayout',

		// Base template for layout
		baseTpl:
			'<div class="envirabox-container" role="dialog">' +
			'<div class="envirabox-bg"></div>' +
			'<div class="envirabox-inner">' +
			'<div class="envirabox-infobar">' +
			'<button data-envirabox-prev title="{{PREV}}" class="envirabox-button envirabox-button--left"></button>' +
			'<div class="envirabox-infobar__body">' +
			'<span data-envirabox-index></span>&nbsp;/&nbsp;<span data-envirabox-count></span>' +
			'</div>' +
			'<button data-envirabox-next title="{{NEXT}}" class="envirabox-button envirabox-button--right"></button>' +
			'</div>' +
			'<div class="envirabox-toolbar">' +
			'{{BUTTONS}}' +
			'</div>' +
			'<div class="envirabox-navigation">' +
			'<button data-envirabox-prev title="{{PREV}}" class="envirabox-arrow envirabox-arrow--left" />' +
			'<button data-envirabox-next title="{{NEXT}}" class="envirabox-arrow envirabox-arrow--right" />' +
			'</div>' +
			'<div class="envirabox-stage"></div>' +
			'<div class="envirabox-caption-wrap">' +
			'<div class="envirabox-title"></div>' +
			'<div class="envirabox-caption"></div>' +
			'</div>' +
			'</div>' +
			'</div>',

		// Loading indicator template
		spinnerTpl: '<div class="envirabox-loading"></div>',

		// Error message template
		errorTpl: '<div class="envirabox-error"><p>{{ERROR}}<p></div>',

		btnTpl: {
			slideShow:
				'<button data-envirabox-play class="envirabox-button envirabox-button--play" title="{{PLAY_START}}"></button>',
			fullScreen:
				'<button data-envirabox-fullscreen class="envirabox-button envirabox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
			thumbs:
				'<button data-envirabox-thumbs class="envirabox-button envirabox-button--thumbs" title="{{THUMBS}}"></button>',
			close:
				'<button data-envirabox-close class="envirabox-button envirabox-button--close" title="{{CLOSE}}"></button>',
			download: '',
			exif: '',
			// This small close button will be appended to your html/inline/ajax content by default,
			// if "smallBtn" option is not set to false
			smallBtn:
				'<button data-envirabox-close class="envirabox-close-small" title="{{CLOSE}}"></button>',
			arrowLeft: '',
			arrowRight: '',
		},

		// Container is injected into this element
		parentEl: 'body',

		// Focus handling
		// ==============
		// Try to focus on the first focusable element after opening
		autoFocus: true,

		// Put focus back to active element after closing
		backFocus: true,

		// Do not let user to focus on element outside modal content
		trapFocus: true,

		// Module specific options
		// =======================
		fullScreen: {
			autoStart: false,
		},

		// Set `touch: false` to disable dragging/swiping
		touch: {
			vertical: true, // Allow to drag content vertically
			momentum: true, // Continue movement after releasing mouse/touch when panning
		},

		// Hash value when initializing manually,
		// set `false` to disable hash change
		hash: null,

		// Customize or add new media types
		// Example:
		/*
		media : {
			youtube : {
				params : {
					autoplay : 0
				}
			}
		}
		*/
		media: {},

		slideShow: {
			autoStart: false,
			speed: 4000,
		},

		thumbs: {
			autoStart: false, // Display thumbnails on opening
			hideOnClose: true, // Hide thumbnail grid when closing animation starts
			parentEl: '.envirabox-container',
			axis: 'y',
			rowHeight: 50,
		},

		wheel: 'auto',

		// Callbacks
		// ==========
		onInit: $.noop, // When instance has been initialized

		beforeLoad: $.noop, // Before the content of a slide is being loaded
		afterLoad: $.noop, // When the content of a slide is done loading

		beforeShow: $.noop, // Before open animation starts
		afterShow: $.noop, // When content is done loading and animating

		beforeClose: $.noop, // Before the instance attempts to close. Return false to cancel the close.
		afterClose: $.noop, // After instance has been closed

		onActivate: $.noop, // When instance is brought to front
		onDeactivate: $.noop, // When other instance has been activated

		// Interaction
		// ===========
		// Use options below to customize taken action when user clicks or double clicks on the envirabox area,
		// each option can be string or method that returns value.
		//
		// Possible values:
		// "close"           - close instance
		// "next"            - move to next gallery item
		// "nextOrClose"     - move to next gallery item or close if gallery has only one item
		// "toggleControls"  - show/hide controls
		// "zoom"            - zoom image (if loaded)
		// false             - do nothing
		// Clicked on the content
		clickContent: function (current, event) {
			return current.type === 'image' ? 'zoom' : false;
		},

		// Clicked on the slide
		clickSlide: 'close',

		// Clicked on the background (backdrop) element
		clickOutside: 'close',

		// Same as previous two, but for double click
		dblclickContent: false,
		dblclickSlide: false,
		dblclickOutside: false,

		// Custom options when mobile device is detected
		// =============================================
		mobile: {
			clickContent: function (current, event) {
				return current.type === 'image' ? 'toggleControls' : false;
			},
			clickSlide: function (current, event) {
				return current.type === 'image' ? 'toggleControls' : 'close';
			},
			dblclickContent: function (current, event) {
				return current.type === 'image' ? 'zoom' : false;
			},
			dblclickSlide: function (current, event) {
				return current.type === 'image' ? 'zoom' : false;
			},
		},

		// Internationalization
		// ============
		lang: 'en',
		i18n: {
			en: {
				CLOSE: 'Close',
				NEXT: 'Next',
				PREV: 'Previous',
				ERROR:
					'The requested content cannot be loaded. <br/> Please try again later.',
				PLAY_START: 'Start slideshow',
				PLAY_STOP: 'Pause slideshow',
				FULL_SCREEN: 'Full screen',
				THUMBS: 'Thumbnails',
			},
			de: {
				CLOSE: 'Schliessen',
				NEXT: 'Weiter',
				PREV: 'Zurück',
				ERROR:
					'Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.',
				PLAY_START: 'Diaschau starten',
				PLAY_STOP: 'Diaschau beenden',
				FULL_SCREEN: 'Vollbild',
				THUMBS: 'Vorschaubilder',
			},
		},
	};

	// Few useful letiables and methods
	// ================================
	let $W = $(window),
		$D = $(document),
		called = 0;

	// Check if an object is a jQuery object and not a native JavaScript object
	// ========================================================================
	let isQuery = function (obj) {
		return obj && obj.hasOwnProperty && obj instanceof $;
	};

	// Handle multiple browsers for "requestAnimationFrame" and "cancelAnimationFrame"
	// ===============================================================================
	let requestAFrame = (function () {
		return (
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			// if all else fails, use setTimeout
			function (callback) {
				return window.setTimeout(callback, 1000 / 60);
			}
		);
	})();

	// Detect the supported transition-end event property name
	// =======================================================
	let transitionEnd = (function () {
		let t,
			el = document.createElement('fakeelement');

		let transitions = {
			transition: 'transitionend',
			OTransition: 'oTransitionEnd',
			MozTransition: 'transitionend',
			WebkitTransition: 'webkitTransitionEnd',
		};

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
		return 'transitionend';
	})();

	// Force redraw on an element.
	// This helps in cases where the browser doesn't redraw an updated element properly.
	// =================================================================================
	let forceRedraw = function ($el) {
		return $el && $el.length && $el[0].offsetHeight;
	};

	// Exclude array (`buttons`) options from deep merging
	// ===================================================
	let mergeOpts = function (opts1, opts2) {
		let rez = $.extend(true, {}, opts1, opts2);
		$.each(opts2, function (key, value) {
			if ($.isArray(value)) {
				rez[key] = value;
			}
		});
		return rez;
	};

	// Class definition
	// ================
	let EnviraBox = function (content, opts, index) {
		let self = this;

		self.opts = $.extend(true, { index: index }, defaults, opts || {});

		// Exclude buttons option from deep merging
		if (opts && $.isArray(opts.buttons)) {
			self.opts.buttons = opts.buttons;
		}

		self.id = self.opts.id || ++called;
		self.group = [];

		self.currIndex = parseInt(self.opts.index, 10) || 0;
		self.prevIndex = null;

		self.prevPos = null;
		self.currPos = 0;

		self.firstRun = null;

		// Create group elements from original item collection
		self.createGroup(content);

		if (!self.group.length) {
			return;
		}

		// Save last active element and current scroll position
		self.$lastFocus = $(document.activeElement).blur();

		// Collection of gallery objects
		self.slides = {};

		self.init(content);
	};

	$.urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results == null){
		   return null;
		}
		else {
		   return decodeURI(results[1]) || 0;
		}
	}

	$.extend(EnviraBox.prototype, {
		// Create DOM structure
		// ====================
		init: function () {
			let self = this,
				testWidth,
				$container,
				buttonStr,
				page = false;

			if ( $.urlParam('envira_page') ) {
				page = $.urlParam('envira_page');
			}

			let lastFocusElement = self.$lastFocus[0];

			if (
				self.group[self.currIndex] === undefined ||
				self.group[self.currIndex].opts === undefined
			) {
				if (page !== false && page > 1) {
					// self.currIndex = self.currIndex - ( ( page - 1 ) * ( (self.group).length ) );
					self.currIndex = $(
						'div#envira-gallery-wrap-' +
							lastFocusElement.dataset.envirabox +
							' div#envira-gallery-item-' +
							lastFocusElement.dataset.enviraItemId,
					).index();
				} else {
					// self.currIndex = self.currIndex - (self.group).length;
					self.currIndex = $(
						'div#envira-gallery-wrap-' +
							lastFocusElement.dataset.envirabox +
							' div#envira-gallery-item-' +
							lastFocusElement.dataset.enviraItemId,
					).index();
				}
			}

			let firstItemOpts =
				self.group[self.currIndex] !== undefined &&
				self.group[self.currIndex].opts !== undefined
					? self.group[self.currIndex].opts
					: false;
			if (firstItemOpts === false) {
				let gallery_id = self.opts.galleryID,
					per_page = self.opts.perPage,
					numItems = $('a.envira-gallery-' + gallery_id).length;

				//console.log ( self.current.enviraItemId );
				// $.each( self.slides, function( key, value ) {
				//   alert( key + ": " + value );
				// });
				firstItemOpts = self.group[self.id - 1].opts;
				self.currIndex = self.id - 1;
			}

			if (
				false === firstItemOpts ||
				firstItemOpts.baseTpl === undefined
			) {
				return;
			}

			self.scrollTop = $D.scrollTop();
			self.scrollLeft = $D.scrollLeft();

			// Hide scrollbars
			// ===============
			if (
				!$.envirabox.getInstance() &&
				!$.envirabox.isMobile &&
				$('body').css('overflow') !== 'hidden'
			) {
				testWidth = $('body').width();

				$('html').addClass('envirabox-enabled');

				// Compare body width after applying "overflow: hidden"
				testWidth = $('body').width() - testWidth;

				// If width has changed - compensate missing scrollbars by adding right margin
				if (testWidth > 1) {
					$('head').append(
						'<style id="envirabox-style-noscroll" type="text/css">.compensate-for-scrollbar, .envirabox-enabled body { margin-right: ' +
							testWidth +
							'px; }</style>',
					);
				}
			}

			// Build html markup and set references
			// ====================================
			// Build html code for buttons and insert into main template
			buttonStr = '';

			$.each(firstItemOpts.buttons, function (index, value) {
				buttonStr += firstItemOpts.btnTpl[value] || '';
			});

			// Create markup from base template, it will be initially hidden to
			// avoid unnecessary work like painting while initializing is not complete
			$container = $(
				self.translate(
					self,
					firstItemOpts.baseTpl.replace('{{BUTTONS}}', buttonStr),
				),
			)
				.addClass('envirabox-is-hidden')
				.attr('id', 'envirabox-container-' + self.id)
				.addClass(firstItemOpts.baseClass)
				.data('EnviraBox', self)
				.prependTo(firstItemOpts.parentEl);

			// Create object holding references to jQuery wrapped nodes
			self.$refs = {
				container: $container,
			};

			[
				'bg',
				'inner',
				'infobar',
				'toolbar',
				'stage',
				'caption',
				'title',
			].forEach(function (item) {
				self.$refs[item] = $container.find('.envirabox-' + item);
			});

			// Check for redundant elements
			if (!firstItemOpts.arrows || self.group.length < 2) {
				$container.find('.envirabox-navigation').remove();
			}

			if (!firstItemOpts.infobar) {
				self.$refs.infobar.remove();
			}

			if (!firstItemOpts.toolbar) {
				self.$refs.toolbar.remove();
			}

			self.trigger('onInit');

			// Bring to front and enable events
			self.activate();

			// Build slides, load and reveal content
			self.jumpTo(self.currIndex);
		},

		// Simple i18n support - replaces object keys found in template
		// with corresponding values
		// ============================================================
		translate: function (obj, str) {
			let arr = obj.opts.i18n[obj.opts.lang];

			return str.replace(/\{\{(\w+)\}\}/g, function (match, n) {
				let value = arr[n];

				if (value === undefined) {
					return match;
				}

				return value;
			});
		},

		// Create array of gallery item objects
		// Check if each object has valid type and content
		// ===============================================
		createGroup: function (content) {
			let self = this,
				items = $.makeArray(content);

			$.each(items, function (i, item) {
				let obj = {},
					opts = {},
					data = [],
					$item,
					type,
					src,
					found,
					srcParts;
				
				// Step 1 - Make sure we have an object
				// ====================================
				if ($.isPlainObject(item)) {
					// We probably have manual usage here, something like
					// $.envirabox.open( [ { src : "image.jpg", type : "image" } ] )
					obj = item;
					opts = item.opts || item;
				} else if ($.type(item) === 'object' && $(item).length) {
					// Here we propbably have jQuery collection returned by some selector
					$item = $(item);
					data = $item.data();
					opts = 'options' in data ? data.options : {};
					opts = $.type(opts) === 'object' ? opts : {};

					obj.src =
						'src' in data
							? data.src
							: opts.src || $item.attr('href');

					// Make sure our Obj has all of our keys
					for (let key in data) {
						if (data.hasOwnProperty(key)) {
							obj[key] = data[key];
						}
					}
					['width', 'height', 'thumb', 'type', 'filter'].forEach(
						function (item) {
							if (item in data) {
								opts[item] = data[item];
							}
						},
					);

					if ('srcset' in data) {
						opts.image = { srcset: data.srcset };
					}

					opts.$orig = $item;

					if (!obj.type && !obj.src) {
						obj.type = 'inline';
						obj.src = item;
					}
				} else {
					// Assume we have a simple html code, for example:
					// $.envirabox.open( '<div><h1>Hi!</h1></div>' );
					obj = {
						type: 'html',
						src: item + '',
					};
				}

				// Each gallery object has full collection of options
				obj.opts = $.extend(true, {}, self.opts, opts);

				if ($.envirabox.isMobile) {
					obj.opts = $.extend(true, {}, obj.opts, obj.opts.mobile);
				}

				// Step 2 - Make sure we have content type, if not - try to guess
				// ==============================================================
				type = obj.type || obj.opts.type;
				src = obj.src || '';

				if (!type && src) {
					if (
						src.match(
							/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i,
						)
					) {
						type = 'image';
					} else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
						type = 'pdf';
					} else if (
						(found = src.match(/\.(mp4|mov|ogv)((\?|#).*)?$/i))
					) {
						type = 'video';

						if (!obj.opts.videoFormat) {
							obj.opts.videoFormat =
								'video/' +
								(found[1] === 'ogv' ? 'ogg' : found[1]);
						}
					} else if (src.charAt(0) === '#') {
						type = 'inline';
					}
				}

				obj.type = type;

				// Step 3 - Some adjustments
				// =========================
				obj.index = self.group.length;

				// Caption is a "special" option, it can be passed as a method
				if ($.type(obj.opts.caption) === 'function') {
					obj.opts.caption = obj.opts.caption.apply(item, [
						self,
						obj,
					]);
				} else if ('caption' in data) {
					obj.opts.caption = data.caption;
				} else if (
					typeof obj.opts === 'object' &&
					typeof obj.opts.caption === 'string' &&
					obj.opts.caption !== null &&
					Object.keys(obj.opts).length > 0
				) {
					// used for Envira Links, extra checks for IE11
					obj.opts.caption = enviraEncodeHTMLEntities(
						obj.opts.caption,
					);
				} else {
					obj.opts.caption = '';
				}

				// Check if $orig and $thumb objects exist
				if (obj.opts.$orig && !obj.opts.$orig.length) {
					delete obj.opts.$orig;
				}

				if (!obj.opts.$thumb && obj.opts.$orig) {
					obj.opts.$thumb = obj.opts.$orig.find('img:first');
				}

				if (obj.opts.$thumb && !obj.opts.$thumb.length) {
					delete obj.opts.$thumb;
				}

				// Caption is a "special" option, it can be passed as a method
				if ($.type(obj.opts.caption) === 'function') {
					obj.opts.caption = obj.opts.caption.apply(item, [
						self,
						obj,
					]);
				} else if ('caption' in data) {
					obj.opts.caption = data.caption;
				} else if (
					typeof obj.opts === 'object' &&
					typeof obj.opts.caption === 'string' &&
					obj.opts.caption !== null &&
					Object.keys(obj.opts).length > 0
				) {
					// used for Envira Links, extra checks for IE11
					obj.opts.caption = obj.opts.caption;
				} else {
					obj.opts.caption = '';
				}

				// Make sure we have caption as a string
				obj.opts.caption =
					obj.opts.caption === undefined ? '' : obj.opts.caption + '';

				// Make sure caption isn't null
				if (obj.opts.caption == null) {
					obj.opts.caption = '';
				}

				obj.opts.caption = enviraEncodeHTMLEntities(
					obj.opts.caption,
				);

				// Caption is a "special" option, it can be passed as a method
				if ($.type(obj.opts.title) === 'function') {
					obj.opts.title = obj.opts.title.apply(item, [self, obj]);
				} else if ('title' in data) {
					obj.opts.title = data.title;
				} else if (
					typeof obj.opts === 'object' &&
					typeof obj.opts.title === 'string' &&
					obj.opts.title !== null &&
					Object.keys(obj.opts).length > 0
				) {
					// used for Envira Links, extra checks for IE11
					obj.opts.title = obj.opts.title;
				} else {
					obj.opts.title = '';
				}

				// Make sure we have title as a string
				obj.opts.title =
					obj.opts.title === undefined ? '' : obj.opts.title + '';

				// Make sure caption isn't null
				if (obj.opts.title == null) {
					obj.opts.title = '';
				}

				obj.opts.title = enviraEncodeHTMLEntities(
					obj.opts.title,
				);

				// Check if url contains "filter" used to filter the content
				// Example: "ajax.html #something"
				if (type === 'ajax') {
					srcParts = src.split(/\s+/, 2);

					if (srcParts.length > 1) {
						obj.src = srcParts.shift();

						obj.opts.filter = srcParts.shift();
					}
				}

				if (
					obj.opts.smallBtn !== undefined &&
					obj.opts.smallBtn == true
				) {
					obj.opts.toolbar = false;
					obj.opts.smallBtn = true;
				}

				// If the type is "pdf", then simply load file into iframe
				if (type === 'pdf') {
					obj.type = 'iframe';

					obj.opts.iframe.preload = false;
				}

				// Hide all buttons and disable interactivity for modal items
				if (obj.opts.modal) {
					obj.opts = $.extend(true, obj.opts, {
						// Remove buttons
						infobar: 0,
						toolbar: 0,

						smallBtn: 0,

						// Disable keyboard navigation
						keyboard: 0,

						// Disable some modules
						slideShow: 0,
						fullScreen: 0,
						thumbs: 0,
						touch: 0,

						// Disable click event handlers
						clickContent: false,
						clickSlide: false,
						clickOutside: false,
						dblclickContent: false,
						dblclickSlide: false,
						dblclickOutside: false,
					});
				}

				// Step 4 - Add processed object to group
				// ======================================
				self.group.push(obj);
			});
		},

		// Attach an event handler functions for:
		// - navigation buttons
		// - browser scrolling, resizing;
		// - focusing
		// - keyboard
		// - detect idle
		// ======================================
		addEvents: function () {
			let self = this;

			self.removeEvents();

			// Make navigation elements clickable
			self.$refs.container
				.on('click.eb-close', '[data-envirabox-close]', function (e) {
					e.stopPropagation();
					e.preventDefault();

					self.close(e);
				})
				.on(
					'click.eb-prev touchend.eb-prev',
					'[data-envirabox-prev]',
					function (e) {
						e.stopPropagation();
						e.preventDefault();

						self.previous();
					},
				)
				.on(
					'click.eb-next touchend.eb-next',
					'[data-envirabox-next]',
					function (e) {
						e.stopPropagation();
						e.preventDefault();

						self.next();
					},
				);

			// Handle page scrolling and browser resizing
			$W.on('orientationchange.eb resize.eb', function (e) {
				if (e && e.originalEvent && e.originalEvent.type === 'resize') {
					requestAFrame(function () {
						self.update();
					});
				} else {
					self.$refs.stage.hide();

					setTimeout(function () {
						self.$refs.stage.show();

						self.update();
					}, 500);
				}
			});

			// Trap keyboard focus inside of the modal, so the user does not accidentally tab outside of the modal
			// (a.k.a. "escaping the modal")
			$D.on('focusin.eb', function (e) {
				let instance = $.envirabox ? $.envirabox.getInstance() : null;
				if (
					instance.isClosing ||
					!instance.current ||
					!instance.current.opts.trapFocus ||
					$(e.target).hasClass('envirabox-container') ||
					$(e.target).is(document)
				) {
					return;
				}

				if (
					instance &&
					$(e.target).css('position') !== 'fixed' &&
					!instance.$refs.container.has(e.target).length
				) {
					e.stopPropagation();

					instance.focus();

					// Sometimes page gets scrolled, set it back
					$W.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);
				}
			});

			// Enable keyboard navigation
			$D.on('keydown.eb', function (e) {
				let current = self.current,
					keycode = e.keyCode || e.which;

				if (!current || !current.opts.keyboard) {
					return;
				}

				if ($(e.target).is('input') || $(e.target).is('textarea')) {
					return;
				}

				// Tab keys
				if (keycode === 9) {
					if (e.shiftKey) {
						self.jumpTo(self.currIndex - 1, 1);
						return;
					} else {
						self.jumpTo(self.currIndex + 1, 1);
						return;
					}

					e.preventDefault();

					return;
				}

				// Backspace and Esc keys
				if (keycode === 8 || keycode === 27) {
					e.preventDefault();

					self.close(e);

					return;
				}

				// Left arrow and Up arrow
				if (keycode === 37 || keycode === 38) {
					e.preventDefault();

					self.previous();

					return;
				}

				// Righ arrow and Down arrow
				if (keycode === 39 || keycode === 40) {
					e.preventDefault();

					self.next();

					return;
				}

				self.trigger('afterKeydown', e, keycode);
			});

			// Hide controls after some inactivity period
			if (self.group[self.currIndex].opts.idleTime) {
				self.idleSecondsCounter = 0;

				$D.on(
					'mousemove.eb-idle mouseenter.eb-idle mouseleave.eb-idle mousedown.eb-idle touchstart.eb-idle touchmove.eb-idle scroll.eb-idle keydown.eb-idle',
					function () {
						self.idleSecondsCounter = 0;

						if (self.isIdle) {
							self.showControls();
						}

						self.isIdle = false;
					},
				);

				self.idleInterval = window.setInterval(function () {
					self.idleSecondsCounter++;

					if (
						self.idleSecondsCounter >=
						self.group[self.currIndex].opts.idleTime
					) {
						self.isIdle = true;
						self.idleSecondsCounter = 0;

						self.hideControls();
					}
				}, 1000);
			}
		},

		// Remove events added by the core
		// ===============================
		removeEvents: function () {
			let self = this;

			$W.off('orientationchange.eb resize.eb');
			$D.off('focusin.eb keydown.eb .eb-idle');

			this.$refs.container.off('.eb-close .eb-prev .eb-next');

			if (self.idleInterval) {
				window.clearInterval(self.idleInterval);

				self.idleInterval = null;
			}
		},

		// Change to previous gallery item
		// ===============================
		previous: function (duration) {
			return this.jumpTo(this.currPos - 1, duration);
		},

		// Change to next gallery item
		// ===========================
		next: function (duration) {
			return this.jumpTo(this.currPos + 1, duration);
		},

		// Change to previous gallery item
		// ===============================
		previous: function (duration) {
			return this.jumpTo(this.currPos - 1, duration);
		},

		// Change to next gallery item
		// ===========================
		next: function (duration) {
			return this.jumpTo(this.currPos + 1, duration);
		},

		// Switch to selected gallery item
		// ===============================
		jumpTo: function (pos, duration, slide) {
			var self = this,
				firstRun,
				loop,
				current,
				previous,
				canvasWidth,
				currentPos,
				transitionProps;

			var groupLen = self.group.length;

			if (
				self.isSliding ||
				self.isClosing ||
				(self.isAnimating && self.firstRun)
			) {
				return;
			}

			pos = parseInt(pos, 10);
			loop = self.current ? self.current.opts.loop : self.opts.loop;

			if (!loop && (pos < 0 || pos >= groupLen)) {
				return false;
			}

			firstRun = self.firstRun = self.firstRun === null;

			if (groupLen < 2 && !firstRun && !!self.isSliding) {
				return;
			}

			previous = self.current;

			self.prevIndex = self.currIndex;
			self.prevPos = self.currPos;

			// Create slides
			current = self.createSlide(pos);

			if (groupLen > 1) {
				if (loop || current.index > 0) {
					self.createSlide(pos - 1);
				}

				if (loop || current.index < groupLen - 1) {
					self.createSlide(pos + 1);
				}
			}

			self.current = current;
			self.currIndex = current.index;
			self.currPos = current.pos;

			self.trigger('beforeShow', firstRun);

			self.updateControls();

			currentPos = $.envirabox.getTranslate(current.$slide);

			current.isMoved =
				(currentPos.left !== 0 || currentPos.top !== 0) &&
				!current.$slide.hasClass('envirabox-animated');
			current.forcedDuration = undefined;

			if ($.isNumeric(duration)) {
				current.forcedDuration = duration;
			} else {
				duration =
					current.opts[
						firstRun ? 'animationDuration' : 'transitionDuration'
					];
			}

			duration = parseInt(duration, 10);

			// Fresh start - reveal container, current slide and start loading content
			if (firstRun) {
				if (current.opts.animationEffect && duration) {
					self.$refs.container.css(
						'transition-duration',
						duration + 'ms',
					);
				}

				self.$refs.container.removeClass('envirabox-is-hidden');

				forceRedraw(self.$refs.container);

				self.$refs.container.addClass('envirabox-is-open');

				// Make first slide visible (to display loading icon, if needed)
				current.$slide.addClass('envirabox-slide--current');

				self.loadSlide(current);

				self.preload();

				return;
			}

			// Clean up
			$.each(self.slides, function (index, slide) {
				$.envirabox.stop(slide.$slide);
			});

			// Make current that slide is visible even if content is still loading
			current.$slide
				.removeClass('envirabox-slide--next envirabox-slide--previous')
				.addClass('envirabox-slide--current');

			// If slides have been dragged, animate them to correct position
			if (current.isMoved) {
				canvasWidth = Math.round(current.$slide.width());

				$.each(self.slides, function (index, slide) {
					var pos = slide.pos - current.pos;

					$.envirabox.animate(
						slide.$slide,
						{
							top: 0,
							left: pos * canvasWidth + pos * slide.opts.gutter,
						},
						duration,
						function () {
							slide.$slide
								.removeAttr('style')
								.removeClass(
									'envirabox-slide--next envirabox-slide--previous',
								);

							if (slide.pos === self.currPos) {
								current.isMoved = false;

								self.complete();
							}
						},
					);
				});
			} else {
				self.$refs.stage.children().removeAttr('style');
			}

			// Start transition that reveals current content
			// or wait when it will be loaded
			if (current.isLoaded) {
				self.revealContent(current);
			} else {
				self.loadSlide(current);
			}

			self.preload();

			if (previous.pos === current.pos) {
				return;
			}

			// Handle previous slide
			// =====================
			transitionProps =
				'envirabox-slide--' +
				(previous.pos > current.pos ? 'next' : 'previous');

			previous.$slide.removeClass(
				'envirabox-slide--complete envirabox-slide--current envirabox-slide--next envirabox-slide--previous',
			);

			previous.isComplete = false;

			if (
				!duration ||
				(!current.isMoved && !current.opts.transitionEffect)
			) {
				return;
			}

			if (current.isMoved) {
				previous.$slide.addClass(transitionProps);
			} else {
				transitionProps =
					'envirabox-animated ' +
					transitionProps +
					' envirabox-fx-' +
					current.opts.transitionEffect;

				$.envirabox.animate(
					previous.$slide,
					transitionProps,
					duration,
					function () {
						previous.$slide
							.removeClass(transitionProps)
							.removeAttr('style');
					},
				);
			}

			// self.trigger('afterShow');
		},

		// Create new "slide" element
		// These are gallery items  that are actually added to DOM
		// =======================================================
		createSlide: function (pos) {
			var self = this;
			var $slide;
			var index;

			index = pos % self.group.length;
			index = index < 0 ? self.group.length + index : index;

			if (!self.slides[pos] && self.group[index]) {
				$slide = $('<div class="envirabox-slide"></div>').appendTo(
					self.$refs.stage,
				);

				self.slides[pos] = $.extend(true, {}, self.group[index], {
					pos: pos,
					$slide: $slide,
					isLoaded: false,
				});

				self.updateSlide(self.slides[pos]);
			}

			return self.slides[pos];
		},
		// Scale image to the actual size of the image
		// ===========================================
		scaleToActual: function (x, y, duration) {
			let self = this,
				current = self.current,
				$what = current.$content,
				imgPos,
				posX,
				posY,
				scaleX,
				scaleY,
				canvasWidth = parseInt(current.$slide.width(), 10),
				canvasHeight = parseInt(current.$slide.height(), 10),
				newImgWidth = current.width,
				newImgHeight = current.height;

			if (
				!(current.type == 'image' && !current.hasError) ||
				!$what ||
				self.isAnimating
			) {
				return;
			}

			$.envirabox.stop($what);

			self.isAnimating = true;

			x = x === undefined ? canvasWidth * 0.5 : x;
			y = y === undefined ? canvasHeight * 0.5 : y;

			imgPos = $.envirabox.getTranslate($what);

			scaleX = newImgWidth / imgPos.width;
			scaleY = newImgHeight / imgPos.height;

			// Get center position for original image
			posX = canvasWidth * 0.5 - newImgWidth * 0.5;
			posY = canvasHeight * 0.5 - newImgHeight * 0.5;

			// Make sure image does not move away from edges
			if (newImgWidth > canvasWidth) {
				posX = imgPos.left * scaleX - (x * scaleX - x);

				if (posX > 0) {
					posX = 0;
				}

				if (posX < canvasWidth - newImgWidth) {
					posX = canvasWidth - newImgWidth;
				}
			}

			if (newImgHeight > canvasHeight) {
				posY = imgPos.top * scaleY - (y * scaleY - y);

				if (posY > 0) {
					posY = 0;
				}

				if (posY < canvasHeight - newImgHeight) {
					posY = canvasHeight - newImgHeight;
				}
			}

			self.updateCursor(newImgWidth, newImgHeight);

			$.envirabox.animate(
				$what,
				{
					top: posY,
					left: posX,
					scaleX: scaleX,
					scaleY: scaleY,
				},
				duration || 330,
				function () {
					self.isAnimating = false;
				},
			);

			// Stop slideshow
			if (self.SlideShow && self.SlideShow.isActive) {
				self.SlideShow.stop();
			}
		},

		// Scale image to fit inside parent element
		// ========================================
		scaleToFit: function (duration) {
			let self = this,
				current = self.current,
				$what = current.$content,
				end;

			if (
				!(current.type == 'image' && !current.hasError) ||
				!$what ||
				self.isAnimating
			) {
				return;
			}

			$.envirabox.stop($what);

			self.isAnimating = true;

			end = self.getFitPos(current);

			self.updateCursor(end.width, end.height);

			$.envirabox.animate(
				$what,
				{
					top: end.top,
					left: end.left,
					scaleX: end.width / $what.width(),
					scaleY: end.height / $what.height(),
				},
				duration || 330,
				function () {
					self.isAnimating = false;
				},
			);
		},

		// Calculate image size to fit inside viewport
		// ===========================================
		getFitPos: function (slide) {
			let self = this,
				$what = slide.$content,
				imgWidth = slide.width,
				imgHeight = slide.height,
				query =
					'(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
				isChrome =
					/Chrome/.test(navigator.userAgent) &&
					/Google Inc/.test(navigator.vendor);

			// only do this if the screen is retina.
			if ( ( isChrome && matchMedia(query).matches) || window.devicePixelRatio === 2 ) {
				imgWidth = imgWidth * 2;
				imgHeight = imgHeight * 2;
			}

			let margin = slide.opts.margin,
				canvasWidth,
				canvasHeight,
				minRatio,
				width,
				height;

			if (!$what || !$what.length || (!imgWidth && !imgHeight)) {
				return false;
			}

			// Convert "margin to CSS style: [ top, right, bottom, left ]
			if ($.type(margin) === 'number') {
				margin = [margin, margin];
			}

			if (margin.length == 2) {
				margin = [margin[0], margin[1], margin[0], margin[1]];
			}

			if ($W.width() < 800) {
				margin = [0, 0, 0, 0];
			}

			// We can not use $slide width here, because it can have different diemensions while in transiton
			canvasWidth =
				parseInt(self.$refs.stage.width(), 10) -
				(margin[1] + margin[3]);
			canvasHeight =
				parseInt(self.$refs.stage.height(), 10) -
				(margin[0] + margin[2]);

			minRatio = Math.min(
				1,
				canvasWidth / imgWidth,
				canvasHeight / imgHeight,
			);

			width = Math.floor(minRatio * imgWidth);
			height = Math.floor(minRatio * imgHeight);

			// Use floor rounding to make sure it really fits
			return {
				top: Math.floor((canvasHeight - height) * 0.5) + margin[0],
				left: Math.floor((canvasWidth - width) * 0.5) + margin[3],
				width: width,
				height: height,
			};
		},

		// Update position and content of all slides
		// =========================================
		update: function () {
			let self = this;

			$.each(self.slides, function (key, slide) {
				self.updateSlide(slide);
			});
		},

		// Update slide position and scale content to fit
		// ==============================================
		updateSlide: function (slide) {
			let self = this,
				$what = slide.$content;

			if ($what && (slide.width || slide.height)) {
				$.envirabox.stop($what);

				$.envirabox.setTranslate($what, self.getFitPos(slide));

				if (slide.pos === self.currPos) {
					self.updateCursor();
				}
			}

			slide.$slide.trigger('refresh');

			self.trigger('onUpdate', slide);
		},

		// Update cursor style depending if content can be zoomed
		// ======================================================
		updateCursor: function (nextWidth, nextHeight) {
			let self = this,
				isScaledDown,
				$container = self.$refs.container.removeClass(
					'envirabox-is-zoomable envirabox-can-zoomIn envirabox-can-drag envirabox-can-zoomOut',
				);

			if (!self.current || self.isClosing) {
				return;
			}

			if (self.isZoomable()) {
				$container.addClass('envirabox-is-zoomable');

				if (nextWidth !== undefined && nextHeight !== undefined) {
					isScaledDown =
						nextWidth < self.current.width &&
						nextHeight < self.current.height;
				} else {
					isScaledDown = self.isScaledDown();
				}

				if (isScaledDown) {
					// If image is scaled down, then, obviously, it can be zoomed to full size
					$container.addClass('envirabox-can-zoomIn');
				} else {
					if (self.current.opts.touch) {
						// If image size ir largen than available available and touch module is not disable,
						// then user can do panning
						$container.addClass('envirabox-can-drag');
					} else {
						$container.addClass('envirabox-can-zoomOut');
					}
				}
			} else if (self.current.opts.touch) {
				$container.addClass('envirabox-can-drag');
			}
		},

		// Check if current slide is zoomable
		// ==================================
		isZoomable: function () {
			let self = this,
				current = self.current,
				fitPos;

			if (!current || self.isClosing) {
				return;
			}

			// Assume that slide is zoomable if
			// - image is loaded successfuly
			// - click action is "zoom"
			// - actual size of the image is smaller than available area
			if (
				current.type === 'image' &&
				current.isLoaded &&
				!current.hasError &&
				(current.opts.clickContent === 'zoom' ||
					($.isFunction(current.opts.clickContent) &&
						current.opts.clickContent(current) === 'zoom'))
			) {
				fitPos = self.getFitPos(current);

				if (
					current.width > fitPos.width ||
					current.height > fitPos.height
				) {
					return true;
				}
			}

			return false;
		},

		// Check if current image dimensions are smaller than actual
		// =========================================================
		isScaledDown: function () {
			let self = this,
				current = self.current,
				$what = current.$content,
				rez = false;

			if ($what) {
				rez = $.envirabox.getTranslate($what);
				rez = rez.width < current.width || rez.height < current.height;
			}

			return rez;
		},

		// Check if image dimensions exceed parent element
		// ===============================================
		canPan: function () {
			let self = this,
				current = self.current,
				$what = current.$content,
				rez = false;

			if ($what) {
				rez = self.getFitPos(current);
				rez =
					Math.abs($what.width() - rez.width) > 1 ||
					Math.abs($what.height() - rez.height) > 1;
			}

			return rez;
		},

		// Load content into the slide
		// ===========================
		loadSlide: function (slide) {
			let self = this,
				type,
				$slide,
				ajaxLoad;

			if (slide.isLoading) {
				return;
			}

			if (slide.isLoaded) {
				return;
			}

			slide.isLoading = true;

			self.trigger('beforeLoad', slide);

			type = slide.type;
			$slide = slide.$slide;

			$slide
				.off('refresh')
				.trigger('onReset')
				.addClass('envirabox-slide--' + (type || 'unknown'))
				.addClass(slide.opts.slideClass);

			// Create content depending on the type
			switch (type) {
				case 'image':
					self.setImage(slide);

					break;
				case 'video':
					self.setVideo(slide);

					break;
				case 'iframe':
					self.setIframe(slide);

					break;
				case 'genericDiv':
					self.setGenericDiv(slide);

					break;
				case 'html':
					self.setContent(slide, slide.src || slide.content);

					break;

				case 'inline':
					if ($(slide.src).length) {
						self.setContent(slide, $(slide.src));
					} else {
						self.setError(slide);
					}

					break;

				case 'ajax':
					self.showLoading(slide);

					ajaxLoad = $.ajax(
						$.extend({}, slide.opts.ajax.settings, {
							url: slide.src,
							success: function (data, textStatus) {
								if (textStatus === 'success') {
									self.setContent(slide, data);
								}
							},
							error: function (jqXHR, textStatus) {
								if (jqXHR && textStatus !== 'abort') {
									self.setError(slide);
								}
							},
						}),
					);

					$slide.one('onReset', function () {
						ajaxLoad.abort();
					});

					break;

				default:
					self.setError(slide);

					break;
			}

			return true;
		},

		setVideo: function (slide) {
			let self = this;

			if (self.isClosing) {
				return;
			}

			self.hideLoading(slide);

			slide.$slide.empty();

			let style_width = false,
				style_height = false,
				videoWidthHeight = '',
				videoControls = 'controls' /* controls by default */,
				videoControlsList = '',
				videoClasses = '';

			// Setup specific CSS classes that might help with customizing video, especially for self hosted
			if (slide.opts.videoPlayPause !== false) {
				videoClasses = videoClasses + 'videos_play_pause ';
			}
			if (slide.opts.videoProgressBar !== false) {
				videoClasses = videoClasses + 'videos_progress ';
			}
			if (slide.opts.videoPlaybackTime !== false) {
				videoClasses = videoClasses + 'videos_playback_time ';
			}
			if (slide.opts.videoVideoLength !== false) {
				videoClasses = videoClasses + 'videos_video_length ';
			}
			if (slide.opts.videoVolumeControls !== false) {
				videoClasses = videoClasses + 'videos_volume_controls ';
			}
			if (slide.opts.videoControlBar !== false) {
				videoClasses = videoClasses + 'videos_controls ';
			} else {
				/* if controls are off, we might need to display the video inline if there is an autoplay, and likely there would be if controls are off - see GH #3682 */
				if (
					slide.opts.videoAutoPlay !== undefined &&
					slide.opts.videoAutoPlay !== false
				) {
					videoControls = 'autoplay playinline';
				} else {
					videoControls = '';
				}
				videoControlsList =
					videoControlsList +
					'nodownload nofullscreen noremoteplayback ';
			}
			if (slide.opts.videoFullscreen !== false) {
				videoClasses = videoClasses + 'videos_fullscreen ';
			}
			if (slide.opts.videoDownload !== false) {
				videoClasses = videoClasses + 'videos_download ';
			} else {
				videoControlsList = videoControlsList + 'nodownload ';
			}

			if (slide.videoWidth > 0) {
				style_width = 'max-width:' + slide.videoWidth + 'px;';
			}

			if (slide.videoHeight > 0) {
				style_height = 'max-height:' + slide.videoHeight + 'px;';
			}

			if (style_width || style_height) {
				videoWidthHeight = 'style="' + style_width + style_height + '"';
			}

			if (
				slide.opts.arrows !== 0 &&
				slide.opts.arrow_position == 'inside'
			) {
				// This will be wrapper containing the video
				slide.$content = $(
					'<div class="envirabox-content video ' +
						videoClasses +
						'" ' +
						videoWidthHeight +
						'"><div class="envirabox-navigation-inside"><a data-envirabox-prev title="prev" class="envirabox-arrow envirabox-arrow--left envirabox-nav envirabox-prev" href="#"><span></span></a><a data-envirabox-next title="next" class="envirabox-arrow envirabox-arrow--right envirabox-nav envirabox-next" href="#"><span></span></a></div>',
				).appendTo(slide.$slide);
			} else {
				// This will be wrapper containing the video
				slide.$content = $(
					'<div class="envirabox-content ' +
						videoClasses +
						'" ' +
						videoWidthHeight +
						'></div>',
				).appendTo(slide.$slide);
			}
			if (slide.opts.smallBtn === true) {
				slide.$content.prepend(
					self.translate(slide, slide.opts.btnTpl.smallBtn),
				);
			}

			if (slide.opts.insideCap === true) {
				let caption = slide.caption !== undefined ? slide.caption : '',
					title = slide.title !== undefined ? slide.title : '',
					position = slide.opts.capPosition
						? slide.opts.capPosition
						: '',
					capTitleShow =
						slide.opts.capTitleShow &&
						slide.opts.capTitleShow !== '0'
							? slide.opts.capTitleShow
							: false,
					itemID = slide.enviraItemId ? slide.enviraItemId : '',
					output =
						capTitleShow == 'caption'
							? '<div class="envirabox-caption ' +
							  'envirabox-caption-item-id-' +
							  itemID +
							  '">' +
							  caption +
							  '</div>'
							: false;
				output =
					capTitleShow == 'title_caption'
						? '<div class="envirabox-caption ' +
						  'envirabox-caption-item-id-' +
						  itemID +
						  '">' +
						  title + ' ' + caption +
						  '</div>'
						: output;
				output =
					capTitleShow == 'title'
						? '<div class="envirabox-title ' +
						  'envirabox-title-item-id-' +
						  itemID +
						  '">' +
						  title +
						  '</div>'
						: output;

				if (
					output !== false &&
					output !== undefined &&
					output.length > 0
				) {
					slide.$content.prepend(
						'<div class="envirabox-caption-wrap ' +
							position +
							'">' +
							output +
							'</div>',
					);
				}
			}

			if (videoControls != '') {
				let posterImage = slide.videoPlaceholder
						? slide.videoPlaceholder
						: slide.thumb, // use default image if nothing available?
					playsInline =
						slide.videoPlaysInline !== undefined
							? slide.videoPlaysInline
							: 'playsinline';
				videoControls =
					videoControls +
					' poster="' +
					posterImage +
					'" ' +
					playsInline +
					' controlsList="' +
					videoControlsList +
					'"';
			}

			let video_source = slide.src !== undefined ? slide.src : slide.link,
				video = $(
					'<div class="envirabox-video-container"><video class="envirabox-video-player" ' +
						videoControls +
						'>' +
						'<source src="' +
						video_source +
						'" type="video/mp4">' +
						"Your broswser doesn't support HTML5 video" +
						'</video></div>',
				).appendTo(slide.$content);

			this.afterLoad(slide);
		},

		// Use thumbnail image, if possible
		// ================================
		setImage: function (slide) {
			let self = this,
				srcset = slide.opts.image.srcset,
				found,
				temp,
				pxRatio,
				windowWidth;

			// If we have "srcset", then we need to find matching "src" value.
			// This is necessary, because when you set an src attribute, the browser will preload the image
			// before any javascript or even CSS is applied.
			if (srcset) {
				pxRatio = window.devicePixelRatio || 1;
				windowWidth = window.innerWidth * pxRatio;

				temp = srcset.split(',').map(function (el) {
					let ret = {};

					el.trim()
						.split(/\s+/)
						.forEach(function (el, i) {
							let value = parseInt(
								el.substring(0, el.length - 1),
								10,
							);

							if (i === 0) {
								return (ret.url = el);
							}

							if (value) {
								ret.value = value;
								ret.postfix = el[el.length - 1];
							}
						});

					return ret;
				});

				// Sort by value
				temp.sort(function (a, b) {
					return a.value - b.value;
				});

				// Ok, now we have an array of all srcset values
				for (let j = 0; j < temp.length; j++) {
					let el = temp[j];

					if (
						(el.postfix === 'w' && el.value >= windowWidth) ||
						(el.postfix === 'x' && el.value >= pxRatio)
					) {
						found = el;
						break;
					}
				}

				// If not found, take the last one
				if (!found && temp.length) {
					found = temp[temp.length - 1];
				}

				if (found) {
					slide.src = found.url;

					// If we have default width/height values, we can calculate height for matching source
					if (slide.width && slide.height && found.postfix == 'w') {
						slide.height =
							(slide.width / slide.height) * found.value;
						slide.width = found.value;
					}
				}
			}

			if (
				slide.opts.arrows !== 0 &&
				slide.opts.arrow_position == 'inside'
			) {
				// This will be wrapper containing both ghost and actual image
				slide.$content = $(
					'<div class="envirabox-image-wrap"><div class="envirabox-navigation-inside"><a data-envirabox-prev title="prev" class="envirabox-arrow envirabox-arrow--left envirabox-nav envirabox-prev" href="#"><span></span></a><a data-envirabox-next title="next" class="envirabox-arrow envirabox-arrow--right envirabox-nav envirabox-next" href="#"><span></span></a></div>',
				)
					.addClass('envirabox-is-hidden')
					.appendTo(slide.$slide);
			} else {
				// This will be wrapper containing both ghost and actual image
				slide.$content = $('<div class="envirabox-image-wrap"></div>')
					.addClass('envirabox-is-hidden')
					.appendTo(slide.$slide);
			}

			if (slide.opts.smallBtn === true) {
				slide.$content.prepend(
					self.translate(slide, slide.opts.btnTpl.smallBtn),
				);
			}
			if (slide.opts.insideCap === true) {
				let caption = slide.caption !== undefined ? slide.caption : '',
					title = slide.title !== undefined ? slide.title : '',
					position = slide.opts.capPosition
						? slide.opts.capPosition
						: '',
					capTitleShow =
						slide.opts.capTitleShow &&
						slide.opts.capTitleShow !== '0' &&
						slide.opts.capTitleShow !== false &&
						slide.opts.capTitleShow !== 'false'
							? slide.opts.capTitleShow
							: false,
					itemID = slide.enviraItemId ? slide.enviraItemId : '',
					output =
						capTitleShow == 'caption'
							? '<div class="envirabox-caption ' +
							  'envirabox-caption-item-id-' +
							  itemID +
							  '">' +
							  caption +
							  '</div>'
							: false;
				output =
					capTitleShow == 'title_caption'
						? '<div class="envirabox-caption ' +
						  'envirabox-caption-item-id-' +
						  itemID +
						  '">' +
						  title + ' ' + caption +
						  '</div>'
						: output;
				output =
					capTitleShow == 'title'
						? '<div class="envirabox-title ' +
						  'envirabox-title-item-id-' +
						  itemID +
						  '">' +
						  title +
						  '</div>'
						: output;

				if (
					output !== false &&
					output !== undefined &&
					output.length > 0
				) {
					slide.$content.prepend(
						'<div class="envirabox-caption-wrap ' +
							position +
							'">' +
							output +
							'</div>',
					);
				}
			}
			// If we have a thumbnail, we can display it while actual image is loading
			// Users will not stare at black screen and actual image will appear gradually
			if (
				slide.opts.preload !== false &&
				slide.opts.width &&
				slide.opts.height &&
				(slide.opts.thumb || slide.opts.$thumb)
			) {
				slide.width = slide.opts.width;
				slide.height = slide.opts.height;

				slide.$ghost = $('<img />')
					.one('error', function () {
						$(this).remove();

						slide.$ghost = null;

						self.setBigImage(slide);
					})
					.one('load', function () {
						self.afterLoad(slide);

						self.setBigImage(slide);
					})
					.addClass('envirabox-image')
					.appendTo(slide.$content)
					.attr(
						'src',
						slide.opts.thumb || slide.opts.$thumb.attr('src'),
					);
			} else {
				self.setBigImage(slide);
			}
		},

		// Create full-size image
		// ======================
		setBigImage: function (slide) {
			let self = this,
				$img = $('<img />');

			slide.$image = $img
				.one('error', function () {
					self.setError(slide);
				})
				.one('load', function () {
					// Clear timeout that checks if loading icon needs to be displayed
					clearTimeout(slide.timouts);

					slide.timouts = null;

					if (self.isClosing) {
						return;
					}

					slide.width = this.naturalWidth;
					slide.height = this.naturalHeight;

					if (slide.opts.image.srcset) {
						$img.attr('sizes', '100vw').attr(
							'srcset',
							slide.opts.image.srcset,
						);
					}

					self.hideLoading(slide);

					if (slide.$ghost) {
						slide.timouts = setTimeout(function () {
							slide.timouts = null;

							slide.$ghost.hide();
						}, Math.min(300, Math.max(1000, slide.height / 1600)));
					} else {
						self.afterLoad(slide);
					}
				})
				.addClass('envirabox-image')
				.attr('src', slide.src)
				.appendTo(slide.$content);

			let query =
				'(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)';

			// only add 2x if the screen is retina.
			if (
				matchMedia(query).matches &&
				slide.enviraRetina !== undefined &&
				slide.enviraRetina !== false &&
				slide.enviraRetina !== ''
			) {
				slide.$image.attr(
					'srcset',
					slide.src + ' 1x, ' + slide.enviraRetina + ' 2x',
				);
				// slide.$image.attr('sizes', '(min-width: 1536px) 1030px, 100vw');
			} else if (slide.src !== undefined && slide.src !== false) {
				slide.$image.attr('srcset', slide.src + ' 1x');
			}

			if (
				($img[0].complete || $img[0].readyState == 'complete') &&
				$img[0].naturalWidth &&
				$img[0].naturalHeight
			) {
				$img.trigger('load');
			} else if ($img[0].error) {
				$img.trigger('error');
			} else {
				slide.timouts = setTimeout(function () {
					if (!$img[0].complete && !slide.hasError) {
						self.showLoading(slide);
					}
				}, 100);
			}
		},

		// Create iframe wrapper, iframe and bindings
		// ==========================================
		setIframe: function (slide) {
			let self = this,
				opts = slide.opts.iframe,
				$slide = slide.$slide,
				$iframe,
				videoWidthHeight = '',
				/* videoWidthHeight = 'style="width: 1351px; height: 759.938px;"', */
				css_width = false,
				css_height = false;

			if (
				slide.opts.arrows !== 0 &&
				slide.opts.arrow_position == 'inside'
			) {
				// This will be wrapper containing both ghost and actual image
				slide.$content = $(
					'<div class="envirabox-content' +
						(opts.preload ? ' envirabox-is-hidden' : ' ') +
						' provider-' +
						opts.provider +
						'" ' +
						videoWidthHeight +
						'><div class="envirabox-navigation-inside"><a data-envirabox-prev title="prev" class="envirabox-arrow envirabox-arrow--left envirabox-nav envirabox-prev" href="#"><span></span></a><a data-envirabox-next title="next" class="envirabox-arrow envirabox-arrow--right envirabox-nav envirabox-next" href="#"><span></span></a></div>',
				)
					.addClass('envirabox-hidden')
					.addClass('envirabox-iframe-hidden')
					.css('width', '640px')
					.css('height', '360px')
					.appendTo(slide.$slide);
			} else if (opts.provider !== undefined) {
				// this should be a video
				slide.$content = $(
					'<div class="envirabox-content' +
						(opts.preload ? ' envirabox-is-hidden' : ' ') +
						' provider-' +
						opts.provider +
						'" ' +
						videoWidthHeight +
						'></div>',
				)
					.addClass('envirabox-hidden')
					.addClass('envirabox-iframe-hidden')
					.css('width', '640px')
					.css('height', '360px')
					.appendTo($slide);
			} else {
				// anything not defined, such as a pdf
				slide.$content = $(
					'<div class="envirabox-content' +
						(opts.preload ? ' envirabox-is-hidden' : ' ') +
						' provider-' +
						opts.provider +
						'" ' +
						videoWidthHeight +
						'></div>',
				)
					.css('width', '90%')
					.css('height', '90%')
					.appendTo($slide);
			}

			$iframe = $(
				opts.tpl
					.replace(/\{rnd\}/g, new Date().getTime())
					.replace(/\{additionalClasses\}/g, slide.contentProvider),
			)
				.attr(opts.attr)
				.appendTo(slide.$content)
				.css('width', css_width)
				.css('height', css_height);

			if (opts.preload) {
				self.showLoading(slide);

				// Unfortunately, it is not always possible to determine if iframe is successfully loaded
				// (due to browser security policy)
				$iframe.on('load.eb error.eb', function (e) {
					this.isReady = 1;

					slide.$slide.trigger('refresh');

					self.afterLoad(slide);
				});

				let $contents = false,
					$body = false;

				try {
					$contents = $iframe.contents();
					$body = $contents.find('body');
				} catch (ignore) {}

				// Calculate contnet dimensions if it is accessible
				if ($body && $body.length && $body.children().length) {
					$content.css({
						width: '',
						height: '',
					});

					if (frameWidth === undefined) {
						frameWidth = Math.ceil(
							Math.max(
								$body[0].clientWidth,
								$body.outerWidth(true),
							),
						);
					}

					if (frameWidth) {
						$content.width(frameWidth);
					}

					if (frameHeight === undefined) {
						frameHeight = Math.ceil(
							Math.max(
								$body[0].clientHeight,
								$body.outerHeight(true),
							),
						);
					}

					if (frameHeight) {
						$content.height(frameHeight);
					}

					$content.removeClass('envirabox-hidden');
				}
			} else {
				this.afterLoad(slide);
			}

			if (slide.opts.insideCap === true) {
				let caption = slide.caption !== undefined ? slide.caption : '',
					title = slide.title !== undefined ? slide.title : '',
					position = slide.opts.capPosition
						? slide.opts.capPosition
						: '',
					capTitleShow =
						slide.opts.capTitleShow &&
						slide.opts.capTitleShow !== '0'
							? slide.opts.capTitleShow
							: false,
					itemID = slide.enviraItemId ? slide.enviraItemId : '',
					output =
						capTitleShow == 'caption'
							? '<div class="envirabox-caption ' +
							  'envirabox-caption-item-id-' +
							  itemID +
							  '">' +
							  caption +
							  '</div>'
							: false;
				output =
					capTitleShow == 'title_caption'
						? '<div class="envirabox-caption ' +
						  'envirabox-caption-item-id-' +
						  itemID +
						  '">' +
						  title + ' ' + caption +
						  '</div>'
						: output;
				output =
					capTitleShow == 'title'
						? '<div class="envirabox-title ' +
						  'envirabox-title-item-id-' +
						  itemID +
						  '">' +
						  title +
						  '</div>'
						: output;

				if (
					output !== false &&
					output !== undefined &&
					output.length > 0
				) {
					slide.$content.prepend(
						'<div class="envirabox-caption-wrap ' +
							position +
							'">' +
							output +
							'</div>',
					);
				}
			}
			$iframe.attr('src', slide.src);

			if (slide.opts.smallBtn === true) {
				slide.$content.prepend(
					self.translate(slide, slide.opts.btnTpl.smallBtn),
				);
			}

			// Remove iframe if closing or changing gallery item
			$slide.one('onReset', function () {
				// This helps IE not to throw errors when closing
				try {
					$(this).find('iframe').hide().attr('src', '//about:blank');
				} catch (ignore) {}

				$(this).empty();

				slide.isLoaded = false;
			});
		},

		setGenericDiv: function (slide) {
			let self = this,
				opts = slide.opts.genericDiv,
				$slide = slide.$slide,
				$genericDiv,
				videoWidthHeight = '',
				/* videoWidthHeight = 'style="width: 1351px; height: 759.938px;"', */
				css_width = '640px',
				css_height = '360px';
			if (
				slide.opts.arrows !== 0 &&
				slide.opts.arrow_position == 'inside'
			) {
				// This will be wrapper containing both ghost and actual image
				slide.$content = $(
					'<div class="envirabox-content' +
						(opts.preload ? ' envirabox-is-hidden' : ' ') +
						' provider-' +
						opts.provider +
						'" ' +
						videoWidthHeight +
						'><div class="envirabox-navigation-inside"><a data-envirabox-prev title="prev" class="envirabox-arrow envirabox-arrow--left envirabox-nav envirabox-prev" href="#"><span></span></a><a data-envirabox-next title="next" class="envirabox-arrow envirabox-arrow--right envirabox-nav envirabox-next" href="#"><span></span></a></div>',
				)
					.addClass('envirabox-hidden')
					.css('width', css_width)
					.css('height', css_height)
					.appendTo(slide.$slide);
			} else {
				if (opts.provider == 'facebook') {
					css_width = css_height = 'auto';
				}
				slide.$content = $(
					'<div class="envirabox-content' +
						(opts.preload ? ' envirabox-is-hidden' : ' ') +
						' provider-' +
						opts.provider +
						'" ' +
						videoWidthHeight +
						'></div>',
				)
					.addClass('envirabox-hidden')
					.css('width', css_width)
					.css('height', css_height)
					.appendTo($slide);
			}

			$genericDiv = $(
				opts.tpl
					.replace(/\{rnd\}/g, new Date().getTime())
					.replace(/\{additionalClasses\}/g, slide.contentProvider),
			)
				.attr(opts.attr)
				.attr('data-href', slide.src)
				.appendTo(slide.$content)
				.css('width', css_width)
				.css('height', css_height);

			this.afterLoad(slide);

			if (slide.opts.insideCap === true) {
				let caption = slide.caption !== undefined ? slide.caption : '',
					title = slide.title !== undefined ? slide.title : '',
					position = slide.opts.capPosition
						? slide.opts.capPosition
						: '',
					capTitleShow =
						slide.opts.capTitleShow &&
						slide.opts.capTitleShow !== '0'
							? slide.opts.capTitleShow
							: false,
					itemID = slide.enviraItemId ? slide.enviraItemId : '',
					output =
						capTitleShow == 'caption'
							? '<div class="envirabox-caption ' +
							  'envirabox-caption-item-id-' +
							  itemID +
							  '">' +
							  caption +
							  '</div>'
							: false;
				output =
					capTitleShow == 'title_caption'
						? '<div class="envirabox-caption ' +
						  'envirabox-caption-item-id-' +
						  itemID +
						  '">' +
						  title + ' ' + caption +
						  '</div>'
						: output;
				output =
					capTitleShow == 'title'
						? '<div class="envirabox-title ' +
						  'envirabox-title-item-id-' +
						  itemID +
						  '">' +
						  title +
						  '</div>'
						: output;

				if (
					output !== false &&
					output !== undefined &&
					output.length > 0
				) {
					slide.$content.prepend(
						'<div class="envirabox-caption-wrap ' +
							position +
							'">' +
							output +
							'</div>',
					);
				}
			}
			// $genericDiv.attr( 'src', slide.src );
			if (slide.opts.smallBtn === true) {
				slide.$content.prepend(
					self.translate(slide, slide.opts.btnTpl.smallBtn),
				);
			}

			// Remove genericDiv if closing or changing gallery item
			$slide.one('onReset', function () {
				// This helps IE not to throw errors when closing
				try {
					$(this)
						.find('genericDiv')
						.hide()
						.attr('src', '//about:blank');
				} catch (ignore) {}

				$(this).empty();

				slide.isLoaded = false;
			});
		},

		// Wrap and append content to the slide
		// ======================================
		setContent: function (slide, content) {
			let self = this;

			if (self.isClosing) {
				return;
			}

			self.hideLoading(slide);

			slide.$slide.empty();

			if (isQuery(content) && content.parent().length) {
				// If content is a jQuery object, then it will be moved to the slide.
				// The placeholder is created so we will know where to put it back.
				// If user is navigating gallery fast, then the content might be already inside envirabox
				// =====================================================================================
				// Make sure content is not already moved to envirabox
				content.parent('.envirabox-slide--inline').trigger('onReset');

				// Create temporary element marking original place of the content
				slide.$placeholder = $('<div></div>')
					.hide()
					.insertAfter(content);

				// Make sure content is visible
				content.css('display', 'inline-block');
			} else if (!slide.hasError) {
				// If content is just a plain text, try to convert it to html
				if ($.type(content) === 'string') {
					content = $('<div>').append($.trim(content)).contents();

					// If we have text node, then add wrapping element to make vertical alignment work
					if (content[0].nodeType === 3) {
						content = $('<div>').html(content);
					}
				}

				// If "filter" option is provided, then filter content
				if (slide.opts.filter) {
					content = $('<div>').html(content).find(slide.opts.filter);
				}
			}

			slide.$slide.one('onReset', function () {
				// Put content back
				if (slide.$placeholder) {
					slide.$placeholder.after(content.hide()).remove();

					slide.$placeholder = null;
				}

				// Remove custom close button
				if (slide.$smallBtn) {
					slide.$smallBtn.remove();

					slide.$smallBtn = null;
				}

				// Remove content and mark slide as not loaded
				if (!slide.hasError) {
					$(this).empty();

					slide.isLoaded = false;
				}
			});

			slide.$content = $(content).appendTo(slide.$slide);

			if (slide.opts.smallBtn && !slide.$smallBtn) {
				slide.$smallBtn = $(
					self.translate(slide, slide.opts.btnTpl.smallBtn),
				).appendTo(slide.$content.filter('div').first());
			}

			this.afterLoad(slide);
		},

		// Display error message
		// =====================
		setError: function (slide) {
			slide.hasError = true;

			slide.$slide.removeClass('envirabox-slide--' + slide.type);

			this.setContent(slide, this.translate(slide, slide.opts.errorTpl));
		},

		// Show loading icon inside the slide
		// ==================================
		showLoading: function (slide) {
			let self = this;

			slide = slide || self.current;

			if (slide && !slide.$spinner) {
				slide.$spinner = $(self.opts.spinnerTpl).appendTo(slide.$slide);
			}
		},

		// Remove loading icon from the slide
		// ==================================
		hideLoading: function (slide) {
			let self = this;

			slide = slide || self.current;

			if (slide && slide.$spinner) {
				slide.$spinner.remove();

				delete slide.$spinner;
			}
		},

		// Adjustments after slide content has been loaded
		// ===============================================
		afterLoad: function (slide) {
			let self = this;

			if (self.isClosing) {
				return;
			}

			slide.isLoading = false;
			slide.isLoaded = true;

			self.trigger('afterLoad', slide);

			self.hideLoading(slide);

			if (slide.opts.protect && slide.$content && !slide.hasError) {
				// Disable right click
				slide.$content.on('contextmenu.eb', function (e) {
					if (e.button == 2) {
						e.preventDefault();
					}

					return true;
				});

				// Add fake element on top of the image
				// This makes a bit harder for user to select image
				if (slide.type === 'image') {
					$('<div class="envirabox-spaceball"></div>').appendTo(
						slide.$content,
					);
				}
			}

			self.revealContent(slide);
		},

		// Make content visible
		// This method is called right after content has been loaded or
		// user navigates gallery and transition should start
		// ============================================================
		revealContent: function (slide) {
			let self = this;
			let $slide = slide.$slide;

			let effect,
				effectClassName,
				duration,
				opacity,
				end,
				start = false;

			effect =
				slide.opts[
					self.firstRun ? 'animationEffect' : 'transitionEffect'
				];
			duration =
				slide.opts[
					self.firstRun ? 'animationDuration' : 'transitionDuration'
				];

			duration = parseInt(
				slide.forcedDuration === undefined
					? duration
					: slide.forcedDuration,
				10,
			);

			if (slide.isMoved || slide.pos !== self.currPos || !duration) {
				effect = false;
			}

			// Check if can zoom
			if (
				effect === 'zoom' &&
				!(
					slide.pos === self.currPos &&
					duration &&
					slide.type === 'image' &&
					!slide.hasError &&
					(start = self.getThumbPos(slide))
				)
			) {
				effect = 'fade';
			}

			// Zoom animation
			// ==============
			if (effect === 'zoom') {
				end = self.getFitPos(slide);

				end.scaleX = end.width / start.width;
				end.scaleY = end.height / start.height;

				delete end.width;
				delete end.height;

				// Check if we need to animate opacity
				opacity = slide.opts.zoomOpacity;

				if (opacity == 'auto') {
					opacity =
						Math.abs(
							slide.width / slide.height -
								start.width / start.height,
						) > 0.1;
				}

				if (opacity) {
					start.opacity = 0.1;
					end.opacity = 1;
				}

				// Draw image at start position
				$.envirabox.setTranslate(
					slide.$content.removeClass('envirabox-is-hidden'),
					start,
				);

				forceRedraw(slide.$content);

				// Start animation
				$.envirabox.animate(slide.$content, end, duration, function () {
					self.complete();
				});

				return;
			}

			self.updateSlide(slide);

			// Simply show content
			// ===================
			if (!effect) {
				forceRedraw($slide);

				slide.$content.removeClass('envirabox-is-hidden');

				if (slide.pos === self.currPos) {
					self.complete();
				}

				return;
			}

			$.envirabox.stop($slide);

			effectClassName =
				'envirabox-animated envirabox-slide--' +
				(slide.pos > self.prevPos ? 'next' : 'previous') +
				' envirabox-fx-' +
				effect;

			$slide
				.removeAttr('style')
				.removeClass(
					'envirabox-slide--current envirabox-slide--next envirabox-slide--previous',
				)
				.addClass(effectClassName);

			slide.$content.removeClass('envirabox-is-hidden');

			// Force reflow for CSS3 transitions
			forceRedraw($slide);

			$.envirabox.animate(
				$slide,
				'envirabox-slide--current',
				duration,
				function (e) {
					$slide.removeClass(effectClassName).removeAttr('style');

					if (slide.pos === self.currPos) {
						self.complete();
					}
				},
				true,
			);
		},

		// Check if we can and have to zoom from thumbnail
		// ================================================
		getThumbPos: function (slide) {
			let self = this;
			let rez = false;

			// Check if element is inside the viewport by at least 1 pixel
			let isElementVisible = function ($el) {
				let element = $el[0];

				let elementRect = element.getBoundingClientRect();
				let parentRects = [];

				let visibleInAllParents;

				while (element.parentElement !== null) {
					if (
						$(element.parentElement).css('overflow') === 'hidden' ||
						$(element.parentElement).css('overflow') === 'auto'
					) {
						parentRects.push(
							element.parentElement.getBoundingClientRect(),
						);
					}

					element = element.parentElement;
				}

				visibleInAllParents = parentRects.every(function (parentRect) {
					let visiblePixelX =
						Math.min(elementRect.right, parentRect.right) -
						Math.max(elementRect.left, parentRect.left);
					let visiblePixelY =
						Math.min(elementRect.bottom, parentRect.bottom) -
						Math.max(elementRect.top, parentRect.top);

					return visiblePixelX > 0 && visiblePixelY > 0;
				});

				return (
					visibleInAllParents &&
					elementRect.bottom > 0 &&
					elementRect.right > 0 &&
					elementRect.left < $(window).width() &&
					elementRect.top < $(window).height()
				);
			};

			let $thumb = slide.opts.$thumb;
			let thumbPos = $thumb ? $thumb.offset() : 0;
			let slidePos;

			if (
				thumbPos &&
				$thumb[0].ownerDocument === document &&
				isElementVisible($thumb)
			) {
				slidePos = self.$refs.stage.offset();

				rez = {
					top:
						thumbPos.top -
						slidePos.top +
						parseFloat($thumb.css('border-top-width') || 0),
					left:
						thumbPos.left -
						slidePos.left +
						parseFloat($thumb.css('border-left-width') || 0),
					width: $thumb.width(),
					height: $thumb.height(),
					scaleX: 1,
					scaleY: 1,
				};
			}

			return rez;
		},

		// Final adjustments after current gallery item is moved to position
		// and it`s content is loaded
		// ==================================================================
		complete: function () {
			let self = this;

			let current = self.current;
			let slides = {};

			if (current.isMoved || !current.isLoaded || current.isComplete) {
				return;
			}

			current.isComplete = true;

			current.$slide.siblings().trigger('onReset');

			// Trigger any CSS3 transiton inside the slide
			forceRedraw(current.$slide);

			current.$slide.addClass('envirabox-slide--complete');

			// Remove unnecessary slides
			$.each(self.slides, function (key, slide) {
				if (
					slide.pos >= self.currPos - 1 &&
					slide.pos <= self.currPos + 1
				) {
					slides[slide.pos] = slide;
				} else if (slide) {
					$.envirabox.stop(slide.$slide);

					slide.$slide.off().remove();
				}
			});

			self.slides = slides;

			self.updateCursor();

			self.trigger('afterShow');

			// Try to focus on the first focusable element
			if (
				$(document.activeElement).is('[disabled]') ||
				(current.opts.autoFocus &&
					!(current.type == 'image' || current.type === 'iframe'))
			) {
				self.focus();
			}
		},

		// Preload next and previous slides
		// ================================
		preload: function () {
			let self = this;
			let next, prev;

			if (self.group.length < 2) {
				return;
			}

			next = self.slides[self.currPos + 1];
			prev = self.slides[self.currPos - 1];

			if (next && next.type === 'image') {
				self.loadSlide(next);
			}

			if (prev && prev.type === 'image') {
				self.loadSlide(prev);
			}
		},

		// Try to find and focus on the first focusable element
		// ====================================================
		focus: function () {
			let current = this.current;
			let $el;

			if (this.isClosing) {
				return;
			}

			if (current && current.isComplete) {
				// Look for first input with autofocus attribute
				$el = current.$slide.find(
					'input[autofocus]:enabled:visible:first',
				);

				if (!$el.length) {
					$el = current.$slide
						.find('button,:input,[tabindex],a')
						.filter(':enabled:visible:first');
				}
			}

			$el = $el && $el.length ? $el : this.$refs.container;

			$el.focus();
		},

		// Activates current instance - brings container to the front and enables keyboard,
		// notifies other instances about deactivating
		// =================================================================================
		activate: function () {
			let self = this;

			// Deactivate all instances
			$('.envirabox-container').each(function () {
				let instance = $(this).data('envirabox');

				// Skip self and closing instances
				if (
					instance &&
					instance.uid !== self.uid &&
					!instance.isClosing
				) {
					instance.trigger('onDeactivate');
				}
			});

			if (self.current) {
				if (self.$refs.container.index() > 0) {
					self.$refs.container.prependTo(document.body);
				}

				self.updateControls();
			}

			self.trigger('onActivate');

			self.addEvents();
		},

		// Start closing procedure
		// This will start "zoom-out" animation if needed and clean everything up afterwards
		// =================================================================================
		close: function (e, d) {
			let self = this;
			let current = self.current;

			let effect, duration;
			let $what, opacity, start, end;

			let done = function () {
				self.cleanUp(e);
			};

			if (self.isClosing) {
				return false;
			}

			self.isClosing = true;

			// If beforeClose callback prevents closing, make sure content is centered
			if (self.trigger('beforeClose', e) === false) {
				self.isClosing = false;

				requestAFrame(function () {
					self.update();
				});

				return false;
			}

			// Remove all events
			// If there are multiple instances, they will be set again by "activate" method
			self.removeEvents();

			if (current.timouts) {
				clearTimeout(current.timouts);
			}

			$what = current.$content;
			effect = current.opts.animationEffect;
			duration = $.isNumeric(d)
				? d
				: effect
				? current.opts.animationDuration
				: 0;

			// Remove other slides
			current.$slide
				.off(transitionEnd)
				.removeClass(
					'envirabox-slide--complete envirabox-slide--next envirabox-slide--previous envirabox-animated',
				);

			current.$slide.siblings().trigger('onReset').remove();

			// Trigger animations
			if (duration) {
				self.$refs.container
					.removeClass('envirabox-is-open')
					.addClass('envirabox-is-closing');
			}

			// Clean up
			self.hideLoading(current);

			self.hideControls();

			self.updateCursor();

			// Check if possible to zoom-out
			if (
				effect === 'zoom' &&
				!(
					e !== true &&
					$what &&
					duration &&
					current.type === 'image' &&
					!current.hasError &&
					(end = self.getThumbPos(current))
				)
			) {
				effect = 'fade';
			}

			if (effect === 'zoom') {
				$.envirabox.stop($what);

				start = $.envirabox.getTranslate($what);

				start.width = start.width * start.scaleX;
				start.height = start.height * start.scaleY;

				// Check if we need to animate opacity
				opacity = current.opts.zoomOpacity;

				if (opacity == 'auto') {
					opacity =
						Math.abs(
							current.width / current.height -
								end.width / end.height,
						) > 0.1;
				}

				if (opacity) {
					end.opacity = 0;
				}

				start.scaleX = start.width / end.width;
				start.scaleY = start.height / end.height;

				start.width = end.width;
				start.height = end.height;

				$.envirabox.setTranslate(current.$content, start);

				$.envirabox.animate(current.$content, end, duration, done);

				return true;
			}

			if (effect && duration) {
				// If skip animation
				if (e === true) {
					setTimeout(done, duration);
				} else {
					$.envirabox.animate(
						current.$slide.removeClass('envirabox-slide--current'),
						'envirabox-animated envirabox-slide--previous envirabox-fx-' +
							effect,
						duration,
						done,
					);
				}
			} else {
				done();
			}

			return true;
		},

		// Final adjustments after removing the instance
		// =============================================
		cleanUp: function (e) {
			let self = this,
				instance;

			self.current.$slide.trigger('onReset');

			self.$refs.container.empty().remove();

			self.trigger('afterClose', e);

			// Place back focus
			if (self.$lastFocus && !!self.current.opts.backFocus) {
				self.$lastFocus.focus();
			}

			self.current = null;

			// Check if there are other instances
			instance = $.envirabox.getInstance();

			if (instance) {
				instance.activate();
			} else {
				$W.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);

				$('html').removeClass('envirabox-enabled');

				$('#envirabox-style-noscroll').remove();
			}
		},

		// Call callback and trigger an event
		// ==================================
		trigger: function (name, slide) {
			let args = Array.prototype.slice.call(arguments, 1),
				self = this,
				obj = slide && slide.opts ? slide : self.current,
				rez;

			if (obj) {
				args.unshift(obj);
			} else {
				obj = self;
			}

			args.unshift(self);

			if ($.isFunction(obj.opts[name])) {
				rez = obj.opts[name].apply(obj, args);
			}

			if (rez === false) {
				return rez;
			}

			if (name === 'afterClose') {
				$D.trigger(name + '.eb', args);
			} else {
				self.$refs.container.trigger(name + '.eb', args);
			}
		},

		// Update infobar values, navigation button states and reveal caption
		// ==================================================================
		updateControls: function (force) {
			let self = this,
				current = self.current,
				index = current.index,
				opts = current.opts,
				caption = opts.caption,
				title = opts.title,
				$caption = self.$refs.caption,
				$title = self.$refs.title;

			// Recalculate content dimensions
			current.$slide.trigger('refresh');

			// function htmlDecode(input){
			//   let e = document.createElement('div');
			//   e.innerHTML = input;
			//   if ( e.childNodes[0] !== undefined ) {
			//        return e.childNodes[0].nodeValue;
			//   } else {
			//        return false;
			//   }

			// }
			// let html_decoded_caption = htmlDecode(caption);
			// if ( html_decoded_caption !== false ) {
			//   caption = html_decoded_caption;
			// }

			self.$caption =
				caption && caption.length ? $caption.html(caption) : null;
			self.$title = title && title.length ? $title.html(title) : null;

			if (!self.isHiddenControls) {
				self.showControls();
			}

			// Update info and navigation elements
			$('[data-envirabox-count]').html(self.group.length);
			$('[data-envirabox-index]').html(index + 1);

			$('[data-envirabox-prev]').prop(
				'disabled',
				!opts.loop && index <= 0,
			);
			$('[data-envirabox-next]').prop(
				'disabled',
				!opts.loop && index >= self.group.length - 1,
			);
		},

		// Hide toolbar and caption
		// ========================
		hideControls: function () {
			this.isHiddenControls = true;

			this.$refs.container.removeClass(
				'envirabox-show-infobar envirabox-show-toolbar envirabox-show-caption envirabox-show-title envirabox-show-nav envirabox-show-exif',
			);
			this.$refs.container.addClass('envirabox-hide-exif');
		},

		showControls: function () {
			let self = this,
				opts = self.current ? self.current.opts : self.opts,
				$container = self.$refs.container;

			self.isHiddenControls = false;
			self.idleSecondsCounter = 0;

			$container
				.toggleClass(
					'envirabox-show-toolbar',
					!!(opts.toolbar && opts.buttons),
				)
				.toggleClass(
					'envirabox-show-infobar',
					!!(opts.infobar && self.group.length > 1),
				)
				.toggleClass(
					'envirabox-show-nav',
					!!(opts.arrows && self.group.length > 1),
				)
				.toggleClass('envirabox-is-modal', !!opts.modal);

			if (self.$caption) {
				$container.addClass('envirabox-show-caption ');
			} else {
				$container.removeClass('envirabox-show-caption');
			}

			if (self.$title) {
				$container.addClass('envirabox-show-title ');
			} else {
				$container.removeClass('envirabox-show-title');
			}

			$container.addClass('envirabox-show-exif');
			$container.removeClass('envirabox-hide-exif');
		},

		// Toggle toolbar and caption
		// ==========================
		toggleControls: function () {
			if (this.isHiddenControls) {
				this.showControls();
			} else {
				this.hideControls();
			}
		},
	});

	$.envirabox = {
		version: '{envirabox-version}',
		defaults: defaults,

		// Get current instance and execute a command.
		//
		// Examples of usage:
		//
		// $instance = $.envirabox.getInstance();
		// $.envirabox.getInstance().jumpTo( 1 );
		// $.envirabox.getInstance( 'jumpTo', 1 );
		// $.envirabox.getInstance( function() {
		// console.info( this.currIndex );
		// });
		// ======================================================
		getInstance: function (command) {
			let instance = $(
				'.envirabox-container:not(".envirabox-is-closing"):first',
			).data('envirabox');
			let args = Array.prototype.slice.call(arguments, 1);

			if (instance instanceof EnviraBox) {
				if ($.type(command) === 'string') {
					instance[command].apply(instance, args);
				} else if ($.type(command) === 'function') {
					command.apply(instance, args);
				}

				return instance;
			}

			return false;
		},

		// Create new instance
		// ===================
		open: function (items, opts, index) {
			let instance = this.getInstance();
			if (instance) {
				return;
			}
			return new EnviraBox(items, opts, index);
		},

		// Close current or all instances
		// ==============================
		close: function (all) {
			let instance = this.getInstance();

			if (instance) {
				instance.close();

				// Try to find and close next instance
				if (all === true) {
					this.close();
				}
			}
		},

		// Close instances and unbind all events
		// ==============================
		destroy: function () {
			this.close(true);

			$D.off('click.eb-start');
		},

		// Try to detect mobile devices
		// ============================
		isMobile:
			document.createTouch !== undefined &&
			/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
				navigator.userAgent,
			),

		// Detect if 'translate3d' support is available
		// ============================================
		use3d: (function () {
			let div = document.createElement('div');

			return (
				window.getComputedStyle &&
				window.getComputedStyle(div).getPropertyValue('transform') &&
				!(document.documentMode && document.documentMode < 11)
			);
		})(),

		// Helper function to get current visual state of an element
		// returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
		// =====================================================================
		getTranslate: function ($el) {
			let matrix;

			if (!$el || !$el.length) {
				return false;
			}

			matrix = $el.eq(0).css('transform');

			if (matrix && matrix.indexOf('matrix') !== -1) {
				matrix = matrix.split('(')[1];
				matrix = matrix.split(')')[0];
				matrix = matrix.split(',');
			} else {
				matrix = [];
			}

			if (matrix.length) {
				// If IE
				if (matrix.length > 10) {
					matrix = [matrix[13], matrix[12], matrix[0], matrix[5]];
				} else {
					matrix = [matrix[5], matrix[4], matrix[0], matrix[3]];
				}

				matrix = matrix.map(parseFloat);
			} else {
				matrix = [0, 0, 1, 1];

				let transRegex = /\.*translate\((.*)px,(.*)px\)/i;
				let transRez = transRegex.exec($el.eq(0).attr('style'));

				if (transRez) {
					matrix[0] = parseFloat(transRez[2]);
					matrix[1] = parseFloat(transRez[1]);
				}
			}

			return {
				top: matrix[0],
				left: matrix[1],
				scaleX: matrix[2],
				scaleY: matrix[3],
				opacity: parseFloat($el.css('opacity')),
				width: $el.width(),
				height: $el.height(),
			};
		},

		// Shortcut for setting "translate3d" properties for element
		// Can set be used to set opacity, too
		// ========================================================
		setTranslate: function ($el, props) {
			let str = '';
			let css = {};

			if (!$el || !props) {
				return;
			}

			if (props.left !== undefined || props.top !== undefined) {
				str =
					(props.left === undefined
						? $el.position().left
						: props.left) +
					'px, ' +
					(props.top === undefined ? $el.position().top : props.top) +
					'px';

				if (this.use3d) {
					str = 'translate3d(' + str + ', 0px)';
				} else {
					str = 'translate(' + str + ')';
				}
			}

			if (props.scaleX !== undefined && props.scaleY !== undefined) {
				str =
					(str.length ? str + ' ' : '') +
					'scale(' +
					props.scaleX +
					', ' +
					props.scaleY +
					')';
			}

			if (str.length) {
				css.transform = str;
			}

			if (props.opacity !== undefined) {
				css.opacity = props.opacity;
			}

			if (props.width !== undefined) {
				css.width = props.width;
			}

			if (props.height !== undefined) {
				css.height = props.height;
			}

			return $el.css(css);
		},

		// Simple CSS transition handler
		// =============================
		animate: function ($el, to, duration, callback, leaveAnimationName) {
			let event = transitionEnd || 'transitionend';

			if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			if (!$.isPlainObject(to)) {
				$el.removeAttr('style');
			}

			$el.on(event, function (e) {
				// Skip events from child elements and z-index change
				if (
					e &&
					e.originalEvent &&
					(!$el.is(e.originalEvent.target) ||
						e.originalEvent.propertyName == 'z-index')
				) {
					return;
				}

				$el.off(event);

				if ($.isPlainObject(to)) {
					if (to.scaleX !== undefined && to.scaleY !== undefined) {
						$el.css('transition-duration', '0ms');

						to.width = Math.round($el.width() * to.scaleX);
						to.height = Math.round($el.height() * to.scaleY);

						to.scaleX = 1;
						to.scaleY = 1;

						$.envirabox.setTranslate($el, to);
					}
				} else if (leaveAnimationName !== true) {
					$el.removeClass(to);
				}

				if ($.isFunction(callback)) {
					callback(e);
				}
			});

			if ($.isNumeric(duration)) {
				$el.css('transition-duration', duration + 'ms');
			}

			if ($.isPlainObject(to)) {
				$.envirabox.setTranslate($el, to);
			} else {
				$el.addClass(to);
			}

			$el.data(
				'timer',
				setTimeout(function () {
					$el.trigger('transitionend');
				}, duration + 16),
			);
		},

		stop: function ($el) {
			clearTimeout($el.data('timer'));

			$el.off(transitionEnd);
		},
	};

	function enviraEncodeHTMLEntities(text) {
		text = text.replace('&£', '&#');
		text = $('<textarea/>').html(text).text();
		text = text.replace('&£', '&#'); // done twice on purpose
		return text;
	}

	// Default click handler for "enviraboxed" links
	// ============================================
	function _run(e) {
		let target = e.currentTarget,
			opts = e.data ? e.data.options : {},
			items = opts.selector
				? $(opts.selector)
				: e.data
				? e.data.items
				: [],
			value = $(target).attr('data-envirabox') || '',
			index = 0,
			active = $.envirabox.getInstance();

		e.preventDefault();

		// Avoid opening multiple times
		if (active && active.current.opts.$orig.is(target)) {
			return;
		}

		// Get all related items and find index for clicked one
		if (value) {
			items = items.length
				? items.filter('[data-envirabox="' + value + '"]')
				: $('[data-envirabox="' + value + '"]');
			index = items.index(target);

			// Sometimes current item can not be found
			// (for example, when slider clones items)
			if (index < 0) {
				index = 0;
			}
		} else {
			items = [target];
		}

		$.envirabox.open(items, opts, index);
	}

	// Create a jQuery plugin
	// ======================
	$.fn.envirabox = function (options) {
		let selector;

		options = options || {};
		selector = options.selector || false;

		if (selector) {
			$('body').off('click.eb-start', selector).on(
				'click.eb-start',
				selector,
				{
					options: options,
				},
				_run,
			);
		} else {
			this.off('click.eb-start').on(
				'click.eb-start',
				{
					items: this,
					options: options,
				},
				_run,
			);
		}

		return this;
	};
})(window, document, window.jQuery || jQuery);
