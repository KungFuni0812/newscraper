$(document).ready(function() {
    $("#user-name-input").val("");
    $("#user-comment-input").val("");

    // When you click the add-comment button
    $("body").on("click", "#add-comment", function() {
        // Grab the id associated with the article from the submit button
        var articleId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
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
            // Log the response
            console.log(data);
            location.reload();
        });
    });
})

