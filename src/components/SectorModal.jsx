import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const SectorModal = ({ isOpen, onClose, onSave, sector }) => {
  const [formData, setFormData] = useState({
    sectorName: '',
    description: '',
    tollCollectionWastewater: [''],
    chargeFeeBackgroundInfo: ['']
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sector) {
      setFormData({
        sectorName: sector.sectorName || '',
        description: sector.description || '',
        tollCollectionWastewater: sector.tollCollectionWastewater && sector.tollCollectionWastewater.length > 0 
          ? sector.tollCollectionWastewater : [''],
        chargeFeeBackgroundInfo: sector.chargeFeeBackgroundInfo && sector.chargeFeeBackgroundInfo.length > 0 
          ? sector.chargeFeeBackgroundInfo : ['']
      });
    } else {
      setFormData({
        sectorName: '',
        description: '',
        tollCollectionWastewater: [''],
        chargeFeeBackgroundInfo: ['']
      });
    }
    setErrors({});
  }, [sector, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [arrayName]: newArray
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (formData[arrayName].length > 1) {
      const newArray = formData[arrayName].filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [arrayName]: newArray
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sectorName.trim()) {
      newErrors.sectorName = 'שם הסקטור נדרש';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        tollCollectionWastewater: formData.tollCollectionWastewater.filter(item => item.trim() !== ''),
        chargeFeeBackgroundInfo: formData.chargeFeeBackgroundInfo.filter(item => item.trim() !== '')
      };
      onSave(submitData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {sector ? 'עריכת סקטור' : 'הוספת סקטור חדש'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="sectorName" className="block text-sm font-medium text-gray-700 mb-2">
                שם הסקטור *
              </label>
              <input
                type="text"
                id="sectorName"
                name="sectorName"
                value={formData.sectorName}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.sectorName ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="הכנס שם הסקטור"
              />
              {errors.sectorName && (
                <p className="mt-1 text-sm text-red-600">{errors.sectorName}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                תיאור
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס תיאור הסקטור"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                רכיבי גביית אגרה
              </label>
              <div className="space-y-2">
                {formData.tollCollectionWastewater.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('tollCollectionWastewater', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`רכיב ${index + 1}`}
                    />
                    {formData.tollCollectionWastewater.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tollCollectionWastewater', index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tollCollectionWastewater')}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 ml-1" />
                  הוסף רכיב גביה
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                רכיבי מידע רקע
              </label>
              <div className="space-y-2">
                {formData.chargeFeeBackgroundInfo.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('chargeFeeBackgroundInfo', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`רכיב מידע ${index + 1}`}
                    />
                    {formData.chargeFeeBackgroundInfo.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('chargeFeeBackgroundInfo', index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('chargeFeeBackgroundInfo')}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 ml-1" />
                  הוסף רכיב מידע
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {sector ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectorModal;