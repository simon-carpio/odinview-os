# OdinView OS

**OdinView is a local-first, privacy-centric operating system for your digital life, designed to provide a persistent, learning AI context engine.**

We believe the path to truly useful AI agents, and ultimately AGI, is not just about bigger models, but about better **scaffolding**. OdinView is that scaffolding. It's an open-source effort to build a system that can understand the full context of a user's work and life, and use that context to reason, learn, and assist in ways no cloud-based application can.

## Our Vision: From AI Application to Ambient OS

Today's LLMs are incredibly powerful, but they are also stateless and forgetful. Every interaction starts from a blank slate.

OdinView solves this. It runs locally on your machine, building a comprehensive and private "Knowledge Core" of your digital world. It's an OS layer that sees what you see, reads what you read, and learns from your successes and failures to create an AI partner that grows with you.

## How It Works: The OdinView Method

Our architecture is a synthesis of cutting-edge research in AI reasoning and memory. We are not just wrapping an API; we are building a multi-stage cognitive architecture.

1.  **The Curator (Intelligent Ingestion):** When you add a file, folder, or URL, OdinView doesn't just index it. A background AI agent—**The Curator**—performs "sleep-time compute." It reads the *entire* document, analyzes its structure, generates a rich "index card" (summaries, topics, entities), and then intelligently chunks the content based on its semantic meaning.

2.  **The Librarian (The Knowledge Core):** All curated information is stored locally in a high-performance vector database. This is your personal, private, and permanent AI memory.

3.  **The Researcher (Hybrid Retrieval):** When you ask a question, the **Researcher** agent performs a hybrid tree search: first finding relevant documents via their summaries, then navigating the internal structure of those documents to pinpoint the most relevant information.

4.  **The Synthesizer (Reasoning & Refinement):** The retrieved context is handed to the **Synthesizer** agent, which uses an adaptive tree search to explore multiple reasoning paths, evaluate them, and construct a coherent, final response.

5.  **The Learning Loop (System-wide Improvement):** OdinView learns. By observing which outcomes are successful, the entire system refines its strategies, creating an AI that is uniquely optimized to you.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager

### Installation

1.  Install pnpm globally:
    `npm install -g pnpm`

2.  Clone the repository and install dependencies:
    ```bash
    git clone https://github.com/simon-carpio/odinview-os.git
    cd odinview-os
    pnpm install
    ```

3.  Start the development server:
    `pnpm dev`

## Project Structure

Our project uses a clean, decoupled architecture to separate concerns and ensure maintainability.

```
src/
├── core/           # Pure TypeScript logic (no Electron dependencies)
├── main/           # Electron main process
├── renderer/       # React UI code
├── preload/        # Preload script for secure IPC
└── shared/         # Code shared between processes (IPC contracts, types)
```

## Standing on the Shoulders of Giants

Our work is inspired by pioneering research from the AI community. We are deeply indebted to the following researchers:

-   **MemGPT** (Packer et al.) for the hierarchical memory system model.
-   **Sleep-time Compute** (Lin et al.) for the philosophy of intelligent background processing.
-   **Adaptive Branching Tree Search** (Inoue et al.) for the advanced reasoning patterns in our Synthesizer.
-   **GEPA & DrEureka** (Agrawal et al., Ma et al.) for the "reflective evolution" and reward-free learning concepts that power our system's ability to improve over time.

## Contributing

We welcome contributions! Please follow our development principles:
1.  **Test-Driven Development:** Write tests first, then implementation. All logic in `src/core/` must have test coverage.
2.  **Clean Architecture:** Maintain the strict separation between core logic, the main process, and the UI.
3.  **Formal IPC:** Use the formal contracts defined in `src/shared/` for all main-renderer communication.

## Troubleshooting

### On Windows, `pnpm test` may fail

**Symptom:** You may see an error like `'jest' is not recognized as an internal or external command`.

**Cause:** This is a known environmental issue with Electron development on Windows where a background process can sometimes lock files in the `node_modules` directory after running `pnpm dev`.

**Solution:**
1.  Close all terminal windows and your code editor (e.g., VS Code) to ensure all Electron processes are terminated.
2.  Run `pnpm install` again.
3.  Run `pnpm test`. The tests should now execute correctly.

## License

**MIT License**

Copyright (c) OdinView OS Development Team