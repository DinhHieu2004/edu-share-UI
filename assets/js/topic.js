const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlIjoiUk9MRV9BRE1JTiBERUxFVEVfUE9TVCBERUxFVEVfQ09NTUVOVCBBUFBST1ZFX1RPUElDIENSRUFURV9QT1NUIiwiaXNzIjoiZGluaEhpZXUuY29tIiwiZXhwIjoxNzQ4MTc5MzcxLCJpYXQiOjE3NDc4MTkzNzEsImp0aSI6ImMxMWNkNmU2LTQ3NDItNDg1ZC04NTE2LTFkNDY0M2JjOWM4MyJ9.uDX5vtGvw_5kRe8EgRuzJOwCcsEYkUXlNl1ntzr8QIA9kgRB7e_WBtlCOnrfNx8dNJmEqReQjAle2qgPgVK9jw";

$(document).ready(function () {
    function loadPendingTopics() {
        $.ajax({
            url: `${CONFIG.BASE_API}/topics/pending`,  // <-- CHỈNH LẠI THÀNH LOCALHOST
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

    $(document).on('click', '.approve-btn', function () {
        const topicId = $(this).data('id');
        $.ajax({
            url: `http://localhost:8080/share-edu/topics/${topicId}/approve`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                alert("Chủ đề đã được duyệt!");
                loadPendingTopics();
            },
            error: function () {
                alert("Duyệt thất bại.");
            }
        });
    });

    $(document).on('click', '.reject-btn', function () {
        const topicId = $(this).data('id');
        $.ajax({
            url: `http://localhost:8080/share-edu/topics/${topicId}/reject`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                alert("Chủ đề đã bị từ chối.");
                loadPendingTopics();
            },
            error: function () {
                alert("Từ chối thất bại.");
            }
        });
    });

    loadPendingTopics();
});
