import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const {
          data: { users: authUsers },
          error,
        } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        setUsers(
          authUsers.map((user) => ({
            id: user.id,
            email: user.email || 'N/A',
            role: user.role || 'user',
            created_at: new Date(user.created_at).toLocaleDateString(),
            last_sign_in_at: user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : 'Never',
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        role: newRole,
      });
      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;

        setUsers(users.filter((user) => user.id !== userId));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge>{user.role}</Badge>
              </TableCell>
              <TableCell>{user.created_at}</TableCell>
              <TableCell>{user.last_sign_in_at}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.id, 'admin')}
                    >
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.id, 'user')}
                    >
                      Make User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
