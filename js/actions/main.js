// A token will be used to access data from server
$(function () {


  var touchStartY;
  var touchStartTime;
  var refreshTimeout;

  $(window).on('touchstart', function (event) {
    touchStartY = event.originalEvent.touches[0].clientY;
    touchStartTime = Date.now();
  });

  $("#lbl-username").text(sessionStorage.getItem("username"));
  $("#account-name").text(` ${sessionStorage.getItem("account_name")}`);


  $(window).on('touchmove', { passive: false }, function (event) {
    var touchCurrentY = event.originalEvent.touches[0].clientY;
    var scrollPosition = $(window).scrollTop();

    // Check if a modal is open
    var isModalOpen = $('.modal.show').length > 0;

    if (touchCurrentY > touchStartY && scrollPosition === 0 && !isModalOpen) {
      clearTimeout(refreshTimeout); // Clear any existing timeout

      var touchDuration = Date.now() - touchStartTime;
      var minimumTouchDuration = 600; // Minimum touch duration in milliseconds

      if (touchDuration >= minimumTouchDuration) {
        event.preventDefault();
        location.reload(); // Refresh the page
      }
    }
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
