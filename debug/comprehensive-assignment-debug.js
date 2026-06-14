// Complete Assignment Debug Script
// Paste this into the browser console after navigating to /c/1/assignments

console.log("🔧 Complete Assignment Debug Started");

// Function to test if we can manually fetch assignments
async function testManualAssignmentFetch() {
  console.log("📡 Testing manual assignment fetch...");
  
  try {
    const response = await fetch('http://192.168.31.50:8000/api/v1/cohort/1/assignments', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    const data = await response.json();
    console.log("✅ Manual fetch successful:", data);
    
    if (data.success && data.data && data.data.assignments) {
      console.log(`📊 Found ${data.data.assignments.length} assignments manually`);
      data.data.assignments.forEach((assignment, index) => {
        console.log(`Assignment ${index + 1}:`, assignment);
      });
      return data.data.assignments;
    } else {
      console.log("❌ Manual fetch returned unexpected format:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Manual fetch error:", error);
    return null;
  }
}

// Function to debug React components
function debugReactComponents() {
  console.log("🔍 Debugging React components...");
  
  // Check if we're on the assignments page
  const currentPath = window.location.pathname;
  console.log("Current path:", currentPath);
  
  // Look for assignment-related DOM elements
  const assignmentElements = {
    containers: document.querySelectorAll('[class*="assignment"]'),
    textElements: document.querySelectorAll('*:contains("assignment")'),
    noAssignmentsText: document.querySelectorAll('*:contains("No assignments")'),
    createButtons: document.querySelectorAll('*:contains("Create Assignment")'),
    assignmentCards: document.querySelectorAll('[class*="card"], [class*="item"]')
  };
  
  console.log("DOM elements found:");
  Object.entries(assignmentElements).forEach(([key, elements]) => {
    console.log(`  ${key}: ${elements.length} elements`);
    if (elements.length > 0) {
      console.log(`    First element:`, elements[0]);
    }
  });
  
  // Check for any "No assignments" text
  const bodyText = document.body.innerText;
  if (bodyText.includes("No assignments")) {
    console.log("⚠️ Found 'No assignments' text on page");
  }
  if (bodyText.includes("assignments")) {
    console.log("✅ Found 'assignments' text on page");
  }
  
  // Check for loading states
  if (bodyText.includes("Loading") || bodyText.includes("loading")) {
    console.log("⏳ Found loading text on page");
  }
  
  return assignmentElements;
}

// Function to check browser storage
function debugBrowserStorage() {
  console.log("💾 Debugging browser storage...");
  
  // Check localStorage
  const localStorageKeys = Object.keys(localStorage);
  const assignmentKeys = localStorageKeys.filter(key => 
    key.toLowerCase().includes('assignment') || 
    key.toLowerCase().includes('cohort')
  );
  
  console.log("Assignment-related localStorage keys:", assignmentKeys);
  assignmentKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      const parsed = JSON.parse(value);
      console.log(`localStorage[${key}]:`, parsed);
    } catch (e) {
      console.log(`localStorage[${key}] (raw):`, localStorage.getItem(key));
    }
  });
  
  // Check sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  const sessionAssignmentKeys = sessionStorageKeys.filter(key => 
    key.toLowerCase().includes('assignment') || 
    key.toLowerCase().includes('cohort')
  );
  
  console.log("Assignment-related sessionStorage keys:", sessionAssignmentKeys);
  sessionAssignmentKeys.forEach(key => {
    try {
      const value = sessionStorage.getItem(key);
      const parsed = JSON.parse(value);
      console.log(`sessionStorage[${key}]:`, parsed);
    } catch (e) {
      console.log(`sessionStorage[${key}] (raw):`, sessionStorage.getItem(key));
    }
  });
}

// Function to check network requests
function debugNetworkRequests() {
  console.log("🌐 Setting up network request monitoring...");
  
  // Override fetch to monitor requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const options = args[1] || {};
    
    if (typeof url === 'string' && url.includes('assignment')) {
      console.log("🔗 Assignment API request detected:", url, options);
    }
    
    return originalFetch.apply(this, args).then(response => {
      if (typeof url === 'string' && url.includes('assignment')) {
        console.log("📥 Assignment API response:", response.status, response);
      }
      return response;
    });
  };
  
  console.log("✅ Network monitoring enabled for assignment requests");
}

