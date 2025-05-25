$(document).ready(function() {
    // Load topics when the page is ready (not part of the createPost sequence diagram)
    loadTopics();

    // 4.1.1 [click] "Chia sẻ kiến thức của bạn..."
    $('.create-post-input').click(function() {
        // 4.1.2 [render] Display expanded-post form
        $('.expanded-post').show();
        $(this).hide();
    });

    // 4.1.3 [input] Enter content and select topics (category-tag) - Part of user input
    $(document).on('click', '.category-tag', function() {
        $(this).toggleClass('active');
    });

    // 4.1.4 [click] "Đăng bài" button
    $('.post-button').click(function() {
        const content = $('.post-input').val().trim();
        // 4.1.6 [validate] Check content and topics
        if (!content) {
            // 4.2.1 [if empty content]
            // 4.2.2 [alert] "Vui lòng nhập nội dung bài viết!"
            alert('Vui lòng nhập nội dung bài viết!');
            return;
        }

        const selectedTopicIds = [];
        $('.category-tag.active').each(function() {
            const topicId = $(this).data('id');
            if (topicId) {
                selectedTopicIds.push(topicId);
            }
        });

        // 4.1.6 [validate] Check content and topics
        if (selectedTopicIds.length === 0) {
            // 4.3.1 [if no topics]
            // 4.3.2 [alert] "Vui lòng chọn ít nhất một chủ đề!"
            alert('Vui lòng chọn ít nhất một chủ đề!');
            return;
        }

        // 4.1.8 [prepare] Create payload (content, topics)
        const postData = {
            content: content,
            topics: selectedTopicIds
        };

        // 4.1.9 [send] Initiate AJAX request
        $.ajax({
            url: 'http://localhost:8081/share-edu/post',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            // 4.1.10 [post] Send POST /post (with Authorization: Bearer ${token})
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.code === 1000) {
                    // 4.1.34 [update] Reset form (clear content, unselect topics)
                    $('.post-input').val('');
                    $('.category-tag').removeClass('active');
                    // 4.1.35 [update] Hide expanded-post, show create-post-input
                    $('.expanded-post').hide();
                    $('.create-post-input').show();
                    
                    const newPost = response.result;
                    const currentTime = new Date().toLocaleString();
                    // 4.1.36 [render] Display new post on timeline (renderPost)
                    const postHtml = renderPost(newPost, currentTime, false, "POST");
                    
                    const $newPostElement = $(postHtml).addClass('new-post');
                    $('#timeline-container').prepend($newPostElement);
                    
                    // 4.1.37 [notify] Display "Đăng bài viết thành công!"
                    showNotification('Đăng bài viết thành công!');
                } else {
                    // 4.4.10 or 4.5.10 [notify] Display "Create post failed" notification (user or topic not found)
                    alert('Có lỗi xảy ra: ' + (response.message || 'Không thể đăng bài'));
                }
            },
            error: function(xhr, status, error) {
                // Not explicitly in sequence diagram - Display error notification for connection issues
                alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
                console.error(xhr.responseText);
            }
        });
    });
});

// Load topics (not part of the createPost sequence diagram)
function loadTopics() {
    $.ajax({
        url: 'http://localhost:8081/share-edu/topics',
        method: 'GET',
        success: function(response) {
            if (response.code === 1000) {
                const topics = response.result;
                const categoriesContainer = $('.post-categories');
                
                categoriesContainer.empty();
                
                topics.forEach(topic => {
                    const categoryTag = $(`<div class="category-tag" data-id="${topic.id}">${topic.name}</div>`);
                    categoriesContainer.append(categoryTag);
                });
            } else {
                console.error('Lỗi khi lấy danh sách topics:', response.message);
            }
        },
        error: function() {
            console.error('Không thể kết nối đến API topics');
        }
    });
}

// 4.1.37 [notify] Display "Đăng bài viết thành công!" (used in success callback)
function showNotification(message) {
    const notification = $('<div class="notification"></div>').text(message);
    $('body').append(notification);
    
    notification.fadeIn().delay(3000).fadeOut(function() {
        $(this).remove());
    });
}

// 4.1.36 [render] Display new post on timeline (renderPost) (used in success callback)
if (typeof renderPost !== 'function') {
    function renderPost(postData, displayTime, hideActions, type) {
        const authorName = postData.author?.userName || 'Ẩn danh';
        const profilePicLetter = authorName.charAt(0).toUpperCase();
        const postContent = postData.content || '';
        const topics = postData.topics?.map(t => t.name).join(", ") || '';

        let html = `
            <div class="post ${hideActions ? 'inner-post' : ''}" style="${hideActions ? 'border-left: 3px solid #ccc; padding-left: 10px; background: #f5f5f5; margin-top: 10px;' : ''}">
                <div class="post-header">
                    <div class="profile-pic">${profilePicLetter}</div>
                    <div class="post-info">
                        <div class="post-author">${authorName}</div>
                        <div class="post-meta">
                        ${displayTime ? `<span>${displayTime}</span>` : ''}
                        ${topics ? `<span class="post-category">• ${topics}</span>` : ''}
                    </div>

                    </div>
                </div>
                <div class="post-content">
                    <p>${postContent}</p>
                </div>
        `;

        if (!hideActions) {
            html += `
                <div class="post-actions-buttons">
                    <button class="action-button">
                        <span class="icon">♡</span>
                        <span class="action-text">0</span>
                    </button>
                    <button class="action-button">
                        <span class="icon">💬</span>
                        <span class="action-text">0</span>
                    </button>
                   <button class="action-button btn-share" 
                            data-type="${type || 'POST'}" 
                            data-post='${JSON.stringify(postData)}'>
                        <span class="icon">↪</span>
                    </button>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }
}