
// const API_BASE_URL = 'https://user-api-server.onrender.com';
const API_BASE_URL = 'http://localhost:3000';

//#region TOKEN
// Check the token
const token = localStorage.getItem('token');
if (!token) {
  alert('Unauthorized! Please login first.');
  window.location.href = 'index.html';
}
$('#addArticleBtn').click(function () {
  $('#addArticlePopup').modal('show');
});
//#endregion


// Initialize Quill Editor
var quill = new Quill('#editor-container', {
  theme: 'snow', // Editor theme
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['image', 'link', 'blockquote', 'code-block'],
      [{ align: [] }],
      ['clean'] // Remove formatting
    ]
  }
});


//#region DOCUMENT READY
//Document ready
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

  // Fetch user information from localStorage (or the API)
  let adminFullName = localStorage.getItem('name');
  let adminEmail = localStorage.getItem('email');
  let adminRole = localStorage.getItem('role');

  // Fetch user information from localStorage (or the API)
  // let user = JSON.parse(localStorage.getItem('user'));
  // Check if data exists and replace spaces with "_"
  if (adminFullName) {
    adminFullName = adminFullName.replace(/ /g, " ");
  } else {
    adminFullName = "Admin";
  }

  if (!adminEmail) {
    adminEmail = "??";
  }

  if (!adminRole) {
    adminRole = "??";
  }

  // Display data in the Navbar
  $('#userInfo').text(`${adminFullName} (${adminEmail}) - ${adminRole}`);

  // Logout
  $('#logoutLink').on('click', function () {
    localStorage.removeItem('token'); // Remove token
    window.location.href = 'index.html'; // Redirect to login page
  });

  // Handle Sidebar links
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

  $('#sectionsLink').on('click', function () {
    loadSections();
  });


  // تحميل المستخدمين
  function loadUsers() {
    $('#content').html('<h3>Loading Users...</h3>');
    $.ajax({
      url: `${API_BASE_URL}/dashboard/getAllUsers`,
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

  // Load patients
  function loadPatients() {
    $('#content').html('<h3>Loading Patients...</h3>');
    $.ajax({
      url: `${API_BASE_URL}/dashboard/getAllPatients`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }, // Send token for verification
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

  // Load articles
  function loadArticles() {
    $('#content').html('<h3>Loading Articles...</h3>');
    $.ajax({
      url: `${API_BASE_URL}/dashboard/getAllArticles`,
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
      url: `${API_BASE_URL}/dashboard/getAllAppointments`,
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

              $('body').append(`<div class="popup-container">${popupContent}</div>`);

              $('#closePopup').click(function () {
                $('.popup-container').remove();
              });

              $('#updateStatusBtn').click(function () {
                let newStatus = $('#newStatus').val();
                if (newStatus && ["available", "booked", "locked"].includes(newStatus)) {
                  updateAppointmentStatus(currentId, newStatus, () => {
                    info.event.setProp('backgroundColor', getColor(newStatus));
                    info.event.setProp('borderColor', getBorderColor(newStatus));
                    info.event.setProp('title', getEventTitle({ _id: currentId, status: newStatus }));
                    info.event.setExtendedProp('status', newStatus);
                    $('.popup-container').remove();
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

  // Function to update status on the server
  function updateAppointmentStatus(appointmentId, newStatus, callback) {
    $.ajax({
      url: `${API_BASE_URL}/dashboard/updateAppointment/${appointmentId}`,
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

  // Function to determine the title based on the status
  function getEventTitle(appointment) {
    if (appointment.status === 'locked') {
      return `Locked 🔒`;
    }
    return appointment.status === 'booked' ? `Booked: ${appointment._id}` : 'Available';
  }

  // Function to choose the color based on the status
  function getColor(status) {
    return status === 'booked' ? 'orange' : status === 'locked' ? 'lightgray' : 'green';
  }

  // Function to choose the border color based on the status
  function getBorderColor(status) {
    return status === 'booked' ? 'darkorange' : status === 'locked' ? 'gray' : 'darkgreen';
  }
  console.log("test");

 
  // When a section is selected, load the associated categories
  $('#sectionSelect').change(function () {
    let sectionId = $(this).val();
    $('#categorySelect').empty().append('<option value="">اختر فئة...</option>');

    if (sectionId) {
      $.ajax({
        url: `${API_BASE_URL}/dashboard/section/${sectionId}/categories`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        success: function (data) {
          data.forEach(category => {
            $('#categorySelect').append(`<option value="${category.categoryId}">${category.title.es}</option>`);
          });
        },
        error: function (err) {
          console.error('Error fetching categories:', err);
        }
      });
    }
  });

});
//#endregion

//#region ARTICLE METHODS
//View selected articl in popup
function viewArticle(articleId) {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/getArticle/${articleId}`,
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

//Edit the article
function editArticle(articleId) {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/getArticle/${articleId}`,
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
    url: `${API_BASE_URL}/dashboard/updateArticle/${articleId}`,
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

//Update the article status
function toggleStatus(articleId, isChecked) {
  const newStatus = isChecked ? 'Published' : 'Draft';

  $.ajax({
    url: `${API_BASE_URL}/dashboard/updateArticleStatus/${articleId}`,
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify({ status: newStatus }),
    success: function () {
      // Update the status label next to the switch directly without reloading the page
      $(`#switch-${articleId}`).next('label').text(newStatus);
    },
    error: function () {
      alert('Failed to update article status.');
    },
  });
}

//Delete the article
function deleteArticle(articleId) {
  if (confirm('Are you sure you want to delete this article?')) {
    $.ajax({
      url: `${API_BASE_URL}/dashboard/deleteArticle/${articleId}`,
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
//#endregion


//#region SECTION METHODS
// Send data to the server when adding an article
$('#addArticleForm').on('submit', function (e) {
  e.preventDefault();

  const articleData = {
    title: $('#addtitle').val(),
    content: $('#addcontent').val(),
    summary: $('#addsummary').val(),
    category: $('#addcategory').val(),
    author: $('#addauthor').val(),
    images: $('#addimages').val().split(',').map(img => img.trim()), // Split the text into an array
    videos: $('#addvideos').val().split(',').map(vid => vid.trim()),
    keywords: $('#addkeywords').val().split(',').map(kw => kw.trim()),
    sources: $('#addsources').val().split(',').map(src => src.trim()),
    tags: $('#addtags').val().split(',').map(tag => tag.trim()),
    comments_enabled: $('#addcomments_enabled').val() === 'true',
    status: $('#addstatus').val()
  };

  $.ajax({
    url: `${API_BASE_URL}/dashboard/addArticle`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify(articleData),
    success: function (response) {
      alert('تم إضافة المقال بنجاح!');
      $('#addArticlePopup').modal('hide');
      loadArticles(); // Reload articles to display the new article
    },
    error: function () {
      alert('Failed to add the article.');
    }
  });
});

document.getElementById('addSectionForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const formData = {
    title: {
        // ar: document.getElementById('sectionTitleAr').value,
        // en: document.getElementById('sectionTitleEn').value,
        es: document.getElementById('sectionTitleEs').value
    },
    description: {
        // ar: document.getElementById('sectionDescriptionAr').value,
        // en: document.getElementById('sectionDescriptionEn').value,
        es: document.getElementById('sectionDescriptionEs').value
    },
    imageUrl: document.getElementById('sectionImage').value,
    categories: [
        {
            title: {
                // ar: document.getElementById('categoryTitleAr').value,
                // en: document.getElementById('categoryTitleEn').value,
                es: document.getElementById('categoryTitleEs').value
            },
            description: {
                // ar: document.getElementById('categoryDescriptionAr').value,
                // en: document.getElementById('categoryDescriptionEn').value,
                es: document.getElementById('categoryDescriptionEs').value
            },
            imageUrl: document.getElementById('categoryImage').value,
            subcategories: [
                {
                    title: {
                        // ar: document.getElementById('subCategoryTitleAr').value,
                        // en: document.getElementById('subCategoryTitleEn').value,
                        es: document.getElementById('subCategoryTitleEs').value
                    },
                    description: {
                        // ar: document.getElementById('subCategoryDescriptionAr').value,
                        // en: document.getElementById('subCategoryDescriptionEn').value,
                        es: document.getElementById('subCategoryDescriptionEs').value
                    },
                    imageUrl: document.getElementById('subCategoryImage').value,
                    content: {
                        // ar: document.getElementById('subCategoryContentAr').value,
                        // en: document.getElementById('subCategoryContentEn').value,
                        es: document.getElementById('subCategoryContentEs').value
                    }
                }
            ]
        }
    ]
};


  // Here you can send form data to your server or handle it accordingly
  console.log(formData);
  // Example: Sending data using Fetch API
  fetch(`${API_BASE_URL}/dashboard/addSection`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Send token for authorization
      },
      body: JSON.stringify(formData)
  }).then(response => response.json())
    .then(section => {
      if (section) {
      $('#addSectionModal').modal('hide');
      alert('Section added successfully!');
      loadSections();
      } else {
        alert('Failed to add the section');
    }

    })
    .catch(error => console.error('Error:', error));
});


// Fetch categories when clicking on "Read More" for the section
function viewCategories(sectionId) {
  console.log("viewCategories sectionId", sectionId);
  $('#content').html('<h3>Loading Categories...</h3>');
  $.ajax({
    url: `${API_BASE_URL}/dashboard/section/${sectionId}/categories`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: function (response) {
      let categoriesHTML = `<h3>Categories</h3><div class="row">`;

      response.forEach(category => {
        console.log(category);
        const isChecked = category.status === 'Published' ? 'checked' : '';
        const safeCategoryData = JSON.stringify(category).replace(/"/g, '&quot;'); // ✅ Fix issue with passing the object inside `onclick`

        categoriesHTML += `
          <div class="col-lg-3 mb-4">
            <div class="card">
              <img src="${category.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${category.title.es}">
              <div class="card-body">
                <h5 class="card-title">${category.title.es}</h5>
                <p class="card-text">${category.description.es}</p>
                
                <button class="btn btn-primary btn-sm" onclick="viewSubcategories('${sectionId}', '${category.categoryId}')">Read More</button>
                
                <button class="btn btn-warning btn-sm" onclick="openEditPopup('category', '${sectionId}', ${safeCategoryData})">Edit</button>

                <button class="btn btn-danger btn-sm" onclick="deleteCategory('${sectionId}', '${category.categoryId}')">Delete</button>

                <div class="form-check form-switch mt-2">
                  <input class="form-check-input" type="checkbox" role="switch" id="switch-${category.categoryId}"
                    ${isChecked} onclick="sectionToggleStatus('category', '${category.categoryId}', this.checked)">
                  <label class="form-check-label" for="switch-${category.categoryId}">
                    ${category.status}
                  </label>
                </div>
              </div>
            </div>
          </div>`;
      });

      categoriesHTML += '</div>';
      $('#content').html(categoriesHTML);
    },
    error: function () {
      $('#content').html('<p class="text-danger">Failed to load categories.</p>');
    },
  });
}

// Convert text to Base64 with UTF-8 support
function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Decode Base64 to text with UTF-8 support
function decodeBase64(str) {
  return decodeURIComponent(escape(atob(str)));
}

// Fetch subcategories when clicking on "Read More" for the category
function viewSubcategories(sectionId, categoryId) {
  console.log("sectionId", sectionId);
  console.log("categoryId", categoryId);

  $('#content').html('<h3>Loading Subcategories...</h3>');

  $.ajax({
    url: `${API_BASE_URL}/dashboard/section/${sectionId}/category/${categoryId}/subcategories`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: function (response) {
      let subcategoriesHTML = `<h3>Subcategories</h3><div class="row">`;

      response.forEach(subcategory => {
        console.log("subcategory", subcategory);
        const isChecked = subcategory.status === 'Published' ? 'checked' : '';

        // ✅ Convert subcategory data to Base64 using UTF-8
        const encodedData = encodeBase64(JSON.stringify(subcategory));

        subcategoriesHTML += `
                <div class="col-lg-3 mb-4">
                  <div class="card">
                    <img src="${subcategory.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${subcategory.title.es}">
                    <div class="card-body">
                      <h5 class="card-title">${subcategory.title.es}</h5>
                      <p class="card-text">${subcategory.description.es}</p>

                      <button class="btn btn-primary btn-sm" onclick="showContent('${encodedData}')">Read More</button>

                      <button class="btn btn-warning btn-sm" onclick="openEditPopup('subcategory', '${categoryId}', '${encodedData}')">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteSubcategory('${sectionId}', '${categoryId}', '${subcategory.subcategoryId}')">Delete</button>

                      <div class="form-check form-switch mt-2">
                        <input class="form-check-input" type="checkbox" role="switch" id="switch-${subcategory.subcategoryId}"
                          ${isChecked} onclick="sectionToggleStatus('subcategory', '${subcategory.subcategoryId}', this.checked)">
                        <label class="form-check-label" for="switch-${subcategory.subcategoryId}">
                          ${subcategory.status}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>`;
      });

      subcategoriesHTML += '</div>';
      $('#content').html(subcategoriesHTML);
    },
    error: function () {
      $('#content').html('<p class="text-danger">Failed to load subcategories.</p>');
    },
  });
}

// Display content when clicking on "Read More"
function showContent(encodedData) {
  let subcategory = JSON.parse(decodeBase64(encodedData)); // ✅ Decode Base64 with UTF-8 support

  let contentHTML = `
    <h3>${subcategory.title.es}</h3>
    <label for="languageSelect"><strong>Select Language:</strong></label>
    <select id="languageSelect" class="form-select" onchange="updateContent('${encodedData}')">
      <option value="ar" selected>العربية</option>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
    <div id="contentDisplay" class="mt-3">
      <p>${subcategory.content.es}</p>
    </div>`;

  $('#content').html(contentHTML);
}

// Update the content when changing the language
function updateContent(encodedData) {
  let subcategory = JSON.parse(decodeBase64(encodedData)); // ✅ Decode Base64 with UTF-8 support
  let selectedLang = $('#languageSelect').val();
  $('#contentDisplay').html(`<p>${subcategory.content[selectedLang]}</p>`);
}

// Update the publication status
function sectionToggleStatus(type, id, isChecked) {
  const newStatus = isChecked ? 'Published' : 'Unpublished';
  $.ajax({
    url: `${API_BASE_URL}/dashboard/${type}/${id}/status`,
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: JSON.stringify({ status: newStatus }),
    success: function () {
      $(`#switch-${id}`).next().text(newStatus);
    },
    error: function () {
      alert('Failed to update status.');
    },
  });
}

// Delete item
function deleteSection(sectionId) {
  if (confirm('Are you sure you want to delete this section?')) {
    $.ajax({
      url: `${API_BASE_URL}/dashboard/section/${sectionId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      success: function () {
        loadSections();
      },
      error: function () {
        alert('Failed to delete section.');
      },
    });
  }
}

function openEditPopup(type, parentId, item) {

  $('#lblEditContentAr').hide();
  $('#editContentAr').hide();

  $('#lblEditContentEn').hide();
  $('#editContentEn').hide();
  console.log("section popup", type, parentId, item);
  $('#editId').val(item._id || item.sectionId || item.categoryId || item.subcategoryId);
  $('#editType').val(type);

  $('#editTitleAr').val(item.title.es);
  $('#editTitleEn').val(item.title.en);
  $('#editDescriptionAr').val(item.description.es);
  $('#editDescriptionEn').val(item.description.en);
  $('#editImageUrl').val(item.imageUrl);

  if (type == "subcategory") {
    console.log("wwwwww", item);
    $('#editContentAr').show();
    $('#editContentEn').show();
    $('#editContentAr').val(item.content.es);
    $('#editContentEn').val(item.content.en);
  }

  $('#editPopup').modal('show');

  // Store parentId to use it in the update if the edit is on a category or subcategory
  $('#editPopup').data('parentId', parentId || null);
}

function saveChanges() {
  const type = $('#editType').val();
  const id = $('#editId').val();
  const parentId = $('#editPopup').data('parentId');

  const updatedData = {
    title: { ar: $('#editTitleAr').val(), en: $('#editTitleEn').val() },
    description: { ar: $('#editDescriptionAr').val(), en: $('#editDescriptionEn').val() },
    imageUrl: $('#editImageUrl').val()
  };
  if (type == "subcategory") {
    updatedData.content = { ar: $('#editContentAr').val(), en: $('#editContentEn').val() }

  }

  console.log("updatedData", updatedData);
  let url = `${API_BASE_URL}/dashboard/${type}/${parentId}`;
  console.log("url sevice", url);

  console.log("type", type);
  console.log("id", id);
  // let url = `${API_BASE_URL}/dashboard/section/${parentId}/category/${id}`;

  if (type === 'category') {
    console.log("url category", url);
    url = `${API_BASE_URL}/dashboard/section/${parentId}/category/${id}`;
  } else if (type === 'subcategory') {
    console.log("url subcategory", url);

    url = `${API_BASE_URL}/dashboard/section/${parentId.split('-')[0]}/category/${parentId.split('-')[1]}/subcategory/${id}`;
  }

  $.ajax({
    url: url,
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: JSON.stringify(updatedData),
    success: function () {
      $('#editPopup').modal('hide');
      alert('Updated successfully!');

      // Reload the data based on what was edited
      if (type === 'section') {
        loadSections();
      } else if (type === 'category') {
        viewCategories(parentId);
      } else if (type === 'subcategory') {
        viewSubcategories(parentId.split('-')[0], parentId.split('-')[1]);
      }
    },
    error: function () {
      alert('Failed to update.');
    }
  });
}

function loadSections() {
  $('#content').html('<h3>Loading Sections...</h3>');
  $.ajax({
    url: `${API_BASE_URL}/dashboard/sections`,

    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: function (response) {
      let sectionsHTML = '<h3>Sections</h3><div class="row">';
      console.log(response);
      response.forEach(section => {
        const isChecked = section.status === 'Published' ? 'checked' : '';
        const safeSectionData = JSON.stringify(section).replace(/"/g, '&quot;'); // ✅ Fix issue with passing the object inside `onclick`

        sectionsHTML += `
        <div class="col-lg-3 mb-4">
          <div class="card">
            <img src="${section.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${section.title.es}">
            <div class="card-body">
              <h5 class="card-title">${section.title.es}</h5>
              <p class="card-text">${section.description.es}</p>
              
              <button class="btn btn-primary btn-sm" onclick="viewCategories('${section.sectionId}')">Read More</button>
              

              <button class="btn btn-warning btn-sm" onclick="openEditPopup('section', '${section.sectionId}', ${safeSectionData})">Edit</button>

              <button class="btn btn-danger btn-sm" onclick="deleteSection('${section.sectionId}')">Delete</button>

              <!-- Switch Toggle for Publish/Unpublish -->
              <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" role="switch" id="switch-${section.sectionId}"
                  ${isChecked} onclick="toggleStatus('section', '${section.sectionId}', this.checked)">
                <label class="form-check-label" for="switch-${section.sectionId}">
                  ${section.status}
                </label>
              </div>
            </div>
          </div>
        </div>`;
      });

      sectionsHTML += '</div>';
      $('#content').html(sectionsHTML);
    },
    error: function () {
      $('#content').html('<p class="text-danger">Failed to load sections.</p>');
    },
  });
}

//#endregion