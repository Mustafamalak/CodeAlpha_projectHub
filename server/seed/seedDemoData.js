const mongoose = require("mongoose");
const path = require("path");

// Load env variables
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const seedData = async () => {
    try {
        console.log("Connecting to database for seeding...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully.");

        // Clean existing data
        console.log("Cleaning database collections...");
        await User.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});
        console.log("Database collections cleared.");

        // 1. Create 8 demo users
        console.log("Creating 8 demo users...");
        const usersData = [
            {
                name: "Alice Smith",
                email: "alice@example.com",
                password: "123456",
                role: "manager",
                position: "Project Manager",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            },
            {
                name: "Bob Jones",
                email: "bob@example.com",
                password: "123456",
                role: "member",
                position: "Backend Developer",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            },
            {
                name: "Charlie Brown",
                email: "charlie@example.com",
                password: "123456",
                role: "member",
                position: "Frontend Developer",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            },
            {
                name: "Diana Prince",
                email: "diana@example.com",
                password: "123456",
                role: "member",
                position: "UI/UX Designer",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            },
            {
                name: "Ethan Hunt",
                email: "ethan@example.com",
                password: "123456",
                role: "member",
                position: "QA Engineer",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            },
            {
                name: "Fiona Gallagher",
                email: "fiona@example.com",
                password: "123456",
                role: "member",
                position: "Frontend Developer",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            },
            {
                name: "George Clark",
                email: "george@example.com",
                password: "123456",
                role: "member",
                position: "Backend Developer",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
            },
            {
                name: "Hannah Abbott",
                email: "hannah@example.com",
                password: "123456",
                role: "member",
                position: "QA Engineer",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            },
        ];

        const createdUsers = [];
        // Save users one by one to trigger mongoose password pre-save hook correctly
        for (const u of usersData) {
            const user = new User(u);
            await user.save();
            createdUsers.push(user);
        }
        console.log(`Successfully created ${createdUsers.length} users.`);

        // Destructure users for easy referencing
        const [alice, bob, charlie, diana, ethan, fiona, george, hannah] = createdUsers;

        // Helper date generator
        const daysFromNow = (days) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date;
        };

        // 2. Create 6 projects
        console.log("Creating 6 projects...");
        const projectsData = [
            {
                name: "Ecommerce Redesign",
                description: "Complete overhaul of the consumer ecommerce store user interface and integration of modern checkout flows.",
                category: "Web Development",
                priority: "High",
                deadline: daysFromNow(30),
                owner: alice._id,
                members: [alice._id, charlie._id, diana._id, ethan._id],
            },
            {
                name: "AI Meeting Summarizer",
                description: "Building an audio transcription and AI analysis microservice to automate meeting action items.",
                category: "Artificial Intelligence",
                priority: "High",
                deadline: daysFromNow(15),
                owner: bob._id,
                members: [bob._id, alice._id, george._id, hannah._id],
            },
            {
                name: "Campus Team Finder",
                description: "A social tool for college students to find teammates for hackathons, study groups, and project collaborations.",
                category: "Mobile App",
                priority: "Medium",
                deadline: daysFromNow(45),
                owner: charlie._id,
                members: [charlie._id, fiona._id, diana._id, bob._id],
            },
            {
                name: "Marketing Dashboard",
                description: "Aggregating metrics from social media, email campaigns, and AdWords campaigns into a clean client UI.",
                category: "Analytics",
                priority: "Low",
                deadline: daysFromNow(60),
                owner: diana._id,
                members: [diana._id, alice._id, charlie._id, fiona._id],
            },
            {
                name: "OceanGuard Reporting Portal",
                description: "Web portal for reporting and logging ocean waste incidents and scheduling volunteer cleanup efforts.",
                category: "Environment",
                priority: "High",
                deadline: daysFromNow(20),
                owner: alice._id,
                members: [alice._id, bob._id, george._id, ethan._id, hannah._id],
            },
            {
                name: "Portfolio Revamp",
                description: "Redesigning the company product portfolio to feature case studies, interactive visual galleries, and client testimonials.",
                category: "Marketing",
                priority: "Medium",
                deadline: daysFromNow(10),
                owner: fiona._id,
                members: [fiona._id, diana._id, george._id],
            },
        ];

        const createdProjects = await Project.insertMany(projectsData);
        console.log(`Successfully created ${createdProjects.length} projects.`);

        const [ecommerce, summarizer, teamFinder, dashboard, oceanGuard, portfolio] = createdProjects;

        // 3. Create 30 tasks
        console.log("Creating 30 tasks with comments...");
        const tasksData = [
            // Ecommerce Redesign Tasks
            {
                title: "Design Homepage Layout",
                description: "Create wireframes and mockups for the updated homepage layout focusing on conversion optimization.",
                project: ecommerce._id,
                assignedTo: diana._id,
                createdBy: alice._id,
                status: "Done",
                priority: "High",
                dueDate: daysFromNow(-2),
                comments: [
                    { user: diana._id, text: "Figma drafts are finished. Please review in the shared channel." },
                    { user: alice._id, text: "Outstanding designs, Diana! Let's proceed to implementation." },
                ],
            },
            {
                title: "Implement Product Catalog API",
                description: "Develop the product search, filter, and categorization endpoints in the backend.",
                project: ecommerce._id,
                assignedTo: bob._id, // Bob is not project member! Wait, is Bob in members?
                // Members of Ecommerce: [alice, charlie, diana, ethan]. Bob is NOT in members!
                // Ah, let's assign to charlie or make sure members matches.
                // Let's use Charlie who is a member of Ecommerce.
                assignedTo: charlie._id,
                createdBy: alice._id,
                status: "In Progress",
                priority: "High",
                dueDate: daysFromNow(3),
                comments: [],
            },
            {
                title: "Integrate Payment Gateway",
                description: "Integrate Stripe API endpoints for processing cards, Apple Pay, and webhook status sync.",
                project: ecommerce._id,
                assignedTo: charlie._id,
                createdBy: alice._id,
                status: "Todo",
                priority: "High",
                dueDate: daysFromNow(7),
                comments: [],
            },
            {
                title: "Write Unit Tests for Auth",
                description: "Write comprehensive unit tests for signup, login, and token validation controllers.",
                project: ecommerce._id,
                assignedTo: ethan._id,
                createdBy: alice._id,
                status: "Done",
                priority: "Medium",
                dueDate: daysFromNow(-1),
                comments: [
                    { user: ethan._id, text: "All auth test suites are passing. 92% coverage achieved." },
                ],
            },
            {
                title: "Style Product Detail Page",
                description: "Style the product page with detailed reviews, quantity selector, and related items carousel.",
                project: ecommerce._id,
                assignedTo: charlie._id,
                createdBy: alice._id,
                status: "In Progress",
                priority: "Medium",
                dueDate: daysFromNow(2),
                comments: [],
            },

            // AI Meeting Summarizer Tasks
            {
                title: "Setup Audio Upload Endpoint",
                description: "Implement S3 presigned URL uploads and backend ingestion for raw MP3 files.",
                project: summarizer._id,
                assignedTo: george._id,
                createdBy: bob._id,
                status: "Done",
                priority: "High",
                dueDate: daysFromNow(-5),
                comments: [],
            },
            {
                title: "Integrate Whisper API",
                description: "Connect the transcription service with Open AI Whisper API and implement callback polling.",
                project: summarizer._id,
                assignedTo: bob._id,
                createdBy: bob._id,
                status: "In Progress",
                priority: "High",
                dueDate: daysFromNow(1),
                comments: [
                    { user: bob._id, text: "Waiting on token quota increase from the platform." },
                ],
            },
            {
                title: "Research Summarization Prompts",
                description: "Optimize prompts to pull actionable items, dates, and meeting summaries reliably.",
                project: summarizer._id,
                assignedTo: alice._id,
                createdBy: bob._id,
                status: "Done",
                priority: "Medium",
                dueDate: daysFromNow(-3),
                comments: [],
            },
            {
                title: "Setup Database Schema",
                description: "Design MongoDB schemas for Transcripts, SummaryRecords, and Speakers.",
                project: summarizer._id,
                assignedTo: george._id,
                createdBy: bob._id,
                status: "Done",
                priority: "Low",
                dueDate: daysFromNow(-6),
                comments: [],
            },
            {
                title: "Add QA Pipeline",
                description: "Verify transcription accuracy and latency under various background noise conditions.",
                project: summarizer._id,
                assignedTo: hannah._id,
                createdBy: bob._id,
                status: "Todo",
                priority: "Medium",
                dueDate: daysFromNow(5),
                comments: [],
            },

            // Campus Team Finder Tasks
            {
                title: "Design Figma Mockups",
                description: "High-fidelity mockups for student profile cards, discover deck, and messenger.",
                project: teamFinder._id,
                assignedTo: diana._id,
                createdBy: charlie._id,
                status: "Done",
                priority: "Medium",
                dueDate: daysFromNow(-4),
                comments: [],
            },
            {
                title: "Implement User Matching Algorithm",
                description: "Build algorithm pairing users based on shared tags, classes, and availability times.",
                project: teamFinder._id,
                assignedTo: bob._id,
                createdBy: charlie._id,
                status: "In Progress",
                priority: "High",
                dueDate: daysFromNow(2),
                comments: [],
            },
            {
                title: "Build Registration Forms",
                description: "Build university email validator page and multi-step skill selector components.",
                project: teamFinder._id,
                assignedTo: fiona._id,
                createdBy: charlie._id,
                status: "Done",
                priority: "Medium",
                dueDate: daysFromNow(-1),
                comments: [
                    { user: fiona._id, text: "Email domain validation added. Only .edu domains allowed." },
                ],
            },
            {
                title: "Configure Web Sockets for Chat",
                description: "Establish real-time connections via Socket.io to support immediate messaging between matches.",
                project: teamFinder._id,
                assignedTo: charlie._id,
                createdBy: charlie._id,
                status: "Todo",
                priority: "High",
                dueDate: daysFromNow(6),
                comments: [],
            },
            {
                title: "Test Mobile Responsiveness",
                description: "Audit layouts on iOS and Android devices via Chrome emulator to adjust padding.",
                project: teamFinder._id,
                assignedTo: fiona._id,
                createdBy: charlie._id,
                status: "Todo",
                priority: "Low",
                dueDate: daysFromNow(4),
                comments: [],
            },

            // Marketing Dashboard Tasks
            {
                title: "Design Analytics Layout",
                description: "Design structured grid system for dashboard layouts with key performance indicator charts.",
                project: dashboard._id,
                assignedTo: diana._id,
                createdBy: diana._id,
                status: "Done",
                priority: "High",
                dueDate: daysFromNow(-3),
                comments: [],
            },
            {
                title: "Implement Chart.js Dashboard",
                description: "Build charts showing weekly and monthly website metrics utilizing Chart.js canvas elements.",
                project: dashboard._id,
                assignedTo: fiona._id,
                createdBy: diana._id,
                status: "In Progress",
                priority: "High",
                dueDate: daysFromNow(1),
                comments: [
                    { user: fiona._id, text: "Responsive sizing on mobile needs a quick CSS fix." },
                ],
            },
            {
                title: "Connect Analytics API",
                description: "Aggregate incoming statistics from the server middleware and structure payload for client-side load.",
                project: dashboard._id,
                assignedTo: charlie._id,
                createdBy: diana._id,
                status: "Todo",
                priority: "Medium",
                dueDate: daysFromNow(4),
                comments: [],
            },
            {
                title: "Configure Custom Reports Export",
                description: "Implement PDF generation backend utility to allow admins to export reports directly.",
                project: dashboard._id,
                assignedTo: alice._id,
                createdBy: diana._id,
                status: "Todo",
                priority: "Medium",
                dueDate: daysFromNow(8),
                comments: [],
            },
            {
                title: "Marketing Team Walkthrough",
                description: "Demonstrate prototype features and gather feedback on the layout changes.",
                project: dashboard._id,
                assignedTo: diana._id,
                createdBy: diana._id,
                status: "Done",
                priority: "Low",
                dueDate: daysFromNow(-2),
                comments: [],
            },

            // OceanGuard Reporting Portal Tasks
            {
                title: "Setup Database GIS Extensions",
                description: "Integrate geo-coordinate data types in models for mapping trash coordinates.",
                project: oceanGuard._id,
                assignedTo: george._id,
                createdBy: alice._id,
                status: "Done",
                priority: "High",
                dueDate: daysFromNow(-8),
                comments: [],
            },
            {
                title: "Map Visualisation Layer",
                description: "Plot coordinates on leaflet map and design markers indicating waste intensity levels.",
                project: oceanGuard._id,
                assignedTo: bob._id,
                createdBy: alice._id,
                status: "In Progress",
                priority: "High",
                dueDate: daysFromNow(3),
                comments: [],
            },
            {
                title: "Incident Report Submission Form",
                description: "Develop multi-file photo uploader and description form for waste reports.",
                project: oceanGuard._id,
                assignedTo: alice._id,
                createdBy: alice._id,
                status: "Done",
                priority: "Medium",
                dueDate: daysFromNow(-4),
                comments: [
                    { user: alice._id, text: "Form is functional. Connecting with image uploads next." },
                ],
            },
            {
                title: "Write Integration Tests",
                description: "Write tests covering report submission, waste classification, and email notifications.",
                project: oceanGuard._id,
                assignedTo: ethan._id,
                createdBy: alice._id,
                status: "Todo",
                priority: "Medium",
                dueDate: daysFromNow(6),
                comments: [],
            },
            {
                title: "Perform Penetration Testing",
                description: "Security analysis focusing on file upload payload vulnerabilities.",
                project: oceanGuard._id,
                assignedTo: hannah._id,
                createdBy: alice._id,
                status: "Todo",
                priority: "High",
                dueDate: daysFromNow(10),
                comments: [],
            },

            // Portfolio Revamp Tasks
            {
                title: "Content Gathering & Editing",
                description: "Gather images, client logos, and write descriptions for high-profile projects.",
                project: portfolio._id,
                assignedTo: fiona._id,
                createdBy: fiona._id,
                status: "Done",
                priority: "Low",
                dueDate: daysFromNow(-10),
                comments: [],
            },
            {
                title: "Design Hero Section",
                description: "Draft layouts for the portfolio landing page hero emphasizing custom animations.",
                project: portfolio._id,
                assignedTo: diana._id,
                createdBy: fiona._id,
                status: "Done",
                priority: "High",
                dueDate: daysFromNow(-6),
                comments: [],
            },
            {
                title: "Implement CSS Styles",
                description: "Write core stylesheet using responsive typography and elegant CSS variables.",
                project: portfolio._id,
                assignedTo: fiona._id,
                createdBy: fiona._id,
                status: "Done",
                priority: "Medium",
                dueDate: daysFromNow(-4),
                comments: [],
            },
            {
                title: "Add Contact Form Handler",
                description: "Develop nodemailer contact form submission backend and verify SMTP configurations.",
                project: portfolio._id,
                assignedTo: george._id,
                createdBy: fiona._id,
                status: "In Progress",
                priority: "Medium",
                dueDate: daysFromNow(2),
                comments: [],
            },
            {
                title: "Deploy to Hosting Platform",
                description: "Configure staging deployment and bind domains to the production server.",
                project: portfolio._id,
                assignedTo: fiona._id,
                createdBy: fiona._id,
                status: "Todo",
                priority: "Low",
                dueDate: daysFromNow(5),
                comments: [],
            },
        ];

        const createdTasks = await Task.insertMany(tasksData);
        console.log(`Successfully created ${createdTasks.length} tasks.`);

        console.log("Database seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Database seeding failed:", error);
        process.exit(1);
    }
};

seedData();
