// ===== Form Validation ===== 
class FormValidator {
    constructor() {
        this.errors = {};
    }

    validateName(name) {
        if (!name || name.trim() === '') {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        return '';
    }

    validateEmail(email) {
        if (!email || email.trim() === '') {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    validatePhone(phone) {
        if (!phone || phone.trim() === '') {
            return 'Contact number is required';
        }
        // Remove common formatting characters
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
            return 'Please enter a valid contact number (10-15 digits)';
        }
        return '';
    }

    validateAll(data) {
        this.errors = {};
        
        const nameError = this.validateName(data.name);
        if (nameError) this.errors.name = nameError;
        
        const emailError = this.validateEmail(data.email);
        if (emailError) this.errors.email = emailError;
        
        const phoneError = this.validatePhone(data.phone);
        if (phoneError) this.errors.phone = phoneError;

        return Object.keys(this.errors).length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

// ===== Local Storage Management ===== 
class StorageManager {
    static saveUserData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    }

    static getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    }

    static saveProfessionalData(data) {
        localStorage.setItem('professionalData', JSON.stringify(data));
    }

    static getProfessionalData() {
        const data = localStorage.getItem('professionalData');
        return data ? JSON.parse(data) : null;
    }

    static clearUserData() {
        localStorage.removeItem('userData');
        localStorage.removeItem('professionalData');
    }

    static hasUserData() {
        return localStorage.getItem('userData') !== null;
    }
}

// ===== Page Navigation ===== 
class PageManager {
    constructor() {
        this.currentPage = 'landing-page';
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            window.scrollTo(0, 0);
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// ===== Application Controller ===== 
class App {
    constructor() {
        this.validator = new FormValidator();
        this.pageManager = new PageManager();
        this.userData = null;
        this.professionalData = null;
        this.skills = [];
        this.selectedSkill = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        // Landing form submission
        const landingForm = document.getElementById('landing-form');
        if (landingForm) {
            landingForm.addEventListener('submit', (e) => this.handleLandingFormSubmit(e));
        }

        // Dashboard buttons
        const startAssessmentBtn = document.getElementById('start-assessment-btn');
        if (startAssessmentBtn) {
            startAssessmentBtn.addEventListener('click', () => {
                this.loadSavedProfessionalData();
                this.pageManager.showPage('user-input-page');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // User Input Page
        const userInputForm = document.getElementById('user-input-form');
        if (userInputForm) {
            userInputForm.addEventListener('submit', (e) => this.handleUserInputSubmit(e));
        }

        const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
        if (backToDashboardBtn) {
            backToDashboardBtn.addEventListener('click', () => this.pageManager.showPage('dashboard-page'));
        }

        // Skills management
        const addSkillBtn = document.getElementById('add-skill-btn');
        const skillsInput = document.getElementById('skills-input');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addSkill();
            });
        }
        if (skillsInput) {
            skillsInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addSkill();
                }
            });
        }

        // Suggested Skills Page buttons
        const backToInputBtn = document.getElementById('back-to-input-btn');
        if (backToInputBtn) {
            backToInputBtn.addEventListener('click', () => {
                this.loadSavedProfessionalData();
                this.pageManager.showPage('user-input-page');
            });
        }

        const downloadReportBtn = document.getElementById('download-report-btn');
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener('click', () => this.downloadReport());
        }

        const startNewAssessmentBtn = document.getElementById('start-new-assessment-btn');
        if (startNewAssessmentBtn) {
            startNewAssessmentBtn.addEventListener('click', () => this.handleLogout());
        }

        // Functionalities Page
        const backToSuggestionsBtn = document.getElementById('back-to-suggestions-btn');
        const backToSuggestionsBtnBottom = document.getElementById('back-to-suggestions-btn-bottom');
        if (backToSuggestionsBtn) {
            backToSuggestionsBtn.addEventListener('click', () => this.pageManager.showPage('suggested-skills-page'));
        }
        if (backToSuggestionsBtnBottom) {
            backToSuggestionsBtnBottom.addEventListener('click', () => this.pageManager.showPage('suggested-skills-page'));
        }

        // Feature tabs
        const featureTabs = document.querySelectorAll('.feature-tab');
        featureTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const featureId = tab.dataset.feature;
                this.switchFeature(featureId);
            });
        });

        // Feature buttons
        document.getElementById('log-practice-btn')?.addEventListener('click', () => this.handleLogPractice());
        document.getElementById('set-reminder-btn')?.addEventListener('click', () => this.handleSetReminder());
        document.getElementById('download-roadmap-btn')?.addEventListener('click', () => this.handleDownloadRoadmap());
        document.getElementById('create-gap-plan-btn')?.addEventListener('click', () => this.handleCreateGapPlan());
        document.getElementById('optimize-learning-btn')?.addEventListener('click', () => this.handleOptimizeLearning());
        document.getElementById('save-analysis-btn')?.addEventListener('click', () => this.handleSaveAnalysis());
        document.getElementById('send-mentor-msg')?.addEventListener('click', () => this.handleMentorMessage());

        // Quick questions for mentor
        document.querySelectorAll('.btn-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = btn.dataset.question;
                this.handleMentorQuestion(question);
            });
        });

        // Real-time validation on input for landing form
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (nameInput) nameInput.addEventListener('blur', () => this.validateField('name'));
        if (emailInput) emailInput.addEventListener('blur', () => this.validateField('email'));
        if (phoneInput) phoneInput.addEventListener('blur', () => this.validateField('phone'));
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!input || !errorElement) return;

        let error = '';
        const value = input.value;

        switch (fieldName) {
            case 'name':
                error = this.validator.validateName(value);
                break;
            case 'email':
                error = this.validator.validateEmail(value);
                break;
            case 'phone':
                error = this.validator.validatePhone(value);
                break;
        }

        if (error) {
            errorElement.textContent = error;
            input.style.borderColor = '#e74c3c';
        } else {
            errorElement.textContent = '';
            input.style.borderColor = '#e0e0e0';
        }
    }

    handleLandingFormSubmit(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        // Validate all fields
        if (!this.validator.validateAll(formData)) {
            const errors = this.validator.getErrors();
            Object.keys(errors).forEach(fieldName => {
                const errorElement = document.getElementById(`${fieldName}-error`);
                const input = document.getElementById(fieldName);
                if (errorElement && input) {
                    errorElement.textContent = errors[fieldName];
                    input.style.borderColor = '#e74c3c';
                }
            });
            return;
        }

        // Save user data
        this.userData = formData;
        StorageManager.saveUserData(formData);

        // Load dashboard with user data
        this.loadDashboard();

        // Navigate to dashboard
        this.pageManager.showPage('dashboard-page');
    }

    loadDashboard() {
        if (!this.userData) return;

        const name = this.userData.name.split(' ')[0];
        document.getElementById('user-name').textContent = name;
        document.getElementById('display-name').textContent = this.userData.name;
        document.getElementById('display-email').textContent = this.userData.email;
        document.getElementById('display-phone').textContent = this.userData.phone;
    }

    handleUserInputSubmit(event) {
        event.preventDefault();

        const formData = {
            fieldOfExperience: document.getElementById('field-of-experience').value,
            yearsExperience: document.getElementById('years-experience').value,
            areaOfInterest: document.getElementById('area-of-interest').value,
            skills: this.skills
        };

        // Validate
        let hasErrors = false;
        if (!formData.fieldOfExperience) {
            document.getElementById('field-error').textContent = 'Please select a field';
            hasErrors = true;
        } else {
            document.getElementById('field-error').textContent = '';
        }

        if (!formData.yearsExperience || formData.yearsExperience < 0) {
            document.getElementById('years-error').textContent = 'Please enter valid years of experience';
            hasErrors = true;
        } else {
            document.getElementById('years-error').textContent = '';
        }

        if (!formData.areaOfInterest.trim()) {
            document.getElementById('area-error').textContent = 'Please enter your area of interest';
            hasErrors = true;
        } else {
            document.getElementById('area-error').textContent = '';
        }

        if (formData.skills.length === 0) {
            document.getElementById('skills-error').textContent = 'Please add at least one skill';
            hasErrors = true;
        } else {
            document.getElementById('skills-error').textContent = '';
        }

        if (hasErrors) return;

        // Save professional data
        this.professionalData = formData;
        StorageManager.saveProfessionalData(formData);

        // Generate suggestions and navigate
        this.generateSuggestedSkills();
        this.pageManager.showPage('suggested-skills-page');
    }

    addSkill() {
        const skillsInput = document.getElementById('skills-input');
        const skill = skillsInput.value.trim();

        if (!skill) {
            alert('Please enter a skill');
            return;
        }

        if (this.skills.includes(skill)) {
            alert('This skill is already added');
            return;
        }

        this.skills.push(skill);
        skillsInput.value = '';
        this.renderSkillsTags();
        document.getElementById('skills-error').textContent = '';
    }

    removeSkill(skill) {
        this.skills = this.skills.filter(s => s !== skill);
        this.renderSkillsTags();
    }

    renderSkillsTags() {
        const skillsTagsDiv = document.getElementById('skills-tags');
        skillsTagsDiv.innerHTML = '';

        this.skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <button type="button" data-skill="${skill}">×</button>
            `;
            tag.querySelector('button').addEventListener('click', (e) => {
                e.preventDefault();
                this.removeSkill(skill);
            });
            skillsTagsDiv.appendChild(tag);
        });
    }

    generateSuggestedSkills() {
        // Skill database with platform information
        const skillsDatabase = {
            high: {
                'information-technology': [
                    { name: 'Kubernetes', platforms: [{ name: 'Coursera', url: 'https://coursera.org/search?query=kubernetes' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=kubernetes' }, { name: 'Linux Academy', url: 'https://linuxacademy.com' }] },
                    { name: 'Docker', platforms: [{ name: 'Coursera', url: 'https://coursera.org/search?query=docker' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=docker' }, { name: 'Pluralsight', url: 'https://pluralsight.com' }] },
                    { name: 'AWS', platforms: [{ name: 'Coursera', url: 'https://coursera.org/search?query=aws' }, { name: 'AWS Training', url: 'https://aws.amazon.com/training' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=aws' }] },
                    { name: 'Azure', platforms: [{ name: 'Microsoft Learn', url: 'https://learn.microsoft.com' }, { name: 'Coursera', url: 'https://coursera.org/search?query=azure' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=azure' }] },
                    { name: 'GCP', platforms: [{ name: 'Google Cloud', url: 'https://cloud.google.com/training' }, { name: 'Coursera', url: 'https://coursera.org/search?query=gcp' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=gcp' }] },
                    { name: 'Python', platforms: [{ name: 'Coursera', url: 'https://coursera.org/search?query=python' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=python' }, { name: 'DataCamp', url: 'https://datacamp.com' }] },
                    { name: 'Go', platforms: [{ name: 'Udemy', url: 'https://udemy.com/search/?q=go' }, { name: 'Coursera', url: 'https://coursera.org/search?query=go' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] },
                    { name: 'Rust', platforms: [{ name: 'Udemy', url: 'https://udemy.com/search/?q=rust' }, { name: 'Coursera', url: 'https://coursera.org/search?query=rust' }, { name: 'O\'Reilly', url: 'https://oreilly.com' }] },
                    { name: 'DevOps', platforms: [{ name: 'Linux Academy', url: 'https://linuxacademy.com' }, { name: 'Udemy', url: 'https://udemy.com/search/?q=devops' }, { name: 'Coursera', url: 'https://coursera.org/search?query=devops' }] },
                    { name: 'CI/CD', platforms: [{ name: 'Udemy', url: 'https://udemy.com/search/?q=ci+cd' }, { name: 'Coursera', url: 'https://coursera.org/search?query=ci+cd' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] }
                ],
                'finance': [
                    { name: 'Python', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'SQL', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'RPA', platforms: [{ name: 'UiPath Academy', url: 'https://academy.uipath.com' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'Coursera', url: 'https://coursera.org' }] },
                    { name: 'Machine Learning', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Big Data', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Tableau', platforms: [{ name: 'Tableau Training', url: 'https://public.tableau.com/app/resources/learn' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Power BI', platforms: [{ name: 'Microsoft Learn', url: 'https://learn.microsoft.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Risk Analysis', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'edX', url: 'https://edx.org' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ],
                'healthcare': [
                    { name: 'EHR Systems', platforms: [{ name: 'Epic Training', url: 'https://epic.com' }, { name: 'Cerner Academy', url: 'https://cerner.com' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] },
                    { name: 'Data Analysis', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'HIPAA Compliance', platforms: [{ name: 'Compliance Training', url: 'https://complianceeducation.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Healthcare Analytics', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ],
                'education': [
                    { name: 'Learning Management', platforms: [{ name: 'Canvas Training', url: 'https://canvas.instructure.com' }, { name: 'Moodle', url: 'https://moodle.org' }, { name: 'Coursera', url: 'https://coursera.org' }] },
                    { name: 'Online Teaching Tools', platforms: [{ name: 'Zoom Training', url: 'https://zoom.us/docs' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Data Analytics', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'EdTech Platforms', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] }
                ],
                'default': [
                    { name: 'Cloud Computing', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'A Cloud Guru', url: 'https://acloudguru.com' }] },
                    { name: 'Data Science', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Artificial Intelligence', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'edX', url: 'https://edx.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Machine Learning', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Cybersecurity', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'eLearnSecurity', url: 'https://elearnsecurity.com' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ]
            },
            medium: {
                'information-technology': [
                    { name: 'Microservices', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'Pluralsight', url: 'https://pluralsight.com' }] },
                    { name: 'GraphQL', platforms: [{ name: 'Udemy', url: 'https://udemy.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] },
                    { name: 'TensorFlow', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'Pluralsight', url: 'https://pluralsight.com' }] },
                    { name: 'Data Engineering', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Infrastructure as Code', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Linux Academy', url: 'https://linuxacademy.com' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ],
                'finance': [
                    { name: 'Blockchain', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'edX', url: 'https://edx.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Quantitative Analysis', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'edX', url: 'https://edx.org' }] },
                    { name: 'Financial Modeling', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'CFI', url: 'https://corporatefinanceinstitute.com' }] },
                    { name: 'Cryptocurrency', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'edX', url: 'https://edx.org' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ],
                'healthcare': [
                    { name: 'IoT for Healthcare', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'edX', url: 'https://edx.org' }] },
                    { name: 'Medical Imaging', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'edX', url: 'https://edx.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Bioinformatics', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'edX', url: 'https://edx.org' }, { name: 'DataCamp', url: 'https://datacamp.com' }] }
                ],
                'education': [
                    { name: 'Virtual Reality Education', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] },
                    { name: 'AI Tutoring', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'edX', url: 'https://edx.org' }] },
                    { name: 'Gamification', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] }
                ],
                'default': [
                    { name: 'Cloud Architecture', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'A Cloud Guru', url: 'https://acloudguru.com' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'API Development', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'Pluralsight', url: 'https://pluralsight.com' }] },
                    { name: 'Database Management', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Analytics', platforms: [{ name: 'DataCamp', url: 'https://datacamp.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ]
            },
            low: {
                'information-technology': [
                    { name: 'Monolithic Architecture', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Waterfall Development', platforms: [{ name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Legacy Systems', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Flash Development', platforms: [{ name: 'Archive.org', url: 'https://archive.org' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] }
                ],
                'finance': [
                    { name: 'Manual Trading', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'edX', url: 'https://edx.org' }] },
                    { name: 'Legacy Banking', platforms: [{ name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'VBA Macro', platforms: [{ name: 'Udemy', url: 'https://udemy.com' }, { name: 'Microsoft Learn', url: 'https://learn.microsoft.com' }, { name: 'Coursera', url: 'https://coursera.org' }] }
                ],
                'healthcare': [
                    { name: 'Paper Records', platforms: [{ name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Coursera', url: 'https://coursera.org' }] },
                    { name: 'Legacy EMR', platforms: [{ name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ],
                'education': [
                    { name: 'Traditional Only', platforms: [{ name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Coursera', url: 'https://coursera.org' }] },
                    { name: 'Paper Assessment', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'Udemy', url: 'https://udemy.com' }] }
                ],
                'default': [
                    { name: 'On-Premise Only', platforms: [{ name: 'Coursera', url: 'https://coursera.org' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Udemy', url: 'https://udemy.com' }] },
                    { name: 'Legacy Technology', platforms: [{ name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }, { name: 'Udemy', url: 'https://udemy.com' }, { name: 'Coursera', url: 'https://coursera.org' }] },
                    { name: 'Outdated Frameworks', platforms: [{ name: 'Udemy', url: 'https://udemy.com' }, { name: 'Coursera', url: 'https://coursera.org' }, { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }] }
                ]
            }
        };

        const field = this.professionalData.fieldOfExperience;
        const fieldKey = field in skillsDatabase.high ? field : 'default';

        // Generate scores based on years of experience
        const years = parseInt(this.professionalData.yearsExperience);
        let longevityScore, relevanceScore, obsolescenceRisk;

        if (years < 2) {
            longevityScore = Math.min(70 + this.skills.length * 3, 85);
            relevanceScore = Math.min(75 + this.skills.length * 2, 90);
            obsolescenceRisk = 'Medium';
        } else if (years < 5) {
            longevityScore = Math.min(75 + this.skills.length * 2, 90);
            relevanceScore = Math.min(80 + this.skills.length * 2, 92);
            obsolescenceRisk = 'Low-Medium';
        } else if (years < 10) {
            longevityScore = Math.min(80 + this.skills.length, 94);
            relevanceScore = Math.min(82 + this.skills.length, 94);
            obsolescenceRisk = 'Low';
        } else {
            longevityScore = Math.min(85 + Math.min(this.skills.length, 10), 98);
            relevanceScore = Math.min(85 + Math.min(this.skills.length, 10), 98);
            obsolescenceRisk = 'Very Low';
        }

        // Update scores
        document.getElementById('longevity-score').textContent = longevityScore + '/100';
        document.getElementById('relevance-score').textContent = relevanceScore + '/100';
        document.getElementById('obsolescence-risk').textContent = obsolescenceRisk;

        // Render skill cards with platforms
        this.renderSkillCards('suggested-skills-high', skillsDatabase.high[fieldKey]);
        this.renderSkillCards('suggested-skills-medium', skillsDatabase.medium[fieldKey]);
        this.renderSkillCards('suggested-skills-low', skillsDatabase.low[fieldKey]);

        // Generate personalized recommendation
        const firstName = this.userData.name.split(' ')[0];
        const fieldDisplay = this.professionalData.fieldOfExperience.replace(/-/g, ' ');
        const recommendation = `Hi ${firstName}! Based on your ${years} years of experience in ${fieldDisplay} and your interest in ${this.professionalData.areaOfInterest}, your career longevity score is ${longevityScore}/100. We recommend focusing on the high-priority skills listed above to maintain and improve your market relevance. Your current skill set shows good coverage, but investing in emerging technologies will significantly enhance your career prospects. Keep learning and adapting to stay ahead in this rapidly evolving field!`;
        document.getElementById('recommendation-text').textContent = recommendation;
    }

    renderSkillCards(containerId, skills) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            
            const platformsList = skill.platforms
                .map(p => `<span class="platform-pill"><a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.name}</a></span>`)
                .join('');

            skillCard.innerHTML = `
                <h4>${skill.name}</h4>
                <div class="skill-platforms">
                    <label>Available on:</label>
                    <div class="platform-pills">
                        ${platformsList}
                    </div>
                </div>
                <button type="button" class="skill-view-btn" data-skill="${skill.name}">View Courses</button>
            `;

            // Add click handler for View button
            skillCard.querySelector('.skill-view-btn').addEventListener('click', (e) => {
                e.preventDefault();
                this.selectedSkill = skill.name;
                this.loadFunctionalitiesPage();
                this.pageManager.showPage('functionalities-page');
            });

            container.appendChild(skillCard);
        });
    }

    loadFunctionalitiesPage() {
        if (!this.selectedSkill) {
            this.selectedSkill = 'Kubernetes';
        }
        const titleElement = document.getElementById('selected-skill-title');
        if (titleElement) {
            titleElement.textContent = `Skill: ${this.selectedSkill}`;
        }
        // Show first feature by default
        this.switchFeature('decay-tracker');
    }

    switchFeature(featureId) {
        // Hide all features
        document.querySelectorAll('.feature-content').forEach(content => {
            content.classList.remove('active');
        });

        // Deactivate all tabs
        document.querySelectorAll('.feature-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected feature
        const featureElement = document.getElementById(featureId);
        if (featureElement) {
            featureElement.classList.add('active');
        }

        // Activate corresponding tab
        const activeTab = document.querySelector(`[data-feature="${featureId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    handleLogPractice() {
        const decayPercent = document.getElementById('decay-percent');
        const decayDays = document.getElementById('decay-days');
        
        if (decayPercent && decayDays) {
            const currentPercent = parseInt(decayPercent.textContent);
            const currentDays = parseInt(decayDays.textContent);
            
            decayPercent.textContent = Math.max(0, currentPercent - 5) + '%';
            decayDays.textContent = '0';
            
            alert('✓ Practice session logged! Skill decay reset.');
        }
    }

    handleSetReminder() {
        const days = prompt('Set reminder for how many days from now?', '7');
        if (days) {
            alert(`⏰ Reminder set for ${days} days from now!`);
        }
    }

    handleDownloadRoadmap() {
        const roadmapText = `
CAREER TRANSITION ROADMAP
=========================
Skill: ${this.selectedSkill}
Target Role: Senior DevOps Engineer

STEP 1: Master Kubernetes Advanced Topics (3 months)
- Complete CKA certification
- Practice advanced networking and storage
- Study multi-cluster architectures

STEP 2: Lead Infrastructure Projects (3 months)
- Lead cloud infrastructure design
- Implement GitOps workflows
- Mentor junior engineers

STEP 3: Mentoring Junior DevOps Team (Ongoing)
- Guide team on best practices
- Code reviews and architecture discussions
- Knowledge sharing sessions`;

        const blob = new Blob([roadmapText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Roadmap_${this.selectedSkill}_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    handleCreateGapPlan() {
        alert('📋 Learning plan created! Check your email for personalized recommendations.');
    }

    handleOptimizeLearning() {
        alert('🎯 Learning plan optimized based on your ROI metrics. Suggested skills reordered for maximum impact.');
    }

    handleSaveAnalysis() {
        const analysisData = {
            skill: this.selectedSkill,
            userData: this.userData,
            timestamp: new Date().toLocaleString(),
            decayPercent: document.getElementById('decay-percent').textContent,
            longevityScore: document.getElementById('longevity-score').textContent
        };
        
        StorageManager.saveUserData({...this.userData, lastAnalysis: analysisData});
        alert('💾 Analysis saved successfully!');
    }

    handleMentorMessage() {
        const input = document.getElementById('mentor-input');
        const messagesDiv = document.querySelector('.chat-messages');
        
        if (input && input.value.trim()) {
            const userMessage = input.value;
            
            // Add user message
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'chat-message user';
            userMsgDiv.textContent = userMessage;
            messagesDiv.appendChild(userMsgDiv);
            
            // Add mentor response (mock)
            setTimeout(() => {
                const mentorResponses = [
                    'That\'s a great question! Here are some resources to help: [Link]',
                    'I recommend focusing on hands-on projects to strengthen this skill.',
                    'Consider joining our community for peer learning and support.',
                    'Your learning path looks good. Let\'s track your progress weekly.'
                ];
                
                const mentorMsgDiv = document.createElement('div');
                mentorMsgDiv.className = 'chat-message mentor';
                mentorMsgDiv.textContent = mentorResponses[Math.floor(Math.random() * mentorResponses.length)];
                messagesDiv.appendChild(mentorMsgDiv);
                
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 500);
            
            input.value = '';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    handleMentorQuestion(question) {
        const input = document.getElementById('mentor-input');
        if (input) {
            input.value = question;
            this.handleMentorMessage();
        }
    }

    downloadReport() {
        const data = {
            userInfo: this.userData,
            professionalData: this.professionalData,
            generatedAt: new Date().toLocaleString()
        };

        const report = `CAREER LONGEVITY AND SKILL OBSOLESCENCE REPORT\n===============================================\n\nGenerated: ${data.generatedAt}\n\nUSER INFORMATION\n----------------\nName: ${data.userInfo.name}\nEmail: ${data.userInfo.email}\nContact: ${data.userInfo.phone}\n\nPROFESSIONAL PROFILE\n--------------------\nField: ${data.professionalData.fieldOfExperience}\nYears of Experience: ${data.professionalData.yearsExperience}\nArea of Interest: ${data.professionalData.areaOfInterest}\nCurrent Skills: ${data.professionalData.skills.join(', ')}\n\nSCORES\n------\nCareer Longevity Score: ${document.getElementById('longevity-score').textContent}\nSkill Relevance Index: ${document.getElementById('relevance-score').textContent}\nObsolescence Risk: ${document.getElementById('obsolescence-risk').textContent}\n\nRECOMMENDATION\n--------------\n${document.getElementById('recommendation-text').textContent}\n\nFor more detailed analysis, please visit our platform.`;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Career_Report_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            StorageManager.clearUserData();
            this.userData = null;
            this.professionalData = null;
            this.skills = [];
            this.clearForm();
            this.clearUserInputForm();
            this.pageManager.showPage('landing-page');
        }
    }

    clearForm() {
        const form = document.getElementById('landing-form');
        if (form) {
            form.reset();
        }
        document.querySelectorAll('.error-message').forEach(elem => {
            elem.textContent = '';
        });
        document.querySelectorAll('.form-group input').forEach(input => {
            input.style.borderColor = '#e0e0e0';
        });
    }

    clearUserInputForm() {
        const form = document.getElementById('user-input-form');
        if (form) {
            form.reset();
        }
        this.skills = [];
        this.renderSkillsTags();
        document.querySelectorAll('#user-input-page .error-message').forEach(elem => {
            elem.textContent = '';
        });
    }

    loadSavedProfessionalData() {
        const saved = StorageManager.getProfessionalData();
        if (!saved) return;

        // Prefill form fields
        const fieldSelect = document.getElementById('field-of-experience');
        const yearsInput = document.getElementById('years-experience');
        const areaInput = document.getElementById('area-of-interest');

        if (fieldSelect) fieldSelect.value = saved.fieldOfExperience;
        if (yearsInput) yearsInput.value = saved.yearsExperience;
        if (areaInput) areaInput.value = saved.areaOfInterest;

        // Reload skills from saved data
        this.skills = [...saved.skills];
        this.renderSkillsTags();

        // Clear any previous errors
        document.querySelectorAll('#user-input-page .error-message').forEach(elem => {
            elem.textContent = '';
        });
    }

    checkExistingSession() {
        if (StorageManager.hasUserData()) {
            this.userData = StorageManager.getUserData();
            this.loadDashboard();
            this.pageManager.showPage('dashboard-page');
        }
    }
}

// ===== Initialize App on DOM Load ===== 
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
