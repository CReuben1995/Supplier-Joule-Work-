import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  waveName: string;
  initialDate?: string;
  onConfirm: (isoDate: string) => void;
};

const todayIso = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export const ScheduleDialog = ({ open, onOpenChange, waveName, initialDate, onConfirm }: Props) => {
  const [date, setDate] = useState(initialDate ?? todayIso());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Schedule a readiness review</DialogTitle>
          <DialogDescription>
            Save <span className="font-medium text-foreground">{waveName}</span> as a draft and pick a date for Joule and your
            CSM to walk through it with you.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <label className="text-xs font-medium text-muted-foreground">Review date</label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            We'll send a calendar invite and resume the activity at 9:00 AM your local time.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm(date);
              onOpenChange(false);
            }}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
