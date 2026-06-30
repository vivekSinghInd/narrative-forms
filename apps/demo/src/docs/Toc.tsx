export interface TocItem {
  id: string;
  label: string;
}

export default function Toc({ items, active }: { items: TocItem[]; active: string }) {
  if (!items.length) return null;
  return (
    <aside className="toc">
      <p className="toc-label">ON THIS PAGE</p>
      <nav className="toc-list">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`toc-link${active === item.id ? " toc-link--active" : ""}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
