import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const DepartmentDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeptData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiService.departments.getById(id);
        setData(result);
      } catch (err) {
        console.error('Failed to load department details:', err);
        setError('Department not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeptData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-blue"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
         <div className="text-6xl mb-4">⚕️</div>
         <h2 className="text-2xl font-bold text-secondary-blue mb-4">{error || 'Unknown Error'}</h2>
         <Link to="/departments">
           <Button type="secondary" text={t('departmentsPage.backToList')} />
         </Link>
      </div>
    );
  }

  const { department, related } = data;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb / Back Link */}
      <div className="mb-8">
        <Link to="/departments" className="inline-flex items-center text-neutral-gray hover:text-primary-blue font-medium transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('departmentsPage.backToList')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
        
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-blue-50 text-3xl flex items-center justify-center rounded-2xl shrink-0">
              {department.icon}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-secondary-blue leading-tight m-0">
              {department.name}
            </h1>
          </div>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-neutral-gray leading-relaxed">
              {department.fullDesc}
            </p>
          </div>

          {/* Facilities Section */}
          <div className="bg-white border text-left border-border-light rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-secondary-blue mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-blue font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {t('departmentsPage.facilities')}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {department.facilities.map((fac, idx) => (
                <li key={idx} className="flex items-start text-neutral-gray text-base">
                  <span className="text-primary-blue mr-2 text-lg leading-4">&bull;</span>
                  {fac}
                </li>
              ))}
            </ul>
          </div>

          {/* Postgrad Info */}
          <div className="border-l-4 border-primary-blue pl-5 py-2">
            <h4 className="text-sm font-bold text-neutral-gray uppercase tracking-wider mb-1">
              {t('departmentsPage.postgrad')}
            </h4>
            <p className="text-lg font-medium text-secondary-blue m-0">
              {department.postgrad}
            </p>
          </div>

        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Doctor Info Card */}
          <Card className="border-t-4 border-t-primary-blue shadow-md">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 border-4 border-white shadow flex items-center justify-center text-4xl overflow-hidden text-center pl-2 pt-1 text-gray-300">
                👤
              </div>
              <h3 className="text-xl font-bold text-secondary-blue mb-1">{department.headName}</h3>
              <p className="text-sm text-neutral-gray">{t('departmentsPage.headOfDept')}</p>
            </div>
            
            <div className="space-y-4">
              <a href={`tel:${department.phone}`} className="flex items-center p-3 rounded-lg hover:bg-light-bg transition-colors border border-transparent hover:border-border-light group">
                 <div className="w-10 h-10 bg-blue-50 text-primary-blue rounded-full flex items-center justify-center mr-3 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                 </div>
                 <div>
                   <div className="text-xs text-neutral-gray mb-0.5">Direct Line</div>
                   <div className="font-bold text-secondary-blue">{department.phone}</div>
                 </div>
              </a>

              <a href={`mailto:${department.email}`} className="flex items-center p-3 rounded-lg hover:bg-light-bg transition-colors border border-transparent hover:border-border-light group">
                 <div className="w-10 h-10 bg-blue-50 text-primary-blue rounded-full flex items-center justify-center mr-3 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <div>
                   <div className="text-xs text-neutral-gray mb-0.5">Email Contact</div>
                   <div className="font-bold text-secondary-blue truncate max-w-[180px]">{department.email}</div>
                 </div>
              </a>
            </div>
          </Card>

          {/* Schedule */}
          <div className="bg-light-bg rounded-2xl p-6 border border-border-light">
             <h4 className="font-bold text-secondary-blue mb-3 flex items-center gap-2">
               <svg className="w-5 h-5 text-neutral-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {t('departmentsPage.schedule')}
             </h4>
             <p className="text-neutral-gray text-sm md:text-base font-medium">
               {department.schedule}
             </p>
          </div>

          <Link to="/book-appointment" className="block w-full">
            <Button type="primary" text={t('departmentsPage.bookInDept')} className="w-full py-4 text-lg shadow-md hover:shadow-xl" />
          </Link>

        </div>
      </div>

      {/* Related Departments */}
      <div className="mt-20 pt-10 border-t border-border-light">
         <h3 className="text-2xl font-bold text-secondary-blue mb-8 text-center">{t('departmentsPage.relatedDepts')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {related.map(rel => (
             <Link key={rel.id} to={`/departments/${rel.id}`} className="block">
               <Card className="h-full hover:border-primary-blue hover:-translate-y-1 transition-all">
                 <div className="text-4xl mb-3">{rel.icon}</div>
                 <h4 className="font-bold text-secondary-blue mb-1">{rel.name}</h4>
                 <p className="text-sm text-neutral-gray line-clamp-2">{rel.shortDesc}</p>
               </Card>
             </Link>
           ))}
         </div>
      </div>

    </div>
  );
};

export default DepartmentDetail;
