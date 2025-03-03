"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Clock, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { PRODUCTS } from "@/lib/stripe";

export default function TarifsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedForfait, setSelectedForfait] = useState<string | null>(null);

  // Récupérer le forfait sélectionné depuis les paramètres d'URL
  useEffect(() => {
    const forfaitParam = searchParams.get("forfait");
    if (forfaitParam) {
      setSelectedForfait(forfaitParam);
    }
  }, [searchParams]);

  // Gérer l'achat d'un forfait
  const handleBuyForfait = async (productId: string) => {
    if (!session) {
      toast.error("Veuillez vous connecter pour acheter un forfait.");
      router.push("/login?callbackUrl=/tarifs");
      return;
    }

    try {
      // Dans une implémentation réelle, vous feriez un appel à votre API pour créer une session Stripe
      toast.success("Redirection vers la page de paiement...");
      
      // Simuler une redirection vers Stripe
      setTimeout(() => {
        router.push("/tarifs/paiement-simulation");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-center">Nos Tarifs</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Découvrez nos différents forfaits d'heures de wakesurf. Achetez un code promo et utilisez-le pour réserver vos sessions quand vous le souhaitez.
      </p>

      {/* Informations sur les forfaits */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-12 max-w-3xl mx-auto">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Comment fonctionnent nos forfaits ?</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Achetez un forfait d'heures et recevez un code promo par email.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Utilisez ce code lors de vos réservations pour déduire les heures.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Validité d'un an à compter de la date d'achat.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>En cas d'annulation météo, vos heures sont automatiquement recréditées.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grille des forfaits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {PRODUCTS.map((product) => {
          const isPopular = product.id === "forfait-3h";
          const isSelected = selectedForfait === product.hours.toString();

          return (
            <Card
              key={product.id}
              className={`overflow-hidden ${
                isSelected
                  ? "ring-2 ring-blue-500"
                  : isPopular
                  ? "border-blue-500 shadow-lg"
                  : ""
              } ${isPopular ? "relative" : ""}`}
            >
              {isPopular && (
                <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 px-2 absolute top-0 right-0 rounded-bl-lg">
                  Populaire
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.price} CHF
                  </span>
                  <span className="text-gray-500 ml-1">/ forfait</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    {product.hours} heure{product.hours > 1 ? "s" : ""} de wakesurf
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-4 w-4 text-blue-500 mr-2" />
                    Équipement inclus
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-4 w-4 text-blue-500 mr-2" />
                    Conseils personnalisés
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-4 w-4 text-blue-500 mr-2" />
                    Validité 1 an
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleBuyForfait(product.id)}
                >
                  Acheter
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Informations supplémentaires */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Informations complémentaires</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Équipement fourni</h3>
            <p className="text-sm text-gray-600">
              Tous nos forfaits incluent l'équipement nécessaire : planche de wakesurf, gilet de sauvetage et combinaison si nécessaire.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Réservations de groupe</h3>
            <p className="text-sm text-gray-600">
              Pour les groupes de 4 personnes ou plus, contactez-nous directement pour bénéficier de tarifs préférentiels.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Conditions d'annulation</h3>
            <p className="text-sm text-gray-600">
              Annulation gratuite jusqu'à 48h avant la session. En cas de conditions météorologiques défavorables, nous annulons la session et recréditons vos heures automatiquement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 