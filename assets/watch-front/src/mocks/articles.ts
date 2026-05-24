import type { Article } from "@/services/articles.service";

export type ArticleState = Article & { saved: boolean; tldr: string };

export const MOCK_ARTICLES: ArticleState[] = [
  {
    id: "1",
    title: "Why Go is Taking Over Backend Development",
    link: "#",
    published_date: "2026-05-20",
    liked: false,
    saved: false,
    content:
      "Go's simplicity, performance, and built-in concurrency primitives have made it the go-to language for cloud-native services. Companies like Google, Uber, and Cloudflare have bet big on it. The language's fast compile times, minimal runtime overhead, and straightforward deployment model make it ideal for microservices and serverless workloads. With a growing ecosystem and strong tooling, Go continues to gain ground in environments where performance and reliability are non-negotiable.",
    tldr: "Go dominates backend development thanks to its speed, simplicity, and native concurrency. Adopted by Google, Uber, and Cloudflare, it's the default choice for cloud-native and microservices work.",
  },
  {
    id: "2",
    title: "React 19: What's New and Why It Matters",
    link: "#",
    published_date: "2026-05-19",
    liked: true,
    saved: false,
    content:
      "React 19 ships with the Actions API, built-in form handling, and a new compiler that eliminates the need for useMemo and useCallback in most cases. The compiler performs static analysis to automatically memoize components, reducing re-renders without any manual intervention. Combined with the new use() hook and improved Suspense support, React 19 fundamentally changes how developers think about async state management on the client and server.",
    tldr: "React 19 introduces a compiler that auto-memoizes components, an Actions API for forms, and a new use() hook. Result: less boilerplate, better async patterns, no manual optimization.",
  },
  {
    id: "3",
    title: "The CSS Grid Layout Module Is Still Underused",
    link: "#",
    published_date: "2026-05-18",
    liked: false,
    saved: true,
    content:
      "Despite broad browser support for years, many developers still reach for flex when grid would be the better tool. Here's a visual guide to when and why to choose grid. Grid excels at two-dimensional layouts where both rows and columns need coordination. Flexbox shines for one-dimensional flows. Knowing which to use — and when to combine them — is one of the highest-leverage CSS skills a developer can build.",
    tldr: "Use CSS Grid for two-dimensional layouts, Flexbox for one-dimensional flows. Most devs default to Flex out of habit — Grid is often the better tool and remains widely underutilized.",
  },
  {
    id: "4",
    title: "SQLite in Production: A Practical Guide",
    link: "#",
    published_date: "2026-05-17",
    liked: false,
    saved: false,
    content:
      "SQLite is no longer just for prototypes. With WAL mode, proper indexing, and connection pooling, it can handle thousands of concurrent reads with sub-millisecond latency. Applications like Litestream add streaming replication, making disaster recovery straightforward. For read-heavy workloads on a single server, SQLite outperforms Postgres in benchmarks — and eliminates the operational complexity of a separate database process entirely.",
    tldr: "SQLite is production-ready. WAL mode + Litestream replication makes it viable for serious workloads. It beats Postgres on read-heavy single-server setups and removes database operational overhead entirely.",
  },
  {
    id: "5",
    title: "Tailwind CSS v4: The Big Rewrite",
    link: "#",
    published_date: "2026-05-16",
    liked: true,
    saved: true,
    content:
      "Tailwind v4 drops the config file in favor of CSS-first configuration, ships a native Rust engine, and brings a new theming system powered by CSS variables. The new engine is orders of magnitude faster than the previous JIT compiler. Arbitrary values, container queries, and the new @theme directive make Tailwind v4 the most expressive version of the framework yet — while keeping the utility-first philosophy intact.",
    tldr: "Tailwind v4 ditches the JS config for a CSS-first @theme system and ships a Rust engine that's dramatically faster. Same utility-first philosophy, much more expressive and performant.",
  },
  {
    id: "6",
    title: "Understanding HTTP/3 and QUIC",
    link: "#",
    published_date: "2026-05-15",
    liked: false,
    saved: false,
    content:
      "QUIC eliminates head-of-line blocking by multiplexing streams at the transport layer. HTTP/3 builds on it to deliver faster, more resilient connections especially on mobile networks. Unlike TCP, QUIC is implemented in user space, enabling faster iteration and deployment without kernel changes. Major CDNs and browsers have already shipped HTTP/3 support, making it the protocol of choice for latency-sensitive applications.",
    tldr: "HTTP/3 over QUIC fixes TCP's head-of-line blocking via user-space multiplexing. Faster on mobile, already live on major CDNs — the go-to protocol for latency-sensitive apps.",
  },
  {
    id: "7",
    title: "Design Systems at Scale: Lessons from the Trenches",
    link: "#",
    published_date: "2026-05-14",
    liked: false,
    saved: false,
    content:
      "Building a design system is easy. Maintaining one across 20 teams and 3 product lines is not. This post covers versioning, documentation, and the governance model that actually works. The hardest part isn't the components — it's the social infrastructure around them. Who owns breaking changes? How are contributions reviewed? How do you deprecate a component used in 80 places? These are organizational problems as much as technical ones.",
    tldr: "Design systems fail socially, not technically. The real challenge is ownership, contribution processes, and deprecation — all organizational problems that no component library solves on its own.",
  },
  {
    id: "8",
    title: "WebAssembly Beyond the Browser",
    link: "#",
    published_date: "2026-05-13",
    liked: false,
    saved: false,
    content:
      "WASM is increasingly used as a server-side sandbox for plugins and user-defined functions. Cloudflare Workers and Fastly Compute run WASM at the edge with cold-start times under 1ms. The WASI standard brings a portable system interface to WASM runtimes, enabling the same binary to run across cloud providers and operating systems. This positions WASM as a universal compilation target for languages beyond JavaScript.",
    tldr: "WebAssembly is moving server-side: Cloudflare and Fastly run it at the edge with sub-1ms cold starts. WASI makes WASM binaries portable across any OS or cloud — a universal compile target.",
  },
];
