import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import CouncilModal from '../components/CouncilModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Councils = () => {
  const [councils, setCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, council: null });

  useEffect(() => {
    fetchCouncils();
  }, []);

  const fetchCouncils = async () => {
    try {
      setLoading(true);
      const response = await api.get('/councils');
      setCouncils(response.data);
    } catch (error) {
      console.error('Error fetching councils:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCouncil(null);
    setIsModalOpen(true);
  };

  const handleEdit = (council) => {
    setEditingCouncil(council);
    setIsModalOpen(true);
  };

  const handleDelete = (council) => {
    setDeleteModal({ isOpen: true, council });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/councils/${deleteModal.council._id}`);
      setCouncils(councils.filter(c => c._id !== deleteModal.council._id));
      setDeleteModal({ isOpen: false, council: null });
    } catch (error) {
      console.error('Error deleting council:', error);
    }
  };

  const handleSave = async (councilData) => {
    try {
      if (editingCouncil) {
        const response = await api.put(`/councils/${editingCouncil._id}`, councilData);
        setCouncils(councils.map(c => 
          c._id === editingCouncil._id ? response.data : c
        ));
      } else {
        const response = await api.post('/councils', councilData);
        setCouncils([response.data, ...councils]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving council:', error);
    }
  };

  const filteredCouncils = councils.filter(council => {
    const matchesSearch = council.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         council.signature?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || council.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type) => {
    return type === 'council' ? 'מועצה' : 'תאגיד';
  };

  const getTypeColor = (type) => {
    return type === 'council' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

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
              ניהול מועצות ותאגידים
            </h1>
            <p className="text-gray-600">
              נהל את כל המועצות והתאגידים במערכת
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 ml-2" />
            הוסף מועצה/תאגיד
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="חפש מועצות ותאגידים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">כל הסוגים</option>
            <option value="council">מועצות</option>
            <option value="corporation">תאגידים</option>
          </select>
        </div>
      </div>

      {/* Councils Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredCouncils.map((council) => (
          <div
            key={council._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 ml-3">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {council.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(council.type)}`}>
                    {getTypeLabel(council.type)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => handleEdit(council)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(council)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {council.signature && (
                <div className="flex items-start text-sm text-gray-600">
                  <DocumentTextIcon className="h-4 w-4 ml-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-2">{council.signature}</span>
                </div>
              )}
              
              {council.yearsofmonitoring && (
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 ml-2 text-gray-400" />
                  שנות ניטור: {council.yearsofmonitoring}
                </div>
              )}

              {council.mts && council.mts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">מט"שים ({council.mts.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {council.mts.slice(0, 2).map((mt, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {mt}
                      </span>
                    ))}
                    {council.mts.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        +{council.mts.length - 2} נוספים
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCouncils.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'לא נמצאו תוצאות' : 'אין מועצות או תאגידים במערכת'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all'
              ? 'נסה לשנות את מונחי החיפוש או הסינון'
              : 'התחל על ידי הוספת מועצה או תאגיד חדש למערכת'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="h-4 w-4 ml-2" />
              הוסף מועצה/תאגיד
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <CouncilModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        council={editingCouncil}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, council: null })}
        onConfirm={confirmDelete}
        title="מחק מועצה/תאגיד"
        message={`האם אתה בטוח שברצונך למחוק את "${deleteModal.council?.name}"?`}
      />
    </div>
  );
};

export default Councils;