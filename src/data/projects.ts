export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  index: string;
  title: string;
  kind: string;
  year: string;
  /** Cover image (styled mockup) for the gallery. */
  image: string;
  /** One-line tagline shown under the active gallery title. */
  tagline: string;
  /** Short studio-tone blurb. */
  summary: string;
  /** Key facts shown as a small meta list. */
  meta: { label: string; value: string }[];
  links: ProjectLink[];
  /** Flags the entry with a "NEW" badge in the editorial work index. */
  isNew?: boolean;
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'RouteEval',
    kind: 'LLM Research',
    year: '2025',
    isNew: true,
    image: '/projects/routeeval.svg',
    tagline: 'A benchmark for how well LLMs reason about physical space.',
    summary:
      'A benchmark for how well large language models reason about physical space — measured through the lens of generating real running routes. Built with MIT grad Roger Jin and submitted to ACL ARR.',
    meta: [
      { label: 'Evaluations', value: '10,000+' },
      { label: 'Models tested', value: '13' },
      { label: 'Top result', value: 'GPT-5 · 65%' },
      { label: 'Submitted', value: 'ACL ARR · Oct 2025' },
    ],
    links: [
      { label: 'Read the paper', href: '/LLM_Research (1).pdf' },
      { label: 'GitHub', href: 'https://github.com/vjroy/routeeval' },
    ],
  },
  {
    index: '02',
    title: 'Routecraft',
    kind: 'Web App',
    year: '2025',
    isNew: true,
    image: '/projects/routecraft.svg',
    tagline: 'Turn a prompt into a running route — and compare models.',
    summary:
      'Turn a prompt into a running route. Routecraft generates routes with multiple models side by side so you can compare them — and hosts the RouteEval research blog.',
    meta: [
      { label: 'Type', value: 'Web app' },
      { label: 'URL', value: 'routecraft.io' },
    ],
    links: [{ label: 'Visit routecraft.io', href: 'https://routecraft.io' }],
  },
  {
    index: '03',
    title: 'SplitDecision',
    kind: 'iOS App',
    year: '2024',
    image: '/projects/splitdecision.svg',
    tagline: 'A coach-facing split tracker used by 100+ athletes.',
    summary:
      'A coach-facing iOS app for tracking workout splits across cross-country and track teams. Built in Swift and used by 100+ athletes.',
    meta: [
      { label: 'Users', value: '100+ athletes' },
      { label: 'Stack', value: 'Swift · SwiftUI' },
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/split-decision/id6745452671',
      },
    ],
  },
  {
    index: '04',
    title: 'Fraud Detection',
    kind: 'Machine Learning',
    year: '2024',
    image: '/projects/fraud.svg',
    tagline: 'Finding the 0.2% of transactions that are fraud.',
    summary:
      'Final project from Columbia University’s summer data-science program: a classifier combining logistic regression and a random forest, using SMOTE to balance a heavily skewed fraud dataset.',
    meta: [
      { label: 'Models', value: 'LogReg + Random Forest' },
      { label: 'Stack', value: 'Python · scikit-learn · pandas · SMOTE' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/yazganschool/finalproject' }],
  },
  {
    index: '05',
    title: 'HarvardX Data Science',
    kind: 'Certificate',
    year: '2023',
    image: '/projects/harvardx.svg',
    tagline: 'The mathematics behind machine learning.',
    summary:
      'A certificate program covering the mathematics behind machine learning — multivariable calculus, statistics, probability, and linear algebra — with hands-on Python.',
    meta: [
      { label: 'Focus', value: 'ML mathematics' },
      { label: 'Stack', value: 'Python · scikit-learn · NumPy · TensorFlow' },
    ],
    links: [{ label: 'View certificate', href: '/HarvardX.pdf' }],
  },
];
