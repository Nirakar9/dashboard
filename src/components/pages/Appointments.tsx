import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AppointmentForm } from './AppointmentForm';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];

      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleAddClick = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleFormSubmit = async (
    appointment: Omit<Appointment, 'id'>,
    id?: string
  ) => {
    if (!user) return;

    try {
      if (id) {
        const ref = doc(db, 'appointments', id);
        await updateDoc(ref, appointment);
      } else {
        await addDoc(collection(db, 'appointments'), {
          ...appointment,
          userId: user.uid,
        });
      }
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  // Fix type mismatch for onSubmit prop of AppointmentForm
  const handleFormSubmitWrapper = (
    appointment: Omit<Appointment | null, 'id'>,
    id?: string
  ) => {
    return handleFormSubmit(appointment as Omit<Appointment, 'id'>, id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Appointments</CardTitle>
          <Button onClick={handleAddClick}>Add Appointment</Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {showForm ? (
            <div className="w-full max-w-md">
            <AppointmentForm
              appointment={editingAppointment}
              onCancel={() => setShowForm(false)}
              onSubmit={handleFormSubmitWrapper}
            />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-center w-full max-w-md">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto w-full max-w-3xl">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Time</th>
                    <th className="p-2 border-b">Patient Name</th>
                    <th className="p-2 border-b">Status</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td className="p-2 border-b">{a.date}</td>
                      <td className="p-2 border-b">{a.time}</td>
                      <td className="p-2 border-b">{a.patientName}</td>
                      <td className="p-2 border-b capitalize">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            a.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : a.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="p-2 border-b space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(a)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(a.id)}
                        >
                          Delete
                        </Button>
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
}