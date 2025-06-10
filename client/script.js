// Global variables
let currentUser = null;
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:10000' 
  : window.location.origin;

// DOM Elements
const mainContent = document.getElementById('mainContent');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeModal = document.querySelectorAll('.close-modal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const doEmailLogin = document.getElementById('doEmailLogin');
const doUsernameLogin = document.getElementById('doUsernameLogin');
const doRegister = document.getElementById('doRegister');
const authTabs = document.querySelectorAll('.auth-tab');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const dashboardLink = document.getElementById('dashboardLink');
const leaderboardLink = document.getElementById('leaderboardLink');
const howItWorksLink = document.getElementById('howItWorksLink');

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
loginBtn.addEventListener('click', () => showModal(loginModal));
registerBtn.addEventListener('click', () => showModal(registerModal));
getStartedBtn.addEventListener('click', () => showModal(registerModal));
logoutBtn.addEventListener('click', logout);
closeModal.forEach(btn => btn.addEventListener('click', closeAllModals));
switchToRegister.addEventListener('click', () => {
  loginModal.style.display = 'none';
  registerModal.style.display = 'flex';
});
switchToLogin.addEventListener('click', () => {
  registerModal.style.display = 'none';
  loginModal.style.display = 'flex';
});
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    authTabs.forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    
    // Show corresponding form
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(`${tabId}Form`).classList.add('active');
    
    // Hide OTP form if switching tabs
    const otpForm = document.getElementById('otpVerificationForm');
    if (otpForm) otpForm.style.display = 'none';
  });
});
doEmailLogin.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showMessage(loginMessage, 'Please fill in all fields', 'error');
    return;
  }
  
  try {
    // First step: Request OTP
    const response = await fetch(`${BACKEND_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      showMessage(loginMessage, 'OTP sent to your email!', 'success');
      
      // Hide email login form
      document.getElementById('emailLoginForm').style.display = 'none';
      
      // Show OTP verification form
      const otpForm = document.getElementById('otpVerificationForm') || createOtpForm();
      otpForm.style.display = 'block';
      
      // Store email and password for later use
      otpForm.dataset.email = email;
      otpForm.dataset.password = password;
    } else {
      showMessage(loginMessage, data.message || 'Failed to send OTP', 'error');
    }
  } catch (error) {
    showMessage(loginMessage, 'An error occurred. Please try again.', 'error');
  }
});
doUsernameLogin.addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPasswordUsername').value;
  
  if (!username || !password) {
    showMessage(loginMessage, 'Please fill in all fields', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      showMessage(loginMessage, 'Login successful!', 'success');
      currentUser = data.user;
      localStorage.setItem('token', data.token);
      loginModal.style.display = 'none';
      updateAuthUI();
    } else {
      showMessage(loginMessage, data.message || 'Login failed', 'error');
    }
  } catch (error) {
    showMessage(loginMessage, 'An error occurred. Please try again.', 'error');
  }
});
doRegister.addEventListener('click', async () => {
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (!username || !email || !password || !confirmPassword) {
    showMessage(registerMessage, 'Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showMessage(registerMessage, 'Passwords do not match', 'error');
    return;
  }
  
  if (password.length < 6) {
    showMessage(registerMessage, 'Password must be at least 6 characters', 'error');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage(registerMessage, 'Please enter a valid email address', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      showMessage(registerMessage, 'Account created successfully!', 'success');
      currentUser = data.user;
      localStorage.setItem('token', data.token);
      registerModal.style.display = 'none';
      updateAuthUI();
    } else {
      showMessage(registerMessage, data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    showMessage(registerMessage, 'An error occurred. Please try again.', 'error');
  }
});
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  currentUser = null;
  showUnauthenticatedUI();
  loadHowItWorks();
});
dashboardLink.addEventListener('click', () => loadDashboard());
leaderboardLink.addEventListener('click', () => loadLeaderboard());
howItWorksLink.addEventListener('click', () => loadHowItWorks());

// Initialize application
function initApp() {
  const token = localStorage.getItem('token');
  if (token) {
    verifyToken(token);
  } else {
    loadHowItWorks();
  }
}

// Authentication functions
async function verifyToken(token) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      showAuthenticatedUI();
      loadDashboard();
    } else {
      localStorage.removeItem('token');
      showUnauthenticatedUI();
      loadHowItWorks();
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    localStorage.removeItem('token');
    showUnauthenticatedUI();
    loadHowItWorks();
  }
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  showUnauthenticatedUI();
  loadHowItWorks();
}

// UI Functions
function showAuthenticatedUI() {
  loginBtn.style.display = 'none';
  registerBtn.style.display = 'none';
  logoutBtn.style.display = 'block';
  dashboardLink.style.display = 'block';
}

function showUnauthenticatedUI() {
  loginBtn.style.display = 'block';
  registerBtn.style.display = 'block';
  logoutBtn.style.display = 'none';
  dashboardLink.style.display = 'none';
}

function showModal(modal) {
  modal.style.display = 'flex';
}

function closeAllModals() {
  loginModal.style.display = 'none';
  registerModal.style.display = 'none';
  document.getElementById('loginMessage').style.display = 'none';
  document.getElementById('registerMessage').style.display = 'none';
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message ${type}`;
  element.style.display = 'block';
  
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

function updateAuthUI() {
  if (currentUser) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
}

// Content Loading Functions
async function loadDashboard() {
  if (!currentUser) {
    showModal(loginModal);
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BACKEND_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load dashboard');
    
    const userData = await response.json();
    
    // Load queue data
    const queueResponse = await fetch(`${BACKEND_URL}/queue`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const queueData = queueResponse.ok ? await queueResponse.json() : [];
    
    // Render dashboard
    mainContent.innerHTML = `
      <section class="dashboard">
        <div class="dashboard-header">
          <div>
            <h2 class="welcome-message">Welcome back, ${userData.username}!</h2>
            <p>Earn points by following others and get followers in return</p>
          </div>
          <div class="points">🪙 ${userData.points} Points</div>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>${userData.followers.length}</h3>
            <p>Followers</p>
          </div>
          <div class="stat-card">
            <h3>${userData.following.length}</h3>
            <p>Following</p>
          </div>
          <div class="stat-card">
            <h3>${userData.points}</h3>
            <p>Available Points</p>
          </div>
          <div class="stat-card">
            <h3>${Math.min(userData.points, 10)}</h3>
            <p>Followers You Can Get</p>
          </div>
        </div>
        
        <div class="queue">
          <div class="queue-header">
            <h3>🔥 Users to Follow (Earn 1 Point Each)</h3>
            <button class="btn btn-primary" id="refreshQueue">Refresh List</button>
          </div>
          
          <div class="user-list" id="queueList">
            ${queueData.length > 0 ? 
              queueData.map(user => `
                <div class="user-card">
                  <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                  <h4>${user.username}</h4>
                  <p>Points: ${user.points}</p>
                  <button class="follow-btn" data-user="${user.username}">Follow +1</button>
                </div>
              `).join('') : 
              '<p>No users available in the queue. Check back later!</p>'
            }
          </div>
        </div>
        
        <div class="leaderboard">
          <div class="queue-header">
            <h3>🏆 Top Leaderboard</h3>
            <button class="btn btn-secondary" id="viewFullLeaderboard">View Full Leaderboard</button>
          </div>
          <div id="leaderboardPreview"></div>
        </div>
      </section>
    `;
    
    // Add event listeners to dynamically created elements
    document.getElementById('refreshQueue')?.addEventListener('click', loadDashboard);
    document.getElementById('viewFullLeaderboard')?.addEventListener('click', loadLeaderboard);
    
    // Add follow button handlers
    document.querySelectorAll('.follow-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const targetUser = this.dataset.user;
        this.disabled = true;
        this.textContent = 'Following...';
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${BACKEND_URL}/follow/${targetUser}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            this.textContent = 'Followed! +1';
            this.style.background = 'var(--success)';
            
            // Update UI with new points
            const data = await response.json();
            document.querySelector('.points').textContent = `🪙 ${data.points} Points`;
            
            // Reload stats after a delay
            setTimeout(loadDashboard, 1500);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            this.disabled = false;
            this.textContent = 'Follow +1';
          }
        } catch (error) {
          console.error('Follow error:', error);
          alert('Failed to follow user. Please try again.');
          this.disabled = false;
          this.textContent = 'Follow +1';
        }
      });
    });
    
    // Load leaderboard preview
    loadLeaderboardPreview();
  } catch (error) {
    mainContent.innerHTML = `
      <section class="dashboard">
        <h2>Dashboard</h2>
        <div class="message error">Failed to load dashboard: ${error.message}</div>
      </section>
    `;
  }
}

