// ============================================================
// BACKEND CONFIG
// Point this at your running PortfolioApi (see PortfolioApi.sln).
// Local dev with `dotnet run` usually prints the URL in the console
// (e.g. https://localhost:7000 or http://localhost:5236) - update it here.
// ============================================================
const API_BASE = 'https://localhost:7000/api';

// Session-only token storage (NOT localStorage - cleared when the tab/browser closes)
const ADMIN_TOKEN_KEY = 'portfolio_admin_token';

function getAdminToken() {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token) {
    if (token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
}

function authHeaders() {
    const token = getAdminToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Maps the API's ProjectDto shape -> the shape the existing UI code expects
// (project.images as a flat array of URL strings, absolute to the API).
function mapProjectFromApi(dto) {
    return {
        id: dto.id,
        name: dto.name,
        category: dto.category,
        description: dto.description,
        link: dto.link || '',
        github: dto.github || '',
        technologies: dto.technologies || [],
        images: (dto.images || []).map(img =>
            img.url.startsWith('http') ? img.url : `${API_BASE.replace(/\/api$/, '')}${img.url}`
        )
    };
}

async function fetchPortfolioFromApi() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
    const data = await res.json();
    return data.map(mapProjectFromApi);
}

// Portfolio Data
const defaultPortfolioData = [
    {
        id: 1,
        name: "History Fayoum Website",
        category: "web",
        description: "A comprehensive website showcasing the rich history and cultural heritage of Fayoum, Egypt.",
        images: [
            "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?w=800&h=600&fit=crop"
        ],
        link: "https://nour-cs19.github.io/HistoryFayoumWebsite/",
        github: "https://github.com/nour-cs19/HistoryFayoumWebsite",
        technologies: ["HTML5", "CSS3", "JavaScript"]
    },
    {
        id: 2,
        name: "Personal Portfolio",
        category: "web",
        description: "My personal portfolio website showcasing my skills, projects, and professional journey.",
        images: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop"
        ],
        link: "https://noureddinemaher.netlify.app/",
        github: "",
        technologies: ["HTML5", "CSS3", "JavaScript"]
    },
    {
        id: 3,
        name: "Interactive Web Application",
        category: "web",
        description: "A dynamic web application with modern UI/UX design and interactive elements.",
        images: [
            "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop"
        ],
        link: "https://lovely-genie-897156.netlify.app/",
        github: "",
        technologies: ["JavaScript", "CSS3"]
    },
    {
        id: 4,
        name: "Creative Landing Page",
        category: "design",
        description: "A visually stunning landing page with modern design aesthetics and smooth scrolling effects.",
        images: [
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=800&h=600&fit=crop"
        ],
        link: "https://66944aa1f55665c6866846f7--joyful-starlight-af9375.netlify.app/",
        github: "",
        technologies: ["HTML5", "CSS3", "Animation"]
    },
    {
        id: 5,
        name: "Modern Web Interface",
        category: "web",
        description: "A sleek and modern web interface featuring contemporary design patterns.",
        images: [
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop"
        ],
        link: "https://lively-sunflower-8abe8e.netlify.app/",
        github: "",
        technologies: ["HTML5", "CSS3", "JavaScript"]
    }
];

