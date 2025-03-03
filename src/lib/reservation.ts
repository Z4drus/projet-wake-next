import { db } from "@/lib/db";
import { addDays, addMinutes, format, isAfter, isBefore, setHours, setMinutes, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { TimeSlot } from "./types";

// Heures d'ouverture et de fermeture
const OPENING_HOUR = 9; // 9h00
const CLOSING_HOUR = 19; // 19h00

// Durée minimale entre la réservation et la session (24h)
const MIN_RESERVATION_ADVANCE = 24;

// Heure limite pour réserver le lendemain (23h)
const RESERVATION_CUTOFF_HOUR = 23;

// Vérifier si une date est réservable
export function isDateBookable(date: Date): boolean {
  const now = new Date();
  const tomorrow = addDays(now, 1);
  const startOfTomorrow = startOfDay(tomorrow);

  // Si la date est aujourd'hui, elle n'est pas réservable (minimum 24h à l'avance)
  if (isBefore(date, startOfTomorrow)) {
    return false;
  }

  // Si c'est pour demain, vérifier si on est avant l'heure limite (23h)
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    const currentHour = now.getHours();
    return currentHour < RESERVATION_CUTOFF_HOUR;
  }

  return true;
}

// Générer les créneaux horaires disponibles pour une date donnée
export async function generateTimeSlots(date: Date): Promise<TimeSlot[]> {
  // Récupérer les configurations de créneaux
  const slotConfigs = await db.timeSlotConfig.findMany({
    where: { isActive: true },
  });

  // Récupérer les réservations existantes pour cette date
  const startOfSelectedDay = startOfDay(date);
  const endOfSelectedDay = addDays(startOfSelectedDay, 1);

  const existingReservations = await db.reservation.findMany({
    where: {
      startTime: { gte: startOfSelectedDay },
      endTime: { lt: endOfSelectedDay },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
  });

  // Créer les créneaux horaires
  const timeSlots: TimeSlot[] = [];
  const slotDuration = 30; // Durée d'un créneau en minutes

  // Pour chaque heure entre l'ouverture et la fermeture
  for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
    // Pour chaque tranche de 30 minutes
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotStart = setMinutes(setHours(startOfSelectedDay, hour), minute);
      
      // Vérifier si le créneau est dans le futur et respecte le délai minimum
      const now = new Date();
      const minReservationTime = addHours(now, MIN_RESERVATION_ADVANCE);
      
      if (isBefore(slotStart, minReservationTime)) {
        continue;
      }

      // Pour chaque configuration de créneau
      for (const config of slotConfigs) {
        const totalDuration = config.duration + config.setupTime;
        const slotEnd = addMinutes(slotStart, totalDuration);

        // Vérifier si le créneau se termine avant la fermeture
        if (isAfter(slotEnd, setHours(startOfSelectedDay, CLOSING_HOUR))) {
          continue;
        }

        // Vérifier si le créneau est disponible (pas de chevauchement avec des réservations existantes)
        const isAvailable = !existingReservations.some(
          (reservation) =>
            (isBefore(slotStart, new Date(reservation.endTime)) &&
              isAfter(slotEnd, new Date(reservation.startTime)))
        );

        timeSlots.push({
          id: `${format(slotStart, "HH:mm")}-${format(slotEnd, "HH:mm")}-${config.id}`,
          startTime: slotStart,
          endTime: slotEnd,
          isAvailable,
        });
      }
    }
  }

  return timeSlots;
}

// Formater une date pour l'affichage
export function formatDate(date: Date): string {
  return format(date, "EEEE d MMMM yyyy", { locale: fr });
}

// Formater une heure pour l'affichage
export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

// Calculer le nombre d'heures entre deux dates
export function calculateHours(startTime: Date, endTime: Date): number {
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours;
}

// Ajouter des heures à une date
function addHours(date: Date, hours: number): Date {
  return addMinutes(date, hours * 60);
} 