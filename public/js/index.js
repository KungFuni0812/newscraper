    
let scrapeModalElement= document.getElementById('scrape-modal')

const scrapeModal = new bootstrap.Modal(scrapeModalElement, {
    backdrop: 'static',
    keyboard: false,
    focus: true
});

$(document).on("click", "#scrape", function(e){
    e.preventDefault();
    $.ajax({
        url: "/scrape",
        type: "GET"
    }).done(function(resp){
        console.log('scrape complete.  result:')
        console.log(resp);
        $('#new-article-count').text(resp.newArticleCount);
        scrapeModal.show();
    });
    
});

$(document).on("click", ".close-modal", function(e){
    e.preventDefault();
    scrapeModal.hide();
    location.reload();
});
