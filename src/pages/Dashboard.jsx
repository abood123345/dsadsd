import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  TagIcon, 
  BeakerIcon, 
  BriefcaseIcon,
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    councils: 0,
    sectors: 0,
    components: 0,
    businesses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [councilsRes, sectorsRes, componentsRes, businessesRes] = await Promise.all([
        api.get('/councils'),
        api.get('/sectors'),
        api.get('/components'),
        api.get('/businesses')
      ]);

      setStats({
        councils: councilsRes.data.length,
        sectors: sectorsRes.data.length,
        components: componentsRes.data.length,
        businesses: businessesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'מועצות ותאגידים',
      value: stats.councils,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'סקטורים',
      value: stats.sectors,
      icon: TagIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'רכיבים נבדקים',
      value: stats.components,
      icon: BeakerIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      name: 'עסקים',
      value: stats.businesses,
      icon: BriefcaseIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const quickActions = [
    {
      name: 'הוסף מועצה חדשה',
      description: 'צור מועצה או תאגיד חדש במערכת',
      icon: BuildingOfficeIcon,
      href: '/councils',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'הוסף סקטור חדש',
      description: 'הגדר סקטור תעשייתי חדש',
      icon: TagIcon,
      href: '/sectors',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'הוסף עסק חדש',
      description: 'רשום עסק חדש במערכת',
      icon: BriefcaseIcon,
      href: '/businesses',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      name: 'נהל רכיבים',
      description: 'הגדר רכיבים נבדקים חדשים',
      icon: BeakerIcon,
      href: '/components',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              לוח בקרה
            </h1>
            <p className="text-gray-600">
              סקירה כללית של המערכת ונתונים עדכניים
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center text-sm text-gray-500">
              <ChartBarIcon className="h-5 w-5 ml-2" />
              עדכון אחרון: {new Date().toLocaleDateString('he-IL')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 card-hover`}
            >
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mr-4 flex-1">
                  <p className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <TrendingUpIcon className="h-6 w-6 text-blue-600 ml-2" />
          <h2 className="text-xl font-bold text-gray-900">פעולות מהירות</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.name}
                href={action.href}
                className="group block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200 card-hover"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${action.color} rounded-lg p-3 mb-4 transition-colors duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {action.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {action.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="h-6 w-6 text-green-600 ml-2" />
          <h2 className="text-xl font-bold text-gray-900">פעילות אחרונה</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 rounded-full p-2 ml-4">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                המערכת מוכנה לשימוש
              </p>
              <p className="text-xs text-gray-600">
                כל המודולים פעילים ומוכנים לעבודה
              </p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleTimeString('he-IL')}
            </span>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">אין פעילות אחרונה להצגה</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;