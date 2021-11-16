    
let scrapeModalElement= document.getElementById('scrape-modal')

const scrapeModal = new bootstrap.Modal(scrapeModalElement, {
    backdrop: 'static',
    keyboard: false,
    focus: true
});

$(document).on("click", "#scrape", function(e){
    e.preventDefault();
    console.log("I clicked the scrape button!");
    $.ajax({
        url: "/scrape",
        type: "GET"
    }).done(function(resp){
        console.log(resp)
        scrapeModal.show();
    });
    
});

$(document).on("click", ".close-modal", function(e){
    e.preventDefault();
    scrapeModal.hide();
    location.reload();
});
