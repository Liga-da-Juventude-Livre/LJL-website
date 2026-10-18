// Small line icons for the dashboard menu and tiles. 20px, drawn with currentColor so they follow the text colour.
const PATHS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  news: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
  book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10",
  course: "M3 9l9-5 9 5-9 5zM7 11.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  award: "M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 13.5 7 21l5-3 5 3-1.5-7.5",
  building: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M8 11h.01M12 11h.01M16 11h.01",
  inbox: "M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h4l1 2h6l1-2h4",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.6M18 14.8c2 .7 3.5 2.4 3.5 5.2",
  userPlus: "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 20c0-3.5 3-6 7-6s7 2.5 7 6M19 8v6M16 11h6",
  activity: "M3 12h4l3-8 4 16 3-8h4",
  shield: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  check: "M5 12.5l4.5 4.5L19 7",
  alert: "M12 4 2.5 20h19zM12 10v4.5M12 17.5h.01",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg className="dash-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
