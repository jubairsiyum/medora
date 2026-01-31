'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Filter, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Prescription {
  id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  image: string;
  status: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  order?: {
    orderNumber: string;
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function PrescriptionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const limit = 20;

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'PHARMACIST')) {
      router.push('/');
      return;
    }
    fetchPrescriptions();
  }, [user, router, page, statusFilter]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/prescriptions?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch prescriptions');

      const data = await response.json();
      setPrescriptions(data.prescriptions);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const updatePrescriptionStatus = async (status: string) => {
    if (!selectedPrescription) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/prescriptions/${selectedPrescription.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!response.ok) throw new Error('Failed to update prescription');

      toast.success('Prescription updated successfully');
      setSelectedPrescription(null);
      setAdminNotes('');
      fetchPrescriptions();
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast.error('Failed to update prescription');
    } finally {
      setUpdating(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Review and approve customer prescriptions</p>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : prescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No prescriptions found
                </TableCell>
              </TableRow>
            ) : (
              prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>
                    <p className="font-medium">{prescription.user.name}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{prescription.user.email}</p>
                      <p className="text-gray-600">{prescription.user.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[prescription.status]}>
                      {prescription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(prescription.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {prescription.order ? (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {prescription.order.orderNumber}
                      </code>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPrescription(prescription);
                        setAdminNotes(prescription.adminNotes || '');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} prescriptions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {selectedPrescription.user.name}</p>
                  <p><strong>Email:</strong> {selectedPrescription.user.email}</p>
                  <p><strong>Phone:</strong> {selectedPrescription.user.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Prescription Image</h3>
                <img
                  src={selectedPrescription.image}
                  alt="Prescription"
                  className="w-full border rounded-lg"
                />
              </div>

              {selectedPrescription.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Customer Notes</h3>
                  <p className="text-sm text-gray-600">{selectedPrescription.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Admin Notes</h3>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for the customer..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPrescription(null)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updatePrescriptionStatus('REJECTED')}
                  disabled={updating || selectedPrescription.status !== 'PENDING'}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => updatePrescriptionStatus('APPROVED')}
                  disabled={updating || selectedPrescription.status !== 'PENDING'}
                  className="bg-gradient-to-r from-[#1E9972] to-[#175B64]"
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
