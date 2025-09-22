import React, { useState, useEffect } from 'react';
import { FileText, Upload, Search, Tag, TrendingUp, Clock, Users, BarChart3 } from 'lucide-react';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    recentUploads: 0,
    uniqueTags: 0,
    activeUsers: 0,
  });

  const [recentDocuments, setRecentDocuments] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('https://apis.allsoft.co/api/documentManagement/searchDocumentEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          major_head: '',
          minor_head: '',
          from_date: '',
          to_date: '',
          tags: [],
          uploaded_by: '',
          start: 0,
          length: 5,
          filterId: '',
          search: { value: '' }
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.data) {
        setRecentDocuments(data.data);
        setStats(prev => ({
          ...prev,
          totalDocuments: data.recordsTotal || 0,
          recentUploads: data.data.length,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your document management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          title="Total Documents"
          value={stats.totalDocuments}
          color="bg-blue-500"
        />
        <StatCard
          icon={Upload}
          title="Recent Uploads"
          value={stats.recentUploads}
          color="bg-green-500"
        />
        <StatCard
          icon={Tag}
          title="Unique Tags"
          value={stats.uniqueTags}
          color="bg-purple-500"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={stats.activeUsers}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            Upload Document
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Search className="w-5 h-5 mr-2" />
            Search Documents
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
        </div>
        
        <div className="p-6">
          {recentDocuments.length > 0 ? (
            <div className="space-y-4">
              {recentDocuments.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {doc.major_head} - {doc.minor_head}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {doc.document_remarks || 'No description'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {doc.document_date || 'No date'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {doc.tags && doc.tags.slice(0, 2).map((tag: any, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;