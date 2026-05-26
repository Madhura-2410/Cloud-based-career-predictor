export interface MarketContextData {
  demand: string;
  demandPercent: number;
  hiringGrowth: string;
  hiringGrowthPercent: number;
  salaryTrend: string;
  jobOpenings: string;
  futureScope: string;
  futureScopePercent: number;
  learningComplexity: number;
  insights: string[];
  adoptionRate: string;
  adoptionPercent: number;
}

/**
 * Per-course market context data keyed by course name (lowercase).
 * Every course gets unique, realistic market intelligence.
 */
const COURSE_MARKET_DATA: Record<string, MarketContextData> = {
  'machine learning & ai': {
    demand: "Extreme (98%)",
    demandPercent: 98,
    hiringGrowth: "+42% YoY",
    hiringGrowthPercent: 92,
    salaryTrend: "$165,000 - $220,000 / yr",
    jobOpenings: "35,200 active",
    futureScope: "Exponential growth, LLM integration, high-value models",
    futureScopePercent: 96,
    learningComplexity: 5,
    adoptionRate: "Enterprise AI adoption at 78%",
    adoptionPercent: 78,
    insights: ["High enterprise AI adoption across industries", "LLM integrations driving hiring surge", "Generative AI talent gap widening"]
  },
  'prompt engineering': {
    demand: "Very High (94%)",
    demandPercent: 94,
    hiringGrowth: "+65% YoY",
    hiringGrowthPercent: 95,
    salaryTrend: "$130,000 - $185,000 / yr",
    jobOpenings: "12,800 active",
    futureScope: "Emerging specialization, critical for LLM-powered products",
    futureScopePercent: 92,
    learningComplexity: 3,
    adoptionRate: "Rapid enterprise adoption at 62%",
    adoptionPercent: 62,
    insights: ["Fastest-growing AI sub-specialization", "Critical for ChatGPT/Copilot integration teams", "Low barrier to entry, high ceiling"]
  },
  'react.js & next.js': {
    demand: "High (90%)",
    demandPercent: 90,
    hiringGrowth: "+18% YoY",
    hiringGrowthPercent: 74,
    salaryTrend: "$120,000 - $160,000 / yr",
    jobOpenings: "24,000 active",
    futureScope: "Dominant frontend web standard, hybrid SSR paradigm",
    futureScopePercent: 82,
    learningComplexity: 3,
    adoptionRate: "Industry standard at 71%",
    adoptionPercent: 71,
    insights: ["Next.js/React standard for modern web development", "High startup and enterprise demand", "Server Components reshaping architecture"]
  },
  'cloud architecture (aws)': {
    demand: "Very High (92%)",
    demandPercent: 92,
    hiringGrowth: "+28% YoY",
    hiringGrowthPercent: 82,
    salaryTrend: "$140,000 - $190,000 / yr",
    jobOpenings: "28,400 active",
    futureScope: "Standard enterprise infra, hybrid cloud growth",
    futureScopePercent: 88,
    learningComplexity: 4,
    adoptionRate: "AWS market share at 32%",
    adoptionPercent: 85,
    insights: ["High enterprise AWS migration accelerating", "Strong hiring growth in cloud-native platforms", "Focus on FinOps and serverless architectures"]
  },
  'ui/ux design': {
    demand: "Steady (84%)",
    demandPercent: 84,
    hiringGrowth: "+15% YoY",
    hiringGrowthPercent: 70,
    salaryTrend: "$105,000 - $145,000 / yr",
    jobOpenings: "12,100 active",
    futureScope: "Crucial for product differentiation, AI-assisted design",
    futureScopePercent: 75,
    learningComplexity: 3,
    adoptionRate: "Design-led development at 58%",
    adoptionPercent: 58,
    insights: ["Focus on accessibility and responsive design", "Figma design system experience highly requested", "User research becoming critical differentiator"]
  },
  'cybersecurity fundamentals': {
    demand: "Critical (95%)",
    demandPercent: 95,
    hiringGrowth: "+35% YoY",
    hiringGrowthPercent: 88,
    salaryTrend: "$130,000 - $185,000 / yr",
    jobOpenings: "16,800 active",
    futureScope: "Essential risk mitigation, zero-trust expansion",
    futureScopePercent: 90,
    learningComplexity: 4,
    adoptionRate: "Zero Trust adoption at 67%",
    adoptionPercent: 67,
    insights: ["Enterprise focus on Zero Trust architecture", "Ransomware threats driving emergency hiring", "Skills gap in cloud security and compliance"]
  },
  'data engineering': {
    demand: "Very High (94%)",
    demandPercent: 94,
    hiringGrowth: "+30% YoY",
    hiringGrowthPercent: 84,
    salaryTrend: "$135,000 - $180,000 / yr",
    jobOpenings: "21,000 active",
    futureScope: "Crucial for AI pipelines, real-time data streaming",
    futureScopePercent: 89,
    learningComplexity: 4,
    adoptionRate: "Modern data stack adoption at 72%",
    adoptionPercent: 72,
    insights: ["Pipelines for LLMs are in high demand", "Transition from batch to real-time streaming", "Snowflake and Databricks experience highly valued"]
  },
  'blockchain development': {
    demand: "Moderate (68%)",
    demandPercent: 68,
    hiringGrowth: "+8% YoY",
    hiringGrowthPercent: 45,
    salaryTrend: "$115,000 - $165,000 / yr",
    jobOpenings: "4,200 active",
    futureScope: "Niche but growing in DeFi, supply chain, and identity",
    futureScopePercent: 60,
    learningComplexity: 5,
    adoptionRate: "Enterprise blockchain at 22%",
    adoptionPercent: 22,
    insights: ["DeFi and Web3 driving niche demand", "Smart contract auditing skills scarce", "Enterprise adoption slower but steady"]
  },
  'sql fundamentals': {
    demand: "Stable (85%)",
    demandPercent: 85,
    hiringGrowth: "+12% YoY",
    hiringGrowthPercent: 65,
    salaryTrend: "$110,000 - $150,000 / yr",
    jobOpenings: "19,500 active",
    futureScope: "Sustained demand, cloud database administration",
    futureScopePercent: 78,
    learningComplexity: 2,
    adoptionRate: "SQL usage in 89% of data roles",
    adoptionPercent: 89,
    insights: ["Stable enterprise database demand", "High migration to managed cloud databases", "PostgreSQL growth outstripping legacy SQL Server"]
  },
  'mongodb fundamentals': {
    demand: "Growing (80%)",
    demandPercent: 80,
    hiringGrowth: "+20% YoY",
    hiringGrowthPercent: 72,
    salaryTrend: "$115,000 - $155,000 / yr",
    jobOpenings: "8,900 active",
    futureScope: "NoSQL standard for modern app backends",
    futureScopePercent: 76,
    learningComplexity: 3,
    adoptionRate: "MongoDB Atlas adoption at 55%",
    adoptionPercent: 55,
    insights: ["Growing cloud database management roles", "MongoDB Atlas driving managed DB adoption", "Strong demand in startup and microservices ecosystems"]
  },
  'network fundamentals': {
    demand: "Stable (76%)",
    demandPercent: 76,
    hiringGrowth: "+7% YoY",
    hiringGrowthPercent: 48,
    salaryTrend: "$85,000 - $130,000 / yr",
    jobOpenings: "11,200 active",
    futureScope: "Essential infrastructure skill, SD-WAN growth",
    futureScopePercent: 65,
    learningComplexity: 3,
    adoptionRate: "SD-WAN adoption at 41%",
    adoptionPercent: 41,
    insights: ["Steady infrastructure skill demand", "SD-WAN and SASE transforming networking", "Cisco/Juniper certifications still highly valued"]
  },
  'cloud security': {
    demand: "Critical (93%)",
    demandPercent: 93,
    hiringGrowth: "+38% YoY",
    hiringGrowthPercent: 90,
    salaryTrend: "$145,000 - $200,000 / yr",
    jobOpenings: "14,600 active",
    futureScope: "Top priority as cloud-first strategies dominate",
    futureScopePercent: 94,
    learningComplexity: 4,
    adoptionRate: "Cloud security spending up 28%",
    adoptionPercent: 80,
    insights: ["Cloud-first strategies demand dedicated security", "IAM and compliance automation booming", "Skills gap creates premium salary opportunities"]
  },
  'mobile app development (flutter)': {
    demand: "Very High (88%)",
    demandPercent: 88,
    hiringGrowth: "+22% YoY",
    hiringGrowthPercent: 78,
    salaryTrend: "$115,000 - $160,000 / yr",
    jobOpenings: "14,200 active",
    futureScope: "Cross-platform development dominant for consumer apps",
    futureScopePercent: 85,
    learningComplexity: 3,
    adoptionRate: "Flutter market share at 46%",
    adoptionPercent: 72,
    insights: ["Flutter leading cross-platform development frameworks", "Strong demand in startups for rapid deployment", "Single codebase for iOS/Android saves substantial cost"]
  },
  'react native architecture': {
    demand: "High (86%)",
    demandPercent: 86,
    hiringGrowth: "+19% YoY",
    hiringGrowthPercent: 72,
    salaryTrend: "$120,000 - $165,000 / yr",
    jobOpenings: "16,100 active",
    futureScope: "Preferred cross-platform solution for React developers",
    futureScopePercent: 80,
    learningComplexity: 3,
    adoptionRate: "Enterprise cross-platform share at 38%",
    adoptionPercent: 68,
    insights: ["React skills transfer seamlessly to React Native", "Leveraged by corporate giants like Meta, Shopify, and Discord", "Native bridge optimization highly sought after"]
  },
  'devops & ci/cd pipeline': {
    demand: "Very High (93%)",
    demandPercent: 93,
    hiringGrowth: "+32% YoY",
    hiringGrowthPercent: 86,
    salaryTrend: "$130,000 - $185,000 / yr",
    jobOpenings: "23,400 active",
    futureScope: "Core foundation of rapid engineering workflows",
    futureScopePercent: 91,
    learningComplexity: 4,
    adoptionRate: "CI/CD usage in 88% of tech companies",
    adoptionPercent: 88,
    insights: ["Automation of testing and builds saves development costs", "GitLab and GitHub Actions skills in extremely high demand", "Infrastructure as Code (IaC) is now a core requirement"]
  },
  'docker containers in production': {
    demand: "High (91%)",
    demandPercent: 91,
    hiringGrowth: "+25% YoY",
    hiringGrowthPercent: 80,
    salaryTrend: "$125,000 - $175,000 / yr",
    jobOpenings: "29,100 active",
    futureScope: "Standard for application isolation and microservices",
    futureScopePercent: 87,
    learningComplexity: 3,
    adoptionRate: "Containerization adoption at 79%",
    adoptionPercent: 79,
    insights: ["Standardizes environments from local development to production", "Docker Compose and Dockerfile optimization are key requirements", "Multi-stage builds highly valued for security"]
  },
  'kubernetes orchestration': {
    demand: "Extreme (95%)",
    demandPercent: 95,
    hiringGrowth: "+40% YoY",
    hiringGrowthPercent: 91,
    salaryTrend: "$145,000 - $205,000 / yr",
    jobOpenings: "26,800 active",
    futureScope: "Gold standard for cloud-native orchestration",
    futureScopePercent: 95,
    learningComplexity: 5,
    adoptionRate: "Kubernetes adoption at 74%",
    adoptionPercent: 74,
    insights: ["Critical for large-scale microservice deployments", "Helm chart and operator experience is highly requested", "Service meshes like Istio becoming standard addition"]
  },
  'software testing & qa': {
    demand: "Stable (78%)",
    demandPercent: 78,
    hiringGrowth: "+9% YoY",
    hiringGrowthPercent: 52,
    salaryTrend: "$80,000 - $120,000 / yr",
    jobOpenings: "15,600 active",
    futureScope: "Evergreen requirement as quality standards rise",
    futureScopePercent: 70,
    learningComplexity: 2,
    adoptionRate: "Manual and basic automation at 92%",
    adoptionPercent: 92,
    insights: ["Solid shift towards QA Automation engineering", "Integration with CI/CD is a mandatory job skill", "Focus on bug prevention rather than post-facto detection"]
  },
  'automated testing with selenium': {
    demand: "High (82%)",
    demandPercent: 82,
    hiringGrowth: "+14% YoY",
    hiringGrowthPercent: 62,
    salaryTrend: "$95,000 - $135,000 / yr",
    jobOpenings: "11,850 active",
    futureScope: "Standard toolset for web test automation suites",
    futureScopePercent: 74,
    learningComplexity: 3,
    adoptionRate: "Selenium automation market share at 65%",
    adoptionPercent: 65,
    insights: ["Requires strong Java, Python, or JavaScript foundations", "Transitioning to modern frameworks like Playwright", "Parallel execution experience highly valued"]
  },
  'internet of things (iot) systems': {
    demand: "Growing (82%)",
    demandPercent: 82,
    hiringGrowth: "+26% YoY",
    hiringGrowthPercent: 79,
    salaryTrend: "$110,000 - $165,000 / yr",
    jobOpenings: "9,400 active",
    futureScope: "Smart homes, industrial automation, and telemetry booming",
    futureScopePercent: 86,
    learningComplexity: 4,
    adoptionRate: "Industrial IoT deployment at 58%",
    adoptionPercent: 58,
    insights: ["Requires hardware interfaces, embedded C/Python, and firmware knowledge", "Edge computing models taking over legacy centralized models", "IoT security specialist roles are paying high premiums"]
  },
  'big data analytics with spark': {
    demand: "Very High (91%)",
    demandPercent: 91,
    hiringGrowth: "+29% YoY",
    hiringGrowthPercent: 83,
    salaryTrend: "$135,000 - $185,000 / yr",
    jobOpenings: "18,900 active",
    futureScope: "De-facto engine for massive scale real-time computation",
    futureScopePercent: 89,
    learningComplexity: 4,
    adoptionRate: "Spark standard in big data stacks at 69%",
    adoptionPercent: 69,
    insights: ["PySpark and Scala options represent high-paying categories", "Optimizing memory allocations and DAGs are critical skills", "Migrating from Hadoop MapReduce to Spark in-memory pipelines"]
  },
  'hadoop distributed systems': {
    demand: "Stable (70%)",
    demandPercent: 70,
    hiringGrowth: "+4% YoY",
    hiringGrowthPercent: 38,
    salaryTrend: "$110,000 - $155,000 / yr",
    jobOpenings: "6,200 active",
    futureScope: "Maintenance of legacy lakes, migrating to cloud lakes",
    futureScopePercent: 58,
    learningComplexity: 4,
    adoptionRate: "On-prem data warehouse usage at 36%",
    adoptionPercent: 36,
    insights: ["Largely legacy support as enterprise transitions to S3/Snowflake", "Strong knowledge of HDFS and MapReduce fundamentals is necessary", "Skills highly valued in finance and healthcare clusters"]
  },
  'advanced python programming': {
    demand: "Extreme (95%)",
    demandPercent: 95,
    hiringGrowth: "+36% YoY",
    hiringGrowthPercent: 89,
    salaryTrend: "$115,000 - $165,000 / yr",
    jobOpenings: "45,000 active",
    futureScope: "Dominant programming language for AI, data, and script automation",
    futureScopePercent: 94,
    learningComplexity: 3,
    adoptionRate: "Python usage in technical teams at 84%",
    adoptionPercent: 84,
    insights: ["Core skill supporting Machine Learning, Django web backends, and data science", "Asynchronous programming (asyncio) and typing are highly requested", "Evergreen developer role with constant market growth"]
  },
  'django web framework': {
    demand: "High (85%)",
    demandPercent: 85,
    hiringGrowth: "+16% YoY",
    hiringGrowthPercent: 70,
    salaryTrend: "$110,000 - $150,000 / yr",
    jobOpenings: "13,400 active",
    futureScope: "Batteries-included framework for secure backend operations",
    futureScopePercent: 78,
    learningComplexity: 3,
    adoptionRate: "Python backend framework share at 48%",
    adoptionPercent: 48,
    insights: ["Favored for data-heavy applications requiring secure user administration", "Django REST Framework (DRF) experience is a major hiring factor", "Pairs perfectly with React and Angular modern frontends"]
  },
  'enterprise java with spring boot': {
    demand: "Very High (92%)",
    demandPercent: 92,
    hiringGrowth: "+24% YoY",
    hiringGrowthPercent: 81,
    salaryTrend: "$125,000 - $175,000 / yr",
    jobOpenings: "32,800 active",
    futureScope: "Standard for corporate microservices and backend banking networks",
    futureScopePercent: 89,
    learningComplexity: 4,
    adoptionRate: "Enterprise Java market share at 62%",
    adoptionPercent: 62,
    insights: ["Standard framework for transaction integrity and security compliance", "Spring Cloud and JPA/Hibernate are highly demanded skills", "Strong migration to reactive programming (Spring WebFlux)"]
  },
  'core java & multithreading': {
    demand: "Stable (88%)",
    demandPercent: 88,
    hiringGrowth: "+15% YoY",
    hiringGrowthPercent: 72,
    salaryTrend: "$115,000 - $160,000 / yr",
    jobOpenings: "28,500 active",
    futureScope: "Evergreen foundation of modern high-concurrency systems",
    futureScopePercent: 80,
    learningComplexity: 4,
    adoptionRate: "JVM usage in global backends at 78%",
    adoptionPercent: 78,
    insights: ["Crucial for high-frequency trading platforms and JVM-based database engines", "Thread safety, Java Memory Model, and executors are core assessment items", "Evergreen language foundation needed for modern software architecture"]
  },
  'full stack web development': {
    demand: "Extreme (94%)",
    demandPercent: 94,
    hiringGrowth: "+30% YoY",
    hiringGrowthPercent: 86,
    salaryTrend: "$110,000 - $165,000 / yr",
    jobOpenings: "39,200 active",
    futureScope: "High flexibility for teams, end-to-end feature ownership",
    futureScopePercent: 90,
    learningComplexity: 4,
    adoptionRate: "Full Stack role distribution at 67%",
    adoptionPercent: 67,
    insights: ["Allows engineers to handle features from database design to UI layouts", "Strong combination of Node/React or Django/React in high demand", "Reduces overhead costs for early-stage and product-driven startups"]
  },
  'mean stack architecture': {
    demand: "Stable (80%)",
    demandPercent: 80,
    hiringGrowth: "+10% YoY",
    hiringGrowthPercent: 60,
    salaryTrend: "$115,000 - $155,000 / yr",
    jobOpenings: "10,200 active",
    futureScope: "Standard unified JavaScript ecosystem for full stack apps",
    futureScopePercent: 74,
    learningComplexity: 3,
    adoptionRate: "Enterprise Angular usage at 28%",
    adoptionPercent: 28,
    insights: ["Angular's strict structural patterns favored in corporate portals", "Single language (TypeScript) simplifies full-stack code reviews", "MongoDB pairs seamlessly with Node/Express databases"]
  },
  'node.js & express api design': {
    demand: "Very High (91%)",
    demandPercent: 91,
    hiringGrowth: "+26% YoY",
    hiringGrowthPercent: 80,
    salaryTrend: "$118,000 - $160,000 / yr",
    jobOpenings: "27,300 active",
    futureScope: "De-facto engine for lightweight, highly asynchronous web microservices",
    futureScopePercent: 88,
    learningComplexity: 3,
    adoptionRate: "Node.js in web backends at 52%",
    adoptionPercent: 52,
    insights: ["Asynchronous event-loop execution optimizes memory overhead", "NestJS framework transition accelerating for TypeScript developers", "Critical backend choice for serverless and Edge computing architectures"]
  },
  'graphql & apollo server': {
    demand: "High (86%)",
    demandPercent: 86,
    hiringGrowth: "+23% YoY",
    hiringGrowthPercent: 79,
    salaryTrend: "$125,000 - $170,000 / yr",
    jobOpenings: "13,900 active",
    futureScope: "Superior developer experience and efficient front-end data querying",
    futureScopePercent: 85,
    learningComplexity: 3,
    adoptionRate: "API gateway adoption at 41%",
    adoptionPercent: 41,
    insights: ["Solves over-fetching issues in client devices and mobile apps", "Schema federation (Apollo GraphOS) highly requested in enterprise systems", "Pairs exceptionally well with React/Apollo Client frontends"]
  },
  'microsoft azure administration': {
    demand: "Very High (90%)",
    demandPercent: 90,
    hiringGrowth: "+26% YoY",
    hiringGrowthPercent: 81,
    salaryTrend: "$130,000 - $175,000 / yr",
    jobOpenings: "21,450 active",
    futureScope: "Fast-growing enterprise target in corporate clouds",
    futureScopePercent: 87,
    learningComplexity: 4,
    adoptionRate: "Azure market share at 23%",
    adoptionPercent: 78,
    insights: ["High integration with legacy Active Directory networks", "Hybrid cloud scenarios highly request Azure credentials", "Strong growth in corporate and governmental cloud solutions"]
  },
  'azure devops pipelines': {
    demand: "High (87%)",
    demandPercent: 87,
    hiringGrowth: "+22% YoY",
    hiringGrowthPercent: 77,
    salaryTrend: "$135,000 - $180,000 / yr",
    jobOpenings: "14,800 active",
    futureScope: "Preferred CI/CD solution for Microsoft-based stacks",
    futureScopePercent: 84,
    learningComplexity: 4,
    adoptionRate: "Azure DevOps enterprise share at 35%",
    adoptionPercent: 35,
    insights: ["Integrated board and deployment toolsets simplify project tracking", "YAML-based pipelines and self-hosted agents are standard", "Critical for teams managing large .NET cloud products"]
  },
  'aws solutions architect': {
    demand: "Extreme (94%)",
    demandPercent: 94,
    hiringGrowth: "+29% YoY",
    hiringGrowthPercent: 85,
    salaryTrend: "$145,000 - $195,000 / yr",
    jobOpenings: "32,400 active",
    futureScope: "Gold standard cloud architecture path",
    futureScopePercent: 91,
    learningComplexity: 4,
    adoptionRate: "AWS cloud dominance at 42%",
    adoptionPercent: 90,
    insights: ["AWS Certified Solutions Architect Associate/Professional highly valued", "Multi-region fallback and cost optimization are core tasks", "Essential skill for scaling modern SaaS architectures globally"]
  },
  'aws serverless computing': {
    demand: "Very High (91%)",
    demandPercent: 91,
    hiringGrowth: "+34% YoY",
    hiringGrowthPercent: 88,
    salaryTrend: "$140,000 - $190,000 / yr",
    jobOpenings: "18,300 active",
    futureScope: "Extreme cost-saving framework for fluctuating scale applications",
    futureScopePercent: 90,
    learningComplexity: 4,
    adoptionRate: "Serverless lambda adoption at 52%",
    adoptionPercent: 52,
    insights: ["Eliminates machine provisioning costs via AWS Lambda and DynamoDB", "Requires event-driven architectural models and state machines", "Serverless Framework and SAM tools are highly requested skillsets"]
  },
  'power bi analytics': {
    demand: "High (86%)",
    demandPercent: 86,
    hiringGrowth: "+17% YoY",
    hiringGrowthPercent: 71,
    salaryTrend: "$90,000 - $135,050 / yr",
    jobOpenings: "22,100 active",
    futureScope: "Standard business dashboard engine for corporate operations",
    futureScopePercent: 81,
    learningComplexity: 2,
    adoptionRate: "Corporate BI market share at 58%",
    adoptionPercent: 58,
    insights: ["Direct links to Microsoft Teams and Excel environments", "DAX formula proficiency is a crucial differentiator", "Favored for financial, sales, and executive performance dashboards"]
  },
  'tableau visual analytics': {
    demand: "High (84%)",
    demandPercent: 84,
    hiringGrowth: "+14% YoY",
    hiringGrowthPercent: 68,
    salaryTrend: "$95,000 - $140,000 / yr",
    jobOpenings: "16,400 active",
    futureScope: "State of the art visual storytelling for complex data teams",
    futureScopePercent: 79,
    learningComplexity: 3,
    adoptionRate: "Data-team specific visualization share at 44%",
    adoptionPercent: 44,
    insights: ["Salesforce integration simplifies CRM reporting tracks", "LOD expressions and dashboard optimizations are key skills", "Favored in healthcare, retail, and tech analytics teams"]
  },
  'ethical hacking & penetration testing': {
    demand: "Very High (92%)",
    demandPercent: 92,
    hiringGrowth: "+33% YoY",
    hiringGrowthPercent: 86,
    salaryTrend: "$125,000 - $180,000 / yr",
    jobOpenings: "13,600 active",
    futureScope: "High priority auditing to prevent catastrophic breaches",
    futureScopePercent: 90,
    learningComplexity: 4,
    adoptionRate: "Internal red-teaming adoption at 54%",
    adoptionPercent: 54,
    insights: ["OSCP and CEH certifications represent significant entry criteria", "Web application and Active Directory targets are most common", "Strong knowledge of network scanning and payload delivery is necessary"]
  },
  'linux systems administration': {
    demand: "Stable (85%)",
    demandPercent: 85,
    hiringGrowth: "+10% YoY",
    hiringGrowthPercent: 62,
    salaryTrend: "$90,000 - $135,000 / yr",
    jobOpenings: "24,800 active",
    futureScope: "The underlying operating system for 90% of global clouds",
    futureScopePercent: 82,
    learningComplexity: 3,
    adoptionRate: "Linux operating system cloud share at 92%",
    adoptionPercent: 92,
    insights: ["Command line bash scripting is a fundamental automation requirement", "Kernel tuning and server security configurations are key tasks", "Linux foundation needed for modern Docker and Kubernetes jobs"]
  },
  'red hat enterprise linux': {
    demand: "Stable (80%)",
    demandPercent: 80,
    hiringGrowth: "+8% YoY",
    hiringGrowthPercent: 55,
    salaryTrend: "$95,000 - $140,000 / yr",
    jobOpenings: "12,900 active",
    futureScope: "Enterprise server standard for secure corporate architectures",
    futureScopePercent: 76,
    learningComplexity: 3,
    adoptionRate: "RHEL enterprise distribution share at 48%",
    adoptionPercent: 48,
    insights: ["Strong corporate certification value (RHCSA / RHCE)", "Favored in banking and healthcare for commercial support model", "Ansible automation integration is heavily requested"]
  },
  'advanced product design systems': {
    demand: "High (82%)",
    demandPercent: 82,
    hiringGrowth: "+13% YoY",
    hiringGrowthPercent: 65,
    salaryTrend: "$110,000 - $155,000 / yr",
    jobOpenings: "9,800 active",
    futureScope: "Standardizing reusable components for design scaling",
    futureScopePercent: 78,
    learningComplexity: 3,
    adoptionRate: "Enterprise design systems at 60%",
    adoptionPercent: 60,
    insights: ["Bridges design tokens with code components (React/CSS)", "Figma variables and auto-layout mastery are required", "Significantly reduces user interface code decay and inconsistencies"]
  },
  'devsecops security automation': {
    demand: "Very High (93%)",
    demandPercent: 93,
    hiringGrowth: "+39% YoY",
    hiringGrowthPercent: 91,
    salaryTrend: "$140,000 - $195,000 / yr",
    jobOpenings: "15,200 active",
    futureScope: "Shifting security checks directly into code release gates",
    futureScopePercent: 93,
    learningComplexity: 4,
    adoptionRate: "DevSecOps active implementation at 49%",
    adoptionPercent: 49,
    insights: ["Automates vulnerability scanning in standard CI/CD steps", "SAST, DAST, and container image scans are key methods", "Bridges developer productivity with security compliance targets"]
  },
  'deep learning & computer vision': {
    demand: "Extreme (96%)",
    demandPercent: 96,
    hiringGrowth: "+45% YoY",
    hiringGrowthPercent: 93,
    salaryTrend: "$170,000 - $230,000 / yr",
    jobOpenings: "19,200 active",
    futureScope: "Autonomous vehicles, medical scan analysis, robotics",
    futureScopePercent: 95,
    learningComplexity: 5,
    adoptionRate: "Vision AI system implementation at 36%",
    adoptionPercent: 36,
    insights: ["CNNs, Transformers, and custom model tuning are core components", "PyTorch and OpenCV are the standard libraries for vision models", "High barriers to entry but commands premium starting salaries"]
  },
};

