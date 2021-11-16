    
let scrapeModalElement= document.getElementById('scrape-modal')

const scrapeModal = new bootstrap.Modal(scrapeModalElement, {
    backdrop: 'static',
    keyboard: false,
    focus: true
});

$(document).on("click", "#scrape", function(e){
    e.preventDefault();

    $.ajax({
        URL:"/scrape",
        type: "GET"
    }).done(function(resp){
        scrapeModal.show();
    });
    
});

$(document).on("click", ".close-modal", function(e){
    e.preventDefault();
    scrapeModal.hide();
});
