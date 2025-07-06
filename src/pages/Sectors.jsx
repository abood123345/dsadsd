import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  TagIcon,
  BeakerIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import SectorModal from '../components/SectorModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Sectors = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sector: null });

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sectors');
      setSectors(response.data);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSector(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sector) => {
    setEditingSector(sector);
    setIsModalOpen(true);
  };

  const handleDelete = (sector) => {
    setDeleteModal({ isOpen: true, sector });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/sectors/${deleteModal.sector._id}`);
      setSectors(sectors.filter(s => s._id !== deleteModal.sector._id));
      setDeleteModal({ isOpen: false, sector: null });
    } catch (error) {
      console.error('Error deleting sector:', error);
    }
  };

  const handleSave = async (sectorData) => {
    try {
      if (editingSector) {
        const response = await api.put(`/sectors/${editingSector._id}`, sectorData);
        setSectors(sectors.map(s => 
          s._id === editingSector._id ? response.data : s
        ));
      } else {
        const response = await api.post('/sectors', sectorData);
        setSectors([response.data, ...sectors]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sector:', error);
    }
  };

  const filteredSectors = sectors.filter(sector =>
    sector.sectorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
              ניהול סקטורים
            </h1>
            <p className="text-gray-600">
              נהל את כל הסקטורים התעשייתיים במערכת
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 ml-2" />
            הוסף סקטור חדש
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
            placeholder="חפש סקטורים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredSectors.map((sector) => (
          <div
            key={sector._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 ml-3">
                  <TagIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {sector.sectorName}
                  </h3>
                  {sector.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {sector.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => handleEdit(sector)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(sector)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toll Collection Components */}
              {sector.tollCollectionWastewater && sector.tollCollectionWastewater.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-600 ml-2" />
                    <h4 className="text-sm font-medium text-gray-900">
                      רכיבי גביית אגרה ({sector.tollCollectionWastewater.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sector.tollCollectionWastewater.slice(0, 3).map((component, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                      >
                        {component}
                      </span>
                    ))}
                    {sector.tollCollectionWastewater.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                        +{sector.tollCollectionWastewater.length - 3} נוספים
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Background Info Components */}
              {sector.chargeFeeBackgroundInfo && sector.chargeFeeBackgroundInfo.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <BeakerIcon className="h-4 w-4 text-blue-600 ml-2" />
                    <h4 className="text-sm font-medium text-gray-900">
                      רכיבי מידע רקע ({sector.chargeFeeBackgroundInfo.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sector.chargeFeeBackgroundInfo.slice(0, 3).map((component, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {component}
                      </span>
                    ))}
                    {sector.chargeFeeBackgroundInfo.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        +{sector.chargeFeeBackgroundInfo.length - 3} נוספים
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSectors.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'לא נמצאו סקטורים' : 'אין סקטורים במערכת'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'נסה לשנות את מונחי החיפוש'
              : 'התחל על ידי הוספת סקטור חדש למערכת'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="h-4 w-4 ml-2" />
              הוסף סקטור חדש
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <SectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        sector={editingSector}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, sector: null })}
        onConfirm={confirmDelete}
        title="מחק סקטור"
        message={`האם אתה בטוח שברצונך למחוק את הסקטור "${deleteModal.sector?.sectorName}"?`}
      />
    </div>
  );
};

export default Sectors;