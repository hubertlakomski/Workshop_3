$(function () {

    var booksContainer = $(".books");
    var BOOKS_API = "http://localhost:8282";

    function fetchAllBooks() {
        $.ajax({
            url: BOOKS_API +"/books",
            type: "GET"
        }).done(function (result) {
            renderBooks(result)
        })
    }

    function getBookData(id, div) {
        $.ajax({
            url: BOOKS_API + "/books/"+id,
            type: "GET"
        }).done(function (result) {

            div.empty();

            var isbn = $("<div class='isbn'>").text("ISBN: "+result.isbn);
            var author = $("<div class='author'>").text("Author: "+result.author);
            var publisher = $("<div class='publisher'>").text("Publisher: "+result.publisher);
            var type = $("<div class='type'>").text("Type: "+result.type);

            div.append(isbn, author, publisher, type);
        });
    }

    fetchAllBooks();

    booksContainer.on("click", ".title", function () {
        var div = $(this).find(".description");

        div.toggle("fast", function () {

        });

        getBookData($(this).data("id"), div);
    });

    function delBook(id){

        $.ajax({
            url: BOOKS_API + "/books/"+id,
            type: "DELETE"
        }).done(function (result) {
            booksContainer.empty();
            fetchAllBooks()
        });

    }

    booksContainer.on("click", ".delBtn", function () {

        delBook($(this).data("id"));
        $(this).remove();
    });

    var Book = function (title, author, isbn, publisher, type) {

        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
        this.type = type;
    };

    function addBook(book) {
        $.ajax({
            url: BOOKS_API + "/books",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(book)
        }).done(function (result) {
            booksContainer.empty();
            fetchAllBooks()
        });
    }
    var addButton = $("#button");

    addButton.on("click", function () {

        var title = $("[placeholder='title']").val();
        var author = $("[placeholder='author']").val();
        var isbn = $("[placeholder='isbn']").val();
        var publisher = $("[placeholder='publisher']").val();
        var type = $("[placeholder='type']").val();

        var bookToAdd = new Book(title,author,isbn,publisher,type);

        addBook(bookToAdd);
    });

    function renderBooks(books) {

        books.forEach(function (book) {
            var title = $("<div class='title' data-id='"+book.id+"'>").text(book.title);
            var newDiv = $("<div class='description' style='display: none'>");
            var delBtn = $("<p class='delBtn' data-id='"+book.id+"'>").text("Usuń");


            newDiv.appendTo(title);
            booksContainer.append(title);
            booksContainer.append(delBtn);
        })
    }

});