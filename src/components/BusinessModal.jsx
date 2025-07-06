import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const BusinessModal = ({ isOpen, onClose, onSave, business, councils, sectors }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    workNumber: '',
    senderTo: '',
    payerNumber: '',
    email: '',
    factoryAddress: '',
    institutionId: '',
    sectorId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (business) {
      setFormData({
        businessName: business.businessName || '',
        phone: business.phone || '',
        workNumber: business.workNumber || '',
        senderTo: business.senderTo || '',
        payerNumber: business.payerNumber || '',
        email: business.email || '',
        factoryAddress: business.factoryAddress || '',
        institutionId: business.institutionId?._id || '',
        sectorId: business.sectorId?._id || ''
      });
    } else {
      setFormData({
        businessName: '',
        phone: '',
        workNumber: '',
        senderTo: '',
        payerNumber: '',
        email: '',
        factoryAddress: '',
        institutionId: '',
        sectorId: ''
      });
    }
    setErrors({});
  }, [business, isOpen]);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'שם העסק נדרש';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'פורמט אימייל לא תקין';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {business ? 'עריכת עסק' : 'הוספת עסק חדש'}
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
            <div className="md:col-span-2">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                שם העסק *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.businessName ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="הכנס שם העסק"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                טלפון
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס מספר טלפון"
              />
            </div>

            <div>
              <label htmlFor="workNumber" className="block text-sm font-medium text-gray-700 mb-2">
                מספר עבודה
              </label>
              <input
                type="text"
                id="workNumber"
                name="workNumber"
                value={formData.workNumber}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס מספר עבודה"
              />
            </div>

            <div>
              <label htmlFor="senderTo" className="block text-sm font-medium text-gray-700 mb-2">
                נשלח אל
              </label>
              <input
                type="text"
                id="senderTo"
                name="senderTo"
                value={formData.senderTo}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס נמען"
              />
            </div>

            <div>
              <label htmlFor="payerNumber" className="block text-sm font-medium text-gray-700 mb-2">
                מספר משלם
              </label>
              <input
                type="text"
                id="payerNumber"
                name="payerNumber"
                value={formData.payerNumber}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס מספר משלם"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                אימייל
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="הכנס כתובת אימייל"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="factoryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת המפעל
              </label>
              <textarea
                id="factoryAddress"
                name="factoryAddress"
                value={formData.factoryAddress}
                onChange={handleChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס כתובת המפעל"
              />
            </div>

            <div>
              <label htmlFor="institutionId" className="block text-sm font-medium text-gray-700 mb-2">
                מועצה/תאגיד
              </label>
              <select
                id="institutionId"
                name="institutionId"
                value={formData.institutionId}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">בחר מועצה/תאגיד</option>
                {councils.map((council) => (
                  <option key={council._id} value={council._id}>
                    {council.name} ({council.type === 'council' ? 'מועצה' : 'תאגיד'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sectorId" className="block text-sm font-medium text-gray-700 mb-2">
                סקטור
              </label>
              <select
                id="sectorId"
                name="sectorId"
                value={formData.sectorId}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">בחר סקטור</option>
                {sectors.map((sector) => (
                  <option key={sector._id} value={sector._id}>
                    {sector.sectorName}
                  </option>
                ))}
              </select>
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
              {business ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessModal;