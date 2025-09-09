import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Tag, Save, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { taskAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDateForInput } from '../../utils/dateUtils';
import { isValidTaskTitle, isValidTaskDescription } from '../../utils/validation';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: null,
    },
  });

  // Fetch task for editing
  const { data: taskData, isLoading: taskLoading } = useQuery(
    ['task', id],
    () => taskAPI.getTask(id),
    {
      enabled: isEdit,
      select: (res) => res.data.data.task,
      onSuccess: (task) => {
        reset({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        });
        setTags(task.tags || []);
      },
    }
  );

  // Create/Update task mutation
  const taskMutation = useMutation(
    (data) => {
      const taskData = {
        ...data,
        tags: tags,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      };
      return isEdit ? taskAPI.updateTask(id, taskData) : taskAPI.createTask(taskData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('taskStats');
        queryClient.invalidateQueries('recentTasks');
        queryClient.invalidateQueries('overdueTasks');

        toast.success(isEdit ? 'Task updated successfully' : 'Task created successfully');
        navigate('/tasks');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to save task');
      },
    }
  );

  const onSubmit = (data) => {
    taskMutation.mutate(data);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (isEdit && taskLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update your task details' : 'Add a new task to your list'}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Task' : 'New Task'}</CardTitle>
          <CardDescription>
            {isEdit ? 'Update the task information below' : 'Fill in the details to create a new task'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Title is required',
                  validate: (value) => isValidTaskTitle(value) || 'Title must be between 1 and 100 characters',
                }}
                render={({ field }) => (
                  <Input
                    label="Task Title"
                    placeholder="Enter task title"
                    error={!!errors.title}
                    errorMessage={errors.title?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  validate: (value) => isValidTaskDescription(value) || 'Description must be between 1 and 500 characters',
                })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select {...register('status')} className="input">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select {...register('priority')} className="input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <div className="relative">
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="MMM dd, yyyy"
                      minDate={new Date()}
                      placeholderText="Select due date (optional)"
                      className="input w-full"
                      showPopperArrow={false}
                    />
                  )}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500">Maximum 5 tags allowed</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/tasks')}>
                Cancel
              </Button>
              <Button type="submit" loading={taskMutation.isLoading} disabled={taskMutation.isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;
