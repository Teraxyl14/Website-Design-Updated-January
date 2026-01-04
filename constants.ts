import { Project, SkillCategory } from './types';

export const SOCIALS = {
  email: "contact@maruttewari.com",
  linkedin: "https://www.linkedin.com/in/marut-tewari-010b06221/",
  github: "https://github.com/Teraxyl14",
  youtube: "https://www.youtube.com/@maruttewari"
};

export const PROJECTS: Project[] = [
  {
    id: "vid-agent",
    title: "AI Video Repurposing Agent",
    description: "A fully automated agent that takes long-form videos and intelligently creates 3-4 engaging YouTube Shorts with dynamic, animated captions and keyword highlighting.",
    tech: ["Gemini 2.5 Pro", "Remotion", "Python"],
    image: "https://placehold.co/600x400/1f2937/58a6ff?text=AI+Video+Shorts+Generator",
    link: "https://github.com/Teraxyl14"
  },
  {
    id: "cognisys",
    title: "CogniSys: An Intent-Driven OS",
    description: "Building a new OS from the ground up where you state a goal in plain English, and a built-in AI assistant figures out the steps and executes them using secure software components.",
    tech: ["seL4", "C/C++", "System AI"],
    image: "https://placehold.co/600x400/1f2937/bc8cff?text=CogniSys+OS",
    link: "https://github.com/Teraxyl14"
  },
  {
    id: "idea-pipeline",
    title: "Automated Project Idea Pipeline",
    description: "An AI system that scans online sources for real-world problems, analyzes them, and transforms them into structured, actionable software project ideas automatically.",
    tech: ["Google Cloud", "Firestore", "Gemini API"],
    image: "https://placehold.co/600x400/1f2937/238636?text=AI+Project+Pipeline",
    link: "https://github.com/Teraxyl14"
  },
  {
    id: "lidar-gan",
    title: "LiDAR to Realistic Image AI",
    description: "Teaching an AI to 'imagine' and generate realistic, full-color images of the world using only the 3D geometric data from a LiDAR sensor, leveraging Generative Adversarial Networks (GANs).",
    tech: ["PyTorch", "GANs", "CUDA"],
    image: "https://placehold.co/600x400/1f2937/d29922?text=LiDAR+to+RGB",
    link: "https://github.com/Teraxyl14"
  },
  {
    id: "jit-xarm",
    title: "JIT-XARM: x86 on ARM Translator",
    description: "A proof-of-concept compatibility layer that uses Just-In-Time (JIT) compilation to translate x86-64 command-line programs to run on modern ARM64 devices.",
    tech: ["C/C++", "Assembly", "JIT"],
    image: "https://placehold.co/600x400/1f2937/da3633?text=JIT+Compilation",
    link: "https://github.com/Teraxyl14"
  },
  {
    id: "book-digit",
    title: "Book Digitization Workflow Research",
    description: "Researching and identifying the most efficient workflow for digitizing a physical book collection by testing and comparing various data logging methods for speed and accuracy.",
    tech: ["Gemini Advanced", "OCR", "CSV"],
    image: "https://placehold.co/600x400/1f2937/1f6feb?text=Digital+Library",
    link: "https://github.com/Teraxyl14"
  }
];

export const SKILLS: SkillCategory[] = [
  {
    title: "AI & Cloud",
    icon: "Cloud",
    description: "My core expertise lies in orchestrating large language models and cloud infrastructure. I don't just call APIs; I architect scalable systems on Google Cloud that leverage the latest in generative AI (Gemini, Phi-3) to solve complex business logic.",
    items: [
      { label: "AI Models", value: "Gemini 2.5 Pro, Microsoft Phi-3" },
      { label: "Frameworks", value: "PyTorch, TensorFlow" },
      { label: "Cloud", value: "Google Cloud (Functions, Scheduler)" },
      { label: "Database", value: "Firestore (NoSQL)" }
    ]
  },
  {
    title: "Backend & Automation",
    icon: "Bot",
    description: "I build the engines that power products. Using Python as my primary weapon, I write robust automation scripts, handle complex data ingestion pipelines, and perform advanced computer vision tasks with OpenCV.",
    items: [
      { label: "Primary Lang", value: "Python" },
      { label: "Libraries", value: "google-genai, NumPy, OpenCV" },
      { label: "Data", value: "Web Scraping, Ingestion" },
      { label: "Automation", value: "Scripting, Analysis" }
    ]
  },
  {
    title: "Low-Level Systems",
    icon: "Cpu",
    description: "Beyond web apps, I understand the metal. My background in systems programming (C/C++, Assembly) and microkernels (seL4) allows me to optimize performance-critical paths and understand security at the deepest level.",
    items: [
      { label: "Languages", value: "C, C++, Assembly" },
      { label: "Concepts", value: "JIT, DBT, Kernels" },
      { label: "OS Kernel", value: "seL4 Microkernel" },
      { label: "Build Tools", value: "CMake, Ninja, GCC" }
    ]
  },
  {
    title: "Video & Frontend",
    icon: "Clapperboard",
    description: "I bridge the gap between creative expression and code. I use Remotion to programmatically generate video content and React to build fluid, interactive interfaces that feel alive.",
    items: [
      { label: "Generation", value: "Remotion" },
      { label: "Environment", value: "Node.js, TypeScript" },
      { label: "UI", value: "React" },
      { label: "Utility", value: "FFmpeg" }
    ]
  },
  {
    title: "Data & Research",
    icon: "Database",
    description: "Data is the raw material of intelligence. I specialize in processing unstructured data—whether it's log files, images, or LiDAR point clouds—converting noise into structured, actionable datasets.",
    items: [
      { label: "Logging", value: "CSV, Sheets" },
      { label: "Processing", value: "OCR, Multimodal" },
      { label: "Tools", value: "nuscenes-devkit" },
      { label: "Hardware", value: "CUDA, NVIDIA GPU" }
    ]
  },
  {
    title: "Dev Tools",
    icon: "Terminal",
    description: "A professional workflow is non-negotiable. I rely on a hardened toolchain including Git, Docker, and Linux to ensure reproducibility, stability, and speed in every project I ship.",
    items: [
      { label: "Version Control", value: "Git & GitHub" },
      { label: "Container", value: "Docker" },
      { label: "OS", value: "Linux" },
      { label: "Debug", value: "GDB, perf" }
    ]
  }
];