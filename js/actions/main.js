// A token will be used to access data from server

$(document).ready(function () {

  $(document).ready(function() {
    var touchStartY;
    
    $(window).on('touchstart', function(event) {
      touchStartY = event.originalEvent.touches[0].clientY;
    });
  
    $(window).on('touchmove', { passive: false }, function(event) {
      var touchCurrentY = event.originalEvent.touches[0].clientY;
      var scrollPosition = $(window).scrollTop();
  
      if (touchCurrentY > touchStartY && scrollPosition === 0) {
        event.preventDefault();
        location.reload(); // Refresh the page
      }
    });
  });
  

  $(document).on("click", "tr", function (e) {
    $(this).toggleClass("active");
  });

  $(document).on("click", "#logout-link", function (e) {
    sessionStorage.clear();
    localStorage.clear();
    window.location = "index.html";
  });

  $(document).on("click", "#stopped", function () {
    if (this.checked)
      $("#reasonForStoppingRow").removeClass("d-none").slideDown();
    else $("#reasonForStoppingRow").addClass("d-none").slideUp();
  });
});

$(document).on({
  /* ajaxStart: function () {
     $("body").addClass("loading");
   },
   ajaxStop: function () {
     $("body").removeClass("loading");
   },*/
});
