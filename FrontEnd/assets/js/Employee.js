let employee_page_size = 10;
let update_employee;
let employee_profile_pic;

function getDataToEmployeeTable(page, size) {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/employee',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {page: page, size: size},
        success: function (data) {
            displayEmployeeData(data, page, size);
        },
        error: function () {
            console.error('Error fetching data');
        }
    });
}

function displayEmployeeData(data, page, size) {
    $('#employee-table tbody').empty();
    $.each(data, function (index, employee) {
        appendEmployeeToTable(index + (page * size), employee);
    });
}

function appendEmployeeToTable(index, employee) {
    let statusColour = getEmployeeStatusColour(employee.status);

    let isUSer = logged_user.role === 'USER';
    let hideClass = isUSer ? 'd-none' : '';

    $('#employee-table tbody').append(`
        <tr>
            <th scope="row" class="align-middle">${index + 1}</th>
            <th>
                <img src="data:image/png;base64,${employee.profilePic}" class="rounded-circle" alt="Profile Pic" style="width: 50px; height: 50px;">
            </th>
            <td class="align-middle">${employee.employeeName}</td>
            <td class="align-middle">${employee.gender}</td>
            <td class="align-middle">${employee.role}</td>
            <td class="align-middle">${employee.email}</td>
            <td class="align-middle">${employee.contactNumber}</td>
            <td class="align-middle">${employee.designation}</td>
            <td class="align-middle">
                <label class="pill ${statusColour} rounded">
                    <span class="p-2 text-white fw-bold">${employee.status}</span>
                </label>
            </td>
            <td class="align-middle">
                <button class="btn btn-outline-custom-black-colour view-employee-btn btn-sm"><i class="fa fa-eye fa-lg" aria-hidden="true"></i></button>
                <button class="admin-only ${hideClass} btn btn-outline-custom-black-colour edit-employee-btn btn-sm"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></button>
                <button class="admin-only ${hideClass} btn btn-outline-custom-red-colour delete-employee-btn btn-sm"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>
            </td>
        </tr>
    `);

    $('.edit-employee-btn').last().click(function () {
        editEmployee(employee);
    });

    $('.delete-employee-btn').last().click(function () {
        deleteEmployee(employee);
    });

    $('.view-employee-btn').last().click(function () {
        viewEmployee(employee);
    });
}

