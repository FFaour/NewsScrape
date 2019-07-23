$(document).ready(function() {
  // Get the div all of the articles will go in
  const articleContainer = $(".article-container");
  // Event listeners for on click functions
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    // Empty the article container div and send get request for saved articles
    $.get("/api/headlines?saved=true").then(function(data) {
      articleContainer.empty();
      // If there are stored articles, render them
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Run a function to show there are no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML article data
    const articleCards = [];
    // Make a card for each article
    for (i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once all the cards are made render them to the articleContainer div
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // format the HTML using JQuery 
    const card = $("<div class='card'>");
    const cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
        $("<a class='btn btn-info notes'>Article Notes</a>")
      )
    );

    const cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);

    // Attach Mongo's _id to the jQuery element for deletes and saves
    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
    // Tell the user there are no articles
    const emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>No articles to display!</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // This function renders note list items to the notes zection
    const notesToRender = [];
    const currentNote;
    if (!data.notes.length) {
      // If there are no notes, display a message
      currentNote = $("<li class='list-group-item'>No notes for this article.</li>");
      notesToRender.push(currentNote);
    } else {
      for (const i = 0; i < data.notes.length; i++) {
        currentNote = $("<li class='list-group-item note'>")
          .text(data.notes[i].noteText)
          .append($("<button class='btn btn-danger note-delete'>x</button>"));
        // Store the note id on the delete button for deleting
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Add currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    // Function for deleting articles/headlines
    const articleToDelete = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    // Ajax delete REST for deleting an article/headline
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }
  function handleArticleNotes(event) {

    const currentArticle = $(this)
      .parents(".card")
      .data();

    $.get("/api/notes/" + currentArticle._id).then(function(data) {

      const modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Notes For Article: " + currentArticle._id),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Note</button>")
      );
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      const noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
     
      $(".btn.save").data("article", noteData);
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    
    const noteData;
    const newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function() {
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {

    const noteToDelete = $(this).data("_id");
    // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("api/clear")
      .then(function() {
        articleContainer.empty();
        initPage();
      });
  }
});
