
$(document).ready(function() {
    loadTopics();

    $('.create-post-input').click(function() {
        $('.expanded-post').show();
        $(this).hide();
    });

    $(document).on('click', '.category-tag', function() {
        $(this).toggleClass('active');
    });

    $('.post-button').click(function() {
        const content = $('.post-input').val().trim();
        if (!content) {
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

        if (selectedTopicIds.length === 0) {
            alert('Vui lòng chọn ít nhất một chủ đề!');
            return;
        }

        const postData = {
            content: content,
            topics: selectedTopicIds
        };

        $.ajax({
            url: 'http://localhost:8081/share-edu/post',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            headers: {
            'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.code === 1000) {
                    $('.post-input').val('');
                    $('.category-tag').removeClass('active');
                    $('.expanded-post').hide();
                    $('.create-post-input').show();
                    
                    const newPost = response.result;
                    const currentTime = new Date().toLocaleString();
                    const postHtml = renderPost(newPost, currentTime, false, "POST");
                    
                    const $newPostElement = $(postHtml).addClass('new-post');
                    $('#timeline-container').prepend($newPostElement);
                    
                    showNotification('Đăng bài viết thành công!');
                } else {
                    alert('Có lỗi xảy ra: ' + (response.message || 'Không thể đăng bài'));
                }
            },
            error: function(xhr, status, error) {
                alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
                console.error(xhr.responseText);
            }
        });
    });
});

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

function showNotification(message) {
    const notification = $('<div class="notification"></div>').text(message);
    $('body').append(notification);
    
    notification.fadeIn().delay(3000).fadeOut(function() {
        $(this).remove();
    });
}

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