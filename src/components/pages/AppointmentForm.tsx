import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AppointmentFormProps {
  appointment: {
    id?: string;
    date: string;
    time: string;
    patientName: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  } | null;
  onSubmit: (appointment: Omit<AppointmentFormProps['appointment'], 'id'>, id?: string) => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onSubmit, onCancel }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [status, setStatus] = useState<'scheduled' | 'completed' | 'cancelled'>('scheduled');

  useEffect(() => {
    if (appointment) {
      setDate(appointment.date);
      setTime(appointment.time);
      setPatientName(appointment.patientName);
      setStatus(appointment.status);
    } else {
      setDate('');
      setTime('');
      setPatientName('');
      setStatus('scheduled');
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, time, patientName, status }, appointment?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="patientName">Patient Name</Label>
        <Input
          id="patientName"
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'scheduled' | 'completed' | 'cancelled')}
          className="block w-full rounded-md border border-gray-300 p-2"
          required
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <Button type="submit" className="w-full sm:w-auto">Save</Button>
        <Button type="button" variant="destructive" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
      </div>
    </form>
  );
};
