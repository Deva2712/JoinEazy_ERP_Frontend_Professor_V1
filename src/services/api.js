// API service for all backend calls
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://192.168.210.97:8000/api/v1";

// Mock mode configuration - should match auth.js
const USE_MOCK_API = false;

const SHARED_COHORTS = [
	{
		id: 1,
		cohort_name: "Introduction to Computer Science",
		course_codes: ["CS101", "EE101", "ME101"], // Supports multiple cross-listed codes
		cohort_description:
			"Comprehensive introduction to computer science fundamentals.",
		status: "Live",
		visibility: "Active",
		member_count: 10,
		group_count: 3,
		assignment_count: 6,
		start_date: "2026-01-20T00:00:00Z",
		end_date: "2026-06-15T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
	{
		id: 2,
		cohort_name: "Data Structures & Algorithms",
		course_codes: ["CS201"],
		cohort_description: "Master essential data structures and algorithms.",
		status: "Live",
		visibility: "Active",
		member_count: 4,
		group_count: 2,
		start_date: "2026-01-15T00:00:00Z",
		end_date: "2026-05-30T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
	{
		id: 3,
		cohort_name: "Calculus I",
		course_codes: ["MA101", "MATH101"],
		cohort_description: "Limits, derivatives, integrals, and applications.",
		status: "Live",
		visibility: "Active",
		member_count: 5,
		group_count: 2,
		start_date: "2026-01-18T00:00:00Z",
		end_date: "2026-05-20T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
	{
		id: 4,
		cohort_name: "Database Systems",
		course_codes: ["CS301", "IS301"],
		cohort_description: "Relational databases, SQL, and database design.",
		status: "Live",
		visibility: "Active",
		member_count: 4,
		group_count: 2,
		start_date: "2026-01-20T00:00:00Z",
		end_date: "2026-06-01T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
];

const DEPARTMENT_MAPPING = {
	"Computer Science": "CS",
	"Electrical Engineering": "EE",
	"Mechanical Engineering": "ME",
	"Information Systems": "IS",
	Mathematics: "MA",
};

const MOCK_TODO_ASSIGNMENTS = [
	{
		id: 1,
		title: "Python Programming Assignment",
		courseName: "Introduction to Computer Science",
		cohortId: 1,
		dueDate: "2026-01-15",
		status: "pending",
	},
	{
		id: 2,
		title: "Binary Search Tree Implementation",
		courseName: "Data Structures & Algorithms",
		cohortId: 2,
		dueDate: "2026-01-12",
		status: "pending",
	},
	{
		id: 3,
		title: "Integration Problems",
		courseName: "Calculus I",
		cohortId: 3,
		dueDate: "2026-01-18",
		status: "pending",
	},
	{
		id: 4,
		title: "SQL Query Optimization",
		courseName: "Database Systems",
		cohortId: 4,
		dueDate: "2026-01-20",
		status: "pending",
	},
];

// Mock dashboard data for professor
export const MOCK_PROFESSOR_DASHBOARD_DATA = {
	isAllowedCreateCohort: true,
	is_allowed_create_cohort: true,
	posts: 12,
	cohortCount: 5,
	cohort_count: 5,
	total_students: 50,
	user: {
		// name: "Dr. Jane Smith",
		// rollNumber: "PROF001",
		// email: "jane.smith@mahindrauniversity.edu.in",

		// Comprehensive Profile Data
		fullName: "Dr. Jane Smith",
		dateOfBirth: "1985-05-15",
		organization: "Mahindra University",
		profile_pic: "https://example.com/profiles/jane-smith.jpg",
		gender: "female",
		employeeId: "PROF-001",
		department: "Computer Science",
		designation: "Associate Professor",
		officeLocation: "Block A, Room 302",
		permanentAddress: "123 Academic Lane, Bengaluru, India",
		currentAddress: "456 University Housing, Bengaluru, India",
		city: "Bengaluru",
		state: "Karnataka",
		pinCode: "560001",
		country: "India",
		mobileNumber: "9876543210",
		alternateNumber: "9876543211",
		panNumber: "ABCDE1234F",
		aadhaarNumber: "123456789012",
		officialEmail: "jane.smith@mahindrauniversity.edu.in",
		personalEmail: "jane.smith.dev@gmail.com",
		linkedinProfile: "https://linkedin.com/in/janesmith-professor",
		documents: [],
	},
	todoAssignments: [],
	createdCohorts: SHARED_COHORTS.map((cohort) => ({
		...cohort,
		is_creator: true,
	})),
	joinedCohorts: [],
};

// Mock dashboard data for student
const MOCK_STUDENT_DASHBOARD_DATA = {
	isAllowedCreateCohort: false,
	is_allowed_create_cohort: false,
	posts: 8,
	cohortCount: 5,
	cohort_count: 5,
	cohorts: SHARED_COHORTS,
	user: {
		name: "John Doe",
		rollNumber: "12113202734",
		organization: "Mahindra University",
		 currentSemester: "Semester 4",  
        academicYear: "2025 – 2026",
	},
	todoAssignments: MOCK_TODO_ASSIGNMENTS,
	createdCohorts: [],
	joinedCohorts: SHARED_COHORTS.map((cohort) => ({
		...cohort,
		is_creator: false,
	})),
};

const MOCK_ARCHIVED_COURSES = [
	{
		id: 105,
		cohort_name: "Introduction to Python",
		course_codes: ["CS101"],
		cohort_description:
			"Comprehensive introduction to Python programming covering basics, data structures, OOP, and file handling. Perfect for beginners looking to start their programming journey.",
		status: "Archived",
		visibility: "Archived",
		member_count: 42,
		group_count: 8,
		start_date: "2025-01-15T00:00:00Z",
		end_date: "2025-05-15T00:00:00Z",
		created_at: "2025-01-01T08:00:00Z",
		is_creator: false, // Indicates if the current user is the course creator
	},
	{
		id: 106,
		cohort_name: "Web Development",
		course_codes: ["CS205"],
		cohort_description:
			"Learn HTML, CSS, and JavaScript basics. Build responsive websites and understand modern web development practices including Git and deployment.",
		status: "Archived",
		visibility: "Archived",
		member_count: 38,
		group_count: 7,
		start_date: "2025-02-01T00:00:00Z",
		end_date: "2025-06-01T00:00:00Z",
		created_at: "2025-01-20T09:30:00Z",
		is_creator: false,
	},
	{
		id: 107,
		cohort_name: "Computer Networks",
		course_codes: ["CS560"],
		cohort_description:
			"Study network protocols, TCP/IP, routing algorithms, network security, and modern networking concepts. Includes hands-on labs and real-world scenarios.",
		status: "Archived",
		visibility: "Archived",
		member_count: 35,
		group_count: 6,
		start_date: "2024-09-01T00:00:00Z",
		end_date: "2024-12-20T00:00:00Z",
		created_at: "2024-08-15T10:00:00Z",
		is_creator: false,
	},
	{
		id: 108,
		cohort_name: "Machine Learning Basics",
		course_codes: ["CS740"],
		cohort_description:
			"Introduction to ML algorithms, supervised and unsupervised learning, neural networks, and practical applications using Python and scikit-learn.",
		status: "Archived",
		visibility: "Archived",
		member_count: 30,
		group_count: 5,
		start_date: "2024-08-15T00:00:00Z",
		end_date: "2024-12-15T00:00:00Z",
		created_at: "2024-08-01T11:00:00Z",
		is_creator: false,
	},
	{
		id: 109,
		cohort_name: "Operating Systems",
		course_codes: ["CS450"],
		cohort_description:
			"Deep dive into OS concepts: process management, memory management, file systems, deadlocks, and synchronization. Includes Linux kernel programming.",
		status: "Archived",
		visibility: "Archived",
		member_count: 45,
		group_count: 9,
		start_date: "2024-06-01T00:00:00Z",
		end_date: "2024-10-01T00:00:00Z",
		created_at: "2024-05-15T09:00:00Z",
		is_creator: false,
	},
];

// Detailed assignments for each course
const MOCK_COURSE_ASSIGNMENTS = {
	1: [
		// Introduction to Computer Science
		{
			id: 100,
			title: "HTML & CSS Fundamentals",
			description:
				"Create a responsive portfolio website using HTML5 and CSS3",
			dueDate: "2026-01-05T23:59:59Z",
			status: "overdue",
			marks: "100",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2025-12-20T12:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 101,
			title: "Python Programming Assignment",
			description:
				"Write a Python program to implement basic data structures and algorithms",
			dueDate: "2026-01-15",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-01T12:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 103,
			title: "JavaScript Functions & Arrays",
			description:
				"Complete exercises on array methods, arrow functions, and callbacks",
			dueDate: "2026-01-18T23:59:59Z",
			status: "submitted",
			marks: "50",
			type: "individual",
			submittedAt: "2026-01-08T14:30:00Z",
			submissions: [
				{
					studentId: 1,
					studentName: "John Doe",
					submittedAt: "2026-01-08T14:30:00Z",
				},
			],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-02T09:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
		},
		{
			id: 104,
			title: "Team Database Design Project",
			description:
				"Design and implement a complete database schema for an e-commerce platform with your team",
			dueDate: "2026-01-07T23:59:59Z",
			status: "overdue",
			marks: "150",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2025-12-28T10:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 102,
			title: "Object-Oriented Programming Project",
			description:
				"Design and implement a class hierarchy for a real-world system",
			dueDate: "2026-01-22",
			status: "pending",
			marks: "",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-05T10:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 105,
			title: "Team Web Development Project",
			description:
				"Build a full-stack web application with your team using React and Node.js. Include authentication, database integration, and responsive design.",
			dueDate: "2026-01-30T23:59:59Z",
			status: "pending",
			marks: "200",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-10T10:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
	2: [
		// Data Structures & Algorithms
		{
			id: 201,
			title: "Binary Search Tree Implementation",
			description:
				"Implement a BST with insert, delete, and search operations",
			dueDate: "2026-01-12",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-02T12:00:00Z",
			cohortId: 2,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 202,
			title: "Graph Algorithms Project",
			description: "Implement Dijkstra's and A* pathfinding algorithms",
			dueDate: "2026-01-18",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-03T12:00:00Z",
			cohortId: 2,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 203,
			title: "Algorithm Analysis Report",
			description:
				"Analyze time and space complexity of common sorting algorithms",
			dueDate: "2026-01-25",
			status: "pending",
			marks: "",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-04T12:00:00Z",
			cohortId: 2,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
	3: [
		// Calculus I
		{
			id: 301,
			title: "Integration Problems",
			description:
				"Solve definite and indefinite integrals using various techniques",
			dueDate: "2026-01-18",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-03T12:00:00Z",
			cohortId: 3,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 302,
			title: "Derivatives and Applications",
			description:
				"Calculate derivatives and apply them to optimization problems",
			dueDate: "2026-01-24",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-06T12:00:00Z",
			cohortId: 3,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
	4: [
		// Database Systems
		{
			id: 401,
			title: "SQL Query Optimization",
			description:
				"Write and optimize complex SQL queries for a given database schema",
			dueDate: "2026-01-20",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-04T12:00:00Z",
			cohortId: 4,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 402,
			title: "Database Design Project",
			description:
				"Design a normalized database schema for an e-commerce system",
			dueDate: "2026-01-26",
			status: "pending",
			marks: "",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-07T12:00:00Z",
			cohortId: 4,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 403,
			title: "NoSQL vs SQL Comparison",
			description:
				"Compare MongoDB and PostgreSQL for a specific use case",
			dueDate: "2026-02-02",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-08T12:00:00Z",
			cohortId: 4,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
};

const MOCK_RESOURCES = {
	1: {
		// Introduction to Computer Science
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Introduction to Programming",
				dateRange: "Jan 15 - Jan 21",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Lecture Slides: Basic Concepts & Setup",
						description:
							"Essential concepts covered in Week 1 lecture",
						type: "slides",
						url: "https://docs.google.com/presentation/d/1example",
						addedAt: "2026-01-15T10:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 2,
						title: "Environment Setup Tutorial",
						description:
							"Complete guide to setting up development environment",
						type: "video",
						url: "https://youtube.com/watch?v=example",
						addedAt: "2026-01-15T14:30:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 2,
				weekNumber: 2,
				title: "Variables, Data Types & Operators",
				dateRange: "Jan 22 - Jan 28",
				totalResources: 3,
				resources: [
					{
						id: 3,
						title: "Week 2 Lecture Notes",
						description:
							"Comprehensive notes on variables and data types",
						type: "document",
						url: "https://docs.google.com/document/d/1example",
						addedAt: "2026-01-22T09:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 4,
						title: "Practice Problems",
						description: "Set of 20 practice problems for Week 2",
						type: "document",
						url: "https://drive.google.com/file/d/1example",
						addedAt: "2026-01-23T11:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 5,
						title: "Reference: Python Official Docs",
						description:
							"Official Python documentation on data types",
						type: "link",
						url: "https://docs.python.org/3/library/stdtypes.html",
						addedAt: "2026-01-24T15:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 3,
				weekNumber: 3,
				title: "Control Structures & Logic",
				dateRange: "Jan 29 - Feb 4",
				totalResources: 0,
				resources: [],
			},
		],
		stats: {
			totalWeeks: 3,
			totalResources: 5,
		},
	},
	2: {
		// Data Structures & Algorithms
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Arrays and Linked Lists",
				dateRange: "Jan 10 - Jan 16",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Array Operations Lecture",
						description:
							"Understanding array operations and complexity",
						type: "slides",
						url: "https://docs.google.com/presentation/d/2example",
						addedAt: "2026-01-10T10:00:00Z",
						addedBy: "Prof. Sarah Williams",
					},
					{
						id: 2,
						title: "Linked List Implementation",
						description: "Step by step linked list coding tutorial",
						type: "video",
						url: "https://youtube.com/watch?v=example2",
						addedAt: "2026-01-11T14:00:00Z",
						addedBy: "Prof. Sarah Williams",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 2,
		},
	},
	3: {
		// Calculus I
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Limits and Continuity",
				dateRange: "Jan 12 - Jan 18",
				totalResources: 3,
				resources: [
					{
						id: 1,
						title: "Limits Lecture Slides",
						description:
							"Introduction to limits and their properties",
						type: "slides",
						url: "https://docs.google.com/presentation/d/3example",
						addedAt: "2026-01-12T09:00:00Z",
						addedBy: "Dr. Michael Brown",
					},
					{
						id: 2,
						title: "Continuity Examples",
						description: "Worked examples of continuous functions",
						type: "document",
						url: "https://docs.google.com/document/d/3example",
						addedAt: "2026-01-13T10:00:00Z",
						addedBy: "Dr. Michael Brown",
					},
					{
						id: 3,
						title: "Practice Problems Set 1",
						description: "Problems on limits and continuity",
						type: "document",
						url: "https://drive.google.com/file/d/3example",
						addedAt: "2026-01-14T11:00:00Z",
						addedBy: "Dr. Michael Brown",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 3,
		},
	},
	4: {
		// Database Systems
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Database Fundamentals",
				dateRange: "Jan 10 - Jan 16",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Introduction to Databases",
						description: "Overview of database concepts and DBMS",
						type: "slides",
						url: "https://docs.google.com/presentation/d/4example",
						addedAt: "2026-01-10T10:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
					{
						id: 2,
						title: "SQL Basics Tutorial",
						description: "Getting started with SQL queries",
						type: "video",
						url: "https://youtube.com/watch?v=example4",
						addedAt: "2026-01-11T14:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 2,
		},
	},
	102: {
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Introduction to Programming",
				dateRange: "Jan 15 - Jan 21",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Lecture Slides: Basic Concepts & Setup",
						description:
							"Essential concepts covered in Week 1 lecture",
						type: "slides", // slides, video, document, link
						url: "https://docs.google.com/presentation/...",
						addedAt: "2026-01-15T10:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 2,
						title: "Environment Setup Tutorial",
						description:
							"Complete guide to setting up development environment",
						type: "video",
						url: "https://youtube.com/watch?v=...",
						addedAt: "2026-01-15T14:30:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 2,
				weekNumber: 2,
				title: "Variables, Data Types & Operators",
				dateRange: "Jan 22 - Jan 28",
				totalResources: 3,
				resources: [
					{
						id: 3,
						title: "Week 2 Lecture Notes",
						description:
							"Comprehensive notes on variables and data types",
						type: "document",
						url: "https://docs.google.com/document/...",
						addedAt: "2026-01-22T09:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 4,
						title: "Practice Problems",
						description: "Set of 20 practice problems for Week 2",
						type: "document",
						url: "https://drive.google.com/file/...",
						addedAt: "2026-01-23T11:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 5,
						title: "Reference: Python Official Docs",
						description:
							"Official Python documentation on data types",
						type: "link",
						url: "https://docs.python.org/3/library/stdtypes.html",
						addedAt: "2026-01-24T15:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 3,
				weekNumber: 3,
				title: "Control Structures & Logic",
				dateRange: "Jan 29 - Feb 4",
				totalResources: 0,
				resources: [],
			},
		],
		stats: {
			totalWeeks: 3,
			totalResources: 5,
		},
	},
	103: {
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Database Fundamentals",
				dateRange: "Jan 10 - Jan 16",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Introduction to Databases",
						description: "Overview of database concepts",
						type: "slides",
						url: "https://docs.google.com/presentation/...",
						addedAt: "2026-01-10T10:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
					{
						id: 2,
						title: "SQL Basics Tutorial",
						description: "Getting started with SQL queries",
						type: "video",
						url: "https://youtube.com/watch?v=...",
						addedAt: "2026-01-11T14:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 2,
		},
	},
	104: {
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Introduction to Algorithms",
				dateRange: "Jan 12 - Jan 18",
				totalResources: 1,
				resources: [
					{
						id: 1,
						title: "Algorithm Analysis Slides",
						description: "Time and space complexity analysis",
						type: "slides",
						url: "https://docs.google.com/presentation/...",
						addedAt: "2026-01-12T09:00:00Z",
						addedBy: "Prof. Sarah Williams",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 1,
		},
	},
};

const MOCK_COURSE_DETAILS = [
	{
		id: 101,
		title: "React Basics[CS240]",
		description:
			"Learn fundamentals of React including components, state, and props.Deep dive into advanced JS concepts like closures, async/await, event loop, and ES6+ features. Build scalable applications",
		status: "Live",
		organization_name: "Mahindra University",
		createdAt: "2025-06-21T10:00:00Z",
		memberCount: 25,
		groupCount: 5,
		link: "/course/101",
		is_admin: false, // Will be overridden by API call based on userRole
		user_type: 0, // Will be overridden by API call based on userRole
		detail_sections: [
			{
				id: 1,
				title: "Course Overview",
				subsec_description:
					"This course covers React basics including JSX, components, state, props, and lifecycle methods. Deep dive into advanced JS concepts like closures, async/await, event loop, and ES6+ features. Build scalable applications",
			},
			{
				id: 2,
				title: "Syllabus",
				subsec_description:
					"Week 1: JSX & Components\nWeek 2: State & Props\nWeek 3: Lifecycle Methods\nWeek 4: Hooks Introduction",
			},
			{
				id: 3,
				title: "Instructor Info",
				subsec_description:
					"John Doe, Senior React Developer, 10 years of experience in frontend development.",
			},
		],
	},
	{
		id: 102,
		title: "Advanced JavaScript",
		description:
			"Deep dive into advanced JS concepts like closures, async/await, and event loop.",
		status: "Live",
		organization_name: "Mahindra University",
		createdAt: "2025-07-01T09:00:00Z",
		memberCount: 18,
		groupCount: 4,
		link: "/course/102",
		is_admin: false, // Will be overridden by API call based on userRole
		user_type: 0, // Will be overridden by API call based on userRole
		detail_sections: [
			{
				id: 1,
				title: "Course Overview",
				subsec_description:
					"Advanced topics in JavaScript including closures, promises, async/await, and ES6+ features.",
			},
			{
				id: 2,
				title: "Syllabus",
				subsec_description:
					"Week 1: Closures\nWeek 2: Event Loop & Async JS\nWeek 3: Promises & Async/Await\nWeek 4: ES6+ Features",
			},
			{
				id: 3,
				title: "Instructor Info",
				subsec_description:
					"Jane Smith, Senior JS Developer, specialized in modern JavaScript frameworks.",
			},
		],
	},
];

const MOCK_COURSE_MEMBERS = {
	1: {
		// Introduction to Computer Science
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 2,
				name: "Alice Johnson",
				rollNumber: "ST21BTECH11002",
				isYou: false,
			},
			{
				id: 3,
				name: "Charlie Lee",
				rollNumber: "ST21BTECH11003",
				isYou: false,
			},
			{
				id: 4,
				name: "David Kim",
				rollNumber: "ST21BTECH11004",
				isYou: false,
			},
			{
				id: 5,
				name: "Eva Green",
				rollNumber: "ST21BTECH11005",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "Team Alpha",
				members: [1, 4],
				isYouInGroup: true,
			},
			{
				id: 2,
				name: "Team Beta",
				members: [2, 5],
				isYouInGroup: false,
			},
			{
				id: 3,
				name: "Team Gamma",
				members: [3],
				isYouInGroup: false,
			},
		],
	},
	2: {
		// Data Structures & Algorithms
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "Algorithm Masters",
				members: [6, 1], // Changed: User 6 is now leader, user 1 is member
				isYouInGroup: true,
			},
			{
				id: 2,
				name: "Data Wizards",
				members: [7, 8],
				isYouInGroup: false,
			},
		],
	},
	3: {
		// Calculus I
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				isYou: false,
			},
			{
				id: 12,
				name: "Lisa Chen",
				rollNumber: "ST21BTECH11012",
				isYou: false,
			},
			{
				id: 13,
				name: "Mike Davis",
				rollNumber: "ST21BTECH11013",
				isYou: false,
			},
			{
				id: 14,
				name: "Nina Patel",
				rollNumber: "ST21BTECH11014",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "Calculus Club",
				members: [1, 10, 12],
				isYouInGroup: true,
			},
			{
				id: 2,
				name: "Math Enthusiasts",
				members: [13, 14],
				isYouInGroup: false,
			},
		],
	},
	4: {
		// Database Systems
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 16,
				name: "Priya Sharma",
				rollNumber: "ST21BTECH11016",
				isYou: false,
			},
			{
				id: 17,
				name: "Quinn Lee",
				rollNumber: "ST21BTECH11017",
				isYou: false,
			},
			{
				id: 18,
				name: "Rachel Kim",
				rollNumber: "ST21BTECH11018",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "SQL Squad",
				members: [16],
				isYouInGroup: false,
			},
			{
				id: 2,
				name: "NoSQL Ninjas",
				members: [17, 18],
				isYouInGroup: false,
			},
		],
	},
};

// Schedule & Meeting
const MOCK_OFFICE_HOURS = [
    {
        id: 1,
        courseName: "Data Structures",
        slots: [
            {
                day: "Monday",
                startTime: "02:00 PM",
                endTime: "04:00 PM",
            },
            {
                day: "Wednesday",
                startTime: "09:00 AM",
                endTime: "11:00 AM",
            }
        ]
    },
    {
        id: 2,
        courseName: "Database Management Systems",
        slots: [
            {
                day: "Tuesday",
                startTime: "01:00 PM",
                endTime: "03:00 PM",
            }
        ]
    },
    {
        id: 3,
        courseName: "Software Engineering",
        slots: [
            {
                day: "Thursday",
                startTime: "10:00 AM",
                endTime: "12:00 PM",
            },
            {
                day: "Friday",
                startTime: "04:00 PM",
                endTime: "05:00 PM",
            }
        ]
    }
];
const MOCK_SCHEDULED_MEETINGS = [
    {
        id: "SCH001",
        participantName: "Dr. Robert Chen",
        participantRole: "Professor",
        type: "Offline",
        startTime: "2026-03-20T09:00:00Z",
        subject: "Research Collaboration Discussion",
		reason: "Initial discussion successful, following up on proposal.",
        location: "Department Office 402",
        meetingLink: null,
        status: "scheduled"
    },
    {
        id: "SCH002",
        participantName: "Alice Johnson",
        participantRole: "Student",
        type: "Online",
        subject: "Office Hours: Recursion & DP",
		reason: "Follow up on recursion project.",
        startTime: "2026-03-21T14:30:00Z",
        location: "Virtual Meeting",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        status: "scheduled"
    }
];
const MOCK_MEETING_REQUESTS = {
    outgoing: [
        {
            id: "OUT001",
            participantName: "Dr. Robert Chen",
            participantDepartment: "Computer Science",
            participantRole: "Professor",
			type: "Online",
            subject: "Research Collaboration Discussion",
            requestedTime: "2026-03-18T09:00:00Z",
            reason: "Would like to discuss a potential collaboration on the blockchain research project and explore joint publication opportunities.",
            status: "pending",
            createdAt: "2026-03-05T10:00:00Z",
        },
        {
            id: "OUT002",
            participantName: "Prof. Alan Turing",
            participantDepartment: "Cybersecurity",
            participantRole: "HOD",
			type: "Offline",
            subject: "Curriculum Review Meeting",
            requestedTime: "2026-03-10T11:00:00Z",
            reason: "Discuss proposed changes to the advanced algorithms syllabus for next semester to align with industry requirements.",
            status: "rejected",
            rejectionReason: "Currently unavailable due to ongoing accreditation review. Please reschedule for April.",
            createdAt: "2026-03-01T09:00:00Z",
        },
        {
            id: "OUT003",
            participantName: "Dr. Robert Chen",
            participantDepartment: "Computer Science",
            participantRole: "Professor",
			type: "Offline",
            subject: "Research Collaboration Discussion",
            requestedTime: "2026-03-20T09:00:00Z",
            reason: "Initial discussion successful, following up on proposal.",
            status: "accepted",
            createdAt: "2026-03-05T10:00:00Z",
        }
    ],
    incoming: [
        {
            id: "MR001",
            participantName: "Alice Johnson",
            participantId: "ST21BTECH11002",
			participantDepartment: "Computer Science",
            participantRole: "Student",
			type: "Offline",
            subject: "Office Hours: Recursion & DP", 
            requestedTime: "2026-03-12T10:00:00Z",
            reason: "Need help understanding recursion and dynamic programming concepts covered in last week's lecture. I have tried the practice problems but am stuck on the memoization examples.",
            status: "pending",
            submittedAt: "2026-03-06T09:00:00Z",
        },
        {
            id: "MR002",
            participantName: "Charlie Lee",
            participantId: "ST21BTECH11003",
			participantDepartment: "Computer Science",
            participantRole: "Student",
			type: "Online",
            subject: "Assignment Clarification",
            requestedTime: "2026-03-13T14:00:00Z",
            reason: "Clarification needed on the upcoming assignment requirements for the graph algorithms project. Specifically unsure about the expected time complexity for Dijkstra's implementation.",
            status: "pending",
            submittedAt: "2026-03-06T10:30:00Z",
        },
        {
            id: "MR003",
            participantName: "David Kim",
            participantId: "ST21BTECH11004",
			participantDepartment: "Computer Science",
            participantRole: "Student",
			type: "Offline",
            subject: "Mid-term Performance Review",
            requestedTime: "2026-03-14T11:00:00Z",
            reason: "Would like to discuss my mid-term performance and get guidance on areas to improve before the final exam.",
            status: "pending",
            submittedAt: "2026-03-05T14:00:00Z",
        },
        {
            id: "MR004",
            participantName: "Alice Johnson",
            participantId: "ST21BTECH11002",
			participantDepartment: "Computer Science",
            participantRole: "Student",
			type: "Offline",
            subject: "Office Hours: Recursion & DP",
            requestedTime: "2026-03-21T14:30:00Z",
            reason: "Follow up on recursion project.",
            status: "accepted",
            submittedAt: "2026-03-06T09:00:00Z",
        }
    ]
};

// Session Planning
const MOCK_REFLECTIONS = [
    {
        id: "ref_101",
        classId: "SEC001", // Data Structures
        courseName: "Data Structures",
        batchSection: "CSE-A",
        semester: 3,
        whatWasTaught: "Introduction to Linked Lists and pointer manipulation.",
        needsImprovement: "Visualizing node deletion needs more board work.",
        topicsCarriedForward: "Doubly Linked Lists.",
        personalNotes: "Students asked a lot of questions about memory allocation.",
        visibleToHOD: true,
        date: "2026-03-16T09:00:00.000Z",
        status: "Submitted"
    },
    {
        id: "ref_102",
        classId: "SEC001", // Data Structures
        courseName: "Data Structures",
        batchSection: "CSE-A",
        semester: 3,
        whatWasTaught: "Normalization: 1NF, 2NF, and 3NF with examples.",
        needsImprovement: "",
        topicsCarriedForward: "Boyce-Codd Normal Form (BCNF).",
        personalNotes: "The practical examples from industry helped clarity.",
        visibleToHOD: false,
        date: "2026-03-17T12:00:00.000Z",
        status: "Submitted"
    }
];
const MOCK_COURSE_DOCUMENTS = {
	SEC001: {
		courseOutline: {
			version: 1,
			uploadDate: "2026-01-10",
			hodApproved: true,
			status: "Approved",
			hodComments: "Verified and Approved.",
			fileName: "outline_cs201.pdf",
			fileLink: "https://example.com/docs/outline_cs201.pdf",
		},
		timeline: {
			version: 1,
			uploadDate: "2026-01-12",
			hodApproved: false,
			status: "Rejected",
			hodComments: "Please include the holiday schedule for March.",
			fileName: "timeline_v1.xlsx",
			fileLink: "https://example.com/docs/timeline_v1.xlsx",
		},
	},
	SEC002: {
		courseOutline: {
			version: 2,
			uploadDate: "2026-02-03",
			hodApproved: false,
			status: "Pending",
			hodComments: "",
			fileName: "outline_cs401.pdf",
			fileLink: "https://example.com/docs/outline_cs401.pdf",
		},
		assessmentPlan: {
			version: 1,
			uploadDate: "2026-02-05",
			hodApproved: true,
			status: "Approved",
			hodComments: "Alignment looks good.",
			fileName: "assess_plan.docx",
			fileLink: "https://example.com/docs/assess_plan.docx",
		},
	},
};

// Schedule & Meetings, Session Planning
const MOCK_COURSE_SCHEDULE = [
    {
        id: "SEC001",
        courseName: "Data Structures",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
		courseCodes: ["CS301", "IT301"],
        courseType: "Theory",
        status: "Ongoing",
        schedule: [
            {
                day: "Monday",
                startTime: "9:00 AM",
                endTime: "10:00 AM",
                courseCode: "CS301",
                roomNumber: "B204",
                buildingName: "Block B",
                batchSection: "CSE-A",
                branch: "CSE",
                semester: 3,
            },
            {
                day: "Monday",
                startTime: "11:00 AM",
                endTime: "12:00 PM",
                courseCode: "CS301",
                roomNumber: "B205",
                buildingName: "Block B",
                batchSection: "CSE-B",
                branch: "CSE",
                semester: 3,
            },
            {
                day: "Wednesday",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                courseCode: "CS301",
                roomNumber: "A101",
                buildingName: "Block A",
                batchSection: "CSE-C",
                branch: "CSE",
                semester: 3,
            },
            {
                day: "Friday",
                startTime: "9:00 AM",
                endTime: "10:00 AM",
                courseCode: "IT301",
                roomNumber: "C302",
                buildingName: "Block C",
                batchSection: "IT-A",
                branch: "IT",
                semester: 3,
            },
        ],
    },
    {
        id: "SEC002",
        courseName: "Database Management Systems",
        startDate: "2026-01-15",
        endDate: "2026-06-20",
		courseCodes: ["CS505", "IT505"],
        courseType: "Theory",
        status: "Ongoing",
        schedule: [
            {
                day: "Tuesday",
                startTime: "12:00 PM",
                endTime: "1:00 PM",
                courseCode: "CS505",
                roomNumber: "C101",
                buildingName: "Block C",
                batchSection: "CSE-B",
                branch: "CSE",
                semester: 5,
            },
            {
                day: "Thursday",
                startTime: "2:00 PM",
                endTime: "3:00 PM",
                courseCode: "IT505",
                roomNumber: "D205",
                buildingName: "Block D",
                batchSection: "IT-A",
                branch: "IT",
                semester: 5,
            },
            {
                day: "Thursday",
                startTime: "4:00 PM",
                endTime: "5:00 PM",
                courseCode: "IT505",
                roomNumber: "D206",
                buildingName: "Block D",
                batchSection: "IT-B",
                branch: "IT",
                semester: 5,
            },
        ],
    },
    {
        id: "SEC003",
        courseName: "Operating Systems Lab",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
		courseCodes: ["CS502L"],
        courseType: "Lab",
        status: "Ongoing",
        schedule: [
            {
                day: "Monday",
                startTime: "8:00 AM",
                endTime: "10:00 AM",
                courseCode: "CS502L",
                roomNumber: "Lab 1",
                buildingName: "Lab Block",
                batchSection: "CSE-A",
                branch: "CSE",
                semester: 5,
            },
            {
                day: "Monday",
                startTime: "10:00 AM",
                endTime: "12:00 PM",
                courseCode: "CS502L",
                roomNumber: "Lab 2",
                buildingName: "Lab Block",
                batchSection: "CSE-B",
                branch: "CSE",
                semester: 5,
            },
            {
                day: "Friday",
                startTime: "2:00 PM",
                endTime: "4:00 PM",
                courseCode: "CS502L",
                roomNumber: "Lab 3",
                buildingName: "Lab Block",
                batchSection: "CSE-C",
                branch: "CSE",
                semester: 5,
            },
        ],
    },
    {
        id: "SEC004",
        courseName: "Software Engineering",
        startDate: "2026-01-20",
        endDate: "2026-06-15",
		courseCodes: ["CS701"],
        courseType: "Seminar",
        status: "Ongoing",
        schedule: [
            {
                day: "Wednesday",
                startTime: "9:00 AM",
                endTime: "10:30 AM",
                courseCode: "CS701",
                roomNumber: "SEM-02",
                buildingName: "Admin Block",
                batchSection: "CSE-A",
                branch: "CSE",
                semester: 7,
            },
            {
                day: "Friday",
                startTime: "10:30 AM",
                endTime: "12:00 PM",
                courseCode: "CS701",
                roomNumber: "SEM-01",
                buildingName: "Admin Block",
                batchSection: "ECE-A",
                branch: "ECE",
                semester: 7,
            },
        ],
    },
    {
        id: "SEC005",
        courseName: "Engineering Mathematics",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
		courseCodes: ["CS301", "IT301", "EC301"],
        courseType: "Theory",
        status: "Ongoing",
        schedule: [
            {
                day: "Monday",
                startTime: "8:00 AM",
                endTime: "9:00 AM",
                courseCode: "CS301",
                roomNumber: "LH-01",
                buildingName: "Lecture Hall",
                batchSection: "CSE-A+B",
                branch: "CSE",
                semester: 3,
            },
            {
                day: "Monday",
                startTime: "3:00 PM",
                endTime: "4:00 PM",
                courseCode: "CS301",
                roomNumber: "LH-02",
                buildingName: "Lecture Hall",
                batchSection: "ECE-A",
                branch: "ECE",
                semester: 3,
            },
            {
                day: "Tuesday",
                startTime: "9:00 AM",
                endTime: "10:00 AM",
                courseCode: "IT301",
                roomNumber: "LH-02",
                buildingName: "Lecture Hall",
                batchSection: "IT-A+B",
                branch: "IT",
                semester: 3,
            },
            {
                day: "Thursday",
                startTime: "11:00 AM",
                endTime: "12:00 PM",
                courseCode: "EC301",
                roomNumber: "LH-01",
                buildingName: "Lecture Hall",
                batchSection: "ECE-B",
                branch: "ECE",
                semester: 3,
            },
        ],
    },
    {
        id: "SEC006",
        courseName: "Digital Circuits",
        startDate: "2026-01-15",
        endDate: "2026-06-20",
		courseCodes: ["EC501"],
        courseType: "Theory",
        status: "Ongoing",
        schedule: [
            {
                day: "Monday",
                startTime: "1:00 PM",
                endTime: "2:00 PM",
                courseCode: "EC501",
                roomNumber: "E104",
                buildingName: "ECE Block",
                batchSection: "ECE-B",
                branch: "ECE",
                semester: 5,
            },
            {
                day: "Wednesday",
                startTime: "3:00 PM",
                endTime: "4:00 PM",
                courseCode: "EC501",
                roomNumber: "E201",
                buildingName: "ECE Block",
                batchSection: "ECE-A",
                branch: "ECE",
                semester: 5,
            },
            {
                day: "Wednesday",
                startTime: "4:00 PM",
                endTime: "5:00 PM",
                courseCode: "EC501",
                roomNumber: "E202",
                buildingName: "ECE Block",
                batchSection: "ECE-C",
                branch: "ECE",
                semester: 5,
            },
            {
                day: "Friday",
                startTime: "2:00 PM",
                endTime: "3:00 PM",
                courseCode: "EC501",
                roomNumber: "B102",
                buildingName: "Block B",
                batchSection: "ECE-D",
                branch: "ECE",
                semester: 5,
            },
        ],
    },
    {
        id: "SEC007",
        courseName: "Introduction to Programming",
        startDate: "2025-07-01",
        endDate: "2025-12-15",
		courseCodes: ["CS101", ],
        courseType: "Theory",
        status: "Completed",
        schedule: [
            {
                day: "Monday",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                courseCode: "CS101",
                roomNumber: "A201",
                buildingName: "Block A",
                batchSection: "CSE-A",
                branch: "CSE",
                semester: 1,
            },
            {
                day: "Thursday",
                startTime: "2:00 PM",
                endTime: "3:00 PM",
                courseCode: "CS101",
                roomNumber: "A202",
                buildingName: "Block A",
                batchSection: "CSE-B",
                branch: "CSE",
                semester: 1,
            },
        ],
    },
];

// Library
const MOCK_LIBRARY_DATA = {
	// Administrative contact information for support
	admins: [
		{
			name: "Librarian",
			email: "library@university.edu",
			phone: "+91 99999 77777",
		},
	],
	// Books currently in the user's possession
	borrowed: [
		{
			id: "BOR001",
			bookTitle: "Introduction to Algorithms",
			author: "Cormen, Leiserson, Rivest & Stein",
			isbn: "978-0-262-03384-8",
			category: "Computer Science",
			borrowedDate: "2026-03-01",
			dueDate: "2026-03-30",
			physicalCopyPickedUp: true,
		},
		{
			id: "BOR002",
			bookTitle: "Clean Code",
			author: "Robert C. Martin",
			isbn: "978-0-13-235088-4",
			category: "Software Engineering",
			borrowedDate: "2026-02-16",
			dueDate: "2026-03-16",
			physicalCopyPickedUp: true,
		},
	],

	// Status of pending, approved, or rejected book requests and extensions
	requests: [
		{
			id: "REQ001",
			bookTitle: "Design Patterns",
			author: "Gang of Four",
			isbn: "978-0-201-63361-0",
			category: "Software Engineering",
			status: "pending",
			requestDate: "2026-02-19",
			durationDays: 30,
			dueDate: null,
		},
		{
			id: "REQ002",
			bookTitle: "The Pragmatic Programmer",
			author: "David Thomas & Andrew Hunt",
			isbn: "978-0-13-595705-9",
			category: "Software Engineering",
			status: "approved",
			requestDate: "2026-03-10",
			approvedDate: "2026-03-11",
			durationDays: 30,
			dueDate: "2026-04-11",
			physicalCopyPickedUp: false,
		},
		{
			id: "REQ003",
			bookTitle: "Operating System Concepts",
			author: "Silberschatz, Galvin & Gagne",
			isbn: "978-1-119-32091-3",
			category: "Computer Science",
			status: "rejected",
			requestDate: "2026-01-28",
			durationDays: 30,
			dueDate: null,
			rejectionReason:
				"All copies are reserved for the semester. Please wait until a copy is available.",
		},
		{
			id: "EXT001",
			bookTitle: "Clean Code",
			author: "Robert C. Martin",
			isbn: "978-0-13-235088-4",
			category: "Software Engineering",
			status: "extension-pending",
			requestDate: "2026-03-15",
			originalBorrowedId: "BOR001",
			additionalDays: 15,
			durationDays: 15,
			dueDate: "2026-04-20",
		},
	],

	// Full library inventory for search and request features
	inventory: [
		{
			id: "BOOK001",
			title: "Computer Networks",
			author: "Andrew S. Tanenbaum",
			isbn: "978-0-13-212695-3",
			category: "Networking",
			availableCopies: 3,
			totalCopies: 5,
		},
		{
			id: "BOOK002",
			title: "Database System Concepts",
			author: "Silberschatz, Korth & Sudarshan",
			isbn: "978-0-07-802215-9",
			category: "Databases",
			availableCopies: 1,
			totalCopies: 4,
		},
		{
			id: "BOOK003",
			title: "Artificial Intelligence: A Modern Approach",
			author: "Stuart Russell & Peter Norvig",
			isbn: "978-0-13-468259-3",
			category: "Artificial Intelligence",
			availableCopies: 2,
			totalCopies: 3,
		},
		{
			id: "BOOK004",
			title: "Structure and Interpretation of Computer Programs",
			author: "Abelson & Sussman",
			isbn: "978-0-26-251087-5",
			category: "Programming Languages",
			availableCopies: 0,
			totalCopies: 2,
		},
		{
			id: "BOOK005",
			title: "Compilers: Principles, Techniques & Tools",
			author: "Aho, Lam, Sethi & Ullman",
			isbn: "978-0-32-148681-3",
			category: "Compilers",
			availableCopies: 4,
			totalCopies: 4,
		},
		{
			id: "BOOK006",
			title: "Software Engineering",
			author: "Ian Sommerville",
			isbn: "978-0-13-394303-0",
			category: "Software Engineering",
			availableCopies: 2,
			totalCopies: 6,
		},
	],
};

// Maintenance Requests
const MOCK_MAINTENANCE_DATA = {
    /**
     * Administrative oversight personnel.
     */
    admins: [
        {
            id: "adm_001",
            name: "Estate Manager",
            role: "University Infrastructure",
            email: "estate.office@university.edu",
            phone: "+91 99999 88888",
            jurisdiction: ["university"]
        },
        {
            id: "adm_002",
            name: "Residential Warden",
            role: "Accommodation Oversight",
            email: "housing.warden@university.edu",
            phone: "+91 99999 77777",
            jurisdiction: ["accommodation"]
        }
    ],

    /**
     * Master registry of technicians. 
     * Requests reference these by 'id'.
     */
    technicians: [
        { id: "tech_01", name: "Rajesh Kumar", specialty: "Electrical", phone: "+91 98765 43210" },
        { id: "tech_02", name: "Suresh Raina", specialty: "Plumbing", phone: "+91 98765 43211" },
        { id: "tech_03", name: "Amit Singh", specialty: "HVAC", phone: "+91 98765 43212" },
        { id: "tech_04", name: "Vikram Rathore", specialty: "Carpentry", phone: "+91 98765 43213" },
    ],

    issueTypes: [
        { key: "Structural", label: "Structural", components: ["Ceiling / Roof", "Wall / Partition", "Floor / Tiles", "Door / Lock", "Window / Glass", "Staircase / Railing", "Other Structural"] },
        { key: "Electrical", label: "Electrical", components: ["Power Outlet / Socket", "Light Fixture / Bulb", "Circuit Breaker", "Wiring / Cabling", "UPS / Power Backup", "Other Electrical"] },
        { key: "Plumbing", label: "Plumbing", components: ["Tap / Faucet", "Toilet / Flush", "Sink / Basin", "Drain / Sewage", "Pipe Leak", "Water Heater", "Other Plumbing"] },
        { key: "HVAC", label: "HVAC / Ventilation", components: ["Air Conditioner (AC)", "Ceiling Fan", "Exhaust Fan", "Ventilation Duct", "Thermostat / Controls", "Other HVAC"] },
        { key: "Furniture", label: "Furniture", components: ["Chair / Seat", "Desk / Table", "Cabinet / Shelf", "Whiteboard / Board", "Projector Screen", "Other Furniture"] },
        { key: "Hardware", label: "Hardware", components: ["Desktop Computer", "Laptop", "Monitor / Display", "Keyboard / Mouse", "Printer / Scanner", "Lab Equipment", "Networking Equipment (Router / Switch)", "Server / Rack Equipment", "Other Hardware"] },
        { key: "Technical", label: "Technical / Software", components: ["Software Installation / Update", "Software License Issue", "Operating System", "Network / Internet Connectivity", "Audio / Speaker System", "Projector / Display Output", "Smart Board / Interactive Display", "CCTV / Security System", "Other Technical"] },
        { key: "Other", label: "Other", components: ["General Cleanliness", "Pest Control", "Safety Hazard", "Other"] },
    ],

    requests: [
        {
            id: "REQ001",
            category: "university",
            issueType: "Electrical",
            component: "Light Fixture / Bulb",
            location: "Room 301",
            description: "Flickering lights during lecture.",
            priority: "medium",
            status: "pending",
            createdAt: "2026-03-10T10:00:00Z",
            submittedBy: "Professor",
            adminRemarks: "Checking spare bulb inventory.",
            requiresAction: false,
            assignedTechnicianId: null, 
        },
        {
            id: "REQ002",
            category: "accommodation",
            issueType: "HVAC",
            component: "Air Conditioner (AC)",
            location: "Hostel Block C - Room 204",
            description: "AC unit is leaking water inside the room.",
            priority: "high",
            status: "inProgress",
            createdAt: "2026-03-12T14:20:00Z",
            submittedBy: "Student",
            adminRemarks: "The technician couldn't spot the leakage. Please contact the technician and explain your issue.",
            requiresAction: true,
            assignedTechnicianId: "tech_03",
        },
        {
            id: "REQ003",
            category: "accommodation",
            issueType: "Plumbing",
            component: "Water Heater",
            location: "Hostel Block C - Room 204",
            description: "Geyser is not heating water.",
            priority: "high",
            status: "solved",
            createdAt: "2026-03-11T07:30:00Z",
            submittedBy: "Student",
            adminRemarks: "Heating element replaced.",
            requiresAction: false,
            assignedTechnicianId: "tech_02",
        },
        {
            id: "REQ004",
            category: "university",
            issueType: "Furniture",
            component: "Chair / Seat",
            location: "Library Second Floor",
            description: "Several swivel chairs have broken wheels.",
            priority: "low",
            status: "viewed",
            createdAt: "2026-03-15T09:00:00Z",
            submittedBy: "Librarian",
            adminRemarks: "Waiting for replacement casters.",
            requiresAction: false,
            assignedTechnicianId: null,
        }
    ]
};

// Asset Requests
const MOCK_ASSETS_LIST = [
	{
		id: "101",
		name: "Seminar Hall A",
		type: "Seminar Hall",
		status: "Available",
		availability: "Open for booking",
	},
	{
		id: "102",
		name: "Meeting Room 1",
		type: "Class Room",
		status: "In Use",
		availability: "Reserved until 4:00 PM",
	},
	{
		id: "103",
		name: "Meeting Room 2",
		type: "Class Room",
		status: "Available",
		availability: "Open for booking",
	},
	{
		id: "L1",
		name: "Computer Lab 1",
		type: "Lab",
		status: "Available",
		availability: "Open for booking",
	},
	{
		id: "L2",
		name: "Physics Lab",
		type: "Lab",
		status: "In Use",
		availability: "Class in progress",
	},
	{
		id: "P1",
		name: "Projector (Sony)",
		type: "Equipment",
		status: "Available",
		availability: "Ready for pickup",
	},
	{
		id: "K1",
		name: "Laptop Kit (10x)",
		type: "Equipment",
		status: "Available",
		availability: "Ready for pickup",
	},
	{
		id: "H101",
		name: "AC Room",
		type: "Accommodation",
		status: "Available",
		availability: "Available for booking",
	},
	{
		id: "H102",
		name: "Non-AC Room",
		type: "Accommodation",
		status: "Available",
		availability: "Available for booking",
	},
];
const MOCK_ASSET_REQUESTS = {
	admins: [
		{
			name: "Admin Office",
			email: "admin@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Lab Coordinator",
			email: "lab-support@university.edu",
			phone: "+91 99999 77777",
		},
	],
	requests: [
		{
			id: "REQ001",
			assetName: "Seminar Hall A",
			course: "Introduction to Computer Science",
			status: "Approved",
			isArchived: true,
			type: "Room",
			reason: "Guest lecture on Quantum Computing by industry expert.",
			postedAt: "2025-12-10T09:00:00Z",
			date: "2025-12-15",
			startTime: "10:00",
			endTime: "12:00",
			approvalTime: "2025-12-11T14:30:00Z",
			adminComments:
				"Please ensure the AV system is powered down after use.",
		},
		{
			id: "REQ002",
			assetName: "Projector (Sony)",
			course: "Data Structures & Algorithms",
			status: "Pending",
			isArchived: false,
			type: "Equipment",
			reason: "Group project presentation for final semester evaluation.",
			postedAt: "2025-12-14T15:45:00Z",
			date: "2025-12-16",
			startTime: "04:00",
			endTime: "06:00",
			approvalTime: null,
			adminComments: null,
		},
		{
			id: "REQ003",
			assetName: "Computer Lab 1",
			course: "Database Systems",
			status: "Resubmitted",
			isArchived: true,
			type: "Lab",
			reason: "Rescheduling practice session to December 17th as requested.",
			postedAt: "2025-12-15T11:20:00Z",
			date: "2025-12-17",
			startTime: "08:00",
			endTime: "10:00",
			approvalTime: null,
			adminComments: null,
			previousVersion: {
				assetName: "Computer Lab 1",
				type: "Lab",
				reason: "Extra practice session for lab finals.",
				postedAt: "2025-12-12T11:20:00Z",
				date: "2025-12-15",
				startTime: "08:00",
				endTime: "10:00",
				adminComments:
					"The lab is undergoing scheduled maintenance during this time slot. Please choose an alternative date or lab.",
			},
		},
		{
			id: "REQ004",
			assetName: "Physics Lab",
			course: "Applied Physics II",
			status: "Rejected",
			isArchived: false,
			type: "Lab",
			reason: "Weekly lab experiment session.",
			postedAt: "2026-03-01T10:00:00Z",
			date: "2026-03-05",
			startTime: "09:00",
			endTime: "11:00",
			approvalTime: null,
			adminComments:
				"Lab is closed for maintenance on March 2nd. Please select a different day.",
		},
		{
			id: "REQ005",
			assetName: "AC Room",
			course: "N/A",
			status: "Pending",
			isArchived: false,
			type: "Accommodation",
			reason: "Late night study accommodation during exams.",
			postedAt: "2026-03-12T10:00:00Z",
			date: "2026-03-20",
			duration: 10,
			approvalTime: null,
			adminComments: null,
		},
	],
};

// Attendance Management
const MOCK_ATTENDANCE_DATA = {
	1: {
		// Introduction to Computer Science
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				department: "Computer Science",
				isYou: true,
			},
			{
				id: 2,
				name: "Alice Johnson",
				rollNumber: "ST21BTECH11002",
				department: "Computer Science",
				isYou: false,
			},
			{
				id: 3,
				name: "Charlie Lee",
				rollNumber: "ST21BTECH11003",
				department: "Computer Science",
				isYou: false,
			},
			{
				id: 4,
				name: "David Kim",
				rollNumber: "ST21BTECH11004",
				department: "Electrical Engineering",
				isYou: false,
			},
			{
				id: 5,
				name: "Eva Green",
				rollNumber: "ST21BTECH11005",
				department: "Electrical Engineering",
				isYou: false,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				department: "Electrical Engineering",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				department: "Mechanical Engineering",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				department: "Mechanical Engineering",
				isYou: false,
			},
			{
				id: 9,
				name: "Ian Turner",
				rollNumber: "ST21BTECH11009",
				department: "Mechanical Engineering",
				isYou: false,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				department: "Computer Science",
				isYou: false,
			},
		],
		logs: {
			"2026-02-12": [1, 2, 4],
			"2026-02-13": [1, 3, 4, 5],
			"2026-02-14": [1, 2, 3, 4, 5],
		},
		finalizedDates: [],
	},
	2: {
		// Data Structures & Algorithms
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				isYou: false,
			},
		],
		logs: {
			"2026-02-10": [1, 6],
			"2026-02-12": [1, 6, 7, 8],
		},
		finalizedDates: [],
	},
	3: {
		// Calculus I
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				isYou: false,
			},
			{
				id: 12,
				name: "Lisa Chen",
				rollNumber: "ST21BTECH11012",
				isYou: false,
			},
			{
				id: 13,
				name: "Mike Davis",
				rollNumber: "ST21BTECH11013",
				isYou: false,
			},
			{
				id: 14,
				name: "Nina Patel",
				rollNumber: "ST21BTECH11014",
				isYou: false,
			},
		],
		logs: {
			"2026-02-11": [1, 10, 12, 13, 14],
		},
		finalizedDates: [],
	},
	4: {
		// Database Systems
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 16,
				name: "Priya Sharma",
				rollNumber: "ST21BTECH11016",
				isYou: false,
			},
			{
				id: 17,
				name: "Quinn Lee",
				rollNumber: "ST21BTECH11017",
				isYou: false,
			},
			{
				id: 18,
				name: "Rachel Kim",
				rollNumber: "ST21BTECH11018",
				isYou: false,
			},
		],
		logs: {
			"2026-02-12": [1, 17, 18],
		},
		finalizedDates: [],
	},
};
const MOCK_PROFESSOR_LOGS = [
	{
		id: "LOG_001",
		date: "2026-01-28",
		checkIn: "08:45 AM",
		checkOut: "04:30 PM",
		location: "Block A - Entrance",
		totalHours: "7h 45m",
	},
	{
		id: "LOG_002",
		date: "2026-01-29",
		checkIn: "09:00 AM",
		checkOut: "05:15 PM",
		location: "Block A - Entrance",
		totalHours: "8h 15m",
	},
	{
		id: "LOG_003",
		date: "2026-01-30",
		checkIn: "08:30 AM",
		checkOut: "04:00 PM",
		location: "Block B - Main",
		totalHours: "7h 30m",
	},
	{
		id: "LOG_004",
		date: "2026-01-31",
		checkIn: "09:15 AM",
		checkOut: "06:00 PM",
		location: "Admin Block",
		totalHours: "8h 45m",
	},
	{
		id: "LOG_005",
		date: "2026-02-12",
		checkIn: "08:50 AM",
		checkOut: "04:50 PM",
		location: "Block A - Entrance",
		totalHours: "8h 00m",
	},
	{
		id: "LOG_006",
		date: "2026-02-13",
		checkIn: "08:55 AM",
		checkOut: "05:00 PM",
		location: "Block A - Entrance",
		totalHours: "8h 05m",
	},
	{
		id: "LOG_007",
		date: "2026-02-14",
		checkIn: "09:10 AM",
		checkOut: "04:30 PM",
		location: "Science Lab",
		totalHours: "7h 20m",
	},
	{
		id: "LOG_008",
		date: "2026-02-15",
		checkIn: "08:30 AM",
		checkOut: "05:30 PM",
		location: "Block B - Main",
		totalHours: "9h 00m",
	},
	{
		id: "LOG_009",
		date: "2026-02-16",
		checkIn: "08:45 AM",
		checkOut: "04:15 PM",
		location: "Block A - Entrance",
		totalHours: "7h 30m",
	},
	{
		id: "LOG_010",
		date: "2026-02-17",
		checkIn: "09:00 AM",
		checkOut: "05:00 PM",
		location: "Admin Block",
		totalHours: "8h 00m",
	},
];

// Finance Management
const MOCK_EXPENSES = {
	financeAdmins: [
		{
			name: "Finance Office",
			email: "finance-claims@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Accounts Payable",
			email: "accounts@university.edu",
			phone: "+91 99999 66666",
		},
	],
	expenses: [
		{
			id: "EXP001",
			title: "Office Stationery",
			amount_spent: 200.0,
			status: "Reimbursed",
			isArchived: true,
			date: "2026-01-20",
			category: "Supplies",
			description:
				"Purchase of highlighters, notebooks, and printer ink for the faculty office.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: "2026-01-22T10:30:00Z",
			adminComments:
				"Receipts verified. Reimbursed via standard payroll cycle.",
		},
		{
			id: "EXP002",
			title: "Lab Equipment Repair",
			amount_spent: 800.0,
			status: "Pending",
			isArchived: false,
			date: "2026-02-05",
			category: "Maintenance",
			description:
				"Emergency repair for the centrifuge in Lab 4 following a motor failure.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments: "",
		},
		{
			id: "EXP003",
			title: "Conference Registration",
			amount_spent: 350.0,
			status: "Rejected",
			isArchived: false,
			date: "2026-02-10",
			category: "Professional Development",
			description: "Registration fee for the AI Research Conference.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments:
				"Invalid receipt format. Please upload the official PDF confirmation instead of a screenshot.",
		},
	],
};
const MOCK_ADVANCES = {
	advanceAdmins: [
		{
			name: "Finance Office",
			email: "finance-claims@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Treasury Department",
			email: "treasury@university.edu",
			phone: "+91 99999 44444",
		},
	],
	advances: [
		{
			id: "ADV001",
			title: "Research Trip to Delhi",
			amount_requested: 5000.0,
			status: "Approved",
			isArchived: true,
			date: "2026-01-15",
			category: "Travel",
			description:
				"Advance for flight tickets and local conveyance for the upcoming National Science Symposium.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: "2026-01-16T11:20:00Z",
			adminComments:
				"Approved based on department travel budget. Please submit actual bills within 7 days of return.",
		},
		{
			id: "ADV002",
			title: "Consumables for Chemistry Lab",
			amount_requested: 1200.0,
			status: "Pending",
			isArchived: false,
			date: "2026-02-18",
			category: "Lab Supplies",
			description:
				"Urgent purchase of reagents and glass tubes required for ongoing semester projects.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments: "",
		},
		{
			id: "ADV003",
			title: "Guest Lecturer Honorarium",
			amount_requested: 2500.0,
			status: "Rejected",
			isArchived: false,
			date: "2026-02-10",
			category: "Events",
			description:
				"Advance payment for guest speaker Dr. Khanna for the departmental seminar.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments:
				"Advance honorarium payments are not permitted under the current policy. Please process as an expense reimbursement after the event.",
		},
		{
			id: "ADV004",
			title: "Workshop Supplies",
			amount_requested: 1500.0,
			status: "Resubmitted",
			isArchived: false,
			date: "2026-02-25",
			category: "Events",
			description:
				"Purchase of workshop kits and printed materials for the coding bootcamp.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments: "",
			previousVersion: {
				title: "Workshop Catering",
				amount_requested: 3000.0,
				date: "2026-02-20",
				description:
					"Advance for snacks and lunch for workshop attendees.",
				proof_doc_link: "https://drive.google.com/file/...",
				proof_doc_file: null,
				adminComments:
					"Advance for catering exceeds the per-head limit. Please revise the budget or request reimbursement after the event.",
			},
		},
	],
};

// Exam Duties
const MOCK_EXAM_DATA = [
	{
		id: "EX001",
		courseName: "Introduction to Computer Science",
		courseCode: "CS 101",
		type: "Final Exam",
		startTime: "2026-03-25T04:00:00Z",
		endTime: "2026-03-25T07:00:00Z",
		hall: "Main Auditorium",
		reportingTime: "2026-03-25T03:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX002",
		courseName: "Data Structures & Algorithms",
		courseCode: "CS 202",
		type: "Midterm",
		startTime: "2026-03-23T07:00:00Z",
		endTime: "2026-03-23T10:00:00Z",
		hall: "Exam Hall B",
		reportingTime: "2026-03-23T06:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX003",
		courseName: "Operating Systems",
		courseCode: "CS 301",
		type: "Practical",
		startTime: "2026-03-26T09:00:00Z",
		endTime: "2026-03-26T12:00:00Z",
		hall: "Lab 4",
		reportingTime: "2026-03-26T08:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX004",
		courseName: "Database Management Systems",
		courseCode: "CS 205",
		type: "Midterm",
		startTime: "2026-03-23T13:00:00Z",
		endTime: "2026-03-23T16:00:00Z",
		hall: "Seminar Room A",
		reportingTime: "2026-03-23T12:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX005",
		courseName: "Artificial Intelligence",
		courseCode: "CS 404",
		type: "Final Exam",
		startTime: "2026-03-28T05:00:00Z",
		endTime: "2026-03-28T08:00:00Z",
		hall: "Main Auditorium",
		reportingTime: "2026-03-28T04:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX006",
		courseName: "Quantum Physics",
		courseCode: "PH 401",
		type: "Final Exam",
		startTime: "2026-03-30T09:00:00Z",
		endTime: "2026-03-30T12:00:00Z",
		hall: "Physics Lab 1",
		reportingTime: "2026-03-30T08:30:00Z",
		status: "REJECTION_REVIEW",
		isCheckedIn: false,
		rejectionReason: "Medical emergency - doctor appointment",
		rejectionApproval: null,
	},
	{
		id: "EX007",
		courseName: "Ethics in Technology",
		courseCode: "CS 505",
		type: "Midterm",
		startTime: "2026-03-31T14:00:00Z",
		endTime: "2026-03-31T16:00:00Z",
		hall: "Seminar Room B",
		reportingTime: "2026-03-31T13:30:00Z",
		status: "REJECTION_REVOKED",
		isCheckedIn: false,
		rejectionReason: "Conflicting lecture schedule",
		rejectionApproval: {
			exam_department: {
				status: "REVOKED",
				remark: "Schedule conflict resolved.",
			},
			hod: {
				status: "REVOKED",
				remark: "Confirmed: Attend as per original allocation.",
			},
		},
	},
	{
		id: "EX008",
		courseName: "Advanced Algorithms",
		courseCode: "CS 601",
		type: "Final Exam",
		startTime: "2026-04-02T09:00:00Z",
		endTime: "2026-04-02T12:00:00Z",
		hall: "Hall C",
		reportingTime: "2026-04-02T08:30:00Z",
		status: "REJECTION_APPROVED",
		isCheckedIn: false,
		rejectionReason: "Family emergency",
		rejectionApproval: {
			exam_department: {
				status: "APPROVED",
				remark: "Documents verified.",
			},
			hod: { status: "APPROVED", remark: "Duty exemption granted." },
		},
	},
];

// Leave Application
const MOCK_LEAVE_APPLICATIONS = {
	// Management contacts split into HoD and HR
	managementContacts: [
		{
			name: "Dr. Jane Doe (HoD)",
			email: "jane.smith@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Mr. John Smith (HR)",
			email: "hr@university.edu",
			phone: "+91 99999 77777",
		},
	],
	faculties: [
		{ id: "F001", name: "Dr. Sarah Williams" },
		{ id: "F002", name: "Dr. Robert Chen" },
		{ id: "F003", name: "Dr. Michael Brown" },
		{ id: "F004", name: "Prof. Alan Turing" },
		{ id: "F005", name: "Dr. Grace Hopper" },
	],
	applications: [
		{
			id: "LV001",
			leaveType: "Sick Leave",
			fromDate: "2026-02-19T12:00:00Z",
			toDate: "2026-02-21T12:00:00Z",
			courseName: "Introduction to Programming",
			roomNumber: "LH-101",
			timings: {
				startTime: "09:00",
				endTime: "10:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			reason: "Severe viral fever and flu symptoms",
			replacementFaculty: "Dr. Sarah Williams",
			substitutionStatus: "Accepted",
			status: "Approved",
			isArchived: true,
			appliedAt: "2026-02-15T10:00:00Z",
			// Individual status tracking for HoD and HR
			leaveApproval: {
				HoD: { status: "Approved", remark: "Get well soon!" },
				HR: { status: "Approved", remark: "Documents verified." },
			},
			supporting_doc_link: "https://university.edu/docs/LV001_cert.pdf",
			supporting_doc_file: null,
		},
		{
			id: "LV002",
			leaveType: "Academic Leave",
			fromDate: "2026-03-15T12:00:00Z",
			toDate: "2026-03-17T12:00:00Z",
			courseName: "Machine Learning (B.Tech)",
			roomNumber: "LAB-202",
			timings: {
				startTime: "11:00",
				endTime: "12:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			reason: "Presenting paper at International Conference on AI",
			replacementFaculty: "Dr. Robert Chen",
			substitutionStatus: "Pending",
			status: "Pending",
			isArchived: false,
			appliedAt: "2026-02-18T14:30:00Z",
			leaveApproval: {
				HoD: { status: "Pending", remark: null },
				HR: { status: "Pending", remark: null },
			},
			supporting_doc_link: "https://university.edu/docs/LV002_invite.pdf",
			supporting_doc_file: null,
		},
		{
			id: "LV003",
			leaveType: "Casual Leave",
			fromDate: "2026-04-10T12:00:00Z",
			toDate: "2026-04-11T12:00:00Z",
			courseName: "Introduction to Computer Science",
			roomNumber: "LAB-105",
			timings: {
				startTime: "14:00",
				endTime: "16:00",
			},
			note: "Please ask the students to continue with the 5th program.",
			reason: "Personal family function",
			replacementFaculty: "Dr. Michael Brown",
			substitutionStatus: "Pending",
			status: "Rejected",
			isArchived: false,
			appliedAt: "2026-02-10T09:00:00Z",
			leaveApproval: {
				HoD: {
					status: "Rejected",
					remark: "Casual leave cannot be approved during examination period.",
				},
				HR: {
					status: "Rejected",
					remark: "Please consider changing the date of leave.",
				},
			},
			supporting_doc_link: null,
			supporting_doc_file: null,
		},
		{
			id: "LV004",
			leaveType: "Academic Leave",
			fromDate: "2026-03-20T09:00:00Z",
			toDate: "2026-03-20T09:00:00Z",
			courseName: "Software Engineering",
			roomNumber: "LH-304",
			timings: {
				startTime: "10:00",
				endTime: "11:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			reason: "Attending the Board of Studies meeting.",
			replacementFaculty: "Dr. Grace Hopper",
			substitutionStatus: "Pending",
			status: "Resubmitted",
			isArchived: false,
			appliedAt: "2026-03-02T11:00:00Z",
			leaveApproval: {
				HoD: { status: "Pending", remark: null },
				HR: { status: "Pending", remark: null },
			},
			supporting_doc_link: "https://university.edu/docs/LV004_agenda.pdf",
			supporting_doc_file: null,
			previousVersion: {
				leaveType: "Academic Leave",
				fromDate: "2026-03-18T09:00:00Z",
				toDate: "2026-03-18T09:00:00Z",
				reason: "Attending the Board of Studies meeting.",
				appliedAt: "2026-02-28T10:00:00Z",
				replacementFaculty: "Dr. Grace Hopper",
				leaveApproval: {
					HoD: {
						status: "Rejected",
						remark: "The department has a guest lecture scheduled for the 18th.",
					},
					HR: { status: "Pending", remark: null },
				},
			},
		},
	],
	substitutionRequests: [
		{
			id: "SUB001",
			requesterName: "Dr. Robert Chen",
			leaveType: "Casual Leave",
			fromDate: "2026-04-15T08:00:00Z",
			toDate: "2026-04-15T08:00:00Z",
			course: "Data Structures & Algorithms (CS201)",
			roomNumber: "Lab-201",
			timings: {
				startTime: "13:00",
				endTime: "14:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			status: "Pending",
			requestedAt: "2026-03-04T09:30:00Z",
		},
		{
			id: "SUB002",
			requesterName: "Prof. Alan Turing",
			leaveType: "Academic Leave",
			fromDate: "2026-04-12T10:00:00Z",
			toDate: "2026-04-14T17:00:00Z",
			course: "Advanced Theory of Computation (CS402)",
			roomNumber: "LH-402",
			timings: {
				startTime: "10:00",
				endTime: "12:00",
			},
			note: "Please help them with the revision of 3rd module.",
			status: "Accepted",
			requestedAt: "2026-03-01T14:00:00Z",
		},
	],
};

// Payroll
const MOCK_PAYROLL = {
	history: [
		{
			id: "PAY-JAN-26",
			month: "January 2026",
			amount: 73000,
			status: "Paid",
			paidAt: "2026-02-01T04:00:00Z",
			breakdown: {
				attendance: {
					present: 22,
					absent: 0,
				},
				basic: 40000,
				hra: 20000,
				bonuses: 5000,
				allowances: 15000,
				deductions: {
					tax: 4500,
					pf: 1800,
					insurance: 700,
					absence: 0,
				},
				netPay: 73000,
			},
		},
		{
			id: "PAY-DEC-25",
			month: "December 2025",
			amount: 71200,
			status: "Paid",
			paidAt: "2026-01-01T04:00:00Z",
			breakdown: {
				attendance: {
					present: 20,
					absent: 2,
				},
				basic: 38200,
				hra: 20000,
				bonuses: 5000,
				allowances: 15000,
				deductions: {
					tax: 4500,
					pf: 1800,
					insurance: 700,
					absence: 1800,
				},
				netPay: 71200,
			},
		},
		{
			id: "PAY-NOV-25",
			month: "November 2025",
			amount: 75500,
			status: "Paid",
			paidAt: "2025-12-01T04:00:00Z",
			breakdown: {
				attendance: {
					present: 21,
					absent: 0,
				},
				basic: 42000,
				hra: 20000,
				bonuses: 7000,
				allowances: 14000,
				deductions: {
					tax: 4800,
					pf: 2000,
					insurance: 700,
					absence: 0,
				},
				netPay: 75500,
			},
		},
	],
	currentBreakdown: {
		attendance: {
			present: 18,
			absent: 1,
		},
		basic: 40000,
		hra: 20000,
		bonuses: 5000,
		allowances: 15000,
		deductions: {
			tax: 4500,
			pf: 1800,
			insurance: 700,
			absence: 900,
		},
		netPay: 72100,
	},
};

// Bulletins
const MOCK_BULLETINS = [
	{
		id: 1,
		title: "Campus-wide Network Maintenance",
		content:
			"The university network will be down for scheduled maintenance this Sunday from 2 AM to 6 AM. This affects both Wi-Fi and Ethernet connections in all hostel blocks.",
		level: "institution",
		priority: "High",
		author: "IT Department",
		createdAt: "2026-02-20T10:00:00Z",
		attachments: [
			{ name: "maintenance_schedule.pdf", url: "#", size: "1.2MB" },
		],
	},
	{
		id: 2,
		title: "New Research Grant Opportunities",
		content:
			"The Computer Science department has announced three new research grants for senior students focusing on AI and Sustainability. Application deadline is March 15th.",
		level: "department",
		department: "Computer Science",
		priority: "Normal",
		author: "Dr. Alice Smith",
		createdAt: "2026-02-19T14:30:00Z",
		attachments: [
			{ name: "grant_guidelines.docx", url: "#", size: "450KB" },
		],
	},
	{
		id: 3,
		title: "Library Extended Hours",
		content:
			"Starting next week, the central library will remain open until midnight to support students preparing for finals.",
		level: "institution",
		priority: "Normal",
		author: "Chief Librarian",
		createdAt: "2026-02-15T08:00:00Z",
		attachments: [],
	},
	{
		id: 4,
		title: "Guest Lecture: Future of Quantum Computing",
		content:
			"The Physics department invites all 3rd and 4th-year students to a guest lecture by Dr. Robert Penner from NASA.",
		level: "department",
		department: "Physics",
		priority: "High",
		author: "HOD Physics",
		createdAt: "2026-02-10T12:00:00Z",
		attachments: [
			{ name: "lecture_invite.pdf", url: "#", size: "2.1MB" },
			{ name: "speaker_bio.txt", url: "#", size: "15KB" },
		],
	},
	{
		id: 5,
		title: "Emergency Fire Drill",
		content:
			"A mandatory fire drill will take place tomorrow at 11:30 AM. Please evacuate the building immediately when the alarm sounds.",
		level: "institution",
		priority: "Urgent",
		author: "Campus Safety",
		createdAt: "2026-02-21T11:00:00Z",
		attachments: [{ name: "evacuation_map.jpg", url: "#", size: "3.5MB" }],
	},
	{
		id: 6,
		title: "Workshop: UI/UX Trends 2026",
		content:
			"Join us for a hands-on workshop on modern design systems and prototyping using Figma's newest features.",
		level: "department",
		department: "Information Technology",
		priority: "Normal",
		author: "IT Club",
		createdAt: "2026-02-18T09:15:00Z",
		attachments: [{ name: "workshop_agenda.pdf", url: "#", size: "500KB" }],
	},
];

// Research & Publications
const MOCK_RESEARCH_PROJECTS = [
	{
		id: "RES-001",
		title: "AI-Driven Climate Modeling",
		professorName: "Dr. Jane Smith",
		collaborators: ["Dr. Robert Chen", "Sarah Jenkins"],
		abstract:
			"This project focuses on downscaling global climate models using GANs to provide actionable data for urban planning in coastal regions.",
		status: "Open",
		category: "Computer Science",
		keywords: ["GANs", "Climate Change", "Spatial Downscaling"],
		fundingDetails: "NSF Grant #4452 - $50,000",
		collaborationType: "In-person",
		collaborationInstructions:
			"Weekly syncs in Room 402; must be comfortable with hybrid schedules.",
		link: "https://linkedin.com/in/janesmith-example",
		isOwner: true,
		isMember: true,
		isStarred: true,
		starsCount: 124,
		createdAt: "2026-02-18T09:00:00Z",
		currentMemberCount: 3,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "ML Engineer",
				description:
					"Implement and fine-tune GAN architectures for spatial downscaling.",
			},
			{
				id: 2,
				roleName: "Data Analyst",
				description:
					"Process large-scale geospatial NetCDF datasets and visualize climate trends.",
			},
		],
		timeline: [
			{
				id: "evt-1",
				date: "2026-02-15",
				description:
					"Initial GAN architecture finalized and pushed to repository.",
				contributors: ["Dr. Jane Smith", "Sarah Jenkins"],
			},
			{
				id: "evt-2",
				date: "2026-02-24",
				description: "Data collection for coastal regions completed.",
				contributors: ["Dr. Robert Chen"],
			},
		],
		applicants: [
			{
				id: 1,
				roleId: 1,
				name: "John Doe",
				role: "ML Engineer",
				designation: "Student",
				appliedDate: "2026-02-13T10:00:00Z",
				status: "Pending",
				resumeUrl: "/resumes/john_doe.pdf",
				linkedinUrl: "https://linkedin.com/in/johndoe",
				justification:
					"I have a background in atmospheric science and PyTorch.",
			},
			{
				id: 2,
				roleId: 2,
				name: "Jane Doe",
				role: "Data Analyst",
				designation: "Professor",
				appliedDate: "2026-02-08T10:00:00Z",
				status: "Pending",
				resumeUrl: "/resumes/jane_doe.pdf",
				linkedinUrl: "https://linkedin.com/in/janedoe",
				justification:
					"I have a background in atmospheric science and PyTorch.",
			},
			{
				id: 3,
				roleId: 1,
				name: "Alex Rivera",
				role: "ML Engineer",
				designation: "Graduate Student",
				appliedDate: "2026-02-25T14:20:00Z",
				status: "Pending",
				resumeUrl: "/resumes/alex_rivera.pdf",
				linkedinUrl: "https://linkedin.com/in/arivera-ml",
				justification:
					"Specialized in Generative Adversarial Networks during my Master's thesis; eager to apply GANs to environmental datasets.",
			},
			{
				id: 4,
				roleId: 2,
				name: "Samantha Kwok",
				role: "Data Analyst",
				designation: "Student",
				appliedDate: "2026-02-26T09:15:00Z",
				status: "Pending",
				resumeUrl: "/resumes/skwok.pdf",
				linkedinUrl: "https://linkedin.com/in/samkwok-data",
				justification:
					"Experienced with NetCDF4 and xarray libraries in Python. I have previously visualized sea-level rise data for a local non-profit.",
			},
			{
				id: 5,
				roleId: 1,
				name: "Dr. Marcus Thorne",
				role: "ML Engineer",
				designation: "Postdoctoral Researcher",
				appliedDate: "2026-02-27T11:45:00Z",
				status: "Pending",
				resumeUrl: "/resumes/m_thorne.pdf",
				linkedinUrl: "https://linkedin.com/in/marcusthorne-phd",
				justification:
					"My research focuses on high-resolution weather forecasting. I'm looking to collaborate on urban climate resilience projects.",
			},
			{
				id: 6,
				roleId: 2,
				name: "Elena Rodriguez",
				role: "Data Analyst",
				designation: "Student",
				appliedDate: "2026-02-28T16:30:00Z",
				status: "Pending",
				resumeUrl: "/resumes/erodriguez.pdf",
				linkedinUrl: "https://linkedin.com/in/elenarod",
				justification:
					"Strong background in GIS and spatial statistics. I can assist in cleaning and processing the coastal region datasets.",
			},
		],
	},
	{
		id: "RES-002",
		title: "Quantum Cryptography Protocols",
		professorName: "Prof. Alan Turing",
		collaborators: ["Dr. Jane Smith", "Ray Miller"],
		abstract:
			"Evaluating lattice-based and code-based cryptographic primitives against Shor's algorithm simulations.",
		status: "Closed",
		category: "Cybersecurity",
		keywords: ["Quantum", "Lattice-based", "Shor's Algorithm"],
		fundingDetails: "University Internal Funding - $12,000",
		collaborationType: "Remote",
		collaborationInstructions:
			"Communication via Slack and GitHub. Bi-weekly video calls required.",
		link: "https://linkedin.com/in/alanturing-example",
		isOwner: false,
		isMember: true,
		isStarred: false,
		starsCount: 89,
		createdAt: "2025-12-01T14:20:00Z",
		currentMemberCount: 3,
		openRolesCount: 0,
		openRoles: [],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-003",
		title: "Swarm Robotics for Disaster Response",
		professorName: "Dr. Elena Rodriguez",
		collaborators: ["Marcus Thorne", "Dr. Sarah Jenkins"],
		abstract:
			"Developing decentralized coordination algorithms for drone swarms to perform autonomous search and rescue in GPS-denied environments.",
		status: "Open",
		category: "Robotics",
		keywords: ["Drones", "Swarm Intelligence", "SLAM"],
		fundingDetails: "DHS Innovation Grant - $85,000",
		collaborationType: "On-site (Lab Required)",
		collaborationInstructions:
			"Must be present in the Robotics Lab for hardware testing on Tuesdays/Thursdays.",
		link: "https://linkedin.com/in/elenarodriguez-example",
		isOwner: false,
		isMember: false,
		isStarred: true,
		starsCount: 210,
		createdAt: "2026-01-10T11:30:00Z",
		currentMemberCount: 4,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Firmware Developer",
				description:
					"Optimize C++ control loops for PX4 flight controllers.",
			},
			{
				id: 2,
				roleName: "Computer Vision Lead",
				description: "Implement real-time SLAM using depth cameras.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-004",
		title: "Blockchain for Medical Data Privacy",
		professorName: "Dr. Robert Chen",
		collaborators: ["John Doe", "Dr. Jane Smith"],
		abstract:
			"Creating a Layer-2 scaling solution for Ethereum to manage HIPAA-compliant patient records without compromising throughput.",
		status: "Open",
		category: "Cybersecurity",
		keywords: ["Blockchain", "HIPAA", "Ethereum", "Layer-2"],
		fundingDetails: "HealthTech Corp Partnership - $30,000",
		collaborationType: "Remote",
		collaborationInstructions:
			"Fully async workflow using Jira and Discord.",
		link: "https://linkedin.com/in/janesmith-example",
		isOwner: false,
		isMember: true,
		isStarred: false,
		starsCount: 45,
		createdAt: "2026-01-15T16:45:00Z",
		currentMemberCount: 3,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Smart Contract Auditor",
				description: "Formal verification of Solidity contracts.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-005",
		title: "Adaptive Edge Computing for Smart Grids",
		professorName: "Dr. Marcus Thorne",
		collaborators: ["Dr. Liu Wei"],
		abstract:
			"Developing reinforcement learning algorithms to optimize energy distribution in localized microgrids using edge devices.",
		status: "Open",
		category: "Electrical Engineering",
		keywords: ["Smart Grid", "Edge Computing", "Reinforcement Learning"],
		fundingDetails: "Department of Energy - $120,000",
		collaborationType: "Hybrid",
		collaborationInstructions:
			"Monthly site visits to the campus substation; bi-weekly Zoom updates.",
		link: "https://linkedin.com/in/marcusthorne-example",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 42,
		createdAt: "2026-02-10T11:00:00Z",
		currentMemberCount: 2,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "RL Researcher",
				description:
					"Develop and test Q-learning models for load balancing.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-006",
		title: "Synthetic Biology for Carbon Sequestration",
		professorName: "Dr. Elizabeth Hopper",
		collaborators: ["Dr. Sarah Jenkins"],
		abstract:
			"Engineering cyanobacteria strains with enhanced carbon fixation pathways for industrial-scale bioreactors.",
		status: "Open",
		category: "Bioengineering",
		keywords: ["Synthetic Biology", "Carbon Capture", "CRISPR"],
		fundingDetails: "Green Earth Foundation - $200,000",
		collaborationType: "On-site (Lab Required)",
		collaborationInstructions:
			"Strict adherence to BSL-2 lab protocols required.",
		link: "https://linkedin.com/in/ehopper-example",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 315,
		createdAt: "2026-01-20T10:00:00Z",
		currentMemberCount: 5,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Lab Technician",
				description:
					"Maintain microbial cultures and perform PCR analysis.",
			},
			{
				id: 2,
				roleName: "Bioinformatics Analyst",
				description:
					"Sequence analysis of modified CRISPR target sites.",
			},
		],
		timeline: [],
		applicants: [],
	},
];
const MOCK_PUBLICATIONS = [
	{
		id: "PUB-001",
		title: "Scalable Neural Networks for Edge Computing",
		professorName: "Dr. Jane Smith",
		coAuthors: ["Kevin Wright", "Dr. Liu Wei"],
		journalDetails: "IEEE Transactions on Computers, Vol 12",
		abstract:
			"We present a novel pruning technique that reduces model size by 40%.",
		doi: "10.1109/TC.2025.123456",
		link: "https://ieeexplore.ieee.org/document/example",
		publishedDate: "2025-11-20",
		createdAt: "2025-10-01T08:00:00Z",
		recordType: "Journal Article",
		status: "Closed",
		category: "Artificial Intelligence",
		keywords: ["Edge AI", "Neural Pruning"],
		collaborationType: "Hybrid",
		collaborationInstructions:
			"In-person drafting sessions with remote peer review cycles.",
		isOwner: true,
		isMember: true,
		isStarred: true,
		starsCount: 312,
		documentUrl: "/docs/pubs/edge_computing_paper.pdf",
		currentMemberCount: 3,
		openRolesCount: 0,
		openRoles: [],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-002",
		title: "Ethical Implications of Autonomous Defense Systems",
		professorName: "Prof. Alan Turing",
		coAuthors: ["Dr. Jane Smith", "Kyle Reese"],
		journalDetails: "International Conference on AI Ethics (ICAE 2026)",
		abstract:
			"An analysis of accountability frameworks in lethal autonomous weapons systems.",
		doi: "10.1016/j.aieth.2026.007",
		link: "https://conference-archive.org/icae/2026",
		publishedDate: "2026-01-15",
		createdAt: "2025-12-12T10:15:00Z",
		recordType: "Conference Paper",
		status: "Open",
		category: "Ethics",
		keywords: ["AI Ethics", "Defense"],
		collaborationType: "Remote",
		collaborationInstructions:
			"Collaborative editing via Google Docs and monthly Zoom brainstorms.",
		isOwner: false,
		isMember: true,
		isStarred: true,
		starsCount: 156,
		documentUrl: "/docs/pubs/ethics_defense_ai.pdf",
		currentMemberCount: 3,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Ethics Consultant",
				description:
					"Review legal frameworks regarding international humanitarian law.",
			},
			{
				id: 2,
				roleName: "Technical Writer",
				description:
					"Format the final manuscript for ICAE 2026 submission guidelines.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-003",
		title: "Neuro-Symbolic Reasoning in Large Language Models",
		professorName: "Dr. Victor Von Neumann",
		coAuthors: ["Dr. Elizabeth Hopper", "Liam Sterling"],
		journalDetails: "Nature Machine Intelligence, Vol 4",
		abstract:
			"Integrating symbolic logic gates into transformer architectures to solve multi-step mathematical reasoning problems.",
		doi: "10.1038/s42256-026-0089",
		link: "https://nature.com/articles/example",
		publishedDate: "2026-02-10",
		createdAt: "2026-01-05T09:00:00Z",
		recordType: "Journal Article",
		status: "Open",
		category: "Artificial Intelligence",
		keywords: ["Neuro-Symbolic", "LLMs", "Logic"],
		collaborationType: "Remote",
		collaborationInstructions:
			"High-security data protocols; use the provided VPN for all shared notebook access.",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 420,
		documentUrl: "/docs/pubs/neuro_symbolic.pdf",
		currentMemberCount: 2,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Peer Reviewer",
				description:
					"Verify proofs and reproducibility of the algorithms.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-004",
		title: "Analyzing Social Media Echo Chambers in Local Elections",
		professorName: "Dr. Jane Smith",
		coAuthors: ["Sarah Jenkins", "Dr. Alan Turing"],
		journalDetails: "Journal of Computational Social Science",
		abstract:
			"A graph-theory approach to identifying polarization patterns in municipal election discourse on decentralized social platforms.",
		doi: "10.1007/s42001-026-0152",
		link: "https://springer.com/journal/example",
		publishedDate: "2026-03-01",
		createdAt: "2026-02-01T13:00:00Z",
		recordType: "Conference Paper",
		status: "Open",
		category: "Data Science",
		keywords: ["Graph Theory", "Social Analytics", "NLP"],
		collaborationType: "In-person",
		collaborationInstructions:
			"Meet at the Social Analytics Lab every Wednesday at 2 PM.",
		isOwner: true,
		isMember: true,
		isStarred: false,
		starsCount: 67,
		documentUrl: "/docs/pubs/echo_chambers_study.pdf",
		currentMemberCount: 4,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Graphic Designer",
				description:
					"Design high-resolution network visualizations for the final manuscript.",
			},
			{
				id: 2,
				roleName: "Translator",
				description:
					"Translate abstract and executive summary into Spanish and French.",
			},
		],
		timeline: [],
		applicants: [
			{
				id: 3,
				roleId: 1,
				name: "Alice Cooper",
				role: "Graphic Designer",
				designation: "Student",
				appliedDate: "2026-02-20T14:30:00Z",
				status: "Pending",
				resumeUrl: "/resumes/alice_c.pdf",
				linkedinUrl: "https://linkedin.com/in/alicecooper",
				justification: "Expert in D3.js and Gephi visualizations.",
			},
		],
	},
	{
		id: "PUB-005",
		title: "Lattice-Based Signature Schemes for Post-Quantum IoT",
		professorName: "Dr. Victor Von Neumann",
		coAuthors: ["Ray Miller", "Dr. Alan Turing"],
		journalDetails: "Journal of Cryptology, Vol 29",
		abstract:
			"A study on reducing the computational overhead of Dilithium-based signatures for resource-constrained devices.",
		doi: "10.1007/s00145-026-0982",
		link: "https://springer.com/journal/cryptology/example",
		publishedDate: "2026-02-28",
		createdAt: "2026-01-15T09:00:00Z",
		recordType: "Journal Article",
		status: "Open",
		category: "Cybersecurity",
		keywords: ["Post-Quantum", "IoT", "Lattice Cryptography"],
		collaborationType: "Remote",
		collaborationInstructions:
			"Collaboration via Overleaf and private Git repository.",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 88,
		documentUrl: "/docs/pubs/post_quantum_iot.pdf",
		currentMemberCount: 3,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Lead Copyeditor",
				description:
					"Ensure mathematical notation consistency across the final proof.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-006",
		title: "Human-Robot Interaction in Pediatric Care",
		professorName: "Dr. Elena Rodriguez",
		coAuthors: ["Alice Cooper"],
		journalDetails: "ACM Transactions on Human-Robot Interaction",
		abstract:
			"Measuring the psychological impact of social robots on stress levels in pediatric hospital wards.",
		doi: "10.1145/3610921",
		link: "https://dl.acm.org/doi/example",
		publishedDate: "2026-03-10",
		createdAt: "2026-02-05T14:00:00Z",
		recordType: "Conference Paper",
		status: "Open",
		category: "Robotics",
		keywords: ["HRI", "Pediatrics", "Social Robotics"],
		collaborationType: "Hybrid",
		collaborationInstructions:
			"Weekly meetings at the Children's Health Center for data review.",
		isOwner: false,
		isMember: false,
		isStarred: true,
		starsCount: 204,
		documentUrl: "/docs/pubs/hri_pediatrics.pdf",
		currentMemberCount: 2,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Statistical Consultant",
				description:
					"Perform ANOVA and regression analysis on patient recovery data.",
			},
		],
		timeline: [],
		applicants: [],
	},
];
const MOCK_USERS = [
	/* Professors: Faculty members leading research projects and publications */
	{
		id: "PROF-001",
		name: "Dr. Jane Smith",
		isYou: true,
		tag: "Professor",
		department: "Computer Science",
		email: "jane.smith@university.edu",
		linkedinUrl: "https://linkedin.com/in/janesmith-example",
		avatar: "/avatars/jane-smith.jpg",
		bio: "Specializing in AI-driven climate solutions and neural network pruning.",
		skills: ["PyTorch", "Climate Modeling", "Neural Architecture Search"],
		office: "Gates Hall 402",
		publications: 42,
		joinedDate: "2018-08-15",
	},
	{
		id: "PROF-002",
		name: "Prof. Alan Turing",
		isYou: false,
		tag: "Professor",
		department: "Cybersecurity",
		email: "a.turing@university.edu",
		linkedinUrl: "https://linkedin.com/in/alanturing-example",
		avatar: "/avatars/alan-turing.jpg",
		bio: "Focusing on quantum-resistant cryptography and AI ethics.",
		skills: ["Cryptography", "Complexity Theory", "Formal Methods"],
		office: "Enigma Suite 001",
		publications: 128,
		joinedDate: "2015-01-10",
	},
	{
		id: "PROF-003",
		name: "Dr. Robert Chen",
		isYou: false,
		tag: "Professor",
		department: "Computer Science / Blockchain",
		email: "r.chen@university.edu",
		avatar: "/avatars/robert-chen.jpg",
		bio: "Expert in decentralized systems and HIPAA-compliant data management.",
		skills: ["Solidity", "Distributed Systems", "Data Privacy"],
		office: "Tech Plaza 210",
		publications: 35,
		joinedDate: "2020-03-22",
	},
	{
		id: "PROF-004",
		name: "Dr. Elena Rodriguez",
		isYou: false,
		tag: "Professor",
		department: "Robotics",
		email: "e.rodriguez@university.edu",
		avatar: "/avatars/elena-rod.jpg",
		bio: "Lead researcher for the Swarm Intelligence and Disaster Response lab.",
		skills: ["ROS", "Control Systems", "Path Planning"],
		office: "Robotics Wing B-12",
		publications: 56,
		joinedDate: "2017-11-05",
	},

	/* Students: Researchers and applicants within the platform */
	{
		id: "STU-001",
		name: "John Doe",
		isYou: false,
		tag: "Student",
		department: "Data Science",
		email: "john.doe@student.edu",
		linkedinUrl: "https://linkedin.com/in/johndoe",
		resumeUrl: "/resumes/john_doe.pdf",
		bio: "Graduate student with a focus on atmospheric science and PyTorch.",
		skills: ["Python", "SQL", "Pandas", "Scikit-Learn"],
		education: "MS in Data Science",
		gpa: 3.9,
		activeApplications: 2,
	},
	{
		id: "STU-002",
		name: "Sarah Jenkins",
		isYou: false,
		tag: "Student",
		department: "Artificial Intelligence",
		email: "s.jenkins@student.edu",
		avatar: "/avatars/sarah-j.jpg",
		bio: "PhD candidate specializing in GANs and spatial downscaling techniques.",
		skills: ["TensorFlow", "Computer Vision", "Keras"],
		education: "PhD in Artificial Intelligence",
		gpa: 4.0,
		activeApplications: 1,
	},
	{
		id: "STU-003",
		name: "Alice Cooper",
		isYou: false,
		tag: "Student",
		department: "Digital Arts / UI",
		email: "a.cooper@student.edu",
		linkedinUrl: "https://linkedin.com/in/alicecooper",
		resumeUrl: "/resumes/alice_c.pdf",
		bio: "Expert in D3.js and large-scale graph visualizations.",
		skills: ["React", "D3.js", "Figma", "TypeScript"],
		education: "BS in Digital Arts",
		gpa: 3.8,
		activeApplications: 3,
	},
	{
		id: "STU-004",
		name: "Ray Miller",
		isYou: false,
		tag: "Student",
		department: "Mathematics",
		email: "r.miller@student.edu",
		bio: "Undergraduate researcher focused on lattice-based cryptographic primitives.",
		skills: ["Abstract Algebra", "Number Theory", "C++"],
		education: "BS in Mathematics",
		gpa: 3.95,
		activeApplications: 0,
	},
];
const MOCK_USER_RESEARCH_APPLICATIONS = [
	{
		id: "APP-101",
		researchId: "RES-002",
		title: "Quantum Cryptography Protocols",
		professorName: "Prof. Alan Turing",
		role: "Security Researcher", // User applied for this specific role
		status: "Accepted",
		appliedDate: "2026-02-15T10:00:00Z",
		approvalDate: "2026-02-18T09:30:00Z",
		professorNotes: "Glad to have you as a part of our team!",
		submissionDetails: {
			justification:
				"I am interested in collaborating on lattice-based signatures.",
			resumeUrl: "/resumes/jane_smith_cv.pdf",
			linkedinUrl: "https://linkedin.com/in/janesmith-example",
		},
		meetingDetails: null,
	},
	{
		id: "APP-102",
		researchId: "RES-003",
		title: "CRISPR-Cas9 Gene Silencing in Wheat",
		professorName: "Dr. Rosalind Franklin",
		role: "Lab Technician", // User applied for this specific role
		status: "Meeting Scheduled",
		appliedDate: "2026-01-10T14:30:00Z",
		approvalDate: null,
		submissionDetails: {
			justification:
				"I have extensive experience in molecular sequencing.",
			resumeUrl: "/resumes/user_cv_final.pdf",
			linkedinUrl: "https://linkedin.com/in/currentuser",
		},
		meetingDetails: {
			date: "2026-02-25T09:00:00Z",
			mode: "Offline",
			location: "Biotech Building, Room 402",
			notes: "Please bring a copy of your recent lab certifications.",
		},
	},
	{
		id: "APP-103",
		researchId: "RES-005",
		title: "Adaptive Edge Computing for Smart Grids",
		professorName: "Dr. Marcus Thorne",
		role: "RL Researcher",
		status: "Rejected",
		appliedDate: "2026-02-20T11:00:00Z",
		approvalDate: null,
		professorNotes:
			"While your background is impressive, we are looking for candidates with more direct experience in Q-learning architectures.",
		submissionDetails: {
			justification:
				"I am eager to apply my reinforcement learning knowledge to sustainable energy solutions.",
			resumeUrl: "/resumes/user_cv_v2.pdf",
			linkedinUrl: "https://linkedin.com/in/currentuser",
		},
		meetingDetails: null,
	},
	
];
const MOCK_STUDENT_TIMETABLE = [
	{ id: "cls-1",  courseCode: "CS301",  courseName: "Data Structures & Algorithms", courseType: "Theory", professor: "Dr. Anjali Verma",  day: "Monday",    startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-2",  courseCode: "CS302",  courseName: "Operating Systems",             courseType: "Theory", professor: "Prof. Karan Mehta", day: "Monday",    startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-105", buildingName: "Block B", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-3",  courseCode: "MA301",  courseName: "Discrete Mathematics",          courseType: "Theory", professor: "Dr. Sunita Rao",    day: "Monday",    startTime: "02:00 PM", endTime: "03:00 PM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-4",  courseCode: "CS303",  courseName: "Database Management Systems",   courseType: "Theory", professor: "Dr. Priya Nair",    day: "Tuesday",   startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-301", buildingName: "Block C", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-5",  courseCode: "CS301L", courseName: "DSA Lab",                       courseType: "Lab",    professor: "Dr. Anjali Verma",  day: "Tuesday",   startTime: "02:00 PM", endTime: "04:00 PM", roomNumber: "CL-102", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-6",  courseCode: "CS302",  courseName: "Operating Systems",             courseType: "Theory", professor: "Prof. Karan Mehta", day: "Tuesday",   startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-105", buildingName: "Block B", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-7",  courseCode: "MA301",  courseName: "Discrete Mathematics",          courseType: "Theory", professor: "Dr. Sunita Rao",    day: "Wednesday", startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-8",  courseCode: "CS302",  courseName: "Operating Systems",             courseType: "Theory", professor: "Prof. Karan Mehta", day: "Wednesday", startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-105", buildingName: "Block B", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-9",  courseCode: "CS303L", courseName: "DBMS Lab",                      courseType: "Lab",    professor: "Dr. Priya Nair",    day: "Wednesday", startTime: "02:00 PM", endTime: "04:00 PM", roomNumber: "CL-201", buildingName: "Block C", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-10", courseCode: "CS301",  courseName: "Data Structures & Algorithms",  courseType: "Theory", professor: "Dr. Anjali Verma",  day: "Thursday",  startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-11", courseCode: "CS303",  courseName: "Database Management Systems",   courseType: "Theory", professor: "Dr. Priya Nair",    day: "Thursday",  startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-301", buildingName: "Block C", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-12", courseCode: "MA301",  courseName: "Discrete Mathematics",          courseType: "Theory", professor: "Dr. Sunita Rao",    day: "Friday",    startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-13", courseCode: "CS303",  courseName: "Database Management Systems",   courseType: "Theory", professor: "Dr. Priya Nair",    day: "Friday",    startTime: "12:00 PM", endTime: "01:00 PM", roomNumber: "LH-301", buildingName: "Block C", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-14", courseCode: "CS302L", courseName: "OS Lab",                        courseType: "Lab",    professor: "Prof. Karan Mehta", day: "Friday",    startTime: "02:00 PM", endTime: "04:00 PM", roomNumber: "CL-103", buildingName: "Block B", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-15", courseCode: "CS302",  courseName: "Operating Systems",             courseType: "Theory", professor: "Prof. Karan Mehta", day: "Saturday",  startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-105", buildingName: "Block B", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-16", courseCode: "CS301",  courseName: "Data Structures & Algorithms",  courseType: "Theory", professor: "Dr. Anjali Verma",  day: "Saturday",  startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-17", courseCode: "CS304",  courseName: "Computer Networks",             courseType: "Theory", professor: "Dr. Ramesh Iyer",   day: "Sunday",    startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-202", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-18", courseCode: "CS304L", courseName: "Networks Lab",                  courseType: "Lab",    professor: "Dr. Ramesh Iyer",   day: "Sunday",    startTime: "11:30 AM", endTime: "01:00 PM", roomNumber: "CL-103", buildingName: "Block B", semester: 3, batchSection: "CSE-A" },
	{ id: "cls-19", courseCode: "MA301",  courseName: "Discrete Mathematics",          courseType: "Theory", professor: "Dr. Sunita Rao",    day: "Sunday",    startTime: "02:00 PM", endTime: "03:00 PM", roomNumber: "LH-204", buildingName: "Block A", semester: 3, batchSection: "CSE-A" },
];

const MOCK_STUDENT_TASKS = [
	{ id: "task-1", type: "study",    title: "Revise DSA Trees chapter",  time: "05:00 PM", duration: 60, done: false, date: new Date().toISOString().split("T")[0] },
	{ id: "task-2", type: "reminder", title: "Submit OS assignment",       time: "08:00 PM", duration: 30, done: false, date: new Date().toISOString().split("T")[0] },
];
//Calender events for students
const today_cal = new Date();
const cal_ymd = (d) => d.toISOString().split("T")[0];
const cal_offset = (n) => { const d = new Date(today_cal); d.setDate(d.getDate() + n); return cal_ymd(d); };

const MOCK_CALENDAR_EVENTS = [
    { id: "CL001", title: "Data Structures",          type: "class",    date: cal_offset(0),  time: "09:00", notes: "Lecture – Graphs & BFS" },
    { id: "CL002", title: "Operating Systems",        type: "class",    date: cal_offset(1),  time: "10:30", notes: "" },
    { id: "CL003", title: "Database Management",      type: "class",    date: cal_offset(2),  time: "14:00", notes: "Lab Session – SQL Queries" },
    { id: "CL004", title: "Computer Networks",        type: "class",    date: cal_offset(3),  time: "09:00", notes: "" },
    { id: "CL005", title: "Software Engineering",     type: "class",    date: cal_offset(5),  time: "11:00", notes: "" },
    { id: "EX001", title: "Mid Semester – DSA",       type: "exam",     date: cal_offset(7),  time: "09:00", notes: "Hall: Block B, Room 201. Syllabus: Units 1–4" },
    { id: "EX002", title: "Mid Semester – OS",        type: "exam",     date: cal_offset(10), time: "14:00", notes: "Hall: Block C, Room 102" },
    { id: "EX003", title: "End Semester – DBMS",      type: "exam",     date: cal_offset(30), time: "09:30", notes: "" },
    { id: "HL001", title: "Holi – Holiday",           type: "holiday",  date: cal_offset(4),  time: "",      notes: "University closed" },
    { id: "HL002", title: "Dr. Ambedkar Jayanti",     type: "holiday",  date: cal_offset(14), time: "",      notes: "University closed" },
    { id: "MT001", title: "Mentor Meeting",           type: "meeting",  date: cal_offset(2),  time: "15:00", notes: "Career guidance session" },
    { id: "MT002", title: "Placement Cell Seminar",   type: "meeting",  date: cal_offset(6),  time: "16:00", notes: "Resume building workshop" },
    { id: "PE001", title: "Study Group – DSA Prep",   type: "personal", date: cal_offset(5),  time: "19:00", notes: "Library, 2nd Floor" },
    { id: "PE002", title: "Assignment Deadline – SE", type: "personal", date: cal_offset(8),  time: "23:59", notes: "Submit on portal" },
];
const MOCK_PLACEMENT_JOBS = [
	{
		id: "JOB001",
		role: "Software Development Engineer",
		company: "Google",
		type: "Full Time",
		location: "Hyderabad, India",
		package: "₹40 LPA",
		stipend: null,
		deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
		description:
			"Join Google's core engineering team to design and build large-scale systems that serve billions of users. You'll work on meaningful products that impact people's everyday lives.",
		requirements: ["Data Structures", "Algorithms", "System Design", "Java or C++", "Problem Solving"],
		openings: 5,
		rounds: "3 (Online Test → Technical → HR)",
		cgpa: "7.5+",
		branches: ["CSE", "IT", "ECE"],
		additionalInfo: "Candidates must clear all three rounds. Offer letters will be issued within 2 weeks of final round.",
	},
	{
		id: "JOB002",
		role: "Software Engineering Intern",
		company: "Microsoft",
		type: "Internship",
		location: "Bangalore, India",
		package: null,
		stipend: "₹80,000/month",
		deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
		description:
			"A 6-month internship opportunity within Microsoft's Azure team. You'll ship real features used by enterprise customers worldwide and receive mentorship from senior engineers.",
		requirements: ["React or Angular", "Node.js", "Cloud Basics", "REST APIs"],
		openings: 8,
		rounds: "2 (Coding Test → Technical Interview)",
		cgpa: "7.0+",
		duration: "6 months",
		branches: ["CSE", "IT", "IS"],
		additionalInfo: null,
	},
	{
		id: "JOB003",
		role: "Data Analyst",
		company: "Amazon",
		type: "Full Time",
		location: "Chennai, India",
		package: "₹22 LPA",
		stipend: null,
		deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
		description:
			"Work with Amazon's supply chain data team to uncover insights that improve delivery efficiency and customer experience at scale.",
		requirements: ["SQL", "Python", "Tableau", "Statistics", "Excel"],
		openings: 3,
		rounds: "2 (Written Test → Case Study Interview)",
		cgpa: "7.0+",
		branches: ["CSE", "IT", "Mathematics", "ECE"],
		additionalInfo: null,
	},
	{
		id: "JOB004",
		role: "ML Engineer Intern",
		company: "Flipkart",
		type: "Internship",
		location: "Bangalore, India",
		package: null,
		stipend: "₹60,000/month",
		deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
		description:
			"Work alongside Flipkart's AI/ML team on recommendation systems and demand-forecasting models that power India's largest e-commerce platform.",
		requirements: ["Python", "TensorFlow or PyTorch", "Machine Learning", "Linear Algebra"],
		openings: 4,
		rounds: "3 (MCQ Test → ML Round → HR)",
		cgpa: "8.0+",
		duration: "4 months",
		branches: ["CSE", "IT", "Data Science"],
		additionalInfo: "Pre-placement offer (PPO) available based on performance.",
	},
	{
		id: "JOB005",
		role: "Backend Engineer",
		company: "Swiggy",
		type: "Full Time",
		location: "Bangalore, India",
		package: "₹28 LPA",
		stipend: null,
		deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
		description:
			"Build the distributed systems that handle millions of food orders daily. You'll own critical backend services and work in a fast-paced, high-ownership culture.",
		requirements: ["Go or Java", "Microservices", "Kafka", "PostgreSQL", "Docker"],
		openings: 6,
		rounds: "3 (DSA Round → System Design → HR)",
		cgpa: "7.0+",
		branches: ["CSE", "IT"],
		additionalInfo: null,
	},
	{
		id: "JOB006",
		role: "Product Analyst Intern",
		company: "Razorpay",
		type: "Internship",
		location: "Bangalore, India",
		package: null,
		stipend: "₹50,000/month",
		deadline: new Date(Date.now() + 8 * 86400000).toISOString(),
		description:
			"Collaborate with product managers to analyse user behaviour, define metrics, and drive growth decisions for Razorpay's payments platform.",
		requirements: ["SQL", "Product Thinking", "Excel", "Communication Skills"],
		openings: 2,
		rounds: "2 (Case Study → HR)",
		cgpa: "6.5+",
		duration: "3 months",
		branches: ["CSE", "IT", "IS", "Mathematics"],
		additionalInfo: null,
	},
];

const MOCK_PLACEMENT_APPLICATIONS = [
	{
		id: "APP001",
		jobId: "JOB001",
		role: "Software Development Engineer",
		company: "Google",
		type: "Full Time",
		status: "Shortlisted",
		appliedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
		location: "Hyderabad, India",
		package: "₹40 LPA",
		rounds: "3 (Online Test → Technical → HR)",
		description:
			"Join Google's core engineering team to design and build large-scale systems that serve billions of users.",
		interviewDate: new Date(Date.now() + 4 * 86400000).toISOString(),
		interviewTime: "10:00 AM",
		interviewMode: "Online",
		onlineLink: "https://meet.google.com/abc-defg-hij",
		venue: null,
		guidelines: [
			"Join the meeting 5 minutes before the scheduled time.",
			"Keep your camera and microphone ready.",
			"Have a copy of your resume ready to share.",
		],
		documentsRequired: ["Resume", "Marksheets (All Semesters)", "Government ID Proof"],
		notes: "Review system design concepts — HLD and LLD.",
	},
	{
		id: "APP002",
		jobId: "JOB002",
		role: "Software Engineering Intern",
		company: "Microsoft",
		type: "Internship",
		status: "Applied",
		appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
		location: "Bangalore, India",
		package: null,
		rounds: "2 (Coding Test → Technical Interview)",
		description:
			"A 6-month internship opportunity within Microsoft's Azure team.",
		interviewDate: null,
		interviewTime: null,
		interviewMode: null,
		onlineLink: null,
		venue: null,
		guidelines: [],
		documentsRequired: ["Resume"],
		notes: null,
	},
	{
		id: "APP003",
		jobId: "JOB004",
		role: "ML Engineer Intern",
		company: "Flipkart",
		type: "Internship",
		status: "Rejected",
		appliedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
		location: "Bangalore, India",
		package: null,
		rounds: "3 (MCQ Test → ML Round → HR)",
		description:
			"Work alongside Flipkart's AI/ML team on recommendation systems.",
		interviewDate: null,
		interviewTime: null,
		interviewMode: null,
		onlineLink: null,
		venue: null,
		guidelines: [],
		documentsRequired: [],
		notes: "Revise gradient descent and backpropagation for next time.",
	},
	{
		id: "APP004",
		jobId: "JOB005",
		role: "Backend Engineer",
		company: "Swiggy",
		type: "Full Time",
		status: "Selected",
		appliedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
		location: "Bangalore, India",
		package: "₹28 LPA",
		rounds: "3 (DSA Round → System Design → HR)",
		description:
			"Build the distributed systems that handle millions of food orders daily.",
		interviewDate: null,
		interviewTime: null,
		interviewMode: null,
		onlineLink: null,
		venue: "Swiggy HQ, Bangalore",
		guidelines: [],
		documentsRequired: ["Resume", "Offer Letter Acknowledgement Form"],
		notes: "Offer accepted! Joining date: July 1st.",
	},
];

const MOCK_PLACEMENT_HISTORY = [
	{
		id: "HIST001",
		role: "Software Development Engineer",
		company: "Swiggy",
		type: "Full Time",
		year: "2024",
		package: "₹28 LPA",
		notes: "Cleared all 3 rounds in a single day. The system design round focused on designing a food delivery tracking system.",
	},
	{
		id: "HIST002",
		role: "Frontend Developer Intern",
		company: "Zomato",
		type: "Internship",
		year: "2023",
		package: "₹45,000/month",
		notes: "6-month internship. Worked on the restaurant partner dashboard. Received a PPO but declined.",
	},
	{
		id: "HIST003",
		role: "Data Science Intern",
		company: "CRED",
		type: "Internship",
		year: "2022",
		package: "₹40,000/month",
		notes: null,
	},
];
// Mutable runtime state for placement (mirrors what the API would persist)
let _placementApplications = [...MOCK_PLACEMENT_APPLICATIONS];
let _placementHistory      = [...MOCK_PLACEMENT_HISTORY];
let _placementResumeUrl    = null;
let _placementProjectUrl   = null;
const MOCK_REGISTRAR_DATA = {
    // ── Admin-verified admission document records ──────────────────────────
    // Each entry maps to a REQUIRED_DOCS id in the frontend shared.jsx.
    // Only the admin/registrar can create or update these records.
    adminSubmittedDocs: [
        {
            docId: "rd1",
            status: "Verified",          // "Verified" | "Pending" | "Rejected"
            description: "CBSE 2022 — verified by registrar",
            submittedAt: "2024-08-01T10:00:00Z",
            remarks: null,
        },
        {
            docId: "rd2",
            status: "Verified",
            description: "ISC 2022 — verified by registrar",
            submittedAt: "2024-08-01T10:00:00Z",
            remarks: null,
        },
        {
            docId: "rd3",
            status: "Verified",
            description: "MHT-CET 2022 score card",
            submittedAt: "2024-08-01T10:00:00Z",
            remarks: null,
        },
        {
            docId: "rd8",
            status: "Pending",
            description: "Photocopy received — awaiting verification",
            submittedAt: "2024-08-02T11:00:00Z",
            remarks: "Please submit a clearer photocopy.",
        },
        {
            docId: "rd9",
            status: "Verified",
            description: "6 photographs received",
            submittedAt: "2024-08-01T10:00:00Z",
            remarks: null,
        },
        {
            docId: "rd12",
            status: "Verified",
            description: "Signed undertaking received",
            submittedAt: "2024-08-01T10:00:00Z",
            remarks: null,
        },
    ],
 
    // ── Document requests submitted by the student ─────────────────────────
    documentRequests: [
        {
            id: "DR001",
            type: "Bonafide Certificate",
            purpose: "Bank account opening",
            copies: "1",
            urgency: "Normal (5–7 working days)",
            status: "Ready",             // "Processing" | "Ready" | "Rejected"
            requestedAt: "2026-03-01T10:00:00Z",
            remarks: "Collect from office — Room 101.",
            teacherName: null,
            teacherId: null,
        },
        {
            id: "DR002",
            type: "Official Transcript (Sealed)",
            purpose: "MS Application – University of Toronto",
            copies: "1",
            urgency: "Urgent (2–3 working days)",
            status: "Processing",
            requestedAt: "2026-03-10T14:00:00Z",
            remarks: null,
            teacherName: null,
            teacherId: null,
        },
        {
            id: "DR003",
            type: "Transfer Certificate (TC)",
            purpose: "University transfer",
            copies: "1",
            urgency: "Normal (5–7 working days)",
            status: "Rejected",
            requestedAt: "2026-02-20T09:00:00Z",
            remarks: "NOC from department required. Please reapply.",
            teacherName: null,
            teacherId: null,
        },
        {
            id: "DR004",
            type: "Letter of Recommendation",
            purpose: "MS Application – TU Berlin",
            copies: "1",
            urgency: "Normal (5–7 working days)",
            status: "Processing",
            requestedAt: "2026-03-18T09:30:00Z",
            remarks: null,
            teacherName: "Dr. Anjali Sharma",
            teacherId: "f1",
        },
    ],
};
 
// Mutable runtime state (mirrors what the API would persist between calls)
let _registrarAdminDocs     = [...MOCK_REGISTRAR_DATA.adminSubmittedDocs];
let _registrarDocRequests   = [...MOCK_REGISTRAR_DATA.documentRequests];

// Hostel
const MOCK_HOSTEL_DATA = {
    roomAllotment: {
        block: "Block C",
        roomNumber: "204",
        type: "Double Sharing",
        floorNumber: 2,
        allottedFrom: "2025-08-01",
    },
    userProfile: {
        parentContact:  "+91 98765 00000",
        wardenContact:  "+91 98765 43210",
        wardenEmail:    "warden.blockc@college.edu",
    },
    maintenanceDept: {
        name:    "Campus Maintenance Dept.",
        contact: "+91 98765 11111",
        email:   "maintenance@college.edu",
    },
    antiRaggingDept: {
        name:    "Anti-Ragging Committee",
        contact: "+91 98765 22222",
        email:   "antiragging@college.edu",
    },
    studentAffairs: {
        name:          "Office of Student Affairs",
        officeContact: "+91 98765 33333",
        email:         "studentaffairs@college.edu",
    },
};
// Mentor
const MOCK_MENTOR_DATA = {
    mentor: {
        id: "M001",
        name: "Dr. Robert Chen",
        designation: "Associate Professor",
        department: "Computer Science",
        email: "robert.chen@mahindrauniversity.edu.in",
        phone: "+91 98765 43210",
        officeLocation: "Block A, Room 204",
        officeHours: "Mon/Wed 2:00 PM – 4:00 PM",
        profilePic: null,
    },
    meetings: [
        { id: "MT001", date: "2026-03-20T14:00:00Z", mode: "Offline", location: "Block A, Room 204", status: "Completed", notes: "Discussed semester progress and career goals." },
        { id: "MT002", date: "2026-04-05T15:00:00Z", mode: "Online",  location: "Google Meet", meetLink: "https://meet.google.com/abc-def-ghi", status: "Upcoming", notes: null },
    ],
    feedbackHistory: [
        { id: "FB001", date: "2026-03-20", rating: 5, comment: "Very helpful session. Clear guidance on internship preparation." },
    ],
};

let _mentorMeetingRequests = [];
let _mentorFeedbackHistory = [...MOCK_MENTOR_DATA.feedbackHistory];

// Mutable runtime arrays (mirroring server-side persistence)
let _hostelLeaveRequests       = [];
let _hostelOutingRequests      = [];
let _hostelMaintenanceRequests = [];
let _hostelComplaints          = [];

const MOCK_FINANCE_DATA = {
    fees: [
        {
            id: "F001",
            type: "academic",
            label: "Academic Fee – Semester 2",
            semester: "2025–26 Semester 2",
            total: 85000,
            due: 42500,
            scholarship: 12500,
            status: "Partial",
            dueDate: "15 Apr 2026",
            breakdown: [
                { label: "Tuition Fee",       amount: 70000 },
                { label: "Lab & Library Fee", amount: 8000  },
                { label: "Activity Fee",      amount: 7000  },
                { label: "Merit Scholarship", amount: 12500, type: "deduction" },
            ],
        },
        {
            id: "F002",
            type: "hostel",
            label: "Hostel Fee – Semester 2",
            semester: "2025–26 Semester 2",
            total: 45000,
            due: 45000,
            scholarship: 0,
            status: "Pending",
            dueDate: "01 Apr 2026",
            breakdown: [
                { label: "Room Rent",    amount: 30000 },
                { label: "Mess Charges", amount: 12000 },
                { label: "Maintenance",  amount: 3000  },
            ],
        },
        {
            id: "F003",
            type: "academic",
            label: "Academic Fee – Semester 1",
            semester: "2025–26 Semester 1",
            total: 85000,
            due: 0,
            scholarship: 12500,
            status: "Paid",
            dueDate: null,
            breakdown: [
                { label: "Tuition Fee",       amount: 70000 },
                { label: "Lab & Library Fee", amount: 8000  },
                { label: "Activity Fee",      amount: 7000  },
                { label: "Merit Scholarship", amount: 12500, type: "deduction" },
            ],
        },
        {
            id: "F004",
            type: "transport",
            label: "Transport Fee – Semester 2",
            semester: "2025–26 Semester 2",
            total: 18000,
            due: 18000,
            scholarship: 0,
            status: "Overdue",
            dueDate: "20 Mar 2026",
            breakdown: [
                { label: "Bus Pass",       amount: 15000 },
                { label: "Fuel Surcharge", amount: 3000  },
            ],
        },
    ],
 
    paymentHistory: [
        {
            id: "PH001",
            feeType: "academic",
            label: "Academic Fee – Sem 1 (Part 2)",
            feeHead: "Academic Fee",
            semester: "2025–26 Sem 1",
            date: "12 Aug 2025",
            processedOn: "12 Aug 2025, 11:42 AM",
            mode: "UPI",
            gateway: "HDFC UPI Gateway",
            amount: 42500,
            status: "Paid",
            txnId: "UPI2025081211420001",
            refNo: "REF-ACA-SEM1-P2",
            receiptId: "RC001",
            charges: [
                { label: "Tuition Fee",       amount: 35000 },
                { label: "Lab & Library Fee", amount: 4000  },
                { label: "Activity Fee",      amount: 3500  },
            ],
        },
        {
            id: "PH002",
            feeType: "academic",
            label: "Academic Fee – Sem 1 (Part 1)",
            feeHead: "Academic Fee",
            semester: "2025–26 Sem 1",
            date: "30 Jul 2025",
            processedOn: "30 Jul 2025, 3:15 PM",
            mode: "Net Banking",
            gateway: "SBI Net Banking",
            amount: 30000,
            status: "Paid",
            txnId: "NB2025073015150002",
            refNo: "REF-ACA-SEM1-P1",
            receiptId: "RC002",
            charges: [
                { label: "Tuition Fee",       amount: 28000 },
                { label: "Processing Fee",    amount: 2000  },
            ],
        },
        {
            id: "PH003",
            feeType: "academic",
            label: "Academic Fee – Sem 2 (Part 1)",
            feeHead: "Academic Fee",
            semester: "2025–26 Sem 2",
            date: "10 Jan 2026",
            processedOn: "10 Jan 2026, 10:05 AM",
            mode: "UPI",
            gateway: "GPay / Google Pay",
            amount: 42500,
            status: "Paid",
            txnId: "UPI2026011010050003",
            refNo: "REF-ACA-SEM2-P1",
            receiptId: "RC003",
            charges: [
                { label: "Tuition Fee",       amount: 35000 },
                { label: "Lab & Library Fee", amount: 4000  },
                { label: "Activity Fee",      amount: 3500  },
            ],
        },
        {
            id: "PH004",
            feeType: "hostel",
            label: "Hostel Fee – Sem 1",
            feeHead: "Hostel Fee",
            semester: "2025–26 Sem 1",
            date: "05 Aug 2025",
            processedOn: "05 Aug 2025, 2:30 PM",
            mode: "Card",
            gateway: "Razorpay – HDFC Debit",
            amount: 45000,
            status: "Paid",
            txnId: "CRD2025080514300004",
            refNo: "REF-HST-SEM1",
            receiptId: "RC004",
            charges: [
                { label: "Room Rent",    amount: 30000 },
                { label: "Mess Charges", amount: 12000 },
                { label: "Maintenance",  amount: 3000  },
            ],
        },
        {
            id: "PH005",
            feeType: "transport",
            label: "Transport Fee – Sem 1",
            feeHead: "Transport Fee",
            semester: "2025–26 Sem 1",
            date: "01 Aug 2025",
            processedOn: "01 Aug 2025, 9:00 AM",
            mode: "Offline",
            gateway: "Finance Office Counter",
            amount: 18000,
            status: "Paid",
            txnId: null,
            refNo: "CASH-TRP-SEM1-2025",
            receiptId: "RC005",
            initiatedBy: "Finance Office",
            charges: [
                { label: "Bus Pass",       amount: 15000 },
                { label: "Fuel Surcharge", amount: 3000  },
            ],
        },
        {
            id: "PH006",
            feeType: "academic",
            label: "Exam Fee – Sem 1",
            feeHead: "Exam Fee",
            semester: "2025–26 Sem 1",
            date: "15 Oct 2025",
            processedOn: "15 Oct 2025, 8:55 PM",
            mode: "UPI",
            gateway: "PhonePe",
            amount: 3500,
            status: "Failed",
            txnId: "UPI2025101520550006",
            refNo: null,
            receiptId: null,
            failReason: "Bank server timeout. Amount was debited and will be refunded within 5–7 working days.",
            charges: [],
        },
    ],
 
    receipts: [
        {
            id: "RC001",
            receiptNo: "RCPT-2025-0812-001",
            label: "Academic Fee – Sem 1 (Part 2)",
            date: "12 Aug 2025",
            semester: "2025–26 Sem 1",
            academicYear: "2025–2026",
            mode: "UPI",
            txnId: "UPI2025081211420001",
            refNo: "REF-ACA-SEM1-P2",
            amount: 42500,
            category: "Academic",
            collectedBy: "Finance Office",
            status: "Paid",
            tax: 0,
            note: null,
            breakdown: [
                { label: "Tuition Fee",       amount: 35000 },
                { label: "Lab & Library Fee", amount: 4000  },
                { label: "Activity Fee",      amount: 3500  },
            ],
        },
        {
            id: "RC002",
            receiptNo: "RCPT-2025-0730-002",
            label: "Academic Fee – Sem 1 (Part 1)",
            date: "30 Jul 2025",
            semester: "2025–26 Sem 1",
            academicYear: "2025–2026",
            mode: "Net Banking",
            txnId: "NB2025073015150002",
            refNo: "REF-ACA-SEM1-P1",
            amount: 30000,
            category: "Academic",
            collectedBy: "Finance Office",
            status: "Paid",
            tax: 0,
            note: "First instalment. Balance due by 15 Aug 2025.",
            breakdown: [
                { label: "Tuition Fee",       amount: 28000 },
                { label: "Processing Fee",    amount: 2000  },
            ],
        },
        {
            id: "RC003",
            receiptNo: "RCPT-2026-0110-003",
            label: "Academic Fee – Sem 2 (Part 1)",
            date: "10 Jan 2026",
            semester: "2025–26 Sem 2",
            academicYear: "2025–2026",
            mode: "UPI",
            txnId: "UPI2026011010050003",
            refNo: "REF-ACA-SEM2-P1",
            amount: 42500,
            category: "Academic",
            collectedBy: "Finance Office",
            status: "Paid",
            tax: 0,
            note: null,
            breakdown: [
                { label: "Tuition Fee",       amount: 35000 },
                { label: "Lab & Library Fee", amount: 4000  },
                { label: "Activity Fee",      amount: 3500  },
            ],
        },
        {
            id: "RC004",
            receiptNo: "RCPT-2025-0805-004",
            label: "Hostel Fee – Sem 1",
            date: "05 Aug 2025",
            semester: "2025–26 Sem 1",
            academicYear: "2025–2026",
            mode: "Card",
            txnId: "CRD2025080514300004",
            refNo: "REF-HST-SEM1",
            amount: 45000,
            category: "Hostel",
            collectedBy: "Finance Office",
            status: "Paid",
            tax: 0,
            note: null,
            breakdown: [
                { label: "Room Rent",    amount: 30000 },
                { label: "Mess Charges", amount: 12000 },
                { label: "Maintenance",  amount: 3000  },
            ],
        },
        {
            id: "RC005",
            receiptNo: "RCPT-2025-0801-005",
            label: "Transport Fee – Sem 1",
            date: "01 Aug 2025",
            semester: "2025–26 Sem 1",
            academicYear: "2025–2026",
            mode: "Offline",
            txnId: null,
            refNo: "CASH-TRP-SEM1-2025",
            amount: 18000,
            category: "Transport",
            collectedBy: "Finance Office Counter",
            status: "Paid",
            tax: 0,
            note: "Cash payment received at Finance Counter. Original challan retained by office.",
            breakdown: [
                { label: "Bus Pass",       amount: 15000 },
                { label: "Fuel Surcharge", amount: 3000  },
            ],
        },
    ],
 
    dueReminders: [
        {
            id: "DUE001",
            feeId: "F004",
            label: "Transport Fee – Semester 2 overdue!",
            dueDate: "20 Mar 2026",
            amount: 18000,
            urgency: "high",
        },
        {
            id: "DUE002",
            feeId: "F002",
            label: "Hostel Fee – Semester 2 due soon",
            dueDate: "01 Apr 2026",
            amount: 45000,
            urgency: "high",
        },
        {
            id: "DUE003",
            feeId: "F001",
            label: "Academic Fee – Semester 2 partially due",
            dueDate: "15 Apr 2026",
            amount: 42500,
            urgency: "medium",
        },
    ],
};
 
// Mutable runtime state — mirrors what the real API would persist
let _financeFees        = MOCK_FINANCE_DATA.fees.map((f) => ({ ...f }));
let _financeHistory     = [...MOCK_FINANCE_DATA.paymentHistory];
let _financeReceipts    = [...MOCK_FINANCE_DATA.receipts];
let _financeDueReminders = [...MOCK_FINANCE_DATA.dueReminders];
// Student Attendance
const MOCK_STUDENT_ATTENDANCE = {
    overallStats: {
        totalClasses:    53,
        totalPresent:    46,
        totalAbsent:      5,
        totalLeave:       2,
        overallPercentage: 86.8,
    },
    courses: [
        {
            id: "cohort-001",
            cohort_name: "Full Stack Web Development",
            course_codes: ["CS401", "CS402"],
            professor_name: "Dr. Ananya Sharma",
            stats: { total: 20, present: 17, absent: 2, leave: 1, percentage: 85 },
        },
        {
            id: "cohort-002",
            cohort_name: "Data Structures & Algorithms",
            course_codes: ["CS301"],
            professor_name: "Prof. Rajesh Kumar",
            stats: { total: 18, present: 15, absent: 3, leave: 0, percentage: 83.3 },
        },
        {
            id: "cohort-003",
            cohort_name: "Machine Learning Fundamentals",
            course_codes: ["CS501", "CS502"],
            professor_name: "Dr. Priya Mehta",
            stats: { total: 15, present: 14, absent: 0, leave: 1, percentage: 93.3 },
        },
    ],
};
const MOCK_STUDENT_NOTIFICATIONS = [
	// ── My Courses ────────────────────────────────────────────────────────
	{
		id: "sn-course-001",
		title: "New Assignment Posted",
		message: 'Prof. Anjali Verma posted a new assignment "BST Implementation" in Data Structures & Algorithms. Due in 5 days.',
		type: "COURSE_ASSIGNMENT",
		link: "/c/2/assignments",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),   // 1 hr ago
	},
	{
		id: "sn-course-002",
		title: "Assignment Graded",
		message: 'Your submission for "HTML & CSS Fundamentals" in Introduction to Computer Science has been graded. Check your score.',
		type: "COURSE_GRADE",
		link: "/c/1/assignments",
		createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-course-003",
		title: "New Resource Added",
		message: 'Week 2 lecture notes for "Operating Systems" have been uploaded by Prof. Karan Mehta.',
		type: "COURSE_RESOURCE",
		link: "/my-courses",
		createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
	},
 
	// ── Hostel ────────────────────────────────────────────────────────────
	{
		id: "sn-hostel-001",
		title: "Leave Request Approved",
		message: "Your hostel leave request for 20 Apr – 22 Apr has been approved by the warden.",
		type: "HOSTEL_LEAVE",
		link: "/hostel",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-hostel-002",
		title: "Outing Request Update",
		message: "Your outing request for Sunday evening is pending warden approval.",
		type: "HOSTEL_OUTING",
		link: "/hostel",
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-hostel-003",
		title: "Maintenance Request Update",
		message: "The AC repair request for Block C – Room 204 has been assigned to a technician.",
		type: "HOSTEL_MAINTENANCE",
		link: "/hostel",
		createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
	},
 
	// ── Placement Cell ────────────────────────────────────────────────────
	{
		id: "sn-placement-001",
		title: "Interview Scheduled",
		message: "Congratulations! You have been shortlisted for Google SDE. Interview on " +
			new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
			" at 10:00 AM via Google Meet.",
		type: "PLACEMENT_INTERVIEW",
		link: "/placement",
		createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-placement-002",
		title: "New Job Posted",
		message: "Razorpay is hiring Product Analyst Interns. Deadline in 8 days. Check the Placement Cell for details.",
		type: "PLACEMENT_JOB",
		link: "/placement",
		createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-placement-003",
		title: "Application Status Update",
		message: "Your application for ML Engineer Intern at Flipkart has been reviewed. Login to view the decision.",
		type: "PLACEMENT_STATUS",
		link: "/placement",
		createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
	},
 
	// ── Registrar Office ──────────────────────────────────────────────────
	{
		id: "sn-registrar-001",
		title: "Document Ready for Collection",
		message: 'Your Bonafide Certificate is ready. Collect it from the Registrar\'s Office, Room 101.',
		type: "REGISTRAR_DOCUMENT",
		link: "/registrar",
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
	},
	{
		id: "sn-registrar-002",
		title: "Document Request Rejected",
		message: "Your Transfer Certificate request was rejected. Reason: NOC from department required. Please reapply.",
		type: "REGISTRAR_REJECTED",
		link: "/registrar",
		createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
	},
 
	// ── Examinations ──────────────────────────────────────────────────────
	{
		id: "sn-exam-001",
		title: "Mid-Semester Exam Schedule Released",
		message: "Mid-semester exam schedule for Semester 3 has been released. DSA exam on " +
			new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ".",
		type: "EXAM_SCHEDULE",
		link: "/examinations",
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-exam-002",
		title: "Hall Ticket Available",
		message: "Your hall ticket for the Mid-Semester examinations is now available. Download it from the Examinations portal.",
		type: "EXAM_HALLTICKET",
		link: "/examinations",
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
	},
 
	// ── Mentor ────────────────────────────────────────────────────────────
	{
		id: "sn-mentor-001",
		title: "Mentor Meeting Confirmed",
		message: "Dr. Robert Chen has confirmed your meeting request for 5 Apr at 3:00 PM via Google Meet.",
		type: "MENTOR_MEETING",
		link: "/mentor",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-mentor-002",
		title: "Mentor Feedback Shared",
		message: "Your mentor Dr. Robert Chen has shared feedback on your career plan. Check the Mentor portal.",
		type: "MENTOR_FEEDBACK",
		link: "/mentor",
		createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
	},
 
	// ── Library ───────────────────────────────────────────────────────────
	{
		id: "sn-library-001",
		title: "Book Request Approved",
		message: '"The Pragmatic Programmer" has been approved. Collect your copy from the library counter. Due date: 11 Apr.',
		type: "LIBRARY_REQUEST",
		link: "/library",
		createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-library-002",
		title: "Book Due Soon",
		message: '"Introduction to Algorithms" is due on 30 Mar. Renew or return it before the due date to avoid a fine.',
		type: "LIBRARY_DUE",
		link: "/library",
		createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-library-003",
		title: "Book Request Rejected",
		message: '"Operating System Concepts" request was rejected. All copies are reserved for the semester.',
		type: "LIBRARY_REJECTED",
		link: "/library",
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
	},
 
	// ── Finance ───────────────────────────────────────────────────────────
	{
		id: "sn-finance-001",
		title: "Fee Payment Due",
		message: "Hostel Fee – Semester 2 (₹45,000) is due on 1 Apr 2026. Please complete the payment to avoid late charges.",
		type: "FINANCE_DUE",
		link: "/finance",
		createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-finance-002",
		title: "Payment Overdue",
		message: "Transport Fee – Semester 2 (₹18,000) is overdue since 20 Mar 2026. Please pay immediately.",
		type: "FINANCE_OVERDUE",
		link: "/finance",
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
	},
	{
		id: "sn-finance-003",
		title: "Payment Successful",
		message: "Payment of ₹42,500 for Academic Fee – Semester 2 (Part 1) was successful. Receipt RC003 is now available.",
		type: "FINANCE_PAID",
		link: "/finance",
		createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
	},
 
	// ── Student Attendance ────────────────────────────────────────────────
	{
		id: "sn-attendance-001",
		title: "Low Attendance Warning",
		message: 'Your attendance in "Data Structures & Algorithms" has dropped to 83.3%. Minimum required is 75%. Please attend regularly.',
		type: "ATTENDANCE_WARNING",
		link: "/student-attendance",
		createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-attendance-002",
		title: "Attendance Marked",
		message: "Your attendance for today's Data Structures class (9:00 AM) has been recorded.",
		type: "ATTENDANCE_MARKED",
		link: "/student-attendance",
		createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
	},
 
	// ── Calendar ──────────────────────────────────────────────────────────
	{
		id: "sn-calendar-001",
		title: "Upcoming Exam Reminder",
		message: "Mid-Semester DSA exam is in 7 days. It's on your calendar – make sure you're prepared!",
		type: "CALENDAR_REMINDER",
		link: "/calendar",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-calendar-002",
		title: "Holiday Tomorrow",
		message: "Tomorrow is a holiday – Holi. The university will remain closed. All classes are cancelled.",
		type: "CALENDAR_HOLIDAY",
		link: "/calendar",
		createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
	},
 
	// ── Announcements ─────────────────────────────────────────────────────
	{
		id: "sn-announcement-001",
		title: "New Announcement: Library Extended Hours",
		message: "Starting next week, the central library will remain open until midnight to support students preparing for finals.",
		type: "ANNOUNCEMENT_GENERAL",
		link: "/announcements",
		createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-announcement-002",
		title: "Urgent: Fire Drill Tomorrow",
		message: "A mandatory fire drill will take place tomorrow at 11:30 AM. Evacuate immediately when the alarm sounds.",
		type: "ANNOUNCEMENT_URGENT",
		link: "/announcements",
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-announcement-003",
		title: "Department Announcement: Research Grants",
		message: "CS department has announced 3 new research grants for senior students. Application deadline is 15 Mar.",
		type: "ANNOUNCEMENT_DEPARTMENT",
		link: "/announcements",
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
	},
 
	// ── Research ──────────────────────────────────────────────────────────
	{
		id: "sn-research-001",
		title: "Research Application Accepted",
		message: 'You have been accepted as a Security Researcher in "Quantum Cryptography Protocols" by Prof. Alan Turing.',
		type: "RESEARCH_ACCEPTED",
		link: "/student-research",
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
	},
	{
		id: "sn-research-002",
		title: "Research Interview Scheduled",
		message: 'An interview for "CRISPR-Cas9 Gene Silencing" project is scheduled on 25 Feb at 9:00 AM in Biotech Building, Room 402.',
		type: "RESEARCH_MEETING",
		link: "/student-research",
		createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
	},
	{
		id: "sn-research-003",
		title: "Research Application Rejected",
		message: 'Your application for RL Researcher in "Adaptive Edge Computing for Smart Grids" was not selected. Check the portal for details.',
		type: "RESEARCH_REJECTED",
		link: "/student-research",
		createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
	},
 
	// ── Session & Planner ─────────────────────────────────────────────────
	{
		id: "sn-schedule-001",
		title: "Class Rescheduled",
		message: 'Monday\'s "Computer Networks" class (10:00 AM) has been rescheduled to Wednesday at 2:00 PM in LH-202.',
		type: "SCHEDULE_CHANGE",
		link: "/student-schedule",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-schedule-002",
		title: "Class Cancelled",
		message: 'Today\'s "Discrete Mathematics" class at 2:00 PM has been cancelled by Dr. Sunita Rao.',
		type: "SCHEDULE_CANCELLED",
		link: "/student-schedule",
		createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "sn-schedule-003",
		title: "Task Reminder",
		message: '"Submit OS Assignment" is due tonight at 8:00 PM. You added this reminder in your planner.',
		type: "SCHEDULE_REMINDER",
		link: "/student-schedule",
		createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
	},
];
// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_STUDENT_EXAM_SCHEDULE = [
    { id: "EX001", subject: "Software Engineering",  code: "CS501", date: "2026-04-10", time: "9:00 AM – 12:00 PM",  hall: "Exam Hall A",     room: "A-12", seatNumber: "45", type: "Minor 1" },
    { id: "EX002", subject: "Computer Networks",     code: "CS502", date: "2026-04-12", time: "2:00 PM – 5:00 PM",   hall: "Exam Hall B",     room: "B-08", seatNumber: "22", type: "Minor 1" },
    { id: "EX003", subject: "DBMS",                  code: "CS503", date: "2026-04-14", time: "9:00 AM – 12:00 PM",  hall: "Exam Hall A",     room: "A-07", seatNumber: "31", type: "Minor 1" },
    { id: "EX004", subject: "Software Engineering",  code: "CS501", date: "2026-04-28", time: "9:00 AM – 12:00 PM",  hall: "Exam Hall B",     room: "B-03", seatNumber: "17", type: "Minor 2" },
    { id: "EX005", subject: "Computer Networks",     code: "CS502", date: "2026-04-30", time: "2:00 PM – 5:00 PM",   hall: "Exam Hall A",     room: "A-11", seatNumber: "58", type: "Minor 2" },
    { id: "EX006", subject: "DBMS",                  code: "CS503", date: "2026-05-02", time: "9:00 AM – 12:00 PM",  hall: "Exam Hall B",     room: "B-09", seatNumber: "44", type: "Minor 2" },
    { id: "EX007", subject: "Software Engineering",  code: "CS501", date: "2026-05-20", time: "9:00 AM – 12:00 PM",  hall: "Main Auditorium", room: "M-05", seatNumber: "88", type: "End Sem" },
    { id: "EX008", subject: "Computer Networks",     code: "CS502", date: "2026-05-23", time: "2:00 PM – 5:00 PM",   hall: "Main Auditorium", room: "M-12", seatNumber: "34", type: "End Sem" },
    { id: "EX009", subject: "DBMS",                  code: "CS503", date: "2026-05-26", time: "9:00 AM – 12:00 PM",  hall: "Main Auditorium", room: "M-08", seatNumber: "61", type: "End Sem" },
];

const MOCK_STUDENT_RESULTS = [
    { id: "R001", semester: "Semester 3", subject: "Data Structures",        code: "CS301", grade: "A",  midterm1: 22, midterm2: 21, endTerm: 45, marks: 88, maxMarks: 100, credits: 4, status: "Pass" },
    { id: "R002", semester: "Semester 3", subject: "Mathematics III",        code: "MA301", grade: "B+", midterm1: 19, midterm2: 20, endTerm: 40, marks: 79, maxMarks: 100, credits: 3, status: "Pass" },
    { id: "R003", semester: "Semester 3", subject: "Digital Electronics",    code: "EC301", grade: "B",  midterm1: 17, midterm2: 18, endTerm: 36, marks: 71, maxMarks: 100, credits: 3, status: "Pass" },
    { id: "R004", semester: "Semester 4", subject: "Operating Systems",      code: "CS401", grade: "A+", midterm1: 24, midterm2: 23, endTerm: 48, marks: 95, maxMarks: 100, credits: 4, status: "Pass" },
    { id: "R005", semester: "Semester 4", subject: "Computer Graphics",      code: "CS402", grade: "B",  midterm1: 18, midterm2: 17, endTerm: 37, marks: 72, maxMarks: 100, credits: 3, status: "Pass" },
    { id: "R006", semester: "Semester 4", subject: "Theory of Computation",  code: "CS403", grade: "C+", midterm1: 14, midterm2: 13, endTerm: 31, marks: 58, maxMarks: 100, credits: 4, status: "Pass" },
    { id: "R007", semester: "Semester 4", subject: "Probability & Stats",    code: "MA401", grade: "A",  midterm1: 21, midterm2: 22, endTerm: 41, marks: 84, maxMarks: 100, credits: 3, status: "Pass" },
];

const MOCK_STUDENT_GRADE_HISTORY = [
    {
        semester: "Semester 1",
        sgpa: 8.2,
        cgpa: 8.2,
        totalCredits: 22,
        subjects: [
            { name: "Engineering Mathematics I",  credits: 4, midterm1: 22, midterm2: 21, endTerm: 44, assignments: 90, attendance: 88, grade: "A"  },
            { name: "Engineering Physics",         credits: 4, midterm1: 18, midterm2: 19, endTerm: 38, assignments: 75, attendance: 82, grade: "B+" },
            { name: "Programming Fundamentals",    credits: 4, midterm1: 24, midterm2: 24, endTerm: 47, assignments: 95, attendance: 91, grade: "A+" },
            { name: "Engineering Drawing",         credits: 3, midterm1: 16, midterm2: 17, endTerm: 35, assignments: 68, attendance: 79, grade: "B"  },
            { name: "Communication Skills",        credits: 3, midterm1: 21, midterm2: 22, endTerm: 42, assignments: 85, attendance: 94, grade: "A"  },
            { name: "Workshop Practice",           credits: 2, midterm1: 20, midterm2: 20, endTerm: 40, assignments: 80, attendance: 96, grade: "A"  },
            { name: "Environmental Science",       credits: 2, midterm1: 17, midterm2: 16, endTerm: 37, assignments: 70, attendance: 72, grade: "B"  },
        ],
    },
    {
        semester: "Semester 2",
        sgpa: 8.6,
        cgpa: 8.4,
        totalCredits: 24,
        subjects: [
            { name: "Engineering Mathematics II", credits: 4, midterm1: 22, midterm2: 22, endTerm: 44, assignments: 88, attendance: 85, grade: "A"  },
            { name: "Data Structures",             credits: 4, midterm1: 23, midterm2: 24, endTerm: 45, assignments: 92, attendance: 90, grade: "A+" },
            { name: "Digital Logic Design",        credits: 4, midterm1: 19, midterm2: 20, endTerm: 39, assignments: 78, attendance: 83, grade: "B+" },
            { name: "Object-Oriented Programming", credits: 4, midterm1: 24, midterm2: 25, endTerm: 47, assignments: 96, attendance: 93, grade: "A+" },
            { name: "Discrete Mathematics",        credits: 4, midterm1: 18, midterm2: 19, endTerm: 37, assignments: 74, attendance: 78, grade: "B+" },
            { name: "Technical Writing",           credits: 2, midterm1: 21, midterm2: 20, endTerm: 41, assignments: 82, attendance: 88, grade: "A"  },
            { name: "Sports & Physical Education", credits: 2, midterm1: 25, midterm2: 25, endTerm: 50, assignments: 100, attendance: 98, grade: "A+" },
        ],
    },
    {
        semester: "Semester 3",
        sgpa: 9.1,
        cgpa: 8.8,
        totalCredits: 24,
        subjects: [
            { name: "Data Structures",           credits: 4, midterm1: 22, midterm2: 21, endTerm: 45, assignments: 88, attendance: 85, grade: "A"  },
            { name: "Mathematics III",           credits: 3, midterm1: 19, midterm2: 20, endTerm: 40, assignments: 79, attendance: 80, grade: "B+" },
            { name: "Digital Electronics",       credits: 3, midterm1: 17, midterm2: 18, endTerm: 36, assignments: 71, attendance: 73, grade: "B"  },
            { name: "Computer Organisation",     credits: 4, midterm1: 23, midterm2: 22, endTerm: 46, assignments: 91, attendance: 89, grade: "A"  },
            { name: "Microprocessors",           credits: 4, midterm1: 21, midterm2: 22, endTerm: 42, assignments: 85, attendance: 84, grade: "A"  },
            { name: "Software Lab",              credits: 2, midterm1: 24, midterm2: 24, endTerm: 47, assignments: 95, attendance: 92, grade: "A+" },
            { name: "Communication Networks",    credits: 4, midterm1: 19, midterm2: 18, endTerm: 39, assignments: 76, attendance: 77, grade: "B+" },
        ],
    },
    {
        semester: "Semester 4",
        sgpa: 9.3,
        cgpa: 8.95,
        totalCredits: 26,
        subjects: [
            { name: "Operating Systems",                  credits: 4, midterm1: 24, midterm2: 23, endTerm: 48, assignments: 95, attendance: 92, grade: "A+" },
            { name: "Computer Graphics",                  credits: 3, midterm1: 18, midterm2: 17, endTerm: 37, assignments: 72, attendance: 76, grade: "B"  },
            { name: "Theory of Computation",              credits: 4, midterm1: 14, midterm2: 13, endTerm: 31, assignments: 58, attendance: 69, grade: "C+" },
            { name: "Probability & Statistics",           credits: 3, midterm1: 21, midterm2: 22, endTerm: 41, assignments: 84, attendance: 87, grade: "A"  },
            { name: "Database Management Systems",        credits: 4, midterm1: 23, midterm2: 22, endTerm: 45, assignments: 90, attendance: 91, grade: "A"  },
            { name: "Design & Analysis of Algorithms",    credits: 4, midterm1: 22, midterm2: 22, endTerm: 44, assignments: 88, attendance: 88, grade: "A"  },
            { name: "Mini Project",                       credits: 4, midterm1: 25, midterm2: 25, endTerm: 50, assignments: 100, attendance: 100, grade: "A+" },
        ],
    },
];
// Student Research Mock Data
const MOCK_STUDENT_RESEARCH_AVAILABLE_PROJECTS = [
    {
        id: "proj-1",
        title: "AI-Driven Climate Modeling for South Asian Monsoons",
        description: "Using machine learning to improve seasonal monsoon prediction accuracy using satellite and ground station data.",
        category: "Computer Science",
        status: "open",
        collaborationType: "Research Assistant",
        professorName: "Dr. Ananya Sharma",
        createdAt: "2025-10-01T10:00:00Z",
        starsCount: 14,
        isStarred: false,
        keywords: ["machine learning", "climate", "python", "data science"],
        openRoles: [
            { roleName: "Data Analyst",  description: "Clean and analyze satellite datasets" },
            { roleName: "ML Engineer",   description: "Build and train prediction models" },
        ],
        collaborators: ["Dr. Ananya Sharma", "Prof. Ramesh Iyer"],
        deadline: "2025-12-15T00:00:00Z",
        department: "Computer Science & Engineering",
    },
    {
        id: "proj-2",
        title: "Biodegradable Packaging from Agricultural Waste",
        description: "Developing cost-effective biodegradable packaging materials using sugarcane bagasse and rice husk composites.",
        category: "Materials Science",
        status: "open",
        collaborationType: "Co-Investigator",
        professorName: "Dr. Priya Nair",
        createdAt: "2025-09-15T08:30:00Z",
        starsCount: 9,
        isStarred: false,
        keywords: ["sustainability", "materials", "chemistry", "packaging"],
        openRoles: [
            { roleName: "Lab Assistant", description: "Conduct material strength and decomposition tests" },
        ],
        collaborators: ["Dr. Priya Nair"],
        deadline: "2026-01-10T00:00:00Z",
        department: "Chemical Engineering",
    },
    {
        id: "proj-3",
        title: "Blockchain-Based Academic Credential Verification",
        description: "A decentralized system to issue and verify academic certificates to prevent fraud.",
        category: "Computer Science",
        status: "open",
        collaborationType: "Research Assistant",
        professorName: "Prof. Karan Mehta",
        createdAt: "2025-11-01T09:00:00Z",
        starsCount: 22,
        isStarred: true,
        keywords: ["blockchain", "solidity", "web3", "security"],
        openRoles: [
            { roleName: "Smart Contract Developer", description: "Write and audit Solidity contracts" },
            { roleName: "Frontend Developer",       description: "Build verification portal in React" },
        ],
        collaborators: ["Prof. Karan Mehta", "Dr. Sunita Rao"],
        deadline: "2025-12-30T00:00:00Z",
        department: "Computer Science & Engineering",
    },
];

const MOCK_STUDENT_RESEARCH_MY_PROJECTS = [
    {
        id: "proj-4",
        title: "Real-Time Sign Language Recognition Using MediaPipe",
        description: "Building a browser-based sign language translator using hand landmark detection and a custom gesture classifier.",
        category: "Computer Science",
        status: "in-progress",
        collaborationType: "Research Assistant",
        professorName: "Dr. Anjali Verma",
        createdAt: "2025-08-20T11:00:00Z",
        starsCount: 7,
        isStarred: false,
        keywords: ["mediapipe", "computer vision", "accessibility", "javascript"],
        openRoles: [],
        collaborators: ["Dr. Anjali Verma", "You"],
        deadline: "2026-03-01T00:00:00Z",
        department: "Computer Science & Engineering",
        myRole: "Frontend Developer & ML Integration",
    },
];

const MOCK_STUDENT_RESEARCH_AVAILABLE_PUBLICATIONS = [
    {
        id: "pub-1",
        url: "ai-fairness-bias-2025",
        title: "Bias Mitigation in Large Language Models: A Survey",
        abstract: "A comprehensive review of techniques for detecting and reducing demographic bias in transformer-based language models trained on web-scale corpora.",
        category: "Computer Science",
        status: "published",
        collaborationType: "Co-Author",
        professorName: "Prof. Karan Mehta",
        publishedDate: "2025-07-10T00:00:00Z",
        createdAt: "2025-07-10T00:00:00Z",
        starsCount: 31,
        isStarred: false,
        keywords: ["NLP", "bias", "fairness", "LLM"],
        coAuthors: ["Prof. Karan Mehta", "Dr. Sunita Rao"],
        journal: "IEEE Transactions on Neural Networks",
        doi: "10.1109/TNNLS.2025.0012345",
    },
    {
        id: "pub-2",
        url: "solar-perovskite-efficiency-2025",
        title: "Improving Stability of Perovskite Solar Cells via Interface Engineering",
        abstract: "We demonstrate a 23.4% efficiency perovskite solar cell with improved moisture resistance through novel passivation layer deposition.",
        category: "Materials Science",
        status: "published",
        collaborationType: "Research Assistant",
        professorName: "Dr. Priya Nair",
        publishedDate: "2025-09-05T00:00:00Z",
        createdAt: "2025-09-05T00:00:00Z",
        starsCount: 18,
        isStarred: false,
        keywords: ["solar cells", "perovskite", "thin film", "energy"],
        coAuthors: ["Dr. Priya Nair", "Dr. Vikram Singh"],
        journal: "Nature Energy",
        doi: "10.1038/s41560-025-01234-5",
    },
];

const MOCK_STUDENT_RESEARCH_MY_PUBLICATIONS = [
    {
        id: "pub-3",
        url: "iot-water-quality-2025",
        title: "Low-Cost IoT System for Real-Time Water Quality Monitoring in Rural India",
        abstract: "We present a ₹800 sensor node built on ESP32 that monitors pH, turbidity, and TDS, transmitting data over LoRa to a cloud dashboard.",
        category: "IoT & Embedded Systems",
        status: "under-review",
        collaborationType: "First Author",
        professorName: "Dr. Anjali Verma",
        publishedDate: null,
        createdAt: "2025-10-20T00:00:00Z",
        starsCount: 4,
        isStarred: false,
        keywords: ["IoT", "ESP32", "water quality", "LoRa", "rural"],
        coAuthors: ["You", "Dr. Anjali Verma"],
        journal: "Submitted to IEEE Internet of Things Journal",
        doi: null,
    },
];

const MOCK_STUDENT_RESEARCH_MY_APPLICATIONS = [
    {
        id: "app-1",
        projectId: "proj-1",
        projectTitle: "AI-Driven Climate Modeling for South Asian Monsoons",
        status: "pending",
        appliedAt: "2025-11-10T14:00:00Z",
        isSentApplication: true,
        role: "Data Analyst",
        coverNote: "I have experience with Python and Pandas from my internship at ISRO.",
    },
    {
        id: "app-2",
        projectId: "proj-3",
        projectTitle: "Blockchain-Based Academic Credential Verification",
        status: "accepted",
        appliedAt: "2025-11-02T09:30:00Z",
        isSentApplication: true,
        role: "Frontend Developer",
        coverNote: "I've built two React projects and am familiar with ethers.js.",
    },
];

const MOCK_STUDENT_RESEARCH_ALL_USERS = [
    { id: "u1", fullName: "Dr. Ananya Sharma",  role: "professor", department: "CSE" },
    { id: "u2", fullName: "Dr. Priya Nair",     role: "professor", department: "Chemical Engineering" },
    { id: "u3", fullName: "Prof. Karan Mehta",  role: "professor", department: "CSE" },
    { id: "u4", fullName: "Dr. Anjali Verma",   role: "professor", department: "CSE" },
    { id: "u5", fullName: "Riya Desai",         role: "student",   department: "CSE" },
    { id: "u6", fullName: "Arjun Patel",        role: "student",   department: "Chemical Engineering" },
];

// Mutable runtime state for student research
let _studentResearchAvailableProjects    = MOCK_STUDENT_RESEARCH_AVAILABLE_PROJECTS.map(p => ({ ...p }));
let _studentResearchMyProjects           = MOCK_STUDENT_RESEARCH_MY_PROJECTS.map(p => ({ ...p }));
let _studentResearchAvailablePublications = MOCK_STUDENT_RESEARCH_AVAILABLE_PUBLICATIONS.map(p => ({ ...p }));
let _studentResearchMyPublications       = MOCK_STUDENT_RESEARCH_MY_PUBLICATIONS.map(p => ({ ...p }));
let _studentResearchMyApplications       = MOCK_STUDENT_RESEARCH_MY_APPLICATIONS.map(a => ({ ...a }));

// Mutable runtime state — mirrors what the API would persist
let _revaluationRequests = [];
// Student Profile Mock Data
const MOCK_STUDENT_PROFILE_DATA = {
    // Personal
    fullName: "John Doe",
    dob: "2004-03-15",
    gender: "Male",
    aadhaarNumber: "1234 5678 9012",
    nationality: "Indian",
    religion: "Hindu",
    casteCategory: "General",
    motherTongue: "Hindi",
    physicallyHandicapped: "No",
    // Contact
    mobileNumber: "9876543210",
    alternateMobile: "",
    officialEmail: "22b21a0001@mahindrauniversity.edu.in",
    personalEmail: "john.doe@gmail.com",
    permanentAddress: { line1: "12 MG Road", line2: "Near Bus Stand", city: "Hyderabad", state: "Telangana", pin: "500001", country: "India" },
    currentAddress:   { line1: "Hostel Block C", line2: "Room 204", city: "Hyderabad", state: "Telangana", pin: "500001", country: "India" },
    sameAddress: false,
    // Family
    father:   { name: "Ramesh Doe",  occupation: "Engineer",   income: "800000", mobile: "9876543200", email: "ramesh@gmail.com" },
    mother:   { name: "Sunita Doe",  occupation: "Teacher",    income: "400000", mobile: "9876543201", email: "sunita@gmail.com" },
    guardian: { name: "",            relation: "",              occupation: "",    income: "",            mobile: "",              email: "" },
    // Academic
    tenth:   { school: "Delhi Public School",      board: "CBSE",  year: "2020", percentage: "92.4", subjects: "Science, Math, English, Hindi, SST" },
    twelfth: { school: "DAV Public School",        board: "CBSE",  year: "2022", percentage: "88.6", stream: "PCM" },
    diploma: { college: "", board: "", year: "", percentage: "", branch: "" },
    ug:      { college: "", university: "", year: "", cgpa: "", branch: "" },
    pg:      { college: "", university: "", year: "", cgpa: "", branch: "" },
    // Career
    careerObjective: "To build impactful software products at scale.",
    // Gap
    hasGap: "No", gapYear: "", gapReason: "",
    // Medical
    bloodGroup: "O+", medicalConditions: "None", emergencyContact: "9876543200", emergencyName: "Ramesh Doe", emergencyRelation: "Father",
    // Bank
    accountNumber: "123456789012", ifscCode: "SBIN0001234", bankName: "State Bank of India", branchName: "Hyderabad Main", scholarshipLinked: "No",
    // Passport & Visa
    passportNumber: "", passportExpiry: "", visaType: "", visaExpiry: "", nationality2: "",
    // Meta
    rollNumber: "22B21A0001",
    organization: "Mahindra University",
    currentSemester: "Semester 4",
    academicYear: "2025 – 2026",
    profile_pic: null,
};

const MOCK_STUDENT_PORTFOLIO_DATA = {
    // Entrance exams
    entranceExams: [
        { id: "ee1", examName: "JEE Mains",     year: "2022", score: "95.4 percentile", rank: "12340" },
        { id: "ee2", examName: "MHT-CET",       year: "2022", score: "148/200",         rank: "5421"  },
    ],
    // Uploaded documents
    documents: [
        { id: "doc1", docType: "10th Marksheet",    fileName: "10th_marksheet.pdf",  uploadedAt: "2024-08-01T10:00:00Z", url: "#" },
        { id: "doc2", docType: "12th Marksheet",    fileName: "12th_marksheet.pdf",  uploadedAt: "2024-08-01T10:00:00Z", url: "#" },
        { id: "doc3", docType: "Aadhaar Card",      fileName: "aadhaar.pdf",         uploadedAt: "2024-08-01T10:00:00Z", url: "#" },
    ],
    // Portfolio / projects
    portfolioLinks: [
        { id: "pl1", title: "GitHub Profile",    url: "https://github.com/johndoe",              type: "github"    },
        { id: "pl2", title: "LinkedIn",          url: "https://linkedin.com/in/johndoe",         type: "linkedin"  },
        { id: "pl3", title: "Personal Website",  url: "https://johndoe.dev",                     type: "website"   },
    ],
    skills: ["React", "Node.js", "Python", "SQL", "Git"],
    certifications: [
        { id: "cert1", name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2024", url: "#" },
    ],
    achievements: [
        { id: "ach1", title: "Smart India Hackathon Finalist", year: "2023", description: "Reached national finals in SIH 2023." },
    ],
};

// Mutable runtime state for student profile
let _studentProfileData   = { ...MOCK_STUDENT_PROFILE_DATA };
let _studentPortfolioData = {
    ...MOCK_STUDENT_PORTFOLIO_DATA,
    documents:      [...MOCK_STUDENT_PORTFOLIO_DATA.documents],
    entranceExams:  [...MOCK_STUDENT_PORTFOLIO_DATA.entranceExams],
    portfolioLinks: [...MOCK_STUDENT_PORTFOLIO_DATA.portfolioLinks],
};
const MOCK_STUDENT_COURSES_REGISTRATION_CONFIG = {
    isOpen:             true,
    windowStart:        "2026-03-01T00:00:00Z",  // past date so window is active
    windowEnd:          "2026-04-30T23:59:59Z",  // future date so it hasn't closed
    nextWindowDate:     "2026-09-01T00:00:00Z",
    targetSemester:     "Semester 5",
    targetAcademicYear: "2026 – 2027",
    maxElectives:       5,
};
 
const MOCK_STUDENT_COURSES_REGISTRATION_COURSES = [
    {
        id: 201, title: "Software Engineering",         courseCode: "CS501", department: "Computer Science",
        credits: 4, instructor: "Dr. Jane Smith",       schedule: "Mon/Wed 9:00 AM – 10:30 AM",
        seats: 60, enrolled: 45, isCompulsory: true,    isElective: false,
        overview: "Covers SDLC, design patterns, agile methodologies, and team-based project work.",
        prerequisites: ["CS301", "CS201"],
    },
    {
        id: 202, title: "Computer Networks",            courseCode: "CS502", department: "Computer Science",
        credits: 4, instructor: "Dr. Robert Chen",      schedule: "Tue/Thu 11:00 AM – 12:30 PM",
        seats: 60, enrolled: 52, isCompulsory: true,    isElective: false,
        overview: "OSI model, TCP/IP, routing algorithms, network security, and hands-on lab sessions.",
        prerequisites: ["CS201"],
    },
    {
        id: 203, title: "Database Management Systems",  courseCode: "CS503", department: "Computer Science",
        credits: 3, instructor: "Prof. Alan Turing",    schedule: "Mon/Wed/Fri 10:00 AM – 11:00 AM",
        seats: 55, enrolled: 40, isCompulsory: true,    isElective: false,
        overview: "Relational model, SQL, normalisation, transactions, indexing, and NoSQL overview.",
        prerequisites: ["CS201"],
    },
    {
        id: 301, title: "Machine Learning",             courseCode: "CS601", department: "Computer Science",
        credits: 4, instructor: "Dr. Elena Rodriguez",  schedule: "Mon/Wed 2:00 PM – 3:30 PM",
        seats: 30, enrolled: 22, isCompulsory: false,   isElective: true,
        overview: "Supervised/unsupervised learning, neural networks, model evaluation, and scikit-learn practicals.",
        prerequisites: ["MA201", "CS301"],
    },
    {
        id: 302, title: "Cloud Computing",              courseCode: "CS602", department: "Computer Science",
        credits: 3, instructor: "Dr. Jane Smith",       schedule: "Tue/Thu 2:00 PM – 3:30 PM",
        seats: 25, enrolled: 25, isCompulsory: false,   isElective: true,
        overview: "Cloud architectures, AWS/GCP/Azure services, containerisation with Docker/Kubernetes.",
        prerequisites: ["CS201"],
    },
    {
        id: 303, title: "Blockchain Technology",        courseCode: "CS603", department: "Computer Science",
        credits: 3, instructor: "Dr. Robert Chen",      schedule: "Tue/Thu 4:00 PM – 5:30 PM",
        seats: 30, enrolled: 18, isCompulsory: false,   isElective: true,
        overview: "Distributed ledger, consensus algorithms, smart contracts, and DApp development.",
        prerequisites: ["CS201"],
    },
    {
        id: 304, title: "Digital Marketing",            courseCode: "MB601", department: "Management",
        credits: 2, instructor: "Dr. Sarah Williams",   schedule: "Fri 10:00 AM – 12:00 PM",
        seats: 40, enrolled: 15, isCompulsory: false,   isElective: true,
        overview: "SEO, paid advertising, social media strategy, analytics, and brand building.",
        prerequisites: [],
    },
    { id: 305, title: "Cybersecurity Fundamentals", courseCode: "CS604", department: "Computer Science",
      credits: 3, instructor: "Prof. Alan Turing", schedule: "Mon/Wed 4:00 PM – 5:30 PM",
      seats: 30, enrolled: 12, isCompulsory: false, isElective: true,
      overview: "Network security, cryptography, ethical hacking, and security protocols.",
      prerequisites: ["CS201"] },
    { id: 306, title: "Data Science & Analytics", courseCode: "CS605", department: "Computer Science",
      credits: 4, instructor: "Dr. Elena Rodriguez", schedule: "Tue/Thu 9:00 AM – 10:30 AM",
      seats: 35, enrolled: 28, isCompulsory: false, isElective: true,
      overview: "Statistical analysis, data visualization, and predictive modeling using Python.",
      prerequisites: ["MA201", "CS201"] },
    { id: 307, title: "Internet of Things", courseCode: "CS606", department: "Computer Science",
      credits: 3, instructor: "Dr. Robert Chen", schedule: "Wed/Fri 11:00 AM – 12:30 PM",
      seats: 25, enrolled: 10, isCompulsory: false, isElective: true,
      overview: "Embedded systems, sensor networks, and IoT application development.",
      prerequisites: ["CS201"] },
    { id: 308, title: "Human-Computer Interaction", courseCode: "CS607", department: "Computer Science",
      credits: 2, instructor: "Dr. Jane Smith", schedule: "Fri 2:00 PM – 4:00 PM",
      seats: 40, enrolled: 20, isCompulsory: false, isElective: true,
      overview: "UX design principles, usability testing, and interface prototyping.",
      prerequisites: [] },
    { id: 309, title: "Advanced Database Systems", courseCode: "CS608", department: "Computer Science",
      credits: 3, instructor: "Prof. Alan Turing", schedule: "Tue/Thu 4:00 PM – 5:30 PM",
      seats: 30, enrolled: 22, isCompulsory: false, isElective: true,
      overview: "Query optimization, distributed databases, and NoSQL deep dive.",
      prerequisites: ["CS503"] },
    { id: 310, title: "Mobile App Development", courseCode: "CS609", department: "Computer Science",
      credits: 3, instructor: "Dr. Jane Smith", schedule: "Mon/Wed 11:00 AM – 12:30 PM",
      seats: 30, enrolled: 15, isCompulsory: false, isElective: true,
      overview: "React Native and Flutter development for iOS and Android platforms.",
      prerequisites: ["CS201"] },
];
 
let _studentCoursesMyRegistrations = [];
const MOCK_STUDENT_SESSIONS = [
    {
        id: "SESS001",
        courseCode: "CS301",
        courseName: "Data Structures & Algorithms",
        status: "Ongoing",
        credits: 4,
        professor: "Dr. Anjali Verma",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Monday",   startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
            { day: "Thursday", startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
            { day: "Saturday", startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
        ],
    },
    {
        id: "SESS002",
        courseCode: "CS302",
        courseName: "Operating Systems",
        status: "Ongoing",
        credits: 4,
        professor: "Prof. Karan Mehta",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Monday",    startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-105", buildingName: "Block B", courseType: "Theory" },
            { day: "Tuesday",   startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-105", buildingName: "Block B", courseType: "Theory" },
            { day: "Wednesday", startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-105", buildingName: "Block B", courseType: "Theory" },
            { day: "Saturday",  startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-105", buildingName: "Block B", courseType: "Theory" },
        ],
    },
    {
        id: "SESS003",
        courseCode: "CS302L",
        courseName: "OS Lab",
        status: "Ongoing",
        credits: 2,
        professor: "Prof. Karan Mehta",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Friday", startTime: "02:00 PM", endTime: "04:00 PM", roomNumber: "CL-103", buildingName: "Block B", courseType: "Lab" },
        ],
    },
    {
        id: "SESS004",
        courseCode: "MA301",
        courseName: "Discrete Mathematics",
        status: "Ongoing",
        credits: 3,
        professor: "Dr. Sunita Rao",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Monday",    startTime: "02:00 PM", endTime: "03:00 PM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
            { day: "Wednesday", startTime: "09:00 AM", endTime: "10:00 AM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
            { day: "Friday",    startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
            { day: "Sunday",    startTime: "02:00 PM", endTime: "03:00 PM", roomNumber: "LH-204", buildingName: "Block A", courseType: "Theory" },
        ],
    },
    {
        id: "SESS005",
        courseCode: "CS303",
        courseName: "Database Management Systems",
        status: "Ongoing",
        credits: 4,
        professor: "Dr. Priya Nair",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Tuesday",  startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-301", buildingName: "Block C", courseType: "Theory" },
            { day: "Thursday", startTime: "11:00 AM", endTime: "12:00 PM", roomNumber: "LH-301", buildingName: "Block C", courseType: "Theory" },
            { day: "Friday",   startTime: "12:00 PM", endTime: "01:00 PM", roomNumber: "LH-301", buildingName: "Block C", courseType: "Theory" },
        ],
    },
    {
        id: "SESS006",
        courseCode: "CS303L",
        courseName: "DBMS Lab",
        status: "Ongoing",
        credits: 2,
        professor: "Dr. Priya Nair",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Wednesday", startTime: "02:00 PM", endTime: "04:00 PM", roomNumber: "CL-201", buildingName: "Block C", courseType: "Lab" },
        ],
    },
    {
        id: "SESS007",
        courseCode: "CS301L",
        courseName: "DSA Lab",
        status: "Ongoing",
        credits: 2,
        professor: "Dr. Anjali Verma",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Tuesday", startTime: "02:00 PM", endTime: "04:00 PM", roomNumber: "CL-102", buildingName: "Block A", courseType: "Lab" },
        ],
    },
    {
        id: "SESS008",
        courseCode: "CS304",
        courseName: "Computer Networks",
        status: "Ongoing",
        credits: 3,
        professor: "Dr. Ramesh Iyer",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Sunday", startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "LH-202", buildingName: "Block A", courseType: "Theory" },
        ],
    },
    {
        id: "SESS009",
        courseCode: "CS304L",
        courseName: "Networks Lab",
        status: "Ongoing",
        credits: 2,
        professor: "Dr. Ramesh Iyer",
        startDate: "2026-01-10",
        endDate: "2026-06-30",
        schedule: [
            { day: "Sunday", startTime: "11:30 AM", endTime: "01:00 PM", roomNumber: "CL-103", buildingName: "Block B", courseType: "Lab" },
        ],
    },
    {
        id: "SESS010",
        courseCode: "CS201",
        courseName: "Introduction to Programming",
        status: "Completed",
        credits: 3,
        professor: "Dr. Anjali Verma",
        startDate: "2025-07-01",
        endDate: "2025-12-15",
        schedule: [
            { day: "Monday",   startTime: "10:00 AM", endTime: "11:00 AM", roomNumber: "A201", buildingName: "Block A", courseType: "Theory" },
            { day: "Thursday", startTime: "02:00 PM", endTime: "03:00 PM", roomNumber: "A202", buildingName: "Block A", courseType: "Theory" },
        ],
    },
];
// Use IPv4 address for network access
const FINAL_API_BASE_URL = "http://192.168.1.5:8000/api/v1";

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
	// Mock API responses
	if (USE_MOCK_API || endpoint.match(/^\/cohort\/([^/]+)\/assignments/)) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// --- USER / SETTINGS ---
		if (endpoint.match(/^\/user\/dashboard-overview$/)) {
			const userRole = localStorage.getItem("userRole") || "professor";

			return {
				success: true,
				data:
					userRole === "professor"
						? MOCK_PROFESSOR_DASHBOARD_DATA
						: MOCK_STUDENT_DASHBOARD_DATA,
			};
		}
		if (
			endpoint.match(/^\/user\/check-username(?:\?username=(.+))?$/) &&
			options.method === "PUT"
		) {
			const body = JSON.parse(options.body);
			const userRole = localStorage.getItem("userRole") || "professor";

			// Target the specific mock object based on role
			const targetData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

			// Update the nested user object directly
			Object.assign(targetData.user, body);

			return { success: true, data: targetData.user };
		}
		if (endpoint.match(/^\/user\/settings$/)) {
			const username =
				new URLSearchParams(endpoint.split("?")[1]).get("username") ||
				"";

			// Check if the username exists within your existing mock data objects
			// This dynamically checks against the current "server" state
			const isTaken =
				MOCK_PROFESSOR_DASHBOARD_DATA.user.name.toLowerCase() ===
					username.toLowerCase() ||
				MOCK_STUDENT_DASHBOARD_DATA.user.name.toLowerCase() ===
					username.toLowerCase();

			return {
				success: true,
				data: { available: !isTaken },
			};
		}
		if (
			endpoint.match(/^\/user\/bug-report$/) &&
			options.method === "POST"
		) {
			// In a real scenario, you'd process FormData here.
			// For the mock, we simply acknowledge receipt.
			return {
				success: true,
				message: "Bug report received successfully.",
			};
		}

		// Handle archived courses endpoint
		if (endpoint === "/cohort/archived") {
			return {
				success: true,
				data: MOCK_ARCHIVED_COURSES,
			};
		}
		// Handle CHECK AND ARCHIVE EXPIRED courses
		if (endpoint === "/cohort/check-expired" && options.method === "POST") {
			console.log("🕐 [MOCK API] Checking for expired courses...");

			const now = new Date();
			let archivedCount = 0;

			// Check in SHARED_COHORTS
			SHARED_COHORTS.forEach((cohort) => {
				if (cohort.end_date && cohort.status !== "Archived") {
					const endDate = new Date(cohort.end_date);
					if (endDate < now) {
						console.log(
							`📦 [MOCK API] Auto-archiving expired course: ${cohort.cohort_name}`,
						);
						cohort.status = "Archived";
						cohort.visibility = "Archived";

						// Move to archived courses
						MOCK_ARCHIVED_COURSES.push({ ...cohort });
						archivedCount++;
					}
				}
			});

			// Check in dashboard data
			const userRole = localStorage.getItem("userRole");
			const dashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

			// Check created cohorts
			const createdToArchive = dashboardData.createdCohorts.filter(
				(cohort) => {
					if (cohort.end_date && cohort.status !== "Archived") {
						const endDate = new Date(cohort.end_date);
						return endDate < now;
					}
					return false;
				},
			);

			createdToArchive.forEach((cohort) => {
				cohort.status = "Archived";
				cohort.visibility = "Archived";
				MOCK_ARCHIVED_COURSES.push({ ...cohort });
			});

			dashboardData.createdCohorts = dashboardData.createdCohorts.filter(
				(cohort) => !createdToArchive.includes(cohort),
			);

			// Check joined cohorts
			const joinedToArchive = dashboardData.joinedCohorts.filter(
				(cohort) => {
					if (cohort.end_date && cohort.status !== "Archived") {
						const endDate = new Date(cohort.end_date);
						return endDate < now;
					}
					return false;
				},
			);

			joinedToArchive.forEach((cohort) => {
				cohort.status = "Archived";
				cohort.visibility = "Archived";
				MOCK_ARCHIVED_COURSES.push({ ...cohort });
			});

			dashboardData.joinedCohorts = dashboardData.joinedCohorts.filter(
				(cohort) => !joinedToArchive.includes(cohort),
			);

			const totalArchived =
				createdToArchive.length + joinedToArchive.length;

			console.log(
				`✅ [MOCK API] Auto-archived ${totalArchived} expired courses`,
			);

			return {
				success: true,
				data: {
					archivedCount: totalArchived,
					message: `${totalArchived} course(s) auto-archived`,
				},
			};
		}

		// Handle MANUAL ARCHIVE course endpoint
		if (
			endpoint.match(/^\/cohort\/(\d+)\/archive$/) &&
			options.method === "POST"
		) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/archive$/)[1],
			);

			console.log("📦 [MOCK API] Manually archiving course:", courseId);

			// Update in SHARED_COHORTS
			const courseInShared = SHARED_COHORTS.find(
				(c) => c.id === courseId,
			);
			if (courseInShared) {
				courseInShared.status = "Archived";
				courseInShared.visibility = "Archived";
			}

			// Move from active to archived in dashboard data
			const userRole = localStorage.getItem("userRole");
			const dashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

			// Remove from created cohorts
			const createdIndex = dashboardData.createdCohorts.findIndex(
				(c) => c.id === courseId,
			);
			if (createdIndex !== -1) {
				const archivedCourse = dashboardData.createdCohorts.splice(
					createdIndex,
					1,
				)[0];
				archivedCourse.status = "Archived";
				archivedCourse.visibility = "Archived";
				MOCK_ARCHIVED_COURSES.push(archivedCourse);

				console.log(
					"✅ [MOCK API] Course archived from created cohorts",
				);
				return {
					success: true,
					message: "Course archived successfully",
				};
			}

			// Remove from joined cohorts
			const joinedIndex = dashboardData.joinedCohorts.findIndex(
				(c) => c.id === courseId,
			);
			if (joinedIndex !== -1) {
				const archivedCourse = dashboardData.joinedCohorts.splice(
					joinedIndex,
					1,
				)[0];
				archivedCourse.status = "Archived";
				archivedCourse.visibility = "Archived";
				MOCK_ARCHIVED_COURSES.push(archivedCourse);

				console.log(
					"✅ [MOCK API] Course archived from joined cohorts",
				);
				return {
					success: true,
					message: "Course archived successfully",
				};
			}

			console.error("❌ [MOCK API] Course not found:", courseId);
			return {
				success: false,
				error: "Course not found",
			};
		}

		// Handle course details endpoints
		if (endpoint.match(/^\/cohort\/(\d+)\/details$/)) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/details$/)[1],
			);

			// Get user role from localStorage to determine is_admin
			const userRole = localStorage.getItem("userRole");
			const isAdmin = userRole === "professor";

			// Get current user ID to check group membership
			const authUserStr = localStorage.getItem("authUser");
			const authUser = authUserStr ? JSON.parse(authUserStr) : null;
			const currentUserId = authUser?.id || 1;

			const courseDetails = MOCK_COURSE_DETAILS.find(
				(c) => c.id === courseId,
			);
			if (courseDetails) {
				// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
				const courseAssignments =
					MOCK_COURSE_ASSIGNMENTS[courseId] || [];
				const totalAssignments = courseAssignments.length;
				const memberCount = courseDetails.memberCount || 45;
				const groupCount = courseDetails.groupCount || 0;

				let completedAssignments, pendingAssignments;

				if (isAdmin) {
					// For professor: completed = ALL students/groups submitted, ongoing = not all submitted
					completedAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							// For group assignments: completed if all groups submitted
							return (
								a.submissions &&
								a.submissions.length === groupCount &&
								groupCount > 0
							);
						} else {
							// For individual assignments: completed if all students submitted
							return (
								a.submissions &&
								a.submissions.length === memberCount
							);
						}
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							return (
								!a.submissions ||
								a.submissions.length < groupCount ||
								groupCount === 0
							);
						} else {
							return (
								!a.submissions ||
								a.submissions.length < memberCount
							);
						}
					}).length;
				} else {
					// For student: completed = current student has submitted, ongoing = current student hasn't submitted
					completedAssignments = courseAssignments.filter((a) => {
						return a.status === "submitted" || a.submittedAt;
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						return a.status !== "submitted" && !a.submittedAt;
					}).length;
				}

				// Check if current user is in a group and if they're a leader
				let groupName = null;
				let isGroupLeader = false;

				if (!isAdmin) {
					const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
					if (courseMemberData && courseMemberData.groups) {
						for (const group of courseMemberData.groups) {
							if (group.members.includes(currentUserId)) {
								groupName = group.name;
								isGroupLeader =
									group.members[0] === currentUserId; // First member is leader
								break;
							}
						}
					}
				}

				return {
					success: true,
					data: {
						...courseDetails,
						is_admin: isAdmin,
						user_type: isAdmin ? 1 : 0,
						pending_assignments: pendingAssignments,
						completed_assignments: completedAssignments,
						total_assignments: totalAssignments,
						group_name: groupName,
						is_group_leader: isGroupLeader,
					},
				};
			}

			// Map course IDs from dashboard mock data
			const currentDashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

			const dashboardCourse = [
				...currentDashboardData.createdCohorts,
				...currentDashboardData.joinedCohorts,
			].find((c) => c.id === courseId);

			if (dashboardCourse) {
				// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
				const courseAssignments =
					MOCK_COURSE_ASSIGNMENTS[courseId] || [];
				const totalAssignments = courseAssignments.length;
				const memberCount = dashboardCourse.member_count || 45;
				const groupCount = dashboardCourse.group_count || 0;

				let completedAssignments, pendingAssignments;

				if (isAdmin) {
					// For professor: completed = ALL students/groups submitted, ongoing = not all submitted
					completedAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							// For group assignments: completed if all groups submitted
							return (
								a.submissions &&
								a.submissions.length === groupCount &&
								groupCount > 0
							);
						} else {
							// For individual assignments: completed if all students submitted
							return (
								a.submissions &&
								a.submissions.length === memberCount
							);
						}
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							return (
								!a.submissions ||
								a.submissions.length < groupCount ||
								groupCount === 0
							);
						} else {
							return (
								!a.submissions ||
								a.submissions.length < memberCount
							);
						}
					}).length;
				} else {
					// For student: completed = current student has submitted, ongoing = current student hasn't submitted
					completedAssignments = courseAssignments.filter((a) => {
						return a.status === "submitted" || a.submittedAt;
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						return a.status !== "submitted" && !a.submittedAt;
					}).length;
				}

				// Check if current user is in a group and if they're a leader
				let groupName = dashboardCourse.group_name || null;
				let isGroupLeader = dashboardCourse.is_group_leader || false;

				if (!isAdmin) {
					const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
					if (courseMemberData && courseMemberData.groups) {
						for (const group of courseMemberData.groups) {
							if (group.members.includes(currentUserId)) {
								groupName = group.name;
								isGroupLeader =
									group.members[0] === currentUserId; // First member is leader
								break;
							}
						}
					}
				}

				return {
					success: true,
					data: {
						id: courseId,
						cohort_name: dashboardCourse.cohort_name,
						course_codes:
							dashboardCourse.course_codes ||
							`CS${400 + courseId}`,
						cohort_description: dashboardCourse.cohort_description,
						status: dashboardCourse.status || "Live",
						visibility: dashboardCourse.visibility || "Active",
						organization_name: "Mahindra University",
						instructor: "Professor",
						start_date:
							dashboardCourse.start_date ||
							"2026-01-20T00:00:00Z",
						end_date:
							dashboardCourse.end_date || "2026-05-15T00:00:00Z",
						created_at: dashboardCourse.created_at,
						member_count: memberCount,
						group_count: groupCount,
						is_admin: isAdmin,
						user_type: isAdmin ? 1 : 0, // 1 = professor, 0 = student
						pending_assignments: pendingAssignments,
						completed_assignments: completedAssignments,
						total_assignments: totalAssignments,
						group_name: groupName,
						is_group_leader: isGroupLeader,
						detail_sections: [
							{
								id: 1,
								title: "Course Overview",
								subsec_description:
									dashboardCourse.cohort_description ||
									"Welcome to this comprehensive course! This course is designed to provide you with in-depth knowledge and practical skills in the subject area. Throughout the semester, you will engage with cutting-edge concepts, participate in hands-on projects, and collaborate with peers to solve real-world problems. The course combines theoretical foundations with practical applications, ensuring you gain both conceptual understanding and implementation experience. Our curriculum is carefully structured to build your knowledge progressively, starting from fundamental principles and advancing to complex applications. You'll have access to state-of-the-art resources, industry-standard tools, and expert guidance throughout your learning journey.",
							},
							{
								id: 2,
								title: "Learning Objectives",
								subsec_description:
									"By the end of this course, you will be able to:\n\n Knowledge & Understanding:\n• Demonstrate comprehensive understanding of core theoretical concepts and principles\n• Explain the historical context and evolution of the field\n• Analyze and compare different methodologies and approaches\n• Identify key trends and future directions in the domain\n\n Practical Skills:\n• Apply learned concepts to solve complex real-world problems\n• Design and implement effective solutions using industry-standard tools\n• Develop proficiency in relevant programming languages and frameworks\n• Create well-documented, maintainable, and scalable code\n\n Critical Thinking:\n• Evaluate different approaches and select optimal solutions\n• Debug and troubleshoot complex issues systematically\n• Conduct independent research and stay current with developments\n• Make data-driven decisions based on thorough analysis\n\n Collaboration & Communication:\n• Work effectively in team environments on group projects\n• Communicate technical concepts clearly to diverse audiences\n• Participate actively in peer reviews and constructive feedback\n• Present findings and solutions professionally",
							},
							{
								id: 3,
								title: "Course Schedule",
								subsec_description:
									"Detailed Weekly Breakdown:\n\nWeek 1-2: Foundations & Introduction\n• Course overview and learning outcomes\n• Introduction to fundamental concepts and terminology\n• Setting up development environment and tools\n• First hands-on exercises and basic implementations\n\nWeek 3-5: Core Concepts\n• Deep dive into essential theoretical frameworks\n• Advanced data structures and algorithms\n• Design patterns and best practices\n• Mid-term project kickoff\n\nWeek 6-8: Advanced Topics\n• Specialized techniques and optimization strategies\n• Integration with external systems and APIs\n• Performance tuning and scalability considerations\n• Security and error handling\n\nWeek 9-11: Real-World Applications\n• Case studies from industry leaders\n• Building complete end-to-end solutions\n• Testing, debugging, and deployment strategies\n• Group project development\n\nWeek 12-14: Integration & Review\n• Advanced integration patterns\n• Code review and refactoring workshops\n• Final project presentations\n• Comprehensive review and exam preparation\n\nWeek 15: Finals\n• Final examination\n• Project submissions and evaluations\n• Course wrap-up and next steps",
							},
							{
								id: 4,
								title: "Prerequisites",
								subsec_description:
									"Required Background:\n\nTechnical Prerequisites:\n• Basic programming knowledge in at least one language (Python, Java, or JavaScript)\n• Understanding of fundamental data structures (arrays, lists, trees)\n• Familiarity with basic algorithms and complexity analysis\n• Comfort with command-line interfaces and version control (Git)\n\nMathematical Prerequisites:\n• High school level algebra and logic\n• Basic understanding of discrete mathematics\n• Elementary statistics and probability (helpful but not required)\n\nRecommended (Not Required):\n• Previous coursework in computer science or related field\n• Experience with web development or software engineering\n• Exposure to database concepts and SQL\n• Familiarity with Agile/Scrum methodologies\n\n Note: If you're unsure about your background, please reach out to the instructor during the first week for guidance.",
							},
							{
								id: 5,
								title: "Grading Criteria",
								subsec_description:
									"Assessment Breakdown:\n\nAssignments (30%)\n• Weekly problem sets and coding exercises\n• Individual submissions with automatic grading\n• Late submissions accepted with 10% penalty per day\n• Best 8 out of 10 assignments counted\n\nQuizzes (15%)\n• Bi-weekly online quizzes covering recent topics\n• Multiple choice and short answer format\n• Open for 48 hours, single attempt\n• Lowest quiz score dropped\n\nMid-term Project (20%)\n• Individual or pair programming project\n• Real-world problem solving\n• Code quality, documentation, and presentation evaluated\n• Due Week 7\n\nFinal Project (25%)\n• Team-based comprehensive project (3-4 members)\n• Incorporates all course concepts\n• Includes written report and presentation\n• Peer evaluation component\n\nParticipation & Engagement (10%)\n• Active participation in discussions and forums\n• Helping peers and collaborative learning\n• Attendance in live sessions\n• Code reviews and constructive feedback\n\nGrading Scale:\nA: 90-100% | B: 80-89% | C: 70-79% | D: 60-69% | F: Below 60%",
							},
							{
								id: 6,
								title: "Required Resources",
								subsec_description:
									"Course Materials:\n\nTextbooks:\n• Primary: 'Fundamentals of Computer Science' (Latest Edition) - Available online\n• Reference: 'Advanced Programming Patterns' - Recommended but optional\n• All required readings will be provided through the course portal\n\nSoftware & Tools:\n• IDE: Visual Studio Code, IntelliJ IDEA, or PyCharm (free versions available)\n• Version Control: Git and GitHub account (free)\n• Development Tools: Node.js, Python 3.x, or Java JDK\n• Communication: Slack workspace for course discussions\n• Project Management: Trello or Jira (student licenses)\n\nOnline Resources:\n• Course website with lecture notes and recordings\n• Interactive coding platform for exercises\n• Discussion forums for Q&A and collaboration\n• Video tutorials and supplementary materials\n• Industry blogs and documentation links\n\nHardware Requirements:\n• Computer with at least 8GB RAM recommended\n• Stable internet connection for live sessions\n• Webcam and microphone for presentations\n\n All software used in this course is free or has free student versions available.",
							},
						],
					},
				};
			}

			// Return default details for any other course ID

			// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId] || [];
			const totalAssignments = courseAssignments.length;
			// Get actual counts from MOCK_COURSE_MEMBERS or use defaults
			const courseMembers = MOCK_COURSE_MEMBERS[courseId];
			const memberCount = courseMembers?.students?.length || 45;
			const groupCount = courseMembers?.groups?.length || 3;

			let completedAssignments, pendingAssignments;

			if (isAdmin) {
				// For professor: completed = ALL students/groups submitted, ongoing = not all submitted
				completedAssignments = courseAssignments.filter((a) => {
					if (a.type === "group") {
						// For group assignments: completed if all groups submitted
						return (
							a.submissions &&
							a.submissions.length === groupCount &&
							groupCount > 0
						);
					} else {
						// For individual assignments: completed if all students submitted
						return (
							a.submissions &&
							a.submissions.length === memberCount
						);
					}
				}).length;
				pendingAssignments = courseAssignments.filter((a) => {
					if (a.type === "group") {
						return (
							!a.submissions ||
							a.submissions.length < groupCount ||
							groupCount === 0
						);
					} else {
						return (
							!a.submissions || a.submissions.length < memberCount
						);
					}
				}).length;
			} else {
				// For student: completed = current student has submitted, ongoing = current student hasn't submitted
				completedAssignments = courseAssignments.filter((a) => {
					return a.status === "submitted" || a.submittedAt;
				}).length;
				pendingAssignments = courseAssignments.filter((a) => {
					return a.status !== "submitted" && !a.submittedAt;
				}).length;
			}

			// Check if current user is in a group and if they're a leader
			let groupName = null;
			let isGroupLeader = false;

			if (!isAdmin) {
				const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
				if (courseMemberData && courseMemberData.groups) {
					for (const group of courseMemberData.groups) {
						if (group.members.includes(currentUserId)) {
							groupName = group.name;
							isGroupLeader = group.members[0] === currentUserId; // First member is leader
							break;
						}
					}
				}
			}

			return {
				success: true,
				data: {
					id: courseId,
					cohort_name: "Course " + courseId,
					course_code: `CS${400 + courseId}`,
					cohort_description: "Course description",
					status: "Live",
					visibility: "Active",
					organization_name: "Mahindra University",
					instructor: "Professor",
					start_date: "2026-01-20T00:00:00Z",
					end_date: "2026-05-15T00:00:00Z",
					created_at: new Date().toISOString(),
					member_count: memberCount,
					group_count: groupCount,
					is_admin: isAdmin,
					user_type: isAdmin ? 1 : 0, // 1 = professor, 0 = student
					pending_assignments: pendingAssignments,
					completed_assignments: completedAssignments,
					total_assignments: totalAssignments,
					group_name: groupName,
					is_group_leader: isGroupLeader,
					detail_sections: [
						{
							id: 1,
							title: "Course Overview",
							subsec_description:
								"Welcome to this comprehensive course! This course is designed to provide you with in-depth knowledge and practical skills in the subject area. Throughout the semester, you will engage with cutting-edge concepts, participate in hands-on projects, and collaborate with peers to solve real-world problems. The course combines theoretical foundations with practical applications, ensuring you gain both conceptual understanding and implementation experience.",
						},
						{
							id: 2,
							title: "Learning Objectives",
							subsec_description:
								"By the end of this course, you will be able to:\n\n📚 Knowledge & Understanding:\n• Demonstrate comprehensive understanding of core theoretical concepts\n• Analyze and compare different methodologies and approaches\n• Identify key trends and future directions in the domain\n\n🛠️ Practical Skills:\n• Apply learned concepts to solve complex real-world problems\n• Design and implement effective solutions using industry tools\n• Develop proficiency in relevant technologies and frameworks\n\n🔍 Critical Thinking:\n• Evaluate different approaches and select optimal solutions\n• Debug and troubleshoot complex issues systematically\n• Make data-driven decisions based on analysis",
						},
						{
							id: 3,
							title: "Course Schedule",
							subsec_description:
								"📅 **Weekly Breakdown:**\n\n**Weeks 1-2: Foundations**\n• Introduction and fundamental concepts\n• Setting up development environment\n• First hands-on exercises\n\n**Weeks 3-5: Core Concepts**\n• Essential theoretical frameworks\n• Advanced techniques\n• Mid-term project\n\n**Weeks 6-8: Advanced Topics**\n• Specialized techniques\n• Integration patterns\n• Performance optimization\n\n**Weeks 9-11: Applications**\n• Real-world case studies\n• End-to-end solutions\n• Group project work\n\n**Weeks 12-15: Review & Finals**\n• Integration and review\n• Final presentations\n• Comprehensive examination",
						},
						{
							id: 4,
							title: "Prerequisites",
							subsec_description:
								"📋 **Required Background:**\n\n• Basic programming knowledge in at least one language\n• Understanding of fundamental data structures\n• Familiarity with version control (Git)\n• Command-line interface experience\n\n**Recommended:**\n• Previous coursework in related field\n• Experience with software development\n• Basic mathematics and logic skills",
						},
						{
							id: 5,
							title: "Grading Criteria",
							subsec_description:
								"📊 **Assessment Breakdown:**\n\n• Assignments: 30%\n• Quizzes: 15%\n• Mid-term Project: 20%\n• Final Project: 25%\n• Participation: 10%\n\n**Grading Scale:**\nA: 90-100% | B: 80-89% | C: 70-79% | D: 60-69%",
						},
					],
				},
			};
		}

		// Handle course members endpoint
		if (endpoint.match(/^\/cohort\/(\d+)\/members/)) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/members/)[1],
			);

			// Get current user from localStorage
			const authUserStr = localStorage.getItem("authUser");
			const authUser = authUserStr ? JSON.parse(authUserStr) : null;
			const currentUserId = authUser?.id || 1; // Fallback to 1 if not found

			const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
			if (courseMemberData) {
				// Transform students to participants format
				const participants = courseMemberData.students.map(
					(student) => ({
						email: `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`,
						user_details: {
							user_id: student.id,
							display_name: student.rollNumber,
							username: student.name,
							profile_pic: null,
							is_active: true,
							created_at: "2026-01-15T00:00:00Z",
						},
					}),
				);

				// Transform groups to proper format
				const groups = courseMemberData.groups.map((group) => {
					const cohortGroupMembers = group.members.map((memberId) => {
						const student = courseMemberData.students.find(
							(s) => s.id === memberId,
						);
						return {
							user_id: memberId,
							email: student
								? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
								: `user${memberId}@example.com`,
							role:
								group.members[0] === memberId
									? "leader"
									: "member",
						};
					});

					return {
						id: group.id,
						group_name: group.name,
						group_description: `Group with ${group.members.length} members`,
						project_name: `${group.name} Project`,
						created_at: "2026-01-20T00:00:00Z",
						CohortGroupMembers: cohortGroupMembers,
					};
				});

				// Check if current user is in a group
				const isInGroup = courseMemberData.groups.some(
					(group) =>
						group.members.includes(currentUserId) ||
						group.isYouInGroup,
				);

				return {
					success: true,
					data: {
						participants: participants,
						groups: groups,
						is_group: isInGroup,
					},
				};
			}

			// Return empty data for unknown course
			return {
				success: true,
				data: {
					participants: [],
					groups: [],
					is_group: false,
				},
			};
		}

		// Handle course assignments endpoint (GET only) - must exclude POST
		if (endpoint.match(/^\/cohort\/([^/]+)\/assignments$/) && options.method !== "POST") {
			console.log("🟢 HIT GET ASSIGNMENTS HANDLER", options.method);
			const courseId = endpoint.match(/^\/cohort\/([^/]+)\/assignments$/)[1];

			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId];
			if (courseAssignments) {
				// Transform to match API response format
				const transformedAssignments = courseAssignments.map(
					(assignment) => ({
						id: assignment.id,
						name: assignment.title, // ← ADD THIS
						title: assignment.title,
						description: assignment.description,
						deadline: assignment.dueDate,
						marks: assignment.marks || "10",
						type: assignment.type,
						status: assignment.status,
						submittedAt: assignment.submittedAt,
						submissions: assignment.submissions || [],
						created_at: assignment.createdAt,
						cohort_id: courseId,
						submissionLink: assignment.submissionLink, // ← ADD THIS
					}),
				);

				return {
					success: true,
					data: {
						assignments: transformedAssignments,
					},
				};
			}

			// Return empty assignments for unknown course
			return {
				success: true,
				data: {
					assignments: [],
				},
			};
		}
		if (
			endpoint.match(/^\/cohort\/([^/]+)\/assignments$/) &&
			options.method === "POST"
		) {
			console.log("🟢 HIT POST ASSIGNMENTS HANDLER");
			const courseId = endpoint.match(/^\/cohort\/([^/]+)\/assignments$/)[1];

			console.log(
				"🔄 [MOCK API] Creating assignment for cohort:",
				courseId,
			);
			console.log("📝 [MOCK API] Assignment data:", options.body);

			const assignmentData = JSON.parse(options.body);

			// Create new assignment with proper structure
			const newAssignment = {
				id: Date.now(), // Generate unique ID
				name: assignmentData.name || assignmentData.title,
				title: assignmentData.name || assignmentData.title,
				description: assignmentData.description,
				deadline: assignmentData.deadline,
				dueDate: assignmentData.deadline,
				marks: assignmentData.marks || "10",
				type: assignmentData.type || "individual",
				status: "pending",
				submittedAt: null,
				submissions: [],
				created_at: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				createdBy: "Prof. Jane Smith",
				cohort_id: courseId,
				cohortId: courseId,
				submissionLink: assignmentData.submissionLink || "",
			};

			// Initialize course assignments array if it doesn't exist
			if (!MOCK_COURSE_ASSIGNMENTS[courseId]) {
				MOCK_COURSE_ASSIGNMENTS[courseId] = [];
			}

			// Add to mock data
			MOCK_COURSE_ASSIGNMENTS[courseId].push(newAssignment);

			console.log(
				"✅ [MOCK API] Assignment created successfully:",
				newAssignment,
			);
			console.log(
				"📦 [MOCK API] Total assignments now:",
				MOCK_COURSE_ASSIGNMENTS[courseId].length,
			);

			return {
				success: true,
				data: newAssignment,
			};
		}

		// Handle UPDATE assignment endpoint
		if (
			endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/) &&
			options.method === "PUT"
		) {
			const courseId = endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/)[1];
			const assignmentId = endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/)[2];

			console.log("🔄 [MOCK API] Updating assignment:", assignmentId);

			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId];
			if (courseAssignments) {
				const index = courseAssignments.findIndex(
					(a) => a.id === assignmentId,
				);
				if (index !== -1) {
					const updatedData = JSON.parse(options.body);
					courseAssignments[index] = {
						...courseAssignments[index],
						...updatedData,
						name: updatedData.name || updatedData.title,
						title: updatedData.name || updatedData.title,
						updated_at: new Date().toISOString(),
					};

					console.log("✅ [MOCK API] Assignment updated");

					return {
						success: true,
						data: courseAssignments[index],
					};
				}
			}

			return {
				success: false,
				error: "Assignment not found",
			};
		}

		// Handle DELETE assignment endpoint
		if (
			endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/) &&
			options.method === "DELETE"
		) {
			const courseId = endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/)[1];
			const assignmentId = endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/)[2];

			console.log("🔄 [MOCK API] Deleting assignment:", assignmentId);

			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId];
			if (courseAssignments) {
				const index = courseAssignments.findIndex(
					(a) => a.id === assignmentId,
				);
				if (index !== -1) {
					courseAssignments.splice(index, 1);

					console.log("✅ [MOCK API] Assignment deleted");

					return {
						success: true,
						message: "Assignment deleted successfully",
					};
				}
			}

			return {
				success: false,
				error: "Assignment not found",
			};
		}

		// Handle group details endpoint with cohortId
		if (endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)) {
			const cohortId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)[1],
			);
			const groupId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)[2],
			);

			// Find the group in the specific course
			const courseMemberData = MOCK_COURSE_MEMBERS[cohortId];
			if (courseMemberData) {
				const group = courseMemberData.groups.find(
					(g) => g.id === groupId,
				);

				if (group) {
					// Get member details
					const members = group.members.map((memberId, index) => {
						const student = courseMemberData.students.find(
							(s) => s.id === memberId,
						);
						const isLeader = group.members[0] === memberId;
						return {
							user: {
								user_id: memberId,
								email: student
									? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
									: `user${memberId}@example.com`,
								display_name: student
									? student.rollNumber
									: `USER${memberId}`,
								username: student
									? student.name
									: `User ${memberId}`,
								profile_pic: null,
								is_active: true,
							},
							is_admin: isLeader,
							joined_at: "2026-01-15T00:00:00Z",
						};
					});

					return {
						success: true,
						data: {
							group: {
								id: group.id,
								group_name: group.name,
								group_description: `Group with ${group.members.length} members`,
								project_name: `${group.name} Project`,
								created_at: "2026-01-20T00:00:00Z",
								max_members: 4,
								cohort_id: cohortId,
							},
							members: members,
							leader: members.find((m) => m.is_admin)?.user,
						},
					};
				}
			}

			// Return error if course or group not found
			return {
				success: false,
				error: "Group not found",
			};
		}

		// Handle legacy group details endpoint without cohortId (fallback)
		if (endpoint.match(/^\/cohort\/group\/(\d+)\/details$/)) {
			const groupId = parseInt(
				endpoint.match(/^\/cohort\/group\/(\d+)\/details$/)[1],
			);

			// Find the group across all courses (legacy behavior)
			for (const courseId in MOCK_COURSE_MEMBERS) {
				const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
				const group = courseMemberData.groups.find(
					(g) => g.id === groupId,
				);

				if (group) {
					// Get member details
					const members = group.members.map((memberId, index) => {
						const student = courseMemberData.students.find(
							(s) => s.id === memberId,
						);
						const isLeader = group.members[0] === memberId;
						return {
							user: {
								user_id: memberId,
								email: student
									? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
									: `user${memberId}@example.com`,
								display_name: student
									? student.rollNumber
									: `USER${memberId}`,
								username: student
									? student.name
									: `User ${memberId}`,
								profile_pic: null,
								is_active: true,
							},
							is_admin: isLeader,
							joined_at: "2026-01-15T00:00:00Z",
						};
					});

					return {
						success: true,
						data: {
							group: {
								id: group.id,
								group_name: group.name,
								group_description: `Group with ${group.members.length} members`,
								project_name: `${group.name} Project`,
								created_at: "2026-01-20T00:00:00Z",
								max_members: 4,
								cohort_id: parseInt(courseId),
							},
							members: members,
							leader: members.find((m) => m.is_admin)?.user,
						},
					};
				}
			}

			// Return error if group not found
			return {
				success: false,
				error: "Group not found",
			};
		}

		// GET Resources - Get all resources for a cohort
		if (endpoint.match(/^\/cohort\/\d+\/resources$/)) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const resourcesData = MOCK_RESOURCES[cohortId] || {
				weeks: [],
				stats: { totalWeeks: 0, totalResources: 0 },
			};
			return {
				success: true,
				data: resourcesData,
			};
		}

		// CREATE Resource (Add resource to a week)
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) &&
			options.method === "POST"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const weekId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Create new resource
			const newResource = {
				id: Date.now(),
				...JSON.parse(options.body),
				addedAt: new Date().toISOString(),
				addedBy: "You",
			};

			// Update mock data
			if (MOCK_RESOURCES[cohortId]) {
				const week = MOCK_RESOURCES[cohortId].weeks.find(
					(w) => w.id === weekId,
				);
				if (week) {
					week.resources.push(newResource);
					week.totalResources = week.resources.length;
					MOCK_RESOURCES[cohortId].stats.totalResources++;
				}
			}

			return {
				success: true,
				data: newResource,
			};
		}

		// UPDATE Resource
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/\d+$/) &&
			options.method === "PUT"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const resourceId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (MOCK_RESOURCES[cohortId]) {
				for (const week of MOCK_RESOURCES[cohortId].weeks) {
					const resourceIndex = week.resources.findIndex(
						(r) => r.id === resourceId,
					);
					if (resourceIndex !== -1) {
						week.resources[resourceIndex] = {
							...week.resources[resourceIndex],
							...JSON.parse(options.body),
						};
						break;
					}
				}
			}

			return {
				success: true,
				data: { message: "Resource updated successfully" },
			};
		}

		// DELETE Resource
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/\d+$/) &&
			options.method === "DELETE"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const resourceId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (MOCK_RESOURCES[cohortId]) {
				for (const week of MOCK_RESOURCES[cohortId].weeks) {
					const resourceIndex = week.resources.findIndex(
						(r) => r.id === resourceId,
					);
					if (resourceIndex !== -1) {
						week.resources.splice(resourceIndex, 1);
						week.totalResources = week.resources.length;
						MOCK_RESOURCES[cohortId].stats.totalResources--;
						break;
					}
				}
			}

			return {
				success: true,
				data: { message: "Resource deleted successfully" },
			};
		}

		// CREATE Week
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week$/) &&
			options.method === "POST"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;

			// Create new week
			const newWeek = {
				id: Date.now(),
				...JSON.parse(options.body),
				totalResources: 0,
				resources: [],
			};

			// Update mock data
			if (MOCK_RESOURCES[cohortId]) {
				MOCK_RESOURCES[cohortId].weeks.push(newWeek);
				MOCK_RESOURCES[cohortId].stats.totalWeeks++;
			} else {
				MOCK_RESOURCES[cohortId] = {
					weeks: [newWeek],
					stats: { totalWeeks: 1, totalResources: 0 },
				};
			}

			return {
				success: true,
				data: newWeek,
			};
		}

		// UPDATE Week
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) &&
			options.method === "PUT"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const weekId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (MOCK_RESOURCES[cohortId]) {
				const weekIndex = MOCK_RESOURCES[cohortId].weeks.findIndex(
					(w) => w.id === weekId,
				);
				if (weekIndex !== -1) {
					MOCK_RESOURCES[cohortId].weeks[weekIndex] = {
						...MOCK_RESOURCES[cohortId].weeks[weekIndex],
						...JSON.parse(options.body),
					};
				}
			}

			return {
				success: true,
				data: { message: "Week updated successfully" },
			};
		}

		// DELETE Week
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) &&
			options.method === "DELETE"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const weekId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (MOCK_RESOURCES[cohortId]) {
				const weekIndex = MOCK_RESOURCES[cohortId].weeks.findIndex(
					(w) => w.id === weekId,
				);
				if (weekIndex !== -1) {
					const deletedWeek =
						MOCK_RESOURCES[cohortId].weeks[weekIndex];
					MOCK_RESOURCES[cohortId].weeks.splice(weekIndex, 1);
					MOCK_RESOURCES[cohortId].stats.totalWeeks--;
					MOCK_RESOURCES[cohortId].stats.totalResources -=
						deletedWeek.totalResources || 0;
				}
			}

			return {
				success: true,
				data: { message: "Week deleted successfully" },
			};
		}

		// --- STUDENT MEETINGS ---
		if (
			endpoint.match(/^\/cohort\/\d+\/student\/meetings$/) &&
			(!options.method || options.method === "GET")
		) {
			return {
				success: true,
				data: MOCK_SCHEDULED_MEETINGS,
			};
		}

		// --- STUDENT MEETING REQUESTS ---
		if (endpoint.match(/^\/cohort\/\d+\/student\/meeting-requests/)) {
			const authUser = JSON.parse(
				localStorage.getItem("authUser") || "{}",
			);
			const userId = authUser.id || 1;

			if (options.method === "POST") {
				const body = JSON.parse(options.body);
				const newRequest = {
					id: Date.now(),
					...body,
					status: "pending",
					studentId: userId,
					submittedAt: new Date().toISOString(),
				};
				if (!MOCK_MEETING_REQUESTS.incoming) {
					MOCK_MEETING_REQUESTS.incoming = [];
				}
				MOCK_MEETING_REQUESTS.incoming.unshift(newRequest);
				return { success: true, data: newRequest };
			}

			return {
				success: true,
				data: (MOCK_MEETING_REQUESTS.incoming || []).filter(
					(r) => r.studentId === userId,
				),
			};
		}

		// --- JOB TRAY AGGREGATION ---
		if (endpoint.match(/^\/job-tray$/)) {
			const jobs = [];

			const formatDate = (dateStr) =>
				new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

			const formatTime = (timeStr) => {
				const [hours, minutes] = timeStr.split(":");
				const date = new Date();
				date.setHours(hours, minutes);
				return date.toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
				});
			};

			// 1. ASSETS: Filter Action Required Requests
			const assetRequests = MOCK_ASSET_REQUESTS?.requests || [];
			assetRequests.forEach((req) => {
				if (req.status === "Rejected" && !req.isArchived) {
					jobs.push({
						id: `asset-${req.id}`,
						title: `Asset request for ${req.assetName} requires your action.`,
						type: "ASSET_REQUEST",
						status: "Action Required",
						link: "/asset-requests",
						statusNote: req.adminComments,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 2. FINANCE: Filter Action Required Claims/Requests
			const expenses = MOCK_EXPENSES?.expenses || [];
			const advances = MOCK_ADVANCES?.advances || [];

			// A. Handle Rejected Expense Claims
			expenses.forEach((item) => {
				if (item.status === "Rejected" && !item.isArchived) {
					jobs.push({
						id: `exp-${item.id}`,
						title: `Expense claim for ${item.title} requires your action.`,
						type: "FINANCE_EXPENSE",
						status: "Action Required",
						link: "/finance-management/expenses",
						statusNote: item.adminComments,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// B. Handle Rejected Advance Requests
			advances.forEach((item) => {
				if (item.status === "Rejected" && !item.isArchived) {
					jobs.push({
						id: `adv-${item.id}`,
						title: `Advance request for ${item.title} requires your action.`,
						type: "FINANCE_ADVANCE",
						status: "Action Required",
						link: "/finance-management/advances",
						statusNote: item.adminComments,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 3. LEAVE APPLICATIONS: Filter Action Required Apps and Pending Substitutions
			const leaveApps = MOCK_LEAVE_APPLICATIONS.applications || [];
			const subRequests =
				MOCK_LEAVE_APPLICATIONS.substitutionRequests || [];

			// A. Handle Rejected Leave Applications
			leaveApps.forEach((app) => {
				if (app.status === "Rejected" && !app.isArchived) {
					// Collect remarks only if they are associated with a "Rejected" status
					const remarks = [];
					if (app.leaveApproval.HoD.status === "Rejected")
						remarks.push(`HoD: ${app.leaveApproval.HoD.remark}`);
					if (app.leaveApproval.HR.status === "Rejected")
						remarks.push(`HR: ${app.leaveApproval.HR.remark}`);

					jobs.push({
						id: `leave-app-${app.id}`,
						title: `Leave application for ${app.leaveType} requires your action.`,
						type: "LEAVE_APPLICATION",
						status: "Action Required",
						link: "/leave-applications/my-leaves",
						// Consolidated status note
						statusNote:
							remarks.join(" | ") || "Application rejected.",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// B. Handle Pending Substitution Requests
			subRequests.forEach((sub) => {
				if (sub.status === "Pending") {
					const dateDisplay =
						sub.fromDate === sub.toDate
							? `on ${formatDate(sub.fromDate)}`
							: `from ${formatDate(sub.fromDate)} to ${formatDate(sub.toDate)}`;

					jobs.push({
						id: `sub-req-${sub.id}`,
						title: `Substitution request from ${sub.requesterName} ${dateDisplay}.`,
						type: "SUBSTITUTION_REQUEST",
						status: "Action Required",
						link: "/leave-applications/substitutions",
						// Concatenated date and timings for clarity
						statusNote: `${sub.course} | ${formatTime(sub.timings.startTime)} - ${formatTime(sub.timings.endTime)}`,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 4. EXAM DUTIES: Filter Rejection Revoked Duties
			const exams = MOCK_EXAM_DATA || [];

			exams.forEach((exam) => {
				if (exam.status === "REJECTION_REVOKED") {
					// Consolidate remarks from both authorities
					const remarks = [];
					if (exam.rejectionApproval?.exam_department?.remark)
						remarks.push(
							`Exam Dept.: ${exam.rejectionApproval.exam_department.remark}`,
						);
					if (exam.rejectionApproval?.hod?.remark)
						remarks.push(
							`HoD: ${exam.rejectionApproval.hod.remark}`,
						);

					jobs.push({
						id: `exam-${exam.id}`,
						title: `Exam duty for ${exam.courseName} (${exam.courseCode}) is reinstated & your rejection was revoked.`,
						type: "EXAM_DUTY",
						status: "Action Required",
						link: "/exam-duties",
						statusNote:
							remarks.join(" | ") ||
							"Please check your schedule.",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 5. LIBRARY: Filter Overdue Books
			const borrowedBooks = MOCK_LIBRARY_DATA.borrowed || [];

			borrowedBooks.forEach((book) => {
				const isOverdue = new Date() > new Date(book.dueDate);
				if (isOverdue) {
					jobs.push({
						id: `lib-overdue-${book.id}`,
						title: `Return Overdue: ${book.bookTitle} by ${book.author}`,
						type: "LIBRARY_OVERDUE",
						status: "Action Required",
						link: "/library/borrowed",
						// Use the overdue status note to show the due date
						statusNote: `Book was due on ${formatDate(book.dueDate)}`,
						createdAt: new Date().toISOString(), // Stamp for sorting
					});
				}
			});

			// 6. MAINTENANCE: Filter Action Required Requests
			const maintenanceRequests = MOCK_MAINTENANCE_DATA?.requests || [];

			maintenanceRequests.forEach((req) => {
				const categoryTab = req.category || "university";
				// Filter for rejected requests that haven't been archived/resolved by the user
				if (req.requiresAction) {
					jobs.push({
						id: `maint-${req.id}`,
						title: `Maintenance request for ${req.issueType} at ${req.location} requires your action.`,
						type: "MAINTENANCE_REQUEST",
						status: "Action Required",
						link: `/maintenance/${categoryTab}`,
						statusNote: req.adminRemarks || "Contact the maintenance team.",
						createdAt: req.updatedAt || new Date().toISOString(),
					});
				}
			});

			// 7. SESSION PLANNING: Filter Rejected Document Uploads
			const courseSchedule = MOCK_COURSE_SCHEDULE || [];
			const courseDocs = MOCK_COURSE_DOCUMENTS || {};
			
			// Fallback for doc types if not defined globally
			const internalDocTypes = [
				{ key: "courseOutline", label: "Course Outline" },
				{ key: "timeline", label: "Timeline" },
				{ key: "assessmentPlan", label: "Assessment Plan" },
				{ key: "previousYearAnalysis", label: "Previous Year Analysis" },
			];

			Object.entries(courseDocs).forEach(([courseId, docs]) => {
				const courseInfo = courseSchedule.find((c) => c.id === courseId);
				const courseDisplayName = courseInfo ? courseInfo.courseName : courseId;

				internalDocTypes.forEach((dt) => {
					const doc = docs[dt.key];

					if (doc && doc.status === "Rejected") {
						jobs.push({
							id: `doc-rej-${courseId}-${dt.key}`,
							title: `${dt.label} document for ${courseDisplayName} requires your action.`,
							type: "SESSION_PLANNING",
							status: "Action Required",
							link: "/session-planning/documents",
							statusNote: doc.hodComments || "Document rejected. Please review and re-upload.",
							createdAt: new Date().toISOString(),
						});
					}
				});
			});

			// Sort by date
			jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			return {
				success: true,
				data: jobs,
			};
		}
		// --- STUDENT JOB TRAY AGGREGATION ---
if (endpoint.match(/^\/student\/job-tray$/)) {
    const jobs = [];

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    // 1. LIBRARY: Overdue books
    const borrowedBooks = MOCK_LIBRARY_DATA.borrowed || [];
    borrowedBooks.forEach((book) => {
        const isOverdue = new Date() > new Date(book.dueDate);
        if (isOverdue) {
            jobs.push({
                id: `student-lib-overdue-${book.id}`,
                title: `Return Overdue: ${book.bookTitle} by ${book.author}`,
                type: "LIBRARY_OVERDUE",
                status: "Action Required",
                link: "/library/borrowed",
                statusNote: `Book was due on ${formatDate(book.dueDate)}`,
                createdAt: new Date().toISOString(),
            });
        }
    });

    // 2. DOCUMENT_SUBMISSION: Rejected or pending registrar document requests
    const docRequests = MOCK_REGISTRAR_DATA.documentRequests || [];
    docRequests.forEach((req) => {
        if (req.status === "Rejected") {
            jobs.push({
                id: `student-doc-${req.id}`,
                title: `Document request for "${req.type}" requires your action.`,
                type: "DOCUMENT_SUBMISSION",
                status: "Action Required",
                link: "/registrar",
                statusNote: req.remarks || "Request was rejected. Please reapply.",
                createdAt: req.requestedAt || new Date().toISOString(),
            });
        }
    });

    // 3. FEE_SUBMISSION: Overdue or pending fees
    const fees = MOCK_FINANCE_DATA.fees || [];
    fees.forEach((fee) => {
        if (fee.status === "Overdue") {
            jobs.push({
                id: `student-fee-overdue-${fee.id}`,
                title: `${fee.label} is overdue. Please pay immediately.`,
                type: "FEE_SUBMISSION",
                status: "Action Required",
                link: "/finance",
                statusNote: `Amount due: ₹${fee.due.toLocaleString()} | Due date: ${fee.dueDate}`,
                createdAt: new Date().toISOString(),
            });
        } else if (fee.status === "Pending" || fee.status === "Partial") {
            jobs.push({
                id: `student-fee-pending-${fee.id}`,
                title: `${fee.label} payment is pending.`,
                type: "FEE_SUBMISSION",
                status: "Action Required",
                link: "/finance",
                statusNote: `Amount due: ₹${fee.due.toLocaleString()} | Due date: ${fee.dueDate}`,
                createdAt: new Date().toISOString(),
            });
        }
    });

    // 4. ASSIGNMENT_SUBMISSION: Pending or overdue assignments
    const now = new Date();
    Object.entries(MOCK_COURSE_ASSIGNMENTS).forEach(([cohortId, assignments]) => {
        assignments.forEach((assignment) => {
            const isPending = assignment.status === "pending" && !assignment.submittedAt;
            const isOverdue = isPending && new Date(assignment.dueDate) < now;

            if (isPending) {
                const course = SHARED_COHORTS.find((c) => c.id === parseInt(cohortId));
                const courseName = course?.cohort_name ?? `Course ${cohortId}`;

                jobs.push({
                    id: `student-assign-${assignment.id}`,
                    title: `${isOverdue ? "Overdue" : "Pending"}: ${assignment.title}`,
                    type: "ASSIGNMENT_SUBMISSION",
                    status: "Action Required",
                    link: `/c/${cohortId}/assignments`,
                    statusNote: `${courseName} | Due: ${formatDate(assignment.dueDate)}`,
                    createdAt: assignment.createdAt || new Date().toISOString(),
                });
            }
        });
    });

    // 5. UPCOMING_INTERVIEW: Shortlisted placement applications with upcoming interviews
    _placementApplications.forEach((app) => {
        if (app.status === "Shortlisted" && app.interviewDate) {
            const interviewDateObj = new Date(app.interviewDate);
            if (interviewDateObj >= now) {
                jobs.push({
                    id: `student-interview-${app.id}`,
                    title: `Upcoming interview: ${app.role} at ${app.company}`,
                    type: "UPCOMING_INTERVIEW",
                    status: "Action Required",
                    link: "/placement/applications",
                    statusNote: [
                        `Date: ${formatDate(app.interviewDate)}`,
                        app.interviewTime ? `Time: ${app.interviewTime}` : null,
                        app.interviewMode ? `Mode: ${app.interviewMode}` : null,
                    ]
                        .filter(Boolean)
                        .join(" | "),
                    createdAt: app.appliedAt || new Date().toISOString(),
                });
            }
        }
    });

    // Sort by date, most recent first
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, data: jobs };
}

		// --- NOTIFICATIONS AGGREGATION ---
		if (endpoint.match(/^\/notifications$/)) {
			const notifications = [];

			// 1. ASSETS: Notify when a request is Approved or Assigned
			const assetRequests = MOCK_ASSET_REQUESTS?.requests || [];
			assetRequests.forEach((req) => {
				if (req.status === "Approved") {
					notifications.push({
						id: `notif-asset-${req.id}`,
						title: `Asset Request Update`,
						message: `Your request for ${req.assetName} has been ${req.status.toLowerCase()}.`,
						type: "ASSET_REQUEST",
						link: "/asset-requests",
						createdAt: req.approvalTime || new Date().toISOString(),
					});
				}
			});

			// 2. FINANCE: Notify on Reimbursements or Advance Approvals
			const expenses = MOCK_EXPENSES?.expenses || [];
			const advances = MOCK_ADVANCES?.advances || [];

			expenses.forEach((item) => {
				if (item.status === "Reimbursed") {
					notifications.push({
						id: `notif-exp-${item.id}`,
						title: `Expense Approved`,
						message: `Expense claim for ${item.title} has been processed.`,
						type: "FINANCE_EXPENSE",
						link: "/finance-management/expenses",
						createdAt: item.approvalTime || new Date().toISOString(),
					});
				}
			});

			advances.forEach((item) => {
				if (item.status === "Approved") {
					notifications.push({
						id: `notif-exp-${item.id}`,
						title: `Advance Approved`,
						message: `Advance request for ${item.title} has been processed.`,
						type: "FINANCE_ADVANCE",
						link: "/finance-management/advances",
						createdAt: item.approvalTime || new Date().toISOString(),
					});
				}
			});

			// 3. LEAVE: Notify when Leave is fully Approved
			const leaveApps = MOCK_LEAVE_APPLICATIONS.applications || [];
			leaveApps.forEach((app) => {
				if (app.status === "Approved") {
					notifications.push({
						id: `notif-leave-${app.id}`,
						title: `Leave Approved`,
						message: `Your ${app.leaveType} application has been approved by HoD & HR.`,
						type: "LEAVE_APPLICATION",
						link: "/leave-applications/my-leaves",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 4. EXAM DUTIES: Notify when a new duty is assigned
			const exams = MOCK_EXAM_DATA || [];
			exams.forEach((exam) => {
				if (exam.status === "ASSIGNED") {
					notifications.push({
						id: `notif-exam-${exam.id}`,
						title: `New Exam Duty`,
						message: `You have been assigned as an invigilator for ${exam.courseName}.`,
						type: "EXAM_DUTY",
						link: "/exam-duties",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 5. MAINTENANCE: Notify when a request is Resolved
			const maintenanceRequests = MOCK_MAINTENANCE_DATA?.requests || [];
			maintenanceRequests.forEach((req) => {
				if (req.status === "solved") {
					notifications.push({
						id: `notif-maint-${req.id}`,
						title: `Maintenance Resolved`,
						message: `The ${req.issueType} issue at ${req.location} is now marked as resolved.`,
						type: "MAINTENANCE_REQUEST",
						link: `/maintenance/${req.category || "university"}`,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 6. LIBRARY: Notify when a book request or extension status changes
			const libraryRequests = MOCK_LIBRARY_DATA?.requests || [];
			libraryRequests.forEach((req) => {
				// Check for terminal statuses: approved or rejected
				if (req.status === "approved" || req.status === "rejected") {
					const isApproved = req.status === "approved";
					
					notifications.push({
						id: `notif-lib-${req.id}`,
						title: isApproved ? `Library Request Approved` : `Library Request Rejected`,
						message: isApproved 
							? `Your request for "${req.bookTitle}" has been approved. Due date: ${req.dueDate}.` 
							: `Your request for "${req.bookTitle}" was rejected. Reason: ${req.rejectionReason || "No reason provided."}`,
						type: "LIBRARY_REQUEST",
						link: "/library/requests",
						createdAt: req.approvedDate || req.requestDate || new Date().toISOString(),
					});
				}
			});

			// 7. SCHEDULE & MEETINGS: Notify on Request Status Changes
			const incomingRequests = MOCK_MEETING_REQUESTS?.incoming || [];
			const outgoingRequests = MOCK_MEETING_REQUESTS?.outgoing || [];
			
			// Combine both to check for status updates
			[...incomingRequests, ...outgoingRequests].forEach((req) => {
				if (req.status === "accepted" || req.status === "rejected") {
					const isAccepted = req.status === "accepted";
					
					notifications.push({
						id: `notif-meet-${req.id}`,
						title: isAccepted ? `Meeting Confirmed` : `Meeting Declined`,
						message: isAccepted 
							? `Your meeting regarding "${req.subject}" with ${req.participantName} is confirmed.`
							: `The meeting request for "${req.subject}" was declined. ${req.rejectionReason ? 'Reason: ' + req.rejectionReason : ''}`,
						type: "MEETING_REQUEST",
						link: isAccepted ? "/schedule/schedule" : "/schedule/requests",
						createdAt: req.createdAt || req.submittedAt || new Date().toISOString(),
					});
				}
			});

			// 8. RESEARCH & PUBLICATIONS: Application Status Updates
			const researchApps = MOCK_USER_RESEARCH_APPLICATIONS || [];
			researchApps.forEach((app) => {
				const status = app.status;
				if (["Accepted", "Rejected", "Meeting Scheduled"].includes(status)) {
					notifications.push({
						id: `notif-res-app-${app.id}`,
						title: status === "Meeting Scheduled" ? "Interview Scheduled" : `Application ${status}`,
						message: status === "Meeting Scheduled" 
							? `A meeting is scheduled for "${app.title}" on ${new Date(app.meetingDetails?.date).toLocaleDateString()}.`
							: `Your application for "${app.title}" was ${status.toLowerCase()}.`,
						type: "RESEARCH_APPLICATION",
						link: "/research-publications/my-applications",
						createdAt: app.approvalDate || app.appliedDate,
					});
				}
			});

			// 9. RESEARCH OWNER: Notify on New Applicants (For Project Owners)
			[...MOCK_RESEARCH_PROJECTS, ...MOCK_PUBLICATIONS].filter(p => p.isOwner).forEach(project => {
				project.applicants?.filter(a => a.status === "Pending").forEach(applicant => {
					notifications.push({
						id: `notif-res-new-app-${applicant.id}`,
						title: "New Project Applicant",
						message: `${applicant.name} applied for the ${applicant.role} role in "${project.title}".`,
						type: "RESEARCH_OWNER",
						link: "/research-publications/my-applications",
						createdAt: applicant.appliedDate,
					});
				});
			});

			// Final sorting by date (Most recent first)
			notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			return {
				success: true,
				data: notifications,
			};
		}
		// --- STUDENT NOTIFICATIONS AGGREGATION ---
if (endpoint.match(/^\/student\/notifications$/)) {
    const notifications = [];
 
    // 1. COURSE: New assignments posted
    Object.entries(MOCK_COURSE_ASSIGNMENTS).forEach(([cohortId, assignments]) => {
        assignments.forEach((assignment) => {
            const course = SHARED_COHORTS.find((c) => c.id === parseInt(cohortId));
            const courseName = course?.cohort_name ?? `Course ${cohortId}`;
            notifications.push({
                id: `sn-course-assign-${assignment.id}`,
                title: "New Assignment Posted",
                message: `"${assignment.title}" has been posted in ${courseName}. Due: ${new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
                type: "COURSE_ASSIGNMENT",
                link: `/c/${cohortId}/assignments`,
                createdAt: assignment.createdAt || new Date().toISOString(),
            });
        });
    });
 
    // 2. LIBRARY: Approved or rejected book requests
    const libraryRequests = MOCK_LIBRARY_DATA?.requests || [];
    libraryRequests.forEach((req) => {
        if (req.status === "approved" || req.status === "rejected") {
            const isApproved = req.status === "approved";
            notifications.push({
                id: `sn-lib-${req.id}`,
                title: isApproved ? "Library Request Approved" : "Library Request Rejected",
                message: isApproved
                    ? `"${req.bookTitle}" has been approved. Collect from the library. Due: ${req.dueDate}.`
                    : `"${req.bookTitle}" request was rejected. Reason: ${req.rejectionReason || "No reason provided."}`,
                type: isApproved ? "LIBRARY_REQUEST" : "LIBRARY_REJECTED",
                link: "/library",
                createdAt: req.approvedDate || req.requestDate || new Date().toISOString(),
            });
        }
    });
 
    // 3. LIBRARY: Overdue books
    const borrowedBooks = MOCK_LIBRARY_DATA?.borrowed || [];
    borrowedBooks.forEach((book) => {
        if (new Date() > new Date(book.dueDate)) {
            notifications.push({
                id: `sn-lib-overdue-${book.id}`,
                title: "Book Overdue",
                message: `"${book.bookTitle}" was due on ${new Date(book.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}. Please return it immediately.`,
                type: "LIBRARY_DUE",
                link: "/library",
                createdAt: new Date().toISOString(),
            });
        }
    });
 
    // 4. FINANCE: Overdue or pending fees
    const fees = MOCK_FINANCE_DATA.fees || [];
    fees.forEach((fee) => {
        if (fee.status === "Overdue") {
            notifications.push({
                id: `sn-finance-overdue-${fee.id}`,
                title: "Fee Payment Overdue",
                message: `${fee.label} (₹${fee.due.toLocaleString()}) is overdue since ${fee.dueDate}. Please pay immediately.`,
                type: "FINANCE_OVERDUE",
                link: "/finance",
                createdAt: new Date().toISOString(),
            });
        } else if (fee.status === "Pending" || fee.status === "Partial") {
            notifications.push({
                id: `sn-finance-due-${fee.id}`,
                title: "Fee Payment Due",
                message: `${fee.label} (₹${fee.due.toLocaleString()}) is due on ${fee.dueDate}.`,
                type: "FINANCE_DUE",
                link: "/finance",
                createdAt: new Date().toISOString(),
            });
        }
    });
 
    // 5. REGISTRAR: Document request status changes
    const docRequests = MOCK_REGISTRAR_DATA.documentRequests || [];
    docRequests.forEach((req) => {
        if (req.status === "Ready") {
            notifications.push({
                id: `sn-reg-ready-${req.id}`,
                title: "Document Ready for Collection",
                message: `Your ${req.type} is ready. ${req.remarks || "Collect from the Registrar's Office."}`,
                type: "REGISTRAR_DOCUMENT",
                link: "/registrar",
                createdAt: req.requestedAt || new Date().toISOString(),
            });
        } else if (req.status === "Rejected") {
            notifications.push({
                id: `sn-reg-rejected-${req.id}`,
                title: "Document Request Rejected",
                message: `Your ${req.type} request was rejected. ${req.remarks || ""}`,
                type: "REGISTRAR_REJECTED",
                link: "/registrar",
                createdAt: req.requestedAt || new Date().toISOString(),
            });
        }
    });
 
    // 6. PLACEMENT: Shortlisted applications with upcoming interviews
    const now = new Date();
    _placementApplications.forEach((app) => {
        if (app.status === "Shortlisted" && app.interviewDate) {
            const interviewDate = new Date(app.interviewDate);
            if (interviewDate >= now) {
                notifications.push({
                    id: `sn-placement-interview-${app.id}`,
                    title: "Interview Scheduled",
                    message: `You are shortlisted for ${app.role} at ${app.company}. Interview on ${interviewDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}${app.interviewTime ? " at " + app.interviewTime : ""}.`,
                    type: "PLACEMENT_INTERVIEW",
                    link: "/placement",
                    createdAt: app.appliedAt || new Date().toISOString(),
                });
            }
        }
        if (app.status === "Selected") {
            notifications.push({
                id: `sn-placement-selected-${app.id}`,
                title: "Placement Offer Received",
                message: `Congratulations! You have been selected for ${app.role} at ${app.company}. Check the Placement Cell for next steps.`,
                type: "PLACEMENT_STATUS",
                link: "/placement",
                createdAt: app.appliedAt || new Date().toISOString(),
            });
        }
        if (app.status === "Rejected") {
            notifications.push({
                id: `sn-placement-rejected-${app.id}`,
                title: "Placement Application Update",
                message: `Your application for ${app.role} at ${app.company} was not selected this time.`,
                type: "PLACEMENT_STATUS",
                link: "/placement",
                createdAt: app.appliedAt || new Date().toISOString(),
            });
        }
    });
 
    // 7. RESEARCH: Application status changes
    const researchApps = MOCK_USER_RESEARCH_APPLICATIONS || [];
    researchApps.forEach((app) => {
        if (["Accepted", "Rejected", "Meeting Scheduled"].includes(app.status)) {
            notifications.push({
                id: `sn-research-${app.id}`,
                title: app.status === "Meeting Scheduled"
                    ? "Research Interview Scheduled"
                    : `Research Application ${app.status}`,
                message: app.status === "Meeting Scheduled"
                    ? `A meeting is scheduled for "${app.title}" on ${new Date(app.meetingDetails?.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`
                    : `Your application for "${app.title}" (${app.role}) was ${app.status.toLowerCase()}.`,
                type: app.status === "Accepted" ? "RESEARCH_ACCEPTED"
                    : app.status === "Meeting Scheduled" ? "RESEARCH_MEETING"
                    : "RESEARCH_REJECTED",
                link: "/student-research",
                createdAt: app.approvalDate || app.appliedDate,
            });
        }
    });
 
    // 8. MENTOR: Meeting confirmations
    MOCK_MENTOR_DATA.meetings.forEach((meeting) => {
        if (meeting.status === "Upcoming") {
            notifications.push({
                id: `sn-mentor-${meeting.id}`,
                title: "Upcoming Mentor Meeting",
                message: `Mentor meeting with ${MOCK_MENTOR_DATA.mentor.name} on ${new Date(meeting.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${new Date(meeting.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
                type: "MENTOR_MEETING",
                link: "/mentor",
                createdAt: meeting.date,
            });
        }
    });
 
    // 9. ANNOUNCEMENTS: Recent bulletins
    MOCK_BULLETINS.forEach((bulletin) => {
        notifications.push({
            id: `sn-announcement-${bulletin.id}`,
            title: bulletin.priority === "Urgent"
                ? `Urgent: ${bulletin.title}`
                : `New Announcement: ${bulletin.title}`,
            message: bulletin.content.length > 120
                ? bulletin.content.slice(0, 120) + "…"
                : bulletin.content,
            type: bulletin.priority === "Urgent"
                ? "ANNOUNCEMENT_URGENT"
                : bulletin.level === "department"
                ? "ANNOUNCEMENT_DEPARTMENT"
                : "ANNOUNCEMENT_GENERAL",
            link: "/announcements",
            createdAt: bulletin.createdAt,
        });
    });
 
    // Sort by date — most recent first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
 
    return { success: true, data: notifications };
}
// --- STUDENT EXAMINATION ---

// GET: Full examination overview in one round-trip
if (endpoint.match(/^\/student\/examination\/overview$/) && (!options.method || options.method === "GET")) {
    return {
        success: true,
        data: {
            examSchedule:        MOCK_STUDENT_EXAM_SCHEDULE,
            results:             MOCK_STUDENT_RESULTS,
            gradeHistory:        MOCK_STUDENT_GRADE_HISTORY,
            revaluationRequests: _revaluationRequests,
        },
    };
}

// GET: Exam schedule only
if (endpoint.match(/^\/student\/examination\/schedule$/) && (!options.method || options.method === "GET")) {
    return { success: true, data: MOCK_STUDENT_EXAM_SCHEDULE };
}

// GET: Results, optionally filtered by semester
if (endpoint.match(/^\/student\/examination\/results(\?.*)?$/) && (!options.method || options.method === "GET")) {
    const params  = new URL(endpoint, "http://localhost").searchParams;
    const semester = params.get("semester");
    const filtered = semester
        ? MOCK_STUDENT_RESULTS.filter((r) => r.semester === semester)
        : MOCK_STUDENT_RESULTS;
    return { success: true, data: filtered };
}

// GET: Grade history, optionally filtered by semester
if (endpoint.match(/^\/student\/examination\/grades(\?.*)?$/) && (!options.method || options.method === "GET")) {
    const params   = new URL(endpoint, "http://localhost").searchParams;
    const semester  = params.get("semester");
    const filtered  = semester
        ? MOCK_STUDENT_GRADE_HISTORY.filter((g) => g.semester === semester)
        : MOCK_STUDENT_GRADE_HISTORY;
    return { success: true, data: filtered };
}

// GET: All revaluation requests for the student
if (endpoint.match(/^\/student\/examination\/revaluations$/) && (!options.method || options.method === "GET")) {
    return { success: true, data: _revaluationRequests };
}

// POST: Submit a new revaluation request
if (endpoint.match(/^\/student\/examination\/revaluations$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const newRequest = {
        id:            `RV${Date.now()}`,
        subjectCode:   body.code || body.subjectCode,
        subjectName:   body.subject || body.subjectName,
        semester:      body.semester ?? null,
        reason:        body.reason,
        priority:      body.priority,
        status:        "Pending",
        submittedAt:   new Date().toISOString(),
    };
    _revaluationRequests.unshift(newRequest);
    return { success: true, data: newRequest };
}

// PATCH: Update an existing revaluation request (e.g. resubmit after rejection)
if (endpoint.match(/^\/student\/examination\/revaluations\/[\w-]+$/) && options.method === "PATCH") {
    const id      = endpoint.split("/").pop();
    const body    = JSON.parse(options.body);
    const request = _revaluationRequests.find((r) => r.id === id);
    if (request) {
        Object.assign(request, body, { updatedAt: new Date().toISOString() });
        return { success: true, data: request };
    }
    return { success: false, error: "Revaluation request not found" };
}

// DELETE: Cancel a pending revaluation request
if (endpoint.match(/^\/student\/examination\/revaluations\/[\w-]+$/) && options.method === "DELETE") {
    const id    = endpoint.split("/").pop();
    const index = _revaluationRequests.findIndex((r) => r.id === id);
    if (index !== -1) {
        _revaluationRequests.splice(index, 1);
        return { success: true, message: "Revaluation request cancelled" };
    }
    return { success: false, error: "Revaluation request not found" };
}

		// --- LIBRARY ---
		if (endpoint.match(/^\/library\/.+/)) {
			const method = options?.method || "GET";

			// GET: Dashboard data
			if (endpoint.match(/^\/library\/dashboard$/) && method === "GET") {
				return {
					success: true,
					data: {
						admins: MOCK_LIBRARY_DATA.admins,
						requests: MOCK_LIBRARY_DATA.requests.filter(
							(r) => r.status !== "approved",
						),
						// Aggregate borrowed books from both explicit records and approved requests
						borrowed: [
							...MOCK_LIBRARY_DATA.borrowed,
							...MOCK_LIBRARY_DATA.requests
								.filter((r) => r.status === "approved")
								.map((r) => ({
									id: r.id,
									bookTitle: r.bookTitle,
									author: r.author,
									isbn: r.isbn,
									category: r.category,
									borrowedDate: r.approvedDate,
									dueDate: r.dueDate,
									physicalCopyPickedUp:
										r.physicalCopyPickedUp,
								})),
						],
						inventory: MOCK_LIBRARY_DATA.inventory,
					},
				};
			}

			// POST: Request Book
			if (endpoint.match(/^\/library\/request$/) && method === "POST") {
				const { bookId, durationDays } = JSON.parse(options.body);
				const book = MOCK_LIBRARY_DATA.inventory.find(
					(b) => b.id === bookId,
				);
				if (book) {
					const newRequest = {
						id: `REQ${Date.now()}`,
						bookTitle: book.title,
						author: book.author,
						isbn: book.isbn,
						category: book.category,
						status: "pending",
						// Captured from user request
						durationDays: durationDays,
						requestDate: new Date().toISOString().split("T")[0],
					};
					MOCK_LIBRARY_DATA.requests.unshift(newRequest);
					return { success: true, data: newRequest };
				}
				return { success: false, message: "Book not found" };
			}

			// DELETE: Cancel Request
			if (
				endpoint.match(/^\/library\/requests\/[^/]+$/) &&
				method === "DELETE"
			) {
				const id = endpoint.split("/").pop();
				const index = MOCK_LIBRARY_DATA.requests.findIndex(
					(r) => r.id === id,
				);
				if (index !== -1) {
					MOCK_LIBRARY_DATA.requests.splice(index, 1);
					return { success: true, message: "Cancelled" };
				}
			}

			// POST: Create Extension Request
			if (endpoint.match(/^\/library\/extend$/) && method === "POST") {
				const { bookId, additionalDays } = JSON.parse(options.body);

				const book =
					MOCK_LIBRARY_DATA.borrowed.find((b) => b.id === bookId) ||
					MOCK_LIBRARY_DATA.requests.find(
						(r) => r.id === bookId && r.status === "approved",
					);

				if (book) {
					const extensionRequest = {
						id: `EXT${Date.now()}`,
						bookTitle: book.bookTitle,
						author: book.author,
						isbn: book.isbn,
						category: book.category,
						status: "extension-pending",
						originalBorrowedId: book.id,
						additionalDays: additionalDays,
						dueDate: book.dueDate,
						requestDate: new Date().toISOString().split("T")[0],
					};

					MOCK_LIBRARY_DATA.requests.unshift(extensionRequest);

					return { success: true, data: extensionRequest };
				}
				return {
					success: false,
					message: "Book not found or cannot be extended",
				};
			}

			// POST: Approve Extension Request
			if (
				endpoint.match(/^\/library\/approve-extension$/) &&
				method === "POST"
			) {
				const { requestId, bookId, additionalDays } = JSON.parse(
					options.body,
				);

				const borrowedBook = MOCK_LIBRARY_DATA.borrowed.find(
					(b) => b.id === bookId,
				);

				if (borrowedBook) {
					const currentDueDate = new Date(borrowedBook.dueDate);
					currentDueDate.setDate(
						currentDueDate.getDate() + parseInt(additionalDays),
					);
					const newDate = currentDueDate.toISOString().split("T")[0];
					borrowedBook.dueDate = newDate;

					const requestIndex = MOCK_LIBRARY_DATA.requests.findIndex(
						(r) => r.id === requestId,
					);
					if (requestIndex !== -1) {
						MOCK_LIBRARY_DATA.requests.splice(requestIndex, 1);
					}

					return { success: true, newDueDate: newDate };
				}
				return {
					success: false,
					message: "Could not process extension approval",
				};
			}
		}
		 
		// --- MAINTENANCE REQUESTS ---
		if (endpoint.match(/^\/maintenance\/(my-requests|requests|.*\/status)$/)) {
			// GET: Retrieve user requests
			if (endpoint.match(/^\/maintenance\/my-requests$/) && (options.method === "GET" || !options.method)) {
				return { 
					success: true, 
					data: {
						requests: MOCK_MAINTENANCE_DATA.requests,
						technicians: MOCK_MAINTENANCE_DATA.technicians || [],
						admins: MOCK_MAINTENANCE_DATA.admins || [],
						issueTypes: MOCK_MAINTENANCE_DATA.issueTypes || []
					} 
				};
			}

			// POST: Create a new request
			if (endpoint.match(/^\/maintenance\/requests$/) && options.method === "POST") {
				const newRequest = JSON.parse(options.body);
				
				// Generate the next ID (e.g., REQ005)
				const nextIdNumber = MOCK_MAINTENANCE_DATA.requests.length + 1;
				const formattedId = `REQ${String(nextIdNumber).padStart(3, '0')}`;

				const fullRequest = {
					...newRequest,
					id: formattedId,
					status: "pending",
					createdAt: new Date().toISOString(),
					submittedBy: "Professor", // Defaulting to Professor for mock
					submittedByUserId: 1,
					rejectionReason: null,
					adminRemarks: "",
					requiresAction: false,
					assignedTechnicianId: null,
				};
				
				MOCK_MAINTENANCE_DATA.requests.unshift(fullRequest);
				return { success: true, data: fullRequest };
			}

			// PATCH: Update status
			if (endpoint.match(/^\/maintenance\/requests\/[A-Z0-9-]+\/status$/) && options.method === "PATCH") {
				const urlParts = endpoint.split("/");
				const requestId = urlParts[3]; // Keep as string for comparison
				const { status, adminRemarks } = JSON.parse(options.body);
				
				const req = MOCK_MAINTENANCE_DATA.requests.find((r) => r.id === requestId);

				if (req) {
					req.status = status;
					if (adminRemarks) req.adminRemarks = adminRemarks;
					return { success: true, data: req };
				}
				return { success: false, message: "Request not found" };
			}
		}

		// --- SESSION PLANNING ---
		if (endpoint.match(/^\/sessions\/.+/)) {
			const method = options?.method || "GET";

			// GET Schedules
			if (endpoint.match(/^\/sessions\/schedules$/) && method === "GET") {
				return { success: true, data: MOCK_COURSE_SCHEDULE };
			}

			// GET Today's Classes
			if (endpoint.match(/^\/sessions\/today$/) && method === "GET") {
				const todays = [];
				MOCK_COURSE_SCHEDULE.filter((s) => s.status === "Ongoing").forEach(
					(s, slotIdx) => {
						todays.push({ ...s, id: `${s.id}_today_${slotIdx}` });
					},
				);
				return { success: true, data: todays };
			}

			// POST Archive
			if (
				endpoint.match(/^\/sessions\/[^/]+\/archive$/) &&
				method === "POST"
			) {
				const id = endpoint.split("/")[2];
				const section = MOCK_COURSE_SCHEDULE.find((s) => s.id === id);
				if (section) section.status = "Completed";
				return { success: true, data: section };
			}

			// GET Reflections
			if (endpoint.match(/^\/sessions\/reflections/) && method === "GET") {
				return { success: true, data: MOCK_REFLECTIONS };
			}

			// POST Reflection
			if (endpoint.match(/^\/sessions\/reflections$/) && method === "POST") {
				const data = JSON.parse(options.body);
				
				const newRef = {
					id: `ref_${Date.now()}`,
					...data,
					// Ensure consistent naming for the history view
					date: data.date || new Date().toISOString(),
					status: "Submitted" 
				};

				// Persist to the mock global array
				MOCK_REFLECTIONS.unshift(newRef);

				return { success: true, data: newRef };
			}

			// GET/POST Documents
			if (endpoint.match(/^\/sessions\/documents\/.+/)) {
				const method = options?.method || "GET";
				const parts = endpoint.split("/");
				
				// Check if it's a bulk upload or single upload
				const isBulk = parts.includes("bulk");
				const courseId = isBulk ? parts[parts.length - 2] : parts[parts.length - 1];

				if (method === "GET") {
					return { success: true, data: MOCK_COURSE_DOCUMENTS[courseId] || {} };
				}

				if (method === "POST") {
					// Initialize course entry if it doesn't exist
					if (!MOCK_COURSE_DOCUMENTS[courseId]) {
						MOCK_COURSE_DOCUMENTS[courseId] = {};
					}

					const body = JSON.parse(options.body);
					const uploadedKeys = isBulk ? body.docs : [body.docType];

					// Update each document's metadata to "Pending"
					uploadedKeys.forEach((docType) => {
						const currentDoc = MOCK_COURSE_DOCUMENTS[courseId][docType] || {};
						
						MOCK_COURSE_DOCUMENTS[courseId][docType] = {
							fileName: body.fileNames?.[docType] || `updated_${docType}.pdf`,
							fileLink: "#", 
							version: (currentDoc.version || 0) + 1,
							uploadDate: new Date().toISOString(),
							hodApproved: null, // Reset to Pending
							hodComments: null, // Clear previous rejections
						};
					});

					return { 
						success: true, 
						data: MOCK_COURSE_DOCUMENTS[courseId] 
					};
				}
			}
		}

		// --- SCHEDULE & MEETINGS ---
		if (endpoint === "/professor/schedule") {
			const userRole = localStorage.getItem("userRole");
			const dashboardData = userRole === "professor"
				? MOCK_PROFESSOR_DASHBOARD_DATA
				: MOCK_STUDENT_DASHBOARD_DATA;

			return {
				success: true,
				data: {
					scheduledMeetings: MOCK_SCHEDULED_MEETINGS,

					// Filters only for items that need an action from the user
					meetingRequests: MOCK_MEETING_REQUESTS.incoming.filter(
						(r) => r.status === "pending"
					),

					outgoingRequests: MOCK_MEETING_REQUESTS.outgoing,

					schedule: {
						officeHours: MOCK_OFFICE_HOURS,
						// Maps course schedule data for the timetable UI
						timetable: MOCK_COURSE_SCHEDULE.flatMap(course => 
							course.schedule.map(session => ({
								...session,
								courseName: course.courseName,
								courseId: course.id,
								courseType: course.courseType,
								startDate: course.startDate,
								endDate: course.endDate,
							}))
						),
					},
				},
			};
		}
		if (endpoint.match(/^\/professor\/meetings\/\d+\/(accept|reject|reschedule)$/)) {
			const parts = endpoint.split("/");
			const requestId = parseInt(parts[3]);
			const action = parts[4];
			const body = options.body ? JSON.parse(options.body) : {};

			const request = MOCK_MEETING_REQUESTS.incoming.find((r) => r.id === requestId);
			
			if (request) {
				if (action === "accept") {
					request.status = "accepted";
					// Add location details from the UI form
					request.location = body.location || "Office/Online"; 
				}
				
				if (action === "reject") {
					request.status = "rejected";
				}

				// Return statement: Confirms the status change so the UI can refresh the schedule
				return {
					success: true,
					data: { message: `Meeting ${action}ed successfully` },
				};
			}
		}

		// --- ASSET REQUESTS ---
		if (endpoint.match(/^\/assets\/(list|requests)$/)) {
			const type = endpoint.split("/").pop();
			return {
				success: true,
				data: type === "list" ? MOCK_ASSETS_LIST : MOCK_ASSET_REQUESTS,
			};
		}

		// --- ATTENDANCE MANAGEMENT ---
		// GET: Fetch attendance logs for a specific cohort
		if (endpoint.match(/^\/attendance\/logs\/\d+$/)) {
			const cohortId = endpoint.match(/\/attendance\/logs\/(\d+)$/)[1];
			const today = new Date().toISOString().split("T")[0];

			const rawData = MOCK_ATTENDANCE_DATA[cohortId] || {
				students: [],
				logs: {},
				finalizedDates: [],
			};

			const isFinalToday = rawData.finalizedDates?.includes(today);

			return {
				status: "success",
				data: { ...rawData, isFinal: isFinalToday },
				departmentMapping: DEPARTMENT_MAPPING,
			};
		}
		// POST: Save attendance for a specific course
		if (
			endpoint.match(/^\/courses\/\d+\/attendance$/) &&
			options.method === "POST"
		) {
			try {
				if (!options.body) throw new Error("Missing request body");
				const courseId = endpoint.match(
					/\/courses\/(\d+)\/attendance/,
				)[1];
				const bodyData = JSON.parse(options.body);
				const today = bodyData.date;

				if (!MOCK_ATTENDANCE_DATA[courseId]) {
					MOCK_ATTENDANCE_DATA[courseId] = {
						students: [],
						logs: {},
						finalizedDates: [],
					};
				}

				MOCK_ATTENDANCE_DATA[courseId].logs[today] =
					bodyData.studentIds;

				if (
					!MOCK_ATTENDANCE_DATA[courseId].finalizedDates.includes(
						today,
					)
				) {
					MOCK_ATTENDANCE_DATA[courseId].finalizedDates.push(today);
				}

				return {
					status: "success",
					data: {
						...MOCK_ATTENDANCE_DATA[courseId],
						isFinal: true,
						message: "Attendance saved",
					},
				};
			} catch (err) {
				return {
					success: false,
					message: "Invalid JSON or missing body: " + err.message,
				};
			}
		}
		if (endpoint.match(/^\/professor\/logs$/)) {
			return { success: true, data: MOCK_PROFESSOR_LOGS || [] };
		}

		// --- FINANCE MANAGEMENT ---
		if (endpoint.match(/^\/expenses\/list$/)) {
			return { success: true, data: { expenses: MOCK_EXPENSES } };
		}
		if (endpoint.match(/^\/advances\/list$/)) {
			return { success: true, data: { advances: MOCK_ADVANCES } };
		}

		// --- EXAM DUTIES ---
		if (endpoint.match(/^\/exams\/duties$/)) {
			return { success: true, data: MOCK_EXAM_DATA || [] };
		}
		if (endpoint.match(/^\/exams\/duty\/status$/)) {
			const { id, status, isCheckedIn, reason, rejectionApproval } =
				options.body;
			const duty = MOCK_EXAM_DATA.find((d) => d.id === id);

			if (duty) {
				duty.status = status;
				duty.isCheckedIn = isCheckedIn;
				if (reason) duty.rejectionReason = reason;

				// Only initialize or update approvals if they are provided/relevant
				if (rejectionApproval) {
					duty.rejectionApproval = rejectionApproval;
				} else if (status === "ASSIGNED") {
					duty.rejectionApproval = null;
				}

				return { success: true, message: `Duty ${id} updated` };
			}
			return { success: false, message: "Duty not found" };
		}

		// --- LEAVE APPLICATION ---
		if (endpoint.match(/^\/leaves\/applications$/)) {
			return { data: MOCK_LEAVE_APPLICATIONS };
		}
		if (endpoint.match(/^\/leaves\/apply$/)) {
			try {
				if (!options.body) throw new Error("Missing request body");
				const newLeave = JSON.parse(options.body);

				MOCK_LEAVE_APPLICATIONS.applications.push({
					...newLeave,
					id: `LV${Date.now()}`,
					status: "Pending",
					// Initialize approval tracking for new requests
					leaveApproval: {
						HoD: { status: "Pending", remark: null },
						HR: { status: "Pending", remark: null },
					},
				});
				return { success: true };
			} catch (err) {
				return {
					success: false,
					message: "Application failed: " + err.message,
				};
			}
		}
		// POST: Update an existing leave application
		if (endpoint.match(/^\/leaves\/update\/[\w-]+$/)) {
			try {
				if (!options.body) throw new Error("Missing request body");
				const leaveId = endpoint.split("/").pop();
				const updatedData = JSON.parse(options.body);

				const index = MOCK_LEAVE_APPLICATIONS.applications.findIndex(
					(a) => a.id === leaveId,
				);

				if (index !== -1) {
					MOCK_LEAVE_APPLICATIONS.applications[index] = {
						...MOCK_LEAVE_APPLICATIONS.applications[index],
						...updatedData,
					};
					return {
						success: true,
						message: "Application updated successfully.",
					};
				}
				return { success: false, message: "Application not found." };
			} catch (err) {
				return {
					success: false,
					message: "Update failed: " + err.message,
				};
			}
		}
		// POST: Process leave approval by HoD or HR
		if (endpoint.match(/^\/leaves\/approve\/[\w-]+$/)) {
			try {
				if (!options.body) throw new Error("Missing request body");
				const leaveId = endpoint.split("/").pop();
				const { role, action, remark } = JSON.parse(options.body); // e.g., role: "HoD", action: "Approved"

				const app = MOCK_LEAVE_APPLICATIONS.applications.find(
					(a) => a.id === leaveId,
				);
				if (app && app.leaveApproval[role]) {
					app.leaveApproval[role].status = action;
					app.leaveApproval[role].remark = remark || null;
					return {
						success: true,
						message: `${role} status updated to ${action}.`,
					};
				}
				return {
					success: false,
					message: "Application or role not found.",
				};
			} catch (err) {
				return { success: false, message: "Error: " + err.message };
			}
		}
		// POST: Process substitution requests
		if (endpoint.match(/^\/leaves\/substitutions\/[\w-]+$/)) {
			try {
				if (!options.body) throw new Error("Missing request body");
				const subId = endpoint.split("/").pop();
				const { action } = JSON.parse(options.body);

				const subReq =
					MOCK_LEAVE_APPLICATIONS.substitutionRequests.find(
						(s) => s.id === subId,
					);
				if (subReq) {
					subReq.status = action;
					subReq.leaveApproval.HoD.status = action; // Syncing HoD status for substitution

					return {
						success: true,
						message: `Substitution ${action.toLowerCase()} successfully.`,
					};
				}
				return {
					success: false,
					message: "Substitution request not found.",
				};
			} catch (err) {
				return {
					success: false,
					message: "Processing error: " + err.message,
				};
			}
		}

		// --- PAYROLL ---
		if (endpoint.match(/^\/payroll\/history$/)) {
			return { success: true, data: MOCK_PAYROLL.history };
		}
		if (endpoint.match(/^\/payroll\/breakdown$/)) {
			return { success: true, data: MOCK_PAYROLL.currentBreakdown };
		}

		// --- BULLETINS ---
		if (endpoint.match(/^\/bulletins(\?.*)?$/)) {
			if (options.method === "GET" || !options.method) {
				const url = new URL(endpoint, "http://localhost");
				const level = url.searchParams.get("level");
				const courseId = url.searchParams.get("courseId");
				const priority = url.searchParams.get("priority");

				let filtered = [...MOCK_BULLETINS];

				if (level) filtered = filtered.filter((b) => b.level === level);
				if (courseId)
					filtered = filtered.filter(
						(b) => b.courseId === parseInt(courseId),
					);
				if (priority) {
					filtered = filtered.filter(
						(b) =>
							b.priority.toLowerCase() === priority.toLowerCase(),
					);
				}
				return { success: true, data: filtered };
			}

			if (options.method === "POST") {
				try {
					const body = JSON.parse(options.body || "{}");
					const newBulletin = {
						id: Date.now(),
						...body,
						createdAt: new Date().toISOString(),
						priority: body.priority || "Normal",
						attachments: body.attachments || [],
					};
					MOCK_BULLETINS.unshift(newBulletin);
					return { success: true, data: newBulletin };
				} catch (err) {
					return {
						success: false,
						message: "Bulletin creation failed",
					};
				}
			}
		}

		// --- RESEARCH & PUBLICATIONS ---
		// GET: Consolidates projects and publications for the Research Dashboard
		if (endpoint.match(/^\/research\/dashboard-sync$/)) {
			return {
				success: true,
				data: {
					availableProjects: MOCK_RESEARCH_PROJECTS.filter(
						(p) => !p.isOwner && !p.isMember,
					),
					myProjects: MOCK_RESEARCH_PROJECTS.filter(
						(p) => p.isOwner || p.isMember,
					),
					myApplications: MOCK_USER_RESEARCH_APPLICATIONS,
					otherPublications: MOCK_PUBLICATIONS.filter(
						(p) => !p.isOwner && !p.isMember,
					),
					myPublications: MOCK_PUBLICATIONS.filter(
						(p) => p.isOwner || p.isMember,
					),
				},
			};
		}
		// POST: Handles application submission to a specific research item
		if (endpoint.match(/^\/research\/apply\/[\w-]+$/)) {
			const id = endpoint.split("/").pop();
			const body = JSON.parse(options.body);
			const itemType = body.itemType;

			const targetArray =
				itemType === "Project"
					? MOCK_RESEARCH_PROJECTS
					: MOCK_PUBLICATIONS;
			const item = targetArray.find((i) => i.id === id);

			if (item) {
				if (!item.applicants) item.applicants = [];
				item.applicants.push({
					id: `app-${Math.random().toString(36).substr(2, 9)}`,
					...body,
					status: "Pending",
				});
			}

			return {
				success: true,
				message: "Application submitted successfully",
			};
		}
		// POST: Handles application actions; regex supports encoded action names
		if (endpoint.match(/^\/research\/applications\/[\w-]+\/[\w\s]+$/)) {
			const parts = endpoint.split("/");
			const action = decodeURIComponent(parts.pop());
			const appId = parts.pop();
			let details = {};

			try {
				details = options?.body ? JSON.parse(options.body) : {};
			} catch (e) {}

			[...MOCK_RESEARCH_PROJECTS, ...MOCK_PUBLICATIONS].forEach(
				(item) => {
					const applicant = item.applicants?.find(
						(a) => a.id === appId,
					);

					if (applicant) {
						// 1. If accepting this applicant
						if (action === "Accepted") {
							// A. Auto-reject other applicants for this same role
							item.applicants.forEach((otherApp) => {
								if (
									otherApp.id !== appId &&
									otherApp.roleId === applicant.roleId &&
									otherApp.status === "Pending"
								) {
									otherApp.status = "Rejected";
									otherApp.professorNotes =
										"Position has been filled by another applicant.";
								}
							});

							// B. Remove this specific user's OTHER pending applications for THIS role
							// to prevent them from being accepted into the same role twice elsewhere
							[
								...MOCK_RESEARCH_PROJECTS,
								...MOCK_PUBLICATIONS,
							].forEach((otherItem) => {
								if (
									otherItem.id !== item.id &&
									otherItem.applicants
								) {
									otherItem.applicants =
										otherItem.applicants.filter(
											(a) =>
												!(
													a.userId ===
														applicant.userId &&
													a.roleId ===
														applicant.roleId &&
													a.status === "Pending"
												),
										);
								}
							});

							// Existing logic to add to collaborators/coAuthors
							applicant.approvalDate =
								details.approvalDate ||
								new Date().toISOString();
							applicant.professorNotes = details.feedback;

							const memberName = applicant.name;
							if (item.type === "publication") {
								if (!item.coAuthors) item.coAuthors = [];
								if (!item.coAuthors.includes(memberName))
									item.coAuthors.push(memberName);
							} else {
								if (!item.collaborators)
									item.collaborators = [];
								if (!item.collaborators.includes(memberName))
									item.collaborators.push(memberName);
							}

							item.currentMemberCount =
								(item.currentMemberCount || 0) + 1;

							if (item.openRoles) {
								item.openRoles = item.openRoles.filter(
									(r) => r.id !== applicant.roleId,
								);
								item.openRolesCount = item.openRoles.length;
							}
						}

						applicant.status = action;

						if (action === "Meeting Scheduled") {
							applicant.meetingDetails = details;
						} else if (action === "Rejected") {
							applicant.professorNotes = details.feedback;
						}
					}
				},
			);

			return {
				success: true,
				message: `Application ${action} updated, others cleaned up.`,
			};
		}
		// POST: Handles the creation of new research projects or publications
		if (endpoint.match(/^\/research\/create$/)) {
			const body = JSON.parse(options.body);
			const newEntry = {
				id: `res-${Math.random().toString(36).substr(2, 9)}`,
				...body,
				isOwner: true,
				isMember: true,
				// Documentation: Default system status if not explicitly provided by step 3
				status:
					body.status ||
					(body.type === "Project" ? "Open" : "Published"),
				date: new Date().toLocaleDateString("en-GB", {
					day: "numeric",
					month: "short",
					year: "numeric",
				}),
				applicants: [],
			};

			if (body.type === "Project") {
				MOCK_RESEARCH_PROJECTS.unshift(newEntry);
			} else {
				MOCK_PUBLICATIONS.unshift(newEntry);
			}

			return {
				success: true,
				message: `${body.type} created successfully`,
				data: newEntry,
			};
		}
		// ROLES: Handles GET, POST, PUT, and DELETE for research roles
		if (
			endpoint.match(
				/^\/research\/[\w-]+\/roles(\/create|\/update\/[\d]+|\/delete\/[\d]+)?$/,
			)
		) {
			const parts = endpoint.split("/");
			const researchId = parts[2];
			const action = parts[4]; // create, update, or delete
			const roleId = parseInt(parts[parts.length - 1]);

			const target = [
				...MOCK_RESEARCH_PROJECTS,
				...MOCK_PUBLICATIONS,
			].find((item) => item.id === researchId);

			if (!target)
				return { success: false, message: "Research item not found" };
			if (!target.openRoles) target.openRoles = [];

			// Handle DELETE
			if (options.method === "DELETE" && action === "delete") {
				target.openRoles = target.openRoles.filter(
					(r) => r.id !== roleId,
				);
				return { success: true, message: "Role deleted successfully" };
			}

			// Handle PUT (Update)
			if (options.method === "PUT" && action === "update") {
				const body = JSON.parse(options.body);
				const roleIndex = target.openRoles.findIndex(
					(r) => r.id === roleId,
				);

				if (roleIndex !== -1) {
					target.openRoles[roleIndex] = {
						...target.openRoles[roleIndex],
						...body,
					};
					return {
						success: true,
						message: "Role updated successfully",
						data: target.openRoles[roleIndex],
					};
				}
				return { success: false, message: "Role not found" };
			}

			// Handle POST (Create)
			if (options.method === "POST" && action === "create") {
				const body = JSON.parse(options.body);
				const newId =
					target.openRoles.length > 0
						? Math.max(...target.openRoles.map((r) => r.id || 0)) +
							1
						: 1;

				const newRole = {
					id: newId,
					roleName: body.roleName,
					description: body.description,
				};
				target.openRoles.push(newRole);
				return {
					success: true,
					message: "Role created successfully",
					data: target.openRoles,
				};
			}

			return { success: false, message: "Invalid role operation" };
		}
		// TIMELINE: Handles GET, POST, PUT, and DELETE for research timelines
		if (endpoint.match(/^\/research\/timeline\/[\w-]+\/?[\w-]*$/)) {
			const parts = endpoint.split("/");
			const researchId = parts[3];
			const eventId = parts[4]; // Can be undefined for GET/POST

			const allItems = [...MOCK_RESEARCH_PROJECTS, ...MOCK_PUBLICATIONS];
			const targetItem = allItems.find((i) => i.id === researchId);

			if (!targetItem)
				return { success: false, message: "Research item not found" };
			if (!targetItem.timeline) targetItem.timeline = [];

			// Handle DELETE
			if (options.method === "DELETE" && eventId) {
				targetItem.timeline = targetItem.timeline.filter(
					(e) => e.id !== eventId,
				);
				return { success: true, message: "Timeline event deleted" };
			}

			// Handle PUT
			if (options.method === "PUT" && eventId) {
				const body = JSON.parse(options.body);
				const index = targetItem.timeline.findIndex(
					(e) => e.id === eventId,
				);
				if (index !== -1) {
					targetItem.timeline[index] = {
						...targetItem.timeline[index],
						...body,
						updatedAt: new Date().toISOString(),
					};
					return { success: true, data: targetItem.timeline[index] };
				}
				return { success: false, message: "Event not found" };
			}

			// Handle POST
			if (options.method === "POST") {
				const body = JSON.parse(options.body);
				const newEvent = {
					id: `time-${Math.random().toString(36).substr(2, 9)}`,
					...body,
				};
				targetItem.timeline.push(newEvent);
				return { success: true, data: newEvent };
			}

			// Handle GET
			const events = [...targetItem.timeline].sort(
				(a, b) => new Date(b.date) - new Date(a.date),
			);
			return { success: true, data: events };
		}
		// GET: Returns all users or a specific user
		if (endpoint.match(/^\/research\/users$/)) {
			return { success: true, data: MOCK_USERS };
		}
		if (endpoint.match(/^\/research\/users\/[\w-]+$/)) {
			const userId = endpoint.split("/").pop();
			const user = MOCK_USERS.find((u) => u.id === userId);
			return user
				? { success: true, data: user }
				: { success: false, message: "User not found" };
		}
		// GET: Returns a user profile with hydrated associations
		if (endpoint.match(/^\/research\/users\/profile\/[\w-]+$/)) {
			const userId = endpoint.split("/").pop();
			const user = MOCK_USERS.find((u) => u.id === userId);

			if (user) {
				// Documentation: Hydrate the associations with full project/publication objects for the Profile UI
				const hydratedAssociations = user.associations.map((assoc) => {
					const source =
						assoc.type === "Project"
							? MOCK_RESEARCH_PROJECTS
							: MOCK_PUBLICATIONS;
					const details = source.find((item) => item.id === assoc.id);
					return { ...assoc, details };
				});
				return {
					success: true,
					data: { ...user, associations: hydratedAssociations },
				};
			}
			return { success: false, message: "Profile not found" };
		}
		// Updates the profile view; includes basic error handling for non-existent users
		if (endpoint.match(/^\/research\/users\/profile\/update\/[\w-]+$/)) {
			try {
				if (!options.body) throw new Error("Body required");
				const userId = endpoint.split("/").pop();
				const body = JSON.parse(options.body);
				const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);

				if (userIndex !== -1) {
					/**
					 * Merges new profile data (bio, skills, URLs) into the existing user record.
					 * Ensures isYou remains true for the owner and preserves existing associations.
					 */
					MOCK_USERS[userIndex] = {
						...MOCK_USERS[userIndex],
						...body,
						updatedAt: new Date().toISOString(),
					};
					return { success: true, data: MOCK_USERS[userIndex] };
				}
				return { success: false, message: "User not found" };
			} catch (err) {
				return {
					success: false,
					message: "Update failed: " + err.message,
				};
			}
		}
		// --- STUDENT SCHEDULE: GET timetable ---
if (endpoint.match(/^\/student\/timetable$/) && (!options.method || options.method === "GET")) {
    return { success: true, data: MOCK_STUDENT_TIMETABLE };
}
if (endpoint.match(/^\/student\/sessions$/) && (!options.method || options.method === "GET")) {
    return { success: true, data: MOCK_STUDENT_SESSIONS };
}

// --- STUDENT SCHEDULE: GET tasks for a date ---
if (endpoint.match(/^\/student\/tasks(\?.*)?$/) && (!options.method || options.method === "GET")) {
    const url = new URL(endpoint, "http://localhost");
    const date = url.searchParams.get("date");
    const filtered = date
        ? MOCK_STUDENT_TASKS.filter((t) => t.date === date)
        : MOCK_STUDENT_TASKS;
    return { success: true, data: filtered };
}

// --- STUDENT SCHEDULE: POST create task ---
if (endpoint.match(/^\/student\/tasks$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const newTask = {
        ...body,
        id: `task-${Date.now()}`,
        done: false,
    };
    MOCK_STUDENT_TASKS.push(newTask);
    return { success: true, data: newTask };
}

// --- STUDENT SCHEDULE: PATCH toggle task done ---
if (endpoint.match(/^\/student\/tasks\/[^/]+\/toggle$/) && options.method === "PATCH") {
    const taskId = endpoint.split("/")[3];
    const task = MOCK_STUDENT_TASKS.find((t) => t.id === taskId);
    if (task) {
        task.done = !task.done;
        return { success: true, data: task };
    }
    return { success: false, error: "Task not found" };
}

// --- STUDENT SCHEDULE: DELETE task ---
if (endpoint.match(/^\/student\/tasks\/[^/]+$/) && options.method === "DELETE") {
    const taskId = endpoint.split("/")[3];
    const index = MOCK_STUDENT_TASKS.findIndex((t) => t.id === taskId);
    if (index !== -1) {
        MOCK_STUDENT_TASKS.splice(index, 1);
        return { success: true, message: "Task deleted" };
    }
    return { success: false, error: "Task not found" };
}
// --- CALENDAR: GET all events ---
if (endpoint.match(/^\/calendar\/events(\?.*)?$/) && (!options.method || options.method === "GET")) {
    const params = new URL(endpoint, "http://localhost").searchParams;
    const type = params.get("type");
    const filtered = type && type !== "all"
        ? MOCK_CALENDAR_EVENTS.filter((e) => e.type === type)
        : MOCK_CALENDAR_EVENTS;
    return { success: true, data: filtered };
}

// --- CALENDAR: POST create event ---
if (endpoint.match(/^\/calendar\/events$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const newEvent = {
        ...body,
        id: `PE${Date.now()}`,
    };
    MOCK_CALENDAR_EVENTS.push(newEvent);
    return { success: true, data: newEvent };
}

// --- CALENDAR: DELETE event ---
if (endpoint.match(/^\/calendar\/events\/[^/]+$/) && options.method === "DELETE") {
    const eventId = endpoint.split("/").pop();
    const index = MOCK_CALENDAR_EVENTS.findIndex((e) => e.id === eventId);
    if (index !== -1) {
        MOCK_CALENDAR_EVENTS.splice(index, 1);
        return { success: true, message: "Event deleted" };
    }
    return { success: false, error: "Event not found" };
}
// --- REGISTRAR ---
if (endpoint.match(/^\/registrar/) ) {
    const method = options?.method || "GET";

    if (endpoint === "/registrar/overview" && method === "GET") {
        return { success: true, data: { adminSubmittedDocs: _registrarAdminDocs, documentRequests: _registrarDocRequests } };
    }

    if (endpoint === "/registrar/checklist" && method === "GET") {
        return { success: true, data: _registrarAdminDocs };
    }

    if (endpoint === "/registrar/requests" && method === "GET") {
        return { success: true, data: _registrarDocRequests };
    }

    if (endpoint === "/registrar/requests" && method === "POST") {
        const body = JSON.parse(options.body);
        const newRequest = { id: `DR${Date.now()}`, ...body, status: "Processing", requestedAt: new Date().toISOString(), remarks: null };
        _registrarDocRequests.unshift(newRequest);
        return { success: true, data: newRequest };
    }

    const singleMatch = endpoint.match(/^\/registrar\/requests\/([\w-]+)$/);
    if (singleMatch) {
        const id = singleMatch[1];
        const req = _registrarDocRequests.find((r) => r.id === id);

        if (method === "GET") {
            return req ? { success: true, data: req } : { success: false, error: "Request not found" };
        }
        if (method === "PATCH") {
            const body = JSON.parse(options.body);
            if (req) { Object.assign(req, body, { updatedAt: new Date().toISOString() }); return { success: true, data: req }; }
            return { success: false, error: "Request not found" };
        }
        if (method === "DELETE") {
            const index = _registrarDocRequests.findIndex((r) => r.id === id);
            if (index !== -1) { _registrarDocRequests.splice(index, 1); return { success: true, message: "Request cancelled" }; }
            return { success: false, error: "Request not found" };
        }
    }
}
// --- HOSTEL ---

// GET dashboard overview
if (endpoint.match(/^\/hostel\/dashboard$/) && (!options.method || options.method === "GET")) {
    return {
        success: true,
        data: {
            ...MOCK_HOSTEL_DATA,
            leaveRequests:       _hostelLeaveRequests,
            outingRequests:      _hostelOutingRequests,
            maintenanceRequests: _hostelMaintenanceRequests,
            complaints:          _hostelComplaints,
        },
    };
}

// POST leave request
if (endpoint.match(/^\/hostel\/leave$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const entry = { id: `LV${Date.now()}`, ...body, status: "Pending", submittedAt: new Date().toISOString() };
    _hostelLeaveRequests.unshift(entry);
    return { success: true, data: entry };
}

// POST outing request
if (endpoint.match(/^\/hostel\/outing$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const entry = { id: `OT${Date.now()}`, ...body, status: "Pending", currentStep: 0, submittedAt: new Date().toISOString() };
    _hostelOutingRequests.unshift(entry);
    return { success: true, data: entry };
}

// POST maintenance request
if (endpoint.match(/^\/hostel\/maintenance$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const entry = { id: `MT${Date.now()}`, ...body, status: "Pending", steps: [], submittedAt: new Date().toISOString() };
    _hostelMaintenanceRequests.unshift(entry);
    return { success: true, data: entry };
}

// POST complaint
if (endpoint.match(/^\/hostel\/complaints$/) && options.method === "POST") {
    const body = JSON.parse(options.body);
    const entry = { id: `CP${Date.now()}`, ...body, status: "Open", submittedAt: new Date().toISOString() };
    _hostelComplaints.unshift(entry);
    return { success: true, data: entry };
}
// --- MENTOR ---

if (endpoint.match(/^\/mentor\/dashboard$/) && (!options.method || options.method === "GET")) {
    return {
        success: true,
        data: {
            ...MOCK_MENTOR_DATA,
            feedbackHistory:  _mentorFeedbackHistory,
            meetingRequests:  _mentorMeetingRequests,
        },
    };
}

if (endpoint.match(/^\/mentor\/meetings\/request$/) && options.method === "POST") {
    const body  = JSON.parse(options.body);
    const entry = { id: `MR${Date.now()}`, ...body, status: "Pending", requestedAt: new Date().toISOString() };
    _mentorMeetingRequests.unshift(entry);
    return { success: true, data: entry };
}

if (endpoint.match(/^\/mentor\/feedback$/) && options.method === "POST") {
    const body  = JSON.parse(options.body);
    const entry = { id: `FB${Date.now()}`, date: new Date().toISOString().split("T")[0], ...body };
    _mentorFeedbackHistory.unshift(entry);
    return { success: true, data: entry };

}
 // --- FINANCE (STUDENT) ---
    if (endpoint.match(/^\/finance/)) {
        const method = options?.method || "GET";
 
        // GET /finance/overview — single round-trip hydration
        if (endpoint === "/finance/overview" && method === "GET") {
            return {
                success: true,
                data: {
                    fees: _financeFees,
                    paymentHistory: _financeHistory,
                    receipts: _financeReceipts,
                    dueReminders: _financeDueReminders,
                },
            };
        }
 
        // GET /finance/fees
        if (endpoint === "/finance/fees" && method === "GET") {
            return { success: true, data: _financeFees };
        }
 
        // GET /finance/history
        if (endpoint === "/finance/history" && method === "GET") {
            return { success: true, data: _financeHistory };
        }
 
        // GET /finance/receipts
        if (endpoint === "/finance/receipts" && method === "GET") {
            return { success: true, data: _financeReceipts };
        }
 
        // GET /finance/due-reminders
        if (endpoint === "/finance/due-reminders" && method === "GET") {
            return { success: true, data: _financeDueReminders };
        }
 
        // POST /finance/pay — student initiates a payment
        if (endpoint === "/finance/pay" && method === "POST") {
            const { feeId, mode, amount } = JSON.parse(options.body);
            const fee = _financeFees.find((f) => f.id === feeId);
            if (!fee) return { success: false, error: "Fee not found" };
 
            // Mark fee as paid
            fee.due = 0;
            fee.status = "Paid";
 
            const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
            const txnId   = `TXN${Date.now()}`;
            const refNo   = `REF-${feeId}-${Date.now()}`;
            const rcptId  = `RC${Date.now()}`;
 
            // Add history entry
            const historyEntry = {
                id: `PH${Date.now()}`,
                feeType: fee.type,
                label: fee.label,
                feeHead: fee.label.split("–")[0].trim(),
                semester: fee.semester,
                date: dateStr,
                processedOn: `${dateStr}, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
                mode,
                gateway: mode === "UPI" ? "UPI Gateway" : mode === "Card" ? "Card Gateway" : mode === "Net Banking" ? "Net Banking" : "Finance Office",
                amount,
                status: "Paid",
                txnId,
                refNo,
                receiptId: rcptId,
                charges: fee.breakdown?.filter((b) => b.type !== "deduction") ?? [],
            };
            _financeHistory.unshift(historyEntry);
 
            // Add receipt
            const receipt = {
                id: rcptId,
                receiptNo: `RCPT-${new Date().getFullYear()}-${rcptId.slice(-6)}`,
                label: fee.label,
                date: dateStr,
                semester: fee.semester,
                academicYear: `${new Date().getFullYear() - 1}–${new Date().getFullYear()}`,
                mode,
                txnId,
                refNo,
                amount,
                category: fee.type.charAt(0).toUpperCase() + fee.type.slice(1),
                collectedBy: "Finance Office",
                status: "Paid",
                tax: 0,
                note: null,
                breakdown: fee.breakdown?.filter((b) => b.type !== "deduction") ?? [],
            };
            _financeReceipts.unshift(receipt);
 
            // Remove resolved due reminders
            _financeDueReminders = _financeDueReminders.filter((r) => r.feeId !== feeId);
 
            return { success: true, data: { historyEntry, receipt } };
        }
 
        // GET /finance/receipts/:id/download — placeholder for PDF download
        const downloadMatch = endpoint.match(/^\/finance\/receipts\/([\w-]+)\/download$/);
        if (downloadMatch && method === "GET") {
            const id = downloadMatch[1];
            const receipt = _financeReceipts.find((r) => r.id === id);
            return receipt
                ? { success: true, data: { url: `https://example.com/receipts/${id}.pdf`, receipt } }
                : { success: false, error: "Receipt not found" };
        }
    }
	// --- STUDENT ATTENDANCE ---

if (endpoint.match(/^\/student\/attendance$/) && (!options.method || options.method === "GET")) {
    return { success: true, data: MOCK_STUDENT_ATTENDANCE };
}
// POST /student/attendance/qr — mark attendance via QR token
if (
    endpoint.match(/^\/student\/attendance\/qr$/) &&
    options.method === "POST"
) {
    const { token } = JSON.parse(options.body);

    // Basic token validation — real backend would verify signature + expiry
    if (!token || token.trim().length === 0) {
        return { success: false, error: "Invalid QR code." };
    }

    // Simulate occasional expired token for realism
    // In production, the backend checks the token's timestamp
    return {
        success: true,
        data: {
            message: "Attendance marked successfully!",
            course: "Scanned via QR",
            markedAt: new Date().toISOString(),
        },
    };
}
// --- STUDENT RESEARCH ---

// GET /student/research/dashboard — single round-trip hydration
if (
    endpoint.match(/^\/student\/research\/dashboard$/) &&
    (!options.method || options.method === "GET")
) {
    return {
        success: true,
        data: {
            availableProjects:    _studentResearchAvailableProjects,
            myProjects:           _studentResearchMyProjects,
            availablePublications: _studentResearchAvailablePublications,
            myPublications:       _studentResearchMyPublications,
            myApplications:       _studentResearchMyApplications,
            allUsers:             MOCK_STUDENT_RESEARCH_ALL_USERS,
        },
    };
}

// POST /student/research/apply/:itemId — submit application
if (
    endpoint.match(/^\/student\/research\/apply\/.+$/) &&
    options.method === "POST"
) {
    const itemId = endpoint.split("/").pop();
    const body   = JSON.parse(options.body);

    const alreadyApplied = _studentResearchMyApplications.some(
        (a) => a.projectId === itemId,
    );
    if (alreadyApplied) {
        return { success: false, error: "You have already applied to this item." };
    }

    const targetItem =
        _studentResearchAvailableProjects.find((p) => p.id === itemId) ||
        _studentResearchAvailablePublications.find((p) => p.id === itemId);

    const newApplication = {
        id:             `app-${Date.now()}`,
        projectId:      itemId,
        projectTitle:   targetItem?.title ?? "Research Item",
        status:         "pending",
        appliedAt:      new Date().toISOString(),
        isSentApplication: true,
        role:           body.roleId       ?? null,
        coverNote:      body.justification  ?? null,
        itemType:       body.itemType   ?? "Project",
    };

    _studentResearchMyApplications.unshift(newApplication);
    return { success: true, data: newApplication };
}

// POST /student/research/star/:itemId — toggle star
if (
    endpoint.match(/^\/student\/research\/star\/.+$/) &&
    options.method === "POST"
) {
    const itemId = endpoint.split("/").pop();

    const toggleInList = (list) =>
        list.map((item) => {
            if (item.id !== itemId) return item;
            const isNowStarred = !item.isStarred;
            return {
                ...item,
                isStarred:  isNowStarred,
                starsCount: isNowStarred
                    ? (item.starsCount || 0) + 1
                    : Math.max(0, (item.starsCount || 0) - 1),
            };
        });

    _studentResearchAvailableProjects     = toggleInList(_studentResearchAvailableProjects);
    _studentResearchMyProjects            = toggleInList(_studentResearchMyProjects);
    _studentResearchAvailablePublications = toggleInList(_studentResearchAvailablePublications);
    _studentResearchMyPublications        = toggleInList(_studentResearchMyPublications);

    return { success: true, message: "Star toggled." };
}
// --- STUDENT PROFILE ---

// GET /student/profile — hydrate the full profile UI in one call
if (
    endpoint.match(/^\/student\/profile$/) &&
    (!options.method || options.method === "GET")
) {
    return {
        success: true,
        data: {
            studentData:   _studentProfileData,
            portfolioData: _studentPortfolioData,
        },
    };
}

// PUT /student/profile — update core profile fields
if (
    endpoint.match(/^\/student\/profile$/) &&
    options.method === "PUT"
) {
    const updates = JSON.parse(options.body);
    _studentProfileData = { ..._studentProfileData, ...updates };
    return { success: true, data: _studentProfileData };
}

// PUT /student/profile/portfolio — update portfolio fields
if (
    endpoint.match(/^\/student\/profile\/portfolio$/) &&
    options.method === "PUT"
) {
    const updates = JSON.parse(options.body);
    _studentPortfolioData = { ..._studentPortfolioData, ...updates };
    return { success: true, data: _studentPortfolioData };
}

// POST /student/profile/documents — upload a document (mock: push to array)
if (
    endpoint.match(/^\/student\/profile\/documents$/) &&
    options.method === "POST"
) {
    // FormData can't be JSON-parsed; we simulate a successful upload
    const newDoc = {
        id:         `doc-${Date.now()}`,
        docType:    "Uploaded Document",
        fileName:   "document.pdf",
        uploadedAt: new Date().toISOString(),
        url:        "#",
    };
    _studentPortfolioData.documents.unshift(newDoc);
    return { success: true, data: newDoc };
}
// GET /student/courses/overview — single call to hydrate the page
if (
    endpoint.match(/^\/student\/courses\/overview$/) &&
    (!options.method || options.method === "GET")
) {
    return {
        success: true,
        data: {
            registrationConfig:  MOCK_STUDENT_COURSES_REGISTRATION_CONFIG,
            registrationCourses: MOCK_STUDENT_COURSES_REGISTRATION_COURSES,
            myRegistrations:     _studentCoursesMyRegistrations,
        },
    };
}
 
// POST /student/courses/register — submit registration for selected courses
if (
    endpoint.match(/^\/student\/courses\/register$/) &&
    options.method === "POST"
) {
    const { courses } = JSON.parse(options.body); // array of selected course objects
 
    const newRegs = courses.map((c) => ({
        id:           `REG${Date.now()}-${c.id}`,
        courseId:     c.id,
        title:        c.title,
        courseCode:   c.courseCode,
        instructor:   c.instructor,
        credits:      c.credits,
        isElective:   !!c.isElective,
        isCompulsory: !!c.isCompulsory,
        priority:     c.priority ?? null,
        status:       "Pending",
        appliedAt:    new Date().toISOString(),
        adminRemarks: null,
    }));

    _studentCoursesMyRegistrations = [...newRegs, ..._studentCoursesMyRegistrations];
    _studentCoursesMyRegistrations.sort((a, b) => {
        if (a.isCompulsory && !b.isCompulsory) return -1;
        if (!a.isCompulsory && b.isCompulsory) return 1;
        if (a.priority != null && b.priority != null) return a.priority - b.priority;
        return 0;
    });
    return { success: true, data: _studentCoursesMyRegistrations };
}
 
// DELETE /student/courses/register/:regId — cancel a pending registration
if (
    endpoint.match(/^\/student\/courses\/register\/[\w-]+$/) &&
    options.method === "DELETE"
) {
    const regId = endpoint.split("/").pop();
    _studentCoursesMyRegistrations = _studentCoursesMyRegistrations.filter((r) => r.id !== regId);
    return { success: true, message: "Registration cancelled." };
}
 
// PATCH /student/courses/register/:regId/swap — swap an elective registration
if (
    endpoint.match(/^\/student\/courses\/register\/[\w-]+\/swap$/) &&
    options.method === "PATCH"
) {
    const regId       = endpoint.split("/")[4];
    const { newCourseId } = JSON.parse(options.body);
    const newCourse   = MOCK_STUDENT_COURSES_REGISTRATION_COURSES.find(
        (c) => c.id.toString() === newCourseId.toString(),
    );
 
    if (!newCourse) return { success: false, error: "Course not found." };
 
    _studentCoursesMyRegistrations = _studentCoursesMyRegistrations.map((r) =>
        r.id === regId
            ? {
                  ...r,
                  courseId:   newCourse.id,
                  title:      newCourse.title,
                  courseCode: newCourse.courseCode,
                  instructor: newCourse.instructor,
                  credits:    newCourse.credits,
                  status:     "Pending",
                  appliedAt:  new Date().toISOString(),
              }
            : r,
    );
    return { success: true, data: _studentCoursesMyRegistrations };
}
 
// POST /student/courses/:cohortId/feedback — submit course feedback
if (
    endpoint.match(/^\/student\/courses\/\w+\/feedback$/) &&
    options.method === "POST"
) {
    // In production this would persist; for mock just acknowledge
    return { success: true, message: "Feedback recorded." };
}
 
		// Default mock response for unknown endpoints
		return { success: true, data: {} };
	}

	// Real API call
	try {
		const fullUrl = `${FINAL_API_BASE_URL}${endpoint}`;

		const response = await fetch(fullUrl, {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		if (!response.ok) {
			const errorText = await response.text();

			let errorData;
			try {
				errorData = JSON.parse(errorText);
			} catch (e) {
				errorData = { message: errorText || "Unknown error" };
			}

			// Special handling for authentication errors
			if (response.status === 401) {
				return {
					success: false,
					error: "Authentication required. Please log in again.",
					statusCode: 401,
				};
			}

			return {
				success: false,
				error: errorData.message || `HTTP ${response.status}`,
				statusCode: response.status,
			};
		}

		const data = await response.json();

		// Handle different response formats:
		// Standard format: { status: "success", data: {...} }
		// Message format: { message: "...", data: {...} }
		// Legacy format: { success: true, data: {...} }
		if (data.status === "success") {
			return { success: true, data: data.data || data };
		} else if (data.message && data.data !== undefined) {
			return { success: true, data: data.data };
		} else if (data.success === true) {
			return { success: true, data: data.data || data };
		} else {
			return { success: true, data };
		}
	} catch (error) {
		console.error("API call - Network error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// User/Profile APIs
export const userAPI = {
	// Get user dashboard overview
	getDashboardOverview: () => apiCall("/user/dashboard-overview"),

	// Get user details
	getUserDetails: (fields) => apiCall(`/user/details?fields=${fields}`),

	// Update user settings
	updateUserSettings: (settings) =>
		apiCall("/user/settings", {
			method: "PUT",
			body: JSON.stringify(settings),
		}),

	// Check username availability
	checkUsername: (username) =>
		apiCall(`/user/check-username?username=${username}`),

	// Submit a bug report
	submitBugReport: (formData) =>
		apiCall("/user/bug-report", {
			method: "POST",
			body: formData, // FormData is sent without JSON.stringify
		}),
};

// Course/Cohort APIs
export const courseAPI = {
	// Get course metadata by slug
	getCourseMetadata: (slug) => apiCall(`/cohort/slug/${slug}`),

	// Get course details
	getCourseDetails: (courseId) => apiCall(`/cohort/${courseId}/details`),

	// Get archived courses
	getArchivedCourses: () => apiCall("/cohort/archived"),

	// Get course members - update to get all members without pagination set the limit to 2k
	getCourseMembers: (courseId) =>
		apiCall(`/cohort/${courseId}/members?limit=2000&page=1`),

	// Get group details
	getGroupDetails: (groupId, cohortId = null) => {
		const url = cohortId
			? `/cohort/${cohortId}/group/${groupId}/details`
			: `/cohort/group/${groupId}/details`;
		return apiCall(url);
	},

	// Create course
	createCourse: (courseData) =>
		apiCall("/cohort/create", {
			method: "POST",
			body: JSON.stringify(courseData),
		}),

	// Update course
	updateCourse: (courseId, courseData) =>
		apiCall(`/cohort/edit/${courseId}`, {
			method: "PATCH",
			body: JSON.stringify(courseData),
		}),

	// Delete course
	deleteCourse: (courseId) =>
		apiCall(`/cohort/${courseId}`, {
			method: "DELETE",
		}),

	// Add detail section
	addDetailSection: (courseId, sectionData) =>
		apiCall(`/cohort/${courseId}/details/add`, {
			method: "POST",
			body: JSON.stringify(sectionData),
		}),

	// Edit detail section
	editDetailSection: (courseId, detailId, sectionData) =>
		apiCall(`/cohort/${courseId}/details/${detailId}/edit`, {
			method: "PATCH",
			body: JSON.stringify(sectionData),
		}),

	// Delete detail section
	deleteDetailSection: (courseId, detailId) =>
		apiCall(`/cohort/${courseId}/details/${detailId}`, {
			method: "DELETE",
		}),

	// Create group
	createGroup: (courseId, groupData) =>
		apiCall(`/cohort/${courseId}/group/create`, {
			method: "POST",
			body: JSON.stringify(groupData),
		}),

	// Update group
	updateGroup: (cohortId, groupId, groupData) =>
		apiCall(`/cohort/${cohortId}/group/${groupId}/edit`, {
			method: "PUT",
			body: JSON.stringify(groupData),
		}),

	// Delete group
	deleteGroup: (cohortId, groupId) =>
		apiCall(`/cohort/${cohortId}/group/${groupId}/delete`, {
			method: "DELETE",
		}),

	// Invite member to group
	inviteGroupMember: (courseId, groupId, inviteData) =>
		apiCall(`/cohort/${courseId}/group/${groupId}/invite`, {
			method: "POST",
			body: JSON.stringify(inviteData),
		}),

	// Accept group invite
	acceptGroupInvite: (token) =>
		apiCall("/cohort/group/accept-invite", {
			method: "POST",
			body: JSON.stringify({ token }),
		}),

	// Remove member from group
	removeGroupMember: (groupId, memberId) =>
		apiCall(`/cohort/group/${groupId}/remove-member`, {
			method: "DELETE",
			body: JSON.stringify({ targetUserId: memberId }),
		}),

	// Upload course participants (Excel file)
	uploadParticipants: async (courseId, file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const resp = await fetch(
				`${FINAL_API_BASE_URL}/cohort/${courseId}/invite`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);

			const contentType = resp.headers.get("content-type") || "";
			const isJson = contentType.includes("application/json");
			const body = isJson ? await resp.json().catch(() => ({})) : {};

			if (!resp.ok) {
				return {
					success: false,
					message: body.message || `HTTP ${resp.status}`,
				};
			}

			return { success: true, data: body };
		} catch (e) {
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		}
	},

	// Upload course projects (Excel file)
	uploadProjects: async (courseId, file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const resp = await fetch(
				`${FINAL_API_BASE_URL}/cohort/${courseId}/projects/upload`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);

			const contentType = resp.headers.get("content-type") || "";
			const isJson = contentType.includes("application/json");
			const body = isJson ? await resp.json().catch(() => ({})) : {};

			if (!resp.ok) {
				return {
					success: false,
					message: body.message || `HTTP ${resp.status}`,
				};
			}

			return { success: true, data: body };
		} catch (e) {
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		}
	},

	// Submit assignment
	submitAssignment: (courseId, submissionData, files = []) => {
		const formData = new FormData();
		formData.append("submission_title", submissionData.submission_title);
		formData.append(
			"submission_description",
			submissionData.submission_description,
		);
		if (submissionData.submission_url) {
			formData.append("submission_url", submissionData.submission_url);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		return fetch(`${API_BASE_URL}/cohort/${courseId}/submission`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},

	// Get student submission
	getSubmission: (courseId) => apiCall(`/cohort/${courseId}/submission`),

	// Update submission
	updateSubmission: (courseId, submissionData, files = []) => {
		const formData = new FormData();
		formData.append("submission_title", submissionData.submission_title);
		formData.append(
			"submission_description",
			submissionData.submission_description,
		);
		if (submissionData.submission_url) {
			formData.append("submission_url", submissionData.submission_url);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		return fetch(`${API_BASE_URL}/cohort/${courseId}/submission`, {
			method: "PUT",
			credentials: "include",
			body: formData,
		});
	},

	// Delete/unsubmit assignment
	deleteSubmission: (courseId) =>
		apiCall(`/cohort/${courseId}/submission`, {
			method: "DELETE",
		}),

	// Get available members for group (FIXED)
	getAvailableMembers: (cohortId, groupId) =>
		apiCall(`/cohort/${cohortId}/available-members/${groupId}`),

	// Add members to group (FIXED)
	addMembersToGroup: (groupId, memberUserIds) =>
		apiCall(`/cohort/group/${groupId}/add-members`, {
			method: "POST",
			body: JSON.stringify({ memberUserIds }),
		}),

	joinCourseWithInvitation: async (data) => {
		try {
			const response = await apiCall("/cohort/join-with-invitation", {
				method: "POST",
				body: JSON.stringify(data),
			});
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to join course",
			};
		}
	},

	getCourseByInvitation: async (token) => {
		try {
			const response = await apiCall(
				`/cohort/invitation-info?token=${token}`,
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to get course info",
			};
		}
	},

	generateInvitationLink: async (cohortId) => {
		try {
			const response = await apiCall(
				`/cohort/${cohortId}/invitation-link`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to generate invitation link",
			};
		}
	},

	// Remove course participant (creator only)
	removeCourseParticipant: (cohortId, targetUserId) =>
		apiCall(`/cohort/${cohortId}/participants/remove`, {
			method: "DELETE",
			body: JSON.stringify({ targetUserId }),
		}),

	// Assignment Management APIs
	// Get all assignments for a cohort
	getAssignments: (cohortId) => apiCall(`/cohort/${cohortId}/assignments`),

	// Create a new assignment
	createAssignment: (cohortId, assignmentData) =>
		apiCall(`/cohort/${cohortId}/assignments`, {
			method: "POST",
			body: JSON.stringify(assignmentData),
		}),

	// Update an existing assignment
	updateAssignment: (cohortId, assignmentId, assignmentData) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}`, {
			method: "PUT",
			body: JSON.stringify(assignmentData),
		}),

	// Delete an assignment
	deleteAssignment: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}`, {
			method: "DELETE",
		}),

	// Assignment Submission APIs

	// Mark assignment as submitted
	markAssignmentSubmitted: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submit`, {
			method: "POST",
		}),

	// Get user's submission status for assignments
	getSubmissionStatus: (cohortId, assignmentIds = null) => {
		const url = `/cohort/${cohortId}/assignments/submissions/status`;
		const queryParams = assignmentIds
			? `?assignmentIds=${assignmentIds.join(",")}`
			: "";
		return apiCall(`${url}${queryParams}`);
	},

	// Get all submissions for a specific assignment (for professors)
	getAssignmentSubmissions: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submissions`),

	// Remove assignment submission (unmark as submitted)
	unmarkAssignmentSubmitted: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submit`, {
			method: "DELETE",
		}),

	// Grade individual assignment
	gradeAssignment: (
		cohortId,
		assignmentId,
		studentId,
		marksAwarded,
		comments = "",
	) =>
		apiCall(`/cohort/assignments/${assignmentId}/grade`, {
			method: "POST",
			body: JSON.stringify({
				studentId,
				cohortId,
				marksAwarded,
				comments,
			}),
		}),

	// Grade group assignment via leader
	gradeGroupAssignment: (
		cohortId,
		assignmentId,
		leaderId,
		marksAwarded,
		comments = "",
	) =>
		apiCall(`/cohort/assignments/${assignmentId}/grade-group`, {
			method: "POST",
			body: JSON.stringify({
				leaderId,
				cohortId,
				marksAwarded,
				comments,
			}),
		}),

	// Get grades for a cohort
	getGrades: (cohortId, assignmentIds = null) => {
		const url = `/cohort/cohorts/${cohortId}/grades`;
		const queryParams = assignmentIds
			? `?assignmentIds=${assignmentIds.join(",")}`
			: "";
		return apiCall(`${url}${queryParams}`);
	},

	// Get materials for a cohort
	getMaterials: (cohortId) => apiCall(`/cohort/${cohortId}/materials`),

	// Create a new material
	createMaterial: (cohortId, materialData) =>
		apiCall(`/cohort/${cohortId}/materials`, {
			method: "POST",
			body: JSON.stringify(materialData),
		}),

	// Update a material
	updateMaterial: (cohortId, materialId, materialData) =>
		apiCall(`/cohort/${cohortId}/materials/${materialId}`, {
			method: "PUT",
			body: JSON.stringify(materialData),
		}),

	// Delete a material
	deleteMaterial: (cohortId, materialId) =>
		apiCall(`/cohort/${cohortId}/materials/${materialId}`, {
			method: "DELETE",
		}),

	// Resources Management APIs
	// Get all resources for a cohort
	getResources: (cohortId) => apiCall(`/cohort/${cohortId}/resources`),

	// Create a new week
	createWeek: (cohortId, weekData) =>
		apiCall(`/cohort/${cohortId}/resources/week`, {
			method: "POST",
			body: JSON.stringify(weekData),
		}),

	// Update a week
	updateWeek: (cohortId, weekId, weekData) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "PUT",
			body: JSON.stringify(weekData),
		}),

	// Delete a week
	deleteWeek: (cohortId, weekId) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "DELETE",
		}),

	// Create a new resource
	createResource: (cohortId, weekId, resourceData) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "POST",
			body: JSON.stringify(resourceData),
		}),

	// Update a resource
	updateResource: (cohortId, resourceId, resourceData) =>
		apiCall(`/cohort/${cohortId}/resources/${resourceId}`, {
			method: "PUT",
			body: JSON.stringify(resourceData),
		}),

	// Delete a resource
	deleteResource: (cohortId, resourceId) =>
		apiCall(`/cohort/${cohortId}/resources/${resourceId}`, {
			method: "DELETE",
		}),
	// Archive course
	archiveCourse: (courseId) =>
		apiCall(`/cohort/${courseId}/archive`, {
			method: "POST",
		}),

	// Check and auto-archive expired courses
	checkAndArchiveExpiredCourses: () =>
		apiCall("/cohort/check-expired", {
			method: "POST",
		}),
};

// Keep the old cohortAPI for backward compatibility
export const cohortAPI = {
	...courseAPI,

	// Delete course (alias for courseAPI.deleteCourse)
	deleteCourse: (courseId) => courseAPI.deleteCourse(courseId),

	// Leaderboard APIs
	getLeaderboard: (cohortId) => apiCall(`/cohort/${cohortId}/leaderboard`),
	getIndividualLeaderboard: (cohortId) =>
		apiCall(`/cohort/${cohortId}/leaderboard/individuals`),
	getGroupLeaderboard: (cohortId) =>
		apiCall(`/cohort/${cohortId}/leaderboard/groups`),

	// Board/Posts APIs
	getBoardPosts: (cohortId) => apiCall(`/cohort/${cohortId}/posts`),
	createPost: (cohortId, postData) =>
		apiCall(`/cohort/${cohortId}/posts`, {
			method: "POST",
			body: JSON.stringify(postData),
		}),
	updatePost: (cohortId, postId, postData) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}`, {
			method: "PUT",
			body: JSON.stringify(postData),
		}),
	deletePost: (cohortId, postId) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}`, {
			method: "DELETE",
		}),
	likePost: (cohortId, postId) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}/like`, {
			method: "POST",
		}),

	// Events APIs
	getEvents: (cohortId) => apiCall(`/cohort/${cohortId}/events`),
	createEvent: (cohortId, eventData) =>
		apiCall(`/cohort/${cohortId}/events`, {
			method: "POST",
			body: JSON.stringify(eventData),
		}),
	updateEvent: (cohortId, eventId, eventData) =>
		apiCall(`/cohort/${cohortId}/events/${eventId}`, {
			method: "PUT",
			body: JSON.stringify(eventData),
		}),
	deleteEvent: (cohortId, eventId) =>
		apiCall(`/cohort/${cohortId}/events/${eventId}`, {
			method: "DELETE",
		}),

	// Notes APIs
	getNotes: (cohortId) => apiCall(`/cohort/${cohortId}/notes`),
	createNote: (cohortId, noteData) =>
		apiCall(`/cohort/${cohortId}/notes`, {
			method: "POST",
			body: JSON.stringify(noteData),
		}),
	updateNote: (cohortId, noteId, noteData) =>
		apiCall(`/cohort/${cohortId}/notes/${noteId}`, {
			method: "PUT",
			body: JSON.stringify(noteData),
		}),
	deleteNote: (cohortId, noteId) =>
		apiCall(`/cohort/${cohortId}/notes/${noteId}`, {
			method: "DELETE",
		}),

	generateInvitationLink: async (cohortId) => {
		// Delegate to courseAPI to ensure consistent base URL usage
		return courseAPI.generateInvitationLink(cohortId);
	},

	joinWithInvitation: async (token, email = null) => {
		try {
			const response = await fetch(
				`/api/v1/cohort/join-with-invitation`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token, email }),
				},
			);

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Unknown error" }));
				return {
					success: false,
					message: errorData.message || `HTTP ${response.status}`,
				};
			}

			const data = await response.json();
			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				message: "Failed to join course",
			};
		}
	},

	getInvitationStatus: async (cohortId, email) => {
		try {
			const response = await apiCall(
				`/cohort/${cohortId}/invitation-status?email=${email}`,
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to get invitation status",
			};
		}
	},
};

// Notifications APIs
export const notificationsAPI = {
    // Fetches all informational updates and status changes
    getNotifications: () => apiCall("/notifications"),
    // Placeholder for marking items as read
    markAsRead: (id) => apiCall(`/notifications/${id}/read`, { method: "POST" }),
};

// Job Tray APIs
export const jobTrayAPI = {
	// Fetches the aggregated pending actions from the server
	getPendingJobs: () => apiCall("/job-tray"),
};

// Upload APIs
export const uploadAPI = {
	// Upload file (general purpose)
	uploadFile: (file, type) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", type);

		return fetch(`${API_BASE_URL}/upload/file`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},

	uploadProfilePicture: (file) => {
		if (USE_MOCK_API) {
			return Promise.resolve({
				ok: true,
				json: async () => ({ path: `avatars/mock_${file.name}` }),
			});
		}
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "0");
		return fetch(`${FINAL_API_BASE_URL}/upload/file`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},
};

// Devkit APIs (for development/testing)
export const devkitAPI = {
	// Get devkit data
	getDevkitData: () => apiCall("/devkit"),

	// Create test data
	createTestData: (data) =>
		apiCall("/devkit/create-test-data", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};

// Announcements APIs
export const announcementsAPI = {
	// Get all announcements for a cohort
	getAnnouncements: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;

					const allData = getAnnouncementsFromStorage();

					// Only add default announcement if cohort doesn't exist in storage yet (first time)
					// Don't overwrite if it's just an empty array (user might have deleted all)
					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [
							createDefaultAnnouncement(cohortId),
						];
						saveAnnouncementsToStorage(allData);
					}

					// Auto-archive announcements older than 2 days on each fetch
					const announcements = allData[cohortId] || [];
					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
					let hasChanges = false;

					announcements.forEach((announcement) => {
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false; // Unpin archived announcements
							hasChanges = true;
						}

						// Set upvoted_by_current_user flag for each reply
						if (announcement.replies) {
							announcement.replies.forEach((reply) => {
								if (!reply.upvoted_by_user_ids) {
									reply.upvoted_by_user_ids = [];
								}
								reply.upvoted_by_current_user =
									reply.upvoted_by_user_ids.includes(userId);
								reply.upvotes =
									reply.upvoted_by_user_ids.length;
							});
						}
					});

					// Save if any announcements were archived
					if (hasChanges) {
						saveAnnouncementsToStorage(allData);
					}

					resolve({
						success: true,
						data: allData[cohortId] || [],
					});
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`);
	},

	// Create new announcement (Professor only)
	createAnnouncement: async (cohortId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}

					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);

					// Auto-archive announcements older than 2 days and unpin them
					allData[cohortId].forEach((announcement) => {
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false; // Unpin archived announcements
						}
					});

					// Create new announcement - always pinned by default
					const newAnnouncement = {
						id: Date.now(),
						...announcementData,
						author_name: "Prof. Jane Smith",
						author_id: 1,
						created_at: now.toISOString(),
						updated_at: now.toISOString(),
						is_pinned: true, // All new announcements are pinned
						is_archived: false,
						expiry_date: null,
						view_count: 0,
						replies_count: 0,
						replies: [],
					};

					// Add new announcement to the beginning of the array
					allData[cohortId] = [newAnnouncement, ...allData[cohortId]];
					saveAnnouncementsToStorage(allData);

					resolve({
						success: true,
						data: newAnnouncement,
					});
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`, {
			method: "POST",
			body: JSON.stringify(announcementData),
		});
	},

	// Update announcement (Professor only)
	updateAnnouncement: async (cohortId, announcementId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);
					if (index !== -1) {
						announcements[index] = {
							...announcements[index],
							...announcementData,
							updated_at: new Date().toISOString(),
						};
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcements[index],
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "PUT",
			body: JSON.stringify(announcementData),
		});
	},

	// Delete announcement (Professor only)
	deleteAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);
					if (index !== -1) {
						announcements.splice(index, 1);
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							message: "Announcement deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "DELETE",
		});
	},

	// Pin/Unpin announcement (Professor only)
	togglePinAnnouncement: async (cohortId, announcementId, isPinned) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						// If pinning this announcement, unpin all others
						if (isPinned) {
							announcements.forEach((a) => {
								if (a.id !== announcementId) {
									a.is_pinned = false;
								}
							});
						}
						announcement.is_pinned = isPinned;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/pin`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_pinned: isPinned }),
			},
		);
	},

	// Archive announcement (Professor only)
	archiveAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						announcement.is_archived = true;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/archive`,
			{
				method: "PATCH",
			},
		);
	},

	// Add reply to announcement thread
	addReply: async (cohortId, announcementId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
							upvotes: 0,
							upvoted_by_user_ids: [], // Track who upvoted this reply
							upvoted_by_current_user: false,
							is_official: replyData.is_official || false,
						};
						if (!announcement.replies) {
							announcement.replies = [];
						}
						announcement.replies.push(newReply);
						announcement.replies_count =
							announcement.replies.length;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: newReply,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Update reply
	updateReply: async (cohortId, announcementId, replyId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const reply = announcement.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							Object.assign(reply, replyData, {
								updated_at: new Date().toISOString(),
							});
							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}`,
			{
				method: "PUT",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Delete reply
	deleteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const index = announcement.replies.findIndex(
							(r) => r.id === replyId,
						);
						if (index !== -1) {
							announcement.replies.splice(index, 1);
							announcement.replies_count =
								announcement.replies.length;
							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								message: "Reply deleted successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}`,
			{
				method: "DELETE",
			},
		);
	},

	// Upvote a reply/question
	upvoteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;

					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const reply = announcement.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Initialize upvoted_by_user_ids array if it doesn't exist
							if (!reply.upvoted_by_user_ids) {
								reply.upvoted_by_user_ids = [];
							}

							const userIndex =
								reply.upvoted_by_user_ids.indexOf(userId);

							// Toggle upvote
							if (userIndex > -1) {
								// User already upvoted, remove upvote
								reply.upvoted_by_user_ids.splice(userIndex, 1);
							} else {
								// User hasn't upvoted, add upvote
								reply.upvoted_by_user_ids.push(userId);
							}

							// Update upvote count and current user status
							reply.upvotes = reply.upvoted_by_user_ids.length;
							reply.upvoted_by_current_user =
								reply.upvoted_by_user_ids.includes(userId);

							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}/upvote`,
			{
				method: "POST",
			},
		);
	},

	// Lock/Unlock thread (Professor only)
	toggleLockThread: async (cohortId, announcementId, isLocked) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						announcement.is_locked = isLocked;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/lock`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_locked: isLocked }),
			},
		);
	},
};

// LocalStorage helpers for announcements
const ANNOUNCEMENTS_STORAGE_KEY = "funkey_announcements";

const loadAnnouncementsFromStorage = () => {
	try {
		const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading announcements from storage:", error);
		return null;
	}
};

const saveAnnouncementsToStorage = (announcements) => {
	try {
		localStorage.setItem(
			ANNOUNCEMENTS_STORAGE_KEY,
			JSON.stringify(announcements),
		);
	} catch (error) {
		console.error("❌ Error saving announcements to storage:", error);
	}
};

// Default announcement template for all courses
const createDefaultAnnouncement = (cohortId, courseName = "this course") => ({
	id: Date.now() + cohortId,
	title: "Welcome to the Course!",
	content: `Welcome to ${courseName}! This is your course announcement board. Your instructor will post important updates, assignment deadlines, exam schedules, and other course-related information here. Make sure to check regularly for new announcements.`,
	tags: ["General"],
	priority: null,
	is_pinned: true,
	is_archived: false,
	is_locked: false,
	expiry_date: null,
	author_name: "Course Instructor",
	author_id: 1,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	view_count: 0,
	replies_count: 0,
	replies: [],
});

// General Chat APIs
export const generalChatAPI = {
	// Get all chat messages for a cohort
	getMessages: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();

					// Initialize with empty array if first time
					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [];
						saveChatMessagesToStorage(allData);
					}

					resolve({
						success: true,
						data: allData[cohortId] || [],
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat`);
	},

	// Send a chat message
	sendMessage: async (cohortId, messageData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();

					const newMessage = {
						id: Date.now(),
						...messageData,
						created_at: new Date().toISOString(),
					};

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}
					allData[cohortId].push(newMessage);
					saveChatMessagesToStorage(allData);

					resolve({
						success: true,
						data: newMessage,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat`, {
			method: "POST",
			body: JSON.stringify(messageData),
		});
	},

	// Delete a chat message (optional - for professors/message owners)
	deleteMessage: async (cohortId, messageId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();
					const messages = allData[cohortId] || [];
					const index = messages.findIndex((m) => m.id === messageId);

					if (index !== -1) {
						messages.splice(index, 1);
						saveChatMessagesToStorage(allData);
						resolve({
							success: true,
							message: "Message deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Message not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat/${messageId}`, {
			method: "DELETE",
		});
	},
};

// Student Discussions APIs
export const studentDiscussionsAPI = {
	// Get all discussions for a cohort
	getDiscussions: async (cohortId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();

					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [];
						saveDiscussionsToStorage(allData);
					}

					const discussions = allData[cohortId] || [];
					let needsSave = false;

					// Auto-archive discussions older than 2 days
					const twoDaysAgo = new Date();
					twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

					discussions.forEach((discussion) => {
						const createdDate = new Date(discussion.created_at);
						if (
							createdDate < twoDaysAgo &&
							!discussion.is_archived
						) {
							discussion.is_archived = true;
							needsSave = true;
						}
					});

					// Migrate old data and set liked_by_current_user flag for each discussion and reply based on userId
					discussions.forEach((discussion) => {
						// Migrate old format to new format
						if (!discussion.liked_by_user_ids) {
							discussion.liked_by_user_ids = [];
							// If there was an old liked_by_current_user flag set to true, we can't know which user it was
							// so we'll just start fresh
							discussion.likes_count = 0;
							needsSave = true;
						}

						// Ensure likes_count matches the array length
						discussion.likes_count =
							discussion.liked_by_user_ids.length;
						discussion.liked_by_current_user =
							discussion.liked_by_user_ids.includes(userId);

						// Also migrate and set for replies
						if (discussion.replies) {
							discussion.replies.forEach((reply) => {
								if (!reply.liked_by_user_ids) {
									reply.liked_by_user_ids = [];
									reply.likes_count = 0;
									needsSave = true;
								}

								// Ensure likes_count matches the array length
								reply.likes_count =
									reply.liked_by_user_ids.length;
								reply.liked_by_current_user =
									reply.liked_by_user_ids.includes(userId);
							});
						}
					});

					// Save if we migrated any data
					if (needsSave) {
						saveDiscussionsToStorage(allData);
					}

					resolve({
						success: true,
						data: discussions,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions`);
	},

	// Create a new discussion
	createDiscussion: async (cohortId, discussionData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();

					const newDiscussion = {
						id: Date.now(),
						...discussionData,
						created_at: new Date().toISOString(),
						likes_count: 0,
						liked_by_user_ids: [], // Track who liked this discussion
						liked_by_current_user: false,
						replies: [],
					};

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}
					allData[cohortId].unshift(newDiscussion);
					saveDiscussionsToStorage(allData);

					resolve({
						success: true,
						data: newDiscussion,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions`, {
			method: "POST",
			body: JSON.stringify(discussionData),
		});
	},

	// Delete a discussion (owner only)
	deleteDiscussion: async (cohortId, discussionId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const index = discussions.findIndex(
						(d) => d.id === discussionId,
					);

					if (index !== -1) {
						discussions.splice(index, 1);
						saveDiscussionsToStorage(allData);
						resolve({
							success: true,
							message: "Discussion deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
			method: "DELETE",
		});
	},

	// Edit a discussion (owner only)
	editDiscussion: async (cohortId, discussionId, updatedData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						// Update the discussion fields
						discussion.title =
							updatedData.title || discussion.title;
						discussion.content =
							updatedData.content || discussion.content;
						discussion.edited_at = new Date().toISOString();

						saveDiscussionsToStorage(allData);
						resolve({
							success: true,
							data: discussion,
							message: "Discussion updated successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
			method: "PUT",
			body: JSON.stringify(updatedData),
		});
	},

	// Like a discussion
	likeDiscussion: async (cohortId, discussionId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						// Initialize liked_by_user_ids array if it doesn't exist
						if (!discussion.liked_by_user_ids) {
							discussion.liked_by_user_ids = [];
						}

						const userIndex =
							discussion.liked_by_user_ids.indexOf(userId);

						if (userIndex > -1) {
							// User already liked it, so unlike it
							discussion.liked_by_user_ids.splice(userIndex, 1);
						} else {
							// User hasn't liked it yet, so add their like
							discussion.liked_by_user_ids.push(userId);
						}

						// Update the count based on unique user IDs
						discussion.likes_count =
							discussion.liked_by_user_ids.length;
						discussion.liked_by_current_user =
							discussion.liked_by_user_ids.includes(userId);

						saveDiscussionsToStorage(allData);
						resolve({
							success: true,
							data: discussion,
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}/like`, {
			method: "POST",
		});
	},

	// Add reply to discussion
	addReply: async (cohortId, discussionId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							likes_count: 0,
							liked_by_user_ids: [], // Track who liked this reply
							liked_by_current_user: false,
						};

						if (!discussion.replies) {
							discussion.replies = [];
						}
						discussion.replies.push(newReply);
						saveDiscussionsToStorage(allData);

						resolve({
							success: true,
							data: newReply,
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Delete reply (owner only)
	deleteReply: async (cohortId, discussionId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion && discussion.replies) {
						const index = discussion.replies.findIndex(
							(r) => r.id === replyId,
						);
						if (index !== -1) {
							discussion.replies.splice(index, 1);
							saveDiscussionsToStorage(allData);
							resolve({
								success: true,
								message: "Reply deleted successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}`,
			{
				method: "DELETE",
			},
		);
	},

	// Edit reply (owner only)
	editReply: async (cohortId, discussionId, replyId, updatedData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion && discussion.replies) {
						const reply = discussion.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Update the reply content
							reply.content =
								updatedData.content || reply.content;
							reply.edited_at = new Date().toISOString();

							saveDiscussionsToStorage(allData);
							resolve({
								success: true,
								data: reply,
								message: "Reply updated successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}`,
			{
				method: "PUT",
				body: JSON.stringify(updatedData),
			},
		);
	},

	// Like a reply
	likeReply: async (cohortId, discussionId, replyId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion && discussion.replies) {
						const reply = discussion.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Initialize liked_by_user_ids array if it doesn't exist
							if (!reply.liked_by_user_ids) {
								reply.liked_by_user_ids = [];
							}

							const userIndex =
								reply.liked_by_user_ids.indexOf(userId);

							if (userIndex > -1) {
								// User already liked it, so unlike it
								reply.liked_by_user_ids.splice(userIndex, 1);
							} else {
								// User hasn't liked it yet, so add their like
								reply.liked_by_user_ids.push(userId);
							}

							// Update the count based on unique user IDs
							reply.likes_count = reply.liked_by_user_ids.length;
							reply.liked_by_current_user =
								reply.liked_by_user_ids.includes(userId);

							saveDiscussionsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}/like`,
			{
				method: "POST",
			},
		);
	},
};

// LocalStorage helpers for chat
const CHAT_STORAGE_KEY = "funkey_general_chat";

const loadChatMessagesFromStorage = () => {
	try {
		const stored = localStorage.getItem(CHAT_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading chat messages from storage:", error);
		return null;
	}
};

const saveChatMessagesToStorage = (messages) => {
	try {
		localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
	} catch (error) {
		console.error("❌ Error saving chat messages to storage:", error);
	}
};

const getChatMessagesFromStorage = () => {
	const stored = loadChatMessagesFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object
	const initial = {};
	saveChatMessagesToStorage(initial);
	return initial;
};

// LocalStorage helpers for discussions
const DISCUSSIONS_STORAGE_KEY = "funkey_student_discussions";

const loadDiscussionsFromStorage = () => {
	try {
		const stored = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading discussions from storage:", error);
		return null;
	}
};

const saveDiscussionsToStorage = (discussions) => {
	try {
		localStorage.setItem(
			DISCUSSIONS_STORAGE_KEY,
			JSON.stringify(discussions),
		);
	} catch (error) {
		console.error("❌ Error saving discussions to storage:", error);
	}
};

const getDiscussionsFromStorage = () => {
	const stored = loadDiscussionsFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object
	const initial = {};
	saveDiscussionsToStorage(initial);
	return initial;
};

// Helper to get current announcements from storage (always fresh)
const getAnnouncementsFromStorage = () => {
	const stored = loadAnnouncementsFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object (cohorts added on first access)
	const initial = {};
	saveAnnouncementsToStorage(initial);
	return initial;
};

export const studentMeetingsAPI = {
	// Get all meeting requests for a specific cohort
	getMeetingRequests: (cohortId) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests`),

	// Get accepted meetings for a specific cohort
	getAcceptedMeetings: (cohortId) =>
		apiCall(`/cohort/${cohortId}/student/meetings`),

	// Create a new meeting request for a professor
	createMeetingRequest: (cohortId, meetingData) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests`, {
			method: "POST",
			body: JSON.stringify(meetingData),
		}),

	// Cancel a pending meeting request
	cancelMeetingRequest: (cohortId, requestId) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests/${requestId}`, {
			method: "DELETE",
		}),
};

// Schedule & Meetings APIs
export const scheduleAPI = {
	// Get professor's schedule, meetings, and pending requests
	getScheduleOverview: () => apiCall("/professor/schedule"),

	// Update office hours and weekly timetable
	updateSchedule: (scheduleData) =>
		apiCall("/professor/schedule", {
			method: "PUT",
			body: JSON.stringify(scheduleData),
		}),

	// Create a new meeting/event directly from the schedule view
    createMeeting: (meetingData) =>
        apiCall("/professor/meetings", {
            method: "POST",
            body: JSON.stringify(meetingData),
        }),

	// Accept a meeting request with venue/link details
	acceptMeetingRequest: (requestId, details) =>
		apiCall(`/professor/meetings/${requestId}/accept`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	// Reject a meeting request with a reason
	rejectMeetingRequest: (requestId, reason) =>
		apiCall(`/professor/meetings/${requestId}/reject`, {
			method: "POST",
			body: JSON.stringify({ reason }),
		}),

	// Propose a new time for a meeting request
	rescheduleMeetingRequest: (requestId, newDateTime) =>
		apiCall(`/professor/meetings/${requestId}/reschedule`, {
			method: "POST",
			body: JSON.stringify({ newDateTime }),
		}),
};

// Library APIs
export const libraryAPI = {
	// Retrieves library dashboard data
	getLibraryDashboard: () => apiCall("/library/dashboard"),

	// Requests a book from the library
	requestBook: (bookId, durationDays) =>
		apiCall("/library/request", {
			method: "POST",
			body: JSON.stringify({ bookId, durationDays }),
		}),

	// Cancels an existing request
	cancelRequest: (requestId) =>
		apiCall(`/library/requests/${requestId}`, { method: "DELETE" }),

	// Initiates a return process for a borrowed book
	returnBook: (bookId) =>
		apiCall("/library/return", {
			method: "POST",
			body: JSON.stringify({ bookId }),
		}),

	// Extends the due date of a borrowed book
	requestExtension: (bookId, additionalDays) =>
		apiCall("/library/extend", {
			method: "POST",
			body: JSON.stringify({ bookId, additionalDays }),
		}),

	// Add to your existing libraryAPI object
	approveExtension: (requestId, bookId, additionalDays) =>
		apiCall("/library/approve-extension", {
			method: "POST",
			body: JSON.stringify({ requestId, bookId, additionalDays }),
		}),
};

// Maintenance Requests APIs
export const maintenanceAPI = {
    // Retrieves all maintenance requests
    getMyRequests: () => apiCall("/maintenance/my-requests", { method: "GET" }),

    // Submits a new maintenance request
    createRequest: (requestData) =>
        apiCall("/maintenance/requests", {
            method: "POST",
            body: JSON.stringify(requestData),
        }),

    // Updates the status of an existing maintenance request
    updateStatus: (requestId, statusData) =>
        apiCall(`/maintenance/requests/${requestId}/status`, {
            method: "PATCH",
            body: JSON.stringify(statusData),
        }),
};

// Session Planning APIs
export const sessionPlanningAPI = {
    // Fetches all course schedules for the user
    getSchedules: () => apiCall("/sessions/schedules"),
    
    // Fetches classes scheduled specifically for the current day
    getTodaysClasses: () => apiCall("/sessions/today"),
    
    // Submits teacher reflections for a specific session
    saveReflection: (data) =>
        apiCall("/sessions/reflections", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Retrieves reflections, optionally filtered by section
    getReflections: (sectionId) =>
        apiCall(
            `/sessions/reflections${sectionId ? `?sectionId=${sectionId}` : ""}`
        ),

    // Retrieves uploaded documents (Syllabus, Lesson Plans, etc.) for a course
    getDocuments: (courseId) => apiCall(`/sessions/documents/${courseId}`),
    
	// Upload documents for a course
    uploadDocuments: (courseId, filesMap) => {
        // Extract names to pass to mock handler
        const fileNames = {};
        Object.keys(filesMap).forEach(key => {
            fileNames[key] = filesMap[key].name;
        });

        return apiCall(`/sessions/documents/${courseId}/bulk`, {
            method: "POST",
            body: JSON.stringify({ 
                courseId, 
                docs: Object.keys(filesMap),
                fileNames: fileNames // Added for mock realism
            }),
        });
    },
};

// Asset Requests APIs
export const assetAPI = {
	// Retrieves the list of all campus assets
	getAssets: () => apiCall("/assets/list"),

	// Retrieves booking requests associated with the user
	getRequests: () => apiCall("/assets/requests"),

	// Creates a new asset booking request
	createRequest: (requestData) =>
		apiCall("/assets/requests", {
			method: "POST",
			body: JSON.stringify(requestData),
		}),

	// Updates an existing asset booking request
	updateRequest: (requestId, requestData) =>
		apiCall(`/assets/requests/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(requestData),
		}),
};

// Attendance APIs
export const attendanceAPI = {
	// Fetches attendance logs for the professor
	getProfessorLogs: () => apiCall("/professor/logs"),

	// Fetches attendance logs for a specific cohort.
	getAttendanceLogs: (cohortId) => apiCall(`/attendance/logs/${cohortId}`),

	// Marks attendance for a specific course.
	markAttendance: (courseId, data) =>
		apiCall(`/courses/${courseId}/attendance`, {
			method: "POST",
			body: JSON.stringify(data),
		}),
};

// Expenses APIs
export const expensesAPI = {
	// Retrieves the list of all expenses
	getExpenses: () => apiCall("/expenses/list"),

	// Submits a new expense report
	createExpense: (expenseData) =>
		apiCall("/expenses/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(expenseData),
		}),

	// Updates an existing expense record.
	updateExpense: (expenseId, expenseData) =>
		apiCall(`/expenses/${expenseId}/update`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(expenseData),
		}),

	// Deletes a specific expense record
	deleteExpense: (expenseId) =>
		apiCall(`/expenses/${expenseId}`, {
			method: "DELETE",
		}),
};

// Advances APIs
export const advancesAPI = {
	// Retrieves the list of all advances
	getAdvances: () => apiCall("/advances/list"),

	// Submits a new advance request
	createAdvance: (advanceData) =>
		apiCall("/advances/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(advanceData),
		}),

	// Updates an existing advance request.
	updateAdvance: (advanceId, advanceData) =>
		apiCall(`/advances/${advanceId}/update`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(advanceData),
		}),

	// Deletes a specific advance request
	deleteAdvance: (advanceId) =>
		apiCall(`/advances/${advanceId}`, {
			method: "DELETE",
		}),
};

// Exam APIs
export const examAPI = {
	// Fetches the complete exam schedule for the user
	getDuties: () => apiCall("/exams/duties"),

	// Handles check-in or rejection status
	updateDutyStatus: (id, payload) =>
		apiCall("/exams/duty/status", {
			method: "POST",
			body: { id, ...payload },
		}),
};

// Leave Management APIs
export const leaveAPI = {
	// Retrieves the user's leave balance and history
	getApplications: () => apiCall("/leaves/applications"),

	// Submits a new leave application with structured timing data
	createApplication: (data) =>
		apiCall("/leaves/apply", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Updates an existing leave application (used for resubmission or editing)
	updateApplication: (id, data) =>
		apiCall(`/leaves/update/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Updates approval status by HoD or HR
	updateApproval: (id, role, action, remark = null) =>
		apiCall(`/leaves/approve/${id}`, {
			method: "POST",
			body: JSON.stringify({ role, action, remark }),
		}),

	// Responds to an incoming substitution request
	respondToSubstitution: (id, action) =>
		apiCall(`/leaves/substitutions/${id}`, {
			method: "POST",
			body: JSON.stringify({ action }),
		}),
};

// Payroll APIs
export const payrollAPI = {
	// Retrieves payroll history and details for the user
	getHistory: () => apiCall("/payroll/history"),

	// Retrieves the breakdown of the current month's salary
	getBreakdown: () => apiCall("/payroll/breakdown"),

	// Updated to accept the full item object for PDF generation
	downloadPayslip: (item) => apiCall(`/payroll/download/${item.id}`),
};

// Bulletin APIs
export const bulletinAPI = {
	// Fetches bulletins based on level (institution, department, course)
	getBulletins: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return apiCall(`/bulletins${query ? `?${query}` : ""}`);
	},

	// Creates a new bulletin with priority and attachment support
	createBulletin: (data) =>
		apiCall("/bulletins", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Deletes a specific bulletin
	deleteBulletin: (bulletinId) =>
		apiCall(`/bulletins/${bulletinId}`, {
			method: "DELETE",
		}),
};

// Research & Publications APIs
export const researchAPI = {
	// Aggregates all research data (projects, publications, and applications) into one response
	getResearchDashboard: () => apiCall("/research/dashboard-sync"),

	// Handles creation of new research entries
	createResearch: (data) =>
		apiCall("/research/create", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Handles updates to existing research entries
	updateResearch: (id, data) =>
		apiCall(`/research/update/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	// API calls for managing specific roles within a research item.
	createRole: (researchId, roleData) =>
		apiCall(`/research/${researchId}/roles/create`, {
			method: "POST",
			body: JSON.stringify(roleData),
		}),

	updateRole: (researchId, roleIndex, roleData) =>
		apiCall(`/research/${researchId}/roles/update/${roleIndex}`, {
			method: "PUT",
			body: JSON.stringify(roleData),
		}),

	// Deletes an open role
	deleteRole: (researchId, roleId) =>
		apiCall(`/research/${researchId}/roles/delete/${roleId}`, {
			method: "DELETE",
		}),

	// Timeline management for tracking project milestones and contributions chronologically
	getTimeline: (researchId) => apiCall(`/research/timeline/${researchId}`),

	addTimelineEvent: (researchId, eventData) =>
		apiCall(`/research/timeline/${researchId}`, {
			method: "POST",
			body: JSON.stringify(eventData),
		}),

	// Deletes a timeline event
	deleteTimelineEvent: (researchId, eventId) =>
		apiCall(`/research/timeline/${researchId}/${eventId}`, {
			method: "DELETE",
		}),

	// Updates an existing milestone in the timeline
	updateTimelineEvent: (researchId, eventId, eventData) =>
		apiCall(`/research/timeline/${researchId}/${eventId}`, {
			method: "PUT",
			body: JSON.stringify(eventData),
		}),

	// Request joining another project/publication
	newApplication: (id, data) =>
		apiCall(`/research/apply/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Handles application status changes
	handleApplication: (applicationId, action, details) =>
		apiCall(`/research/applications/${applicationId}/${action}`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	updateApplicationStatus: (applicationId, action, details) =>
		apiCall(`/research/applications/${applicationId}/${action}`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	// Toggles the starred status of a research project or publication.
	toggleStar: (id) =>
		apiCall(`/research/star/${id}`, {
			method: "POST",
		}),

	// Fetches user profiles to display contributors, applicants, and professors.
	getUsers: () => apiCall("/research/users"),

	getUserById: (userId) => apiCall(`/research/users/${userId}`),

	getUserProfile: (userId) => apiCall(`/research/users/profile/${userId}`),

	// Updates a user's profile information (bio, skills, and social URLs).
	updateUserProfile: (userId, profileData) =>
		apiCall(`/research/users/profile/update/${userId}`, {
			method: "PUT",
			body: JSON.stringify(profileData),
		}),
};
export const studentScheduleAPI = {
    getTimetable: () => apiCall("/student/timetable"),
    getTasks: (date) =>
        apiCall(`/student/tasks${date ? `?date=${date}` : ""}`),
    createTask: (taskData) =>
        apiCall("/student/tasks", {
            method: "POST",
            body: JSON.stringify(taskData),
        }),
    toggleTask: (taskId) =>
        apiCall(`/student/tasks/${taskId}/toggle`, {
            method: "PATCH",
        }),
    deleteTask: (taskId) =>
        apiCall(`/student/tasks/${taskId}`, {
            method: "DELETE",
        }),
    getSessions: () => apiCall("/student/sessions"), // ← ADD THIS
};
export const calendarAPI = {
    // Fetch all events, optionally filtered by type
    getEvents: (type) =>
        apiCall(`/calendar/events${type && type !== "all" ? `?type=${type}` : ""}`),

    // Create a new personal event
    createEvent: (eventData) =>
        apiCall("/calendar/events", {
            method: "POST",
            body: JSON.stringify(eventData),
        }),

    // Delete an event by ID
    deleteEvent: (eventId) =>
        apiCall(`/calendar/events/${eventId}`, {
            method: "DELETE",
        }),
};
export const placementAPI = {
	// ── Job Listings ───────────────────────────────────────────────────────

	/** Returns all active job listings. */
	getJobs: () => {
		if (USE_MOCK_API) {
			return Promise.resolve({ success: true, data: MOCK_PLACEMENT_JOBS });
		}
		return apiCall("/placement/jobs");
	},

	/** Returns a single job listing by ID. */
	getJobById: (jobId) => {
		if (USE_MOCK_API) {
			const job = MOCK_PLACEMENT_JOBS.find((j) => j.id === jobId);
			return job
				? Promise.resolve({ success: true, data: job })
				: Promise.resolve({ success: false, error: "Job not found" });
		}
		return apiCall(`/placement/jobs/${jobId}`);
	},

	// ── Applications ───────────────────────────────────────────────────────

	/** Returns all applications submitted by the current user. */
	getApplications: () => {
		if (USE_MOCK_API) {
			return Promise.resolve({ success: true, data: _placementApplications });
		}
		return apiCall("/placement/applications");
	},

	/** Submits a new application for a job. */
	applyToJob: (jobId, formData) => {
		if (USE_MOCK_API) {
			const alreadyApplied = _placementApplications.some((a) => a.jobId === jobId);
			if (alreadyApplied) {
				return Promise.resolve({ success: false, error: "Already applied to this job." });
			}
			const job = MOCK_PLACEMENT_JOBS.find((j) => j.id === jobId);
			if (!job) {
				return Promise.resolve({ success: false, error: "Job not found." });
			}
			const newApplication = {
				id: `APP${Date.now()}`,
				jobId,
				role: job.role,
				company: job.company,
				type: job.type,
				status: "Applied",
				appliedAt: new Date().toISOString(),
				location: job.location,
				package: job.package,
				rounds: job.rounds,
				description: job.description,
				interviewDate: null,
				interviewTime: null,
				interviewMode: null,
				onlineLink: null,
				venue: null,
				guidelines: [],
				documentsRequired: [],
				notes: formData?.notes ?? null,
			};
			_placementApplications.unshift(newApplication);
			return Promise.resolve({ success: true, data: newApplication });
		}
		return apiCall("/placement/applications", {
			method: "POST",
			body: JSON.stringify({ jobId, ...formData }),
		});
	},

	/** Returns a single application by ID. */
	getApplicationById: (applicationId) => {
		if (USE_MOCK_API) {
			const app = _placementApplications.find((a) => a.id === applicationId);
			return app
				? Promise.resolve({ success: true, data: app })
				: Promise.resolve({ success: false, error: "Application not found" });
		}
		return apiCall(`/placement/applications/${applicationId}`);
	},

	/** Submits the full apply-form for a job (from PlacementApplyUI). */
	submitApplication: (jobId, formPayload) => {
		if (USE_MOCK_API) {
			const job = MOCK_PLACEMENT_JOBS.find((j) => j.id === jobId);
			const existing = _placementApplications.find((a) => a.jobId === jobId);
			if (existing) {
				return Promise.resolve({ success: false, error: "Already applied to this job." });
			}
			const newApplication = {
				id: `APP${Date.now()}`,
				jobId,
				role: job?.role ?? "Position",
				company: job?.company ?? "Company",
				type: job?.type ?? "Full Time",
				status: "Applied",
				appliedAt: new Date().toISOString(),
				location: job?.location ?? null,
				package: job?.package ?? null,
				rounds: job?.rounds ?? null,
				description: job?.description ?? null,
				interviewDate: null,
				interviewTime: null,
				interviewMode: null,
				onlineLink: null,
				venue: null,
				guidelines: [],
				documentsRequired: [],
				notes: null,
				formPayload,
			};
			_placementApplications.unshift(newApplication);
			return Promise.resolve({ success: true, data: newApplication });
		}
		return apiCall("/placement/apply", {
			method: "POST",
			body: JSON.stringify({ jobId, ...formPayload }),
		});
	},

	// ── Resume & Projects ──────────────────────────────────────────────────

	/** Returns the current user's uploaded resume and project portfolio URLs. */
	getDocuments: () => {
		if (USE_MOCK_API) {
			return Promise.resolve({
				success: true,
				data: {
					resumeUrl: _placementResumeUrl,
					projectUrl: _placementProjectUrl,
				},
			});
		}
		return apiCall("/placement/documents");
	},

	/** Uploads (or replaces) the user's resume. Accepts a File object. */
	// In placementAPI, replace the mock branches of uploadResume / uploadProject:

uploadResume: (file) => {
    if (USE_MOCK_API) {
        _placementResumeUrl = URL.createObjectURL(file);
        return Promise.resolve({ success: true, data: { resumeUrl: _placementResumeUrl } });
    }
    const fd = new FormData();
    fd.append("resume", file);
    return fetch(`${FINAL_API_BASE_URL}/placement/documents/resume`, {
        method: "POST", credentials: "include", body: fd,
    }).then((r) => r.json());
},

uploadProjectPortfolio: (file) => {
    if (USE_MOCK_API) {
        _placementProjectUrl = URL.createObjectURL(file);
        return Promise.resolve({ success: true, data: { projectUrl: _placementProjectUrl } });
    }
    const fd = new FormData();
    fd.append("portfolio", file);
    return fetch(`${FINAL_API_BASE_URL}/placement/documents/portfolio`, {
        method: "POST", credentials: "include", body: fd,
    }).then((r) => r.json());
},

	// ── Placement History ──────────────────────────────────────────────────

	/** Returns the user's self-reported placement history. */
	getHistory: () => {
		if (USE_MOCK_API) {
			return Promise.resolve({ success: true, data: _placementHistory });
		}
		return apiCall("/placement/history");
	},

	/** Adds a new entry to the user's placement history. */
	addHistoryEntry: (entry) => {
		if (USE_MOCK_API) {
			const newEntry = {
				id: `HIST${Date.now()}`,
				...entry,
			};
			_placementHistory.unshift(newEntry);
			return Promise.resolve({ success: true, data: newEntry });
		}
		return apiCall("/placement/history", {
			method: "POST",
			body: JSON.stringify(entry),
		});
	},

	/** Deletes a history entry by ID. */
	deleteHistoryEntry: (historyId) => {
		if (USE_MOCK_API) {
			const index = _placementHistory.findIndex((h) => h.id === historyId);
			if (index !== -1) _placementHistory.splice(index, 1);
			return Promise.resolve({ success: true, message: "Entry deleted." });
		}
		return apiCall(`/placement/history/${historyId}`, { method: "DELETE" });
	},

	// ── Dashboard aggregate ────────────────────────────────────────────────

	/**
	 * Single call to hydrate the entire PlacementUI in one round-trip.
	 * Returns jobs, applications, history, resumeUrl, and projectUrl together.
	 */
	getPlacementOverview: () => {
		if (USE_MOCK_API) {
			return Promise.resolve({
				success: true,
				data: {
					jobs: MOCK_PLACEMENT_JOBS,
					applications: _placementApplications,
					history: _placementHistory,
					resumeUrl: _placementResumeUrl,
					projectUrl: _placementProjectUrl,
				},
			});
		}
		return apiCall("/placement/overview");
	},
};
// --- REGISTRAR ---
export const registrarAPI = {
    getOverview: () => apiCall("/registrar/overview"),

    getRequests: () => apiCall("/registrar/requests"),

    createRequest: (data, file = null) => {
        if (USE_MOCK_API) {
            return apiCall("/registrar/requests", {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    ...(file && { supportingDocFileName: file.name }),
                }),
            });
        }

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            Object.entries(data).forEach(([k, v]) => formData.append(k, v));
            return fetch(`${FINAL_API_BASE_URL}/registrar/requests`, {
                method: "POST",
                credentials: "include",
                body: formData,
            }).then((r) => r.json());
        }

        return apiCall("/registrar/requests", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getRequestById: (requestId) =>
        apiCall(`/registrar/requests/${requestId}`),

    updateRequest: (requestId, updates) =>
        apiCall(`/registrar/requests/${requestId}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        }),

    cancelRequest: (requestId) =>
        apiCall(`/registrar/requests/${requestId}`, {
            method: "DELETE",
        }),
};
export const hostelAPI = {
    getDashboard: () => apiCall("/hostel/dashboard"),

    submitLeaveRequest: (data) =>
        apiCall("/hostel/leave", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    submitOutingRequest: (data) =>
        apiCall("/hostel/outing", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    submitMaintenanceRequest: (data) =>
        apiCall("/hostel/maintenance", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    submitComplaint: (data) =>
        apiCall("/hostel/complaints", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
export const mentorAPI = {
    getDashboard: () => apiCall("/mentor/dashboard"),

    requestMeeting: (data) =>
        apiCall("/mentor/meetings/request", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    submitFeedback: (data) =>
        apiCall("/mentor/feedback", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
export const financeAPI = {
    /**
     * Single call that hydrates the entire FinanceUI in one round-trip.
     * Returns { fees, paymentHistory, receipts, dueReminders }.
     */
    getOverview: () => apiCall("/finance/overview"),
 
    /** Returns the list of all fee heads with their due/paid breakdown. */
    getFees: () => apiCall("/finance/fees"),
 
    /** Returns the full payment transaction history. */
    getHistory: () => apiCall("/finance/history"),
 
    /** Returns all issued receipts. */
    getReceipts: () => apiCall("/finance/receipts"),
 
    /** Returns currently active due reminders. */
    getDueReminders: () => apiCall("/finance/due-reminders"),
 
    /**
     * Student initiates a fee payment.
     * @param {{ feeId: string, mode: string, amount: number, details: object }} payload
     */
    pay: (payload) =>
        apiCall("/finance/pay", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
 
    /**
     * Returns a signed download URL for a receipt PDF.
     * @param {string} receiptId
     */
    downloadReceipt: (receiptId) =>
        apiCall(`/finance/receipts/${receiptId}/download`),
};
export const studentAttendanceAPI = {
    getAttendance: () => apiCall("/student/attendance"),
	 markAttendanceQR: (token) =>
        apiCall("/student/attendance/qr", {
            method: "POST",
            body: JSON.stringify({ token }),
        }),
};

// Student Job Tray API
export const studentJobTrayAPI = {
    getPendingJobs: () => apiCall("/student/job-tray"),
};
export const studentNotificationsAPI = {
    getNotifications: () => apiCall("/student/notifications"),
    markAsRead: (id) => apiCall(`/student/notifications/${id}/read`, { method: "POST" }),
};
// Examination APIs (Student)
export const examinationAPI = {
    /**
     * Single call that hydrates the entire ExaminationUI in one round-trip.
     * Returns { examSchedule, results, gradeHistory, revaluationRequests }.
     */
    getOverview: () => apiCall("/student/examination/overview"),

    /** Returns the upcoming exam schedule for the student. */
    getSchedule: () => apiCall("/student/examination/schedule"),

    /**
     * Returns result records, optionally filtered by semester.
     * @param {string|null} semester  e.g. "Semester 4", or null for all
     */
    getResults: (semester = null) =>
        apiCall(
            `/student/examination/results${semester ? `?semester=${encodeURIComponent(semester)}` : ""}`
        ),

    /**
     * Returns grade history entries, optionally filtered by semester.
     * @param {string|null} semester
     */
    getGradeHistory: (semester = null) =>
        apiCall(
            `/student/examination/grades${semester ? `?semester=${encodeURIComponent(semester)}` : ""}`
        ),

    /** Returns all revaluation requests submitted by the student. */
    getRevaluations: () => apiCall("/student/examination/revaluations"),

    /**
     * Submits a new revaluation request.
     * @param {object} data  — spread of the result row plus { reason, priority }
     */
    submitRevaluation: (data) =>
        apiCall("/student/examination/revaluations", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /**
     * Updates an existing revaluation request (e.g. after rejection).
     * @param {string} requestId
     * @param {object} updates  — partial fields to merge
     */
    updateRevaluation: (requestId, updates) =>
        apiCall(`/student/examination/revaluations/${requestId}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        }),

    /**
     * Cancels (deletes) a pending revaluation request.
     * @param {string} requestId
     */
    cancelRevaluation: (requestId) =>
        apiCall(`/student/examination/revaluations/${requestId}`, {
            method: "DELETE",
        }),
};
// Student Research APIs
export const studentResearchAPI = {
    /**
     * Single call to hydrate the entire StudentResearchUI in one round-trip.
     * Returns { myProjects, myPublications, availableProjects, availablePublications,
     *           myApplications, allUsers }
     */
    getDashboard: () => apiCall("/student/research/dashboard"),

    /** Submit an application to a research project or publication. */
    applyToItem: (itemId, data) =>
        apiCall(`/student/research/apply/${itemId}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** Toggle starred status on a research item. */
    toggleStar: (itemId) =>
        apiCall(`/student/research/star/${itemId}`, {
            method: "POST",
        }),
};
// Student Profile APIs
export const studentProfileAPI = {
    /**
     * Single call to hydrate the entire StudentProfileUI in one round-trip.
     * Returns { studentData, portfolioData }
     */
    getProfile: () => apiCall("/student/profile"),

    /** Save core profile fields (personal, contact, family, academic, etc.) */
    updateProfile: (data) =>
        apiCall("/student/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    /** Save portfolio-related fields (entrance exams, documents, portfolio links) */
    updatePortfolio: (data) =>
        apiCall("/student/profile/portfolio", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    /** Upload a document (marksheet, certificate, etc.) */
    uploadDocument: (file, docType) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);
        return fetch(`${FINAL_API_BASE_URL}/student/profile/documents`, {
            method: "POST",
            credentials: "include",
            body: formData,
        }).then((r) => r.json());
    },
};
export const studentCoursesAPI = {
    /**
     * Single call to hydrate the Registration tab.
     * Returns { registrationConfig, registrationCourses, myRegistrations }
     */
    getOverview: () => apiCall("/student/courses/overview"),
 
    /** Submit a registration for a set of selected courses. */
    submitRegistration: (courses) =>
        apiCall("/student/courses/register", {
            method: "POST",
            body: JSON.stringify({ courses }),
        }),
 
    /** Cancel a single pending registration by ID. */
    cancelRegistration: (regId) =>
        apiCall(`/student/courses/register/${regId}`, {
            method: "DELETE",
        }),
 
    /**
     * Swap one elective registration for another course.
     * @param {string} regId       — existing registration to replace
     * @param {string} newCourseId — course to swap to
     */
    swapElective: (regId, newCourseId) =>
        apiCall(`/student/courses/register/${regId}/swap`, {
            method: "PATCH",
            body: JSON.stringify({ newCourseId }),
        }),
 
    /** Submit feedback ratings + comment for a cohort. */
    submitFeedback: (cohortId, feedback) =>
        apiCall(`/student/courses/${cohortId}/feedback`, {
            method: "POST",
            body: JSON.stringify(feedback),
        }),
};

export const studentSessionsAPI = {
    getSessions: () => apiCall("/student/sessions"),
};

export default {
	userAPI,
	courseAPI,
	cohortAPI,
	notificationsAPI,
	uploadAPI,
	devkitAPI,
	announcementsAPI,
	generalChatAPI,
	studentDiscussionsAPI,
	scheduleAPI,
	studentMeetingsAPI,
	sessionPlanningAPI,
	libraryAPI,
	maintenanceAPI,
	assetAPI,
	attendanceAPI,
	expensesAPI,
	advancesAPI,
	examAPI,
	leaveAPI,
	payrollAPI,
	bulletinAPI,
	researchAPI,
	studentScheduleAPI,
	calendarAPI,
	placementAPI,
	registrarAPI,
	hostelAPI,
	mentorAPI,
	financeAPI,
	studentAttendanceAPI,
	studentJobTrayAPI,
	studentNotificationsAPI,
	examinationAPI,
	studentResearchAPI,
	studentProfileAPI,
	studentCoursesAPI,
	studentSessionsAPI,
};
