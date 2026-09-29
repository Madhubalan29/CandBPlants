export const site = {
  name: "C and B Potted Plants",
  shortName: "C&B",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://candbplants.com").replace(/\/$/, ""),
  description:
    "Hand-nurtured indoor and outdoor potted plants, bonsai and succulents, plus designer pots, fertilizers, seeds and accessories. Order online via WhatsApp.",
  phone: "+91 93423 70441",
  whatsapp: "919342370441",
  email: "hello@candbplants.com",
  instagram: "https://www.instagram.com/c_and_b_potted_plants",
  facebook: "https://www.facebook.com/profile.php?id=61592511296587",
};

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${site.url}${path}`;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(value: number) {
  return inr.format(value);
}
