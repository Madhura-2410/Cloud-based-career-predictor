import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBook, FiAward, FiArrowRight, FiStar, FiGrid, FiTrendingUp, FiBriefcase, FiBarChart2 } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import { getMarketContext } from '../utils/marketContext';

const CATEGORY_MAPPING: Record<string, string> = {
  'database administrator': 'Database Administration',
  'database administration': 'Database Administration',
  'database': 'Database Administration',
  'sql': 'Database Administration',
  'mysql': 'Database Administration',
  'postgresql': 'Database Administration',
  'oracle': 'Database Administration',
  'mongodb': 'Database Administration',
  'cloud': 'Cloud Computing',
  'aws': 'Cloud Computing',
  'azure': 'Cloud Computing',
  'gcp': 'Cloud Computing',
  'cloud computing': 'Cloud Computing',
  'devops': 'DevOps',
  'docker': 'DevOps',
  'kubernetes': 'DevOps',
  'infrastructure': 'DevOps',
  'ci/cd': 'DevOps',
  'security': 'Cybersecurity',
  'cyber': 'Cybersecurity',
  'ethical hacking': 'Cybersecurity',
  'network security': 'Cybersecurity',
  'data science': 'Data Science',
  'data': 'Data Science',
  'analytics': 'Data Science',
  'big data': 'Data Science',
  'ui/ux': 'UI/UX',
  'ui': 'UI/UX',
  'ux': 'UI/UX',
  'design': 'UI/UX',
  'web development': 'Web Development',
  'web dev': 'Web Development',
  'frontend': 'Web Development',
  'backend': 'Web Development',
  'networking': 'Networking',
  'network': 'Networking',
  'ai': 'AI/ML',
  'machine learning': 'AI/ML',
  'ml': 'AI/ML',
  'artificial intelligence': 'AI/ML',
  'deep learning': 'AI/ML',
  'mobile': 'Mobile App Development',
  'flutter': 'Mobile App Development',
  'react native': 'Mobile App Development',
  'testing': 'Software Testing',
  'qa': 'Software Testing',
  'selenium': 'Software Testing',
  'iot': 'IoT Systems',
  'python': 'Python Development',
  'django': 'Python Development',
  'java': 'Java Development',
  'spring': 'Java Development',
  'full stack': 'Full Stack Development',
  'mean stack': 'Full Stack Development',
  'node': 'Node.js Development',
  'graphql': 'Node.js Development',
  'power bi': 'Business Intelligence',
  'tableau': 'Business Intelligence',
  'linux': 'Linux Administration',
};

type CourseSkill = {
  id: number | string;
  name: string;
  platforms: { name: string; url: string }[];
  category: string;
  description: string;
};

