// --- CONFIGURATION ---
// Since Frontend is on 3001, we must tell it exactly where the Backend is (3000)
const API_BASE_URL = "http://localhost:3000";

// --- HELPER: Safe Fetch ---
async function safeFetch(endpoint, options = {}) {
  try {
    // We combine the Base URL (3000) with the endpoint (/api/...)
    const url = `${API_BASE_URL}${endpoint}`;
    
    const res = await fetch(url, options);
    
    if (!res.ok) {
      throw new Error(`Server Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    alert(`Connection Failed: Make sure Backend is running on Port 3000.\n\nError: ${error.message}`);
    return null;
  }
}

// --- MAIN FUNCTIONS ---

async function searchDate() {
  const date = document.getElementById('date').value;
  if (!date) { alert("Please select a date"); return; }
  
  // Usage: Pass the endpoint starting with /api
  const data = await safeFetch(`/api/attendance/${date}`);
  
  if (!data) return;

  const hasRecords = data.length > 0;
  const isMarked = hasRecords && data.every(d => d.status !== null);
  
  isMarked ? showViewMode(data) : showMarkingMode(data);
}

function showMarkingMode(data) {
  const div = document.getElementById('content');
  div.innerHTML = '<h3>Mark Attendance</h3>'; 

  data.forEach(d => {
    const row = document.createElement('div');
    row.className = 'student-row';
    row.innerHTML = `
      <span class="student-name">${d.name}</span>
      <div class="radio-group">
         <label><input type="radio" name="${d.studentId}" value="present" checked> Present</label>
         <label><input type="radio" name="${d.studentId}" value="absent"> Absent</label>
      </div>
    `;
    div.appendChild(row);
  });

  const btn = document.createElement('button');
  btn.textContent = "Mark Attendance";
  btn.className = "btn-mark";
  btn.onclick = markAttendance;
  div.appendChild(btn);
}

function showViewMode(data) {
  const div = document.getElementById('content');
  div.innerHTML = '<h3>Attendance Report</h3>'; 

  data.forEach(d => {
    const isPresent = d.status === 'present';
    const row = document.createElement('div');
    row.className = 'student-row';
    row.innerHTML = `
      <span class="student-name">${d.name}</span>
      <span class="status-badge ${isPresent ? 'present-text' : 'absent-text'}">
        ${isPresent ? '✔ present' : '✖ absent'}
      </span>
    `;
    div.appendChild(row);
  });
}

async function markAttendance() {
  const date = document.getElementById('date').value;
  const uniqueIds = [...new Set([...document.querySelectorAll('input[type=radio]')].map(el => el.name))];
  
  const records = uniqueIds.map(id => {
    const selected = document.querySelector(`input[name="${id}"]:checked`);
    const name = selected.closest('.student-row').querySelector('.student-name').textContent;
    return {
      studentId: Number(id),
      name: name,
      status: selected.value
    };
  });

  const response = await safeFetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, records })
  });

  if (response) {
    alert("Attendance Marked Successfully!");
    searchDate();
  }
}

async function fetchOverall() {
  window.location.href = "overall.html";
}

async function loadOverall() {
  const data = await safeFetch('/api/attendance/overall');
  if (!data) return;

  const div = document.getElementById('overall');
  div.innerHTML = '';

  data.forEach(d => {
    const total = d.totalClasses !== undefined ? d.totalClasses : (d.total || 0);
    const row = document.createElement('div');
    row.className = 'student-row';
    row.innerHTML = `
        <span class="student-name">${d.name}</span>
        <span style="font-weight:bold;">${d.attended}/${total}</span>
        <span>${d.percentage}%</span>
    `;
    div.appendChild(row);
  });
}