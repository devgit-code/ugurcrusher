(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="znhgtfw-modal-wrapper">\r\n\t<div class="znhgtfw-modal-header">\r\n\t\t<div class="znhgtfw-modal-title">\r\n\t\t\tShortcodes\r\n\t\t</div>\r\n\t\t<button type="button" class="button-link media-modal-close">\r\n\t\t\t<span class="media-modal-icon">\r\n\t\t\t\t<span class="screen-reader-text">Close media panel</span>\r\n\t\t\t</span>\r\n\t\t</button>\r\n\t</div>\r\n\t<div class="znhgtfw-modal-content-wrapper">\r\n\t\t<div class="znhgtfw-modal-sidebar"></div>\r\n\t\t<div class="znhgtfw-modal-content">\r\n\t\t\t<div class="znhgtfw-shortcode-mngr-nothing-selected">\r\n\t\t\t\t<p>Choose a shortcode from the sidebar to get started.</p>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="znhgtfw-modal-footer">\r\n\t\t<div class="znhgtfw-footer-nav">\r\n\t\t\t<a href="#" class="znhgtfw-button znhg-shortcode-insert">Insert shortcode</a>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<div class="znhgtfw-modal-backdrop"></div>';
}
return __p;
};

},{}],2:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	defaults : {
		id : 'shortcode-tag',
		name : 'Shortcode Name',
		section : 'Section',
		description : 'Shortcode description',
		params : [],
	},
	setSelected:function() {
		this.collection.setSelected(this);
	}
});
},{}],3:[function(require,module,exports){
var ShortcodesCollection = Backbone.Collection.extend({
	model: require('./shortcodeModel'),
	initialize: function() {
		this.selected = null;
	},
	bySection : function(sectionName){
		filtered = this.filter(function ( shortcode ) {
			return shortcode.get('section') === sectionName;
		});
		return new ShortcodesCollection(filtered);
	},
	setSelected: function( shortcode ) {
		if (this.selected) {
			this.selected.set({selected:false});
		}
		shortcode.set({selected:true});
		this.selected = shortcode;
		this.trigger('shortcodeSelected', shortcode);
	},
	getSelected : function(){
		return this.selected;
	}
});

module.exports = ShortcodesCollection;
},{"./shortcodeModel":2}],4:[function(require,module,exports){
window.znhg = window.znhg || {};
if( typeof(window.ZnHgShManager) =='undefined') {
	throw new Error('Error: ZnHgShManager was not found.');
}
znhgShortcodesManagerData = {};

znhgShortcodesManagerData.sections = ZnHgShManager.sections;
znhgShortcodesManagerData.shortcodes = ZnHgShManager.shortcodes;

(function ($) {
	var App = function(){},
		ModalView = require('./views/modal'),
		ShortcodesCollection = require('./models/shortcodesCollection');

	/**
	 * Starts the main shortcode manager class
	 */
	App.prototype.start = function(){
		// Bind the click event
		$(document).on('click', '#znhgtfw-shortcode-modal-open', function(e){
			e.preventDefault();
			this.openModal();
		}.bind(this));

		this.shortcodesCollection = new ShortcodesCollection(znhgShortcodesManagerData.shortcodes);

		// Allow chaining
		return this;
	};

	/**
	 * Opens the modal window
	 */
	App.prototype.openModal = function(){
		// Only allow an instance of the modalView
		if( this.modalView === undefined ){
			this.modalView = new ModalView({collection: this.shortcodesCollection, app : this});
		}
	};

	/**
	 * Opens the modal window
	 */
	App.prototype.closeModal = function(){
		this.modalView = undefined;
	};

	znhg.shortcodesManager = new App().start();

})(jQuery);

},{"./models/shortcodesCollection":3,"./views/modal":5}],5:[function(require,module,exports){
var navView = require('./navView');

module.exports = Backbone.View.extend({
	id: "znhgtfw-shortcodes-modal",
	template : require('../html/modal.html'),
	events : {
		'click .znhgtfw-modal-backdrop': 'modalClose',
		'click .media-modal-close':      'modalClose',
		'click .znhg-shortcode-insert':  'insertShortcode'
	},
	initialize : function( options ){
		this.mainApp = options.app;
		this.listenTo(this.collection, 'shortcodeSelected', this.renderParams);
		this.render();
	},
	render : function(){
		this.$el.html( this.template() );

		// Add the navigation
		this.$('.znhgtfw-modal-sidebar').append( new navView().render().$el );

		// Finally.. add the modal to the page
		jQuery( 'body' ).append( this.$el ).addClass('znhgtfw-modal-open');

		return this;
	},
	modalClose : function(){
		this.$el.remove();
		jQuery('body').removeClass('znhgtfw-modal-open');
		this.mainApp.closeModal();
		this.remove();
	},
	renderParams: function( shortcode ){
		// We will need to render the form
		this.paramsCollection = znhg.optionsMachine.setupParams( shortcode.get('params') );
		var form = znhg.optionsMachine.renderOptionsGroup(this.paramsCollection);
		this.$('.znhgtfw-modal-content').html(form);
	},
	insertShortcode : function(shortcode){

		var shortcodeTag    = this.collection.selected.get( 'id' ),
			changedParams   = this.paramsCollection.where({ isChanged: true }),
			closeShortcode  = this.collection.selected.get( 'hasContent' ) || false,
			shortcodeContent = this.collection.selected.get( 'defaultContent' ) || false,
			output;

		// Open the shortcode tag
		output = '['+ shortcodeTag;
			// output all the shortcode params/attributes
			_.each(changedParams, function(param){
				// Don't add the content attribute
				if( param.get('id') === 'content' ){
					// Set the closeShortcode to true
					closeShortcode = true;
					shortcodeContent = param.get('value');
					return true;
				}
				// Output the param_name=param_value
				output += ' '+ param.get('id') + '="' + param.get('value') +'"';
			});
		output += ']';

		// If we have content, add the content and also add the closing tag
		if ( shortcodeContent ) {
			output += shortcodeContent;
		}

		// Check if we need to close the shortcode
		if( closeShortcode ){
			output += '[/' + shortcodeTag + ']';
		}

		window.wp.media.editor.insert( output );
		this.modalClose();
	}
});
},{"../html/modal.html":1,"./navView":8}],6:[function(require,module,exports){
module.exports = Backbone.View.extend({
	tagName : 'li',
	events : {
		'click' : 'selectShortcode'
	},
	render : function(){
		this.$el.html( jQuery('<a href="#">' + this.model.get('name') + '</a>') );
		return this;
	},
	selectShortcode : function(){
		this.model.setSelected();
	}
});
},{}],7:[function(require,module,exports){
var navItem = require('./navItem');
module.exports = Backbone.View.extend({
	tagName: 'ul',
	className : 'znhgtfw-modal-menu-dropdown',
	render : function(){
		this.collection.each(function( shortcode ){
			this.$el.append(new navItem({model: shortcode}).render().$el);
		}.bind(this));
		return this;
	}
});
},{"./navItem":6}],8:[function(require,module,exports){
var navSection = require('./navSection');
module.exports = Backbone.View.extend({
	tagName: 'ul',
	className : 'znhgtfw-modal-menu',
	events : {
		'click > li > a' : 'toggleSection'
	},
	render : function(){
		_(znhgShortcodesManagerData.sections).each(function(sectionName){
			var $li = jQuery('<li></li>');
			$li.append('<a href="#">'+ sectionName +'</a>');
			$li.append( new navSection( { collection: znhg.shortcodesManager.shortcodesCollection.bySection( sectionName ) } ).render().$el );
			this.$el.append($li);
		}.bind(this));
		return this;
	},
	toggleSection : function(e){
		this.$el.find('li').removeClass('active');
		jQuery(e.target).parent().addClass('active');
	}
});
},{"./navSection":7}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc3JjL2pzL2FkbWluL3Nob3J0Y29kZXMvaHRtbC9tb2RhbC5odG1sIiwiYXNzZXRzL3NyYy9qcy9hZG1pbi9zaG9ydGNvZGVzL21vZGVscy9zaG9ydGNvZGVNb2RlbC5qcyIsImFzc2V0cy9zcmMvanMvYWRtaW4vc2hvcnRjb2Rlcy9tb2RlbHMvc2hvcnRjb2Rlc0NvbGxlY3Rpb24uanMiLCJhc3NldHMvc3JjL2pzL2FkbWluL3Nob3J0Y29kZXMvc2hvcnRjb2Rlcy5qcyIsImFzc2V0cy9zcmMvanMvYWRtaW4vc2hvcnRjb2Rlcy92aWV3cy9tb2RhbC5qcyIsImFzc2V0cy9zcmMvanMvYWRtaW4vc2hvcnRjb2Rlcy92aWV3cy9uYXZJdGVtLmpzIiwiYXNzZXRzL3NyYy9qcy9hZG1pbi9zaG9ydGNvZGVzL3ZpZXdzL25hdlNlY3Rpb24uanMiLCJhc3NldHMvc3JjL2pzL2FkbWluL3Nob3J0Y29kZXMvdmlld3MvbmF2Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKXtcbnZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xud2l0aChvYmp8fHt9KXtcbl9fcCs9JzxkaXYgY2xhc3M9XCJ6bmhndGZ3LW1vZGFsLXdyYXBwZXJcIj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVwiem5oZ3Rmdy1tb2RhbC1oZWFkZXJcIj5cXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVwiem5oZ3Rmdy1tb2RhbC10aXRsZVwiPlxcclxcblxcdFxcdFxcdFNob3J0Y29kZXNcXHJcXG5cXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ1dHRvbi1saW5rIG1lZGlhLW1vZGFsLWNsb3NlXCI+XFxyXFxuXFx0XFx0XFx0PHNwYW4gY2xhc3M9XCJtZWRpYS1tb2RhbC1pY29uXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4gY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj5DbG9zZSBtZWRpYSBwYW5lbDwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8L3NwYW4+XFxyXFxuXFx0XFx0PC9idXR0b24+XFxyXFxuXFx0PC9kaXY+XFxyXFxuXFx0PGRpdiBjbGFzcz1cInpuaGd0ZnctbW9kYWwtY29udGVudC13cmFwcGVyXCI+XFxyXFxuXFx0XFx0PGRpdiBjbGFzcz1cInpuaGd0ZnctbW9kYWwtc2lkZWJhclwiPjwvZGl2PlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XCJ6bmhndGZ3LW1vZGFsLWNvbnRlbnRcIj5cXHJcXG5cXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiem5oZ3Rmdy1zaG9ydGNvZGUtbW5nci1ub3RoaW5nLXNlbGVjdGVkXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHA+Q2hvb3NlIGEgc2hvcnRjb2RlIGZyb20gdGhlIHNpZGViYXIgdG8gZ2V0IHN0YXJ0ZWQuPC9wPlxcclxcblxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdDwvZGl2PlxcclxcblxcdDwvZGl2PlxcclxcblxcdDxkaXYgY2xhc3M9XCJ6bmhndGZ3LW1vZGFsLWZvb3RlclwiPlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XCJ6bmhndGZ3LWZvb3Rlci1uYXZcIj5cXHJcXG5cXHRcXHRcXHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwiem5oZ3Rmdy1idXR0b24gem5oZy1zaG9ydGNvZGUtaW5zZXJ0XCI+SW5zZXJ0IHNob3J0Y29kZTwvYT5cXHJcXG5cXHRcXHQ8L2Rpdj5cXHJcXG5cXHQ8L2Rpdj5cXHJcXG48L2Rpdj5cXHJcXG48ZGl2IGNsYXNzPVwiem5oZ3Rmdy1tb2RhbC1iYWNrZHJvcFwiPjwvZGl2Pic7XG59XG5yZXR1cm4gX19wO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuXHRkZWZhdWx0cyA6IHtcclxuXHRcdGlkIDogJ3Nob3J0Y29kZS10YWcnLFxyXG5cdFx0bmFtZSA6ICdTaG9ydGNvZGUgTmFtZScsXHJcblx0XHRzZWN0aW9uIDogJ1NlY3Rpb24nLFxyXG5cdFx0ZGVzY3JpcHRpb24gOiAnU2hvcnRjb2RlIGRlc2NyaXB0aW9uJyxcclxuXHRcdHBhcmFtcyA6IFtdLFxyXG5cdH0sXHJcblx0c2V0U2VsZWN0ZWQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmNvbGxlY3Rpb24uc2V0U2VsZWN0ZWQodGhpcyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgU2hvcnRjb2Rlc0NvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XHJcblx0bW9kZWw6IHJlcXVpcmUoJy4vc2hvcnRjb2RlTW9kZWwnKSxcclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cdH0sXHJcblx0YnlTZWN0aW9uIDogZnVuY3Rpb24oc2VjdGlvbk5hbWUpe1xyXG5cdFx0ZmlsdGVyZWQgPSB0aGlzLmZpbHRlcihmdW5jdGlvbiAoIHNob3J0Y29kZSApIHtcclxuXHRcdFx0cmV0dXJuIHNob3J0Y29kZS5nZXQoJ3NlY3Rpb24nKSA9PT0gc2VjdGlvbk5hbWU7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXcgU2hvcnRjb2Rlc0NvbGxlY3Rpb24oZmlsdGVyZWQpO1xyXG5cdH0sXHJcblx0c2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKCBzaG9ydGNvZGUgKSB7XHJcblx0XHRpZiAodGhpcy5zZWxlY3RlZCkge1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkLnNldCh7c2VsZWN0ZWQ6ZmFsc2V9KTtcclxuXHRcdH1cclxuXHRcdHNob3J0Y29kZS5zZXQoe3NlbGVjdGVkOnRydWV9KTtcclxuXHRcdHRoaXMuc2VsZWN0ZWQgPSBzaG9ydGNvZGU7XHJcblx0XHR0aGlzLnRyaWdnZXIoJ3Nob3J0Y29kZVNlbGVjdGVkJywgc2hvcnRjb2RlKTtcclxuXHR9LFxyXG5cdGdldFNlbGVjdGVkIDogZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiB0aGlzLnNlbGVjdGVkO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNob3J0Y29kZXNDb2xsZWN0aW9uOyIsIndpbmRvdy56bmhnID0gd2luZG93LnpuaGcgfHwge307XHJcbmlmKCB0eXBlb2Yod2luZG93LlpuSGdTaE1hbmFnZXIpID09J3VuZGVmaW5lZCcpIHtcclxuXHR0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBabkhnU2hNYW5hZ2VyIHdhcyBub3QgZm91bmQuJyk7XHJcbn1cclxuem5oZ1Nob3J0Y29kZXNNYW5hZ2VyRGF0YSA9IHt9O1xyXG5cclxuem5oZ1Nob3J0Y29kZXNNYW5hZ2VyRGF0YS5zZWN0aW9ucyA9IFpuSGdTaE1hbmFnZXIuc2VjdGlvbnM7XHJcbnpuaGdTaG9ydGNvZGVzTWFuYWdlckRhdGEuc2hvcnRjb2RlcyA9IFpuSGdTaE1hbmFnZXIuc2hvcnRjb2RlcztcclxuXHJcbihmdW5jdGlvbiAoJCkge1xyXG5cdHZhciBBcHAgPSBmdW5jdGlvbigpe30sXHJcblx0XHRNb2RhbFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL21vZGFsJyksXHJcblx0XHRTaG9ydGNvZGVzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vbW9kZWxzL3Nob3J0Y29kZXNDb2xsZWN0aW9uJyk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFN0YXJ0cyB0aGUgbWFpbiBzaG9ydGNvZGUgbWFuYWdlciBjbGFzc1xyXG5cdCAqL1xyXG5cdEFwcC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8gQmluZCB0aGUgY2xpY2sgZXZlbnRcclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcjem5oZ3Rmdy1zaG9ydGNvZGUtbW9kYWwtb3BlbicsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHRoaXMub3Blbk1vZGFsKCk7XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cclxuXHRcdHRoaXMuc2hvcnRjb2Rlc0NvbGxlY3Rpb24gPSBuZXcgU2hvcnRjb2Rlc0NvbGxlY3Rpb24oem5oZ1Nob3J0Y29kZXNNYW5hZ2VyRGF0YS5zaG9ydGNvZGVzKTtcclxuXHJcblx0XHQvLyBBbGxvdyBjaGFpbmluZ1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogT3BlbnMgdGhlIG1vZGFsIHdpbmRvd1xyXG5cdCAqL1xyXG5cdEFwcC5wcm90b3R5cGUub3Blbk1vZGFsID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vIE9ubHkgYWxsb3cgYW4gaW5zdGFuY2Ugb2YgdGhlIG1vZGFsVmlld1xyXG5cdFx0aWYoIHRoaXMubW9kYWxWaWV3ID09PSB1bmRlZmluZWQgKXtcclxuXHRcdFx0dGhpcy5tb2RhbFZpZXcgPSBuZXcgTW9kYWxWaWV3KHtjb2xsZWN0aW9uOiB0aGlzLnNob3J0Y29kZXNDb2xsZWN0aW9uLCBhcHAgOiB0aGlzfSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogT3BlbnMgdGhlIG1vZGFsIHdpbmRvd1xyXG5cdCAqL1xyXG5cdEFwcC5wcm90b3R5cGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLm1vZGFsVmlldyA9IHVuZGVmaW5lZDtcclxuXHR9O1xyXG5cclxuXHR6bmhnLnNob3J0Y29kZXNNYW5hZ2VyID0gbmV3IEFwcCgpLnN0YXJ0KCk7XHJcblxyXG59KShqUXVlcnkpO1xyXG4iLCJ2YXIgbmF2VmlldyA9IHJlcXVpcmUoJy4vbmF2VmlldycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcblx0aWQ6IFwiem5oZ3Rmdy1zaG9ydGNvZGVzLW1vZGFsXCIsXHJcblx0dGVtcGxhdGUgOiByZXF1aXJlKCcuLi9odG1sL21vZGFsLmh0bWwnKSxcclxuXHRldmVudHMgOiB7XHJcblx0XHQnY2xpY2sgLnpuaGd0ZnctbW9kYWwtYmFja2Ryb3AnOiAnbW9kYWxDbG9zZScsXHJcblx0XHQnY2xpY2sgLm1lZGlhLW1vZGFsLWNsb3NlJzogICAgICAnbW9kYWxDbG9zZScsXHJcblx0XHQnY2xpY2sgLnpuaGctc2hvcnRjb2RlLWluc2VydCc6ICAnaW5zZXJ0U2hvcnRjb2RlJ1xyXG5cdH0sXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCBvcHRpb25zICl7XHJcblx0XHR0aGlzLm1haW5BcHAgPSBvcHRpb25zLmFwcDtcclxuXHRcdHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAnc2hvcnRjb2RlU2VsZWN0ZWQnLCB0aGlzLnJlbmRlclBhcmFtcyk7XHJcblx0XHR0aGlzLnJlbmRlcigpO1xyXG5cdH0sXHJcblx0cmVuZGVyIDogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuJGVsLmh0bWwoIHRoaXMudGVtcGxhdGUoKSApO1xyXG5cclxuXHRcdC8vIEFkZCB0aGUgbmF2aWdhdGlvblxyXG5cdFx0dGhpcy4kKCcuem5oZ3Rmdy1tb2RhbC1zaWRlYmFyJykuYXBwZW5kKCBuZXcgbmF2VmlldygpLnJlbmRlcigpLiRlbCApO1xyXG5cclxuXHRcdC8vIEZpbmFsbHkuLiBhZGQgdGhlIG1vZGFsIHRvIHRoZSBwYWdlXHJcblx0XHRqUXVlcnkoICdib2R5JyApLmFwcGVuZCggdGhpcy4kZWwgKS5hZGRDbGFzcygnem5oZ3Rmdy1tb2RhbC1vcGVuJyk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHRtb2RhbENsb3NlIDogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuJGVsLnJlbW92ZSgpO1xyXG5cdFx0alF1ZXJ5KCdib2R5JykucmVtb3ZlQ2xhc3MoJ3puaGd0ZnctbW9kYWwtb3BlbicpO1xyXG5cdFx0dGhpcy5tYWluQXBwLmNsb3NlTW9kYWwoKTtcclxuXHRcdHRoaXMucmVtb3ZlKCk7XHJcblx0fSxcclxuXHRyZW5kZXJQYXJhbXM6IGZ1bmN0aW9uKCBzaG9ydGNvZGUgKXtcclxuXHRcdC8vIFdlIHdpbGwgbmVlZCB0byByZW5kZXIgdGhlIGZvcm1cclxuXHRcdHRoaXMucGFyYW1zQ29sbGVjdGlvbiA9IHpuaGcub3B0aW9uc01hY2hpbmUuc2V0dXBQYXJhbXMoIHNob3J0Y29kZS5nZXQoJ3BhcmFtcycpICk7XHJcblx0XHR2YXIgZm9ybSA9IHpuaGcub3B0aW9uc01hY2hpbmUucmVuZGVyT3B0aW9uc0dyb3VwKHRoaXMucGFyYW1zQ29sbGVjdGlvbik7XHJcblx0XHR0aGlzLiQoJy56bmhndGZ3LW1vZGFsLWNvbnRlbnQnKS5odG1sKGZvcm0pO1xyXG5cdH0sXHJcblx0aW5zZXJ0U2hvcnRjb2RlIDogZnVuY3Rpb24oc2hvcnRjb2RlKXtcclxuXHJcblx0XHR2YXIgc2hvcnRjb2RlVGFnICAgID0gdGhpcy5jb2xsZWN0aW9uLnNlbGVjdGVkLmdldCggJ2lkJyApLFxyXG5cdFx0XHRjaGFuZ2VkUGFyYW1zICAgPSB0aGlzLnBhcmFtc0NvbGxlY3Rpb24ud2hlcmUoeyBpc0NoYW5nZWQ6IHRydWUgfSksXHJcblx0XHRcdGNsb3NlU2hvcnRjb2RlICA9IHRoaXMuY29sbGVjdGlvbi5zZWxlY3RlZC5nZXQoICdoYXNDb250ZW50JyApIHx8IGZhbHNlLFxyXG5cdFx0XHRzaG9ydGNvZGVDb250ZW50ID0gdGhpcy5jb2xsZWN0aW9uLnNlbGVjdGVkLmdldCggJ2RlZmF1bHRDb250ZW50JyApIHx8IGZhbHNlLFxyXG5cdFx0XHRvdXRwdXQ7XHJcblxyXG5cdFx0Ly8gT3BlbiB0aGUgc2hvcnRjb2RlIHRhZ1xyXG5cdFx0b3V0cHV0ID0gJ1snKyBzaG9ydGNvZGVUYWc7XHJcblx0XHRcdC8vIG91dHB1dCBhbGwgdGhlIHNob3J0Y29kZSBwYXJhbXMvYXR0cmlidXRlc1xyXG5cdFx0XHRfLmVhY2goY2hhbmdlZFBhcmFtcywgZnVuY3Rpb24ocGFyYW0pe1xyXG5cdFx0XHRcdC8vIERvbid0IGFkZCB0aGUgY29udGVudCBhdHRyaWJ1dGVcclxuXHRcdFx0XHRpZiggcGFyYW0uZ2V0KCdpZCcpID09PSAnY29udGVudCcgKXtcclxuXHRcdFx0XHRcdC8vIFNldCB0aGUgY2xvc2VTaG9ydGNvZGUgdG8gdHJ1ZVxyXG5cdFx0XHRcdFx0Y2xvc2VTaG9ydGNvZGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0c2hvcnRjb2RlQ29udGVudCA9IHBhcmFtLmdldCgndmFsdWUnKTtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBPdXRwdXQgdGhlIHBhcmFtX25hbWU9cGFyYW1fdmFsdWVcclxuXHRcdFx0XHRvdXRwdXQgKz0gJyAnKyBwYXJhbS5nZXQoJ2lkJykgKyAnPVwiJyArIHBhcmFtLmdldCgndmFsdWUnKSArJ1wiJztcclxuXHRcdFx0fSk7XHJcblx0XHRvdXRwdXQgKz0gJ10nO1xyXG5cclxuXHRcdC8vIElmIHdlIGhhdmUgY29udGVudCwgYWRkIHRoZSBjb250ZW50IGFuZCBhbHNvIGFkZCB0aGUgY2xvc2luZyB0YWdcclxuXHRcdGlmICggc2hvcnRjb2RlQ29udGVudCApIHtcclxuXHRcdFx0b3V0cHV0ICs9IHNob3J0Y29kZUNvbnRlbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaWYgd2UgbmVlZCB0byBjbG9zZSB0aGUgc2hvcnRjb2RlXHJcblx0XHRpZiggY2xvc2VTaG9ydGNvZGUgKXtcclxuXHRcdFx0b3V0cHV0ICs9ICdbLycgKyBzaG9ydGNvZGVUYWcgKyAnXSc7XHJcblx0XHR9XHJcblxyXG5cdFx0d2luZG93LndwLm1lZGlhLmVkaXRvci5pbnNlcnQoIG91dHB1dCApO1xyXG5cdFx0dGhpcy5tb2RhbENsb3NlKCk7XHJcblx0fVxyXG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuXHR0YWdOYW1lIDogJ2xpJyxcclxuXHRldmVudHMgOiB7XHJcblx0XHQnY2xpY2snIDogJ3NlbGVjdFNob3J0Y29kZSdcclxuXHR9LFxyXG5cdHJlbmRlciA6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLiRlbC5odG1sKCBqUXVlcnkoJzxhIGhyZWY9XCIjXCI+JyArIHRoaXMubW9kZWwuZ2V0KCduYW1lJykgKyAnPC9hPicpICk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cdHNlbGVjdFNob3J0Y29kZSA6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLm1vZGVsLnNldFNlbGVjdGVkKCk7XHJcblx0fVxyXG59KTsiLCJ2YXIgbmF2SXRlbSA9IHJlcXVpcmUoJy4vbmF2SXRlbScpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuXHR0YWdOYW1lOiAndWwnLFxyXG5cdGNsYXNzTmFtZSA6ICd6bmhndGZ3LW1vZGFsLW1lbnUtZHJvcGRvd24nLFxyXG5cdHJlbmRlciA6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbiggc2hvcnRjb2RlICl7XHJcblx0XHRcdHRoaXMuJGVsLmFwcGVuZChuZXcgbmF2SXRlbSh7bW9kZWw6IHNob3J0Y29kZX0pLnJlbmRlcigpLiRlbCk7XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59KTsiLCJ2YXIgbmF2U2VjdGlvbiA9IHJlcXVpcmUoJy4vbmF2U2VjdGlvbicpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuXHR0YWdOYW1lOiAndWwnLFxyXG5cdGNsYXNzTmFtZSA6ICd6bmhndGZ3LW1vZGFsLW1lbnUnLFxyXG5cdGV2ZW50cyA6IHtcclxuXHRcdCdjbGljayA+IGxpID4gYScgOiAndG9nZ2xlU2VjdGlvbidcclxuXHR9LFxyXG5cdHJlbmRlciA6IGZ1bmN0aW9uKCl7XHJcblx0XHRfKHpuaGdTaG9ydGNvZGVzTWFuYWdlckRhdGEuc2VjdGlvbnMpLmVhY2goZnVuY3Rpb24oc2VjdGlvbk5hbWUpe1xyXG5cdFx0XHR2YXIgJGxpID0galF1ZXJ5KCc8bGk+PC9saT4nKTtcclxuXHRcdFx0JGxpLmFwcGVuZCgnPGEgaHJlZj1cIiNcIj4nKyBzZWN0aW9uTmFtZSArJzwvYT4nKTtcclxuXHRcdFx0JGxpLmFwcGVuZCggbmV3IG5hdlNlY3Rpb24oIHsgY29sbGVjdGlvbjogem5oZy5zaG9ydGNvZGVzTWFuYWdlci5zaG9ydGNvZGVzQ29sbGVjdGlvbi5ieVNlY3Rpb24oIHNlY3Rpb25OYW1lICkgfSApLnJlbmRlcigpLiRlbCApO1xyXG5cdFx0XHR0aGlzLiRlbC5hcHBlbmQoJGxpKTtcclxuXHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cdHRvZ2dsZVNlY3Rpb24gOiBmdW5jdGlvbihlKXtcclxuXHRcdHRoaXMuJGVsLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0alF1ZXJ5KGUudGFyZ2V0KS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0fVxyXG59KTsiXX0=