let portfolioData = [...defaultPortfolioData];
let isAdminMode = false;
let currentGalleryIndex = 0;
let currentGalleryImages = [];
let projectTechnologies = [];
let skillsData = [
    { id: 1, name: 'Angular', icon: 'fab fa-angular', description: 'Building scalable single-page applications with Angular and TypeScript.' },
    { id: 2, name: '.NET Core', icon: 'fas fa-server', description: 'Creating robust backend APIs and services using ASP.NET Core.' },
    { id: 3, name: 'C#', icon: 'fas fa-code', description: 'Writing clean, maintainable business logic and application code.' },
    { id: 4, name: 'TypeScript', icon: 'fas fa-file-code', description: 'Strongly typed frontend development for predictable, scalable apps.' },
    { id: 5, name: 'React', icon: 'fab fa-react', description: 'Fast UI development with reusable components and modern React patterns.' },
    { id: 6, name: 'SQL', icon: 'fas fa-database', description: 'Designing databases and querying data for reliable application storage.' },
    { id: 7, name: 'ASP.NET MVC', icon: 'fas fa-layer-group', description: 'Creating clean MVC architectures for secure website and application workflows.' },
    { id: 8, name: 'Entity Framework', icon: 'fas fa-network-wired', description: 'Implementing data access with Entity Framework and clean ORM patterns.' },
    { id: 9, name: 'Azure DevOps', icon: 'fab fa-microsoft', description: 'Automating builds, deployments, and CI/CD pipelines for .NET solutions.' },
    { id: 10, name: 'REST APIs', icon: 'fas fa-project-diagram', description: 'Designing RESTful services for scalable frontend-backend communication.' },
    { id: 11, name: 'JWT Authentication', icon: 'fas fa-user-lock', description: 'Securing applications with token-based authentication and authorization.' },
    { id: 12, name: 'Microservices', icon: 'fas fa-cubes', description: 'Decomposing large systems into independent services for flexibility and resilience.' },
    { id: 13, name: 'HTML5', icon: 'fab fa-html5', description: 'Structuring accessible and semantic markup for modern web pages.' },
    { id: 14, name: 'CSS3', icon: 'fab fa-css3-alt', description: 'Styling responsive interfaces with modern layouts, animations, and design systems.' },
    { id: 15, name: 'JavaScript', icon: 'fab fa-js-square', description: 'Building dynamic client experiences with native browser APIs and frameworks.' },
    { id: 16, name: 'Docker', icon: 'fab fa-docker', description: 'Containerizing applications for reproducible deployments and dev environments.' },
    { id: 17, name: 'Git', icon: 'fab fa-git-alt', description: 'Managing source control and collaboration with Git workflows.' },
    { id: 18, name: 'RxJS', icon: 'fas fa-wave-square', description: 'Handling reactive data flows cleanly in Angular and frontend applications.' }
];
let nextSkillId = skillsData.length + 1;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing...');
    
    refreshPortfolioFromApi();
    initializeLoadingScreen();
    initializeEventListeners();
    initializeAnimations();
    initializeTerminal();
    loadSkills();
    initializeAdminMode();
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
});

// Loading Screen Animation with Eraser Effect
function initializeLoadingScreen() {
    const typed1 = new Typed('.word-nour', {
        strings: ['Nour'],
        typeSpeed: 150,
        showCursor: true,
        cursorChar: '|',
        onComplete: function() {
            setTimeout(() => {
                const typed2 = new Typed('.word-eddine', {
                    strings: ['Eddine'],
                    typeSpeed: 150,
                    showCursor: true,
                    cursorChar: '|',
                    onComplete: function() {
                        setTimeout(() => {
                            const typed3 = new Typed('.word-maher', {
                                strings: ['Maher'],
                                typeSpeed: 150,
                                showCursor: true,
                                cursorChar: '|',
                                onComplete: function() {
                                    setTimeout(() => {
                                        eraseLoadingName();
                                    }, 800);
                                }
                            });
                        }, 400);
                    }
                });
            }, 400);
        }
    });
    
    setTimeout(() => {
        new Typed('#heroName', {
            strings: ['Nour Eddine Maher'],
            typeSpeed: 100,
            showCursor: false
        });
        
        new Typed('.typing', {
            strings: ['Frontend Developer', 'UI/UX Enthusiast', 'Problem Solver'],
            typeSpeed: 80,
            backSpeed: 50,
            loop: true
        });
    }, 3000);
}

// Erase Loading Name with Brush/Eraser Animation
function eraseLoadingName() {
    const words = [
        { element: document.querySelector('.word-maher'), delay: 0 },
        { element: document.querySelector('.word-eddine'), delay: 600 },
        { element: document.querySelector('.word-nour'), delay: 1200 }
    ];
    
    words.forEach((word, index) => {
        setTimeout(() => {
            if (word.element) {
                const text = word.element.textContent.replace('|', '').trim();
                word.element.innerHTML = text;
                
                const eraserContainer = document.createElement('div');
                eraserContainer.className = 'eraser-container';
                word.element.parentElement.appendChild(eraserContainer);
                
                let currentText = text;
                let charIndex = text.length - 1;
                
                const eraseInterval = setInterval(() => {
                    if (charIndex >= 0) {
                        const progress = (text.length - charIndex) / text.length;
                        eraserContainer.style.left = `${100 - (progress * 100)}%`;
                        
                        currentText = currentText.slice(0, -1);
                        word.element.textContent = currentText;
                        charIndex--;
                    } else {
                        clearInterval(eraseInterval);
                        eraserContainer.remove();
                        
                        if (index === words.length - 1) {
                            setTimeout(() => {
                                const loadingScreen = document.getElementById('loadingScreen');
                                loadingScreen.classList.add('hidden');
                                setTimeout(() => {
                                    loadingScreen.style.display = 'none';
                                }, 800);
                            }, 300);
                        }
                    }
                }, 50);
            }
        }, word.delay);
    });
}

