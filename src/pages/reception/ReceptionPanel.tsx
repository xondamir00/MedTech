import React, { useState } from 'react';
import { usePatientsStore } from '../../store/patientsStore';
import { useAppointmentsStore } from '../../store/appointmentsStore';
import { useUsersStore } from '../../store/usersStore';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Users, Calendar, Plus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

// ✅ Tiplar
interface PatientForm {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  doctorId: string;
}

interface AppointmentForm {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  notes: string;
}

export const ReceptionPanel: React.FC = () => {
  const { patients, addPatient } = usePatientsStore();
  const { appointments, addAppointment } = useAppointmentsStore();
  const { users } = useUsersStore();
  
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  
  const [patientForm, setPatientForm] = useState<PatientForm>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    doctorId: ''
  });

  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  const doctors = users.filter(user => user.role === 'doctor');

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient(patientForm);
    setShowPatientModal(false);
    setPatientForm({
      name: '', email: '', phone: '', dateOfBirth: '', gender: 'male', address: '', doctorId: ''
    });
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      ...appointmentForm,
      status: 'scheduled' as const
    });
    setShowAppointmentModal(false);
    setAppointmentForm({
      patientId: '', doctorId: '', date: '', time: '', type: '', notes: ''
    });
  };

  const patientColumns = [
    { key: 'name', label: 'Patient Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'dateOfBirth', label: 'Date of Birth', render: (value: string) => formatDate(value) },
    { key: 'gender', label: 'Gender' },
    { key: 'address', label: 'Address' },
    {
      key: 'doctorId',
      label: 'Doctor',
      render: (value: string) => {
        const doctor = users.find(u => u.id === value);
        return doctor ? `Dr. ${doctor.name}` : 'Not Assigned';
      }
    }
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
    { 
      key: 'doctorId', 
      label: 'Doctor',
      render: (value: string) => {
        const doctor = users.find(u => u.id === value);
        return doctor ? `Dr. ${doctor.name}` : 'Unknown';
      }
    },
    { key: 'date', label: 'Date', render: (value: string) => formatDate(value) },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reception Panel</h1>
        <p className="text-gray-600">Manage patients and appointments</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <Users className="h-12 w-12 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Patients</h3>
              <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Calendar className="h-12 w-12 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Appointments</h3>
              <p className="text-3xl font-bold text-green-600">{appointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Users className="h-12 w-12 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Doctors</h3>
              <p className="text-3xl font-bold text-purple-600">{doctors.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Doctors */}
      <div className="mb-8">
        <Card title="Available Doctors">
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doctor => {
                const doctorPatients = patients.filter(p => p.doctorId === doctor.id);
                const doctorAppointments = appointments.filter(a => a.doctorId === doctor.id);
                
                return (
                  <div key={doctor.id} className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900">Dr. {doctor.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{doctor.email}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600">{doctorPatients.length} Patients</span>
                      <span className="text-green-600">{doctorAppointments.length} Appointments</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No doctors available</p>
          )}
        </Card>
      </div>

      {/* Patients Section */}
      <div className="mb-8">
        <Card title="Patients">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              onClick={() => setShowPatientModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Patient</span>
            </Button>
          </div>
          {patients.length > 0 ? (
            <Table data={patients} columns={patientColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No patients registered yet</p>
          )}
        </Card>
      </div>

      {/* Appointments Section */}
      <div className="mb-8">
        <Card title="Appointments">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              onClick={() => setShowAppointmentModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Schedule Appointment</span>
            </Button>
          </div>
          {appointments.length > 0 ? (
            <Table data={appointments} columns={appointmentColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No appointments scheduled yet</p>
          )}
        </Card>
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Add New Patient"
        size="lg"
      >
        <form onSubmit={handlePatientSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={patientForm.name}
            onChange={(e) => setPatientForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            label="Email"
            type="email"
            value={patientForm.email}
            onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <Input
            label="Phone"
            value={patientForm.phone}
            onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            value={patientForm.dateOfBirth}
            onChange={(e) => setPatientForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={patientForm.gender}
              onChange={(e) => setPatientForm(prev => ({ ...prev, gender: e.target.value as PatientForm['gender'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Input
            label="Address"
            value={patientForm.address}
            onChange={(e) => setPatientForm(prev => ({ ...prev, address: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Doctor
            </label>
            <select
              value={patientForm.doctorId}
              onChange={(e) => setPatientForm(prev => ({ ...prev, doctorId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Patient
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowPatientModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Schedule Appointment"
        size="lg"
      >
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient
            </label>
            <select
              value={appointmentForm.patientId}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, patientId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <select
              value={appointmentForm.doctorId}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, doctorId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={appointmentForm.date}
            onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <Input
            label="Time"
            type="time"
            value={appointmentForm.time}
            onChange={(e) => setAppointmentForm(prev => ({ ...prev, time: e.target.value }))}
            required
          />

          <Input
            label="Appointment Type"
            value={appointmentForm.type}
            onChange={(e) => setAppointmentForm(prev => ({ ...prev, type: e.target.value }))}
            placeholder="e.g., Consultation, Follow-up, Check-up"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={appointmentForm.notes}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Schedule Appointment
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowAppointmentModal(false)}
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
