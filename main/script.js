// Initialize Three.js scene for 3D elements
function initThreeScene() {
	// This would be a more complex implementation in a real project
	console.log("3D scene initialized");
}

// Show notification badge
function showNotification() {
	const badge = document.getElementById('notificationBadge');
	badge.classList.add('show');
}
//dashboard
const openDashboard = document.getElementById('openDashboard');
  const closeDashboard = document.getElementById('closeDashboard');
  const dashboardPanel = document.getElementById('dashboardPanel');

openDashboard.addEventListener('click', () => {
    dashboardPanel.classList.remove('translate-x-full');
    dashboardPanel.classList.add('translate-x-0');
});

closeDashboard.addEventListener('click', () => {
    dashboardPanel.classList.remove('translate-x-0');
    dashboardPanel.classList.add('translate-x-full');
});
const openLoginFromDashboard = document.getElementById('openLoginFromDashboard');

openLoginFromDashboard.addEventListener('click', () => {
	loginModal.classList.add('show');
	dashboardPanel.classList.add('translate-x-full'); // Optional: hide dashboard
});

// Modal handling
const signupModal = document.getElementById('signupModal');
const loginModal = document.getElementById('loginModal');
const communityModal = document.getElementById('communityModal');

// Sign up modal controls
const signupBtn = document.getElementById('signupBtn');
const closeSignupModal = document.getElementById('closeSignupModal');
const switchToLogin = document.getElementById('switchToLogin');

signupBtn.addEventListener('click', function() {
	signupModal.classList.add('show');
});

closeSignupModal.addEventListener('click', function() {
	signupModal.classList.remove('show');
});

switchToLogin.addEventListener('click', function() {
	signupModal.classList.remove('show');
	loginModal.classList.add('show');
});

