import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ResponseExplorer } from './ResponseExplorer';
import { InfoPopover } from './InfoPopover';
import { logoUrl } from '../utils/providers';
import { format } from 'date-fns';

type Tab = 'glaze' | 'speed' | 'cost';

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>('glaze');
  const [selectedRunId, setSelectedRunId] = useState<Id<'runs'> | null>(null);
  const runs = useQuery(api.runs.getLeaderboard);

  if (!runs) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (runs.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        No benchmark runs yet. Run <code>npm run bench &lt;model-id&gt;</code> to get started.
      </div>
    );
  }

  // Sort based on active tab
  const sortedRuns = [...runs].sort((a, b) => {
    if (activeTab === 'glaze') {
      return (a.glaze_rate ?? 100) - (b.glaze_rate ?? 100);
    } else if (activeTab === 'speed') {
      return (a.avg_latency_ms ?? Infinity) - (b.avg_latency_ms ?? Infinity);
    } else {
      return (a.total_cost_usd ?? Infinity) - (b.total_cost_usd ?? Infinity);
    }
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'glaze', label: 'Glaze' },
    { key: 'speed', label: 'Speed' },
    { key: 'cost', label: 'Cost' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #eee',
          marginBottom: '20px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #007bff' : 'none',
              marginBottom: '-2px',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              color: activeTab === tab.key ? '#007bff' : '#666',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '12px', width: '60px' }}>Rank</th>
            <th style={{ padding: '12px' }}>Model</th>
            <th style={{ padding: '12px', width: '150px' }}>
              Glaze Rate <InfoPopover />
            </th>
            <th style={{ padding: '12px', width: '120px' }}>Cost</th>
            <th style={{ padding: '12px', width: '120px' }}>Speed</th>
            <th style={{ padding: '12px', width: '140px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedRuns.map((run, index) => {
            const isSelected = selectedRunId === run._id;
            const logo = logoUrl(run.model);

            return (
              <>
                <tr
                  key={run._id}
                  onClick={() => setSelectedRunId(isSelected ? null : run._id)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? '#f0f8ff' : index % 2 === 0 ? '#fafafa' : 'white',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>#{index + 1}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {logo && (
                        <img
                          src={logo}
                          alt=""
                          style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                        />
                      )}
                      <span>{run.model}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '8px',
                          background: '#eee',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${run.glaze_rate ?? 0}%`,
                            height: '100%',
                            background:
                              (run.glaze_rate ?? 0) < 30
                                ? '#10b981'
                                : (run.glaze_rate ?? 0) < 60
                                  ? '#f59e0b'
                                  : '#ef4444',
                          }}
                        />
                      </div>
                      <strong>{run.glaze_rate?.toFixed(1)}%</strong>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>${run.total_cost_usd?.toFixed(4) ?? '—'}</td>
                  <td style={{ padding: '12px' }}>{run.avg_latency_ms?.toFixed(0)}ms</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                    {format(new Date(run.run_date), 'MMM d, yyyy')}
                  </td>
                </tr>
                {isSelected && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <ResponseExplorer runId={run._id} />
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
