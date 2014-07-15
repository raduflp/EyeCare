(function($) {
	$(function() {
		// Custom Selects
		$("select[name='huge']").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
		$("select[name='modelist']").selectpicker({style: 'btn-info', menuStyle: 'dropdown-inverse'});
	});
})(jQuery);