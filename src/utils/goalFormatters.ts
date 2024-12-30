import { Goal } from '../types/goals';

export function formatGoalForDb(goal: Partial<Goal>, existingGoal?: Goal) {
  const formatted: any = { ...goal };
  
  // Convert camelCase to snake_case
  if ('userId' in formatted) {
    formatted.user_id = formatted.userId;
    delete formatted.userId;
  }
  
  if ('monthlyProgress' in formatted) {
    formatted.monthly_progress = formatted.monthlyProgress;
    delete formatted.monthlyProgress;
  }

  if ('createdAt' in formatted) {
    formatted.created_at = formatted.createdAt;
    delete formatted.createdAt;
  }

  if ('updatedAt' in formatted) {
    formatted.updated_at = formatted.updatedAt;
    delete formatted.updatedAt;
  }

  if ('trackingType' in formatted) {
    formatted.tracking_type = formatted.trackingType;
    delete formatted.trackingType;
  }

  // For partial updates, use the existing goal's type
  const goalType = formatted.type || existingGoal?.type;

  // Only apply type-specific formatting if we have a type
  if (goalType) {
    switch (goalType) {
      case 'quantifiable':
        // For updates to quantifiable goals, only set defaults for new fields
        if ('progress' in formatted) formatted.progress = formatted.progress ?? 0;
        if ('target' in formatted) formatted.target = formatted.target ?? 0;
        if ('tracking_type' in formatted) formatted.tracking_type = formatted.tracking_type ?? 'slider';
        if ('items' in formatted) formatted.items = formatted.items ?? [];
        // Remove fields that don't belong
        delete formatted.completed;
        delete formatted.monthly_progress;
        break;

      case 'monthly':
        // For monthly goals, only handle monthly_progress updates
        if ('monthly_progress' in formatted) {
          formatted.monthly_progress = formatted.monthly_progress ?? {};
        }
        // Remove fields that don't belong to monthly goals
        delete formatted.progress;
        delete formatted.target;
        delete formatted.items;
        delete formatted.tracking_type;
        delete formatted.completed;
        break;

      case 'simple':
        // For simple goals, only handle completed updates
        if ('completed' in formatted) {
          formatted.completed = formatted.completed ?? false;
        }
        // Remove fields that don't belong to simple goals
        delete formatted.progress;
        delete formatted.target;
        delete formatted.items;
        delete formatted.tracking_type;
        delete formatted.monthly_progress;
        break;

      default:
        console.error('Invalid goal type:', goalType);
        throw new Error('Invalid goal type');
    }
  }
  
  return formatted;
}

export function formatGoalFromDb(goal: any): Goal {
  const formatted: any = { ...goal };
  
  // Convert snake_case to camelCase
  if ('user_id' in formatted) {
    formatted.userId = formatted.user_id;
    delete formatted.user_id;
  }
  
  if ('monthly_progress' in formatted) {
    formatted.monthlyProgress = formatted.monthly_progress;
    delete formatted.monthly_progress;
  }

  if ('created_at' in formatted) {
    formatted.createdAt = formatted.created_at;
    delete formatted.created_at;
  }

  if ('updated_at' in formatted) {
    formatted.updatedAt = formatted.updated_at;
    delete formatted.updated_at;
  }

  if ('tracking_type' in formatted) {
    formatted.trackingType = formatted.tracking_type;
    delete formatted.tracking_type;
  }

  // Handle each goal type according to database constraints
  switch (formatted.type) {
    case 'quantifiable':
      // Required fields for quantifiable goals
      formatted.progress = formatted.progress ?? 0;
      formatted.target = formatted.target ?? 0;
      formatted.trackingType = formatted.trackingType ?? 'slider';
      formatted.items = formatted.items ?? [];
      // Remove fields that don't belong
      delete formatted.completed;
      delete formatted.monthlyProgress;
      break;

    case 'monthly':
      // Monthly goals should not have these fields
      delete formatted.progress;
      delete formatted.target;
      delete formatted.items;
      delete formatted.trackingType;
      delete formatted.completed;
      // Required fields for monthly goals
      formatted.monthlyProgress = formatted.monthlyProgress ?? {};
      break;

    case 'simple':
      // Simple goals should not have these fields
      delete formatted.progress;
      delete formatted.target;
      delete formatted.items;
      delete formatted.trackingType;
      delete formatted.monthlyProgress;
      // Required fields for simple goals
      formatted.completed = formatted.completed ?? false;
      break;

    default:
      console.error('Invalid goal type:', formatted.type);
      throw new Error('Invalid goal type');
  }
  
  return formatted as Goal;
}
