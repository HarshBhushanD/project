import React, { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Terminal, Braces } from 'lucide-react';
import Navbar from './navbar';

const LANGUAGES = [
  { id: 71, name: 'Python (3.8.1)', monaco: 'python', template: 'print("Hello, World!")' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)', monaco: 'javascript', template: 'console.log("Hello, World!");' },
  { id: 54, name: 'C++ (GCC 9.2.0)', monaco: 'cpp', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)', monaco: 'java', template: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
];

const JUDGE0_HOST = process.env.REACT_APP_JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.REACT_APP_JUDGE0_API_KEY;

const CompilerPage = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState(71);
  const [sourceCode, setSourceCode] = useState(LANGUAGES[0].template);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const selectedLanguage = useMemo(
    () => LANGUAGES.find((l) => l.id === selectedLanguageId) || LANGUAGES[0],
    [selectedLanguageId]
  );

  const handleLanguageChange = (languageId) => {
    const nextId = Number(languageId);
    const language = LANGUAGES.find((l) => l.id === nextId);
    setSelectedLanguageId(nextId);
    if (language) {
      setSourceCode(language.template);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');

    if (!JUDGE0_KEY) {
      setError('Missing Judge0 API key. Set REACT_APP_JUDGE0_API_KEY in your .env file.');
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch(`https://${JUDGE0_HOST}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_KEY,
          'X-RapidAPI-Host': JUDGE0_HOST,
        },
        body: JSON.stringify({
          language_id: selectedLanguageId,
          source_code: sourceCode,
          stdin,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || 'Failed to run code');
      }

      const finalOutput =
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        result.message ||
        'No output';
      setOutput(finalOutput);
    } catch (err) {
      setError(err.message || 'Something went wrong while running code.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="ui-page-main min-h-screen">
      <Navbar />
      <div className="ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="ui-card overflow-hidden p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <Braces className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">IDE</p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Online compiler</h1>
                  <p className="mt-1 text-sm text-slate-600">Run snippets in the browser</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedLanguageId}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="ui-input min-w-[200px] py-2 text-sm"
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="ui-btn-primary gap-2 px-5 disabled:opacity-60"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Run code
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-inner">
              <Editor
                height="420px"
                language={selectedLanguage.monaco}
                value={sourceCode}
                onChange={(value) => setSourceCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="ui-card p-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <Terminal className="h-4 w-4 text-indigo-500" />
                Input (stdin)
              </h2>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Write input for your program here..."
                className="ui-input min-h-[160px] resize-y font-mono text-sm"
              />
            </div>

            <div className="ui-card p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Output</h2>
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 whitespace-pre-wrap">
                  {error}
                </div>
              ) : (
                <pre className="min-h-[160px] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-emerald-300 whitespace-pre-wrap">
                  {output || 'Run your code to see output...'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