// Terminal Animation
function initializeTerminal() {
    const lines = [
        { text: '> pnpm dlx shadcn@latest init', type: 'command', speed: 50 },
        { text: '✔ Preflight checks.', type: 'success', delay: 300 },
        { text: '✔ Verifying framework. Found Next.js.', type: 'success', delay: 200 },
        { text: '✔ Validating Tailwind CSS.', type: 'success', delay: 200 },
        { text: '✔ Validating import alias.', type: 'success', delay: 200 },
        { text: '✔ Writing components.json.', type: 'success', delay: 200 },
        { text: '✔ Checking registry.', type: 'success', delay: 200 },
        { text: '✔ Updating tailwind.config.ts', type: 'success', delay: 200 },
        { text: '✔ Updating app/globals.css', type: 'success', delay: 200 },
        { text: '✔ Installing dependencies.', type: 'success', delay: 200 },
        { text: 'ℹ Updated 1 file:\n- lib/utils.ts', type: 'info', delay: 300 },
        { text: 'Success! Project initialization completed.', type: 'final', speed: 40 },
        { text: 'You may now add components.', type: 'final', speed: 40 }
    ];

    const container = document.getElementById('terminalContent');
    if (!container) return;
    
    let currentLineIndex = 0;
    let isAnimating = false;

    function typeCharacter(element, text, index, speed, callback) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeCharacter(element, text, index + 1, speed, callback), speed);
        } else {
            if (callback) callback();
        }
    }

    function addLine(line, callback) {
        const div = document.createElement('div');
        div.className = 'terminal-line';
        
        if (line.type === 'command') {
            div.className += ' text-command';
            const span = document.createElement('span');
            span.className = 'typing-text';
            div.appendChild(span);
            container.appendChild(div);
            typeCharacter(span, line.text, 0, line.speed || 50, callback);
        } else if (line.type === 'success') {
            div.className += ' text-green';
            div.textContent = line.text;
            container.appendChild(div);
            setTimeout(callback, line.delay || 200);
        } else if (line.type === 'info') {
            div.className += ' text-blue';
            const parts = line.text.split('\n');
            div.innerHTML = parts[0] + '<span class="pl-2">' + parts[1] + '</span>';
            container.appendChild(div);
            setTimeout(callback, line.delay || 300);
        } else if (line.type === 'final') {
            div.className += ' text-muted';
            const span = document.createElement('span');
            span.className = 'typing-text';
            div.appendChild(span);
            container.appendChild(div);
            typeCharacter(span, line.text, 0, line.speed || 40, callback);
        }
    }

    function runAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        function processNextLine() {
            if (currentLineIndex < lines.length) {
                addLine(lines[currentLineIndex], function() {
                    currentLineIndex++;
                    processNextLine();
                });
            } else {
                setTimeout(function() {
                    container.innerHTML = '';
                    currentLineIndex = 0;
                    isAnimating = false;
                    runAnimation();
                }, 2000);
            }
        }
        
        processNextLine();
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runAnimation();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: '0px 0px -120px 0px'
    });

    const terminalElement = document.querySelector('.terminal');
    if (terminalElement) {
        observer.observe(terminalElement);
    } else {
        setTimeout(() => runAnimation(), 500);
    }
}

