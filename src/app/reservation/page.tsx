"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ReservationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour charger les créneaux horaires disponibles
  const loadTimeSlots = async (selectedDate: Date) => {
    setIsLoading(true);
    try {
      // Ici, nous simulons le chargement des créneaux horaires depuis l'API
      // Dans une implémentation réelle, vous feriez un appel à votre API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Créneaux horaires fictifs pour la démonstration
      const mockTimeSlots = [
        {
          id: "1",
          startTime: new Date(selectedDate.setHours(9, 0, 0)),
          endTime: new Date(selectedDate.setHours(10, 30, 0)),
          isAvailable: true,
        },
        {
          id: "2",
          startTime: new Date(selectedDate.setHours(11, 0, 0)),
          endTime: new Date(selectedDate.setHours(12, 30, 0)),
          isAvailable: true,
        },
        {
          id: "3",
          startTime: new Date(selectedDate.setHours(14, 0, 0)),
          endTime: new Date(selectedDate.setHours(15, 30, 0)),
          isAvailable: false,
        },
        {
          id: "4",
          startTime: new Date(selectedDate.setHours(16, 0, 0)),
          endTime: new Date(selectedDate.setHours(17, 30, 0)),
          isAvailable: true,
        },
      ];

      setTimeSlots(mockTimeSlots);
    } catch (error) {
      console.error("Erreur lors du chargement des créneaux horaires:", error);
      toast.error("Erreur lors du chargement des créneaux horaires. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le changement de date
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTimeSlot(null);
    if (newDate) {
      loadTimeSlots(newDate);
    } else {
      setTimeSlots([]);
    }
  };

  // Gérer la sélection d'un créneau horaire
  const handleTimeSlotSelect = (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    if (!session) {
      toast.error("Veuillez vous connecter pour effectuer une réservation.");
      router.push("/login?callbackUrl=/reservation");
      return;
    }

    if (!date || !selectedTimeSlot) {
      toast.error("Veuillez sélectionner une date et un créneau horaire.");
      return;
    }

    // Rediriger vers la page de confirmation avec les détails de la réservation
    router.push(`/reservation/confirmation?date=${date.toISOString()}&timeSlot=${selectedTimeSlot}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Réservation</h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informations sur la réservation */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
                <CardDescription>
                  Comment fonctionne notre système de réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Réservez au minimum 24 heures à l'avance et jusqu'à 23h pour le lendemain.
                  </p>
                </div>
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Une session d'1 heure comprend 1h30 au total (30 minutes pour l'installation et la logistique).
                  </p>
                </div>
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    En cas de conditions météorologiques défavorables, votre réservation sera automatiquement annulée et vos heures recréditées.
                  </p>
                </div>
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Vous devez disposer d'un code promo valide pour effectuer une réservation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {!session && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Vous devez être connecté pour effectuer une réservation.{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={() => router.push("/login?callbackUrl=/reservation")}
                  >
                    Se connecter
                  </Button>
                </p>
              </div>
            )}
          </div>

          {/* Formulaire de réservation */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sélectionnez une date</CardTitle>
                <CardDescription>
                  Choisissez la date et l'heure de votre session de wakesurf
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sélecteur de date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "EEEE d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => {
                          // Désactiver les dates passées et aujourd'hui (réservation min. 24h à l'avance)
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const tomorrow = new Date(today);
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          return date < tomorrow;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Sélecteur de créneau horaire */}
                {date && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Créneau horaire</label>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                            className={cn(
                              "justify-start",
                              !slot.isAvailable && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!slot.isAvailable}
                            onClick={() => handleTimeSlotSelect(slot.id)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            <span>
                              {format(slot.startTime, "HH:mm")} - {format(slot.endTime, "HH:mm")}
                            </span>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-2">
                        Aucun créneau disponible pour cette date.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={!date || !selectedTimeSlot || !session}
                  onClick={handleSubmit}
                >
                  Continuer
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 