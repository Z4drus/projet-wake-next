"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Clock, Info, Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Schéma de validation du formulaire de connexion
const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Schéma de validation du formulaire d'inscription
const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function ReservationSystem() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialiser le formulaire de connexion
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialiser le formulaire d'inscription
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Fonction pour charger les créneaux horaires disponibles
  const loadTimeSlots = async (selectedDate: Date) => {
    setIsLoading(true);
    try {
      // Ici, nous simulons le chargement des créneaux horaires depuis l'API
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

  // Gérer la soumission du formulaire de réservation
  const handleReservationSubmit = () => {
    if (!session) {
      setAuthDialogOpen(true);
      return;
    }

    if (!date || !selectedTimeSlot) {
      toast.error("Veuillez sélectionner une date et un créneau horaire.");
      return;
    }

    // Simuler une réservation réussie
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Réservation effectuée avec succès !");
      router.push("/dashboard");
    }, 1500);
  };

  // Gérer la soumission du formulaire de connexion
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Identifiants incorrects. Veuillez réessayer.");
        return;
      }

      toast.success("Connexion réussie !");
      setAuthDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire d'inscription
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // Dans une implémentation réelle, vous feriez un appel à votre API pour créer un compte
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setAuthTab("login");
      registerForm.reset();
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white text-gray-900 rounded-lg overflow-hidden shadow-xl">
        {/* Informations sur la réservation */}
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-6">Informations</h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Réservation à l'avance</h4>
                <p className="text-gray-600">
                  Réservez au minimum 24 heures à l'avance et jusqu'à 23h pour le lendemain.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Durée des sessions</h4>
                <p className="text-gray-600">
                  Une session d'1 heure comprend 1h30 au total (30 minutes pour l'installation et la logistique).
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Conditions météo</h4>
                <p className="text-gray-600">
                  En cas de conditions météorologiques défavorables, votre réservation sera automatiquement annulée et vos heures recréditées.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de réservation */}
        <div className="bg-gray-50 p-8">
          <h3 className="text-2xl font-bold mb-6">Réserver une session</h3>
          <div className="space-y-6">
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

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!date || !selectedTimeSlot || isLoading}
              onClick={handleReservationSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : session ? (
                "Confirmer la réservation"
              ) : (
                "Réserver maintenant"
              )}
            </Button>

            {!session && (
              <p className="text-sm text-gray-500 text-center">
                Vous devrez vous connecter ou créer un compte pour finaliser votre réservation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dialogue d'authentification */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentification requise</DialogTitle>
            <DialogDescription>
              Connectez-vous ou créez un compte pour finaliser votre réservation.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={authTab} onValueChange={(value) => setAuthTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            {/* Onglet Connexion */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="exemple@email.com"
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Masquer" : "Afficher"} le mot de passe
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* Onglet Inscription */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Jean Dupont"
                              autoComplete="name"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="exemple@email.com"
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Masquer" : "Afficher"} le mot de passe
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="••••••••"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showConfirmPassword ? "Masquer" : "Afficher"} le mot de passe
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
} 