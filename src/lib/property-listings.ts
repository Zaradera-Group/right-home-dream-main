import prop1 from "@/assets/development-site-1.jpeg";
import prop2 from "@/assets/development-site-2.jpeg";
import prop3 from "@/assets/development-site-3.jpeg";
import prop4 from "@/assets/development-site-4.jpeg";

export type PropertyCategory = "buy" | "invest" | "rent" | "workspace" | "land";

export type PropertyListing = {
  slug: string;
  img: string;
  price: string;
  loc: string;
  type: string;
  roi: string;
  category: PropertyCategory;
  beds: number;
  baths: number;
  area: string;
  landmark: string;
  neighborhood: string;
  description: string;
  highlights: string[];
  transit: string;
  status: string;
};

export const propertyListings: PropertyListing[] = [
  {
    slug: "igwuruta-ali-school-road-duplex",
    img: prop1,
    price: "NGN 125M",
    loc: "Igwuruta Ali School Road",
    type: "4BR Duplex",
    roi: "21%",
    category: "buy",
    beds: 4,
    baths: 5,
    area: "420 sqm",
    landmark: "Near a major school cluster and a fast-growing residential corridor",
    neighborhood: "Quiet family zone with premium access roads",
    description:
      "A spacious duplex with a modern layout, large living areas and a compound that works for family living or investor-grade rentals.",
    highlights: ["Title verified", "Secure gated access", "Balcony views", "Parking for 4 cars"],
    transit: "18 minutes to the airport axis and key arterial roads",
    status: "Available for inspection",
  },
  {
    slug: "omagwa-station-apartment",
    img: prop2,
    price: "NGN 68M",
    loc: "Omagwa Station",
    type: "3BR Apartment",
    roi: "17%",
    category: "buy",
    beds: 3,
    baths: 3,
    area: "180 sqm",
    landmark: "Close to Omagwa Station and its surrounding transport links",
    neighborhood: "High-demand area for short and long-stay tenants",
    description:
      "A clean, efficient apartment with strong rental potential and a practical floor plan for young families and professionals.",
    highlights: ["Verified owner", "Low maintenance", "Strong rental demand", "Modern finishes"],
    transit: "12 minutes to the airport road corridor",
    status: "Viewing by appointment",
  },
  {
    slug: "igwuruta-ali-school-road-workspace",
    img: prop3,
    price: "NGN 240K/mo",
    loc: "Igwuruta Ali School Road",
    type: "Workspace",
    roi: "Lease",
    category: "workspace",
    beds: 0,
    baths: 4,
    area: "1200 sqft",
    landmark: "Along the Ali School Road development corridor",
    neighborhood: "An emerging area with improving access and active development",
    description:
      "A flexible workspace with a corporate feel, ideal for firms needing visibility, convenience and a central business location.",
    highlights: [
      "Corporate standard",
      "Meeting room ready",
      "High foot traffic",
      "Flexible lease terms",
    ],
    transit: "Easy access to central business routes",
    status: "Lease available",
  },
  {
    slug: "omagwa-station-development-plots",
    img: prop4,
    price: "NGN 42M",
    loc: "Omagwa Station",
    type: "Land",
    roi: "Land",
    category: "land",
    beds: 0,
    baths: 0,
    area: "650 sqm",
    landmark: "Near active growth corridors and expansion zones",
    neighborhood: "Strong hold for long-term development or resale strategy",
    description:
      "A clean plot with excellent upside for developers or long-term investors looking for a strategic land bank.",
    highlights: ["Survey-ready", "Development potential", "Good road access", "Verified documentation"],
    transit: "Close to expanding residential and commercial pockets",
    status: "Ready for offer",
  },
  {
    slug: "igwuruta-ali-school-road-villa",
    img: prop1,
    price: "NGN 95M",
    loc: "Igwuruta Ali School Road",
    type: "3BR Villa",
    roi: "19%",
    category: "invest",
    beds: 3,
    baths: 4,
    area: "320 sqm",
    landmark: "Within the Ali School Road development corridor",
    neighborhood: "A growing residential area with long-term investment potential",
    description:
      "A premium villa with strong aesthetics, a well-balanced floor plan and great liveability for owners or premium tenants.",
    highlights: ["Executive finish", "Garden space", "Secure environment", "High rental appeal"],
    transit: "Well connected to commercial hubs and waterfront routes",
    status: "Inspection open",
  },
  {
    slug: "omagwa-station-compact-flat",
    img: prop2,
    price: "NGN 52M",
    loc: "Omagwa Station",
    type: "2BR Flat",
    roi: "15%",
    category: "rent",
    beds: 2,
    baths: 2,
    area: "140 sqm",
    landmark: "Near established residential streets and market access",
    neighborhood: "Practical entry point for first-time buyers and investors",
    description:
      "A compact, affordable flat designed for ease of ownership, low upkeep and dependable tenant demand.",
    highlights: ["Affordable entry point", "Low service cost", "Easy access", "Verified listing"],
    transit: "Fast access to nearby transport routes",
    status: "Available now",
  },
  {
    slug: "igwuruta-ali-school-road-terrace",
    img: prop3,
    price: "NGN 78M",
    loc: "Igwuruta Ali School Road",
    type: "4BR Terrace",
    roi: "18%",
    category: "buy",
    beds: 4,
    baths: 4,
    area: "260 sqm",
    landmark: "Near Ali School Road and surrounding community access routes",
    neighborhood: "Balanced for homeowners and long-term investors",
    description:
      "A modern terrace home with a practical footprint, premium finishes and strong appeal for buyers who want comfort and solid resale potential.",
    highlights: ["Secure compound", "Modern finish", "High resale appeal", "Family-friendly"],
    transit: "Good access to major city routes",
    status: "Available for inspection",
  },
  {
    slug: "omagwa-station-maisonette",
    img: prop4,
    price: "NGN 110M",
    loc: "Omagwa Station",
    type: "5BR Maisonette",
    roi: "20%",
    category: "invest",
    beds: 5,
    baths: 5,
    area: "510 sqm",
    landmark: "Close to Omagwa Station and major connecting routes",
    neighborhood: "A strategic corridor for long-term capital growth",
    description:
      "A larger maisonette with strong rental and resale potential in one of the city's more active growth corridors.",
    highlights: ["Premium zone", "Large footprint", "Strong appreciation", "Investment-grade"],
    transit: "Easy access to major roads and central routes",
    status: "Viewing by appointment",
  },
  {
    slug: "igwuruta-ali-school-road-plot",
    img: prop1,
    price: "NGN 36M",
    loc: "Igwuruta Ali School Road",
    type: "Land",
    roi: "Land",
    category: "land",
    beds: 0,
    baths: 0,
    area: "500 sqm",
    landmark: "Along Ali School Road near expanding development pockets",
    neighborhood: "Suitable for land banking and future build plans",
    description:
      "A strategic plot for investors who want a lower entry point with long-term upside in a fast-evolving corridor.",
    highlights: ["Title verified", "Road access", "Future growth", "Plot ready"],
    transit: "Strong access to the airport corridor",
    status: "Ready for offer",
  },
  {
    slug: "omagwa-station-flat",
    img: prop2,
    price: "NGN 185K/mo",
    loc: "Omagwa Station",
    type: "2BR Flat",
    roi: "Lease",
    category: "rent",
    beds: 2,
    baths: 2,
    area: "130 sqm",
    landmark: "Close to Omagwa Station and everyday transport access",
    neighborhood: "Practical for professionals and small households",
    description:
      "An affordable rental unit with easy mobility, making it attractive to tenants who value convenience and lower upkeep.",
    highlights: ["Affordable rent", "High tenant demand", "Easy mobility", "Low upkeep"],
    transit: "Close to transport and daily essentials",
    status: "Available now",
  },
];

export function getPropertyBySlug(slug: string) {
  return propertyListings.find((property) => property.slug === slug) ?? null;
}
