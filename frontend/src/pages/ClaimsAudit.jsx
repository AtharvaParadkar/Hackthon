import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { claims } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

function getRiskColor(score) {
  if (score >= 65) return "bg-destructive/15 text-destructive border-destructive/30";
  if (score >= 35) return "bg-warning/15 text-warning border-warning/30";
  return "bg-success/15 text-success border-success/30";
}

function getRiskLabel(score) {
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function getStatusColor(status) {
  if (status === "Pending") return "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20";
  if (status === "Settled") return "bg-success/15 text-success border-success/30 hover:bg-success/20";
  return "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20";
}

export default function ClaimsAudit() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = claims.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Claims Audit</h1>
        <p className="text-sm text-muted-foreground">Review and audit all insurance claims.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, name, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-28">Claim ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead className="w-24">Type</TableHead>
              <TableHead className="text-right w-32">Amount</TableHead>
              <TableHead className="w-28 text-center">Risk Score</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((claim) => (
              <TableRow
                key={claim.id}
                onClick={() => navigate(`/claims/${claim.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-mono text-xs font-medium text-primary">{claim.id}</TableCell>
                <TableCell className="font-medium">{claim.customerName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{claim.type}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">₹{claim.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`text-xs ${getRiskColor(claim.riskScore)}`}>
                    {getRiskLabel(claim.riskScore)} ({claim.riskScore})
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`text-xs ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