// Event Listeners
function initializeEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            toggleTheme();
            closeMobileMenu();
        });
    }
    
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', toggleAdmin);
    }
    
    const mobileAdminBtn = document.getElementById('mobileAdminBtn');
    if (mobileAdminBtn) {
        mobileAdminBtn.addEventListener('click', () => {
            toggleAdmin();
            closeMobileMenu();
        });
    }

    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            closeMobileMenu();
            
            if (target) {
                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }, 300);
            }
        });
    });

    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTop.classList.add('show');
            } else {
                scrollTop.classList.remove('show');
            }
        });

        scrollTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', showProjectManagerPage);
    }

    const projectManagerAddBtn = document.getElementById('projectManagerAddBtn');
    if (projectManagerAddBtn) {
        projectManagerAddBtn.addEventListener('click', function() {
            selectedProjectId = null;
            resetAddProjectForm();
            setProjectFormMode('add');
        });
    }

    const removeSelectedProjectBtn = document.getElementById('removeSelectedProjectBtn');
    if (removeSelectedProjectBtn) {
        removeSelectedProjectBtn.addEventListener('click', function() {
            if (selectedProjectId !== null) removeProject(selectedProjectId);
        });
    }

    const addSkillBtn = document.getElementById('addSkillBtn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => openModal('addSkillModal'));
    }

    const closeProjectPage = document.getElementById('closeProjectPage');
    if (closeProjectPage) {
        closeProjectPage.addEventListener('click', hideProjectManagerPage);
    }

    const closeAdminLoginPage = document.getElementById('closeAdminLoginPage');
    if (closeAdminLoginPage) {
        closeAdminLoginPage.addEventListener('click', hideAdminLoginPage);
    }

    const adminLoginPage = document.getElementById('adminLoginPage');
    if (adminLoginPage) {
        adminLoginPage.addEventListener('click', function(e) {
            if (e.target === adminLoginPage) hideAdminLoginPage();
        });
    }

    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addProject();
        });
    }

    const addSkillForm = document.getElementById('addSkillForm');
    if (addSkillForm) {
        addSkillForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addSkill();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('Failed to send message. Please try again or email me directly.', 'danger');
                }
            } catch (error) {
                showNotification('Network error. Please check your connection and try again.', 'danger');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    const projectImages = document.getElementById('projectImages');
    if (projectImages) {
        projectImages.addEventListener('change', function(e) {
            const files = e.target.files;
            const previewContainer = document.getElementById('imagePreviewContainer');
            if (previewContainer) {
                previewContainer.innerHTML = '';
                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        previewContainer.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            }
        });
    }

    const technologyInput = document.getElementById('technologyInput');
    if (technologyInput) {
        technologyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTechnology();
            }
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAdminLoginPage();
            hideProjectManagerPage();
            closeGallery();
        }
        
        const galleryModal = document.getElementById('galleryModal');
        if (galleryModal && galleryModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') changeGalleryImage(-1);
            if (e.key === 'ArrowRight') changeGalleryImage(1);
        }
    });
}

// Portfolio Functions

// Fetches the live project list from the backend (PortfolioApi) and renders it.
// Falls back to the bundled sample data only if the API can't be reached,
// so the page still shows something (with a warning) instead of going blank.
async function refreshPortfolioFromApi() {
    try {
        portfolioData = await fetchPortfolioFromApi();
        console.log('Loaded', portfolioData.length, 'projects from API');
    } catch (err) {
        console.error('Could not load projects from API, using fallback data:', err);
        portfolioData = [...defaultPortfolioData];
        showNotification('Could not reach the backend API - showing sample data. Check API_BASE in index.js.', 'warning');
    }
    loadPortfolio();
}

function loadPortfolio() {
    console.log('Loading portfolio...', portfolioData.length, 'projects');
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) {
        console.error('Portfolio grid not found!');
        return;
    }
    
    portfolioGrid.innerHTML = '';
    portfolioData.forEach(project => {
        const projectElement = createProjectElement(project);
        portfolioGrid.appendChild(projectElement);
    });
    console.log('Portfolio loaded successfully!');
}

function createProjectElement(project) {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'portfolio-item';
    projectDiv.setAttribute('data-category', project.category);

    let technologiesHTML = '';
    if (project.technologies && project.technologies.length > 0) {
        technologiesHTML = '<div class="portfolio-technologies">';
        project.technologies.forEach(tech => {
            technologiesHTML += `<span class="tech-tag">${tech}</span>`;
        });
        technologiesHTML += '</div>';
    }

    const mainImage = project.images && project.images.length > 0 ? project.images[0] : 
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop';

    const githubLink = project.github ? 
        `<a href="${project.github}" class="portfolio-link" target="_blank" rel="noopener noreferrer" title="GitHub Repository" onclick="event.stopPropagation()">
            <i class="fab fa-github"></i>
        </a>` : '';

    const removeBtn = isAdminMode ? 
        `<button class="remove-btn" onclick="removeProject(${project.id}); event.stopPropagation();" title="Remove Project">
            <i class="fas fa-trash"></i>
        </button>` : '';

    projectDiv.innerHTML = `
        <div class="portfolio-image" onclick="openGallery(${project.id})">
            <img src="${mainImage}" alt="${project.name}" loading="lazy">
            <div class="portfolio-overlay">
                <button class="gallery-btn" onclick="event.stopPropagation(); openGallery(${project.id})" title="View Gallery">
                    <i class="fas fa-images"></i>
                </button>
                ${githubLink}
                <a href="${project.link}" class="portfolio-link" target="_blank" rel="noopener noreferrer" title="Live Demo" onclick="event.stopPropagation()">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                ${removeBtn}
            </div>
        </div>
        <div class="portfolio-info">
            <h4>${project.name}</h4>
            <p class="portfolio-category">${getCategoryName(project.category)}</p>
            <p>${project.description}</p>
            ${technologiesHTML}
        </div>
    `;

    return projectDiv;
}

