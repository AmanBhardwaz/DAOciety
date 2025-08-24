const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // ADDED: For parsing application/x-www-form-urlencoded data
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection (replace with your connection string)
// const mongoose = require('mongoose');

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/deociety', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected successfully.'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Mongoose Schemas
// const ProposalSchema = new mongoose.Schema({
//     title: String,
//     details: String,
//     status: { type: String, default: 'pending' }
// });

// const TenderSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     status: String, // ongoing, completed, upcoming
//     reviews: [{ reviewer: String, comment: String }]
// });

// const Proposal = mongoose.model('Proposal', ProposalSchema);
// const Tender = mongoose.model('Tender', TenderSchema);

// // API Routes (No longer needed as we are moving to local storage)
// app.post('/api/proposals', (req, res) => {
//     const newProposal = new Proposal({
//         title: req.body.title,
//         details: req.body.details
//     });

//     newProposal.save()
//         .then(proposal => res.json(proposal))
//         .catch(err => {
//             console.error('Failed to save proposal:', err);
//             res.status(500).json({ error: 'Failed to save proposal' });
//         });
// });

// // Get recent proposals for the dashboard
// app.get('/api/proposals', (req, res) => {
//     Proposal.find().sort({ _id: -1 }).limit(3)
//         .then(proposals => res.json(proposals))
//         .catch(err => res.status(500).json({ error: 'Failed to fetch proposals' }));
// });

// // Get tenders, with optional status filtering
// app.get('/api/tenders', (req, res) => {
//     const { status } = req.query;
//     let query = {};
//     if (status) {
//         query.status = status;
//     }
//     Tender.find(query)
//         .then(tenders => res.json(tenders))
//         .catch(err => res.status(500).json({ error: 'Failed to fetch tenders' }));
// });

// // Get dashboard metrics
// app.get('/api/dashboard-metrics', async (req, res) => {
//     try {
//         const proposalCount = await Proposal.countDocuments();
//         const activeTenderCount = await Tender.countDocuments({ status: 'ongoing' });
//         res.json({
//             proposalsSubmitted: proposalCount,
//             activeTenders: activeTenderCount,
//             communityMembers: '1,200+' // Static value as there is no user model
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
//     }
// });

// Serve HTML pages (NOTE: This catch-all route might prevent API calls if not careful)
// A common structure is to serve specific files based on requests like this:
app.get('/proposal.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'proposal.html'));
});

// Fallback for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});