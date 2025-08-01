import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Calendar, Heart, Share2, MessageCircle, Repeat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ClothingItem } from '../../types';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

interface ItemDetailPageProps {
  itemId: string;
  onBack: () => void;
  onPageChange: (page: string) => void;
}

export function ItemDetailPage({ itemId, onBack, onPageChange }: ItemDetailPageProps) {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_ENDPOINTS.ITEMS}/${itemId}`);
        if (response.data.success) {
          setItem(response.data.data.item);
        } else {
          setError('Failed to fetch item details');
        }
      } catch (err: any) {
        setError('Failed to fetch item details');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The item you are looking for does not exist.'}</p>
          <button
            onClick={onBack}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSwapRequest = () => {
    if (!user) {
      onPageChange('auth');
      return;
    }
    setShowSwapModal(true);
  };

  const handlePointRedemption = () => {
    if (!user) {
      onPageChange('auth');
      return;
    }
    // Handle point redemption logic
    alert(`Redeeming ${item.title} for ${item.pointValue} points!`);
  };

  const handleSwapSubmit = async () => {
    if (!swapMessage.trim()) {
      alert('Please enter a message for your swap request');
      return;
    }

    try {
      const token = localStorage.getItem('rewear_token');
      const response = await axios.post(API_ENDPOINTS.REQUEST_SWAP, {
        itemId: item.id,
        message: swapMessage,
        type: 'points' // or 'swap' if implementing item swaps
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        alert('Swap request sent successfully!');
        setShowSwapModal(false);
        setSwapMessage('');
      } else {
        alert(response.data.message || 'Failed to send swap request');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to send swap request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Browse</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
              />
              {item.isFeatured && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full">
                  <Star className="h-5 w-5 fill-current" />
                </div>
              )}
            </div>

            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex 
                        ? 'border-emerald-500' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {item.pointValue} Points
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Category</span>
                  <p className="font-medium capitalize">{item.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type</span>
                  <p className="font-medium capitalize">{item.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Size</span>
                  <p className="font-medium">{item.size}</p>
                </div>
                <div>
                  <span className="text-gray-500">Condition</span>
                  <p className="font-medium capitalize">{item.condition}</p>
                </div>
              </div>
            </div>

            {/* Points Breakdown */}
            {item.pointsBreakdown && (
              <div className="bg-emerald-50 rounded-xl p-6 shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Points Breakdown</h3>
                <ul className="text-emerald-900 space-y-1 text-sm">
                  <li><strong>Base Category Value:</strong> {item.pointsBreakdown.baseCategoryValue}</li>
                  <li><strong>Item Quality Score:</strong> {item.pointsBreakdown.itemQualityScore}</li>
                  <li><strong>Demand Weight:</strong> {item.pointsBreakdown.demandWeight}</li>
                  <li><strong>Condition Bonus:</strong> {item.pointsBreakdown.conditionBonus}</li>
                  <li><strong>Trust Boost:</strong> {item.pointsBreakdown.trustBoost}</li>
                  <li><strong>First Upload Bonus:</strong> {item.pointsBreakdown.firstUploadBonus}</li>
                  <li><strong>Campaign Bonus:</strong> {item.pointsBreakdown.campaignBonus}</li>
                  <li><strong>Penalties:</strong> {item.pointsBreakdown.penalties}</li>
                  <li><strong>Total Points Awarded:</strong> <span className="font-bold text-emerald-700">{item.totalPointsGiven || item.pointValue}</span></li>
                </ul>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSwapRequest}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Request Swap
              </button>
              <button
                onClick={handlePointRedemption}
                className="flex-1 border border-emerald-600 text-emerald-600 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                Redeem with Points
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">About the Seller</h4>
              <div className="flex items-center space-x-3">
                {item.uploaderAvatar && (
                  <img
                    src={item.uploaderAvatar}
                    alt={item.uploaderName}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{item.uploaderName}</p>
                  <p className="text-sm text-gray-600">Member since {new Date(item.createdAt).getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Swap</h3>
            <textarea
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Tell the owner why you'd like to swap for this item..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapSubmit}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}