function getCategoryName(category) {
    const categories = {
        'web': 'Web Development',
        'design': 'Design',
        'mobile': 'Mobile App'
    };
    return categories[category] || 'Project';
}

function filterPortfolio(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Theme Functions
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    updateThemeIcon(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function updateThemeIcon(isDark) {
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    if (themeToggle) themeToggle.querySelector('i').className = `fas ${icon}`;
    if (mobileThemeToggle) mobileThemeToggle.querySelector('i').className = `fas ${icon}`;
}

function updateAdminModeUI() {
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const adminBtn = document.getElementById('adminBtn');
    const mobileAdminBtn = document.getElementById('mobileAdminBtn');

    if (addProjectBtn) addProjectBtn.style.display = isAdminMode ? 'inline-block' : 'none';
    if (addSkillBtn) addSkillBtn.style.display = isAdminMode ? 'inline-flex' : 'none';
    if (adminBtn) {
        adminBtn.textContent = isAdminMode ? 'Exit Admin' : 'Admin';
        adminBtn.style.background = isAdminMode ? 'var(--danger)' : 'var(--gradient)';
    }
    if (mobileAdminBtn) {
        mobileAdminBtn.textContent = isAdminMode ? 'Exit Admin' : 'Admin';
        mobileAdminBtn.style.background = isAdminMode ? 'var(--danger)' : 'var(--gradient)';
    }
}

function initializeAdminMode() {
    const token = getAdminToken();
    isAdminMode = !!token;
    updateAdminModeUI();
}

// Admin Functions
function toggleAdmin() {
    if (isAdminMode) {
        isAdminMode = false;
        setAdminToken(null);
        const addProjectBtn = document.getElementById('addProjectBtn');
        const addSkillBtn = document.getElementById('addSkillBtn');
        const adminBtn = document.getElementById('adminBtn');
        const mobileAdminBtn = document.getElementById('mobileAdminBtn');
        
        if (addProjectBtn) addProjectBtn.style.display = 'none';
        if (addSkillBtn) addSkillBtn.style.display = 'none';
        if (adminBtn) {
            adminBtn.textContent = 'Admin';
            adminBtn.style.background = 'var(--gradient)';
        }
        if (mobileAdminBtn) {
            mobileAdminBtn.textContent = 'Admin';
            mobileAdminBtn.style.background = 'var(--gradient)';
        }
        
        loadPortfolio();
        showNotification('Exited admin mode.', 'success');
    } else {
        showAdminLoginPage();
    }
}

async function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;

    const loginBtn = document.querySelector('#adminLoginForm button[type="submit"]');
    const originalBtnText = loginBtn ? loginBtn.innerHTML : null;
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            showNotification('Invalid username or password!', 'danger');
            document.getElementById('adminLoginForm').reset();
            return;
        }

        const data = await res.json();
        setAdminToken(data.token);

        isAdminMode = true;
        const addProjectBtn = document.getElementById('addProjectBtn');
        const addSkillBtn = document.getElementById('addSkillBtn');
        const adminBtn = document.getElementById('adminBtn');
        const mobileAdminBtn = document.getElementById('mobileAdminBtn');

        if (addProjectBtn) addProjectBtn.style.display = 'inline-block';
        if (addSkillBtn) addSkillBtn.style.display = 'inline-flex';
        if (adminBtn) {
            adminBtn.textContent = 'Exit Admin';
            adminBtn.style.background = 'var(--danger)';
        }
        if (mobileAdminBtn) {
            mobileAdminBtn.textContent = 'Exit Admin';
            mobileAdminBtn.style.background = 'var(--danger)';
        }

        isAdminMode = true;
        updateAdminModeUI();
        showNotification('Admin login successful!', 'success');
        hideAdminLoginPage();
        loadPortfolio();
    } catch (err) {
        console.error('Login failed:', err);
        showNotification('Network error - could not reach the backend API.', 'danger');
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnText;
        }
    }
}