async function loadLeaderboard() {
  try {
    const response = await fetch(`${BACKEND_URL}/leaderboard`);
    if (!response.ok) throw new Error('Failed to load leaderboard');
    
    const leaderboard = await response.json();
    
    mainContent.innerHTML = `
      <section class="dashboard">
        <div class="dashboard-header">
          <h2>🏆 Leaderboard</h2>
          <p>Top users with the most points</p>
        </div>
        
        <div class="leaderboard-list">
          ${leaderboard.length > 0 ? 
            leaderboard.map((user, index) => `
              <div class="leaderboard-item">
                <div>
                  <span class="rank">${index + 1}</span>
                  <span>${user.username}</span>
                </div>
                <div>${user.points} Points</div>
              </div>
            `).join('') : 
            '<p>No users on the leaderboard yet. Be the first!</p>'
          }
        </div>
      </section>
    `;
    
    // Highlight current user if they're on the leaderboard
    if (currentUser) {
      const currentUserIndex = leaderboard.findIndex(u => u.username === currentUser.username);
      if (currentUserIndex !== -1) {
        const userElement = document.querySelectorAll('.leaderboard-item')[currentUserIndex];
        if (userElement) {
          userElement.style.background = 'rgba(138, 43, 226, 0.1)';
          userElement.style.borderLeft = '3px solid var(--primary)';
        }
      }
    }
  } catch (error) {
    mainContent.innerHTML = `
      <section class="dashboard">
        <h2>Leaderboard</h2>
        <div class="message error">Failed to load leaderboard: ${error.message}</div>
      </section>
    `;
  }
}

