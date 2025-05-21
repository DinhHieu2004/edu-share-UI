let selectedPost = null;
let selectedType = null;

const token ="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlIjoiUk9MRV9BRE1JTiBERUxFVEVfUE9TVCBERUxFVEVfQ09NTUVOVCBBUFBST1ZFX1RPUElDIENSRUFURV9QT1NUIiwiaXNzIjoiZGluaEhpZXUuY29tIiwiZXhwIjoxNzQ4MTc5MzcxLCJpYXQiOjE3NDc4MTkzNzEsImp0aSI6ImMxMWNkNmU2LTQ3NDItNDg1ZC04NTE2LTFkNDY0M2JjOWM4MyJ9.uDX5vtGvw_5kRe8EgRuzJOwCcsEYkUXlNl1ntzr8QIA9kgRB7e_WBtlCOnrfNx8dNJmEqReQjAle2qgPgVK9jw"

$(document).on('click', '.btn-share', function () {
    selectedType = $(this).data('type');
    selectedPost = $(this).data('post');

    console.log(selectedPost, selectedType)

    const previewHtml = renderPost(selectedPost, null, true, "POST");
    $('#share-post-preview').html(previewHtml);

    $('#sharePostModal').fadeIn();
});

$(document).on('click', '.close-btn', function () {
    $('#sharePostModal').fadeOut();
    $('#share-caption').val('');
});

$(document).on('click', '#sharePostModal', function (e) {
        if ($(e.target).is('#sharePostModal')) {
            $('#sharePostModal').fadeOut();
        }
    });

$('#confirm-share').on('click', function () {
    const caption = $('#share-caption').val();

    const payload = {
        postId: selectedPost.id,
        caption: caption
    };


    $.ajax({
        url: 'http://localhost:8081/share-edu/postShare',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        headers: {
        'Authorization': `Bearer ${token}`
        },
        success: function (res) {
            alert("Chia sẻ thành công!");
            $('#shareModal').fadeOut();
            $('#share-caption').val('');
        },
        error: function () {
            alert("Lỗi khi chia sẻ bài viết");
        }
    });
});
