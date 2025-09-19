import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePatientsStore } from '../../store/patientsStore';
import { useAppointmentsStore } from '../../store/appointmentsStore';
import { useRecordsStore } from '../../store/recordsStore';
import { useUsersStore } from '../../store/usersStore';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Users, Calendar, FileText, Plus } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/helpers';

export const DoctorPanel: React.FC = () => {
  const { user } = useAuthStore();
  const { patients } = usePatientsStore();
  const { appointments } = useAppointmentsStore();
  const { records, addRecord } = useRecordsStore();
  const { users } = useUsersStore();
  
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [recordForm, setRecordForm] = useState({
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: ''
  });

  // Filter data for current doctor
  const doctorPatients = patients.filter(p => p.doctorId === user?.id);
  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  const doctorRecords = records.filter(r => r.doctorId === user?.id);

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = doctorAppointments.filter(a => a.date === today);

  // Get this week's appointments
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const thisWeekAppointments = doctorAppointments.filter(a => {
    const appointmentDate = new Date(a.date);
    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
  });
  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !user) return;

    addRecord({
      patientId: selectedPatient,
      doctorId: user.id,
      date: new Date().toISOString(),
      ...recordForm
    });

    setShowRecordModal(false);
    setSelectedPatient('');
    setRecordForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
  };

  const patientColumns = [
    { key: 'name', label: 'Patient Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'dateOfBirth', label: 'Date of Birth', render: (value: string) => formatDate(value) },
    { key: 'gender', label: 'Gender' },
    { key: 'address', label: 'Address' }
  ];

  const appointmentColumns = [
    { 
      key: 'patientId', 
      label: 'Patient',
      render: (value: string) => {
        const patient = patients.find(p => p.id === value);
        return patient?.name || 'Unknown';
      }
    },
    { key: 'date', label: 'Date', render: (value: string) => formatDate(value) },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' }
  ];

  const recordColumns = [
    { 
      key: 'patientId', 
      label: 'Patient',
      render: (value: string) => {
        const patient = patients.find(p => p.id === value);
        return patient?.name || 'Unknown';
      }
    },
    { key: 'date', label: 'Date', render: (value: string) => formatDate(value) },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'treatment', label: 'Treatment' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Panel</h1>
        <p className="text-gray-600">Welcome, Dr. {user?.name}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <Users className="h-12 w-12 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
              <p className="text-3xl font-bold text-blue-600">{doctorPatients.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Calendar className="h-12 w-12 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <p className="text-3xl font-bold text-green-600">{doctorAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <FileText className="h-12 w-12 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Records</h3>
              <p className="text-3xl font-bold text-purple-600">{doctorRecords.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Calendar className="h-12 w-12 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
              <p className="text-3xl font-bold text-orange-600">{todayAppointments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div className="mb-8">
        <Card title="Today's Appointments">
          {todayAppointments.length > 0 ? (
            <Table data={todayAppointments} columns={appointmentColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
          )}
        </Card>
      </div>

      {/* This Week's Appointments */}
      <div className="mb-8">
        <Card title="This Week's Appointments">
          {thisWeekAppointments.length > 0 ? (
            <Table data={thisWeekAppointments} columns={appointmentColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No appointments scheduled for this week</p>
          )}
        </Card>
      </div>

      {/* My Patients */}
      <div className="mb-8">
        <Card title="My Patients">
          {doctorPatients.length > 0 ? (
            <Table data={doctorPatients} columns={patientColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No patients assigned yet</p>
          )}
        </Card>
      </div>

      {/* My Appointments */}
      <div className="mb-8">
        <Card title="My Appointments">
          {doctorAppointments.length > 0 ? (
            <Table data={doctorAppointments} columns={appointmentColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
          )}
        </Card>
      </div>

      {/* Medical Records */}
      <div className="mb-8">
        <Card title="Medical Records">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              onClick={() => setShowRecordModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Record</span>
            </Button>
          </div>
          {doctorRecords.length > 0 ? (
            <Table data={doctorRecords} columns={recordColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No medical records yet</p>
          )}
        </Card>
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title="Add Medical Record"
        size="lg"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a patient</option>
              {doctorPatients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Diagnosis"
            value={recordForm.diagnosis}
            onChange={(e) => setRecordForm(prev => ({ ...prev, diagnosis: e.target.value }))}
            required
          />

          <Input
            label="Treatment"
            value={recordForm.treatment}
            onChange={(e) => setRecordForm(prev => ({ ...prev, treatment: e.target.value }))}
            required
          />

          <Input
            label="Prescription (Optional)"
            value={recordForm.prescription}
            onChange={(e) => setRecordForm(prev => ({ ...prev, prescription: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={recordForm.notes}
              onChange={(e) => setRecordForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Record
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowRecordModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};