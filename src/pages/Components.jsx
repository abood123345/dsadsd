import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  BeakerIcon,
  CurrencyDollarIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import ComponentModal from '../components/ComponentModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Components = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, component: null });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/components');
      setComponents(response.data);
    } catch (error) {
      console.error('Error fetching components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (component) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const handleDelete = (component) => {
    setDeleteModal({ isOpen: true, component });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/components/${deleteModal.component._id}`);
      setComponents(components.filter(c => c._id !== deleteModal.component._id));
      setDeleteModal({ isOpen: false, component: null });
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  const handleSave = async (componentData) => {
    try {
      if (editingComponent) {
        const response = await api.put(`/components/${editingComponent._id}`, componentData);
        setComponents(components.map(c => 
          c._id === editingComponent._id ? response.data : c
        ));
      } else {
        const response = await api.post('/components', componentData);
        setComponents([response.data, ...components]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const filteredComponents = components.filter(component =>
    component.sectorName?.toLowerCase().includes(searchTerm.toLowerCase())
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
              ניהול רכיבים נבדקים
            </h1>
            <p className="text-gray-600">
              נהל את כל הרכיבים הנבדקים לפי סקטור
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 ml-2" />
            הוסף רכיבים חדשים
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
            placeholder="חפש לפי שם סקטור..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredComponents.map((component) => (
          <div
            key={component._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 ml-3">
                  <BeakerIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {component.sectorName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {component.components?.length || 0} רכיבים
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => handleEdit(component)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(component)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {component.components && component.components.length > 0 && (
              <div className="space-y-3">
                {component.components.slice(0, 4).map((comp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ml-3 ${
                        comp.isPaid ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {comp.componentName}
                        </p>
                        <p className="text-xs text-gray-600">
                          ערך: {comp.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {comp.isPaid ? (
                        <div className="flex items-center text-green-600">
                          <CurrencyDollarIcon className="h-4 w-4 ml-1" />
                          <span className="text-xs font-medium">בתשלום</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <XCircleIcon className="h-4 w-4 ml-1" />
                          <span className="text-xs font-medium">ללא תשלום</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {component.components.length > 4 && (
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-500">
                      +{component.components.length - 4} רכיבים נוספים
                    </span>
                  </div>
                )}
              </div>
            )}

            {(!component.components || component.components.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <BeakerIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">אין רכיבים מוגדרים</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BeakerIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'לא נמצאו רכיבים' : 'אין רכיבים נבדקים במערכת'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'נסה לשנות את מונחי החיפוש'
              : 'התחל על ידי הוספת רכיבים נבדקים חדשים למערכת'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="h-4 w-4 ml-2" />
              הוסף רכיבים חדשים
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        component={editingComponent}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, component: null })}
        onConfirm={confirmDelete}
        title="מחק רכיבים נבדקים"
        message={`האם אתה בטוח שברצונך למחוק את הרכיבים הנבדקים עבור "${deleteModal.component?.sectorName}"?`}
      />
    </div>
  );
};

export default Components;