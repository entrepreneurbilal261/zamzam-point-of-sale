import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getShopInfo, saveShopInfo, ShopInfo } from '@/lib/shopSettings';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const info = getShopInfo();
    setName(info.name);
    setPhone(info.phone);
    setAddress(info.address);
  }, []);

  const handleSave = () => {
    saveShopInfo({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    toast({ title: 'Saved', description: 'Shop details updated. They will appear on the POS and receipts.' });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POS
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-5 w-5" />
              Shop details
            </CardTitle>
            <p className="text-sm text-muted-foreground">These appear on the POS header and on printed receipts.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Shop name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zam Zam Pizza Hut" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0370-9191370" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Burewala - Free Home Delivery" className="mt-1" />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
