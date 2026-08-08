"use client";

import { useEffect, useRef, useState } from "react";

const chapters = [
  "The promise",
  "Our founder",
  "Built by family",
  "The work",
  "Seven decades",
  "The legacy continues",
  "Leading with excellence",
  "A new chapter in India",
  "One year strong",
  "Milani today",
  "The road ahead",
];

type FlipApi = {
  flip: (page: number) => void;
  flipNext: () => void;
  flipPrev: () => void;
  destroy: () => void;
  on: (event: string, callback: (event: { data: number | string }) => void) => void;
};

export default function Home() {
  const bookNode = useRef<HTMLDivElement | null>(null);
  const flipApi = useRef<FlipApi | null>(null);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState(false);
  const audio = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);

  useEffect(() => {
    let disposed = false;
    let instance: FlipApi | null = null;

    const initialise = async () => {
      const { PageFlip } = await import("page-flip");
      if (disposed || !bookNode.current) return;

      instance = new PageFlip(bookNode.current, {
        width: 720,
        height: 900,
        size: "stretch",
        minWidth: 280,
        maxWidth: 720,
        minHeight: 350,
        maxHeight: 900,
        showCover: true,
        usePortrait: true,
        autoSize: true,
        drawShadow: true,
        maxShadowOpacity: 0.6,
        flippingTime: 950,
        mobileScrollSupport: true,
        clickEventForward: true,
        useMouseEvents: true,
        swipeDistance: 24,
        startPage: 0,
      }) as unknown as FlipApi;

      const pages = bookNode.current.querySelectorAll<HTMLElement>(".album-page");
      (instance as unknown as { loadFromHTML: (items: NodeListOf<HTMLElement>) => void }).loadFromHTML(pages);
      instance.on("flip", event => setPage(Number(event.data)));
      flipApi.current = instance;
      setReady(true);
    };

    initialise();
    return () => {
      disposed = true;
      if (instance) instance.destroy();
      flipApi.current = null;
    };
  }, []);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") flipApi.current?.flipNext();
      if (event.key === "ArrowLeft" || event.key === "PageUp") flipApi.current?.flipPrev();
    };
    addEventListener("keydown", keyboard);
    return () => removeEventListener("keydown", keyboard);
  }, []);

  const toggleSound = () => {
    if (!audio.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0.014;
      gain.connect(ctx.destination);
      const low = ctx.createOscillator();
      const high = ctx.createOscillator();
      low.type = "sine";
      high.type = "triangle";
      low.frequency.value = 44;
      high.frequency.value = 67;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 120;
      low.connect(filter);
      high.connect(filter);
      filter.connect(gain);
      low.start();
      high.start();
      audio.current = { ctx, gain };
      setSound(true);
      return;
    }
    const next = !sound;
    audio.current.gain.gain.setTargetAtTime(next ? 0.014 : 0, audio.current.ctx.currentTime, 0.18);
    setSound(next);
  };

  const openPage = (index: number) => flipApi.current?.flip(index);
  const pageLabel = String(page).padStart(2, "0");

  return <main className={`album-app ${ready ? "is-ready" : ""}`}>
    <header className="album-header">
      <div className="album-brand">MILANI<span>1956—2026</span></div>
      <p>THE MILANI BOOK <i>/</i> ANNIVERSARY ALBUM</p>
      <button className="album-sound" onClick={toggleSound} aria-pressed={sound}><span className={sound ? "playing" : ""}><i/><i/><i/><i/></span>{sound ? "SOUND ON" : "SOUND OFF"}</button>
    </header>

    <section className="album-studio" aria-label="Interactive Milani anniversary album">
      <div className="studio-light" aria-hidden="true"/>
      <div className="album-shadow" aria-hidden="true"/>
      <div className="flipbook" ref={bookNode}>
        <article className="album-page hard-page" data-density="hard">
          <div className="sheet cover-sheet">
            <div className="cover-grain"/>
            <div className="cover-top"><span>EST. VANCOUVER</span><b>1956</b><span>70TH ANNIVERSARY</span></div>
            <div className="cover-title"><p>THE MILANI BOOK <span>№ 70</span></p><h1>SEVENTY<br/>YEARS.</h1><h2>THOUSANDS OF HOMES.<br/><em>ONE FAMILY PROMISE.</em></h2></div>
            <button className="open-book" onClick={() => flipApi.current?.flipNext()}>OPEN THE BOOK <span>→</span></button>
            <div className="cover-m">M</div>
            <div className="cover-spine">BUILT ON FAMILY / DRIVEN BY PURPOSE</div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet founder-sheet">
            <PageMark page="01" label="OUR FOUNDER / 1956"/>
            <div className="founder-portrait"><img src="/demetrio.jpeg" alt="Demetrio Milani, founder of the Milani Group"/><span>THE CHIEF / FAMILY ARCHIVE</span></div>
            <div className="founder-copy"><p className="micro">A HUMBLE VISION</p><h2>A legacy begins<br/>with <em>integrity.</em></h2><p>Demetrio Milani built the Milani Group through hard work, professional excellence and a deep commitment to every family he served.</p><blockquote>“Built not only with tools,<br/>but with integrity.”</blockquote></div>
            <div className="archive-year">1956</div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet family-sheet">
            <PageMark page="02" label="BUILT BY FAMILY" light/>
            <div className="family-head"><p>THE NAME ABOVE THE DOOR</p><h2>Family was<br/>the system<br/><em>behind it.</em></h2></div>
            <div className="family-paper"><span>LINDA MILANI / FAMILY ARCHIVE</span><p>While Demetrio built the company in the field, Linda kept everything behind the scenes moving—helping turn a growing business into a lasting family legacy.</p><b>Bookkeeper · Secretary · Chauffeur<br/>Business partner · Mother · Family anchor</b><i>LM</i></div>
            <div className="family-outline">FAMILY</div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet craft-sheet">
            <PageMark page="03" label="THE WORK / STANDARD 001"/>
            <div className="craft-head"><p className="micro">THE REPUTATION</p><h2>One home<br/>at a time.</h2><p>Good service is quiet, exacting work. It lives in the details nobody notices—until they matter.</p></div>
            <div className="craft-board"><div className="measure"><i/><i/><i/><i/><i/></div><blockquote>Measure carefully.<br/>Solve honestly.<br/><em>Leave it better.</em></blockquote><div><span>CRAFT</span><b>01</b><span>CARE</span><b>02</b><span>TRUST</span><b>03</b></div></div>
            <div className="craft-word">CRAFT</div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet timeline-sheet">
            <PageMark page="04" label="THE RED LINE / SEVEN DECADES" light/>
            <div className="timeline-head"><p>EVERY YEAR</p><h2>Moved us<br/><em>forward.</em></h2></div>
            <div className="timeline-list">
              <Timeline year="1956" text="Demetrio founds the company"/>
              <Timeline year="1960s" text="The family joins the business"/>
              <Timeline year="1980s" text="Kingsway headquarters established"/>
              <Timeline year="1990s" text="Heating and HVAC services added"/>
              <Timeline year="2000s" text="The service network grows"/>
              <Timeline year="NOW" text="A multi-service family across Western Canada"/>
            </div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet legacy-sheet">
            <PageMark page="05" label="THE LEGACY CONTINUES"/>
            <div className="legacy-head"><p>FAMILY LEADERSHIP</p><h2>One vision.<br/><em>Four voices.</em></h2><span>The next generation carries the values forward.</span></div>
            <div className="family-portraits">
              <Portrait src="/demetrio.jpeg" name="Demetrio" role="FOUNDER"/>
              <Portrait src="/vern-milani.png" name="Vern" role="PRESIDENT"/>
              <Portrait src="/chris-milani.png" name="Chris" role="FAMILY LEADERSHIP"/>
              <Portrait src="/katrina-milani.png" name="Katrina" role="FAMILY LEADERSHIP"/>
            </div>
            <div className="generation-word">GENERATION</div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet leaders-sheet">
            <PageMark page="06" label="LEADING WITH EXCELLENCE" light/>
            <div className="leaders-head"><p>FAMILY VALUES</p><h2>Focused<br/><em>leadership.</em></h2></div>
            <div className="leader-pair">
              <Leader src="/vern-milani.png" index="01" name="Vern Milani" role="PRESIDENT" text="Guiding the company’s vision and strategic growth with the family-first values that started it all."/>
              <Leader src="/rajesh-khanna.png" index="02" name="Rajesh Khanna" role="GENERAL MANAGER" text="Ensuring operational excellence and seamless service delivery across every project."/>
            </div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet journey-sheet">
            <PageMark page="07" label="TEAM INDIA / 2025—2026"/>
            <div className="journey-head"><p>A NEW CHAPTER</p><h2>Built across<br/><em>oceans.</em></h2><span>Fifteen moments. One shared purpose. A first year worth remembering.</span></div>
            <figure className="journey-art"><img src="/india-journey.png" alt="Illustrated timeline of the Milani Electric India team journey"/><figcaption>OUR JOURNEY / 09.04.25—15.07.26</figcaption></figure>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet gratitude-sheet">
            <PageMark page="08" label="TEAM INDIA / ONE YEAR STRONG" light/>
            <div className="gratitude-image"><img src="/india-team.png" alt="Illustration of the Milani Electric India team celebrating"/></div>
            <div className="gratitude-copy"><p>WITH GRATITUDE</p><h2>Thank you<br/>for believing<br/><em>in us.</em></h2><blockquote>“Your leadership created opportunity. Your trust gave us room to grow.”</blockquote><span>— MILANI ELECTRIC &amp; SOLAR PVT. LTD.</span></div>
            <div className="gratitude-script">one year strong.</div>
          </div>
        </article>

        <article className="album-page">
          <div className="sheet today-sheet">
            <PageMark page="09" label="MILANI TODAY / SCALE WITH PURPOSE" light/>
            <img className="today-image" src="/milani-team.jpeg" alt="The Milani team gathered together"/>
            <div className="today-shade"/>
            <div className="today-copy"><p>THE PEOPLE BEHIND THE NAME</p><h2>Hundreds<br/>of people.<br/><em>One standard.</em></h2><div><b>70</b><span>YEARS OF TRUST</span><b>06</b><span>SERVICE DISCIPLINES</span><b>01</b><span>FAMILY PROMISE</span></div></div>
          </div>
        </article>

        <article className="album-page hard-page" data-density="hard">
          <div className="sheet closing-sheet">
            <PageMark page="10" label="THE ROAD AHEAD / 2026—" light/>
            <div className="closing-copy"><p>THE NEXT CHAPTER</p><h2>BUILT ON TRUST.<br/><em>READY FOR<br/>WHAT COMES NEXT.</em></h2><span>The story continues with every home, every team member and every family that places its trust in the Milani name.</span></div>
            <div className="closing-links"><a href="https://milani.ca/" target="_blank" rel="noreferrer">EXPLORE SERVICES <span>↗</span></a><a href="https://milani.ca/" target="_blank" rel="noreferrer">BOOK SERVICE <span>↗</span></a><a href="https://milani.ca/" target="_blank" rel="noreferrer">JOIN THE TEAM <span>↗</span></a></div>
            <div className="closing-m">M</div>
          </div>
        </article>
      </div>
    </section>

    <nav className="album-controls" aria-label="Book navigation">
      <button onClick={() => flipApi.current?.flipPrev()} disabled={page === 0} aria-label="Previous page"><span>←</span> PREVIOUS</button>
      <div className="chapter-readout" aria-live="polite"><span>{pageLabel} / 10</span><b>{chapters[page]}</b><div>{chapters.map((chapter, index) => <button key={chapter} className={index === page ? "active" : ""} onClick={() => openPage(index)} aria-label={`Open ${chapter}`}/>)}</div></div>
      <button onClick={() => flipApi.current?.flipNext()} disabled={page === chapters.length - 1} aria-label="Next page">NEXT <span>→</span></button>
    </nav>
    <p className="gesture-note">DRAG A CORNER · SWIPE · OR USE ARROW KEYS</p>
  </main>;
}

function PageMark({ page, label, light = false }: { page: string; label: string; light?: boolean }) {
  return <div className={`page-mark ${light ? "light" : ""}`}><b>{page}</b><span>/ 10</span><i>{label}</i></div>;
}

function Timeline({ year, text }: { year: string; text: string }) {
  return <div className="timeline-item"><b>{year}</b><i/><span>{text}</span></div>;
}

function Portrait({ src, name, role }: { src: string; name: string; role: string }) {
  return <figure><img src={src} alt={name}/><figcaption><b>{name}</b><span>{role}</span></figcaption></figure>;
}

function Leader({ src, index, name, role, text }: { src: string; index: string; name: string; role: string; text: string }) {
  return <article><img src={src} alt={name}/><div><span>{index} / {role}</span><h3>{name}</h3><p>{text}</p></div></article>;
}
