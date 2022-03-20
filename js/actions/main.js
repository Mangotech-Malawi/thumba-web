
// A token will be used to access data from server 



$(document).ready(function () {

    $(document).on('click', 'tr', function (e) {
        $(this).toggleClass('active');
    });

    $(document).on('click','#logout-link', function(e){
        sessionStorage.clear();
        localStorage.clear();
        window.location = "index.html";
    })
    
});

$(document).on({
    ajaxStart: function () {
        $("body").addClass("loading");
    },
    ajaxStop: function () {
        $("body").removeClass("loading");
    }
});








