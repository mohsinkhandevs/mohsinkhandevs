# Mohsin Khan — Portfolio
> Award-level dark-mode portfolio built with React + GSAP + Framer Motion + Lenis

**[🚀 View Live Demo🔗] (Add your Vercel link here once deployed)**

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CustomCursor.jsx   ← Two-layer animated cursor (dot + ring)
│   ├── SmoothScroll.jsx   ← Lenis smooth scroll + GSAP sync
│   ├── Nav.jsx            ← Glassmorphism nav + full-screen overlay menu
│   ├── Hero.jsx           ← Cinematic loader + text reveal entrance
│   ├── About.jsx          ← Scroll-triggered word illumination
│   ├── Works.jsx          ← Project list + cursor image preview
│   ├── Skills.jsx         ← Dual marquee + skill category grid
│   └── Contact.jsx        ← Giant heading + magnetic social links
├── App.jsx                ← Root orchestrator
├── main.jsx               ← React entry point
└── index.css              ← Tailwind + global styles + animations
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#080808` |
| Surface | `#111111` |
| Border | `#1a1a1a` |
| Text | `#F5F0E8` |
| Muted | `#666666` |
| Accent | `#C8FF4E` (electric lime) |
| Display font | Syne (800) |
| Body font | DM Mono |

---

## ✨ Animations

| Feature | Library |
|---|---|
| Custom cursor (dot + ring) | Framer Motion |
| Loader split-wipe | GSAP |
| Hero char reveal | GSAP (stagger) |
| Smooth scrolling | Lenis + GSAP ticker |
| Word highlight on scroll | GSAP ScrollTrigger (scrub) |
| Works entrance | GSAP ScrollTrigger |
| Cursor image preview | GSAP (mousemove follow) |
| Tech marquee | Pure CSS animation |
| Magnetic buttons | GSAP mousemove math |
| Contact heading reveal | GSAP ScrollTrigger |

---

## 🛠 Customization

- Update project details in `Works.jsx` → `PROJECTS` array
- Update bio text in `About.jsx` → `BIO` constant
- Update skills in `Skills.jsx` → `SKILL_CATEGORIES` and marquee arrays
- Update contact info in `Contact.jsx` → `CONTACT_LINKS`
- Swap accent color by changing `#C8FF4E` in `index.css` and component inline styles

---

## 🌐 Deployment (Vercel)

This project is optimized for deployment on Vercel:
1. Push your code to a public GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. The framework preset should automatically be detected as **Vite**.
5. Click **Deploy**.

---

## 📦 Dependencies

```json
{
  "gsap": "^3.12.5",
  "@studio-freight/lenis": "^1.0.42",
  "framer-motion": "^11.3.8",
  "react": "^18.3.1",
  "tailwindcss": "^3.4.6"
}
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, customize, and use it for your own portfolio!

**Show your support** by giving a ⭐️ if you liked this project!

---

Built by Mohsin Khan — FAST NUCES, Islamabad