// Function to check authentication
async function debugAuthentication() {
  console.log("🔐 Debugging authentication...");
  
  try {
    const response = await fetch('http://192.168.31.50:8000/api/v1/auth/status', {
      credentials: 'include'
    });
    const authData = await response.json();
    console.log("Auth status:", authData);
    
    if (authData.isLoggedIn) {
      console.log("✅ User is authenticated");
      console.log("User details:", authData.user);
    } else {
      console.log("❌ User is not authenticated");
    }
    
    return authData;
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return null;
  }
}

// Function to run comprehensive debug
async function runComprehensiveDebug() {
  console.log("🚀 Running comprehensive assignment debug...");
  
  // Step 1: Check authentication
  const authStatus = await debugAuthentication();
  
  // Step 2: Test manual API fetch
  const manualAssignments = await testManualAssignmentFetch();
  
  // Step 3: Debug React components
  const domElements = debugReactComponents();
  
  // Step 4: Check browser storage
  debugBrowserStorage();
  
  // Step 5: Setup network monitoring
  debugNetworkRequests();
  
  // Step 6: Check if debugAssignments is available
  if (typeof window.debugAssignments !== 'undefined') {
    console.log("🎯 debugAssignments found!");
    console.log("Cohort ID:", window.debugAssignments.getCohortId());
    console.log("User Type:", window.debugAssignments.getUserType());
    console.log("Storage Key:", window.debugAssignments.getStorageKey());
    console.log("Current assignments in storage:", window.debugAssignments.getAssignments());
  } else {
    console.log("❌ debugAssignments not found on window");
  }
  
  // Summary
  console.log("\n📋 DEBUG SUMMARY:");
  console.log("Authentication:", authStatus?.isLoggedIn ? "✅ OK" : "❌ Failed");
  console.log("Manual API fetch:", manualAssignments ? `✅ ${manualAssignments.length} assignments` : "❌ Failed");
  console.log("DOM elements:", Object.values(domElements).reduce((sum, elements) => sum + elements.length, 0), "found");
  console.log("Current URL:", window.location.href);
  
  return {
    authStatus,
    manualAssignments,
    domElements,
    currentUrl: window.location.href
  };
}

// Auto-run after page loads
setTimeout(() => {
  runComprehensiveDebug().then(results => {
    console.log("🏁 Comprehensive debug complete:", results);
  });
}, 3000);

// Make functions available globally
window.assignmentDebug = {
  testManualFetch: testManualAssignmentFetch,
  debugComponents: debugReactComponents,
  debugStorage: debugBrowserStorage,
  debugAuth: debugAuthentication,
  runFull: runComprehensiveDebug
};

console.log("🔧 Assignment debug functions available at window.assignmentDebug");
console.log("💡 Run window.assignmentDebug.runFull() to test everything");

// Helper to create test assignments in localStorage
window.assignmentDebug.createTestData = function() {
  const testAssignments = [
    {
      id: 1,
      name: "Test Assignment 1",
      description: "This is a test assignment",
      type: "individual",
      deadline: "2025-10-30T23:59:59Z",
      submissionLink: "https://forms.google.com/test1",
      createdAt: "2025-10-13T10:00:00Z",
      createdBy: 1,
      submissions: 0,
      totalStudents: 20
    },
    {
      id: 2,
      name: "Test Assignment 2",
      description: "Another test assignment",
      type: "group",
      deadline: "2025-11-15T23:59:59Z",
      submissionLink: "https://forms.google.com/test2",
      createdAt: "2025-10-14T10:00:00Z",
      createdBy: 1,
      submissions: 5,
      totalStudents: 20
    }
  ];
  
  localStorage.setItem('assignments_1', JSON.stringify(testAssignments));
  console.log("✅ Test assignment data created in localStorage");
  console.log("🔄 Refresh the page to see test assignments");
};
