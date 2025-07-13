import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getActionEmoji, getActionBadgeVariant } from '@/lib/utils';

export default function ItemDetailDialog({ open, onOpenChange, selectedItem }) {
  if (!selectedItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {selectedItem.item?.item_name}
            <Badge variant="outline" className="ml-2">
              {selectedItem.item?.item_id}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed view with AI recommendations and sustainability metrics
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <Badge variant="outline" className="ml-2">
                    {selectedItem.item?.category}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Current Stock:</span>
                  <span className="ml-2">{selectedItem.item?.current_stock}</span>
                </div>
                <div>
                  <span className="font-medium">Days Remaining:</span>
                  <span className="ml-2">{selectedItem.item?.days_remaining}</span>
                </div>
                <div>
                  <span className="font-medium">Risk Score:</span>
                  <span className="ml-2">{selectedItem.item?.risk_score}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant={getActionBadgeVariant(selectedItem.item?.recommended_action)} className="mb-2">
                  {getActionEmoji(selectedItem.item?.recommended_action)} {selectedItem.item?.recommended_action}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedItem.item?.tactical_note}
                </p>
              </div>
              <div className="text-sm">
                <span className="font-medium">Confidence:</span>
                <span className="ml-2">{selectedItem.item?.confidence}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sustainability Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">CO₂ Saved:</span>
                  <span className="ml-2 text-green-600 font-semibold">
                    {selectedItem.item?.co2_saved_kg} kg
                  </span>
                </div>
                <div>
                  <span className="font-medium">Water Saved:</span>
                  <span className="ml-2 text-blue-600 font-semibold">
                    {selectedItem.item?.water_saved_liters} L
                  </span>
                </div>
                <div>
                  <span className="font-medium">Meals Saved:</span>
                  <span className="ml-2 text-orange-600 font-semibold">
                    {selectedItem.item?.meals_saved}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Sustainability Score:</span>
                  <span className="ml-2">{selectedItem.item?.sustainability_score}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem.logs && selectedItem.logs.length > 0 ? (
                <div className="space-y-2">
                  {selectedItem.logs.slice(0, 5).map((log, index) => (
                    <div key={index} className="text-sm border-l-2 border-gray-200 pl-3">
                      <div className="font-medium">{log.action_type}</div>
                      <div className="text-gray-600">{log.reason}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent actions</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 