export const generateDynamicData = (skillId: string | undefined) => {
  const defaultSkill = "this skill";
  const skill = skillId ? skillId.replace(/-/g, ' ') : defaultSkill;
  const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const currentYear = new Date().getFullYear();

  const relevance = Math.max(40, 95 - (hash % 30));
  const halfLife = Math.max(0.5, 4 - (hash % 20) / 10).toFixed(1);
  const decayRate = 5 + (hash % 15);
  
  const gaps = [
    { name: `Advanced ${skill} Techniques`, gap: Math.max(30, 80 - (hash % 20)), status: 'Critical' },
    { name: `${skill} Integration & Deployment`, gap: Math.max(20, 50 - (hash % 15)), status: 'Moderate' },
    { name: `Foundational ${skill} Principles`, gap: Math.max(5, 20 - (hash % 10)), status: 'Low' },
  ];

  const roadmapRoles = [
    { year: currentYear, role: `Junior ${skill} Specialist`, status: 'Current' },
    { year: currentYear + 1, role: `Senior ${skill} Engineer`, status: 'Target' },
    { year: currentYear + 3, role: `Lead ${skill} Architect`, status: 'Future' },
  ];

  const recommendations = [
    { title: `Mastering ${skill} Ecosystem`, priority: 'High', time: `${1 + (hash % 3)} Weeks` },
    { title: `Real-world ${skill} Projects`, priority: 'Medium', time: `${2 + (hash % 4)} Weeks` },
  ];

  const roi = {
    salaryIncrease: 10 + (hash % 25), // %
    paybackPeriod: Math.max(2, 8 - (hash % 5)), // months
    newOpportunities: 50 + (hash % 200),
  };

  const score = Math.max(60, 98 - (hash % 25));

  return {
    skill,
    relevance,
    halfLife,
    decayRate,
    gaps,
    roadmapRoles,
    recommendations,
    roi,
    score
  };
};
