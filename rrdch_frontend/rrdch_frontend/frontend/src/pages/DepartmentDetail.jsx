import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import Button from '../components/Button';
import { siteContent } from '../data/siteContent';

const DepartmentDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate slight delay for smooth transition
    const timer = setTimeout(() => {
      const deptId = parseInt(id);
      const department = siteContent.departments.find(d => d.id === deptId);
      
      if (department) {
        // Find related departments (excluding current)
        const related = siteContent.departments
          .filter(d => d.id !== deptId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
          
        setData({ department, related });
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-blue"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
         <div className="text-6xl mb-4">⚕️</div>
         <h2 className="text-3xl font-black text-secondary-blue mb-6">Department Not Found</h2>
         <Link to="/departments">
           <Button type="secondary" text={t('departmentsPage.backToList')} className="px-10 py-3" />
         </Link>
      </div>
    );
  }

  const { department, related } = data;

  return (
    <div className="relative animate-fade-in pb-24">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-secondary-blue to-primary-blue overflow-hidden -z-10 rounded-b-[60px] md:rounded-b-[100px]">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[80px] -mr-40 -mt-20 pointer-events-none"></div>
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-soft-bg to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-10 text-white/80">
          <Link to="/departments" className="inline-flex items-center hover:text-white font-bold transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {t('departmentsPage.backToList')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-12">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 text-4xl flex items-center justify-center rounded-[24px] shadow-lg shrink-0">
                {department.icon}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight m-0 drop-shadow-md">
                {department.name}
              </h1>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[40px] shadow-2xl p-8 md:p-12 prose prose-blue prose-lg max-w-none text-neutral-gray leading-relaxed font-medium">
              <p>
                {department.fullDesc}
              </p>
            </div>

            {/* Facilities Section */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-premium border border-border-soft hover:shadow-premium-hover hover:border-primary-blue/30 transition-all duration-300">
              <h3 className="text-2xl font-black text-secondary-blue mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center text-primary-blue">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                {t('departmentsPage.facilities')}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {department.facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-start text-neutral-gray font-medium text-lg leading-snug group">
                    <span className="w-6 h-6 rounded-full bg-primary-blue/10 flex items-center justify-center mr-3 shrink-0 group-hover:scale-110 transition-transform">
                       <span className="w-2 h-2 rounded-full bg-primary-blue"></span>
                    </span>
                    {fac}
                  </li>
                ))}
              </ul>
            </div>

            {/* Postgrad Info */}
            <div className="bg-gradient-to-r from-primary-blue/5 to-transparent rounded-[24px] p-6 border-l-8 border-primary-blue">
              <h4 className="text-sm font-black text-primary-blue uppercase tracking-widest mb-2">
                {t('departmentsPage.postgrad')}
              </h4>
              <p className="text-xl font-bold text-secondary-blue m-0 tracking-tight">
                {department.postgrad}
              </p>
            </div>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-1 space-y-8 lg:-mt-10">
            
            {/* Doctor Info Card */}
            <div className="bg-white rounded-[40px] shadow-2xl border border-border-light overflow-hidden shadow-primary-blue/5">
              <div className="h-24 bg-gradient-to-r from-secondary-blue to-primary-blue relative">
                 <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full p-2">
                   <div className="w-full h-full bg-soft-bg rounded-full border border-border-light flex items-center justify-center text-4xl overflow-hidden shadow-inner pl-1 pt-1 text-gray-300">
                     👤
                   </div>
                 </div>
              </div>
              <div className="pt-16 pb-8 px-8 text-center border-b border-border-light">
                <h3 className="text-2xl font-black text-secondary-blue mb-1">{department.headName}</h3>
                <p className="text-sm font-bold text-neutral-gray uppercase tracking-wider">{t('departmentsPage.headOfDept')}</p>
              </div>
              
              <div className="p-8 space-y-5 bg-soft-bg/50">
                <a href={`tel:${department.phone}`} className="flex items-center p-4 rounded-2xl bg-white hover:shadow-md transition-all border border-border-light hover:border-primary-blue group">
                   <div className="w-12 h-12 bg-primary-blue/10 text-primary-blue rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                     </svg>
                   </div>
                   <div>
                     <div className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-1">Direct Line</div>
                     <div className="font-black text-secondary-blue group-hover:text-primary-blue transition-colors">{department.phone}</div>
                   </div>
                </a>

                <a href={`mailto:${department.email}`} className="flex items-center p-4 rounded-2xl bg-white hover:shadow-md transition-all border border-border-light hover:border-primary-blue group">
                   <div className="w-12 h-12 bg-primary-blue/10 text-primary-blue rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                     </svg>
                   </div>
                   <div className="overflow-hidden">
                     <div className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-1">Email Contact</div>
                     <div className="font-black text-secondary-blue group-hover:text-primary-blue transition-colors truncate">{department.email}</div>
                   </div>
                </a>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-[40px] p-8 border border-border-light shadow-premium">
               <h4 className="font-black text-secondary-blue mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 bg-soft-bg rounded-full flex items-center justify-center">
                   <svg className="w-5 h-5 text-neutral-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 {t('departmentsPage.schedule')}
               </h4>
               <p className="text-neutral-gray font-bold leading-relaxed bg-soft-bg p-5 rounded-2xl">
                 {department.schedule}
               </p>
            </div>

            <Link to="/book-appointment" className="block w-full group">
              <button className="w-full py-5 bg-gradient-to-r from-primary-blue to-secondary-blue text-white text-xl font-black rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 group-active:scale-95 transition-all duration-300">
                 {t('departmentsPage.bookInDept')}
              </button>
            </Link>

          </div>
        </div>

        {/* Related Departments */}
        <div className="mt-24 pt-16 border-t-2 border-dashed border-border-light">
           <div className="text-center mb-12">
             <h3 className="text-3xl font-black text-secondary-blue tracking-tight">{t('departmentsPage.relatedDepts')}</h3>
             <div className="w-16 h-1.5 bg-primary-blue mx-auto mt-4 rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {related.map(rel => (
               <Link key={rel.id} to={`/departments/${rel.id}`} className="block">
                 <div className="bg-white rounded-[32px] p-8 border border-border-soft shadow-premium hover:shadow-premium-hover hover:border-primary-blue/30 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
                   <div className="w-16 h-16 bg-soft-bg rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-primary-blue/10 group-hover:scale-110 transition-transform text-center">
                     {rel.icon}
                   </div>
                   <h4 className="text-xl font-black text-secondary-blue mb-3 group-hover:text-primary-blue transition-colors line-clamp-1">{rel.name}</h4>
                   <p className="text-sm font-medium text-neutral-gray line-clamp-2 leading-relaxed flex-grow">{rel.shortDesc}</p>
                 </div>
               </Link>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default DepartmentDetail;
