import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Wakesurf Léman</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Port des Abériaux, 1290 Versoix, Suisse</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-blue-400" />
                <a href="tel:+41791234567" className="hover:text-blue-400 transition-colors">
                  +41 79 123 45 67
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-400" />
                <a href="mailto:contact@wakesurfleman.com" className="hover:text-blue-400 transition-colors">
                  contact@wakesurfleman.com
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="hover:text-blue-400 transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="hover:text-blue-400 transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-xl font-bold mb-4">Horaires</h3>
            <p className="mb-2">Saison : Mai à Septembre</p>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h00 - 19h00</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi - Dimanche</span>
                <span>9h00 - 19h00</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              Les horaires peuvent varier en fonction des conditions météorologiques.
              Veuillez consulter notre calendrier de réservation pour les disponibilités exactes.
            </p>
          </div>
        </div>

        {/* Mentions légales */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Wakesurf Léman. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/cgv" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 