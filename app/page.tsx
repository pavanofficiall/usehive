import type { CSSProperties } from "react";
import MagicRings from "@/components/MagicRings";
import ScrambleText from "@/components/ScrambleText";
import { DesignPartnerDialog, FounderConversation } from "./hive-interactions";
import { HiveMark, SiteFooter } from "./hive-brand";
import { ProtocolStatement, SiteNav } from "./site-chrome";

const humanStack = ["HTML", "Navigation", "Buttons", "Forms", "DOM", "JavaScript"];
const agentContent = ["Products", "Pricing", "Docs", "FAQs"];
const agentActions = ["search_products()", "book_appointment()", "add_to_cart()", "place_order()"];
const humanInterface = ["Navigation", "Buttons", "Forms", "Images", "JavaScript", "DOM", "UI"];
const machineInterface = ["/content/products", "/content/docs", "search_products", "book_appointment", "place_order"];
const syncChanges = ["New product", "Pricing update", "Documentation", "New capability"];
const intelligenceLayers = [
  { name: "Scan", copy: "Discover content, structure and interactions." },
  { name: "Understand", copy: "Turn information into concepts and capabilities." },
  { name: "Interface", copy: "Expose structured content and actions to agents." },
  { name: "Sync", copy: "Keep the agent layer current as the website evolves." },
];
const webEras = [
  { label: "WEB 1", title: "Pages", behavior: "Humans read" },
  { label: "WEB 2", title: "Applications", behavior: "Humans click" },
  { label: "AGENTIC WEB", title: "Interfaces", behavior: "AI reads + acts" },
];
const marketForces = [
  { index: "01", title: "Answers → actions", copy: "Agents are increasingly searching, purchasing, booking and operating software." },
  { index: "02", title: "Protocols are emerging", copy: "MCP and WebMCP are creating structured ways for agents and applications to communicate." },
  { index: "03", title: "The web is still human-first", copy: "Most websites still expose visual interfaces instead of machine-facing ones." },
];

