const internships = JSON.parse(localStorage.getItem('internships')) || [
    { id: 1, title: "UI/UX Dizayner", company: "TechCorp", region: "Toshkent", skills: ["Figma", "UI/UX"], match: 95, type: "Maoshli", format: "Ofis" },
    { id: 2, title: "Frontend (Junior)", company: "SoftSol", region: "Samarqand", skills: ["HTML", "CSS"], match: 88, type: "Maoshli", format: "Online" },
    { id: 3, title: "SMM Menejer", company: "Media", region: "Toshkent", skills: ["SMM", "Copywriting"], match: 74, type: "Maoshsiz", format: "Online" }
];

let savedListings = JSON.parse(localStorage.getItem('savedListings')) || [];
let applicationsList = JSON.parse(localStorage.getItem('applications')) || [];

// Tungi rejim (Dark Mode) logikasi
const themeToggle = document.getElementById("theme-toggle");
if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
});

const listingsGrid = document.getElementById("listings-grid");
const savedCount = document.getElementById("saved-count");
savedCount.textContent = savedListings.length;

function showToastMsg(text) {
    const toast = document.getElementById("toast-msg");
    document.getElementById("toast-text").textContent = text;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3500);
}

function renderListings(data, titleText = "Mavjud E'lonlar") {
    listingsGrid.innerHTML = "";
    document.querySelector(".listings-section h2").textContent = titleText;
    
    if(data.length === 0) {
        listingsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #636e72; padding: 30px;">Hozircha hech qanday e'lon topilmadi.</p>`;
        return;
    }

    data.forEach((item, index) => {
        const isSaved = savedListings.includes(item.id);
        const card = document.createElement("div");
        card.className = "card";
        card.style.animationDelay = `${index * 0.1}s`;
        
        const typeFmt = (item.type || 'Maoshli') + ' • ' + (item.format || 'Ofis');

        card.innerHTML = `
            <h3>${item.title}</h3>
            <p><i class="fa-solid fa-building"></i> ${item.company} | ${typeFmt}</p>
            <p><i class="fa-solid fa-location-dot"></i> ${item.region}</p>
            <p><i class="fa-solid fa-tools"></i> Ko'nikmalar: <strong>${item.skills.join(", ")}</strong></p>
            <div class="match-badge">Mos kelish: ${item.match}%</div>
            <div class="card-actions">
                <button class="btn-primary" onclick="openApplyModal('${item.title}')">Ariza topshirish</button>
                <button class="btn-save ${isSaved ? 'saved' : ''}" onclick="toggleSave(${item.id})">
                    <i class="fa-heart ${isSaved ? 'fa-solid' : 'fa-regular'}"></i> ${isSaved ? 'Saqlangan' : 'Saqlash'}
                </button>
            </div>
        `;
        listingsGrid.appendChild(card);
    });
}

document.getElementById("search-btn").addEventListener("click", () => {
    const jobVal = document.getElementById("job-input").value.toLowerCase();
    const regionVal = document.getElementById("region-input").value.toLowerCase();
    const typeVal = document.getElementById("type-input").value;
    const formatVal = document.getElementById("format-input").value;

    const filtered = internships.filter(item => {
        const matchJob = item.title.toLowerCase().includes(jobVal) || item.skills.some(s => s.toLowerCase().includes(jobVal));
        const matchReg = item.region.toLowerCase().includes(regionVal);
        const matchType = typeVal === "" || item.type === typeVal;
        const matchFormat = formatVal === "" || item.format === formatVal;
        return matchJob && matchReg && matchType && matchFormat;
    });

    filtered.sort((a, b) => b.match - a.match);
    renderListings(filtered, "Qidiruv Natijalari");
});

document.getElementById("saved-nav-link").addEventListener("click", (e) => {
    e.preventDefault();
    const savedData = internships.filter(item => savedListings.includes(item.id));
    renderListings(savedData, "Siz Tanlagan E'lonlar");
});

function resetFilter() { renderListings(internships, "Mavjud E'lonlar"); }

function toggleSave(id) {
    if(savedListings.includes(id)) {
        savedListings = savedListings.filter(i => i !== id);
    } else {
        savedListings.push(id);
    }
    localStorage.setItem('savedListings', JSON.stringify(savedListings));
    savedCount.textContent = savedListings.length;
    renderListings(internships);
}

function openApplyModal(title) {
    document.getElementById("modal-job-display").value = title;
    document.getElementById("apply-modal").classList.add("active");
}

function closeModal() {
    document.getElementById("apply-modal").classList.remove("active");
    document.getElementById("application-form").reset();
}

document.getElementById("application-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("applicant-name").value;
    const phone = document.getElementById("applicant-phone").value;
    const job = document.getElementById("modal-job-display").value;

    applicationsList.unshift({
        name: name,
        phone: phone,
        job: job,
        date: new Date().toLocaleDateString(),
        status: "Kutilmoqda"
    });
    localStorage.setItem('applications', JSON.stringify(applicationsList));

    showToastMsg("Arizangiz muvaffaqiyatli yuborildi!");
    closeModal();
});

renderListings(internships);