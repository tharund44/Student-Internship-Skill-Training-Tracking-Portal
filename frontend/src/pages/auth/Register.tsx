import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, GraduationCap, Building, ArrowLeft } from 'lucide-react';
import { HeroScene } from '../../components/3d/HeroScene';
import toast from 'react-hot-toast';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'STUDENT' | 'ORGANIZATION' | null>(null);
  
  // Shared
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Student
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  
  // Org
  const [orgType, setOrgType] = useState('Company');
  const [contactPerson, setContactPerson] = useState('');
  const [website, setWebsite] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        college,
        department,
        yearOfStudy: parseInt(yearOfStudy),
        studentPhone,
        organizationName: name,
        organizationType: orgType,
        contactPerson,
        website,
        orgPhone
      });
      
      if (role === 'ORGANIZATION') {
        toast.success('Registration successful! Your account is pending admin approval.');
        navigate('/login');
      } else {
        toast.success('Welcome to InternTrack!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 dark:text-white transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F7FF] dark:bg-dark-bg">
      <div className="relative hidden lg:flex flex-col justify-center p-16 overflow-hidden border-r border-white/20 dark:border-dark-border">
        <HeroScene />
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-black text-2xl mb-8 shadow-lg shadow-primary/30">I</div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            Join the <br/> <span className="text-primary">Future of Talent.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create your account to unlock endless opportunities.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 relative z-10 w-full overflow-hidden">
        <div className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl p-8 relative">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{x: -50, opacity:0}} animate={{x:0, opacity:1}} exit={{x:50, opacity:0}} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Create Account</h2>
                  <p className="text-gray-500 dark:text-gray-400">How do you want to join?</p>
                </div>
                
                <div className="space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole('STUDENT'); setStep(2); }}
                    className="w-full text-left p-6 rounded-2xl border-2 border-transparent hover:border-primary bg-white dark:bg-slate-800 shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><GraduationCap size={24}/></div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">I'm a Student</h3>
                      <p className="text-sm text-gray-500">Apply for internships & track progress</p>
                    </div>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole('ORGANIZATION'); setStep(2); }}
                    className="w-full text-left p-6 rounded-2xl border-2 border-transparent hover:border-primary bg-white dark:bg-slate-800 shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Building size={24}/></div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">I'm an Organization</h3>
                      <p className="text-sm text-gray-500">Post opportunities & manage applicants</p>
                    </div>
                  </motion.button>
                </div>
                
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                  Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{x: 50, opacity:0}} animate={{x:0, opacity:1}} exit={{x:-50, opacity:0}} transition={{ duration: 0.3 }}>
                <div className="mb-6 flex items-center">
                  <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-primary mr-4 flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {role === 'STUDENT' ? 'Student Registration' : 'Organization Setup'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 pb-4 custom-scrollbar">
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="p-3 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div>
                    <label className={labelClass}>{role === 'STUDENT' ? 'Full Name' : 'Organization Name'}</label>
                    <input required placeholder={role === 'STUDENT' ? "John Doe" : "Acme Corp"} value={name} onChange={e=>setName(e.target.value)} type="text" className={inputClass} />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input required placeholder="john@example.com" value={email} onChange={e=>setEmail(e.target.value)} type="email" className={inputClass} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Password</label>
                      <input required placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} type="password" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password</label>
                      <input required placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" className={inputClass} />
                    </div>
                  </div>

                  {role === 'STUDENT' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
                      <div>
                        <label className={labelClass}>College / University</label>
                        <input required placeholder="Harvard University" value={college} onChange={e=>setCollege(e.target.value)} type="text" className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Department</label>
                          <input required placeholder="Computer Science" value={department} onChange={e=>setDepartment(e.target.value)} type="text" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Graduation Year</label>
                          <input required placeholder="2025" value={yearOfStudy} onChange={e=>setYearOfStudy(e.target.value)} type="number" min="2020" max="2030" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <input required placeholder="+1 (555) 000-0000" value={studentPhone} onChange={e=>setStudentPhone(e.target.value)} type="tel" className={inputClass} />
                      </div>
                    </motion.div>
                  )}

                  {role === 'ORGANIZATION' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
                      <div>
                        <label className={labelClass}>Organization Type</label>
                        <select required value={orgType} onChange={e=>setOrgType(e.target.value)} className={inputClass}>
                          <option>Company</option>
                          <option>Training Provider</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Contact Person</label>
                        <input required placeholder="Jane Smith" value={contactPerson} onChange={e=>setContactPerson(e.target.value)} type="text" className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Website</label>
                          <input required placeholder="https://example.com" value={website} onChange={e=>setWebsite(e.target.value)} type="url" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Phone</label>
                          <input required placeholder="+1 (555) 123-4567" value={orgPhone} onChange={e=>setOrgPhone(e.target.value)} type="tel" className={inputClass} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="pt-6">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit" 
                      disabled={loading} 
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl shadow-[0_8px_30px_rgba(109,74,255,0.3)] hover:shadow-[0_8px_40px_rgba(109,74,255,0.4)] transition-all flex items-center justify-center disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