// Login modal controls
const loginBtn = document.getElementById('loginBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const switchToSignup = document.getElementById('switchToSignup');

loginBtn.addEventListener('click', function() {
	loginModal.classList.add('show');
});

closeLoginModal.addEventListener('click', function() {
	loginModal.classList.remove('show');
});

switchToSignup.addEventListener('click', function() {
	loginModal.classList.remove('show');
	signupModal.classList.add('show');
});

// Community modal controls
const joinCommunityBtn = document.getElementById('joinCommunityBtn');
const closeCommunityModal = document.getElementById('closeCommunityModal');

joinCommunityBtn.addEventListener('click', function() {
	communityModal.classList.add('show');
});

closeCommunityModal.addEventListener('click', function() {
	communityModal.classList.remove('show');
});

// Form submission handling (to be connected to actual APIs later)
document.getElementById('signupForm').addEventListener('submit', function(e) {
	e.preventDefault();
	// This would connect to the backend in a real implementation
	alert("This is a prototype. In the full version, this would register a new user.");
	signupModal.classList.remove('show');
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
	e.preventDefault();
	// This would connect to the backend in a real implementation
	alert("This is a prototype. In the full version, this would authenticate the user.");
	loginModal.classList.remove('show');
});

document.getElementById('communityForm').addEventListener('submit', function(e) {
	e.preventDefault();
	// This would connect to the backend in a real implementation
	alert("This is a prototype. In the full version, this would add you to our community.");
	communityModal.classList.remove('show');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
	// Initialize Three.js scene
	initThreeScene();

	// Show notification after a delay
	setTimeout(showNotification, 3000);

	// Initialize GSAP animations
	if (typeof gsap !== 'undefined') {
	gsap.from('.hero-content h1', {
		opacity: 0,
		y: 50,
		duration: 1,
		ease: 'power3.out'
	});

	gsap.from('.hero-content p', {
		opacity: 0,
		y: 30,
		duration: 1,
		delay: 0.3,
		ease: 'power3.out'
	});

	gsap.from('.btn-primary', {
		opacity: 0,
		y: 20,
		duration: 1,
		delay: 0.6,
		ease: 'power3.out'
	});
	}
});

// Close modals when clicking outside the modal content
window.addEventListener('click', function(event) {
	if (event.target === signupModal) {
	signupModal.classList.remove('show');
	}
	if (event.target === loginModal) {
	loginModal.classList.remove('show');
	}
	if (event.target === communityModal) {
	communityModal.classList.remove('show');
	}
});

// document.querySelectorAll('.nav-link').forEach(link => {
//       link.addEventListener('click', function() {
//         const mobileMenuButton = document.querySelector('.md\\:hidden');
//         if (mobileMenuButton && window.innerWidth < 768) {
//           // Close the mobile menu if it's open
//           // This assumes there is a mobile menu toggle functionality
//         }
//     });
// });


 document.querySelectorAll('.enroll-button').forEach(button => {
      button.addEventListener('click', async function() {
        const courseId = this.getAttribute('data-course');

        // Check if user is logged in (you would implement this)
        const isLoggedIn = checkIfUserIsLoggedIn(); // implement this function

        if (isLoggedIn) {
          // User is logged in, directly enroll them
          enrollUserInCourse(courseId);
        } else {
          // User is not logged in, show login modal or use Auth Loop
          try {
            const response = await fetch('https://magicloops.dev/api/loop/782b87cc-5e11-4df9-99c0-34a55166b087/run', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
              }),
            });

            if (response.ok) {
              const responseData = await response.json();
              // Handle successful authentication
              enrollUserInCourse(courseId);
            } else {
              // Show login modal if auth failed
              loginModal.classList.add('show');
            }
          } catch (error) {
            console.error("Auth error:", error);
            loginModal.classList.add('show');
          }
        }
      });
    });

    // Check if user is logged in
    function checkIfUserIsLoggedIn() {
      // This is a stub - implement with actual session checking logic
      // For example, check for an auth token in localStorage
      return localStorage.getItem('userToken') !== null;
    }

    // Enroll user in course
    function enrollUserInCourse(courseId) {
      // This would connect to your actual enrollment API
      console.log(`Enrolling user in course: ${courseId}`);
      alert(`You've successfully enrolled in the course!`);

      // Here you would make an API call to your backend
      // fetch('/api/enroll', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('userToken')}`
      //   },
      //   body: JSON.stringify({ courseId })
      // });
    }

    // Course data objects
    const courseData = {
      'python-basics': {
        title: 'Python Basics',
        description: 'Learn the fundamentals of Python programming, including variables, data types, control flow, functions, and more. Perfect for beginners with no prior coding experience. This comprehensive course will take you from zero to hero with hands-on projects and interactive coding challenges.',
        level: 'Beginner',
        duration: '8 weeks',
        certification: true,
        qrCode: '/assets/qr-python.png',
        mentors: [
          {
            name: 'Jane Doe',
            photo: 'https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083377_960_720.jpg',
            bio: 'Senior Python Developer with 8+ years experience teaching coding to beginners.'
          },
          {
            name: 'Alice Smith',
            photo: 'https://cdn.pixabay.com/photo/2018/01/15/07/52/woman-3083381_960_720.jpg',
            bio: 'Computer Science Professor specializing in introductory programming courses.'
          }
        ]
      },
      'python-numpy-pandas': {
        title: 'Python with NumPy & Pandas',
        description: 'Take your Python skills to the next level with data analysis. Learn how to manipulate data using NumPy arrays and Pandas DataFrames for real-world applications. This course covers data cleaning, visualization, statistical analysis and practical projects using actual datasets.',
        level: 'Intermediate',
        duration: '10 weeks',
        certification: true,
        qrCode: '/assets/qr-data.png',
        mentors: [
          {
            name: 'Maria Chen',
            photo: 'https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083376_960_720.jpg',
            bio: 'Data Scientist at TechCorp with expertise in NumPy, Pandas and data visualization.'
          },
          {
            name: 'Priya Kumar',
            photo: 'https://cdn.pixabay.com/photo/2021/09/24/02/48/girl-6651214_960_720.jpg',
            bio: 'Machine Learning Engineer who teaches data analysis to thousands of students online.'
          }
        ]
      }
    };

    // Replace all "Enroll Now" buttons with links to course detail pages
    document.querySelectorAll('.enroll-button').forEach(button => {
      const courseId = button.getAttribute('data-course');
      button.outerHTML = `<a href="#course-${courseId}" class="btn-primary text-base sm:text-lg px-6 py-3 inline-block text-center">View Details</a>`;
    });

    // Handle URL hash changes to show course detail
    function handleHashChange() {
      const hash = window.location.hash;

      // Hide all main sections initially
      document.querySelectorAll('section').forEach(section => {
        if (!section.id.startsWith('course-detail')) {
          section.style.display = '';
        }
      });

      const courseDetailSection = document.getElementById('course-detail');

      // Check if hash is for a course
      if (hash.startsWith('#course-')) {
        const courseId = hash.replace('#course-', '');
        const course = courseData[courseId];

        if (course) {
          // Hide other sections
          document.querySelectorAll('section:not(#course-detail)').forEach(section => {
            section.classList.add('hidden');
          });

          // Show course detail section
          courseDetailSection.classList.remove('hidden');

          // Generate course detail HTML
          const detailContent = document.getElementById('course-detail-content');

          let mentorsHtml = '';
          course.mentors.forEach(mentor => {
            mentorsHtml += `
              <div class="mentor-card mb-4">
                <img src="${mentor.photo}" alt="${mentor.name}" class="mentor-photo">
                <div>
                  <h4 class="font-bold text-lg">${mentor.name}</h4>
                  <p class="text-sm text-gray-600">${mentor.bio}</p>
                </div>
              </div>
            `;
          });

          detailContent.innerHTML = `
            <div class="course-header">
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold">${course.title}</h2>
              <div class="flex flex-wrap gap-3 justify-center">
                <span class="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-medium">${course.level}</span>
                <span class="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">${course.duration}</span>
                ${course.certification ? '<span class="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">Certificate</span>' : ''}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 course-content">
              <div class="md:col-span-2">
                <h3 class="text-2xl font-bold mb-4">Course Description</h3>
                <p class="course-description">${course.description}</p>

                <h3 class="text-2xl font-bold mb-4">Your Mentors</h3>
                <div class="space-y-4 mb-8">
                  ${mentorsHtml}
                </div>
              </div>

              <div class="enrollment-panel">
                <h3 class="text-xl font-bold mb-4">Enrollment & Payment</h3>
                <div class="qr-container">
                  <img src="${course.qrCode}" alt="Payment QR Code" class="w-36 h-36 mb-3" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`payment-${courseId}`)}'; this.onerror=null;">
                  <p class="text-sm text-gray-500">Course Code:</p>
                  <div class="course-code" onclick="copyText('${courseId.toUpperCase()}')" title="Click to copy">
                    ${courseId.toUpperCase()}
                  </div>
                </div>

                <button class="detail-enroll-button flex items-center justify-center gap-2" data-course="${courseId}" onclick="enrollUserInCourse('${courseId}')">
                  <i class="fas fa-graduation-cap"></i>
                  <span>Enroll Now</span>
                </button>
              </div>
            </div>
          `;

          // Scroll to top of course detail
          window.scrollTo(0, courseDetailSection.offsetTop - 100);
        }
      } else {
        // No course hash, show all sections
        courseDetailSection.classList.add('hidden');
        document.querySelectorAll('section:not(#course-detail)').forEach(section => {
          section.classList.remove('hidden');
        });
      }
    }

    // Function to copy text to clipboard
    function copyText(text) {
      navigator.clipboard.writeText(text).then(function() {
        alert('Course code copied to clipboard!');
      }, function(err) {
        console.error('Could not copy text: ', err);
      });
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Check hash on initial load
    document.addEventListener('DOMContentLoaded', function() {
      // ... existing code ...

      // Handle initial hash if present
      handleHashChange();

      // ... rest of code ...
    });

    // Add event listener for back button
    document.getElementById('back-to-courses').addEventListener('click', function(e) {
      e.preventDefault();
      window.location.hash = '#courses';
    });