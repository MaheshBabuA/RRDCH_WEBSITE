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
    <div className="relative animate-fade-in pb-24 min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-secondary-blue via-[#1e293b] to-primary-blue overflow-hidden -z-10 rounded-b-[60px] md:rounded-b-[100px]">
         <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000")', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-blue/30 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-soft-bg to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto pt-16 pb-10 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-20 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest shadow-lg">
                Clinical Specializations
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                {t('departmentsPage.title')}
              </h1>
              <p className="text-blue-100/90 text-lg md:text-xl font-medium max-w-2xl drop-shadow-sm">
                Explore our state-of-the-art clinical and academic departments dedicated to excellence in dental healthcare.
              </p>
            </div>
            
            <div className="w-full lg:w-96 group relative z-20">
              <div className="relative bg-white/10 backdrop-blur-3xl rounded-3xl p-2 shadow-2xl border border-white/30">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-blue group-focus-within:text-white transition-colors z-10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text"
                  placeholder={t('departmentsPage.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-transparent rounded-[20px] outline-none transition-all duration-300 font-bold placeholder:text-neutral-gray text-secondary-blue focus:ring-4 focus:ring-primary-blue/30 shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white/50 backdrop-blur-xl rounded-[40px] border border-white">
             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-blue"></div>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-white/80 backdrop-blur-md border border-error-red/20 rounded-[40px] max-w-2xl mx-auto shadow-2xl">
            <div className="text-5xl mb-4 opacity-50">⚠️</div>
            <p className="text-error-red font-black uppercase tracking-widest text-lg">{error}</p>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-[40px] border border-dashed border-border-light shadow-2xl max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-premium border border-border-soft">
               <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-3xl text-secondary-blue font-black tracking-tight">{t('departmentsPage.noResults')}</h3>
            <p className="text-neutral-gray text-lg font-medium mt-3">We couldn't match any departments. Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
            {filteredDepartments.map((dept) => (
               <div key={dept.id} className="group relative">
                 {/* Glow effect behind card */}
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-accent-emerald rounded-[40px] blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                 
                 <Card className="flex flex-col h-full bg-white relative rounded-[40px] p-8 border border-border-soft hover:border-transparent shadow-premium hover:-translate-y-2 transition-all duration-300 z-10">
                   <div className="flex items-start justify-between mb-6">
                     <div className="w-20 h-20 bg-soft-bg rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-border-light group-hover:bg-primary-blue/5 group-hover:scale-110 transition-transform duration-300 text-center">
                        {dept.icon}
                     </div>
                   </div>
                   
                   <h2 className="text-2xl font-black text-secondary-blue mb-3 leading-tight tracking-tight group-hover:text-primary-blue transition-colors">
                     {dept.name}
                   </h2>
                   
                   <div className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-primary-blue mb-4 px-3 py-1 bg-primary-blue/5 rounded-full border border-primary-blue/10">
                     <span>{t('departmentsPage.headOfDept')}: {dept.headName}</span>
                   </div>
                   
                   <div className="flex items-center text-sm font-bold text-neutral-gray mb-6">
                     <div className="w-8 h-8 rounded-full bg-soft-bg flex items-center justify-center mr-3 shadow-sm border border-border-light">
                       <svg className="w-4 h-4 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                       </svg>
                     </div>
                     {dept.phone}
                   </div>
    
                   <p className="text-sm text-neutral-gray leading-relaxed font-medium mb-8 flex-grow">
                     {dept.shortDesc}
                   </p>
    
                   <div className="mt-auto pt-6 border-t border-dashed border-border-light">
                     <Link to={`/departments/${dept.id}`}>
                       <button className="w-full py-4 rounded-xl text-primary-blue font-black bg-primary-blue/5 hover:bg-primary-blue hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-md">
                         {t('home.learnMore')}
                         <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                         </svg>
                       </button>
                     </Link>
                   </div>
                 </Card>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;
