/**
 * Learner Progress and Activity Completion Utilities
 * 
 * Stores completed activity IDs in localStorage isolated per learner
 * using the learner's unique learnerId / userId / email.
 */

export const getLearnerStorageKey = (learnerIdOrUser) => {
  if (!learnerIdOrUser) return 'learnerProgress_guest';
  if (typeof learnerIdOrUser === 'string') {
    return `learnerProgress_${learnerIdOrUser}`;
  }
  const id =
    learnerIdOrUser.learnerId ||
    learnerIdOrUser.id ||
    learnerIdOrUser._id ||
    learnerIdOrUser.email ||
    'guest';
  return `learnerProgress_${id}`;
};

export const getCompletedActivities = (learnerIdOrUser) => {
  try {
    const key = getLearnerStorageKey(learnerIdOrUser);
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed?.completedActivities) ? parsed.completedActivities : [];
  } catch {
    return [];
  }
};

export const isActivityCompleted = (learnerIdOrUser, activityId) => {
  const completed = getCompletedActivities(learnerIdOrUser);
  return completed.includes(activityId);
};

export const toggleActivityCompletion = (learnerIdOrUser, activityId) => {
  const key = getLearnerStorageKey(learnerIdOrUser);
  const completed = getCompletedActivities(learnerIdOrUser);
  let updated;

  if (completed.includes(activityId)) {
    updated = completed.filter((id) => id !== activityId);
  } else {
    updated = [...completed, activityId];
  }

  try {
    localStorage.setItem(key, JSON.stringify({ completedActivities: updated }));
  } catch (e) {
    console.error('Failed to save learner progress:', e);
  }

  return updated;
};

export const getCompletedCount = (learnerIdOrUser) => {
  return getCompletedActivities(learnerIdOrUser).length;
};