export default function Home() {
  return (
    <main>
      <SiteNav />

      <section className="hero hero--focused section-grid" id="top">
        <div className="hero-rings" aria-hidden="true">
          <MagicRings
            color="#B8F451"
            colorTwo="#678B33"
            ringCount={4}
            speed={1.15}
            attenuation={14.5}
            lineThickness={2}
            baseRadius={0.22}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={0.58}
            noiseAmount={0}
            ringGap={1.9}
            fadeIn={0.85}
            fadeOut={1.05}
          />
        </div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="section-shell hero-shell">
          <div className="eyebrow hero-eyebrow">
            <span className="signal-dot" /> Infrastructure for the agentic web
          </div>
          <h1 aria-label="The web was built for humans. Now make it work for agents.">
            <ScrambleText
              text="The web was built for humans."
              className="hero-title-line hero-title-line--primary"
              duration={920}
            />
            <ScrambleText
              text="Now make it work for agents."
              className="hero-title-line hero-title-line--secondary"
              delay={180}
              duration={980}
            />
          </h1>
          <p className="hero-copy">
            Hive adds a structured interface to existing websites so AI agents can understand
            what a business knows and safely use what it can do.
          </p>
          <div className="hero-actions">
            <a className="button" href="/developers">Explore for Developers →</a>
            <FounderConversation className="outline-button" />
          </div>

          <div className="hero-demo-wrap">
            <div className="video-card video-card--film" id="product-demo">
              <video
                className="hive-demo-video"
                controls
                playsInline
                preload="metadata"
                poster="/og.png"
                aria-label="Hive product demo"
              >
                <source src="/videos/hive-opening.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="overview section-grid" id="product" aria-labelledby="overview-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">01 / WHAT HIVE DOES</span>
            <div className="section-copy-block">
              <h2 id="overview-title"><ScrambleText text="One website. A second interface for agents." /></h2>
              <p>Hive sits on top of the existing website. The human experience stays intact while agents get structured content and callable actions.</p>
            </div>
          </div>

          <div className="transform-stage reveal" aria-label="Human website transformed by Hive into an agent-ready interface">
            <div className="stage-label stage-label--left"><span className="status-light status-light--muted" /> Human website</div>
            <div className="stage-label stage-label--right"><span className="status-light" /> Agent-ready interface</div>
            <div className="human-window">
              <div className="window-bar">
                <div className="window-dots"><i /><i /><i /></div>
                <div className="address-bar">yourcompany.com</div>
              </div>
              <div className="human-ui">
                <div className="mini-nav"><b>ACME</b><span /><span /><span /></div>
                <div className="mini-hero"><span /><strong /></div>
                <div className="mini-cards"><span /><span /><span /></div>
                <div className="code-noise" aria-hidden="true">
                  {humanStack.map((item, index) => <span key={item} style={{ "--i": index } as CSSProperties}>{item}</span>)}
                </div>
              </div>
            </div>
            <div className="flow-track" aria-hidden="true"><span /><span /><span /></div>
            <div className="hive-core">
              <div className="core-orbit" aria-hidden="true"><i /><i /><i /></div>
              <HiveMark /><strong>HIVE</strong><span>Understand · Structure · Sync</span>
            </div>
            <div className="flow-track" aria-hidden="true"><span /><span /><span /></div>
            <div className="agent-interface">
              <div className="interface-head"><span>hive://yourcompany</span><i>LIVE</i></div>
              <div className="interface-columns">
                <div><small>CONTENT</small>{agentContent.map((item) => <span key={item}>{item}</span>)}</div>
                <div><small>ACTIONS</small>{agentActions.map((item) => <code key={item}>{item}</code>)}</div>
              </div>
            </div>
          </div>

          <div className="overview-pillars reveal">
            <article><span>01</span><strong>Agent Content</strong><p>What the website knows, exposed as clean structured information.</p></article>
            <article><span>02</span><strong>Agent Actions</strong><p>What the website can do, exposed as approved callable capabilities.</p></article>
            <article><span>03</span><strong>Continuous Sync</strong><p>One source of truth as the human website continues to change.</p></article>
          </div>
        </div>
      </section>

      <section className="how section-grid" id="how-it-works" aria-labelledby="how-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">02 / HOW IT WORKS</span>
            <h2 id="how-title"><ScrambleText text="Make an existing website agent-ready." /></h2>
          </div>
          <div className="setup-flow reveal">
            <article className="setup-step setup-step--url">
              <span className="step-number">01</span><h3>Connect the website</h3>
              <p>Start from the product your users already know.</p>
              <div className="url-field"><span>https://yourcompany.com</span><i>↗</i></div>
            </article>
            <div className="setup-connector" aria-hidden="true"><i /></div>
            <article className="setup-step">
              <span className="step-number">02</span><h3>Hive understands it</h3>
              <p>Content, structure and useful interactions are mapped.</p>
              <div className="verification"><i>✓</i><span>Website understood</span></div>
            </article>
            <div className="setup-connector" aria-hidden="true"><i /></div>
            <article className="setup-step setup-step--scan">
              <span className="step-number">03</span><h3>Publish the agent layer</h3>
              <p>Structured content and approved actions become available.</p>
              <div className="scan-lines" aria-hidden="true"><i /><i /><i /><i /></div>
            </article>
          </div>
          <div className="ready-output reveal">
            <div className="ready-pulse" aria-hidden="true"><i /><i /><i /></div>
            <HiveMark compact />
            <div><span>OUTPUT</span><strong>Human website + agent interface</strong></div>
            <p>No separate product experience.</p>
          </div>
        </div>
      </section>

      <section className="developers developers--summary section-grid" id="developers" aria-labelledby="developers-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">FOR DEVELOPERS</span>
            <div className="section-copy-block">
              <h2 id="developers-title"><ScrambleText text="Make every website you build ready for agents." /></h2>
              <p>Hive creates and maintains an agent-facing layer without forcing teams to rebuild the human product.</p>
            </div>
          </div>
          <div className="developer-benefits reveal">
            <article className="developer-benefit developer-benefit--content">
              <div><span>AGENT CONTENT</span><i>WHAT IT UNDERSTANDS</i></div>
              <h3>Products, pricing, documentation, FAQs and policies.</h3>
              <p>Structured information agents can discover and consume.</p>
            </article>
            <article className="developer-benefit developer-benefit--actions">
              <div><span>AGENT ACTIONS</span><i>WHAT IT CAN DO</i></div>
              <h3>Search, submit, book, add to cart and place orders.</h3>
              <p>Approved capabilities agents can call directly.</p>
            </article>
          </div>
          <div className="developer-actions reveal">
            <a className="button" href="/developers">Explore the Developer Page →</a>
            <DesignPartnerDialog />
          </div>
        </div>
      </section>

      <section className="webs section-grid" aria-labelledby="webs-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">03 / TWO INTERFACES</span>
            <h2 id="webs-title"><ScrambleText text="One business. Built for two kinds of users." /></h2>
          </div>
          <div className="webs-stage reveal">
            <article className="web-panel web-panel--human">
              <div className="web-panel-head"><span>HUMAN</span><i>BUILT FOR PEOPLE</i></div>
              <strong>yourcompany.com</strong>
              <div className="human-chips">{humanInterface.map((item) => <span key={item}>{item}</span>)}</div>
              <div className="cursor-mark" aria-hidden="true">↖</div>
            </article>
            <div className="webs-bridge"><i aria-hidden="true" /><HiveMark /><span>HIVE</span><i aria-hidden="true" /></div>
            <article className="web-panel web-panel--agent">
              <div className="web-panel-head"><span>AGENT</span><i>BUILT FOR MACHINES</i></div>
              <strong>agent.yourcompany.com</strong>
              <div className="machine-rows">{machineInterface.map((item, index) => <code key={item}><span>{index < 2 ? "GET" : "CALL"}</span>{item}</code>)}</div>
            </article>
          </div>
          <p className="same-business reveal">Same business. <strong>Two interfaces.</strong></p>
        </div>
      </section>

      <section className="sync section-grid" aria-labelledby="sync-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">04 / ALWAYS IN SYNC</span>
            <h2 id="sync-title"><ScrambleText text="Your website changes. Hive changes with it." /></h2>
          </div>
          <div className="sync-system reveal" aria-label="Hive detects website updates and synchronizes the agent layer">
            <article className="sync-source">
              <div className="sync-head"><span>HUMAN WEBSITE</span><i>4 CHANGES</i></div>
              <div className="change-list">{syncChanges.map((change, index) => <div key={change}><i>+</i><span>{change}</span><small>{index + 1}m ago</small></div>)}</div>
            </article>
            <div className="sync-transfer" aria-hidden="true"><i /><i /><i /></div>
            <div className="sync-core"><div className="radar"><i /><i /><b /></div><HiveMark compact /><span>CHANGE DETECTED</span></div>
            <div className="sync-transfer sync-transfer--out" aria-hidden="true"><i /><i /><i /></div>
            <article className="sync-target">
              <div className="sync-head"><span>AGENT LAYER</span><i>SYNCED</i></div>
              <div className="sync-status"><span>Content</span><b>Current</b></div>
              <div className="sync-status"><span>Actions</span><b>Current</b></div>
              <div className="sync-time">Last sync <strong>just now</strong></div>
            </article>
          </div>
          <div className="sync-copy reveal"><p>Developers shouldn&apos;t maintain two versions of the web.</p><strong>Hive keeps the human and agent experiences aligned.</strong></div>
        </div>
      </section>

      <section className="under-hood section-grid" aria-labelledby="hood-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">05 / UNDER THE HOOD</span>
            <h2 id="hood-title"><ScrambleText text="An intelligence layer between your website and agents." /></h2>
          </div>
          <div className="intelligence-flow reveal">
            <div className="origin-node"><span>01</span><strong>Website</strong></div>
            {intelligenceLayers.map((layer, index) => (
              <article className={index === 1 ? "intelligence-node intelligence-node--active" : "intelligence-node"} key={layer.name}>
                <span>{String(index + 2).padStart(2, "0")}</span>
                <div className="node-icon" aria-hidden="true"><i /><i /><i /></div>
                <h3>{layer.name}</h3><p>{layer.copy}</p>
              </article>
            ))}
          </div>
          <p className="hood-note reveal">Hive sits on top of the existing application. <strong>No rebuild required.</strong></p>
        </div>
      </section>

      <section className="why-now section-grid" id="why-now" aria-labelledby="why-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">06 / WHY NOW</span>
            <h2 id="why-title"><ScrambleText text="The interface layer of the web is changing." /></h2>
          </div>
          <div className="web-timeline reveal" aria-label="Evolution from Web 1 to the agentic web">
            {webEras.map((era, index) => (
              <div className={index === 2 ? "era era--active" : "era"} key={era.label}>
                <div className="era-top"><span>{era.label}</span><i>{String(index + 1).padStart(2, "0")}</i></div>
                <div className="era-glyph" aria-hidden="true">
                  {index === 0 && <><span /><span /><span /></>}
                  {index === 1 && <><b /><b /><b /><b /></>}
                  {index === 2 && <><em>CONTENT</em><em>ACTIONS</em></>}
                </div>
                <h3>{era.title}</h3><p>{era.behavior}</p>
                {index < webEras.length - 1 && <div className="era-arrow" aria-hidden="true">→</div>}
              </div>
            ))}
          </div>
          <div className="force-grid reveal">{marketForces.map((force) => <article className="force-card" key={force.index}><span>{force.index}</span><h3>{force.title}</h3><p>{force.copy}</p></article>)}</div>
          <ProtocolStatement />
        </div>
      </section>

      <section className="vision section-grid" id="vision" aria-labelledby="vision-title">
        <div className="section-shell">
          <span className="section-number reveal">07 / THE BIGGER VISION</span>
          <h2 id="vision-title" className="reveal">
            <ScrambleText text="Every website will eventually have " />
            <em><ScrambleText text="two users." delay={120} /></em>
          </h2>
          <div className="vision-diagram reveal" aria-label="Applications serve humans through UI and agents through Hive">
            <div className="application-node"><span>APPLICATION</span><i>yourcompany.com</i></div>
            <div className="vision-lines" aria-hidden="true"><i /><i /></div>
            <div className="user-node user-node--human"><span className="user-avatar">H</span><div><small>USER 01</small><strong>Humans</strong><i>through UI</i></div></div>
            <div className="user-node user-node--agent"><HiveMark compact /><div><small>USER 02</small><strong>Agents</strong><i>through Hive</i></div></div>
          </div>
          <div className="vision-copy reveal">
            <p>Websites spent three decades optimizing interfaces for humans. The next generation of software will need interfaces designed for machines as well.</p>
            <strong>Hive wants to become the infrastructure connecting the existing web to AI agents.</strong>
          </div>
        </div>
      </section>

      <section className="audience-cta section-grid" aria-labelledby="next-title">
        <div className="section-shell">
          <div className="audience-cta__head reveal"><span className="eyebrow">Choose your path</span><h2 id="next-title"><ScrambleText text="Go deeper into Hive." /></h2></div>
          <div className="audience-grid reveal">
            <article>
              <span>FOR DEVELOPERS</span><h3>Build the agent-ready web.</h3>
              <p>Explore the technical model, agent content, actions, synchronization and early-access program.</p>
              <a className="button" href="/developers">Developer Page →</a>
            </article>
            <article>
              <span>FOR INVESTORS</span><h3>Explore the infrastructure thesis.</h3>
              <p>Understand the platform shift, the product layer and the long-term vision behind Hive.</p>
              <div className="audience-actions">
                <FounderConversation className="button" />
                <a className="outline-button" href="mailto:hello@usehive.tech?subject=Hive%20Pitch%20Deck">View Pitch Deck →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