async function loadLeaderboardPreview() {
  try {
    const response = await fetch(`${BACKEND_URL}/leaderboard`);
    if (!response.ok) return;
    
    const leaderboard = await response.json();
    const preview = leaderboard.slice(0, 5);
    
    const leaderboardPreview = document.getElementById('leaderboardPreview');
    if (leaderboardPreview) {
      leaderboardPreview.innerHTML = `
        <div class="leaderboard-list">
          ${preview.map((user, index) => `
            <div class="leaderboard-item">
              <div>
                <span class="rank">${index + 1}</span>
                <span>${user.username}</span>
              </div>
              <div>${user.points} Points</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load leaderboard preview:', error);
  }
}

function loadHowItWorks() {
  mainContent.innerHTML = `
    <section class="how-it-works">
      <h2>How InstaFollowX Works</h2>
      <p>Grow your Instagram following by exchanging follows with real users</p>
      
      <div class="step-card">
        <div class="step-number">1</div>
        <div class="step-content">
          <h3>Create Your Account</h3>
          <p>Sign up with your desired username. No email required for quick onboarding.</p>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">2</div>
        <div class="step-content">
          <h3>Follow Other Users</h3>
          <p>Visit the dashboard and follow users from the queue. Each follow earns you 1 point.</p>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">3</div>
        <div class="step-content">
          <h3>Get Followers</h3>
          <p>As you earn points, you'll be added to the follow queue. Other users will follow you, and you'll gain real followers!</p>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">4</div>
        <div class="step-content">
          <h3>Climb the Leaderboard</h3>
          <p>Earn more points than others to climb the leaderboard and get bonus rewards.</p>
        </div>
      </div>
      
      <div class="text-center">
        <button class="btn btn-primary" id="getStartedBtn">Get Started Now</button>
      </div>
    </section>
    
    <section class="dashboard">
      <div class="leaderboard">
        <h3>🏆 Current Top Users</h3>
        <div id="guestLeaderboard"></div>
      </div>
    </section>
  `;
  
  document.getElementById('getStartedBtn')?.addEventListener('click', () => {
    if (currentUser) {
      loadDashboard();
    } else {
      showModal(registerModal);
    }
  });
  
  loadGuestLeaderboard();
}

async function loadGuestLeaderboard() {
  try {
    const response = await fetch(`${BACKEND_URL}/leaderboard`);
    if (!response.ok) return;
    
    const leaderboard = await response.json();
    const preview = leaderboard.slice(0, 5);
    
    const guestLeaderboard = document.getElementById('guestLeaderboard');
    if (guestLeaderboard) {
      guestLeaderboard.innerHTML = `
        <div class="leaderboard-list">
          ${preview.length > 0 ? 
            preview.map((user, index) => `
              <div class="leaderboard-item">
                <div>
                  <span class="rank">${index + 1}</span>
                  <span>${user.username}</span>
                </div>
                <div>${user.points} Points</div>
              </div>
            `).join('') : 
            '<p>No users on the leaderboard yet</p>'
          }
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load guest leaderboard:', error);
  }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.style.display = 'none';
  if (e.target === registerModal) registerModal.style.display = 'none';
});

// Create OTP verification form
function createOtpForm() {
  const form = document.createElement('div');
  form.id = 'otpVerificationForm';
  form.className = 'auth-form';
  form.innerHTML = `
    <h3 style="margin-bottom: 20px;">Enter OTP</h3>
    <p style="margin-bottom: 20px;">Please enter the OTP sent to your email</p>
    <div class="form-group">
      <input type="text" id="otpInput" placeholder="Enter OTP" maxlength="6" style="letter-spacing: 5px; font-size: 20px; text-align: center;">
    </div>
    <button class="btn btn-primary" style="width: 100%;" id="verifyOtpBtn">Verify OTP</button>
    <p style="text-align: center; margin-top: 15px;">
      <a href="#" id="resendOtp" style="color: var(--primary);">Resend OTP</a>
    </p>
  `;
  
  document.querySelector('.modal-content').appendChild(form);
  
  // Add event listeners for OTP verification
  document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
    const otp = document.getElementById('otpInput').value;
    const email = form.dataset.email;
    const password = form.dataset.password;
    
    if (!otp) {
      showMessage(loginMessage, 'Please enter OTP', 'error');
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, otp })
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage(loginMessage, 'Login successful!', 'success');
        currentUser = data.user;
        localStorage.setItem('token', data.token);
        loginModal.style.display = 'none';
        updateAuthUI();
      } else {
        showMessage(loginMessage, data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      showMessage(loginMessage, 'An error occurred. Please try again.', 'error');
    }
  });
  
  // Add event listener for resend OTP
  document.getElementById('resendOtp').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = form.dataset.email;
    const password = form.dataset.password;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage(loginMessage, 'New OTP sent to your email!', 'success');
      } else {
        showMessage(loginMessage, data.message || 'Failed to resend OTP', 'error');
      }
    } catch (error) {
      showMessage(loginMessage, 'An error occurred. Please try again.', 'error');
    }
  });
  
  return form;
}