// Modal Functions
function showAdminLoginPage() {
    const page = document.getElementById('adminLoginPage');
    if (page) {
        page.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideAdminLoginPage() {
    const page = document.getElementById('adminLoginPage');
    if (page) {
        page.classList.remove('active');
        document.body.style.overflow = '';
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) loginForm.reset();
    }
}

function showProjectManagerPage() {
    const page = document.getElementById('projectManagerPage');
    if (page) {
        page.classList.add('active');
        document.body.style.overflow = 'hidden';
        projectTechnologies = [];
        updateTechnologyDisplay();
        loadProjectSidebar();
        resetAddProjectForm();
        setProjectFormMode('add');
    }
}

function hideProjectManagerPage() {
    const page = document.getElementById('projectManagerPage');
    if (page) {
        page.classList.remove('active');
        document.body.style.overflow = '';
        const projectForm = document.getElementById('addProjectForm');
        if (projectForm) projectForm.reset();
        const previewContainer = document.getElementById('imagePreviewContainer');
        if (previewContainer) previewContainer.innerHTML = '';
        projectTechnologies = [];
        updateTechnologyDisplay();
        selectedProjectId = null;
        hideSelectedProjectInfo();
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function loadProjectSidebar() {
    const sidebar = document.getElementById('projectListSidebar');
    if (!sidebar) return;

    sidebar.innerHTML = portfolioData
        .map(project => `
            <div class="sidebar-project-item" data-id="${project.id}">
                <button type="button" class="sidebar-project-link" onclick="selectProjectForDetails(${project.id})">
                    <span class="project-title">${project.name}</span>
                    <span class="project-meta">${getCategoryName(project.category)}</span>
                </button>
                <button type="button" class="sidebar-remove-btn" onclick="removeProject(${project.id})" title="Remove project">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
}

function selectProjectForDetails(projectId) {
    const project = portfolioData.find(p => p.id === projectId);
    if (!project) return;

    selectedProjectId = projectId;
    const detailsPanel = document.getElementById('projectDetailsPanel');
    const selectedInfo = document.getElementById('selectedProjectInfo');
    const emptyInfo = detailsPanel.querySelector('.details-empty');

    if (selectedInfo && emptyInfo) {
        emptyInfo.classList.add('hidden');
        selectedInfo.classList.remove('hidden');
        document.getElementById('selectedProjectName').textContent = project.name;
        document.getElementById('selectedProjectCategory').textContent = getCategoryName(project.category);
        document.getElementById('selectedProjectDescription').textContent = project.description;
        document.getElementById('selectedProjectLink').href = project.link || '#';

        const techContainer = document.getElementById('selectedProjectTech');
        techContainer.innerHTML = project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    }
}

function hideSelectedProjectInfo() {
    const detailsPanel = document.getElementById('projectDetailsPanel');
    if (!detailsPanel) return;
    const selectedInfo = document.getElementById('selectedProjectInfo');
    const emptyInfo = detailsPanel.querySelector('.details-empty');
    if (selectedInfo && emptyInfo) {
        emptyInfo.classList.remove('hidden');
        selectedInfo.classList.add('hidden');
    }
}

function resetAddProjectForm() {
    const projectForm = document.getElementById('addProjectForm');
    if (projectForm) projectForm.reset();
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) previewContainer.innerHTML = '';
    projectTechnologies = [];
    updateTechnologyDisplay();
}

function setProjectFormMode(mode) {
    const title = document.getElementById('projectFormTitle');
    const subtitle = document.getElementById('projectFormSubtitle');
    const submitBtn = document.querySelector('#addProjectForm button[type="submit"]');

    if (mode === 'edit') {
        if (title) title.textContent = 'Edit Project';
        if (subtitle) subtitle.textContent = 'Update selected portfolio project.';
        if (submitBtn) submitBtn.textContent = 'Update Project';
    } else {
        if (title) title.textContent = 'Add New Project';
        if (subtitle) subtitle.textContent = 'Create a new portfolio entry for your portfolio.';
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Project';
    }
}

// Technology Management
function addTechnology() {
    const input = document.getElementById('technologyInput');
    const techValue = input.value.trim();
    
    if (!techValue) {
        showNotification('Please enter a technology name!', 'warning');
        return;
    }
    
    if (projectTechnologies.includes(techValue)) {
        showNotification('Technology already added!', 'warning');
        return;
    }
    
    projectTechnologies.push(techValue);
    updateTechnologyDisplay();
    input.value = '';
}

function removeTechnology(tech) {
    projectTechnologies = projectTechnologies.filter(t => t !== tech);
    updateTechnologyDisplay();
}

function updateTechnologyDisplay() {
    const container = document.getElementById('technologiesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    projectTechnologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.innerHTML = `
            ${tech}
            <button type="button" onclick="removeTechnology('${tech}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tag);
    });
}

function loadSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;
    skillsGrid.innerHTML = '';
    skillsData.forEach(skill => {
        skillsGrid.appendChild(createSkillCard(skill));
    });
}

function createSkillCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
        <div class="skill-card-inner">
            <i class="${skill.icon}"></i>
            <h4>${skill.name}</h4>
            <p>${skill.description}</p>
        </div>
    `;
    return card;
}

function addSkill() {
    const name = document.getElementById('skillName').value.trim();
    const icon = document.getElementById('skillIcon').value.trim();
    const description = document.getElementById('skillDescription').value.trim();

    if (!name || !icon || !description) {
        showNotification('Please fill out all skill fields!', 'warning');
        return;
    }

    if (skillsData.some(skill => skill.name.toLowerCase() === name.toLowerCase())) {
        showNotification('This skill is already listed.', 'warning');
        return;
    }

    skillsData.push({
        id: nextSkillId++,
        name,
        icon,
        description
    });

    loadSkills();
    closeModal('addSkillModal');
    document.getElementById('addSkillForm').reset();
    showNotification('Skill added successfully!', 'success');
}

// Add Project - sends the form straight to the backend (multipart/form-data),
// which stores the images in the database. Nothing is kept in the browser.
let selectedProjectId = null;

async function addProject() {
    const name = document.getElementById('projectName').value.trim();
    const category = document.getElementById('projectCategory').value;
    const description = document.getElementById('projectDescription').value.trim();
    const files = document.getElementById('projectImages').files;
    const link = document.getElementById('projectLink').value.trim();
    const github = document.getElementById('projectGithub').value.trim();

    if (!name || !category || !description || files.length === 0 || !link) {
        showNotification('Please fill all required fields!', 'danger');
        return;
    }

    if (files.length !== 5) {
        showNotification('Please select exactly 5 images!', 'warning');
        return;
    }

    if (projectTechnologies.length === 0) {
        showNotification('Please add at least one technology!', 'warning');
        return;
    }

    const submitBtn = document.querySelector('#addProjectForm button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    }

    try {
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Category', category);
        formData.append('Description', description);
        formData.append('Link', link);
        formData.append('GitHub', github || '');
        formData.append('Technologies', projectTechnologies.join(','));
        Array.from(files).forEach(file => formData.append('Images', file));

        const res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { ...authHeaders() }, // don't set Content-Type manually - the browser sets the multipart boundary
            body: formData
        });

        if (res.status === 401 || res.status === 403) {
            showNotification('Your admin session expired - please log in again.', 'danger');
            return;
        }
        if (!res.ok) {
            showNotification('Failed to add project. Please try again.', 'danger');
            return;
        }

        await refreshPortfolioFromApi();
        hideProjectManagerPage();
        projectTechnologies = [];
        showNotification('Project added successfully!', 'success');
    } catch (err) {
        console.error('Add project failed:', err);
        showNotification('Network error - could not reach the backend API.', 'danger');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

async function removeProject(id) {
    if (!confirm('Are you sure you want to remove this project?')) return;

    try {
        const res = await fetch(`${API_BASE}/projects/${id}`, {
            method: 'DELETE',
            headers: { ...authHeaders() }
        });

        if (res.status === 401 || res.status === 403) {
            showNotification('Your admin session expired - please log in again.', 'danger');
            return;
        }
        if (!res.ok && res.status !== 404) {
            showNotification('Failed to remove project. Please try again.', 'danger');
            return;
        }

        await refreshPortfolioFromApi();
        showNotification('Project removed successfully!', 'success');
    } catch (err) {
        console.error('Remove project failed:', err);
        showNotification('Network error - could not reach the backend API.', 'danger');
    }
}

// Gallery Functions
function openGallery(projectId) {
    const project = portfolioData.find(p => p.id === projectId);
    if (!project || !project.images || project.images.length === 0) return;

    currentGalleryImages = project.images;
    currentGalleryIndex = 0;

    const modal = document.getElementById('galleryModal');
    const title = document.getElementById('galleryTitle');
    const mainImage = document.getElementById('galleryMainImage');
    const thumbnails = document.getElementById('galleryThumbnails');
    const info = document.getElementById('galleryInfo');
    const meta = document.getElementById('galleryMeta');
    const technologies = document.getElementById('galleryTechnologies');
    const actions = document.getElementById('galleryActions');

    if (title) title.textContent = project.name;
    if (mainImage) {
        mainImage.src = currentGalleryImages[0];
        mainImage.alt = project.name;
    }

    if (info) {
        info.textContent = project.description;
    }

    if (meta) {
        meta.innerHTML = `
            <strong>Category:</strong> ${getCategoryName(project.category)} &nbsp;|&nbsp; 
            <strong>Image:</strong> <span id="currentImageNumber">1</span> / ${currentGalleryImages.length}
        `;
    }

    const imageContainer = document.querySelector('.gallery-image-container');
    if (imageContainer) {
        let dotsContainer = imageContainer.querySelector('.gallery-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'gallery-dots';
            imageContainer.appendChild(dotsContainer);
        }
        
        dotsContainer.innerHTML = '';
        currentGalleryImages.forEach((img, index) => {
            const dot = document.createElement('div');
            dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => showGalleryImage(index);
            dotsContainer.appendChild(dot);
        });
    }

    if (thumbnails) {
        thumbnails.innerHTML = '';
        currentGalleryImages.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.className = index === 0 ? 'active' : '';
            thumb.alt = `${project.name} - Image ${index + 1}`;
            thumb.onclick = () => showGalleryImage(index);
            thumbnails.appendChild(thumb);
        });
    }

    if (technologies && project.technologies && project.technologies.length > 0) {
        technologies.innerHTML = '';
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'gallery-tech-tag';
            tag.textContent = tech;
            technologies.appendChild(tag);
        });
    } else if (technologies) {
        technologies.innerHTML = '';
    }

    if (actions) {
        actions.innerHTML = '';
        
        const demoBtn = document.createElement('a');
        demoBtn.href = project.link;
        demoBtn.target = '_blank';
        demoBtn.rel = 'noopener noreferrer';
        demoBtn.className = 'gallery-action-btn demo-btn';
        demoBtn.innerHTML = '<i class="fas fa-external-link-alt"></i><span>Live Demo</span>';
        actions.appendChild(demoBtn);

        if (project.github) {
            const githubBtn = document.createElement('a');
            githubBtn.href = project.github;
            githubBtn.target = '_blank';
            githubBtn.rel = 'noopener noreferrer';
            githubBtn.className = 'gallery-action-btn github-btn';
            githubBtn.innerHTML = '<i class="fab fa-github"></i><span>GitHub Repo</span>';
            actions.appendChild(githubBtn);
        }
    }

    if (modal) {
        modal.style.display = 'flex';
        modal.dataset.projectId = projectId;
        document.body.style.overflow = 'hidden';
    }
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function changeGalleryImage(direction) {
    if (currentGalleryImages.length === 0) return;

    currentGalleryIndex += direction;
    if (currentGalleryIndex < 0) currentGalleryIndex = currentGalleryImages.length - 1;
    else if (currentGalleryIndex >= currentGalleryImages.length) currentGalleryIndex = 0;

    showGalleryImage(currentGalleryIndex);
}

function showGalleryImage(index) {
    currentGalleryIndex = index;
    const mainImage = document.getElementById('galleryMainImage');
    const thumbnails = document.querySelectorAll('#galleryThumbnails img');
    const dots = document.querySelectorAll('.gallery-dot');
    const imageNumber = document.getElementById('currentImageNumber');

    if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = currentGalleryImages[index];
            mainImage.style.opacity = '1';
        }, 150);
    }

    thumbnails.forEach((thumb, i) => {
        thumb.className = i === index ? 'active' : '';
    });

    dots.forEach((dot, i) => {
        dot.className = i === index ? 'gallery-dot active' : 'gallery-dot';
    });

    if (imageNumber) {
        imageNumber.textContent = index + 1;
    }

    const activeThumbnail = thumbnails[index];
    if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Utility Functions
function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    if (navMenu) navMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 400px;
        word-wrap: break-word;
    `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Make functions global
window.openGallery = openGallery;
window.closeGallery = closeGallery;
window.changeGalleryImage = changeGalleryImage;
window.showGalleryImage = showGalleryImage;
window.removeProject = removeProject;
window.removeTechnology = removeTechnology;
window.addTechnology = addTechnology;
window.closeModal = closeModal;