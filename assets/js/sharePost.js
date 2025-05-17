let selectedPost = null;
let selectedType = null;

const token ="eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaW5oSGlldS5jb20iLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0NzgxMjg3MCwiaWF0IjoxNzQ3NDUyODcwLCJqdGkiOiI2NzBlYzkyMi0yNTNiLTRjY2QtOWQ4OC0zYjIwNWI1NTEyYTYiLCJzY29wZSI6IlJPTEVfQURNSU4gQVBQUk9WRV9UT1BJQyBDUkVBVEVfUE9TVCBERUxFVEVfQ09NTUVOVCBERUxFVEVfUE9TVCJ9.Jv7iO-yujRJE-Z2ZCGgUZguCuF8o27lANmNHHMEx5JOGhEaXvzHXHfbLhGg2lUNnd8aUwaNHKAIHY8PXE1jGRw"

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
        url: 'http://localhost:8080/share-edu/postShare',
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
