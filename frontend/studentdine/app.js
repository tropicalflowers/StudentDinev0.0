/* Landing Page - Role Selection */

const ROLES = [
  {
    id: 'day-scholar',
    name: 'Day Scholar',
    icon: '🎓',
    description: 'For students staying in the city',
    details: [
      '✓ Order from campus restaurants',
      '✓ Quick checkout & fast delivery',
      '✓ Access to all coupons',
      '✓ Smart wallet system'
    ]
  },
  {
    id: 'hosteller',
    name: 'Hosteller',
    icon: '🏠',
    description: 'For students staying in hostels',
    details: [
      '✓ Book mess meals',
      '✓ Cancel subscriptions anytime',
      '✓ Group booking options',
      '✓ Mess management system'
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    icon: '⚙️',
    description: 'For restaurant & food service managers',
    details: [
      '✓ Manage orders',
      '✓ Update menus in real-time',
      '✓ View analytics & reports',
      '✓ Handle customer requests'
    ]
  }
];

// Initialize role grid on landing page
function initializeRoleGrid() {
  const roleGrid = document.getElementById('roleGrid');
  if (!roleGrid) return;

  roleGrid.innerHTML = ROLES.map(role => `
    <div class="role-card" style="cursor: pointer;">
      <div style="font-size: 48px; margin-bottom: 16px;">${role.icon}</div>
      <h3>${role.name}</h3>
      <p class="small" style="margin-bottom: 16px;">${role.description}</p>
      <ul style="text-align: left; margin: 16px 0; list-style: none; padding: 0;">
        ${role.details.map(detail => `<li style="padding: 4px 0; font-size: 14px;">${detail}</li>`).join('')}
      </ul>
      <button class="btn" style="width: 100%; margin-top: 12px;" onclick="selectRole('${role.id}')">
        Enter as ${role.name}
      </button>
    </div>
  `).join('');
}

// Select a role and redirect to that page
function selectRole(roleId) {
  localStorage.setItem('campus_food_role', roleId);

  if (!window.Auth || !Auth.isAuthenticated()) {
    window.location.href = './auth/login.html';
    return;
  }

  if (roleId === 'manager' && Auth.getCurrentUser()?.role === 'manager') {
    window.location.href = './admin/dashboard.html';
    return;
  }

  window.location.href = './store.html';
}

// Toggle dark/light mode
function toggleMode() {
  const html = document.documentElement;
  html.classList.toggle('light');
  localStorage.setItem('campus_food_theme', html.classList.contains('light') ? 'light' : 'dark');
}

// Initialize dark/light mode based on localStorage
function initializeTheme() {
  const theme = localStorage.getItem('campus_food_theme') || 'light';
  if (theme === 'light') {
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
  }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeRoleGrid();

  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMode();
    });
  }

  // Handle About link
  const aboutLink = document.querySelector('[data-action="about"]');
  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Campus Food v1.0\n\nA smart campus-wide food ordering and management system for students and restaurant managers.\n\nDesigned with ❤️ for campus community.');
    });
  }
});