const COURSE_LIBRARY: CourseSkill[] = [
  {
    id: 1,
    name: 'Machine Learning & AI',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning' },
      { name: 'edX', url: 'https://www.edx.org/learn/machine-learning' },
      { name: 'Udacity', url: 'https://www.udacity.com/course/intro-to-machine-learning--ud120' },
    ],
    category: 'AI/ML',
    description: 'Master the core algorithms that power modern AI, including neural networks, deep learning, and predictive modeling.',
  },
  {
    id: 2,
    name: 'React.js & Next.js',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
      { name: 'Pluralsight', url: 'https://www.pluralsight.com/paths/react' },
    ],
    category: 'Web Development',
    description: 'Build highly scalable, reactive, and SEO-friendly web applications using the latest JavaScript frameworks.',
  },
  {
    id: 3,
    name: 'Cloud Architecture (AWS)',
    platforms: [
      { name: 'A Cloud Guru', url: 'https://acloudguru.com/' },
      { name: 'Coursera', url: 'https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect' },
    ],
    category: 'Cloud Computing',
    description: 'Design robust, secure, and highly available cloud solutions optimized for enterprise scale.',
  },
  {
    id: 4,
    name: 'UI/UX Design',
    platforms: [
      { name: 'Google', url: 'https://grow.google/certificates/ux-design/' },
      { name: 'IDF', url: 'https://www.interaction-design.org/' },
    ],
    category: 'UI/UX',
    description: 'Learn user research, wireframing, and prototyping to create intuitive and beautiful digital interfaces.',
  },
  {
    id: 5,
    name: 'Cybersecurity Fundamentals',
    platforms: [
      { name: 'CompTIA', url: 'https://www.comptia.org/certifications/security' },
      { name: 'edX', url: 'https://www.edx.org/learn/cybersecurity' },
    ],
    category: 'Cybersecurity',
    description: 'Understand network security, risk management, and cryptography to protect critical infrastructure from modern threats.',
  },
  {
    id: 6,
    name: 'Data Engineering',
    platforms: [
      { name: 'DataCamp', url: 'https://www.datacamp.com/tracks/data-engineer-with-python' },
      { name: 'Coursera', url: 'https://www.coursera.org/specializations/data-engineering-gcp' },
    ],
    category: 'Data Science',
    description: 'Build and maintain data pipelines, data warehouses, and highly available data lakes for big data analytics.',
  },
  {
    id: 7,
    name: 'Prompt Engineering',
    platforms: [
      { name: 'OpenAI', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { name: 'Udemy', url: 'https://www.udemy.com/topic/prompt-engineering/' },
    ],
    category: 'AI/ML',
    description: 'Master the art of crafting precise prompts to extract maximal value and complex reasoning from Large Language Models.',
  },
  {
    id: 8,
    name: 'Blockchain Development',
    platforms: [
      { name: 'Ethereum.org', url: 'https://ethereum.org/en/developers/' },
      { name: 'Coursera', url: 'https://www.coursera.org/specializations/blockchain' },
    ],
    category: 'Networking',
    description: 'Develop decentralized applications (dApps), secure smart contracts, and understand cryptographic protocols.',
  },
  {
    id: 9,
    name: 'SQL Fundamentals',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/learn/sql-for-data-science' },
      { name: 'Udemy', url: 'https://www.udemy.com/course/sql-mysql-for-data-analytics/' },
    ],
    category: 'Database Administration',
    description: 'Learn SQL fundamentals, advanced queries, and relational database design.',
  },
  {
    id: 10,
    name: 'MongoDB Fundamentals',
    platforms: [
      { name: 'MongoDB University', url: 'https://university.mongodb.com/' },
    ],
    category: 'Database Administration',
    description: 'Understand schema design, indexing, and querying with MongoDB NoSQL databases.',
  },
  {
    id: 11,
    name: 'Network Fundamentals',
    platforms: [
      { name: 'Cisco', url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/' },
    ],
    category: 'Networking',
    description: 'Understand routing, switching, subnetting, and the core protocols that power modern global network layouts.',
  },
  {
    id: 12,
    name: 'Cloud Security',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/aws-certified-security-specialty/' },
    ],
    category: 'Cybersecurity',
    description: 'Protect cloud workloads, containerized endpoints, and cloud identity profiles using modern security architectures.',
  },
  {
    id: 13,
    name: 'Mobile App Development (Flutter)',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/learn/flutter-mobile-development' },
      { name: 'Udemy', url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/' }
    ],
    category: 'Mobile App Development',
    description: 'Build native iOS and Android apps using single dart codebase with Google Dart programming foundations.',
  },
  {
    id: 14,
    name: 'React Native Architecture',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/react-native-the-practical-guide/' }
    ],
    category: 'Mobile App Development',
    description: 'Leverage web developer skills to ship cross-platform native apps using React Native frameworks and state pools.',
  },
  {
    id: 15,
    name: 'DevOps & CI/CD Pipeline',
    platforms: [
      { name: 'Pluralsight', url: 'https://www.pluralsight.com/paths/devops-ci-cd' },
      { name: 'Udemy', url: 'https://www.udemy.com/course/devops-ci-cd-pipelines/' }
    ],
    category: 'DevOps',
    description: 'Automate build stages, integrated tests, static scans, and cloud delivery pipelines to boost team velocities.',
  },
  {
    id: 16,
    name: 'Docker Containers in Production',
    platforms: [
      { name: 'Docker', url: 'https://www.docker.com/play-with-docker' },
      { name: 'Udemy', url: 'https://www.udemy.com/course/docker-mastery/' }
    ],
    category: 'DevOps',
    description: 'Containerize server frameworks, isolate platform environments, and deploy immutable release units securely.',
  },
  {
    id: 17,
    name: 'Kubernetes Orchestration',
    platforms: [
      { name: 'Linux Foundation', url: 'https://training.linuxfoundation.org/training/introduction-to-kubernetes/' },
      { name: 'Coursera', url: 'https://www.coursera.org/learn/google-cloud-kubernetes-engine' }
    ],
    category: 'DevOps',
    description: 'Orchestrate self-healing system containers, auto-scale pods, and manage service routing inside distributed clusters.',
  },
  {
    id: 18,
    name: 'Software Testing & QA',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/software-testing-masterclass/' }
    ],
    category: 'Software Testing',
    description: 'Master black-box, white-box, regression, user acceptance, and modern quality assurance testing workflows.',
  },
  {
    id: 19,
    name: 'Automated Testing with Selenium',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/learn/test-automation-selenium' }
    ],
    category: 'Software Testing',
    description: 'Code end-to-end user browser automated scripts using Selenium webdrivers, JUnit, or test runner pools.',
  },
  {
    id: 20,
    name: 'Internet of Things (IoT) Systems',
    platforms: [
      { name: 'edX', url: 'https://www.edx.org/learn/iot' }
    ],
    category: 'IoT Systems',
    description: 'Connect hardware endpoints, gather massive sensor telemetries, and design low-power edge gateways securely.',
  },
  {
    id: 21,
    name: 'Big Data Analytics with Spark',
    platforms: [
      { name: 'DataCamp', url: 'https://www.datacamp.com/courses/introduction-to-pyspark' }
    ],
    category: 'Data Science',
    description: 'Analyze multi-terabyte log assets at in-memory speeds using Spark Core, Spark SQL, and parallel worker clusters.',
  },
  {
    id: 22,
    name: 'Hadoop Distributed Systems',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/learn/big-data-introduction' }
    ],
    category: 'Data Science',
    description: 'Administer massive distributed data lakes using Hadoop HDFS, MapReduce clusters, and core file schedulers.',
  },
  {
    id: 23,
    name: 'Advanced Python Programming',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/complete-python-bootcamp/' }
    ],
    category: 'Python Development',
    description: 'Leverage multi-paradigm object-oriented structures, generators, list comprehensions, and async patterns.',
  },
  {
    id: 24,
    name: 'Django Web Framework',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/specializations/django' }
    ],
    category: 'Python Development',
    description: 'Develop batteries-included backends, integrated admin consoles, dynamic forms, and ORM pipelines with Python.',
  },
  {
    id: 25,
    name: 'Enterprise Java with Spring Boot',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/spring-hibernate-tutorial/' }
    ],
    category: 'Java Development',
    description: 'Build enterprise-grade microservices with Spring Boot, dependency injections, data JPA, and Spring Security.',
  },
  {
    id: 26,
    name: 'Core Java & Multithreading',
    platforms: [
      { name: 'Pluralsight', url: 'https://www.pluralsight.com/paths/java' }
    ],
    category: 'Java Development',
    description: 'Deep dive into concurrent execution pools, safe memory locks, memory model operations, and high throughput.',
  },
  {
    id: 27,
    name: 'Full Stack Web Development',
    platforms: [
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
      { name: 'Udemy', url: 'https://www.udemy.com/course/the-web-developer-bootcamp/' }
    ],
    category: 'Full Stack Development',
    description: 'Design comprehensive end-to-end platforms from database, server logic, web routing to stateful frontends.',
  },
  {
    id: 28,
    name: 'MEAN Stack Architecture',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/specializations/full-stack-react' }
    ],
    category: 'Full Stack Development',
    description: 'Coordinate complete JavaScript systems using MongoDB, Express, Angular interfaces, and Node server layers.',
  },
  {
    id: 29,
    name: 'Node.js & Express API Design',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/' }
    ],
    category: 'Node.js Development',
    description: 'Program high concurrency, non-blocking asynchronous REST services using Express router layouts.',
  },
  {
    id: 30,
    name: 'GraphQL & Apollo Server',
    platforms: [
      { name: 'Odyssey GraphQL', url: 'https://odyssey.apollographql.com/' }
    ],
    category: 'Node.js Development',
    description: 'Define strong-typed client schemas, prevent over-fetching, and federate massive web data endpoints seamlessly.',
  },
  {
    id: 31,
    name: 'Microsoft Azure Administration',
    platforms: [
      { name: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-administrator/' }
    ],
    category: 'Cloud Computing',
    description: 'Deploy cloud network structures, secure identities, manage storage plans, and balance corporate loads in Azure.',
  },
  {
    id: 32,
    name: 'Azure DevOps Pipelines',
    platforms: [
      { name: 'Udemy', url: 'https://www.udemy.com/course/azure-devops-ci-cd-pipelines/' }
    ],
    category: 'Cloud Computing',
    description: 'Build robust YAML pipelines to build, secure, compile, and publish web resources into Microsoft Azure.',
  },
  {
    id: 33,
    name: 'AWS Solutions Architect',
    platforms: [
      { name: 'A Cloud Guru', url: 'https://acloudguru.com/course/aws-certified-solutions-architect-associate' }
    ],
    category: 'Cloud Computing',
    description: 'Architect multi-tier enterprise systems on AWS featuring VPC, secure subnets, and scalable global loads.',
  },
  {
    id: 34,
    name: 'AWS Serverless Computing',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/learn/aws-serverless-computing' }
    ],
    category: 'Cloud Computing',
    description: 'Deploy fully serverless applications leveraging AWS Lambda event nodes, API Gateway, and managed databases.',
  },
  {
    id: 35,
    name: 'Power BI Analytics',
    platforms: [
      { name: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi' }
    ],
    category: 'Business Intelligence',
    description: 'Clean unstructured corporate data, define DAX formulas, and author robust reporting dashboards.',
  },
  {
    id: 36,
    name: 'Tableau Visual Analytics',
    platforms: [
      { name: 'Tableau eLearning', url: 'https://www.tableau.com/learn' }
    ],
    category: 'Business Intelligence',
    description: 'Author visual data mappings, construct interactive dashboards, and explain critical market operations.',
  },
  {
    id: 37,
    name: 'Ethical Hacking & Penetration Testing',
    platforms: [
      { name: 'offensive-security', url: 'https://www.offsec.com/courses/pen-200/' }
    ],
    category: 'Cybersecurity',
    description: 'Perform white-hat penetration audits, network mappings, vulnerability exploits, and secure defensive updates.',
  },
  {
    id: 38,
    name: 'Linux Systems Administration',
    platforms: [
      { name: 'Linux Foundation', url: 'https://training.linuxfoundation.org/training/system-administration-guide-linux/' }
    ],
    category: 'Linux Administration',
    description: 'Command the server shell, automate systems with Bash scripting, configure mount schemes, and manage permissions.',
  },
  {
    id: 39,
    name: 'Red Hat Enterprise Linux',
    platforms: [
      { name: 'Red Hat Training', url: 'https://www.redhat.com/en/services/training' }
    ],
    category: 'Linux Administration',
    description: 'Coordinate enterprise corporate configurations, scale securely using Ansible, and verify system integrity on RHEL.',
  },
  {
    id: 40,
    name: 'Advanced Product Design Systems',
    platforms: [
      { name: 'IDF', url: 'https://www.interaction-design.org/courses/design-systems-for-creatives' }
    ],
    category: 'UI/UX',
    description: 'Create centralized variables, coordinate design tokens, and build reusable web layout components in Figma.',
  },
  {
    id: 41,
    name: 'DevSecOps Security Automation',
    platforms: [
      { name: 'edX', url: 'https://www.edx.org/learn/devops' }
    ],
    category: 'DevOps',
    description: 'Integrate dynamic application scans directly into CI/CD release stages, improving compliance speeds.',
  },
  {
    id: 42,
    name: 'Deep Learning & Computer Vision',
    platforms: [
      { name: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning' }
    ],
    category: 'AI/ML',
    description: 'Build advanced convolutional models, program edge detection systems, and deploy smart neural vision units.',
  },
];

const inferCategory = (text: string): string | undefined => {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return undefined;
  for (const key of Object.keys(CATEGORY_MAPPING)) {
    if (normalized.includes(key)) return CATEGORY_MAPPING[key];
  }
  return undefined;
};

const makeSkillId = (skillName: string) => skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Mini market trend card component shown on each course */
const MarketTrendBadge: React.FC<{ courseName: string }> = ({ courseName }) => {
  const ctx = getMarketContext(courseName);
  return (
    <div className="mt-4 p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-950 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2.5 transition-colors duration-300">
      <div className="flex items-center gap-1.5 mb-1">
        <FiTrendingUp className="text-blue-600 dark:text-blue-400" size={12} />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">Market Trends</span>
      </div>

      {/* Demand bar */}
      <div>
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Demand</span>
          <span className="text-[10px] font-extrabold text-green-700 dark:text-green-400">{ctx.demand}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${ctx.demandPercent}%` }}></div>
        </div>
      </div>

      {/* Growth + Openings row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <FiBriefcase size={10} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{ctx.hiringGrowth} growth</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiBarChart2 size={10} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{ctx.jobOpenings}</span>
        </div>
      </div>

      {/* Adoption bar */}
      <div>
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adoption</span>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{ctx.adoptionRate}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${ctx.adoptionPercent}%` }}></div>
        </div>
      </div>

      {/* Key insight */}
      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-1">
        💡 {ctx.insights[0]}
      </p>
    </div>
  );
};

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, addToLearningPath, removeFromLearningPath } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');

  const interestText = userProfile.learningGoals[0] || userProfile.fieldOfExperience || '';
  const matchedCategory = inferCategory(interestText);
  const recommendedSkills = matchedCategory
    ? COURSE_LIBRARY.filter((skill) => skill.category.toLowerCase() === matchedCategory.toLowerCase())
    : COURSE_LIBRARY;

  const displayedSkills = useMemo(() => {
    // If search is active, always search ALL courses
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      return COURSE_LIBRARY.filter(
        (skill) =>
          skill.name.toLowerCase().includes(lowerQuery) ||
          skill.category.toLowerCase().includes(lowerQuery) ||
          skill.description.toLowerCase().includes(lowerQuery)
      );
    }
    // Otherwise use toggle mode
    return viewMode === 'all' ? COURSE_LIBRARY : recommendedSkills;
  }, [recommendedSkills, searchQuery, viewMode]);

  const currentHeading = searchQuery
    ? 'Search Results'
    : viewMode === 'all'
      ? 'All Available Courses'
      : matchedCategory
        ? `Recommended for ${matchedCategory}`
        : 'Suggested Skills for your path';

  const togglePathItem = (skill: CourseSkill) => {
    const id = makeSkillId(skill.name);
    const exists = userProfile.learningPath.some((entry) => entry.id === id);
    if (exists) {
      removeFromLearningPath(id);
      setToastMessage(`${skill.name} removed from your Learning Path.`);
    } else {
      addToLearningPath({
        id,
        title: skill.name,
        platforms: skill.platforms,
        status: 'Not Started',
        dateAdded: new Date().toLocaleDateString(),
      });
      setToastMessage(`${skill.name} added to your Learning Path.`);
    }
    window.setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-12 font-sans relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-slate-800 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 dark:bg-slate-800 rounded-full blur-[120px]"></div>

      <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
              <FiBook className="text-white" size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">AI Career Hub</div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{currentHeading}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative z-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative p-10 md:p-16 text-center z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">learn today</span>?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
              Explore the most relevant courses for your current field and save the ones that matter most.
            </p>
            {toastMessage && (
              <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-3xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-5 py-3 text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
                {toastMessage}
              </div>
            )}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-5 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm"
                placeholder="Search for skills, roles, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ═══════ Toggle Tabs: Recommended / All Courses ═══════ */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => { setViewMode('recommended'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                viewMode === 'recommended' && !searchQuery
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FiStar size={16} />
              Recommended Courses
            </button>
            <button
              onClick={() => { setViewMode('all'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                viewMode === 'all' && !searchQuery
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FiGrid size={16} />
              All Courses
            </button>
          </div>

          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Showing {displayedSkills.length} of {COURSE_LIBRARY.length} courses
          </span>
        </div>

        {/* ═══════ Course Cards Grid ═══════ */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {searchQuery ? (
                <>Search Results <span className="text-slate-500 dark:text-slate-400 text-lg font-normal">({displayedSkills.length})</span></>
              ) : viewMode === 'all' ? (
                <><FiGrid className="text-blue-500" /> All Courses</>
              ) : (
                <><FiStar className="text-yellow-500 fill-current" /> {matchedCategory ? `Top ${matchedCategory} Courses` : 'Trending Skills'}</>
              )}
            </h3>
          </div>

          {displayedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedSkills.map((skill) => {
                const skillId = makeSkillId(skill.name);
                const isAdded = userProfile.learningPath.some((entry) => entry.id === skillId);

                return (
                  <div
                    key={skill.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-xl shadow-sm transition-all duration-300 flex flex-col h-full group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {skill.category}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-colors duration-300">
                        <FiAward size={20} />
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight h-14 line-clamp-2">{skill.name}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 flex-grow font-medium line-clamp-3">{skill.description}</p>

                    {/* ── Dynamic Market Trend Mini-Card ── */}
                    <MarketTrendBadge courseName={skill.name} />

                    <div className="space-y-4 mt-4">
                      <div className="flex flex-wrap gap-2">
                        {skill.platforms.map((platform, idx) => (
                          <a
                            key={idx}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-900 transition-colors"
                          >
                            {platform.name}
                          </a>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => navigate(`/skill/${skillId}`)}
                          className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-950 hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-slate-800 hover:border-blue-600 py-3 rounded-xl font-bold transition-all duration-300 group/btn"
                        >
                          <span>View Skill</span>
                          <FiArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={() => togglePathItem(skill)}
                          className={`w-full rounded-xl py-3 font-bold transition-all ${isAdded ? 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {isAdded ? 'Remove From Path' : 'Add to Learning Path'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 mb-4">
                <FiSearch className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No skills found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
                We couldn't find any courses matching "{searchQuery}". Try opening your learning path or refining the search.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SkillsPage;
