export interface NavItem {
  label: string;
  slug: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const guides: NavGroup[] = [
  {
    label: "GETTING STARTED",
    items: [
      { label: "Installation", slug: "installation" },
      { label: "Configuration", slug: "configuration" },
    ],
  },
  {
    label: "CORE CONCEPTS",
    items: [
      { label: "Validation", slug: "validation" },
      { label: "Editing & Edit Icon", slug: "editing" },
      { label: "Dynamic Forms", slug: "dynamic-forms" },
    ],
  },
  {
    label: "THEMING",
    items: [
      { label: "Theming", slug: "theming" },
      { label: "CSS Classes", slug: "css-classes" },
      { label: "Dark Mode", slug: "dark-mode" },
    ],
  },
];

export const components: NavGroup[] = [
  {
    label: "TEXT INPUTS",
    items: [
      { label: "Text", slug: "text" },
      { label: "Email", slug: "email" },
      { label: "Password", slug: "password" },
      { label: "Number", slug: "number" },
      { label: "Tel", slug: "tel" },
    ],
  },
  {
    label: "SELECTION",
    items: [
      { label: "Chips", slug: "chips" },
      { label: "Multi-Chips", slug: "multi-chips" },
      { label: "Select", slug: "select" },
      { label: "Date", slug: "date" },
    ],
  },
  {
    label: "SPECIAL",
    items: [{ label: "OTP", slug: "otp" }],
  },
];

export const allNavItems: { group: string; item: NavItem; section: "guides" | "components" }[] = [
  ...guides.flatMap((g) => g.items.map((item) => ({ group: g.label, item, section: "guides" as const }))),
  ...components.flatMap((g) => g.items.map((item) => ({ group: g.label, item, section: "components" as const }))),
];
