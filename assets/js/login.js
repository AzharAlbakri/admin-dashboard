
//const API_BASE_URL = 'https://user-api-server.onrender.com';
const API_BASE_URL = 'http://localhost:3000';


$(document).ready(function () {
    $('#loginForm').on('submit', function (event) {
      event.preventDefault(); // منع التحديث الافتراضي للصفحة
  
      const email = $('#email').val().trim();
      const password = $('#password').val().trim();
  
      // التحقق من الحقول
      if (!email || !password) {
        $('#loginError').text('يرجى ملء جميع الحقول').show();
        return;
      }
  
      // إرسال البيانات إلى API
      $.ajax({
        url: `${API_BASE_URL}/adminLogin`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {
          console.log("login creds", response);
          let adminInfo = response.adminInfo;
          console.log("adminInfo",adminInfo);
          alert("1");
          // في حال نجاح تسجيل الدخول
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token); // تخزين التوكن في Local Storage
          //localStorage.setItem('adminInfo', response.adminInfo); // تخزين معلومات الادمن في Local Storage
          localStorage.setItem('name', response.adminInfo.fullName); // تخزين معلومات الادمن في Local Storage
          localStorage.setItem('email', response.adminInfo.email); // تخزين معلومات الادمن في Local Storage
          localStorage.setItem('role', response.adminInfo.role); // تخزين معلومات الادمن في Local Storage

          window.location.href = 'dashboard.html'; // إعادة التوجيه إلى صفحة الـ Dashboard
        },
        error: function (xhr) {
          // في حال وجود خطأ
          const errorMsg = xhr.responseJSON?.error || 'حدث خطأ أثناء تسجيل الدخول.';
          $('#loginError').text(errorMsg).show();
        },
      });
    });
  });
  