function generateEmployeeModalContent(employee) {
    let statusColor = getEmployeeStatusColour(employee.status);

    let modalContent = `
        <div class="modal fade" id="employeeModal" tabindex="-1" role="dialog" aria-labelledby="employeeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-light">
                        <h5 class="modal-title" id="employeeModalLabel">Employee Details</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row mb-3">
                                <div class="col-md-4 text-center border-end">
                                    <img src="data:image/png;base64,${employee.profilePic}" class="rounded-circle mb-3" alt="Profile Pic" style="width: 200px; height: 200px;">
                                    <h5 class="fw-bold">${employee.employeeName}</h5>
                                    <p><span class="badge bg-${statusColor}">${employee.status}</span></p>
                                </div>
                                <div class="col-md-8">
                                    <h5 class="text-uppercase text-muted mb-3">Personal Information</h5>
                                    <div class="row mb-2">
                                        <div class="col-6">
                                            <span class="fw-bold">Gender:</span>
                                            <p class="text-secondary">${employee.gender}</p>
                                        </div>
                                        <div class="col-6">
                                            <span class="fw-bold">Date of Birth:</span>
                                            <p class="text-secondary">${splitDateTime(employee.dob)}</p>
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-6">
                                            <span class="fw-bold">Contact Number:</span>
                                            <p class="text-secondary">${employee.contactNumber}</p>
                                        </div>
                                        <div class="col-6">
                                            <span class="fw-bold">Email:</span>
                                            <p class="text-secondary">${employee.email}</p>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <span class="fw-bold">Address:</span>
                                        <p class="text-secondary">${employee.addressNo}, ${employee.addressLane}, ${employee.addressCity}, ${employee.addressState}, ${employee.postalCode}</p>
                                    </div>
                                    <hr>
                                    <h5 class="text-uppercase text-muted mb-2 mt-3">Emergency Contact</h5>
                                    <div class="row mb-2">
                                        <div class="col-6">
                                            <span class="fw-bold">Contact Person:</span>
                                            <p class="text-secondary">${employee.emergencyContactPerson}</p>
                                        </div>
                                        <div class="col-6">
                                            <span class="fw-bold">Contact Number:</span>
                                            <p class="text-secondary">${employee.emergencyContactNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-md-12">
                                    <h5 class="text-uppercase text-muted mb-3">Job Details</h5>
                                    <div class="row">
                                        <div class="col-3">
                                            <span class="fw-bold">Role:</span>
                                            <p class="text-secondary">${employee.role}</p>
                                        </div>
                                        <div class="col-3">
                                            <span class="fw-bold">Designation:</span>
                                            <p class="text-secondary">${employee.designation}</p>
                                        </div>
                                        <div class="col-3">
                                            <span class="fw-bold">Joined Date:</span>
                                            <p class="text-secondary">${splitDateTime(employee.joinedDate)}</p>
                                        </div>
                                        <div class="col-3">
                                            <span class="fw-bold">Branch:</span>
                                            <p class="text-secondary">${employee.branch}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return modalContent;
}

function viewEmployee(employee) {
    $('#employeeModal').remove();
    const employeeModalContent = generateEmployeeModalContent(employee);
    $('body').append(employeeModalContent);
    $('#employeeModal').modal('show');
}

function getEmployeeStatusColour(status) {
    switch (status) {
        case "ACTIVE":
            return "bg-custom-green";
        case "INACTIVE":
            return "bg-custom-red";
        default:
            return "";
    }
}

function getEmployeePageCount() {
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/employee/page-size',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {size: employee_page_size},
        success: function (data) {
            console.log('success fetching count of employee pages');
            employeePaginationButtons(data);
        },
        error: function () {
            console.error('Error fetching count of pages');
        }
    });
}

function employeePaginationButtons(totalPages) {
    $('#employeePagination').empty();
    for (let i = 0; i < totalPages; i++) {
        $('#employeePagination').append(`<button class="btn btn-outline-custom-black-colour me-2" onclick="getDataToEmployeeTable(${i}, employee_page_size)">${i + 1}</button>`);
    }
}

function editEmployee(employee) {
    EMPLOYEE_SECTION.css("display", "none");
    EMPLOYEE_UPDATE_FORM.css("display", "block");

    update_employee = employee;
    $("#updateEmployeeName").val(employee.employeeName);
    $("#updateEmployeeGender").val(employee.gender);
    $("#updateEmployeeStatus").val(employee.status);

    const preview = $("#updateEmployeeProfilePicPreview");
    preview.attr("src", "data:image/jpeg;base64," + employee.profilePic);
    preview.show();
    $("#updateIconPreview").hide();

    const joinedDate = new Date(employee.joinedDate);
    const formattedJoinedDate = joinedDate.toISOString().split('T')[0];
    $("#updateEmployeeJoinedDate").val(formattedJoinedDate);
    $("#updateEmployeeDesignation").val(employee.designation);
    $("#updateEmployeeRole").val(employee.role);
    const dobDate = new Date(employee.dob);
    const formattedDob = dobDate.toISOString().split('T')[0];
    $("#updateEmployeeDob").val(formattedDob);
    $("#updateEmployeeBranch").val(employee.branch);
    $("#updateEmployeeAddressNo").val(employee.addressNo);
    $("#updateEmployeeAddressLane").val(employee.addressLane);
    $("#updateEmployeeAddressCity").val(employee.addressCity);
    $("#updateEmployeeAddressState").val(employee.addressState);
    $("#updateEmployeePostalCode").val(employee.postalCode);
    $("#updateEmployeeContactNumber").val(employee.contactNumber);
    $("#updateEmployeeEmail").val(employee.email);
    $("#updateEmployeeEmergencyContactPerson").val(employee.emergencyContactPerson);
    $("#updateEmployeeEmergencyContactNumber").val(employee.emergencyContactNumber);
}

function deleteEmployee(employee) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'http://localhost:8080/spring-boot/api/v1/employee/' + employee.employeeCode,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (response) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Employee has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getDataToEmployeeTable(0, employee_page_size);
                        getEmployeePageCount();
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting employee:', error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete employee.",
                        icon: "error"
                    });
                }
            });
        }
    });
}

function getEmployeeSearchResult() {
    event.preventDefault();
    const searchText = $('#employee-search-text').val().trim();
    if (searchText === '') {
        getDataToEmployeeTable(0, employee_page_size);
        getEmployeePageCount();
    } else {
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            url: 'http://localhost:8080/spring-boot/api/v1/employee/search',
            data: {query: searchText},
            success: function (data) {
                displayEmployeeData(data, 0, data.length);
                $('#employeePagination').empty();
            },
            error: function (xhr, status, error) {
                console.log("error fetching data")
            }
        });
    }
}

function setPreviewProfilePicture() {
    const input = $('#employeeProfilePic')[0];
    const preview = $('#employeeProfilePicPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.attr('src', e.target.result);
            preview.show();
            $('#iconPreview').hide();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function decodeEmployeeImage(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result.split(',')[1]);
        }
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
    });
}

function saveEmployee() {
    event.preventDefault();
    const employee = {
        "employeeCode": "EMP001",
        "employeeName": $("#employeeName").val(),
        "profilePic": employee_profile_pic,
        "gender": $("#employeeGender").val(),
        "status": $("#employeeStatus").val(),
        "designation": $("#employeeDesignation").val(),
        "role": $("#employeeRole").val(),
        "dob": $("#employeeDob").val(),
        "joinedDate": $("#employeeJoinedDate").val(),
        "branch": $("#employeeBranch").val(),
        "addressNo": $("#employeeAddressNo").val(),
        "addressLane": $("#employeeAddressLane").val(),
        "addressCity": $("#employeeAddressCity").val(),
        "addressState": $("#employeeAddressState").val(),
        "postalCode": $("#employeePostalCode").val(),
        "contactNumber": $("#employeeContactNumber").val(),
        "email": $("#employeeEmail").val(),
        "password": $("#employeeEmail").val(),
        "emergencyContactPerson": $("#employeeEmergencyContactPerson").val(),
        "emergencyContactNumber": $("#employeeEmergencyContactNumber").val(),
    }
    $.ajax({
        url: 'http://localhost:8080/spring-boot/api/v1/auth',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
        data: JSON.stringify(employee),
        success: function (data) {
            console.log('employee added successfully:', data);
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1000
            });
            EMPLOYEE_ADD_FORM.css("display", "none");
            EMPLOYEE_SECTION.css("display", "block");
            getDataToEmployeeTable(0,employee_page_size);
        },
        error: function (xhr, status, error) {
            console.error('Error adding supplier:', error);
            Swal.fire({
                icon: "error",
                title: status,
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

$("#employeePageSize").change(function () {
    employee_page_size = $(this).val();
    getDataToEmployeeTable(0, employee_page_size);
    getSupplierPageCount();
});

$('#add-new-employee').on('click', () => {
    clearPage();
    EMPLOYEE_SECTION.css("display", "none");
    EMPLOYEE_ADD_FORM.css("display", "block");
});//In Supplier Section

$('#backNewEmployee').on('click', () => {
    EMPLOYEE_ADD_FORM.css("display", "none");
    EMPLOYEE_SECTION.css("display", "block");
});

$('#addNewEmployee').on('click', () => {
    if ($('#employeeAddForm')[0].checkValidity()) {
        saveEmployee();
    } else {
        $('#employeeAddForm').addClass('was-validated');
        event.preventDefault();
    }
});

$('#updateEmployee').on('click', () => {
    event.preventDefault();
    const employee = {
        "employeeCode": update_employee.employeeCode,
        "employeeName": $("#updateEmployeeName").val(),
        "profilePic": update_employee.profilePic,
        "gender": $("#updateEmployeeGender").val(),
        "status": $("#updateEmployeeStatus").val(),
        "designation": $("#updateEmployeeDesignation").val(),
        "role": $("#updateEmployeeRole").val(),
        "dob": $("#updateEmployeeDob").val(),
        "joinedDate": $("#updateEmployeeJoinedDate").val(),
        "branch": $("#updateEmployeeBranch").val(),
        "addressNo": $("#updateEmployeeAddressNo").val(),
        "addressLane": $("#updateEmployeeAddressLane").val(),
        "addressCity": $("#updateEmployeeAddressCity").val(),
        "addressState": $("#updateEmployeeAddressState").val(),
        "postalCode": $("#updateEmployeePostalCode").val(),
        "contactNumber": $("#updateEmployeeContactNumber").val(),
        "email": $("#updateEmployeeEmail").val(),
        "password": update_employee.password,
        "emergencyContactPerson": $("#updateEmployeeEmergencyContactPerson").val(),
        "emergencyContactNumber": $("#updateEmployeeEmergencyContactNumber").val()
    };

    console.log(employee);

    $.ajax({
        url: "http://localhost:8080/spring-boot/api/v1/employee/" + update_employee.employeeCode,
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: "application/json",
        data: JSON.stringify(employee),
        success: function (response) {
            console.log("Employee updated successfully");
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1000
            });
            EMPLOYEE_UPDATE_FORM.css("display", "none");
            EMPLOYEE_SECTION.css("display", "block");
            getDataToEmployeeTable(0, employee_page_size);
        },
        error: function (xhr, status, error) {
            console.error("Error updating employee:", error);
            Swal.fire({
                icon: "error",
                title: "Something wrong",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
});

$('#backToUpdateEmployee').on('click', () => {
    EMPLOYEE_UPDATE_FORM.css("display", "none");
    EMPLOYEE_SECTION.css("display", "block");
});

$('#employee-search-text').on('input', () => {
    getEmployeeSearchResult();
});

$('#employee-search').on('click', () => {
    getEmployeeSearchResult();
});

$('#employeeProfilePic').change(async function (event) {
    const file = event.target.files[0];
    if (file) {
        try {
            employee_profile_pic = await decodeEmployeeImage(file);
        } catch (error) {
            console.log("Error ", error);
        }
    }
    setPreviewProfilePicture();
});