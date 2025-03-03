import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("La variable d'environnement STRIPE_SECRET_KEY n'est pas définie");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

// Produits disponibles (forfaits d'heures)
export const PRODUCTS = [
  {
    id: "forfait-1h",
    name: "Forfait 1 heure",
    description: "1 heure de wakesurf sur le lac Léman",
    price: 120, // Prix en CHF
    hours: 1,
  },
  {
    id: "forfait-3h",
    name: "Forfait 3 heures",
    description: "3 heures de wakesurf sur le lac Léman",
    price: 330, // Prix en CHF
    hours: 3,
  },
  {
    id: "forfait-5h",
    name: "Forfait 5 heures",
    description: "5 heures de wakesurf sur le lac Léman",
    price: 500, // Prix en CHF
    hours: 5,
  },
  {
    id: "forfait-10h",
    name: "Forfait 10 heures",
    description: "10 heures de wakesurf sur le lac Léman",
    price: 900, // Prix en CHF
    hours: 10,
  },
];

// Créer une session de paiement Stripe
export async function createCheckoutSession({
  productId,
  userId,
  successUrl,
  cancelUrl,
}: {
  productId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Produit non trouvé");
  }

  // Créer une session de paiement
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "chf",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price * 100, // Stripe utilise les centimes
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      productId,
      hours: product.hours.toString(),
    },
  });

  return session;
}

// Vérifier une session de paiement
export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

// Générer un code promo aléatoire
export function generatePromoCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclusion des caractères ambigus
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
} 