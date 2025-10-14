type StorageSchema = {
  root: {
    version: 1;
    windowOrder: ['W1', 'W3', 'W2'];
    windows: {
      W1: {
        id: 'window1ID';
        color: 'blue';
        name?: 'PythonDev';
        keywordsOrder: ['kw1', 'kw3', 'kw2'];
        keywords: {
          kw1: { id: 'kw1ID'; text: 'python'; done: false };
          kw2: { id: 'kw2ID'; text: 'typescript'; done: true };
          kw3: { id: 'kw3ID'; text: 'java'; done: true };
        };
      };
      W2: {
        id: 'window2ID';
        color: 'blue';
        name?: 'JavaDev';
        keywordsOrder: ['kw1', 'kw3', 'kw2'];
        keywords: {
          kw1: { id: 'kw1ID'; text: 'python'; done: false };
          kw2: { id: 'kw2ID'; text: 'typescript'; done: true };
          kw3: { id: 'kw3ID'; text: 'java'; done: true };
        };
      };
      W3: {
        id: 'window3ID';
        color: 'blue';
        name?: string;
        keywordsOrder: string[];
        keywords: {};
      };
    };
  };
};
