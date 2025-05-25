let utoken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cnVuZ2RvbmdsZSIsInNjb3BlIjoiIiwiaXNzIjoiZGluaEhpZXUuY29tIiwiZXhwIjoxNzQ4NTI0OTQ4LCJpYXQiOjE3NDgxNjQ5NDgsImp0aSI6IjM5ZmRiNGQ4LTIxYTktNGFkNC1iMWRiLTU5NDU4YzE5YWI5OSJ9.w6ZW1hpsb8TsDS4zgRr1crCqbaR634u7z6nhlTIvYNAwDAMvAuHrWJxkPMzuxYskmOP4X_xqceQCdB4ioRxSZw"
$(document).ready(function () {
    function loadUsers() {
        $.ajax({
            url: `${CONFIG.localhost}/users`, 
            method: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${utoken}`
            },
            success: function(response) {
                console.log('Dữ liệu trả về:', response);

                const users = response.result;

                if (Array.isArray(users)) {
                    const tbody = $('#user-table tbody');
                    tbody.empty();

                    users.forEach(user => {
                        const row = `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.userName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.firstName}</td>
                                <td>${user.dob}</td>
                                <td>${user.email}</td>
                                <td>
                                    <button class="approve-btn" data-id="${user.id}">Cập nhật</button>
                                    <button class="reject-btn   " data-id="${user.id}">Xóa</button>
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                } else {
                    console.error('Dữ liệu nhận về không phải là mảng:', users);
                }
            },
            error: function (err) {
                console.error('Lỗi khi tải danh sách người dùng:', err);
            }
        });
    }

    // Gọi hàm khi tab "Người dùng" được hiển thị
    $('[data-tab="users"]').on('click', function () {
        loadUsers();
    });

    $('#add-user-form').on('submit', function (e) {
    e.preventDefault();

    // Ẩn lỗi cũ trước khi submit
    $('#form-error').hide().text('');

    const newUser = {
        userName: $('#username').val(),
        password: $('#password').val(),
        firstName: $('#firstname').val(),
        lastName: $('#lastname').val(),
        dob: $('#birthdate').val(),
        email: $('#email').val()
    };

    $.ajax({
        url: `${CONFIG.localhost}/users`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newUser),
        headers: {
            'Authorization': `Bearer ${utoken}`
        },
        success: function (res) {
            alert('Thêm người dùng thành công!');
            $('#add-user-form')[0].reset();
            $('#addUserModal').fadeOut();
            loadUsers(); // làm mới danh sách
        },
        error: function (err) {
            console.error('Lỗi khi thêm người dùng:', err);

            // Lấy thông báo lỗi từ response JSON, nếu có
            const message = err.responseJSON && err.responseJSON.message 
                            ? err.responseJSON.message 
                            : 'Thêm người dùng thất bại. Vui lòng thử lại.';

            // Hiển thị lỗi trong div
            $('#form-error').text(message).show();
        }
    });
});


    $('[data-tab="users"]').on('click', function () {
        loadUsers();
    });
    // Mở modal khi bấm nút
    $('#openAddUserModal').on('click', function () {
        $('#addUserModal').fadeIn();
    });

    // Đóng modal khi bấm nút X
    $('.close').on('click', function () {
        $('#addUserModal').fadeOut();
    });

    // Đóng modal khi click ra ngoài vùng modal
    $(window).on('click', function (e) {
        if ($(e.target).is('#addUserModal')) {
            $('#addUserModal').fadeOut();
        }
    });

});

