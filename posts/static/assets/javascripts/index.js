/* ## JS File For JQuery Animation and other Vanilla JS stuff ## */
var allowed = false;

$(function() {
  /* Animating the post button displayed only on small screens to pop its features when clicked */
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
    }).fadeOut(750, "swing");
  });

  /* Controlling the Image Upload Button */
  $("#image-upload").css("background-color", "rgba(215, 215, 215, 0.7)").css("color", "white");
  $("#image-upload").on("click", function() {
    if (allowed) {
      $("#image-upload")
      .css("background-color", "rgba(215, 215, 215, 0.7)")
      .css("color", "white")
      .css("border", "none");
      $(".posting").text("Posting...");
      glow(document.getElementsByClassName("posting")[0]);
    }
  });

  /* Controlling the default post button */
  $(".post-title, .post-body").blur(function() {
    if (($(".post-title").val() && $(".post-body").val()) !== "") {
      allowed = true;
    }
  });
  $("#post-form").on("submit", function() {
    if (allowed) {
      $(".post-button").empty();
      $(".post-button").append(
        "<button type=\"button\" class=\"btn btn-default\" style=\"background-color: rgba(215, 215, 215, 0.7);\">" + 
          "<span class=\"posting\" style=\"color: white;\">Posting...</span>" +
        "</button>"
      );
      var posting = document.querySelector(".posting");
      glow(posting);
    }
  });

  /* Load-more Button */
  $("#load").on("click", function() {
    var loading = document.querySelector(".loading");
    $(".load-more").css("display", "none");
    $(".loader").css("display", "block");
    glow(loading);
  });
  
});

/* Vanilla JS for some part of the Raddict App*/
/* Previwing a posted picture */
function preview() {
  var picker = document.querySelector("#post-image");
  var status = document.getElementsByClassName("status")[0];

  // Already on the server side, but setting this on the client side too for a bariccaded security;
  var ALLOWED_EXT = ["jpeg", "jpg", "png", "gif"];
  picker.addEventListener("change", function(){
    var files = this.files, FILE_EXT;
    filesLength = files.length;
    for(var i = 0; i < filesLength; i++) {
      FILE_EXT = files[i].name.split(".");
      FILE_EXT = FILE_EXT[FILE_EXT.length - 1].toLowerCase();
      if (ALLOWED_EXT.indexOf(FILE_EXT) !== -1) {
        allowed = true;
        createThumbnail(files[i]);
        status.innerHTML = "<span></span>";

        var postImgbtn = document.querySelector("#image-upload");
        postImgbtn.type = "submit";
        postImgbtn.style.borderRadius = "4px";
        postImgbtn.style.padding = "7px 20px 7px 20px";
        postImgbtn.style.backgroundColor = "steelblue";
      } else {
        status.innerHTML = "<div class=\"alert alert-danger\">" +
          "File Extensions Not Allowed. Make sure you are selecting among jpeg, jpg, png and gif" +
        "</div>"
        $("#preview").empty();
      }
    }
  }, false);
} preview();

/* Utility Functions */
// Creating a thumbnail before posting a picture
function createThumbnail(file) {
  var preview = document.getElementById("preview");
  var reader = new FileReader();
  reader.onload = function() {
    var img = document.createElement("img");
    img.className = "img-fluid col-auto";
    img.style.maxWidth = "60%";
    img.style.maxHeight = "auto";
    img.src = this.result;

    $("#preview").empty();
    preview.appendChild(img);
  };
  reader.readAsDataURL(file);
}

// Glowing a message when loading or uploading
function glow(element) {
  var level = 1, hex;
  gradualy = function() {
    hex = level.toString(16);
    element.style.color = "#" + hex + "44d" + hex + "f";
    if (level < 1000000000) {
      level += 1;
      setTimeout(gradualy, 100);
    }
  }; setTimeout(gradualy, 100);
}
