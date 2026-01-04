import { Report } from './types';

export const REPORTS: Report[] = [
  // --- BATCH 1: FOUNDATIONS & AI ARCHITECTURE (001-020) ---
  {
    id: "REP-001",
    title: "The Agentic Shift",
    category: "AI Architecture",
    date: "2024-01-10",
    readTime: "12 min",
    summary: "Analyzing the transition from chat-based LLMs to autonomous agents. How planning, memory, and tool-use are creating a new software paradigm.",
    tags: ["Agents", "LLM", "Autonomy"]
  },
  {
    id: "REP-002",
    title: "RAG Systems at Scale",
    category: "Data Engineering",
    date: "2024-01-18",
    readTime: "15 min",
    summary: "Optimizing Retrieval-Augmented Generation for enterprise data. Strategies for chunking, vector database selection, and minimizing hallucinations.",
    tags: ["RAG", "Vector DB", "Enterprise"]
  },
  {
    id: "REP-003",
    title: "The Transformer Anatomy",
    category: "Deep Learning",
    date: "2024-01-25",
    readTime: "20 min",
    summary: "A deep dive into the attention mechanism. Visualizing how query, key, and value matrices interact to create context awareness.",
    tags: ["Deep Learning", "Transformers", "Math"]
  },
  {
    id: "REP-004",
    title: "Small Language Models (SLMs)",
    category: "Edge AI",
    date: "2024-02-02",
    readTime: "10 min",
    summary: "Why parameter count isn't everything. The rise of Mistral and Phi-2, and the feasibility of running high-quality inference on consumer hardware.",
    tags: ["SLM", "Edge Computing", "Optimization"]
  },
  {
    id: "REP-005",
    title: "Prompt Engineering Patterns",
    category: "AI Interaction",
    date: "2024-02-10",
    readTime: "8 min",
    summary: "Cataloging effective prompting strategies: Chain-of-Thought, ReAct, and Tree-of-Thoughts. How to structure inputs for deterministic outputs.",
    tags: ["Prompting", "UX", "LLM"]
  },
  {
    id: "REP-006",
    title: "Synthetic Data Generation",
    category: "Data Science",
    date: "2024-02-18",
    readTime: "14 min",
    summary: "Overcoming data scarcity. Using generative models to create training datasets for computer vision and tabular data privacy.",
    tags: ["Synthetic Data", "Privacy", "Training"]
  },
  {
    id: "REP-007",
    title: "GPU Cluster Optimization",
    category: "Infrastructure",
    date: "2024-02-25",
    readTime: "18 min",
    summary: "Managing Kubernetes on bare metal GPUs. Strategies for maximizing utilization and handling node failures in training clusters.",
    tags: ["Kubernetes", "GPU", "Ops"]
  },
  {
    id: "REP-008",
    title: "Multimodal Embeddings",
    category: "AI Research",
    date: "2024-03-05",
    readTime: "16 min",
    summary: "Bridging text, image, and audio. How CLIP and similar models map different modalities into a shared vector space.",
    tags: ["Multimodal", "Embeddings", "Research"]
  },
  {
    id: "REP-009",
    title: "Fine-Tuning Strategies",
    category: "ML Ops",
    date: "2024-03-12",
    readTime: "13 min",
    summary: "LoRA vs. Full Fine-Tuning. Cost-benefit analysis of adapting foundation models for domain-specific tasks.",
    tags: ["Fine-tuning", "LoRA", "Optimization"]
  },
  {
    id: "REP-010",
    title: "AI Safety Frameworks",
    category: "Ethics",
    date: "2024-03-20",
    readTime: "11 min",
    summary: "Implementing guardrails. Constitutional AI, RLHF, and techniques to prevent jailbreaks and toxic outputs in production systems.",
    tags: ["Safety", "Alignment", "Ethics"]
  },
  {
    id: "REP-011",
    title: "Graph Neural Networks",
    category: "Deep Learning",
    date: "2024-03-28",
    readTime: "19 min",
    summary: "Applying deep learning to graph structures. Use cases in drug discovery, social network analysis, and recommendation engines.",
    tags: ["GNN", "Graph Theory", "Data"]
  },
  {
    id: "REP-012",
    title: "Time-Series Forecasting",
    category: "Data Science",
    date: "2024-04-04",
    readTime: "14 min",
    summary: "Modern approaches to temporal data. Comparing ARIMA with Transformer-based models for stock prediction and anomaly detection.",
    tags: ["Time-Series", "Finance", "Analytics"]
  },
  {
    id: "REP-013",
    title: "Computer Vision at the Edge",
    category: "Edge AI",
    date: "2024-04-12",
    readTime: "15 min",
    summary: "Running YOLOv8 on Raspberry Pi. Optimization techniques like quantization and pruning for real-time object detection.",
    tags: ["Computer Vision", "IoT", "Optimization"]
  },
  {
    id: "REP-014",
    title: "Audio Generation Advances",
    category: "Generative AI",
    date: "2024-04-20",
    readTime: "12 min",
    summary: "From TTS to music generation. Analyzing the architecture of models like AudioLDM and MusicGen.",
    tags: ["Audio", "Generative AI", "Creative"]
  },
  {
    id: "REP-015",
    title: "Vector Search Algorithms",
    category: "Algorithms",
    date: "2024-04-28",
    readTime: "17 min",
    summary: "Under the hood of HNSW and IVF. How approximate nearest neighbor search enables scalable semantic retrieval.",
    tags: ["Algorithms", "Search", "Vector DB"]
  },
  {
    id: "REP-016",
    title: "Autonomous Coding Agents",
    category: "DevTools",
    date: "2024-05-06",
    readTime: "14 min",
    summary: "Evaluating Devin and OpenDevin. The reality of AI software engineers and the future of human-in-the-loop development.",
    tags: ["Agents", "Coding", "Automation"]
  },
  {
    id: "REP-017",
    title: "Knowledge Graphs & AI",
    category: "Knowledge Mgmt",
    date: "2024-05-14",
    readTime: "16 min",
    summary: "Combining structured knowledge graphs with probabilistic LLMs. Enhancing factual accuracy and reasoning capabilities.",
    tags: ["Knowledge Graph", "Reasoning", "Hybrid AI"]
  },
  {
    id: "REP-018",
    title: "Federated Learning Basics",
    category: "Privacy AI",
    date: "2024-05-22",
    readTime: "13 min",
    summary: "Training models without sharing data. Concepts of local gradients and global aggregation for privacy-sensitive applications.",
    tags: ["Privacy", "Distributed Systems", "ML"]
  },
  {
    id: "REP-019",
    title: "Explainable AI (XAI)",
    category: "Ethics",
    date: "2024-05-30",
    readTime: "15 min",
    summary: "Opening the black box. Techniques like SHAP and LIME to interpret model predictions in healthcare and finance.",
    tags: ["XAI", "Interpretability", "Transparency"]
  },
  {
    id: "REP-020",
    title: "The End of Moore's Law?",
    category: "Hardware",
    date: "2024-06-07",
    readTime: "18 min",
    summary: "Alternative computing paradigms. Specialized accelerators, 3D stacking, and the push for optical computing.",
    tags: ["Hardware", "Semiconductors", "Future Tech"]
  },

  // --- BATCH 2: WEB, CLOUD & DEVOPS (021-040) ---
  {
    id: "REP-021",
    title: "React Server Components",
    category: "Frontend",
    date: "2024-06-15",
    readTime: "14 min",
    summary: "Deconstructing the Next.js App Router. Balancing server-side rendering with client-side interactivity.",
    tags: ["React", "Next.js", "Frontend"]
  },
  {
    id: "REP-022",
    title: "Rust in Production",
    category: "Systems",
    date: "2024-06-22",
    readTime: "16 min",
    summary: "Replacing C++ with Rust. Memory safety guarantees and the experience of rewriting high-performance backend services.",
    tags: ["Rust", "Systems Programming", "Performance"]
  },
  {
    id: "REP-023",
    title: "WebAssembly (Wasm)",
    category: "Web Tech",
    date: "2024-06-30",
    readTime: "13 min",
    summary: "Beyond the browser. Using Wasm for secure, portable server-side plugins and containerless deployment.",
    tags: ["Wasm", "Web", "Performance"]
  },
  {
    id: "REP-024",
    title: "eBPF Observability",
    category: "DevOps",
    date: "2024-07-08",
    readTime: "17 min",
    summary: "Kernel-level monitoring without modules. How eBPF is revolutionizing networking, security, and observability in Linux.",
    tags: ["Linux", "Kernel", "Observability"]
  },
  {
    id: "REP-025",
    title: "Serverless v2.0",
    category: "Cloud",
    date: "2024-07-16",
    readTime: "12 min",
    summary: "The evolution of FaaS. Edge functions, stateful serverless, and the move away from cold starts.",
    tags: ["Serverless", "Cloud", "Architecture"]
  },
  {
    id: "REP-026",
    title: "GraphQL Federation",
    category: "API",
    date: "2024-07-24",
    readTime: "15 min",
    summary: "Scaling APIs across microservices. Managing a unified supergraph with Apollo Federation.",
    tags: ["GraphQL", "Microservices", "API"]
  },
  {
    id: "REP-027",
    title: "Platform Engineering",
    category: "DevOps",
    date: "2024-08-01",
    readTime: "14 min",
    summary: "Treating the internal developer platform as a product. Reducing cognitive load for feature teams.",
    tags: ["Platform Eng", "DevEx", "Culture"]
  },
  {
    id: "REP-028",
    title: "Database Sharding Patterns",
    category: "Database",
    date: "2024-08-09",
    readTime: "16 min",
    summary: "Horizontal scaling strategies. Consistent hashing, directory-based sharding, and handling hot keys.",
    tags: ["Database", "Scaling", "Architecture"]
  },
  {
    id: "REP-029",
    title: "Monorepo Build Tools",
    category: "DevTools",
    date: "2024-08-17",
    readTime: "13 min",
    summary: "Turborepo vs. Nx. Strategies for caching and parallelizing builds in large JavaScript/TypeScript codebases.",
    tags: ["Monorepo", "Build Tools", "Productivity"]
  },
  {
    id: "REP-030",
    title: "HTTP/3 and QUIC",
    category: "Networking",
    date: "2024-08-25",
    readTime: "15 min",
    summary: "The next generation of the web protocol. Solving head-of-line blocking and improving performance on unreliable networks.",
    tags: ["Networking", "Protocols", "Web"]
  },
  {
    id: "REP-031",
    title: "Event-Driven Architecture",
    category: "Architecture",
    date: "2024-09-02",
    readTime: "16 min",
    summary: "Decoupling services with Kafka and RabbitMQ. Handling eventual consistency and event sourcing patterns.",
    tags: ["EDA", "Microservices", "Messaging"]
  },
  {
    id: "REP-032",
    title: "Infrastructure as Code (IaC)",
    category: "DevOps",
    date: "2024-09-10",
    readTime: "14 min",
    summary: "Terraform vs. Pulumi. The shift from declarative configuration files to general-purpose programming languages for infra.",
    tags: ["IaC", "DevOps", "Cloud"]
  },
  {
    id: "REP-033",
    title: "Zero Trust Networking",
    category: "Security",
    date: "2024-09-18",
    readTime: "17 min",
    summary: "Beyond the VPN. Implementing identity-aware proxies and mutual TLS for secure service-to-service communication.",
    tags: ["Security", "Zero Trust", "Networking"]
  },
  {
    id: "REP-034",
    title: "WebGPU Acceleration",
    category: "Web Tech",
    date: "2024-09-26",
    readTime: "15 min",
    summary: "Unlocking GPU compute in the browser. High-performance graphics and compute tasks without native plugins.",
    tags: ["WebGPU", "Graphics", "Performance"]
  },
  {
    id: "REP-035",
    title: "Chaos Engineering",
    category: "Resilience",
    date: "2024-10-04",
    readTime: "13 min",
    summary: "Breaking things on purpose. Using tools like Gremlin to test system resilience against network latency and service failures.",
    tags: ["Chaos", "Resilience", "Testing"]
  },
  {
    id: "REP-036",
    title: "Supply Chain Security",
    category: "Security",
    date: "2024-10-12",
    readTime: "16 min",
    summary: "Securing the software supply chain. SBOMs, signing artifacts, and preventing dependency confusion attacks.",
    tags: ["Security", "Supply Chain", "DevSecOps"]
  },
  {
    id: "REP-037",
    title: "Micro-Frontends",
    category: "Frontend",
    date: "2024-10-20",
    readTime: "14 min",
    summary: "Scaling frontend development. Module Federation and strategies for composing independent frontend applications.",
    tags: ["Frontend", "Architecture", "Scaling"]
  },
  {
    id: "REP-038",
    title: "Cloud FinOps",
    category: "Cloud",
    date: "2024-10-28",
    readTime: "12 min",
    summary: "Managing cloud costs at scale. Tagging strategies, reserved instances, and cultural shifts for financial accountability.",
    tags: ["FinOps", "Cloud", "Cost"]
  },
  {
    id: "REP-039",
    title: "Functional Programming in JS",
    category: "Languages",
    date: "2024-11-05",
    readTime: "15 min",
    summary: "Applying immutability and pure functions. How functional patterns improve readability and testability in JavaScript.",
    tags: ["FP", "JavaScript", "Patterns"]
  },
  {
    id: "REP-040",
    title: "Design Systems at Scale",
    category: "Design",
    date: "2024-11-13",
    readTime: "13 min",
    summary: "Bridging design and code. Creating tokenized design systems that sync between Figma and React components.",
    tags: ["Design Systems", "UI/UX", "Workflow"]
  },

  // --- BATCH 3: MOBILE, IOT & BLOCKCHAIN (041-060) ---
  {
    id: "REP-041",
    title: "Flutter vs. React Native",
    category: "Mobile",
    date: "2024-11-21",
    readTime: "16 min",
    summary: "The 2024 landscape of cross-platform mobile dev. Performance benchmarks and developer experience comparison.",
    tags: ["Mobile", "Flutter", "React Native"]
  },
  {
    id: "REP-042",
    title: "IoT Protocols: MQTT vs. CoAP",
    category: "IoT",
    date: "2024-11-29",
    readTime: "14 min",
    summary: "Choosing the right protocol for constrained devices. Assessing overhead, reliability, and power consumption.",
    tags: ["IoT", "Protocols", "Embedded"]
  },
  {
    id: "REP-043",
    title: "Smart Contract Auditing",
    category: "Blockchain",
    date: "2024-12-07",
    readTime: "18 min",
    summary: "Common vulnerabilities in Solidity. Reentrancy, overflow, and logic errors, and how to detect them.",
    tags: ["Blockchain", "Security", "Solidity"]
  },
  {
    id: "REP-044",
    title: "Zero-Knowledge Proofs (ZKPs)",
    category: "Cryptography",
    date: "2024-12-15",
    readTime: "20 min",
    summary: "Proving knowledge without revealing information. Applications in privacy-preserving blockchains and authentication.",
    tags: ["ZKP", "Cryptography", "Privacy"]
  },
  {
    id: "REP-045",
    title: "Real-Time Operating Systems",
    category: "Embedded",
    date: "2024-12-23",
    readTime: "15 min",
    summary: "FreeRTOS vs. Zephyr. Selecting the right RTOS for mission-critical embedded systems.",
    tags: ["RTOS", "Embedded", "Systems"]
  },
  {
    id: "REP-046",
    title: "DeFi Automated Market Makers",
    category: "FinTech",
    date: "2025-01-02",
    readTime: "17 min",
    summary: "The math behind Uniswap. Constant product formulas and the mechanics of liquidity pools.",
    tags: ["DeFi", "Finance", "Math"]
  },
  {
    id: "REP-047",
    title: "Android Virtualization Framework",
    category: "Mobile",
    date: "2025-01-10",
    readTime: "14 min",
    summary: "Running virtual machines on Android. Implications for security, privacy, and running isolated workloads.",
    tags: ["Android", "Virtualization", "Security"]
  },
  {
    id: "REP-048",
    title: "SwiftUI Architecture",
    category: "Mobile",
    date: "2025-01-18",
    readTime: "13 min",
    summary: "Declarative UI on iOS. Managing state with Combine and Observation frameworks.",
    tags: ["iOS", "Swift", "Architecture"]
  },
  {
    id: "REP-049",
    title: "Hardware Security Modules",
    category: "Security",
    date: "2025-01-26",
    readTime: "16 min",
    summary: "Protecting cryptographic keys. The role of HSMs and Trusted Platform Modules (TPMs) in secure infrastructure.",
    tags: ["Security", "Hardware", "Crypto"]
  },
  {
    id: "REP-050",
    title: "Web3 Identity (DID)",
    category: "Identity",
    date: "2025-02-03",
    readTime: "15 min",
    summary: "Decentralized Identifiers and Verifiable Credentials. Owning your digital identity without central authorities.",
    tags: ["Web3", "Identity", "Standards"]
  },
  {
    id: "REP-051",
    title: "5G Network Slicing",
    category: "Telecom",
    date: "2025-02-11",
    readTime: "14 min",
    summary: "Virtualizing network infrastructure. Creating dedicated slices for IoT, autonomous vehicles, and mobile broadband.",
    tags: ["5G", "Telecom", "Infrastructure"]
  },
  {
    id: "REP-052",
    title: "Energy Harvesting IoT",
    category: "Hardware",
    date: "2025-02-19",
    readTime: "13 min",
    summary: "Batteryless sensors. Harvesting energy from RF, vibration, and thermal gradients for sustainable IoT deployments.",
    tags: ["IoT", "Hardware", "Energy"]
  },
  {
    id: "REP-053",
    title: "Cross-Chain Bridges",
    category: "Blockchain",
    date: "2025-02-27",
    readTime: "18 min",
    summary: "Interoperability between blockchains. Analyzing the security risks and architecture of locking and minting assets.",
    tags: ["Blockchain", "Interoperability", "Security"]
  },
  {
    id: "REP-054",
    title: "Progressive Web Apps (PWA)",
    category: "Web Tech",
    date: "2025-03-07",
    readTime: "12 min",
    summary: "Bridging the gap between web and native. Service workers, offline capabilities, and installability.",
    tags: ["PWA", "Web", "Mobile"]
  },
  {
    id: "REP-055",
    title: "RISC-V Architecture",
    category: "Hardware",
    date: "2025-03-15",
    readTime: "16 min",
    summary: "The rise of open silicon. How RISC-V is challenging ARM and x86 in embedded and server markets.",
    tags: ["RISC-V", "Hardware", "Architecture"]
  },
  {
    id: "REP-056",
    title: "Spatial Audio Rendering",
    category: "Audio",
    date: "2025-03-23",
    readTime: "14 min",
    summary: "3D sound for VR/AR. HRTF (Head-Related Transfer Functions) and physics-based audio simulation.",
    tags: ["Audio", "VR", "Physics"]
  },
  {
    id: "REP-057",
    title: "Computational Photography",
    category: "Imaging",
    date: "2025-03-31",
    readTime: "15 min",
    summary: "Software-defined imaging. Stacking, HDR+, and super-resolution techniques in modern smartphone cameras.",
    tags: ["Photography", "Algorithms", "Imaging"]
  },
  {
    id: "REP-058",
    title: "Central Bank Digital Currencies",
    category: "FinTech",
    date: "2025-04-08",
    readTime: "17 min",
    summary: "CBDCs vs. Crypto. The technical architecture of digital fiat currencies and privacy implications.",
    tags: ["CBDC", "Finance", "GovTech"]
  },
  {
    id: "REP-059",
    title: "Augmented Reality Optics",
    category: "Hardware",
    date: "2025-04-16",
    readTime: "16 min",
    summary: "Waveguides and light engines. The physics challenges of creating lightweight, high-FOV AR glasses.",
    tags: ["AR", "Hardware", "Optics"]
  },
  {
    id: "REP-060",
    title: "Mesh Networking",
    category: "Networking",
    date: "2025-04-24",
    readTime: "14 min",
    summary: "Decentralized connectivity. Protocols like Meshtastic and LoRa for off-grid communication.",
    tags: ["Networking", "Off-grid", "Comms"]
  },

  // --- BATCH 4: APPLIED SCIENCE & INDUSTRIAL TECH (061-079) ---
  {
    id: "REP-061",
    title: "Solid State Batteries",
    category: "Energy",
    date: "2025-05-02",
    readTime: "15 min",
    summary: "The next leap in energy storage. Replacing liquid electrolytes for higher density and safety.",
    tags: ["Energy", "Batteries", "Materials"]
  },
  {
    id: "REP-062",
    title: "Precision Agriculture",
    category: "AgriTech",
    date: "2025-05-10",
    readTime: "13 min",
    summary: "Data-driven farming. Using drones, satellite imagery, and soil sensors to optimize yield and reduce waste.",
    tags: ["AgriTech", "Data", "IoT"]
  },
  {
    id: "REP-063",
    title: "CRISPR-Cas9 Fundamentals",
    category: "Biotech",
    date: "2025-05-18",
    readTime: "18 min",
    summary: "Gene editing explained. The mechanism of guided RNA and its potential for curing genetic diseases.",
    tags: ["Biotech", "Genetics", "Science"]
  },
  {
    id: "REP-064",
    title: "Industrial Digital Twins",
    category: "Industry 4.0",
    date: "2025-05-26",
    readTime: "16 min",
    summary: "Simulating physical assets. Using real-time data to create virtual replicas of factories for predictive maintenance.",
    tags: ["Digital Twin", "Simulation", "Industry"]
  },
  {
    id: "REP-065",
    title: "Carbon Capture Tech",
    category: "Clean Tech",
    date: "2025-06-03",
    readTime: "15 min",
    summary: "Direct Air Capture (DAC) and mineralization. Engineering solutions to remove CO2 from the atmosphere.",
    tags: ["Climate", "Engineering", "Sustainability"]
  },
  {
    id: "REP-066",
    title: "Haptic Feedback Systems",
    category: "Hardware",
    date: "2025-06-11",
    readTime: "12 min",
    summary: "Simulating touch. Linear resonant actuators and piezoelectric drivers for immersive VR experiences.",
    tags: ["Haptics", "VR", "Hardware"]
  },
  {
    id: "REP-067",
    title: "Lab-Grown Meat",
    category: "Food Tech",
    date: "2025-06-19",
    readTime: "14 min",
    summary: "Cultured protein. The bioreactor processes required to grow meat from animal cells without slaughter.",
    tags: ["Food Tech", "Biotech", "Sustainability"]
  },
  {
    id: "REP-068",
    title: "Fusion Energy Progress",
    category: "Energy",
    date: "2025-06-27",
    readTime: "19 min",
    summary: "Tokamaks vs. Stellarators. Assessing recent breakthroughs in net energy gain from nuclear fusion.",
    tags: ["Fusion", "Energy", "Physics"]
  },
  {
    id: "REP-069",
    title: "Generative Design",
    category: "Engineering",
    date: "2025-07-05",
    readTime: "13 min",
    summary: "AI-driven CAD. Algorithms that explore thousands of design permutations to optimize weight and strength.",
    tags: ["Design", "AI", "Manufacturing"]
  },
  {
    id: "REP-070",
    title: "Brain-Computer Interfaces",
    category: "Neurotech",
    date: "2025-07-13",
    readTime: "17 min",
    summary: "Linking mind and machine. Neuralink and non-invasive EEG methods for controlling devices with thought.",
    tags: ["BCI", "Neurotech", "Hardware"]
  },
  {
    id: "REP-071",
    title: "Robotic Process Automation",
    category: "Automation",
    date: "2025-07-21",
    readTime: "12 min",
    summary: "Automating repetitive business tasks. Screen scraping and workflow orchestration in legacy enterprise systems.",
    tags: ["RPA", "Automation", "Business"]
  },
  {
    id: "REP-072",
    title: "Hydrology & AI",
    category: "Environment",
    date: "2025-07-29",
    readTime: "15 min",
    summary: "Predicting floods and droughts. Using machine learning to model complex water systems and weather patterns.",
    tags: ["AI", "Climate", "Data"]
  },
  {
    id: "REP-073",
    title: "Smart Cities Infrastructure",
    category: "Urban Tech",
    date: "2025-08-06",
    readTime: "16 min",
    summary: "Connected urban environments. Intelligent traffic management and waste disposal systems using IoT.",
    tags: ["Smart City", "IoT", "Infrastructure"]
  },
  {
    id: "REP-074",
    title: "3D Printing in Construction",
    category: "Construction",
    date: "2025-08-14",
    readTime: "14 min",
    summary: "Additive manufacturing for housing. Printing concrete structures to reduce cost and construction time.",
    tags: ["3D Printing", "Construction", "Automation"]
  },
  {
    id: "REP-075",
    title: "Quantum Key Distribution",
    category: "Quantum",
    date: "2025-08-22",
    readTime: "18 min",
    summary: "Unbreakable encryption. Using quantum mechanics to exchange cryptographic keys securely.",
    tags: ["Quantum", "Security", "Crypto"]
  },
  {
    id: "REP-076",
    title: "Nanotechnology in Medicine",
    category: "MedTech",
    date: "2025-08-30",
    readTime: "16 min",
    summary: "Targeted drug delivery. Using nanoparticles to deliver medication directly to cancer cells.",
    tags: ["Nanotech", "Medicine", "Science"]
  },
  {
    id: "REP-077",
    title: "Algorithmic Trading",
    category: "Finance",
    date: "2025-09-07",
    readTime: "15 min",
    summary: "High-frequency trading strategies. Statistical arbitrage and execution algorithms in modern markets.",
    tags: ["Finance", "Algorithms", "Trading"]
  },
  {
    id: "REP-078",
    title: "Dark Matter Research",
    category: "Physics",
    date: "2025-09-15",
    readTime: "20 min",
    summary: "The search for the invisible. Detection methods and theoretical candidates for the universe's missing mass.",
    tags: ["Physics", "Space", "Research"]
  },
  {
    id: "REP-079",
    title: "Biometrics & Privacy",
    category: "Security",
    date: "2025-09-23",
    readTime: "13 min",
    summary: "The risks of biological auth. Cancelable biometrics and storing facial data securely.",
    tags: ["Security", "Biometrics", "Privacy"]
  },

  // --- BATCH 5: RECENT DEEP TECH & FUTURE (080-100) ---
  {
    id: "REP-080",
    title: "Deep Tech Capital: The VC Map",
    category: "Venture Capital",
    date: "2025-11-12",
    readTime: "16 min",
    summary: "Mapping the Indian investment landscape for hardware and AI startups. Profiles 'pi Ventures' and 'Speciale Invest' as critical partners for IP-heavy ventures, distinguishing them from consumer-tech focused funds.",
    tags: ["VC", "Fundraising", "Deep Tech", "Startups"]
  },
  {
    id: "REP-081",
    title: "FPGA Acceleration for Inference",
    category: "Hardware Acceleration",
    date: "2025-11-14",
    readTime: "18 min",
    summary: "Technical analysis of using Xilinx FPGAs for low-latency AI inference at the edge. Comparing High-Level Synthesis (HLS) workflows against traditional Verilog for implementing custom CNN accelerators.",
    tags: ["FPGA", "Verilog", "Edge AI", "Xilinx"]
  },
  {
    id: "REP-082",
    title: "Federated Learning Architectures",
    category: "Privacy AI",
    date: "2025-11-16",
    readTime: "15 min",
    summary: "Architectural blueprint for privacy-preserving model training across distributed edge devices. Evaluates the 'Flower' framework for implementing federated averaging without moving raw user data to the cloud.",
    tags: ["Federated Learning", "Privacy", "Distributed Systems"]
  },
  {
    id: "REP-083",
    title: "ROS2 & Real-Time Control",
    category: "Robotics",
    date: "2025-11-18",
    readTime: "14 min",
    summary: "Transitioning from ROS1 to ROS2 for industrial robotics. Deep dive into DDS (Data Distribution Service) middleware tuning for deterministic communication in safety-critical manipulation tasks.",
    tags: ["ROS2", "Robotics", "Real-Time", "DDS"]
  },
  {
    id: "REP-084",
    title: "The Augmented Second Brain",
    category: "Knowledge Mgmt",
    date: "2025-11-20",
    readTime: "12 min",
    summary: "Designing a local-first knowledge graph using Obsidian and local LLMs. Implementation of semantic search pipelines to auto-link disparate notes, transforming a passive archive into an active idea generator.",
    tags: ["Obsidian", "Local AI", "PKM", "Semantic Search"]
  },
  {
    id: "REP-085",
    title: "Zero Trust Home Lab",
    category: "Network Sec",
    date: "2025-11-22",
    readTime: "16 min",
    summary: "Implementing enterprise-grade security for a home server rack. Utilizing Tailscale for mesh networking, mTLS for service-to-service authentication, and granular ACLs to isolate IoT devices from dev infrastructure.",
    tags: ["Zero Trust", "Homelab", "Networking", "Security"]
  },
  {
    id: "REP-086",
    title: "MEV Bot Architecture",
    category: "Blockchain",
    date: "2025-11-24",
    readTime: "19 min",
    summary: "Technical deconstruction of Maximal Extractable Value (MEV) bots on Ethereum. Analyzing mempool monitoring patterns, flashbots bundles, and the use of Rust for millisecond-latency execution in competitive on-chain markets.",
    tags: ["MEV", "Blockchain", "Rust", "DeFi"]
  },
  {
    id: "REP-087",
    title: "Satellite Signal Forensics",
    category: "Signal Processing",
    date: "2025-11-26",
    readTime: "14 min",
    summary: "Using Software Defined Radio (SDR) to intercept and decode NOAA weather satellite imagery. Detailed guide on antenna construction (V-Dipole) and signal processing pipelines using GNU Radio.",
    tags: ["SDR", "Radio", "Satellites", "DSP"]
  },
  {
    id: "REP-088",
    title: "BMS Algorithms for EVs",
    category: "Automotive Tech",
    date: "2025-11-28",
    readTime: "17 min",
    summary: "Mathematical modeling of Battery Management Systems. Implementation of Extended Kalman Filters (EKF) for accurate State of Charge (SoC) and State of Health (SoH) estimation in Lithium-Ion packs.",
    tags: ["EV", "BMS", "Control Theory", "Batteries"]
  },
  {
    id: "REP-089",
    title: "The Staff Engineer Archetype",
    category: "Career Strategy",
    date: "2025-11-30",
    readTime: "15 min",
    summary: "Analyzing the transition from Senior to Staff Engineer. Moving beyond code contribution to 'Glue Work', technical sponsorship, and cross-team architectural leverage. How to build 'Technical Capital' effectively.",
    tags: ["Career Growth", "Staff Engineer", "Leadership", "Soft Skills"]
  },
  {
    id: "REP-090",
    title: "Space-Based Cloud Infrastructure",
    category: "Aerospace Tech",
    date: "2025-12-02",
    readTime: "20 min",
    summary: "Evaluating the feasibility of server-grade computing in Low Earth Orbit (LEO). Analysis of radiation hardening strategies for commercial FPGAs and the latency benefits of orbital edge computing for global defense networks.",
    tags: ["Space Tech", "LEO", "Edge Computing", "Radiation Hardening"]
  },
  {
    id: "REP-091",
    title: "Bioinformatics Data Pipelines",
    category: "Biotech",
    date: "2025-12-04",
    readTime: "16 min",
    summary: "Architecting scalable pipelines for CRISPR off-target analysis. Utilizing Nextflow and AWS Batch to parallelize genomic sequencing workloads, reducing processing time from weeks to hours.",
    tags: ["Bioinformatics", "Genomics", "Cloud Architecture", "Nextflow"]
  },
  {
    id: "REP-092",
    title: "Post-Quantum Migration",
    category: "Cryptography",
    date: "2025-12-06",
    readTime: "18 min",
    summary: "Strategic roadmap for transitioning enterprise PKI to quantum-resistant algorithms (Kyber/Dilithium). Assessing the performance impact of larger key sizes on TLS handshakes in constrained IoT environments.",
    tags: ["Quantum Computing", "Cryptography", "Security", "PQC"]
  },
  {
    id: "REP-093",
    title: "Virtual Power Plants (VPP)",
    category: "Clean Tech",
    date: "2025-12-08",
    readTime: "15 min",
    summary: "Software architecture for aggregating Distributed Energy Resources (DERs). Implementing IEEE 2030.5 protocols to coordinate thousands of residential battery packs for grid frequency regulation.",
    tags: ["Energy", "Smart Grid", "IoT", "Sustainability"]
  },
  {
    id: "REP-094",
    title: "Industrial OT/IT Convergence",
    category: "Industrial IoT",
    date: "2025-12-10",
    readTime: "17 min",
    summary: "Securing the bridge between Operational Technology (SCADA/PLC) and Information Technology. Implementing unidirectional gateways and Purdue Model zoning to prevent ransomware lateral movement in manufacturing plants.",
    tags: ["IIoT", "Cybersecurity", "SCADA", "Manufacturing"]
  },
  {
    id: "REP-095",
    title: "Spatial UI Patterns",
    category: "AR/VR",
    date: "2025-12-12",
    readTime: "14 min",
    summary: "Deconstructing interaction models for pass-through AR. Analyzing the 'gaze-and-pinch' paradigm versus hand-tracking, and the technical challenges of occlusion rendering in real-time Unity environments.",
    tags: ["Spatial Computing", "UX Design", "Unity", "AR"]
  },
  {
    id: "REP-096",
    title: "Algorithmic Governance",
    category: "Web3 Governance",
    date: "2025-12-14",
    readTime: "16 min",
    summary: "Critique of 'Code is Law' in DAO structures. Proposing hybrid governance models that utilize Optimistic Oracle patterns to resolve subjective disputes while maintaining on-chain execution guarantees.",
    tags: ["DAO", "Governance", "Smart Contracts", "Legal Tech"]
  },
  {
    id: "REP-097",
    title: "Autonomous Supply Chain",
    category: "Logistics",
    date: "2025-12-16",
    readTime: "15 min",
    summary: "The role of reinforcement learning in multi-agent warehouse orchestration. optimizing pathfinding for AGVs (Automated Guided Vehicles) to maximize throughput and minimize deadlock in high-density fulfillment centers.",
    tags: ["Logistics", "Robotics", "Reinforcement Learning", "Supply Chain"]
  },
  {
    id: "REP-098",
    title: "Neuromorphic Computing",
    category: "Emerging Tech",
    date: "2025-12-18",
    readTime: "19 min",
    summary: "Moving beyond Von Neumann architectures. Exploring Spiking Neural Networks (SNNs) on Intel Loihi chips for ultra-low-power event-based vision processing in autonomous drones.",
    tags: ["Neuromorphic", "Hardware", "AI", "Edge Computing"]
  },
  {
    id: "REP-099",
    title: "The Convergence Thesis",
    category: "Future Synthesis",
    date: "2025-12-20",
    readTime: "25 min",
    summary: "The Final Report. Synthesizing the convergence of unbounded compute, infinite energy (fusion/solar), and embodied AI. Predicting the collapse of traditional SaaS margins and the rise of the 'Sovereign Individual' tech stack.",
    tags: ["Futurism", "Strategy", "Macro", "Singularity"]
  },
  {
    id: "REP-100",
    title: "End of File",
    category: "System",
    date: "2025-12-31",
    readTime: "1 min",
    summary: "Archive integrity check complete. All 100 artifacts successfully indexed.",
    tags: ["System", "Log"]
  }
];