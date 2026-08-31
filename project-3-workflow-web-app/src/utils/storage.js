const STORAGE_KEY = 'workflow_data_project3';

export const saveWorkflow = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Error saving workflow:', error);
    return false;
  }
};

export const loadWorkflow = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Error loading workflow:', error);
    return null;
  }
};

export const clearWorkflowStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing workflow storage:', error);
    return false;
  }
};

export const exportWorkflow = (data) => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name || 'workflow'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting workflow:', error);
    return false;
  }
};

export const importWorkflow = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        // Validate structure
        if (!data.nodes || !data.edges) {
          reject(new Error('Invalid workflow file: missing nodes or edges'));
        }
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON format: ' + error.message));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
};