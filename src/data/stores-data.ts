export interface StoreHours {
  day: string;
  hours: string;
  weekend?: boolean;
}

export interface StoreFacility {
  id: string;
  label: string;
  icon: string; 
}

export interface IStore {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  thumbnail: string;   
  heroBanner: string;  
  description: string;
  mapEmbedUrl: string; 
  mapLat?: number;
  mapLng?: number;
  hours: StoreHours[];
  facilities: StoreFacility[];
  tags: string[];      
}

export const STORES: IStore[] = [
  {
    id: "broadway",
    slug: "broadway-store",
    name: "Broadway Store",
    address: "Broadway St, New York, NY 10007",
    phone: "(208) 555-0110",
    thumbnail:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/broadway-store-s.jpg",
    heroBanner:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/broadway-store-s.jpg",
    description:
      "Then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love. Overspreads my eyes, and heaven and earth seem.",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-74.0079%2C40.7127%2C-74.0020%2C40.7160&layer=mapnik",
    mapLat: 40.7128,
    mapLng: -74.006,
    hours: [
      { day: "Monday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Tuesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Wednesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Thursday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Friday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Saturday", hours: "10:00 a.m. - 8:00 p.m.", weekend: true },
      { day: "Sunday", hours: "11:00 a.m. - 7:00 p.m.", weekend: true },
    ],
    facilities: [
      { id: "parking", label: "Parking", icon: "🅿️" },
      { id: "disabled-parking", label: "Disabled Parking", icon: "♿🅿️" },
      { id: "disabled-access", label: "Disabled Access", icon: "♿" },
    ],
    tags: ["Store", "Delivery Point"],
  },
  {
    id: "valencia",
    slug: "valencia-store",
    name: "Valencia Store",
    address: "1501 Valencia St, San Francisco, CA 94110",
    phone: "(208) 555-0132",
    thumbnail:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/valencia-store-s.jpg",
    heroBanner:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/valencia-store-l-opt.jpg",
    description:
      "Then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love. Overspreads my eyes, and heaven and earth seem.\n\nGet Help\n\nThen I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love. It's content strategy gone awry right from the start.",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-0.1400%2C51.5010%2C-0.1150%2C51.5137&layer=mapnik&marker=51.50735%2C-0.12776",
    mapLat: 51.50735,
    mapLng: -0.12776,
    hours: [
      { day: "Monday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Tuesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Wednesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Thursday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Friday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Saturday", hours: "10:00 a.m. - 8:00 p.m.", weekend: true },
      { day: "Sunday", hours: "11:00 a.m. - 7:00 p.m.", weekend: true },
    ],
    facilities: [
      { id: "parking", label: "Parking", icon: "🅿️" },
      { id: "disabled-parking", label: "Disabled Parking", icon: "♿🅿️" },
      { id: "disabled-access", label: "Disabled Access", icon: "♿" },
    ],
    tags: ["Store", "Delivery Point"],
  },
  {
    id: "emeryville",
    slug: "emeryville-store",
    name: "Emeryville Store",
    address: "5959 Shellmound St, Emeryville, CA 94608",
    phone: "(208) 555-0144",
    thumbnail:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/emeryville-store-s.jpg",
    heroBanner:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/emeryville-store-s.jpg",
    description:
      "Then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love. Overspreads my eyes, and heaven and earth seem.",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-122.3050%2C37.8280%2C-122.2880%2C37.8370&layer=mapnik",
    mapLat: 37.8324,
    mapLng: -122.2974,
    hours: [
      { day: "Monday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Tuesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Wednesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Thursday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Friday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Saturday", hours: "10:00 a.m. - 8:00 p.m.", weekend: true },
      { day: "Sunday", hours: "11:00 a.m. - 7:00 p.m.", weekend: true },
    ],
    facilities: [
      { id: "parking", label: "Parking", icon: "🅿️" },
      { id: "disabled-access", label: "Disabled Access", icon: "♿" },
    ],
    tags: ["Store"],
  },
  {
    id: "alameda",
    slug: "alameda-store",
    name: "Alameda Store",
    address: "2200 South Shore Center, Alameda, CA 94501",
    phone: "(208) 555-0156",
    thumbnail:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/alameda-store-s.jpg",
    heroBanner:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/alameda-store-s.jpg",
    description:
      "Then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love. Overspreads my eyes, and heaven and earth seem.",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-122.2490%2C37.7640%2C-122.2320%2C37.7730&layer=mapnik",
    mapLat: 37.7687,
    mapLng: -122.2405,
    hours: [
      { day: "Monday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Tuesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Wednesday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Thursday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Friday", hours: "10:00 a.m. - 8:00 p.m." },
      { day: "Saturday", hours: "10:00 a.m. - 8:00 p.m.", weekend: true },
      { day: "Sunday", hours: "11:00 a.m. - 7:00 p.m.", weekend: true },
    ],
    facilities: [
      { id: "parking", label: "Parking", icon: "🅿️" },
      { id: "disabled-parking", label: "Disabled Parking", icon: "♿🅿️" },
      { id: "disabled-access", label: "Disabled Access", icon: "♿" },
    ],
    tags: ["Store", "Delivery Point"],
  },
];

export function getStoreBySlug(slug: string): IStore | undefined {
  return STORES.find((s) => s.slug === slug);
}