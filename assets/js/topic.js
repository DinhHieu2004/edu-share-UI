const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlIjoiUk9MRV9BRE1JTiBDUkVBVEVfUE9TVCBERUxFVEVfQ09NTUVOVCBERUxFVEVfUE9TVCBBUFBST1ZFX1RPUElDIiwiaXNzIjoiZGluaEhpZXUuY29tIiwiZXhwIjoxNzQ4NTQyODEwLCJpYXQiOjE3NDgxODI4MTAsImp0aSI6IjNiNzkyOTM1LTliNmQtNDVhYS1hYTEwLWNmMDEyNjJmOWM3OCJ9.htrMzZNPk7XdHvh3Z-9etz9aQeeyQhpHaabRMwpKfncWAvi_goWmVetC_RwHdT1bK5OdxSEgUjkqEWClfRFLLA";

$(document).ready(function () {
    function loadPendingTopics() {
        $.ajax({
            url: `${CONFIG.BASE_API}/topics/pending`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (topics) {
                const tbody = $('#topic-table tbody');
                tbody.empty();

                topics.forEach(topic => {
                    const row = `
                        <tr>
                            <td>${topic.id}</td>
                            <td>${topic.name}</td>
                            <td>${topic.description || ''}</td>
                            <td>
                                <button class="approve-btn" data-id="${topic.id}">Duyệt</button>
                                <button class="reject-btn" data-id="${topic.id}">Từ chối</button>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            },
            error: function () {
                alert("Không thể tải danh sách chủ đề.");
            }
        });
    }
    <!-- 16.1.1.0 Người dùng nhấn nút "Duyệt" trên topic muốn duyệt (hiển thị thông qua Ajax) -->
    $(document).on('click', '.approve-btn', function () {
        const topicId = $(this).data('id');
        $.ajax({
            <!-- 16.1.1.1. gọi Ajax PUT /share-edu/topics/{id}/approve -->
            url: `${CONFIG.BASE_API}/topics/${topicId}/approve`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                // 16.1.1.14: Thông báo thành công
                alert("Chủ đề đã được duyệt!");
                // 16.1.1.15 load lại danh sách chờ duyệt
                loadPendingTopics();
            },
            error: function (xhr) {
                let msg = "Duyệt thất bại.";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    // 16.2.3, 16.2.7, 16.2.11 Hiển thị lỗi
                    msg = xhr.responseJSON.message;
                }
                alert(msg);
                // 16.2.4 16.2.8, 16.2.12 Ajax load lại danh sách chờ duyệt
                loadPendingTopics();
            }

        });
    });

    $(document).on('click', '.reject-btn', function () {
        const topicId = $(this).data('id');
        $.ajax({
            url: `${CONFIG.BASE_API}/topics/${topicId}/reject`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                alert("Chủ đề đã bị từ chối.");
                loadPendingTopics();
            },
            error: function (xhr) {
                let msg = "Từ chối thất bại.";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    msg = xhr.responseJSON.message;
                }
                alert(msg);
            }

        });
    });

    loadPendingTopics();
});
