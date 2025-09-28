import { useState } from 'react';
import { ArrowLeft, Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailySales } from '@/components/Reports/DailySales';
import { MonthlySales } from '@/components/Reports/MonthlySales';

type ReportType = 'overview' | 'daily' | 'monthly';

const Reports = () => {
  const [currentView, setCurrentView] = useState<ReportType>('overview');

  const renderContent = () => {
    switch (currentView) {
      case 'daily':
        return <DailySales />;
      case 'monthly':
        return <MonthlySales />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Sales Reports</h1>
              <p className="font-urdu text-xl text-muted-foreground mt-2">فروخت کی رپورٹس</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('daily')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">Daily Sales</CardTitle>
                      <p className="font-urdu text-muted-foreground">یومیہ فروخت</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View daily sales reports, revenue, and most sold items for any specific date.
                  </p>
                  <p className="font-urdu text-sm text-muted-foreground mt-2">
                    کسی بھی مخصوص تاریخ کے لیے یومیہ فروخت، آمدنی اور سب سے زیادہ فروخت ہونے والی اشیاء دیکھیں۔
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('monthly')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">Monthly Sales</CardTitle>
                      <p className="font-urdu text-muted-foreground">ماہانہ فروخت</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View monthly sales reports, total revenue, and analytics for any month.
                  </p>
                  <p className="font-urdu text-sm text-muted-foreground mt-2">
                    کسی بھی مہینے کے لیے ماہانہ فروخت، کل آمدنی اور تجزیات دیکھیں۔
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
        {currentView !== 'overview' && (
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('overview')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;