'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: { medicines: number };
}

export default function BrandsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<Brand | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchBrands();
  }, [user, router]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/brands', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch brands');

      const data = await response.json();
      setBrands(data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create brand');

      toast.success('Brand created successfully');
      setCreateDialog(false);
      setFormData({ name: '', description: '' });
      fetchBrands();
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
    }
  };

  const handleUpdate = async () => {
    if (!editDialog) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/brands/${editDialog.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update brand');

      toast.success('Brand updated successfully');
      setEditDialog(null);
      setFormData({ name: '', description: '' });
      fetchBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/brands/${deleteDialog.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete brand');
      }

      toast.success('Brand deleted successfully');
      setDeleteDialog(null);
      fetchBrands();
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      toast.error(error.message || 'Failed to delete brand');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600 mt-1">Manage medicine brands</p>
        </div>
        <Button
          onClick={() => setCreateDialog(true)}
          className="bg-gradient-to-r from-[#1E9972] to-[#175B64]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Medicines</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {brand.description || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge>{brand._count.medicines}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditDialog(brand);
                          setFormData({
                            name: brand.name,
                            description: brand.description || '',
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog(brand)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Brand name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brand description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#1E9972] to-[#175B64]"
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Brand name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brand description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-[#1E9972] to-[#175B64]"
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deleteDialog?.name}</strong>?
            </p>
            {deleteDialog && deleteDialog._count.medicines > 0 && (
              <p className="text-sm text-red-600 mt-2">
                Warning: This brand has {deleteDialog._count.medicines} medicine(s) and cannot be deleted.
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
              disabled={deleteDialog ? deleteDialog._count.medicines > 0 : false}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
