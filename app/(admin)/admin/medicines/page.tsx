'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { toast } from 'sonner';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  sku: string;
  price: number;
  stock: number;
  active: boolean;
  prescriptionRequired: boolean;
  category: { name: string };
  brand?: { name: string };
  _count: { reviews: number; orderItems: number };
}

export default function MedicinesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<Medicine | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'PHARMACIST')) {
      router.push('/');
      return;
    }
    fetchMedicines();
  }, [user, router, page, search]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/medicines?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch medicines');

      const data = await response.json();
      setMedicines(data.medicines);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/medicines/${deleteDialog.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete medicine');
      }

      toast.success('Medicine deleted successfully');
      setDeleteDialog(null);
      fetchMedicines();
    } catch (error: any) {
      console.error('Error deleting medicine:', error);
      toast.error(error.message || 'Failed to delete medicine');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
          <p className="text-gray-600 mt-1">Manage your medicine inventory</p>
        </div>
        <Button
          onClick={() => router.push('/admin/medicines/new')}
          className="bg-gradient-to-r from-[#1E9972] to-[#175B64]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, generic name, or SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : medicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No medicines found
                </TableCell>
              </TableRow>
            ) : (
              medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.genericName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {medicine.sku}
                    </code>
                  </TableCell>
                  <TableCell>{medicine.category.name}</TableCell>
                  <TableCell>৳{medicine.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={medicine.stock < 10 ? 'destructive' : 'default'}>
                      {medicine.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={medicine.active ? 'default' : 'secondary'}>
                      {medicine.active ? 'Active' : 'Inactive'}
                    </Badge>
                    {medicine.prescriptionRequired && (
                      <Badge variant="outline" className="ml-2">Rx</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/medicines/${medicine.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/medicines/${medicine.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.role === 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog(medicine)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} medicines
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deleteDialog?.name}</strong>?
              This action cannot be undone.
            </p>
            {deleteDialog && deleteDialog._count.orderItems > 0 && (
              <p className="text-sm text-red-600 mt-2">
                Warning: This medicine has existing orders and cannot be deleted.
                Consider deactivating it instead.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteDialog ? deleteDialog._count.orderItems > 0 : false}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
