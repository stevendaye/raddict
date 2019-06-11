/* ## JS File For JQuery Animation ## */
/* Animating the post button displayed only on small screens to pop its features when clicked */
$(function() {
  $("div.post-btn").css("display", "block").css("display", "none");
  $("a.post-btn-pics").css("display", "block").css("display", "none");
  $("a.post-btn-write").css("display", "block").css("display", "none");

  setTimeout(function() {
    $("div.post-btn, .login-round-btn").animate({
      right: "25"
    }, {
      queue: false,
      easing: "swing",
      duration: 500
    }).fadeIn(750, "swing");
  }, 2000);

  $("div.post-btn").on("click", function() {
    $("div.post-btn-add").css("display", "block");
    $("div.post-btn-hide").css("display", "block");
    $("a.post-btn-pics").animate({
      bottom: "80"
    }, {
      queue: false,
      easing: "swing",
      duration: 500
    }).fadeIn(750, "swing");

    $("a.post-btn-write").animate({
      bottom: "80"
    }, {
      queue: false,
      easing: "swing",
      duration: 500
    }).fadeIn(750, "swing");
  });

  // Hide again the post button when clicked
  $("div.post-btn-hide").on("click", function() {
    $(this).css("display", "none");
    $("a.post-btn-pics").animate({
      bottom: "-20"
    }, {
      queue: false,
      easing: "swing",
      duration: 500
    }).fadeOut(750, "swing");

    $("a.post-btn-write").animate({
      bottom: "20"
    }, {
      queue: false,
      easing: "swing",
      duration: 500
    }).fadeIn(750, "swing");
  });
});
