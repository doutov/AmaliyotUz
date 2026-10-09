let adminJobs = JSON.parse(localStorage.getItem('internships')) || [
    { id: 1, title: "UI/UX Dizayner", company: "TechCorp", region: "Toshkent", skills: ["Figma", "UI/UX"], match: 95, type: "Maoshli", format: "Ofis" },
    { id: 2, title: "Frontend (Junior)", company: "SoftSol", region: "Samarqand", skills: ["HTML", "CSS"], match: 88, type: "Maoshli", format: "Online" }
];

let applicationsList = JSON.parse(localStorage.getItem('applications')) || [];

// Login tekshiruvi (doutov / doutov2009)
const loginScreen = document.getElementById("login-screen");
const adminPanel = document.getElementById("admin-panel");
const loginForm = document.getElementById("login-form");

if (localStorage.getItem('isAdminLoggedIn') === 'true') {
    loginScreen.style.display = 'none';
    adminPanel.style.display = 'flex';
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;

    if (user === "doutov" && pass === "doutov2009") {
        localStorage.setItem('isAdminLoggedIn', 'true');
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'flex';
        showToastMsg("Xush kelibsiz, Admin!");
        renderAdminData();
    } else {
        alert("Login yoki parol xato! (To'g'risi: doutov / doutov2009)");
    }
});

function adminLogout() {
    localStorage.removeItem('isAdminLoggedIn');
    location.reload();
}

function showToastMsg(text) {
    const toast = document.getElementById("toast-msg");
    document.getElementById("toast-text").textContent = text;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3500);
}

function switchTab(tabId) {
    document.querySelectorAll(".sidebar-menu li").forEach(el => el.classList.remove("active"));
    event.currentTarget.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.getElementById(`tab-${tabId}`).classList.add("active");

    const titles = {
        'dashboard': "Statistika va Umumiy Ko'rinish",
        'listings': "E'lonlar Boshqaruvi",
        'add-listing': "Yangi E'lon Qo'shish",
        'applications': "Kelib tushgan arizalar"
    };
    document.getElementById("page-title").textContent = titles[tabId];
}

function renderAdminData() {
    const tableBody = document.getElementById("admin-listings-table");
    tableBody.innerHTML = "";
    adminJobs.forEach(job => {
        tableBody.innerHTML += `
            <tr>
                <td><strong>${job.title}</strong></td>
                <td>${job.company}</td>
                <td>${job.region}</td>
                <td><button class="btn-sm danger" onclick="deleteJob(${job.id})">O'chirish</button></td>
            </tr>
        `;
    });
    document.getElementById("stat-total-jobs").textContent = adminJobs.length;

    const appTable = document.getElementById("admin-apps-table");
    appTable.innerHTML = "";
    applicationsList.forEach((app, idx) => {
        appTable.innerHTML += `
            <tr>
                <td>${app.name}</td>
                <td>${app.phone}</td>
                <td>${app.job}</td>
                <td>${app.date}</td>
                <td><span class="badge ${app.status === 'Qabul qilindi' ? 'success' : 'warning'}">${app.status}</span></td>
                <td>
                    <button class="btn-sm success" onclick="changeStatus(${idx}, 'Qabul qilindi')">✓</button>
                    <button class="btn-sm danger" onclick="changeStatus(${idx}, 'Rad etildi')">✕</button>
                </td>
            </tr>
        `;
    });
    document.getElementById("stat-total-apps").textContent = applicationsList.length;
}

document.getElementById("add-job-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newJob = {
        id: Date.now(),
        title: document.getElementById("new-title").value,
        company: document.getElementById("new-company").value,
        region: document.getElementById("new-region").value,
        type: document.getElementById("new-type").value,
        format: document.getElementById("new-format").value,
        skills: document.getElementById("new-skills").value.split(",").map(s => s.trim()),
        match: parseInt(document.getElementById("new-match").value)
    };
    adminJobs.push(newJob);
    localStorage.setItem('internships', JSON.stringify(adminJobs));
    renderAdminData();
    showToastMsg("Yangi e'lon qo'shildi!");
    document.getElementById("add-job-form").reset();
});

function deleteJob(id) {
    if(confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
        adminJobs = adminJobs.filter(j => j.id !== id);
        localStorage.setItem('internships', JSON.stringify(adminJobs));
        renderAdminData();
        showToastMsg("E'lon o'chirildi!");
    }
}

function changeStatus(idx, status) {
    applicationsList[idx].status = status;
    localStorage.setItem('applications', JSON.stringify(applicationsList));
    renderAdminData();
    showToastMsg(`Ariza holati: ${status}`);
}

// EXCEL (CSV) YUKLAB OLISH
function exportToCSV() {
    if(applicationsList.length === 0) {
        alert("Yuklab olish uchun arizalar yo'q!");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,F.I.O,Telefon,Lavozim,Sana,Holati\n";
    
    applicationsList.forEach(app => {
        let row = `"${app.name}","${app.phone}","${app.job}","${app.date}","${app.status}"`;
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Arizalar_Hisoboti.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToastMsg("Excel fayl yuklab olindi!");
}

renderAdminData();