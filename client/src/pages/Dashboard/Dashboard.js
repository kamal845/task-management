import React from 'react';
import { useQuery } from 'react-query';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  Calendar,
  Target
} from 'lucide-react';
import { taskAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/UI/Card';
import { StatusBadge, PriorityBadge } from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'taskStats',
    () => taskAPI.getTaskStats(),
    {
      select: (response) => response.data.data.stats
    }
  );

  const { data: recentTasks, isLoading: tasksLoading } = useQuery(
    'recentTasks',
    () => taskAPI.getTasks({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
    {
      select: (response) => response.data.data.tasks
    }
  );

  const { data: overdueTasks, isLoading: overdueLoading } = useQuery(
    'overdueTasks',
    () => taskAPI.getOverdueTasks({ limit: 5 }),
    {
      select: (response) => response.data.data.tasks
    }
  );

  if (statsLoading || tasksLoading || overdueLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'In Progress',
      value: stats?.['in-progress'] || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <Link
          to="/tasks/new"
          className="btn btn-primary btn-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Tasks
            </CardTitle>
            <CardDescription>
              Your latest created tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks && recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{getRelativeTime(task.createdAt)}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Link
                    to="/tasks"
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    View all tasks →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tasks yet</p>
                <Link
                  to="/tasks/new"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Create your first task
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Overdue Tasks
            </CardTitle>
            <CardDescription>
              Tasks that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overdueTasks && overdueTasks.length > 0 ? (
              <div className="space-y-4">
                {overdueTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-600 font-medium">
                        Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Link
                    to="/tasks?status=overdue"
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    View all overdue tasks →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">Great job! No overdue tasks</p>
                <p className="text-sm text-gray-400">Keep up the good work</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/tasks/new"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900">Create Task</h3>
              <p className="text-sm text-gray-600">Add a new task to your list</p>
            </Link>
            
            <Link
              to="/tasks?status=pending"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Clock className="h-8 w-8 text-yellow-600 mb-2" />
              <h3 className="font-medium text-gray-900">Pending Tasks</h3>
              <p className="text-sm text-gray-600">View all pending tasks</p>
            </Link>
            
            <Link
              to="/tasks?status=completed"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckSquare className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Completed Tasks</h3>
              <p className="text-sm text-gray-600">View completed tasks</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;