
// تحقق من وجود التوكن
const token = localStorage.getItem('token');
if (!token) {
  alert('Unauthorized! Please login first.');
  window.location.href = 'index.html';
}
// فتح النموذج عند الضغط على زر "إضافة مقال جديد"
$('#addArticleBtn').click(function () {
  $('#addArticlePopup').modal('show');
});


// تهيئة محرر Quill
var quill = new Quill('#editor-container', {
  theme: 'snow', // مظهر المحرر
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['image', 'link', 'blockquote', 'code-block'],
      [{ align: [] }],
      ['clean'] // إزالة التنسيق
    ]
  }
});


$(document).ready(function () {

// Sidebar Toggle
  $('#sidebarToggle').click(function () {
    $('#sidebar').toggleClass('closed');
    $('#page-content').toggleClass('expanded');
  });

  $('#sidebarClose').click(function () {
    $('#sidebar').addClass('closed');
    $('#page-content').addClass('expanded');
  });


  // إحضار معلومات المستخدم من الـ localStorage (أو الـ API)
  let adminFullName = localStorage.getItem('name');
  let adminEmail = localStorage.getItem('email');
  let adminRole = localStorage.getItem('role');
  

  // إحضار معلومات المستخدم من الـ localStorage (أو الـ API)
  // let user = JSON.parse(localStorage.getItem('user'));
 // التحقق من وجود البيانات واستبدال الفراغات بـ "_"
if (adminFullName) {
  adminFullName = adminFullName.replace(/ /g, "_");
} else {
  adminFullName = "Admin";
}

if (!adminEmail) {
  adminEmail = "؟؟";
}

if (!adminRole) {
  adminRole = "؟؟";
}

// عرض البيانات في الـ Navbar
$('#userInfo').text(`${adminFullName} (${adminEmail}) - ${adminRole}`);


  // تسجيل الخروج
  $('#logoutLink').on('click', function () {
    localStorage.removeItem('token'); // حذف التوكن
    window.location.href = 'index.html'; // إعادة التوجيه لصفحة تسجيل الدخول
  });

  // التعامل مع الروابط في الـ Sidebar
  $('#usersLink').on('click', function () {
    loadUsers();
  });

  $('#patientsLink').on('click', function () {
    loadPatients();
  });

  $('#appointmentsLink').on('click', function () {
    // loadAppointments();
    loadCalendar();
  });

  $('#articlesLink').on('click', function () {
    loadArticles();
  });

  // تحميل المستخدمين
  function loadUsers() {
    $('#content').html('<h3>Loading Users...</h3>');
    $.ajax({
      url: 'http://localhost:3000/dashboard/getAllUsers',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      success: function (response) {
        let usersHTML = '<h3>Users</h3><table class="table table-striped"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Contact Method</th><th>Consultation Type</th><th>Additional Info</th><th>Created At</th></tr></thead><tbody>';
        response.forEach(user => {
          usersHTML += `<tr><td>${user._id}</td><td>${user.fullName}</td><td>${user.email}</td><td>${user.phone}</td><td>${user.contactMethod}</td><td>${user.consultationType}</td><td>${user.additionalInfo}</td><td>${user.createdAt}</td></tr>`;
        });
        usersHTML += '</tbody></table>';
        $('#content').html(usersHTML);
      },
      error: function () {
        $('#content').html('<p class="text-danger">Failed to load users.</p>');
      },
    });
  }

  // تحميل المرضى
  function loadPatients() {
    $('#content').html('<h3>Loading Patients...</h3>');
    $.ajax({
      url: 'http://localhost:3000/dashboard/getAllPatients', // تأكد من أن هذا هو الرابط الصحيح للـ API
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }, // إرسال التوكن للتحقق
      success: function (response) {
        let patientsHTML = `
          <h3>Patients</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Identity Number</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Reason</th>
                <th>Preferred Doctor</th>
                <th>Additional Notes</th>
                <th>Insurance</th>
                <th>Insurance Company</th>
                <th>Policy Number</th>
                <th>Reminder Method</th>
                <th>Booked At</th>
                <th>Agree to Terms</th>
              </tr>
            </thead>
            <tbody>`;

        response.forEach(patient => {
          patientsHTML += `
            <tr>
              <td>${patient._id}</td>
              <td>${patient.patient_name}</td>
              <td>${patient.phone_number}</td>
              <td>${patient.email}</td>
              <td>${patient.identity_number}</td>
              <td>${patient.appointment_date}</td>
              <td>${patient.appointment_time}</td>
              <td>${patient.appointment_reason}</td>
              <td>${patient.preferred_doctor || 'N/A'}</td>
              <td>${patient.additional_notes || 'N/A'}</td>
              <td>${patient.has_insurance ? 'Yes' : 'No'}</td>
              <td>${patient.insurance_company || 'N/A'}</td>
              <td>${patient.insurance_policy_number || 'N/A'}</td>
              <td>${patient.reminder_method}</td>
              <td>${new Date(patient.booked_at).toLocaleString()}</td>
              <td>${patient.agree_to_terms ? 'Yes' : 'No'}</td>
            </tr>`;
        });

        patientsHTML += `</tbody></table>`;
        $('#content').html(patientsHTML);
      },
      error: function () {
        $('#content').html('<p class="text-danger">Failed to load patients.</p>');
      },
    });
  }

  // تحميل المواعيد
  // function loadAppointments() {
  //   $('#content').html('<h3>Loading Appointments...</h3>');
  //   $.ajax({
  //     url: 'http://localhost:3000/dashboard/getAllAppointments',
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` },
  //     success: function (response) {
  //       let appointmentsHTML = '<h3>Appointments</h3><table class="table table-striped"><thead><tr><th>ID</th><th>Date</th><th>Time</th><th>Patient Name</th></tr></thead><tbody>';
  //       response.forEach(appointment => {
  //         appointmentsHTML += `<tr><td>${appointment._id}</td><td>${appointment.date}</td><td>${appointment.time}</td><td>${appointment.patientName}</td></tr>`;
  //       });
  //       appointmentsHTML += '</tbody></table>';
  //       $('#content').html(appointmentsHTML);
  //     },
  //     error: function () {
  //       $('#content').html('<p class="text-danger">Failed to load appointments.</p>');
  //     },
  //   });
  // }

  // تحميل المقالات
  function loadArticles() {
    $('#content').html('<h3>Loading Articles...</h3>');
    $.ajax({
      url: 'http://localhost:3000/dashboard/getAllArticles',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      success: function (response) {
        let articlesHTML = '<h3>Articles</h3> <div class="row">';

        response.forEach(article => {
          const isChecked = article.status === 'Published' ? 'checked' : '';
          articlesHTML += `
            <div class="col-lg-2 mb-4">
              <div class="card">
                <img src="${article.images[0] || 'default-image.jpg'}" class="card-img-top" alt="${article.title}">
                <div class="card-body">
                  <h5 class="card-title">${article.title}</h5>
                  <p class="card-text">${article.summary}</p>
                  
                  <button class="btn btn-primary btn-sm" onclick="viewArticle('${article._id}')">Read More</button>
                  <button class="btn btn-warning btn-sm" onclick="editArticle('${article._id}')">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteArticle('${article._id}')">Delete</button>
  
                  <!-- Switch Toggle for Publish/Unpublish -->
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" role="switch" id="switch-${article._id}"
                      ${isChecked} onclick="toggleStatus('${article._id}', this.checked)">
                    <label class="form-check-label" for="switch-${article._id}">
                      ${article.status}
                    </label>
                  </div>
                </div>
              </div>
            </div>`;
        });
        articlesHTML += '</div>';
        $('#content').html(articlesHTML);
      },
      error: function () {
        $('#content').html('<p class="text-danger">Failed to load articles.</p>');
      },
    });
  }

  function loadCalendar() {
    $('#content').html('<h3>Loading Calendar...</h3>');

    $.ajax({
      url: 'http://localhost:3000/dashboard/getAllAppointments',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      success: function (appointments) {
          $('#content').html('<div id="calendar"></div>');
  
          console.log(appointments);
          let events = appointments.map(appointment => ({
              id: appointment._id,
              title: getEventTitle(appointment),
              start: `${appointment.date}T${appointment.time}`,
              backgroundColor: getColor(appointment.status),
              borderColor: getBorderColor(appointment.status),
              extendedProps: { 
                  status: appointment.status, 
                  date: appointment.date, 
                  patientName: appointment.patientName || "N/A", 
                  time: appointment.time, 
                  id: appointment._id
              }
          }));
  
          let calendarEl = document.getElementById('calendar');
  
          if (calendarEl) {
              let calendar = new FullCalendar.Calendar(calendarEl, {
                  initialView: 'dayGridMonth',
                  headerToolbar: {
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  },
                  events: events,
                  eventClick: function (info) {
                      console.log("Appointment Details:", info.event.extendedProps);
  
                      let currentId = info.event.extendedProps.id;
                      let currentDate = info.event.extendedProps.date;
                      let currentPatientName = info.event.extendedProps.patientName;
                      let currentTime = info.event.extendedProps.time;
                      let currentStatus = info.event.extendedProps.status;
  
                      // عرض البيانات في popup
                      let popupContent = `
                          <div class="popup">
                              <h3>Appointment Details</h3>
                              <p><strong>ID:</strong> ${currentId}</p>
                              <p><strong>Date:</strong> ${currentDate}</p>
                              <p><strong>Time:</strong> ${currentTime}</p>
                              <p><strong>Patient:</strong> ${currentPatientName}</p>
                              <p><strong>Status:</strong> ${currentStatus}</p>
                              <label for="newStatus">Change Status:</label>
                              <select id="newStatus">
                                  <option value="available" ${currentStatus === "available" ? "selected" : ""}>Available</option>
                                  <option value="booked" ${currentStatus === "booked" ? "selected" : ""}>Booked</option>
                                  <option value="locked" ${currentStatus === "locked" ? "selected" : ""}>Locked</option>
                              </select>
                              <button id="updateStatusBtn">Update</button>
                              <button id="closePopup">Close</button>
                          </div>
                      `;
  
                      // عرض النافذة
                      $('body').append(`<div class="popup-container">${popupContent}</div>`);
  
                      // عند الضغط على زر الإغلاق
                      $('#closePopup').click(function () {
                          $('.popup-container').remove();
                      });
  
                      // عند الضغط على زر التحديث
                      $('#updateStatusBtn').click(function () {
                          let newStatus = $('#newStatus').val();
                          if (newStatus && ["available", "booked", "locked"].includes(newStatus)) {
                              updateAppointmentStatus(currentId, newStatus, () => {
                                  info.event.setProp('backgroundColor', getColor(newStatus));
                                  info.event.setProp('borderColor', getBorderColor(newStatus));
                                  info.event.setProp('title', getEventTitle({ _id: currentId, status: newStatus }));
                                  info.event.setExtendedProp('status', newStatus);
                                  $('.popup-container').remove(); // إغلاق النافذة بعد التحديث
                              });
                          }
                      });
                  }
              });
  
              calendar.render();
          } else {
              console.error("Calendar element not found!");
          }
      },
      error: function () {
          $('#content').html('<p class="text-danger">Failed to load calendar.</p>');
      }
  });
  
}

// 🔵 دالة لتحديث الحالة على السيرفر
function updateAppointmentStatus(appointmentId, newStatus, callback) {
    $.ajax({
        url: `http://localhost:3000/dashboard/updateAppointment/${appointmentId}`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: JSON.stringify({ status: newStatus }),
        success: function () {
            alert("Appointment updated successfully!");
            if (callback) callback();
        },
        error: function () {
            alert("Failed to update appointment.");
        }
    });
}

