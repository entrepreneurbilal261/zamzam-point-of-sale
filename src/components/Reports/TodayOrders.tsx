import { useState, useEffect } from 'react';
import { Calendar, Receipt, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupabaseReceipts } from '@/hooks/useSupabaseReceipts';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TodayOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getTodayReceipts } = useSupabaseReceipts();

  const fetchTodayOrders = async () => {
    setIsLoading(true);
    const receipts = await getTodayReceipts();
    setOrders(receipts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTodayOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-base font-bold">Today&apos;s Orders</h2>
        <Button variant="outline" size="sm" onClick={fetchTodayOrders} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-blue-600">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-green-600">PKR {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders for {format(new Date(), 'MMMM dd, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No orders found for today</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                  const orderDate = new Date(order.date || order.created_at);
                  
                  return (
                    <Card key={order.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm">Receipt #{order.receipt_number || order.id}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {format(orderDate, 'hh:mm a')}
                              </span>
                            </div>
                          </div>
                          <Badge variant="default" className="text-xs px-2 py-0.5">
                            PKR {order.total.toFixed(2)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {items.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm">
                                  PKR {(item.price * item.quantity).toFixed(2)}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {item.quantity} × PKR {item.price}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.customer_name && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              Customer: <span className="font-medium">{order.customer_name}</span>
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

