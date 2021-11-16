$(document).ready(function() {

    $("#user-name-input").val("");
    $("#user-comment-input").val("");

    let deleteModalElement = document.getElementById('delete-modal')

    const deleteModal = new bootstrap.Modal(deleteModalElement, {
        backdrop: 'static',
        keyboard: false,
        focus: true
    });

    // When you click the add-comment button
    $("body").on("click", "#add-comment", function() {
        // Grab the id associated with the article from the submit button
        let articleId = $(this).attr("data-id");

        // Run a POST request to add the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                // Value taken from title input
                title: $("#user-name-input").val().trim(),
                // Value taken from note textarea
                body: $("#user-comment-input").val().trim()
            }
        })
        // With that done
        .then(function(data) {
            location.reload();
        });
    });

    let notesID = "";

    $("body").on("click", "#delete-comment", function(e){
        e.preventDefault();
        notesID=$(this).attr("data-id");
        deleteModal.show();
    });

    $("body").on("click", "#closebutton", function(e){
        e.preventDefault();
        deleteModal.hide();
    });

    //when you confirm you are deleting the comment
    $("body").on("click", "#confirm-btn", function(e){
        e.preventDefault();
        $.ajax({
            method: "DELETE",
            url: "/notes/" + notesID,
        }).done(function(data) {
            location.reload();
            deleteModal.hide();
        });
    });        
});

