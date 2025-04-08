import { useState, useEffect } from 'react';
import './App.css';


export default function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedPerspective, setSelectedPerspective] = useState(null);

  useEffect(() => {
    // Function to fetch and parse JSONL file
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await fetch('./data/allsides_test_lex_inf_det.jsonl'); // Adjust the path to your JSONL file
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const text = await response.text();
        
        // Parse JSONL (each line is a JSON object)
        const parsedIssues = text
          .trim()
          .split('\n')
          .map(line => JSON.parse(line));
        
        setIssues(parsedIssues);
        setLoading(false);
      } catch (err) {
        console.error("Error loading issues data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleIssueSelect = (event) => {
    const issueId = parseInt(event.target.value);
    const issue = issues.find(i => i.id === issueId);
    setSelectedIssue(issue);
    setSelectedArticle(null);
    setSelectedPerspective(null);
  };

  const handleArticleSelect = (perspective) => {
    setSelectedArticle(selectedIssue.news[perspective]);
    setSelectedPerspective(perspective);
  };

  const handleBackToIssue = () => {
    setSelectedArticle(null);
    setSelectedPerspective(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-8">Bias Aware News</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading issues data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Bias Aware News</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error loading data: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2">Please check that your JSONL file is properly formatted and accessible.</p>
          <p className="mt-2 text-sm">Try using sample data instead:
            <button 
              className="ml-2 underline text-blue-600"
              onClick={() => {
                // Load sample data if JSONL fails
                setIssues(sampleIssues);
                setError(null);
              }}
            >
              Use sample data
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Bias Aware News</h1>
      
      <div className="mb-6">
        <label htmlFor="issue-select" className="block text-lg font-medium mb-2">
          Select an Issue:
        </label>
        <select 
          id="issue-select" 
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          onChange={handleIssueSelect}
          defaultValue=""
        >
          <option value="" disabled>Choose an issue</option>
          {issues.map(issue => (
            <option key={issue.id} value={issue.id}>{issue.issue}</option>
          ))}
        </select>
      </div>
      
      {selectedIssue && !selectedArticle && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{selectedIssue.issue}</h2>
          
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h3 className="text-xl font-semibold mb-2">Roundup</h3>
            <ul className="list-disc pl-5">
              {selectedIssue.roundup.map((point, idx) => (
                <li key={idx} className="mb-1">{point}</li>
              ))}
            </ul>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Perspectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="border rounded-md p-4 shadow hover:shadow-md transition cursor-pointer bg-blue-50"
              onClick={() => handleArticleSelect('left')}
            >
              <h4 className="text-lg font-bold mb-1">From the Left</h4>
              <p className="text-lg mb-1 font-medium">{selectedIssue.news.left.newsTitle}</p>
              <p className="text-sm text-gray-600">Source: {selectedIssue.news.left.newsSource}</p>
            </div>
            
            <div 
              className="border rounded-md p-4 shadow hover:shadow-md transition cursor-pointer bg-purple-50"
              onClick={() => handleArticleSelect('center')}
            >
              <h4 className="text-lg font-bold mb-1">From the Center</h4>
              <p className="text-lg mb-1 font-medium">{selectedIssue.news.center.newsTitle}</p>
              <p className="text-sm text-gray-600">Source: {selectedIssue.news.center.newsSource}</p>
            </div>
            
            <div 
              className="border rounded-md p-4 shadow hover:shadow-md transition cursor-pointer bg-red-50"
              onClick={() => handleArticleSelect('right')}
            >
              <h4 className="text-lg font-bold mb-1">From the Right</h4>
              <p className="text-lg mb-1 font-medium">{selectedIssue.news.right.newsTitle}</p>
              <p className="text-sm text-gray-600">Source: {selectedIssue.news.right.newsSource}</p>
            </div>
          </div>
        </div>
      )}
      
      {selectedArticle && (
        <div className="mt-6">
          <button 
            className="mb-4 px-4 py-2 rounded bg-white hover:bg-white transition"
            onClick={handleBackToIssue}
          >
            ← Back to Issue
          </button>
          
          <div className="bg-white border rounded-lg shadow-md overflow-hidden">
            <img 
              src={selectedArticle.topImage} 
              alt={selectedArticle.newsTitle}
              className="w-full h-auto object-cover"
            />
            
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedPerspective === 'left' ? 'bg-blue-100 text-blue-800' : 
                    selectedPerspective === 'center' ? 'bg-purple-100 text-purple-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedPerspective === 'left' ? 'Left Perspective' : 
                     selectedPerspective === 'center' ? 'Center Perspective' : 
                     'Right Perspective'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">Source: {selectedArticle.newsSource}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{selectedArticle.newsTitle}</h2>
              
              <div className="space-y-4">
                {selectedArticle.newsContent.map((paragraph, idx) => (
                  <div key={idx} className="relative">
                    <p 
                      className={`mb-1 text-left ${
                        (selectedArticle.lex[idx] === 1 || selectedArticle.inf[idx] === 1) 
                          ? 'border-l-4 pl-3' : ''
                      } ${
                        selectedArticle.lex[idx] === 1 ? 'border-yellow-400' : 
                        selectedArticle.inf[idx] === 1 ? 'border-red-400' : ''
                      }`}
                    >
                      {paragraph}
                    </p>

                    {(selectedArticle.lex[idx] === 1 || selectedArticle.inf[idx] === 1) && (
                      <div className="text-xs mt-1 flex gap-2 justify-start">
                        {selectedArticle.lex[idx] === 1 && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Lexical Bias
                          </span>
                        )}
                        {selectedArticle.inf[idx] === 1 && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Informational Bias
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <a 
                  href={selectedArticle.newsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Read the original article →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback sample data in case the JSONL file can't be loaded
const sampleIssues = [
  {
    id: 1,
    issue: "Climate Change Policy",
    roundup: [
      "Global leaders continue to debate climate policy measures.",
      "Recent proposals focus on carbon pricing and renewable energy subsidies.",
      "Implementation timelines remain contentious across political spectrums."
    ],
    news: {
      left: {
        newsContent: [
          "Climate scientists warn that immediate action is necessary to prevent catastrophic warming.",
          "Progressive lawmakers propose ambitious Green New Deal legislation.",
          "Environmental activists criticized the administration's policies as insufficient."
        ],
        lex: [1, 1, 0],
        inf: [0, 0, 1],
        topImage: "/api/placeholder/600/400",
        newsSource: "Progressive Daily",
        newsTitle: "Climate Crisis Demands Immediate Action",
        newsLink: "https://example.com/climate-left"
      },
      center: {
        newsContent: [
          "Recent climate data shows warming trends continuing at projected rates.",
          "Experts suggest balanced approach combining regulation and market incentives.",
          "Economic analysis indicates transition costs can be managed with proper planning."
        ],
        lex: [0, 0, 0],
        inf: [0, 0, 0],
        topImage: "/api/placeholder/600/400",
        newsSource: "Centrist Times",
        newsTitle: "Analysis: Balancing Climate Action and Economic Growth",
        newsLink: "https://example.com/climate-center"
      },
      right: {
        newsContent: [
          "New regulations would impose significant costs on energy producers.",
          "Business leaders express concerns about economic impact of climate proposals.",
          "Alternative approach focuses on innovation rather than government mandates."
        ],
        lex: [0, 0, 1],
        inf: [1, 0, 0],
        topImage: "/api/placeholder/600/400",
        newsSource: "Business Perspective",
        newsTitle: "Climate Regulations Threaten Economic Recovery",
        newsLink: "https://example.com/climate-right"
      }
    }
  },
  {
    id: 2,
    issue: "Healthcare Reform",
    roundup: [
      "Healthcare remains a divisive political issue in legislature.",
      "Proposals range from universal coverage to market-based solutions.",
      "Rising costs continue to drive debate on systemic reforms."
    ],
    news: {
      left: {
        newsContent: [
          "Universal healthcare would save lives and reduce inequality.",
          "Families struggle with medical debt under current system.",
          "Progressive lawmakers introduce Medicare for All bill."
        ],
        lex: [1, 0, 0],
        inf: [1, 0, 0],
        topImage: "/api/placeholder/600/400",
        newsSource: "People's Voice",
        newsTitle: "Universal Healthcare: A Basic Human Right",
        newsLink: "https://example.com/healthcare-left"
      },
      center: {
        newsContent: [
          "Healthcare spending continues to grow faster than inflation.",
          "Experts analyze costs and benefits of competing healthcare models.",
          "Polling shows Americans divided on preferred healthcare approach."
        ],
        lex: [0, 0, 0],
        inf: [0, 0, 0],
        topImage: "/api/placeholder/600/400",
        newsSource: "News Central",
        newsTitle: "Comparing Healthcare Reform Options",
        newsLink: "https://example.com/healthcare-center"
      },
      right: {
        newsContent: [
          "Market-based solutions would increase choice and reduce costs.",
          "Government-run healthcare threatens innovation and quality.",
          "Tax implications of expanded coverage raise fiscal concerns."
        ],
        lex: [0, 1, 0],
        inf: [1, 1, 0],
        topImage: "/api/placeholder/600/400",
        newsSource: "Freedom Review",
        newsTitle: "Free Market Solutions for Healthcare Crisis",
        newsLink: "https://example.com/healthcare-right"
      }
    }
  }
];