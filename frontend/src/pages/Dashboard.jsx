import { KpiCards } from "@/components/KpiCards";
import { claims } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const recentClaims = claims.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of insurance operations and audit metrics.</p>
      </div>

      <KpiCards />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Claims</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentClaims.map((claim) => (
              <div
                key={claim.id}
                onClick={() => navigate(`/claims/${claim.id}`)}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{claim.customerName}</p>
                  <p className="text-xs text-muted-foreground">{claim.id} · {claim.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">₹{claim.amount.toLocaleString("en-IN")}</span>
                  <Badge
                    className={
                      claim.status === "Pending"
                        ? "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20"
                        : claim.status === "Settled"
                        ? "bg-success/15 text-success border-success/30 hover:bg-success/20"
                        : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20"
                    }
                    variant="outline"
                  >
                    {claim.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">High Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {claims
              .filter((c) => c.riskScore >= 65)
              .map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => navigate(`/claims/${claim.id}`)}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{claim.customerName}</p>
                    <p className="text-xs text-muted-foreground">{claim.id}</p>
                  </div>
                  <Badge className="bg-destructive/15 text-destructive border-destructive/30" variant="outline">
                    Risk: {claim.riskScore}%
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
