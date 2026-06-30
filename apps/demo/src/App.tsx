import { useEffect, useMemo, useState } from "react";
import TopNav from "./docs/TopNav";
import Sidebar from "./docs/Sidebar";
import Toc from "./docs/Toc";
import InstallationPage, { toc as installationToc } from "./docs/pages/Installation";
import ConfigurationPage, { toc as configurationToc } from "./docs/pages/Configuration";
import ValidationPage, { toc as validationToc } from "./docs/pages/Validation";
import EditingPage, { toc as editingToc } from "./docs/pages/Editing";
import DynamicFormsPage, { toc as dynamicFormsToc } from "./docs/pages/DynamicForms";
import ThemingPage, { toc as themingToc } from "./docs/pages/Theming";
import CssClassesPage, { toc as cssClassesToc } from "./docs/pages/CssClasses";
import DarkModePage, { toc as darkModeToc } from "./docs/pages/DarkMode";
import ComponentPage, { buildToc } from "./docs/components/ComponentPage";
import {
  textConfig,
  emailConfig,
  passwordConfig,
  numberConfig,
  telConfig,
  chipsConfig,
  multiChipsConfig,
  selectConfig,
  dateConfig,
  otpConfig,
} from "./docs/components/configs";
import "./docs/docs.css";

const componentConfigs: Record<string, typeof textConfig> = {
  text: textConfig,
  email: emailConfig,
  password: passwordConfig,
  number: numberConfig,
  tel: telConfig,
  chips: chipsConfig,
  "multi-chips": multiChipsConfig,
  select: selectConfig,
  date: dateConfig,
  otp: otpConfig,
};

function getSlugFromHash(): string {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("docs/")) return hash.slice(5);
  return "installation";
}

export default function App() {
  const [slug, setSlug] = useState(getSlugFromHash());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeToc, setActiveToc] = useState("");

  useEffect(() => {
    const onHashChange = () => {
      setSlug(getSlugFromHash());
      setSidebarOpen(false);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.location.hash = "#docs/installation";
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (s: string) => {
    window.location.hash = `#docs/${s}`;
  };

  const { Page, toc } = useMemo(() => {
    switch (slug) {
      case "installation":
        return { Page: <InstallationPage />, toc: installationToc };
      case "configuration":
        return { Page: <ConfigurationPage />, toc: configurationToc };
      case "validation":
        return { Page: <ValidationPage />, toc: validationToc };
      case "editing":
        return { Page: <EditingPage />, toc: editingToc };
      case "dynamic-forms":
        return { Page: <DynamicFormsPage />, toc: dynamicFormsToc };
      case "theming":
        return { Page: <ThemingPage />, toc: themingToc };
      case "css-classes":
        return { Page: <CssClassesPage />, toc: cssClassesToc };
      case "dark-mode":
        return { Page: <DarkModePage />, toc: darkModeToc };
      default: {
        const config = componentConfigs[slug];
        if (config) {
          return { Page: <ComponentPage config={config} />, toc: buildToc(config) };
        }
        return { Page: <InstallationPage />, toc: installationToc };
      }
    }
  }, [slug]);

  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveToc(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc, slug]);

  return (
    <div className="docs-shell">
      <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} onSearchClick={() => {}} />
      <div className="docs-body">
        <Sidebar active={slug} onNavigate={navigate} open={sidebarOpen} />
        <main className="docs-main">
          <div className="docs-main-inner">{Page}</div>
        </main>
        <Toc items={toc} active={activeToc} />
      </div>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
