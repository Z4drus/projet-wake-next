import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReservationSystem } from "@/components/ReservationSystem";

export default function Home() {
  return (
    <>
      {/* Section Héro */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1658020800515-8436a90ed047?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Wakesurf sur le lac Léman"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Contenu */}
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Découvrez le Wakesurf sur le Lac Léman
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Une expérience unique de glisse sur les eaux cristallines du plus grand lac d'Europe occidentale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="#reservation">Réserver maintenant</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
              <Link href="/tarifs">Voir les tarifs</Link>
            </Button>
          </div>
        </div>

        {/* Flèche de défilement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Qu'est-ce que le Wakesurf ?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Le wakesurf est un sport nautique qui consiste à surfer sur la vague créée par un bateau spécialement conçu pour générer une vague continue. Contrairement au wakeboard, le wakesurf se pratique sans être attaché au bateau, offrant une sensation de liberté incomparable.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Sur le lac Léman, nous vous proposons une expérience de wakesurf exceptionnelle dans un cadre naturel magnifique, avec vue sur les Alpes et le Jura.
              </p>
              <Button asChild>
                <Link href="/blog/quest-ce-que-le-wakesurf">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1628689469838-524a4a973b8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Personne pratiquant le wakesurf"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Pourquoi choisir Wakesurf Léman ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Réservation Facile</h3>
              <p className="text-gray-700">
                Réservez votre session en quelques clics grâce à notre système de réservation en ligne intuitif et disponible 24/7.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Paiement Sécurisé</h3>
              <p className="text-gray-700">
                Profitez de nos options de paiement sécurisées par carte bancaire ou Twint pour une tranquillité d'esprit totale.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Équipement Premium</h3>
              <p className="text-gray-700">
                Bénéficiez d'un équipement haut de gamme et d'un bateau spécialement conçu pour le wakesurf, garantissant une expérience optimale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Tarifs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Nos Forfaits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { hours: 1, price: 120, popular: false },
              { hours: 3, price: 330, popular: true },
              { hours: 5, price: 500, popular: false },
              { hours: 10, price: 900, popular: false },
            ].map((forfait) => (
              <div
                key={forfait.hours}
                className={`bg-white rounded-lg overflow-hidden border ${
                  forfait.popular
                    ? "border-blue-500 shadow-lg relative"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {forfait.popular && (
                  <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 px-2 absolute top-0 right-0 rounded-bl-lg">
                    Populaire
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    Forfait {forfait.hours}h
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {forfait.price} CHF
                    </span>
                    <span className="text-gray-500 ml-1">/ forfait</span>
                  </div>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      {forfait.hours} heure{forfait.hours > 1 ? "s" : ""} de wakesurf
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Équipement inclus
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Conseils personnalisés
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Validité 1 an
                    </li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href={`/tarifs?forfait=${forfait.hours}`}>
                      Acheter
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link href="/tarifs">
                Voir tous nos tarifs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section Réservation */}
      <section className="py-20 bg-blue-600 text-white" id="reservation">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">
                Prêt à vivre l'expérience Wakesurf Léman ?
              </h2>
              <p className="text-xl mb-8">
                Réservez dès maintenant votre session et venez découvrir les sensations uniques du wakesurf sur le lac Léman.
              </p>
            </div>
            
            <ReservationSystem />
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Ce que nos clients disent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie L.",
                text: "Une expérience incroyable ! L'équipe est professionnelle et passionnée. J'ai appris à surfer en seulement 2 sessions. Je recommande vivement !",
              },
              {
                name: "Thomas M.",
                text: "Le système de réservation en ligne est super pratique. J'ai pu planifier ma session facilement et le paiement était sécurisé. Le wakesurf était génial, avec une vue magnifique sur les montagnes.",
              },
              {
                name: "Julie D.",
                text: "Nous avons fait une sortie en famille et tout le monde a adoré. Les instructeurs sont patients et attentifs. Le forfait 3h est parfait pour découvrir ce sport. Nous reviendrons !",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
