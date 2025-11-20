import { Receipt } from "@/types/pos";
import { shopInfo } from "@/data/menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PrinterIcon, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal = ({ receipt, isOpen, onClose }: ReceiptModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const hasPrintedRef = useRef(false);

  useEffect(() => {
    // Auto-print when modal opens
    if (isOpen && receipt && !hasPrintedRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.print();
        hasPrintedRef.current = true;
      }, 500);
    }
    
    // Reset print flag when modal closes
    if (!isOpen) {
      hasPrintedRef.current = false;
    }
  }, [isOpen, receipt]);

  const handlePrint = () => {
    window.print();
  };

  if (!receipt) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="font-urdu text-xl">رسید</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div ref={printRef} className="receipt-content bg-white text-black p-6 rounded-lg print-receipt">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {shopInfo.name}
            </h1>
            <p className="font-urdu text-xl font-bold text-primary mb-2">
              {shopInfo.nameUrdu}
            </p>
            <p className="text-sm text-gray-600">Phone: {shopInfo.phone}</p>
            <p className="text-xs text-gray-500 font-urdu">{shopInfo.addressUrdu}</p>
          </div>

          <Separator className="mb-4" />

          {/* Receipt Info */}
          <div className="mb-4 text-sm">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-mono">{receipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDate(receipt.date)}</span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Items */}
          <div className="mb-4">
            {receipt.items.map((item, index) => (
              <div key={index} className="mb-3 pb-2 border-b border-gray-200 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="font-urdu text-primary text-sm">{item.nameUrdu}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500">
                        Size: {item.size === 'small' ? 'چھوٹا' : 
                               item.size === 'medium' ? 'درمیانہ' : 'بڑا'}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm">
                      {item.quantity} x PKR {item.price}
                    </p>
                    <p className="font-bold">PKR {item.quantity * item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="mb-4" />

          {/* Total */}
          <div className="text-center">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="font-urdu">کل رقم:</span>
              <span className="text-primary">PKR {receipt.total}</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p className="font-urdu mb-1">آپ کا شکریہ!</p>
            <p>Thank you for visiting Zam Zam Ice Bar!</p>
            <p className="font-urdu mt-2">مفت ہوم ڈیلیوری دستیاب</p>
          </div>
        </div>

        {/* Print Actions */}
        <div className="flex gap-2 mt-4">
          <Button onClick={handlePrint} className="flex-1">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>

        <style>
          {`
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              
              body * {
                visibility: hidden;
              }
              
              .print-receipt,
              .print-receipt * {
                visibility: visible;
              }
              
              .print-receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
                max-width: 80mm;
                padding: 10mm;
                margin: 0;
                background: white;
                font-size: 12pt;
                line-height: 1.4;
              }
              
              .print-receipt h1 {
                font-size: 18pt;
                margin-bottom: 5mm;
              }
              
              .print-receipt h2,
              .print-receipt .text-xl {
                font-size: 14pt;
              }
              
              .print-receipt .text-sm {
                font-size: 10pt;
              }
              
              .print-receipt .text-xs {
                font-size: 8pt;
              }
              
              .print-receipt button,
              .print-receipt [role="dialog"] > *:not(.print-receipt) {
                display: none !important;
              }
              
              /* Hide dialog overlay in print */
              [role="dialog"],
              [data-radix-dialog-content] {
                position: static !important;
                transform: none !important;
                max-width: 80mm !important;
                width: 80mm !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
              }
            }
          `}
        </style>
      </DialogContent>
    </Dialog>
  );
};