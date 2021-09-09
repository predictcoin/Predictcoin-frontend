$(document).ready(function()
{  
	// Toggle .headerSticky class to #header when page is scrolled		
	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
		  $('.headerFix').addClass('headerSticky');
		} else {
		  $('.headerFix').removeClass('headerSticky');
		}
	});
	
	stickyHead();	
	
	function stickyHead()
	{
		if ($(window).scrollTop() > 100) {
			$('.headerFix').addClass('headerSticky');
		} else {
			$('.headerFix').removeClass('headerSticky');
		}
	}
  
	/* For Mobile navigation */
	$(".mobNav").on('click',function() {	  
	  $('.navMenu').toggleClass('active');
	  $(this).find('i').toggleClass('fa-times');
	});
	
	$('.smClose').on('click',function() {
		$(this).toggleClass('active');
		$('.headerNav ').toggleClass('activeMenu');
		$('body').toggleClass('menuActive');			
	});	
	
	/* For Single window scroll */
	$(".headerNav li a").on('click',function(event) {		
		if (this.hash !== "") {
			event.preventDefault();			  
			var hash = this.hash;
				$('html, body').animate({
					scrollTop: $(hash).offset().top
				}, 500, function(){
			});
		}
	});
	
	$('body').scrollspy({target: ".navbar", offset: 50});	
	
	/* ------- Trigger modal when page is loaded ------- */
	$(window.location.hash).modal('toggle');	

	//add listener to theme button
	document.querySelector(".theme-btn").addEventListener("click", changeTheme);

	// add current theme
	document.querySelector("body").classList
	.add(localStorage.getItem("theme"));
});

//change page theme
function changeTheme(){
  let present = document.querySelector("body").classList.toggle("dark");
  if(present){
    localStorage.setItem("theme", "dark");
  }else{
    localStorage.removeItem("theme");
  }
}