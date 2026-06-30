import { guides, components } from "./nav";

export default function Sidebar({
  active,
  onNavigate,
  open,
}: {
  active: string;
  onNavigate: (slug: string) => void;
  open: boolean;
}) {
  const isComponents = components.some(g => g.items.some(i => i.slug === active));

  return (
    <aside className={`sidebar${open ? " sidebar--open" : ""}`}>
      <div className="sidebar-section">
        <div className="sidebar-toplinks">
          <button 
            className={`sidebar-toplink ${!isComponents ? "sidebar-toplink--active" : ""}`} 
            type="button"
            onClick={() => onNavigate(guides[0].items[0].slug)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            Guides
          </button>
        </div>
      </div>

      {guides.map((group) => (
        <div className="sidebar-group" key={group.label}>
          <p className="sidebar-group-label">{group.label}</p>
          {group.items.map((item) => (
            <button
              key={item.slug}
              className={`sidebar-link${active === item.slug ? " sidebar-link--active" : ""}`}
              onClick={() => onNavigate(item.slug)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="sidebar-toplinks">
          <button 
            className={`sidebar-toplink ${isComponents ? "sidebar-toplink--active" : ""}`} 
            type="button"
            onClick={() => onNavigate(components[0].items[0].slug)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            Components
          </button>
        </div>
      </div>

      {components.map((group) => (
        <div className="sidebar-group" key={group.label}>
          <p className="sidebar-group-label">{group.label}</p>
          {group.items.map((item) => (
            <button
              key={item.slug}
              className={`sidebar-link${active === item.slug ? " sidebar-link--active" : ""}`}
              onClick={() => onNavigate(item.slug)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
