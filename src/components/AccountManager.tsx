import React, { useState, useEffect } from 'react';
import { Mail, Shield, Server, Hash, Folder, X, AlertCircle, Save, Plus, Edit2, Trash2 } from 'lucide-react';
import { Account } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface AccountManagerProps {
  accounts: Account[];
  onAdd: (account: Omit<Account, 'id'>) => void;
  onUpdate: (id: number, account: Omit<Account, 'id'>) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

export default function AccountManager({ accounts, onAdd, onUpdate, onDelete, onCancel }: AccountManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(accounts.length === 0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    host: '',
    port: '993',
    secure: true,
    folder_name: ''
  });
  const [error, setError] = useState<string | null>(null);

  const startEdit = (acc: Account) => {
    setEditingId(acc.id);
    setFormData({
      email: acc.email,
      password: '',
      host: acc.host,
      port: acc.port.toString(),
      secure: acc.secure,
      folder_name: acc.folder_name
    });
    setIsFormVisible(true);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({
      email: '',
      password: '',
      host: '',
      port: '993',
      secure: true,
      folder_name: ''
    });
    setIsFormVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || (!formData.password && !editingId) || !formData.host || !formData.folder_name) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (editingId) {
      onUpdate(editingId, {
        ...formData,
        port: parseInt(formData.port),
        secure: formData.secure
      });
      setIsFormVisible(false);
      setEditingId(null);
    } else {
      onAdd({
        ...formData,
        port: parseInt(formData.port),
        secure: formData.secure
      });
      setIsFormVisible(false);
    }
  };

  return (
    <div className="flex-1 bg-zinc-50 flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Settings Workspace</h1>
            <p className="text-sm text-zinc-500">Manage your connected inboxes and configuration.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!isFormVisible ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>You have {accounts.length} connected inboxes.</CardDescription>
              </div>
              <Button onClick={startAdd} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-semibold text-zinc-900">{acc.folder_name}</h3>
                    <p className="text-sm text-zinc-500">{acc.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(acc)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(acc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Account' : 'Add Email Account'}</CardTitle>
              <CardDescription>Configure your IMAP connection settings.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest">Identity & Folder</h4>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="hello@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>App Password {editingId && <span className="text-zinc-400 font-normal">(Leave blank to keep unchanged)</span>}</Label>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Folder Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Work Mail"
                        value={formData.folder_name}
                        onChange={(e) => setFormData({ ...formData, folder_name: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest">Server Settings</h4>
                    <div className="space-y-2">
                      <Label>IMAP Server (Host)</Label>
                      <Input
                        type="text"
                        placeholder="imap.gmail.com"
                        value={formData.host}
                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        type="number"
                        placeholder="993"
                        value={formData.port}
                        onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="secure"
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        checked={formData.secure}
                        onChange={(e) => setFormData({ ...formData, secure: e.target.checked })}
                      />
                      <Label htmlFor="secure" className="font-normal cursor-pointer">Use Secure Connection (SSL/TLS)</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-zinc-50 pt-6">
                <Button type="button" variant="ghost" onClick={() => {
                  if (accounts.length > 0) {
                    setIsFormVisible(false);
                  } else {
                    onCancel();
                  }
                }}>Cancel</Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Save Changes' : 'Add Account'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
