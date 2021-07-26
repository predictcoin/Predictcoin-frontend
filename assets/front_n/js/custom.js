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
    $.growl.notice({ message: "Address copied successfully", title: "" });
  });
});
