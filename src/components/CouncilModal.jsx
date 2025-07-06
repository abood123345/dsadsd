import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CouncilModal = ({ isOpen, onClose, onSave, council }) => {
  const [formData, setFormData] = useState({
    type: 'council',
    name: '',
    signature: '',
    copies: '',
    yearsofmonitoring: '',
    labName: '',
    mts: ['']
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (council) {
      setFormData({
        type: council.type || 'council',
        name: council.name || '',
        signature: council.signature || '',
        copies: council.copies || '',
        yearsofmonitoring: council.yearsofmonitoring || '',
        labName: council.labName || '',
        mts: council.mts && council.mts.length > 0 ? council.mts : ['']
      });
    } else {
      setFormData({
        type: 'council',
        name: '',
        signature: '',
        copies: '',
        yearsofmonitoring: '',
        labName: '',
        mts: ['']
      });
    }
    setErrors({});
  }, [council, isOpen]);

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

  const handleMtsChange = (index, value) => {
    const newMts = [...formData.mts];
    newMts[index] = value;
    setFormData(prev => ({
      ...prev,
      mts: newMts
    }));
  };

  const addMts = () => {
    setFormData(prev => ({
      ...prev,
      mts: [...prev.mts, '']
    }));
  };

  const removeMts = (index) => {
    if (formData.mts.length > 1) {
      const newMts = formData.mts.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        mts: newMts
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם המועצה/תאגיד נדרש';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        mts: formData.mts.filter(mt => mt.trim() !== '')
      };
      onSave(submitData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {council ? 'עריכת מועצה/תאגיד' : 'הוספת מועצה/תאגיד חדש'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                סוג *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="council">מועצה</option>
                <option value="corporation">תאגיד</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                שם *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="הכנס שם המועצה/תאגיד"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                חתימה
              </label>
              <textarea
                id="signature"
                name="signature"
                value={formData.signature}
                onChange={handleChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס חתימה"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="copies" className="block text-sm font-medium text-gray-700 mb-2">
                עותקים
              </label>
              <textarea
                id="copies"
                name="copies"
                value={formData.copies}
                onChange={handleChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס פרטי עותקים"
              />
            </div>

            <div>
              <label htmlFor="yearsofmonitoring" className="block text-sm font-medium text-gray-700 mb-2">
                שנות ניטור
              </label>
              <input
                type="text"
                id="yearsofmonitoring"
                name="yearsofmonitoring"
                value={formData.yearsofmonitoring}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="לדוגמה: 2024-2025"
              />
            </div>

            <div>
              <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-2">
                שם מעבדה
              </label>
              <input
                type="text"
                id="labName"
                name="labName"
                value={formData.labName}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס שם מעבדה"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מט"שים
              </label>
              <div className="space-y-2">
                {formData.mts.map((mt, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={mt}
                      onChange={(e) => handleMtsChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`מט"ש ${index + 1}`}
                    />
                    {formData.mts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMts(index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMts}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 ml-1" />
                  הוסף מט"ש
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
              {council ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouncilModal;