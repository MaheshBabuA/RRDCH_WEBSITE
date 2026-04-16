import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import Card from '../components/Card';
import FormInput from '../components/FormInput';

const Departments = () => {
  const { t } = useLanguage();
  
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await apiService.departments.getAll();
        setDepartments(data);
        setFilteredDepartments(data);
      } catch (err) {
        console.error('Failed to load departments:', err);
        setError('Failed to load departments data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter effect
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const lowercased = searchTerm.toLowerCase();
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(lowercased) ||
        dept.shortDesc.toLowerCase().includes(lowercased)
      );
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border-light pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-blue mb-2">
            {t('departmentsPage.title')}
          </h1>
          <p className="text-neutral-gray text-lg">{t('departmentsPage.subtitle')}</p>
        </div>
        <div className="w-full md:w-80">
          <FormInput 
            name="search"
            placeholder={t('departmentsPage.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-blue"></div>
        </div>
      ) : error ? (
        <div className="text-center text-error-red p-8 bg-red-50 rounded-xl max-w-lg mx-auto">{error}</div>
      ) : filteredDepartments.length === 0 ? (
        <div className="text-center py-20 bg-light-bg rounded-2xl border border-border-light">
          <div className="text-4xl mb-4 opacity-50">🔍</div>
          <h3 className="text-xl text-neutral-gray font-medium">{t('departmentsPage.noResults')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepartments.map((dept) => (
             <Card key={dept.id} className="flex flex-col h-full hover:border-primary-blue transition-all group">
               <div className="flex items-start justify-between mb-4">
                 <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {dept.icon}
                 </div>
               </div>
               
               <h2 className="text-xl font-bold text-secondary-blue mb-2 leading-tight">
                 {dept.name}
               </h2>
               
               <div className="text-sm font-medium text-primary-blue mb-3">
                 {t('departmentsPage.headOfDept')}: {dept.headName}
               </div>
               
               <div className="flex items-center text-xs text-neutral-gray mb-4">
                 <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 {dept.phone}
               </div>

               <p className="text-sm text-neutral-gray mb-6 flex-grow">
                 {dept.shortDesc}
               </p>

               <div className="mt-auto pt-4 border-t border-gray-100">
                 <Link to={`/departments/${dept.id}`} className="inline-flex items-center text-primary-blue font-bold hover:underline">
                   {t('home.learnMore')}
                   <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </Link>
               </div>
             </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default Departments;
