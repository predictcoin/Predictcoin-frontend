$(document).ready(function () {
  // Toggle .headerSticky class to #header when page is scrolled
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".headerFix").addClass("headerSticky");
    } else {
      $(".headerFix").removeClass("headerSticky");
    }
  });

  stickyHead();

  function stickyHead() {
    if ($(window).scrollTop() > 100) {
      $(".headerFix").addClass("headerSticky");
    } else {
      $(".headerFix").removeClass("headerSticky");
    }
  }

  /* For Mobile navigation */
  $(".mobNav").on("click", function () {
    $(".navMenu").toggleClass("active");
    $(this).find("i").toggleClass("fa-times");
  });

  $(".smClose").on("click", function () {
    $(this).toggleClass("active");
    $(".headerNav ").toggleClass("activeMenu");
    $("body").toggleClass("menuActive");
  });

  /* For Single window scroll */
  $(".headerNav li a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        500,
        function () {}
      );
    }
  });

  $("body").scrollspy({ target: ".navbar", offset: 50 });

  /* ------- Trigger modal when page is loaded ------- */
  $(window.location.hash).modal("toggle");

  document.querySelector(".address-copy").addEventListener("click", () => {
    var copyText = document.querySelector("textarea.address-text");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    $.growl.notice({ message: "✓ Copied to clipboard", title: "" });
  });

  // Every time a modal is shown, if it has an autofocus element, focus on it.
  $('.modal').on('shown.bs.modal', function() {
    $(this).find('[autofocus]').focus();
  });
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  });

  // $(".modal input").each((_, input) => input.addEventListener("input", (event) => {
  //   const check = validate({duration: event.target.value}, {duration: {numericality: true}})
  //   if (check){
  //     const len = event.target.value.length;
  //     event.target.value = event.target.value.slice(0, len-1);
  //   }
  // }))

  formatNumber = function (num, format){
    num = String(num);
    if (num < 0.000001) return 0;
    if (Number.isInteger(Number(num))){
      return num;
    }

    if (format === "per"){
      if(num.split(".")[1].length <= 2){
        return num
      }
      return Number(num).toFixed(2);
    } else {
      if(num.split(".")[1].length <= 5){
        return num
      }
      return Number(Number(num).toFixed(5)).toString();
    }
  }

	//add listener to theme button
	document.querySelector(".theme-btn").addEventListener("click", changeTheme);
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