// 🟢 دالة لتحديد العنوان بناءً على الحالة
function getEventTitle(appointment) {
    if (appointment.status === 'locked') {
        return `Locked 🔒`;
    }
    return appointment.status === 'booked' ? `Booked: ${appointment._id}` : 'Available';
}

// 🎨 دالة لاختيار اللون حسب الحالة
function getColor(status) {
    return status === 'booked' ? 'orange' : status === 'locked' ? 'lightgray' : 'green';
}

// 🎨 دالة لاختيار لون الإطار حسب الحالة
function getBorderColor(status) {
    return status === 'booked' ? 'darkorange' : status === 'locked' ? 'gray' : 'darkgreen';
}
});

function viewArticle(articleId) {
  $.ajax({
    url: `http://localhost:3000/dashboard/getArticle/${articleId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: function (article) {
      const imagesHTML = article.images.map(img => `<img src="${img}" class="img-fluid mb-2" style="max-width: 100%; height: auto;">`).join('');
      const videosHTML = article.videos.map(video => `<a href="${video}" target="_blank" class="d-block text-primary">Watch Video</a>`).join('');
      const keywordsHTML = article.keywords.join(', ');
      const tagsHTML = article.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('');
      const sourcesHTML = article.sources.map(source => `<li><a href="${source}" target="_blank">${source}</a></li>`).join('');

      const detailsHTML = `
          <h4 class="mb-3">${article.title}</h4>
          <p><strong>Summary:</strong> ${article.summary}</p>
          <div class="mb-3">${imagesHTML}</div>
          <p><strong>Author:</strong> ${article.author}</p>
          <p><strong>Category:</strong> ${article.category}</p>
          <p><strong>Keywords:</strong> ${keywordsHTML}</p>
          <p><strong>Tags:</strong> ${tagsHTML}</p>
          <p><strong>Content:</strong></p>
          <p>${article.content}</p>
          <p><strong>Videos:</strong></p>
          <p>${videosHTML || 'No videos available'}</p>
          <p><strong>Sources:</strong></p>
          <ul>${sourcesHTML || '<li>No sources available</li>'}</ul>
          <p><strong>Comments Enabled:</strong> ${article.comments_enabled ? 'Yes' : 'No'}</p>
          <p><strong>Status:</strong> <span class="badge ${article.status === 'Published' ? 'bg-success' : 'bg-secondary'}">${article.status}</span></p>
          <p><strong>Created At:</strong> ${new Date(article.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> ${new Date(article.updated_at).toLocaleString()}</p>
        `;

      $('#articleDetails').html(detailsHTML);
      $('#viewArticlePopup').modal('show');
    },
    error: function () {
      alert('Failed to load article details.');
    },
  });
}

function editArticle(articleId) {
  $.ajax({
    url: `http://localhost:3000/dashboard/getArticle/${articleId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: function (article) {
      $('#editArticleId').val(article._id);
      $('#editTitle').val(article.title);
      $('#editContent').val(article.content);
      $('#editSummary').val(article.summary);
      $('#editAuthor').val(article.author);
      $('#editCategory').val(article.category);
      $('#editKeywords').val(article.keywords.join(', '));
      $('#editSources').val(article.sources.join(', '));
      $('#editTags').val(article.tags.join(', '));
      $('#editImages').val(article.images.join(', '));
      $('#editVideos').val(article.videos.join(', '));
      $('#editStatus').val(article.status);
      $('#editCommentsEnabled').prop('checked', article.comments_enabled);

      $('#editArticlePopup').modal('show');
    },
    error: function () {
      alert('Failed to load article for editing.');
    },
  });
}

$('#editArticleForm').on('submit', function (e) {
  e.preventDefault();

  const articleId = $('#editArticleId').val();
  const updatedData = {
    title: $('#editTitle').val(),
    content: $('#editContent').val(),
    summary: $('#editSummary').val(),
    author: $('#editAuthor').val(),
    category: $('#editCategory').val(),
    keywords: $('#editKeywords').val().split(',').map(keyword => keyword.trim()),
    sources: $('#editSources').val().split(',').map(source => source.trim()),
    tags: $('#editTags').val().split(',').map(tag => tag.trim()),
    images: $('#editImages').val().split(',').map(image => image.trim()),
    videos: $('#editVideos').val().split(',').map(video => video.trim()),
    status: $('#editStatus').val(),
    comments_enabled: $('#editCommentsEnabled').prop('checked')
  };

  $.ajax({
    url: `http://localhost:3000/dashboard/updateArticle/${articleId}`,
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify(updatedData),
    success: function () {
      alert('Article updated successfully.');
      $('#editArticlePopup').modal('hide');
      loadArticles();
    },
    error: function () {
      alert('Failed to update article.');
    },
  });
});

function toggleStatus(articleId, isChecked) {
  const newStatus = isChecked ? 'Published' : 'Draft';

  $.ajax({
    url: `http://localhost:3000/dashboard/updateArticleStatus/${articleId}`,
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify({ status: newStatus }),
    success: function () {
      // تحديث تسمية الحالة بجانب الـ Switch مباشرة دون إعادة تحميل الصفحة
      $(`#switch-${articleId}`).next('label').text(newStatus);
    },
    error: function () {
      alert('Failed to update article status.');
    },
  });
}

function deleteArticle(articleId) {
  if (confirm('Are you sure you want to delete this article?')) {
    $.ajax({
      url: `http://localhost:3000/dashboard/deleteArticle/${articleId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      success: function () {
        alert('Article deleted successfully.');
        loadArticles();
      },
      error: function () {
        alert('Failed to delete article.');
      },
    });
  }
}

// إرسال البيانات إلى السيرفر عند إضافة المقال
$('#addArticleForm').on('submit', function (e) {
  e.preventDefault();

  const articleData = {
    title: $('#addtitle').val(),
    content: $('#addcontent').val(),
    summary: $('#addsummary').val(),
    category: $('#addcategory').val(),
    author: $('#addauthor').val(),
    images: $('#addimages').val().split(',').map(img => img.trim()), // تقسيم النص إلى مصفوفة
    videos: $('#addvideos').val().split(',').map(vid => vid.trim()),
    keywords: $('#addkeywords').val().split(',').map(kw => kw.trim()),
    sources: $('#addsources').val().split(',').map(src => src.trim()),
    tags: $('#addtags').val().split(',').map(tag => tag.trim()),
    comments_enabled: $('#addcomments_enabled').val() === 'true',
    status: $('#addstatus').val()
  };

  $.ajax({
    url: 'http://localhost:3000/dashboard/addArticle',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify(articleData),
    success: function (response) {
      alert('تم إضافة المقال بنجاح!');
      $('#addArticlePopup').modal('hide');
      loadArticles(); // إعادة تحميل المقالات لعرض المقال الجديد
    },
    error: function () {
      alert('فشل إضافة المقال.');
    }
  });
});


$('#addServiceLink').click(function() {
  $('#addServiceContent').show();  // إظهار النموذج
});

// إرسال البيانات إلى الخادم عند الحفظ
// $('#addServiceForm').submit(function(e) {
//   e.preventDefault();

//   const serviceData = {
//     title: $('#serviceTitle').val(),
//     slug: "test",//$('#serviceSlug').val(),
//     subCategoryId: $('#serviceSubCategory').val(),
//     content: JSON.parse($('#serviceContent').val()) // تأكد من تحويل المحتوى إلى JSON
//   };

//   $.ajax({
//     url: 'http://localhost:3000/dashboard/addService',  // تأكد من تحديد الـ API الخاص بك
//     method: 'POST',
//     headers: { Authorization: `Bearer ${token}` },
//     contentType: 'application/json',
//     data: JSON.stringify(serviceData),
//     success: function(response) {
//       alert('تم إضافة الخدمة بنجاح');
//       $('#addServiceContent').hide();  // إخفاء النموذج بعد الإضافة
//     },
//     error: function(error) {
//       alert('حدث خطأ أثناء إضافة الخدمة');
//     }
//   });
// });




//اضافة الeditor
$('#addServiceForm').submit(function (e) {
  e.preventDefault();

  var serviceData = {
    title: $('#serviceTitle').val(),
    slug: "test1",
    subCategoryId: $('#serviceSubCategory').val(),
    content: quill.root.innerHTML // جلب المحتوى كـ HTML
  };

  $.ajax({
    url: 'http://localhost:3000/dashboard/addService',
    type: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify(serviceData),
    success: function(response) {
      alert('تمت إضافة الخدمة بنجاح');
      location.reload();
    },
    error: function(xhr) {
      alert('حدث خطأ: ' + xhr.responseText);
    }
  });
});