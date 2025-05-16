$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8080/share-edu/timeline',
        method: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                const container = $('#timeline-container');
                response.result.forEach(item => {
                    const type = item.type;
                    const time = new Date(item.time);
                    const displayTime = time.toLocaleString();

                    if (type === "POST") {
                        const post = item.post;
                        const html = renderPost(post, displayTime, false);
                        container.append(html);
                    } else if (type === "SHARE") {
                        const share = item.share;
                        const shareAuthor = share.author?.userName || "Ẩn danh";
                        const shareLetter = shareAuthor.charAt(0).toUpperCase();
                        const shareTime = displayTime;
                        const originalPostTime = new Date(share.post.createdAt).toLocaleString();


                        let html = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-pic">${shareLetter}</div>
                                <div class="post-info">
                                    <div class="post-author">${shareAuthor} đã chia sẻ một bài viết</div>
                                    <div class="post-meta">
                                        <span>${shareTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="post-content">
                                ${share.caption ? `<p>${share.caption}</p>` : ''}


                                ${renderPost(share.post, originalPostTime, true)}

                            </div>
                            <div class="post-actions-buttons">
                                <button class="action-button">
                                    <span class="icon">♡</span>
                                    <span class="action-text">0</span>
                                </button>
                                <button class="action-button">
                                    <span class="icon">💬</span>
                                    <span class="action-text">0</span>
                                </button>
                                <button class="action-button">
                                    <span class="icon">↪</span>
                                </button>
                            </div>
                        </div>
                        `;
                        container.append(html);
                    }
                });
            } else {
                alert("Lỗi khi lấy dữ liệu timeline");
            }
        },
        error: function () {
            alert("Không thể kết nối đến máy chủ.");
        }
    });

    function renderPost(postData, displayTime, hideActions) {
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
                    <button class="action-button">
                        <span class="icon">↪</span>
                    </button>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }
});
