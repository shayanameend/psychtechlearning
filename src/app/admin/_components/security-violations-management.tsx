"use client";

import { ViolationType } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { format } from "date-fns";
import { AlertTriangle, Ban, Shield, Unlock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { paths } from "~/routes/paths";

interface SecurityViolation {
  id: string;
  type: ViolationType;
  description: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    isBlocked: boolean;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

interface UserViolationSummary {
  id: string;
  email: string;
  isBlocked: boolean;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
  _count: {
    securityViolations: number;
  };
}

async function fetchSecurityViolations() {
  const token = localStorage.getItem("token");
  const response = await axios.get(paths.api.admin.securityViolations(), {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
}

async function unblockUser(userId: string) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    paths.api.admin.users.unblock(),
    { userId },
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response.data;
}

export function SecurityViolationsManagement() {
  const [selectedUser, setSelectedUser] = useState<UserViolationSummary | null>(
    null,
  );
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-security-violations"],
    queryFn: fetchSecurityViolations,
  });

  const unblockMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: (data) => {
      toast.success(data.info.message);
      setShowUnblockDialog(false);
      setSelectedUser(null);
      refetch();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.info?.message || "Failed to unblock user",
        );
      }
    },
  });

  const getViolationTypeIcon = (type: ViolationType) => {
    switch (type) {
      case ViolationType.COPY_PASTE:
        return "📋";
      case ViolationType.SCREENSHOT:
        return "📸";
      case ViolationType.CONTEXT_MENU:
        return "🖱️";
      case ViolationType.DEVELOPER_TOOLS:
        return "🔧";
      default:
        return "⚠️";
    }
  };

  const getViolationTypeLabel = (type: ViolationType) => {
    switch (type) {
      case ViolationType.COPY_PASTE:
        return "Copy/Paste";
      case ViolationType.SCREENSHOT:
        return "Screenshot";
      case ViolationType.CONTEXT_MENU:
        return "Context Menu";
      case ViolationType.DEVELOPER_TOOLS:
        return "Developer Tools";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  const violations: SecurityViolation[] = data?.data?.violations || [];
  const userSummaries: UserViolationSummary[] =
    data?.data?.userViolationSummary || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users Overview</TabsTrigger>
          <TabsTrigger value="violations">Recent Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users with Security Violations</CardTitle>
              <CardDescription>
                Overview of users who have triggered security violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSummaries.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {user._count.securityViolations}
                        </p>
                        <p className="text-xs text-gray-500">Violations</p>
                      </div>

                      {user.isBlocked ? (
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4 text-red-500" />
                          <span className="text-red-600 font-medium">
                            Blocked
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUnblockDialog(true);
                            }}
                          >
                            <Unlock className="h-4 w-4 mr-1" />
                            Unblock
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {userSummaries.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No security violations recorded yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Violations</CardTitle>
              <CardDescription>
                Detailed log of all security violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div key={violation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {getViolationTypeIcon(violation.type)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getViolationTypeLabel(violation.type)}
                            </span>
                            {violation.user.isBlocked && (
                              <Ban className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {violation.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {violation.user.profile?.firstName}{" "}
                              {violation.user.profile?.lastName}
                            </span>
                            <span>{violation.user.email}</span>
                            <span>
                              {format(
                                new Date(violation.createdAt),
                                "MMM dd, yyyy 'at' HH:mm",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {violations.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No violations recorded yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Unblock User Dialog */}
      <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to unblock this user account? They will
              regain access to the platform.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">
                  {selectedUser.profile?.firstName}{" "}
                  {selectedUser.profile?.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-red-600 mt-1">
                  {selectedUser._count.securityViolations} security violations
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnblockDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedUser && unblockMutation.mutate(selectedUser.id)
              }
              disabled={unblockMutation.isPending}
            >
              {unblockMutation.isPending ? "Unblocking..." : "Unblock User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
