import { useState } from 'react';
import { 
  MessageSquareQuote, 
  Star, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  RotateCcw, 
  ThumbsUp, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface Review {
  id: string;
  patientName: string;
  date: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockReviews: Review[] = [
  {
    id: '1',
    patientName: 'Rahul Desai',
    date: '2023-10-15',
    rating: 5,
    content: 'Dr. Sarah was very patient and explained everything clearly. The clinic is very clean and staff is polite.',
    status: 'pending'
  },
  {
    id: '2',
    patientName: 'Priya Sharma',
    date: '2023-10-14',
    rating: 4,
    content: 'Good experience overall. Wait time was a bit long but the consultation was excellent.',
    status: 'approved'
  },
  {
    id: '3',
    patientName: 'Anonymous',
    date: '2023-10-12',
    rating: 2,
    content: 'The receptionist was rude when I asked about the doctor\'s availability.',
    status: 'rejected'
  }
];

export const PatientReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const updateStatus = (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setToastMessage(`Review ${newStatus === 'approved' ? 'published to website' : newStatus === 'pending' ? 'moved back to pending' : 'rejected and hidden'}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    setToastMessage('Review deleted permanently');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderStars = (rating: number, size = 14) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={size} 
            className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} 
          />
        ))}
      </div>
    );
  };

  // KPIs
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 right-8 z-[100] bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <p className="font-bold">Status Updated</p>
            <p className="text-xs text-green-700">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          <MessageSquareQuote className="text-primary" /> Patient Reviews & Feedback
        </h1>
        <p className="text-text-gray mt-1 text-base">Moderate testimonials submitted by patients before they appear on the public website.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Avg Rating */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-border-color/40 interactive-card flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Star className="fill-amber-400 text-amber-400" size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wider">Average Rating</p>
            <h3 className="text-xl font-extrabold text-text-dark mt-0.5 flex items-baseline gap-1.5">
              {avgRating} <span className="text-xs font-normal text-text-light">/ 5.0</span>
            </h3>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-border-color/40 interactive-card flex items-center gap-4">
          <div className="p-3 bg-amber-550 rounded-xl text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wider">Pending Review</p>
            <h3 className="text-xl font-extrabold text-text-dark mt-0.5">{pendingCount}</h3>
          </div>
        </div>

        {/* Card 3: Approved */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-border-color/40 interactive-card flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <ThumbsUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wider">Published</p>
            <h3 className="text-xl font-extrabold text-text-dark mt-0.5">{approvedCount}</h3>
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-border-color/40 interactive-card flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wider">Archived / Hidden</p>
            <h3 className="text-xl font-extrabold text-text-dark mt-0.5">{rejectedCount}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Switcher Row */}
      <div className="flex bg-white rounded-xl p-1 border border-border-color shadow-sm w-max mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pending' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
          }`}
        >
          Pending Approvals
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
            activeTab === 'pending' ? 'bg-white text-primary' : 'bg-amber-100 text-amber-800'
          }`}>{pendingCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'approved' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
          }`}
        >
          Public Reviews
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
            activeTab === 'approved' ? 'bg-white text-primary' : 'bg-green-100 text-green-800'
          }`}>{approvedCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'rejected' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
          }`}
        >
          Hidden Reviews
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
            activeTab === 'rejected' ? 'bg-white text-primary' : 'bg-red-100 text-red-800'
          }`}>{rejectedCount}</span>
        </button>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.filter(r => r.status === activeTab).map(review => {
          const initials = review.patientName === 'Anonymous' 
            ? 'AN' 
            : review.patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

          return (
            <div 
              key={review.id} 
              className="bg-white rounded-2xl p-6 shadow-soft interactive-card flex flex-col justify-between transition-all border relative overflow-hidden"
            >
              {/* Colored left bar identifier depending on tab */}
              <div className={`absolute left-0 top-0 w-1 h-full ${
                activeTab === 'pending' ? 'bg-amber-400' :
                activeTab === 'approved' ? 'bg-primary' : 'bg-red-400'
              }`} />

              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                      activeTab === 'pending' ? 'bg-amber-50 text-amber-750 border border-amber-100/50' :
                      activeTab === 'approved' ? 'bg-primary/10 text-primary border border-primary/10' :
                      'bg-red-50 text-red-750 border border-red-100/50'
                    }`}>
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark text-sm leading-snug">{review.patientName}</h4>
                      <p className="text-[10px] text-text-gray mt-0.5 font-medium">{review.date}</p>
                    </div>
                  </div>
                  {renderStars(review.rating, 13)}
                </div>

                {/* Content */}
                <div className="bg-hover-bg/40 p-4 rounded-xl border border-border-color/40 italic text-text-dark text-sm mb-4 relative min-h-[80px]">
                  <span className="absolute -top-3 left-2 text-4xl text-text-light/25 font-serif select-none">“</span>
                  <p className="relative z-10 leading-relaxed text-text-dark">"{review.content}"</p>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-4 pt-4 border-t border-border-color/60 flex justify-end gap-2.5">
                {activeTab === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button 
                      onClick={() => updateStatus(review.id, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <CheckCircle size={14} /> Approve & Publish
                    </button>
                  </>
                )}

                {activeTab === 'approved' && (
                  <>
                    <button 
                      onClick={() => updateStatus(review.id, 'pending')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} /> Unpublish
                    </button>
                    <button 
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle size={14} /> Archive
                    </button>
                  </>
                )}

                {activeTab === 'rejected' && (
                  <>
                    <button 
                      onClick={() => updateStatus(review.id, 'pending')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} /> Re-evaluate
                    </button>
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {reviews.filter(r => r.status === activeTab).length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-border-color border-dashed p-10 text-center shadow-soft">
            <AlertCircle size={40} className="text-text-light mx-auto mb-3" />
            <p className="text-text-gray font-medium">No testimonials found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
