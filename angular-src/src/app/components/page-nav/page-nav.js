$(function () {
	var $sidebarWrapper = $('.page-nav-wrapper');
	var $sidebar = $('#page-nav');
	var $window = $(window);
	var offset = $sidebar.offset();
	$window.scroll(function(){
		if($window.scrollTop() > offset.top){
				$sidebar.css('margin-top', $window.scrollTop() - offset.top);
		}
		else{
			$sidebar.css('margin-top', 0);
		}
	});

	function setPageNavHeight(){
		$sidebarWrapper.css('height', $window.height());
	}

	// Set Height on start
	setPageNavHeight();

	// Set Height on every resize
	$window.resize(function (){
		$sidebarWrapper.css('height', $window.height());
	})
})