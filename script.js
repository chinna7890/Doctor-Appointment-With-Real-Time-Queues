// Switch features
function showFeature(id) {
  document.querySelectorAll('.feature-container').forEach((el) => {
    el.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}
document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.querySelector('.menu-toggle');

  // If click is outside sidebar and not on toggle icon
  if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
    sidebar.classList.remove('show');
  }
});


// Close dropdown on outside click
window.onclick = function(e) {
  if (!e.target.closest('.profile-container')) {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    }
  }
};
function showTime() {
	document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}
showTime();
setInterval(function () {
	showTime();
}, 1000);
