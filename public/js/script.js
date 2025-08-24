document.addEventListener('DOMContentLoaded', () => {
    const proposalForm = document.getElementById('proposal-form');

    if (proposalForm) {
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('proposal-title').value;
            const details = document.getElementById('proposal-details').value;
            if (!title || !details) {
                alert('Please fill out all fields.');
                return;
            }
            const newProposal = addProposal({ title, details });
            alert('Proposal submitted successfully! ID: ' + newProposal.id);
            proposalForm.reset();
        });
    }

    // Page-specific logic
    if (window.location.pathname.endsWith('dashboard.html')) {
        renderDashboardData();
        renderAnnouncements();
    } else if (window.location.pathname.endsWith('tender.html')) {
        renderTenderData();
        // Set the ongoing tab to be visibly active on page load
        document.querySelector('.tab-link[onclick*="ongoing"]').classList.add('active');
        document.getElementById('ongoing').style.display = 'block';
    } else if (window.location.pathname.endsWith('admin.html')) {
        const viewProposalsBtn = document.getElementById('view-proposals-btn');
        const createAnnouncementBtn = document.getElementById('create-announcement-btn');
        const announcementForm = document.getElementById('announcement-form');

        viewProposalsBtn.addEventListener('click', () => {
            document.getElementById('proposal-management-section').style.display = 'block';
            document.getElementById('announcement-creation-section').style.display = 'none';
            renderAdminProposals();
        });

        createAnnouncementBtn.addEventListener('click', () => {
            document.getElementById('announcement-creation-section').style.display = 'block';
            document.getElementById('proposal-management-section').style.display = 'none';
        });

        announcementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const announcementText = document.getElementById('announcement-text').value;
            addAnnouncement(announcementText);
            alert('Announcement posted successfully!');
            announcementForm.reset();
            document.getElementById('announcement-creation-section').style.display = 'none';
        });
    }
});

// --- Render Functions ---
function renderDashboardData() {
    const metrics = getDashboardMetrics();
    document.getElementById('proposals-submitted').textContent = metrics.proposalsSubmitted;
    document.getElementById('active-tenders').textContent = metrics.activeTenders;
    document.getElementById('community-members').textContent = metrics.communityMembers;

}

function renderAnnouncements() {
    const announcementsList = document.getElementById('announcements-list');
    if (!announcementsList) return;

    const announcements = getAnnouncements().sort((a, b) => new Date(b.date) - new Date(a.date)); // Show newest first
    announcementsList.innerHTML = '';

    if (announcements.length === 0) {
        announcementsList.innerHTML = '<li><p>No announcements at this time.</p></li>';
        return;
    }

    announcements.forEach(announcement => {
        const listItem = document.createElement('li');
        listItem.className = 'tender-item';
        listItem.innerHTML = `
            <p>${announcement.text}</p>
            <small>Posted on: ${new Date(announcement.date).toLocaleDateString()}</small>
        `;
        announcementsList.appendChild(listItem);
    });
}

function renderTenderData() {
    renderTenders('ongoing');
    renderTenders('completed');
}

function renderTenders(status) {
    const tenders = getTenders(status);
    const tenderList = document.getElementById(`${status}-tenders-list`);
    tenderList.innerHTML = '';

    if (tenders.length === 0) {
        tenderList.innerHTML = '<p>No tenders to display.</p>';
        return;
    }

    tenders.forEach(tender => {
        const listItem = document.createElement('li');
        listItem.className = 'tender-item';
        listItem.innerHTML = `
            <h3>${tender.title}</h3>
            <p><strong>Description:</strong> ${tender.description}</p>
            <p><strong>Budget:</strong> ₹${tender.budget.toLocaleString()}</p>
            <p><strong>${status === 'completed' ? 'Completed On' : 'Deadline'}:</strong> ${new Date(tender.deadline).toLocaleDateString()}</p>
        `;
        tenderList.appendChild(listItem);
    });
}

// --- Tab Logic for tender.html ---
window.openTab = (evt, tabName) => {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
};

// --- Admin Panel Functions ---
function renderAdminProposals() {
    const proposalsList = document.getElementById('proposals-list');
    const pendingProposals = getProposalsByStatus('pending');
    proposalsList.innerHTML = '';

    if (pendingProposals.length === 0) {
        proposalsList.innerHTML = '<p>No pending proposals to review.</p>';
        return;
    }

    pendingProposals.forEach(proposal => {
        const listItem = document.createElement('li');
        listItem.className = 'tender-item';
        listItem.innerHTML = `
            <h3>${proposal.title}</h3>
            <p>${proposal.details}</p>
            <div class="admin-actions">
                <button class="btn btn-approve" data-id="${proposal.id}">Approve</button>
                <button class="btn btn-reject" data-id="${proposal.id}">Reject</button>
            </div>
        `;
        proposalsList.appendChild(listItem);
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.btn-approve').forEach(button => {
        button.addEventListener('click', (e) => {
            const proposalId = parseInt(e.target.dataset.id);
            updateProposalStatus(proposalId, 'approved');
            renderAdminProposals(); // Refresh the list
        });
    });

    document.querySelectorAll('.btn-reject').forEach(button => {
        button.addEventListener('click', (e) => {
            const proposalId = parseInt(e.target.dataset.id);
            updateProposalStatus(proposalId, 'rejected');
            renderAdminProposals(); // Refresh the list
        });
    });
}