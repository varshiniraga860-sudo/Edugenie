import { SubjectItem } from '../types';

export const CURATED_SUBJECTS: SubjectItem[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    iconName: 'Calculator',
    description: 'Calculus, algebra, probability, geometry, and problem solving',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    topics: [
      'Calculus: Derivatives & Rates of Change',
      'The Fundamental Theorem of Calculus',
      'Quadratic Equations & Complex Roots',
      'Bayes Theorem & Conditional Probability',
      'Linear Algebra: Eigenvalues & Eigenvectors',
      'Trigonometric Identities & Unit Circle',
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    iconName: 'Atom',
    description: 'Mechanics, electromagnetism, quantum theory, and thermodynamics',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    topics: [
      "Newton's Three Laws of Motion",
      'Quantum Entanglement & Superposition',
      'Thermodynamics: Entropy & Heat Engines',
      "Einstein's Special Relativity & E=mc²",
      'Electromagnetic Induction & Faraday Law',
      'Wave-Particle Duality & Double Slit',
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    iconName: 'FlaskConical',
    description: 'Atomic structure, chemical bonding, organic reactions, and thermodynamics',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 border-teal-200',
    topics: [
      'Chemical Bonding: Covalent, Ionic, and Hydrogen',
      'The Periodic Table & Periodic Trends',
      'Acid-Base Equilibrium & pH Scale',
      'Organic Chemistry: SN1 vs SN2 Mechanisms',
      'Thermodynamics: Gibbs Free Energy (ΔG)',
      'Stoichiometry & Mole Calculations',
    ],
  },
  {
    id: 'biology',
    name: 'Biology & Life Sciences',
    iconName: 'Dna',
    description: 'Genetics, cell biology, physiology, ecology, and evolution',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    topics: [
      'Photosynthesis: Light & Dark Reactions',
      'Cellular Respiration & ATP Production',
      'CRISPR-Cas9 & Gene Editing',
      'DNA Replication & Protein Synthesis',
      'Human Immune System & Antibody Response',
      'Natural Selection & Speciation',
    ],
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    iconName: 'Code',
    description: 'Algorithms, data structures, artificial intelligence, and networking',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50 border-sky-200',
    topics: [
      'Big-O Notation & Algorithm Complexity',
      'Binary Search Trees & Graph Traversal',
      'How Neural Networks & Deep Learning Work',
      'Recursion & Dynamic Programming',
      'How the Internet & HTTP Protocol Work',
      'Object-Oriented Programming (OOP) Principles',
    ],
  },
  {
    id: 'history',
    name: 'World History',
    iconName: 'Landmark',
    description: 'Civilizations, global revolutions, conflicts, and modern history',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    topics: [
      'The Industrial Revolution & Its Global Impact',
      'Origins and Turning Points of World War II',
      'The Fall of the Western Roman Empire',
      'The Renaissance: Cultural & Scientific Rebirth',
      'The Cold War & Space Race',
      'The French Revolution: Causes & Consequences',
    ],
  },
  {
    id: 'literature',
    name: 'Literature & Writing',
    iconName: 'BookOpen',
    description: 'Rhetoric, literary analysis, essay writing, and narrative structures',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    topics: [
      'How to Write a Compelling Thesis Statement',
      'Literary Devices: Metaphor, Allegory & Irony',
      "Aristotle's Rhetorical Triangle: Ethos, Pathos, Logos",
      "Shakespeare's Macbeth: Ambition & Downfall",
      "The Hero's Journey: Monomyth Structure",
      'Critical Reading & Source Evaluation',
    ],
  },
  {
    id: 'economics',
    name: 'Economics & Finance',
    iconName: 'TrendingUp',
    description: 'Microeconomics, macroeconomics, markets, and monetary systems',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200',
    topics: [
      'Supply and Demand & Price Elasticity',
      'Fiscal Policy vs Monetary Policy',
      'Inflation, Interest Rates & Central Banks',
      'Game Theory: The Prisoner\'s Dilemma',
      'Opportunity Cost & Comparative Advantage',
      'Market Structures: Monopoly vs Perfect Competition',
    ],
  },
];

export const POPULAR_TOPICS = [
  { topic: 'Calculus: Derivatives & Rates of Change', subject: 'Mathematics' },
  { topic: "Newton's Three Laws of Motion", subject: 'Physics' },
  { topic: 'Photosynthesis: Light & Dark Reactions', subject: 'Biology & Life Sciences' },
  { topic: 'Big-O Notation & Algorithm Complexity', subject: 'Computer Science' },
  { topic: 'Chemical Bonding: Covalent & Ionic', subject: 'Chemistry' },
  { topic: 'Supply and Demand & Price Elasticity', subject: 'Economics & Finance' },
  { topic: 'The Industrial Revolution', subject: 'World History' },
  { topic: 'How Neural Networks Work', subject: 'Computer Science' },
];

export const SAMPLE_DOCUMENTS = [
  {
    title: 'Biology 101: Cell Membranes and Passive Transport',
    category: 'Biology',
    content: `Cell Membranes and Passive Transport Mechanisms
Chapter 4: Cell Structure and Physiology

1. Structure of the Fluid Mosaic Membrane
The cell membrane, or plasma membrane, is primarily composed of an amphipathic phospholipid bilayer. Each phospholipid molecule consists of a polar hydrophilic (water-loving) phosphate head facing outward toward aqueous extracellular fluid and intracellular cytoplasm, and two nonpolar hydrophobic (water-fearing) fatty acid tails pointing inward toward each other. Cholesterol molecules embedded within animal cell membranes modulate fluidity across different temperatures. Embedded integral proteins span the membrane to function as transporters, receptors, and enzymes, while peripheral proteins adhere temporarily to the membrane surface.

2. Principles of Passive Transport
Passive transport refers to the movement of biochemical substances across cell membranes without requiring the expenditure of cellular metabolic energy (ATP). The driving force behind passive transport is thermal kinetic energy and chemical concentration gradients, moving molecules from regions of higher concentration to regions of lower concentration down their electrochemical gradient.

A. Simple Diffusion
Small, nonpolar, uncharged molecules such as diatomic oxygen (O₂), carbon dioxide (CO₂), and lipid-soluble steroid hormones diffuse directly across the hydrophobic lipid bilayer. The rate of diffusion is governed by Fick's Law, influenced by surface area, concentration gradient steepness, and membrane thickness.

B. Facilitated Diffusion
Large, polar, or charged particles—including glucose, amino acids, and inorganic ions (Na⁺, K⁺, Ca²⁺, Cl⁻)—cannot easily cross the hydrophobic core of the bilayer. Instead, they pass through specialized transmembrane transport proteins:
- Channel Proteins: Form hydrophilic pores (e.g., aquaporins for rapid water transport, voltage-gated ion channels).
- Carrier Proteins: Bind specific solutes on one side, undergo conformational shape changes, and release them on the opposite side (e.g., GLUT-1 glucose transporter).

C. Osmosis and Tonicity
Osmosis is the net diffusion of water molecules across a selectively permeable membrane from a region of low solute concentration (high water potential) to a region of high solute concentration (low water potential).
- Hypertonic solution: Higher extracellular solute concentration; causes animal cells to crenate (shrivel) and plant cells to plasmolyze.
- Hypotonic solution: Lower extracellular solute concentration; causes animal cells to swell and lyse, while providing turgor pressure vital for plant rigidity.
- Isotonic solution: Equal solute concentrations; dynamic equilibrium with no net water shift.

3. Clinical & Biological Relevance
In human kidneys, nephron tubules rely on passive osmosis and facilitated diffusion alongside active transport to filter 180 liters of blood daily. Disruptions in ion channel proteins lead to channelopathies, such as cystic fibrosis, caused by mutations in the CFTR chloride channel.`,
  },
  {
    title: 'Computer Science: Algorithmic Efficiency & Big-O',
    category: 'Computer Science',
    content: `Introduction to Algorithmic Analysis and Asymptotic Notation
Lecture Notes: CS 201 Data Structures & Algorithms

1. Why Measure Algorithm Performance?
In computer science, algorithms can be implemented in different languages and executed on machines with widely varied hardware specifications. Measuring real wall-clock execution time (benchmarking) is heavily hardware-dependent and unstandardized. To characterize the fundamental mathematical efficiency of an algorithm independent of hardware, we analyze asymptotic computational complexity as the input size n approaches infinity.

2. Big-O Notation (Upper Bound)
Big-O notation, formally denoted as O(g(n)), characterizes the worst-case upper bound on the growth rate of runtime or memory consumption. An algorithm f(n) is in O(g(n)) if there exist positive constants c and n₀ such that 0 ≤ f(n) ≤ c·g(n) for all n ≥ n₀.

Common Complexity Classes (from most efficient to least):
1. O(1) - Constant Time: Direct array index access, hash table lookup in the average case. Runtime remains unchanged regardless of input size.
2. O(log n) - Logarithmic Time: Binary search on a sorted collection. The search space is halved at every single step. Extremely scalable (log₂(1,000,000) ≈ 20 operations).
3. O(n) - Linear Time: Single traversal of an unsorted list or array, linear search.
4. O(n log n) - Linearithmic Time: Optimal comparison-based sorting algorithms such as Merge Sort and Quick Sort (average case).
5. O(n²) - Quadratic Time: Nested loops over inputs, such as Bubble Sort, Selection Sort, or comparing every pair in an array.
6. O(2ⁿ) - Exponential Time: Naive recursive Fibonacci computation, traveling salesperson brute-force. Growth explodes rapidly.
7. O(n!) - Factorial Time: Generating all permutations of a set of n elements.

3. Space Complexity Considerations
Algorithms consume not just CPU clock cycles (Time Complexity), but also memory on the stack and heap (Space Complexity). An iterative algorithm using pointers may achieve O(1) auxiliary space, whereas an equivalent recursive formulation might accumulate O(n) call stack frames.

4. Practical Takeaways for Software Engineering
- Avoid nested loops over large datasets (O(n²) quickly causes browser freezing and server timeouts with n > 10,000).
- Leverage hash tables (O(1) average lookup) to eliminate repetitive O(n) searches.
- Pre-sorting data enables O(log n) binary queries, amortizing the upfront O(n log n) sorting cost across multiple lookups.`,
  },
];
