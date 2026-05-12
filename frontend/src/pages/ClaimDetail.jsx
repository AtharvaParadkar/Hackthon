import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { claims } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, AlertTriangle, Copy, CheckCircle, RotateCcw, XCircle, ChevronDown, Globe, Key, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = claims.find((c) => c.id === id);
  const [showRevertArea, setShowRevertArea] = useState(false);
  const [revertNote, setRevertNote] = useState("");

  if (!claim) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Claim not found.</p>
      </div>
    );
  }

  const handleApprove = () => {
    toast.success(`Claim ${claim.id} approved successfully.`);
  };

  const handleRevert = () => {
    if (!showRevertArea) {
      setShowRevertArea(true);
      return;
    }
    toast.info(`Requested additional documents for ${claim.id}.`);
    setShowRevertArea(false);
    setRevertNote("");
  };

  const handleReject = (reason) => {
    toast.error(`Claim ${claim.id} rejected: ${reason}`);
  };

  return (
    <div className="space-y-4 pb-24">
      <button
        onClick={() => navigate("/claims")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Claims
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Claim {claim.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            {claim.customerName} · {claim.type} Insurance · Submitted {claim.dateSubmitted}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`text-sm px-3 py-1 ${
            claim.status === "Pending"
              ? "bg-warning/15 text-warning border-warning/30"
              : claim.status === "Settled"
              ? "bg-success/15 text-success border-success/30"
              : "bg-destructive/15 text-destructive border-destructive/30"
          }`}
        >
          {claim.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Claim Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Claim ID</dt>
                  <dd className="font-mono font-medium text-primary">{claim.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd className="font-medium">{claim.customerName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd><Badge variant="secondary">{claim.type}</Badge></dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-semibold">₹{claim.amount.toLocaleString("en-IN")}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Treatment Code</dt>
                  <dd className="font-mono text-xs">{claim.treatmentCode}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Date Submitted</dt>
                  <dd>{claim.dateSubmitted}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Description</dt>
                  <dd className="mt-1">{claim.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">Invoice_{claim.id}.pdf</p>
                  <p className="text-xs">Uploaded {claim.dateSubmitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Fraud Analysis */}
        <div className="space-y-4">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Behavioral Anomaly Spotted
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                This claim was filed from an IP in <strong>{claim.ipLocation}</strong>
                {claim.passwordChangedRecently && (
                  <>, <strong>2 hours after a password change</strong></>
                )}
                . {claim.riskScore >= 65 ? "High Risk." : claim.riskScore >= 35 ? "Medium Risk." : "Low Risk."}
              </p>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">IP:</span>
                  <span className="font-medium">{claim.ipLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Password Changed:</span>
                  <span className="font-medium">{claim.passwordChangedRecently ? "Yes" : "No"}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`${
                  claim.riskScore >= 65
                    ? "bg-destructive/15 text-destructive border-destructive/30"
                    : claim.riskScore >= 35
                    ? "bg-warning/15 text-warning border-warning/30"
                    : "bg-success/15 text-success border-success/30"
                }`}
              >
                Risk Score: {claim.riskScore}%
              </Badge>
            </CardContent>
          </Card>

          {claim.duplicateClaimId ? (
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-warning">
                  <Copy className="h-4 w-4" />
                  Semantic Match Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                  This invoice shows a <strong>{claim.duplicateMatchPercent}% match</strong> with a previous claim
                  (<span className="font-mono text-primary">{claim.duplicateClaimId}</span>) from 2024.
                  The <strong>Total Amount</strong> and <strong>Treatment Code</strong> match significantly.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border bg-card p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Current Invoice</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Claim ID</span>
                        <span className="font-mono font-medium">{claim.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-destructive">₹{claim.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Code</span>
                        <span className="font-mono text-destructive font-medium">{claim.treatmentCode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border bg-card p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Previous Invoice (2024)</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Claim ID</span>
                        <span className="font-mono font-medium">{claim.duplicateClaimId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-destructive">₹{claim.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Code</span>
                        <span className="font-mono text-destructive font-medium">{claim.treatmentCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="h-px flex-1 bg-warning/30" />
                  <span className="text-warning font-bold">{claim.duplicateMatchPercent}% Match</span>
                  <div className="h-px flex-1 bg-warning/30" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  No Duplicates Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  No semantically similar invoices were detected in the system. This claim appears to be unique.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Revert Text Area */}
      {showRevertArea && (
        <Card className="border-warning/30">
          <CardContent className="pt-4">
            <label className="text-sm font-medium text-foreground block mb-2">Request Additional Documents</label>
            <Textarea
              placeholder="Describe which documents are needed..."
              value={revertNote}
              onChange={(e) => setRevertNote(e.target.value)}
              className="mb-3"
            />
          </CardContent>
        </Card>
      )}

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-end gap-3">
          <Button
            onClick={handleApprove}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>

          <Button
            onClick={handleRevert}
            className="bg-warning hover:bg-warning/90 text-warning-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {showRevertArea ? "Send Request" : "Revert"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-1" />
                Reject
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleReject("Fraud Detected")}>
                Fraud Detected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReject("Duplicate Invoice")}>
                Duplicate Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReject("Incomplete KYC")}>
                Incomplete KYC
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
