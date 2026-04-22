/**
 * Two-dimensional tag taxonomy for startups.
 *
 * IMPORTANT DESIGN RULES:
 * - Only include genuinely domain/tech-specific tags
 * - Never include generic business descriptors: B2B, SaaS, Enterprise, Marketplace,
 *   Platform, API, Operations, Productivity, Consumer — these match everything
 * - Each tag must clearly identify a specific industry or technology
 */

// ─── Tech taxonomy ────────────────────────────────────────────────────────────
export const TECH_TAGS: Record<string, string[]> = {
  'AI/ML': [
    'Artificial Intelligence', 'Machine Learning', 'Generative AI',
    'AI', 'ML', 'Deep Learning', 'AI Assistant', 'Conversational AI',
    'AIOps', 'Foundation Models', 'Large Language Models', 'LLM',
  ],
  'Компьютерное зрение': [
    'Computer Vision', 'Image Recognition', 'Video Analytics', 'Vision AI',
  ],
  'NLP/Текст': [
    'NLP', 'Natural Language Processing', 'Speech Recognition',
    'Text Analytics', 'Sentiment Analysis',
  ],
  'Аналитика/Данные': [
    'Data Engineering', 'Data Science', 'Data Visualization',
    'Big Data', 'Business Intelligence', 'Databases', 'Data Infrastructure',
    'Analytics', 'Search',
  ],
  'Developer Tools': [
    'Developer Tools', 'DevOps', 'DevSecOps', 'Open Source',
    'Cloud Computing', 'Kubernetes', 'Monitoring', 'Infrastructure',
    'Web Development', 'Testing',
  ],
  'Автоматизация': [
    'Automation', 'Workflow Automation', 'Robotic Process Automation',
    'RPA', 'No-Code', 'Low-Code', 'Process Automation',
  ],
  'Роботика/Хардвер': [
    'Robotics', 'Manufacturing and Robotics', 'Hardware',
    'Drones', 'Autonomous Vehicles', 'IoT',
  ],
  'Блокчейн/Web3': [
    'Crypto / Web3', 'Blockchain', 'Web3', 'Crypto', 'DeFi',
    'NFT', 'Smart Contracts',
  ],
  'Hard Tech': [
    'Hard Tech', 'Deep Tech', 'Quantum Computing', 'Semiconductors',
    'Aerospace', 'Aviation and Space', 'Fusion Energy',
  ],
  'Биотех': [
    'Biotech', 'Gene Therapy', 'Drug Discovery', 'Genomics',
    'Synthetic Biology', 'Bioinformatics',
  ],
  'Кибербезопасность': [
    'Cybersecurity', 'Security', 'Privacy', 'Zero Trust',
    'Identity', 'Fraud Detection',
  ],
};

// ─── Domain taxonomy ──────────────────────────────────────────────────────────
export const DOMAIN_TAGS: Record<string, string[]> = {
  'HealthTech': [
    'Healthcare', 'HealthTech', 'Health Tech', 'Digital Health',
    'Healthcare IT', 'MedTech', 'Mental Health', 'Telemedicine',
    'Medical Devices', 'Consumer Health Services',
    'Consumer Health and Wellness', 'Health & Wellness',
    'Health Insurance', 'Drug Discovery', 'Fitness',
  ],
  'FinTech': [
    'Fintech', 'Banking and Exchange', 'Payments', 'Insurance',
    'Insurtech', 'Lending', 'Wealth Management', 'Finance and Accounting',
    'Finance', 'Payroll', 'Banking', 'Investment', 'Trading',
  ],
  'EdTech': [
    'EdTech', 'Edtech', 'Education', 'E-Learning', 'AI-Enhanced Learning',
    'Corporate Training', 'Online Education', 'Learning',
  ],
  'LegalTech': [
    'LegalTech', 'Legal', 'Compliance', 'RegTech',
    'Contract Management', 'eSignature',
  ],
  'HR/Рекрутинг': [
    'HR Tech', 'HRTech', 'HR', 'Human Resources',
    'Recruiting and Talent', 'Recruiting',
  ],
  'Логистика/Склад': [
    'Logistics', 'Supply Chain', 'Supply Chain and Logistics',
    'Warehouse', 'Inventory Management', 'Shipping', 'Last Mile',
    'Procurement', 'Delivery',
  ],
  'Энергетика/Климат': [
    'Energy', 'Climate Tech', 'CleanTech', 'ClimateTech', 'Solar',
    'EV', 'Carbon', 'Fusion Energy', 'Energy Storage',
    'Renewable Energy', 'Sustainability',
  ],
  'GovTech/Оборонка': [
    'GovTech', 'Government', 'Defense', 'Defense Tech',
    'Public Sector', 'Smart Cities',
  ],
  'Недвижимость': [
    'PropTech', 'Proptech', 'Real Estate', 'ConstructionTech',
    'Construction', 'Architecture',
  ],
  'Маркетинг/Продажи': [
    'Marketing', 'Sales', 'CRM', 'AdTech', 'Growth',
    'E-Commerce', 'E-commerce', 'Retail', 'Retail Tech',
    'Advertising', 'Sales Enablement', 'Customer Support',
  ],
  'Производство': [
    'Manufacturing', 'Industrial', 'Industrials', 'Industry 4.0',
    'Predictive Maintenance', 'Manufacturing and Robotics',
  ],
  'AgriTech': [
    'AgriTech', 'FoodTech', 'Agriculture', 'Food', 'Vertical Farming',
  ],
  'Медиа/Контент': [
    'Media', 'Content', 'Video', 'Gaming', 'Entertainment',
    'Creator Economy', 'Social Media', 'Design Tools', 'Music',
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns canonical tech labels that match the startup's raw tags (exact match) */
export function getTechLabels(rawTags: string[]): string[] {
  const tagSet = new Set(rawTags.map(t => t.toLowerCase()));
  const result: string[] = [];
  for (const [label, sources] of Object.entries(TECH_TAGS)) {
    if (sources.some(s => tagSet.has(s.toLowerCase()))) {
      result.push(label);
    }
  }
  return result;
}

/** Returns canonical domain labels that match the startup's raw tags (exact match) */
export function getDomainLabels(rawTags: string[]): string[] {
  const tagSet = new Set(rawTags.map(t => t.toLowerCase()));
  const result: string[] = [];
  for (const [label, sources] of Object.entries(DOMAIN_TAGS)) {
    if (sources.some(s => tagSet.has(s.toLowerCase()))) {
      result.push(label);
    }
  }
  return result;
}

/** All raw tags that correspond to a given canonical tech label (for SQL filter) */
export function rawTagsForTech(label: string): string[] {
  return TECH_TAGS[label] ?? [];
}

/** All raw tags that correspond to a given canonical domain label (for SQL filter) */
export function rawTagsForDomain(label: string): string[] {
  return DOMAIN_TAGS[label] ?? [];
}
