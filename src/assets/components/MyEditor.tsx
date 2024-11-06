import { useState, useEffect } from 'react';
import { Editor, EditorState, CompositeDecorator } from 'draft-js'; 
import 'draft-js/dist/Draft.css';

const getDecorator = () =>
  new CompositeDecorator([
    {
      strategy: (ContentBlock: any, callback: Function) => {
        const text = ContentBlock.getText();
        if (text.startsWith('# ')) {
          callback(0, text.length);
        }
      },
      component: ({ children }: { children: React.ReactNode }) => (
        <h1 className="text-3xl font-bold">{children}</h1>
      ),
    },
    {
      strategy: (ContentBlock: any, callback: Function) => {
        const text = ContentBlock.getText();
        if (text.startsWith('* ')) {
          callback(0, text.length);
        }
      },
      component: ({ children }: { children: React.ReactNode }) => (
        <span className="font-bold">{children}</span>
      ),
    },
    {
      strategy: (ContentBlock: any, callback: Function) => {
        const text = ContentBlock.getText();
        if (text.startsWith('** ')) {
          callback(0, text.length);
        }
      },
      component: ({ children }: { children: React.ReactNode }) => (
        <span className="text-red-500">{children}</span>
      ),
    },
    {
      strategy: (ContentBlock: any, callback: Function) => {
        const text = ContentBlock.getText();
        if (text.startsWith('*** ')) {
          callback(0, text.length);
        }
      },
      component: ({ children }: { children: React.ReactNode }) => (
        <span className="underline">{children}</span>
      ),
    },
  ]);

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(getDecorator())
  );
  const [savedContent, setSavedContent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedData = JSON.parse(localStorage.getItem('editorContent') || '[]');
      if (Array.isArray(savedData)) {
        const parsedData = savedData.map((text: string) => parseText(text));
        setSavedContent(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved data from localStorage:', error);
    }
  }, []);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const formattedText = parseText(plainText);

    try {
      const existingContent = JSON.parse(localStorage.getItem('editorContent') || '[]');
      const updatedContent = [...existingContent, plainText];
      localStorage.setItem('editorContent', JSON.stringify(updatedContent));

      setSavedContent((prevContent) => [...prevContent, formattedText]);
      setEditorState(EditorState.createEmpty(getDecorator()));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  const parseText = (text: string): string => {
    let formattedText = text;
    formattedText = formattedText.replace(
      /^#(.*$)/gm,
      '<h1 class="text-4xl font-bold">$1</h1>'
    );
    formattedText = formattedText.replace(
      /^\*([\w\s]+)/,
      '<span class="font-bold">$1</span>'
    );
    formattedText = formattedText.replace(
      /^\*\*\s(.*$)/gm,
      '<span class="text-red-500">$1</span>'
    );
    formattedText = formattedText.replace(
      /^\*\*\*\s(.*$)/gm,
      '<span class="underline">$1</span>'
    );
    return formattedText;
  };

  const handleEditorChange = (newState: any) => {
    setEditorState(newState);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-4">
        Demo editor by Mohammad Tarique;
      </h1>
      <div className="w-full max-w-5xl border border-gray-300 rounded-lg py-5 px-3 bg-white shadow-md text-center">
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Type Something..."
        />
      </div>

      <button
        onClick={saveContent}
        className="mb-4 mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
      >
        Save
      </button>

      <div className="mt-8 w-full max-w-4xl p-4 bg-gray-100 rounded-lg">
        {savedContent.map((content, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: content }}
            className="mb-4"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MyEditor;



// import { useState, useEffect } from 'react';
// import {
//   Editor,
//   EditorState,
//   CompositeDecorator,
// } from 'draft-js';
// import 'draft-js/dist/Draft.css';

// const getDecorator = () =>
//   new CompositeDecorator([
//     {
//       strategy: (contentBlock, callback) => {
//         const text = contentBlock.getText();
//         if (text.startsWith('# ')) {
//           callback(0, text.length);
//         }
//       },
//       component: ({ children }) => (
//         <h1 className="text-3xl font-bold">{children}</h1>
//       ),
//     },
//     {
//       strategy: (contentBlock, callback) => {
//         const text = contentBlock.getText();
//         if (text.startsWith('* ')) {
//           callback(0, text.length);
//         }
//       },
//       component: ({ children }) => (
//         <span className="font-bold">{children}</span>
//       ),
//     },
//     {
//       strategy: (contentBlock, callback) => {
//         const text = contentBlock.getText();
//         if (text.startsWith('** ')) {
//           callback(0, text.length);
//         }
//       },
//       component: ({ children }) => (
//         <span className="text-red-500">{children}</span>
//       ),
//     },
//     {
//       strategy: (contentBlock, callback) => {
//         const text = contentBlock.getText();
//         if (text.startsWith('*** ')) {
//           callback(0, text.length);
//         }
//       },
//       component: ({ children }) => (
//         <span className="underline">{children}</span>
//       ),
//     },
//   ]);

// const MyEditor = () => {
//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty(getDecorator())
//   );
//   const [savedContent, setSavedContent] = useState([]);

//   useEffect(() => {
//     try {
//       const savedData = JSON.parse(localStorage.getItem('editorContent')) || [];
//       if (Array.isArray(savedData)) {
//         const parsedData = savedData.map((text) => parseText(text));
//         setSavedContent(parsedData);
//       }
//     } catch (error) {
//       console.error('Error loading saved data from localStorage:', error);
//     }
//   }, []);

//   const saveContent = () => {
//     const contentState = editorState.getCurrentContent();
//     const plainText = contentState.getPlainText();
//     const formattedText = parseText(plainText);

//     try {
//       const existingContent =
//         JSON.parse(localStorage.getItem('editorContent')) || [];

//       const updatedContent = Array.isArray(existingContent)
//         ? [...existingContent, plainText]
//         : [plainText];

//       localStorage.setItem('editorContent', JSON.stringify(updatedContent));

//       setSavedContent((prevContent) => [...prevContent, formattedText]);

//       setEditorState(EditorState.createEmpty(getDecorator()));
//     } catch (error) {
//       console.error('Error saving data to localStorage:', error);
//     }
//   };

//   const parseText = (text) => {
//     let formattedText = text;
//     formattedText = formattedText.replace(
//       /^#(.*$)/gm,
//       '<h1 class="text-4xl font-bold">$1</h1>'
//     );
//     formattedText = formattedText.replace(
//       /^\*([\w\s]+)/,
//       '<span class="font-bold">$1</span>'
//     );
//     formattedText = formattedText.replace(
//       /^\*\*\s(.*$)/gm,
//       '<span class="text-red-500">$1</span>'
//     );
//     formattedText = formattedText.replace(
//       /^\*\*\*\s(.*$)/gm,
//       '<span class="underline">$1</span>'
//     );
//     return formattedText;
//   };

//   const handleEditorChange = (newState) => {
//     setEditorState(newState);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-xl font-bold mb-4">
//         Demo editor by Mohammad Tarique;
//       </h1>
//       <div className="w-full max-w-5xl border border-gray-300 rounded-lg py-5 px-3 bg-white shadow-md text-center">
//         <Editor
//           editorState={editorState}
//           onChange={handleEditorChange}
//           placeholder="Type Something..."
//         />
//       </div>

//       <button
//         onClick={saveContent}
//         className="mb-4 mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
//       >
//         Save
//       </button>

//       <div className="mt-8 w-full max-w-4xl p-4 bg-gray-100 rounded-lg">
//         {savedContent.map((content, index) => (
//           <div
//             key={index}
//             dangerouslySetInnerHTML={{ __html: content }}
//             className="mb-4"
//           ></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyEditor;
