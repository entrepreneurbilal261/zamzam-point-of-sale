import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CalendarDays, Receipt, Store, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailySales } from '@/components/Reports/DailySales';
import { MonthlySales } from '@/components/Reports/MonthlySales';
import { TodayOrders } from '@/components/Reports/TodayOrders';
import { ProfitLoss } from '@/components/Reports/ProfitLoss';

type ReportType = 'overview' | 'today' | 'daily' | 'monthly' | 'pnl';

const Reports = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ReportType>('today'); // Default to today's orders

  const renderContent = () => {
    switch (currentView) {
      case 'today':
        return <TodayOrders />;
      case 'daily':
        return <DailySales />;
      case 'monthly':
        return <MonthlySales />;
      case 'pnl':
        return <ProfitLoss />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-lg font-bold">Sales Reports</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('today')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Receipt className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">Today's Orders</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View all orders placed today with detailed item breakdown.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('daily')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">Daily Sales</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View daily sales reports, revenue, and most sold items for any specific date.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('monthly')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">Monthly Sales</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View monthly sales reports, total revenue, and analytics for any month.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('pnl')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">Profit & Loss</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Daily, weekly, and monthly P&L with revenue, expenses, profit, and charts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {currentView !== 'overview' && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('overview')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Button>
            )}
          </div>
          <Button 
            variant="default" 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90"
          >
            <Store className="h-4 w-4 mr-2" />
            Back to POS
          </Button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;