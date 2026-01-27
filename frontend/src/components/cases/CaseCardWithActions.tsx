import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Upload, MoreVertical, Calendar, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  courtName: string;
  presidingJudge: string;
  evidenceCount: number;
}

interface CaseCardWithActionsProps {
  caseData: CaseData;
  role: "lawyer" | "judge" | "police";
}

export const CaseCardWithActions = ({ caseData, role }: CaseCardWithActionsProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hearing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = () => {
    navigate(`/cases/${caseData.id}`);
  };

  const handleUploadEvidence = () => {
    navigate(`/cases/${caseData.id}?tab=upload`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg border-l-4 border-l-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {caseData.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Case #{caseData.caseNumber}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewDetails}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {role === "lawyer" && (
                  <DropdownMenuItem onClick={handleUploadEvidence}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Evidence
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Status Badge */}
            <Badge
              variant="outline"
              className={`w-fit ${getStatusColor(caseData.status)}`}
            >
              {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
            </Badge>

            {/* Case Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{caseData.courtName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{caseData.presidingJudge}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{caseData.evidenceCount} Evidence{caseData.evidenceCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              {role === "lawyer" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUploadEvidence}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};