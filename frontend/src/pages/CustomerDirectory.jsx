import { customers } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerDirectory() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Customer Directory</h1>
        <p className="text-sm text-muted-foreground">All registered customers and their KYC status.</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-center w-28">KYC Status</TableHead>
              <TableHead className="text-center w-20">Claims</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-mono text-xs font-medium text-primary">{customer.id}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{customer.phone}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      customer.kycStatus === "Complete"
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-warning/15 text-warning border-warning/30"
                    }`}
                  >
                    {customer.kycStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">{customer.claimsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
