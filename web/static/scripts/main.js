$(document).ready(function () {
	if (sessionStorage.length === 0 && window.location.pathname != "/login") {
		window.location.href = $SCRIPT_ROOT + "/logout";
	}

	// Attach '.active' to current page's link in navbar
	$("ul.nav li").each(function (i, e) {
		var path = $(e).find("a").attr("href");
		if (path === window.location.pathname) {
			$(e).addClass("active");
		}
	});
});
