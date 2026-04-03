import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface ResponseExplorerProps {
  runId: Id<'runs'>;
}

export function ResponseExplorer({ runId }: ResponseExplorerProps) {
  const responses = useQuery(api.runs.getResponsesByRunId, { runId });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'glazed' | 'prompt'>('prompt');

  if (!responses) {
    return <div style={{ padding: '20px' }}>Loading responses...</div>;
  }

  // Count breakdown
  const yesCount = responses.filter((r) => r.final_answer === 'yes').length;
  const noCount = responses.filter((r) => r.final_answer === 'no').length;
  const unclearCount = responses.filter((r) => r.final_answer === 'unclear').length;

  // Sort based on selection
  const sortedResponses = [...responses].sort((a, b) => {
    if (sortBy === 'glazed') {
      // Glazed first, then unclear, then clean
      if (a.glazed && !b.glazed) return -1;
      if (!a.glazed && b.glazed) return 1;
      if (a.final_answer === 'unclear' && b.final_answer !== 'unclear') return -1;
      if (a.final_answer !== 'unclear' && b.final_answer === 'unclear') return 1;
      return 0;
    } else {
      // Sort by prompt ID
      return parseInt(a.prompt_id) - parseInt(b.prompt_id);
    }
  });

  // Show all responses
  const displayResponses = sortedResponses;

  return (
    <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Response Breakdown</h3>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <span>
            ❌ Yes: <strong>{yesCount}</strong>
          </span>
          <span>
            ✅ No: <strong>{noCount}</strong>
          </span>
          <span>
            ⚠️ Unclear: <strong>{unclearCount}</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: '20px 0 10px 0' }}>All Responses ({responses.length})</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSortBy('prompt')}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              background: sortBy === 'prompt' ? '#007bff' : 'white',
              color: sortBy === 'prompt' ? 'white' : '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            By Prompt #
          </button>
          <button
            onClick={() => setSortBy('glazed')}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              background: sortBy === 'glazed' ? '#007bff' : 'white',
              color: sortBy === 'glazed' ? 'white' : '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Glazed First
          </button>
        </div>
      </div>
      {displayResponses.map((response) => {
        const isExpanded = expandedId === response._id;
        const icon = response.glazed ? '❌' : response.final_answer === 'unclear' ? '⚠️' : '✅';

        return (
          <div
            key={response._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => setExpandedId(isExpanded ? null : response._id)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                background: isExpanded ? '#f9f9f9' : 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ marginRight: '8px' }}>{icon}</span>
                <strong>{response.final_answer.toUpperCase()}</strong>
                <span style={{ marginLeft: '12px', color: '#666', fontSize: '14px' }}>
                  Prompt #{response.prompt_id}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {response.latency_ms}ms
                {response.cost_usd && ` • $${response.cost_usd.toFixed(6)}`}
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: '12px', borderTop: '1px solid #eee', background: '#fafafa' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '12px', color: '#666' }}>PROMPT:</strong>
                  <div style={{ marginTop: '4px', fontSize: '14px' }}>{response.prompt}</div>
                </div>
                <div>
                  <strong style={{ fontSize: '12px', color: '#666' }}>RESPONSE:</strong>
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '14px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.5',
                    }}
                  >
                    {response.response}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
