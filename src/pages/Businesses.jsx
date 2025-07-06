import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import BusinessModal from '../components/BusinessModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [councils, setCouncils] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, business: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [businessesRes, councilsRes, sectorsRes] = await Promise.all([
        api.get('/businesses'),
        api.get('/councils'),
        api.get('/sectors')
      ]);
      
      setBusinesses(businessesRes.data);
      setCouncils(councilsRes.data);
      setSectors(sectorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBusiness(null);
    setIsModalOpen(true);
  };

  const handleEdit = (business) => {
    setEditingBusiness(business);
    setIsModalOpen(true);
  };

  const handleDelete = (business) => {
    setDeleteModal({ isOpen: true, business });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/businesses/${deleteModal.business._id}`);
      setBusinesses(businesses.filter(b => b._id !== deleteModal.business._id));
      setDeleteModal({ isOpen: false, business: null });
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  const handleSave = async (businessData) => {
    try {
      if (editingBusiness) {
        const response = await api.put(`/businesses/${editingBusiness._id}`, businessData);
        setBusinesses(businesses.map(b => 
          b._id === editingBusiness._id ? response.data : b
        ));
      } else {
        const response = await api.post('/businesses', businessData);
        setBusinesses([response.data, ...businesses]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.phone?.includes(searchTerm) ||
    business.institutionId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.sectorId?.sectorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ניהול עסקים
            </h1>
            <p className="text-gray-600">
              נהל את כל העסקים במערכת
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 ml-2" />
            הוסף עסק חדש
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="חפש עסקים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredBusinesses.map((business) => (
          <div
            key={business._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 ml-3">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {business.businessName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {business.sectorId?.sectorName || 'לא צוין סקטור'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => handleEdit(business)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(business)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {business.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 ml-2 text-gray-400" />
                  {business.phone}
                </div>
              )}
              
              {business.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 ml-2 text-gray-400" />
                  <span className="truncate">{business.email}</span>
                </div>
              )}
              
              {business.factoryAddress && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 ml-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-2">{business.factoryAddress}</span>
                </div>
              )}

              {business.institutionId && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">מועצה/תאגיד:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {business.institutionId.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'לא נמצאו עסקים' : 'אין עסקים במערכת'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'נסה לשנות את מונחי החיפוש'
              : 'התחל על ידי הוספת עסק חדש למערכת'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="h-4 w-4 ml-2" />
              הוסף עסק חדש
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        business={editingBusiness}
        councils={councils}
        sectors={sectors}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, business: null })}
        onConfirm={confirmDelete}
        title="מחק עסק"
        message={`האם אתה בטוח שברצונך למחוק את העסק "${deleteModal.business?.businessName}"?`}
      />
    </div>
  );
};

export default Businesses;