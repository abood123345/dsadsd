import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const ComponentModal = ({ isOpen, onClose, onSave, component }) => {
  const [formData, setFormData] = useState({
    sectorName: '',
    components: [{ componentName: '', value: '', isPaid: false }]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (component) {
      setFormData({
        sectorName: component.sectorName || '',
        components: component.components && component.components.length > 0 
          ? component.components 
          : [{ componentName: '', value: '', isPaid: false }]
      });
    } else {
      setFormData({
        sectorName: '',
        components: [{ componentName: '', value: '', isPaid: false }]
      });
    }
    setErrors({});
  }, [component, isOpen]);

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

  const handleComponentChange = (index, field, value) => {
    const newComponents = [...formData.components];
    newComponents[index] = {
      ...newComponents[index],
      [field]: field === 'isPaid' ? value : value
    };
    setFormData(prev => ({
      ...prev,
      components: newComponents
    }));
  };

  const addComponent = () => {
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, { componentName: '', value: '', isPaid: false }]
    }));
  };

  const removeComponent = (index) => {
    if (formData.components.length > 1) {
      const newComponents = formData.components.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        components: newComponents
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sectorName.trim()) {
      newErrors.sectorName = 'שם הסקטור נדרש';
    }

    const hasValidComponent = formData.components.some(comp => 
      comp.componentName.trim() !== '' && comp.value !== ''
    );

    if (!hasValidComponent) {
      newErrors.components = 'לפחות רכיב אחד עם שם וערך נדרש';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        components: formData.components.filter(comp => 
          comp.componentName.trim() !== '' && comp.value !== ''
        )
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
            {component ? 'עריכת רכיבים נבדקים' : 'הוספת רכיבים נבדקים חדשים'}
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
              <label className="block text-sm font-medium text-gray-700 mb-4">
                רכיבים נבדקים
              </label>
              {errors.components && (
                <p className="mb-2 text-sm text-red-600">{errors.components}</p>
              )}
              <div className="space-y-4">
                {formData.components.map((comp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          שם הרכיב
                        </label>
                        <input
                          type="text"
                          value={comp.componentName}
                          onChange={(e) => handleComponentChange(index, 'componentName', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="הכנס שם הרכיב"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ערך
                        </label>
                        <input
                          type="number"
                          value={comp.value}
                          onChange={(e) => handleComponentChange(index, 'value', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="הכנס ערך"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`isPaid-${index}`}
                            checked={comp.isPaid}
                            onChange={(e) => handleComponentChange(index, 'isPaid', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`isPaid-${index}`} className="mr-2 text-sm text-gray-700">
                            בתשלום
                          </label>
                        </div>
                        
                        {formData.components.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeComponent(index)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addComponent}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 ml-1" />
                  הוסף רכיב
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
              {component ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComponentModal;