// Manages all local storage operations for the Deociety application

function initializeLocalStorage() {
    // Check if data already exists to avoid overwriting it
    if (localStorage.getItem('proposals') && localStorage.getItem('tenders')) {
        return; // Data already initialized
    }

    // Sample data
    const sampleProposals = [
        { id: 1, title: 'New Community Park', details: 'A proposal to convert the unused plot on Elm Street into a green space for families and children.' },
        { id: 2, title: 'Upgrade Street Lighting', details: 'Proposal to replace all existing streetlights with energy-efficient LED lamps to reduce costs and improve safety.' },
        { id: 3, title: 'Waste Management Program', details: 'Introducing a new recycling and composting initiative to promote environmental sustainability.' },
        { id: 4, title: 'Public Library Renovation', details: 'Expanding the public library to include a new digital media center and community workshop space.' }
    ];

    const sampleTenders = [
        { id: 1, title: 'Road Repair (Ward 14)', description: 'Resurfacing of 3.2 km of road with hot mix asphalt.', budget: 4800000, deadline: '2025-10-01', status: 'ongoing' },
        { id: 2, title: 'Smart Lights – Phase II', description: 'Installation of 500 LED poles with a central monitoring system.', budget: 10500000, deadline: '2025-09-30', status: 'ongoing' },
        { id: 3, title: 'Community Hall Construction', description: 'Building a new multi-purpose community hall with a capacity of 200 people.', budget: 8500000, deadline: '2025-11-15', status: 'ongoing' },
        { id: 4, title: 'Public Park Landscaping', description: 'Landscaping and beautification of the central public park, including new benches and a childrens play area.', budget: 3200000, deadline: '2025-12-01', status: 'ongoing' },
        { id: 5, title: 'School Roof Renovation', description: 'Replaced asbestos roofing with new metal sheets for the main school building.', budget: 2250000, deadline: '2025-08-15', status: 'completed' }
    ];

    // Store the sample data in local storage
    localStorage.setItem('proposals', JSON.stringify(sampleProposals));
    localStorage.setItem('tenders', JSON.stringify(sampleTenders));
}

// --- Proposal Functions ---
function getProposals() {
    return JSON.parse(localStorage.getItem('proposals')) || [];
}

function addProposal(proposal) {
    const proposals = getProposals();
    const newProposal = {
        id: proposals.length > 0 ? Math.max(...proposals.map(p => p.id)) + 1 : 1,
        status: 'pending', // Default status for all new proposals
        ...proposal
    };
    proposals.push(newProposal);
    localStorage.setItem('proposals', JSON.stringify(proposals));
    return newProposal;
}

function updateProposalStatus(proposalId, newStatus) {
    const proposals = getProposals();
    const proposalIndex = proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex !== -1) {
        proposals[proposalIndex].status = newStatus;
        localStorage.setItem('proposals', JSON.stringify(proposals));
    }
}

function getProposalsByStatus(status) {
    const proposals = getProposals();
    return proposals.filter(p => p.status === status);
}

// --- Tender Functions ---
function getTenders(status) {
    const tenders = JSON.parse(localStorage.getItem('tenders')) || [];
    if (status) {
        return tenders.filter(tender => tender.status === status);
    }
    return tenders;
}

// --- Announcement Functions ---
function getAnnouncements() {
    return JSON.parse(localStorage.getItem('announcements')) || [];
}

function addAnnouncement(announcementText) {
    const announcements = getAnnouncements();
    const newAnnouncement = {
        id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
        text: announcementText,
        date: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    return newAnnouncement;
}

// --- Dashboard Functions ---
function getDashboardMetrics() {
    const proposals = getProposals();
    const ongoingTenders = getTenders('ongoing');
    return {
        proposalsSubmitted: proposals.length,
        activeTenders: ongoingTenders.length,
        communityMembers: '1,200+' // Static value
    };
}

// Initialize on script load
initializeLocalStorage();
