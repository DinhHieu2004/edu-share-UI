let selectedPost = null;
let selectedType = null;

const token ="eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaW5oSGlldS5jb20iLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0ODE3NTgxOCwiaWF0IjoxNzQ3ODE1ODE4LCJqdGkiOiJmYTFlZGNjZi1hZWIwLTQ0Y2MtOTliZC0zYTgyYjYwNmIwNjIiLCJzY29wZSI6IlJPTEVfQURNSU4gQ1JFQVRFX1BPU1QgREVMRVRFX0NPTU1FTlQgQVBQUk9WRV9UT1BJQyBERUxFVEVfUE9TVCJ9.qoAiadkxRRRlYW1YJIDAa-u25FY0usBiNtyMobrFF-RnDEcI-xszz6Fmre6nLvcyzhDDgDd0j7PmVTLKxYc-jg"


//test data.
const tokenTest ="eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaW5oSGlldS5jb20iLCJzdWIiOiJkaW5oSGlldTEyMyIsImV4cCI6MTc0NzkxNDc3MywiaWF0IjoxNzQ3NTU0NzczLCJqdGkiOiIyOTVhZTc3Yi0xNmFhLTRmYzktODZjNC1mZTI5ZDhjNTM5YWYiLCJzY29wZSI6IiJ9.r4Osww1T7ol0xjjswZytY8Oa56u-S0ACsv3vKeMfcsgC5wIpGvWfSyOKCKUwrxWmEnU_q5BB79i_7wwFMd9rFQ"
const postIdTest =111;

//when user click share button(8.1.1. Click the share button on the post)
//8.1.2 Trigger click event on .btn-share
$(document).on('click', '.btn-share', function () {

    //8.1.3 stores selectedType and selectedPost
    selectedType = $(this).data('type');
    selectedPost = $(this).data('post');

  //8.1.4 renderPost(selectPost, null. true, "POST")
    const previewHtml = renderPost(selectedPost, null, true, "POST");
    //8.1.5 genarates preview HTML
    $('#share-post-preview').html(previewHtml);

    //8.1.6 display share modal with post preview
    $('#sharePostModal').fadeIn();
});

//when user click X button on sharePostModal (8.2.1 clicks X button)
//8.2.2 trigger lose event
$(document).on('click', '.close-btn', function () {
    //8.2.3 closeSharePostModal() 
      closeSharePostModal();

});

//when user click outside modal (8.2.1 clicks outside modal)
//8.2.2 trigger lose event
$(document).on('click', '#sharePostModal', function (e) {
        if ($(e.target).is('#sharePostModal')) {
            //8.2.3 closeSharePostModal() 
                closeSharePostModal();

        }
    });

function closeSharePostModal() {
    // 8.2.4 hides modal
    $('#sharePostModal').fadeOut();       
     // 8.2.5 Set input to empty       
    $('#share-caption').val('');                
}

   //when user click "confirm-share" button (8.1.8 click confirm share button)
   //8.1.9 triggers click enven on
$('#confirm-share').on('click', function () {

   // 8.1.10 get caption from input field (from 8.1.7 Enter caption text)
    const caption = $('#share-caption').val();

    //8.1.11 prepares payload with postId and caption
    const payload = {
        postId: selectedPost.id,
        caption: caption
    };


   //8.1.12 initiates AJAX call with payload
    $.ajax({

        //8.1.14 POST request to https://udcskt.up.railway.app/share-edu/postShare (→ 8.1.15 @PostMapping createPostShare)

        url: 'http://localhost:8080/share-edu/postShare',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),

        //8.1.13 send authentication token via header in request to access resource
        headers: {
        'Authorization': `Bearer ${token}`
        },
        success: function (res) {

            //8.1.13. display share sucsess notication
            alert("Chia sẻ thành công!");
            //8.1.24 closeSharePostModal() 
            closeSharePostModal();

        },

        // 8.3.14, 8.4.14  display Share failed notification
        error: function () {
            alert("Lỗi khi chia sẻ bài viết");
            //8.3.15, 8.4.15 closeSharePostModal() 
            closeSharePostModal();

        }
    });
});


