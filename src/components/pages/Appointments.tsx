import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  Name: string;
  Date: string;
  Time: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState({
    Name: '',
    Date: '',
    Time: '',
  });
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const ref = collection(db, 'appointments');
      const q = query(ref, where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Appointment, 'id'>),
      }));
      setAppointments(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit (Add or Update Appointment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editing) {
        const ref = doc(db, 'appointments', editing.id);
        await updateDoc(ref, { ...form });
        toast.success('Appointment updated successfully');
      } else {
        await addDoc(collection(db, 'appointments'), {
          ...form,
          userId: user.uid,
        });
        toast.success('Appointment added successfully');
      }

      setForm({ Name: '', Date: '', Time: '' }); // Reset form
      setEditing(null); // Reset editing
      setShowForm(false); // Hide form
      fetchAppointments(); // Refresh appointments list
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  // Handle Edit Appointment
  const handleEdit = (appt: Appointment) => {
    setEditing(appt);
    setForm({
      Name: appt.Name,
      Date: appt.Date,
      Time: appt.Time,
    });
    setShowForm(true);
  };

  // Handle Delete Appointment
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success('Appointment deleted');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-4 overflow-auto">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Appointments</CardTitle>
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            Add Appointment
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto mb-8">
              <div>
                <Label htmlFor="Date">Date</Label>
                <Input type="date" name="Date" value={form.Date} onChange={handleInput} required />
              </div>
              <div>
                <Label htmlFor="Time">Time</Label>
                <Input type="time" name="Time" value={form.Time} onChange={handleInput} required />
              </div>
              <div>
                <Label htmlFor="Name">Patient Name</Label>
                <Input type="text" name="Name" value={form.Name} onChange={handleInput} required />
              </div>
              <div className="flex gap-4">
                <Button type="submit">Save</Button>
                <Button type="button" variant="destructive" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {appointments.length === 0 ? (
            <p className="text-center text-gray-500">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Time</th>
                    <th className="p-2 border-b">Patient</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{a.Date}</td>
                      <td className="p-2 border-b">{a.Time}</td>
                      <td className="p-2 border-b">{a.Name}</td>
                      <td className="p-2 border-b space-x-2">
                        <Button size="sm" variant="destructive" onClick={() => handleEdit(a)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(a.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments; // Default export added