/**
 * Get market context for a course by name or skill ID.
 * Falls back to a category-based match, then a generic default.
 */
export const getMarketContext = (input: string): MarketContextData => {
  const normalized = input?.toLowerCase().replace(/-/g, ' ').trim() || '';

  // 1. Exact course name match
  if (COURSE_MARKET_DATA[normalized]) {
    return COURSE_MARKET_DATA[normalized];
  }

  // 2. Partial match against course names
  for (const [key, data] of Object.entries(COURSE_MARKET_DATA)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // 3. Category-level keyword fallback
  if (/machine|ai|ml|prompt|vision|deep/.test(normalized)) return COURSE_MARKET_DATA['machine learning & ai'];
  if (/aws.*architect|aws/.test(normalized)) return COURSE_MARKET_DATA['aws solutions architect'];
  if (/azure.*admin|azure/.test(normalized)) return COURSE_MARKET_DATA['microsoft azure administration'];
  if (/cloud|infrastructure/.test(normalized)) return COURSE_MARKET_DATA['cloud architecture (aws)'];
  if (/sql|database|mongodb|db/.test(normalized)) return COURSE_MARKET_DATA['sql fundamentals'];
  if (/react|web|frontend|next|javascript|full.*stack/.test(normalized)) return COURSE_MARKET_DATA['react.js & next.js'];
  if (/design|ui|ux|product.*design/.test(normalized)) return COURSE_MARKET_DATA['ui/ux design'];
  if (/security.*devsecops|devsecops/.test(normalized)) return COURSE_MARKET_DATA['devsecops security automation'];
  if (/security|cyber|hack|penetration/.test(normalized)) return COURSE_MARKET_DATA['cybersecurity fundamentals'];
  if (/data|analytics|engineering|spark|hadoop/.test(normalized)) return COURSE_MARKET_DATA['data engineering'];
  if (/blockchain|web3|defi/.test(normalized)) return COURSE_MARKET_DATA['blockchain development'];
  if (/network/.test(normalized)) return COURSE_MARKET_DATA['network fundamentals'];
  if (/flutter|mobile|native/.test(normalized)) return COURSE_MARKET_DATA['mobile app development (flutter)'];
  if (/devops|ci\/cd/.test(normalized)) return COURSE_MARKET_DATA['devops & ci/cd pipeline'];
  if (/docker/.test(normalized)) return COURSE_MARKET_DATA['docker containers in production'];
  if (/kubernetes/.test(normalized)) return COURSE_MARKET_DATA['kubernetes orchestration'];
  if (/test|qa|selenium/.test(normalized)) return COURSE_MARKET_DATA['software testing & qa'];
  if (/iot|internet/.test(normalized)) return COURSE_MARKET_DATA['internet of things (iot) systems'];
  if (/python|django/.test(normalized)) return COURSE_MARKET_DATA['advanced python programming'];
  if (/java|spring/.test(normalized)) return COURSE_MARKET_DATA['enterprise java with spring boot'];
  if (/node|graphql|apollo/.test(normalized)) return COURSE_MARKET_DATA['node.js & express api design'];
  if (/power.*bi/.test(normalized)) return COURSE_MARKET_DATA['power bi analytics'];
  if (/tableau/.test(normalized)) return COURSE_MARKET_DATA['tableau visual analytics'];
  if (/linux|rhel/.test(normalized)) return COURSE_MARKET_DATA['linux systems administration'];

  // 4. Default fallback
  return {
    demand: "Moderate (78%)",
    demandPercent: 78,
    hiringGrowth: "+10% YoY",
    hiringGrowthPercent: 60,
    salaryTrend: "$95,000 - $140,000 / yr",
    jobOpenings: "8,500 active",
    futureScope: "Steady technical relevance with gradual growth",
    futureScopePercent: 72,
    learningComplexity: 3,
    adoptionRate: "Industry adoption at 45%",
    adoptionPercent: 45,
    insights: ["Steady technical relevance", "Gradual growth and updates", "Requires adaptation to modern tooling"]
  };
};
