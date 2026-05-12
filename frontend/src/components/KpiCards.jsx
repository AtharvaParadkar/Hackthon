import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock, XCircle, CheckCircle } from "lucide-react";
import { kpiData } from "@/data/mockData";
import { useEffect, useState } from "react";

const kpis = [
  { label: "KYC Complete", value: kpiData.kycComplete, icon: UserCheck, color: "text-success" },
  { label: "KYC Pending", value: kpiData.kycPending, icon: Clock, color: "text-warning" },
  { label: "Total Customers", value: kpiData.totalCustomers, icon: Users, color: "text-primary" },
  { label: "Claims Pending", value: kpiData.claimsPending, icon: Clock, color: "text-warning" },
  { label: "Claims Rejected", value: kpiData.claimsRejected, icon: XCircle, color: "text-destructive" },
  { label: "Claims Settled", value: kpiData.claimsSettled, icon: CheckCircle, color: "text-success" },
];

export function KpiCards() {
  const [statsSummary, setStatsSummary] = useState(null);

  useEffect(() => {
    const fetchStatsSummary = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/claim/stats/summary");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStatsSummary(data);
        console.log("Stats Summary Result:", data);
      } catch (error) {
        console.error("Failed to fetch claim stats summary:", error);
      }
    };

    fetchStatsSummary();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
