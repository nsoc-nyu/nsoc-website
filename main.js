const button = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("#mobileMenu");

button.addEventListener("click", () => {
	const isOpen = menu.classList.toggle("open");
	button.setAttribute("aria-expanded", String(isOpen));
});

menu.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		menu.classList.remove("open");
		button.setAttribute("aria-expanded", "false");
	});
});

const sectionLinks = Array.from(document.querySelectorAll("nav a[href*='#']"));
const sectionIds = new Set(
	sectionLinks
		.map((link) => new URL(link.href, window.location.href).hash.slice(1))
		.filter(Boolean)
);
const sections = Array.from(document.querySelectorAll("section[id]")).filter((section) =>
	sectionIds.has(section.id)
);

function setActiveSection(id) {
	sectionLinks.forEach((link) => {
		const hash = new URL(link.href, window.location.href).hash.slice(1);
		const isActive = hash === id;
		link.classList.toggle("active", isActive);
		if (isActive) link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	});
}

if (sections.length > 0) {
	setActiveSection(window.location.hash.slice(1) || sections[0].id);
	const activeObserver = new IntersectionObserver(
		(entries) => {
			const visible = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
			if (visible) setActiveSection(visible.target.id);
		},
		{
			rootMargin: "-45% 0px -45% 0px",
			threshold: [0, 0.1, 0.25, 0.5]
		}
	);
	sections.forEach((section) => activeObserver.observe(section));
}

document.querySelectorAll(".hero-stat-num").forEach((counter) => {
	const match = counter.textContent.trim().match(/^([\d.]+)(.*)$/);
	if (!match) return;

	const target = Number(match[1]);
	const suffix = match[2];
	const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
	const duration = 1200;
	const start = performance.now();

	function update(now) {
		const progress = Math.min((now - start) / duration, 1);
		const eased = 1 - Math.pow(1 - progress, 3);
		counter.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
		if (progress < 1) requestAnimationFrame(update);
	}

	counter.textContent = `${(0).toFixed(decimals)}${suffix}`;
	requestAnimationFrame(update);
});

const chainViz = document.querySelector(".chain-viz");

if (chainViz && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	const SVG_NS = "http://www.w3.org/2000/svg";
	const stages = Array.from(chainViz.querySelectorAll(".chain-stage"));
	const watchDots = Array.from(chainViz.querySelectorAll(".chain-watch-dot"));
	const edges = Array.from(chainViz.querySelectorAll(".chain-edge"));
	const nodes = stages.map((stage) => stage.querySelector(".chain-node"));
	const positions = nodes.map((n) => ({
		cx: parseFloat(n.getAttribute("cx")),
		cy: parseFloat(n.getAttribute("cy"))
	}));

	const STEP_MS = 700;
	const ACTIVE_HOLD_MS = 850;
	const LAUNCH_INTERVAL_MS = 1600;

	function activate(el, holdMs) {
		el.classList.add("active");
		setTimeout(() => el.classList.remove("active"), holdMs);
	}

	function createPacket() {
		const g = document.createElementNS(SVG_NS, "g");
		g.setAttribute("class", "chain-packet");
		const s = 7;
		const w = s * 0.866;
		const points = [
			[0, s],
			[w, s * 0.5],
			[w, -s * 0.5],
			[0, -s],
			[-w, -s * 0.5],
			[-w, s * 0.5]
		]
			.map((p) => p.join(","))
			.join(" ");
		const outline = document.createElementNS(SVG_NS, "polygon");
		outline.setAttribute("class", "chain-packet-shape");
		outline.setAttribute("points", points);
		g.appendChild(outline);
		const inner = document.createElementNS(SVG_NS, "path");
		inner.setAttribute("class", "chain-packet-edges");
		inner.setAttribute("d", `M0 ${s}L0 0 M${w} ${-s * 0.5}L0 0 M${-w} ${-s * 0.5}L0 0`);
		g.appendChild(inner);
		return g;
	}

	function setPos(packet, x, y) {
		packet.setAttribute("transform", `translate(${x} ${y})`);
	}

	function tween(packet, from, to, duration) {
		return new Promise((resolve) => {
			const start = performance.now();
			function frame(now) {
				const t = Math.min(1, (now - start) / duration);
				const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
				setPos(packet, from.cx + (to.cx - from.cx) * e, from.cy + (to.cy - from.cy) * e);
				if (t < 1) requestAnimationFrame(frame);
				else resolve();
			}
			requestAnimationFrame(frame);
		});
	}

	async function launchPacket() {
		const packet = createPacket();
		setPos(packet, positions[0].cx, positions[0].cy);
		chainViz.appendChild(packet);

		activate(stages[0], ACTIVE_HOLD_MS);
		activate(watchDots[0], ACTIVE_HOLD_MS);

		for (let i = 0; i < edges.length; i++) {
			edges[i].classList.add("active");
			await tween(packet, positions[i], positions[i + 1], STEP_MS);
			setTimeout(() => edges[i].classList.remove("active"), ACTIVE_HOLD_MS);
			activate(stages[i + 1], ACTIVE_HOLD_MS);
			activate(watchDots[i + 1], ACTIVE_HOLD_MS);
		}

		setTimeout(() => packet.remove(), ACTIVE_HOLD_MS);
	}

	let chainTimer = null;
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && chainTimer === null) {
					launchPacket();
					chainTimer = setInterval(launchPacket, LAUNCH_INTERVAL_MS);
				} else if (!entry.isIntersecting && chainTimer !== null) {
					clearInterval(chainTimer);
					chainTimer = null;
				}
			});
		},
		{ threshold: 0.2 }
	);
	observer.observe(chainViz);
}
