import { useState } from 'react';
import { MessageSquareQuote, Star, CheckCircle, XCircle } from 'lucide-react';

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={14} 
            className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} 
          />
        ))}
      </div>
    );
  };

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

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <MessageSquareQuote className="text-primary" /> Patient Reviews
          </h1>
          <p className="text-text-gray mt-1">Moderate testimonials submitted by patients before they appear on the website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Pending Reviews */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-dark flex items-center gap-2 mb-2">
            Pending Moderation
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
              {reviews.filter(r => r.status === 'pending').length}
            </span>
          </h3>
          
          {reviews.filter(r => r.status === 'pending').length === 0 ? (
            <div className="bg-white border border-border-color border-dashed rounded-xl p-8 text-center">
              <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
              <p className="text-text-gray font-medium">All caught up! No pending reviews.</p>
            </div>
          ) : (
            reviews.filter(r => r.status === 'pending').map(review => (
              <div key={review.id} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-text-dark">{review.patientName}</h4>
                    <p className="text-xs text-text-gray">{review.date}</p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-text-dark bg-gray-50 p-3 rounded-lg text-sm border border-border-color italic">
                  "{review.content}"
                </p>
                
                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    onClick={() => updateStatus(review.id, 'rejected')}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => updateStatus(review.id, 'approved')}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors shadow-sm"
                  >
                    <CheckCircle size={16} /> Approve & Publish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar: History */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border-color bg-gray-50/50">
              <h3 className="font-bold text-text-dark text-sm uppercase tracking-wider">Recently Published</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {reviews.filter(r => r.status === 'approved').map(review => (
                <div key={review.id} className="border-b border-border-color pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-text-dark">{review.patientName}</span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-text-gray line-clamp-2 italic mb-2">"{review.content}"</p>
                  <button 
                    onClick={() => updateStatus(review.id, 'pending')}
                    className="text-xs font-bold text-text-light hover:text-amber-600 transition-colors"
                  >
                    Unpublish
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border-color bg-gray-50/50">
              <h3 className="font-bold text-text-dark text-sm uppercase tracking-wider text-danger">Rejected Reviews</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {reviews.filter(r => r.status === 'rejected').map(review => (
                <div key={review.id} className="border-b border-border-color pb-4 last:border-0 last:pb-0">
                  <span className="font-bold text-sm text-text-dark block mb-1">{review.patientName}</span>
                  <p className="text-xs text-text-gray line-clamp-2 italic mb-2">"{review.content}"</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => updateStatus(review.id, 'pending')}
                      className="text-xs font-bold text-text-light hover:text-amber-600 transition-colors"
                    >
                      Re-evaluate
                    </button>
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
