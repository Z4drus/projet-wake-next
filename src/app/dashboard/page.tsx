"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  RefreshCw,
  Search,
  User,
  X,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Calendar,
  Tag,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Types pour l'administration
type AdminReservation = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "WEATHER_CANCELLED";
  user: {
    id: string;
    name: string;
    email: string;
  };
  promoCode?: {
    id: string;
    code: string;
  };
  createdAt: Date;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  reservationsCount: number;
  promoCodes: {
    id: string;
    code: string;
    hours: number;
    hoursLeft: number;
  }[];
};

type AdminPromoCode = {
  id: string;
  code: string;
  hours: number;
  hoursLeft: number;
  isActive: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type DashboardStats = {
  totalUsers: number;
  totalReservations: number;
  totalPromoCodes: number;
  upcomingReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  weatherCancelledReservations: number;
  totalHoursSold: number;
  totalHoursUsed: number;
  revenueEstimate: number;
};

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [promoCodes, setPromoCodes] = useState<AdminPromoCode[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("weather");

  // Rediriger si l'utilisateur n'est pas admin
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        toast.error("Accès non autorisé. Redirection vers votre tableau de bord.");
      }
    } else if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin/dashboard");
    }
  }, [status, session, router]);

  // Charger les données administratives
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      loadAdminData();
    }
  }, [status, session]);

  // Fonction pour charger les données administratives
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API pour récupérer les données administratives
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Données fictives pour la démonstration
      const mockReservations: AdminReservation[] = [
        {
          id: "1",
          date: new Date(2025, 5, 15), // 15 juin 2025
          startTime: "10:00",
          endTime: "11:30",
          status: "CONFIRMED",
          user: {
            id: "user1",
            name: "Sophie Martin",
            email: "sophie.martin@example.com",
          },
          promoCode: {
            id: "promo1",
            code: "WAKE2025",
          },
          createdAt: new Date(2025, 5, 10), // 10 juin 2025
        },
        {
          id: "2",
          date: new Date(2025, 5, 20), // 20 juin 2025
          startTime: "14:00",
          endTime: "15:30",
          status: "CONFIRMED",
          user: {
            id: "user2",
            name: "Thomas Dubois",
            email: "thomas.dubois@example.com",
          },
          promoCode: {
            id: "promo2",
            code: "SUMMER25",
          },
          createdAt: new Date(2025, 5, 18), // 18 juin 2025
        },
        {
          id: "3",
          date: new Date(2025, 4, 10), // 10 mai 2025
          startTime: "11:00",
          endTime: "12:30",
          status: "COMPLETED",
          user: {
            id: "user3",
            name: "Julie Leroy",
            email: "julie.leroy@example.com",
          },
          promoCode: {
            id: "promo3",
            code: "SPRING25",
          },
          createdAt: new Date(2025, 4, 5), // 5 mai 2025
        },
        {
          id: "4",
          date: new Date(2025, 4, 5), // 5 mai 2025
          startTime: "16:00",
          endTime: "17:30",
          status: "WEATHER_CANCELLED",
          user: {
            id: "user1",
            name: "Sophie Martin",
            email: "sophie.martin@example.com",
          },
          promoCode: {
            id: "promo1",
            code: "WAKE2025",
          },
          createdAt: new Date(2025, 4, 3), // 3 mai 2025
        },
        {
          id: "5",
          date: new Date(2025, 5, 25), // 25 juin 2025
          startTime: "09:00",
          endTime: "10:30",
          status: "CONFIRMED",
          user: {
            id: "user4",
            name: "Pierre Blanc",
            email: "pierre.blanc@example.com",
          },
          promoCode: {
            id: "promo4",
            code: "FAMILY25",
          },
          createdAt: new Date(2025, 5, 20), // 20 juin 2025
        },
      ];

      const mockUsers: AdminUser[] = [
        {
          id: "user1",
          name: "Sophie Martin",
          email: "sophie.martin@example.com",
          role: "USER",
          createdAt: new Date(2025, 2, 15), // 15 mars 2025
          reservationsCount: 2,
          promoCodes: [
            {
              id: "promo1",
              code: "WAKE2025",
              hours: 3,
              hoursLeft: 1.5,
            },
          ],
        },
        {
          id: "user2",
          name: "Thomas Dubois",
          email: "thomas.dubois@example.com",
          role: "USER",
          createdAt: new Date(2025, 3, 10), // 10 avril 2025
          reservationsCount: 1,
          promoCodes: [
            {
              id: "promo2",
              code: "SUMMER25",
              hours: 5,
              hoursLeft: 5,
            },
          ],
        },
        {
          id: "user3",
          name: "Julie Leroy",
          email: "julie.leroy@example.com",
          role: "USER",
          createdAt: new Date(2025, 1, 5), // 5 février 2025
          reservationsCount: 1,
          promoCodes: [
            {
              id: "promo3",
              code: "SPRING25",
              hours: 3,
              hoursLeft: 1.5,
            },
          ],
        },
        {
          id: "user4",
          name: "Pierre Blanc",
          email: "pierre.blanc@example.com",
          role: "USER",
          createdAt: new Date(2025, 4, 20), // 20 mai 2025
          reservationsCount: 1,
          promoCodes: [
            {
              id: "promo4",
              code: "FAMILY25",
              hours: 10,
              hoursLeft: 8.5,
            },
          ],
        },
        {
          id: "admin1",
          name: "Admin Système",
          email: "admin@wakesurfleman.com",
          role: "ADMIN",
          createdAt: new Date(2025, 0, 1), // 1er janvier 2025
          reservationsCount: 0,
          promoCodes: [],
        },
      ];

      const mockPromoCodes: AdminPromoCode[] = [
        {
          id: "promo1",
          code: "WAKE2025",
          hours: 3,
          hoursLeft: 1.5,
          isActive: true,
          createdAt: new Date(2025, 3, 1), // 1er avril 2025
          user: {
            id: "user1",
            name: "Sophie Martin",
            email: "sophie.martin@example.com",
          },
        },
        {
          id: "promo2",
          code: "SUMMER25",
          hours: 5,
          hoursLeft: 5,
          isActive: true,
          createdAt: new Date(2025, 4, 15), // 15 mai 2025
          user: {
            id: "user2",
            name: "Thomas Dubois",
            email: "thomas.dubois@example.com",
          },
        },
        {
          id: "promo3",
          code: "SPRING25",
          hours: 3,
          hoursLeft: 1.5,
          isActive: true,
          createdAt: new Date(2025, 2, 1), // 1er mars 2025
          user: {
            id: "user3",
            name: "Julie Leroy",
            email: "julie.leroy@example.com",
          },
        },
        {
          id: "promo4",
          code: "FAMILY25",
          hours: 10,
          hoursLeft: 8.5,
          isActive: true,
          createdAt: new Date(2025, 4, 10), // 10 mai 2025
          user: {
            id: "user4",
            name: "Pierre Blanc",
            email: "pierre.blanc@example.com",
          },
        },
      ];

      const mockStats: DashboardStats = {
        totalUsers: mockUsers.length,
        totalReservations: mockReservations.length,
        totalPromoCodes: mockPromoCodes.length,
        upcomingReservations: mockReservations.filter(r => r.status === "CONFIRMED").length,
        completedReservations: mockReservations.filter(r => r.status === "COMPLETED").length,
        cancelledReservations: mockReservations.filter(r => r.status === "CANCELLED").length,
        weatherCancelledReservations: mockReservations.filter(r => r.status === "WEATHER_CANCELLED").length,
        totalHoursSold: mockPromoCodes.reduce((acc, code) => acc + code.hours, 0),
        totalHoursUsed: mockPromoCodes.reduce((acc, code) => acc + (code.hours - code.hoursLeft), 0),
        revenueEstimate: mockPromoCodes.reduce((acc, code) => {
          // Prix fictif par heure: 110 CHF
          return acc + (code.hours * 110);
        }, 0),
      };

      setReservations(mockReservations);
      setUsers(mockUsers);
      setPromoCodes(mockPromoCodes);
      setStats(mockStats);
    } catch (error) {
      console.error("Erreur lors du chargement des données administratives:", error);
      toast.error("Erreur lors du chargement des données. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour annuler une réservation
  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      // Simuler un appel API pour annuler la réservation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mettre à jour l'état local
      setReservations((prev) =>
        prev.map((res) =>
          res.id === selectedReservation.id
            ? {
              ...res,
              status: cancelReason === "weather" ? "WEATHER_CANCELLED" : "CANCELLED",
            }
            : res
        )
      );

      // Mettre à jour les statistiques
      if (stats) {
        setStats({
          ...stats,
          upcomingReservations: stats.upcomingReservations - 1,
          cancelledReservations:
            cancelReason === "weather"
              ? stats.cancelledReservations
              : stats.cancelledReservations + 1,
          weatherCancelledReservations:
            cancelReason === "weather"
              ? stats.weatherCancelledReservations + 1
              : stats.weatherCancelledReservations,
        });
      }

      setCancelDialogOpen(false);
      setSelectedReservation(null);
      setCancelReason("weather");

      toast.success(
        `Réservation annulée avec succès. ${cancelReason === "weather"
          ? "Les heures ont été recréditées automatiquement."
          : ""
        }`
      );
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
      toast.error("Erreur lors de l'annulation. Veuillez réessayer.");
    }
  };

  // Fonction pour marquer une réservation comme terminée
  const handleCompleteReservation = async (reservationId: string) => {
    try {
      // Simuler un appel API pour marquer la réservation comme terminée
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mettre à jour l'état local
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "COMPLETED" } : res
        )
      );

      // Mettre à jour les statistiques
      if (stats) {
        setStats({
          ...stats,
          upcomingReservations: stats.upcomingReservations - 1,
          completedReservations: stats.completedReservations + 1,
        });
      }

      toast.success("Réservation marquée comme terminée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
      toast.error("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  };

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "WEATHER_CANCELLED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir le libellé en fonction du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmée";
      case "CANCELLED":
        return "Annulée";
      case "COMPLETED":
        return "Terminée";
      case "WEATHER_CANCELLED":
        return "Annulée (météo)";
      default:
        return status;
    }
  };

  // Fonction pour filtrer les réservations
  const filteredReservations = reservations.filter((reservation) => {
    // Filtre par statut
    if (statusFilter !== "all" && reservation.status !== statusFilter) {
      return false;
    }

    // Filtre par plage de dates
    if (dateRange?.from && dateRange?.to) {
      if (
        isBefore(reservation.date, dateRange.from) ||
        isAfter(reservation.date, addDays(dateRange.to, 1))
      ) {
        return false;
      }
    }

    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        reservation.user.name.toLowerCase().includes(searchLower) ||
        reservation.user.email.toLowerCase().includes(searchLower) ||
        (reservation.promoCode?.code.toLowerCase().includes(searchLower) ?? false)
      );
    }

    return true;
  });

  // Fonction pour filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Fonction pour filtrer les codes promo
  const filteredPromoCodes = promoCodes.filter((promoCode) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        promoCode.code.toLowerCase().includes(searchLower) ||
        promoCode.user.name.toLowerCase().includes(searchLower) ||
        promoCode.user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Si l'utilisateur n'est pas connecté ou en cours de chargement
  if (status === "loading" || (status === "authenticated" && session?.user?.role !== "ADMIN")) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-600">
            Gérez les réservations, les utilisateurs et les codes promo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAdminData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/admin/settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{stats.totalReservations}</div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>À venir: {stats.upcomingReservations}</span>
                <span>Terminées: {stats.completedReservations}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Codes promo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{stats.totalPromoCodes}</div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Heures vendues: {stats.totalHoursSold}h</span>
                <span>Utilisées: {stats.totalHoursUsed}h</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Revenus estimés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{stats.revenueEstimate} CHF</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reservations">
        <TabsList className="mb-8">
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="promo-codes">Codes promo</TabsTrigger>
        </TabsList>

        {/* Onglet Réservations */}
        <TabsContent value="reservations">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, email ou code promo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmées</SelectItem>
                    <SelectItem value="COMPLETED">Terminées</SelectItem>
                    <SelectItem value="CANCELLED">Annulées</SelectItem>
                    <SelectItem value="WEATHER_CANCELLED">Annulées (météo)</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Filtrer par date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                    <div className="flex items-center justify-end gap-2 p-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(undefined)}
                      >
                        Réinitialiser
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => document.body.click()}
                      >
                        Appliquer
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredReservations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Code promo</TableHead>
                    <TableHead>Créée le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="font-medium">{reservation.user.name}</div>
                        <div className="text-sm text-gray-500">{reservation.user.email}</div>
                      </TableCell>
                      <TableCell>
                        {format(reservation.date, "EEEE d MMMM yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        {reservation.startTime} - {reservation.endTime}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(reservation.status)}`}
                        >
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reservation.promoCode ? (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {reservation.promoCode.code}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(reservation.createdAt, "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Ouvrir menu</span>
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/reservations/${reservation.id}`)}
                            >
                              Voir les détails
                            </DropdownMenuItem>
                            {reservation.status === "CONFIRMED" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReservation(reservation);
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  Annuler la réservation
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCompleteReservation(reservation.id)}
                                >
                                  Marquer comme terminée
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/users/${reservation.user.id}`)}
                            >
                              Voir le profil client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                Aucune réservation ne correspond aux critères de recherche.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateRange(undefined);
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Onglet Utilisateurs */}
        <TabsContent value="users">
          <div className="mb-6">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Réservations</TableHead>
                    <TableHead>Codes promo</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "ADMIN" ? "default" : "outline"}
                        >
                          {user.role === "ADMIN" ? "Administrateur" : "Client"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(user.createdAt, "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>{user.reservationsCount}</TableCell>
                      <TableCell>
                        {user.promoCodes.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {user.promoCodes.map((code) => (
                              <div key={code.id} className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {code.code}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {code.hoursLeft}/{code.hours}h
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                Aucun utilisateur ne correspond aux critères de recherche.
              </p>
              <Button onClick={() => setSearchTerm("")}>
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Onglet Codes Promo */}
        <TabsContent value="promo-codes">
          <div className="mb-6">
            <Input
              placeholder="Rechercher par code, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPromoCodes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Heures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromoCodes.map((promoCode) => (
                    <TableRow key={promoCode.id}>
                      <TableCell>
                        <span className="font-mono font-medium">{promoCode.code}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{promoCode.user.name}</div>
                        <div className="text-sm text-gray-500">{promoCode.user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(promoCode.hoursLeft / promoCode.hours) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm">
                            {promoCode.hoursLeft}/{promoCode.hours}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={promoCode.isActive ? "outline" : "secondary"}
                          className={
                            promoCode.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {promoCode.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(promoCode.createdAt, "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Ouvrir menu</span>
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/promo-codes/${promoCode.id}`)}
                            >
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Logique pour modifier le code promo
                                toast.info("Fonctionnalité à implémenter");
                              }}
                            >
                              Modifier
                            </DropdownMenuItem>
                            {promoCode.isActive ? (
                              <DropdownMenuItem
                                onClick={() => {
                                  // Logique pour désactiver le code promo
                                  toast.info("Fonctionnalité à implémenter");
                                }}
                              >
                                Désactiver
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => {
                                  // Logique pour activer le code promo
                                  toast.info("Fonctionnalité à implémenter");
                                }}
                              >
                                Activer
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/users/${promoCode.user.id}`)}
                            >
                              Voir le profil client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                Aucun code promo ne correspond aux critères de recherche.
              </p>
              <Button onClick={() => setSearchTerm("")}>
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogue de confirmation d'annulation */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la réservation</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'annuler la réservation de{" "}
              <span className="font-medium">{selectedReservation?.user.name}</span> pour le{" "}
              {selectedReservation
                ? format(selectedReservation.date, "d MMMM yyyy", { locale: fr })
                : ""}{" "}
              à {selectedReservation?.startTime}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Raison de l'annulation</label>
              <Select
                value={cancelReason}
                onValueChange={setCancelReason}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une raison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weather">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Conditions météorologiques</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center">
                      <X className="h-4 w-4 mr-2 text-red-500" />
                      <span>Autre raison</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {cancelReason === "weather" && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Annulation météo
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Les heures seront automatiquement recréditées sur le code promo du client.
                        Un email de notification sera envoyé.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReservation}
            >
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}