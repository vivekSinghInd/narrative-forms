import { useState } from 'react';
import { NarrativeForm } from '@viveksinghind/narrative-form-react';
import type { NarrativeFormConfig } from '@viveksinghind/narrative-form-core';

// Demo Configuration
const demoConfig: NarrativeFormConfig = {
  form: { id: "demo-signup", name: "Newsletter Signup", version: 1 },
  welcome: {
    show: true,
    heading: "Welcome to Narrative Form",
    subtext: "Experience the interactive typewriter flow.",
    ctaLabel: "Start Demo"
  },
  theme: {
    mode: "light",
    background: "transparent",
  },
  fields: [
    {
      key: "name",
      type: "text",
      prefix: "Hi, my name is",
      validation: { required: true, minLength: 2 }
    },
    {
      key: "email",
      type: "email",
      prefix: "You can reach me at",
      validation: { required: true, isEmail: true }
    },
    {
      key: "role",
      type: "select",
      prefix: "I am a",
      options: ["Developer", "Designer", "Product Manager", "Founder", "Other"],
      validation: { required: true }
    }
  ],
  done: {
    show: true,
    message: (values: Record<string, any>) => `Thanks ${values.name || 'there'}! Form completed successfully.`,
  }
};

const installCodes = {
  react: "npm install @viveksinghind/narrative-form-react @viveksinghind/narrative-form-core",
  vue: "npm install @viveksinghind/narrative-form-vue @viveksinghind/narrative-form-core",
  angular: "npm install @viveksinghind/narrative-form-angular @viveksinghind/narrative-form-core",
  native: "npm install @viveksinghind/narrative-form-native @viveksinghind/narrative-form-core",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<keyof typeof installCodes>('react');
  const [activeMenu, setActiveMenu] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveMenu(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="layout-wrapper">
      {/* Topbar */}
      <div className="layout-topbar">
        <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div className="topbar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Narrative Form</span>
        </div>
        <div className="topbar-actions">
          <a href="https://github.com/vivekSinghInd/narrative-form" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`layout-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <ul className="layout-menu">
          <li className="menu-category">Getting Started</li>
          <li className={activeMenu === 'overview' ? 'active' : ''} onClick={() => scrollTo('overview')}>
            Overview
          </li>
          <li className={activeMenu === 'installation' ? 'active' : ''} onClick={() => scrollTo('installation')}>
            Installation
          </li>
          
          <li className="menu-category">API Reference</li>
          <li className={activeMenu === 'config' ? 'active' : ''} onClick={() => scrollTo('config')}>
            FormConfig
          </li>
          <li className={activeMenu === 'fields' ? 'active' : ''} onClick={() => scrollTo('fields')}>
            Field Properties
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="layout-main">
        <div className="layout-content">
          
          {/* Overview */}
          <section id="overview" className="content-section">
            <div className="hero-banner">
              <h1>Narrative Form</h1>
              <p>A beautiful, framework-agnostic, typewriter-style conversational form. Engage your users with micro-interactions that feel human.</p>
            </div>
            
            <div className="card demo-card">
              <NarrativeForm 
                formConfig={demoConfig} 
                callbacks={{ onComplete: (v: any) => console.log('Complete:', v) }} 
              />
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="content-section">
            <h2>Installation</h2>
            <p>Narrative form is available across multiple frameworks. Select yours below:</p>
            
            <div className="card">
              <div className="tabs">
                {(Object.keys(installCodes) as Array<keyof typeof installCodes>).map((tab) => (
                  <button 
                    key={tab} 
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <pre><code>{installCodes[activeTab]}</code></pre>
            </div>
          </section>

          {/* Config API */}
          <section id="config" className="content-section">
            <h2>FormConfig API</h2>
            <p>The <code>NarrativeFormConfig</code> is identical across all frameworks.</p>
            
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>form</code></td>
                    <td><code>{'{ id: string, name: string, version: number }'}</code></td>
                    <td>Metadata for the form instance.</td>
                  </tr>
                  <tr>
                    <td><code>welcome</code></td>
                    <td><code>NarrativeWelcome</code></td>
                    <td>Configuration for the initial welcome screen (heading, subtext, cta).</td>
                  </tr>
                  <tr>
                    <td><code>fields</code></td>
                    <td><code>NarrativeField[]</code></td>
                    <td>Array of field objects defining the questions and validation.</td>
                  </tr>
                  <tr>
                    <td><code>theme</code></td>
                    <td><code>NarrativeTheme</code></td>
                    <td>Visual customizations (colors, fonts, dark mode).</td>
                  </tr>
                  <tr>
                    <td><code>done</code></td>
                    <td><code>NarrativeDone</code></td>
                    <td>Configuration for the completion screen (message).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Field API */}
          <section id="fields" className="content-section">
            <h2>Field Properties</h2>
            
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>key</code></td>
                    <td><code>string</code></td>
                    <td>Unique identifier for the field (used in results).</td>
                  </tr>
                  <tr>
                    <td><code>type</code></td>
                    <td><code>"text" | "email" | "select" | "number" | ...</code></td>
                    <td>Input type for the field.</td>
                  </tr>
                  <tr>
                    <td><code>prefix</code></td>
                    <td><code>string</code></td>
                    <td>The conversational prompt text that is typed out.</td>
                  </tr>
                  <tr>
                    <td><code>validation</code></td>
                    <td><code>NarrativeValidation</code></td>
                    <td>Rules for validation (required, minLength, pattern, async custom).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
