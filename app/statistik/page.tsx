"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
} from "lucide-react";

// Demo-Daten
const DEMO_USERS = [
  { id: "1", name: "Max Mustermann", role: "Disposition" },
  { id: "2", name: "Anna Schmidt", role: "Fahrer" },
  { id: "3", name: "Tom Weber", role: "Disposition" },
  { id: "4", name: "Lisa Müller", role: "Buchhaltung" },
];

const DEMO_MONTHLY_DATA = [
  { monat: "Jan", erstellt: 45, bearbeitet: 38, geschlossen: 42 },
  { monat: "Feb", erstellt: 52, bearbeitet: 48, geschlossen: 50 },
  { monat: "Mär", erstellt: 48, bearbeitet: 45, geschlossen: 46 },
  { monat: "Apr", erstellt: 61, bearbeitet: 55, geschlossen: 58 },
  { monat: "Mai", erstellt: 55, bearbeitet: 52, geschlossen: 54 },
  { monat: "Jun", erstellt: 67, bearbeitet: 62, geschlossen: 65 },
];

const DEMO_STATUS_DATA = [
  { name: "Erstellt", value: 328, color: "#3b82f6" },
  { name: "Bearbeitet", value: 300, color: "#f59e0b" },
  { name: "Geschlossen", value: 315, color: "#10b981" },
];

const DEMO_WEEKLY_DATA = [
  { tag: "Mo", auftraege: 12 },
  { tag: "Di", auftraege: 15 },
  { tag: "Mi", auftraege: 18 },
  { tag: "Do", auftraege: 14 },
  { tag: "Fr", auftraege: 20 },
  { tag: "Sa", auftraege: 8 },
  { tag: "So", auftraege: 5 },
];

const DEMO_PERFORMANCE_DATA = [
  { monat: "Jan", durchlaufzeit: 4.2, kundenzufriedenheit: 4.5 },
  { monat: "Feb", durchlaufzeit: 3.8, kundenzufriedenheit: 4.6 },
  { monat: "Mär", durchlaufzeit: 3.5, kundenzufriedenheit: 4.7 },
  { monat: "Apr", durchlaufzeit: 3.2, kundenzufriedenheit: 4.8 },
  { monat: "Mai", durchlaufzeit: 3.0, kundenzufriedenheit: 4.9 },
  { monat: "Jun", durchlaufzeit: 2.8, kundenzufriedenheit: 4.9 },
];

// Nur Chart-Typen, die im ersten Chart unterstützt sind
type ChartType = "bar" | "line" | "area";

export default function StatistikPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Lade Statistiken...</div>
        </div>
      </div>
    );
  }

  const selectedUserData = DEMO_USERS.find((u) => u.id === selectedUser);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Benutzer-Statistiken
          </h1>
          <p className="text-muted-foreground mt-1">
            Detaillierte Analyse der Benutzeraktivitäten
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportieren
        </Button>
      </div>

      {/* Filter & Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Ansicht</CardTitle>
          <CardDescription>
            Wählen Sie Benutzer, Zeitraum und Diagrammtyp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Benutzer</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Benutzer wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Benutzer</SelectItem>
                  {DEMO_USERS.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zeitraum</Label>
              <Select
                value={timeRange}
                onValueChange={(v) => setTimeRange(v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Diese Woche</SelectItem>
                  <SelectItem value="month">Dieser Monat</SelectItem>
                  <SelectItem value="year">Dieses Jahr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Diagrammtyp</Label>
              <Select
                value={chartType}
                onValueChange={(v) => setChartType(v as ChartType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Balkendiagramm</SelectItem>
                  <SelectItem value="line">Liniendiagramm</SelectItem>
                  <SelectItem value="area">Flächendiagramm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zeitraum wählen</Label>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Benutzerdefiniert
              </Button>
            </div>
          </div>

          {selectedUserData && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {selectedUserData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{selectedUserData.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUserData.role}
                </p>
              </div>
              <Badge variant="secondary">{selectedUserData.role}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aufträge erstellt
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% zum Vormonat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aufträge bearbeitet
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +8% zum Vormonat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aufträge geschlossen
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">315</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15% zum Vormonat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Durchschnittliche Bearbeitungszeit
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8 Tage</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              -0.4 Tage zum Vormonat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="cursor-pointer">
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="activity" className="cursor-pointer">
            Aktivität
          </TabsTrigger>
          <TabsTrigger value="performance" className="cursor-pointer">
            Performance
          </TabsTrigger>
          <TabsTrigger value="comparison" className="cursor-pointer">
            Vergleich
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monatliche Auftragsübersicht</CardTitle>
                <CardDescription>
                  Erstellt, bearbeitet und geschlossen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    {chartType === "bar" ? (
                      <BarChart
                        data={DEMO_MONTHLY_DATA}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis dataKey="monat" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="erstellt"
                          fill="#3b82f6"
                          name="Erstellt"
                        />
                        <Bar
                          dataKey="bearbeitet"
                          fill="#f59e0b"
                          name="Bearbeitet"
                        />
                        <Bar
                          dataKey="geschlossen"
                          fill="#10b981"
                          name="Geschlossen"
                        />
                      </BarChart>
                    ) : chartType === "line" ? (
                      <LineChart
                        data={DEMO_MONTHLY_DATA}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis dataKey="monat" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="erstellt"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Erstellt"
                        />
                        <Line
                          type="monotone"
                          dataKey="bearbeitet"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Bearbeitet"
                        />
                        <Line
                          type="monotone"
                          dataKey="geschlossen"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Geschlossen"
                        />
                      </LineChart>
                    ) : (
                      <AreaChart
                        data={DEMO_MONTHLY_DATA}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis dataKey="monat" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="erstellt"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Erstellt"
                        />
                        <Area
                          type="monotone"
                          dataKey="bearbeitet"
                          stackId="1"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.6}
                          name="Bearbeitet"
                        />
                        <Area
                          type="monotone"
                          dataKey="geschlossen"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Geschlossen"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status-Verteilung</CardTitle>
                <CardDescription>Gesamtanzahl nach Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Pie
                        data={DEMO_STATUS_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        dataKey="value"
                      >
                        {DEMO_STATUS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wöchentliche Aktivität</CardTitle>
              <CardDescription>Aufträge pro Wochentag</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={DEMO_WEEKLY_DATA}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="tag" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="auftraege" fill="#3b82f6" name="Aufträge" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance-Metriken</CardTitle>
              <CardDescription>
                Durchlaufzeit und Kundenzufriedenheit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={DEMO_PERFORMANCE_DATA}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="monat" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      className="text-xs"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="durchlaufzeit"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Durchlaufzeit (Tage)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="kundenzufriedenheit"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Kundenzufriedenheit (★)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benutzervergleich</CardTitle>
              <CardDescription>
                Leistungsvergleich aller Benutzer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_USERS.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {45 + index * 12} Aufträge
                        </p>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${60 + index * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
